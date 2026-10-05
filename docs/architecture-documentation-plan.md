# Sandhya architecture documentation plan

**Assessment date:** 5 October 2026.

**Reviewed source checkpoint:** `0cd895cfdc3dd36e020ba09e569386ca230e6c03` on `main`.

**Purpose:** a portable checklist for completing Sandhya's product, experience, architecture, data, security and deployment documentation on another PC.

This is a documentation backlog, not a completed architecture pack or an instruction to change the application stack. The migration direction being considered is SwiftUI for iOS, with Android later through Skip. Document the existing Expo implementation first, then describe the proposed target separately. Implementation and migration remain separate work.

## 1. How to use this plan

- Read [AGENTS.md](../AGENTS.md), the [build reference](sandhya_build_reference.docx), [02-plan.md](../02-plan.md), [CURRENT_SUMMARY.md](../CURRENT_SUMMARY.md) and the [technical launch contract](technical-launch-contract.md) before writing.
- Re-check the current branch and source before carrying this assessment forward. The checkpoint above is the audit baseline, not a claim that the source will remain unchanged.
- Keep each document short enough to maintain. Combine overlapping subjects into the eight artifacts below rather than creating nineteen independent documents.
- Label every feature and diagram element as **current**, **deferred**, **retired**, **proposed**, or **unverified**, as appropriate. Existing source code does not prove a feature is operational in production.
- Record the revision each document describes. Link to repository-relative files so the documentation works across PCs.
- Use Markdown with Mermaid diagrams where practical. Generate a database ERD from the actual schema and verify it against the migrations; do not invent relationships.
- Link to authoritative schemas, configuration and contracts instead of duplicating them. Update affected documentation when those sources change.
- Preserve the content schema, source attribution, tradition variation, rights checks and festival reckoning requirements throughout the documentation and any later migration.
- Do not commit credentials, private configuration or raw user data in examples.

## 2. Current product baseline

The active mobile implementation is Expo SDK 54, React Native, TypeScript, Expo Router, NativeWind, TanStack Query, Zustand and Supabase. The separate arrival website is generated from reviewed Markdown. Content tooling and the deferred RAG pipeline run separately from the mobile app.

The current core release includes onboarding, Today, scripture reading, shloka and content details, practices, qualified festival guides, Explore, Journey, saved items, journal, progress, reminders and account settings. Bundled content supports offline browsing; configured Supabase services support authentication, account operations and sync.

Feature status must remain explicit:

| Area                                                                         | Status at the assessment checkpoint                                                                                           |
| ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Core learning, reading, practices, journal, saved items and account features | Present in the application source; signed-device and public-release evidence must be checked separately                       |
| Ask/AI and conversation surfaces                                             | Source remains; unavailable in the default core profile                                                                       |
| Finite challenge and one-off purchases                                       | Source remains; disabled/unpublished and subject to separate content and commercial gates                                     |
| Recurring subscription storefront                                            | Retired; compatibility backend records and webhook behaviour remain                                                           |
| Admin frontend                                                               | Retired; protected backend APIs remain                                                                                        |
| Audio                                                                        | Manifest/resolver and unavailable-state scaffolding exist; approved recordings and a working mobile player remain outstanding |
| Arrival website                                                              | Source and build exist; hosting is not established by this assessment                                                         |
| SwiftUI/Skip client                                                          | Proposed direction; not implemented in this repository                                                                        |

Check [CURRENT_SUMMARY.md](../CURRENT_SUMMARY.md) and the [release checklist](release/technical-launch-checklist.md) for updated readiness. The [2 October cleanup report](release/prelaunch-cleanup-2026-10-02.md) explains the retired surfaces and recoverable history. Do not treat an architecture drawing as release evidence or re-enable deferred features as part of documentation work.

## 3. Assessment of the nineteen requested subjects

**Present** means a recognisable artifact already exists. **Partial** means information exists in code or scattered documentation but needs consolidation or updating. **Missing** means no dedicated diagram/reference was found in the inspected repository. These are documentation statuses, not judgments that the underlying feature was never built.

