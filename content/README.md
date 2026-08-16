# content/

Source corpus, added as Markdown files following the authoritative schema in
`docs/sandhya_build_reference.docx` and the rights policy summarized in
`CURRENT_SUMMARY.md`.

## Current layout

```
content/
├── shlokas/                 # shloka and prayer Markdown, validated by content-tools
├── challenges/              # frozen challenge_session documents
├── web/                     # reviewed arrival-site web_page documents
├── original/                # canonical RAG source Markdown
└── _staging/                # raw and prepared material; never publish directly
```

## File format

Canonical documents are YAML frontmatter plus Markdown body. Shloka files use the
schema and house style in [`shlokas/_template.md`](shlokas/_template.md); challenge
sessions use [`challenges/README.md`](challenges/README.md). A representative shloka
frontmatter block is:

```markdown
---
doc_type: shloka
shloka_slug: gita-2-47
text_ref: Bhagavad Gita 2.47
tradition_primary: general
tags: duty, discipline
licence: original
copyright_status: Verse text and provenance details
source_url: https://sa.wikisource.org/...
review_status: draft
reviewed_by: ""
---

## Shloka

**Devanagari:** ...
**IAST:** ...
**Say it:** ...
**Meaning:** ...
```

Licensing fields are mandatory on every file. The validator (`pnpm content:validate`) refuses to pass files without them; use `pnpm content:stats` for a rights summary. Raw and staged files under `content/_staging/` are not canonical Markdown and must go through the RAG preparation/audit flow first.

The RAG preparer accepts these canonical Markdown files directly. It carries
frontmatter into provenance, rights, category, tradition, and section fields,
and removes Markdown formatting before chunking. Keep unreviewed downloads in
`content/_staging/` and production-ready sources here.

The controlled pipeline commands are:

```bash
pnpm content:validate
pnpm content:stats
pnpm rag:prepare
pnpm rag:audit
pnpm rag:ingest:dry-run
pnpm rag:prepare:canonical
pnpm rag:audit:canonical
pnpm rag:ingest:canonical:dry-run
pnpm content:ingest       # requires Supabase service-role + embedding credentials
pnpm content:reembed      # deliberate full re-embed; requires explicit operational approval
```

`content:ingest` and `content:reembed` write vectors and should only be run against the intended Supabase project after reviewing the audit output. No source is eligible for preparation unless its storage, excerpt, and embedding rights are explicitly cleared.
