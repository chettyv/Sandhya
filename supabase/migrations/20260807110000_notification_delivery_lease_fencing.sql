-- Fence daily delivery completion and release to the worker that owns the
-- current claim. A stale worker must not be able to finalize a newer claim
-- after the fifteen-minute delivery lease has been reclaimed.

alter table public.notification_deliveries
  add column if not exists claim_token uuid;

create function public.claim_notification_delivery_fenced(
  p_user_id uuid,
  p_delivery_date date,
  p_kind text
)
returns table (claimed boolean, claim_token uuid)
language plpgsql
security definer
set search_path = public
as $$
declare
  claimed_now boolean := false;
  token_value uuid;
begin
  insert into public.notification_deliveries (
    user_id, delivery_date, kind, status, attempt_count, claimed_at, claim_token
  ) values (
    p_user_id, p_delivery_date, p_kind, 'claimed', 1, now(), gen_random_uuid()
  )
  on conflict (user_id, delivery_date, kind) do nothing
  returning true, claim_token into claimed_now, token_value;

  if coalesce(claimed_now, false) then
    return query select true, token_value;
  end if;

  update public.notification_deliveries
  set status = 'claimed',
      attempt_count = attempt_count + 1,
      claimed_at = now(),
      claim_token = gen_random_uuid(),
      last_error = null
  where user_id = p_user_id
    and delivery_date = p_delivery_date
    and kind = p_kind
    and status = 'claimed'
    and claimed_at < now() - interval '15 minutes'
  returning true, claim_token into claimed_now, token_value;

  return query select coalesce(claimed_now, false), token_value;
end;
$$;

create function public.record_notification_delivery_fenced(
  p_user_id uuid,
  p_delivery_date date,
  p_kind text,
  p_claim_token uuid
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.notification_deliveries
  set status = 'sent',
      sent_at = now(),
      claimed_at = null,
      claim_token = null,
      last_error = null
  where user_id = p_user_id
    and delivery_date = p_delivery_date
    and kind = p_kind
    and status = 'claimed'
    and claim_token = p_claim_token;
  return found;
end;
$$;

create function public.release_notification_delivery_fenced(
  p_user_id uuid,
  p_delivery_date date,
  p_kind text,
  p_claim_token uuid,
  p_error text default null
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.notification_deliveries
  set status = 'claimed',
      claimed_at = now() - interval '16 minutes',
      claim_token = null,
      last_error = left(nullif(trim(p_error), ''), 500)
  where user_id = p_user_id
    and delivery_date = p_delivery_date
    and kind = p_kind
    and status = 'claimed'
    and claim_token = p_claim_token;
  return found;
end;
$$;

revoke all on function public.claim_notification_delivery_fenced(uuid, date, text) from public;
revoke all on function public.record_notification_delivery_fenced(uuid, date, text, uuid) from public;
revoke all on function public.release_notification_delivery_fenced(uuid, date, text, uuid, text) from public;
grant execute on function public.claim_notification_delivery_fenced(uuid, date, text) to service_role;
grant execute on function public.record_notification_delivery_fenced(uuid, date, text, uuid) to service_role;
grant execute on function public.release_notification_delivery_fenced(uuid, date, text, uuid, text) to service_role;

-- The legacy helpers remain defined for rollback inspection, but must not be
-- callable by an older worker after this migration. Otherwise a rolling
-- deployment could let that worker finalize a newer fenced claim.
revoke all on function public.claim_notification_delivery(uuid, date, text) from service_role;
revoke all on function public.record_notification_delivery(uuid, date, text) from service_role;
revoke all on function public.release_notification_delivery(uuid, date, text, text) from service_role;

-- Down:
--   drop function if exists public.release_notification_delivery_fenced(uuid, date, text, uuid, text);
--   drop function if exists public.record_notification_delivery_fenced(uuid, date, text, uuid);
--   drop function if exists public.claim_notification_delivery_fenced(uuid, date, text);
--   alter table public.notification_deliveries drop column if exists claim_token;
--   grant execute on function public.claim_notification_delivery(uuid, date, text) to service_role;
--   grant execute on function public.record_notification_delivery(uuid, date, text) to service_role;
--   grant execute on function public.release_notification_delivery(uuid, date, text, text) to service_role;