| #   | Subject                     | Documentation today                                                                   | Need for Sandhya                                                                           | Destination |
| --- | --------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ----------- |
| 1   | Product brief               | Partial: plan, current summary and release contract                                   | Required: one concise statement of audience, problem, scope, outcomes and exclusions       | A1          |
| 2   | Screen map                  | Partial: Expo routes and tab configuration; no complete visual map                    | Required: routes, entry points, navigation and visibility states                           | A2          |
| 3   | Data model / ER diagram     | Partial: SQL migrations and row types; diagram missing                                | Required; share one ERD with item 12                                                       | A4          |
| 4   | Core user flows             | Partial: onboarding and launch/offline behaviour                                      | Required: main paths plus error, offline and recovery paths                                | A2          |
| 5   | Business architecture       | Partial: arrival, habit, depth and finite-journey revenue in the plan                 | Lightweight section: acquisition, value, retention, revenue and operating responsibilities | A1          |
| 6   | Domain architecture         | Partial: entities and rules implicit in content, schema and application logic         | Lightweight map/glossary: responsibilities, boundaries and important rules                 | A1/A3       |
| 7   | System context              | Missing complete diagram                                                              | Required: people, product surfaces and external services                                   | A3          |
| 8   | System architecture         | Partial: build reference and narrow RAG diagram                                       | Required: current system and a separately labelled target proposal                         | A3          |
| 9   | Component architecture      | Partial: onboarding text diagram and code organisation                                | Required at module level; no need to diagram every UI component                            | A3          |
| 10  | Data architecture           | Partial: pipeline, rights, database and local-storage references                      | Required: source of truth, storage, cache, sync and lifecycle                              | A4          |
| 11  | Data flows                  | Partial: RAG overview and onboarding flow                                             | Required: editorial pipeline, user data, sync and deletion/export                          | A4          |
| 12  | ERD                         | Missing diagram; relationships exist in migrations                                    | Required; same artifact as item 3                                                          | A4          |
| 13  | API modelling               | Partial: function implementations, types, backend README and small Postman collection | Required: REST, RPC and function contracts; document streaming separately                  | A5          |
| 14  | Integration architecture    | Partial: service adapters and operational notes                                       | Required: ownership, auth, payloads, failures and platform replacements                    | A5          |
| 15  | Event architecture          | Partial: auth callbacks, notifications, scheduled jobs and webhooks in code           | Small catalogue of existing events and guarantees; no new event bus required               | A5          |
| 16  | Infrastructure / deployment | Partial: EAS, CI and Supabase operational configuration                               | Required: environments, build/deploy topology, verification and recovery                   | A6          |
| 17  | Security model              | Partial: implemented controls and scattered rules; no consolidated threat model       | Essential: trust boundaries, access, private data and abuse prevention                     | A7          |
| 18  | Information architecture    | Partial: navigation and content categories in code                                    | Required; combine with the screen map                                                      | A2          |
| 19  | Design system               | Present: design specification, tokens and reusable UI                                 | Retain and refresh for actual core scope and proposed platform adaptations                 | A8          |

## 4. Eight artifacts to complete

The paths below are proposed work destinations. Except for the existing design specification, these documents have not been created by this plan. Unchecked boxes are outstanding documentation work.

### A1. Product brief and domain rules

**Suggested path:** `docs/architecture/product-brief.md`

**Covers:** 1, 5 and the domain vocabulary in 6.

- [ ] State the audience, practical problem, value proposition and measurable outcomes without inventing validated metrics.
- [ ] Reconcile current core scope with the longer-term product plan; name unresolved decisions rather than silently resolving them.
- [ ] Separate current, deferred and retired capabilities, including AI, finite challenges and recurring subscriptions.
- [ ] Describe acquisition, retention and intended one-off revenue, plus content review, audio production and support responsibilities.
- [ ] Define the main domain terms: source/text/passage, shloka, reflection, practice, festival, tradition note, account, journal, progress and challenge.
- [ ] Record product-critical rules: attribution, rights, tradition diversity, qualified dates, human-reviewed audio and visible consequences of onboarding answers.

**Complete when:** someone unfamiliar with the conversation can explain who the app serves, what the next release includes, and what it explicitly defers.

### A2. Experience map and core user flows

**Suggested path:** `docs/architecture/experience-map.md`

**Covers:** 2, 4 and 18.

- [ ] Inventory actual routes, tabs, content categories and entry points; identify redirects and compatibility notices.
- [ ] Draw a screen/navigation map with guest, signed-in and feature-gated paths.
- [ ] Document onboarding branching, draft resume and the content/settings each answer changes.
- [ ] Map Today → reading/detail → saved item; practice → completion/history; reflection → journal; and calendar → qualified festival guide.
- [ ] Map sign-in, verification/recovery callbacks, sign-out, account switching, export and deletion.
- [ ] Include offline, loading, empty, auth-expired, permission-denied and retry behaviour.
- [ ] Put AI and challenge flows in a clearly deferred section, identifying their readiness gates.

**Complete when:** every visible core route has a purpose, an entry/exit path and defined exceptional states; core flows can serve as a behaviour checklist for the rewrite.

### A3. System context, system and component architecture

**Suggested path:** `docs/architecture/system-architecture.md`

**Covers:** 7, 8, 9 and module/domain boundaries in 6.

