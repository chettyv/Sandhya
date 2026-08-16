# Founder actions — live list

Mission-critical first: accounts and keys only you can create, in the order they unblock the app. Resolved items get deleted. Parked items live at the bottom so they don't clutter the critical path.

---

## MISSION-CRITICAL — in order

### 1 · Supabase production project (~15 min) — unblocks auth, sync, Ask

- **WHAT:** Create a project at https://supabase.com/dashboard (free tier is fine to start; pick the region closest to your users, e.g. London). Then copy into `.env`:
  - Project URL → `EXPO_PUBLIC_SUPABASE_URL` (Settings → API → Project URL)
  - anon public key → `EXPO_PUBLIC_SUPABASE_ANON_KEY` (Settings → API → anon key)
  - service_role key → `SUPABASE_SERVICE_ROLE_KEY` (same page — server-side only, never ships in the app)
- **THEN:** tell me "apply migrations" — I run all of them against it (your explicit approval is required by repo rules). Without this the app still runs fully offline on the bundled verse bank; with it you get accounts, sync, and challenge unlock.
- **STATUS 12 Aug (Stream B):** `.env` already carries Supabase-looking values (project ref, URL, service key, DB password) — if that project is real and yours, the words "apply migrations" are all that's left of this item. The six production-build keys (`EXPO_PUBLIC_EAS_PROJECT_ID`, both RevenueCat keys, support email, privacy/terms URLs) are appended to the bottom of `.env` as empty PASTE-HERE lines; dev/preview builds run without them.
- **ADDED:** 2026-08-12

### 2 · Expo account + EAS project (~10 min) — unblocks phone builds beyond Expo Go

- **WHAT:** Create an account at https://expo.dev (free). Run `npx eas init` in `apps/mobile` while logged in (`npx expo login`) — it creates the project and prints the project ID → `EXPO_PUBLIC_EAS_PROJECT_ID` in `.env`.
- **WHY:** Expo Go covers daily testing today ([guide](testing-in-expo-go.md)); EAS is needed for real device builds, push notifications, and store submission.
- **ADDED:** 2026-08-12

### 3 · AI provider keys (~10 min) — unblocks Ask Dharma (needs #1 first)

- **WHAT:** Two keys, both server-side (Supabase Edge Function secrets, never in the app):
  - **DeepSeek** (default answer model, cheapest): https://platform.deepseek.com → API Keys → `DEEPSEEK_API_KEY`
  - **OpenAI** (embeddings only, required for retrieval): https://platform.openai.com/api-keys → `OPENAI_API_KEY`
- **ALSO:** set a monthly spend alert in both dashboards (£10 is plenty at launch; the backend has its own budget cap via `LLM_MONTHLY_BUDGET_USD`).
- **BLOCKING:** only the Ask feature; everything else works without these.
- **ADDED:** 2026-08-12

### 4 · Apple Developer + Google Play accounts — **longest lead time, start when store launch is in sight**

- **WHAT:** Apple Developer Program, individual, $99/yr — https://developer.apple.com/programs/enroll/ (~2 days). Google Play Console, $25 once — https://play.google.com/console/signup.
- **WHY:** The only way onto real users' phones. **Play personal accounts must run a 12-tester closed test for 14 straight days before production** — that clock can't be compressed, so open the account well before you want to launch.
- **ADDED:** 2026-08-12

### 5 · Support email + privacy/terms URLs (~30 min) — store submission requirement

- **WHAT:** (a) A monitored email (e.g. a sandhya@ alias) → `EXPO_PUBLIC_SUPPORT_EMAIL` in `.env`. (b) Both stores require a public privacy-policy URL: no domain needed — a free GitHub Pages URL from this repo works. Say the word and I'll draft the privacy policy + terms from what the app actually collects and set up the Pages deploy; you review before it goes live.
- **ADDED:** 2026-08-12

### 6 · Sentry + PostHog projects (~15 min, optional at launch)

- **WHAT:** https://sentry.io (free tier) → DSN → `EXPO_PUBLIC_SENTRY_DSN` and `SENTRY_DSN_BACKEND`. https://posthog.com (free tier) → project API key → `EXPO_PUBLIC_POSTHOG_KEY`. Analytics events are already wired and consent-gated; without keys they simply no-op.
- **ADDED:** 2026-08-12

---

## PARKED — not on the critical path

- **Domain + arrival website.** The product is the app; the six SEO pages are a free acquisition channel for _later_. When you want them live: any registrar (~£10/yr) + Cloudflare Pages (free) + Search Console. Not needed to ship the app.
- **RevenueCat + store IAP products.** Payments are off (free launch). Before reactivating: re-audit sources for commercial rights (docs/SOURCES-AND-ATTRIBUTION.md) — sanskritdocuments texts need written permission (Sanskrit@cheerful.com) or re-sourcing from Wikisource.
- **Navratri challenge content** (nine sessions, reviewer, audio) — plan v2's revenue mechanism; parked with payments. Format and validator are ready in `content/challenges/` whenever you want it.
- **Docker Desktop + Supabase CLI** — lets me run migrations/RLS tests locally before production. Useful, not blocking (item 1 gives a real database).
- **Git history rewrite** to shrink the repo (~123 MiB pack) — housekeeping; say "rewrite approved" if wanted.
- **Spot-check the blanket-approved content** — everything live under "I approve everything" is listed per cycle in docs/03-progress.md; pull anything you'd word differently.
- **Keyword volumes / community self-promotion rules** — arrival work, whenever distribution becomes the focus.
