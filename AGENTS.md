# Global Codex Guidance — Dharma Daily

Global working agreements for Codex on the **Dharma Daily** project — an AI-powered Hinduism app for daily learning and practice.

This file contains reusable guidance for the specific stack and constraints of this app. Repository-specific `AGENTS.md`, `README.md`, `CONTRIBUTING.md`, package scripts, tests, and existing project conventions take priority when they are more specific.

The authoritative product reference is `dharma_daily_build_reference.docx`. When this file and the build reference conflict, the build reference wins.

## Priority order

When instructions conflict, follow this order:

1. User's direct request
2. `dharma_daily_build_reference.docx` (architecture, schema, RAG design, milestones)
3. Repository-specific `AGENTS.md`
4. Project documentation
5. Existing code style and architecture
6. Apple Human Interface Guidelines and Material Design (for platform behaviour)
7. This global guidance
8. General best practices

Build the project that is actually in front of you. Do not swap the stack — Expo, React Native, TypeScript, Supabase, and pgvector are fixed decisions for v1.

## The stack (fixed for v1)

| Layer | Tool |
| --- | --- |
| Mobile app | Expo + React Native + TypeScript |
| Navigation | Expo Router (file-based) |
| UI styling | NativeWind or Tamagui (follow whatever the repo already uses) |
| State | TanStack Query (server cache) + Zustand (client state) |
| Backend | Supabase — Auth, Postgres, Storage, Edge Functions |
| Vector DB | Supabase pgvector (no Pinecone / Weaviate in v1) |
| AI model | Codex / OpenAI / Gemini — **backend only**, never from the client |
| Embeddings | OpenAI or Gemini embeddings |
| RAG | Custom simple pipeline — **no LangChain in v1** |
| Payments | RevenueCat |
| Push | Expo Notifications |
| Analytics | PostHog or Amplitude |
| Errors | Sentry |
| Build & submit | EAS Build / EAS Submit |

Do not introduce Redux, LangChain, a separate vector DB, native Swift / Kotlin modules, or alternative frameworks without explicit approval.

## Core behaviour

Before making changes:

1. Understand the user's goal and likely acceptance criteria.
2. Inspect the repository structure.
3. Identify which layer the change touches: Expo client, Supabase Edge Function, SQL/schema, RAG pipeline, or content.
4. Read relevant docs and config files — `app.json` / `app.config.ts`, `eas.json`, `tsconfig.json`, `package.json`, Supabase migrations, and the build reference doc.
5. Check whether the request depends on recent or version-specific information (Expo SDK, RN, Supabase JS, EAS, Anthropic/OpenAI/Gemini SDKs).
6. Make the smallest safe change that solves the task.

Prefer focused, reviewable diffs over broad rewrites.

Avoid:
- unrelated refactors
- unnecessary dependency changes (Expo SDK and RN upgrades are not "small" changes)
- formatting entire files without need
- deleting user work
- changing public API shapes (Edge Function request/response, structured AI JSON) unless requested
- replacing the project architecture without permission
- introducing new frameworks
- bumping minimum iOS / Android versions without explicit approval
- adding new permissions to `app.json` without explicit approval

## Mobile-specific considerations (Expo + RN)

Keep these in mind on every change:

- **Permissions.** Only request what's actually used. Mirror in `app.json` (`ios.infoPlist`, `android.permissions`) with clear user-facing rationale strings.
- **Lifecycle.** Respect background/foreground transitions. Cancel in-flight requests and clear streaming chat connections on unmount.
- **Threading.** Keep the JS thread free; move heavy work off the main render path. Don't block on synchronous storage.
- **Memory and battery.** Avoid leaked subscriptions, unbounded chat history in memory, and never poll in the background.
- **Network.** Assume flaky, metered, or offline. Use TanStack Query for caching, retries, and stale-while-revalidate. Surface offline states explicitly.
- **Accessibility.** Use `accessibilityLabel`, `accessibilityRole`, dynamic type, and adequate contrast. The audience includes older users.
- **Localization.** English first; Hindi planned. Do not hard-code user-visible strings — use the project's i18n setup. Devanagari and IAST transliteration must render correctly.
- **Security.** Use `expo-secure-store` for tokens. Never log auth tokens, PII, full request bodies, or LLM prompts/responses containing user content.
- **Form factors.** Phones first; tablets must not be broken. Respect safe areas via `react-native-safe-area-context`.

## Backend and RAG considerations (Supabase)

- **No LLM calls from the client. Ever.** All AI traffic goes through Supabase Edge Functions. API keys live in Edge Function env, not in the app bundle, not in `app.json`, not in `EXPO_PUBLIC_*` vars.
- **Row Level Security (RLS) is required** on every user-scoped table (`profiles`, `conversations`, `messages`, `saved_items`, `journal_entries`, `feedback`, `usage_quotas`). Never assume the client is honest about `user_id`.
- **Schema is authoritative.** Match the tables in the build reference (`texts`, `passages`, `commentaries`, `passage_embeddings`, `daily_reflections`, `festivals`, `practice_guides`, `concepts`, `deities`, plus user-side tables). Don't rename columns casually — migrations cascade.
- **Embeddings.** Use the embedding model already in use in the project. If you change models, you must re-embed the whole corpus — flag this loudly before doing it.
- **Vector search filters.** Always filter by licence, tradition preference, and allowed content types. Never retrieve from licensed material that the user's tier doesn't allow.
- **Structured JSON responses.** AI answers must conform to the schema in the build reference (`answer`, `summary`, `sources`, `tradition_notes`, `confidence`, `safety_note`, `suggested_practice`). Use the model's structured output / JSON mode. Don't free-form parse.
- **Cache before LLM.** Always check `cached_answers` by question hash before paying for a model call.
- **Quotas.** Free tier is 5–10 AI messages per day. Enforce server-side in the Edge Function, not client-side.
- **Safety gate.** Self-harm, medical crisis, and legal/financial questions are redirected, not answered. Never bypass this gate "for testing" in committed code.
- **Audit trail.** Every assistant message must persist `retrieved_passage_ids`, `model_used`, `tokens_in`, `tokens_out`, and `cost_usd`. Don't drop these for "cleanup."

