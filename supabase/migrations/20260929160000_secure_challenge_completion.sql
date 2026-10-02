-- Complete a challenge night through a server-side state transition.
-- The client can request completion, but cannot choose the user, timestamp,
-- participation state, approval state, or unlock date.

create or replace function public.complete_challenge_night(
  p_challenge_id uuid,
  p_night integer
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_challenge public.challenges%rowtype;
  v_session public.challenge_sessions%rowtype;
  v_local_date date;
  v_unlock_date date;
  v_inserted integer;
begin
  if v_user_id is null then
    return jsonb_build_object('status', 'auth_required');
  end if;

  if p_challenge_id is null or p_night is null or p_night < 1 then
    return jsonb_build_object('status', 'invalid_request');
  end if;

  select * into v_challenge
  from public.challenges c
  where c.id = p_challenge_id and c.is_published;
  if not found then
    return jsonb_build_object('status', 'not_found');
  end if;

  if not exists (
    select 1 from public.challenge_participants cp
    where cp.challenge_id = v_challenge.id and cp.user_id = v_user_id
  ) then
    return jsonb_build_object('status', 'not_joined');
  end if;

  select * into v_session
  from public.challenge_sessions s
  where s.challenge_id = v_challenge.id
    and s.night = p_night
    and s.night <= v_challenge.nights
    and s.review_status = 'approved';
  if not found then
    return jsonb_build_object('status', 'not_found');
  end if;

  -- profiles.timezone is client-supplied free text; an unknown zone name
  -- must degrade to UTC, not make completion unavailable.
  begin
    v_local_date := (
      now() at time zone coalesce(
        nullif((select p.timezone from public.profiles p where p.id = v_user_id), ''),
        'UTC'
      )
    )::date;
  exception
    when others then
      v_local_date := (now() at time zone 'UTC')::date;
  end;
  v_unlock_date := v_challenge.start_date + (v_session.night - 1);

  if v_local_date < v_unlock_date then
    return jsonb_build_object('status', 'locked', 'unlock_date', v_unlock_date::text);
  end if;

  insert into public.challenge_night_completions (challenge_id, user_id, night, completed_at)
  values (v_challenge.id, v_user_id, v_session.night, now())
  on conflict (challenge_id, user_id, night) do nothing;
  get diagnostics v_inserted = row_count;

  if v_inserted = 1 then
    return jsonb_build_object('status', 'completed', 'completed_at', now());
  end if;
  return jsonb_build_object('status', 'already_completed');
end;
$$;

revoke all on function public.complete_challenge_night(uuid, integer) from public, anon, authenticated;
grant execute on function public.complete_challenge_night(uuid, integer) to authenticated, service_role;

-- Completion is now an RPC-only state transition. Keep read access for the
-- progress UI but remove the direct client insert path.
drop policy if exists "participants insert own night completions"
  on public.challenge_night_completions;
revoke insert on table public.challenge_night_completions from anon, authenticated;

-- Down:
--   grant insert on table public.challenge_night_completions to authenticated;
--   create policy "participants insert own night completions"
--     on public.challenge_night_completions for insert
--     with check (auth.uid() = user_id);
--   drop function if exists public.complete_challenge_night(uuid, integer);
