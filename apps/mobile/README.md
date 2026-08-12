# Dharma Daily mobile

Production-oriented Expo + React Native frontend for iOS, Android, and web preview.

## App structure

- **Home** — daily reflection, a gentle practice, journal prompt, upcoming festival, and learning shortcuts
- **Calendar** — browsable festival calendar with explicit location/tradition caveats
- **Ask** — structured, source-grounded Ask Dharma experience backed by the Supabase `ask` Edge Function, with streaming retrieval/generation status and a JSON fallback
- **Explore** — sacred-text catalog, concepts, deities, practice guides, festivals, and search
- **Journey** — saved items, private journal, practice continuity, and account access

Supporting routes cover onboarding, reflection, festival, concept, deity, guided-practice details, practice history, profile, settings, saved items, conversation history, journal, subscription status, account-data export, and Supabase email/password, magic-link, and social authentication with password recovery.

## Run locally

From the repository root:

```bash
pnpm --filter @dharma-daily/mobile start
pnpm --filter @dharma-daily/mobile android
pnpm --filter @dharma-daily/mobile ios
pnpm --filter @dharma-daily/mobile web
```

For native purchase and push testing, create a development build with the included `eas.json`; Expo Go is only suitable for the web/local UI loop, not real store purchases or Android remote push.

## Environment

Copy the relevant public values into the root `.env` or an Expo-compatible local environment file:

```text
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EXPO_PUBLIC_EAS_PROJECT_ID=your-eas-project-id
EXPO_PUBLIC_SUPPORT_EMAIL=
EXPO_PUBLIC_PRIVACY_URL=
EXPO_PUBLIC_TERMS_URL=
EXPO_PUBLIC_REVENUECAT_API_KEY_IOS=your-public-ios-sdk-key
EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID=your-public-android-sdk-key
```

These values are safe for the client only when Supabase RLS and Edge Function authentication are configured correctly. Never expose the service-role key or any LLM key.

Set the support email and public Privacy/Terms URLs before any store submission; the blank values above intentionally keep an unconfigured build from promising unreachable support or legal pages.

The EAS `production` profile fails configuration when any of those public values,
the Supabase connection, RevenueCat platform keys, or native notification/build
packages are missing. Local web preview and non-production development profiles
remain available with the fallback catalog.

Without the public Supabase values, the fallback curated frontend remains browsable; sign-in and Ask Dharma display clear connection guidance instead of fabricated answers. With Supabase configured, the home, calendar, explore, detail, saved, journal, profile, subscription-status, and Ask flows read/write through the authenticated backend where supported.

The main learning tabs disclose whether the catalog is fully connected, partially connected, or using the offline app-authored fallback so missing live content is not presented as a complete source library.

## Store and notification setup

The app keeps the free tier server-enforced at five Ask Dharma messages per day. Plus entitlement state is read from `subscription_status`, which is updated by the RevenueCat webhook. Configure RevenueCat products, public iOS/Android SDK keys, the webhook signing secret, the server-only `REVENUECAT_API_KEY` (used to reconcile restore-to-another-account transfers), and the Supabase Edge Functions before enabling store checkout in a development build.

Daily reflection delivery also needs an Expo push token from a native development/production build, the `device_push_tokens` migration, `register-push-token`, the scheduled `send-daily-reflections` function, and `EXPO_ACCESS_TOKEN`. Festival reminders are local, one-time notifications scheduled from a festival detail page. Do not test remote push claims in Expo Go on Android SDK 53+.

The native packages are declared in `apps/mobile/package.json`: `expo-dev-client` for development builds, `expo-notifications` for reminders/push tokens, and `react-native-purchases` for store checkout. Install them from the repository root before creating a native build, then run `pnpm install` so the lockfile and workspace are in sync. The web adapter remains deliberately inert; native builds use remote delivery when the authenticated token registration succeeds and an on-device scheduled reminder as a fallback.

RevenueCat also needs matching monthly, annual, and lifetime products attached to a current offering, with the `plus_monthly`, `plus_annual`, or `lifetime` product naming convention used by the webhook. Configure the webhook signing secret and point it at the deployed `revenuecat-webhook` function. Store product identifiers and prices come from RevenueCat; they are not hard-coded into the app.

## Quality checks

```bash
node scripts/verify-content-catalog.mjs
pnpm --filter @dharma-daily/mobile typecheck
pnpm --filter @dharma-daily/mobile lint
pnpm --filter @dharma-daily/mobile build
```

The data in `src/data/content.ts` and `src/data/appAuthoredCatalog.ts` is a safe presentation fallback: 50 concept introductions, 20 practice guides, 21 festival explainers, and 30 rotating reflections. These entries are original educational copy, not scripture quotations or a substitute for source review. Festival guides without a verified date are intentionally read-only; they cannot schedule a reminder. Authored preview dates are also synchronized into the generated Supabase catalog migration, while production calendar coverage still requires reviewed, location-aware calculations or precomputed dates. All source-linked content must pass the repository licensing tracker.
