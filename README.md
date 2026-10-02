# Sandhya

A free daily learning and practice app built with Expo, React Native, TypeScript,
and Supabase. The core release includes onboarding, daily verses and reflections,
scripture reading, practices, qualified festival guides, saved items, a private
journal, and account settings. The bundled library works offline.

Live AI and challenge purchases are deferred and default off. Subscriptions and
the admin frontend have been retired. The static arrival website is built
separately and remains unhosted.

[CURRENT_SUMMARY.md](CURRENT_SUMMARY.md) is the current product and release status.
[02-plan.md](02-plan.md) records the product decisions;
[docs/technical-launch-contract.md](docs/technical-launch-contract.md) defines
release acceptance. The architecture/schema reference is
[docs/sandhya_build_reference.docx](docs/sandhya_build_reference.docx).

## Repository

| Directory              | Purpose                                                         |
| ---------------------- | --------------------------------------------------------------- |
| apps/mobile            | Expo consumer app for iOS, Android, and web                     |
| apps/web               | Static arrival pages from reviewed content/web Markdown         |
| packages/content-tools | Content validation and generators                               |
| packages/shared-types  | Backend and RAG contracts                                       |
| packages/rag-pipeline  | Deferred AI pipeline and corpus maintenance                     |
| supabase               | Edge Functions, migration history, and operational instructions |
| content                | Editorial source files and challenge definitions                |
| docs                   | Product decisions, source-rights records, and release evidence  |

## Develop

Use Node 22.x (`.nvmrc`) and pnpm 11.0.8 (`packageManager`).

```sh
pnpm install --frozen-lockfile
pnpm --filter @sandhya/mobile start
# Or use the browser:
pnpm --filter @sandhya/mobile web
```

The start script uses Expo Go. For a custom native development build, use
`pnpm --filter @sandhya/mobile start:dev-client`. See
[apps/mobile/README.md](apps/mobile/README.md) for platform setup.

Offline browsing needs no keys. For live auth/sync, put the public Supabase
configuration in `apps/mobile/.env`, or provide it in the process/EAS environment.
Use [.env.example](.env.example) as the configuration reference. Keep server
credentials in the backend environment; never copy them into public variables.

## Verify

```sh
pnpm verify:technical-launch # Local source/build gate; includes frozen install
pnpm typecheck              # Workspace TypeScript
pnpm lint                   # Repository ESLint
pnpm test                   # Meaningful workspace unit/integration tests
pnpm --filter @sandhya/mobile test:smoke # Real route rendering, core/full profiles
pnpm build                  # Packages, mobile web export, static arrival website
pnpm backend:source-check   # Backend source contracts without builds/live writes
pnpm format:check           # Prettier
pnpm secrets:scan           # Secretlint
```

Husky checks staged files and Conventional Commit messages. See
[CONTRIBUTING.md](CONTRIBUTING.md). Content generation and maintenance commands
remain in package.json; migration and deployment procedures live in
[supabase/README.md](supabase/README.md). The launch gate never deploys, applies
production migrations, calls live smoke endpoints, or re-embeds content.

## Release

Local checks can pass while release prerequisites remain open. Track the exact
candidate in [docs/release/technical-launch-checklist.md](docs/release/technical-launch-checklist.md).
The [cleanup report](docs/release/prelaunch-cleanup-2026-10-02.md) records the
branch consolidation, removals, verification, and remaining blockers.

## License

UNLICENSED. Source rights are recorded in
[docs/SOURCES-AND-ATTRIBUTION.md](docs/SOURCES-AND-ATTRIBUTION.md) and the source tracker.
