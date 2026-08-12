-- Dated, synchronised challenges (plan v2 §3.1: the Pray40 mechanic).
-- A challenge is a finite run of nightly sessions that unlock one local-date
-- at a time. Session content is paid product: the table is service-role only
-- and content reaches clients exclusively through get_challenge_session,
-- which checks participation and the unlock date. Participation rows are
-- created server-side by the payment path, never by the client.

create table if not exists public.challenges (
  id             uuid primary key default uuid_generate_v4(),
  slug           text not null unique check (slug ~ '^[a-z0-9-]{3,64}$'),
  title          text not null check (length(trim(title)) between 1 and 120),
  tagline        text not null default '' check (length(tagline) <= 280),
  start_date     date not null,
  nights         integer not null check (nights between 1 and 60),
  price_display  text not null default '' check (length(price_display) <= 20),
  is_published   boolean not null default false,
  created_at     timestamptz not null default now()
);

alter table public.challenges enable row level security;

create policy "anyone reads published challenges"
  on public.challenges for select
  to anon, authenticated
  using (is_published);

create table if not exists public.challenge_sessions (
  id                 uuid primary key default uuid_generate_v4(),
  challenge_id       uuid not null references public.challenges(id) on delete cascade,
  night              integer not null check (night between 1 and 60),
  title              text not null check (length(trim(title)) between 1 and 120),
  deity_focus        text not null default '' check (length(deity_focus) <= 120),
  estimated_minutes  integer not null default 10 check (estimated_minutes between 1 and 120),
  content            jsonb not null check (jsonb_typeof(content) = 'object'),
  audio_path         text,
  audio_slow_path    text,
  review_status      text not null default 'draft'
                     check (review_status in ('draft', 'in_review', 'approved')),
  reviewed_by        text not null default '',
  created_at         timestamptz not null default now(),
  unique (challenge_id, night),
  -- Mirrors the content-tools gate: nothing ships without a named reviewer.
  check (review_status <> 'approved' or length(trim(reviewed_by)) > 0)
);

create index if not exists challenge_sessions_challenge_night_idx
  on public.challenge_sessions (challenge_id, night);

-- Service-role only: no client policies. Paid content is served via RPC below.
alter table public.challenge_sessions enable row level security;

create table if not exists public.challenge_participants (
  challenge_id  uuid not null references public.challenges(id) on delete cascade,
  user_id       uuid not null references public.profiles(id) on delete cascade,
  access_source text not null check (access_source in ('purchase', 'granted')),
  joined_at     timestamptz not null default now(),
  primary key (challenge_id, user_id)
);

create index if not exists challenge_participants_user_idx
  on public.challenge_participants (user_id);

alter table public.challenge_participants enable row level security;

create policy "users read own challenge participation"
  on public.challenge_participants for select using (auth.uid() = user_id);

create table if not exists public.challenge_night_completions (
  challenge_id  uuid not null references public.challenges(id) on delete cascade,
  user_id       uuid not null references public.profiles(id) on delete cascade,
  night         integer not null check (night between 1 and 60),
  completed_at  timestamptz not null default now(),
  primary key (challenge_id, user_id, night)
);

alter table public.challenge_night_completions enable row level security;

create policy "users read own night completions"
  on public.challenge_night_completions for select using (auth.uid() = user_id);

create policy "participants insert own night completions"
  on public.challenge_night_completions for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.challenge_participants p
      where p.challenge_id = challenge_night_completions.challenge_id
        and p.user_id = auth.uid()
    )
  );

