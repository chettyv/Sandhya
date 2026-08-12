# supabase/

Database migrations and Edge Functions for the Dharma Daily backend.

## Layout

```
supabase/
├── migrations/   # SQL migrations, timestamped (YYYYMMDDHHMMSS_*). Phase 2 ✔
├── functions/    # Deno Edge Functions for RAG, account, billing, push, and moderation.
└── seed.sql      # Minimal deterministic local-dev fixtures
```

## Phase 2 status — schema, RLS, seed (done)

Migrations applied in order:

| File                                                                    | What it does                                                                                                                                                                                                                                          |
| ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `migrations/20260601120000_extensions.sql`                              | `uuid-ossp`, `vector`, `pg_trgm`                                                                                                                                                                                                                      |
| `migrations/20260601120100_source_content.sql`                          | `texts`, `passages`, `commentaries`, `passage_embeddings` (1536-dim `ivfflat` cosine index) + read-only RLS                                                                                                                                           |
| `migrations/20260601120200_curated_content.sql`                         | `daily_reflections`, `festivals`, `practice_guides`, `concepts`, `deities` + read-only RLS                                                                                                                                                            |
| `migrations/20260601120300_user_tables.sql`                             | `profiles`, `conversations`, `messages`, `saved_items`, `journal_entries`, `feedback`, `usage_quotas`, `cached_answers` + owner-scoped RLS + `auth.users → profiles` trigger                                                                          |
| `migrations/20260806200000_app_authored_catalog.sql`                    | Generated, idempotent catalog rows: 50 concepts, 20 practices, 30 reflections, and 21 festival explainers; authored preview dates are preserved while date-less explainers remain undated until reviewed calendar data is loaded.                     |
| `migrations/20260807090000_billing_event_claim_lease.sql`               | Restores the ten-minute billing-event processing lease and distinguishes active in-flight retries from already-processed duplicates.                                                                                                                  |
| `migrations/20260807100000_billing_event_lease_fencing.sql`             | Adds a per-claim fencing token so stale workers cannot complete or release a billing event after a newer worker reclaims its expired lease.                                                                                                           |
| `migrations/20260807110000_notification_delivery_lease_fencing.sql`     | Adds the same claim-token fencing to daily notification delivery completion and release.                                                                                                                                                              |
| `migrations/20260807120000_notification_push_receipt_lease_fencing.sql` | Fences Expo receipt polling so a stale worker cannot finalize a reclaimed receipt ticket.                                                                                                                                                             |
| `migrations/20260807130000_billing_transfer_destination_guard.sql`      | Refuses to revoke a transfer source when the destination is not a registered Dharma Daily account, leaving the signed event retryable.                                                                                                                |
| `migrations/20260807140000_authenticated_endpoint_rate_limits.sql`      | Adds server-only, operation-scoped rate limits for account export/deletion and push-token mutations, with retry-safe response metadata.                                                                                                               |
| `migrations/20260807150000_notification_recipient_batching.sql`         | Bounds each daily notification invocation to 500 users while retaining all active device tokens for each selected user.                                                                                                                               |
| `migrations/20260807160000_admin_audit_log.sql`                         | Adds a server-only, outcome-tracked audit trail for privileged content, feedback, and cache operations without persisting raw payloads.                                                                                                               |
| `seed.sql`                                                              | Deterministic local-dev starter data with app-authored glossary/practice entries and one premium row to exercise the free/Plus boundary; production scripture and calendar content comes from the rights-audited corpus and curated-content workflow. |

Row Level Security:

- **Source + curated content** — metadata is readable to authenticated users; passage/commentary excerpts are rights-filtered by licence and subscription, while writes remain restricted to service-role (used by `content-tools` and Edge Functions).
- **User-side tables** — every row scoped to `auth.uid()`. A new `auth.users` row auto-creates a matching `profiles` row via `handle_new_user()`.
- **`cached_answers`** — RLS enabled with no policies; only service-role can touch it.
- **`passage_embeddings`** — RLS enabled with no read policy; embeddings stay server-side.
- Cache lookups use `question_hash`; raw user question text is intentionally not persisted in cache rows.

The authored catalog migration is generated from the mobile catalog so the
connected backend and offline fallback cannot silently drift:

```bash
pnpm backend:check
pnpm backend:release-contract
pnpm content:generate-authored-migration
pnpm backend:curated-content-check
```

