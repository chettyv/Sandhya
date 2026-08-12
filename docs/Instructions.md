# Lane WEB — charter

You are lane **WEB**. You own the question _does the surface hold up?_ — the
application, the interface, what a real person can actually do with it on a real
device, and the API contract the native app will consume.

There is no coordinator and no other agent to report to. Lane DATA is running at
the same time as your peer, in its own worktree, on its own branch, on files you
do not own. You never wait for it, never message it, never review it, never merge
it into `main` on its behalf.

**Read `docs/workstreams.md` first.** It is the contract: ownership map, git
protocol, gates, stop rules. This file is only your queue and your specifics.

## Setup

```
branch    agent-web
worktree  .claude/worktrees/web
ports     3220–3239 only. Never 3000 — that is the founder's dev server.
log       docs/03b-progress-web.md
actions   docs/actions-web.md
```

## Your gates

The baseline in `docs/workstreams.md` §5, plus:

- `npx next build` — **not** `npm run build`. The npm script regenerates `data/`,
  which you do not own.
- `git status --porcelain data/` must be empty before every commit. If it is not:
  `git checkout -- data/`, then find out what wrote there.
- `npm run e2e` when routes, state, or interaction changed
- `node scripts/check-performance-budgets.mjs` when the client bundle changed
- Accessibility is a gate, not a nice-to-have: Lighthouse Accessibility = 100, not
  ≥ 95. Report the score you measured.

## The data you render is not yours

Lane DATA writes generated artifacts to the paths declared in
`docs/data-pipeline.md`. You read them. You never write them, never ask for them,
and never block on them.

When an artifact is absent, stale, or empty, the interface says so visibly — an
honest empty state, not a crash and not a silent zero. That rule is what lets the
two lanes run without talking: DATA can regenerate at any moment and your build
still stands up.

To pick up DATA's landed payloads before they reach `main`:
`git merge --no-edit agent-data`. That is a read, not a request.

## Queue

Work top to bottom. One item per cycle. When it empties, refill it from
`docs/02-plan.md` §9.2, §9.3 and §6 within your boundary, append to this file,
keep going.

### W1 — the Phase 1 gate measurement report

Deliverable: `docs/phase1-gate-report.md`. Measure, do not fix — fixes are W2.
Servers on ports ≥3220.

- Production build, plus the performance budget lines.
- Lighthouse desktop on `/`, `/restaurants`, and one detail page. Targets:
  Performance ≥90, **Accessibility = 100**, Best Practices ≥95, SEO ≥95. For every
  miss, list the top opportunities Lighthouse actually named.
- A keyboard-only walk of every route family: can you reach every result and every
  movement without a mouse and without touching the map?
- Deep link, refresh, and back-button state restoration across the four route
  families — including a trip board (`/?board=...`), favourites, and collections
  after a cold reload.
- Failure injection: tile host blocked, list API failing, detail API returning 500. Confirm the visible message in each case. A blank panel is a failure.

Report measured numbers. "Should pass" is not a measurement.

### W2 — close what W1 opened

Fix every gate miss inside your boundary. Anything the report finds inside lane
DATA's boundary is a `Boundary note` in your progress log — write it down, do not
reach across, do not wait.

### W3 — subtraction pass

`docs/02-plan.md` §6 is a subtraction list. Apply it to `app/`, `components/`, and
your `lib/` modules. `MapShell.tsx` was 1,076 lines carrying map, list, trip board,
favourites, recents, collections, theme and a local "account" at once; the
300-line cap applies here as much as it does to scripts. Splitting it is a pure
move — behaviour identical, e2e green before and after.

### W4 — mobile web (Phase 2 definition of done)

- Overflow audit and fixes at 320px, 390px and 430px.
- Touch targets ≥24px, primary actions ≥44px.
- Image/format audit — currently SVG-only; verify that is still true.
- Lighthouse mobile, Moto G4 profile on Slow 4G: Performance ≥75,
  Accessibility = 100, time-to-interactive-map ≤4s.
- Drawer focus handling and attribution behaviour on mobile.
- A one-handed reachability pass on the primary actions.

Do not open W4 until the W1 report exists and W2 has closed its Phase 1 misses.
That is a sequencing rule inside your own lane — it has nothing to do with lane
DATA, whose work never gates yours.

### W5 — the `/v1` API surface

`docs/02-plan.md` §8.4 requires these live and consumed by the web app before any
native work: `/v1/restaurants`, `/v1/restaurants/:slug`, `/v1/browse`,
`/v1/facets`, `/v1/meta`. `/v1/movements` already exists — match its versioning,
its cache-control behaviour, and its Zod validation at the boundary. "Consumed by
the web app" is part of the requirement: an endpoint nothing calls is not done.

### W6 — the shared package boundary

§8 of the plan: the shared layer in `lib/` must be dependency-clean — no `react`,
`next`, or DOM imports — and there must be exactly one wire codec. Audit it and
report the violations. `lib/wire*` and `lib/types*.ts` are frozen: changing them
is a contract change, done alone, published immediately, and written down
(`docs/workstreams.md` §3).

### W7 — handoff

Last. Write `docs/04-handoff-web.md`: what the interface does, what was measured
and when, the accessibility position, the API surface and its versioning promise,
and the known gaps. Lane DATA writes its own half; you do not write theirs.

## What is true right now (2026-08-12)

- Phase 1 gate: **not met, and not yet measured**. That is W1's whole point.
- 93 unit tests and 22 e2e tests pass; contrast gates and performance budgets are
  enforced in CI; typecheck and lint are clean.
- `main` at `eb33d08`. `/v1/movements` and 831 static edition pages are live.
- Two previously-stalled worktree branches (`worktree-agent-*`) held no commits and
  have been deleted.

Update these numbers as you change them. A stale claim here is the same defect as
a stale claim in the product.
