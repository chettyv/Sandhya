-- Enforce the free/Plus content boundary in Postgres as well as in the app.
-- Free users may read only non-premium curated content. Premium access is
-- checked against the server-maintained subscription row as well as the
-- mirrored quota plan, so a missed or malformed billing event cannot leave
-- cancelled access open indefinitely. Concepts remain public to authenticated
-- users because they are the free discovery surface.

create or replace function public.has_plus_access()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.usage_quotas q
    left join public.subscription_status s on s.user_id = q.user_id
    where q.user_id = auth.uid()
      and q.plan <> 'free'
      and coalesce(s.environment, 'UNKNOWN') = 'PRODUCTION'
      and (
        s.plan = 'lifetime'
        and s.status in ('active', 'billing_issue', 'cancelled')
        or (
        s.status in ('active', 'billing_issue')
          and s.expires_at is not null
          and s.expires_at > now()
        )
        or (
          s.status = 'cancelled'
          and s.expires_at is not null
          and s.expires_at > now()
        )
      )
  );
$$;

revoke all on function public.has_plus_access() from public;
grant execute on function public.has_plus_access() to authenticated;

drop policy if exists "authenticated read daily_reflections" on public.daily_reflections;
create policy "authenticated read daily_reflections"
  on public.daily_reflections
  for select
  to authenticated
  using (
    not is_premium
    or public.has_plus_access()
  );

drop policy if exists "authenticated read festivals" on public.festivals;
create policy "authenticated read festivals"
  on public.festivals
  for select
  to authenticated
  using (
    not is_premium
    or public.has_plus_access()
  );

drop policy if exists "authenticated read practice_guides" on public.practice_guides;
create policy "authenticated read practice_guides"
  on public.practice_guides
  for select
  to authenticated
  using (
    not is_premium
    or public.has_plus_access()
  );

-- Down:
--   drop policy if exists "authenticated read daily_reflections" on public.daily_reflections;
--   drop policy if exists "authenticated read festivals" on public.festivals;
--   drop policy if exists "authenticated read practice_guides" on public.practice_guides;
--   recreate the original authenticated read policies from 20260601120200_curated_content.sql;
--   revoke all on function public.has_plus_access() from authenticated;
--   drop function if exists public.has_plus_access();