Festival explainers intentionally do not invent calendar dates. Explicitly
authored preview dates are synchronized into `upcoming_dates`; all other rows
remain date-less until reviewed, location-aware calendar data is loaded through
the admin/content workflow.

Premium gating (`is_premium`) is enforced both in the Edge Function layer and in RLS against the user's current, non-expired subscription state. Licence gating is also enforced before direct excerpt reads and before RAG retrieval.

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

## Phase 5 status — RAG backend

The first production backend endpoint is `functions/ask/index.ts`.

It implements the authenticated RAG lifecycle:

1. Verify the user JWT.
2. Run the safety gate before retrieval/model calls.
3. Resolve the user's tradition preference and build a policy/model-aware cache key; first-person and personal-reflection questions deliberately bypass the global cache.
4. Consume the daily quota before the cache return, so cached answers cannot bypass the free allowance.
5. Check `cached_answers`; only grounded answers with valid citations are cached, and valid cache hits avoid embedding/model APIs while still persisting an auditable assistant message. The monthly spend cap is checked only for cache misses, because cached answers have no provider cost.
6. Embed the question with the configured 1536-dim embedding model and validate the vector dimension before pgvector retrieval.
7. Retrieve filtered pgvector chunks with `match_passage_embeddings`; the RPC
   requires the active embedding model so vectors from a different model
   cannot be mixed merely because their dimensions match.
8. Generate a structured JSON answer server-side.
9. Filter citations to retrieved passage IDs only.
10. Persist user/assistant messages with audit metadata.

The default answer provider is DeepSeek via the OpenAI-compatible chat
completions path:

```bash
LLM_PROVIDER=deepseek
LLM_DEFAULT_MODEL=deepseek-v4-flash
```

This keeps v1 answer generation on a cheap backend-only model. OpenAI mini
models can be used with `LLM_PROVIDER=openai-compatible`; Anthropic Haiku can be
used with `LLM_PROVIDER=anthropic`. The cache key includes both the answer and
embedding model, so provider/model changes do not silently serve answers
generated under an older model. Cache rights validation also requires a
current-model embedding for every cited passage and remains fail-closed across
all provenance rows.

The supporting migration is `migrations/20260708120000_rag_rpc.sql`, which adds:

- `content_sources` for source provenance and rights metadata
- duplicate-safe embedding identity via `(embedding_model, chunk_hash)`
- stricter `cached_answers` validation for structured responses and retrieved citation IDs
- stricter `messages` insert/audit constraints so clients cannot spoof assistant audit rows
- `match_passage_embeddings`
- `record_cached_answer_hit`
- `check_ai_monthly_budget`
- `consume_ai_message`

The account/product migration is `migrations/20260805210000_account_billing_notifications.sql`. It adds secure push-token storage and delivery claims, subscription state, idempotent RevenueCat webhook application, and the conversation timestamp trigger. The accompanying Edge Functions are:

- `account` — authenticated, explicit-confirmation account deletion
- `register-push-token` — authenticated Expo token registration/removal
- `send-daily-reflections` — cron-secret and Expo-token protected delivery worker; it persists Expo push tickets and polls delayed receipts so invalid devices can be disabled after APNs/FCM processing
- `revenuecat-webhook` — raw-body HMAC verification, replay protection, and plan sync
- `admin-feedback` — Supabase `app_metadata.role = "admin"` protected moderation queue
- `admin-content` — allowlisted curator CRUD for reviewed content resources
- `admin-ops` — PII-minimized dashboard, cost/cache inspection, user overview, billing/push health counters, audit history, and explicit cache invalidation

The authenticated account and push functions also use the server-only
`consume_api_request_rate_limit` RPC. Account exports and deletion attempts are
limited to three requests per hour per user; push-token mutations
are limited to sixty per minute. Exceeded limits return `429` with a
`Retry-After` header, while the rate-limit rows remain inaccessible to client
roles.

All backend functions use the shared `_shared/observability.ts` adapter for
best-effort Sentry and PostHog error events. Telemetry is redacted to function
name, error type/message, and operational tags; prompts, answers, request
bodies, tokens, and user IDs are not sent. Leave the integration variables
unset in local development, or configure `SENTRY_DSN_BACKEND`,
`POSTHOG_API_KEY`, and `POSTHOG_HOST` in the Edge Function environment.

