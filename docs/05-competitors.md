# Sandhya — Competitive Analysis

**Written:** 12 August 2026
**Inputs:** `docs/ref_images/` (102 screenshots, five apps) · `01-review.md` · `02-plan.md` · `CURRENT_SUMMARY.md` · the codebase at HEAD `cec2c94` · primary company research
**Output:** this document, plus a rewritten `02-plan.md`

---

## READ THIS FIRST — three corrections to the brief

**1. The screenshot folders are mislabelled and mixed.** Sorted by wordmark and design system:

| Folder                         | Actually contains                                        |
| ------------------------------ | -------------------------------------------------------- |
| `ref_images/dharmadaily/` (14) | **13 Dharma Daily** + 1 misfiled **Dharmāyana**          |
| `ref_images/sandyhana/` (4)    | **3 Dharmāyana** + 1 misfiled **Diya** onboarding screen |
| `ref_images/diya/` (37)        | **37 Diya** (29 in-app, 8 onboarding)                    |
| `ref_images/bible.ai/` (12)    | 12 bible.ai — clean                                      |
| `ref_images/biblechat/` (35)   | 35 BibleChat — clean                                     |

Net: **Dharma Daily 13 · Dharmāyana 4 · Diya 38 · bible.ai 12 · BibleChat 35.** Dharmāyana is covered by only four screens, all of them the home screen at three scroll positions plus one modal — every drilldown, the pañcāṅga panel itself, and the entire booking funnel are **not captured**. Conclusions about Dharmāyana are bounded accordingly.

