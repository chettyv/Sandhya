-- 20260601120100_source_content.sql
-- Source content tables: scripture, verses, commentaries, and embeddings.
--
-- These tables are owned by the product team and curated through the content
-- pipeline (packages/content-tools, Phase 3). They are read-only for
-- authenticated app users; writes go through the service-role key only.

-- ---------------------------------------------------------------------------
-- texts: top-level scriptures and source works
-- ---------------------------------------------------------------------------
create table if not exists public.texts (
  id                uuid primary key default uuid_generate_v4(),
  slug              text unique not null,
  title             text not null,
  title_sanskrit    text,
  category          text not null
    check (category in (
      'shruti', 'smriti', 'itihasa', 'purana', 'agama', 'modern_commentary'
    )),
  description       text,
  estimated_date    text,
  tradition_primary text not null default 'general'
    check (tradition_primary in (
      'general', 'vaishnava', 'shaiva', 'shakta', 'smarta', 'advaita',
      'vishishtadvaita', 'dvaita'
    )),
  cover_image_url   text,
  created_at        timestamptz not null default now()
);

create index if not exists texts_category_idx on public.texts (category);
create index if not exists texts_tradition_primary_idx on public.texts (tradition_primary);

-- ---------------------------------------------------------------------------
-- passages: individual verses, shlokas, or content chunks
-- ---------------------------------------------------------------------------
create table if not exists public.passages (
  id              uuid primary key default uuid_generate_v4(),
  text_id         uuid not null references public.texts(id) on delete cascade,
  section         text,
  sub_section     text,
  verse_number    text,
  order_index     integer not null default 0,
  original_text   text,
  transliteration text,
  translation_en  text,
  translation_hi  text,
  word_meanings   jsonb,
  created_at      timestamptz not null default now(),
  unique (text_id, verse_number)
);

create index if not exists passages_text_id_order_idx
  on public.passages (text_id, order_index);

create index if not exists passages_translation_en_trgm_idx
  on public.passages using gin (translation_en public.gin_trgm_ops);

-- ---------------------------------------------------------------------------
-- commentaries: one passage may have many commentaries from different teachers
-- ---------------------------------------------------------------------------
create table if not exists public.commentaries (
  id              uuid primary key default uuid_generate_v4(),
  passage_id      uuid not null references public.passages(id) on delete cascade,
  commentator     text not null,
  tradition       text,
  commentary_text text not null,
  licence         text not null default 'public_domain'
    check (licence in ('public_domain', 'licensed', 'original')),
  source_url      text,
  created_at      timestamptz not null default now()
);

create index if not exists commentaries_passage_id_idx
  on public.commentaries (passage_id);
create index if not exists commentaries_tradition_idx
  on public.commentaries (tradition);

-- ---------------------------------------------------------------------------
-- passage_embeddings: vectors for RAG retrieval
--
-- vector(1536) targets OpenAI text-embedding-3-small. If the embedding model
-- is ever swapped to a different dimension, this column must be dropped and
-- recreated and the full corpus re-embedded — flag loudly per the migration
-- checklist before doing so.
-- ---------------------------------------------------------------------------
create table if not exists public.passage_embeddings (
  id              uuid primary key default uuid_generate_v4(),
  passage_id      uuid not null references public.passages(id) on delete cascade,
  commentary_id   uuid references public.commentaries(id) on delete cascade,
  content_type    text not null
    check (content_type in ('translation', 'commentary', 'combined')),
  embedding       vector(1536) not null,
  embedding_model text not null,
  chunk_text      text not null,
  tokens          integer,
  created_at      timestamptz not null default now()
);

create index if not exists passage_embeddings_passage_id_idx
  on public.passage_embeddings (passage_id);

-- ivfflat with cosine distance, per the developer plan §2.2.
-- The lists=100 value is a reasonable default for a corpus in the low
-- thousands; revisit once the corpus is sized.
create index if not exists passage_embeddings_embedding_idx
  on public.passage_embeddings
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- ---------------------------------------------------------------------------
-- RLS: source content is publicly readable to authenticated users.
-- Writes happen only via service-role key (CLI / Edge Functions).
-- ---------------------------------------------------------------------------
alter table public.texts              enable row level security;
alter table public.passages           enable row level security;
alter table public.commentaries       enable row level security;
alter table public.passage_embeddings enable row level security;

create policy "authenticated read texts"
  on public.texts for select to authenticated using (true);

create policy "authenticated read passages"
  on public.passages for select to authenticated using (true);

create policy "authenticated read commentaries"
  on public.commentaries for select to authenticated using (true);

-- Embeddings are not exposed to the client — they're used inside the Edge
-- Function via the service-role key. No read policy is created so RLS denies
-- by default.

-- Down:
--   drop table if exists public.passage_embeddings cascade;
--   drop table if exists public.commentaries      cascade;
--   drop table if exists public.passages          cascade;
--   drop table if exists public.texts             cascade;
