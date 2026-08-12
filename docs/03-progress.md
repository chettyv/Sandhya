# Dharma Daily — Build Progress Log

**Started:** 12 August 2026. Maintained by the build agent; updated at the end of every work cycle.
Inputs: `01-review.md` (repo root), `02-plan.md` v2 (repo root), `CURRENT_SUMMARY.md`, and a direct survey of the code on 12 Aug 2026.

---

## STEP 0 — ORIENTATION (12 Aug 2026)

### What exists and works today

Verified by running it on 12 Aug 2026, not by reading docs:

- **Workspace health:** `pnpm typecheck` passes (5 projects). `pnpm test` passes — 131 tests (116 rag-pipeline, 5 content-tools, 10 mobile). `pnpm backend:check` and `pnpm backend:release-contract` pass.
- **Git state:** everything is committed and pushed. `origin/main` is at `e305c75` ("build Dharma Daily application foundation", 899 files). The review and `CURRENT_SUMMARY.md` describe a pre-commit state (857 staged files, uncommitted work) that no longer exists — the preservation risk they flag is already substantially resolved. `.env` exists locally, is gitignored, and has never been committed (verified via `git log --all -- .env`).
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
5. **CLAUDE.md / build reference vs plan.** CLAUDE.md names `dharma_daily_build_reference.docx` authoritative (five-tab IA, Calendar surfaced, onboarding funnel). Plan v2 cuts the Calendar tab and the funnel. Priority order in CLAUDE.md itself puts the user's direct request (execute plan v2) first. Proceeding per plan v2.
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

- **Product contract:** one-off non-consumable store products named `dd_challenge_<slug_with_underscores>` (store ids can't contain hyphens) map to challenge slugs. Documented in your-actions 1b for store setup.
- **Migration `20260812150000_challenge_purchase_rpc.sql`:** `apply_challenge_purchase` / `revoke_challenge_purchase` — service-role-only SECURITY DEFINER; the only write path into `challenge_participants`. Deleted-account purchases acknowledge without granting; refunds revoke.
- **Webhook:** challenge products branch before subscription state logic — purchase events grant, REFUND revokes, everything else acknowledges; fenced event claiming reused; subscription state never touched by challenge products.
- **Client:** `purchaseChallenge(slug)` in `subscriptions.native.ts` (verified against installed react-native-purchases 10.4.4 API: `getProducts` + `purchaseStoreProduct`, user-cancel handled); web stub returns `unavailable`. Join flow in the overview screen: purchase → "confirming" poll until the webhook grant lands (3s interval, honest slow-path copy after 60s, stops on unmount/joined); web build shows "join in the app" card.
- **Verified:** migration security (55), edge-function syntax (13 files), RevenueCat runtime check, mobile typecheck, lint, backend checks — all pass. **Not verified: a real sandbox purchase** — needs store accounts + RevenueCat products (your-actions 1/1b) and a native build on a device.
- **Launch-critical consequence of IAP, now on the founder list:** Google Play personal accounts require a 12-tester, 14-day closed test before production — the Android closed test must be live by mid-September to make 11 October.

**Next:** web arrival surface scaffold (six §5 pages), then scoped AI on the day's content.

### Cycle 6 — 12 Aug 2026 — Web arrival surface — DONE

- **`apps/web`** — zero-framework static site: `build.mjs` renders `content/web/*.md` through the shared content-tools validator into `dist/` (page shell per design spec, index, `sitemap.xml`, `robots.txt`). Approved-only publishing; `--allow-draft` builds drafts with a visible "DRAFT — do not publish" banner for review. One dependency added: `marked` (markdown → HTML; actively maintained; writing a correct renderer by hand is not 20 lines). Site URL configurable via `WEB_SITE_URL` (placeholder `dharmadaily.app` until the domain exists — your-actions #9).
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
