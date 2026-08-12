import { mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { auditPreparedCorpus } from "./audit-prepared.js";

const validChunk = {
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

describe("auditPreparedCorpus", () => {
  it("passes a valid prepared corpus", async () => {
    const file = await writeJsonl([validChunk]);

    const result = await auditPreparedCorpus({ inputFile: file });

    expect(result.errors).toEqual([]);
    expect(result.chunks).toBe(1);
    expect(result.sources).toBe(1);
  });

  it("fails duplicate chunk hashes and uncleared rights", async () => {
    const file = await writeJsonl([
      validChunk,
      {
        ...validChunk,
        source_path: "content/_staging/raw/english/other.txt",
        source_key: "other_en",
        can_embed: false,
      },
    ]);

    const result = await auditPreparedCorpus({ inputFile: file });

    expect(result.errors.some((error) => error.includes("duplicate chunk_hash"))).toBe(true);
    expect(result.errors.some((error) => error.includes("rights flags"))).toBe(true);
  });

  it("does not flag prose that uses next with a colon", async () => {
    const file = await writeJsonl([
      {
        ...validChunk,
        chunk_text:
          "The next: and final point is part of the translated note, not page navigation. ".repeat(
            6,
          ),
      },
    ]);

    const result = await auditPreparedCorpus({ inputFile: file });

    expect(result.warnings).toEqual([]);
  });

  it("hard-fails incomplete licensed rights records", async () => {
    const file = await writeJsonl([
      {
        ...validChunk,
        licence: "licensed",
        copyright_status: null,
        translator: null,
      },
    ]);

    const result = await auditPreparedCorpus({ inputFile: file });

    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.stringContaining("missing copyright_status"),
        expect.stringContaining("licensed source is missing translator"),
      ]),
    );
  });

  it("hard-fails missing source URLs by default and supports an explicit staging warning mode", async () => {
    const file = await writeJsonl([{ ...validChunk, source_url: null }]);

    const strict = await auditPreparedCorpus({ inputFile: file });
    const staging = await auditPreparedCorpus({ inputFile: file, requireSourceUrl: false });

    expect(strict.errors.some((error) => error.includes("missing source_url"))).toBe(true);
    expect(staging.errors.some((error) => error.includes("missing source_url"))).toBe(false);
    expect(staging.warnings.some((warning) => warning.includes("missing source_url"))).toBe(true);
  });

  it("rejects non-http source URLs", async () => {
    const file = await writeJsonl([{ ...validChunk, source_url: "javascript:alert(1)" }]);

    const result = await auditPreparedCorpus({ inputFile: file });

    expect(result.errors.some((error) => error.includes("valid http(s) URL"))).toBe(true);
  });
});

async function writeJsonl(rows: Array<Record<string, unknown>>): Promise<string> {
  const root = join(tmpdir(), `dharma-rag-audit-${Date.now()}-${Math.random()}`);
  await mkdir(root, { recursive: true });
  const file = join(root, "corpus.jsonl");
  await writeFile(file, `${rows.map((row) => JSON.stringify(row)).join("\n")}\n`);
  return file;
}
