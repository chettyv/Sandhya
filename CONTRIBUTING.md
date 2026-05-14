# Contributing

This is a private build. The conventions below exist so the repo stays coherent as it grows and so CI catches the common mistakes before they cost time.

## Branches

- `main` — always green. Every commit on `main` passes CI.
- `feat/<short-name>` — new functionality.
- `fix/<short-name>` — bug fix.
- `chore/<short-name>` — tooling, deps, docs, refactor with no behavioural change.
- `content/<short-name>` — pure corpus additions / edits (no code changes).

Keep branches short-lived. If a branch lives longer than a week, it almost certainly should be broken up.

## Commits

We use [Conventional Commits](https://www.conventionalcommits.org/) and `commitlint` enforces it on every commit.

Format:

```
<type>(<scope>): <subject>

[optional body]
[optional footer]
```

Allowed `<type>`: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`, `content`.

Allowed `<scope>`: `repo`, `mobile`, `admin`, `rag`, `content-tools`, `shared-types`, `supabase`, `ci`, `deps`.

Subject is lowercase, imperative, no trailing period. Examples:

- `feat(rag): add cached_answers lookup before classifier call`
- `fix(supabase): correct rls policy on conversations`
- `chore(repo): bump typescript to 5.7.2`
- `content(repo): add isha upanishad`

## Pull requests

1. Branch from `main`.
2. Make the smallest change that solves the problem. Avoid drive-by refactors.
3. Run `pnpm typecheck && pnpm lint && pnpm format:check && pnpm test` locally before pushing.
4. Open a PR against `main`. Title follows the same format as the commit subject.
5. CI must be green before merge. No exceptions.
6. Prefer squash-merge; the squash commit message should still be Conventional-Commits compliant.

## Pre-commit hooks

Installed automatically by `pnpm install` (via Husky's `prepare` script). They run:

- `lint-staged` → on every staged file:
  - **`secretlint`** — scans for API keys, tokens, and project-specific secret patterns (Supabase, Anthropic, OpenAI, Google, RevenueCat). Configured in `.secretlintrc.json`.
  - `eslint --fix` on TS/JS files
  - `prettier --write` on TS/JS and JSON/MD/YAML files
- `commitlint` → validates commit messages

Do not bypass them (`--no-verify`) unless explicitly approved. If secretlint flags a false positive on a known-safe value, add the file or the specific line to `.secretlintignore` (create it if missing) — do not commit by skipping the hook.

## Hard rules (from `CLAUDE.md` — apply to humans and AI alike)

- **No LLM calls from the mobile client.** All AI traffic goes through Supabase Edge Functions.
- **RLS required** on every user-scoped table. Never disable, even temporarily, on a shared environment.
- **No invented scripture citations.** RAG answers cite only what was actually retrieved.
- **No single tradition as "the correct one."** Note variation explicitly.
- **No corpus material without licensing tracked.** Public-domain, original, or explicit permission — recorded per row.
- **Quota and safety gates are server-side.** Never bypassed in committed code, even for testing.
- **No re-embedding the corpus without explicit approval.** It is expensive and changes retrieval behaviour.
- **No new permissions in `app.json`** without explicit approval.
- **No bumping minimum iOS/Android versions** without explicit approval.
