-- 20260601120200_curated_content.sql
-- Curated, hand-written content served without going through the LLM.
--
-- Per the developer plan: "Static content first, AI as fallback." Daily
-- reflections, festivals, practice guides, concepts, and deities are pre-
-- written and served straight from Postgres. RLS allows reads to any
-- authenticated user; writes are admin-only via the service-role key.
--
-- Premium gating: rows flagged is_premium = true are filtered out at the
-- Edge Function layer based on the user's plan from public.usage_quotas,
-- not in RLS — keeping the policy simple and the gating logic explicit.

-- ---------------------------------------------------------------------------
-- daily_reflections: one per date_slot 1..366, rotated yearly
-- ---------------------------------------------------------------------------
create table if not exists public.daily_reflections (
  id                uuid primary key default uuid_generate_v4(),
  date_slot         integer not null
    check (date_slot between 1 and 366),
  title             text not null,
  shloka_passage_id uuid references public.passages(id) on delete set null,
  reflection_text   text not null,
  practice_prompt   text,
  journal_prompt    text,
  tradition         text not null default 'general',
  tags              text[] not null default '{}',
  audio_url         text,
  is_premium        boolean not null default false,
  created_at        timestamptz not null default now(),
  unique (date_slot, tradition)
);

create index if not exists daily_reflections_date_slot_idx
  on public.daily_reflections (date_slot);

-- ---------------------------------------------------------------------------
-- festivals
-- ---------------------------------------------------------------------------
create table if not exists public.festivals (
  id                  uuid primary key default uuid_generate_v4(),
  slug                text unique not null,
  name                text not null,
  name_variants       text[] not null default '{}',
  short_description   text,
  full_story          text,
  meaning             text,
  home_observance     text,
  regional_variations jsonb,
  traditions          text[] not null default '{}',
  tithi_rule          text,
  upcoming_dates      date[] not null default '{}',
  duration_days       integer not null default 1,
  image_url           text,
  is_premium          boolean not null default false,
  created_at          timestamptz not null default now()
);

create index if not exists festivals_upcoming_dates_idx
  on public.festivals using gin (upcoming_dates);

-- ---------------------------------------------------------------------------
-- practice_guides
-- ---------------------------------------------------------------------------
create table if not exists public.practice_guides (
  id               uuid primary key default uuid_generate_v4(),
  slug             text unique not null,
  title            text not null,
  category         text not null
    check (category in ('puja', 'mantra', 'meditation', 'fasting', 'diya')),
  difficulty       text not null default 'beginner'
    check (difficulty in ('beginner', 'intermediate', 'advanced')),
  duration_minutes integer,
  steps            jsonb not null default '[]'::jsonb,
  materials_needed text[] not null default '{}',
  tradition_notes  text,
  warnings         text,
  audio_url        text,
  is_premium       boolean not null default false,
  created_at       timestamptz not null default now()
);

create index if not exists practice_guides_category_idx
  on public.practice_guides (category);

-- ---------------------------------------------------------------------------
-- concepts: glossary entries (dharma, karma, atman, ...)
-- ---------------------------------------------------------------------------
create table if not exists public.concepts (
  id                   uuid primary key default uuid_generate_v4(),
  slug                 text unique not null,
  term                 text not null,
  term_sanskrit        text,
  short_definition     text,
  full_explanation     text,
  examples             text,
  related_concepts     text[] not null default '{}',
  related_passages     uuid[] not null default '{}',
  tradition_variations jsonb,
  created_at           timestamptz not null default now()
);

create index if not exists concepts_term_trgm_idx
  on public.concepts using gin (term public.gin_trgm_ops);

-- ---------------------------------------------------------------------------
-- deities
-- ---------------------------------------------------------------------------
create table if not exists public.deities (
  id                   uuid primary key default uuid_generate_v4(),
  slug                 text unique not null,
  name                 text not null,
  other_names          text[] not null default '{}',
  short_description    text,
  full_description     text,
  associated_concepts  text[] not null default '{}',
  associated_festivals uuid[] not null default '{}',
  traditions           text[] not null default '{}',
  image_url            text,
  created_at           timestamptz not null default now()
);

create index if not exists deities_name_trgm_idx
  on public.deities using gin (name public.gin_trgm_ops);

-- ---------------------------------------------------------------------------
-- RLS: all curated content is publicly readable to authenticated users.
-- Writes happen via service-role only.
-- ---------------------------------------------------------------------------
alter table public.daily_reflections enable row level security;
alter table public.festivals         enable row level security;
alter table public.practice_guides   enable row level security;
alter table public.concepts          enable row level security;
alter table public.deities           enable row level security;

create policy "authenticated read daily_reflections"
  on public.daily_reflections for select to authenticated using (true);

create policy "authenticated read festivals"
  on public.festivals for select to authenticated using (true);

create policy "authenticated read practice_guides"
  on public.practice_guides for select to authenticated using (true);

create policy "authenticated read concepts"
  on public.concepts for select to authenticated using (true);

create policy "authenticated read deities"
  on public.deities for select to authenticated using (true);

-- Down:
--   drop table if exists public.deities           cascade;
--   drop table if exists public.concepts          cascade;
--   drop table if exists public.practice_guides   cascade;
--   drop table if exists public.festivals         cascade;
--   drop table if exists public.daily_reflections cascade;
