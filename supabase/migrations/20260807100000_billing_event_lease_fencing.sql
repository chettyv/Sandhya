-- Fence billing-event completion and release to the worker that currently
-- owns the processing lease. A reclaimed event must not be finishable by a
-- stale worker that started before the lease expired.

alter table public.billing_events
  add column if not exists processing_token uuid;

drop function if exists public.claim_billing_event(text, text, text, text);

create function public.claim_billing_event(
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
  claimed_now boolean := false;
  event_processed boolean := false;
  token_value uuid;
begin
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

create or replace function public.complete_billing_event(
  p_event_id text,
  p_processing_token uuid
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.billing_events
  set processed_at = now(),
      processing_started_at = null,
      processing_token = null,
      processing_error = null
  where event_id = p_event_id
    and processed_at is null
    and processing_token = p_processing_token;
  return found;
end;
$$;

revoke all on function public.claim_billing_event(text, text, text, text) from public;
revoke all on function public.complete_billing_event(text, uuid) from public;
grant execute on function public.claim_billing_event(text, text, text, text) to service_role;
grant execute on function public.complete_billing_event(text, uuid) to service_role;

-- Down:
--   drop function if exists public.complete_billing_event(text, uuid);
--   drop function if exists public.claim_billing_event(text, text, text, text);
--   recreate the previous claim_billing_event signature and lease policy;
--   alter table public.billing_events drop column if exists processing_token;