- [ ] Draw the current system context: users, editorial/operational roles, mobile app, arrival website, Supabase and external services.
- [ ] Draw the current system structure: client, bundled content, content generators, auth, database, storage and Edge Functions.
- [ ] Show client modules for navigation, presentation, state/cache, content, accounts/sync, persistence, notifications, telemetry and deferred integrations.
- [ ] Explain dependency direction and which responsibilities belong on the server.
- [ ] Review the existing RAG SVG as historical/partial evidence; correct its documented order and tradition-ranking description before presenting it as current.
- [ ] Draw a separate proposed SwiftUI/Skip target with retained backend/tooling, rewritten client modules and platform-specific adapters.
- [ ] Record migration assumptions and unresolved compatibility questions; do not claim a supported target without pinned-version build evidence.

**Complete when:** readers can distinguish the current system from the proposed system and identify what is retained, rewritten or verified separately.

### A4. Data architecture, ERD and flows

**Suggested path:** `docs/architecture/data-architecture.md`

**Covers:** 3, 10, 11 and 12.

- [ ] Build one ERD from the current migrations, showing keys, relationships, ownership and relevant cardinality.
- [ ] Separate source/curated content, user data, challenge data, deferred AI data and operational records.
- [ ] Document editorial Markdown → validation/generation → bundled JSON/SQL, and the separately gated corpus/embedding pipeline.
- [ ] Identify the source of truth and read/write permissions for each data category.
- [ ] Describe bundled content, live catalog merging, cache freshness and explicit offline states.
- [ ] Document local preferences, saved items, progress and journals, including guest-to-account sync and account isolation.
- [ ] Explain retry, duplicates, conflict handling and recovery from failed or interrupted sync using the actual implementation.
- [ ] Describe export/deletion boundaries and the proposed migration of existing device-local data; flag gaps for implementation work.

**Complete when:** each important data category has an owner, store, lifecycle and documented movement between device and server, with no invented ERD relationships.

### A5. API, integration and event catalogue

**Suggested path:** `docs/architecture/api-integrations-events.md`

**Covers:** 13, 14 and 15.

- [ ] Inventory used Supabase REST resources, RPCs and Edge Function endpoints, including protected administrative operations.
- [ ] Record methods, auth, request/response shapes, errors, timeouts and retry rules; label deferred endpoints.
- [ ] Document any streaming protocol separately from ordinary JSON responses.
- [ ] Expand the Postman collection or add machine-readable contracts where useful; use placeholders for credentials.
- [ ] Map Supabase, Expo notifications, RevenueCat and telemetry integrations to their client/server owners and failure behaviour.
- [ ] Catalogue existing auth events, app lifecycle transitions, notification taps, scheduled sends and payment webhooks.
- [ ] Record delivery, duplicate handling, idempotency and ordering guarantees actually provided; distinguish absent guarantees.
- [ ] Identify native replacements, especially Expo-token registration/delivery when moving to APNs/FCM; do not equate client replacement with backend compatibility.

**Complete when:** another developer can implement a client against existing contracts and understand external triggers without reverse-engineering every function. No additional event infrastructure is implied.

### A6. Infrastructure and deployment guide

**Suggested path:** `docs/architecture/deployment.md`

**Covers:** 16 and the hardware/tooling view.

- [ ] Draw device, build/development and hosted-service topology; separate local, preview and production environments.
- [ ] Identify required tools and hardware for the current workflow and proposed Xcode/Skip workflow, with version/date evidence before implementation.
- [ ] Document environment configuration categories and secret locations without copying values.
- [ ] Describe database migration, Edge Function, scheduler, website and mobile build/release procedures.
- [ ] Explain CI/source checks versus signed-device, live-service and release acceptance evidence.
- [ ] Describe backup/restore and release recovery procedures; identify unverified operational assumptions.
- [ ] Link existing operational runbooks and release gates. Documentation work does not authorize production deployment or migrations.

**Complete when:** a new PC can reproduce the appropriate development setup and a release owner can identify every deployment target and required verification step.

### A7. Security and privacy model

**Suggested path:** `docs/architecture/security-model.md`

**Covers:** 17, with links to A4–A6.

- [ ] Draw trust boundaries between device, public/backend APIs, database, external providers and privileged operations.
- [ ] Document auth/session handling, secure storage, owner-scoped RLS and administrative authorization.
- [ ] Classify journal/profile data, tokens, telemetry and content-rights metadata; describe permitted access and logging.
- [ ] Document input validation, webhook verification, quotas, rate limits and server-side AI safety/rights enforcement where applicable.
- [ ] Review account-switch isolation, local-data preservation, export/deletion and consent handling against the source.
- [ ] Record a small threat model covering account crossover, credential exposure, unauthorized data access and forged external events.
- [ ] Separate controls implemented in source from controls verified in a live environment, and list open findings.

