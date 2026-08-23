# Onboarding

One route (`app/onboarding.tsx`), one configured list of steps, one pure engine.
Visually each question is its own screen; architecturally nothing is a separate
Expo Router page.

```
steps.ts ──▶ engine.ts ──▶ useOnboardingFlow.ts ──▶ app/onboarding.tsx
 config       pure logic     controller               OnboardingShell
 (copy as     (visibleSteps, (answers, step,            └ StepTransition
  functions,   progressFor,   direction, next/back/        └ Welcome · SingleChoice · MultiChoice
  when())      buildProfile)  goTo, draft resume)            · Text · Interstitial · Result
```

## The rule

**A question whose answer changes nothing does not ship** (`02-plan.md` B4, CLAUDE.md
standing rules). Every `answerKey` in `types.ts` has a named consumer:

| Answer            | Consumer                                                                |
| ----------------- | ----------------------------------------------------------------------- |
| `intent`          | branch step, later titles, home starting point (`lib/startingPoint.ts`) |
| `practices`       | `focusTags` → daily rotation order (`lib/shlokas.ts`), practice pick    |
| `practiceMinutes` | practice pick never exceeds it                                          |
| `startingText`    | reader chapter + rotation woven to lead with that text                  |
| `curiosity`       | first guide + the two "Continue learning" tiles                         |
| `script`          | line order on every verse surface (`lib/script.ts`, `VerseLines`)       |
| `language`        | `contentLanguage` + `profiles.language_pref`                            |
| `reminder`        | `configureDailyReminder` at finish; morning/evening biases the practice |
| `name`            | greeting on the result, home avatar, Journey tab                        |

Adding a step means adding its consumer in the same change.

## Branching

`when(answers)` removes a step from the visible list; it is skipped, not shown
disabled. Progress counts every visible screen after the welcome including the
result, so the bar recomputes when a branch appears or disappears and reads 100%
only on the last screen.

## Persistence

Answers in progress live in `useAppStore.onboardingDraft` (resume on relaunch).
`finish()` writes the built profile to the store, bumps `onboardingVersion`
(`ONBOARDING_VERSION` in `steps.ts` — raise it to route existing installs back
through a changed flow), arms the reminder, and syncs the columns `profiles`
has (`display_name`, `household_practices`, `language_pref`, `notification_time`,
`timezone`). Intent, script and branch answers are device-local until columns
exist for them.

## Tests

`engine.test.ts` covers branching, progress, coercion, copy that reacts to earlier
answers, profile building and summary rows. Components are not unit-tested (the
vitest setup cannot import React Native); walk the flow on a device or on
`expo start --web` after changing them.
