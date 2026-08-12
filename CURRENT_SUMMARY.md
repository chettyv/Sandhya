# Sandhya — Current Project Summary

**Last updated:** 12 August 2026 (remediation build, cycles 1–16)
**Status:** Free-launch product, content-live, awaiting founder infrastructure setup (Supabase, EAS) to reach devices beyond Expo Go.

This file is the single current summary. The working ledger is [`docs/03-progress.md`](docs/03-progress.md); the founder's action queue is [`docs/00-your-actions.md`](docs/00-your-actions.md); source rights live in [`docs/SOURCES-AND-ATTRIBUTION.md`](docs/SOURCES-AND-ATTRIBUTION.md). The plan of record is `02-plan.md` (v2), as amended by founder decisions recorded in the progress log.

## What the product is now

A free, source-grounded daily practice app built around a **verse bank**: every verse carries Devanagari, IAST, plain-English pronunciation ("Say it"), an original translation, a word-by-word gloss, a prose meaning that names tradition differences honestly, a reflection prompt, and Hindi throughout. The daily loop is verse-linked (verse → meaning → its own reflection), personalized by profile focus tags, and everything works offline from the bundled bank.

**Founder decisions in force:** free launch (no payments — `EXPO_PUBLIC_PAYMENTS_ENABLED` default off, re-audit gate before reactivation) · app-first (web arrival site parked) · all scriptures ("corpus maximization") · all languages · blanket content approval with per-cycle spot-check flags in the progress log.

## Content state (the heart of it)

| Text                      | Extracted      | Fully drafted + live                                              | Notes                                                                                                    |
| ------------------------- | -------------- | ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Bhagavad Gita             | all 700 verses | 80 live                                                           | chapters 2,3,4,5,6,9,12,15,18 essentials; rest are reader-ready skeletons awaiting rolling content waves |
| Hanuman Chalisa           | all 43 units   | 43 live                                                           | ITRANS→Devanagari converted, canonical alignment verified                                                |
| Isha Upanishad            | 19 units       | 19 live                                                           | safety-aware pool curation                                                                               |
| Kena / Mundaka / Mandukya | 114 units      | drafting interrupted by session limit — **relaunch after 2:30pm** | extractor verified against canonical counts                                                              |

Alongside the verse bank, the app-authored fallback catalog still serves the wider surfaces offline: 50 concept introductions, 20 practice guides, 30 rotating reflections, and the festival library now includes 21 explainers.

**Live bank: 142 units · 108-verse curated daily pool · 100% Hindi coverage · 3 scriptures.** The pool excludes sentence-fragment verses (they live in the reader). Next extraction queue and the epics architecture note (bulk reader via RAG pipeline, not file-per-verse) are in the progress-log corpus ledger.

## App surfaces (all browser-verified)

- **Today**: personalized daily shloka card (tag-pooled rotation, "Carry it today" reflection), daily reflection, practice, streaks, festival peek. Free mode hides all upsells.
- **Shloka detail**: three registers, word-by-word rows, meaning, reflection, read-in-context link. Language preference (en/hi) applies everywhere; the Settings switcher self-activates from bank content.
- **Reader** (`/read`): continuous chapter-by-chapter scripture reading — Gita per chapter, short texts whole in liturgical order.
- **Shloka bank** (`/shlokas`): virtualized reference index grouped by chapter.
- **Onboarding**: one screen — name, tradition, focus question (drives the daily pool), reminder. Skippable.
- **Challenge system** (Navratri Nine Nights): schema, unlock-by-local-date RPCs, join screen with real-count-only social proof, IAP purchase path — all built, **parked** with payments per free launch.
- **Ask Dharma**: existing RAG chat, live once Supabase + AI keys exist (founder items 1/3).
- **Web arrival site** (`apps/web`): six approved pages, built from reviewed markdown; **parked** (app-first), deployable any time.

## Engineering state

- Monorepo green: typecheck, lint, 138 tests, 883 content files validating, migration security gates (72 migrations incl. challenges + purchase RPCs), CI with bank-freshness guard.
- Content pipeline: validator-enforced doc types (corpus, challenge_session, web_page, shloka), generators to bundled JSON/SQL, extraction scripts for Wikisource (generic, khanda-aware) and ITRANS.
- Analytics wired and consent-gated (no-op until PostHog key); Sentry likewise; Expo Go crash-guarded ([testing guide](docs/testing-in-expo-go.md)).
- Not yet done: production deployment of anything (blocked on founder items), sandbox purchase testing (parked), native device QA, scoped AI on the daily verse, audio, remaining acceptance sweep (reduced-motion, keyboard nav, 320px).

## The founder's critical path ([full list](docs/00-your-actions.md))

1. Supabase production project + keys → then "apply migrations"
2. Expo/EAS account → device builds
3. DeepSeek + OpenAI keys → Ask Dharma live
4. Apple/Play accounts (Play's 14-day closed test is the long pole)
5. Support email + privacy URL (GitHub Pages — no domain needed)
6. Sentry/PostHog (optional)

## Standing product rules (unchanged)

Source-grounded with named translators; no tradition ranked as correct; scripture/commentary/app-guidance kept distinct; no guru/priest/therapist behaviour; safety gates stay; quoted text is never generated from memory — every verse traces to a staged source file with provenance.