-- The join screen: public aggregate metadata for one published challenge.
-- Participation count is an aggregate with no PII; session listing exposes
-- approved metadata only, never content. Safe for anon (web arrival pages).
create or replace function public.get_challenge_overview(p_slug text)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'challenge', jsonb_build_object(
      'id', c.id,
      'slug', c.slug,
      'title', c.title,
      'tagline', c.tagline,
      'start_date', c.start_date,
      'nights', c.nights,
      'price_display', c.price_display
    ),
    'participant_count',
      (select count(*) from public.challenge_participants cp where cp.challenge_id = c.id),
    'joined',
      auth.uid() is not null and exists (
        select 1 from public.challenge_participants cp
        where cp.challenge_id = c.id and cp.user_id = auth.uid()
      ),
    'completed_nights', coalesce(
      (
        select jsonb_agg(nc.night order by nc.night)
        from public.challenge_night_completions nc
        where nc.challenge_id = c.id and nc.user_id = auth.uid()
      ),
      '[]'::jsonb
    ),
    'sessions', coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'night', s.night,
            'title', s.title,
            'deity_focus', s.deity_focus,
            'estimated_minutes', s.estimated_minutes,
            'unlock_date', (c.start_date + (s.night - 1))::text
          )
          order by s.night
        )
        from public.challenge_sessions s
        where s.challenge_id = c.id and s.review_status = 'approved'
      ),
      '[]'::jsonb
    )
  )
  from public.challenges c
  where c.slug = p_slug and c.is_published;
$$;

revoke all on function public.get_challenge_overview(text) from public, anon, authenticated;
grant execute on function public.get_challenge_overview(text) to anon, authenticated, service_role;

-- Full session content for a joined participant. Unlocks by the user's local
-- date (profile timezone, UTC fallback): night N opens on start_date + N - 1.
-- Late joiners see all past nights. Returns a status object rather than
-- raising, so the client can render locked/not-joined states without
-- treating them as errors.
create or replace function public.get_challenge_session(p_slug text, p_night integer)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_challenge public.challenges%rowtype;
  v_session public.challenge_sessions%rowtype;
  v_local_date date;
  v_unlock_date date;
begin
  if auth.uid() is null then
    return jsonb_build_object('status', 'auth_required');
  end if;

  select * into v_challenge from public.challenges c
  where c.slug = p_slug and c.is_published;
  if not found then
    return jsonb_build_object('status', 'not_found');
  end if;

  if not exists (
    select 1 from public.challenge_participants cp
    where cp.challenge_id = v_challenge.id and cp.user_id = auth.uid()
  ) then
    return jsonb_build_object('status', 'not_joined');
  end if;

  select * into v_session from public.challenge_sessions s
  where s.challenge_id = v_challenge.id
    and s.night = p_night
    and s.review_status = 'approved';
  if not found then
    return jsonb_build_object('status', 'not_found');
  end if;

  -- profiles.timezone is client-supplied free text; an unknown zone name
  -- must degrade to UTC, not error.
  begin
    v_local_date := (
      now() at time zone coalesce(
        nullif((select p.timezone from public.profiles p where p.id = auth.uid()), ''),
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

  return jsonb_build_object(
    'status', 'ok',
    'session', jsonb_build_object(
      'night', v_session.night,
      'title', v_session.title,
      'deity_focus', v_session.deity_focus,
      'estimated_minutes', v_session.estimated_minutes,
      'content', v_session.content,
      'audio_path', v_session.audio_path,
      'audio_slow_path', v_session.audio_slow_path,
      'unlock_date', v_unlock_date::text,
      'completed', exists (
        select 1 from public.challenge_night_completions nc
        where nc.challenge_id = v_challenge.id
          and nc.user_id = auth.uid()
          and nc.night = v_session.night
      )
    )
  );
end;
$$;

revoke all on function public.get_challenge_session(text, integer) from public, anon, authenticated;
grant execute on function public.get_challenge_session(text, integer) to authenticated, service_role;

-- Down:
--   drop function if exists public.get_challenge_session(text, integer);
--   drop function if exists public.get_challenge_overview(text);
--   drop table if exists public.challenge_night_completions;
--   drop table if exists public.challenge_participants;
--   drop table if exists public.challenge_sessions;
--   drop table if exists public.challenges;
