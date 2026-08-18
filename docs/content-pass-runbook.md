# Content-pass runbook — how to draft, approve, and ship verse content

Turnkey instructions for any agent/session. This is the exact process that produced the approved Gita, Chalisa, Isha, Kena, Mundaka, Mandukya, Katha, Shvetashvatara, stotra, and prayer content. Nothing here requires conversation history.

## Current queue — 18 August 2026

The Kena, Mundaka, Mandukya, Katha, Shvetashvatara, Bhaja Govindam, Aditya Hridayam, Soundarya Lahari, and prayer passes are complete and approved on `main`. The next content work is draft-only until a named reviewer approves it:

1. **Devi Mahatmya** — continue the 588-file draft corpus. The current wave has completed 51 files; 537 extracted skeletons remain. Preserve source/numbering flags and do not approve without named review.
2. **Remaining Gita waves and language layers** — work in small, reviewable batches across the 620 draft skeletons; regenerate the bank only after validation.
3. **Next source queue** — Prashna remains blocked on its malformed source boundary; Taittiriya/Aitareya need a cleaner source and rights review before extraction.

## The writer-prompt template

> Draft review-pending content for these files in C:\Users\vaibh\Documents\GitHub\DharmaDaily\content\shlokas\: [LIST].
>
> Machine-extracted from Sanskrit Wikisource. First read content/shlokas/isha-1.md (finished, approved example of exactly this file type) and content/challenges/README.md for the "Say it" house style.
>
> Per file:
>
> 1. **Devanagari:** copied from source — DO NOT alter; note artifacts in an HTML comment. Vedic candrabindu ँ is genuine.
> 2. **IAST:** machine-generated — fix only obvious artifacts (ॐ → oṃ).
> 3. **Say it:** rewrite in house style: hyphenated syllables, CAPS stress, doubled long vowels, no diacritics; remove the draft suffix.
> 4. **Meaning:** replace placeholder with your own faithful plain-modern-English translation.
> 5. Add `**Meaning (hi):**` line after it — natural modern Hindi (magazine register, nuqta where natural).
> 6. `## Word by word` — `- **word** — meaning` sandhi-split IAST lines.
> 7. `## Meaning` section — 60–120 words plain prose for daily practice. [TEXT-SPECIFIC LANDMARK NOTES]. Where Advaita vs Vishishtadvaita/Dvaita genuinely diverge, one honest sentence, never a winner, no invented citations.
> 8. Add `## Meaning (hi)` section (60–120 words Hindi), then `## Reflection` with one single-sentence question.
> 9. Frontmatter: insert `daily_pool: true` before review_status ONLY where the verse stands alone as a complete thought (judge honestly; fragments and sequences stay out; anything unsuited to an unprompted daily push — e.g. death-focused or self-harm-adjacent phrasing — stays out on safety grounds). Adjust `tags:` — validator-enforced vocabulary (max 3): themes `courage, peace, discipline, devotion, wisdom, family, duty, gratitude, protection, surrender, clarity`; contexts `morning, evening, festival` (contexts are for daily prayers and festival material, not ordinary verses). Keep review_status: draft, empty reviewed_by, key order; don't touch copyright_status or Source lines.
>
> After all: run from repo root `pnpm content:validate` — must be 0 invalid. Return one line per file: unit + first 5 words of translation + daily_pool yes/no + artifacts spotted.

## After the writers land — the approval sweep

Founder has standing blanket approval ("I approve everything") with per-cycle spot-check flags. On a branch:

```bash
cd content/shlokas
for f in <prefix>-*.md; do
  if ! grep -q '^\*\*Meaning:\*\* (translation pending' "$f"; then
    sed -i 's/IAST machine-transliterated pending review; translation pending./IAST checked in content pass; translation, gloss, and meaning are Sandhya draft originals./; s/^review_status: draft$/review_status: approved/; s/^reviewed_by: ""$/reviewed_by: Vaibhav Chetty/' "$f"
  fi
done
```

(The guard must test the `**Meaning:**` line, NOT plain "translation pending" — that string also appears in copyright_status.)

Then: `node scripts/content-cli.mjs validate content` → `node scripts/generate-shloka-bank.mjs` → check the LIVE/pool counts printed → `pnpm --filter @sandhya/mobile typecheck` → commit (note the blanket-approval flag in the message and progress log) → merge to main → push.

## After this wave — the extraction queue (docs/03-progress.md corpus ledger)

Prashna/Taittiriya/Aitareya (source-quality and rights work first) · great mantras · remaining staged ITX stotras · rolling waves through the 620 remaining Gita verses (batches of ~10 per writer, chapter landmarks in each prompt) · the 537 remaining Devi Mahatmya drafts · epics via bulk reader + RAG pipeline (design task).

## Quality bar (non-negotiable, enforced by validator + prompt)

Devanagari never altered or written from memory · named source with URL on every unit · tradition divergence stated honestly, no winner · daily pool only for standalone-meaningful verses · everything draft until a named reviewer (currently the founder, under blanket directive) approves.
