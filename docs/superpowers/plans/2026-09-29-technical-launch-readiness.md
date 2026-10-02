# Sandhya Technical Launch Readiness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Make the existing Sandhya Expo/Supabase application technically releasable on real iOS and Android devices, with reliable content/data/translation pipelines and a reproducible release verification gate.

**Architecture:** Preserve the existing Expo Router, React Native, TypeScript, Zustand, TanStack Query, Supabase, Edge Functions, RevenueCat, Expo Notifications, and generated-content architecture. Work in parallel across mobile runtime, release/platform, backend, data, translation, and media tracks; integrate only through the existing generated JSON/SQL interfaces and current public function contracts.

**Tech Stack:** Expo + React Native + TypeScript, Expo Router, Zustand, TanStack Query, Supabase Auth/Postgres/Edge Functions, pgvector/RAG, RevenueCat, Expo Notifications, Vitest, Jest, EAS Build.

**Spec:** AUDIT-2026-09-29.md, the pasted audit brief, 02-plan.md, `docs/05-competitors.md`, `docs/sandhya_build_reference.docx`, `docs/design-spec.md`, `docs/superpowers/specs/2026-08-12-lane-a-navratri-delivery-design.md`, the repository guidance in AGENTS.md, and the user decisions recorded below.

## Product decisions for this plan

These decisions override the audit’s product recommendations where they differ:

1. **Keep the current onboarding flow.** Do not shorten it or redesign its question set in this plan. Improve only correctness, persistence, loading, error, accessibility, and device behavior around the existing flow.
2. **Technical launch is the primary gate.** Compliance, rights, legal wording, marketing proof, and attribution presentation are a parallel documentation/data track, not blockers for the coding agents’ technical completion.
3. **Do not remove existing provenance fields from data contracts.** The current generator, RAG tooling, and internal references use source_url, translator, licence, and related fields. Keep them stable so data generation and support/debugging continue to work. The app need not add a new attribution UX task in this plan; references can remain in terms and project documentation as directed.
4. **No broad rewrite.** Preserve public Edge Function request/response shapes, existing routes, database conventions, and generated-file workflow.
5. **Scoped AI remains disabled unless a separate full-feature launch gate is explicitly enabled.** Do not make the app look broken when AI is unavailable: hide or clearly gate its entry point.
6. **No destructive branch cleanup, production migration, corpus re-embedding, store submission, or deployment is part of agent work without explicit approval.**

The build-reference DOCX remains the architectural and content-schema baseline. Where its older milestone advice conflicts with the later 02-plan v3 and AGENTS.md standing rules, the later rules govern this launch: audio is core to the learning promise, scoped AI is cut from the Navratri pilot, the live counter stays dark, and a subscription/admin-console expansion is not part of this release.

## Technical launch profile

The default profile for this plan is the current app experience:

- Home/Today and daily content.
- Calendar and festival detail.
- Shloka/text reader and practices.
- Existing onboarding, settings, reminders, journal, saved items, and account flows.
- Authentication, account export/delete, and remote/local synchronization.
- Challenge runtime and RevenueCat code where the challenge is configured and published.
- Web export as a technical artifact, not as a marketing/SEO success claim.

## Product experience contract

The implementation work must make the existing product feel fast, useful, calm, and complete on a real phone. “Technically launchable” is not satisfied by a compiling bundle or a route that technically opens. Each lane must preserve these user-visible behaviours:

- **Opening:** after onboarding is complete, the app opens into Today/Home. A returning user should see cached daily content and their local progress before remote profile, purchase, notification, or content-sync work finishes. The first screen must not wait on an LLM call, a remote-only content request, or RevenueCat configuration. If the network is unavailable, show saved/bundled content with the existing plain offline notice and a retry path.
- **First value:** Today leads with the daily shloka/reflection and one clear next action. The journey, journal, saved items, calendar, practices, and Explore remain reachable from the existing navigation. The current onboarding flow stays intact, but its answers must persist and visibly route content as already implemented.
- **Learning loop:** a verse surface keeps Devanagari, IAST, “Say it,” meaning, and a named source/translator together. The core pronunciation promise requires a human-reviewed clear reading and a slow repeat-after-me pass with usable playback controls; missing audio must be an honest unavailable state, not a dead control. Tradition and regional variation must render as real content, not generic boilerplate.
- **Pilot scope:** the Navratri challenge is a finite, dated, optional guided journey. Its overview makes the current/locked/completed state clear, its night session is completable in roughly the stated duration, and its live participation count remains omitted below the documented threshold. Scoped AI is hidden or honestly unavailable in the core pilot; no route may promise a live answer it cannot deliver.
- **Visual language:** the current shipped baseline is a warm light interface using parchment, paper/sand surfaces and saffron, plum, sage, rose, and gold accents. “Colourful” means clear semantic accents and warm content hierarchy, not saturated decoration, confetti, or a second visual system. Use the existing typography, spacing, touch-target, icon, motion, and state rules. `docs/design-spec.md` has been aligned to the current light tokens; do not switch themes implicitly.
- **States:** every screen has an intentional loading, empty, error, offline, and success state. Controls remain usable at 320px, with the keyboard open, with Dynamic Type, with VoiceOver/TalkBack, and on tablets. Deep links, notifications, background/resume, auth callbacks, purchase restore, and account switching must land in a coherent state rather than a blank or stale screen.
- **Performance:** measure warm reopen, cold launch, time to interactive shell, time to first cached Today content, first navigation, and screen transitions on representative physical iOS and Android devices. Initial working budgets are warm reopen ≤1.5s to interactive, cold launch ≤2.5s to the interactive shell, and cached Today content ≤3.0s; C0 may tune these only with device evidence. Remote hydration and analytics are background work. A launch check fails if a normal returning user gets an avoidable full-screen spinner, if local content is erased while offline, or if a new screen adds an unbounded network/LLM dependency to first paint. Record device evidence and budgets in the technical launch contract rather than calling the app “fast” by inspection.

