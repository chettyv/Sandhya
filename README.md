# Dharma Daily

An AI-powered companion for Hindu learning and daily practice. Mobile (iOS + Android) app backed by a RAG pipeline that grounds every AI answer in a curated, properly-licensed corpus of scripture, commentary, and curated content.

The product is non-sectarian by design (surfaces variation across traditions rather than picking one), refuses to act as guru / priest / doctor / therapist / lawyer (safety gate), and leans on hand-written static content for the everyday surface — AI is the fallback, not the default.

For the full product spec see `dharma_daily_build_reference.docx`. For the build plan see `dharma_daily_developer_plan.docx`.

## Stack (fixed for v1)

| Layer          | Tool                                                                            |
| -------------- | ------------------------------------------------------------------------------- |
| Mobile         | Expo + React Native + TypeScript (Expo Router, Tamagui or NativeWind)           |
| Backend        | Supabase (Postgres + Auth + Storage + Edge Functions)                           |
| Vector store   | Supabase pgvector                                                               |
| LLM            | Anthropic Claude (default) via a swappable provider interface (OpenAI / Gemini) |
| Embeddings     | OpenAI `text-embedding-3-small` (1536-dim)                                      |
| State (mobile) | TanStack Query + Zustand                                                        |
| Payments       | RevenueCat                                                                      |
| Push           | Expo Notifications                                                              |
| Analytics      | PostHog                                                                         |
| Errors         | Sentry                                                                          |
| Builds         | EAS Build + EAS Submit                                                          |

Hard rules: no LLM calls from the client, no LangChain in v1, no separate vector DB, RLS on every user-scoped table, structured-JSON output only.

## Repo layout

```
DharmaDaily/
├── apps/
│   ├── mobile/             # Expo app — scaffolded in Phase 6
│   └── admin/              # Next.js admin dashboard — scaffolded in Phase 8
├── packages/
│   ├── shared-types/       # Cross-package TS types (RAG schema, API contracts)
│   ├── rag-pipeline/       # The RAG pipeline (library + CLI) — Phase 4
│   └── content-tools/      # Content ingestion CLI — Phase 3
├── supabase/
│   ├── migrations/         # SQL migrations (Phase 2)
│   └── functions/          # Edge Functions (Phase 5)
├── content/                # Source corpus (Markdown), filled by PO
├── .github/workflows/      # CI
├── package.json            # Workspace root
├── pnpm-workspace.yaml
└── tsconfig.base.json
```

## Prerequisites

- **Node 22 LTS** — pinned in `.nvmrc`. The package.json `engines.node` is `>=22.0.0 <23`.
- **pnpm 11** — pinned in `package.json` `packageManager`. Install with `winget install pnpm.pnpm` (Windows), `brew install pnpm` (macOS), or `npm i -g pnpm@11`.
- **git** with line-ending mode set sensibly (`core.autocrlf=input` on Windows is fine).

Optional, added in their respective phases:

- Supabase CLI — Phase 2 (`npm i -g supabase`)
- Expo CLI — Phase 6 (bundled with the `apps/mobile` install)
- Vercel CLI — Phase 8 (for admin deploys)
- EAS CLI — Phase 6 (`npm i -g eas-cli`)

## Setup

```bash
# 1. Clone
git clone <repo-url> dharma-daily
cd dharma-daily

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
pnpm format:check   # Prettier check (CI uses this)
pnpm test           # Vitest in every workspace
pnpm secrets:scan   # secretlint over the whole repo (also runs on staged files pre-commit)

# Per-package, e.g.:
pnpm --filter @dharma-daily/shared-types build
pnpm --filter @dharma-daily/rag-pipeline test
```

## Environment variables

See `.env.example`. Every variable is documented inline. Two ground rules:

1. **Anything without an `EXPO_PUBLIC_` prefix is server-only.** It must never be imported from `apps/mobile`. Doing so leaks the value into the app bundle.
2. **`EXPO_PUBLIC_*` is visible to anyone with the binary.** Only public keys (Supabase anon, RevenueCat public, PostHog, Sentry DSN) go there.

## What is built / not built (Phase 1)

✅ Built in Phase 1 (this commit):

- pnpm monorepo with Node 22 / pnpm 11 pinning
- TypeScript strict (`tsconfig.base.json`)
- ESLint (flat config) + Prettier shared configs
- Husky + lint-staged + commitlint (Conventional Commits)
- Vitest wired into every real package (`pnpm test` runs with `--passWithNoTests`; real tests arrive alongside real code in Phases 2–4)
- Three real packages compiling: `shared-types` (with the structured-answer types), `rag-pipeline` and `content-tools` (skeletons)
- App and Supabase placeholders pointing at the phase that owns them
- GitHub Actions CI: typecheck, lint, format check, test, commitlint
- Documented `.env.example`

⏳ Deliberately deferred (not Phase 1):

- Database schema, migrations, RLS — **Phase 2**
- Content ingest CLI — **Phase 3**
- RAG pipeline implementation, eval harness — **Phase 4**
- Edge Functions API — **Phase 5**
- Expo mobile app — **Phase 6**
- RevenueCat paywall — **Phase 7**
- Next.js admin — **Phase 8**

## License

UNLICENSED. All rights reserved. Source content licensing is tracked per-source in the corpus metadata (see `content/README.md`).
