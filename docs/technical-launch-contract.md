# Sandhya technical launch contract

**Status:** Wave 0 / C0 — scope and acceptance contract

**Date:** 29 September 2026

**Applies to:** the current Expo/React Native/Supabase application and its
free technical-preview path. This document defines what later implementation
waves must prove; it does not claim that the repository has already passed
those gates.

## 1. Purpose and governing decisions

The technical launch gate is the primary coding gate for this cycle. It asks
whether a real person can open Sandhya, reach trustworthy static content, use
the core practice loop, and recover from ordinary device/network failures on
iOS and Android.

The contract is governed by the current repository guidance, the technical
launch-readiness plan, the 29 September audit, the competitor evidence, and
the warm-light design specification. Where an older milestone or audit
recommendation conflicts with the decisions below, these decisions win:

- The current onboarding flow is retained. C0 does not shorten it, reorder
  it, replace its questions, or add a new question set. Later work may harden
  persistence, loading, error, accessibility, and device behaviour around the
  existing flow.
- The default launch profile is the core profile. It is a free, static-content
  and practice experience with local/bundled fallback.
- Scoped AI is disabled for the pilot. Its entry point must be hidden or
  intentionally marked unavailable; no client path may attempt an LLM call.
- Internal provenance fields remain in schemas, generated data, validators,
  and support/debugging records. C0 does not add a new attribution UI
  project. Existing source/translator requirements still apply wherever a
  quoted verse is rendered.
- The current warm light visual system remains the only launch theme.
- Audio is part of the learning promise, not a later enhancement.
- No deployment, store submission, production migration, corpus re-embedding,
  branch deletion, or release-channel publication is part of C0.

## 2. Launch profiles and visible scope

The application has two named profiles for planning. Only `core` is in scope
for the pilot. A future `full` profile must not be inferred from the presence
of dormant code or from a successful local build.

| Profile               | User-visible scope                                                                                                                                                                                                                                                  | Gate                                                                                                                                                                             |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `core`                | Onboarding; Today/Home; daily reflections and shlokas; reading/details; practices; journal; saved items; Calendar and qualified festival details; Explore; Journey; settings/profile/account; auth, export/delete, reminders, local progress, and offline fallback. | The technical launch gate in this document. No live AI or subscription promise.                                                                                                  |
| `core` with challenge | The finite Navratri journey only when its catalog is published, written, rights-cleared, priced, audio-complete, and its purchase/restore/refund flow is verified. Otherwise the challenge is unpublished and its purchase entry point is hidden.                   | A separate challenge/content/commercial gate in addition to the core gate.                                                                                                       |
| `full`                | A later, explicitly enabled profile that may expose scoped Ask/AI and any other deferred capability.                                                                                                                                                                | Rights-cleared corpus, coherent provider/model configuration, cache/quota/safety/audit evidence, moderation ownership, and an explicit product decision. Not a C0 or pilot gate. |

The following remain out of the pilot surface even if their source routes or
backend code remain buildable for later work:

- Ask/AI entry points, conversation history, and any live-answer promise.
- Monthly, annual, or lifetime subscription/Plus upsell surfaces.
- Admin moderation-console expansion and push retry-lease work.
- A live participation counter or other low-volume social proof.
- AI-generated devotional or deity imagery.

Keeping dormant code buildable is not permission to expose it. Availability
must be explicit and default closed for deferred features.

## 3. Opening and startup contract

### 3.1 Returning-user path

After onboarding has been completed, the normal opening path is:

```text
splash / local hydration
        -> Today/Home shell
        -> cached or bundled first value
        -> background profile/content/reminder/telemetry sync
        -> first useful action
```

The first screen must not wait for:

- an LLM call or any AI provider;
- a remote-only content request when cached or bundled content exists;
- RevenueCat configuration or purchase state;
- analytics delivery or a non-essential remote profile request.

Local onboarding state, local progress, cached daily content, saved items,
journal data, and the last coherent auth state must be available to the shell
before non-essential remote hydration completes. A normal returning user must
not receive an avoidable full-screen spinner when useful local content exists.

### 3.2 First value

Today/Home is the first-value surface. It must lead with a daily
shloka/reflection or an honest empty/offline state and one clear next action,
such as opening the verse, listening, practising, saving, or reflecting. The
user can still reach Journey, journal, saved items, Calendar, practices,
Explore, and settings from the existing navigation.

