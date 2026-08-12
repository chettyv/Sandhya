-- Account lifecycle, subscription state, and push-notification infrastructure.
-- All writes are performed by authenticated clients through RLS or by
-- service-role Edge Functions. No provider secret belongs in the mobile app.

alter table public.profiles
  add column if not exists timezone text not null default 'UTC';

create table if not exists public.device_push_tokens (
  id               uuid primary key default uuid_generate_v4(),
  user_id          uuid not null references public.profiles(id) on delete cascade,
  expo_push_token  text not null unique,
  platform         text not null check (platform in ('ios', 'android', 'web')),
  app_version      text,
  enabled          boolean not null default true,
  last_seen_at     timestamptz not null default now(),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists device_push_tokens_user_enabled_idx
  on public.device_push_tokens (user_id, enabled);

alter table public.device_push_tokens enable row level security;

create policy "users read own push tokens"
  on public.device_push_tokens for select using (auth.uid() = user_id);

create policy "users insert own push tokens"
  on public.device_push_tokens for insert with check (auth.uid() = user_id);

create policy "users update own push tokens"
  on public.device_push_tokens for update using (auth.uid() = user_id);

create policy "users delete own push tokens"
  on public.device_push_tokens for delete using (auth.uid() = user_id);

create table if not exists public.notification_deliveries (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references public.profiles(id) on delete cascade,
  delivery_date date not null,
  kind         text not null check (kind in ('daily_reflection')),
  created_at   timestamptz not null default now(),
  unique (user_id, delivery_date, kind)
);

create index if not exists notification_deliveries_date_idx
  on public.notification_deliveries (delivery_date, kind);

alter table public.notification_deliveries enable row level security;

create policy "users read own notification deliveries"
  on public.notification_deliveries for select using (auth.uid() = user_id);

create table if not exists public.subscription_status (
  user_id             uuid primary key references public.profiles(id) on delete cascade,
  revenuecat_app_user_id text not null unique,
  entitlement_id      text,
  product_id          text,
  plan                text not null default 'free'
    check (plan in ('free', 'plus_monthly', 'plus_annual', 'lifetime')),
  status              text not null default 'free'
    check (status in ('active', 'billing_issue', 'cancelled', 'expired', 'refunded', 'free')),
  environment         text not null default 'PRODUCTION'
    check (environment in ('PRODUCTION', 'SANDBOX', 'UNKNOWN')),
  expires_at           timestamptz,
  latest_event_id      text,
  latest_event_at      timestamptz,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

alter table public.subscription_status enable row level security;

create policy "users read own subscription status"
  on public.subscription_status for select using (auth.uid() = user_id);

create table if not exists public.billing_events (
  event_id       text primary key,
  event_type     text not null,
  app_user_id    text,
  environment    text,
  received_at    timestamptz not null default now(),
  processed_at   timestamptz,
  processing_error text
);

alter table public.billing_events enable row level security;

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
begin
  insert into public.billing_events (event_id, event_type, app_user_id, environment)
  values (p_event_id, p_event_type, p_app_user_id, p_environment)
  on conflict (event_id) do nothing;
  return query select found;
end;
$$;

create or replace function public.apply_subscription_event(
  p_user_id uuid,
  p_revenuecat_app_user_id text,
  p_entitlement_id text,
  p_product_id text,
  p_plan text,
  p_status text,
  p_environment text,
  p_expires_at timestamptz,
  p_event_id text,
  p_latest_event_at timestamptz
)
returns table (applied boolean)
language plpgsql
security definer
set search_path = public
as $$
declare
  event_applied boolean;
begin
  insert into public.subscription_status (
    user_id, revenuecat_app_user_id, entitlement_id, product_id, plan,
    status, environment, expires_at, latest_event_id, latest_event_at
  )
  values (
    p_user_id, p_revenuecat_app_user_id, p_entitlement_id, p_product_id, p_plan,
    p_status, p_environment, p_expires_at, p_event_id, p_latest_event_at
  )
  on conflict (user_id) do update
  set revenuecat_app_user_id = excluded.revenuecat_app_user_id,
      entitlement_id = excluded.entitlement_id,
      product_id = excluded.product_id,
      plan = excluded.plan,
      status = excluded.status,
      environment = excluded.environment,
      expires_at = excluded.expires_at,
      latest_event_id = excluded.latest_event_id,
      latest_event_at = excluded.latest_event_at,
      updated_at = now()
  where public.subscription_status.latest_event_at is null
     or excluded.latest_event_at is null
     or excluded.latest_event_at >= public.subscription_status.latest_event_at
  returning true into event_applied;

  if not coalesce(event_applied, false) then
    return query select false;
  end if;

  insert into public.usage_quotas (user_id, date, ai_messages_count, plan, updated_at)
  values (p_user_id, current_date, 0, p_plan, now())
  on conflict (user_id) do update
  set plan = excluded.plan,
      updated_at = now();
  return query select true;
end;
$$;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists device_push_tokens_touch_updated_at on public.device_push_tokens;
create trigger device_push_tokens_touch_updated_at
  before update on public.device_push_tokens
  for each row execute function public.touch_updated_at();

drop trigger if exists subscription_status_touch_updated_at on public.subscription_status;
create trigger subscription_status_touch_updated_at
  before update on public.subscription_status
  for each row execute function public.touch_updated_at();

create or replace function public.touch_conversation_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.conversations
  set updated_at = now()
  where id = new.conversation_id;
  return new;
end;
$$;

drop trigger if exists messages_touch_conversation_updated_at on public.messages;
create trigger messages_touch_conversation_updated_at
  after insert on public.messages
  for each row execute function public.touch_conversation_updated_at();

create or replace function public.get_due_daily_reflection_recipients(p_now timestamptz default now())
returns table (
  user_id uuid,
  expo_push_token text,
  display_name text,
  local_date date,
  date_slot integer
)
language sql
stable
security definer
set search_path = public
as $$
  with localised as (
    select
      p.id as user_id,
      p.display_name,
      case
        when exists (
          select 1 from pg_timezone_names z
          where z.name = nullif(p.timezone, '')
        ) then p.timezone
        else 'UTC'
      end as timezone_name,
      p.notification_time,
      (p_now at time zone case
        when exists (
          select 1 from pg_timezone_names z
          where z.name = nullif(p.timezone, '')
        ) then p.timezone
        else 'UTC'
      end)::date as local_date,
      (p_now at time zone case
        when exists (
          select 1 from pg_timezone_names z
          where z.name = nullif(p.timezone, '')
        ) then p.timezone
        else 'UTC'
      end)::time as local_time
    from public.profiles p
    where p.notification_time is not null
  )
  select
    l.user_id,
    t.expo_push_token,
    l.display_name,
    l.local_date,
    extract(doy from l.local_date)::integer as date_slot
  from localised l
  join public.device_push_tokens t
    on t.user_id = l.user_id and t.enabled = true
  where extract(hour from l.local_time) = extract(hour from l.notification_time)
    and extract(minute from l.local_time) = extract(minute from l.notification_time)
    and not exists (
      select 1
      from public.notification_deliveries d
      where d.user_id = l.user_id
        and d.delivery_date = l.local_date
        and d.kind = 'daily_reflection'
    );
$$;

create or replace function public.record_notification_delivery(
  p_user_id uuid,
  p_delivery_date date,
  p_kind text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.notification_deliveries (user_id, delivery_date, kind)
  values (p_user_id, p_delivery_date, p_kind)
  on conflict (user_id, delivery_date, kind) do nothing;
  return found;
end;
$$;

revoke all on function public.get_due_daily_reflection_recipients(timestamptz) from public;
revoke all on function public.record_notification_delivery(uuid, date, text) from public;
revoke all on function public.claim_billing_event(text, text, text, text) from public;
revoke all on function public.apply_subscription_event(uuid, text, text, text, text, text, text, timestamptz, text, timestamptz) from public;
grant execute on function public.get_due_daily_reflection_recipients(timestamptz) to service_role;
grant execute on function public.record_notification_delivery(uuid, date, text) to service_role;
grant execute on function public.claim_billing_event(text, text, text, text) to service_role;
grant execute on function public.apply_subscription_event(uuid, text, text, text, text, text, text, timestamptz, text, timestamptz) to service_role;

-- Down:
--   drop function if exists public.record_notification_delivery(uuid, date, text);
--   drop function if exists public.get_due_daily_reflection_recipients(timestamptz);
--   drop function if exists public.apply_subscription_event(uuid, text, text, text, text, text, text, timestamptz, text, timestamptz);
--   drop function if exists public.claim_billing_event(text, text, text, text);
--   drop trigger if exists messages_touch_conversation_updated_at on public.messages;
--   drop function if exists public.touch_conversation_updated_at();
--   drop trigger if exists subscription_status_touch_updated_at on public.subscription_status;
--   drop trigger if exists device_push_tokens_touch_updated_at on public.device_push_tokens;
--   drop function if exists public.touch_updated_at();
--   drop table if exists public.billing_events;
--   drop table if exists public.subscription_status;
--   drop table if exists public.notification_deliveries;
--   drop table if exists public.device_push_tokens;
--   alter table public.profiles drop column if exists timezone;
