# Sandhya launch-readiness audit — 30 September 2026

## 1. Executive summary

The Sandhya launch is **not ready**.

The coordinator branch is source-safe: the pinned Node 22.23.3 / pnpm 11.0.8
verification suite passes, the Expo web export passes, the route smoke passes,
and the source checks pass. The core pilot now keeps deferred AI out of the
Today, Journey, Explore, saved, detail, and conversation entry points, while
the Ask tab remains conditional on the explicit full-profile readiness flag.

The launch is still blocked by product-critical evidence that the repository
cannot manufacture: 1 approved source-rights row out of 431, zero reviewed
translation rows, zero approved audio recordings, zero runtime entries marked
ready, no signed iOS/Android builds, no physical-device matrix, and no live
operational evidence. Scoped AI, subscription, and the live participation
counter remain disabled for the Navratri pilot as required.

## 2. Scope, method, and evidence boundary

This audit covers the current mobile app, the coordinator branch, all relevant
local branches/worktrees, the Wave 1/Wave 2 integration history, content and
translation manifests, rights/audio trackers, release contracts, backend source
checks, and the user-supplied 38-section audit brief.

The exact coordinator checkout is:

```text
branch:   codex/launch-readiness
worktree: C:\Users\vaibh\.codex\worktrees\launch-readiness\Sandhya
base:     58fdd07f62cd27159c93800f4bc84581290bfe7e
commit:   92f653c46ab796393e8ff415337dc190e4933e39
```

The main checkout and the existing `codex/next-wave` worktree were not edited.
No branch was deleted, rebased, reset, pushed, merged, deployed, submitted to
a store, migrated against production, or re-embedded.

Six read-only specialists were dispatched, but their final responses were not
retrievable from the agent runtime. Their output was therefore not treated as
evidence; the findings below come from direct repository inspection and the
source-safe commands.

| Specialist scope                      | Agent id                               | Status                           |
| ------------------------------------- | -------------------------------------- | -------------------------------- |
| Branch archaeology and integration    | `01a0eeeb-062f-71c0-b68e-7d7ebeb7cb3b` | Dispatched; no retrievable final |
| Track A corpus/data readiness         | `01a0eeeb-08c4-7670-978d-35a7075f3e39` | Dispatched; no retrievable final |
| Translation and glossary QA           | `01a0eeeb-0cd3-7da2-8878-5e247012f3b0` | Dispatched; no retrievable final |
| Mobile UX, lifecycle, and performance | `01a0eeeb-164b-7e32-947f-0354c71007f8` | Dispatched; no retrievable final |
| Release/platform/device gates         | `01a0eeeb-10dc-7003-99b7-0c8eaedb97f0` | Dispatched; no retrievable final |
| Backend/security                      | `01a0eeeb-1c9f-71f0-840c-232f9a9e0699` | Dispatched; no retrievable final |

## 3. Current integrated state

Wave 1 is represented by `492c07f`. Wave 2 is represented by `58fdd07`, with
the preceding feature commits for notification hardening, secure challenge
completion, shared audio contracts, and explicit launch feature availability:

- `98533d6` — notification routes and lifecycle validation;
- `ce74a43` — secure challenge completion;
- `c2c5efd` — shared shloka audio contract and playback surface;
- `4c073fd` — explicit launch feature availability;
- `58fdd07` — route smoke against the full profile.

The coordinator change set adds a pinned source-safe verifier and release
checklist, fixes the remaining core-profile AI entry points, removes the
persona-style Q&A branding from user-facing copy, and fixes a conditional-hook
ordering issue in the subscription screen.

## 4. Branch and worktree inventory

All of these branches remain present and their worktrees remain intact.