## Adjacent competitor benchmark contract

`docs/05-competitors.md` is part of the product and technical input, not a marketing appendix. BibleChat and bible.ai are the primary adjacent benchmarks: they solve faith learning, devotional guidance, and conversational questions for a different audience and religious structure. Dharmāyana, Diya, Dharma Daily, and Sri Mandir provide Hindu-category evidence and failure modes. The implementation must classify every borrowed pattern before adopting it:

| Benchmark lesson                                                                                 | Transfer decision for Sandhya                                                                                                                                                                                                                                                        |
| ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Fast path to a useful faith-learning experience                                                  | Adopt the principle. Keep the current onboarding flow as requested, but make every existing step load reliably, persist correctly, and lead to a real Today experience rather than delaying value behind broken loading, auth, or paywall states.                                    |
| Daily plans, study plans, audio, and a clear completion loop                                     | Adopt in Hindu-appropriate form: daily shloka/reflection, pronunciation/audio, optional practice, journal, and finite dated challenge sessions. Do not import a universal Christian daily-office obligation or guilt-based streak recovery.                                          |
| AI chat as a way to ask questions                                                                | Adopt only as a later, scoped depth layer. Do not make it the pilot headline, do not name it after a deity, do not give it a guru/persona voice, and when enabled require retrieved, structured, tradition-aware answers.                                                            |
| One canon, one verse address, one doctrinal answer                                               | Reject as a product assumption. Hindu content must keep source type, translator/commentator, tradition, regional variation, and disagreement visible. Retrieval may rank a stated preference but must not hide other readings.                                                       |
| Long onboarding, aggressive trial/paywall, or zero free value                                    | Reject the growth tactic. Do not add onboarding questions or paywall screens to this plan; preserve the current flow and ensure the user reaches trustworthy content. Revenue remains a finite, dated challenge rather than a subscription expansion.                                |
| BibleChat creator-programme growth and transformation-video format                               | Separate bought distribution from transferable creative format. The paid creator programme is not an affordable launch assumption; simple short-form, one-idea explanatory videos remain a low-cost hypothesis owned by the content/arrival track, not a reason to expand app scope. |
| Lost chat history, billing surprises, weak crisis handling, citation errors, and narrow theology | Treat as regression tests: preserve user data, make purchase states explicit, keep safety gates, never invent citations, and show multiple Hindu readings where relevant.                                                                                                            |
| AI devotional imagery, fake social proof, or a named deity assistant                             | Explicitly reject. Use no AI-generated devotional imagery, omit low-volume participation counts, and keep the assistant product-neutral.                                                                                                                                             |

The religious-context test is mandatory: a pattern is adoptable only after checking that it does not assume a single canon, central authority, universal daily obligation, one calendar, or one correct interpretation. “Conceptually similar to BibleChat” is not permission to copy those structural assumptions.

Ask/AI has two explicit states:

- **Core technical build:** entry point hidden or marked unavailable, with no broken navigation or upgrade promise.
- **Full-feature build:** enabled only after the provider/corpus/live-RAG gate passes. The backend task below keeps the interface testable without making a live provider call in ordinary CI.

## Global constraints

- Keep Expo, React Native, TypeScript, Expo Router, Supabase, pgvector, RevenueCat, and Expo Notifications.
- Do not add Redux, LangChain, another vector database, native Swift/Kotlin modules, or an alternative framework.
- Keep the current onboarding question order and semantics.
- Keep source/provenance fields in internal schemas and generated data even when their presentation is not part of technical launch.
- Never put provider/API/service-role secrets in the client bundle or EXPO_PUBLIC variables.
- Do not log tokens, full prompts, full private journal entries, or full user messages.
- Preserve RLS on every user-scoped table.
- Do not change Edge Function request/response shapes without updating all callers and contract tests.
- Do not run production migrations, re-embed the corpus, submit builds, or publish an OTA update during implementation.
- New code must work with the repository’s supported Node range, Node >=22 <23, and pinned pnpm version.
- Every task ends with a focused test and a named commit.

## Review focus

These are the failure modes most likely to survive ordinary unit tests:

1. **Cold start/offline hydration:** a user closes and reopens the app while content, onboarding state, journal data, and auth are cached or unavailable. Test that the app shows a useful state and does not erase data.
2. **Account switching and synchronization:** a user signs out, signs into another account, deletes a saved item, or saves journal entries during a failed request. Test isolation, replacement semantics, retries, and no lost updates.
3. **Real device lifecycle:** notifications, deep links, keyboard, AppState, purchase restore, and audio behave on both platforms after background/resume.
4. **Narrow and large layouts:** 320px phones, notched devices, tablets, Dynamic Type, screen readers, and keyboard-visible screens retain usable controls.
5. **Content-language fallback:** an entry with English only, an entry with Hindi and another locale, malformed Devanagari/IAST, or a missing translation never crashes and never claims a language that is not present.

---

## Work allocation

Agents may work in parallel only when their file sets do not overlap:

| Agent lane       | Tasks  | Primary file ownership                                                                                           |
| ---------------- | ------ | ---------------------------------------------------------------------------------------------------------------- |
| Mobile runtime   | C2, C3 | apps/mobile/src/lib/account.ts, localJournalStorage.ts, useAppStore.ts, content.ts, list/detail route components |
| Release/platform | C1, C4 | app.config.js, app.json, eas.json, notifications, auth callback, platform test harness                           |
| Backend          | C5, C6 | supabase/functions, supabase/migrations, supabase/config.toml                                                    |
| Data             | D1     | content/shlokas, content/challenges, scripts/content verification, generated bank only through generator         |
| Translation      | D2     | content/shlokas language sections, docs/translation, content-tools/generator tests                               |
| Media/audio      | D3     | audio asset manifest, audio loader/player contract, challenge/shloka media data                                  |
| Integration/QA   | Q1     | smoke tests, release verifier, docs/release checklist; may modify other files only after lane commits are merged |

If the app’s managed worktree is used, each agent must use its assigned worktree and must not edit another lane’s files. The current named lane has no unique commits; agents should start from current main or an explicitly approved branch.

## Task C0: Lock the technical launch contract

**Files:**

- Create: docs/technical-launch-contract.md
- Modify: none
- Test: manual review against this plan and AUDIT-2026-09-29.md

**Interfaces:**

- Consumes: current route tree, app.config.js, eas.json, .env.example, package scripts, `docs/sandhya_build_reference.docx`, `docs/design-spec.md`, the current theme tokens, and this plan.
- Produces: one checked-in scope document defining core/full feature profiles, required environment variables, the opening/first-value/content/navigation/state/performance contract, release artifacts, and acceptance commands.

- [ ] **Step 1: Write the contract**

Document:

- core launch routes and routes hidden when AI is disabled;
- the existing onboarding flow is intentionally retained;
- the intended opening path: splash/hydration, Today/Home, cached first value, background sync, offline fallback, and the first useful action;
- the user-visible content loop: daily shloka/reflection, pronunciation/audio, practice, journal, saved items, calendar, Explore, Journey, and finite challenge states;
- the current warm light colour baseline as codified in `docs/design-spec.md` and `apps/mobile/src/theme/tokens.ts`;
- the adjacent-competitor benchmark classification from `docs/05-competitors.md`, including what is adopted, adapted, rejected, or deferred and why;
- measurable startup and first-content performance evidence on representative physical iOS and Android devices;
- required loading, empty, error, offline, success, accessibility, narrow-layout, keyboard, and background/resume states;
- which content/data checks are technical runtime checks;
- which compliance/rights/attribution references live in docs/terms and are not part of the coding gate;
- required development, preview, and production environment variables;
- iOS and Android device matrix;
- mandatory commands and pass criteria;
- explicit “not done” conditions such as missing signed builds or missing live provider configuration.

- [ ] **Step 2: Review the contract**

Run: rg -n "onboarding|AI|launch profile|environment|iOS|Android|acceptance|attribution" docs/technical-launch-contract.md

Expected: every decision above appears once, with no contradictory “shorten onboarding” requirement.

- [ ] **Step 3: Commit**

Commit message: docs: define technical launch contract

## Task C1: Production configuration and reproducible build inputs

**Files:**

- Modify: apps/mobile/app.config.js
- Modify: apps/mobile/app.json
- Modify: apps/mobile/eas.json
- Modify: .env.example
- Create: scripts/verify-mobile-launch-config.mjs
- Test: scripts/verify-mobile-launch-config.test.mjs or the repository’s existing Node test convention

**Interfaces:**

- Consumes: environment names already read by app.config.js and the EAS profiles.
- Produces: verifyMobileLaunchConfig(environment, profile) behavior that reports missing/invalid public configuration without printing secret values.

- [ ] **Step 1: Add failing configuration tests**

Cover:

- development config can evaluate with local placeholders;
- preview config reports missing public values;
- production config rejects missing Supabase URL/anon key, EAS project UUID, RevenueCat public keys, support email, privacy URL, and terms URL;
- invalid HTTPS URLs, email, and UUIDs fail;
- error output names variables but never prints values.

- [ ] **Step 2: Run the focused test**

Run: node --test scripts/verify-mobile-launch-config.test.mjs

Expected: FAIL because the verifier is not implemented.

- [ ] **Step 3: Implement the verifier**

Create scripts/verify-mobile-launch-config.mjs with:

- a pure exported function verifyMobileLaunchConfig(env, profile) returning { ok: boolean, missing: string[], invalid: string[] };
- a CLI that exits 0 only when the selected profile is valid;
- the same validation rules as app.config.js, with one source of truth where practical.