Set RevenueCat `app_user_id` to the Supabase user UUID (or `supabase:<uuid>`). The webhook and scheduled sender intentionally disable Supabase's default JWT gate in `supabase/config.toml` because they authenticate with their own HMAC/cron secret; all other functions validate a user bearer token.

The follow-up migrations `migrations/20260805220000_activity_history.sql` and
`migrations/20260806235000_activity_integrity.sql` add owner-scoped
`practice_completions` and `activity_days` tables, reject implausible future dates,
and derive activity days transactionally from journal/practice inserts. The mobile
app uses these to restore practice history and calculate a gentle current-day streak
after sign-in; they are not used for entitlement or quota decisions.

The follow-up migration `migrations/20260805230000_premium_content_rls.sql` reinforces the free/Plus boundary in Postgres: free users can read non-premium curated rows, while users with a current non-free subscription (including a valid cancellation grace period) can read premium rows. The later `migrations/20260806010000_source_excerpt_rls.sql` applies the licence gate to direct source excerpts too: untracked passages stay hidden, free users receive only public-domain/original excerpts, and Plus receives licensed excerpts only when the source tracker allows display. The mobile UI applies the same boundary for clear paywall messaging, and daily push delivery selects free-safe reflections.

The follow-up migration `migrations/20260806020000_saved_content_types.sql` lets users sync saved concepts and sacred-text entries in addition to reflections, practices, festivals, passages, and assistant messages.

The follow-up migration `migrations/20260806081000_saved_deity_type.sql` extends that same saved-items boundary to deity entries in the Learn library.

The follow-up migration `migrations/20260806030000_entitlement_quota_guard.sql` makes the quota RPC consult the current subscription expiry before granting unlimited Plus questions, so a delayed billing webhook cannot extend access indefinitely.

The follow-up migration `migrations/20260806040000_source_excerpt_policy_helpers.sql` keeps the embeddings table private while evaluating excerpt rights through narrowly-scoped `SECURITY DEFINER` policy helpers.

The follow-up migration `migrations/20260806050000_billing_event_retry_safety.sql` keeps
unprocessed RevenueCat events claimable. If a delivery fails after its event row is
created but before entitlement state is persisted, a provider retry can safely
resume processing; already-processed events remain idempotently acknowledged.

The follow-up migration `migrations/20260806180000_billing_deleted_user_guard.sql`
also makes late provider retries after account deletion a safe no-op, so a deleted
profile cannot leave RevenueCat retrying a permanently failing foreign-key write.

The follow-up migration `migrations/20260807050000_billing_transfer_reconciliation.sql`
handles RevenueCat `TRANSFER` events atomically: it revokes source-account access,
reconciles the destination from RevenueCat Customer Info, and orders both sides by
the provider event timestamp. Set the server-only `REVENUECAT_API_KEY` secret so
restore-to-another-account flows can be reconciled instead of merely acknowledged.

The follow-up migration `migrations/20260807060000_rls_update_owner_guards.sql`
adds `WITH CHECK` predicates to every owner-scoped update policy, preventing a
user from moving an existing profile, conversation, saved item, journal row, or
device token to another user's UUID during an update.

The follow-up migration `migrations/20260807070000_push_token_owner_guard.sql`
makes push-token registration atomic and refuses to reassign an existing Expo
token across accounts. A device changing accounts must unregister while the
original account is active before the new account can register the token.

The follow-up migration `migrations/20260807080000_trigger_function_execute_guards.sql`
revokes client-role execution of trigger-only functions, including the profile
creation and timestamp-maintenance triggers.

Production entitlement checks require RevenueCat events to be marked PRODUCTION.
Events with an unknown or malformed environment are ignored without an
entitlement mutation; TRANSFER events still revoke the source atomically while
leaving the destination free until a known-environment lifecycle event arrives.
Keep REVENUECAT_ALLOW_SANDBOX=false in production and enable it only in an
isolated test project.

The migration `20260806070000_billing_environment_config.sql` adds a second,
service-only database guard. An isolated test project must explicitly set
`billing_runtime_config.allow_sandbox` to true as well; production defaults to
false even if a webhook secret is misconfigured.