| Branch                            | HEAD                                  | Relationship to Wave 2        | Finding                                                    |
| --------------------------------- | ------------------------------------- | ----------------------------- | ---------------------------------------------------------- |
| `codex/launch-readiness`          | `58fdd07` + local coordinator changes | Coordinator base              | Active audit/work branch                                   |
| `codex/next-wave`                 | `58fdd07`                             | Same as Wave 2                | Existing worktree preserved and untouched                  |
| `codex/c5-notifications`          | `492c07f`                             | Behind Wave 2                 | Contains the old untracked notification test artifact      |
| `codex/c6-backend`                | `492c07f`                             | Behind Wave 2                 | No unique commits beyond baseline                          |
| `codex/d3-audio`                  | `492c07f`                             | Behind Wave 2                 | No unique commits beyond baseline                          |
| `codex/integration-review`        | `492c07f`                             | Behind Wave 2                 | Integration base only                                      |
| `codex/content-readiness`         | `73d3f2b`                             | Ancestor already integrated   | Runtime/translation readiness work is in Wave 2            |
| `codex/mobile-stability`          | `327b6bc`                             | Ancestor already integrated   | Lifecycle and launch UX work is in Wave 2                  |
| `codex/production-config`         | `3880b07`                             | Ancestor already integrated   | Launch configuration work is in Wave 2                     |
| `codex/closeout-smoke-fix`        | `a9ad898`                             | Separate older smoke-fix line | Superseded; its diff removes substantial Wave 2 safeguards |
| `codex/corpus-translation-launch` | `69b110b`                             | Seven commits ahead of Wave 2 | Content foundation/review branch; not launch-ready content |
| `codex/lane-a-navratri`           | `a9f2a821`                            | Separate challenge worktree   | Preserved; no coordinator changes applied                  |
| `main`                            | `0a361b1`                             | Technical-contract baseline   | Dirty with user-owned design/audit files; untouched        |

## 5. Branch archaeology findings

The only material branch divergence beyond the coordinator base is the corpus
branch and the older closeout-smoke-fix branch.

`codex/corpus-translation-launch` currently ends at `69b110b`. It adds
canonical witness and editorial-decision machinery, 1,869 witness rows,
rejection data, detailed corpus/translation plans, a 186-row glossary scaffold,
locale style guides, and a 22,428-key durable translation-review register.
The review register is structurally useful but contains only `draft` and
`pending` rows; it does not supply named human-approved translations, turn the
source tracker into a rights-cleared corpus, or supply audio. It should not be
presented as launch content without a content-owner review and explicit rights
decisions. It remains unmerged into the coordinator branch.

`codex/closeout-smoke-fix` is not a safe merge candidate from this base: its
diff removes the launch profile, audio, challenge, notification, backend body
limits, tests, and migration safeguards that Wave 2 intentionally integrated.
It remains available for archaeology only.

The old C5 worktree contains an untracked
`apps/mobile/src/lib/notificationRouting.test.ts`. Its imports target APIs that
do not exist in the current coordinator tree, so it was inspected and left
untouched in its original worktree. The current notification-route test is the
valid, narrower contract used by the integrated code.

## 6. Coordinator code and documentation changes

Changes made in this worktree:

- `scripts/verify-technical-launch.mjs` — pinned Node/pnpm source-safe verifier;
- `scripts/verify-technical-launch.test.mjs` — manifest safety and toolchain
  contract tests;
- `package.json` — `verify:technical-launch` script;
- `docs/release/technical-launch-checklist.md` — dated source-safe evidence and
  explicit device/live/rights gates;
- core-profile guards in Today, Journey, Explore, Saved, conversations, and
  concept/text/deity detail routes;
- user-facing Q&A copy changed from the deity/persona-style name to neutral
  source-grounded wording;
- subscription `useEffect` moved above the payments-disabled early return so
  hooks are called in a stable order.

No content schema, RAG interface, Edge Function request/response shape, source
rights record, audio record, migration, or generated corpus was changed.

Exact files changed in implementation commit `92f653c`:

```text
apps/mobile/README.md
apps/mobile/app/(tabs)/ask.tsx
apps/mobile/app/(tabs)/explore.tsx
apps/mobile/app/(tabs)/index.tsx
apps/mobile/app/(tabs)/journey.tsx
apps/mobile/app/concept/[id].tsx
apps/mobile/app/conversation/[id].tsx
apps/mobile/app/conversations.tsx
apps/mobile/app/deity/[id].tsx
apps/mobile/app/legal.tsx
apps/mobile/app/saved.tsx
apps/mobile/app/subscription.tsx
apps/mobile/app/text/[id].tsx
apps/mobile/src/data/content.test.ts
apps/mobile/src/lib/i18n.ts
docs/release/launch-readiness-audit-2026-09-30.md
docs/release/technical-launch-checklist.md
package.json
scripts/verify-account-flow.mjs
scripts/verify-account-flow.test.mjs
scripts/verify-technical-launch.mjs
scripts/verify-technical-launch.test.mjs
```

The later documentation amendment commit updates only the two files under
`docs/release/` with the final commit and live corpus-branch evidence.

## 7. Architecture and launch profile