Do not accept a fake non-HTTPS privacy/terms URL merely to make CI green.

- [ ] **Step 4: Align app config and EAS profiles**

Keep existing bundle identifiers and project identifiers. Add only the profile/flag values needed to make core versus full feature behavior explicit. Do not commit real environment values.

- [ ] **Step 5: Run focused checks**

Run:

- node --test scripts/verify-mobile-launch-config.test.mjs
- pnpm --filter @sandhya/mobile typecheck
- pnpm --filter @sandhya/mobile build

Expected: PASS, with production validation tested through fixtures rather than real credentials.

- [ ] **Step 6: Commit**

Commit message: chore: make mobile launch configuration verifiable

## Task C2: Make local and remote user data reliable

**Files:**

- Modify: apps/mobile/src/store/useAppStore.ts
- Modify: apps/mobile/src/lib/localJournalStorage.ts
- Modify: apps/mobile/src/lib/account.ts
- Modify: apps/mobile/src/lib/content.ts
- Create: apps/mobile/src/lib/account.test.ts
- Create or modify: apps/mobile/src/lib/localJournalStorage.test.ts

**Interfaces:**

- Consumes: SavedItem, LocalJournalEntry, ContentLibrary, current Supabase tables, and existing public account functions.
- Produces:
  - replaceSavedItems(items: SavedItem[]): void, replacing the remote snapshot rather than unioning stale IDs;
  - serialized per-scope local journal mutations behind the existing read/write/remove/clear functions;
  - explicit sync result/error classification so an authorization/server error is not silently reported as a successful offline save.

- [ ] **Step 1: Add failing state tests**

Test:

- replacing a remote saved snapshot removes an item deleted on the server;
- item type mapping stays aligned with item IDs;
- guest and authenticated scopes do not overwrite one another;
- concurrent journal write/remove operations preserve the last valid state;
- clearing a scope removes its index and all chunks;
- malformed or oversized stored values are ignored without crashing;
- a failed remote journal insert reports synced false and preserves the local entry.

- [ ] **Step 2: Run focused tests**

Run: pnpm --filter @sandhya/mobile test -- src/lib/account.test.ts src/lib/localJournalStorage.test.ts

Expected: FAIL on stale union and concurrent-write behavior.

- [ ] **Step 3: Implement replacement semantics**

Add replaceSavedItems and update account hydration callers to use it. Do not change onboarding preference retention without a separate product decision; the existing device-owned behavior remains documented.

- [ ] **Step 4: Serialize journal mutations**

Use a per-scope promise queue or equivalent small lock around read-modify-write-delete operations. Preserve the current chunk format and MAX_ENTRIES limit. Do not replace the storage architecture.

- [ ] **Step 5: Distinguish offline from server failure**

Keep local fallback for known network/offline failures. Surface or record authentication, RLS, validation, and unexpected server failures so the UI can offer retry rather than silently hiding a broken backend.

- [ ] **Step 6: Fix remote detail loading**

For festival, concept, deity, practice, text, and other detail routes using useCuratedContent, render loading while the requested record can still be fetched. Render unavailable only after the query has settled and both remote and fallback data are absent.

- [ ] **Step 7: Run focused and regression tests**

Run:

- pnpm --filter @sandhya/mobile test -- src/lib/account.test.ts src/lib/localJournalStorage.test.ts src/data/content.test.ts
- pnpm --filter @sandhya/mobile typecheck

Expected: PASS with no change to the existing onboarding route.

- [ ] **Step 8: Commit**

Commit message: fix: make account sync and local journal writes reliable

## Task C3: Lists, polling, lifecycle, and network feedback

**Files:**

- Modify: apps/mobile/src/components/ui.tsx
- Modify: apps/mobile/app/journal.tsx
- Modify: apps/mobile/app/saved.tsx
- Modify: apps/mobile/app/conversation/[id].tsx
- Modify: apps/mobile/app/challenge/[slug]/index.tsx
- Modify: apps/mobile/src/lib/challenges.ts
- Create: apps/mobile/src/lib/challengePolling.ts
- Test: apps/mobile/src/lib/challengePolling.test.ts

**Interfaces:**

- Consumes: current challenge purchase/overview hooks and React Native AppState.
- Produces:
  - getChallengePollingPlan(state): { enabled: boolean; intervalMs: number | false; reason: string };
  - a bounded polling behavior that stops after 60 seconds, pauses in background, and resumes only while the screen is focused;
  - virtualized list rendering for growing user-owned collections.

- [ ] **Step 1: Write failing polling tests**

Cover initial polling, successful completion, timeout, background pause, foreground resume, and cancellation on unmount.

- [ ] **Step 2: Run the focused test**

Run: pnpm --filter @sandhya/mobile test -- src/lib/challengePolling.test.ts

Expected: FAIL because the helper is not present.

- [ ] **Step 3: Implement bounded polling**

Use a 3-second interval with a 20-attempt maximum unless the existing backend contract requires a smaller limit. Do not create a timer while the app is backgrounded or the route is unmounted. Show a recoverable timeout state with retry.

- [ ] **Step 4: Replace unbounded collection rendering**

Use FlatList or the existing project list pattern for journal, saved items, conversations, and messages. Preserve current visual cards, empty states, pull-to-refresh behavior, and accessibility labels.

