# Sandhya — Build Progress Log

**Started:** 12 August 2026. Maintained by the build agent; updated at the end of every work cycle.
Inputs: `01-review.md` (repo root), `02-plan.md` v2 (repo root), `CURRENT_SUMMARY.md`, and a direct survey of the code on 12 Aug 2026.

---

## STEP 0 — ORIENTATION (12 Aug 2026)

### What exists and works today

Verified by running it on 12 Aug 2026, not by reading docs:

- **Workspace health:** `pnpm typecheck` passes (5 projects). `pnpm test` passes — 131 tests (116 rag-pipeline, 5 content-tools, 10 mobile). `pnpm backend:check` and `pnpm backend:release-contract` pass.
- **Git state:** everything is committed and pushed. `origin/main` is at `e305c75` ("build Sandhya application foundation", 899 files). The review and `CURRENT_SUMMARY.md` describe a pre-commit state (857 staged files, uncommitted work) that no longer exists — the preservation risk they flag is already substantially resolved. `.env` exists locally, is gitignored, and has never been committed (verified via `git log --all -- .env`).
- **Mobile app** (`apps/mobile`, ~10.1k lines TS/TSX, 59 files): Expo 56 / RN 0.85 / Expo Router / NativeWind / TanStack Query / Zustand. Five tabs (Today, Calendar, Chat/Ask, Explore, Journey) plus auth, profile, settings, subscription, journal, saved, conversations, detail screens. Builds for web (`expo export --platform web`; static export previously committed under `apps/mobile/dist`).
- **Onboarding as actually built:** ONE screen (`app/onboarding.tsx`, 184 lines) — optional name, tradition chip, reminder toggle/time, plus a skip link. **The 13-question funnel and 4-screen carousel exist only in `CURRENT_SUMMARY.md` as a proposal. They were never built.**
- **Daily loop:** Today tab renders daily reflection (picked by day-of-year), practice, streak/week strip, festival peek, concepts. Content = 6 parallel Supabase selects merged with a bundled offline catalog (30 reflections, 50 concepts, 21 festivals, 20 practices), so the app never renders empty.
- **Ask:** open free-text single-turn RAG chat. Sign-in required, 5/day free quota (server-enforced, atomic), per-minute rate limit, monthly budget guard with reservations, global `cached_answers` with rights re-validation on read, structured JSON answers validated server- and client-side, citation IDs cross-checked against retrieved passages, SSE streaming.
- **Backend:** 70 Supabase migrations; RLS on all user tables; pgvector 1536-dim (`text-embedding-3-small`); 8 edge functions (ask, account, admin-content, admin-feedback, admin-ops, register-push-token, revenuecat-webhook, send-daily-reflections). LLM provider pluggable (default deepseek; anthropic and openai-compatible supported).
- **Payments:** RevenueCat subscriptions (monthly/annual/lifetime) on native; signed webhook with lease fencing; server-side entitlement (`user_has_plus_access`, fail-closed). **Web build has a stub that returns no offerings and throws on purchase.**
- **Push:** registration, cron worker, fenced delivery claims, receipt polling, token pruning.
- **Admin console** (`apps/admin`): vanilla-TS static site; content CRUD, feedback moderation, ops dashboard, cache inspection — authorized server-side, fully audited.
- **RAG pipeline** (`packages/rag-pipeline`): prepare → audit → ingest → evaluate CLIs, rights-cleared-only by default, idempotent ingestion.

### What exists and is broken or half-built

- **No production deployment of anything.** No production Supabase project confirmed, no store builds, no hosted admin console, no analytics/Sentry wired to real projects. All verification is local/static.
- **Web purchases impossible** — deliberate stub. Matters because the plan's revenue mechanism may need to sell on web (see Conflicts).
- **i18n is a stub** (~55 keys, English only); most user-facing strings hard-coded. Settings shows a non-functional "Language: English" row.
- **Test coverage is backend-heavy:** ~101 lines of tests against ~10k lines of mobile source (2 test files). The 131-test figure is real but 116 of them are the RAG pipeline.
- Minor: `src/screens/saved/ConceptRow.tsx` is an orphan pattern; `.expo-preview.err.log` committed noise; `content.ts` exports both `dailyReflection` and `dailyReflections`.

### What the plan (v2) requires that does not exist

In Phase 1 deliverable order:

1. **A challenge system — nothing exists.** No tables, RPCs, types, or screens for challenges/sessions/nightly unlock/participation counts. Closest primitives: `practice_completions`, `activity_days`, `practice_guides` (ordered JSONB steps).
2. **One-off purchases — nothing exists.** Only subscriptions via RevenueCat; `lifetime` is a plan value, not a per-item purchase. No consumable/non-consumable handling, no per-item unlock.
3. **Audio — nothing exists.** No expo-av/expo-audio, no player, no assets.
4. **Three-register pronunciation format** (Devanagari / IAST / plain-English) — not in the content schema, catalog, or renderers.
5. **Scoped AI** — retrieval is open-corpus; `match_passage_embeddings` accepts no scoping parameter. The plan wants the ask box scoped to today's/tonight's content.
6. **Indexable web surface — greenfield.** No marketing site, no SEO pages, no sitemap/robots. The only HTML in the repo is the auth-gated admin shell.
7. **Nine Nights content** — 0 of 9 sessions written; no reviewer engaged. (Founder work — see `docs/00-your-actions.md`.)
8. **Arrival actions** (§5) — none executed. (Founder work.)