## Content, citations, and tradition rules

These are product-critical, not stylistic preferences:

- **Never invent scripture references.** Only cite what was actually retrieved. If retrieval returned nothing relevant, the answer must say so.
- **No single tradition as "the correct one."** Hindu traditions are diverse (Vaishnava, Shaiva, Shakta, Smarta, Advaita, Vishishtadvaita, regional practices). Note variation explicitly.
- **Separate categories of authority** — scripture, commentary, folklore, common practice, personal advice — and don't blur them.
- **Licensing is hard-blocking.** Never add a source to the corpus without a row in the content tracking sheet covering: translator, source URL, copyright status, storage rights, excerpt rights, embedding rights. "It was online" is not a licence.
- **Do not act as a guru, priest, therapist, doctor, or lawyer.** Decline and redirect.
- **Do not mock or dismiss any Hindu tradition.**

## Cost control

LLM spend is the dominant ongoing cost and the easiest thing to blow up:

- Default model is the cheap tier (Haiku / GPT-4o-mini / equivalent). Escalate only on classifier signal.
- Cache aggressively in `cached_answers`. A popular question should hit the cache, not the model.
- Static content (daily reflections, festival pages, practice guides, concept entries) is served from Postgres, not generated. AI is the fallback, not the default.
- Never add a new LLM call site without thinking about caching and quotas.
- Set monthly spend alerts on Anthropic / OpenAI / Gemini accounts.

## Accuracy, recency, and sourcing

When a request depends on recency, version compatibility, security advisories, current APIs, recent releases, App Store / Play Store policy, model behaviour, or anything described as "latest", "current", "today", or "as of now":

1. Establish the current date and time.
   - Prefer `date -Is` where available.
2. Prefer official or primary sources:
   - Expo docs and Expo SDK changelog
   - React Native release notes
   - Supabase docs (Auth, Postgres, Edge Functions, pgvector)
   - Anthropic, OpenAI, and Google AI model and API docs
   - RevenueCat, Sentry, PostHog, EAS docs
   - Apple Developer documentation and App Store Review Guidelines
   - Android Developers documentation and Play policies
3. Pin to the project's installed versions (check `package.json`, `app.json` `sdkVersion`, and EAS config) before quoting API shapes.
4. Cross-check at least two reputable sources when details are safety, compatibility, migration, store-policy, or security sensitive.
5. Mention source dates and versions (Expo SDK X, RN Y, Supabase JS Z) when they matter.

Do not invent facts, versions, links, benchmarks, API symbols, scripture citations, or doc URLs.

## Context7 and external docs

Use Context7 or similar when SDK / API docs would materially improve correctness. Likely targets for this project:

- `expo`, `expo-router`, `expo-notifications`, `expo-secure-store`
- `react-native`
- `@supabase/supabase-js`, Supabase Edge Functions / Deno runtime
- `@anthropic-ai/sdk`, `openai`, Google Generative AI SDK
- `@tanstack/react-query`, `zustand`
- `nativewind` or `tamagui`
- `react-native-purchases` (RevenueCat)
- `@sentry/react-native`, `posthog-react-native`

When using documentation tools:

- target the specific library or API
- pin to the version in `package.json`
- fetch only the minimal docs needed
- summarize instead of dumping large blocks

## Web search policy

Use web search only when it materially improves correctness — e.g. App Store / Play policy changes, recent Expo SDK quirks, RevenueCat receipt-validation issues, Supabase pgvector tuning, model deprecations.

Prefer official docs; reputable GitHub issues only when official docs are insufficient. Record dates when they affect the answer.

## Default autonomy and safety

Default to read-only exploration first.

When edits are needed:

- keep changes inside the repository
- prefer workspace-scoped writes
- preserve user work
- avoid destructive actions
- make patch-style edits where practical

Do not perform destructive commands unless the user explicitly asks and the context is safe.

Avoid commands like:

```bash
rm -rf
git reset --hard
git clean -fd
supabase db reset                # wipes local DB
supabase migration repair        # rewrites migration history
psql ... -c "drop table ..."
psql ... -c "truncate table ..."
psql ... -c "delete from ..."     # without a WHERE clause
expo prebuild --clean             # nukes ios/ and android/
eas build --clear-cache           # only with explicit approval
rm -rf node_modules ios android   # only with explicit approval
```

Never:

- submit, upload, or promote builds to TestFlight, App Store Connect, Google Play (any track), or EAS Update channels without explicit user instruction
- run migrations against the production Supabase project without explicit approval
- re-embed the corpus without explicit approval (it's expensive and changes retrieval behaviour)
- rotate, regenerate, or print API keys, service-role keys, or RevenueCat secrets
- disable RLS, even temporarily, on a shared environment
- bypass the safety gate or quota enforcement in committed code
