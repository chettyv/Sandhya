-- Do not retain a RevenueCat billing-event row for a deleted Dharma Daily
-- account. The account endpoint performs a second scrub after auth deletion;
-- this guard handles provider retries that arrive after that scrub.

create or replace function public.claim_billing_event(
  p_event_id text,
  p_event_type text,
  p_app_user_id text,
  p_environment text
)
returns table (
  claimed boolean,
  already_processed boolean,
  processing_token uuid
)
language plpgsql
security definer
set search_path = public
as $$
declare
  normalized_user_id text := replace(coalesce(p_app_user_id, ''), 'supabase:', '');
  claimed_now boolean := false;
  event_processed boolean := false;
  token_value uuid;
begin
  -- TRANSFER events are handled separately because an unregistered
  -- destination must remain retryable until the account exists. Normal
  -- lifecycle events for a missing UUID account are terminal no-ops: there is
  -- no entitlement to reconcile and retaining the provider identifier would
  -- defeat account deletion.
  if upper(coalesce(p_event_type, '')) <> 'TRANSFER'
     and normalized_user_id ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' then
    if not exists (
      select 1 from public.profiles where id = normalized_user_id::uuid
    ) then
      return query select false, true, null::uuid;
      return;
    end if;
  end if;

  insert into public.billing_events (
    event_id,
    event_type,
    app_user_id,
    environment,
    processing_started_at,
    processing_token
  ) values (
    p_event_id,
    p_event_type,
    p_app_user_id,
    p_environment,
    now(),
    gen_random_uuid()
  )
  on conflict (event_id) do update
  set processing_started_at = now(),
      processing_error = null,
      processing_token = gen_random_uuid()
  where public.billing_events.processed_at is null
    and (
      public.billing_events.processing_started_at is null
      or public.billing_events.processing_started_at < now() - interval '10 minutes'
    )
  returning true, processing_token into claimed_now, token_value;

  if coalesce(claimed_now, false) then
    return query select true, false, token_value;
  end if;

  select processed_at is not null
    into event_processed
  from public.billing_events
  where event_id = p_event_id;

  return query select false, coalesce(event_processed, false), null::uuid;
end;
$$;

revoke all on function public.claim_billing_event(text, text, text, text) from public;
grant execute on function public.claim_billing_event(text, text, text, text) to service_role;

-- Down:
--   recreate public.claim_billing_event from
--   20260807100000_billing_event_lease_fencing.sql.
