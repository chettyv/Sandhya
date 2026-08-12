-- Allow a failed RevenueCat webhook attempt to be retried safely.
--
-- A billing event is claimed before applying its entitlement update. If the
-- Edge Function crashes after the claim, a plain ON CONFLICT DO NOTHING would
-- make every provider retry look like a duplicate forever. Keep a short
-- processing lease so concurrent deliveries are still de-duplicated while an
-- abandoned claim can be reclaimed.

alter table public.billing_events
  add column if not exists processing_started_at timestamptz;

create index if not exists billing_events_processing_idx
  on public.billing_events (processed_at, processing_started_at);

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
  was_claimed boolean;
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
  returning true into was_claimed;

  return query select coalesce(was_claimed, false);
end;
$$;

revoke all on function public.claim_billing_event(text, text, text, text) from public;
grant execute on function public.claim_billing_event(text, text, text, text) to service_role;

-- Down:
--   recreate public.claim_billing_event(text, text, text, text) from the
--   previous migration and drop billing_events_processing_idx plus the added
--   processing_started_at column.
