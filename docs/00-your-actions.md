# Founder actions — live list

Things only you can do. Items are deleted when resolved, not marked done. Categories: (1) accounts/keys, (2) decisions, (3) real-world testing, (4) authentic content. Open questions for you also live here — nothing blocks on them.

---

## 0 · READ: two new notes written for you

- **[docs/SOURCES-AND-ATTRIBUTION.md](SOURCES-AND-ATTRIBUTION.md)** — everything collected so far (242 sources staged on this machine), what attribution each class needs, which rows you can flip to approved now (pre-1929 translations + Sanskrit originals), and the short list of things only you can obtain (publisher permissions for modern translations; preferred editions). Corpus collection continues from the existing queue scripts listed there.
- **[docs/testing-in-expo-go.md](testing-in-expo-go.md)** — how to run the app on your phone today. Purchases/push need a dev build; everything else works in Expo Go (startup is now guarded so the missing purchases module can't crash it).
- **ADDED:** 2026-08-12

## 0b · ANSWER (when convenient, not blocking): what is "our qu"?

- **WHAT:** Your message said "our word banks or qu hella work" — I read "word banks" (built: word-by-word shloka gloss) and "shloka banks" (built), but couldn't decode "qu". If it means **quizzes**, say so and I'll design a reviewed-content quiz layer; if it means the **Ask/questions** feature, that's the scoped-AI work already queued.
- **ADDED:** 2026-08-12

## 1 · CREATE: Apple Developer + Google Play Console accounts — **START TODAY, longest lead time in the plan**

- **WHAT:** (a) Apple Developer Program, individual enrolment, $99/yr — https://developer.apple.com/programs/enroll/. (b) Google Play Console, personal account, $25 one-off — https://play.google.com/console/signup.
- **WHY:** You chose IAP as the payment rail, so the app must be **live in both stores before 11 October**. Apple enrolment takes ~2 days; **Google Play personal accounts must run a closed test with 12 testers for 14 consecutive days before they may publish to production** — that alone means the Android closed test must be running by mid-September. This is now the critical path of the whole launch.
- **BLOCKING:** store builds, IAP products, the entire revenue mechanism.
- **ADDED:** 2026-08-12

## 1b · CREATE: RevenueCat account + the challenge product

- **WHAT:** Create a (free-tier) RevenueCat project at https://app.revenuecat.com. After the store accounts exist: create a **non-consumable** in-app product with identifier `dd_challenge_navratri_2026` in App Store Connect (Monetisation → In-App Purchases) and in Play Console (Monetise → Products → In-app products), price tier ≈ £9.99. In RevenueCat: add both store apps, attach the product to a new entitlement `challenge_navratri_2026`, and copy the iOS + Android public SDK keys into `.env` as `EXPO_PUBLIC_REVENUECAT_API_KEY_IOS` / `_ANDROID`, plus the webhook secret as `REVENUECAT_WEBHOOK_SECRET`.
- **WHY:** The code I am building resolves challenge access from product identifiers with this exact prefix (`dd_challenge_<slug>`); the webhook grants participation on purchase.
- **BLOCKING:** end-to-end purchase testing (sandbox first); not blocking the code, which is being built against this contract now.
- **ADDED:** 2026-08-12

## 1c · SET: challenge price

- **WHAT:** Pick the price inside the plan's £8–15 band (my recommendation: £9.99 — a store tier that exists in every country) and tell me, so `price_display` in `content/challenges/navratri-2026/challenge.json` matches the store tier you configure in 1b.
- **BLOCKING:** publishing the challenge; nothing else.
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

## 10 · INSTALL: Docker Desktop + Supabase CLI (local backend testing)

- **WHAT:** Install Docker Desktop (https://www.docker.com/products/docker-desktop/) and the Supabase CLI (`scoop install supabase` or the Windows installer from https://github.com/supabase/cli/releases), then run `supabase start` in the repo once so the local stack exists.
- **WHY:** This machine has no Docker, psql, or supabase CLI, so migrations (including the new challenges schema) pass static security checks but cannot be _executed_ anywhere. Every backend acceptance test — RLS two-user proof, RPC behaviour, quota atomicity — needs a running database.
- **BLOCKING:** live verification of all SQL work; not blocking app-side build.
- **ADDED:** 2026-08-12

## 11 · CONFIRM: production Supabase project

- **WHAT:** Confirm whether a production Supabase project exists (vs local only). If not: create one at https://supabase.com/dashboard, then I need its URL + anon key in `.env` (never the service-role key in anything client-side) before migrations can be applied — with your explicit go-ahead per repo rules.
- **WHY:** Nothing can ship to a stranger without a hosted backend. All 70 migrations are ready; applying them to production needs your approval.
- **BLOCKING:** any live launch step; not blocking local build.
- **ADDED:** 2026-08-12