A quoted verse surface must keep the learning registers together:

1. Devanagari;
2. IAST;
3. “Say it”;
4. meaning; and
5. the existing source line with a named translator/source where the content
   contract requires it.

The UI must use retrieved or authored content that actually exists. It must
not invent scripture references, substitute a generic tradition sentence for
real variation data, or present one tradition’s interpretation as universal.

### 3.3 New-user path

The current onboarding route remains the new-user path. The contract is to
make that path reliable, not to redesign it:

- Preserve the current question order, semantics, copy strategy, and result
  behaviour during C0 and the technical-launch implementation.
- Persist each answer through reload, background/resume, and process death.
- Keep the existing routing effect: answers that are intended to personalise
  content must visibly influence the resulting pool or ordering. A retained
  answer that changes nothing is a product defect to resolve with the owning
  product decision, not a reason to collect more data.
- Do not require AI, a remote-only catalog, payment configuration, or a live
  notification permission to complete onboarding and reach Today.
- Provide intentional loading, validation, retry, offline, success, keyboard,
  narrow-layout, Dynamic Type, VoiceOver, and TalkBack states.

The audit’s recommendation to shorten onboarding is not part of this contract.
The first-value improvement for this cycle is reliable opening and cached
Today content after the current flow completes.

## 4. Offline, sync, and lifecycle behaviour

Offline is a supported content state, not an exceptional blank screen.

| Area                                     | Offline contract                                                                                                                                               |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Daily/static content                     | Serve the bundled or cached catalog. Mark it as saved/offline content when freshness matters.                                                                  |
| Daily reflection/shloka                  | Show the last valid cached item or bundled fallback; never fabricate a missing item.                                                                           |
| Journal, saved items, and local progress | Remain readable and locally writable where the current feature supports local-first behaviour. Never erase local data because a request failed.                |
| Authenticated sync                       | Distinguish a network/offline failure from auth, RLS, validation, or unexpected server failure. Do not report a server rejection as a successful offline save. |
| Retry                                    | Give the user a clear retry action for recoverable remote failures. Retry work must be bounded and lifecycle-aware.                                            |
| Background/resume                        | Cancel or pause in-flight work that should not continue in the background; resume with a coherent cache rather than a stale blank state.                       |
| AI and payments                          | Do not offer an offline AI answer or imply that a purchase completed without verified provider state. Both are unavailable in the core profile.                |

The standard notice is plain and actionable, for example: “You’re offline —
showing saved content.” It must not imply that a remote record was refreshed.
Cached content can be stale; staleness must be represented honestly.

Every screen and route must have designed loading, empty, error, offline, and
success states. Deep links, auth callbacks, notifications, account switching,
purchase restore (when the challenge is enabled), and app resume must land in
a valid route state rather than a blank screen or an unrelated stale account.

## 5. Content, calendar, and provenance runtime rules

The technical gate checks that runtime content is structurally safe and
deterministic. It does not replace editorial or rights approval.

Runtime checks include:

- generated/bundled content is current and contains no placeholder or pending
  item classified as ready;
- a quoted verse has the required Devanagari, IAST, Say-it, meaning, source,
  and named-translator fields for its content type;
- no scripture reference is invented by a fallback or by client rendering;
- `regional_variations` and `tradition_variations` are rendered from their
  actual data rather than replaced by boilerplate;
- tradition preference changes ordering where intended but never removes
  relevant alternative readings from the available context;
- a published festival date names the reckoning (amānta or pūrṇimānta), the
  observing community when practice splits, the location used for timing, and
  the source; disagreements between sources are reported rather than silently
  resolved;
- the UI never states what all Hindus do as a universal when practice varies
  by sampradāya, region, or family;
- challenge sessions use the frozen `challenge_session` interface, including
  its six-section order and `can_embed: false` rule.

Internal `source_url`, translator, licence, excerpt/storage/embedding rights,
and related provenance fields remain stable. The source-rights tracker,
`docs/SOURCES-AND-ATTRIBUTION.md`, terms/privacy/legal material, and any
content correction process remain the place for compliance, licensing,
attribution, and external-rights decisions. They are not replaced by a new
attribution UI task in C0. A missing or uncleared right still prevents that
content from being promoted to a launch corpus; technical green status must
not be used to imply legal clearance.

## 6. Visual and interaction rules

