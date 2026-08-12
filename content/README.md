# content/

Source corpus, added as Markdown files following the authoritative schema in
`docs/dharma_daily_build_reference.docx` and the rights policy summarized in
`CURRENT_SUMMARY.md`.

## Expected layout (added in Phase 2/3)

```
content/
├── bhagavad-gita/
│   ├── chapter-1.md
│   ├── chapter-2.md
│   └── ...
├── upanishads/
│   ├── isha.md
│   └── ...
├── concepts/
│   ├── dharma.md
│   └── ...
├── festivals/
│   ├── diwali.md
│   └── ...
├── practice-guides/
│   ├── morning-puja.md
│   └── ...
└── daily-reflections/
    ├── 001.md
    └── ...
```

## File format

Each file is YAML frontmatter + Markdown body:

```markdown
---
text_slug: bhagavad_gita
text_title: Bhagavad Gita
section: Chapter 2
translator: Edwin Arnold
licence: public_domain
copyright_status: Public domain edition; verify deployment jurisdiction.
source_url: https://archive.org/details/...
tradition_primary: general
can_store: true
can_show_excerpts: true
can_embed: true
---

## 2.47

**Sanskrit:** ...
**Transliteration:** ...
**Translation:** ...
```

Licensing fields are mandatory on every file. The validator (`pnpm content:validate`) refuses to pass files without them; use `pnpm content:stats` for a rights summary. Raw and staged files under `content/_staging/` are not canonical Markdown and must go through the RAG preparation/audit flow first.

The RAG preparer accepts these canonical Markdown files directly. It carries
frontmatter into provenance, rights, category, tradition, and section fields,
and removes Markdown formatting before chunking. Keep unreviewed downloads in
`content/_staging/` and production-ready sources here.

The controlled pipeline commands are:

```bash
pnpm content validate content
pnpm content stats content
pnpm content ingest --dry-run
pnpm content ingest       # requires Supabase service-role + embedding credentials
pnpm content reembed      # deliberate full re-embed; requires explicit operational approval
pnpm content:validate
pnpm content:stats
pnpm rag:prepare
pnpm rag:audit
pnpm rag:ingest:dry-run
pnpm rag:prepare:canonical
pnpm rag:audit:canonical
pnpm rag:ingest:canonical:dry-run
pnpm content:ingest       # requires Supabase service-role + embedding credentials
pnpm content:ingest:canonical # first-party canonical corpus only
pnpm content:reembed      # deliberate full re-embed; requires explicit operational approval
```

`content:ingest` and `content:reembed` write vectors and should only be run against the intended Supabase project after reviewing the audit output. No source is eligible for preparation unless its storage, excerpt, and embedding rights are explicitly cleared.
