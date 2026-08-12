-- Make the configured LLM_MONTHLY_BUDGET_USD a project-wide circuit breaker.
-- The previous reservation functions summed spend per user, which allowed
-- aggregate provider spend to exceed the configured budget as more users
-- arrived. A single transaction advisory lock serializes reservations while
-- the sums cover every user in the project.

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
  -- The budget is project-wide, so serialize all reservation decisions with
  -- one stable lock rather than one lock per user.
  perform pg_advisory_xact_lock(hashtext('dharma_daily_ai_budget'));

  delete from public.ai_budget_reservations
  where status = 'released'
    or expires_at <= now();

  select coalesce(sum(m.cost_usd), 0)::numeric
  into current_spend
  from public.messages m
  where m.role = 'assistant'
    and m.created_at >= date_trunc('month', now())
    and m.cost_usd is not null;

  select current_spend + coalesce(sum(l.cost_usd), 0)::numeric
  into current_spend
  from public.cost_log l
  where l.created_at >= date_trunc('month', now());

  select current_spend + coalesce(sum(r.reserved_usd), 0)::numeric
  into current_spend
  from public.ai_budget_reservations r
  where r.status = 'reserved'
    and r.expires_at > now();

  if monthly_budget > 0 and (current_spend + reservation_amount) >= monthly_budget then
    return query select false, null::uuid, current_spend, monthly_budget;
    return;
  end if;

  if monthly_budget <= 0 or reservation_amount <= 0 then
    return query select true, null::uuid, current_spend, monthly_budget;
    return;
  end if;

  insert into public.ai_budget_reservations (user_id, reserved_usd, expires_at)
  values (p_user_id, reservation_amount, now() + interval '10 minutes')
  returning id into reservation_id_value;

  return query select true, reservation_id_value, current_spend, monthly_budget;
end;
$$;

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
    where m.role = 'assistant'
      and m.created_at >= date_trunc('month', now())
      and m.cost_usd is not null
  ), ancillary_spend as (
    select coalesce(sum(l.cost_usd), 0)::numeric as amount
    from public.cost_log l
    where l.created_at >= date_trunc('month', now())
  ), reservation_spend as (
    select coalesce(sum(r.reserved_usd), 0)::numeric as amount
    from public.ai_budget_reservations r
    where r.status = 'reserved'
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
grant execute on function public.reserve_ai_budget(uuid, numeric, numeric) to service_role;
revoke all on function public.check_ai_monthly_budget(uuid, numeric) from public;
grant execute on function public.check_ai_monthly_budget(uuid, numeric) to service_role;

-- Down:
--   recreate public.reserve_ai_budget(uuid, numeric, numeric) from
--   20260806190000_ai_budget_reservations.sql;
--   recreate public.check_ai_monthly_budget(uuid, numeric) from
--   20260806190000_ai_budget_reservations.sql;
