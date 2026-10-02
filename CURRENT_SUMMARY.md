# Sandhya — Current Project Summary

**Updated:** 2 October 2026. **Scope:** free core release.

The application source is consolidated on `main`. Local validation is recorded
in [the cleanup report](docs/release/prelaunch-cleanup-2026-10-02.md). This is a
working engineering preview; public launch still requires reviewed content/audio,
production configuration, signed native builds, and live/device verification.

## Available product

Onboarding routes the daily pool, reading preferences, practice length, and
reminders. Today, scripture reading, shloka details, practices, Calendar,
Explore, Journey, journal, and saved items use the bundled offline library.
Supabase supplies auth, account sync/export/deletion, and curated live data
when configured. Guest journal entries remain local and survive reopening.

The bank contains 661 bundled units. The deterministic readiness inventory
covers 1,869 shloka documents and 11,214 translation rows. Existing translated
text is available with English fallback, but no translation row has a recorded
human review. No item is marked runtime-ready; there are no approved audio
recordings. These are outstanding content gates, not tasks completed by cleanup.

Festival dates stay absent when the required local reckoning/community/source
information is unavailable. Actual regional and tradition variations render.
Quotes retain their source fields. Content schemas and curated source data are
unchanged by cleanup.

## Deferred and retired surfaces

- Live Ask and conversation entry points default off in the core profile.
- The challenge remains unpublished: no written sessions, price, or audio.
- Payment SDK initialization stays off in the free release. Missing payment
  keys do not block a free production build.
- Monthly/annual/lifetime subscription purchasing and its storefront are removed.
  Old subscription links return a useful free-library notice.
- The admin frontend is removed; protected backend admin APIs and all migration
  history remain available for future internal operations.
- The arrival website builds six reviewed pages but remains unhosted.

## Current references

- [README.md](README.md): setup and commands.
- [02-plan.md](02-plan.md): plan of record and competitive standing rules.
- [docs/technical-launch-contract.md](docs/technical-launch-contract.md): acceptance.
- [docs/release/technical-launch-checklist.md](docs/release/technical-launch-checklist.md): external evidence.
- [docs/00-your-actions.md](docs/00-your-actions.md): founder setup queue.
- [docs/SOURCES-AND-ATTRIBUTION.md](docs/SOURCES-AND-ATTRIBUTION.md): rights work.
- [docs/03-progress.md](docs/03-progress.md): historical implementation ledger.

The separate corpus expansion branch and worktrees with uncommitted files are
preserved. Remaining editorial plans describe deferred work; they are not release
claims. The canonical guidance is AGENTS.md; CLAUDE.md points to it.