- [ ] **Step 5: Add network and retry feedback**

Use existing query state rather than adding a second networking library. Every remote list/detail screen must distinguish loading, empty, offline/stale, error, and retryable states.

- [ ] **Step 6: Run checks**

Run:

- pnpm --filter @sandhya/mobile test -- src/lib/challengePolling.test.ts
- pnpm --filter @sandhya/mobile typecheck
- pnpm --filter @sandhya/mobile lint

- [ ] **Step 7: Commit**

Commit message: fix: bound polling and virtualize growing collections

## Task C4: Device UX, accessibility, and responsive launch polish

**Files:**

- Modify: apps/mobile/app/(tabs)/index.tsx
- Modify: apps/mobile/app/(tabs)/calendar.tsx
- Modify: apps/mobile/app/practice/[id].tsx
- Modify: apps/mobile/app/index.tsx
- Modify: apps/mobile/app/\_layout.tsx
- Modify: apps/mobile/app/(tabs)/ask.tsx
- Modify: apps/mobile/src/components/ContentSourceNotice.tsx
- Modify: apps/mobile/src/theme/tokens.ts
- Modify: relevant detail routes
- Test: apps/mobile/smoke/routes.smoke.test.tsx and focused component tests where an existing harness supports them

**Interfaces:**

- Consumes: existing route components and theme tokens.
- Produces: usable 320px, tablet, keyboard-visible, loading, retry, and screen-reader states without changing onboarding questions or copy strategy.

- [ ] **Step 1: Add regression cases**

Add tests or deterministic layout assertions for:

- seven date cells fitting or scrolling on 320px;
- loading spinner exposing an accessible status;
- practice back button having an accessible label;
- calendar cells announcing enough date context;
- content source fallback exposing retry;
- account hydration failure producing visible recovery;
- Ask composer remaining above the Android keyboard when the feature is enabled.

- [ ] **Step 2: Implement narrow-layout behavior**

Choose a single project-consistent strategy: compact cells, horizontal scroll, or responsive cell width. Do not allow clipping or invisible controls.

- [ ] **Step 3: Implement accessibility labels and recovery**

Add labels/roles/hints to unlabeled controls, use live/status semantics for loading and errors, and provide retry actions. Preserve safe-area behavior.

- [ ] **Step 4: Implement keyboard/lifecycle behavior**

Wrap the absolute Ask composer with KeyboardAvoidingView or an equivalent platform-specific layout. Confirm dismissal, submit, and scroll behavior on Android and iOS.

- [ ] **Step 5: Run checks**

Run:

- pnpm --filter @sandhya/mobile test:smoke
- pnpm --filter @sandhya/mobile lint
- pnpm --filter @sandhya/mobile typecheck

Physical-device checks are required in Q1; Jest success alone is insufficient.

- [ ] **Step 6: Commit**

Commit message: fix: harden mobile layout and accessibility states

## Task C5: Notifications, deep links, and app lifecycle

**Files:**

- Create: apps/mobile/src/lib/notificationRouting.ts
- Modify: apps/mobile/src/lib/notifications.native.ts
- Modify: apps/mobile/src/lib/notifications.ts
- Modify: apps/mobile/app/\_layout.tsx
- Modify: apps/mobile/app/festival/[id].tsx
- Create: apps/mobile/src/lib/notificationRouting.test.ts

**Interfaces:**

- Consumes: notification payloads from Expo Notifications and the current festival catalog.
- Produces:
  - parseNotificationRoute(payload: unknown): NotificationRoute | null;
  - a route allowlist for reflection/festival destinations;
  - consistent native/web no-op behavior;
  - safe handling of cold-start and foreground notification responses.

- [ ] **Step 1: Write failing routing tests**

Test valid festival payloads, missing/unknown festival IDs, malformed payloads, reflection payloads, unrelated notification types, and cold-start null state.

- [ ] **Step 2: Implement the pure route parser**

Return only known route types and a normalized festival ID. Never pass arbitrary notification strings directly to router.push.

- [ ] **Step 3: Wire native responses**

Use the parser from subscribeToNotificationResponses and getInitialNotificationRoute. Keep the web implementation a safe no-op.

- [ ] **Step 4: Verify reminder lifecycle**

Ensure enable, change time, cancel, sign-out/unregister, and permission denial all produce a user-visible state. Keep the current reminder API shape.

- [ ] **Step 5: Run checks**

Run:

- pnpm --filter @sandhya/mobile test -- src/lib/notificationRouting.test.ts
- pnpm --filter @sandhya/mobile typecheck
- pnpm backend:source-check

- [ ] **Step 6: Commit**

Commit message: fix: validate notification routes and lifecycle behavior

## Task C6: Backend request limits and challenge state transitions

**Files:**

- Create: supabase/functions/\_shared/read-body.ts
- Create: supabase/functions/\_shared/read-body.test.ts or the existing Edge test equivalent
- Modify: supabase/functions/ask/index.ts
- Modify: supabase/functions/revenuecat-webhook/index.ts
- Modify: supabase/config.toml
- Create: supabase/migrations/<new_timestamp>\_secure_challenge_completion.sql
- Modify: apps/mobile/src/lib/challenges.ts
- Test: backend source/security checks and the mobile challenge tests

