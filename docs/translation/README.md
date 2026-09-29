# Translation readiness inventory

`manifest.csv` is a deterministic inventory of the canonical shloka Markdown
files. It records the English fallback and the currently supported content
locales: `en`, `hi`, `bn`, `gu`, `mr`, and `ta`. This is content coverage, not
full UI localization.

Each row has exactly these columns, in this order:

```text
slug,source_language,target_language,verse_status,prose_status,reviewer,last_reviewed,notes
```

The Markdown shape is unchanged. English remains the fallback in
`**Meaning:**` and `## Meaning`; translated verse text uses
`**Meaning (xx):**`, and translated prose uses `## Meaning (xx)`. Verse and
prose statuses are independent so missing prose never hides an available
verse.

Statuses are conservative:

- `pending` means the text is absent or still carries a placeholder/pending marker.
- `needs-review` means text exists but no named translation reviewer and review date are recorded.
- `reviewed` is reserved for a row with text, a named reviewer, and a review date.

There is no named human-reviewed translation assignment in this repository at
present. Existing text is therefore inventoried as `needs-review`; no
translation is generated or published by these scripts. Generated-bank notes
expose only the language text that is actually present in the bundled bank.

Build or check the inventory with:

```bash
node scripts/build-translation-manifest.mjs --write
node scripts/build-translation-manifest.mjs --check
node scripts/verify-translation-manifest.mjs --check
```