**Complete when:** sensitive data paths and access decisions are traceable to implemented controls and remaining risks are explicit. A document alone is not a security audit.

### A8. Design system refresh

**Existing path to update:** `docs/design-spec.md`

**Covers:** 19.

- [ ] Reconcile the specification with current tokens, UI components and core-release scope.
- [ ] Catalogue typography, colours, spacing, touch targets, icons, reusable components and interaction states.
- [ ] Document Devanagari/IAST/Say-it/meaning/source hierarchy, attribution and tradition-variation presentation.
- [ ] Define dynamic text, screen-reader, reduced-motion and phone/tablet behaviour.
- [ ] Separate deferred challenge designs from currently visible features; keep the participation counter dark under the standing rules.
- [ ] Describe SwiftUI and Android adaptations while retaining the visual identity; record platform differences explicitly.

**Complete when:** developers can build consistent core screens using shared rules, and deferred designs cannot be mistaken for shipped UI.

## 5. Suggested execution order

1. **Confirm scope and behaviour:** A1 and A2. Resolve what belongs in the current release before drawing the target.
2. **Protect migration contracts:** A4 and A5. Preserve schema, offline data, sync, auth and integration behaviour.
3. **Describe the systems:** A3, with separate current and proposed diagrams linked to the established contracts.
4. **Make operation and risk explicit:** A6 and A7. Verify toolchain and environment claims against current primary documentation when needed.
5. **Refresh presentation rules:** A8. Reuse the existing design system rather than creating an unrelated visual language.

The priorities describe documentation work only. Audio/content readiness, deployment and other release blockers remain their own workstreams. Completing diagrams does not complete those gates.

## 6. Evidence already available

| Subject                                                        | Existing source/reference                                                                                                                                                   |
| -------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Product decisions and audience                                 | [02-plan.md](../02-plan.md), [CURRENT_SUMMARY.md](../CURRENT_SUMMARY.md)                                                                                                    |
| Architecture/schema reference                                  | [Build reference](sandhya_build_reference.docx)                                                                                                                             |
| Current scope, flows, offline behaviour and release acceptance | [Technical launch contract](technical-launch-contract.md), [release checklist](release/technical-launch-checklist.md)                                                       |
| Navigation and visibility                                      | `apps/mobile/app/`, `apps/mobile/src/lib/launchProfile.ts`, `apps/mobile/eas.json`                                                                                          |
| Onboarding modules and answer consumers                        | [Onboarding README](../apps/mobile/src/features/onboarding/README.md)                                                                                                       |
| Database and backend                                           | [Supabase README](../supabase/README.md), `supabase/migrations/`, `supabase/functions/`, `packages/shared-types/src/`                                                       |
| Local state and account sync                                   | `apps/mobile/src/store/`, `apps/mobile/src/lib/account.ts`, `apps/mobile/src/lib/localJournalStorage.ts`, `apps/mobile/src/lib/chunkedStorage.ts`                           |
| Content processing and rights                                  | [RAG pipeline README](../packages/rag-pipeline/README.md), [sources/attribution](SOURCES-AND-ATTRIBUTION.md), `packages/content-tools/`, `scripts/generate-shloka-bank.mjs` |
| Partial AI flow diagram                                        | [Existing RAG SVG](sandhya_rag_architecture.svg); needs current-behaviour review                                                                                            |
| API examples                                                   | [Postman collection](sandhya.postman_collection.json); currently a small smoke collection                                                                                   |
| Deployment and scheduled delivery                              | [Supabase operations](../supabase/ops/README.md), `.github/workflows/`, `apps/mobile/eas.json`                                                                              |
| Design baseline                                                | [Design specification](design-spec.md), `apps/mobile/src/theme/tokens.ts`, `apps/mobile/src/components/ui.tsx`                                                              |
| Audio and translation readiness                                | [Audio contract](audio/README.md), [translation inventory](translation/README.md)                                                                                           |
| Retired surfaces and recovery history                          | [Prelaunch cleanup report](release/prelaunch-cleanup-2026-10-02.md)                                                                                                         |

## 7. Continue on another PC

The handoff branch is `codex/architecture-documentation-plan`; its pull request targets `main`. Until it is merged, fetch and check out that branch on the other PC:

```sh
git fetch origin
git switch --track origin/codex/architecture-documentation-plan
```

If the local branch already exists, use `git switch codex/architecture-documentation-plan` instead. Preserve any existing local edits before switching. After the pull request is merged, this plan will also be available from an updated `main`.

Read this file, confirm the current source checkpoint, then start with A1/A2. Keep documentation commits focused, update checklist boxes only when the acceptance criteria are met, and link finished artifacts from this plan. Follow the repository's session/stream instructions; this handoff does not grant a new session permission to edit unrelated files, deploy services or implement the proposed migration.
