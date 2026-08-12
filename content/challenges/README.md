# Challenge sessions — format and house style

One markdown file per session night, validated by `pnpm content:validate`. This format is the contract between the writer, the reviewer, the seed pipeline, and the app renderer. A file that fails validation does not ship.

## File location and naming

`content/challenges/<challenge-slug>/night-NN.md` — e.g. `content/challenges/navratri-2026/night-01.md`.

Files whose names start with `_` are ignored by the validator (use `_template.md` as a starting point).

## Frontmatter

```yaml
---
doc_type: challenge_session
challenge_slug: navratri-2026
night: 1
session_title: Shailaputri — beginning at the root
deity_focus: Shailaputri
estimated_minutes: 10
review_status: draft # draft → in_review → approved; only approved ships
reviewed_by: "" # named reviewer, required when approved
licence: original # the prose is app-authored; quotes carry their own source lines
copyright_status: Original Sandhya content; quoted scripture attributed inline.
source_url: https://github.com/chettyv/Sandhya
tradition_primary: general
can_store: true
can_show_excerpts: true
can_embed: false # sessions are paid product, never RAG corpus
---
```

## Body sections — all six required, in this order

1. `## Tonight` — 2–4 sentences of framing. Who this devi form is, why tonight.
2. `## Shloka` — the verse block (format below). At least one, more allowed.
3. `## Meaning` — what the verse says, plainly. Separate scripture from commentary from folklore explicitly when both appear.
4. `## Practice` — one small concrete act for tonight, safe and optional.
5. `## Tradition notes` — where regional/sampradaya practice genuinely differs, say so. If nothing differs materially, say that in one sentence — never leave the section out.
6. `## Reflection` — one journal prompt, a single question.

## The shloka block — three registers, always

Every quoted verse line appears in all three registers plus translation and source. The validator enforces the five labels inside every `## Shloka` section:

```markdown
**Devanagari:** या देवी सर्वभूतेषु शक्तिरूपेण संस्थिता
**IAST:** yā devī sarvabhūteṣu śakti-rūpeṇa saṁsthitā
**Say it:** yaa DAY-vee sar-va-BHOO-tay-shoo SHAK-ti ROO-pay-na sam-STHI-taa
**Meaning:** To the goddess who abides in all beings in the form of power…
**Source:** Devī Māhātmya 5.32–34, tr. [named translator], public domain, [source URL]
```

House style for **Say it** (the register the user actually uses, out loud, under pressure):

- Hyphenate syllables; CAPITALS mark the stressed syllable: `LUCK-shmee`, `guh-NAY-shuh`.
- Use ordinary English spelling sounds — no macrons, no diacritics, no IPA.
- Long vowels doubled (`aa`, `ee`, `oo`); `th`/`dh` only where an English reader would say it acceptably.
- Read it aloud yourself before committing it. If you stumble, rewrite it.

## Rules

- Quoted scripture comes only from public-domain or cleared sources already in `docs/open_licensed_hindu_text_source_map.md`, translator named at every quote. No exceptions.
- Never present one tradition's practice as the universal one.
- `review_status: approved` requires a non-empty `reviewed_by`. The seed pipeline refuses anything else.
- AI may draft prose around a quote; AI never generates the quoted text, and nothing ships without the named reviewer.
