# Founder actions — live list

Things only you can do. Items are deleted when resolved, not marked done. Categories: (1) accounts/keys, (2) decisions, (3) real-world testing, (4) authentic content.

---

## 1 · DECIDE: where the Navratri challenge is sold (web checkout vs app store IAP)

- **WHAT:** Choose the payment rail for the £8–15 one-off Nine Nights purchase: (a) web checkout — Stripe or RevenueCat Web Billing — with the challenge playable on the web app and in the native app; or (b) native in-app purchase, which requires the app to be approved and live on both stores before 11 October.
- **WHY:** The plan (§7, Week 2: "Payment page live and tested with a real card") implies web, but never says so. The existing rail is RevenueCat native IAP only; the web build cannot take payment today; the app is in neither store. Option (b) puts launch at the mercy of store review timelines. Recommendation: (a) web checkout via Stripe — no store review dependency, real-card testable, 18% lower fees.
- **HOW:** Reply with (a) or (b). If (a): create a Stripe account at https://dashboard.stripe.com/register (test mode first — no company paperwork needed to start testing).
- **BLOCKING:** the purchase/paywall step of the challenge flow. Schema, screens, unlock logic, and participation count are being built rail-agnostic in the meantime.
- **ADDED:** 2026-08-12

## 2 · DECIDE: rewriting git history to remove ~128 MiB of staged sources

- **WHAT:** Approve (or decline) a history rewrite of `main` (`git filter-repo` dropping `content/_staging/` from all commits) followed by a force-push. The preserve branch would keep the full history untouched.
- **WHY:** Plan Phase 0 asks for the raw sources to leave git _history_. I have untracked them going forward, but every clone still downloads ~123 MiB of pack. This is a destructive operation on a shared branch, so it is yours to call.
- **HOW:** Say "rewrite approved" and whether the preserve branch should keep full history (recommended: yes). Nothing else needed; I will run it and verify.
- **BLOCKING:** not blocking.
- **ADDED:** 2026-08-12

## 3 · WRITE: the nine Navratri sessions (with reviewer)

- **WHAT:** Nine sessions, one devi form per night (Shailaputri → Siddhidatri), ~8–12 min each, three-register pronunciation for every quoted line (Devanagari / IAST / plain-English e.g. "LUCK-shmee"), tradition variation noted where real. Plan §7 wants nights 1–4 by 25 Aug, 5–9 by 1 Sep.
- **WHY:** This is the product. I can build the container, template the format, and validate structure, but tradition-sensitive devotional content written by an AI and shipped unreviewed violates the project's own editorial rules (CLAUDE.md, plan §4.4). I can draft _scaffolding_ (structure, source citations from the cleared corpus) for you to write into, if useful — say so.
- **HOW:** One markdown file per night in a format I will set up in `content/` with a validating schema. Checkpoint A (20 Sep): fewer than 3 written = STOP per plan.
- **BLOCKING:** challenge content seeding; audio; Checkpoint A.
- **ADDED:** 2026-08-12

## 4 · ENGAGE: a named reviewer for the sessions

- **WHAT:** Find and brief one reviewer for the nine sessions; agree fee (£100–200 per plan) and a 20 September deadline. Plan week 1 item.
- **WHY:** Nothing tradition-sensitive ships unreviewed; also the plan's stated test of whether reviewers will engage with an AI-assisted scripture product at all.
- **HOW:** Temple contacts, Chinmaya/ISKCON-adjacent educators, or academic contacts. Brief: read nine ~10-min sessions, flag errors and tradition-flattening, sign off by name.
- **BLOCKING:** shipping any session content.
- **ADDED:** 2026-08-12

## 5 · RECORD: audio for the nine sessions

- **WHAT:** Read each session's shloka clearly + a slow repeat-after-me pass, phone microphone, one take per night is fine. Plan §7: nights 1–5 the week of 2–8 Sep.
- **WHY:** Audio-first is a CORE cut-list item; a shloka is an oral form. I will build the player and the upload path, but the voice must be a human's — yours or the reviewer's.
- **HOW:** Quiet room, phone voice-memo app, M4A/AAC, one file per night named `night-01.m4a` … I'll give you an exact drop location once storage is set up.
- **BLOCKING:** audio playback feature (buildable with a placeholder, not shippable).
- **ADDED:** 2026-08-12

## 6 · PULL: real search volumes for the §5 query list

- **WHAT:** Google Keyword Planner (free with a Google Ads account, no spend needed) volumes for the explanatory queries in plan §5, geo-filtered UK+US+CA+AE.
- **WHY:** Plan explicitly says verify before committing to target keywords; research tools couldn't reach Keyword Planner/Ahrefs.
- **HOW:** https://ads.google.com → Tools → Keyword Planner → "Get search volume and forecasts" → paste the §5 list → set location filter.
- **BLOCKING:** final choice of the six web-page topics (pages are being scaffolded against the plan's draft list meanwhile).
- **ADDED:** 2026-08-12

## 7 · READ: self-promotion rules for every target community

- **WHAT:** r/Hinduism (and adjacent subreddits), target Facebook groups, temple WhatsApp groups — read each community's self-promotion rules and write them into `docs/arrival-notes.md`. Plan week 1, 3h.
- **WHY:** Moderator rules override sitewide policy; religious communities are hostile to commercial self-promotion; one ban per channel is permanent.
- **BLOCKING:** not blocking build; blocking arrival actions (§5), which are yours regardless.
- **ADDED:** 2026-08-12

## 8 · REVIEW & PUBLISH: the six explanatory web pages

- **WHAT:** I will draft the six §5 pages from the already-reviewed app-authored catalog plus cleared sources, but you must review each before it goes live, and choose the domain it's published on (see item 9).
- **WHY:** They carry the product's name into Hindu communities; editorial rules require human sign-off. Plan wants ≥4 live by Checkpoint A, all 6 indexed by mid-September.
- **BLOCKING:** publication only; drafting proceeds.
- **ADDED:** 2026-08-12

## 9 · CREATE: domain + hosting for the web surface

- **WHAT:** Buy a domain (or confirm one you own) and create a free-tier hosting account (recommendation: Cloudflare Pages or Netlify — both free, both fine for a static site). Also create a Google Search Console account and verify the domain.
- **WHY:** The six SEO pages and the challenge join page need a real domain; indexing lag is the whole reason the plan wants them live by mid-September.
- **HOW:** Domain: any registrar (~£10/yr). Hosting: https://pages.cloudflare.com or https://app.netlify.com. Search Console: https://search.google.com/search-console → add property → DNS verify.
- **BLOCKING:** publication + Search Console submission. Site builds and previews locally without it.
- **ADDED:** 2026-08-12

## 10 · CONFIRM: production Supabase project

- **WHAT:** Confirm whether a production Supabase project exists (vs local only). If not: create one at https://supabase.com/dashboard, then I need its URL + anon key in `.env` (never the service-role key in anything client-side) before migrations can be applied — with your explicit go-ahead per repo rules.
- **WHY:** Nothing can ship to a stranger without a hosted backend. All 70 migrations are ready; applying them to production needs your approval.
- **BLOCKING:** any live launch step; not blocking local build.
- **ADDED:** 2026-08-12
