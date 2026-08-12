import { describe, expect, it } from "vitest";

import {
  assertEmbeddingDimensions,
  type PreparedChunk,
  validatePreparedChunk,
} from "./ingest-prepared.js";

const validChunk: PreparedChunk = {
  source_path: "content/_staging/raw/english/source.txt",
  source_key: "source_en",
  chunk_hash: "a".repeat(64),
  language: "en",
  text_slug: "source",
  text_title: "Source",
  category: "smriti",
  tradition_primary: "general",
  licence: "public_domain",
  copyright_status: "public_domain",
  can_store: true,
  can_show_excerpts: true,
  can_embed: true,
  source_metadata: {},
  source_url: "https://example.test/source",
  translator: null,
  section: null,
  verse_number: "source#1",
  order_index: 1,
  original_text: null,
  transliteration: null,
  translation_en: "A sufficiently long public domain chunk. ".repeat(12),
  translation_hi: null,
  chunk_text: "A sufficiently long public domain chunk. ".repeat(12),
};

describe("ingest prepared validation", () => {
  it("accepts a valid prepared chunk", () => {
    expect(() => validatePreparedChunk(validChunk)).not.toThrow();
  });

  it("rejects chunks that are too short for retrieval", () => {
    expect(() =>
      validatePreparedChunk({
        ...validChunk,
        chunk_text: "too short",
      }),
    ).toThrow("too short");
  });

  it("rejects missing source URLs", () => {
    expect(() =>
      validatePreparedChunk({
        ...validChunk,
        source_url: null,
      }),
    ).toThrow("missing source_url");
  });

  it("rejects non-http source URLs", () => {
    expect(() =>
      validatePreparedChunk({
        ...validChunk,
        source_url: "javascript:alert(1)",
      }),
    ).toThrow("invalid source_url");
  });

  it("rejects non-boolean rights flags", () => {
    expect(() =>
      validatePreparedChunk({
        ...validChunk,
        can_embed: "yes" as unknown as boolean,
      }),
    ).toThrow("Invalid prepared chunk shape");
  });

  it("preserves an optional sub-section while accepting older prepared rows", () => {
    expect(() => validatePreparedChunk(validChunk)).not.toThrow();
    expect(() => validatePreparedChunk({ ...validChunk, sub_section: "Verse text" })).not.toThrow();
    expect(() =>
      validatePreparedChunk({ ...validChunk, sub_section: 3 as unknown as string }),
    ).toThrow("Invalid prepared chunk shape");
  });

  it("rejects embeddings with the wrong dimension", () => {
    expect(() => assertEmbeddingDimensions([0.1, 0.2], 1536, "wrong-model")).toThrow(
      "Embedding dimension mismatch",
    );
  });
});
