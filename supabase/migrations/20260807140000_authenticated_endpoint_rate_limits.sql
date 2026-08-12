-- Protect authenticated non-AI endpoints that can perform expensive reads or
-- external-facing mutations. The AI window remains separate because its
-- policy and accounting semantics are different.

create table if not exists public.api_request_windows (
  user_id          uuid not null references auth.users(id) on delete cascade,
  operation        text not null check (operation in (
    'account_export',
    'account_delete',
    'push_token_mutation'
  )),
  window_started_at timestamptz not null default now(),
  request_count    integer not null default 0 check (request_count >= 0),
  updated_at       timestamptz not null default now(),
  primary key (user_id, operation)
);

alter table public.api_request_windows enable row level security;
revoke all on table public.api_request_windows from public, anon, authenticated;
grant select, insert, update on table public.api_request_windows to service_role;

create or replace function public.consume_api_request_rate_limit(
  p_user_id uuid,
  p_operation text,
  p_max_requests integer default 30,
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
  request_row public.api_request_windows%rowtype;
  window_seconds integer := greatest(1, least(coalesce(p_window_seconds, 60), 86400));
  max_requests integer := greatest(1, least(coalesce(p_max_requests, 30), 1000));
  elapsed_seconds integer;
begin
  if p_operation is null or p_operation not in (
    'account_export',
    'account_delete',
    'push_token_mutation'
  ) then
    raise exception 'Unsupported API rate-limit operation.';
  end if;

  insert into public.api_request_windows (
    user_id, operation, window_started_at, request_count, updated_at
  ) values (
    p_user_id, p_operation, now(), 0, now()
  )
  on conflict (user_id, operation) do nothing;

  select * into request_row
  from public.api_request_windows
  where user_id = p_user_id and operation = p_operation
  for update;

  elapsed_seconds := greatest(
    0,
    floor(extract(epoch from (now() - request_row.window_started_at)))::integer
  );
  if elapsed_seconds >= window_seconds then
    update public.api_request_windows
    set window_started_at = now(), request_count = 1, updated_at = now()
    where user_id = p_user_id and operation = p_operation
    returning * into request_row;
    return query select true, request_row.request_count, 0;
  end if;

  if request_row.request_count >= max_requests then
    return query select false, request_row.request_count,
      greatest(1, window_seconds - elapsed_seconds);
    return;
  end if;

  update public.api_request_windows
  set request_count = request_count + 1, updated_at = now()
  where user_id = p_user_id and operation = p_operation
  returning * into request_row;
  return query select true, request_row.request_count, 0;
end;
$$;

revoke all on function public.consume_api_request_rate_limit(uuid, text, integer, integer)
  from public;
grant execute on function public.consume_api_request_rate_limit(uuid, text, integer, integer)
  to service_role;

-- Down:
--   revoke all on function public.consume_api_request_rate_limit(uuid, text, integer, integer)
--     from service_role;
--   drop function if exists public.consume_api_request_rate_limit(uuid, text, integer, integer);
--   drop table if exists public.api_request_windows;
