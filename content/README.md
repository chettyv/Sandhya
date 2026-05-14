# content/

Source corpus, dropped here by the product owner as Markdown files following the schema in `dharma_daily_developer_plan.docx` §3.1.

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
source_url: https://archive.org/details/...
tradition_primary: general
---

## 2.47

**Sanskrit:** ...
**Transliteration:** ...
**Translation:** ...
```

Licensing fields are mandatory on every file. The ingest CLI (`pnpm --filter @dharma-daily/content-tools exec content validate`) refuses to ingest files without them.