The app uses Expo SDK 54, React Native 0.81.5, TypeScript, Expo Router,
NativeWind, TanStack Query, Zustand, Supabase Auth/Postgres/Storage/Edge
Functions, and pgvector. The mobile package keeps AI calls behind the backend;
there are no client API keys or direct model calls in the coordinator change.

The core profile is the default. Full profile requires both
`EXPO_PUBLIC_LAUNCH_PROFILE=full` and `EXPO_PUBLIC_AI_READY=true`; payments and
the finite challenge additionally require their explicit payments flag. EAS
development, preview, and production profiles all set core, AI false, and
payments false. That is the correct pilot default.

## 8. Navigation and route inventory

There are 33 Expo Router route files. The core tab bar contains Today,
Calendar, Explore, and Journey. Ask is conditionally registered only when the
full profile is available. The Ask screen itself renders a clear unavailable
state when reached by a stale or direct route.

Conversation history and conversation detail now have route-level core guards
and redirect to Journey without starting their remote queries. Saved content
does not query or render remote AI messages in core. Detail-page Ask cards and
the Today reflection strip are hidden in core.

The subscription route remains registered for safe direct-link handling, but its
core screen explicitly says purchases are unavailable. This is containment,
not a claim that subscription is part of the pilot.

## 9. User journeys

The following flows are represented in the source and covered by the route
smoke at full-profile configuration: onboarding, Today, calendar, Explore,
Journey, source/text pages, shloka pages, practice pages, festival pages,
concept/deity pages, journal, saved items, profile/settings, sign-in and reset
password, challenge routes, Ask, conversations, and subscription.

Static/fallback content remains browsable without Supabase configuration.
Authenticated features depend on Supabase and retain error states rather than
fabricating data. The unresolved journey gaps are not navigation bugs: they are
missing approved content/audio, unexecuted device evidence, and unexecuted live
auth/account/notification evidence.

## 10. Screen-by-screen review

- **Today:** daily reflection, shloka, practice, festival, and learning tiles
  remain available. The AI-routed personalized reflection strip is hidden in
  core.
- **Calendar/festival:** explainers can render; bare dates are suppressed when
  reckoning metadata is incomplete.
- **Explore:** catalogue search and filters remain; core no-results copy no
  longer points to deferred AI.
- **Journey:** practice progress, saved items, journal, and history remain;
  conversation history is hidden in core.
- **Shloka:** Devanagari/IAST/Say-it/meaning/source structure is preserved;
  pronunciation audio is explicitly unavailable until approved recordings exist.
- **Source/text/concept/deity:** variation/context cards remain; AI prompts are
  conditional on full readiness.
- **Saved:** local curated saves remain; remote saved AI messages are excluded
  from core.
- **Journal:** remains a private local/backend-backed core feature with no AI
  source use.
- **Challenge:** Navratri content is unpublished and must stay out of the core
  launch until the content, audio, rights, and finite-purchase decisions are
  closed.
- **Profile/settings/legal:** account, privacy, and core settings remain; Plus
  is held back.

## 11. Data-flow review

Curated content loads from Supabase when configured and falls back to the
bundled catalogue when not. TanStack Query supplies remote caching and stale
data behavior; Zustand supplies profile, saved, completion, and reminder state.
Account data uses the authenticated backend where supported, with local
hydration safeguards already integrated in Wave 2.

The runtime manifest and generator checks prevent a content item from being
treated as ready merely because it has been generated or bundled. Source rights,
pending markers, audio, and recommendation status are all separate checks.

## 12. Backend and API review

Supabase Edge Functions, migrations, RLS checks, notification checks, account
checks, and release-contract checks pass in source-safe mode. The Ask function
contains cache-before-LLM, quotas, safety routing, source/licence filtering,
audit fields, and tradition-preference ranking that reorders retrieved passages
instead of narrowing the result set.

That backend path is intentionally not a pilot launch path. AI provider
configuration, source rights, corpus readiness, and moderation operations are
not ready for live use. No live Edge Function or disposable-environment smoke
was run in this audit.

## 13. Auth, session, and account isolation

The app has signed-in/signed-out/loading states, secure token storage, account
hydration, sign-in/reset routes, and query invalidation patterns. Source checks
cover account-flow contracts. Physical account switching, sign-out isolation,
delete/export, recovery, and cross-device behavior remain unverified because
they require a disposable backend and device/build evidence.

## 14. Local storage, cache, and synchronization

SecureStore is used for auth material, with Zustand/TanStack Query for app and
server state. Saved items, journal state, reminders, completion, and activity
dates have local/remote paths. The code includes hydration and retry handling;
bounded cache/history behavior still needs device confirmation under process
death and account switching.

