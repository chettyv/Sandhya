# Sandhya — Current Project Summary

**Last updated:** 16 August 2026 (repository reconciliation, commit `460247e`)
**Status:** Free-launch product, content-live, main is green and pushed; production infrastructure and native-device release work still await founder setup.

This file is the single current summary. The working ledger is [`docs/03-progress.md`](docs/03-progress.md); the founder's action queue is [`docs/00-your-actions.md`](docs/00-your-actions.md); source rights live in [`docs/SOURCES-AND-ATTRIBUTION.md`](docs/SOURCES-AND-ATTRIBUTION.md). The plan of record is `02-plan.md` (v3), as amended by founder decisions recorded in the progress log.

## What the product is now

A free, source-grounded daily practice app built around a **verse bank**: every verse carries Devanagari, IAST, plain-English pronunciation ("Say it"), an original translation, a word-by-word gloss, a prose meaning that names tradition differences honestly, a reflection prompt, and Hindi throughout. The daily loop is verse-linked (verse → meaning → its own reflection), personalized by profile focus tags, and everything works offline from the bundled bank.

**Founder decisions in force:** free launch (no payments — `EXPO_PUBLIC_PAYMENTS_ENABLED` default off, re-audit gate before reactivation) · app-first (web arrival site parked) · all scriptures ("corpus maximization") · all languages · approved content is bundled only after named review, with draft waves kept out of the live bank.

## Content state (the heart of it)

| Text                     | Extracted      | Fully drafted + live | Notes                                                                                   |
| ------------------------ | -------------- | -------------------- | --------------------------------------------------------------------------------------- |
| Bhagavad Gita            | all 700 verses | 80 live              | 620 reader-ready draft skeletons remain; the approved set covers the curated essentials |
| Hanuman Chalisa          | all 43 units   | 43 live              | ITRANS→Devanagari converted and canonically aligned                                     |
| Isha Upanishad           | 19 units       | 19 live              | safety-aware pool curation                                                              |
| Kena Upanishad           | 36 units       | 36 live              | approved, including the shanti passage                                                  |
| Mundaka Upanishad        | 65 units       | 65 live              | approved, including the shanti passage                                                  |
| Mandukya Upanishad       | 13 units       | 13 live              | approved, including the shanti passage                                                  |
| Katha Upanishad          | 121 units      | 0 live               | complete draft pass on main; still excluded from the bank pending review                |
| Shvetashvatara Upanishad | 114 units      | 0 live               | extracted draft corpus; content pass and review remain                                  |
| Daily prayers            | 3 units        | 3 live               | Gāyatrī, Mahāmṛtyuñjaya, and asato mā with provenance and practice notes                |

Alongside the verse bank, the app-authored fallback catalog still serves the wider surfaces offline: 50 concept introductions, 20 practice guides, 30 rotating reflections, and the festival library now includes 21 explainers.

**Live bank: 259 approved units · 156-verse curated daily pool · 100% Hindi coverage.** The bank also has Bengali, Gujarati, Marathi, and Tamil layers for the current language wave. Draft Katha and Shvetashvatara content is deliberately not bundled. The pool excludes sentence-fragment verses (they live in the reader); the remaining extraction queue and epics architecture note are in the progress ledger.

## App surfaces (all browser-verified)

- **Today**: personalized daily shloka card (tag-pooled rotation, "Carry it today" reflection), daily reflection, practice, streaks, festival peek. Free mode hides all upsells.
- **Shloka detail**: three registers, word-by-word rows, meaning, reflection, read-in-context link. Language preference (en/hi) applies everywhere; the Settings switcher self-activates from bank content.
- **Reader** (`/read`): continuous chapter-by-chapter scripture reading — Gita per chapter, short texts whole in liturgical order.
- **Shloka bank** (`/shlokas`): virtualized reference index grouped by chapter.
- **Onboarding**: one skippable screen — household-practice choices route the daily pool, reminder time is stored, and name is optional; tradition remains editable in Settings.
- **Challenge system** (Navratri Nine Nights): schema, unlock-by-local-date RPCs, join screen with real-count-only social proof, IAP purchase path — all built, **parked** with payments per free launch.
- **Ask Dharma**: existing RAG chat, live once Supabase + AI keys exist (founder items 1/3).
- **Web arrival site** (`apps/web`): six approved pages, built from reviewed markdown; **parked** (app-first), deployable any time.

## Engineering state

- Monorepo green: typecheck, lint (two non-blocking import-order warnings in extraction scripts), 170 workspace tests plus admin checks, 1,121 content files validating, backend security/runtime gates, and a passing bank-freshness guard.
- Content pipeline: validator-enforced doc types (corpus, challenge_session, web_page, shloka), generators to bundled JSON/SQL, extraction scripts for Wikisource (generic, khanda-aware) and ITRANS.
- Analytics wired and consent-gated (no-op until PostHog key); Sentry likewise; Expo Go crash-guarded ([testing guide](docs/testing-in-expo-go.md)).
- Not yet done: production deployment of anything (blocked on founder items), sandbox purchase testing (parked), native device QA, scoped AI on the daily verse, and audio. The reduced-motion, keyboard-navigation, and 320px acceptance checks are complete.

## The founder's critical path ([full list](docs/00-your-actions.md))

1. Supabase production project + keys → then "apply migrations"
2. Expo/EAS account → device builds
3. DeepSeek + OpenAI keys → Ask Dharma live
4. Apple/Play accounts (Play's 14-day closed test is the long pole)
5. Support email + privacy URL (GitHub Pages — no domain needed)
6. Sentry/PostHog (optional)

## Standing product rules (unchanged)

Source-grounded with named translators; no tradition ranked as correct; scripture/commentary/app-guidance kept distinct; no guru/priest/therapist behaviour; safety gates stay; quoted text is never generated from memory — every verse traces to a staged source file with provenance.
