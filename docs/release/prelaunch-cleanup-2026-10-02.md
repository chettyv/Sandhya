# Prelaunch repository cleanup — 2 October 2026

Scope: the free core application. The user authorized cleanup across both streams.
The working source is consolidated on local main; nothing was pushed or deployed.

## Result

The active workspace has one consumer app, one static arrival site, three shared
packages, and the Supabase backend. Subscriptions and the deferred admin frontend
are retired. Core learning, saved items, journal, and account behavior remain.
The source is suitable for the final manual preparation; public launch remains
blocked by the concrete prerequisites below.

Curated content, source trackers, database migration history, raw local source
material, and other worktrees were preserved. No database was reset, seeded,
migrated, or modified, and no corpus was re-embedded.

## Cleanup and consolidation

- Removed apps/admin: seven files and its build/typecheck/test entry points.
  Protected backend admin APIs and their audit/authorization checks remain.
- Replaced the subscription storefront with a short free-library notice for stale
  links. Removed profile promotion links and monthly/annual/lifetime purchase
  and offering helpers. Existing
  entitlement and webhook compatibility remain for backend records; one-off
  challenge payment adapters remain deferred.
- Shared the entitlement query hook between native and web adapters. Removed its
  constant polling. Free builds never initialize the purchase SDK.
- Kept the TypeScript tokenizer and deleted its redundant JavaScript mirror and
  obsolete ESLint exception. TypeScript NodeNext .js import specifiers correctly
  resolve to the compiled TypeScript output and therefore remain.
- Removed five dependency declarations: root @typescript-eslint/parser,
  @typescript-eslint/eslint-plugin and rimraf; content-tools'
  unused shared-types dependency; shared-types' unused vitest declaration. These
  packages may remain transitively or in workspaces that use them. No package
  versions were upgraded. Root metro-runtime is retained because Expo resolves
  it there under pnpm isolation; the production export reproduced that dependency.
- Removed five script entry points: root clean, shared-types' empty test command,
  and the three retired admin commands. Real test packages no longer use
  --passWithNoTests.
- Deleted two low-value test files: the retired admin test and a redundant
  account-source regex test. Kept behavior, data-integrity, backend, and route
  tests. Added the preserved journal regression suite after it reproduced a bug.
- Removed duplicate mobile test/build and source-backend invocations from the
  top-level launch gate, because workspace and full backend checks already run
  them. Removed an exact-prose assertion from the catalog verifier while keeping
  actual catalog integrity checks. Limited Jest workers and excluded hidden/worktree/build/dependency trees
  from source scanning. The verifier reports progress while running.
- Replaced CLAUDE.md's duplicated instructions with a pointer to AGENTS.md.
  Rewrote the root/mobile setup guides and CURRENT_SUMMARY.md for the actual core
  scope. Marked the August progress ledger historical. Deleted two superseded
  audits and a completed technical implementation plan; this report replaces
  them. Kept unfinished editorial plans and the plan/build reference.

Approximate removal relative to the integrated checkpoint: **12 files, 4,000
lines removed, about 3,300 net lines reduced**, five dependency declarations,
five package-script entry points, and two low-value test files. The large
content/translation manifests integrated from earlier work are deterministic
readiness inventories, not new application layers.

## Functional issues fixed

The useful branch work included launch-profile route gating, production
configuration checks, account hydration and local-data preservation, notification
routing, bounded polling, truthful audio availability, body limits, challenge
completion persistence, and deterministic content readiness manifests. This work
was integrated without rewriting its commit history.

Additional fixes in this cleanup:

- A mounted journal could retain account A's entries/draft after sign-out or
  switching to B. It now observes auth changes, clears private UI state, aborts
  previous reads, ignores stale completions/alerts, and invalidates old delete
  confirmations. A draft whose save outlives the originating account is retained
  only in that account's local scope. Same-user token refresh keeps the draft.
- The feature parser passed process.env wholesale into client code. Expo's
  static replacement needs direct EXPO*PUBLIC*\* references; the app now supplies
  them explicitly.
- A free production build incorrectly required payment keys. Payment keys are
  now conditional on enabled checkout, with production validation tests.
- Root ESLint traversed a nested detached worktree, producing 177 irrelevant
  errors. Worktree artifacts are excluded from lint and Metro source watching.

## Recoverable Git history

