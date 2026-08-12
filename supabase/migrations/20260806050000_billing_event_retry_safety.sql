-- A RevenueCat delivery can fail after the event row is claimed but before
-- entitlement state is applied. Keep unprocessed rows claimable so provider
-- retries can recover from transient Supabase or network failures.

create or replace function public.claim_billing_event(
  p_event_id text,
  p_event_type text,
  p_app_user_id text,
  p_environment text
)
returns table (claimed boolean)
language plpgsql
security definer
set search_path = public
as $$
declare
  event_row public.billing_events%rowtype;
begin
  insert into public.billing_events (event_id, event_type, app_user_id, environment)
  values (p_event_id, p_event_type, p_app_user_id, p_environment)
  on conflict (event_id) do nothing;

  select *
  into event_row
  from public.billing_events
  where event_id = p_event_id;

  -- processed_at is the durable idempotency marker. An unprocessed event is
  -- safe to retry because apply_subscription_event is ordered by event time.
  return query select event_row.event_id is not null and event_row.processed_at is null;
end;
$$;

revoke all on function public.claim_billing_event(text, text, text, text) from public;
grant execute on function public.claim_billing_event(text, text, text, text) to service_role;

-- Down:
--   recreate the claim_billing_event function from
--   20260805210000_account_billing_notifications.sql.
