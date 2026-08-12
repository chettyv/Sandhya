# Global Codex Guidance — Sandhya

Global working agreements for Codex on the **Sandhya** project — an AI-powered Hinduism app for daily learning and practice.

This file contains reusable guidance for the specific stack and constraints of this app. Repository-specific `AGENTS.md`, `README.md`, `CONTRIBUTING.md`, package scripts, tests, and existing project conventions take priority when they are more specific.

The authoritative product reference is `sandhya_build_reference.docx`. When this file and the build reference conflict, the build reference wins.

**The plan of record is `02-plan.md` (v3, 12 Aug 2026).** The competitive evidence behind it is `docs/05-competitors.md`. The standing rules those two documents impose are in *Competitive standing rules* below — read that section before touching content, retrieval, onboarding or the festival calendar.

## Starting a session — read this first

**You are one of two agents working this repo in parallel.** This file is shared by both, so it cannot tell you which one you are. **The user says so at the start of a session:**

> `You are Stream A.` — content and data
> `You are Stream B.` — app and platform

**If the user has not said which stream you are, ask before touching any file.** Do not guess. The two streams own disjoint parts of the tree (see *Two-workstream file ownership* below) and a wrong guess means editing a file the other agent owns.

Once you know your stream:

1. Read `02-plan.md` §7 and find your stream's deliverables (A1–A8 or B1–B8).
2. Work the lowest-numbered deliverable that is not done, unless the user names one.
3. **Stay inside your stream's file ownership.** If a task appears to require touching the other stream's files, stop and say so rather than crossing the line.
4. Check the *Competitive standing rules* section below before writing content, retrieval, onboarding or anything calendar-related. Those rules are non-negotiable.

The user does not need to say "follow the instructions" — this file is always in effect.

## Priority order

When instructions conflict, follow this order:

1. User's direct request
2. `sandhya_build_reference.docx` (architecture, schema, RAG design, milestones)
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
| AI model | Claude / OpenAI / Gemini — **backend only**, never from the client |
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

## Competitive standing rules — added 12 Aug 2026

These are derived from `docs/05-competitors.md`, a teardown of five competing apps plus the category leader. **They are not style preferences. Each one records a specific, observed failure by a competitor, and each is a place where this product's only defensible advantage lives.** The plan of record is `02-plan.md` (v3).

### Never do these

- **Never generate devotional or deity imagery with AI, and never ship generated imagery as a devotional asset.** A named human artist or nothing. A competitor shipped a triśūla with four-to-five prongs on the card its own UI badged *"SEND TO FRIENDS AND FAMILY"*, and a devotee counted the prongs and filed it as a defect. Iconographic precision is this category's competence signal.
- **Never display a quoted verse without a named translator and a source.** No competitor at any funding level names a translator or a commentator anywhere. The content validator already enforces the five labels (Devanagari / IAST / Say it / Meaning / Source) on `shloka` docs — do not add a code path that renders a quote outside that shape.
- **Never publish a festival date without its reckoning.** Every date must carry: the reckoning used (**amānta or pūrṇimānta**), the **observing community named wherever practice splits** (Smārta vs Vaiṣṇava Janmāṣṭamī; Ekādaśī), the **location the timing is computed for**, and the **source, with disagreement between sources reported rather than silently resolved**. If a date cannot carry those four, do not publish the date. Competitors are wrong by up to three weeks, and one is an hour wrong abroad because it does not handle DST.
- **Never name an AI feature after a deity, and never give the model a persona voice.** A competitor's "Ask Krishna" casts the model as the deity and the user as Arjuna, placing the entire advisory voice inside one sampradāya. A synthesised guru voice is an assertion of lineage authority no product can grant itself.
- **Never present a single tradition's reading as the reading**, and never build retrieval that hides the others. See the tradition-filter rule below — this was a live bug in our own code.
- **Never ship a survey question whose answer changes nothing.** One competitor asks eleven questions and consumes one; another asks five and renders the null default while claiming the experience was "crafted just for you". If an onboarding answer does not visibly route content, delete the question.
- **Never cite research loosely.** If a statistic appears in the product: cite a responder rate *as* a responder rate, name **n**, and name the control condition. A competitor rendered a 47.1% responder rate (n=17 per arm) as a "47% median reduction", and attributed two other people's papers to "our research". Our audience will pull the DOI.
- **Never write "Dharma Daily" anywhere a user can see it.** It is a competitor's app name. Grep for it before shipping — it has previously survived in `subscription.tsx`, in `apps/web/dist/`, in the RAG context fence, and inside a generated answer string.
- **Never state what "Hindus do" as a universal.** Where traditions genuinely differ, say they differ and name at least one alternative. This applies to *nitya karma* and daily obligation, to the Navadurga nine-form scheme, to household ritual roles, and to festival observance — all of which vary by sampradāya, region and family.

