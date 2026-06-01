# supabase/

Database migrations and Edge Functions for the Dharma Daily backend.

## Layout

```
supabase/
├── migrations/   # SQL migrations, timestamped (YYYYMMDDHHMMSS_*). Phase 2 ✔
├── functions/    # Deno Edge Functions (/ask, /conversations, ...). Phase 5 — pending
└── seed.sql      # Minimal seed data for local dev (Phase 2 ✔)
```

## Phase 2 status — schema, RLS, seed (done)

Migrations applied in order:

| File                                            | What it does                                                                                                                                                                 |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `migrations/20260601120000_extensions.sql`      | `uuid-ossp`, `vector`, `pg_trgm`                                                                                                                                             |
| `migrations/20260601120100_source_content.sql`  | `texts`, `passages`, `commentaries`, `passage_embeddings` (1536-dim `ivfflat` cosine index) + read-only RLS                                                                  |
| `migrations/20260601120200_curated_content.sql` | `daily_reflections`, `festivals`, `practice_guides`, `concepts`, `deities` + read-only RLS                                                                                   |
| `migrations/20260601120300_user_tables.sql`     | `profiles`, `conversations`, `messages`, `saved_items`, `journal_entries`, `feedback`, `usage_quotas`, `cached_answers` + owner-scoped RLS + `auth.users → profiles` trigger |
| `seed.sql`                                      | 1 text, 3 passages, 3 daily reflections, 1 festival, 1 practice guide (placeholders)                                                                                         |

Row Level Security:

- **Source + curated content** — readable by any authenticated user; writes restricted to service-role (used by `content-tools` and Edge Functions).
- **User-side tables** — every row scoped to `auth.uid()`. A new `auth.users` row auto-creates a matching `profiles` row via `handle_new_user()`.
- **`cached_answers`** — RLS enabled with no policies; only service-role can touch it.
- **`passage_embeddings`** — RLS enabled with no read policy; embeddings stay server-side.

Premium gating (`is_premium`) is enforced at the Edge Function layer against the user's current `usage_quotas.plan`, not in RLS — keeping policies simple and the gating logic explicit.

### Local dev

The Supabase CLI is installed separately (`npm i -g supabase` or via Scoop/Homebrew). It is **not** a workspace dependency to keep the JS install lean.

```bash
# Start a local Supabase stack
supabase start

# Apply migrations + seed
supabase db reset            # drops and replays migrations + seed.sql

# Test RLS with two users (recommended — developer plan §2.7)
#   - sign in as user A, insert a conversation
#   - sign in as user B, confirm SELECT returns nothing
```

### Generating typed rows

Hand-written row types live in `packages/shared-types/src/database.ts` and match the migrations one-to-one. Once a dev project is provisioned, replace them with generated types:

```bash
pnpm dlx supabase gen types typescript \
  --project-id <project-id> \
  --schema public \
  > packages/shared-types/src/generated-database.ts
```

Then update `packages/shared-types/src/index.ts` to re-export from `generated-database` instead of `database`.

## Phase 5 status — Edge Functions (pending)

`functions/` is intentionally empty. Phase 5 (developer plan §5) adds the `/ask`, `/conversations`, `/daily-reflection`, `/festivals/*`, `/concepts/*`, `/practice-guides`, `/saved-items`, `/journal`, `/feedback`, `/me`, and `/me/quota` endpoints.