The follow-up migration `migrations/20260806060000_rag_rights_fail_closed.sql`
replaces the retrieval RPC with a fail-closed provenance check. Missing
`content_sources` rows or missing embed/excerpt permissions are never eligible
for RAG retrieval.

The follow-up migration `migrations/20260806160000_rag_rights_require_all_sources.sql`
also requires every applicable licence record to pass. A public-domain
commentary cannot mask a licensed source document, and direct excerpt policies
use the same all-sources rule.

The follow-up migration `migrations/20260806230000_cached_answer_rights.sql`
rechecks cached answer passage IDs against the current provenance, licence,
tradition, language, excerpt, and embedding policy. If that check fails, the
request falls through to fresh retrieval instead of serving a stale cache hit.
The same policy check is also enforced by the reusable `SupabaseRagStore`, and
both clients fail closed if the scalar rights RPC response is unavailable or
malformed.

The follow-up migrations `20260807020000_embedding_model_filter.sql` and
`20260807030000_cached_answer_model_filter.sql` require vector retrieval and
cache validation to use the active embedding model, preventing same-dimension
vectors from different models being mixed. `20260807040000_feedback_admin_notes_private.sql`
removes direct consumer reads of moderator-only feedback notes.

The follow-up migration `migrations/20260806080000_notification_delivery_window.sql`
allows up to fifteen minutes of scheduler jitter for daily reminders while the
unique delivery record prevents duplicate sends.

The follow-up migration `migrations/20260807150000_notification_recipient_batching.sql`
limits each daily worker call to 500 due users (clamped to 1,000) and joins all
active tokens for those users. This prevents a large recipient set or a
multi-device account from causing partial delivery or a worker timeout.

The follow-up migration `migrations/20260807160000_admin_audit_log.sql` records
privileged content, feedback, and cache actions as pending events before the
operation and closes them as succeeded or failed. The audit table is server-only,
and the log contains only the admin/resource identifiers and a cache hash where
needed; prompts, answers, and submitted content payloads are never copied into
the audit record.

The follow-up migration `migrations/20260806220000_notification_push_receipts.sql`
stores Expo push tickets in a server-only table and adds retry-safe receipt
claims. The daily worker checks receipts after Expo has had time to hand off to
APNs/FCM, disables `DeviceNotRegistered` tokens, and expires receipts that are
older than Expo's receipt-retention window.

The follow-up migration `migrations/20260807120000_notification_push_receipt_lease_fencing.sql`
adds per-ticket claim tokens so an older receipt worker cannot record or release
a ticket after a newer worker reclaims its expired lease.

The follow-up migration `migrations/20260806090000_source_rights_metadata_guard.sql`
turns incomplete source-rights rows into deny-by-default records and prevents
future embed/store/excerpt approvals without a source URL, copyright status, and
translator where required.

The follow-up migration `migrations/20260806100000_rag_response_note_limit.sql`
keeps persisted structured answers bounded to six citations, eight tradition
notes, and the same field-length limits enforced by the Edge Function/provider
validators.

The follow-up migration `migrations/20260806110000_user_input_size_guards.sql`
adds database-level length limits to direct authenticated writes for profiles,
messages, saved notes, journal entries, and feedback.

The follow-up migration `migrations/20260806130000_ai_cost_log.sql` adds a
service-only cost ledger for answer, embedding, classifier, evaluation, and
judge calls. `migrations/20260806140000_ai_request_rate_limit.sql` adds an
atomic per-user burst limiter in addition to the daily quota.

The follow-up migration `migrations/20260806070000_billing_environment_config.sql`
keeps sandbox subscription entitlements disabled by default at the database
layer. A test project must explicitly enable `billing_runtime_config.allow_sandbox`
before sandbox purchases can grant Plus access.

### Backend verification

The daily worker also needs a recurring trigger. The repository includes an
idempotent hosted Supabase Cron/`pg_net` setup in
`supabase/ops/daily-reflections-cron.sql`. It reads the project URL, publishable
key, and `DAILY_REFLECTIONS_CRON_SECRET` from Vault, replaces only the named
job, and fails closed if any Vault secret is absent. Follow
`supabase/ops/README.md` before enabling reminders in production, then inspect
`cron.job_run_details` and run the protected notification smoke workflow.

Run the RAG doctor before attempting a live backend smoke test. Calling the
script directly keeps repository-only diagnostics independent of registry
access:

