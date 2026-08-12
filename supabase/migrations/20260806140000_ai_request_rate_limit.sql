-- Atomic per-user burst protection for /ask. Daily entitlement quotas remain
-- separate; this window prevents a paid or compromised client from flooding
-- provider APIs in a short interval.

create table if not exists public.ai_request_windows (
  user_id          uuid primary key references auth.users(id) on delete cascade,
  window_started_at timestamptz not null default now(),
  request_count    integer not null default 0 check (request_count >= 0),
  updated_at       timestamptz not null default now()
);

alter table public.ai_request_windows enable row level security;
revoke all on table public.ai_request_windows from public, anon, authenticated;
grant select, insert, update on table public.ai_request_windows to service_role;

create or replace function public.consume_ai_rate_limit(
  p_user_id uuid,
  p_max_requests integer default 20,
  p_window_seconds integer default 60
)
returns table (
  allowed boolean,
  request_count integer,
  retry_after_seconds integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
  request_row public.ai_request_windows%rowtype;
  window_seconds integer := greatest(1, least(coalesce(p_window_seconds, 60), 3600));
  max_requests integer := greatest(1, least(coalesce(p_max_requests, 20), 1000));
  elapsed_seconds integer;
begin
  insert into public.ai_request_windows (user_id, window_started_at, request_count, updated_at)
  values (p_user_id, now(), 0, now())
  on conflict (user_id) do nothing;

  select * into request_row
  from public.ai_request_windows
  where user_id = p_user_id
  for update;

  elapsed_seconds := greatest(0, floor(extract(epoch from (now() - request_row.window_started_at)))::integer);
  if elapsed_seconds >= window_seconds then
    update public.ai_request_windows
    set window_started_at = now(), request_count = 1, updated_at = now()
    where user_id = p_user_id
    returning * into request_row;
    return query select true, request_row.request_count, 0;
  end if;

  if request_row.request_count >= max_requests then
    return query select false, request_row.request_count, greatest(1, window_seconds - elapsed_seconds);
    return;
  end if;

  update public.ai_request_windows
  set request_count = request_count + 1, updated_at = now()
  where user_id = p_user_id
  returning * into request_row;
  return query select true, request_row.request_count, 0;
end;
$$;

revoke all on function public.consume_ai_rate_limit(uuid, integer, integer) from public;
grant execute on function public.consume_ai_rate_limit(uuid, integer, integer) to service_role;

-- Down:
--   drop function if exists public.consume_ai_rate_limit(uuid, integer, integer);
--   drop table if exists public.ai_request_windows;