**Interfaces:**

- Produces:
  - readBodyWithLimit(request: Request, maxBytes: number): Promise<Uint8Array>;
  - public.complete_challenge_night(p_challenge_id uuid, p_night integer): jsonb;
  - completeChallengeNight(challengeId: string, night: number): Promise<boolean> calling the RPC rather than direct table INSERT.

- [ ] **Step 1: Write bounded-reader tests**

Cover a body under the limit, exactly at the limit, over the limit with Content-Length, and over the limit without Content-Length/chunking. Assert the over-limit path stops before JSON parsing or HMAC/provider work.

- [ ] **Step 2: Implement the shared bounded reader**

Read request.body incrementally, stop at maxBytes plus one, and throw a typed 413-compatible error. Do not call request.clone().json() or request.text() before the limit is enforced.

- [ ] **Step 3: Wire Ask and RevenueCat**

Use the bounded reader before parsing. Preserve the current structured error codes, HMAC raw-body behavior, and streaming/non-streaming response shapes.

- [ ] **Step 4: Write the challenge RPC migration**

The RPC must derive auth.uid(), verify the user is a participant, verify the published challenge/session exists, verify the configured night and unlock date, set completed_at from server time, and be idempotent. Revoke direct client INSERT access if the current migration history permits it without rewriting history; otherwise add a deny policy/new RPC-only path.

- [ ] **Step 5: Update the mobile mutation**

Keep the public completeChallengeNight signature. Map RPC status values to the existing boolean/result contract and expose unexpected errors to the route for retry.

- [ ] **Step 6: Run backend checks**

Run:

- pnpm backend:source-check
- pnpm backend:check
- pnpm --filter @sandhya/mobile typecheck
- pnpm --filter @sandhya/mobile test

Do not apply the new migration to production during this task.

- [ ] **Step 7: Commit**

Commit message: fix: bound public bodies and authorize challenge completion

## Task C7: Make feature availability explicit

**Files:**

- Modify: apps/mobile/app/(tabs)/\_layout.tsx
- Modify: apps/mobile/app/(tabs)/ask.tsx
- Modify: apps/mobile/app/subscription.tsx
- Modify: apps/mobile/src/lib/payments.ts
- Modify: apps/mobile/src/lib/askDharma.ts only if needed for unavailable-state typing
- Create: apps/mobile/src/lib/launchProfile.ts
- Test: apps/mobile/src/lib/launchProfile.test.ts

**Interfaces:**

- Produces:
  - type LaunchProfile = "core" | "full";
  - getLaunchProfile(env: Record<string, string | undefined>): LaunchProfile;
  - isFeatureAvailable(feature: "ask" | "payments" | "challenge"): boolean.

- [ ] **Step 1: Add failing profile tests**

Test default/core behavior, explicit full behavior, invalid values, payments flag off, and the combination where full AI is requested without provider readiness.

- [ ] **Step 2: Implement the profile resolver**

Default to core. Keep public configuration names documented and avoid putting provider secrets in the resolver. The resolver controls visibility and copy, not authorization or quota enforcement.

- [ ] **Step 3: Remove broken promises**

When a feature is unavailable, remove its tab/upgrade entry point or show a deliberate unavailable state with no purchase implication. Do not leave Ask and Plus reachable while their backend is disabled.

- [ ] **Step 4: Preserve the full path**

Do not delete Ask/subscription/challenge code. Keep it buildable behind the profile so later activation is a controlled configuration change.

- [ ] **Step 5: Run checks**

Run:

- pnpm --filter @sandhya/mobile test -- src/lib/launchProfile.test.ts
- pnpm --filter @sandhya/mobile typecheck
- pnpm --filter @sandhya/mobile lint

- [ ] **Step 6: Commit**

Commit message: feat: make launch feature availability explicit

## Task D1: Runtime content/data readiness manifest

**Files:**

- Create: scripts/verify-runtime-content.mjs
- Create: docs/content/runtime-content-manifest.json
- Modify: scripts/generate-shloka-bank.mjs only if the verifier needs a shared parser helper
- Modify: packages/content-tools/src/index.ts only for a narrowly tested runtime-status field
- Test: scripts/verify-runtime-content.test.mjs and packages/content-tools/src/index.test.ts

**Interfaces:**

- Produces a machine-readable report with:
  - slug;
  - generated/bundled status;
  - required runtime fields present;
  - translation language codes present;
  - placeholder/pending markers;
  - audio status;
  - internal source/reference status;
  - recommended action: ready, translate, record-audio, review-data, or hold.

- [ ] **Step 1: Define the runtime schema**

Use the existing generated shape:

- core: slug, textRef, tradition, tags, dailyPool, Devanagari, IAST, Say it, English translation, source, reflection, translation map;
- details: word gloss, English meaning, meaning map.

Do not change the mobile Shloka type merely to add a display attribution requirement. Keep source/provenance metadata in the input/docs contract.

- [ ] **Step 2: Write failing inventory tests**

Test duplicate slugs, missing core fields, empty word gloss, malformed ISO language codes, placeholder translation text, unsupported locale names, and generated-bank drift.

- [ ] **Step 3: Implement the verifier**

