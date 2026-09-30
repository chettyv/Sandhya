# Sandhya technical launch checklist

This checklist is the release evidence companion to
[`docs/technical-launch-contract.md`](../technical-launch-contract.md). It
belongs to the coordinator worktree and must be updated with dated evidence,
the commit, build profile, device/OS, network condition, and owner. A green
source-safe run is not a substitute for signed-build or physical-device
evidence.

## Source-safe gate

Run from a clean checkout with Node 22.x and the pinned `pnpm@11.0.8`:

```powershell
pnpm install --frozen-lockfile
pnpm verify:technical-launch
```

The verifier runs the lockfile, generated-content, translation-manifest,
typecheck, lint, test, route-smoke, web-export, workspace-build, backend, and
secret-scan gates. It never runs live smoke commands, deploys, applies
migrations, re-embeds the corpus, submits a store build, or prints environment
values. `--allow-toolchain-mismatch` is diagnostic-only and cannot support a
launch claim.

Recorded source-safe run on 30 September 2026: coordinator branch
`codex/launch-readiness`, base `58fdd07`, Node `v22.23.3`, pnpm `11.0.8`.
All source-safe checks passed. This is evidence for the source tree only; it is
not signed-build, physical-device, live-backend, rights, audio, or store
evidence.

## Content and provenance

| Gate                         | Evidence required                                                                                                                                 | Status                                                       | Owner           |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | --------------- |
| Runtime manifest             | Every launch item has the required fields, clear source rights, and a generated/bundled entry.                                                    | Blocked: 1,869 entries; 1,017 hold, 852 review-data, 0 ready | Content/data    |
| Translation coverage         | Report `en`, `hi`, `bn`, `gu`, `mr`, and `ta` separately; reviewed rows require a named human reviewer and date.                                  | Blocked: 11,214 rows; no reviewed rows                       | Content/data    |
| Audio                        | Approved human recording with clear reading and slow repeat-after-me pass for each core learnable item; rights and pronunciation review recorded. | Blocked: 0 recordings; 1,869 missing                         | Content/media   |
| Quotes                       | Named translator and source displayed with every quoted verse.                                                                                    | Must re-check on release candidate                           | Content/data    |
| Festivals                    | Reckoning, observing community, computed location, source, and disagreements displayed for every published date.                                  | Must re-check on release candidate                           | Content/data    |
| Tradition/regional variation | Actual variation fields render; no single tradition is presented as universal.                                                                    | Must re-check on release candidate                           | Product/content |
| Rights tracker               | Every source row has translator, URL, copyright, storage, excerpt, and embedding decisions before corpus use.                                     | Blocked: 431 rows, 1 approved                                | Content/data    |

## Mobile and native evidence

Use signed development/preview builds made from the same clean commit. Record
the build identifier and exact OS version for each row.

| Device class           | Required evidence                                                                                                   | Status                  |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| iPhone SE-class        | 320px layout, safe areas, onboarding/process death, keyboard, VoiceOver, Reduce Motion, cold/warm launch, audio.    | Pending physical device |
| Current notched iPhone | Today first value, auth/recovery, deep links, notifications, background/resume, Dynamic Type, offline/retry, audio. | Pending physical device |
| iPad class             | Large layout/orientation, Dynamic Type, navigation, keyboard, offline, audio.                                       | Pending physical device |
| Pixel mid/low phone    | Cold/warm launch, back navigation, keyboard, offline, TalkBack, notifications, audio, process death.                | Pending physical device |
| Samsung mid-tier       | Vendor lifecycle, safe areas, font scaling, auth/deep links, reminders, audio, saved/journal state.                 | Pending physical device |
| Android tablet         | Large layout, font scaling, navigation, keyboard, offline, audio, background/resume.                                | Pending physical device |

For each representative phone, record five cold launches, five warm reopens,
cached Today, and first navigation. Report median and slowest run against the
contract budgets: cold `≤2.5s`, warm `≤1.5s`, cached Today `≤3.0s`, and normal
navigation `≤350ms`.

## Live and operational evidence

These checks are intentionally not run by `pnpm verify:technical-launch`:

- signed EAS development/preview/production builds from a clean checkout;
- Supabase auth/account-switching/export/delete/sign-out isolation and RLS
  checks against a disposable environment;
- notification cold-start, foreground, background, denial, and resume checks;
- account-delete, notification, and other live backend smokes using disposable
  credentials only;
- finite-challenge billing sandbox purchase/restore/refund checks only if the
  challenge is explicitly published; no subscription path;
- crash/error telemetry delivery, support contact, rollback owner, content
  correction owner, and legal/store review sign-off.

Scoped AI remains disabled for the Navratri pilot. The live participation
counter remains dark. No production migration, deployment, store submission,
corpus re-embedding, or branch deletion is authorized by this checklist.

## Release decision

The technical launch decision is **not ready** until the source-safe gate is
green on the pinned toolchain, content/audio and rights gates are closed, and
the physical-device and operational evidence above is attached to this exact
commit. Any missing evidence is a blocker or an explicitly named conditional
decision; it must not be described as passing because a simulator, Expo Go,
web export, or unit test passed.