The launch uses the existing warm light theme. No dark theme, second accent
palette, broad rebrand, or visual redesign is part of C0.

### 6.1 Tokens and hierarchy

| Role              | Token/value                                                 |
| ----------------- | ----------------------------------------------------------- |
| Background        | parchment `#FCF8EF`                                         |
| Card/surface      | paper `#FFFFFF`                                             |
| Secondary surface | sand `#F4E9DA`                                              |
| Primary text      | ink `#2A211B`                                               |
| Secondary text    | muted `#7A6A5D`                                             |
| Primary action    | saffron `#D97824`; use `saffronText #A04F17` for small text |
| Secondary accent  | plum `#7F6278`                                              |
| Positive/calm     | sage `#6D8C71`; use `sageText #4F6E54` for small text       |
| Error             | rose `#B94735`; use `roseText #A33A2A` for small text       |
| Hairline          | line `#E8DCCB`                                              |

Use the existing system font stack. Devanagari uses body size plus two points
with generous line height; IAST is muted and not italic; “Say it” is the
loudest register and uses ink/semibold. Keep the existing scale (11 eyebrow,
12 meta, 14 secondary, 15 body, 17 section title, 22 screen title) unless a
measured accessibility or layout issue requires a documented exception.

Use a 4px spacing scale, 16px screen padding, the existing card radius and
hairline/shadow, and at least 44px touch targets. Use Ionicons outline icons;
reserve filled icons for active or completed states. Press feedback stays the
existing opacity/scale treatment. Non-essential state changes use one calm
200–250ms ease-out transition and respect Reduce Motion.

Every screen must visibly handle loading, empty, error, offline, and success.
Loading uses a skeleton or an accessible status; errors say what happened and
offer one retry action; success is an inline sage confirmation. Do not use
confetti, loops, casino-like motion, generated devotional imagery, or
decorative saturation to manufacture urgency.

## 7. Audio contract

Audio is core to the pronunciation promise. Each launch-ready shloka that is
presented as learnable must have:

- a human-reviewed clear reading;
- a human-reviewed slow repeat-after-me pass;
- a deterministic asset key/manifest entry rather than a URL copied into a
  screen;
- play/pause, progress/seek, and an honest loading/error/unavailable state;
- a usable state after pause, background/resume, and network loss when the
  asset is cached;
- adjustable playback speed when the selected playback SDK supports it
  without destabilising the launch path.

The pronunciation text must remain aligned with the audio. Audio rights and
source metadata belong in the internal media/provenance manifest. No player
control may be rendered as if it works when its asset is absent.

If a build has no audio for a content item, it must say that audio is
unavailable and preserve the text path. That is an honest technical fallback,
not a passing pronunciation launch: a public core launch cannot claim the
audio learning wedge until the clear and slow tracks pass physical-device
checks on both platforms.

## 8. AI-disabled pilot contract

The core profile has no live AI. Specifically:

- hide or gate Ask, conversation history, and every route that promises a live
  answer;
- do not make a disabled feature look like a broken network request or a paid
  upgrade opportunity;
- make no LLM call from the mobile client;
- do not add a new AI call site, provider key, AI quota path, or corpus
  re-embedding as part of the pilot;
- keep server-side safety, quota, cache, retrieval, structured-output, audit,
  and provenance code available only as a later full-profile surface;
- never name a future AI feature after a deity or give it a guru/persona voice;
- when full AI is eventually considered, require a rights-cleared prepared
  corpus, coherent provider/model configuration, cache-before-model behaviour,
  server-enforced quotas, safety redirects, structured JSON, labelled
  multi-tradition retrieval, and an owned moderation/feedback operation.

The presence of `ask` Edge Function code or provider variables in a server
environment does not enable the pilot. The client profile and visible route
allowlist are the source of user-facing availability.

## 9. Competitor lessons and classification

Every borrowed pattern is classified before implementation. A pattern is not
adopted merely because it is common in a competitor.

