-- Reserve an upper-bound amount before provider work so concurrent cache misses
-- cannot all pass the monthly budget check before their costs are recorded.
-- Reservations are short-lived and are released after the request settles.

create table if not exists public.ai_budget_reservations (
  id                  uuid primary key default uuid_generate_v4(),
  user_id             uuid not null references auth.users(id) on delete cascade,
  reserved_usd        numeric(12, 8) not null check (reserved_usd > 0),
  status              text not null default 'reserved'
    check (status in ('reserved', 'released')),
  expires_at          timestamptz not null,
  created_at          timestamptz not null default now()
);

create index if not exists ai_budget_reservations_user_status_idx
  on public.ai_budget_reservations (user_id, status, expires_at);

alter table public.ai_budget_reservations enable row level security;
revoke all on table public.ai_budget_reservations from public, anon, authenticated;
grant select, insert, update on table public.ai_budget_reservations to service_role;

create or replace function public.reserve_ai_budget(
  p_user_id uuid,
  p_reservation_usd numeric,
  p_monthly_budget_usd numeric
)
returns table (
  allowed boolean,
  reservation_id uuid,
  current_spend_usd numeric,
  monthly_budget_usd numeric
)
language plpgsql
security definer
set search_path = public
as $$
declare
  reservation_id_value uuid;
  current_spend numeric := 0;
  reservation_amount numeric := greatest(coalesce(p_reservation_usd, 0), 0);
  monthly_budget numeric := greatest(coalesce(p_monthly_budget_usd, 0), 0);
begin
  -- Serialize budget decisions for one user without holding a lock across the
  -- provider request itself. The reservation row carries the lock's intent.
  perform pg_advisory_xact_lock(hashtext(p_user_id::text));

  delete from public.ai_budget_reservations
  where user_id = p_user_id
    and (status = 'released' or expires_at <= now());

  select coalesce(sum(m.cost_usd), 0)::numeric
  into current_spend
  from public.messages m
  join public.conversations c on c.id = m.conversation_id
  where c.user_id = p_user_id
    and m.role = 'assistant'
    and m.created_at >= date_trunc('month', now())
    and m.cost_usd is not null;

  select current_spend + coalesce(sum(l.cost_usd), 0)::numeric
  into current_spend
  from public.cost_log l
  where l.user_id = p_user_id
    and l.purpose <> 'main_answer'
    and l.created_at >= date_trunc('month', now());

  select current_spend + coalesce(sum(r.reserved_usd), 0)::numeric
  into current_spend
  from public.ai_budget_reservations r
  where r.user_id = p_user_id
    and r.status = 'reserved'
    and r.expires_at > now();

  if monthly_budget > 0 and (current_spend + reservation_amount) >= monthly_budget then
    return query select false, null::uuid, current_spend, monthly_budget;
    return;
  end if;

  if monthly_budget <= 0 then
    return query select true, null::uuid, current_spend, monthly_budget;
    return;
  end if;

  if reservation_amount <= 0 then
    return query select true, null::uuid, current_spend, monthly_budget;
    return;
  end if;

  insert into public.ai_budget_reservations (user_id, reserved_usd, expires_at)
  values (p_user_id, reservation_amount, now() + interval '10 minutes')
  returning id into reservation_id_value;

  return query select true, reservation_id_value, current_spend, monthly_budget;
end;
$$;

create or replace function public.release_ai_budget_reservation(p_reservation_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.ai_budget_reservations
  where id = p_reservation_id and status = 'reserved';
  return found;
end;
$$;

-- Include active reservations in admin/budget reporting while they are held.
create or replace function public.check_ai_monthly_budget(
  p_user_id uuid,
  p_monthly_budget_usd numeric default 0
)
returns table (
  allowed boolean,
  current_spend_usd numeric,
  monthly_budget_usd numeric
)
language sql
stable
security definer
set search_path = public
as $$
  with message_spend as (
    select coalesce(sum(m.cost_usd), 0)::numeric as amount
    from public.messages m
    join public.conversations c on c.id = m.conversation_id
    where c.user_id = p_user_id
      and m.role = 'assistant'
      and m.created_at >= date_trunc('month', now())
      and m.cost_usd is not null
  ), ancillary_spend as (
    select coalesce(sum(l.cost_usd), 0)::numeric as amount
    from public.cost_log l
    where l.user_id = p_user_id
      and l.purpose <> 'main_answer'
      and l.created_at >= date_trunc('month', now())
  ), reservation_spend as (
    select coalesce(sum(r.reserved_usd), 0)::numeric as amount
    from public.ai_budget_reservations r
    where r.user_id = p_user_id
      and r.status = 'reserved'
      and r.expires_at > now()
  ), spend as (
    select message_spend.amount + ancillary_spend.amount + reservation_spend.amount
      as current_spend_usd
    from message_spend, ancillary_spend, reservation_spend
  )
  select
    p_monthly_budget_usd <= 0 or spend.current_spend_usd < p_monthly_budget_usd,
    spend.current_spend_usd,
    greatest(0, coalesce(p_monthly_budget_usd, 0))
  from spend;
$$;

revoke all on function public.reserve_ai_budget(uuid, numeric, numeric) from public;
revoke all on function public.release_ai_budget_reservation(uuid) from public;
grant execute on function public.reserve_ai_budget(uuid, numeric, numeric) to service_role;
grant execute on function public.release_ai_budget_reservation(uuid) to service_role;

-- Down:
--   recreate public.check_ai_monthly_budget(uuid, numeric) from the previous migration;
--   drop function if exists public.release_ai_budget_reservation(uuid);
--   drop function if exists public.reserve_ai_budget(uuid, numeric, numeric);
--   drop table if exists public.ai_budget_reservations;
