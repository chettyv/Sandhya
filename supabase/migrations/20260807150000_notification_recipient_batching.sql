-- Bound each scheduler invocation while keeping every active token for the
-- selected users. Limiting raw token rows could mark a multi-device user as
-- delivered after only some of their devices were returned.

drop function if exists public.get_due_daily_reflection_recipients(timestamptz);

create function public.get_due_daily_reflection_recipients(
  p_now timestamptz default now(),
  p_limit integer default 500
)
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
  ),
  due_users as (
    select l.*
    from localised l
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
      )
    order by l.user_id
    limit greatest(1, least(coalesce(p_limit, 500), 1000))
  )
  select
    l.user_id,
    t.expo_push_token,
    l.display_name,
    l.local_now::date as local_date,
    extract(doy from l.local_now::date)::integer as date_slot
  from due_users l
  join public.device_push_tokens t
    on t.user_id = l.user_id and t.enabled = true
  order by l.user_id, t.expo_push_token;
$$;

create index if not exists profiles_notification_time_idx
  on public.profiles (notification_time, id)
  where notification_time is not null;

revoke all on function public.get_due_daily_reflection_recipients(timestamptz, integer) from public;
grant execute on function public.get_due_daily_reflection_recipients(timestamptz, integer) to service_role;

-- Down:
--   Recreate public.get_due_daily_reflection_recipients(timestamptz) from
--   20260806170000_notification_delivery_claims.sql.