| Observed pattern                                                              | Classification                                                                                                       | Sandhya decision and launch implication                                                                                                                                                                                 |
| ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Reach useful faith content quickly                                            | DESIGNED; the exact Christian funnel assumptions are not transferable                                                | Adopt the speed principle. Keep the current onboarding flow, then make Today/cached content the first useful surface with no AI, payment, or remote-only blocker.                                                       |
| Listen/Read duality and an explicit pronunciation aid                         | DESIGNED                                                                                                             | Adapt to Devanagari, IAST, Say it, meaning, clear audio, and slow repeat-after-me audio. This is core, not deferred.                                                                                                    |
| A finite, minute-stamped session with a completion object                     | DESIGNED                                                                                                             | Adapt only to an optional, dated Navratri journey. State the duration and end state without turning it into a universal daily obligation or guilt mechanic.                                                             |
| An identity question that routes content                                      | DESIGNED; denominational identity itself is STRUCTURAL in Christian products                                         | Preserve the current onboarding in C0. Any later routing must use concrete household practice, visibly reorder content, and keep other labelled readings available. Do not turn sampradāya into a loyalty test.         |
| Correctness that a user can audit in thirty seconds                           | DESIGNED                                                                                                             | Adopt in Hindu-appropriate form: pronunciation plus festival dates qualified by reckoning, community, location, source, and disagreement. Do not ship a single unexplained “correct” date or imply a computed pañcāṅga. |
| Named source/translator and internal provenance                               | DESIGNED and already supported by the data contract                                                                  | Retain the fields and current source-shaped content. C0 adds no new attribution UI, but a quote may not bypass the existing content requirements.                                                                       |
| Long extractive onboarding, forced account/paywall, and fake personalisation  | BOUGHT growth tactic or rejected DESIGNED tactic                                                                     | Reject. No added questions, interstitial paywall, false “crafted for you” claim, or zero-value funnel.                                                                                                                  |
| One canon, one verse address, one doctrinal answer                            | STRUCTURAL and incompatible with Hindu diversity                                                                     | Reject. Keep source type, tradition, commentary, regional variation, and disagreement distinct. Retrieval may rank a preference but must not hide alternatives.                                                         |
| Named deity assistant, guru voice, or unbounded advice promise                | DESIGNED but fails the religious-context test                                                                        | Reject for the pilot and for any future full profile unless the product decision is fundamentally changed; AI remains disabled now.                                                                                     |
| AI-generated devotional imagery                                               | DESIGNED but fails iconographic precision and trust requirements                                                     | Reject permanently. Use a named human artist or no devotional asset.                                                                                                                                                    |
| Live prayer queue, low-volume participation count, or “millions joined” proof | BOUGHT audience/scale advantage                                                                                      | Reject. The pilot keeps the live counter dark and does not simulate social proof.                                                                                                                                       |
| Subscription/Plus expansion                                                   | A bought monetisation pattern and contrary to the current one-off challenge plan                                     | Reject for this pilot. No recurring subscription surface; a challenge may be enabled only after its own content/commercial gate.                                                                                        |
| Loosely cited research claims                                                 | DESIGNED but unsafe for this audience                                                                                | Defer product claims. If a statistic is later shown, name the responder rate, `n`, control condition, and source/DOI.                                                                                                   |
| Religious product distributed through a central institutional channel         | STRUCTURAL and unavailable: Hindu temples are non-congregational and do not provide a membership/procurement channel | Do not make church-software distribution a launch assumption.                                                                                                                                                           |

The competitor evidence supports quality only when a stranger can reach it. The
technical priority is therefore the checkable path—open a sourced practice,
say it correctly, and see an honestly qualified festival detail—not invisible
architecture or a broader feature count.

## 10. Performance budgets and evidence

These are initial working budgets from the technical launch plan. They may be
tuned only with physical-device evidence; a local impression of speed is not
evidence.

| Measurement                      |                                                Initial budget | Pass condition                                                                                                                                   |
| -------------------------------- | ------------------------------------------------------------: | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Cold launch to interactive shell |                                                       ≤ 2.5 s | The shell accepts input and shows a coherent loading/offline state without waiting on remote-only work.                                          |
| Warm reopen to interactive shell |                                                       ≤ 1.5 s | A returning user can interact with the local shell and sees local progress/cached state.                                                         |
| Cached Today content             |                                                       ≤ 3.0 s | A cached/bundled daily item is visible and actionable; no avoidable full-screen spinner.                                                         |
| First navigation                 | Measure and record; target ≤ 350 ms for the normal transition | No clipped or frozen transition, no unbounded fetch dependency, and no repeated route-level spinner when cached content exists.                  |
| State-change motion              |                                                    200–250 ms | Completion/unlock motion is calm, finite, and skipped when Reduce Motion is enabled.                                                             |
| Growing collections              |             Bounded memory and lifecycle-aware list rendering | Journal, saved items, conversations, and messages use a bounded/virtualized strategy; no unbounded ScrollView in a launch-critical growing path. |

