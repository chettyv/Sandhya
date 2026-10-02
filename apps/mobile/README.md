# Sandhya mobile

Expo SDK 54, React Native 0.81.5, Expo Router, NativeWind, TanStack Query,
Zustand, and Supabase. The free core profile includes Today, reading, practices,
Calendar, Explore, Journey, saved items, journal, onboarding, and account settings.
Live AI and the unpublished finite challenge are deferred. Subscriptions are retired.

## Local development

Run from the repository root with Node 22.x and pnpm 11.0.8:

```sh
pnpm install --frozen-lockfile
pnpm --filter @sandhya/mobile start # Expo Go
pnpm --filter @sandhya/mobile web
pnpm --filter @sandhya/mobile start:dev-client # Custom native development build
```

Android and iOS scripts also select Expo Go. The development client is needed
for native purchase and remote notification testing; use the profiles in eas.json.
The iOS simulator requires macOS. Keep the SDK pinned while preparing this release.

## Configuration

Offline browsing works without credentials. For auth and account sync, provide
public Supabase values in apps/mobile/.env or the process/EAS environment.
The root [.env.example](../../.env.example) lists the variables; Expo loads
local environment files from this app's directory.

Production configuration requires the Supabase URL/anon key, EAS project ID,
support email, and public Privacy/Terms URLs. RevenueCat platform keys are required
only when payments are explicitly enabled. The core profile leaves payment SDK
initialization off. Server secrets belong only in the backend environment.

Public feature flags are read with explicit process.env.EXPO*PUBLIC*\* references
so Expo can inline them into the bundle. Do not pass process.env wholesale to a
runtime feature parser. Backend policy independently controls live APIs.

## Native services

Daily reminders use expo-notifications. Remote delivery needs a native build,
authenticated device-token registration, the scheduled backend sender, and its
server configuration. Festival guides without a verified local date cannot schedule
reminders. Notification routing must be checked on signed devices.

The historical subscription entitlement schema and webhook remain for compatibility.
A future finite challenge uses one-off RevenueCat products named
sandhya*challenge*<slug-with-underscores>. Complete its publication and sandbox
purchase/restore gates before enabling checkout. No subscription storefront remains.

## Verification

```sh
pnpm --filter @sandhya/mobile typecheck
pnpm --filter @sandhya/mobile test
pnpm --filter @sandhya/mobile test:smoke
pnpm --filter @sandhya/mobile build # Production web export
pnpm verify:technical-launch # Full repository source/build gate
```

The bundled bank has 661 units. App-authored fallback explanations include
50 concepts, 20 practices, 21 festivals, and 30 reflections. These explanations
are original educational copy; content readiness, reviewed translations, human audio,
and live/device evidence remain recorded in the
[release checklist](../../docs/release/technical-launch-checklist.md).