Scan content/shlokas, run the existing content validator, compare approved/generated entries, and write deterministic JSON sorted by slug. Do not edit content automatically.

- [ ] **Step 4: Generate and review the manifest**

Run: node scripts/verify-runtime-content.mjs --write

Expected: a deterministic manifest showing exactly which entries are runtime-ready, translation-needed, audio-needed, or held. Pending metadata should be reported, not silently shipped as complete.

- [ ] **Step 5: Add CI/check mode**

Run: node scripts/verify-runtime-content.mjs --check

Expected: exit 0 when the checked-in manifest and generated bank agree; exit nonzero on drift.

- [ ] **Step 6: Run content checks**

Run:

- pnpm --filter @sandhya/content-tools build
- pnpm content:validate
- node scripts/generate-shloka-bank.mjs --check
- node scripts/verify-runtime-content.mjs --check

- [ ] **Step 7: Commit**

Commit message: feat: add deterministic runtime content readiness checks

## Task D2: Translation inventory and reviewed translation workflow

**Files:**

- Create: docs/translation/README.md
- Create: docs/translation/manifest.csv
- Create: scripts/build-translation-manifest.mjs
- Create: scripts/verify-translation-manifest.mjs
- Modify: scripts/generate-shloka-bank.mjs only if manifest status needs to be carried into generated output
- Test: scripts/translation-manifest.test.mjs
- Content changes: content/shlokas/\*.md, only for entries assigned to this agent

**Interfaces:**

- Translation input remains Markdown:
  - verse translation: a labeled Meaning (xx) line inside the Shloka section;
  - prose meaning: a Meaning (xx) section;
  - English remains the fallback.
- Manifest row shape:
  - slug, source_language, target_language, verse_status, prose_status, reviewer, last_reviewed, notes.
- Generated output continues to expose translations and meanings through Shloka.translations and ShlokaDetails.meanings.

- [ ] **Step 1: Inventory existing coverage**

Run: node scripts/build-translation-manifest.mjs --write

Count coverage for en, hi, bn, gu, mr, and ta without claiming a locale is complete merely because one entry has it.

- [ ] **Step 2: Add failing parser/fallback tests**

Test:

- English-only entry falls back to English for every requested locale;
- Hindi verse and prose are independently selected;
- a missing prose meaning does not hide an existing verse translation;
- malformed locale labels are rejected;
- generated language availability matches actual bank keys.

- [ ] **Step 3: Implement manifest verification**

Create verify-translation-manifest.mjs --check. It must fail on duplicate rows, unknown slugs, unknown language codes, a status marked reviewed without text, or generated bank drift.

- [ ] **Step 4: Translate in batches**

Use one batch per commit, grouped by text family. Do not mass-edit all 661 files in one commit. Every changed file must preserve Devanagari, IAST, Say it, word gloss, reflection, and current Markdown section ordering.

Machine-assisted drafts may be used only as drafts. A human reviewer must mark a translation reviewed before the manifest says it is ready. The app may fall back to English; it must never display a partial or placeholder translation as complete.

- [ ] **Step 5: Update language selection behavior**

Expose only languages with meaningful generated coverage, or label a language as partial. Do not claim full UI localization; the current UI copy remains English unless a separate localization task is approved.

- [ ] **Step 6: Run translation/data checks**

Run:

- node scripts/build-translation-manifest.mjs --check
- node scripts/verify-translation-manifest.mjs --check
- pnpm --filter @sandhya/content-tools test
- pnpm content:validate
- node scripts/generate-shloka-bank.mjs --check

- [ ] **Step 7: Commit each batch**

Commit message pattern: content: review Hindi translations for <text family>

## Task D3: Audio/media data contract

**Files:**

- Create: apps/mobile/src/lib/audio.ts
- Create: apps/mobile/src/lib/audio.test.ts
- Create: docs/audio/README.md
- Create: docs/audio/manifest.csv
- Modify: scripts/generate-shloka-bank.mjs only if a stable audio asset key is added
- Modify: apps/mobile/src/lib/shlokas.ts
- Modify: relevant shloka/challenge screens
- Content/media: audio files or approved remote asset manifest, assigned separately

**Interfaces:**

- type AudioAsset = { key: string; uri: string; durationMs: number; language: string; speed: "clear" | "slow" };
- resolveShlokaAudio(slug: string, speed: AudioAsset["speed"]): AudioAsset | null;
- playback state exposes loading, playing, paused, ended, and error.

The current mobile package does not include an audio playback dependency. Before implementation, the media agent must record one SDK-54-compatible Expo playback choice in docs/audio/README.md. Adding that dependency is the only planned exception to the no-new-framework rule and requires an explicit package/version review. If it is not approved, keep D3 as a manifest/resolver task and set the core launch profile’s audio state to unavailable rather than shipping a silent or broken player.

- [ ] **Step 1: Write resolver tests**

Test an entry with both clear and slow audio, clear-only fallback, missing audio, malformed manifest rows, and a slug that does not exist.

- [ ] **Step 2: Implement the manifest-backed resolver**

Do not hard-code a separate audio URL in every screen. Keep the media map deterministic and allow the app to render a clear “audio unavailable” state while data work is pending.

- [ ] **Step 3: Add player behavior**