## 15. Offline and flaky-network behavior

The fallback catalogue allows core browsing without public Supabase values.
Remote screens expose loading/error/retry states, and the source-safe checks do
not require a live connection. Offline launch, stale-cache semantics, retry
after reconnect, mutation replay, and background/foreground transitions have not
been exercised on physical iOS or Android hardware.

## 16. iOS review

The app declares tablet support, uses safe-area primitives, and has iOS build
configuration in EAS. Required iOS evidence is still missing: a signed build,
SE-class layout, notched-device launch, VoiceOver, Dynamic Type, Reduce Motion,
keyboard, offline/retry, notifications, deep links, account switching, audio,
and five-run launch/navigation timings.

## 17. Android review

The app has an Android package/adaptive icon, predictive-back configuration,
and notification code. Expo Go warns that remote Android push functionality was
removed for SDK 53+; notification validation therefore needs a development
build. Pixel, Samsung, tablet, TalkBack, vendor lifecycle, process-death,
font-scaling, keyboard, notification, offline, and audio evidence is pending.

## 18. UI and UX review

The core path has coherent Today/Journey/Explore navigation, explicit source
notices, empty/error states, and tradition/context cards. The coordinator pass
removes misleading AI affordances from the pilot and neutralizes the future Q&A
label.

The primary UX risk is content trust, not polish: a stranger can still reach a
shloka or festival guide before seeing the missing audio/rights/date evidence.
The release candidate must make “reviewed”, source, reckoning, community, and
location claims visible where the content is consumed.

## 19. Accessibility review

The code uses accessibility labels and roles on many interactive controls,
visible text, safe areas, and platform controls. The source tree does not prove
adequate contrast, Dynamic Type layout, focus order, VoiceOver/TalkBack labels,
Reduce Motion behavior, or keyboard behavior on real devices. Those are
explicit release gates, not inferred from route smoke.

## 20. Performance review

The technical contract budgets are cold launch `≤2.5s`, warm reopen `≤1.5s`,
cached Today `≤3.0s`, and normal navigation `≤350ms`. No timing evidence was
captured. The required evidence is five cold launches, five warm reopens, cached
Today, and first-navigation timings per representative device.

## 21. Security and privacy review

Source-safe security controls pass: backend source checks, migration/security
checks included by the release contract, RLS-oriented contracts, and secret
scan. The coordinator did not print or rotate keys and did not add client model
access.

The official Codex Security standard scan was started against `58fdd07` with
scan id `71d73443-cd2c-4c7d-9f9a-fa0a90a4ecfe`. At audit time it was still in
the `threat_model` phase with no canonical findings/artifacts available; it must
not be described as a passed security audit. Daybreak delegation was not
granted, but the durable scan remains running.

## 22. Reliability and crash review

The source includes loading, error, retry, unavailable, quota, auth, and
offline-oriented states. Route smoke passes, but it emits known React test
warnings about overlapping `act()` calls and asynchronous updates. These do
not fail the smoke, but should be cleaned before a quality baseline is frozen.

Crash/error delivery, Sentry/telemetry delivery, support routing, rollback, and
content-correction ownership have no attached operational evidence.

## 23. Data integrity and content quality

The content validator accepts 1,876 Markdown files with zero invalid files. The
generated runtime manifest has 1,869 entries:

- 1,017 are `hold`;
- 852 are `review-data`;
- 0 are `ready`;
- all 1,869 have missing audio;
- 1,762 have missing source status and 107 are only pending review.

The generated shloka bank and runtime manifests are internally consistent, but
internal generation is not equivalent to permission to store, excerpt, embed,
or cite the source.

## 24. Translation and glossary readiness

`docs/translation/manifest.csv` has 11,214 rows: 1,869 items across each of
`bn`, `en`, `gu`, `hi`, `mr`, and `ta`. Every row lacks a named reviewer/date,
so no language has a reviewed row.

| Target |                     Verse status |                     Prose status |
| ------ | -------------------------------: | -------------------------------: |
| `en`   | 852 needs-review / 1,017 pending |   1,868 needs-review / 1 pending |
| `hi`   | 852 needs-review / 1,017 pending | 852 needs-review / 1,017 pending |
| `bn`   |  30 needs-review / 1,839 pending |  30 needs-review / 1,839 pending |
| `gu`   |  30 needs-review / 1,839 pending |  30 needs-review / 1,839 pending |
| `mr`   |  30 needs-review / 1,839 pending |  30 needs-review / 1,839 pending |
| `ta`   |  30 needs-review / 1,839 pending |  30 needs-review / 1,839 pending |