For each representative physical device, record at least five cold launches and
five warm reopens for the current build/profile, plus cached Today and first
navigation timings. Report the median and the slowest run, network condition,
OS version, device, commit, build channel, and whether the item was bundled,
cached, or remote. A repeated breach (three or more runs on the same device)
fails the budget until explained and accepted by the launch owner.

Performance checks must include:

- first install/first launch;
- returning launch with a warm cache;
- airplane mode and an ordinary flaky/slow network;
- background/resume and process death;
- 320px/narrow layout, Dynamic Type/font scaling, keyboard-visible forms,
  VoiceOver/TalkBack, and Reduce Motion;
- long journal/saved/content collections;
- audio start, pause, seek, and resume.

Expo Go, a web export, a simulator-only run, or a unit-test timing is useful
diagnostic evidence but cannot satisfy the physical-device launch gate.

## 11. Device matrix

The exact OS build is recorded at test time. The matrix is intentionally based
on hardware classes so it remains valid as OS minor versions change.

| Platform/class          | Representative device                                                        | Required focus                                                                                                        |
| ----------------------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| iOS small phone         | iPhone SE (3rd generation) or equivalent small-width iPhone                  | 320px/narrow layout, safe areas, keyboard, onboarding persistence, cold/warm launch, VoiceOver, Reduce Motion, audio. |
| iOS current phone       | A current notched iPhone in the test lab (for example iPhone 13/14/15 class) | Today first value, auth/deep links, notifications, background/resume, Dynamic Type, audio, offline/retry.             |
| iOS tablet              | iPad 10th generation or iPad Air class                                       | Tablet layout, orientation assumptions, split/large content, Dynamic Type, navigation, audio, offline.                |
| Android mid/low phone   | Google Pixel 6a/7a class                                                     | Cold/warm launch, Android back, keyboard avoidance, offline, TalkBack, notifications, audio, process death.           |
| Android common mid-tier | Samsung Galaxy A54 class or equivalent                                       | Vendor lifecycle behaviour, safe areas, font scaling, auth/deep links, reminders/push, audio, saved/journal state.    |
| Android tablet          | Pixel Tablet or Galaxy Tab A8 class                                          | Tablet layout, large text, navigation, keyboard, offline, audio, and background/resume.                               |

On every row, test at normal and larger accessibility text sizes. Record the
device/OS/build/network in the evidence artifact. A simulator may extend the
matrix for deterministic route smoke, but it cannot replace the physical
phone checks.

## 12. Environment and configuration contract

Never print secret values in logs or check them into the repository. Variables
with `EXPO_PUBLIC_` are visible in the mobile binary and may contain only
public client configuration. Service-role, provider, webhook, cron, smoke,
and model keys are server-side only.

### 12.1 EAS profiles

The existing `apps/mobile/eas.json` profiles are retained:

| Profile       | Intended use                                   | Core expectation                                                                                                                                       |
| ------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `development` | Local/dev-client or internal development build | Offline fallback works with missing remote values; native-only features are tested only when their public config is provided.                          |
| `preview`     | Internal distribution/device QA                | Core routes and offline fallback are usable; AI remains disabled; payments remain off unless a separately approved challenge build is under test.      |
| `production`  | Release candidate configuration                | The existing app config verifier requires all public production values and native packages; this is a build gate, not permission to submit or publish. |

`EAS_BUILD_PROFILE` identifies the profile during configuration. Do not use a
production profile as a substitute for a production deployment.

### 12.2 Mobile public variables

The current production app config requires these eight values. They are
public/bundled values, not secrets:

