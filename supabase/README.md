# supabase/

Database migrations and Edge Functions for the Dharma Daily backend.

## Layout

```
supabase/
├── migrations/   # SQL migrations, numbered (0001_*, 0002_*, ...). Authored in Phase 2.
└── functions/    # Deno Edge Functions (/ask, /conversations, /daily-reflection, ...). Authored in Phase 5.
```

## Phase 1 status

Both folders are intentionally empty. Phase 2 (developer plan §2) lays down:

1. `0001_extensions.sql` — enable `uuid-ossp`, `vector`, `pg_trgm`
2. Source content tables: `texts`, `passages`, `commentaries`, `passage_embeddings` (with `ivfflat` index)
3. Curated content tables: `daily_reflections`, `festivals`, `practice_guides`, `concepts`, `deities`
4. User-side tables: `profiles`, `conversations`, `messages`, `saved_items`, `journal_entries`, `feedback`, `usage_quotas`, `cached_answers`
5. RLS policies on every user-scoped table
6. Seed data
7. Typegen via `supabase gen types` → `packages/shared-types`

Phase 5 (developer plan §5) adds the Edge Functions.

## Local dev

The Supabase CLI is installed separately (`npm i -g supabase` or via Scoop/Homebrew). It is **not** a workspace dependency to keep the JS install lean.