The manifest records text presence, not human approval. The unmerged corpus
branch adds a separate 22,428-key register (1,869 slugs × six locales × two
content kinds); its current status counts are 3,648 `draft` and 18,780
`pending`, with zero `source-reviewed`, `native-reviewed`, or `approved` rows.
No translation or glossary coverage should be marketed as complete.

## 25. Audio readiness

The audio manifest has only its header and zero data rows. The app correctly
returns unavailable rather than inventing a recording. Audio is a core launch
requirement: each shloka needs a clear reading and a slow repeat-after-me pass,
with named human reader/reviewer, rights, language, and device playback review.
This gate is hard-blocked.

## 26. Rights and provenance readiness

The authoritative tracker currently has 431 data rows (432 physical CSV lines
including the header); some earlier notes call the header-inclusive line count
the number of rows. Status counts are:

```text
approved=1
candidate=6
candidate_review_first=3
inventory_only=2
metadata_only=62
metadata_only_pending_source_url=5
metadata_staged=7
partial_staged_candidate=1
staged_candidate=333
blocked_metadata_only=4
blank/empty=7
```

The single approved row is the first-party editorial guide. No scripture source
corpus is cleared for storage, excerpts, embeddings, or RAG. This is the main
content launch blocker.

## 27. Festivals, tradition, and citation rules

The mobile content adapter now renders stored variation data rather than
substituting constant boilerplate. Festival dates are suppressed unless the
reckoning, location, and source are present; community and disagreement metadata
remain release-candidate checks.

The shloka/content shape retains Devanagari, IAST, Say-it, meaning, and source
fields. A quoted verse must still be checked on the release candidate for a
named translator and source. No festival date may be published without the
required amanta/purnimanta or other reckoning, observing community when split,
computed location, source, and disagreement reporting.

## 28. Build, configuration, and release review

The pinned toolchain is Node `>=22 <23` and `pnpm@11.0.8`. Mobile versions are
Expo `~54.0.37`, React Native `0.81.5`, Expo Router `~6.0.24`, Supabase JS
`^2.90.1`, TanStack Query `^5.90.19`, and TypeScript `~5.9.3`.

The source-safe verifier is intentionally non-destructive: it installs frozen
dependencies, validates generated assets and manifests, runs tests/builds,
checks backend contracts, scans secrets, and evaluates readiness. It does not
deploy, migrate production, submit stores, run live smokes, or re-embed.

## 29. App-store and operational readiness

No signed iOS/Android build was produced or submitted. Store metadata, review
notes, privacy disclosures, support contact, rollback owner, telemetry proof,
content correction owner, rights/legal sign-off, and physical-device evidence
are not attached to this commit. The EAS profiles are correctly core-only, but
configuration correctness is not store approval.

## 30. Test evidence

The final source-safe verifier run on the tree committed as
`92f653c46ab796393e8ff415337dc190e4933e39`, using Node 22.23.3 / pnpm
11.0.8, passed:

- frozen install and workspace lock check;
- content-tools build, shloka bank check, content validation;
- runtime and translation manifest checks;
- script contract tests;
- format check, root typecheck, mobile lint, mobile unit tests;
- iOS route smoke and web export;
- workspace tests and build;
- backend source checks, backend checks, release contract;
- secret scan;
- runtime readiness safety evaluation: 1,869 entries, 0 marked ready.

Mobile unit tests report 18 files and 142 tests passing. Route smoke reports one
suite and one test passing. The route smoke warnings are recorded in section
22; they are not treated as a clean-device signal.

## 31. Known bugs, broken paths, and warnings

Hard blockers:

- no rights-cleared launch corpus;
- no reviewed translations;
- no audio;
- no ready runtime items;
- no signed builds or physical-device evidence;
- no live account/notification/telemetry/rollback evidence;
- official security scan not yet complete.

Fixed during coordination:

- core routes could still expose AI affordances despite the hidden tab;
- subscription had a conditional hook after an early return;
- user-facing future Q&A copy used a persona-style name.

Non-blocking but real warnings:

- route smoke emits overlapping `act()`/unwrapped-update warnings;
- Expo Go warns that remote Android push requires a development build;
- the tracker/docs use 431 data rows versus 432 header-inclusive CSV lines and
  need one authoritative presentation.

## 32. Incomplete and intentionally cut features