### Correctness rules that are currently violated in this codebase

Fix these before building on top of them. Both are recorded as Phase 0.5 in `02-plan.md`.

- **`tradition_filter` must ORDER retrieval, not NARROW it.** `supabase/functions/ask/index.ts` currently sets `allowedTraditions = new Set(["general", policy.traditionFilter])`, which structurally prevents a user who states a tradition from ever retrieving another tradition's reading — while the system prompt asks the model to "mention variation where relevant" over a context that has already had the variation stripped out. **Rank by stated tradition; return the others, labelled.**
- **Stop discarding variation data at render.** `apps/mobile/src/lib/content.ts:139` and `:208` read `festivals.regional_variations` and `concepts.tradition_variations` from Supabase and substitute a constant boilerplate sentence. Render the actual field.

### Two-workstream file ownership — in force during Phase 1

Two developers work in parallel. **Respect the boundary; it is what stops them blocking each other.**

| Stream | Owns | Must not touch |
| --- | --- | --- |
| **A — Content & Data** | `content/**`, `docs/**`, the source-rights tracker, web pages, audio | anything under `apps/`, `packages/`, `supabase/` |
| **B — App & Platform** | `apps/**`, `packages/**`, `supabase/**`, deployment | anything under `content/` except by running the generator |

**The interface is three artifacts and nothing else:** the frozen `challenge_session` doc type in `packages/content-tools/src/index.ts` (six sections in fixed order, `can_embed: false`); the generator scripts that turn markdown into bundled JSON/SQL; and `content/challenges/navratri-2026/challenge.json`. **Do not change the content schema to make application code easier.** If a change to the interface looks necessary, it is a joint decision, not a unilateral one.

### Scope rules in force for the Navratri pilot

- **Scoped AI is CUT from the pilot.** Do not build, wire or re-enable it. Reasons: 1 of 432 source-tracker rows is approved, so retrieval returns nothing; both AI keys are empty and `LLM_PROVIDER` defaults to `deepseek` while `LLM_DEFAULT_MODEL` is a Claude alias, so the function throws on first request; and live AI answers create a moderation queue for one person indefinitely. It ships when the corpus is cleared, not before.
- **The live participation counter stays dark.** The code exists and is real-count-only. A number like "3 people joined" is worse than no number. Social proof at this scale is a *bought* advantage, not a designed one.
- **Do not re-add the admin moderation console, push retry leases, or a subscription.** All three are cut in `02-plan.md` §6. Revenue is a one-off finite challenge, not a subscription.
- **Audio is CORE, not "later".** Every shloka needs a clear reading plus a slow repeat-after-me pass. Adjustable playback speed if cheap — it is the one thing a competitor's own users asked for by name.

### The classification test — apply it before recommending any competitor pattern

Every borrowed idea must be classified before it is adopted:

- **STRUCTURAL** — works because of something the app did not create and we cannot borrow (a daily obligatory office, an externally imposed liturgical calendar, a licensed parallel-translation ecosystem, chapter-and-verse addressing over a single canon, centralised institutions that distribute software). **Not adoptable.** Note that **there is no Hindu analogue to church software distribution** — temples are non-congregational, with no membership roll and no procurement counterparty. Do not plan around that channel.
- **BOUGHT** — works because of scale, funding or an existing audience (a live queue that is always full, "40M users" social proof, a paid creator programme, an advertising line larger than revenue). **Not adoptable.**
- **DESIGNED** — a product decision anyone could make. **Adoptable, but only after passing the religious-context test:** does this pattern assume a canon, a central authority, a universal daily obligation, a single calendar, or a single correct reading? If yes, it is not adoptable in that form — say what would have to change, or discard it.

**Unclassified is not a recommendation.**

### The one thing to remember about quality

The best-crafted app in the competitive set has **~102 lifetime ratings and has shipped no features since June 2025**. The market leader is mediocre — its rating has fallen from 4.9 to 4.4 — and has 40M downloads because it spent 75% of its revenue on advertising. **Quality is why people stay and pay. It is not why they arrive.** The correct use of the quality thesis is to pick the correctness claims a stranger can check in thirty seconds — pronunciation, and a festival date with its convention stated — and put them where strangers already are. Work labelled "quality" that no stranger will ever reach is the project's single biggest documented risk (`02-plan.md` §9).

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
