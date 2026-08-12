-- Keep AI entitlement decisions fail-closed when a billing webhook is late or
-- a mirrored usage_quotas.plan value is stale.

create or replace function public.user_has_plus_access(p_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.usage_quotas q
    join public.subscription_status s on s.user_id = q.user_id
    where q.user_id = p_user_id
      and q.plan <> 'free'
      and s.plan <> 'free'
      and s.environment = 'PRODUCTION'
      and s.status in ('active', 'billing_issue', 'cancelled')
      and (
        (s.plan = 'lifetime')
        or (s.expires_at is not null and s.expires_at > now())
      )
  );
$$;

revoke all on function public.user_has_plus_access(uuid) from public;
grant execute on function public.user_has_plus_access(uuid) to service_role;

create or replace function public.has_plus_access()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.user_has_plus_access(auth.uid());
$$;

revoke all on function public.has_plus_access() from public;
grant execute on function public.has_plus_access() to authenticated;

create or replace function public.consume_ai_message(
  p_user_id uuid,
  p_free_daily_limit integer default 5
)
returns table (
  allowed boolean,
  plan text,
  ai_messages_count integer,
  free_daily_limit integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
  quota_row public.usage_quotas%rowtype;
  effective_free_daily_limit integer := greatest(0, coalesce(p_free_daily_limit, 5));
begin
  insert into public.usage_quotas (user_id, date, ai_messages_count, plan, updated_at)
  values (p_user_id, current_date, 0, 'free', now())
  on conflict (user_id) do nothing;

  update public.usage_quotas
  set ai_messages_count = case
        when date = current_date then ai_messages_count
        else 0
      end,
      date = current_date,
      updated_at = now()
  where user_id = p_user_id
  returning * into quota_row;

  if quota_row.plan <> 'free' and not public.user_has_plus_access(p_user_id) then
    update public.usage_quotas
    set plan = 'free', updated_at = now()
    where user_id = p_user_id
    returning * into quota_row;
  end if;

  if quota_row.plan <> 'free' then
    return query
      update public.usage_quotas
      set ai_messages_count = ai_messages_count + 1,
          updated_at = now()
      where user_id = p_user_id
      returning true, usage_quotas.plan, usage_quotas.ai_messages_count, effective_free_daily_limit;
    return;
  end if;

  if quota_row.ai_messages_count >= effective_free_daily_limit then
    return query
      select false, quota_row.plan, quota_row.ai_messages_count, effective_free_daily_limit;
    return;
  end if;

  return query
    update public.usage_quotas
    set ai_messages_count = ai_messages_count + 1,
        updated_at = now()
    where user_id = p_user_id
    returning true, usage_quotas.plan, usage_quotas.ai_messages_count, effective_free_daily_limit;
end;
$$;

revoke all on function public.consume_ai_message(uuid, integer) from public;
grant execute on function public.consume_ai_message(uuid, integer) to service_role;

-- Down:
--   drop function if exists public.consume_ai_message(uuid, integer);
--   drop function if exists public.has_plus_access();
--   drop function if exists public.user_has_plus_access(uuid);
