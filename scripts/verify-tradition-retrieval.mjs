#!/usr/bin/env node
// Phase 0.5 Fix 1 invariants: tradition preference orders retrieval, it never
// narrows it. A user who states a tradition must still retrieve other
// traditions' readings; rights and quality gates keep filtering.
import { pathToFileURL } from "node:url";

const retrieval = await import(
  `${pathToFileURL("supabase/functions/_shared/retrieval.ts").href}?test=${Date.now()}`
);

const policy = {
  allowedLicences: ["public_domain", "original"],
  contentTypes: ["translation", "commentary", "combined"],
  traditionFilter: "shaiva",
  languages: null,
  minSimilarity: 0.2,
};

const passages = [
  passage("0000000a", { tradition: "vaishnava", similarity: 0.9 }),
  passage("0000000b", { tradition: "general", similarity: 0.8 }),
  passage("0000000c", { tradition: "shaiva", similarity: 0.7 }),
  passage("0000000d", { tradition: "advaita", similarity: 0.6 }),
  passage("0000000e", { tradition: "shaiva", similarity: 0.5 }),
];

const filtered = retrieval.filterRetrievedPassagesByPolicy(passages, policy);
assert(filtered.length === 5, "a stated tradition must not filter out other traditions' passages");
assert(
  filtered.filter((p) => p.tradition === "vaishnava" || p.tradition === "advaita").length === 2,
  "passages from non-stated traditions must be retained",
);

const ranked = retrieval.rankRetrievedPassagesByTraditionPreference(filtered, "shaiva");
assert(ranked.length === filtered.length, "ranking must never drop passages");
assert(
  ranked[0].tradition === "shaiva" && ranked[1].tradition === "shaiva",
  "the stated tradition's passages must rank first",
);
assert(
  ranked[0].passage_id.startsWith("0000000c") && ranked[1].passage_id.startsWith("0000000e"),
  "ranking must be stable: relevance order preserved within the stated tradition",
);
assert(
  ranked[2].tradition === "vaishnava" &&
    ranked[3].tradition === "general" &&
    ranked[4].tradition === "advaita",
  "other traditions must follow in their original relevance order, not vanish",
);

const generalRanked = retrieval.rankRetrievedPassagesByTraditionPreference(filtered, "general");
assert(
  generalRanked.every((p, i) => p.passage_id === filtered[i].passage_id),
  "a 'general' preference must leave relevance order untouched",
);

const rightsGated = retrieval.filterRetrievedPassagesByPolicy(
  [
    passage("0000000f", { tradition: "shaiva", similarity: 0.9, licence: "licensed" }),
    passage("00000010", { tradition: "shaiva", similarity: 0.05 }),
    passage("00000011", { tradition: "shaiva", similarity: 0.9, content_type: "raw" }),
    passage("00000012", { tradition: "shaiva", similarity: 0.9, language: "hi" }),
  ],
  { ...policy, languages: ["en"] },
);
assert(
  rightsGated.length === 0,
  "licence, similarity, content-type, and language gates must still filter",
);

const malformed = retrieval.filterRetrievedPassagesByPolicy(
  [{ ...passage("00000013", { tradition: "shaiva", similarity: 0.9 }), passage_id: "not-a-uuid" }],
  policy,
);
assert(malformed.length === 0, "malformed passages must still be rejected");

console.log("Tradition retrieval invariants passed.");

function passage(idPrefix, overrides = {}) {
  return {
    passage_id: `${idPrefix}-0000-4000-8000-000000000000`,
    commentary_id: null,
    text_id: "00000001-0000-4000-8000-000000000000",
    title: "Test passage",
    section: "1",
    verse_number: "1",
    chunk_text: "Text of the passage.",
    content_type: "translation",
    licence: "public_domain",
    tradition: "general",
    language: "en",
    source_url: null,
    similarity: 0.5,
    ...overrides,
  };
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
