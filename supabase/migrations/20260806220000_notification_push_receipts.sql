-- Persist Expo push tickets so the scheduled worker can check receipts after
-- Expo has handed notifications to APNs/FCM. A successful push ticket only
-- means Expo accepted the request; the receipt is the durable delivery signal.

create table if not exists public.notification_push_tickets (
  id               uuid primary key default uuid_generate_v4(),
  ticket_id        text not null unique,
  user_id          uuid not null references public.profiles(id) on delete cascade,
  expo_push_token  text not null,
  delivery_date    date not null,
  kind             text not null check (kind in ('daily_reflection')),
  status           text not null default 'pending'
    check (status in ('pending', 'claimed', 'ok', 'error')),
  attempt_count    integer not null default 0 check (attempt_count >= 0),
  claimed_at       timestamptz,
  checked_at       timestamptz,
  last_error       text,
  created_at       timestamptz not null default now()
);

create index if not exists notification_push_tickets_pending_idx
  on public.notification_push_tickets (status, created_at);

alter table public.notification_push_tickets enable row level security;
revoke all on table public.notification_push_tickets from public, anon, authenticated;
grant select, insert, update on table public.notification_push_tickets to service_role;

create or replace function public.record_notification_push_ticket(
  p_ticket_id text,
  p_user_id uuid,
  p_expo_push_token text,
  p_delivery_date date,
  p_kind text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if nullif(trim(p_ticket_id), '') is null
     or p_user_id is null
     or p_delivery_date is null
     or nullif(trim(p_expo_push_token), '') is null
     or p_kind is distinct from 'daily_reflection' then
    return false;
  end if;

  insert into public.notification_push_tickets (
    ticket_id, user_id, expo_push_token, delivery_date, kind
  ) values (
    trim(p_ticket_id),
    p_user_id,
    trim(p_expo_push_token),
    p_delivery_date,
    p_kind
  ) on conflict (ticket_id) do nothing;
  return found;
end;
$$;

create or replace function public.claim_notification_push_tickets(
  p_now timestamptz default now(),
  p_limit integer default 100
)
returns table (
  id uuid,
  ticket_id text,
  user_id uuid,
  expo_push_token text,
  delivery_date date,
  kind text
)
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.notification_push_tickets
  set status = 'error',
      checked_at = p_now,
      claimed_at = null,
      last_error = 'receipt_expired'
  where status in ('pending', 'claimed')
    and created_at < p_now - interval '24 hours';

  return query
  with candidates as (
    select t.id
    from public.notification_push_tickets t
    where (
      t.status = 'pending'
      and t.created_at <= p_now - interval '15 minutes'
    ) or (
      t.status = 'claimed'
      and t.claimed_at < p_now - interval '15 minutes'
    )
    order by t.created_at
    limit greatest(1, least(coalesce(p_limit, 100), 1000))
    for update skip locked
  ), claimed as (
    update public.notification_push_tickets t
    set status = 'claimed',
        attempt_count = t.attempt_count + 1,
        claimed_at = p_now,
        last_error = null
    from candidates c
    where t.id = c.id
    returning t.id, t.ticket_id, t.user_id, t.expo_push_token, t.delivery_date, t.kind
  )
  select * from claimed;
end;
$$;

create or replace function public.record_notification_push_receipt(
  p_ticket_id uuid,
  p_status text,
  p_error text default null
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_status is null or p_status not in ('ok', 'error') then
    return false;
  end if;

  update public.notification_push_tickets
  set status = p_status,
      checked_at = now(),
      claimed_at = null,
      last_error = left(nullif(trim(p_error), ''), 500)
  where id = p_ticket_id and status = 'claimed';
  return found;
end;
$$;

create or replace function public.release_notification_push_ticket(
  p_ticket_id uuid,
  p_error text default null
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.notification_push_tickets
  set status = 'pending',
      claimed_at = null,
      last_error = left(nullif(trim(p_error), ''), 500)
  where id = p_ticket_id and status = 'claimed';
  return found;
end;
$$;

revoke all on function public.record_notification_push_ticket(text, uuid, text, date, text) from public;
revoke all on function public.claim_notification_push_tickets(timestamptz, integer) from public;
revoke all on function public.record_notification_push_receipt(uuid, text, text) from public;
revoke all on function public.release_notification_push_ticket(uuid, text) from public;
grant execute on function public.record_notification_push_ticket(text, uuid, text, date, text) to service_role;
grant execute on function public.claim_notification_push_tickets(timestamptz, integer) to service_role;
grant execute on function public.record_notification_push_receipt(uuid, text, text) to service_role;
grant execute on function public.release_notification_push_ticket(uuid, text) to service_role;

-- Down:
--   drop function if exists public.release_notification_push_ticket(uuid, text);
--   drop function if exists public.record_notification_push_receipt(uuid, text, text);
--   drop function if exists public.claim_notification_push_tickets(timestamptz, integer);
--   drop function if exists public.record_notification_push_ticket(text, uuid, text, date, text);
--   drop table if exists public.notification_push_tickets;