The Navratri pilot intentionally cuts scoped AI, subscriptions, admin
moderation console, push retry leases, and the live participation counter. The
counter remains dark and the challenge remains unpublished. Audio is not cut;
it is core and currently missing.

The future Ask path is retained behind readiness flags for later work, but it is
not a pilot acceptance criterion and must not be enabled by setting flags before
rights, provider, review, moderation, and operational gates are closed.

## 33. Dead, redundant, or superseded material

The old C5 untracked test is superseded by the integrated route contract but was
not deleted from its owner worktree. The closeout-smoke-fix branch contains
large removals that would regress Wave 2 and should not be used as a cleanup
source. Stale references to 432 rights rows should be reconciled. Generated
build output and local dependency directories were not treated as product
source.

No branch, user-owned file, source-rights row, audio row, or content document
was deleted by this audit.

## 34. Documentation reviewed

The audit read and cross-checked:

- `AGENTS.md` and the Supabase/functions and migrations instructions;
- `02-plan.md` and `docs/05-competitors.md`;
- `docs/technical-launch-contract.md`;
- the prior `AUDIT-2026-09-29.md` supplied from the main checkout;
- `sandhya_build_reference.docx`;
- translation and audio READMEs/manifests;
- source inventory and runtime-content manifests;
- package/app/EAS configuration;
- Wave 1/Wave 2 branch history and the corpus branch plans/registers.

## 35. Documentation added or consolidated

The coordinator added the technical verifier and
`docs/release/technical-launch-checklist.md`, then recorded this 38-section
audit. These documents separate source-safe evidence from external/device/live
gates and preserve the pilot cuts. No prior branch documentation was removed.

## 36. Recommended branch and codebase cleanup

After a human owner confirms the branch outcomes, archive or merge only the
branches whose work is intentionally integrated; do not delete them as part of
this audit. Keep the corpus branch separate until rights and review decisions
are real. Replace the old C5 test only through its owner’s normal review.

For code cleanup, add a core-profile component test that asserts deferred AI
affordances are absent, remove the route-smoke React act warnings, reconcile the
rights-row count, and attach device timing/assistive-technology evidence to the
release checklist. None of those cleanup items should weaken the fail-closed
gates.

## 37. Prioritized action plan

### Critical — release blockers

1. Clear and record source rights for every launch item; include translator,
   URL, copyright, storage, excerpt, and embedding decisions.
2. Assign named human translation reviewers and dates for the launch languages;
   publish only rows that pass review.
3. Record approved human clear and slow audio for every core shloka/learnable
   item, including rights and pronunciation review.
4. Regenerate the runtime readiness report only after the above are true; require
   a non-zero, reviewed `ready` set.
5. Produce signed iOS and Android development/preview builds and execute the
   physical-device matrix, including accessibility and audio.

### High — operational confidence

1. Run disposable live auth/account-delete/notification smokes and confirm RLS
   isolation and account switching.
2. Attach crash/error telemetry delivery, support, rollback, content correction,
   legal/rights, and store-review owners.
3. Finish and review the official security scan; resolve findings before any
   full-profile enablement.
4. Verify every published festival date with reckoning, community, location,
   source, and disagreement fields on the release candidate.

### Medium — quality bar

1. Add component-level core-profile regression coverage.
2. Remove route-smoke act warnings and rerun the full source-safe verifier.
3. Capture launch/navigation timing medians and slowest runs against the
   contract budgets.
4. Complete VoiceOver/TalkBack, Dynamic Type, Reduce Motion, keyboard, tablet,
   and vendor-lifecycle checks.

### Low — post-gate polish

1. Add adjustable audio playback speed once approved recordings exist.
2. Improve empty-state copy and content discovery based on observed pilot data.
3. Consider the corpus-branch planning/register improvements for the next
   content tranche after rights governance is in place.

## 38. Unverifiable or explicitly not run

The following cannot be claimed from this audit:

- signed iOS/Android builds or store submission readiness;
- physical devices, accessibility services, tablets, OS/vendor lifecycle,
  audio playback, notifications, deep links, offline/retry, or timing budgets;
- live Supabase auth, RLS, account switching, delete/export, notification,
  telemetry, or support flows;
- production migrations, deployments, EAS updates, store review, or rollback;
- final rights/legal approval or named translation/audio reviewers;
- a completed official security scan;
- a launch-ready corpus or any re-embedding result.

Final decision: **source-safe code is green; Sandhya is not launch-ready until
the Critical and required High gates above are closed and evidenced on the
release candidate.**
