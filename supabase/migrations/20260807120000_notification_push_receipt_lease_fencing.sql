-- Fence receipt polling to the worker that owns the current ticket lease.
-- A stale receipt worker must not record or release a ticket after another
-- worker has reclaimed it.

alter table public.notification_push_tickets
  add column if not exists claim_token uuid;

create function public.claim_notification_push_tickets_fenced(
  p_now timestamptz default now(),
  p_limit integer default 100
)
returns table (
  id uuid,
  ticket_id text,
  user_id uuid,
  expo_push_token text,
  delivery_date date,
  kind text,
  claim_token uuid
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
      claim_token = null,
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
        claim_token = gen_random_uuid(),
        last_error = null
    from candidates c
    where t.id = c.id
    returning t.id, t.ticket_id, t.user_id, t.expo_push_token,
      t.delivery_date, t.kind, t.claim_token
  )
  select * from claimed;
end;
$$;

create function public.record_notification_push_receipt_fenced(
  p_ticket_id uuid,
  p_claim_token uuid,
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
      claim_token = null,
      last_error = left(nullif(trim(p_error), ''), 500)
  where id = p_ticket_id
    and status = 'claimed'
    and claim_token = p_claim_token;
  return found;
end;
$$;

create function public.release_notification_push_ticket_fenced(
  p_ticket_id uuid,
  p_claim_token uuid,
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
      claim_token = null,
      last_error = left(nullif(trim(p_error), ''), 500)
  where id = p_ticket_id
    and status = 'claimed'
    and claim_token = p_claim_token;
  return found;
end;
$$;

revoke all on function public.claim_notification_push_tickets_fenced(timestamptz, integer) from public;
revoke all on function public.record_notification_push_receipt_fenced(uuid, uuid, text, text) from public;
revoke all on function public.release_notification_push_ticket_fenced(uuid, uuid, text) from public;
grant execute on function public.claim_notification_push_tickets_fenced(timestamptz, integer) to service_role;
grant execute on function public.record_notification_push_receipt_fenced(uuid, uuid, text, text) to service_role;
grant execute on function public.release_notification_push_ticket_fenced(uuid, uuid, text) to service_role;

-- The legacy receipt helpers remain defined for rollback inspection, but must
-- not be callable by an older worker after this migration. Otherwise a
-- rolling deployment could let that worker finalize a newer fenced claim.
revoke all on function public.claim_notification_push_tickets(timestamptz, integer) from service_role;
revoke all on function public.record_notification_push_receipt(uuid, text, text) from service_role;
revoke all on function public.release_notification_push_ticket(uuid, text) from service_role;

-- Down:
--   drop function if exists public.release_notification_push_ticket_fenced(uuid, uuid, text);
--   drop function if exists public.record_notification_push_receipt_fenced(uuid, uuid, text, text);
--   drop function if exists public.claim_notification_push_tickets_fenced(timestamptz, integer);
--   alter table public.notification_push_tickets drop column if exists claim_token;
--   grant execute on function public.claim_notification_push_tickets(timestamptz, integer) to service_role;
--   grant execute on function public.record_notification_push_receipt(uuid, text, text) to service_role;
--   grant execute on function public.release_notification_push_ticket(uuid, text) to service_role;
