-- A device token must not be silently reassigned when a different account
-- submits the same opaque Expo token. Re-registration remains idempotent for
-- the owning account, while account changes must explicitly unregister first.

create or replace function public.register_device_push_token(
  p_user_id uuid,
  p_expo_push_token text,
  p_platform text,
  p_app_version text default null
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  registered boolean;
begin
  if p_user_id is null
     or nullif(trim(p_expo_push_token), '') is null
     or p_platform is null
     or not (p_platform = any (array['ios', 'android', 'web'])) then
    return false;
  end if;

  insert into public.device_push_tokens (
    user_id,
    expo_push_token,
    platform,
    app_version,
    enabled,
    last_seen_at,
    updated_at
  ) values (
    p_user_id,
    trim(p_expo_push_token),
    p_platform,
    left(nullif(trim(p_app_version), ''), 64),
    true,
    now(),
    now()
  )
  on conflict (expo_push_token) do update
  set platform = excluded.platform,
      app_version = excluded.app_version,
      enabled = true,
      last_seen_at = now(),
      updated_at = now()
  where public.device_push_tokens.user_id = p_user_id
  returning true into registered;

  return coalesce(registered, false);
end;
$$;

revoke all on function public.register_device_push_token(uuid, text, text, text) from public;
grant execute on function public.register_device_push_token(uuid, text, text, text) to service_role;

-- Down: remove the RPC after explicitly reviewing the ownership implications.