Use the project’s existing Expo-compatible media choice; do not add a native module without approval. Support play/pause, clear/slow selection, interruption cleanup, and AppState pause.

- [ ] **Step 4: Wire the same contract to shloka and challenge screens**

The data agent supplies keys; the app consumes AudioAsset. Avoid duplicating playback logic in challenge and shloka routes.

- [ ] **Step 5: Run checks**

Run:

- pnpm --filter @sandhya/mobile test -- src/lib/audio.test.ts
- pnpm --filter @sandhya/mobile typecheck
- pnpm --filter @sandhya/mobile lint

Physical-device audio validation is part of Q1.

- [ ] **Step 6: Commit**

Commit message: feat: add shared shloka audio contract and playback

## Task Q1: Integrated verification and release gate

**Files:**

- Create: scripts/verify-technical-launch.mjs
- Create: docs/release/technical-launch-checklist.md
- Modify: apps/mobile/smoke/routes.smoke.test.tsx
- Modify: package.json only to add a named verification script
- Test: the full existing test/build suite and device checklist

**Interfaces:**

- Produces: pnpm verify:technical-launch, a deterministic local gate that runs source-safe checks and reports external device/live-service checks as explicit pending items rather than pretending they passed.

- [ ] **Step 1: Expand smoke route coverage**

Add onboarding, auth callback, journal, saved, conversation/unavailable, challenge overview/night, subscription/profile-gated, and settings/account routes to the existing smoke matrix. Keep the test deterministic and avoid requiring live Supabase or RevenueCat.

- [ ] **Step 2: Add release checklist**

The checklist must include:

- supported Node/pnpm versions;
- clean install;
- config verifier;
- content/translation/runtime manifests;
- typecheck/lint/test/build;
- backend source/release checks;
- web export;
- iOS development/preview/production build;
- Android development/preview/production build;
- physical-device auth, deep link, notifications, keyboard, audio, offline, account deletion, and purchase restore;
- crash/telemetry verification;
- rollback and support contacts.

- [ ] **Step 3: Implement the orchestrator**

Run only commands that are safe in a local checkout. Allow an environment variable such as TECHNICAL_LAUNCH_LIVE=1 to opt into live checks, but never print secrets or run production mutations by default.

- [ ] **Step 4: Fix root lint/format issues**

Exclude managed .worktrees from root lint traversal, fix the unnecessary smoke-route assertion, and resolve the three format-check failures in a focused cleanup commit.

- [ ] **Step 5: Run the integrated gate**

Run:

- pnpm verify:technical-launch
- pnpm test
- pnpm typecheck
- pnpm --filter @sandhya/mobile lint
- pnpm build
- pnpm backend:source-check
- pnpm secrets:scan

Expected: all source-safe checks pass; any live/device items are listed as pending with owners.

- [ ] **Step 6: Commit**

Commit message: test: add technical launch verification gate

## Dependency order

Parallel after C0:

- C1 configuration;
- C2 data lifecycle;
- C3 lists/polling;
- C4 device UX;
- C5 notifications;
- D1 content manifest;
- D2 translation manifest;
- D3 audio contract.

After C1 and C5:

- C7 feature availability.

After C2/C3:

- C4 route-state integration;
- Q1 smoke expansion.

After C6 and D1:

- challenge/content integration;
- Q1 release gate.

Final order:

C0 -> parallel C1/C2/C3/C4/C5/D1/D2/D3 -> C6/C7 -> Q1 -> physical-device gate

## Acceptance criteria

The technical launch is ready only when:

1. The production configuration verifier passes with real-but-unprinted environment values.
2. iOS and Android preview/production builds can be generated from a clean checkout.
3. Core routes have no broken entry point for disabled features.
4. Existing onboarding completes, resumes after process death, and retains its current routing behavior.
5. Journal, saved items, account switching, export/delete, and offline fallback pass lifecycle tests.
6. Lists are virtualized where data grows and challenge polling is bounded/lifecycle-aware.
7. Notification/deep-link payloads are allowlisted and tested for cold start/foreground/background.
8. Content and translation manifests are deterministic, generated bank is current, and no placeholder text is silently classified as runtime-ready.
9. Translation fallback works for every available language code without crashing or making a false completeness claim.
10. Audio either passes the shared media contract/device checks or the release profile explicitly marks audio unavailable; it must not silently fail.
11. Backend source, migration, RLS, secrets, typecheck, lint, tests, and builds pass.
12. The remaining external checks are listed with an owner and are not represented as completed merely because local CI is green.

## Out of scope

- Shortening or replacing the onboarding questions.
- Rebranding or a broad visual redesign.
- Market-size validation, paid acquisition, SEO strategy, or conversion optimization.
- New AI behavior or corpus re-embedding.
- Removing internal source/provenance fields from data contracts.
- A large migration rewrite or new framework.
- Store submission, production deployment, OTA publication, or production database changes.

## Handoff to agents

Start each agent with the relevant task number, current main revision, exact file ownership, and the required focused command. Agents should report:

- files changed;
- tests run and exact output;
- external checks still pending;
- generated artifacts changed;
- any interface change needed by another lane.

No agent should silently reinterpret “technical launch” as “compliance complete,” and no agent should silently delete existing attribution/provenance fields or alter the onboarding product decision.
