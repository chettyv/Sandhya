-- Late RevenueCat retries must be acknowledged after account deletion.
-- Without this guard, the profiles foreign key rejects the event forever and
-- the provider keeps retrying a webhook for a user who no longer exists.

create or replace function public.apply_subscription_event(
  p_user_id uuid,
  p_revenuecat_app_user_id text,
  p_entitlement_id text,
  p_product_id text,
  p_plan text,
  p_status text,
  p_environment text,
  p_expires_at timestamptz,
  p_event_id text,
  p_latest_event_at timestamptz
)
returns table (applied boolean)
language plpgsql
security definer
set search_path = public
as $$
declare
  event_applied boolean;
begin
  if not exists (select 1 from public.profiles where id = p_user_id) then
    return query select false;
    return;
  end if;

  insert into public.subscription_status (
    user_id, revenuecat_app_user_id, entitlement_id, product_id, plan,
    status, environment, expires_at, latest_event_id, latest_event_at
  )
  values (
    p_user_id, p_revenuecat_app_user_id, p_entitlement_id, p_product_id, p_plan,
    p_status, p_environment, p_expires_at, p_event_id, p_latest_event_at
  )
  on conflict (user_id) do update
  set revenuecat_app_user_id = excluded.revenuecat_app_user_id,
      entitlement_id = excluded.entitlement_id,
      product_id = excluded.product_id,
      plan = excluded.plan,
      status = excluded.status,
      environment = excluded.environment,
      expires_at = excluded.expires_at,
      latest_event_id = excluded.latest_event_id,
      latest_event_at = excluded.latest_event_at,
      updated_at = now()
  where public.subscription_status.latest_event_at is null
     or excluded.latest_event_at is null
     or excluded.latest_event_at >= public.subscription_status.latest_event_at
  returning true into event_applied;

  if not coalesce(event_applied, false) then
    return query select false;
    return;
  end if;

  insert into public.usage_quotas (user_id, date, ai_messages_count, plan, updated_at)
  values (p_user_id, current_date, 0, p_plan, now())
  on conflict (user_id) do update
  set plan = excluded.plan,
      updated_at = now();
  return query select true;
end;
$$;

revoke all on function public.apply_subscription_event(uuid, text, text, text, text, text, text, timestamptz, text, timestamptz) from public;
grant execute on function public.apply_subscription_event(uuid, text, text, text, text, text, text, timestamptz, text, timestamptz) to service_role;

-- Down: recreate the previous function body from
-- 20260805210000_account_billing_notifications.sql.
