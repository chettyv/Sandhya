-- Make daily notification delivery claimable before the external push call.
-- This prevents overlapping scheduler invocations from sending duplicates while
-- allowing an abandoned claim to be retried after fifteen minutes.

alter table public.notification_deliveries
  add column if not exists status text not null default 'sent',
  add column if not exists attempt_count integer not null default 1,
  add column if not exists claimed_at timestamptz,
  add column if not exists sent_at timestamptz,
  add column if not exists last_error text;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'notification_deliveries_status_chk'
  ) then
    alter table public.notification_deliveries
      add constraint notification_deliveries_status_chk
      check (status in ('claimed', 'sent')) not valid;
  end if;
end $$;

update public.notification_deliveries
set sent_at = coalesce(sent_at, created_at),
    attempt_count = greatest(attempt_count, 1)
where status = 'sent';

create index if not exists notification_deliveries_claim_idx
  on public.notification_deliveries (status, claimed_at);

create or replace function public.get_due_daily_reflection_recipients(p_now timestamptz default now())
returns table (
  user_id uuid,
  expo_push_token text,
  display_name text,
  local_date date,
  date_slot integer
)
language sql
security definer
set search_path = public
as $$
  with localised as (
    select
      p.id as user_id,
      p.display_name,
      p.notification_time,
      (
        p_now at time zone case
          when exists (
            select 1
            from pg_timezone_names z
            where z.name = nullif(p.timezone, '')
          ) then p.timezone
          else 'UTC'
        end
      ) as local_now
    from public.profiles p
    where p.notification_time is not null
  )
  select
    l.user_id,
    t.expo_push_token,
    l.display_name,
    l.local_now::date as local_date,
    extract(doy from l.local_now::date)::integer as date_slot
  from localised l
  join public.device_push_tokens t
    on t.user_id = l.user_id and t.enabled = true
  where l.local_now >= (l.local_now::date + l.notification_time)
    and l.local_now < (l.local_now::date + l.notification_time + interval '15 minutes')
    and not exists (
      select 1
      from public.notification_deliveries d
      where d.user_id = l.user_id
        and d.delivery_date = l.local_now::date
        and d.kind = 'daily_reflection'
        and (
          d.status = 'sent'
          or (d.status = 'claimed' and d.claimed_at > p_now - interval '15 minutes')
        )
    );
$$;

create or replace function public.claim_notification_delivery(
  p_user_id uuid,
  p_delivery_date date,
  p_kind text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  claimed boolean;
begin
  insert into public.notification_deliveries (
    user_id, delivery_date, kind, status, attempt_count, claimed_at
  ) values (
    p_user_id, p_delivery_date, p_kind, 'claimed', 1, now()
  )
  on conflict (user_id, delivery_date, kind) do nothing;

  if found then
    return true;
  end if;

  update public.notification_deliveries
  set status = 'claimed',
      attempt_count = attempt_count + 1,
      claimed_at = now(),
      last_error = null
  where user_id = p_user_id
    and delivery_date = p_delivery_date
    and kind = p_kind
    and status = 'claimed'
    and claimed_at < now() - interval '15 minutes'
  returning true into claimed;

  return coalesce(claimed, false);
end;
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
  insert into public.notification_deliveries (
    user_id, delivery_date, kind, status, attempt_count, claimed_at, sent_at
  ) values (
    p_user_id, p_delivery_date, p_kind, 'sent', 1, now(), now()
  )
  on conflict (user_id, delivery_date, kind) do update
    set status = 'sent',
        sent_at = now(),
        last_error = null
    where public.notification_deliveries.status = 'claimed';
  return found;
end;
$$;

create or replace function public.release_notification_delivery(
  p_user_id uuid,
  p_delivery_date date,
  p_kind text,
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
      last_error = left(nullif(trim(p_error), ''), 500)
  where user_id = p_user_id
    and delivery_date = p_delivery_date
    and kind = p_kind
    and status = 'claimed';
  return found;
end;
$$;

revoke all on function public.claim_notification_delivery(uuid, date, text) from public;
revoke all on function public.release_notification_delivery(uuid, date, text, text) from public;
grant execute on function public.claim_notification_delivery(uuid, date, text) to service_role;
grant execute on function public.release_notification_delivery(uuid, date, text, text) to service_role;

-- Down:
--   Recreate notification functions and remove the added delivery columns and index.
