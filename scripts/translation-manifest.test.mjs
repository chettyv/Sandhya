import assert from "node:assert/strict";
import test from "node:test";

import { parseShlokaMarkdown } from "./verify-runtime-content.mjs";
import {
  buildTranslationManifest,
  TRANSLATION_MANIFEST_COLUMNS,
  validateTranslationRows,
} from "./build-translation-manifest.mjs";

function markdown({ hindiVerse = "", hindiProse = "", localeLabel = "hi" } = {}) {
  return `---
doc_type: shloka
shloka_slug: sample-1
text_ref: Sample 1
tradition_primary: general
licence: original
copyright_status: Cleared for review.
source_url: https://example.org/sample
review_status: approved
reviewed_by: Named reviewer
---

## Shloka

**Devanagari:** देवी
**IAST:** devī
**Say it:** DAY-vee
**Meaning:** The goddess.
${hindiVerse ? `**Meaning (${localeLabel}):** ${hindiVerse}\n` : ""}**Source:** Sample 1, Named translator, https://example.org/sample

## Word by word

- **devī** — goddess

## Meaning

${"A prose meaning."}
${hindiProse ? `\n## Meaning (${localeLabel})\n\n${hindiProse}\n` : ""}
## Reflection

What do you notice?
`;
}

function documentFrom(options) {
  return parseShlokaMarkdown(markdown(options), "sample-1.md");
}

function generatedFrom(document) {
  return {
    ...structuredClone(document.runtime),
    translations: structuredClone(document.runtime.translations),
    meanings: structuredClone(document.runtime.meanings),
  };
}

test("keeps English fallback as an independently reviewable row", () => {
  const document = documentFrom();
  const manifest = buildTranslationManifest({ documents: [document], generatedEntries: [] });
  const english = manifest.rows.find((row) => row.target_language === "en");

  assert.deepEqual(Object.keys(english), [...TRANSLATION_MANIFEST_COLUMNS]);
  assert.equal(english.source_language, "en");
  assert.equal(english.verse_status, "needs-review");
  assert.equal(english.prose_status, "needs-review");
});

test("selects Hindi verse and prose status independently", () => {
  const document = documentFrom({ hindiVerse: "देवी", hindiProse: "" });
  const manifest = buildTranslationManifest({ documents: [document], generatedEntries: [] });
  const hindi = manifest.rows.find((row) => row.target_language === "hi");

  assert.equal(hindi.verse_status, "needs-review");
  assert.equal(hindi.prose_status, "pending");
});

test("missing prose does not hide an available verse", () => {
  const document = documentFrom({ hindiVerse: "देवी", hindiProse: "" });
  const manifest = buildTranslationManifest({ documents: [document], generatedEntries: [] });
  const hindi = manifest.rows.find((row) => row.target_language === "hi");

  assert.match(hindi.notes, /verse text present/i);
  assert.match(hindi.notes, /prose text missing/i);
});

test("rejects malformed locale labels in Markdown", () => {
  const document = documentFrom({ hindiVerse: "देवी", localeLabel: "HI" });

  const issues = validateTranslationRows([], [document], []);

  assert.ok(issues.some((issue) => issue.includes("malformed language code: HI")));
});

test("rejects generated-bank language drift", () => {
  const document = documentFrom({ hindiVerse: "देवी", hindiProse: "देवी का अर्थ" });
  const generated = generatedFrom(document);
  generated.translations.hi = "different";

  const issues = validateTranslationRows(
    buildTranslationManifest({ documents: [document], generatedEntries: [generated] }).rows,
    [document],
    [generated],
  );

  assert.ok(issues.some((issue) => issue.includes("generated entry drift: sample-1.translations")));
});

test("rejects duplicate, unknown, and reviewed-without-text rows", () => {
  const document = documentFrom();
  const rows = [
    {
      slug: "sample-1",
      source_language: "en",
      target_language: "hi",
      verse_status: "reviewed",
      prose_status: "pending",
      reviewer: "",
      last_reviewed: "",
      notes: "",
    },
    {
      slug: "sample-1",
      source_language: "en",
      target_language: "hi",
      verse_status: "pending",
      prose_status: "pending",
      reviewer: "",
      last_reviewed: "",
      notes: "",
    },
    {
      slug: "missing",
      source_language: "en",
      target_language: "xx",
      verse_status: "pending",
      prose_status: "pending",
      reviewer: "",
      last_reviewed: "",
      notes: "",
    },
  ];

  const issues = validateTranslationRows(rows, [document], []);

  assert.ok(issues.some((issue) => issue.includes("duplicate row: sample-1/hi")));
  assert.ok(issues.some((issue) => issue.includes("unknown slug: missing")));
  assert.ok(issues.some((issue) => issue.includes("unknown language code: xx")));
  assert.ok(issues.some((issue) => issue.includes("reviewed verse without text: sample-1/hi")));
});