### What the review/plan did not account for

- **Onboarding is already ~3 questions.** Review Serious-4 ("nineteen screens to first value") and plan deliverable 9 ("onboarding collapsed to three questions") describe the _proposed_ funnel in `CURRENT_SUMMARY.md`, not the code. Real steps to first value today: open app → one onboarding screen (skippable) → Today tab with a teaching. That is 2–3 steps. Deliverable 9 is effectively done; the real remaining work item is _not building_ the planned funnel.
- **The work is already preserved.** Phase 0's stated motivation ("one disk failure from losing all of it") was resolved by commit `e305c75` + push before this engagement began. Phase 0 shrinks to: plan-v2 commit, preserve branch pointer, repo slimming, `PORTFOLIO.md`.
- **~128 MiB of `content/_staging` raw sources are in tracked git** (612 files), plus 35 WhatsApp reference screenshots in `docs/ref_images` (the "Bible Chat screenshots" the plan says to delete).
- **The app runs on web already.** The plan's web/app split ("Arrival = web, Habit = app") can partially reuse the existing Expo web build; the SEO pages still need a real static surface (Expo static export is client-heavy and not written for indexing).

### Conflicts surfaced (not silently resolved)

1. **Plan v2 is uncommitted.** `02-plan.md` in the working tree (v2, FIX) differs from the committed v1. Treating the working copy as authoritative per its own header ("supersedes v1"); committing it as-is in Phase 0.
2. **Phase 0 says "move raw sources out of Git _history_".** That requires rewriting and force-pushing `origin/main` — a destructive operation on a shared branch that I will not run unilaterally. **Done instead:** untrack the staging tree going forward (files stay on disk, future clones are slim). **History rewrite is logged as a founder decision** in `docs/00-your-actions.md`.
3. **Where is the challenge sold?** The plan prices Navratri at £8–15 one-off and schedules "payment page live and tested with a real card". A real-card test implies web checkout (Stripe or RevenueCat Web Billing) — but the existing rail is native IAP, the web build's purchase stub throws, and the app is not in any store (store review alone puts 11 Oct at risk). The plan never names the platform. **Category-2 decision — logged in `00-your-actions.md`, not chosen silently.** Build order chosen so this doesn't block: challenge schema/screens/unlock first, payment rail behind an entitlement check that either rail can satisfy.
4. **Task brief vs plan on pricing shape.** The engagement brief's persuasive-design list requires "annual plan alongside monthly at a visible discount"; the plan's revenue mechanism is a one-off challenge purchase (§1.3 argues _against_ subscription-shaped revenue). Per the brief's own rule the plan's cut list governs scope: the existing subscription screen stays as-is, the challenge is one-off, and no new subscription surface is built. Flagged here rather than resolved silently.
5. **CLAUDE.md / build reference vs plan.** CLAUDE.md names `sandhya_build_reference.docx` authoritative (five-tab IA, Calendar surfaced, onboarding funnel). Plan v2 cuts the Calendar tab and the funnel. Priority order in CLAUDE.md itself puts the user's direct request (execute plan v2) first. Proceeding per plan v2.
6. **Plan CUTs already-built infrastructure** (admin moderation console, push retry leases, RevenueCat entitlement verification — "built to look complete"). These are built, tested, and cost nothing at runtime; scoped AI in CORE means reported answers exist at launch, which is what the moderation console is for. **Interpreting CUT as "spend nothing more on these", not "delete working code".** Deleting them is reversible later; flagged as a decision, defaulting to keep-dormant.
7. **Engagement brief paths** reference `docs/01-review.md` / `docs/02-plan.md`; the real files are at repo root. Trivial, noted for the next session.

### Decisions taken that the plan did not specify

- Conventional-commit prefixes kept (repo enforces commitlint).
- `content/original` (the one approved canonical file) stays tracked; only `_staging` is untracked.
- Admin console and push infrastructure retained dormant (see conflict 6).

---

## CYCLE LOG

### Cycle 1 — 12 Aug 2026 — Orientation + Phase 0 — DONE

- Plan v2 committed (`6ff11ab`); `preserve/2026-08-12-full-state` pushed to origin.
- 608 raw staged sources untracked from git (stay on disk); 35 reference screenshots deleted; `PORTFOLIO.md` written; this log and `docs/00-your-actions.md` created (`dc259fc`, merged to main, pushed).
- Verified before touching anything: typecheck, 131 tests, backend checks all pass.
- Remaining from Phase 0: git history rewrite — founder decision (your-actions item 2).

### Cycle 2 — 12 Aug 2026 — Challenge session content format — DONE

The plan's §4.1 pronunciation format + the writing contract for the nine sessions, built first because founder writing (your-actions item 3) was blocked without it.

