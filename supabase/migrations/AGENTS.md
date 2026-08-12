# AGENTS.md — supabase/migrations

Rules specific to database migrations. These extend and override the root `CLAUDE.md` for this directory.

## Before writing any migration

1. Check the existing migrations in this folder to understand current schema state
2. Match column names and types exactly to the build reference (`sandhya_build_reference.docx`)
3. Confirm whether the change affects any user-scoped table — if so, RLS policy updates are required in the same migration

## Naming

```
YYYYMMDDHHMMSS_short_description.sql
```

Examples:
- `20240601120000_create_texts_and_passages.sql`
- `20240608090000_add_rls_to_profiles.sql`
- `20240615140000_add_cached_answers.sql`

## Every migration must include

- **Up migration** — the change
- **Down migration** — how to reverse it, in a comment block at the bottom
- **RLS policies** — if creating or altering a user-scoped table, RLS goes in the same file
- **Indexes** — add them in the same migration as the table, not later

## RLS rules

RLS is required on: `profiles`, `conversations`, `messages`, `saved_items`, `journal_entries`, `feedback`, `usage_quotas`.

Standard pattern:

```sql
alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);
```

Never create a user-scoped table without RLS in the same migration.

## pgvector

The `passage_embeddings` table uses `vector(1536)` (or `vector(3072)` for larger models — check what's already in use before creating). Always create the ivfflat or hnsw index in the same migration:

```sql
create index on public.passage_embeddings
  using hnsw (embedding vector_cosine_ops);
```

If you change the embedding dimension, the entire column must be dropped and recreated — and the corpus must be re-embedded. Flag this loudly; do not do it silently.

## What not to do

- Do not drop columns without checking all queries and Edge Functions that reference them
- Do not rename columns — update all call sites in the same PR
- Do not run `drop table` or `truncate` in a migration unless it is explicitly approved
- Do not disable RLS on any table
- Do not write a migration that only works on a fresh database — it must apply cleanly on top of the current schema
- Do not apply migrations directly to the production Supabase project without explicit user instruction