**2. One of the two "successful benchmarks" is not successful.** bible.ai has **~102 lifetime ratings across 17 storefronts**, is **iOS-only**, shipped **v1.0.3 on 27 June 2025 and has added zero features since**, draws ~5K monthly web visits **falling 41% MoM**, and has no organic community discussion anywhere. It is a **one-person bootstrapped app that has gone dormant**. ([Apple iTunes Lookup, id 6739915445](https://itunes.apple.com/lookup?id=6739915445&country=us) · [Similarweb](https://www.similarweb.com/website/bible.ai/) · founder statement, [spiritnotes.com/about](https://www.spiritnotes.com/about): _"It's just me here - no big company or investors"_)

This **breaks the brief's central benchmark method.** Two independently successful apps let you separate rule from choice. One success and one failure does not, and no substitute recovers the inference the brief wanted. What the pair _can_ support is weaker but still useful — bible.ai as a **control**: same religion, same category, same era, _excellent_ craft, no distribution mechanism → dormant at 102 ratings. It isolates the variable this project most needs isolated.

**3. Sri Mandir has been added** at the founder's instruction, research-only, no screenshots. It is the actual category leader and its absence from the screenshot set was itself distorting.

Throughout: **[SCREENSHOT]** = observed in the images · **[RESEARCH]** = external source, cited · **[CODE]** = read from the repo · **[INFERENCE]** = my reasoning · **[UNVERIFIED]** = could not determine.

---

# 1. WHAT WE HAVE

Ground truth from the codebase at HEAD `cec2c94`, not from `CURRENT_SUMMARY.md`.

## 1.1 Built and working today

`apps/mobile` is **11,525 lines of TS/TSX across 69 files** — 33 route files, 36 source files. Expo Router, NativeWind, TanStack Query + Zustand.

The single most important architectural fact: **`apps/mobile/src/lib/content.ts` (`fetchLibrary`, lines 55–290) fires six parallel Supabase selects and merges them with a bundled offline catalog**, emitting `source: "fallback" | "partial" | "connected"`. **With no Supabase env vars the app is fully functional on bundled data.** Every content surface goes through one hook.

| Surface                           | Renders                                                                        | Data source                                     |
| --------------------------------- | ------------------------------------------------------------------------------ | ----------------------------------------------- |
| **Today** (440 ln)                | week strip, streak, daily shloka card, reflection, practice row, festival peek | bundled `shlokaBank.json` + `useCuratedContent` |
| **Shloka detail / bank / Reader** | three registers, word-by-word, meaning, chapter reading                        | bundled JSON, **zero network**                  |
| **Calendar** (280 ln)             | streak view + a **plain Gregorian month grid**                                 | local state + festivals filtered by string date |
| **Ask** (453 ln)                  | single-turn RAG chat, SSE streaming, source pills, quota errors                | Edge Function `ask`                             |
| **Explore** (293 ln)              | search + 6 filter chips, client-side `.filter()`                               | bundled catalog                                 |
| **Journey**                       | streak, saved count, practice progress                                         | catalog + Supabase activity                     |

Plus detail routes for festival / practice / concept / deity / reflection, journal, saved, conversations, onboarding (one screen), settings, profile. `apps/admin` is a dependency-free static console. `apps/web` is a 50-line markdown→HTML builder over six approved pages.

## 1.2 Built but not surfaced

**Payments — killed by one boolean.** The entire file `apps/mobile/src/lib/payments.ts` is six lines:

```ts
export const paymentsEnabled = process.env.EXPO_PUBLIC_PAYMENTS_ENABLED === "true";
```

The variable **is not in `.env` at all**. It gates 8+ call sites. Behind it: `subscriptions.native.ts` (153 ln, RevenueCat), `revenuecat-webhook/index.ts` (578 ln, signed webhook with lease fencing and transfer reconciliation), `subscription_status` / `billing_events` tables, a fail-closed `has_plus_access` RPC. **Un-gating costs almost no code — and is hard-blocked by rights.** `docs/SOURCES-AND-ATTRIBUTION.md` requires every shipped source to be re-audited for _commercial_ rights first, and the 43 Hanuman Chalisa units come from sanskritdocuments.org files whose headers say personal-study / non-commercial.

**The challenge system — complete plumbing, zero content.** Four tables, service-role-only `challenge_sessions` behind a `get_challenge_session` RPC with participation and unlock-date checks, `challenges.ts` (262 ln), two screens (281 + 210 ln), a `FeaturedChallengeCard` on Today. **`content/challenges/navratri-2026/` contains exactly three files — `challenge.json`, `_template.md`, `README.md`. Zero of nine nights are written.** The generated catalog migration inserts one challenge row with `is_published: false` and **no session rows at all**, and `fetchFeaturedChallenge()` filters on `is_published`, so the card never renders.

**Also dark:** notifications (`notifications.ts` is a stub returning `enabled: false`; the 277-line native implementation and the 401-line `send-daily-reflections` worker are undeployed), analytics and Sentry (no-op without keys, no keys set), `apps/web` (builds, unhosted, and **every page still says "Dharma Daily"** — `apps/web/dist/index.html:6`).

**Dead code:** `traditionSignals` is computed in both classifier copies (`packages/rag-pipeline/src/classifier.ts:58` and `supabase/functions/_shared/classifier.ts:56`) and **consumed nowhere**. Tradition detection from question text is built and unwired.

## 1.3 The retrieval and content layer, in detail

Two hand-synced implementations: `supabase/functions/ask/index.ts` (**2,284 lines**, production) and `packages/rag-pipeline/src/index.ts` (658 lines, CLI/eval).

The request path: auth → 64KB body / 2,000-char question limits → `consume_ai_rate_limit` (20/min) → **safety gate before quota and before any model call** (`runSafetyGate`, line 320; self-harm / medical / legal-financial → canned redirect with `sources: []`) → tradition resolution against a 9-value allowlist → `consume_ai_message` quota RPC (free = 5/day, atomic, server-side) → retrieval policy → cache → monthly budget reservation with refund on every exit path → OpenAI embedding with dimension assertion → `match_passage_embeddings` → dedupe → policy filter → top 20 → greedy context packing to 12,000 chars → structured-output generation → **citation enforcement** → persist with `retrieved_passage_ids`, `model_used`, `tokens_in`, `tokens_out`, `cost_usd`.

**Rights filtering is real and fails closed.** In SQL (`20260807020000_embedding_model_filter.sql`):

```sql
where pe.content_type = any(content_types)
  and coalesce(c.licence, cs.licence, 'public_domain') = any(allowed_licences)
  and coalesce(cs.can_store, false) = true
  and coalesce(cs.can_embed, false) = true
  and coalesce(cs.can_show_excerpts, false) = true
  and (tradition_filter is null or tradition_filter = 'general'
       or coalesce(c.tradition, t.tradition_primary,'general') in ('general', tradition_filter))
```

A missing tracker row is treated as an uncleared source, not an implicitly public one (`20260806060000_rag_rights_fail_closed.sql`). Licence tier is derived from plan: free users get `public_domain` + `original` only.

**Citation validation is implemented at three independent layers.** It is the most substantial thing in the repo, and §1.3's closing paragraph explains why it currently guards almost nothing.

1. **Edge Function** (`ask/index.ts:1856`) — `normalizeGeneratedAnswer` drops any `source.passage_id` not in the retrieved map, **overwrites `title` and `location` from the DB row** so the model cannot invent a citation label, and if that empties `sources`, replaces the whole answer with `uncitedGeneratedAnswer()`.
2. **Database** — `rag_response_citations_match_retrieved_ids(response jsonb, retrieved_ids uuid[])` behind CHECK constraints on `cached_answers` and `messages`.
3. **Client** (`askDharma.ts:180`) — `citationsBacked` rejects any response whose sources are not all in `retrievedPassageIds`.

Plus rights re-validation on cache read (`cachedAnswerSourcesAreAllowed()`), so a cached answer whose source later loses clearance is not served.

**Three findings that matter more than the above:**

- **The tradition filter narrows rather than diversifies.** `allowedTraditions = new Set(["general", policy.traditionFilter])` (line 1972) means a user who states a sampradāya is **structurally prevented from retrieving other traditions' readings**. The system prompt asks the model to "mention variation where relevant" — over a context the retrieval layer has already stripped of variation. This is the exact inverse of the stated product rule and of the one thing no competitor does.
- **The app throws away its own variation data.** `content.ts:139` reads `festivals.regional_variations` from Supabase and substitutes a **constant string**: `"Dates and observances can vary by region, tradition, and local calendar."` Same at `:208` for `concepts.tradition_variations`. The schema models variation; the UI renders boilerplate regardless of content.
- **Two filter dimensions are structurally unreachable.** `content_types` permits `commentary` and `combined`, but `ingest-prepared.ts:337` hardcodes `content_type: "translation"` and `commentary_id: null`, and the `commentaries` table is never written by any code path. `languages` is threaded through the RPC, the policy, the cache key and the TS filter — and is set to `null` at the only call site.

**Serving a new content type:** the chunker is generic (any `.md`/`.txt`/`.html`/`.jsonl` with frontmatter → 400-token chunks). The schema is Gita-shaped: `texts.category` is a CHECK enum of `shruti|smriti|itihasa|purana|agama|modern_commentary` with no home for a festival explainer, and every chunk needs a `(text_id, verse_number)` key. **[INFERENCE]** ~1 migration + 3 file edits to serve prose explainers — one to two days.

**Does any of it run today? No.** `OPENAI_API_KEY` and `ANTHROPIC_API_KEY` are empty; `DEEPSEEK_API_KEY` is absent; `LLM_PROVIDER` is unset so `readEnv()` defaults to `"deepseek"` while `LLM_DEFAULT_MODEL=claude-haiku-4-5` — **a live provider/model mismatch that would throw on first request even with keys**. And `requiredEnv("OPENAI_API_KEY")` throws before anything else runs.

**Worse: the corpus cannot be ingested.** `docs/source_inventory_template.csv` has **432 rows, of which exactly one is `approved`** — `sandhya_grounded_learning_guide`, the project's own editorial guide. `assertProductionRights` refuses everything else. The checked-in canonical prepared corpus is one stale line pointing at `content/original/dharma-daily-grounded-learning.md`. **Even with keys, Ask Dharma would return `noSourceAnswer()` for every real question.** Meanwhile 474 MB of prepared, chunked `rag-corpus.jsonl` sits on disk, legally un-ingestable.

## 1.4 Content: quantity and review state

`content/` holds **1,517 files**. The verse bank:

| Text            | Files                    | **Approved (live)** | In daily pool |
| --------------- | ------------------------ | ------------------- | ------------- |
| Bhagavad Gita   | 700                      | **80**              | 69            |
| Hanuman Chalisa | 43                       | **43**              | 29            |
| Isha Upanishad  | 19                       | **19**              | 10            |
| Kena            | 36                       | **0**               | —             |
| Mundaka         | 65                       | **0**               | —             |
| Mandukya        | 13                       | **0**               | 0             |
| **Total**       | **877** (incl. template) | **142**             | **108**       |

**735 of 877 are extraction skeletons** — correct Devanagari, machine IAST, nothing else. All 142 approved files name `reviewed_by: Vaibhav Chetty`; `docs/03-progress.md` Cycle 14 records that 40 of them were _"approved under the founder blanket directive ('I approve everything') with reviewer name applied."_ **Treat "approved" as self-attested by one non-specialist, not as scholarly review.**

Provenance is genuinely good: every shloka carries `source_url` and `copyright_status`. Hosts: 833 `sa.wikisource.org`, 43 `sanskritdocuments.org`. The 43 Chalisa units carry the explicit note _"personal-study terms — free-launch use with attribution; commercial use requires permission."_

The validator (`packages/content-tools/src/index.ts`, 415 ln) enforces four doc types. The `shloka` type requires all five labels — **Devanagari / IAST / Say it / Meaning / Source** — with a Devanagari-codepoint check. `challenge_session` requires six sections in fixed order and **must set `can_embed: false`**, so paid content is structurally barred from the RAG corpus. That is careful design.

**Languages:** `tradition_primary: general` on **all 877** — zero sectarian tagging in the verse bank. 152 files carry a `Meaning (hi)` section. But `src/lib/i18n.ts` is a single English object of ~55 keys with **no Hindi dictionary at all** — the `contentLanguage` switch only selects verse translation and meaning. Every label, button, empty state and error is English-only.

## 1.5 Calendar and regional variation — direct answer

**There is no calendar computation anywhere in this repository. Zero. Festival dates are hardcoded literals.**

Grep results across `apps/`, `packages/`, `supabase/`, `content/`:

- `amanta`, `purnimanta`, `nakshatra`, `muhurta` — **0 hits anywhere**
- `panchang` — 2 hits, both UI copy in `(tabs)/calendar.tsx:242-243`: _"Sandhya does not calculate local timings yet; check a local panchang or temple…"_
- `tithi` — 4 hits, all plumbing. `festivals.tithi_rule` is a `text` column whose actual stored values are prose: `'Calendar dates require reviewed calendar data; this row is an explainer.'`
- `diaspora` — 0 hits in code or content

`buildMonth(year, month)` in `calendar.tsx:17` is a plain Gregorian grid. **21 festival explainers exist; exactly 4 carry a date** — Guru Purnima `2026-07-29`, Raksha Bandhan `2026-08-28`, Janmashtami `2026-09-04`, Diwali `2026-11-08` — **one 2026 date each, no recurrence rule**. The other 17 have `'{}'::date[]`.

**Consequences:** Maha Shivaratri, Holi, Navaratri, Durga Puja and 13 others **never appear on the calendar at all**. The four that do **expire after 2026** — no code path produces a 2027 date. Today's "upcoming festival" peek renders nothing after 8 Nov 2026.

Three variation fields exist (`regional_variations jsonb`, `name_variants text[]`, `traditions text[]`). Every one of the 21 rows has `traditions = ARRAY['general']`, three have any `name_variants`, and `regional_variations` is always a single boilerplate note — which the app then discards anyway (§1.3).

**Verdict: a festival-calendar product is expensive and greenfield here, not an extension.** It needs a tithi/nakṣatra engine or a licensed pañcāṅga feed, amānta/pūrṇimānta resolution, sunrise-dependent tithi rules with per-location astronomy, a region/sampradāya dimension on content _and_ profile, and a recurrence model. The one asset we have is that **the UI already says the honest thing rather than faking a date** — which, as §4 shows, is more than any competitor manages.

## 1.6 Schema, tests, deployment

**55 migrations, 35 tables, `enable row level security` on all 35.** Every table named in the build reference exists; nothing is missing. `commentaries` exists and is never written.

**16 test files, 138 cases** — but **121 of 138 are the RAG pipeline package**. The 11,525-line mobile app has **2 test files / ~101 lines**. **There is no test file for `supabase/functions/ask/index.ts`, the 2,284-line production RAG path.**

CI is genuinely strong: 17 `verify-*.mjs` gates, content validation, shloka-bank freshness check, migration security gate, typecheck, lint, format, test, secretlint, commitlint.

**Nothing is deployed.** No hosting config, no deploy workflow. `apps/web/dist/` and `apps/mobile/dist*` are committed static builds, unhosted. Migrations have never been confirmed applied to any project. `app.config.js` will hard-throw on a production build for six missing env vars. **The only channel that works today is Expo Go**, where notifications and purchases are stubs by design.

## 1.7 Claims vs code — the gap list

`docs/03-progress.md` is largely honest and contains its own debunking. `CURRENT_SUMMARY.md` is where the overstatement lives.

| Claim                                                         | Reality                                                                                                                                                                    |
| ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| "72 migrations" (also "70" in progress, "72" in your-actions) | **55.** `ls supabase/migrations/*.sql \| wc -l`                                                                                                                            |
| "Challenge system… all built, **parked** with payments"       | Plumbing built. **0 of 9 nights written**, catalog inserts zero session rows, `is_published: false`. It is dead because nothing was written, not because payments are off. |
| "Language preference (en/hi) applies **everywhere**"          | Verse translation and meaning only. **No Hindi UI dictionary exists.**                                                                                                     |
| "100% Hindi coverage"                                         | True of the 142 live verses. False of the product.                                                                                                                         |
| "the festival library now includes 21 explainers"             | 17 have no date and never surface on the Calendar; the 4 that do expire 8 Nov 2026.                                                                                        |
| "Ask Dharma… live once Supabase + AI keys exist"              | Understates by an order of magnitude. **1 of 432 sources approved.** Keys are necessary, not sufficient.                                                                   |
| "883 content files validating"                                | Plausible — and it hides that **735 of 877 shlokas are `draft` with empty `reviewed_by`**. "Draft" is a legal state, so skeletons validate.                                |
| "138 tests" as engineering health                             | 121 of 138 are one package. The production `ask` function has **zero** direct tests.                                                                                       |
| "All browser-verified"                                        | No E2E, no screenshot tests, no Playwright/Detox anywhere. A claim about a human session, not a gate.                                                                      |
| "awaiting founder infrastructure setup (Supabase, EAS)"       | `.env` already has a working Supabase dev project + both keys. The real blockers are **AI keys and source-rights clearances**.                                             |

**Code the summary omits:**

1. **The rename is incomplete, and a competitor is now named Dharma Daily.** `apps/mobile/app/subscription.tsx:66` still shows users the string **"Dharma Daily"**. All nine files in `apps/web/dist/` carry it in `<title>`. `providers.ts:322` and `ask/index.ts` fence retrieved context with `<<<DHARMA_DAILY_RETRIEVED_CONTEXT`. `packages/rag-pipeline/dist/index.js:405` says _"the approved Dharma Daily corpus"_ **in a user-visible answer string**. Given §4.3, this is a product risk, not a cosmetic one.
2. **A live provider/model misconfiguration** (§1.3) mentioned in no document.
3. **The tradition filter narrows** — the opposite of the stated rule. Surfaced nowhere.
4. **474 MB of prepared, legally un-ingestable corpus** — the single largest sunk cost in the project, appearing in no summary.

**Blunt bottom line.** Real and load-bearing: the three-layer citation architecture, the rights fail-closed SQL, the 55-migration RLS/billing/quota backend, the CI gate set, and **142 hand-written trilingual verse entries with honest tradition notes.** That last item is the only thing a competitor cannot trivially clone. Vapour or near-vapour: the challenge product, the calendar, Hindi localisation, the payments rail, the web and admin apps, and Ask Dharma.

---

# 2. COMPANY RESEARCH

## 2.1 Dharma Daily

**Identity:** App Store id `6759189492`, individual developer **Ayush Bajpai**. No legal entity found. **[RESEARCH]** [App Store](https://apps.apple.com/us/app/dharma-daily/id6759189492)

**The decisive artifact: the bundle identifier is `app.replit.dharmadaily`** — the default namespace Replit assigns to agent-exported apps. **[RESEARCH]** [iTunes Lookup](https://itunes.apple.com/lookup?id=6759189492&country=us)

|              |                                                                                                                                                                                                                                                       |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Version      | **1.0**, released **6 Apr 2026**. `currentVersionReleaseDate` = `releaseDate`. **Never updated.**                                                                                                                                                     |
| Ratings      | **0**, in all ten storefronts tested. iOS only; no Play listing (four package IDs probed, all 404).                                                                                                                                                   |
| Funding      | None. No Product Hunt, no press coverage of any kind, no accelerator.                                                                                                                                                                                 |
| Pricing      | Site advertises **Dharma Pro $49.99/yr**. Apple reports **`hasInAppPurchases: false` in US, UK and India**. It cannot take money.                                                                                                                     |
| Distribution | None. Website is a **free Framer subdomain**; footer social icons point at `instagram.com`, `linkedin.com`, `x.com` — the platform homepages, not accounts. Support address `hello@dharmadaily.app` resolves to **an unrelated Buddhist newsletter**. |
| Trajectory   | Nothing to excavate — one version, `releaseNotes: null`. The developer shipped an unrelated photo app on 24 Jul 2026 and **updated it on 10 Aug 2026, two days before this research**.                                                                |

**Verified content defects.** Its festival list shows **Krishna Janmashtami "August 14"** and **Ganesh Chaturthi "August 28"**; the true 2026 dates are **4 September** and **14 September** — wrong by **21 and 17 days**. Store assets separately show Maha Shivaratri "February 27" and Holi "March 14" — _2025_ dates. Its own store screenshot mislabels **BG 6.23 as "Bhagavad Gita 8.23"**. Six of seven store screenshots are **Google Gemini generations** (filenames literally `Gemini_Generated_Image_*`, sparkle watermark visible) containing hallucinated chapter titles ("Chapter 5: Antiiatly Ryyne") and gibberish Mahābhārata body text. The App Store privacy label declares **"Data Not Collected"** while its own privacy policy lists email, chat conversations and analytics — a mis-declared label and a review-compliance exposure. **[RESEARCH]** [Drik Panchang 2026](https://www.drikpanchang.com/calendars/indian/indiancalendar.html?year=2026), cross-checked against [SmartPuja](https://www.smartpuja.com/blog/krishna-janmashtami-2026-date-puja-muhurat/) and [CalendarLabs](https://www.calendarlabs.com/holidays/india/ganesh-chaturthi.php)

**No user feedback exists.** Zero reviews means **zero signal about demand** — only about build quality. The six website testimonials under _"Loved by Hindus worldwide"_ cannot be real; two are near-verbatim duplicates.

## 2.2 Dharmāyana

**Identity:** _Dharmayana - Daily Hindu App_, `in.dharmayana.android` / iOS `6474740467`, **OIT Innovations Private Limited**, Bengaluru (CIN U62091KA2023PTC179794). "OIT" = "Out of India Theory". **[RESEARCH]** [Play](https://play.google.com/store/apps/details?id=in.dharmayana.android) · [TheCompanyCheck](https://www.thecompanycheck.com/company/oit-innovations-private-limited/U62091KA2023PTC179794)

|                |                                                                                                                                                                                                                                                                                                                       |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Founded        | Company 13 Oct 2023; app shipped 21 Dec 2023 (Android)                                                                                                                                                                                                                                                                |
| Founders       | **Mohan Maribettegowda** (Amazon, Microsoft, Yahoo, Ola, Halodoc) and **Abhilash Ramakrishna** (Halodoc)                                                                                                                                                                                                              |
| Team           | ~23 **[3P EST — RocketReach, low-moderate reliability]**                                                                                                                                                                                                                                                              |
| **Maintained** | **Emphatically yes** — Android v6.9.2 on 7 Aug 2026, **16 releases in 9 months**. (AppBrain's "last update December 2023" is stale crawler data; disregard it.)                                                                                                                                                       |
| Funding        | **$500K pre-seed**, closed Jan 2025, announced 29 Jul 2025 via a single **ANI paid press release** syndicated verbatim to seven outlets. **Investors named only by former employer** — no individual is on the public record. Swarajya, writing independently and earlier, calls it a **"family and friends round"**. |
| Scale          | Play badge 500,000+; Play `realInstalls` **865,466**; Play **4.537 / 6,456 ratings**; iOS India 4.70/1,137, US 4.90/87, UK 38, Canada 25 — **~88% of iOS ratings across the four storefronts checked are Indian**                                                                                                     |
| Revenue        | **Could not determine.** Both stores report **no IAP** (`offersIAP: False`) — payments run off-platform under the real-world-services carve-out, so **Sensor Tower / Appfigures are structurally blind to this business.** Anyone citing "$0 revenue" from those tools is wrong.                                      |

**The big finding: a completed pivot.** The Play summary line now reads _"Best Astrology App & Online Pooja, Online Pandit Booking | Daily Horoscope App"_. Reconstructed from store metadata and version-stamped reviews: **v1.x pañcāṅga utility → v2–3.x prayers and content → Kundli, "our first monetised feature" → v4–6.x live astrologer consults, puja booking, Ayurveda, "Dharmik Counsellor."** A second app, **Dharmayana Mitra**, recruits Jyotishis, Pujaris and temple managers — this is a two-sided marketplace now. **[RESEARCH]** [Medium design case study](https://medium.com/@kushsinghkohli02/dharmayana-journey-from-0-to-150k-downloads-54825818f2aa) · [Swarajya](https://swarajyamag.com/tech/dharmayana-bridging-tradition-andtechnology)

**Distribution: WhatsApp virality by design.** The designer's own case study states Social Share was built as _"WhatsApp-optimized image sharing, based on observing user behavior"_ — users were already screenshotting and forwarding pañcāṅga content. Web is a footnote (~10K visits/month, −7% MoM, **12-second average visit**).

**Temple relationships are supply-side only.** Swarajya names Sringeri Sharada Peetham and one local Hanuman temple as ritual-fulfilment counterparties. No temple pushes the app to devotees. **There is no Hindu analogue to centralised church software distribution**, and Dharmāyana has not found one.

**User complaints — the accuracy cluster is the useful part:**

- **DST failure abroad.** 3★ US: _"the time in your panchangam is off when compared to the drik. You are off by at least an hour… you are not considering the daylight savings time in the USA."_ For a muhūrta product this is disqualifying in the diaspora — every auspicious window is wrong by an hour for ~8 months a year.
- **A ~30-minute yamagaṇḍa offset** in India (3★, 31 Dec 2025).
- **Ṛtu naming wrong for South India** (3★, 21 Mar 2025: _"season name is different from south to your app"_).
- **AI deity art with an iconographic error** — 5★ but critical: _"on Ganesha his forehead mark is wrong — it's supposed to be a Trishik but it had four prongs instead of three."_ A devotee counted the prongs and filed it as a defect.
- **Transliteration desynced from recited audio** (3★: _"instead of 'N' there is 'M' or 'T'"_ — anusvāra/retroflex handling).
- **Diaspora learning gap** (3★ US): _"I want to learn them… as someone who is new and has no Guru or temple near them, I need the FULL phonetic versions… I'd also appreciate a way to slow down the audio speed."_
- **Amānta/pūrṇimānta appears handled correctly** — company/press-attested via Swarajya, **no user complaint found**. Treat as probable, not independently verified.

1★ outnumbers 2★ **2:1** — the signature of transactional failure, not buggy software: puja videos filmed at a different temple than advertised, "handwritten" kundalis that are software-generated, astrologer no-shows.

**Zero community footprint.** No Reddit, Quora or forum discussion at 865K installs.

## 2.3 Diya

**Identity:** _Diya — Daily Hindu Practice_, `com.houdiniapps.diya`, id 6774474282, **Houdini Apps, LLC** — _"a small Indian American team working across New Jersey and California"_. **No founder is named anywhere.** Single shared inbox `team@trydiya.com`. Diya is the developer account's only app. **[RESEARCH]** [App Store](https://apps.apple.com/us/app/diya-daily-hindu-practice/id6774474282) · [trydiya.com/about](https://www.trydiya.com/about)

**The single most important fact: it is ten weeks old.** Released **2 June 2026**; domain `trydiya.com` registered **29 May 2026**, four days before launch; Wayback holds **zero** snapshots. **There is no trajectory to study and no pivot** — it launched Hindu and has only added Hindu features since. **[RESEARCH]** Verisign RDAP; Wayback CDX (empty)

|                     |                                                                                                                                                                                                                                                                                     |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Maintained          | **Aggressively** — v1.0.9 on 5 Aug 2026, **8 updates in 9 weeks**, purely additive                                                                                                                                                                                                  |
| Ratings             | **154 global · US 146 (4.82) · India 2 · Canada 1 (1.0) · UK/AU 0.** **95% US.**                                                                                                                                                                                                    |
| Funding             | **No public record.** Bootstrapping is a plausible inference (Namecheap domain, no entity page, one-app account), not a company statement.                                                                                                                                          |
| Downloads / revenue | **No estimator has a public page.** I decline to state a number.                                                                                                                                                                                                                    |
| Platform            | **iOS only** — confirmed by the company. A hard ceiling on India and much of the diaspora.                                                                                                                                                                                          |
| Pricing             | Six live SKUs (active price testing): $4.99/$6.99 monthly, $24.99/$34.99 yearly. **India is not PPP-adjusted at all** — ₹499/mo ≈ $5.70 and ₹2,499/yr ≈ $28.50 sit _between_ the two US test prices rather than below them, i.e. an Indian user pays roughly what an American does. |

**Distribution: paid social, and a Diwali SEO bet.** The privacy policy documents the **Meta/Facebook SDK** for ad attribution — you do not integrate it unless you buy Meta ads (spend inferred, intent documented). Their sitemap holds 70 URLs, of which 59 are content — 20 festivals, 13 prayers/mantras, 10 scripture, 10 rituals, 6 practice guides — **every one with a `lastmod` of 29–31 July 2026**, i.e. the whole content site published in a three-day bulk launch. Titles are long-tail diaspora intent: _"How to practice Hinduism when you do not live near a temple"_, _"Ekadashi fasting US date guide"_, _"Can you do puja without a priest"_. **[RESEARCH]** [sitemap](https://www.trydiya.com/sitemap.xml) · [privacy policy](https://www.trydiya.com/privacy)

**Their inferred stack, from the privacy policy — directly useful:** RevenueCat, PostHog, Supabase, Anthropic or OpenAI, Meta SDK, YouTube API. **That is our stack.**

**The audio catalog, from their own published sources page:** 48 items — **7 owned and bundled, 12 devotional via embedded YouTube, 29 secular raga/instrumental via embedded YouTube**. So **41 of 48 play through YouTube's embedded player**, which they explicitly disclaim: _"Playback remains subject to YouTube's availability, terms, and privacy policy."_ A $4.99–6.99/month subscription whose audio library is 85% embedded YouTube is exposed to link rot, geo-blocking and takedowns. Separately, the store advertises **"50+ devotional tracks"** — reachable only by counting the 29 secular wellness tracks as devotional. **[RESEARCH]** [trydiya.com/sources](https://www.trydiya.com/sources)

**Worth recording, because it sets the bar:** their published [editorial standards](https://www.trydiya.com/editorial-standards) and [sources & methodology](https://www.trydiya.com/sources-and-methodology) are unusually rigorous and converge almost line-for-line with our own `CLAUDE.md`: _"You should never have to guess whether one tradition is being presented as all of Hinduism"_; _"We name meaningful differences instead of smoothing them into one universal answer"_; _"A Sanskrit text, an English translation, a commentary, and Diya's plain-language explanation are not the same thing. We label those layers."_ **§4.3 shows none of that reaches the product.**

**User feedback: there is none to mine.** Across 18 storefronts × 3 sort orders × 3 pages, Apple's RSS returns **9 unique written reviews, all 5-star**. Low ratings exist (Canada averages 1.0 over one rating) but are **star-only with no text**. Requesting 2- and 3-star mining returns nothing — this is a **data absence, not evidence of satisfaction**. The 5★ reviews do characterise the ICP sharply: _"especially helpful being an American Hindu who doesn't read Sanskrit or speak Hindi"_; _"I'm 22 and admittedly addicted to my phone… I remember growing up seeing stuff like this for other religions and wishing we had our own."_

## 2.4 BibleChat

**Identity disambiguation matters.** Three products are called "Bible Chat". The target is **Book Vitals Inc. / Soulstream** (Romanian founders), App Store id 6448849666, `com.basmo.BibleChat`. Not `biblechat.ai` (which 302-redirects to CrossTalk, Manifest Automation, ~100K users), and not the Gloo-acquired "Faith Assistant".

|            |                                                                                                                                                                         |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Founders   | **Laurențiu-Victor Bălașa** (CEO), **Marius Iordache** (CTO). EY Entrepreneur of the Year Romania 2025.                                                                 |
| Team       | **Sources disagree: 20 / 30 / ~40.** HQ conflicting: Galați vs Bucharest+Cluj.                                                                                          |
| Founded    | Contested. Best reading: company 2019 as Book Vitals; pivot late 2022/early 2023; **public launch mid-2023**.                                                           |
| Funding    | €475K seed (2019, Early Game Ventures) → undisclosed 2024 → **$14M Series A, 19–20 Feb 2025, True Ventures lead**. VC-funded, no accelerator. Valuation **UNVERIFIED**. |
| Maintained | Aggressively — iOS v4.4.8 ~7 Aug 2026; ~30 Android releases Mar–Aug 2026.                                                                                               |

**The origin story is a pivot from a dead product.** The founders exited T-Me Studios (Android themes; ~700M downloads) to Mocha in 2021, then built **Basmo/Book Vitals**, a reading-habit app that _"struggled to gain traction; funds exhausted by 2022"_ per their own investor's portfolio page. Noticing the Bible was among the most-read books in their reading app, they rebuilt on the same infrastructure. **[RESEARCH]** [Early Game Ventures](https://earlygame.vc/portfolio/biblechat) · [start-up.ro](https://start-up.ro/bible-chat-marius-iordache-laurentiu-balasa/)

### The revenue number in our current plan is wrong

`02-plan.md` Appendix A cites **"$15M annualised"**. The sources:

| Figure                                                                                                              | Source                                                                                             |
| ------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| **$6.3M total net revenue since 2023 launch**, of which **$750K net in March 2025**; **>95% from the US App Store** | **[3P EST — Appfigures, Apr 2025]** [link](https://appfigures.com/resources/insights/20250418?f=5) |
| **$15M annualized** at Series A                                                                                     | **[COMPANY/PRESS, Feb 2025]**                                                                      |
| Romanian statutory filings: **2023 revenue 5.4M lei (~$1.2M), net loss 180,755 lei, debt 10.5M lei**                | **[PRESS — Economedia, citing filings]**                                                           |

These cannot both describe the same thing. **[INFERENCE]** Reconcilable only if "annualized" = peak-month gross × 12. **On that reading the $15M is a run-rate extrapolation from a single best month, not achieved revenue.** Use $6.3M cumulative net / $750K peak month as the defensible figure. **This corrects our plan.**

### And the growth channel in our plan is wrong

`02-plan.md` §5 says Bible Chat grew via _"Apple Search Ads across ~2,000 keywords, outspending competitors 2:1."_ **I found no evidence of ad-network spend** — no ad-library data, no MMP data, no spend estimate from any source. (Caveat: ad-library data was not reachable from this environment, so this is absence of evidence, weakly held.)

**What I did find, documented on their own site:** the **BibleChat Creator Programme** — currently UK-only, **200+ creators engaged**, paid **£150/month base regardless of performance** plus **£13–£1,060 view-based bonuses**, typical creator earning ~£500/month. Requirements include filming on **new dedicated accounts, not existing ones**. **[COMPANY]** [creators.thebiblechat.com](https://creators.thebiblechat.com/)

**[INFERENCE]** This is **manufactured organic** — a paid content farm dressed as UGC, and the "new dedicated accounts" rule is the tell: it produces an army of seemingly independent testimonial accounts. At 200 × ~£500 ≈ **£100K/month (~$1.5M/yr)** in content spend, entirely off the ad-network books — which is why the founders can honestly describe growth as word-of-mouth. Corroborating: **110M+ views across 500+ TikTok videos, one at 94M views**, format being before/after transformation and _"I replaced social media with…"_, positioning the app as an antidote to social-media addiction. Meanwhile the website carries **~61K visits over three months, −24% MoM**, ranking almost entirely for its own brand name — **there is no SEO moat**. **[3P EST — Similarweb]**

**Pricing history shows a defensive restructure.** Sept 2024: weekly $4.99 / monthly $12.99 / 6-month $29.99 / yearly $59.99 / lifetime $99.99. Aug 2026 adds **"Standard Weekly $2.99", "Lite Monthly $4.99", "Lite Yearly $19.99"** — cheap down-sell tiers that did not exist before. India pricing is incoherent (the same SKU name at both ₹99 and ₹599; a top yearly at ₹5,900 ≈ $68, _above_ the US price) — **[INFERENCE]** the visible residue of heavy uncontrolled paywall A/B testing. India is not a real market for them: 2,400 iOS ratings against 356K US.

**AI has been demoted.** The current US listing leads with _"Your daily plan, made personal — meditations, study plans, Bible stories, and affirmations"_; AI chat is a mid-list bullet. The latest release is **"Catholic Living"** (Rosary, novenas, Lectio Divina, daily Mass readings) **plus "safer groups: report or block members, admin-approved re-joins"** — **[INFERENCE]** the safety tooling implies the community feature generated real abuse.

**What users say** (methodological caveat: a 4.9★ average from an aggressively-prompted app is not a sentiment signal; these come from aggregators, so themes are solid and volume is unknown):

- **Billing shock** — _"$60 charged after selecting a $4 trial option"_; _"I tried to cancel right away but I still got charged for an entire year."_
- **Moral objection to paywalling scripture** — _"Christ wanted his word to reach everyone and never once had he thought of charging others."_ Generic pricing fixes cannot solve this.
- **Doctrinal betrayal from both directions** — one cluster says the AI dodges controversial topics _"to not upset anyone"_; another says its answers are _"politically motivated."_
- **The 5-question/day free cap is the #1 friction point.**
- **Lost chat history after updates**, with no recovery — users treated conversations as a spiritual journal.
- **AI-generated customer support** — _"All responses to your questions are ChatGPT"_, a 3-second reply to a detailed personal concern.
- **Citation hallucination, caught in testing** — the AI cited **Philippians 4:8** for text that was actually **Romans 12:2**. **[3P, hands-on]** [warmpeach.com](https://www.warmpeach.com/blog/best-bible-chat-apps)
- **Crisis-handling gap** — _"Depression-related prompts don't consistently surface suicide hotlines"_ — material given the founder positions the app as a mental-health tool.
- **Formally studied theological bias.** The **Bible Society**, at a **University of Cambridge Faculty of Divinity conference in January 2026**, presented _"AI, Bible Apps and Theological Bias"_, examining Bible Chat by name and finding these chatbots _"frequently promote a narrow theological outlook, most commonly reflecting US evangelical approaches,"_ framing one interpretation as definitive _"with little reference to historical, sacramental or tradition-based readings."_ **[PRESS]** [Christian Today](https://www.christiantoday.com/news/concerns-raised-over-theological-bias-in-ai-bible-chatbots)

**[INFERENCE]** That Cambridge finding is the single most transferable warning in this document. An AI that flattens interpretive tradition is not merely inaccurate — it becomes an academically documented liability. Sandhya's `tradition_filter` currently _narrows_ retrieval to one tradition (§1.3), which is the same failure mode with a different mechanism.

## 2.5 bible.ai

**Identity:** _bible.ai — Chat about Anything_, id 6739915445, **Bible Ai Pty Ltd** (ABN 76 670 500 660, Gold Coast QLD, Australia). Founder & CEO **Leio McLaren**. **[RESEARCH]** [ABN Lookup](https://abr.business.gov.au/ABN/View?abn=76670500660)

**Team: effectively one person.** The founder's sibling product site states it plainly: _"It's just me here - no big company or investors."_ **[COMPANY]** [spiritnotes.com/about](https://www.spiritnotes.com/about) No employee is named anywhere.

**Funding: none found.** No Crunchbase/PitchBook profile, no accelerator. The press page lists **`invest@bible.ai`** as a contact — **[INFERENCE]** an open invest@ inbox is what pre-funding companies do.

**The pivot, and the features dropped.** The 2023 web beta is still live at [archive.bible.ai](https://archive.bible.ai): a **free** web tool supporting **English and Brazilian Portuguese**. The Feb 2025 iOS app is **English-only** (`languageCodesISO2A: ['EN']`) and **paid**. Two things were silently amputated: **Portuguese**, and **free unlimited access**.

**Release archaeology — there is nothing to excavate, and that is the finding:**

| Version      | Date            | Notes                                             |
| ------------ | --------------- | ------------------------------------------------- |
| 0.95 – 1.0.2 | Jan–Feb 2025    | launch + "bug fixes and performance improvements" |
| **1.0.3**    | **27 Jun 2025** | "bug fixes and performance improvements"          |

**Not one feature has been added since launch.** Meanwhile the founder's other app, **Spirit Notes**, shipped a **full v2.0 redesign on 11 August 2026 — the day before this research** — and holds **562 ratings**, 5.5× bible.ai's base, with a continuous changelog from 2021. **[INFERENCE]** bible.ai is in maintenance/dormancy; the operator's attention went elsewhere.

**Scale:** ~102 ratings across 17 storefronts; **US 55 (4.29), Australia 31 (4.74)** — 30% of all ratings are the home market. `userRatingCount == userRatingCountForCurrentVersion` in every market, i.e. **the rating base has stopped growing**. India, South Africa, Nigeria, Kenya, Ireland, Mexico, Indonesia, Malaysia: **zero ratings**.

**Downloads and revenue: could not determine.** Appfigures 404s; Sensor Tower and Apptopia surface nothing. Order of magnitude is four to five figures, not six or seven — **but I will not put a number in a strategy doc.**

**Pricing:** US $12.99/mo, $89.99/yr; UK £9.99/£79.99; **India ₹1,299/mo, ₹9,900/yr ≈ $14.80/mo — _higher_ than the US in USD**, with zero PPP adjustment. India has **zero ratings**. **[INFERENCE]** They did not attempt India, and the pricing is why.

**Distribution:** a Christian-media PR push through **Kingdom PR** via Christian Newswire (Feb 2025), syndicated to Insights, MissionsBox, Vision; **one NBC segment**; the founder's own Instagram evangelism account. Similarweb attributes primary web traffic to **Display advertising**. **No church or institutional distribution found.**

**SEO surface:** global rank #1,741,308, **down from #1,251,961 three months prior**; ~5K visits/month, **−41% MoM**; **19-second average visit**; **75 tracked keywords**, all navigational. There is no blog, no content marketing, no scripture-topic landing pages. **[3P EST — Similarweb; noisy at this volume, directional only]**

**What users say** (~30 written reviews; themes real, thinly evidenced):

- **Theological rejection of the premise** (1★): _"It tries to take the place of the Holy Spirit… If you have questions, ask a pastor at your church."_
- **Refusing to take a moral position** (1★, AU): _"we tested it with some questions about morality and sin and it didn't give direct answers but rather affirm two sides to be true."_
- **Sycophancy read as heresy** (1★, AU, titled _"THIS IS SATAN TOOL…"_): the user offered a universalist framing and **the AI agreed and affirmed it**.
- **Tone overwhelming study utility** (3★): _"The algorithm needs to know when to shut up and when to ask more."_
- **Data control missing + silent loss** (3★): _"has no option to delete unwanted conversations… I also found that my past conversations have been deleted!"_
- **Reverence in typography** (3★): _"the developers should have at least made sure to have correct grammar and capitalize any words meaning 'God'."_ — a churn event caused by a **brand typography decision**.

**Zero organic community discussion.** For a product with an NBC segment, that absence is the finding: **press did not convert to word of mouth.**

## 2.6 Sri Mandir — market context

**FirstPrinciple AppsForBharat Pvt Ltd**, founded Nov 2020, Bengaluru, sole founder **Prashant Sachan** (M.Des IIT Bombay IDC; Samsung, Microsoft; previously co-founded Trell, which raised $60M+ and collapsed ~2022 — Trell retained ~17% equity). **~300 staff.** **[RESEARCH]** [about-us](https://www.appsforbharat.com/en/about-us) · [Tigerfeathers](https://www.tigerfeathers.in/p/10-million-users-and-rising-fast)

| Round        | Date             | Amount             | Lead                    |
| ------------ | ---------------- | ------------------ | ----------------------- |
| Seed         | Aug 2021         | $4M                | —                       |
| Series A     | Sep 2021         | $10M               | Elevation Capital       |
| Series B     | Sep 2024         | $18M               | Fundamentum             |
| **Series C** | **Jun–Jul 2025** | **₹175 Cr / $20M** | **Susquehanna Asia VC** |

**Total ~$52–53M.** Valuation not disclosed since an estimated $90–100M Series B.

**FY25 financials (MCA filings via Inc42):** operating revenue **₹69.6 Cr** (3.8× YoY), net loss **₹45.3 Cr**, and — the number that matters — **advertising & publicity ₹51.9 Cr, up 233%.**

> **Ad spend was 75% of revenue and 44% of all expenses. Their growth is bought, not earned.**

**Scale:** 40M+ cumulative downloads (company claim), 10M+ Play installs, **3.5M MAU**, **1.2M annually transacting users** completing 5.2M rituals. Play **4.4 / 142,000 reviews** — **down from 4.9 in 2022**.

**Business model:** transactional, not subscription. Chadhava (temple offerings with video proof), **pooled e-puja** (a private puja normally ₹10,000–30,000, sold at ~₹3,000/family), prasad delivery, astrology at ₹10–15/min, **take rate 20–25%**. The iOS subscription is a footnote: ₹99/₹199/₹299 in India, $4.99/$12.99/$29.99 in the US.

> **Sensor Tower reported the app generated under $100,000 in in-app purchases since 2020** — against a business doing millions. Payments run off-platform via Razorpay under the real-world-services carve-out. **[3P via PRESS]** [TechCrunch](https://techcrunch.com/2024/09/09/sri-mandir-is-on-a-quest-to-digitize-indias-devotional-journey/)

**Diaspora:** ~20–25% of revenue from outside India (sources give both 20% and 25% — report both). **ARPU ₹7,000 (~$81)/yr abroad vs ₹600–800 in India — ~10×.** As of Sep 2024: 500,000 registered users and 2.5M installs outside India — **roughly 6% of cumulative installs producing 20–25% of revenue.** Explicit target: _"first and second-generation Indian Americans."_ But the **US iOS footprint is tiny in absolute terms — ~260 ratings vs 3,000 in India** — so this is a small number of high-spending users, not broad penetration.

**Tradition handling — better than expected on calendrics, weaker on sampradāya.** Their pañcāṅga **dual-labels amānta and pūrṇimānta simultaneously** (e.g. _"Month Amanta: Ashadha" / "Month Purnimanta: Shraavan"_ for the same date) and is city-scoped. Regional festival tagging exists as ad-hoc string suffixes (`Shravan Somwar Vrat *North`, `Nag Pancham *Gujarati`). **But there is no sampradāya dimension**: "Shravana Putrada Ekadashi" and "Masik Krishna Janmashtami" are listed **with no Vaiṣṇava/Smārta qualifier**, i.e. no dual dates for Ekādaśī or Janmāṣṭamī, which those communities routinely observe on different days. **[CO]** [srimandir.com panchang](https://www.srimandir.com/panchang/city/new-delhi)

**Complaints:** dominated by fulfilment failure and unreachable support — _"promised video of the puja never arrived"_; _"no verification the puja happened at the claimed location"_; gotra mishandled; a user's number blocked after five complaints. Plus loud temple-bell autoplay with no mute, forced re-login loops, and failure to load on mobile data. **[INFERENCE]** The proof-of-ritual grievance is **architectural, not a bug** — Tigerfeathers confirms the sanctum offering is deliberately not filmed.

## 2.7 Which `[UNVERIFIED]` figures this settles

| `01-review.md` claim                                                    | Status after research                                                                                                                                                                                                                                  |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| _"Sri Mandir does not monetise through content subscriptions"_          | **CONFIRMED and strengthened.** Under $100K IAP since 2020 across 40M downloads (Sensor Tower via TechCrunch).                                                                                                                                         |
| _"~20% of Sri Mandir's demand comes from diaspora"_                     | **CONFIRMED**, with a range: sources give 20% _and_ 25% of **revenue**; ~8% of installs. ARPU gap ~10×.                                                                                                                                                |
| _"Hallow/Bible Chat prove Western willingness to pay"_                  | **PARTIALLY CONFIRMED, and inflated.** BibleChat's $15M is a **run-rate extrapolation from one peak month**; the defensible figure is **$6.3M cumulative net through Mar 2025** (Appfigures). Romanian filings show a **loss-making company** in 2023. |
| _"Bible Chat bought 7M downloads via ~2,000 Apple Search Ads keywords"_ | **NOT SUPPORTED.** No ad-network evidence found. Their documented engine is a **paid creator programme** (200+ creators, £150/mo base) ≈ **$1.5M/yr in content spend**. Still BOUGHT — but a different kind of bought, with a different lesson (§9).   |
| _"App store search — dead"_                                             | **SUPPORTED.** Dharma Daily is globally listed in 39 storefronts with **zero installs**. Diya is 95% US at 154 ratings after paid acquisition.                                                                                                         |
| Conversion / LTV chain in review §6                                     | **NOT settled by this research** — `02-plan.md` Appendix A already replaced it with RevenueCat primary data, which is better sourced than anything I found. Unchanged.                                                                                 |
| _"one approved canonical file"_ (content bottleneck)                    | **CONFIRMED exactly.** 1 of 432 tracker rows approved (§1.3).                                                                                                                                                                                          |

**Where research contradicts the review:** only the BibleChat channel claim, and it makes the picture _slightly_ less closed rather than more — see §12.

---

# 3. COMPETITOR CONVERGENCE

Three independent teams — a solo Replit build with zero users, a 23-person funded Bengaluru company at 865K installs, and a ten-week-old US indie — making the same choice is evidence about the market, not about the teams.

## 3.1 What all three do

| Convergence                                            | Real need, or inherited convention?                                                                                                                                                                                                                                                                  |
| ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **A daily verse / daily item as the core loop**        | **Inherited convention.** All three took it from Christian daily-office apps. None has the obligation that makes it work there (§5). Dharmāyana, the only one with scale, has **quietly abandoned it**.                                                                                              |
| **Streak mechanics**                                   | **Inherited convention, uninterrogated.** Diya: flame pill + week strip + Gregorian month grid + milestones at 1/3/7 days + a "Streak rescue" notification channel. Dharma Daily: flame initialised to **1 before the user does anything**. Dharmāyana: none — and Dharmāyana is the one with users. |
| **Ship an AI chat feature**                            | **Real but shallow need.** "Ask Krishna" (Dharma Daily), "Ask Diya" (Diya). Both are unnamed-source glosses. Notably BibleChat, the successful one, has **demoted AI** from its store listing.                                                                                                       |
| **Onboarding survey that does not change the product** | **Convention.** §4 documents this per app. Diya asks 11 questions and consumes **one** (the name). Dharma Daily asks 5 and consumes **none** beyond a summary card.                                                                                                                                  |
| **The Bhagavad Gītā as the content spine**             | **Real** — it is the one text with cross-sectarian acceptance and a stable chapter-verse address. Diya: 700 of 748 verses. Dharma Daily: a whole tab.                                                                                                                                                |
| **Paywall before content**                             | Diya: paywall at screen 19 of 29, before a single verse. Dharma Daily: banner present, **IAP not configured**.                                                                                                                                                                                       |
| **AI-generated devotional imagery**                    | All three. Diya's onboarding temples, Dharmāyana's deity art, Dharma Daily's store assets.                                                                                                                                                                                                           |

## 3.2 What none of them does — the gap list

Exhaustive, with a reason for each absence:

| Absent from all three                                                                            | Why absent                                                                                                                                                                                                                               |
| ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Any onboarding question about tradition, sampradāya, iṣṭa-devatā, region, or family practice** | **Unthought-of.** Diya asks age, gender, and whether you feel _"tempted to commit dishonest or harmful acts"_ — and never asks which tradition you belong to. This is the single largest shared blind spot.                              |
| **A named translator on any displayed verse**                                                    | **Unthought-of, and a licensing exposure.** Dharma Daily's BG 9.22 English is a modern paraphrase — not Telang, Besant or Arnold, whose copyright has lapsed — shipped unattributed.                                                     |
| **A named commentator, anywhere**                                                                | **Unthought-of.** No Śaṅkara, Rāmānuja, Madhva, Jñāneśvar, Abhinavagupta in any of the three. **This is structural: an app with no named commentator is architecturally incapable of showing that traditions read a verse differently.** |
| **IAST or any transliteration standard**                                                         | **Unthought-of.** Diya renders Devanagari correctly and offers no romanisation at all. Dharmāyana's own wordmark is "Dharmāyana" while every body string is "Dharmayana" — the macron is branding, not orthography.                      |
| **A correct, disclosed, region-aware calendar**                                                  | **Hard and expensive.** See §3.5.                                                                                                                                                                                                        |
| **Any on-screen acknowledgement that observances vary**                                          | **Unthought-of** — and, for Diya, a documented failure to implement its own published policy.                                                                                                                                            |
| **A completion object — a defined daily act with an end**                                        | **Unthought-of.** Dharma Daily asks for 5 minutes a day and never defines the 5-minute unit. Diya's streak increments on opening. Only Diya's japa ring closes on anything.                                                              |
| **Provenance or licensing disclosure on audio**                                                  | **Expensive to do honestly.** Diya shows no artist credit, no source marker, no YouTube attribution on 41 externally-hosted items.                                                                                                       |
| **A share affordance on the daily verse**                                                        | Dharma Daily has none at all. **Dharmāyana is the exception and has built its whole growth loop on it.**                                                                                                                                 |
| **Pronunciation help — full phonetic text, adjustable playback speed**                           | **Unthought-of** — and explicitly requested in a Dharmāyana 3★ review.                                                                                                                                                                   |
| **PPP pricing for India**                                                                        | **Deliberate.** Diya ₹499/mo > US in USD; bible.ai ₹1,299/mo > US. They are not trying.                                                                                                                                                  |

## 3.3 Where they diverge — the unsettled questions

| Question                     | Positions taken                                                                                                                                                                                                                                |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Who pays, and for what?**  | Diya: **subscription** ($4.99–6.99/mo). Dharmāyana: **transactional micro-payments** (₹21 puja, ₹71 jyotiṣī). Dharma Daily: **$49.99/yr with no working IAP**. Genuinely unsettled — and the two live positions are the two ends of the space. |
| **Which market?**            | Diya: **95% US diaspora**, no India pricing. Dharmāyana: **~88% India**. Nobody serves both.                                                                                                                                                   |
| **Habit machinery or none?** | Diya: five reinforcing streak surfaces. Dharmāyana: **zero, deliberately** — no streak, no completion, no progress, and it is the one with 865K installs.                                                                                      |
| **Onboarding length**        | Diya: **18 screens before the paywall**. Dharmāyana: **one dismissible language sheet over an already-populated home**. A 20× difference in time-to-value between two live products.                                                           |
| **Where commerce sits**      | Dharmāyana puts ₹ price chips **on devotional home tiles**. Diya hides pricing entirely post-purchase.                                                                                                                                         |

**[INFERENCE]** The Diya/Dharmāyana divergence on habit machinery is the most informative single fact in this section. The app with scale runs no streak; the app with 154 ratings runs five streak surfaces and shipped **"Streak rescue updates"** at ten weeks old — you do not build streak-loss recovery in week ten unless you have already watched streaks break.

## 3.4 What they all fail at

| Shared failure                                                       | Property of the market, or hard to do?                                                                                                                                                                                                                                                                 |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Retention on a manufactured daily obligation**                     | **Property of the market.** §5 explains the mechanism. Hindu daily practice is household- and tradition-specific, not universally obligatory; there is no daily office to dock onto. Diya is trying to manufacture the obligation with Duolingo intervals; Dharmāyana concluded it could not and left. |
| **Calendrical correctness**                                          | **Hard, and nobody has paid for it.** §3.5.                                                                                                                                                                                                                                                            |
| **Making the AI answer anything a knowledgeable user would respect** | Both live AI features produce unsourced, smoothed glosses. Diya's BG 7.8 answer neither picks a reading nor flags that a choice exists.                                                                                                                                                                |
| **Converting scale into community**                                  | **Zero Reddit/forum footprint** at 865K (Dharmāyana), 154 ratings (Diya), 0 (Dharma Daily). Nobody advocates for any of these unprompted.                                                                                                                                                              |
| **Iconographic accuracy in generated art**                           | Dharmāyana's triśūla resolves to **four-to-five points** on the card explicitly badged _SEND TO FRIENDS AND FAMILY_ — the error is engineered to propagate. Śiva carries no tripuṇḍra.                                                                                                                 |

## 3.5 How each handles sectarian and regional variation

**All three flatten it. This is a market-level gap.**

| App              | Calendar                                                                                                                                                                                                                                                                                                     | Sect                                                                                                                                                                                                                                                                                                                                   | Region                                                                                                                                                                 | Language                                                                                                                                                                                                                    |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Dharma Daily** | **Wrong by 17 and 21 days**, with live countdown pills arithmetically ticking toward dates that do not exist. **No amānta/pūrṇimānta defence** — both festivals fall in Bhādrapada under either reckoning. Offers a **"Brahma Muhurta"** reminder chip while **collecting no location anywhere**.            | **Kṛṣṇa/Vaiṣṇava by construction.** The AI is _"Ask Krishna"_ — the model speaks _as_ the deity, casting the user as Arjuna. No Śākta, no Śaiva, no Vedānta commentary, **no Rāmāyaṇa** while the Mahābhārata gets a tab. The 🔱 emoji labels "Deep practitioner" in an app with no Śaiva content.                                     | None. No location, ever.                                                                                                                                               | English only. Devanagari appears in exactly one place (the Gita chapter index) and is **correct**. No IAST.                                                                                                                 |
| **Dharmāyana**   | Location-parameterised (`Ujjain ▾`, _"for your location"_) — the only one that models place. But **~30-min yamagaṇḍa offset**, **full-hour DST error abroad**, ṛtu names wrong for South India. **No method, timezone, ayanāṃśa or "calculated for" line anywhere**, so a user cannot detect a wrong answer. | No selector, no iṣṭa-devatā, no sampradāya field. `Devata` is a **booking catalogue dimension**. Three sectarian registers on one screen with no logic connecting them (Śiva-Pārvatī card, Gaṇeśa ring, ūrdhva-puṇḍra avatar). One Telugu 3★: _"On Thursday only Sai [Baba] photos are made available"_ — a hard-coded Thursday deity. | Presents `Hariyali Amāvāsyā` as _the_ card for the day with **no regional qualifier**, for an observance whose salience varies sharply by region.                      | **4+ languages** (English, Hindi, Kannada, Marathi, "view more") — the best of the three. No IAST; two romanisation schemes inside one card title (`Prarthana & Pooja`).                                                    |
| **Diya**         | **Gregorian only.** No tithi, nakṣatra, pakṣa, ekādaśī, vrata. **"Sunset (6:00 PM)" is a hardcoded clock value** — it names _sandhyā_ and computes nothing. A `Festival Calendar` tile exists; contents not captured.                                                                                        | **Handled by avoidance.** Eleven onboarding questions, none about tradition. Catalog is genuinely pan-sectarian (Vaiṣṇava, Śaiva, Śākta, Gāṇapatya, Hanumān all stocked) — **with no deity filter, no tradition filter, and no explanation of what anything belongs to.** Breadth in the catalog, absence in the interface.            | Defaults to **"Bhagwan"** — Hindi-belt romanisation, singular proper noun — in an English-only app for a US audience with large South Indian and Gujarati populations. | English only. **Devanagari renders correctly**, including conjuncts, avagraha and daṇḍa. **No IAST anywhere** — removing the only bridge for a diaspora audience that speaks an Indian language but cannot read the script. |

**Even Sri Mandir**, with ~$53M raised, dual-labels amānta/pūrṇimānta correctly and then **has no sampradāya dimension at all** — Ekādaśī and Janmāṣṭamī are listed without a Vaiṣṇava/Smārta qualifier, so the two communities that observe on different days both get one date.

**[INFERENCE]** This is the clearest content-layer opening in the category: **sampradāya as a modelled dimension, not a string suffix.** Nobody at any funding level does it.

## 3.6 What their users consistently complain about

Cross-referencing §2:

1. **Paid-service failure** (Dharmāyana, Sri Mandir) — _"THEY SHOW YOU A BEAUTIFUL TEMPLE IN THE VIDEO BUT THE VIDEO… WILL BE FROM A SMALLER, REMOTE AND DIFFERENT TEMPLE"_; _"handwritten kundali"_ that is software-generated; astrologer no-shows; _"promised video of the puja never arrived."_ **Not applicable to us — we sell no fulfilment.**
2. **Calendrical wrongness, especially abroad** — the DST hour, the yamagaṇḍa half-hour, the ṛtu names.
3. **AI-generated art with iconographic errors** — the four-pronged tilaka, counted by a devotee and filed as a defect.
4. **Machine-translated regional-language content reading as inauthentic** — _"other languages text are not perfectly generated."_
5. **Transliteration desynced from recited audio** — a user trying to follow along and failing.
6. **The diaspora learning gap, stated explicitly** — _"I want to learn them… no Guru or temple near them… I need the FULL phonetic versions… a way to slow down the audio speed."_
7. **Long-tail deity and language coverage** — Bengali and Sanskrit-display requested repeatedly; Martand Bhairava and Hinglaj Devi requested; Bajrang Baan requested.
8. **Accessibility** — _"Enable zoom to view texts, contrast not good"_ — relevant given a 40+ segment.

Items 2, 3, 5 and 6 map directly onto the standing constraint and onto things we can do. Item 1 we should stay out of.

---

# 4. COMPETITOR AUTOPSIES

## 4.1 Dharma Daily

**Time to first value: 9 screens, 8 deliberate taps.** Splash → 5 questions → summary → account wall → Home. **The app gates on the screens that produce nothing and yields on the screens that produce something** — Q2 and Q3 render `Continue` disabled until answered, while the only two skippable screens are the notification ask (`Skip for now`) and the account wall (`Continue without account`), i.e. the two that would actually have given the user something.

**First session asks vs gives:** asks five profiling questions and an account; gives a promise. No verse, no audio, no sample appears at any point in onboarding.

**The survey is theatre, and one instance is provable.** The summary card renders **`YOUR PATH: Explore All`** — the null default — after Q2 asked which path calls to you, then narrates the fallback as _"We've crafted a personalized experience just for you. Every verse, mantra, and teaching will be tailored to your spiritual journey."_ Q3 collects a depth signal and the app's **only** depth affordance is "Advanced Commentary" behind a purchase that cannot transact. Home renders **"Namaste"** twice — an unfilled name slot, because onboarding never asked for a name while the layout assumes one. **[SCREENSHOT]**

**Content depth:** the entire inventory is stated aloud on Q2 — six items. The Explore row duplicates the tab bar and the More list; **the app has roughly nine destinations and surfaces them three times each.** Two festivals, each a name, a date and a countdown pill, with no description or ritual guidance.

**Does a session feel complete? No — there is no completion object anywhere.** The daily shloka has `Listen`, `Show Sanskrit`, `Read More` — three ways to keep going, zero ways to stop. No mark-complete, no summary, no reflection field. **The app asks for a daily habit and never defines the daily act.** That is a missing product concept, and it is more damaging than any of its factual errors, because the errors are a data patch.

**Tradition:** §3.5. **Monetisation:** a complete two-tier paywall with accurate savings maths (40.4%), trial framing, full Apple auto-renew boilerplate, Privacy/Terms and Restore Purchases — over **a payment rail that was never connected**. Every element that costs only layout is finished; the one element requiring App Store Connect configuration is absent. The paywall also contradicts Home, selling "18 and 30-day journeys" as premium while Home displays an **18-day** plan with no lock badge.

**Craft:** competent. One considered decision — **serif for scripture against sans chrome**. Defects: reading-plan cards scroll **under a fully transparent status bar** with no scrim (visible in three captures); a truncated card title shipped on the home screen; **the tab bar's selected tint is iOS system blue `#007AFF`**, untouched, in an orange-and-navy app; two competing icon systems where 🔮 (crystal ball, i.e. fortune-telling) labels "Seeking guidance in life" in a scripture app.

**Trajectory:** nothing tried, nothing abandoned. One version.

**Where it fails:** the festival calendar; attribution; the definition of the daily act; the payment rail; distribution entirely.

### Verdict: EXECUTION — and it carries no demand signal whatsoever

**Zero installs tells us nothing about whether anyone wants this.** iOS-only, English-only, no Android, no ASO, no localisation, no in-app sharing, no working payment, no update in four months, marketing on a free Framer subdomain with fabricated testimonials and broken social links. **It was never distributed.** Reading "zero ratings" as a verdict on the category would be a straightforward inferential error, and it is the error this app most invites.

What it _does_ tell us, with high confidence, is that the build is **bimodal**. Everything derived from a structured source is right: 18 chapters, canonical verse counts (47/72/43/42/29), correctly composed Devanagari chapter titles, a correct BG 9.22 citation with a faithful rendering of _yoga-kṣema_. Everything hand-made is wrong: the festival table, the store screenshots, the store-asset citation, the privacy label, the testimonials.

**[INFERENCE]** That split is the diagnosis. A scaffold generator supplied a competent design system, a coherent funnel, a well-formed paywall and a clean tab architecture. What it could not supply was the four expensive things: a pañcāṅga computation or verified calendar, a licensed and attributed translation, named commentarial positions, and an editorial stance on which traditions the word "Hindu" is covering.

**The most useful thing to take from Dharma Daily is that the surface is no longer a proxy for anything.** Every competitor in this category can now clear the visual bar for free. The only defensible ground left is exactly the ground this app left empty.

## 4.2 Dharmāyana

**Time to first value: 1 screen.** A dismissible language sheet over an **already-populated** home carrying today's tithi/nakṣatra items and a dated festival card. No splash funnel, no auth, no permission prompt. Against Dharma Daily's nine screens and Diya's twenty-nine, this is an order of magnitude better and it is a pure sequencing decision.

**First session asks vs gives:** asks nothing; gives the day. Location (`Ujjain`) is **populated without being asked** — a defensible default (Ujjain is the classical prime meridian of Indian astronomy) presented as fact rather than a question.

**Content depth:** a session is 10–30 seconds — glance at the UPDATES story row, optionally forward a festival card, optionally tap a module. **There is no session object**: no start, no end, no completion. The app delivers _notification_ and _propagation_, not _understanding_ or _practice_. There is no reading surface, no audio, no journal, no library anywhere in the captures.

**Monetisation — a precise wall: computation is free, human contact is paid.** `Shubh Dina` FREE, one Panchanga tile FREE; `Ask a Jyotishi` **₹71**, `Book a Pooja` **₹21**. Of four module cards on the whole home scroll, **three are transaction rails and one is utility — and the utility one carries the FREE chip.** There is no section boundary, tonal shift or "Services" tab separating browsing from buying: the ₹21 badge on `Book a Pooja` renders in the same orange pill as the FREE badge on `Shubh Dina`. **The devotional surface _is_ the storefront.** Nothing on the grid tells a buyer what they will receive, from whom, or when — which is exactly the failure mode the 1★ reviews describe.

**Craft:** a real, staffed product with a low-cost content pipeline. Signature device: a **scalloped tear-edge** on every module banner, reading as toraṇa bunting — the one piece of genuine visual authorship. Single-accent orange discipline. Defects: a floating `↑ BACK TO TOP` pill that **occludes live content** in both captures; a clipped `Devata…da…` label; "Dharmāyana" vs "Dharmayana"; and the **UPDATES story order changes between two renders one minute apart** on the same device, so the day's most important item is not held in a stable position.

**Trajectory — what they tried and abandoned:** the daily-practice product itself. Phase 1 pañcāṅga utility → Phase 2 prayers and content → Phase 3 Kundli, _"our first monetised feature"_ → Phase 4 marketplace. Features that shipped then regressed, from dated reviews: **continuous prayer playback broke in v6.2.6** (_"why break something that was working perfectly"_); lyrics pagination broke ~v4.1.0; the widget broke repeatedly across v3.0.5, v3.4.1, v4.3.0; wallpapers appear to have moved or been removed.

### Verdict: PREMISE — for pañcāṅga-as-a-business. Not for daily practice.

Two readings had to be separated:

**(A) The daily-practice premise doesn't monetise.** Pañcāṅga is a real recurring need but a **commodity**: deterministic, published, non-excludable, already free in a dozen apps and every Indian newspaper. It generates opens, not willingness to pay.

**(B) They found an easier revenue line and abandoned a viable one.**

**The screens support (A), decisively, because the retreat is total rather than partial.** If they had merely deprioritised a working product you would expect a diminished practice surface still present — a streak that stopped being promoted, a library behind a menu. Instead **there is no habit machinery of any kind**: no streak, no completion, no library, no audio, no journal, no session object. You do not delete every progress primitive while retreating; you do that when you have concluded the surface does not earn its place. And `Reminders` — the single retention lever — is filed in a bottom bin called "More on Dharmāyana," beneath three storefronts.

**The qualification, and it is where (B) is right:** the pivot was executed **by abandonment, not refactor**. The pañcāṅga layer — the one asset with genuine structural demand — was left in place uncorrected. A ~30-minute yamagaṇḍa offset and a full-hour DST error abroad are the errors of a computation nobody is maintaining.

**So: a correctly-read market, executed by walking away rather than fixing.** But note precisely what failed: **a widget with a share button**. Nothing in these screens ever attempted depth — no text, no audio, no learning, no accrual, no tradition model. **They have vacated the daily-practice position without disproving it**, and left the one structural asset undefended. That is an opening, and it is narrower than it looks: **whoever takes it must monetise something other than the calendar, because the calendar is what Dharmāyana proved you cannot sell.**

## 4.3 Diya

**Time to first value: 29 screens.** Eighteen extract before anything is given; the paywall lands at screen 19, **before a single verse, chant or answer**. The funnel runs ~3½ minutes of wall clock (14:28→14:31:30) delivering zero content.

**First session asks vs gives.** Eleven questions in order: motivations (multi) → prayer experience → _research interstitial_ → reasons (multi) → practice time → time spent with Bhagwan → _"Do you ever struggle with your faith?"_ → _"Do you ever feel tempted to commit dishonest or harmful acts?"_ → age → gender → name → interests. Then an outcome chart, a testimonial wall, a fake-compute screen, and a **`Hold to commit`** pledge — a press-and-hold gesture styled as biometric authentication, applied to a promise, fired one screen before the price.

### The copy is a Christian prayer-app funnel with the nouns swapped

This is the most important single observation about Diya, and it is the standing constraint in action:

- **"prayer life"** — an English-Protestant devotional idiom with no Hindu equivalent
- **"I pray without ceasing"** — 1 Thessalonians 5:17, offered as the top rung of a _Hindu_ practice ladder
- **"Grow in virtue"**, **"Grow closer to God"** — catechetical vocabulary
- **_"Do you ever feel tempted to commit dishonest or harmful acts?"_** — a Catholic examination of conscience. **Nothing in the app consumes this answer.**
- **"Do you ever struggle with your faith?"** — presupposes _faith_ as the unit of religious identity, a post-Reformation framing; Hindu traditions more often organise around practice, lineage and household observance than around assent
- **"God" and "Bhagwan" are used interchangeably across adjacent screens** — the variable was renamed in some strings and not others

**The survey is theatre except for the name, and one instance is self-harming.** Q4 collects a practice time; Profile then ships **`Prayer reminder — Off`** and **`Streak rescue updates — Off`**, and Home carries a setup card _"Add Daily Prayer Reminder"_. **The app asks for the time, discards it, and asks again later — defeating its own retention mechanism.** Q11's six interest tiles map 1:1 onto surfaces that are all shown anyway, unfiltered, in fixed order. The tour itself is canned: its Verse Library card shows BG **2.47** while the live Read tab ten minutes later shows BG **7.8**.

**Content depth — Read.** **748 verses total, of which 700 are the Gita.** That leaves **~48 verses to represent the entire remainder of Hindu scripture** — Upaniṣads, Vedas, Rāmāyaṇa, Purāṇas, Tamil and bhakti corpora combined. The organising principle is **thematic mood-matching** (`self · change`, `endurance · impermanence`; _"Search dharma, peace, devotion…"_) — a wellness-app information architecture applied to scripture. **Read has no completion state at all.** It is a database, and databases do not end.

**Content depth — Listen, and the UI is more honest than the store.** The tab is split by a typographic rule. Above it: Prayers (4), Mantras (6), Aartis (3+), Devotionals (4), Bhajans (2) — each with commissioned symbolic artwork (śaṅkha, gadā, triśūla, Om). Below a header reading **`RAGAS` / "Instrumental music for everyday moments"**: **30 items counted from the UI** _(their published catalog lists 29 secular tracks; the one-item gap is unresolved and either count supports the point)_ — _Dopamine Focus Reset, Digital Detox Reset, Brain Fog Clear, Nervous System Cooldown, Sunrise Anxiety Release_ — **all bare white cards with no artwork at all.**

That contrast is the clearest unfinished tell in the product: the devotional half got a budget and the wellness half did not. **The app classifies its own secular half correctly at the section level and hides it everywhere above:** the top category chips read Prayers / Mantras / Aartis / Devotionals, the Ragas half is three-plus scrolls down, and **every item is counted as a "practice"** — _Dopamine Focus Reset_ is a practice in the same sense that _Hanuman Chalisa_ is. Three different track counts appear across three surfaces (tour says 10, store says 50+, tab shows ~48).

**Craft.** Serif for scripture is the most expensive-feeling decision and is undermined by inconsistency (Listen's section headers are serif, Read's identical-function headers are sans). **Devanagari renders genuinely correctly** — BG 7.8 and 2.47 with correct conjuncts (`ङ्ग`, `र्भू`, `ष्ण`, `प्स`), anusvāra, visarga, single daṇḍa at the half-verse and double at the close. No mojibake. It is a small real signal, and cheap: a font and typesetting decision, not a moat. Against that: the brand mark is magenta-pink and appears nowhere else in the palette, sitting in the centre tab slot **with no label, no active state and no observable function** — a logo occupying a tab. An **iOS-system-blue `Try it now →` button** left in from a template. Off-system confetti. **The funnel and the app are two different colour worlds** — cool lavender with black pills versus cream with orange gradients — consistent with the funnel being iterated separately against ad creative.

**Illustration is AI-generated and detectably so:** bells at inconsistent scales, marigold garlands merging into columns, a rangoli whose radial symmetry breaks under inspection, light shafts with no source, an incoherently tiered śikhara, mehndi-decorated hands dissolving at the fingers. **The exception is the Listen card art** — flat gold symbols on gradient — which is the strongest visual work in the app, partly because symbols dodge the AI-face problem entirely.

**The research interstitial.** Four claims with a citation footnote. Verified independently:

| Claim                                                                                                       | Verdict                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| _"Bhagavad Gita-based learning was followed by a 47% median reduction in anxiety scores"_ (Das et al. 2026) | **Materially misrepresented.** The paper ([PLoS ONE 2026, DOI 10.1371/journal.pone.0347320](https://doi.org/10.1371/journal.pone.0347320)) reports _"A clinically meaningful (≥4-point) GAD7 reduction at 45 days occurred in… **47.1% (Gita)**"_ — a **responder rate**, the proportion of people who improved, rendered by Diya as an **effect size**. A category error, and the app's version is the more impressive of the two. Also omitted: **n = 68 total, 17 per arm**, single-centre, one-week intervention, unblinded, p = 0.047. |
| _"95% reported a sense of wellbeing and mission after group prayer"_ (Rastogi et al. 2023)                  | **Half-supported.** _"Feeling of well-being (95.30%)"_ is accurate. **There is no "mission" item** in the results. Design: cross-sectional self-report, **no control group**, n = 85 + 49, single site — and it measures **group** prayer, used to sell a **solitary phone** app.                                                                                                                                                                                                                                                           |
| _"Cortisol levels fell 33% after daily Mahamantra chanting"_ (Sekar et al. 2019)                            | **Accurate.** 268.33 → 180.6 nmol/L = 32.7%, p = 0.01. Caveats omitted: **n = 30**, all **female nurses with pre-existing moderate–severe stress**, 45-day supervised protocol.                                                                                                                                                                                                                                                                                                                                                             |
| _"Attention-task performance improved 22% after 10 minutes of Gayatri Mantra"_ (Pradhan & Derle 2012)       | **Accurate (21.67%) — and the omission is the whole point of the paper.** Chanting a **poem** for the same 10 minutes also produced significant improvement, and the significant advantage was **in the female subgroup only**. Subjects were **60 school students aged 12–14**.                                                                                                                                                                                                                                                            |

**No fabricated citations — someone read real papers.** But the presentation is inflated in exactly the way a growth-optimised funnel inflates: one responder rate presented as an effect size, one construct invented, one active control silently dropped. Separately, the later chart screen says _"backed by **our** research\*"_ where the asterisk resolves to **Koenig 2012 and Lally 2010** — a straightforward misattribution of authorship.

**[INFERENCE]** A knowledgeable Hindu audience includes a large cohort of doctors, engineers and grad students who will check a `PLoS ONE 2026` citation. **The 47% error is the one that gets screenshotted.**

### Verdict: EXECUTION — with one premise falsified, and it is not the premise that matters

**Falsified now:** the specific premise _"take a Christian daily-office funnel, swap the nouns, and Hindu users will convert and stay."_ The funnel does not ask a single question a Hindu practice product would need to ask, and the one lever that would have created real daily obligation — the calendar, the tithi, the vāra, the household's own rhythm — is replaced by a Gregorian grid and a hardcoded 6 PM "sunset". **Diya is manufacturing an obligation Hindu practice does not universally supply, using machinery built for a religion that does, and has brought none of the raw material that could have substituted.**

**Real evidence this is execution**, all fixable by the same team without a new thesis: the survey consumes one of eleven answers and defeats its own reminder; no translator, no commentator, no tradition acknowledgement on any surface **while the company's published editorial standards are rigorous about exactly this**; Devanagari already renders correctly so the typographic groundwork is done and IAST is simply missing; off-palette artifacts left in the build; 700 of 748 verses are one text; three different track counts; provenance opacity; `"backed by our research*"`; `Join 172 devotees` in the mock versus `Join 75` live. Shipping velocity is 8 updates in 9 weeks — this team fixes build problems fast.

**Too early to tell:** retention, D30, LTV, paywall conversion, trial-to-paid. Ten weeks and 154 ratings support none of these. **And the core loop was never captured** — `Begin today's practice` (breathwork → prayer → sacred reading) is the product, and it is not in the screenshot set. Any verdict on session quality would be unfounded.

**The consequence: the opportunity remains open.** Nothing in 35 screens shows a market refusing a Hindu daily-practice product. What they show is a Hindu daily-practice product **that has not yet been built as a Hindu one**. If Diya were failing on premise the fix would be unavailable to anyone; it is failing on four omissions, and each is a build decision.

---

# 5. BENCHMARK AGREEMENT AND DIVERGENCE

## 5.1 The method has to change, and the substitution is better

The brief assumed two successful apps, so convergence between them would approximate a rule. **bible.ai is not successful** (§0). Two apps, one succeeding and one dormant, cannot produce that inference.

**What they can produce is a controlled comparison**, and it happens to be an unusually clean one:

|                            | BibleChat                                                                               | bible.ai                                                                                                                                             |
| -------------------------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Religion, category, era    | Christian AI Bible app, 2023–26                                                         | Christian AI Bible app, 2025–26                                                                                                                      |
| **Craft**                  | High. Two-typeface system, single lilac accent, bespoke illustration across ~15 scenes. | **Arguably higher.** Sticker geometry, hand-drawn doodle progress icons, painterly commissioned topic art, contextual composer, serif-for-scripture. |
| **Distribution mechanism** | 200+ paid creators, £150/mo base, ≈$1.5M/yr                                             | Christian-media PR, one NBC segment, founder's Instagram                                                                                             |
| **Ratings**                | **356,000 (US alone)**                                                                  | **~102 (17 storefronts)**                                                                                                                            |
| **Outcome**                | ~30 releases Mar–Aug 2026                                                               | **v1.0.3, June 2025, dormant**                                                                                                                       |

**The variable is isolated. Craft is roughly matched; distribution differs by three orders of magnitude; outcome tracks distribution.**

This bears directly on the founder's stated thesis — _"I want to be better, because Sri Mandir is market leader but the app isn't very good."_ §7 and §12 answer it properly. The short version: **bible.ai is the strongest available evidence that being better does not, by itself, produce anything.**

## 5.2 Where they agree — and it is a short list

Four points, each classified:

1. **A daily, dated, name-stamped content object as the core loop.** BibleChat: `Today's Journey` with a week strip and a 3-card day. bible.ai: `☺ daily` sticker card, `aug 12`, `for vaibhav`. → **DESIGNED**, and the most portable idea in either app.
2. **Serif for scripture, sans for chrome.** Both enforce it strictly. BibleChat extends it: section titles stay serif so editorial voice reads as _publishing_ and functional text reads as _software_. → **DESIGNED**.
3. **A single reserved accent colour that means "act".** BibleChat: lilac `#E9A8F5` for every CTA, selected radio and progress fill; disabled CTAs are the same lilac at low opacity rather than grey, so the affordance never changes identity. bible.ai: orange **only** on the enabled primary CTA, making button state a colour event. → **DESIGNED**. Restraint at this level is the single largest contributor to the expensive feel in both.
4. **An extractive onboarding survey preceding any value.** BibleChat: 8 questions + 2 interstitials + a free-text confession. bible.ai: country, name, gender, full date of birth, relationship status, parenthood, interests. **Both are largely theatre** (§6). → **DESIGNED**, and worth _not_ copying (§10).

## 5.3 Where they diverge — free choices

Two apps making opposite calls means the choice is not load-bearing:

| Dimension               | BibleChat                                                            | bible.ai                                                                                    |
| ----------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| **Navigation**          | 5-tab architecture                                                   | **No tab bar at all** — one scroll plus a composer                                          |
| **Reader**              | Full chapter-and-verse reader with translation picker                | **No reader** — an app called bible.ai never shows you a Bible you can navigate             |
| **Streak**              | Four redundant surfaces (counter, week strip, month grid, widgets)   | **Streak exists only in a fictional tutorial mock** and is absent from the real home screen |
| **Community**           | Live prayer queue, Blessing Partner                                  | None                                                                                        |
| **Illustration**        | Flat vector gradient landscapes, no photography until after purchase | Painterly sticker cards, hand-drawn doodles                                                 |
| **Voice**               | Text-first                                                           | **Voice co-equal** — mic given equal billing with text                                      |
| **Denomination asked?** | Yes, and it routes content                                           | **Never asked** — it asks marital status and parenthood, not doctrine                       |

That last row is the sharpest. **bible.ai's 1★ cluster is entirely doctrinal, and it declines to learn the one thing its angriest users care about.**

## 5.4 What both do that no Hindu competitor does

The highest-value list in this section, each classified:

| Both benchmarks do                                                                                                                                                                                              | No Hindu competitor does                                                                            | Class                                                                                  |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| **Ask an identity question that routes content** — BibleChat's denomination reorders the translation list (RSVCE/CPDV promoted above NIV after "Catholic") and creates a **"Catholic Life" shelf**              | None of the three asks tradition at all                                                             | **DESIGNED** — a routing decision, though the _ease_ of asking it is STRUCTURAL (§5.5) |
| **Name the text version being read** — `NLT` badge, `[NIV]` picker                                                                                                                                              | No named translator anywhere in any of the three                                                    | **STRUCTURAL** — rests on a licensable parallel-translation ecosystem (§5.5)           |
| **A threshold before content** — bible.ai's full-screen prose preamble; BibleChat's plan reveal                                                                                                                 | Nobody paces the entry                                                                              | **DESIGNED**                                                                           |
| **Minute-stamped, finite session units** — BibleChat's `1 MIN / 3 MIN / 2 MIN` cards under a `< 5 min/day` contract                                                                                             | Diya time-boxes content but has **no completion state**; Dharma Daily has none; Dharmāyana has none | **DESIGNED**                                                                           |
| **Propagate the user's stated pain into content titles** — "Bible hard to understand" → plan _"From Confusion to Clarity"_ → Day 1 _"When the Bible Feels Hard"_ → reflection _"Confusion Can Lead to Clarity"_ | Diya consumes only the name; Dharma Daily consumes nothing                                          | **DESIGNED** — template string substitution, cheap                                     |
| **Listen/Read duality on one content unit** — twin buttons on the same reflection                                                                                                                               | Diya splits them across tabs (the chant lives in a different tab from its text)                     | **DESIGNED**                                                                           |

## 5.5 Did they succeed the same way? No — and only one succeeded

**BibleChat: manufactured organic at ~$1.5M/yr.** 200+ paid creators on new dedicated accounts. **BOUGHT** — but note the _shape_: it is content production, not media buying. Their website carries ~20K visits/month falling 24% MoM and ranks only for its own name. **There is no SEO moat and no church distribution** — TechRound lists church partnerships as a _future plan_.

**bible.ai: PR without compounding.** A premium one-word .ai domain, a competent Christian-media push, an NBC segment — and 75 organic keywords, 19-second sessions, no blog, no Android after 18 months, no community. **The .ai domain bought a name, not a channel**, and a different site (bibleai.com) is taking the generic search intent it was meant to capture.

**Neither route is available to us**, and that is the finding. But the _asymmetry_ is instructive in a way the brief anticipated: **the one that grew did so through a content-production channel a single person can attempt at £0** (post short-form video yourself), whereas Apple Search Ads at Hallow's clearing price is simply closed. That is a materially different lesson from the one currently in `02-plan.md` §5, and it is the only place this research makes the growth picture _less_ closed. See §12.

**Convergence by different routes:** the only genuine instance is **BibleChat adopting a pattern after abandoning something else** — AI chat has been **demoted from the store listing** in favour of daily plans, meditations, Holy Calendar, Panic Button and Live Prayer. That is a tested lesson, not a starting assumption, and it is worth more than any of their launch-day choices: **the AI was the hook and is no longer the product.**

---

# 6. BENCHMARK TEARDOWNS

## 6.1 BibleChat — 28 screens

**Flow.** 7 value-carousel screens (full-bleed illustration, serif headline in the lower third, one lilac CTA in the thumb zone, **no skip, no X, no log-in**) → a social-proof wall on black with three review cards keeping **unedited App Store grammar** and a fourth deliberately cut off under the CTA → 8 survey questions and 2 interstitials → a free-text confession → 4 staged fake-loading screens → plan reveal → trial teaser → paywall → welcome → Today.

**Time to first value: 24 screens to the plan reveal — but that is a promise. The first actual scripture arrives at screen 28, and the paywall sits at screen 26, i.e. before it.** Zero content is given free.

**Onboarding — real vs theatre, with evidence.**

_Real:_ denomination **reorders the translation list**; denomination **creates a content shelf** ("Catholic Life" on Explore); the Q1 pain phrase **propagates into four separate content titles**; the Q8 selection "one explained verse per day" becomes the Today card `YOUR VERSE · 1 MIN`.

_Theatre:_ **the Bible reader opens on NIV** despite the user choosing Catholic; gender produces no visible differentiation; the **free-text confession — the highest-effort input in the flow — surfaces nowhere**, though the loader claims _"Taking in every word"_; the 4-screen loader **stalls at exactly 50% on each phase** waiting on modals that collect no data.

Those modals are the sharpest mechanic in the app: **a micro-yes ladder immediately before the price** — _"Did it feel good to finally say that?"_ / _"Do you believe things can change?"_ / _"Want to see what your words became?"_ / _"No one else has this exact plan… Ready to see it?"_ — with Yes always right-hand and lilac-filled, No a hollow outline.

**The retention mechanism, named:** a 7-day sequenced Journey of three sub-5-minute daily sessions, wrapped in a streak ledger (counter + week strip + month grid + home/lock-screen widgets), **with a partially pre-completed day as the hook**, plus two social surfaces.

Classified:

- **STRUCTURAL** — the **Holy Calendar** (an externally imposed liturgical year the app did not create); **daily devotional habit as a pre-existing norm** ("quiet time" is established practice, so the app schedules an existing duty rather than creating one); **denomination as a one-tap identity** (a nine-item single-select works because the church already assigned the label and users answer instantly); **prayer as an already-daily obligation**, which is what makes the live queue credible.
- **DESIGNED** — **endowed progress** (the first session arrives marked **DONE** and the day starts at **50%**, so the user begins in credit and must spend 5 minutes to protect it); the **streak-at-0-as-debt** shown twice on Profile and again on an empty month grid; **three colour-coded minute-stamped cards** making the day explicitly finite; **widgets** as retention surfaces outside the app; **Blessing Partner**; **Listen/Read duality**.
- **BOUGHT** — **the live prayer queue**. _"IN WAITING · 19 PRAYERS"_, _"15 secs left"_, _"STARTS IN 1 MIN"_ at 00:38 local time requires continuous inbound submissions at all hours. **This looks like a feature; it is an audience.** A small app ships it and shows an empty room. Also **"40M+ · ★4.9"** on the paywall, and the **licensed NIV/RSVCE/AMP shelf**, which requires paid licences with Biblica/Zondervan-class rightsholders.

**Paywall.** Screen 26 of 28, flow-mandatory rather than usage-triggered. Trust strip **above** the headline (★4.9 · 40M+ · Safe & private). Headline uses the name and references the burden the user typed two minutes earlier. Two tiers: **7-day trial then £4.99/week — pre-selected** — and £39.99/year, unselected and dim. **The pre-selected tier is ~6.5× more expensive annually, and no per-week equivalent is shown for the yearly option.** _"Cancel anytime before August 18 2026"_ — a concrete date that reads as reassurance and functions as a deadline. **No X, no close, no back, no "maybe later."** Legal and Restore links at ~12pt in low-contrast teal at the extreme bottom edge. Post-purchase, a **YOUR IMPACT** card converts buyer's remorse into moral credit before any product is shown.

**Content structure.** Day → 3 sessions → 1/3/2 minutes → "< 5 min/day". A 7-day arc with narrative day titles drawn as cards on a dotted connecting path. **Completion is signalled four redundant ways** for one 5-minute act: a checkmark plus the literal word **DONE** on a green card, a bar to 100%, the streak incrementing, a day circle filling on both week strip and month grid.

**Where the structure depends on a single sequential canon — and this is the part that does not transfer.** The reader's entire chrome is `[Matthew 20] [NIV] ‹ ▶ ›`: **one book picker, one translation picker, linear prev/next**. Onboarding asks _"Which Bible speaks to your heart?"_ as a **single-select** — it assumes one canon with competing renderings, not many texts with different authority. _"I open Genesis and get lost by chapter 5"_ assumes a reader progresses **through** a text. The verse-of-the-day card is one quotation with one citation and **no genre label**, because it needs none.

**None of that transfers to a corpus of many texts of different genre and authority.** There is no single-select "which scripture", no linear next-chapter, no universal address, and **no case where citing one line without stating its genre and tradition is safe** — śruti and smṛti are not interchangeable citations. Every affordance here has to be redesigned rather than ported.

**Notifications: not captured.** What is visible is the surrounding ambient strategy — "Lock screen verses" offered as a plan ingredient, "Discover Widgets" in the drawer, "Add Daily Streak Widgets" in the streak modal. **The app builds passive glanceable surfaces so the daily push does not carry the load alone.** The tolerability lever established elsewhere is the _"< 5 min/day"_ contract: a reminder is defensible when the thing it interrupts you for is stated as 1, 3 and 2 minutes.

**Craft.** Two typefaces, strictly enforced — a high-contrast transitional serif for every headline, a neutral geometric sans for every label; the serif never appears in chrome and the sans never in a headline. **One accent colour, no exceptions.** A **palette shift at the paywall boundary** — deep violet onboarding, near-black product with coloured session cards and a gold streak accent — so marketing and product are visually distinct. **Gradient direction as hierarchy**: every onboarding screen darkens downward so text never sits on busy art. **One decision per screen, always** — the "change one thing" screen leaves two-thirds of the display empty rather than combining questions, and the CTA holds a constant y-position across all 28 screens so the tap target never moves. **Flat vector gradient illustration, no photography, no rendered faces, Jesus shown from behind** — this dodges the two things that make religious apps look cheap. Photography appears only _after_ purchase, where documentary realism is the point. **Deliberate roughness where authenticity pays**: review cards keep original spelling and grammar.

**What it does not do.** No free content before the price. No skip, X or back anywhere in 28 screens. **Never says "AI"** — no model name, no disclaimer, no citation UI in chat. No visible free-tier quota. No account creation before payment. No notification permission before payment. **No theology, no doctrine, no denominational claim** — denomination is a content filter, never an argument. No church integration. **No public sharing surface at all**, despite the growth channel being TikTok. No pricing comparison. No light mode. **No onboarding answer is ever shown back to the user.**

## 6.2 bible.ai — 12 screens

**Flow.** `select country` (200-row list, no explanation, no geo-detection, disabled CTA) → [one uncaptured step, likely name] → `what is your gender?` → `when is your birthday?` (three-column wheel) → `relationship status?` + `are you a parent?` **stacked on one screen with both pre-selected** → interests (a secular lifestyle chip cloud: investing, basketball, rugby, photography, gym — **not one religious chip**) → 3 tutorial slides → home → devotional preamble → the daily.

**Time to first value: 8 screens to home, 10 to actual scripture.** Seven of the eight are gates. **The country selector as screen one is the highest-attrition moment in any app** and it is spent on a 200-row list with no explanation and no auto-detection, generating no perceptible personalisation later. India is not in "Suggested" — the suggested set is Anglosphere plus Brazil, France and Korea.

**Onboarding — real vs theatre.** _Real:_ the name ("for vaibhav" / "for rachel" in the mock). _Plausibly real:_ gender and relationship status may pick a default tab in the `let's talk about` rail (`for men` / `for women`; `toxic relationships`). _Not visible anywhere:_ birthday, and **interests** — the daily prompt served is _"how can studying the Bible transform your perspective?"_, the most generic possible devotional prompt, indexed to nothing the user typed, despite the screen claiming _"your interests shape my responses and help me learn."_

**Two of the four questions are pre-answered with defaults**, which manufactures completion without consent and inflates whatever "personalisation completed" metric sits behind it. The 4-pip progress bar **completes at screen 4 and two more gates follow** — progress is under-reported.

**The retention mechanism: a dated, name-stamped, AI-generated daily card with a streak counter.** **DESIGNED** — every load-bearing part is a template token.

**What makes it notable is what it declined to use.** Christianity hands a developer a rich set of **STRUCTURAL** assets: a lectionary dictating which passage is read on which date across entire denominations; a liturgical calendar with Advent, Lent, Holy Week and Pentecost; church-mediated distribution where a pastor moves a congregation; and the socially enforced rhythm of Sunday. **bible.ai uses none of them.** The `aug 12` stamp is a timestamp, not a date in a calendar that exists outside the app.

**Is there a retention mechanism at all? Barely.** The streak — the one compounding primitive — appears **only in a fictional tutorial mock ("for rachel 🔥 day 6") and is absent from the real user's home screen.** The new user sees no streak, no history, no accumulation. **No notification permission is requested in the captured flow**, so the daily has no captured mechanism for reaching the user when the app is closed. **A daily card that only exists when you open the app is not a retention mechanism; it is a reason to stay once you are already there.**

**Paywall: not captured.** The 8-screen path to a full scripture reading is traversed without hitting any payment surface. **Nothing is locked, badged, greyed or blurred anywhere in the UI.** Pricing from research ($12.99/mo, $89.99/yr, 7-day trial) is not evidenced in this capture set.

**Content structure.** The daily is one screen, four blocks — framing prose → one scripture card → one reflection question → composer — under a screenful, no scrolling. Preceded by a **full-screen prose preamble that does nothing but slow the user down before content, and works.** A `next →` pill implies a short ordered series with an end; **exhausting the cards is what makes a session feel finished.** Secondary structure is a browse grid with no numbering, no progress, no completion marks. **Nothing accumulates.**

**Structural canon dependencies — three, all load-bearing and none transferable:** (a) **chapter-and-verse addressing** — `Romans 12:2` with an `NLT` badge is a globally stable machine-resolvable address into a fixed canon with multiple licensed parallel translations of the same text, which the user recognises instantly and grants authority; (b) **one canon means one daily** — _"the passage for aug 12"_ is coherent only when there is one book, whereas with many texts of differing genre and authority "today's passage" requires an editorial choice that must be justified; (c) **the `characters` browse tab** assumes a single continuous narrative with a universally recognised cast.

**One translation badge is doing enormous work.** `NLT` is a single token signalling _this text has provenance and we know which version you are reading_. An app without a comparable licensed badge-able translation layer loses that credibility cue and **has nothing to put in its place**.

**Theology Mode: not captured by name.** Two candidate entry points are visible but unopened — the cream `your ai` pill on home, and the `✦ bible.ai ⌄` dropdown **in the header of the daily devotional**, whose chevron implies a selectable voice. **[INFERENCE]** Putting a named historical voice one control away from a cited verse blurs _what the text says_ against _what a persona would say about it_ — precisely the category confusion the 1★ doctrinal reviews describe. **For a Hindu equivalent the risk is sharper: a synthesised guru voice is not a stylistic filter, it is an assertion of sampradāya and lineage authority, and no product can grant itself that.**

**Notifications: not captured**, and that is a material gap — the entire retention proposition is a _daily_, and the flow never asks for the one permission a daily habit requires.

**Craft.** Two families used with discipline, doing semantic work: **serif = the app's voice and the sacred text; sans = the machine's voice and the controls.** Scripture is set in serif at generous leading with a superscript verse marker — typeset like a printed Bible, not a chat bubble. **The all-lowercase system applies to chrome and brand only** — generated and scriptural content uses standard capitalisation, including `God`, `His`, `God's Word`. So the 1★ "lowercase god" complaints are about the wordmark and UI voice, not the prose. It is not a typo; **it is a positioning decision with a known cost** — the convention that buys credibility with a secular twenty-something spends credibility with a reverent user.

Ground is near-black (~#0d0d0d), never pure black, with surfaces at #1e1e1e and #2a2a2a giving three depth levels **without a single border**. Techniques that manufacture expense: **sticker geometry** (the daily card rotated a few degrees with an irregular hand-drawn border radius and soft shadow, so it looks placed rather than rendered); **fanned card decks** with overlapping shadows; **hand-drawn doodle progress icons** (ID card, walking figure, birthday cake, peace sign) — the most expensive-feeling detail in the flow, **decorating a demographics form**; **generous negative space**; **a contextual composer** (mic on browse, send-arrow on the daily).

**Craft failures:** interest chips clipped mid-word at both screen edges; the birthday picker's non-selected rows fall below usable contrast on black; the segment rail clips `for wome…`; topic card text clips at `are you c… forgivene…`. The horizontal-overflow-with-bleed pattern is used four times and hides content each time.

**Does craft alone appear to have produced anything? No.** This is a better-made object than most funded consumer apps, and it produced ~102 ratings, a −41% MoM traffic slide, no Android, no community, and a dormant binary. **The causal reading the images support: craft was spent on surfaces and not on mechanisms** — a reason to return, a permission to reach the user, a structure that accumulates, a channel that distributes. **The most beautiful screen in the set is a demographics form.**

**What it does not do.** No tab bar or navigation architecture at all. **No Bible reader** — no book/chapter browse, no continuous reading. No search. **No denomination, tradition or theological question in onboarding**, though its 1★ cluster is entirely doctrinal. No translation choice. No save, highlight, note or history — nothing persists visibly, so nothing is lost by leaving. **No share affordance**, in a category whose primary organic channel is one believer telling another. No liturgical calendar or lectionary. No streak surfaced to the real user despite shipping the streak UI in the tutorial. No sign-up, no notification permission, no paywall in the captured path. **No safety, sourcing or AI-limitations disclosure** — the tutorial promises _"ask me about anything to receive biblical knowledge and life advice"_, an unbounded promise with no counterweight, in a product whose documented failure mode is doctrinal.

---

# 7. THE RESIDUE

Strip everything STRUCTURAL, everything BOUGHT, and everything that fails the religious-context test. **What is left is far smaller than the apps appear, and stating it plainly is the point of this section.**

## Removed as STRUCTURAL (inherited from Christianity; unavailable to us)

- A daily obligatory office to dock onto. **This is the single most consequential removal.** Both benchmarks' daily loops rest on a habit the church already enforces.
- The liturgical calendar / Holy Calendar / lectionary — an externally imposed year the app renders rather than creates.
- Denomination as a one-tap identity that users answer instantly and that is socially load-bearing.
- A licensed parallel-translation ecosystem, and the `NLT` badge that signals provenance in one token.
- Chapter-and-verse addressing as a universally recognised credibility primitive.
- "Today's passage" being coherent without editorial justification, because there is one book.
- A `characters` browse axis over one continuous narrative with a shared cast.
- Church-mediated distribution. **Note bible.ai left all of these on the table and BibleChat used only some — but none of them is available to us regardless.**

## Removed as BOUGHT

- The live prayer queue that is always full. **A feature that is actually an audience.**
- "40M+ / ★4.9" social proof on the paywall.
- Licensed NIV/RSVCE/AMP translations.
- Bespoke illustration across ~15 onboarding scenes, plus video and meditation catalogues.
- A £4.99/week price surviving in-market atop an install firehose.
- 200 paid creators at £150/month.
- Sri Mandir's ₹51.9 Cr advertising line, and its live astrologer/pandit supply operation.
- Dharmāyana's 865K installs and 23 staff shipping every 1–3 weeks.
- Anonymised-handle community that self-refreshes without moderation.

## Removed as failing the religious-context test

- **"Which scripture speaks to your heart?" as a single-select.** Imports the assumption of one canon with competing renderings.
- **A linear `‹ ▶ ›` next-chapter reader as the primary navigation model.** Works for one book read sequentially.
- **A bare verse card with no genre label.** Safe when there is one kind of text; unsafe across śruti, smṛti, Purāṇa, Itihāsa, Dharmaśāstra and darśana, which are not the same kind of thing.
- **A persona-voice mode.** For Christianity this is a stylistic filter over named modern authors. **A synthesised guru voice is an assertion of sampradāya and lineage authority, which no product can grant itself.**
- **A single national festival date.** Amānta and pūrṇimānta place the same month differently; Ekādaśī and Janmāṣṭamī genuinely split by community.
- **"Grow closer to God" / "prayer life" / "struggle with your faith" as the register.** Diya demonstrates exactly how this reads (§4.3).
- **A universal every-single-day cadence as the unit of obligation.** Much Hindu observance is keyed to tithi, vāra and vrata — Monday for Śiva, ekādaśī fasts, pradoṣa, festival days — not to an undifferentiated daily.

## THE RESIDUE — what is actually available to us

Nine items. All DESIGNED, all passing the religious-context test:

1. **Endowed progress.** Hand the user a day that starts partially complete, so they begin in credit and spend a few minutes to protect it. _(BibleChat: first session pre-marked DONE, day at 50%.)_
2. **Minute-stamped, finite session units** under an explicit contract. _(BibleChat: 1/3/2 min, "< 5 min/day".)_ Requires a defined daily act, which **no Hindu competitor has**.
3. **Four redundant completion signals** for one act — checkmark plus the word DONE, a bar to 100%, a counter increment, a calendar cell filling.
4. **Template propagation of the user's stated need into content titles** — string substitution across a content model, cheap, and visible.
5. **An identity question that visibly routes content.** _(BibleChat: denomination → reordered translations + a shelf.)_ **The Hindu adaptation is not doctrinal** — see §9.1.
6. **A threshold screen before content** — full-screen prose that slows the user down and works. _(bible.ai's preamble.)_
7. **Listen/Read duality on one content unit** — doubles usable contexts at near-zero content cost.
8. **Craft discipline**: two typefaces with semantic assignment (serif = text and voice, sans = machine and chrome); one reserved accent that means "act", with disabled states as low-opacity accent rather than grey; one decision per screen; a fixed CTA y-position; gradient direction as hierarchy; illustration that avoids stock photography and rendered faces.
9. **Ambient surfaces so push does not carry retention alone** — widgets, lock-screen content.

**That is the whole of it.** Nine mechanics, none of them a moat, all of them copyable by anyone — which is exactly why §8 matters more than §7.

---

# 8. THE GAP

## 8.1 What both benchmarks do that no competitor does, and is transferable

From §5.4, filtered to DESIGNED and religious-context-safe: **the identity question that routes content**, **the minute-stamped finite session**, **the threshold before content**, **template propagation of stated need**, and **Listen/Read duality**. Five items. All in the residue.

## 8.2 What all five fail to do that a user would want

1. **Tell the user which reading they are getting, and that others exist.** Zero named commentators across five apps at every funding level.
2. **Let the user say what tradition or household practice they come from, and change what they see.** Zero of five ask.
3. **Give a correct, regionally-qualified festival date with the convention stated.** Dharma Daily wrong by three weeks; Dharmāyana wrong by an hour abroad; Diya has no calendar; Sri Mandir dual-labels the month correctly and has no sampradāya split.
4. **Teach someone to say the words.** Requested explicitly in a Dharmāyana review — _"FULL phonetic versions… a way to slow down the audio speed"_ — and offered by nobody. Diya renders Devanagari beautifully and ships **no romanisation at all**.
5. **Define what "done" means for one day.** Nobody has a completion object except Diya's japa ring.
6. **Disclose where content came from.** Diya ships 41 of 48 audio items from embedded YouTube with no attribution; Dharma Daily ships an unattributed modern translation.

## 8.3 What appears in complaints across multiple apps that nobody has solved

**Correctness that the user can check.** The Dharmāyana reviewer who counted three prongs against four; the one who compared the yamagaṇḍa against Drik and found a 30-minute gap; the US one who found the hour of DST; the one who found transliteration desynced from the audio he was trying to sing along with. **These users are auditing the product and finding it wrong.** They are also exactly the users worth having.

## 8.4 What we can do that none of them can

Grounded in §1, not aspiration:

1. **Three-layer citation validation is already built and working** (§1.3) — Edge Function, DB CHECK constraint, and client-side verification, with title and location overwritten from the DB so the model cannot fabricate a citation label. BibleChat has a **documented citation-hallucination** (Philippians for Romans). We architecturally cannot produce that class of error. **Caveat: it currently guards a corpus of one approved document.**
2. **Rights fail-closed retrieval SQL** — a missing tracker row is an uncleared source. Against Diya's 41-of-48 embedded YouTube library, this is a real and defensible difference.
3. **142 hand-written trilingual verse entries with honest tradition notes** — Devanagari, IAST, plain-English "Say it", word-by-word gloss, prose meaning that names tradition differences. `content/shlokas/gita-2-47.md` contrasts Advaita against Viśiṣṭādvaita and Dvaita readings of one verse. **No competitor has a single named commentator anywhere.** This is the only asset in the repo a competitor cannot trivially clone.
4. **The validator already enforces the three-register format**, including a Devanagari-codepoint check — so the pronunciation layer that §4.1 of the plan calls the one perceivable differentiator is **structurally guaranteed**, not merely intended.
5. **`challenge_session` docs must set `can_embed: false`** — paid content is structurally barred from the RAG corpus. A rights posture nobody else has bothered with.
6. **The UI already says the honest thing about the calendar** rather than faking a date (§1.5).

## 8.5 Where we are currently worse than the three failing apps

This is the section it is most tempting to skip.

|                                       | Them                                                                                                                                                                                         | Us                                                                                                                                                               |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Shipped at all**                    | Dharma Daily, with zero users and a Replit bundle id, **is on the App Store**. Diya ships every ~8 days.                                                                                     | **Nothing is deployed.** No hosting config, no deploy workflow, migrations never confirmed applied. Expo Go only.                                                |
| **Audio**                             | Diya: 48 tracks and a japa counter with a 108-bead ring. Dharmāyana: prayer audio and Brahma Muhūrta recordings _(from reviews, not the captures — playback was reported broken in v6.2.6)_. | **None.** `CURRENT_SUMMARY.md` lists audio under "not yet done".                                                                                                 |
| **Working AI**                        | Dharma Daily's "Ask Krishna" returns text. Diya's "Ask Diya" answers BG 7.8 in the verse context.                                                                                            | **Ask Dharma cannot answer anything** — 1 of 432 sources approved, no keys, and a provider/model mismatch that would throw on first request.                     |
| **A calendar that exists year-round** | Dharma Daily's is wrong but present. Dharmāyana recomputes daily and models location.                                                                                                        | **4 dated festivals expiring 8 Nov 2026** and 17 undated explainers that never appear on the Calendar tab. After November there is nothing.                      |
| **Languages**                         | Dharmāyana ships 4+ UI languages including Kannada and Marathi.                                                                                                                              | **English-only UI.** No `hi` dictionary exists. Verse-level Hindi only.                                                                                          |
| **A defined daily act**               | Diya's tour describes breathwork → prayer → sacred reading.                                                                                                                                  | **We have the same hole as Dharma Daily** — a daily card with no completion object.                                                                              |
| **Time to first value**               | **Dharmāyana: 1 screen.**                                                                                                                                                                    | Onboarding is one screen and skippable, which is good — but there is nothing behind it that a stranger can reach.                                                |
| **Sectarian tagging**                 | Diya's _catalog_ is genuinely pan-sectarian even if the UI hides it.                                                                                                                         | **`tradition_primary: general` on all 877 verse files — zero sectarian tagging in the bank.** And the retrieval filter _narrows_ rather than diversifies (§1.3). |

**The honest summary: on every dimension a user can perceive in the first thirty seconds, we are behind an app built in a weekend on Replit — because it shipped and we did not.** Our advantages are all one layer down, in provenance, rights and tradition-honesty, and **not one of them is currently reachable by a stranger.**

---

# 9. ADOPT

Five adoptions. Each states the pattern in the abstract, its Step-3 class, how execution differs for us, and what it costs. **Twenty adoptions is zero adoptions**, so this list is deliberately short and everything on it is already reachable given §1.

## 9.1 An identity question that visibly routes content — reframed for a tradition with no denominations

**Pattern (abstract):** ask one identity question early, then make the answer visibly change what the user sees, so the survey pays for itself in the first session.

**Class: DESIGNED.** _(The routing is a product decision. The **ease** of asking it in Christianity is STRUCTURAL — a nine-item denominational single-select works because the church already assigned the label.)_

**Religious-context test — this is where the naive copy breaks.** There is no Hindu equivalent of denomination as a self-evident one-tap identity. Many practitioners do not identify by sampradāya at all, and asking _"Are you Vaiṣṇava, Śaiva, Śākta or Smārta?"_ will produce shrugs from precisely the disconnected user this product is for — and will read as a loyalty test to everyone else. **The honest analogue is not doctrine, it is household practice.**

**How we execute it differently:** ask **"What do you do at home?"** — a small set of concrete, recognisable observances (_we light a lamp in the evening · we keep ekādaśī · we do Hanuman Chalisa on Tuesdays · we mostly go to the mandir at festivals · I'm starting from scratch_), because family and household tradition governs practice more than doctrine does, and inherited practice is answerable where doctrinal affiliation is not.

**What the answer must then visibly do**, or it is theatre: reorder the daily pool, and — the load-bearing part — **determine which commentarial reading is shown first on a verse that has more than one**, with the others still visible and labelled. That is BibleChat's translation-reorder mechanic transposed onto the one axis where we have real content and nobody else has any.

**Cost:** the retrieval-side change is small but it requires **reversing the `tradition_filter` semantics** (§1.3) from narrowing to ordering — a Vaiṣṇava user must still _see_ the Śaiva reading, labelled, or we have built the Cambridge/Bible Society finding into our own product. That is a correctness fix we owe regardless.

## 9.2 A finite, minute-stamped daily act with a completion object

**Pattern:** state the cost of the day before it starts, in minutes; give it a defined end; signal completion redundantly.

**Class: DESIGNED.**

**Religious-context test — passes, with one substitution.** BibleChat's day is finite _inside_ an obligation the church supplies. We have no such obligation, so **the finiteness has to do more work, not less**: the contract is not "your duty today" but "this takes four minutes and then you are done." Note that **none of the three Hindu competitors has a completion object at all** — Dharma Daily asks for five minutes and never defines the five-minute unit, and Diya's streak increments on opening the app.

**How we execute it differently:** the Navratri night session already has the right shape in the validator — six sections in fixed order (Tonight, Shloka, Meaning, Practice, Tradition notes, Reflection). Stamp it with a duration, mark the shloka block **DONE** on arrival (endowed progress, §7 item 1), and end the night explicitly. Do **not** dress this as a universal daily obligation — Navratri genuinely is nine consecutive nights, which is the one place a Hindu app gets a real, externally-supplied consecutive-day structure for free.

**Cost:** hours. The content structure already exists.

## 9.3 Endowed progress and redundant completion signalling

**Pattern:** the user arrives already partway through, and finishing is confirmed more than once.

**Class: DESIGNED.**

**Religious-context test:** passes — it is a progress-display decision carrying no theological freight. **But it must not become a guilt mechanic**; the plan's existing "no guilt" rule stands, and endowed progress is the _opposite_ of guilt (it grants credit rather than threatening loss).

**How we execute it differently:** BibleChat's four signals sit on top of a streak ledger that shames an empty month grid. **We keep the completion signalling and drop the empty-ledger shaming** — no month grid full of unfilled circles for someone whose tradition does not ask them to practise every single day.

**Cost:** hours.

## 9.4 A threshold before content

**Pattern:** one full-screen, low-interaction moment that slows the user down before the substance.

**Class: DESIGNED.** _(bible.ai's devotional preamble — the one mechanic in that app that is unambiguously good and unambiguously portable.)_

**Religious-context test — passes, but the copy must change completely.** bible.ai's preamble presumes a believer in the second person (_"Pause and invite His presence into your heart"_). **We cannot presume belief, deity, or tradition** — the audience includes the disconnected, the curious and the non-Hindu spouse. The Hindu form of this is not an invocation, it is **a moment of attention** — and the honest version says what is about to happen and where it comes from, rather than telling the user what to feel.

**Cost:** one screen, one afternoon of writing.

## 9.5 Correctness the buyer can audit — as the differentiator, and as the arrival artifact

**Pattern (abstract):** pick the one quality claim your buyer can verify in thirty seconds, and make verification easy.

**Class: DESIGNED.** _(Not structural — anyone could compute a correct calendar. Nobody has.)_

**Religious-context test — this is the adoption that touches the standing constraint most directly, so run it explicitly.** The pattern as practised by the benchmarks _does_ import a forbidden assumption: BibleChat's Holy Calendar and bible.ai's `aug 12` stamp both presuppose **one calendar, one date, one correct answer**, which is exactly what amānta/pūrṇimānta reckoning and community-level observance split make false. **The pattern is therefore only adoptable in inverted form:** where they render a single authoritative date, we render **a date plus the reckoning, the observing community, and the disagreement**. If we cannot say which convention a date belongs to, we do not publish the date. That inversion is what makes it transferable — and it is also what makes it a differentiator rather than a copy.

**This is the adoption that answers the founder's steer, and it is the only one that is not borrowed from any of the five apps** — it is derived from where all five fail.

`02-plan.md` §4.1 already identifies pronunciation as _"the one differentiator the buyer can perceive"_ — the review's Serious-3 complaint was that citation provenance is invisible, and pronunciation is auditable by the person who needs it. **The research adds a second auditable claim of the same kind, and it is stronger because it is checkable by a third party:**

**Festival dates, stated with their convention and region.** Dharma Daily is wrong by 17 and 21 days with countdown pills actively ticking. Dharmāyana is an hour wrong abroad and half an hour wrong in India, with **no method, timezone, ayanāṃśa or "calculated for" line anywhere, so a user cannot detect a wrong answer**. Diya has no calendar. Sri Mandir dual-labels amānta/pūrṇimānta correctly and then gives one date for Ekādaśī and Janmāṣṭamī, which two communities observe on different days.

**How we execute it differently — and cheaply.** §1.5 says a computed pañcāṅga is greenfield and expensive, and the plan correctly defers it. **This adoption does not need one.** It needs a small, hand-verified, regionally-qualified table for the festivals we actually cover, published with:

- the convention used (amānta or pūrṇimānta) named on the page
- the observing community named where dates genuinely split (Smārta vs Vaiṣṇava Janmāṣṭamī, Ekādaśī)
- the location the timing is computed for, stated
- the source cited, and the disagreement reported where sources disagree — the plan's Appendix A already notes ±1 day discrepancies on several 2027 dates

**Why this is the arrival artifact too:** it is exactly the content that answers the explanatory queries in `02-plan.md` §5, it is shareable into a family WhatsApp group without embarrassment, and — unlike a date query, which the plan correctly identifies as zero-click — _"is Janmashtami on the 4th or the 5th this year and why do people disagree"_ is a question Google's knowledge panel cannot answer.

**Cost:** days, not months, for the festivals in scope. **This is the one place where "we are better" is both true and visible.**

---

# 10. DO NOT ADOPT

Named explicitly, because this section prevents the most expensive mistakes.

| Attractive thing                                                                           | Why not                                                                                                                                                                                                                                                                                                                                                                                                               |
| ------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **A long extractive onboarding funnel** (BibleChat 24 screens, Diya 18 before the paywall) | **BOUGHT.** Both are paid-acquisition-shaped: they maximise trial-start rate on cold ad traffic at the cost of retention, and only pay off when you can buy the next install. `01-review.md` Serious-4 already flags 19 screens. **Dharmāyana — the one with 865K installs — reaches value in one screen.**                                                                                                           |
| **The fake-computation loader and the micro-yes ladder**                                   | **DESIGNED and transferable — and we should still refuse it.** It collects no data, it is dishonest, and our entire positioning is that we do not overstate. Diya's `Hold to commit` pledge and `"backed by our research*"` footnote are the same instinct, and §4.3 shows what happens when a knowledgeable audience checks.                                                                                         |
| **A live participation counter on a join screen**                                          | **BOUGHT.** BibleChat's prayer queue works because 19 prayers are always waiting. Ours would read _"3 people joined."_ The code is already built (§1.2) — **use it only if the number helps, and otherwise show nothing.** Diya's `Join 172` in the mock versus `Join 75` live is the failure mode.                                                                                                                   |
| **Statistics-driven onboarding claims**                                                    | Diya's are real papers, **inflated** (§4.3). Our audience contains people who will pull the DOI. If we ever cite research, cite the responder rate as a responder rate, name n, and name the control.                                                                                                                                                                                                                 |
| **A persona voice** ("Ask Krishna", Theology Mode)                                         | **Fails the religious-context test outright.** Naming the AI after a deity casts the model as that deity and the user as Arjuna, positions the whole advisory voice inside one sampradāya, and claims lineage authority no product can grant itself.                                                                                                                                                                  |
| **Verse-of-the-day from a single text**                                                    | **Fails the religious-context test.** It imports the assumption of one canon read sequentially. Our daily pool already spans three texts; keep the genre and text visible rather than presenting a bare line.                                                                                                                                                                                                         |
| **A `‹ ▶ ›` linear reader as the primary model**                                           | **STRUCTURAL to a single sequential canon.** Our `/read` chapter reader is fine as _one_ surface; it must not become the navigation thesis.                                                                                                                                                                                                                                                                           |
| **A calendar tab presented as a pañcāṅga**                                                 | §1.5: we have no computation. Dharmāyana shows what happens when you ship a calendar you stop maintaining — and it has an engine. **The current honest disclaimer is worth more than a wrong number.**                                                                                                                                                                                                                |
| **Streak-loss mechanics and an empty month grid**                                          | Diya shipped **"Streak rescue updates"** at ten weeks. Dharmāyana, the one with scale, ships **no streak at all**. And a grid of unfilled circles is a guilt mechanic aimed at someone whose tradition does not require daily practice.                                                                                                                                                                               |
| **Church/parish-style institutional distribution**                                         | **STRUCTURAL and absent here.** Hindu temples are non-congregational — no membership roll, no attendance list, no pledge database — and governance is split between state Endowments Departments, private trusts and hereditary families. **There is no procurement counterparty.** Sri Mandir's temple relationships are supply-side fulfilment, not distribution. Do not plan around a channel that does not exist. |
| **A transactional puja/astrologer marketplace**                                            | **BOUGHT** — Sri Mandir spent ₹51.9 Cr on ads in one year and runs an operations business with ~300 staff; Dharmāyana runs a second app just to recruit supply. The plan already excludes this. The research adds a reason: **its dominant complaint — unverifiable proof-of-ritual — is architectural, not fixable by better support.**                                                                              |
| **AI-generated deity imagery**                                                             | All three Hindu apps do it and at least two have shipped iconographic errors, one of them **on the card badged _SEND TO FRIENDS AND FAMILY_**. A devotee counted the prongs.                                                                                                                                                                                                                                          |
| **Paywalling before any content**                                                          | BibleChat gives zero content free and takes moral-objection 1★ reviews for it (_"Christ wanted his word to reach everyone"_). The equivalent objection to charging for scripture exists in our audience and would be louder.                                                                                                                                                                                          |

---

# 11. WHERE WE ARE WORSE

Restated from §8.5 as a standalone list, because it is the most useful thing in this document:

1. **Nothing is deployed.** An app built on Replit in a weekend cleared a bar we have not.
2. **Ask Dharma cannot answer a single real question** — 1 of 432 sources approved, both AI keys empty, and a provider/model mismatch that throws on first request. Three layers of citation validation currently guard one editorial guide.
3. **No audio at all**, in a category where the form is oral and where the one explicit user request found in any review is _"the FULL phonetic versions… a way to slow down the audio speed."_
4. **The calendar runs out on 8 November 2026.** Four dated festivals, no recurrence rule, 17 explainers that never surface.
5. **English-only UI.** The `contentLanguage` switch reaches verse translations only; there is no Hindi dictionary. Dharmāyana ships four-plus languages.
6. **No defined daily act** — the same hole as Dharma Daily.
7. **Zero sectarian tagging in the verse bank** (`tradition_primary: general` on all 877), and **retrieval that narrows tradition rather than diversifying it** — which is the inverse of our stated differentiator and of the one gap nobody in the market has filled.
8. **The app discards its own variation data at render time** and substitutes a constant sentence.
9. **Two test files across an 11,525-line app**, and zero direct tests on the 2,284-line production RAG path.
10. **"Dharma Daily" still ships in user-visible strings** — in `subscription.tsx:66`, in every web page, and inside a generated answer string — while a zero-quality competitor holds that name.

**Restated for the founder's thesis:** the ambition to be _better_ is defensible, but on today's evidence **we are not currently better on anything a stranger could perceive.** We are better on provenance, rights posture and tradition-honesty — three things that are real, that no competitor has, and that **no stranger can currently reach.**

---

# 12. RECONCILIATION

`01-review.md` recommends abandoning the native app and subscription for a web-first, festival-calendar, seasonal-purchase product aimed at diaspora parents. `02-plan.md` v2 already answered that with **FIX, not PIVOT**, conditional on five conditions. This analysis is app-focused and therefore sits in tension with the review by construction.

## 12.1 The verdict: COMPATIBLE — but discount this section

**Caveat first, because it matters more than the verdict.** This analysis was commissioned to test `02-plan.md` and is written by the same author. It reports **no disconfirmation of the plan's central decision.** That is a weak result, not a strong one, and a reader should treat it as such. The findings worth weighting are the ones that cut _against_ the plan: §11 (we are behind an app built in a weekend), the Bible Chat channel correction, and the fact that Diya is running the shape v2 rejected with an outcome nobody yet knows.

With that said: three findings sharpen the review and one loosens it.

## 12.2 Did Step 1 strengthen or weaken the fatal-flaw finding?

The review's fatal finding — _the revenue model cannot reach sustainability at any achievable scale, as specified_ — was explicitly conditional on unverified numbers. **`02-plan.md` Appendix A already replaced that chain with RevenueCat primary data and found the arithmetic survives and is worse than stated.** This research does not touch that chain.

What it does touch is the **surrounding market claims, and it strengthens the finding on every one:**

- **Sri Mandir's under-$100K IAP across 40M downloads since 2020 is confirmed** (Sensor Tower via TechCrunch). The category leader has run the content-subscription experiment at maximum scale and it produced almost nothing.
- **Dharmāyana is a second, independent confirmation.** 865K installs, and it **deleted every habit primitive** and moved to transactions. Two companies, different countries, different capital, same conclusion about a daily-practice utility in India.
- **No Hindu content subscription succeeding in English was found** — the plan's Appendix A said `NOT FOUND`, and a further sweep across five apps found nothing to change it.
- **Diya is running exactly our experiment right now, in public, with Meta spend behind it** — English-first, diaspora-targeted, $24.99/yr, no India pricing, ten weeks old, 154 ratings. **That is a free readout we will get by Diwali.** It does not yet tell us anything (§4.3: too early), but it is the single most informative thing to watch.

**Net: the fatal-flaw finding is stronger, not weaker.** The plan's response to it — **a finite, dated, completable product rather than a content library** (`02-plan.md` §1.3) — is _more_ supported now than when it was written. Diya's subscription-over-a-library is the exact shape the plan rejected, and it is the one whose outcome is unknown; Dharmāyana's abandonment is the shape the plan rejected and it is the one whose outcome is known.

## 12.3 The one place research loosens the picture

`02-plan.md` §5 and `01-review.md` §5 both treat Bible Chat as proof that arrival must be bought at a price we cannot pay — _"Apple Search Ads across ~2,000 keywords, outspending competitors 2:1."_

**I found no evidence for that.** What I found was a **paid creator programme**: 200+ UK creators, £150/month base, filming on new dedicated accounts, ≈$1.5M/yr, producing 110M+ views across 500+ short-form videos with a single video at 94M — while their website carries ~20K visits/month **falling 24% MoM** and ranks only for its own brand name.

**It is still BOUGHT — we cannot pay 200 creators.** But it changes the lesson in a way that matters at £0:

- **The channel is short-form video, not paid search.** Apple Search Ads at Hallow's clearing price is closed to us. **Making short-form video is not.**
- **The winning creative format is documented**: before/after transformation, _"DAY 0 vs DAY 40"_, _"I replaced social media with…"_ — and the positioning that carried the 94M-view video was **the app as an antidote to social-media addiction**, not as scripture. Note that a Diya 5★ reviewer independently framed their own use the same way: _"I'm 22 and admittedly addicted to my phone."_
- **Their SEO is worthless**, which is a genuine warning against over-weighting the plan's §5 channel 1 — though our explanatory-query thesis is different from their brand-only footprint, and Diya's 70-page Diwali bet will test it for us.

**[INFERENCE, and I want it labelled as such:]** one person posting short-form video is a £0 channel with a documented format in this exact category. It is not a plan — it is a hypothesis with better evidence behind it than anything else currently in `02-plan.md` §5, and it is cheap to test against the existing Navratri deadline.

## 12.4 The structural-versus-executional question, engaged directly

The brief poses it sharply: **if all three same-religion competitors are failing while both different-religion apps succeed, the difference is more likely structural than executional** — the review's central argument.

**The premise is now false in both halves.** Only one of the two benchmarks succeeds (§0). And of the three Hindu apps, one has 865K installs and a real business, one is ten weeks old, and one was never distributed. The clean 3-fail/2-succeed pattern the inference depends on does not exist.

**What does exist is better evidence, and it points both ways:**

**For structural** — and this is the review's mechanism, and it holds:

> Hindu daily practice is household- and tradition-specific, not universally obligatory. There is no daily office to dock onto and no socially enforced liturgical calendar imposing a season. BibleChat's retention rests on both, and §7 removes both. **Diya is visibly trying to manufacture the obligation with Duolingo intervals (1/3/7 days) and a Gregorian grid, and shipped streak-loss recovery at week ten.** Dharmāyana concluded it could not and deleted the machinery.

**Against structural, and this is what the review could not have known:**

> **What Dharmāyana abandoned was a widget with a share button, not a practice product.** No text, no audio, no learning, no accrual, no tradition model, no session object. **What Diya built was a Christian funnel with the nouns swapped** — eleven questions, none about tradition; _"prayer life"_, _"grow in virtue"_, _"I pray without ceasing"_; a hardcoded 6 PM "sunset" where sandhyā should be. **What Dharma Daily built was never distributed.**
>
> **The tradition-aware version has not been tested by anyone.** Nobody has shipped a Hindu practice product that asks what you do at home, names its translator, names its commentators, states its calendar convention, and teaches you to say the words. That is not a claim that it would work. It is a claim that the market's silence on it is silence, not a verdict.

**Both are true simultaneously, and the plan already encodes the right response to that:** do not bet on manufacturing a daily obligation (structural, unavailable), **do bet on the one place Hinduism supplies a real synchronised consecutive-day structure for free — a festival.** Navratri is nine consecutive nights, socially observed, annually recurring, needing no invention. `02-plan.md` §3.1.1 reached that conclusion from Hallow's Pray40; this research reaches it independently from the fact that **every Hindu competitor's daily-obligation machinery is either failing or deleted, while the one externally-supplied structure in the category is a festival.**

## 12.5 Is the plan being quietly reverted to the original app specification? No — and here is the check

Stated explicitly so the founder can decide rather than have it happen by omission:

- **Is the app being kept?** Yes — that was `02-plan.md` v2's stated reversal of v1, made on the record. Unchanged here.
- **Is the subscription coming back?** **No.** Revenue stays a one-off £8–15 finite challenge. Nothing in this research supports a subscription, and §12.2 strengthens the case against.
- **Is the general-purpose learning companion coming back?** **No.** §13 in fact **removes AI from the Navratri pilot entirely.**
- **Is the five-tab app coming back?** No. The cut list stands.
- **Is anything being added without a cut?** No — §13 pairs every addition with a removal.

**The single check that would reveal a quiet revert:** if the 30-day plan's arrival work slips while session-writing and IA work expand, the plan has reverted regardless of what the document says. `02-plan.md` §9 already names this as the biggest remaining risk and makes it checkable on 11 October. **This research does not change that risk and does not reduce it.**

---

# 13. PLAN CHANGES

What changed in `02-plan.md`, what drove it, and what came out. **Nothing was added without a cut.** Unlisted parts are unchanged.

| #      | Change                                                                                                                                                                                                                                                                                                                                                         | Driven by                                                                                                                                                                                                                                                                         | What comes out                                                                                                                                                              |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1**  | **Appendix A: BibleChat revenue corrected** from "$15M annualised" to **$6.3M cumulative net through Mar 2025 / $750K peak month (Appfigures)**, with the company claim marked as a run-rate extrapolation.                                                                                                                                                    | §2.4 / §2.7 — the two figures cannot describe the same thing.                                                                                                                                                                                                                     | Nothing — a factual correction.                                                                                                                                             |
| **2**  | **§5 arrival: the BibleChat channel description corrected** from "~2,000 Apple Search Ads keywords" to a **paid creator programme (200+ creators, £150/mo base, ≈$1.5M/yr)**, with their SEO explicitly noted as worthless (~20K visits/mo, −24% MoM, brand terms only). Adds **short-form video as a fourth £0 channel to test**, with the documented format. | §12.3 — the only place research loosened the picture.                                                                                                                                                                                                                             | **One of the six explanatory web pages is cut** to fund the video test. Net: five pages + one video test.                                                                   |
| **3**  | **§4.1 promoted: correctness the buyer can audit becomes a two-part differentiator** — pronunciation (already there) **plus regionally-qualified festival dates** stating convention, community, location and source, with disagreement reported. Explicitly **not** a computed pañcāṅga.                                                                      | §9.5 + §8.2 — Dharma Daily wrong by 3 weeks, Dharmāyana an hour wrong abroad, Diya no calendar, Sri Mandir no sampradāya split. §1.5 confirms a computed pañcāṅga is greenfield.                                                                                                  | **Two of the remaining five web pages are re-specified** as festival-date pages rather than new topics. Net: no new pages.                                                  |
| **4**  | **Onboarding: the three questions are fixed as** (a) _"What do you do at home?"_ — concrete household observances, **replacing the current focus-tag question**; (b) reminder time; (c) name. Answer (a) must **visibly reorder the daily pool and determine which commentarial reading appears first**.                                                       | §9.1 — BibleChat's denomination→content routing, adapted because no Hindu denominational identity exists. §3.2 — zero of five apps ask.                                                                                                                                           | **The existing focus-tag question is replaced, not added to.** Net: still three questions.                                                                                  |
| **5**  | **Navratri night sessions gain: a stated duration, the shloka block pre-marked complete on arrival (endowed progress), and an explicit end-of-night state.**                                                                                                                                                                                                   | §7 items 1–3; §9.2. §3.2 — no Hindu competitor has a completion object.                                                                                                                                                                                                           | **The live participation counter on the join screen is cut** unless the number helps. §10 — ours reads "3 people joined".                                                   |
| **6**  | **Scoped AI is removed from the Navratri pilot entirely** (Phase 1 deliverable 7 deleted).                                                                                                                                                                                                                                                                     | §1.3 — 1 of 432 sources approved, both keys empty, a provider/model mismatch that throws on first request; it **cannot answer anything**. Plus RevenueCat's "AI apps 36% worse 12-month retention" (already in Appendix A) and BibleChat demoting AI from its own listing (§2.4). | **Frees ~15h in Phase 1 and removes the moderation queue for the pilot** — the one review finding (Serious 8) that FIX could not mitigate is deferred rather than incurred. |
| **7**  | **New Phase 0 item: complete the rename.** `subscription.tsx:66`, all nine `apps/web/dist/` pages, the `<<<DHARMA_DAILY_RETRIEVED_CONTEXT` fence, and the user-visible _"the approved Dharma Daily corpus"_ answer string.                                                                                                                                     | §1.7 — **a competitor is named Dharma Daily and it is a zero-quality Replit build with wrong festival dates.** This is now brand risk.                                                                                                                                            | Nothing — hours of work, in the existing Phase 0.                                                                                                                           |
| **8**  | **New correctness fix, before any tradition-routing ships: reverse `tradition_filter` from narrowing to ordering**, so a user who states a household practice still _sees_ other traditions' readings, labelled. Also stop discarding `regional_variations` / `tradition_variations` at render (`content.ts:139`, `:208`).                                     | §1.3 — the current behaviour is the inverse of the stated product rule. §2.4 — the Cambridge/Bible Society finding on BibleChat is exactly this failure mode.                                                                                                                     | **Deferred content-catalog expansion pays for it** — this is a prerequisite for change #4, so it is not optional.                                                           |
| **9**  | **Cut list gains: no AI-generated deity imagery, ever.** Any devotional image ships from a named human artist or not at all.                                                                                                                                                                                                                                   | §3.4 / §3.6 — Dharmāyana's four-pronged triśūla on the card badged _SEND TO FRIENDS AND FAMILY_; a devotee counted the prongs and filed it.                                                                                                                                       | Nothing — it is a prohibition, and it removes a temptation that would have cost money.                                                                                      |
| **10** | **§6 CORE confirmed unchanged: audio stays CORE.** The research strengthens the existing promotion rather than changing it.                                                                                                                                                                                                                                    | §8.5 — we have none; Diya has 48 tracks; the one explicit user request in any review is for full phonetic text and slower playback.                                                                                                                                               | Nothing — already CORE in v2.                                                                                                                                               |
| **11** | **Appendix A gains a competitor table** (the five apps plus Sri Mandir: scale, funding, model, channel, maintenance status) and a **"what the market does not do"** list.                                                                                                                                                                                      | §2, §3.2.                                                                                                                                                                                                                                                                         | Nothing — reference material.                                                                                                                                               |
| **12** | **§9 risk register gains a second checkable item:** Diya's Diwali SEO bet (70 pages published end-July, 20 of them festival pages) is a **live experiment on our own §5 thesis**. Check it in November and record the result.                                                                                                                                  | §2.3 — their sitemap is a public readout.                                                                                                                                                                                                                                         | Nothing — one hour of observation.                                                                                                                                          |

**Net scope change: negative.** Six additions, each paid for; one substantial removal (scoped AI from the pilot, ~15h and the moderation queue); two prerequisite correctness fixes that were owed regardless.

**What did not change:** the FIX decision and its five conditions · the Navratri-first sequencing and the 11 October date · Checkpoints A and B and their numbers · the audience and painkiller in §2 · the language sequencing in §4 · the exclusions in §3 (astrology, marketplace, computed pañcāṅga) · the 30-day view's shape.

---

## Sources

**Screenshots:** `docs/ref_images/` — 102 images, sorted per §0.
**Codebase:** HEAD `cec2c94`, read on device.

**Dharma Daily:** [App Store](https://apps.apple.com/us/app/dharma-daily/id6759189492) · [iTunes Lookup](https://itunes.apple.com/lookup?id=6759189492&country=us) · [dharmadaily.framer.website](https://dharmadaily.framer.website/) · [privacy policy](https://dharmadaily.framer.website/legal-pages/privacy-policy)
**Dharmāyana:** [Play](https://play.google.com/store/apps/details?id=in.dharmayana.android) · [App Store IN](https://apps.apple.com/in/app/dharmayana-daily-hindu-app/id6474740467) · [TheCompanyCheck](https://www.thecompanycheck.com/company/oit-innovations-private-limited/U62091KA2023PTC179794) · [Swarajya](https://swarajyamag.com/tech/dharmayana-bridging-tradition-andtechnology) · [Medium case study](https://medium.com/@kushsinghkohli02/dharmayana-journey-from-0-to-150k-downloads-54825818f2aa) · [ThePrint/ANI funding release](https://theprint.in/ani-press-releases/dharmayana-daily-hindu-app-raises-usd-500k-in-pre-seed-after-a-strong-bootstrapped-year/2705984/) · [AppBrain](https://www.appbrain.com/app/dharmayana-daily-hindu-app/in.dharmayana.android) · [Similarweb](https://www.similarweb.com/website/dharmayana.in/)
**Diya:** [App Store](https://apps.apple.com/us/app/diya-daily-hindu-practice/id6774474282) · [trydiya.com/sources](https://www.trydiya.com/sources) · [editorial standards](https://www.trydiya.com/editorial-standards) · [sources & methodology](https://www.trydiya.com/sources-and-methodology) · [privacy policy](https://www.trydiya.com/privacy) · [sitemap](https://www.trydiya.com/sitemap.xml)
**BibleChat:** [App Store](https://apps.apple.com/us/app/bible-chat-daily-devotional/id6448849666) · [Play](https://play.google.com/store/apps/details?id=com.basmo.BibleChat) · [creators.thebiblechat.com](https://creators.thebiblechat.com/) · [Appfigures, Apr 2025](https://appfigures.com/resources/insights/20250418?f=5) · [Adapty case study](https://adapty.io/case-studies/biblechat/) · [tech.eu](https://tech.eu/2025/06/20/how-romanian-startup-bible-chat-turned-ai-and-faith-into-a-global-phenomenon/) · [Early Game Ventures](https://earlygame.vc/portfolio/biblechat) · [Christian Today — theological bias study](https://www.christiantoday.com/news/concerns-raised-over-theological-bias-in-ai-bible-chatbots) · [WarmPeach hands-on](https://www.warmpeach.com/blog/best-bible-chat-apps)
**bible.ai:** [App Store](https://apps.apple.com/us/app/bible-ai-chat-about-anything/id6739915445) · [bible.ai](https://www.bible.ai/) · [archive.bible.ai](https://archive.bible.ai) · [ABN Lookup](https://abr.business.gov.au/ABN/View?abn=76670500660) · [spiritnotes.com/about](https://www.spiritnotes.com/about) · [Christian Newswire](https://www.christiannewswire.com/bible-ai-launches-world-first-christian-app-powered-by-ai-technology/) · [Similarweb](https://www.similarweb.com/website/bible.ai/)
**Sri Mandir:** [Play](https://play.google.com/store/apps/details?id=com.mandir) · [appsforbharat.com/about-us](https://www.appsforbharat.com/en/about-us) · [TechCrunch, Jun 2025](https://techcrunch.com/2025/06/30/sri-mandir-keeps-investors-hooked-as-digital-devotion-grows) · [TechCrunch, Sep 2024](https://techcrunch.com/2024/09/09/sri-mandir-is-on-a-quest-to-digitize-indias-devotional-journey/) · [Inc42 FY25 filings](https://inc42.com/buzz/appsforbharat-fy25-net-loss-widens-16-to-inr-45-cr/) · [Entrackr Series C](https://entrackr.com/news/appsforbharat-raises-20-mn-in-series-c-round-9451578) · [Tigerfeathers](https://www.tigerfeathers.in/p/10-million-users-and-rising-fast) · [srimandir.com panchang](https://www.srimandir.com/panchang/city/new-delhi)
**Calendar verification:** [Drik Panchang 2026](https://www.drikpanchang.com/calendars/indian/indiancalendar.html?year=2026) · [SmartPuja](https://www.smartpuja.com/blog/krishna-janmashtami-2026-date-puja-muhurat/) · [CalendarLabs](https://www.calendarlabs.com/holidays/india/ganesh-chaturthi.php)
**Research-claim verification:** [Das et al. 2026, PLoS ONE](https://doi.org/10.1371/journal.pone.0347320) · [Rastogi et al. 2023, JAIM](https://doi.org/10.1016/j.jaim.2023.100738) · [Sekar et al. 2019, JCDR](<https://jcdr.net/articles/PDF/12877/41236_PD(KM)_(Su_KM)_V-3_CE%5BRa1%5D_F(KM)_PF1(PrG_KM)_PFA(PrG_KM)_PN(SL).pdf>) · [Pradhan & Derle 2012, Anc Sci Life](https://doi.org/10.4103/0257-7941.118540)
