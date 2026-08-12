-- Restore the processing lease after the retry-claims migration.
-- An unprocessed event may be reclaimed only when its previous worker lease
-- has expired; concurrent deliveries must not both apply entitlement changes.

drop function if exists public.claim_billing_event(text, text, text, text);

create function public.claim_billing_event(
  p_event_id text,
  p_event_type text,
  p_app_user_id text,
  p_environment text
)
returns table (claimed boolean, already_processed boolean)
language plpgsql
security definer
set search_path = public
as $$
declare
  claimed_now boolean := false;
  event_processed boolean := false;
begin
  insert into public.billing_events (
    event_id,
    event_type,
    app_user_id,
    environment,
    processing_started_at
  ) values (
    p_event_id,
    p_event_type,
    p_app_user_id,
    p_environment,
    now()
  )
  on conflict (event_id) do update
  set processing_started_at = now(),
      processing_error = null
  where public.billing_events.processed_at is null
    and (
      public.billing_events.processing_started_at is null
      or public.billing_events.processing_started_at < now() - interval '10 minutes'
    )
  returning true into claimed_now;

  if coalesce(claimed_now, false) then
    return query select true, false;
  end if;

  select processed_at is not null
    into event_processed
  from public.billing_events
  where event_id = p_event_id;

  return query select false, coalesce(event_processed, false);
end;
$$;

revoke all on function public.claim_billing_event(text, text, text, text) from public;
grant execute on function public.claim_billing_event(text, text, text, text) to service_role;

-- Down:
--   drop function if exists public.claim_billing_event(text, text, text, text);
--   recreate the previous claim_billing_event signature and lease policy.
