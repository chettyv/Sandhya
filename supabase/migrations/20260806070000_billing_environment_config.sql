-- Keep sandbox entitlement access an explicit database-level decision. The
-- default is production-only; isolated test projects may opt in after review.

create table if not exists public.billing_runtime_config (
  id             boolean primary key default true check (id = true),
  allow_sandbox  boolean not null default false,
  updated_at     timestamptz not null default now()
);

alter table public.billing_runtime_config enable row level security;

-- This singleton is consulted only inside SECURITY DEFINER entitlement
-- functions. Keep direct table access closed even if project-level default
-- grants change later.
revoke all on table public.billing_runtime_config from public, anon, authenticated;
grant select on table public.billing_runtime_config to service_role;

insert into public.billing_runtime_config (id, allow_sandbox)
values (true, false)
on conflict (id) do nothing;

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
      and (
        s.environment = 'PRODUCTION'
        or (
          s.environment = 'SANDBOX'
          and exists (
            select 1
            from public.billing_runtime_config c
            where c.id = true and c.allow_sandbox = true
          )
        )
      )
      and s.status in ('active', 'billing_issue', 'cancelled')
      and (
        s.plan = 'lifetime'
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

-- Down:
--   drop function if exists public.has_plus_access();
--   drop function if exists public.user_has_plus_access(uuid);
--   drop table if exists public.billing_runtime_config;
