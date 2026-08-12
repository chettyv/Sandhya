# Content-pass runbook — how to draft, approve, and ship verse content

Turnkey instructions for any agent/session. This is the exact process that produced the live Gita/Chalisa/Isha content. Nothing here requires conversation history.

## PENDING RIGHT NOW: three interrupted writer passes

Killed by the session usage limit before writing anything (skeletons intact, committed). Relaunch three parallel writer agents with the prompt template below and these targets:

1. **Kena Upanishad** — `content/shlokas/kena-shanti.md` + all `kena-*-*.md` (36 files). Text notes for step 7: khandas 1–2 are the "that which the mind cannot think" teaching (2.3's paradox "to whom it is not known, to him it is known" is the landmark); khandas 3–4 are the Uma–Indra story — narrative, keep scripture-vs-story framing clear; story verses mostly don't stand alone.
2. **Mundaka 1–2** — `mundaka-shanti.md` + all `mundaka-1-*-*.md` and `mundaka-2-*-*.md` (~33 files). Landmarks: para/apara vidya (1.1.4–5), spark-from-fire (2.1.1). Much of Mundaka is sequential argument — pool sparingly.
3. **Mundaka 3 + Mandukya** — all `mundaka-3-*-*.md` (~21) + `mandukya-shanti.md` + `mandukya-1..12.md` (13). Landmarks: **3.1.1 two birds** (most contested image between Advaita and theistic schools — one self appearing as two vs jiva and Ishvara as two real entities), **3.1.6 satyameva jayate** (India's national motto — say so). Mandukya is one continuous four-states analysis of ॐ (7 is the turiya verse); most verses stay out of the pool.

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
> 9. Frontmatter: insert `daily_pool: true` before review_status ONLY where the verse stands alone as a complete thought (judge honestly; fragments and sequences stay out; anything unsuited to an unprompted daily push — e.g. death-focused or self-harm-adjacent phrasing — stays out on safety grounds). Adjust `tags:` (allowed: courage, peace, discipline, devotion, wisdom, family, duty; max 3). Keep review_status: draft, empty reviewed_by, key order; don't touch copyright_status or Source lines.
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

Katha/Prashna/Shvetashvatara/Taittiriya/Aitareya (extend `scripts/extract-wikisource-verses.mjs` with subpage fetching — Katha's mula lives in subpages) · great mantras · staged ITX stotras (`scripts/extract-chalisa.mjs` shows the ITRANS pattern) · rolling waves through the 620 remaining Gita verses (batches of ~10 per writer, chapter landmarks in each prompt) · epics via bulk reader + RAG pipeline (design task).

## Quality bar (non-negotiable, enforced by validator + prompt)

Devanagari never altered or written from memory · named source with URL on every unit · tradition divergence stated honestly, no winner · daily pool only for standalone-meaningful verses · everything draft until a named reviewer (currently the founder, under blanket directive) approves.