| Variable                                 | Development/preview                                                            | Production candidate                                                      |
| ---------------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| `EXPO_PUBLIC_SUPABASE_URL`               | Optional for offline-only work; required for connected auth/content            | Required; HTTPS Supabase URL                                              |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY`          | Optional for offline-only work; required for connected auth/content            | Required; publishable anon key only                                       |
| `EXPO_PUBLIC_EAS_PROJECT_ID`             | Required for native push-token work; can be absent for web-only/local fallback | Required; UUID validated by app config                                    |
| `EXPO_PUBLIC_REVENUECAT_API_KEY_IOS`     | Only when native purchase/challenge QA is explicitly enabled                   | Required by current production config; does not enable payments by itself |
| `EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID` | Only when native purchase/challenge QA is explicitly enabled                   | Required by current production config; does not enable payments by itself |
| `EXPO_PUBLIC_SUPPORT_EMAIL`              | Optional local fallback                                                        | Required and valid                                                        |
| `EXPO_PUBLIC_PRIVACY_URL`                | Optional local fallback                                                        | Required HTTPS URL                                                        |
| `EXPO_PUBLIC_TERMS_URL`                  | Optional local fallback                                                        | Required HTTPS URL                                                        |

The current client also recognises these public, non-secret telemetry/feature
values:

- `EXPO_PUBLIC_POSTHOG_KEY` and `EXPO_PUBLIC_POSTHOG_HOST`;
- `EXPO_PUBLIC_SENTRY_DSN`;
- `EXPO_PUBLIC_PAYMENTS_ENABLED` — must remain `false` for the core pilot.

Telemetry values are required for a public release evidence package if the
corresponding service is claimed as operational. They are not a reason to
break local offline development. There is no public AI-provider key and no
`EXPO_PUBLIC_*` alias for a service-role or model secret.

### 12.3 Server-side variables

The exact server environment is owned by Supabase/EAS/CI configuration. The
following names are documented in `.env.example` and the release contract:

| Group                 | Variables                                                                                                                                                                                                                                                             | Core/full status                                                                                                                                 |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Supabase runtime      | `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`                                                                                                                                                                                                      | Required for deployed backend/account/notification operations; service-role key is never client-visible.                                         |
| Scheduled/push        | `DAILY_REFLECTIONS_CRON_SECRET`, `EXPO_ACCESS_TOKEN`                                                                                                                                                                                                                  | Required only when the corresponding scheduled/remote-push capability is enabled and tested.                                                     |
| Billing/challenge     | `REVENUECAT_WEBHOOK_SECRET`, `REVENUECAT_API_KEY`, `REVENUECAT_WEBHOOK_TOLERANCE_SECONDS`, `REVENUECAT_ALLOW_SANDBOX`                                                                                                                                                 | Deferred unless a finite challenge is published; never enable a subscription by accident.                                                        |
| Backend observability | `SENTRY_DSN_BACKEND`, `POSTHOG_API_KEY`, `POSTHOG_HOST`                                                                                                                                                                                                               | Configure when production backend telemetry is part of the release evidence.                                                                     |
| AI/full profile       | `LLM_PROVIDER`, `LLM_DEFAULT_MODEL`, `LLM_MAX_OUTPUT_TOKENS`, provider key(s) such as `DEEPSEEK_API_KEY`, `ANTHROPIC_API_KEY`, `OPENAI_COMPATIBLE_API_KEY`, `OPENAI_COMPATIBLE_BASE_URL`, plus `OPENAI_API_KEY` for embeddings and the RAG controls in `.env.example` | Not required to run the core pilot and must not be used to enable it. A future full profile must validate provider/model/corpus readiness first. |

RAG controls such as `RAG_MATCH_COUNT`, `RAG_MIN_SIMILARITY`,
`RAG_MAX_CONTEXT_CHARS`, `RAG_MAX_QUESTION_CHARS`, `RAG_FETCH_TIMEOUT_MS`,
`FREE_DAILY_LIMIT`, and the cost/budget variables remain server-side and are
not a pilot feature switch. Changing an embedding model requires an explicit
whole-corpus re-embedding decision.

Live smoke credentials and confirmations (`RLS_SMOKE_*`, account-delete,
billing, RAG, and notification smoke variables) are disposable test inputs.
They must never be required for a local core build, printed, or committed.

## 13. Release acceptance

### 13.1 C0 completion

C0 is complete when this document has been reviewed against the technical
launch plan and audit and the following review command shows the contract
contains each required decision without a contradictory onboarding rule:

```powershell
rg -n "onboarding|AI|launch profile|environment|iOS|Android|acceptance|attribution" docs/technical-launch-contract.md
```

The command proves document coverage only. It does not prove a build, device,
provider, rights, or store gate.

### 13.2 Source-safe launch checks

Before calling a later release candidate technically ready, run these from a
clean checkout using Node 22.x and the pinned pnpm version (`pnpm@11.0.8`):

On Windows, select the pinned runtime before installing dependencies. With
`nvm-windows`, run `nvm use 22`; with `fnm`, run `fnm use 22`. Then verify
`node --version` prints `v22.x` before running `corepack enable` and
`corepack prepare pnpm@11.0.8 --activate`. Do not use a Node 24 runtime for
this matrix: it is outside the repository engine range and can make the
Expo config loader and package-manager checks report misleading results.

```powershell
nvm use 22
corepack enable
corepack prepare pnpm@11.0.8 --activate
node --version
pnpm --version
pnpm install --frozen-lockfile
node scripts/verify-workspace-lock.mjs
pnpm --filter @sandhya/content-tools build
node scripts/generate-shloka-bank.mjs --check
pnpm content:validate
pnpm typecheck
pnpm --filter @sandhya/mobile lint
pnpm --filter @sandhya/mobile test
pnpm --filter @sandhya/mobile test:smoke
pnpm --filter @sandhya/mobile build
pnpm test
pnpm build
pnpm backend:source-check
pnpm backend:check
pnpm backend:release-contract
pnpm secrets:scan
```

The later integrated orchestrator is expected to be exposed as
`pnpm verify:technical-launch`. It must run source-safe checks by default,
never print secrets, and report live/device checks as pending unless an
explicit, non-production live mode is requested.

Source-safe pass criteria:

- the lockfile, content validators, generated bank, typecheck, lint, tests,
  backend checks, and secrets scan pass;
- no user-visible deferred AI, subscription, fake social proof, or broken
  purchase entry point is reachable in the core profile;
- the route smoke matrix covers onboarding, auth callback, Today, content,
  journal, saved, unavailable AI, challenge states, settings, account, and
  deep-link destinations;
- generated/runtime manifests do not classify placeholder, untranslated,
  unaudited, or missing-audio entries as ready;
- no internal provenance field has been removed or renamed to simplify UI;
- static web export is treated as a technical artifact only, not as evidence
  of hosting, acquisition, SEO, or conversion readiness.

### 13.3 Native and physical-device acceptance

The release candidate is not technically launch-ready until signed iOS and
Android development/preview/production builds can be generated from a clean
checkout and the device matrix passes:

- cold launch, warm reopen, cached Today, first navigation, and offline
  budgets;
- current onboarding completion, persistence after process death, and visible
  content routing;
- auth callback, sign-in/recovery, account switching, export/delete, and
  sign-out isolation;
- deep links and notification cold-start, foreground, background, denial, and
  resume behaviour;
- journal/saved/progress local-first behaviour and retry/error classification;
- 320px/narrow layout, tablet layout, keyboard-visible forms, Dynamic Type,
  VoiceOver, TalkBack, and Reduce Motion;
- clear and slow audio playback, seek/pause/resume, and missing-audio state;
- no background polling leak and no avoidable full-screen spinner;
- purchase/restore/refund sandbox checks only if a published finite challenge
  is enabled. Subscription checks are not a launch acceptance path.

Crash/error telemetry, support contact, rollback owner, content-correction
owner, and the remaining external legal/rights/store checks must be listed by
owner. Local CI green is not permission to represent those checks as done.

## 14. Explicit not-done conditions

Technical launch remains **not done** if any of the following is true:

- the core build exposes AI, conversation, subscription, or an unavailable
  purchase promise;
- the app waits on a remote-only request for first value or loses local data
  while offline;
- the current onboarding flow cannot resume after process death or its
  persisted answers no longer route content as intended;
- audio is represented by a dead control, lacks the clear/slow learning pass,
  or has not passed physical iOS and Android checks;
- a quote lacks the required source/translator data or a festival date lacks
  reckoning, community, location, source, or disagreement treatment;
- a tradition or regional variation is replaced by generic boilerplate or a
  single reading is presented as universal;
- a production candidate lacks validated public configuration, signed-build
  evidence, physical-device evidence, or an explicit owner for pending
  external checks;
- a command is claimed as passed without fresh output, or a simulator/Expo Go
  run is presented as physical-device proof;
- deployment, store submission, production migration, re-embedding, or branch
  deletion was performed without the separate explicit instruction that this
  cycle excludes.

This document is the C0 contract. Wave 1 implementation may close these gates;
it must not silently change the contract, restore scoped AI, shorten onboarding,
introduce a second visual language, or trade away internal provenance to make
the implementation easier.
