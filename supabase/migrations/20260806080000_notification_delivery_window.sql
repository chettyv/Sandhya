-- Tolerate scheduler jitter without sending the same daily reflection twice.
-- The unique notification_deliveries key remains the durable de-duplication
-- guard when multiple worker invocations overlap.

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
    );
$$;

revoke all on function public.get_due_daily_reflection_recipients(timestamptz) from public;
grant execute on function public.get_due_daily_reflection_recipients(timestamptz) to service_role;

-- Down:
--   recreate public.get_due_daily_reflection_recipients(timestamptz) from
--   20260805210000_account_billing_notifications.sql.
