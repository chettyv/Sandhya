-- Server-only accountability for privileged moderation, content, and cache
-- operations. The audit record deliberately stores identifiers and outcomes,
-- never prompts, answers, or submitted content payloads.

create table if not exists public.admin_audit_log (
  id             uuid primary key default uuid_generate_v4(),
  admin_user_id  uuid references auth.users(id) on delete set null,
  action         text not null check (action in (
    'content_create',
    'content_update',
    'content_delete',
    'feedback_update',
    'cache_invalidate'
  )),
  resource       text not null check (length(resource) between 1 and 80),
  resource_id    uuid,
  resource_key   text,
  outcome        text not null default 'pending' check (outcome in ('pending', 'succeeded', 'failed')),
  created_at     timestamptz not null default now(),
  completed_at   timestamptz
);

create index if not exists admin_audit_log_created_at_idx
  on public.admin_audit_log (created_at desc);
create index if not exists admin_audit_log_admin_created_at_idx
  on public.admin_audit_log (admin_user_id, created_at desc);
create index if not exists admin_audit_log_outcome_created_at_idx
  on public.admin_audit_log (outcome, created_at desc);

alter table public.admin_audit_log enable row level security;
revoke all on table public.admin_audit_log from public, anon, authenticated, service_role;
grant select on table public.admin_audit_log to service_role;

create or replace function public.start_admin_audit_event(
  p_admin_user_id uuid,
  p_action text,
  p_resource text,
  p_resource_id uuid default null,
  p_resource_key text default null
)
returns table (audit_id uuid)
language plpgsql
security definer
set search_path = public
as $$
declare
  created_id uuid;
begin
  if coalesce(auth.role(), '') <> 'service_role' then
    raise exception 'Admin audit events are service-role only.';
  end if;
  if p_admin_user_id is null or not exists (
    select 1 from auth.users where id = p_admin_user_id
  ) then
    raise exception 'Admin audit actor is invalid.';
  end if;
  if p_action not in (
    'content_create',
    'content_update',
    'content_delete',
    'feedback_update',
    'cache_invalidate'
  ) then
    raise exception 'Admin audit action is invalid.';
  end if;
  if p_resource is null or length(trim(p_resource)) not between 1 and 80 then
    raise exception 'Admin audit resource is invalid.';
  end if;
  if p_resource_key is not null and length(p_resource_key) > 128 then
    raise exception 'Admin audit resource key is too long.';
  end if;

  insert into public.admin_audit_log (
    admin_user_id, action, resource, resource_id, resource_key
  ) values (
    p_admin_user_id,
    p_action,
    left(trim(p_resource), 80),
    p_resource_id,
    nullif(left(p_resource_key, 128), '')
  ) returning id into created_id;

  return query select created_id;
end;
$$;

create or replace function public.complete_admin_audit_event(
  p_audit_id uuid,
  p_outcome text,
  p_resource_id uuid default null
)
returns table (completed boolean)
language plpgsql
security definer
set search_path = public
as $$
begin
  if coalesce(auth.role(), '') <> 'service_role' then
    raise exception 'Admin audit events are service-role only.';
  end if;
  if p_outcome not in ('succeeded', 'failed') then
    raise exception 'Admin audit outcome is invalid.';
  end if;

  update public.admin_audit_log
  set outcome = p_outcome,
      resource_id = coalesce(p_resource_id, resource_id),
      completed_at = now()
  where id = p_audit_id
    and outcome = 'pending';

  return query select found;
end;
$$;

revoke all on function public.start_admin_audit_event(uuid, text, text, uuid, text)
  from public, anon, authenticated;
grant execute on function public.start_admin_audit_event(uuid, text, text, uuid, text)
  to service_role;
revoke all on function public.complete_admin_audit_event(uuid, text, uuid)
  from public, anon, authenticated;
grant execute on function public.complete_admin_audit_event(uuid, text, uuid)
  to service_role;

-- Down:
--   revoke all on function public.complete_admin_audit_event(uuid, text, uuid) from service_role;
--   revoke all on function public.start_admin_audit_event(uuid, text, text, uuid, text) from service_role;
--   drop function if exists public.complete_admin_audit_event(uuid, text, uuid);
--   drop function if exists public.start_admin_audit_event(uuid, text, text, uuid, text);
--   drop table if exists public.admin_audit_log;
