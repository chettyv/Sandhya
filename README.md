# Sandhya

An AI-powered companion for Hindu learning and daily practice. Mobile (iOS + Android) app backed by a RAG pipeline that grounds every AI answer in a curated, properly-licensed corpus of scripture, commentary, and curated content.

The product is non-sectarian by design (surfaces variation across traditions rather than picking one), refuses to act as guru / priest / doctor / therapist / lawyer (safety gate), and leans on hand-written static content for the everyday surface — AI is the fallback, not the default.

The current product, MVP, branch, and release summary is in [`CURRENT_SUMMARY.md`](CURRENT_SUMMARY.md).
The authoritative architecture, schema, RAG design, and milestone reference remains
[`docs/sandhya_build_reference.docx`](docs/sandhya_build_reference.docx).

## Stack (fixed for v1)

| Layer          | Tool                                                                                       |
| -------------- | ------------------------------------------------------------------------------------------ |
| Mobile         | Expo + React Native + TypeScript (Expo Router, Tamagui or NativeWind)                      |
| Backend        | Supabase (Postgres + Auth + Storage + Edge Functions)                                      |
| Vector store   | Supabase pgvector                                                                          |
| LLM            | Backend-only swappable provider (DeepSeek default; OpenAI-compatible / Anthropic optional) |
| Embeddings     | OpenAI `text-embedding-3-small` (1536-dim)                                                 |
| State (mobile) | TanStack Query + Zustand                                                                   |
| Payments       | RevenueCat                                                                                 |
| Push           | Expo Notifications                                                                         |
| Analytics      | PostHog                                                                                    |
| Errors         | Sentry                                                                                     |
| Builds         | EAS Build + EAS Submit                                                                     |

Hard rules: no LLM calls from the client, no LangChain in v1, no separate vector DB, RLS on every user-scoped table, structured-JSON output only.

## Repo layout

```
Sandhya/
├── apps/
│   ├── mobile/             # Expo consumer app (iOS, Android, web)
│   ├── web/                # Static arrival site built from content/web markdown
│   └── admin/              # Static admin moderation/content console
├── packages/
│   ├── shared-types/       # Cross-package TS types (RAG schema, API contracts)
│   ├── rag-pipeline/       # The RAG pipeline (library + CLI)
│   └── content-tools/      # Content ingestion utilities
├── supabase/
│   ├── migrations/         # SQL migrations
│   └── functions/          # Edge Functions
├── content/                # Source corpus (Markdown), filled by PO
├── .github/workflows/      # CI
├── package.json            # Workspace root
├── pnpm-workspace.yaml
└── tsconfig.base.json
```

## Quickstart (run the app now)

```bash
pnpm install
pnpm --filter @sandhya/mobile start
```

Scan the QR with Expo Go on your phone ([full guide](docs/testing-in-expo-go.md)), or press `w` for the web build. The `start` script forces Expo Go mode (`expo start --go`); a bare `npx expo start` defaults to development-build mode because `expo-dev-client` is installed, and its QR cannot be opened by a phone that has no development build. The app is pinned to Expo SDK 54 — the last SDK the App Store build of Expo Go runs ([details](apps/mobile/README.md#run-locally)). The app runs fully offline on the bundled catalog; add `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` to `.env` for auth + live data.

## Prerequisites

- **Node 22 LTS** — pinned in `.nvmrc`. The package.json `engines.node` is `>=22.0.0 <23`.
- **pnpm 11** — pinned in `package.json` `packageManager`. Install with `winget install pnpm.pnpm` (Windows), `brew install pnpm` (macOS), or `npm i -g pnpm@11`.
- **git** with line-ending mode set sensibly (`core.autocrlf=input` on Windows is fine).

Optional tooling:

- Supabase CLI (`npm i -g supabase`)
- Expo CLI (bundled with the `apps/mobile` install)
- A static-site host for `apps/admin/dist/` (Vercel, Cloudflare Pages, or equivalent)
- EAS CLI (`npm i -g eas-cli`)

## Setup

```bash
# 1. Clone
git clone <repo-url> sandhya
cd sandhya

# 2. Install deps for every workspace
pnpm install

# 3. Copy and fill the env file
cp .env.example .env
# Edit .env — see comments in the file for what each var means.

# 4. Run the standard checks
pnpm typecheck
pnpm lint
pnpm test
```

Husky hooks are installed automatically by the `prepare` script that runs after `pnpm install`. They run `lint-staged` on staged files at pre-commit and run `commitlint` on the commit message.

## Common commands

```bash
pnpm build          # Build every workspace
pnpm typecheck      # Typecheck every workspace
pnpm lint           # ESLint across the repo
pnpm format         # Prettier write
pnpm format:check   # Full Prettier check
pnpm format:check:changed # Changed-file check used by CI
pnpm test           # Vitest in every workspace
pnpm secrets:scan   # secretlint over the whole repo (also runs on staged files pre-commit)

# Per-package, e.g.:
pnpm --filter @sandhya/shared-types build
pnpm --filter @sandhya/rag-pipeline test
```

## Environment variables

See `.env.example`. Every variable is documented inline. Two ground rules:

1. **Anything without an `EXPO_PUBLIC_` prefix is server-only.** It must never be imported from `apps/mobile`. Doing so leaks the value into the app bundle.
2. **`EXPO_PUBLIC_*` is visible to anyone with the binary.** Only public keys (Supabase anon, RevenueCat public, PostHog, Sentry DSN) go there.

## Current product status

✅ Built in the current product slice:

- pnpm monorepo with Node 22 / pnpm 11 pinning
- TypeScript strict (`tsconfig.base.json`)
- ESLint (flat config) + Prettier shared configs
- Husky + lint-staged + commitlint (Conventional Commits)
- Vitest wired into every real package (`pnpm test` runs with `--passWithNoTests`)
- Compiling `shared-types`, `rag-pipeline`, and `content-tools` packages
- Expo mobile app with onboarding, home, calendar, explore (including deity entries), Ask Dharma,
  conversation history, festival reminders, journal, saved items, account settings, legal copy,
  and subscription paywall UX
- Supabase-authenticated conversations, server-enforced free quota, RevenueCat
  webhook state, premium-content RLS, push-token registration, and daily delivery
- Curated-content fallback for local browsing plus production table adapters
- Dependency-free admin console for OTP sign-in, feedback review, and allowlisted
  curated-content CRUD through protected Edge Functions
- GitHub Actions CI: typecheck, lint, format check, test, commitlint
- Documented `.env.example`

⏳ Still required before public store launch:

- Run Supabase migrations and populate only licensed, reviewed production content
- Create RevenueCat products/entitlements and configure App Store / Play Store
  credentials, webhook signing, the server-only subscriber API key for transfer
  reconciliation, and public SDK keys
- Install declared native packages with a network-enabled `pnpm install`, create
  an EAS development build, and test purchases and push delivery on physical devices
- Add production support/privacy URLs, mobile analytics/error DSNs, backend
  telemetry secrets, and store metadata. The mobile telemetry adapter is opt-in,
  emits only anonymous lifecycle/error events, and excludes prompts, answers,
  tokens, emails, and user IDs.
- Configure and host the admin console, then assign the admin role only to approved
  operators; continue editorial, theological, regional, and safety review

## License

UNLICENSED. All rights reserved. Source content licensing is tracked per-source in the corpus metadata (see `content/README.md`).
