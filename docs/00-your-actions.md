# Founder actions — current setup checklist

This is the simple, beginner-friendly checklist for setting up Sandhya. Follow the current checklist first. The older action queue is kept below for historical context and may contain superseded priorities.

Last updated: 18 August 2026

## Current decisions

| Area                | Decision                                   |
| ------------------- | ------------------------------------------ |
| Launch              | Free launch                                |
| Supabase            | Set up for authentication and syncing only |
| EAS project/build   | Project linked; device build later         |
| Apple/Google stores | Not now                                    |
| Content             | Keep improving and expanding               |
| Audio               | Not now                                    |
| Payments/RevenueCat | Not now                                    |
| Website/domain      | Not now                                    |
| Sentry/PostHog      | Not now                                    |

## What access is needed

- Local coding, content, validation, tests, and generators need no MCP or plugin access.
- Supabase can be connected through the Supabase plugin, or I can use the confirmed local project configuration. Do not send keys or passwords in chat.
- EAS is linked to the existing Expo project under `chettyvs-team`; no MCP connection is required.
- GitHub and Cloudflare access are only needed when the website is intentionally hosted.
- Sentry and PostHog access are only needed when monitoring is intentionally enabled.

## 1. Verify the correct Supabase project

Do not create a second project yet. The repository already has a local Supabase configuration.

### You do

1. Open <https://supabase.com/dashboard>.
2. Sign in.
3. Open the project you believe is Sandhya's project.
4. Look at the browser address. It should contain:

   `supabase.com/dashboard/project/PROJECT_REFERENCE`

5. Open the local `.env` file in the repository.
6. Compare the project reference in the browser address with `SUPABASE_PROJECT_REF`.
7. In Supabase, open **Project Settings → API**.
8. Compare the **Project URL** with both `EXPO_PUBLIC_SUPABASE_URL` and `SUPABASE_URL`.
9. Compare the public/anon key with both `EXPO_PUBLIC_SUPABASE_ANON_KEY` and `SUPABASE_ANON_KEY`.
10. Open **Table Editor**.
11. If the project contains unrelated personal or business data, stop and report it.
12. Do not create tables manually and do not paste any key or password into chat.

The local configuration has already passed a safe internal consistency check: the URLs match, the public keys match, the project reference matches the URL, and HTTPS is used. The dashboard check is still needed to confirm that the project is actually yours.

Reply with this, without including secrets:

```text
Supabase project name:
Project reference:
Project URL matches .env: yes/no
Unrelated data in project: yes/no
Use: auth and sync only
```

### I do

After confirmation, I will:

1. Check the remote migration history.
2. Preview the database changes.
3. Tell you what will be created.
4. Wait for explicit approval.
5. Apply the migrations.
6. Check the tables and indexes.
7. Check that user tables have Row Level Security enabled.
8. Check that vector search is available.
9. Run the backend checks.

See [supabase/migrations/migration_checklist.md](C:/Users/vaibh/Documents/GitHub/DharmaDaily/supabase/migrations/migration_checklist.md). Supabase's documented deployment flow is to link the project, preview migrations, and push the migration files rather than manually creating production tables: <https://supabase.com/docs/guides/deployment/database-migrations>.

## 2. Turn on simple email login

### You do

1. In Supabase, open **Authentication**.
2. Open **Providers**.
3. Make sure **Email** is enabled.
4. Leave Apple and Google login disabled for now.
5. Open **URL Configuration**.
6. Add this redirect URL:

   `sandhya://auth/callback`

7. Do not change the website URL yet.

Supabase requires mobile redirect URLs to be added to the allowed list: <https://supabase.com/docs/guides/auth/redirect-urls>.

### I do

I will test account creation, email confirmation, sign-in, sign-out, password reset, guest access, saved-item syncing, journal syncing, and preference syncing.

## 3. AI setup

Do not set up AI yet. Free launch can use offline content and optional account syncing without AI keys.

If AI is enabled later, the keys must be server-side Supabase secrets, never mobile-app variables: `OPENAI_API_KEY`, the selected answer-provider key, `SUPABASE_SERVICE_ROLE_KEY`, and `LLM_MONTHLY_BUDGET_USD`. Do not send these values in chat.

## 4. EAS project — set up; real phone build later

The Expo account and EAS project are now connected:

- Expo account/team: `chettyvs-team`
- Expo project: `Sandhya` / `sandhya`
- EAS project ID: stored in `apps/mobile/app.json` and the local `.env`
- App owner: `chettyvs-team`

No cloud build has been started. When native testing is needed, I will run a development build after the local EAS CLI login is available, then we will install it on a phone and test native features.

## 5. Apple and Google stores — not now

There is nothing for you to do now. Later: create the developer accounts, create app records, create signing credentials, build and test on real phones, complete Google's closed-test requirement, prepare listings, and submit only after explicit approval.

## 6. Content — active work

You do not need to provide more information now. I will continue improving explanations, tradition notes, regional differences, scripture units, daily reflections, practice guides, concepts, prayers, stotras, Hindi layers, and additional languages where sources are reliable.

After each batch I will validate the content, regenerate the content bank, run tests, and preserve draft/approved status. Rights and source information remain tracked in [docs/PERMISSIONS-NEEDED.md](C:/Users/vaibh/Documents/GitHub/DharmaDaily/docs/PERMISSIONS-NEEDED.md). Free launch does not remove the need to clear commercial rights before payments are ever enabled.

## 7. Audio — not now

There is nothing for you to do now. Later, audio will require approved recordings, an audio player, slow playback, repeat-after-me playback, and physical-device testing.

## 8. Payments and RevenueCat — not now

Keep payments disabled. Later, if paid access is approved: recheck commercial rights, create Apple/Google products, configure RevenueCat, connect products to entitlements, add server secrets, configure signed webhooks, test sandbox purchase/refunds/restores, and enable payments only after all tests pass.

## 9. Website and domain — not now

There is nothing for you to do now. Later: choose a domain, connect GitHub and Cloudflare Pages, publish the existing pages, add privacy and terms URLs, add Search Console, and test every page on mobile. The website is an acquisition channel, not a requirement for the free app launch.

## 10. Sentry and PostHog — not now

There is nothing for you to do now. Later: create the projects, save the DSN/key/host locally, tell me `Telemetry ready`, and I will connect and verify that private questions, answers, emails, tokens, and journal entries are not sent.

## What to do now

The Supabase setup and EAS project link are complete. Everything else is either handled by me locally or deliberately deferred.

---

## Historical founder action queue

The older queue below is retained for context. The current free-launch checklist above takes priority.

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
