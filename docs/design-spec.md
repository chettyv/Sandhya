# Sandhya — design spec

Codifies the visual language already in the app (`apps/mobile/src/theme/tokens.ts`, `src/components/ui.tsx`) and specifies the new challenge and web surfaces against it. New UI follows this spec; it does not improvise a second language.

## Typography

- System font stack (SF / Roboto via RN defaults) — deliberate: fast, no font loading on flaky networks, correct Devanagari fallback on both platforms.
- Scale in use: 11 uppercase eyebrow · 12 pill/meta · 14 secondary · 15 body · 17 section title · 22 screen title. Weights: regular for prose, semibold for titles/actions. No new sizes without need.
- **Devanagari** renders in the system Devanagari face at body size + 2 (it reads smaller than Latin at equal pt) with generous line height (1.6). **IAST** in muted color, italic never (diacritics + italics hurt legibility). **Say it** is the loudest of the three registers — ink color, semibold: it is the one the user actually uses.

## Colour

Warm light single theme (matches the current app; a dark theme is not in scope for this launch). The visual direction is calm and colourful through restrained semantic accents, not saturated decoration. Palette from `tokens.ts`:

| Role                    | Token                | Value   |
| ----------------------- | -------------------- | ------- |
| Background              | parchment            | #FCF8EF |
| Surface / card          | paper (`bg-surface`) | #FFFFFF |
| Secondary surface       | sand                 | #F4E9DA |
| Primary text            | ink                  | #2A211B |
| Secondary text          | muted                | #7A6A5D |
| Primary action / accent | saffron              | #D97824 |
| Secondary accent        | plum                 | #7F6278 |
| Positive / calm         | sage                 | #6D8C71 |
| Danger / error          | rose                 | #B94735 |
| Hairlines               | line                 | #E8DCCB |

Text-safe accent tokens are `saffronText` (`#A04F17`), `sageText` (`#4F6E54`), and `roseText` (`#A33A2A`). Ink on parchment is 14.9:1, muted on paper is 5.2:1, saffronText on paper is 5.8:1, and black on saffron is 6.7:1 (WCAG relative-luminance calculations). Use raw sage and raw saffron as fills/icons where appropriate; use the text-safe tokens for small text. Do not introduce a second theme or a new accent palette without an explicit product decision.

## Spacing, radius, elevation

4px base scale (Tailwind). Screen padding 16. Cards: `rounded-card`, hairline border + soft shadow (`shadows.card`). Touch targets: min 44px (`min-h-11`) for all primary controls; icon buttons 40px + `hitSlop` where present. One elevation level only — cards over background; no stacked elevation.

## Iconography

Ionicons outline variants only (already app-wide). Filled variants reserved for active tab and completed states.

## Motion

- Press feedback: opacity 0.72 + scale 0.985 (existing `styles.pressed`) — everywhere, nothing else on press.
- State changes (unlock, completion): single 200–250ms ease-out fade/slide. No confetti, no loops, no casino energy — celebration is warm copy + saffron accent, not particles (editorial rule: calm and restrained).
- Respect `prefers-reduced-motion` / `Reduce Motion`: skip non-essential transitions.

## States (every screen, designed not defaulted)

- **Loading:** skeleton blocks in surface color, or spinner + one line of quiet copy for full-screen waits.
- **Empty:** `EmptyState` component — icon, one-line title, one-line body, one action that teaches the next step. Never a blank region.
- **Error:** what happened + one retry action (`SecondaryButton`). Offline is stated plainly ("You're offline — showing saved content") via the existing `ContentSourceNotice` pattern.
- **Success:** inline confirmation in sage; no modal interruptions.

---

## New screens

### Challenge overview / join — `challenge/[slug]` (route exists for deep links + web arrival)

- **Purpose:** convert an arriving stranger into a joiner. Single primary action: **Join**.
- **Layout, top → bottom:** eyebrow (dates, e.g. "11–19 October · Navratri") · title · 2-line promise · participation count (real number only — **rendered only when ≥ 25**; below that the row is omitted entirely, no fake floor) · the nine nights as a vertical list (night number, devi name, lock/check state) · price + Join (primary) · "What you'll need" one-liner (10 minutes a night) · quiet link to how cancellation/refunds work.
- **First visit vs return:** not joined → join layout. Joined → same screen becomes the challenge home: tonight's session card first, then the list with unlock states.
- **States:** loading skeleton of the night list; error + retry; challenge over → gentle "This year's challenge has ended" + what remains accessible to joiners.
- **Unlock display:** future nights show a lock + "Opens 14 Oct"; past nights for late joiners are open; tonight is highlighted with a saffron left rule.

### Night session — `challenge/[slug]/night/[n]`

- **Purpose:** one night, done in ~10 minutes. Primary action: **Complete tonight**.
- **Layout:** eyebrow "Night 3 of 9 · Chandraghanta" · Tonight (framing prose) · **shloka card** — Devanagari, then IAST (muted), then Say it (semibold ink), then Meaning, then Source line in 12pt muted with translator named · audio player row when audio exists (play/pause, scrubber, "slow repeat" second track) · Meaning · Practice · Tradition notes (plum left rule — the "traditions differ" signature) · Reflection prompt + journal affordance · Complete button.
- **States:** locked (if navigated early): lock icon, "Opens 14 October", back action. Loading/error as standard. Completed: check in sage next to title; button becomes "Completed" disabled-quiet.
- **Transitions:** push from overview; completing pops back to overview with the night's row now checked (single fade).

### Today-tab challenge card (arrival hook)

One card above the daily reflection when a published challenge is upcoming or active: eyebrow ("Starts 11 October" / "Night 4 tonight"), title, one line, chevron. Tapping routes to the overview. No badge spam, no countdown theatrics — the date is the urgency and the date is real.

## Web pages (arrival surface)

Same palette and type scale expressed in plain HTML/CSS (system fonts, no webfonts). Single column, max-width 680px, 18px/1.7 body for long-form reading. Each explanatory page: h1 = the question as asked · direct answer in the first two paragraphs · sections with h2 · sources named inline exactly as in the app · one quiet card linking to the challenge/app at the end — content first, product second. No popups, no email gates, no interstitials.
