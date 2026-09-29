import assert from "node:assert/strict";
import test from "node:test";

import {
  buildRuntimeManifest,
  compareApprovedEntries,
  validateRuntimeDocument,
} from "./verify-runtime-content.mjs";

function makeDocument(overrides = {}) {
  return {
    sourcePath: overrides.sourcePath ?? "sample.md",
    frontmatter: {
      shloka_slug: "sample-1",
      text_ref: "Sample 1",
      tradition_primary: "general",
      tags: "wisdom, morning",
      daily_pool: true,
      review_status: "approved",
      copyright_status: "Cleared source; translation reviewed.",
      source_url: "https://example.org/sample",
      reviewed_by: "Named reviewer",
      ...overrides.frontmatter,
    },
    runtime: {
      slug: "sample-1",
      textRef: "Sample 1",
      tradition: "general",
      tags: ["wisdom", "morning"],
      dailyPool: true,
      devanagari: "देवी",
      iast: "devī",
      sayIt: "DAY-vee",
      translation: "The goddess.",
      source: "Sample 1, Named translator, https://example.org/sample",
      reflection: "What do you notice?",
      words: [{ word: "devī", meaning: "goddess" }],
      meaning: "A prose meaning.",
      translations: { hi: "देवी" },
      meanings: { hi: "देवी का अर्थ" },
      ...overrides.runtime,
    },
  };
}

function generatedFrom(document) {
  return structuredClone(document.runtime);
}

test("rejects duplicate slugs before producing a runtime report", () => {
  const documents = [makeDocument(), makeDocument({ sourcePath: "duplicate.md" })];

  const issues = compareApprovedEntries(documents, [generatedFrom(documents[0])]);

  assert.ok(issues.some((issue) => issue.includes("duplicate slug: sample-1")));
});

test("reports missing runtime fields", () => {
  const document = makeDocument();
  delete document.runtime.textRef;
  delete document.runtime.reflection;

  const issues = validateRuntimeDocument(document);

  assert.ok(issues.some((issue) => issue.includes("textRef")));
  assert.ok(issues.some((issue) => issue.includes("reflection")));
});

test("reports an empty word gloss as a data issue", () => {
  const document = makeDocument({ runtime: { words: [{ word: "devī", meaning: "" }] } });

  const issues = validateRuntimeDocument(document);

  assert.ok(issues.some((issue) => issue.includes("words[0].meaning")));
});

test("flags malformed language codes instead of silently dropping them", () => {
  const document = makeDocument({ runtime: { translations: { HI: "देवी", "en-US": "Goddess" } } });

  const issues = validateRuntimeDocument(document);

  assert.ok(issues.some((issue) => issue.includes("malformed language code: HI")));
  assert.ok(issues.some((issue) => issue.includes("malformed language code: en-US")));
});

test("records placeholder translations and recommends translation", () => {
  const document = makeDocument({
    runtime: { translation: "(translation pending — review before ship)" },
    frontmatter: { review_status: "draft" },
  });

  const manifest = buildRuntimeManifest({ documents: [document], generatedEntries: [] });
  const entry = manifest.entries[0];

  assert.ok(entry.placeholderMarkers.includes("translation pending"));
  assert.equal(entry.recommendation, "translate");
});

test("detects generated-bank drift in approved entries", () => {
  const document = makeDocument();
  const generated = generatedFrom(document);
  generated.translation = "Different translation";

  const issues = compareApprovedEntries([document], [generated]);

  assert.ok(issues.some((issue) => issue.includes("generated entry drift: sample-1.translation")));
});