```bash
node scripts/rag-doctor.mjs
```

This checks required local files, live prerequisites (`docker`, `supabase`, `deno`, `psql`), backend-only environment variables, Supabase endpoint reachability, and the static gates below. For CI or a machine that should only prove repository state, use `node scripts/rag-doctor.mjs --static-only`.
On a machine without the JavaScript dependency toolchain, use `node scripts/rag-doctor.mjs --source-only` for dependency-free source, tracker, and prepared-corpus shape/rights/hash proof. The full prepared-corpus audit additionally checks exact model token counts and requires the installed `js-tiktoken` dependency.

Run the local static/unit checks directly when you do not need prerequisite or environment diagnostics:

```bash
pnpm backend:check
pnpm backend:schema-check
pnpm rag:evaluate:validate
pnpm rag:audit
pnpm rag:ingest:dry-run
```

This checks the migrated database/type contract, shared types, the RAG package, RAG unit tests, and a TypeScript pass over the `/ask` Edge Function using `supabase/functions/deno-shim.d.ts`.

When dependencies are unavailable, `node scripts/verify-rag-backend.mjs --source-only`
still checks backend security and provenance invariants without claiming that
TypeScript or unit-test verification passed.

When the Supabase CLI and Deno are installed, also run:

```bash
supabase db reset
supabase functions serve ask --env-file supabase/.env
```

Then call the local function with an authenticated user JWT and verify:

- safety questions return a `safety_note` and do not retrieve/model-call
- cached questions return `cache: "hit"`
- uncached questions write two `messages` rows
- assistant rows include `retrieved_passage_ids`, `model_used`, token counts, and `cost_usd`

For streaming clients, send `{"question":"...","stream":true}` with
`Accept: text/event-stream`. The endpoint emits `started`, `status`, incremental
`text`, and a final `complete` event containing the same validated response
envelope as the JSON endpoint. Provider streaming is enabled for Anthropic and
OpenAI-compatible providers; malformed structured output still follows the
single retry path before completion.
If the client disconnects, the request signal aborts upstream embedding/model
work and returns a non-telemetry cancellation response while quota and budget
cleanup remains best-effort and retry-safe.

The repeatable smoke runner performs the same checks through the public Edge Function API:

```bash
RAG_SMOKE_EMAIL=dev@example.com RAG_SMOKE_PASSWORD=... pnpm rag:smoke:live
```

It reads `.env` and `supabase/.env`, signs in the smoke user through Supabase Auth, exercises self-harm, medical, and legal/financial safety redirects, exercises a streamed sourced answer and its SSE status/text/final envelope, calls a sourced question, and repeats the sourced question to assert `cache: "hit"`. Set `RAG_ASK_FUNCTION_URL` when testing a local function URL that differs from `${SUPABASE_URL}/functions/v1/ask`.

The runner removes every conversation it created through the authenticated
user's RLS path in a `finally` cleanup, including after an assertion failure, so
repeated release checks do not accumulate test history or consume persistent
smoke-account storage.

The non-destructive two-user privacy smoke verifies that each user can read its
own profile while cross-user profile/conversation reads and message/feedback
writes through another user's conversation are denied by RLS. It also verifies
that authenticated clients cannot read the server-only cache, embedding, or
admin-audit tables:

```bash
RLS_SMOKE_EMAIL_A=... RLS_SMOKE_PASSWORD_A=... \
RLS_SMOKE_EMAIL_B=... RLS_SMOKE_PASSWORD_B=... \
pnpm backend:smoke:live
```

Use disposable confirmed test accounts and never place their credentials in the
repository. The live release gate still requires a separate, explicitly
approved account-deletion test.

The guarded deletion runner exercises JSON export, confirmed deletion,
post-delete sign-in invalidation, and service-role checks that user-owned rows
and server-only billing events were scrubbed. It refuses to run unless
`ACCOUNT_DELETE_SMOKE_CONFIRM=DELETE_ACCOUNT_LIVE` is explicitly set:

```bash
ACCOUNT_DELETE_SMOKE_EMAIL=... ACCOUNT_DELETE_SMOKE_PASSWORD=... \\
ACCOUNT_DELETE_SMOKE_CONFIRM=DELETE_ACCOUNT_LIVE \\
pnpm backend:account-delete-smoke:live
```

