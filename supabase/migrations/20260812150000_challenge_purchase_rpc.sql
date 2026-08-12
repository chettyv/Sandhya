-- Challenge purchases arrive through the RevenueCat webhook as one-off
-- (non-subscription) products named dd_challenge_<slug-with-underscores>.
-- These two helpers are the only write path into challenge_participants:
-- service-role only, called by the webhook after signature verification and
-- fenced event claiming. A purchase grants participation; a refund revokes it.

create or replace function public.apply_challenge_purchase(p_user_id uuid, p_challenge_slug text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.challenge_participants (challenge_id, user_id, access_source)
  select c.id, p_user_id, 'purchase'
  from public.challenges c
  where c.slug = p_challenge_slug
  on conflict (challenge_id, user_id) do nothing;
  return found;
exception
  when foreign_key_violation then
    -- The purchaser's profile no longer exists (account deleted between
    -- purchase and webhook delivery). Acknowledge without granting.
    return false;
end;
$$;

revoke all on function public.apply_challenge_purchase(uuid, text) from public, anon, authenticated;
grant execute on function public.apply_challenge_purchase(uuid, text) to service_role;

create or replace function public.revoke_challenge_purchase(p_user_id uuid, p_challenge_slug text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.challenge_participants cp
  using public.challenges c
  where cp.challenge_id = c.id
    and c.slug = p_challenge_slug
    and cp.user_id = p_user_id
    and cp.access_source = 'purchase';
  return found;
end;
$$;

revoke all on function public.revoke_challenge_purchase(uuid, text) from public, anon, authenticated;
grant execute on function public.revoke_challenge_purchase(uuid, text) to service_role;

-- Down:
--   drop function if exists public.revoke_challenge_purchase(uuid, text);
--   drop function if exists public.apply_challenge_purchase(uuid, text);
