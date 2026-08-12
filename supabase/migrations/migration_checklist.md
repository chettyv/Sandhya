# Supabase Migration Checklist — Dharma Daily

Run through this before applying any migration to the **production** Supabase project. For local development only, steps marked [PROD ONLY] can be skipped.

---

## 1. Before you write the migration

- [ ] Reviewed existing migrations in `supabase/migrations/` to confirm current schema state
- [ ] Column names and types match the build reference (`dharma_daily_build_reference.docx`)
- [ ] Checked whether any Edge Function, TanStack Query call, or client query references the columns being changed
- [ ] Checked whether the change affects synced journey history, notifications, billing, or account deletion flows

---

## 2. The migration file itself

- [ ] File named correctly: `YYYYMMDDHHMMSS_short_description.sql`
- [ ] Has a rollback/down script in a comment block at the bottom
- [ ] If adding a user-scoped table: RLS is enabled and policies are in the same file
- [ ] If adding a table with a foreign key: referenced table already exists in a prior migration
- [ ] If adding pgvector column: index (hnsw or ivfflat) is created in the same file
- [ ] No `drop table` or `truncate` without explicit approval
- [ ] No `alter table ... disable row level security`

---

## 3. Local testing [do this every time]

- [ ] Applied cleanly on a fresh local Supabase instance: `supabase db reset && supabase migration up`
- [ ] Applied cleanly on top of existing local data (not just a reset): `supabase migration up`
- [ ] RLS tested: confirmed a request with a different user's JWT cannot read or write the affected rows
- [ ] Relevant Edge Functions tested against the updated schema

---

## 4. Embedding impact check

- [ ] Does this migration change `passages`, `commentaries`, or `passage_embeddings`?
  - If yes: does the chunk text or embedding dimension change?
  - If the embedding model or dimension changes: **stop** — re-embedding the full corpus is required, plan and cost this separately before proceeding

---

## 5. Production apply [PROD ONLY]

- [ ] Taken a manual backup or confirmed Point-in-Time Recovery is enabled on the Supabase project
- [ ] Confirmed the migration has been reviewed by at least one other person (or yourself after a break)
- [ ] Applied via `supabase migration up --linked` (not by pasting SQL directly into the dashboard editor)
- [ ] Verified in the Supabase dashboard that the table/column/index exists as expected
- [ ] Verified RLS is still enabled on affected tables (dashboard → Table Editor → RLS column)
- [ ] Smoke-tested the relevant Edge Function or app flow against production

---

## 6. After applying

- [ ] PR merged and migration file committed to the repo
- [ ] Any related Edge Function changes deployed: `supabase functions deploy <name>`
- [ ] If embedding re-run was needed: corpus re-embedded and `passage_embeddings` row count verified
- [ ] Sentry / PostHog checked for new errors in the 30 minutes after deploy
