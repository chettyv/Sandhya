# Sandhya — Current Project Summary

**Last updated:** 18 August 2026 (content audit and cross-stream handoff)
**Status:** Free-launch product, content-live, and ready to continue from `main`; production infrastructure and native-device release work still await founder setup.

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
| Katha Upanishad          | 121 units      | 121 live             | approved content pass; included in the bank                                             |
| Shvetashvatara Upanishad | 114 units      | 114 live             | approved content pass; included in the bank                                             |
| Bhaja Govindam           | 33 units       | 33 live              | extracted and approved stotra wave                                                      |
| Aditya Hridayam          | 31 units       | 31 live              | extracted and approved epic-text wave                                                   |
| Soundarya Lahari         | 103 units      | 103 live             | extracted and approved stotra wave                                                      |
| Devi Mahatmya            | 588 units      | 0 live               | 51 content-pass drafts; 537 extracted skeletons; all remain out of the bank             |
| Daily prayers            | 3 units        | 3 live               | Gāyatrī, Mahāmṛtyuñjaya, and asato mā with provenance and practice notes                |

Alongside the verse bank, the app-authored fallback catalog still serves the wider surfaces offline: 50 concept introductions, 20 practice guides, 30 rotating reflections, and the festival library now includes 21 explainers.

**Live bank: 661 approved units · 252-verse curated daily pool · 100% Hindi coverage.** The bank also has Bengali, Gujarati, Marathi, and Tamil layers for the current language wave. Devi Mahatmya drafts are deliberately not bundled. The pool excludes sentence-fragment verses (they live in the reader); the remaining editorial queue and epics architecture note are in the progress ledger.

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

- Monorepo checks are green at the last verified handoff: typecheck, lint (two non-blocking import-order warnings in extraction scripts), 170 workspace tests plus admin checks, backend security/runtime gates, and the regenerated bank. The current content audit validates 1,876 Markdown files with 0 invalid.
- Content pipeline: validator-enforced doc types (corpus, challenge_session, web_page, shloka), generators to bundled JSON/SQL, extraction scripts for Wikisource (generic, khanda-aware) and ITRANS.
- Analytics wired and consent-gated (no-op until PostHog key); Sentry likewise; Expo Go crash-guarded ([testing guide](docs/testing-in-expo-go.md)).
- Not yet done: production deployment of anything (blocked on founder items), sandbox purchase testing (parked), native device QA, scoped AI on the daily verse, and audio. Editorially, 620 Gita drafts and 588 Devi Mahatmya drafts remain unfinished; only the 51-file Devi content pass has started. The reduced-motion, keyboard-navigation, and 320px acceptance checks are complete.

## Unfinished and mid-action work

- **Content:** continue the Devi Mahatmya content pass (537 skeletons remain), continue the 620-file non-launch Gita editorial queue, and complete rights/reviewer checks before any draft is promoted.
- **Audio:** record clear and slow human reading passes and then build/verify the native audio player on a device.
- **Founder setup:** confirm Supabase credentials before applying migrations; create the Expo/EAS project; add server AI keys only if Ask Dharma is being enabled; complete support/privacy/store setup and native-device QA.
- **Parked by decision:** Navratri payments/challenge publication, the web arrival site, sandbox purchase testing, and scoped daily-verse AI remain intentionally off the pilot path.
- **Source block:** Prashna remains blocked by the missing third-prashna verse boundary; Taittiriya/Aitareya remain on the source-quality/rights queue.

## Founder setup queue ([current checklist](docs/00-your-actions.md))

1. Verify the existing Supabase project; after confirmation, apply migrations for auth and sync
2. Expo/EAS account and native device builds — later
3. DeepSeek/OpenAI keys and Ask Dharma — later, server-side only
4. Apple/Play accounts and store submission — later
5. Support email, privacy URL, and legal pages — before store launch
6. Sentry/PostHog — optional, later

## Standing product rules (unchanged)

Source-grounded with named translators; no tradition ranked as correct; scripture/commentary/app-guidance kept distinct; no guru/priest/therapist behaviour; safety gates stay; quoted text is never generated from memory — every verse traces to a staged source file with provenance.
