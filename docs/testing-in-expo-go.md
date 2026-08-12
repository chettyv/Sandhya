# Testing the app in Expo Go

## The short version

```bash
cd apps/mobile
npx expo start
```

Install **Expo Go** from the App Store / Play Store on your phone, make sure phone and laptop are on the same Wi-Fi, then scan the QR code the terminal prints (iPhone: Camera app; Android: scan from inside Expo Go). The app loads in ~30s; edits hot-reload.

If the QR won't connect (hotel/office Wi-Fi, VPN): run `npx expo start --tunnel` instead — slower but works across networks.

## What works in Expo Go vs what doesn't

| Works                                                                         | Doesn't (needs a dev build)                                                                       |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| All screens, navigation, content, shloka bank, challenge screens              | **Purchases** — react-native-purchases is a native module; purchase buttons will error in Expo Go |
| Supabase auth + data (if `.env` has `EXPO_PUBLIC_SUPABASE_URL` / `_ANON_KEY`) | **Push notifications** — partial in Expo Go; real behaviour needs a dev build                     |
| Reminders UI, journal, saved items (local)                                    |                                                                                                   |

Without Supabase env vars the app still runs fully offline on the bundled catalog — sign-in and Ask will show their "unavailable" states, which is expected.

## When you need the real native build (dev client)

Purchases and push need a development build instead of Expo Go:

```bash
cd apps/mobile
npx expo run:android
```

(or `run:ios` on a Mac). Same QR/reload workflow afterwards, but with all native modules present. You don't need this until testing payments or push — Expo Go covers everything else.

## Web preview (no phone needed)

```bash
cd apps/mobile
npx expo start --web
```
