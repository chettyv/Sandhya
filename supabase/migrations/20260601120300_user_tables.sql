-- 20260601120300_user_tables.sql
-- User-side tables. Every table here owns rows scoped to a single user.
-- RLS is enabled on every table; no user-scoped table is created without it.

-- ---------------------------------------------------------------------------
-- profiles: 1:1 with auth.users
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id                uuid primary key references auth.users(id) on delete cascade,
  display_name      text,
  language_pref     text not null default 'en'
    check (language_pref in ('en', 'hi')),
  tradition_pref    text
    check (tradition_pref is null or tradition_pref in (
      'general', 'vaishnava', 'shaiva', 'shakta', 'smarta',
      'advaita', 'vishishtadvaita', 'dvaita', 'prefer_not_to_say'
    )),
  location          text,
  notification_time time,
  created_at        timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "users read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "users insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "users update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create a profile row when a new auth.users row is inserted.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- conversations + messages
-- ---------------------------------------------------------------------------
create table if not exists public.conversations (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  title      text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists conversations_user_id_updated_at_idx
  on public.conversations (user_id, updated_at desc);

alter table public.conversations enable row level security;

create policy "users read own conversations"
  on public.conversations for select using (auth.uid() = user_id);

create policy "users insert own conversations"
  on public.conversations for insert with check (auth.uid() = user_id);

create policy "users update own conversations"
  on public.conversations for update using (auth.uid() = user_id);

create policy "users delete own conversations"
  on public.conversations for delete using (auth.uid() = user_id);

create table if not exists public.messages (
  id                    uuid primary key default uuid_generate_v4(),
  conversation_id       uuid not null references public.conversations(id) on delete cascade,
  role                  text not null check (role in ('user', 'assistant')),
  content               text not null,
  structured_response   jsonb,
  retrieved_passage_ids uuid[] not null default '{}',
  model_used            text,
  tokens_in             integer,
  tokens_out            integer,
  cost_usd              numeric(10, 6),
  created_at            timestamptz not null default now()
);

create index if not exists messages_conversation_id_created_at_idx
  on public.messages (conversation_id, created_at);

alter table public.messages enable row level security;

-- Messages inherit access from their parent conversation.
create policy "users read messages in own conversations"
  on public.messages for select
  using (
    exists (
      select 1 from public.conversations c
      where c.id = messages.conversation_id and c.user_id = auth.uid()
    )
  );

create policy "users insert messages in own conversations"
  on public.messages for insert
  with check (
    exists (
      select 1 from public.conversations c
      where c.id = messages.conversation_id and c.user_id = auth.uid()
    )
  );

create policy "users delete messages in own conversations"
  on public.messages for delete
  using (
    exists (
      select 1 from public.conversations c
      where c.id = messages.conversation_id and c.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- saved_items: the user's library
-- ---------------------------------------------------------------------------
create table if not exists public.saved_items (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  item_type  text not null
    check (item_type in ('message', 'reflection', 'passage', 'practice', 'festival')),
  item_id    uuid not null,
  notes      text,
  created_at timestamptz not null default now(),
  unique (user_id, item_type, item_id)
);

create index if not exists saved_items_user_id_idx
  on public.saved_items (user_id, created_at desc);

alter table public.saved_items enable row level security;

create policy "users read own saved_items"
  on public.saved_items for select using (auth.uid() = user_id);
create policy "users insert own saved_items"
  on public.saved_items for insert with check (auth.uid() = user_id);
create policy "users update own saved_items"
  on public.saved_items for update using (auth.uid() = user_id);
create policy "users delete own saved_items"
  on public.saved_items for delete using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- journal_entries
-- ---------------------------------------------------------------------------
create table if not exists public.journal_entries (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  date       date not null default current_date,
  prompt     text,
  entry      text not null,
  mood       text,
  created_at timestamptz not null default now()
);

create index if not exists journal_entries_user_id_date_idx
  on public.journal_entries (user_id, date desc);

alter table public.journal_entries enable row level security;

create policy "users read own journal"
  on public.journal_entries for select using (auth.uid() = user_id);
create policy "users insert own journal"
  on public.journal_entries for insert with check (auth.uid() = user_id);
create policy "users update own journal"
  on public.journal_entries for update using (auth.uid() = user_id);
create policy "users delete own journal"
  on public.journal_entries for delete using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- feedback: report-an-answer flow
-- ---------------------------------------------------------------------------
create table if not exists public.feedback (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  message_id  uuid not null references public.messages(id) on delete cascade,
  issue_type  text not null
    check (issue_type in ('incorrect', 'sectarian', 'insensitive', 'other')),
  notes       text,
  status      text not null default 'pending'
    check (status in ('pending', 'reviewed', 'fixed')),
  admin_notes text,
  created_at  timestamptz not null default now()
);

create index if not exists feedback_status_idx on public.feedback (status, created_at desc);

alter table public.feedback enable row level security;

create policy "users read own feedback"
  on public.feedback for select using (auth.uid() = user_id);

create policy "users insert own feedback"
  on public.feedback for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1
      from public.messages m
      join public.conversations c on c.id = m.conversation_id
      where m.id = feedback.message_id and c.user_id = auth.uid()
    )
  );

-- Admins update via service-role key; no user update/delete policy on feedback.

-- ---------------------------------------------------------------------------
-- usage_quotas: free-tier limits and plan tier
--
-- One row per user. Edge Functions reset or increment ai_messages_count based
-- on whether date matches current_date.
-- ---------------------------------------------------------------------------
create table if not exists public.usage_quotas (
  user_id           uuid not null references public.profiles(id) on delete cascade,
  date              date not null default current_date,
  ai_messages_count integer not null default 0,
  plan              text not null default 'free'
    check (plan in ('free', 'plus_monthly', 'plus_annual', 'lifetime')),
  updated_at        timestamptz not null default now(),
  primary key (user_id)
);

alter table public.usage_quotas enable row level security;

create policy "users read own quota"
  on public.usage_quotas for select using (auth.uid() = user_id);

-- Inserts and increments happen via Edge Functions using the service-role
-- key (atomic Postgres function in Phase 5), so no user write policy.

-- ---------------------------------------------------------------------------
-- cached_answers: cost-control cache, server-side only
--
-- This table holds no user PII (just a question hash + structured response).
-- It is read/written by Edge Functions via the service-role key. RLS is
-- enabled with no policies so the anon/authenticated roles can never see it.
-- ---------------------------------------------------------------------------
create table if not exists public.cached_answers (
  id                  uuid primary key default uuid_generate_v4(),
  question_hash       text not null unique,
  question_text       text not null,
  structured_response jsonb not null,
  hit_count           integer not null default 0,
  last_used_at        timestamptz not null default now(),
  created_at          timestamptz not null default now()
);

create index if not exists cached_answers_last_used_idx
  on public.cached_answers (last_used_at desc);

alter table public.cached_answers enable row level security;
-- (no policies — service-role bypasses RLS, everyone else is denied)

-- Down:
--   drop table if exists public.cached_answers  cascade;
--   drop table if exists public.usage_quotas    cascade;
--   drop table if exists public.feedback        cascade;
--   drop table if exists public.journal_entries cascade;
--   drop table if exists public.saved_items     cascade;
--   drop table if exists public.messages        cascade;
--   drop table if exists public.conversations   cascade;
--   drop trigger if exists on_auth_user_created on auth.users;
--   drop function if exists public.handle_new_user();
--   drop table if exists public.profiles        cascade;