Set `LLM_INPUT_COST_PER_MILLION` and `LLM_OUTPUT_COST_PER_MILLION` in the Edge Function environment so `cost_usd` reflects current provider pricing. They default to `0` locally to avoid pretending stale hard-coded prices are authoritative.
Set `EMBEDDING_INPUT_COST_PER_MILLION` as well when using a positive monthly budget. The ask function reserves an upper-bound amount before provider work so concurrent cache misses cannot overrun the project-wide cap; reservations are released after success or failure. Set `LLM_MONTHLY_BUDGET_USD` to a positive value to block cache-miss AI calls once audited current-month spend reaches that cap. Set it to `0` to disable the backend cap.

### Production release gate

The repository checks are intentionally environment-independent. Before calling this backend production-ready, a project owner must complete the live Supabase and store configuration:

1. Apply migrations only after reviewing `migrations/migration_checklist.md`, then verify RLS and the new tables in the Supabase dashboard.
2. Configure Supabase Auth email confirmation, password recovery, Apple/Google provider credentials, the production Site URL, and redirect allow-list entries for the app scheme (`dharmadaily://auth/callback`) and the hosted web preview before testing sign-in.
3. Set Edge Function secrets for `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, the selected LLM/embedding provider, `LLM_MONTHLY_BUDGET_USD`, `REVENUECAT_WEBHOOK_SECRET`, `REVENUECAT_API_KEY`, `REVENUECAT_WEBHOOK_TOLERANCE_SECONDS`, `DAILY_REFLECTIONS_CRON_SECRET`, and `EXPO_ACCESS_TOKEN`. Configure `SENTRY_DSN_BACKEND` and `POSTHOG_API_KEY`/`POSTHOG_HOST` when production telemetry is enabled.
4. Deploy `ask`, `account`, `register-push-token`, `revenuecat-webhook`, `send-daily-reflections`, `admin-feedback`, `admin-content`, and `admin-ops`. The authenticated `account` function supports JSON data export as well as confirmed deletion. Keep JWT verification disabled only for the HMAC/cron-authenticated functions listed in `config.toml`.
5. Configure RevenueCat HMAC signing and point its webhook at `revenuecat-webhook`; use the Supabase UUID as the RevenueCat App User ID. RevenueCat recommends fast 200 responses, idempotent event handling, and retry-safe processing. See the [RevenueCat webhook guide](https://www.revenuecat.com/docs/integrations/webhooks).
6. Schedule `send-daily-reflections` every minute, and confirm the Expo project ID, notification permission flow, and device-token registration in a development build before enabling reminders for users.
7. Run the authenticated live smoke test, an account deletion test, a sandbox purchase plus webhook replay, an RLS cross-user test, and an Expo push test. Do not ingest the prepared corpus into production until every source has passed the rights tracker.

The manual `Release smoke tests` workflow also has an isolated
`run_notification_smoke` job. It requires a disposable user and test-device
Expo token, temporarily makes that user's UTC reminder due, verifies one
delivery plus persisted ticket state and duplicate suppression, then restores
the profile and removes the smoke rows. Protect it with the separate
`notification-provider-smoke` environment.

The non-destructive RLS and RAG smoke tests can be launched from the manual
`Release smoke tests` GitHub Actions workflow once its disposable test-account
secrets are configured. The destructive account-deletion job is separately
protected by the `production-account-delete` environment and the explicit
`ACCOUNT_DELETE_SMOKE_CONFIRM=DELETE_ACCOUNT_LIVE` guard.

The same workflow has an opt-in `run_billing_replay` job for an isolated
RevenueCat sandbox project. It replays signed `INITIAL_PURCHASE`, renewal,
cancellation, billing-issue, uncancellation, refund, stale-event,
`EXPIRATION`, and environment-omitted `TRANSFER` events. It checks source
revocation and destination state with two disposable users, then removes only
the generated billing-event rows and resets both subscription rows. It requires the separate
`provider-sandbox-smoke` environment and never accepts production events.

Production RAG approval is intentionally stricter than a staged-candidate flag:
the source row must be uniquely matched, explicitly approved, say `No` for
`permission_needed`, include a non-empty `review_needed` record, and grant
unconditional storage, excerpt, embedding, and RAG rights. The ingest worker
persists the accepted tracker snapshot in `content_sources.metadata`.
