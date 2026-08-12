-- Never revoke a source account for a RevenueCat TRANSFER whose destination
-- is not a registered Sandhya account. The webhook must be retryable in
-- that case so a later sign-up or corrected transfer can reconcile ownership.

create or replace function public.apply_subscription_transfer(
  p_destination_user_id uuid,
  p_destination_revenuecat_app_user_id text,
  p_source_user_ids uuid[],
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
  source_applied boolean := false;
  destination_applied boolean := false;
begin
  -- Check before revoking any source entitlement. A transfer to an unknown
  -- account must fail and be retried, never strand the existing entitlement.
  if not exists (
    select 1 from public.profiles where id = p_destination_user_id
  ) then
    raise exception 'Transfer destination is not a registered Sandhya user.';
  end if;

  update public.subscription_status
  set entitlement_id = null,
      product_id = null,
      plan = 'free',
      status = 'free',
      environment = p_environment,
      expires_at = null,
      latest_event_id = p_event_id,
      latest_event_at = p_latest_event_at,
      updated_at = now()
  where user_id = any(coalesce(p_source_user_ids, '{}'::uuid[]))
    and user_id <> p_destination_user_id
    and (
      latest_event_at is null
      or p_latest_event_at is null
      or p_latest_event_at >= latest_event_at
    );
  source_applied := found;

  update public.usage_quotas q
  set plan = 'free', updated_at = now()
  from public.subscription_status s
  where q.user_id = s.user_id
    and s.latest_event_id = p_event_id
    and q.user_id = any(coalesce(p_source_user_ids, '{}'::uuid[]))
    and q.user_id <> p_destination_user_id;

  insert into public.subscription_status (
    user_id, revenuecat_app_user_id, entitlement_id, product_id, plan,
    status, environment, expires_at, latest_event_id, latest_event_at
  )
  values (
    p_destination_user_id, p_destination_revenuecat_app_user_id,
    p_entitlement_id, p_product_id, p_plan, p_status, p_environment,
    p_expires_at, p_event_id, p_latest_event_at
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
  returning true into destination_applied;

  if coalesce(destination_applied, false) then
    insert into public.usage_quotas (user_id, date, ai_messages_count, plan, updated_at)
    values (p_destination_user_id, current_date, 0, p_plan, now())
    on conflict (user_id) do update
    set plan = excluded.plan,
        updated_at = now();
  end if;

  return query select coalesce(source_applied, false) or coalesce(destination_applied, false);
end;
$$;

revoke all on function public.apply_subscription_transfer(
  uuid, text, uuid[], text, text, text, text, text, timestamptz, text, timestamptz
) from public;
grant execute on function public.apply_subscription_transfer(
  uuid, text, uuid[], text, text, text, text, text, timestamptz, text, timestamptz
) to service_role;

-- Down: recreate public.apply_subscription_transfer from
-- 20260807050000_billing_transfer_reconciliation.sql.