- `content/challenges/README.md` — house style: six fixed sections, three-register shloka block (**Devanagari / IAST / Say it** + Meaning + Source), "Say it" style rules.
- `content/challenges/navratri-2026/_template.md` — starting file, validator-ignored via `_` prefix.
- `packages/content-tools`: `challenge_session` doc type with strict validation — section order enforced, all five shloka labels required, Devanagari line must contain Devanagari codepoints, `approved` requires a named `reviewed_by`, `can_embed: false` mandatory (paid content never enters the RAG corpus). 7 new tests (11 total in package). `_`-prefixed files now skipped by the corpus scanner (also covers `_staging`, previously special-cased).
- Verified: package tests, `pnpm content:validate`, `pnpm content:stats`, typecheck all pass.

Files: +2 content docs, ~+120 lines in content-tools src, +90 test lines. No dependencies added.

**Next:** challenge system (schema → screens → unlock → join screen with participation count), with the design spec written before any UI.

### Cycle 3 — 12 Aug 2026 — Challenge system (schema + app) — DONE

- `docs/design-spec.md` written before any UI: codifies the existing token system (verified AA+ contrast), specifies the challenge overview/join screen, night session screen, Today-tab arrival card, and web page style.
- **Migration `20260812130000_challenges.sql`:** `challenges` (public read when published), `challenge_sessions` (service-role only — paid content), `challenge_participants` (read-own; rows created only server-side by the payment path), `challenge_night_completions` (read/insert own, participant-gated). Two SECURITY DEFINER RPCs: `get_challenge_overview` (anon-safe join-page aggregate: participant count, approved session metadata, unlock dates) and `get_challenge_session` (participant + local-date unlock check, profile timezone with UTC fallback, invalid-timezone safe). Passes `verify-migration-security` (53 migrations). **Not yet executed against a real database — no Docker/psql/supabase CLI on this machine** (see your-actions item 11).
- **Mobile:** `src/lib/challenges.ts` (defensive parsing, TanStack hooks, completion mutation with duplicate-as-success); `app/challenge/[slug]/index.tsx` (join/home screen per spec — participation count renders only ≥25, real numbers only); `app/challenge/[slug]/night/[night].tsx` (all six section renders, three-register shloka card, locked/not-joined/auth/not-found/error states); Today-tab arrival card (`FeaturedChallengeCard`). Purchase step intentionally absent pending the payment-rail decision (your-actions #1) — signed-in join shows an honest "joining opens shortly" card, and challenges stay unpublished until payments exist.
- **Verified:** typecheck, lint, 137 tests, `expo export --platform web` bundles both routes; rendered both screens in a browser from the static export — overview shows the designed error state with zero console errors; found and fixed a hang (malformed `night` param left the query disabled and the spinner infinite — now renders not-found).
- **Broke and fixed in the same cycle:** untracking `content/_staging/raw` deleted the files from the working tree on merge (recovered from the preserve branch, now untracked on disk) and would have broken CI in two places — `verify-source-trackers` staged-target checks and the CI RAG staging gates now skip gracefully when the tree is absent. Also added `dist-verify` to eslint ignores (pre-existing gap that surfaced as 109k lint errors on export output).
- Files: +1 migration (~250 lines), +3 mobile files (~600 lines), ~30 lines edits across CI/scripts/eslint/layout. Dependencies added: none.

**Next:** seed pipeline (session markdown → SQL seed, approved-only), then the web arrival surface scaffold, then scoped AI.

### Cycle 4 — 12 Aug 2026 — Content→DB seed pipeline — DONE

- `content/challenges/navratri-2026/challenge.json` — real challenge metadata (11–19 Oct 2026, 9 nights, unpublished, price blank pending the pricing decision).
- `scripts/generate-challenge-seed.mjs` + `pnpm content:generate-challenge-seed` — validates every night file via content-tools, **refuses non-approved sessions** (`--allow-draft` for local dev only), parses the six sections and multi-block shloka groups into the `content` jsonb shape, and writes migration `20260812140000_challenge_catalog.sql` (idempotent upserts, generated-file header). Same pattern as the existing authored-catalog generator.
- Verified: draft refusal, session SQL emission via a throwaway fixture (deleted after), clean regeneration, migration security gates pass (54 migrations).
- When the founder writes `night-01.md`, the full path is: validate → approve with named reviewer → regenerate → migrate. No hand-written SQL.

**Session end state:** all work pushed to `origin/main` (`441b132` + this cycle). Working tree clean. **Next session:** web arrival surface scaffold (6 explanatory pages, static, per design spec) → scoped AI on today's content → payment rail once your-actions #1 is decided.

### Cycle 5 — 12 Aug 2026 — IAP purchase path (founder decided: app-store IAP) — DONE

Founder decisions received: **payment rail = native IAP via RevenueCat**; keep working continuously and maintain the actions list as the parallel queue.

- **Product contract:** one-off non-consumable store products named `sandhya_challenge_<slug_with_underscores>` (store ids can't contain hyphens) map to challenge slugs. Documented in your-actions 1b for store setup.
- **Migration `20260812150000_challenge_purchase_rpc.sql`:** `apply_challenge_purchase` / `revoke_challenge_purchase` — service-role-only SECURITY DEFINER; the only write path into `challenge_participants`. Deleted-account purchases acknowledge without granting; refunds revoke.
- **Webhook:** challenge products branch before subscription state logic — purchase events grant, REFUND revokes, everything else acknowledges; fenced event claiming reused; subscription state never touched by challenge products.
- **Client:** `purchaseChallenge(slug)` in `subscriptions.native.ts` (verified against installed react-native-purchases 10.4.4 API: `getProducts` + `purchaseStoreProduct`, user-cancel handled); web stub returns `unavailable`. Join flow in the overview screen: purchase → "confirming" poll until the webhook grant lands (3s interval, honest slow-path copy after 60s, stops on unmount/joined); web build shows "join in the app" card.
- **Verified:** migration security (55), edge-function syntax (13 files), RevenueCat runtime check, mobile typecheck, lint, backend checks — all pass. **Not verified: a real sandbox purchase** — needs store accounts + RevenueCat products (your-actions 1/1b) and a native build on a device.
- **Launch-critical consequence of IAP, now on the founder list:** Google Play personal accounts require a 12-tester, 14-day closed test before production — the Android closed test must be live by mid-September to make 11 October.

**Next:** web arrival surface scaffold (six §5 pages), then scoped AI on the day's content.

### Cycle 6 — 12 Aug 2026 — Web arrival surface — DONE

- **`apps/web`** — zero-framework static site: `build.mjs` renders `content/web/*.md` through the shared content-tools validator into `dist/` (page shell per design spec, index, `sitemap.xml`, `robots.txt`). Approved-only publishing; `--allow-draft` builds drafts with a visible "DRAFT — do not publish" banner for review. One dependency added: `marked` (markdown → HTML; actively maintained; writing a correct renderer by hand is not 20 lines). Site URL configurable via `WEB_SITE_URL` (placeholder `sandhya.app` until the domain exists — your-actions #9).
- **`web_page` doc type** added to content-tools with the same named-reviewer gate as sessions; `pnpm content:validate` now covers web pages.
- **Two §5 pages drafted** for founder review (your-actions #8): `what-can-i-eat-during-navratri` and `nine-forms-of-durga-navratri`. Deliberately no direct scripture quotations in drafts — prose only, tradition variation stated explicitly, no invented citations. Four more §5 pages to draft next (Ekadashi, Lakshmi puja, diya, Hanuman Chalisa meaning).
- **Verified:** built in both modes, rendered in browser (draft banner, title/meta correct), lint/typecheck/tests/backend checks pass, `apps/web` builds after content-tools via workspace dependency ordering. Fixed en route: `apps/**/*.mjs` missing from the lint tsconfig; build scripts added to the relaxed-lint block alongside `scripts/**`.

**Next:** remaining four §5 page drafts → scoped AI on today's content → EAS build config for the store pipeline.

### Cycle 6b — 12 Aug 2026 — Two more arrival page drafts — DONE

Ekadashi and diya pages drafted (same rules: no scripture quotes in drafts, variation explicit). Four of six §5 pages now await founder review. Remaining: Lakshmi puja at home, Hanuman Chalisa meaning.

### Cycle 7 — 12 Aug 2026 — Shloka bank (free product first — founder priority flip) — IN PROGRESS

Founder redirected priorities: **free product quality first — shloka bank with word-by-word meanings; monetisation last.** IAP work parked (built through sandbox-ready; no further effort until product is good).

- **`shloka` doc type** in content-tools: three-register block + `## Word by word` gloss lines + `## Meaning` prose, provenance required (`source_url`, Source label), approved-needs-named-reviewer. Template at `content/shlokas/_template.md`. 12 tests pass.
- **`pnpm content:generate-shloka-bank`** → bundled `apps/mobile/src/data/shlokaBank.json` (approved-only; `--allow-draft` dev; `--check` staleness). Verified end-to-end with a fixture.
- **App:** `src/lib/shlokas.ts` (day-of-year rotation like reflections), Today-tab "Today's shloka" card (hidden while bank is empty), `/shlokas` bank list, `/shloka/[slug]` detail with registers card, word-by-word rows, "the meaning behind it" prose, reflection. Journey tab links the bank. Typecheck/lint/tests pass; typed routes regenerated.
- **Content reality:** the bank ships empty until verses are copied from rights-cleared sources and reviewed — Wikisource Sanskrit Gita is staged but marked "attribution/share-alike review needed" in the inventory; Besant/Bhagavan Das 1905 (word-by-word translation, likely public domain) is staged as OCR. **Populating the bank = founder/reviewer work with those sources** (your-actions #3 note expanded).
- Open question for founder: the message mentioned "our qu" — quiz? questions? Clarify what that refers to.

**Next:** verify Today-tab render with populated fixture in browser · remaining two §5 drafts · scoped AI (depth layer on the daily shloka).

### Cycle 8 — 12 Aug 2026 — Founder directives round 2 + notes — DONE

Directives: never stop to ask (questions go in 00-your-actions) · collect maximum corpus with attribution noted for later clearance · keep building until the app is complete, UX-polished, ready to use · Expo Go testing note.

- `docs/SOURCES-AND-ATTRIBUTION.md` — human summary of the 242 staged sources, per-class attribution requirements, PD-safe rule of thumb (translator died pre-1955), founder-only acquisitions, tiered corpus-completeness target.
- `docs/testing-in-expo-go.md` — phone testing guide; `configurePurchases` now try/caught so Expo Go's missing native module degrades instead of crashing startup.
- your-actions: added notes pointer + the "our qu" question (non-blocking).

### Cycle 9 — 12 Aug 2026 — Ship sprint (founder: live in 1–2 days) — IN PROGRESS

Directive: don't stop until the app is ready; placeholders only for credentials. Realistic 48h surface = web (Expo web app + arrival site); stores stay queued (external timelines).

- **Full Gita extracted: all 700 verses across 18 chapters** (chapter 16 re-fetched from Wikisource — the staged export had a truncated redirect page; supplement record stored with provenance). All validate.
- **30-verse launch set being drafted by three parallel writers** (chapter 12 complete + 2.13/14/20/47/48/62/63/69/70/71): translation, word-by-word gloss, meaning prose, stress-marked pronunciation — per plan §4.4 (AI drafts, named human approves). Ship-gate unchanged: founder reviews + approves each file (SHIP-48H item 1 in your-actions).
- Bank generator now natural-sorts (2.9 before 2.10; lexicographic bug); bank list screen rewritten as virtualized SectionList grouped by chapter (700-verse scale).
- **All six §5 arrival pages now drafted** (added Lakshmi puja at home + Hanuman Chalisa meaning — the latter deliberately quotes no verses, per the named-edition rule).
- README gains a Quickstart; **SHIP-48H checklist added to 00-your-actions** — the founder's exact 5-step path to live.

### Cycle 10 — 12 Aug 2026 — Free launch, 30 drafted verses, tags + languages — DONE

Founder directives: launch free (non-commercial unlocks restricted sources; paid parked behind a flag with a re-audit gate before reactivation) · all languages · tags for profile-driven journeys.

- **30-verse launch set fully drafted** by three parallel writers (ch 12 complete + ch 2 essentials): translations, sandhi-split word-by-word glosses, 60–120-word meanings with honest tradition-variation notes (spot-checked 2.47 — accurate and non-flattening), stress-marked pronunciation. All draft-gated on founder review.
- **Free mode:** `EXPO_PUBLIC_PAYMENTS_ENABLED` (default off) — Plus upsell hidden, premium filters open everything, subscription screen shows "Everything is free right now". 8 gating sites wired.
- **Tags + personalization:** optional `tags:` frontmatter (validated), 30 launch verses tagged, store gains `focusTags` + `contentLanguage`, onboarding gains one optional "What would help most right now?" chips question (≤2), daily shloka rotates within the user's tag pool.
- **Languages:** schema + generator support `**Meaning (xx):**` / `## Meaning (xx)` per-language variants; app prefers the user's language with English fallback; settings Language row becomes functional automatically once a second language has reviewed content.
- **Browser-verified end to end:** onboarding (focus chips) → Today shows the devotion-pool verse (12.3, drafted translation) → detail renders three registers + full word bank + meaning + attribution. Zero app console errors. `public/_redirects` added so dynamic deep links survive static hosting.
- Committed bank is approved-only (empty until founder review); local preview: `pnpm content:generate-shloka-bank -- --allow-draft`.

### Cycle 11 — 12 Aug 2026 — Full-bank tagging — DONE

All 700 verses now carry theme tags (curated tags on the 30 launch verses; defensible chapter-level tags elsewhere: ch1 courage/family, ch2 wisdom/courage, ch7–12 devotion-weighted, etc.). Personalized rotation works across the whole bank the moment more verses are approved.

### Cycle 12 — 12 Aug 2026 — Product evaluation fixes: reader, curated pool, verse-linked spine — DONE

Founder's product evaluation surfaced three real flaws; all three fixed and browser-verified:

- **Scripture reader** (`/read` + `/read/[chapter]`): continuous chapter-by-chapter reading of all 700 verses — Devanagari + translation per verse, tap-through to the full word-bank detail, virtualized. Linked from Journey tab and from every verse detail ("Read this verse in its chapter"). Verified in browser: all 18 chapters with canonical verse counts, chapter 12 reads continuously, zero console errors.
- **`daily_pool` curation flag** — the Bible-verse-of-the-day problem solved honestly: many Gita verses are sentence fragments (12.3→12.4 etc.) and must never appear as standalone daily verses. Only curated verses rotate; 22 of the 30 launch verses flagged (the 8 sentence-pair fragments excluded — they live in the reader). Verified: pool contains no fragments; fallback keeps the app working if nothing is flagged.
- **Verse-linked daily spine** — every launch verse now carries its own one-line reflection prompt (30 written, draft-gated like everything else); the Today card shows "Carry it today: …" under the verse, and the detail screen is the full spine: verse → word bank → meaning → reflection → read-in-context.

Founder review note: the 30 files gained `daily_pool` flags and `## Reflection` sections since the last look — the SHIP-48H review covers these too.

### Cycle 13 — 12 Aug 2026 — Ch3 drafts, Hindi launch set, loop analytics — DONE

- **Ten chapter-3 karma-yoga verses drafted** (3.4–3.35 selection), all pool-flagged; 3.16 flagged for reviewer judgement (its "wheel" leans on 3.14–15). Daily pool now 32 pending review.
- **Hindi for all 30 launch verses**: `**Meaning (hi):**` verse translations + `## Meaning (hi)` prose, natural register, tradition notes preserved; verified end-to-end through the generator (30/30 parsed; available languages en,hi — the Settings switcher activates on approval).
- **Product-loop analytics**: onboarding_completed, daily_shloka_opened, shloka_viewed, reader_chapter_opened via the consent-gated telemetry; CI now fails on a stale bank (`generate-shloka-bank --check`).
- Founder review scope is now **40 verse files** (30 launch + 10 ch3) + 6 web pages.

### NEXT SESSION — priorities (founder said don't stop)

1. **Hanuman Chalisa into the bank:** staged `content/_staging/raw/hindi/sanskritdocuments_hanuman_chalisa_hi.itx` is clean but ITRANS-encoded — write an ITRANS→Devanagari converter (deterministic, mirrors the IAST work in `extract-gita-shlokas.mjs`) and emit draft files (free-mode legal with attribution; Hindi Wikisource page lookup failed on three title guesses — try their search API or the `hanumAnachAlisAsaMskRRita.itx` Sanskrit variant).
2. **Hindi translations for the 30 launch verses** — draft `## Meaning (hi)` sections via writer agents (the plumbing ships; settings row activates automatically).
3. **Word-by-word + translations for more Gita chapters** — writer agents in batches of 10, chapter 3 next (karma yoga — matches "discipline/duty" journeys).
4. Remaining acceptance sweep: reduced-motion audit, keyboard nav on web, analytics events (PostHog is placeholder-keyed), 320px viewport pass.
5. Scoped AI on the daily shloka (needs live backend — after founder's Supabase step).

6. **Corpus extraction (top priority):** write `scripts/extract-gita-verses.mjs` — fetch the sanskritdocuments.org Bhagavad Gita (ITX/HTML per chapter; their terms allow distribution with attribution — record row in inventory) or parse the staged `content/_staging/raw/sanskrit/wikisource_bhagavad_gita_sa.jsonl`, plus the staged **Besant/Bhagavan Das 1905** OCR for word-by-word English. Emit draft `content/shlokas/gita-N-M.md` files (start: chapter 2 + chapter 12, ~90 verses) with Source lines citing the staged file + URL. Drafts only — ship-gate unchanged. Also run the remaining queue collection scripts (list in SOURCES-AND-ATTRIBUTION.md) to pull the ~58 metadata-only rows.
7. **UX polish pass** (founder: "very good looking"): walk every screen in expo web + mobile viewport; fix spacing/contrast/empty states; verify Today card, bank list, detail with populated drafts (`pnpm content:generate-shloka-bank -- --allow-draft`).
8. Remaining two §5 web drafts (Lakshmi puja at home, Hanuman Chalisa meaning — Chalisa text itself is PD, quote with Wikisource attribution).
9. Scoped AI on the daily shloka (depth layer; reuse `ask` with a scoping param per plan §3).
10. Monetisation stays parked (founder order) — store items remain in your-actions with the Play 14-day warning.

### Cycle 14 — 12 Aug 2026 — Pool expansion: 40 more verses live — DONE

Four writer batches (ch4, ch5, ch6, ch9/15/18 incl. the charama shloka with side-by-side tradition readings). Writers honestly excluded 5.16, 6.16, 18.63 from the daily pool (backreferencing verses). Two machine-IAST artifacts caught and fixed (4.39 candrabindu, 18.63 ZWNJ). **Approved under the founder blanket directive ("I approve everything") with reviewer name applied — founder should spot-check these 40 files.** Live bank: 80 verses, 69-verse daily pool. Next: Hindi parity for the new 40, Chalisa ITRANS converter, Upanishads.

### Cycle 15 — 12 Aug 2026 — Hindi parity (80/80) + Hanuman Chalisa extracted — DONE

All 80 live verses now carry Hindi verse translations and prose meanings (18.66 three-reading note survives in Hindi). ITRANS→Devanagari converter built; Chalisa extracted with canonical alignment (43 units; split chaupai 36 merged; aarti colophon excluded; nukta + R^i handled; zero Latin leakage). Chalisa lands as draft skeletons pending its translation pass. Hindi added to already-approved files under the founder blanket directive — spot-check welcome.

### Cycle 16 — 12 Aug 2026 — Corpus maximization (founder: "we need them ALL") — IN PROGRESS

**Live bank: 142 units, 3 texts** (Gita 80 · Hanuman Chalisa 43 · Isha 19), 108-verse daily pool, 100% Hindi.

**Corpus ledger toward "all scriptures":**

- Extracted, content pass RUNNING: Kena (36) · Mundaka (65) · Mandukya (13) — generic Wikisource extractor handles 1/2/3-level verse numbering.
- Extracted, awaiting content passes: remaining 620 Gita verses (skeletons with correct Devanagari+IAST) — rolling writer waves next.
- Next extraction queue: Katha, Prashna, Shvetashvatara, Taittiriya, Aitareya (Wikisource subpage texts — extend extractor with subpage fetching); Gayatri/Mahamrityunjaya/shanti mantras; Bhaja Govindam, Shiva Mahimna, Soundarya Lahari, Aditya Hridayam, Lalita Sahasranama (staged ITX — non-commercial terms OK in free mode).
- Epics (Ramayana/Ramcharitmanas/Mahabharata): verse-bank format does not scale to 100k+ verses — bulk reader backed by the existing RAG corpus pipeline is the architecture; design next once Upanishads land.

**Session-limit interruption (12 Aug):** the three Upanishad content-pass writers (Kena, Mundaka 1-2, Mundaka 3 + Mandukya) were terminated by the usage limit (resets 14:30 Europe/London) before writing any files. The 114 extracted skeletons are intact and committed. RELAUNCH per docs/content-pass-runbook.md — fully self-contained, no conversation history needed.

---

## HAND-OFF STATE (12 Aug 2026, end of session) — START HERE, NEW AGENTS

- **Everything is pushed.** `origin/main` = local main; **CI is GREEN** (run for `4137ac3`). Repo renamed to `chettyv/Sandhya` (old URLs redirect; local folder name unchanged).
- **Read in this order:** `CURRENT_SUMMARY.md` (whole picture) → this file (what happened, per cycle) → `docs/content-pass-runbook.md` (how to continue content work, fully self-contained) → `docs/00-your-actions.md` (founder queue — do not do those items for them).
- **Immediate next work:** relaunch the three interrupted Upanishad writer passes per the runbook (Kena / Mundaka 1–2 / Mundaka 3 + Mandukya), then the approval sweep, then the extraction queue in the corpus ledger.
- **Live state:** bank 142 units (Gita 80, Chalisa 43, Isha 19), 108-verse pool, 100% Hindi; free-launch mode; payments/challenge/web-arrival parked with reactivation gates.
- **Standing founder directives** (memory + this log): never stop to ask — log questions in 00-your-actions; corpus maximization; blanket content approval with spot-check flags; branch-per-work-chunk, no agent prefixes.
- **CI parity lessons already fixed — do not regress:** generated `shlokaBank.json` is prettier-ignored; `expo-env.d.ts` is committed; staging RAG gates are guarded; no `as never` on route pushes (use object form).

---

## CYCLE LOG — TWO-STREAM PHASE (plan v3, 12 Aug 2026)

### Cycle 17 — 12 Aug 2026 — STREAM B — Phase 0.5: both correctness fixes — DONE

Plan v3's Phase 0.5, prerequisite for B4. Branch `phase-0.5-correctness-fixes`, merged to main.

- **Fix 1 — tradition preference now RANKS retrieval, never narrows it.** The narrowing existed in three layers and all three are fixed: migration `20260812160000_tradition_ranks_not_narrows.sql` redefines `match_passage_embeddings` (tradition WHERE clause removed; small bounded 0.05 ranking boost for the stated tradition; rights gates untouched) and `cached_answer_sources_are_allowed` (tradition no longer a rights gate; cache keys stay tradition-scoped); the edge function and `packages/rag-pipeline` (which had a copy of the same bug at `index.ts:454`) now stable-rank the stated tradition first AFTER count truncation, so ranking can reorder but never drop. Passage policy extracted to `supabase/functions/_shared/retrieval.ts`; unit-tested by new `scripts/verify-tradition-retrieval.mjs` (in `backend:check`); the pipeline test that pinned the old narrowing now pins retention + ranking. `EDGE_PIPELINE_VERSION` v22, `PIPELINE_VERSION` 0.9.0 — no narrowed cached answer survives.
- **Fix 2 — variation data rendered, not discarded.** `apps/mobile/src/lib/variationNotes.ts` (`describeVariations`) renders the actual `festivals.regional_variations` / `concepts.tradition_variations` jsonb ({note}, keyed regions, strings, arrays; safe fallback), replacing both constant strings in `content.ts`. 6 new tests.
- **Brand rule sweep:** RAG context fence renamed `DHARMA_DAILY_RETRIEVED_CONTEXT` → `SANDHYA_RETRIEVED_CONTEXT` (edge fn + rag-pipeline prompt + verifier pins). Grep of tracked apps/packages/supabase/scripts: clean; committed `apps/web/dist` verified already clean (a stale local pre-rename build had masked this — rebuilt, byte-identical to HEAD).
- **Verified:** typecheck (5 projects), 140 tests (117 rag-pipeline incl. new ranking test, 16 mobile, 7 content-tools), `backend:check` green (verifier pins updated to the new behaviour), lint 0 errors.

**Stream B next (per plan §7 week 1):** B1 — Supabase production project + migrations + EAS env vars (blocked on founder credentials: your-actions #11/SHIP-48H), then B1 device build.

### Cycle 18 — 12 Aug 2026 — STREAM B — B4 started: three-question onboarding, Q1 routes — DONE

Founder directive: placeholders everywhere, keys later, don't stop. Branch `b4-onboarding-q1-routing`.

- **Onboarding is now the plan's three questions**, each visibly routing: **Q1 "What do you do at home?"** — five concrete observances (multi-select; "starting from scratch" exclusive) mapping to content tags via `src/lib/practices.ts`; **Q2** reminder time arms `configureDailyReminder` + persists `notification_time` (device arming remains B6); **Q3** name. The direct sampradāya chips left onboarding (tradition stays settable in Settings); practices are stored separately (`profiles.household_practices`, checked column, in the account data export) and are **never folded into tradition_pref**.
- **The daily rotation now ranks, never narrows** (`rotationSequence`): the full curated pool always cycles; preference-tagged verses are woven through at even density (proportional merge). Previously tags filtered the pool — same anti-pattern as the tradition bug. Live-bank proof, same date: chalisa practice → Gita 2.47; no practices → Chalisa chaupai 10.
- **Placeholder rail confirmed**: the six production env vars gate only `EAS_BUILD_PROFILE=production` (dev/preview/local run keyless on the offline library — browser-verified banner). Root `.env` now lists every `EXPO_PUBLIC_*` key with a PASTE-HERE block. **Note: `.env` carries what look like real Supabase project values — B1's migration push is ready the moment the founder says go; not run unprompted.**
- **Verified:** 31 mobile tests (12 new: practices, rotation), 160 workspace tests, typecheck, lint 0 errors, backend:check; full onboarding → Today flow exercised in the browser (chip exclusivity, reminder chips, name in greeting), zero console errors. `vitest.config.ts` adds the `@/` alias so src modules load under vitest.

**Remaining for B4 done-done:** the second half of Q1's contract — "which commentarial reading appears first on a verse with more than one" — needs verse-level multi-reading content, which doesn't exist in the bank schema yet (single Meaning prose; variation lives inside the prose). That is a content-shape decision at the A/B interface (frozen doc types), so it's a **joint decision, not unilateral**: flagged for Stream A / founder. The routing seam (`householdPractices` in store + profile) is ready to consume it.

### Cycle 19 — 12 Aug 2026 — STREAM B — B5's three v3 mechanics — DONE

Branch `b5-night-session-mechanics`. The plan's three additions to the night session, built ahead of A1 content against the frozen `challenge_session` shape:

- **Stated duration as a pre-open contract:** locked night rows on the challenge overview now show `Opens {date} · ~N min` (duration previously appeared only after unlock; the unlocked row and night screen already carried it).
- **Endowed progress:** the night screen gains a progress bar that **starts in credit** — the shloka block arrives marked complete, badged _"In hand from the start"_ — and the remaining sections mark themselves read as they cross a 60%-viewport read line on scroll (throttled `onScroll` pass-through added to `Page`; pure model in `src/lib/nightProgress.ts`, 7 tests).
- **Explicit end state:** completing a night renders an end card — _"Night N is complete… Night N+1 opens {date} in the evening"_, with final-night copy on the last night — instead of swapping the button for a static line.
- **Verified:** 38 mobile tests, typecheck, lint, backend:check. Live render against a real session still needs the production backend (same position as the Cycle 3 challenge screens) — states and progress logic are unit-tested.

**Stream B remaining, by blocker:** B1/B2 need founder accounts (keys are placeholdered, paste-ready); B3 needs A1 sessions written; B6 needs a device build (B1); B7 needs the domain decision. Next unblocked candidates: audio player scaffold (B5's last piece — needs an expo-audio dependency decision) or reduced-motion/320px acceptance sweep.

### Cycle 20 — 12 Aug 2026 — STREAM B — Acceptance sweep — DONE (no fixes needed)

- **320px pass:** Today, onboarding, shloka bank, verse detail (2.47), reader chapter — zero horizontal overflow on all of them (measured `scrollWidth` vs viewport in the dev server at 320×700 with mobile emulation).
- **Keyboard nav:** onboarding chips render as native `<button type="button">` with correct tab order and a visible focus outline — native Enter/Space activation applies. (The in-app browser's synthesized key events carry an empty `key` and can't activate buttons; verified that is the harness, not the app, by capturing the keydown.)
- **Reduced motion:** nothing to gate — the app uses no `Animated`/reanimated/`LayoutAnimation` anywhere; the only motion is platform spinners.
- **Audio player (B5's last piece) deliberately deferred:** it needs the `expo-audio` dependency + config plugin, and there is no device build to verify the native module against and no audio assets yet (A2). Building it blind risks shipping an unverifiable module into the EAS build. It's the first thing to build once B1 gives a dev build — noted here so it isn't lost.
- **Founder queue updated:** your-actions item 1 now flags that `.env` already carries Supabase-looking values — if that project is real, "apply migrations" is the only remaining step of B1's database half.