| Checkpoint/commit                        | Purpose                                                              |
| ---------------------------------------- | -------------------------------------------------------------------- |
| cleanup-base-2026-10-02 (0a361b1)        | Starting main commit                                                 |
| bd2b05f                                  | Preserved the user's design changes and existing audit/plan files    |
| 68efeca / cleanup-integrated-2026-10-02  | Merged verified useful launch branches with their original history   |
| 3812c80                                  | Subscription removal, shared entitlement state, feature/config fixes |
| e417842                                  | Removed the redundant JavaScript tokenizer                           |
| 1286aa7 / cleanup-before-docs-2026-10-02 | Retired admin workspace, redundant checks, scripts, dependencies     |
| 2dab731                                  | Journal account isolation and meaningful regression tests            |
| Final documentation commit               | Current setup/status/report and stale-reference cleanup              |
| cleanup-complete-2026-10-02              | Final verified main snapshot                                         |

The stale reports are recoverable from the checkpoint history. No useful history
was squashed or rewritten.

## Branch state

Canonical branch: **main**, updated locally by fast-forward after verification.
Remote origin still has only main; no remote refs were changed. No open GitHub
PRs were found, so zero PRs needed closing.

Ten obsolete branches were tagged under archive/prelaunch-2026-10-02/ and
retired: c6-backend, closeout-smoke-fix, content-readiness, d3-audio,
integration-review, lane-a-navratri, launch-readiness, mobile-stability,
next-wave, and production-config (all originally prefixed codex/). Their worktrees
were detached at the same commits, with their files retained. The closeout smoke
fix has the same patch ID as the integrated 58fdd07 change. The temporary cleanup
branch is also retired after the fast-forward: **11 branch refs removed**.

Three working branches remain intentionally:

- codex/c5-notifications: merged source with an uncommitted notification test.
- codex/q1-validation: merged source with uncommitted journal/report artifacts.
  Its useful journal reproduction test was copied into main and fixed there;
  the original worktree files remain intact.
- codex/corpus-translation-launch: nine unique corpus/editorial workflow commits
  outside main. This is deferred corpus expansion and review tooling, preserved
  for a separate decision rather than added to the free core cleanup.

## Verification

Toolchain: Node 22.23.3, repository-pinned pnpm 11.0.8. Relevant checks were run
before each substantial code batch; the full integrated baseline passed before
cleanup.

The final source gate is being recorded on the cleaned candidate. Its checks are:
frozen install, workspace lock, content-tools build, generated shloka bank,
content validation, runtime and translation manifests, script contract tests,
Prettier, root typecheck/ESLint, route smoke, workspace tests/builds, backend
checks, and Secretlint. Final result must be recorded before completion.

Separately verified: 144 mobile unit tests across 18 files; all eight journal
account-switch regression scenarios; 117 RAG unit tests across 12 files;
12 production-config tests; account lifecycle invariants; backend source checks.

Browser evidence: local production web preview, onboarding's Set up later path,
Today with no Chat tab in the core profile, Journey → Journal, guest save, and
persistence after reopening, and the useful retired subscription-link notice. Screenshot: .git/guest-journal-proof.jpg (local
ignored verification artifact). No live account or external database was used.

Final scans checked authored runtime files for the forbidden competitor name,
unfinished markers, duplicate versions, and stale references to deleted files.
Historical competitor analysis and progress documents remain historical evidence.

## Concrete remaining release prerequisites

1. **Content/audio:** runtime inventory has 1,869 entries: 1,017 hold, 852
   review-data, zero ready. There are zero approved recordings. The six-language
   translation inventory has 11,214 rows and no recorded human review. The
   source-rights tracker has 432 rows and only one approved for production.
   Select and clear the actual launch subset; cleanup cannot certify it.
2. **Production configuration:** the production checker in this local process
   reports the six required public values absent: Supabase URL/anon key, EAS
   project ID, support email, Privacy URL, and Terms URL. This does not establish
   what is stored in hosted EAS/Supabase settings. A production build must have
   valid configuration. Payment keys are unnecessary for the free core.
3. **Release evidence:** signed iOS/Android builds, physical-device lifecycle and
   notification checks, and live disposable-environment auth/sync/export/delete
   and RLS checks have not been run. The release checklist remains the record
   for those checks. No store submission was made.

Non-blocking deferred work for the free core: the Navratri challenge is
unpublished with no sessions/price/audio; AI remains off; the arrival website is
unhosted; unique corpus expansion tooling remains on its separate branch.

The repository is smaller and coherent, and its local source/build checks are
reviewable. It is ready for final manual preparation, with the content,
configuration, and native/live evidence above still required for public launch.
