import { mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import {
  chunkText,
  cleanText,
  extractDocuments,
  inferLanguage,
  inferRights,
  parseMarkdownFrontmatter,
  prepareCorpus,
} from "./prepare-corpus.js";
import { countTokens } from "./token-count.js";

describe("prepare corpus", () => {
  it("treats public-domain copyright metadata as cleared instead of blocked", () => {
    const rights = inferRights(
      {
        metadata: {
          copyright: "Public Domain and Creative Commons",
          licenseurl: "https://creativecommons.org/publicdomain/mark/1.0/",
        },
      },
      "content/_staging/raw/english/sacred_texts/example.jsonl",
    );

    expect(rights).toMatchObject({
      licence: "public_domain",
      can_store: true,
      can_show_excerpts: true,
      can_embed: true,
    });
  });

  it("blocks unclear or non-commercial rights by default", () => {
    const unclear = inferRights({ copyright_status: "unclear rights" }, "source.txt");
    const nonCommercial = inferRights({ license: "CC BY-NC" }, "source.txt");
    const contradictory = inferRights(
      {
        copyright_status: "unclear rights",
        can_store: true,
        can_show_excerpts: true,
        can_embed: true,
      },
      "source.txt",
    );

    expect(unclear.can_embed).toBe(false);
    expect(nonCommercial.can_show_excerpts).toBe(false);
    expect(contradictory).toMatchObject({
      can_store: false,
      can_show_excerpts: false,
      can_embed: false,
    });
  });

  it("requires explicit rights flags for licensed source material", () => {
    const implicit = inferRights({ licence: "licensed" }, "source.txt");
    const explicit = inferRights(
      {
        licence: "licensed",
        can_store: true,
        can_show_excerpts: true,
        can_embed: true,
      },
      "source.txt",
    );

    expect(implicit).toMatchObject({
      licence: "licensed",
      can_store: false,
      can_show_excerpts: false,
      can_embed: false,
    });
    expect(explicit).toMatchObject({
      licence: "licensed",
      can_store: true,
      can_show_excerpts: true,
      can_embed: true,
    });
  });

  it("maps languages into the right content columns and emits stable hashes", async () => {
    const root = join(tmpdir(), `dharma-rag-test-${Date.now()}`);
    const input = join(root, "hindi");
    const output = join(root, "prepared", "corpus.jsonl");
    await mkdir(input, { recursive: true });
    const body = [
      "यह एक सार्वजनिक डोमेन परीक्षण स्रोत है जो पर्याप्त लंबा है। ".repeat(20),
      "दूसरा अनुच्छेद भी पर्याप्त लंबा है और इसे उसी chunk में शामिल किया जा सकता है। ".repeat(20),
    ].join("\n\n");
    await writeFile(join(input, "bhagavad_gita_public_domain_mark_hi.ocr.txt"), body);
    await writeFile(
      join(input, "bhagavad_gita_public_domain_mark_hi.metadata.json"),
      JSON.stringify({
        metadata: {
          identifier: "bhagavad_gita_202004",
          licenseurl: "http://creativecommons.org/publicdomain/mark/1.0/",
          title: "श्रीमद्भगवद्गीता",
        },
      }),
    );

    const result = await prepareCorpus({ inputDir: input, outputFile: output });
    const first = JSON.parse(
      (await readFile(output, "utf8")).split(/\r?\n/).filter(Boolean)[0] ?? "{}",
    ) as {
      chunk_hash: string;
      language: string;
      translation_en: string | null;
      translation_hi: string | null;
      source_key: string;
      can_embed: boolean;
    };

    expect(result.chunksCount).toBeGreaterThan(0);
    expect(first.source_key).toMatch(/^bhagavad_gita_202004_hi_[a-f0-9]{10}$/);
    expect(first.chunk_hash).toHaveLength(64);
    expect(first.language).toBe("hi");
    expect(first.translation_en).toBeNull();
    expect(first.translation_hi).toContain("सार्वजनिक");
    expect(first.can_embed).toBe(true);
  });

  it("prepares canonical Markdown frontmatter with provenance and cleaned body text", async () => {
    const root = join(tmpdir(), `dharma-rag-markdown-test-${Date.now()}`);
    const input = join(root, "canonical");
    const output = join(root, "prepared", "corpus.jsonl");
    await mkdir(input, { recursive: true });
    await writeFile(
      join(input, "dharma-daily-editorial-guide.md"),
      `---
text_slug: dharma_daily_editorial_guide
text_title: Dharma Daily Editorial Guide
category: modern_commentary
language: en
tradition_primary: shakta
licence: original
copyright_status: Original Dharma Daily editorial content; owned by the project.
source_url: https://github.com/chettyv/DharmaDaily
translator: Dharma Daily editorial team
can_store: true
can_show_excerpts: true
can_embed: true
section: Editorial principles
---

## Grounded learning

**Hindu traditions are diverse.** Explain the source, lineage, and context rather than presenting one interpretation as universal. ${"This editorial guide keeps the explanation careful and useful. ".repeat(12)}
`,
    );

    const parsed = parseMarkdownFrontmatter(
      await readFile(join(input, "dharma-daily-editorial-guide.md"), "utf8"),
    );
    expect(parsed.metadata).toMatchObject({
      category: "modern_commentary",
      can_embed: true,
      tradition_primary: "shakta",
    });
    expect(parsed.body).toContain("## Grounded learning");

    const result = await prepareCorpus({ inputDir: input, outputFile: output });
    const first = JSON.parse(
      (await readFile(output, "utf8")).split(/\r?\n/).filter(Boolean)[0] ?? "{}",
    ) as {
      category: string;
      tradition_primary: string;
      source_url: string;
      translator: string;
      section: string;
      chunk_text: string;
      can_store: boolean;
    };

    expect(result.chunksCount).toBeGreaterThan(0);
    expect(first.category).toBe("modern_commentary");
    expect(first.tradition_primary).toBe("shakta");
    expect(first.source_url).toBe("https://github.com/chettyv/DharmaDaily");
    expect(first.translator).toBe("Dharma Daily editorial team");
    expect(first.section).toBe("Editorial principles");
    expect(first.chunk_text).toContain("Grounded learning");
    expect(first.chunk_text).toContain("Hindu traditions are diverse.");
    expect(first.chunk_text).not.toContain("**");
    expect(first.chunk_text).not.toContain("text_slug:");
    expect(first.can_store).toBe(true);
  });

  it("extracts Sacred Texts JSONL rows from HTML instead of embedding JSON wrappers", async () => {
    const root = join(tmpdir(), `dharma-rag-jsonl-test-${Date.now()}`);
    const input = join(root, "english", "sacred_texts");
    const output = join(root, "prepared", "corpus.jsonl");
    await mkdir(input, { recursive: true });
    const html = `<html><head><title>Ignored chrome</title></head><body>
      <nav>Previous Next Index</nav>
      <p>Sacred Texts</p>
      <p>Buy this Book at Amazon.com</p>
      <h1>Chapter 1</h1>
      <p>Dhritarashtra asked what his people and the Pandavas did on the field of dharma. ${"Sacred teaching ".repeat(40)}</p>
      <script>window.bad = true</script>
    </body></html>`;
    await writeFile(
      join(input, "gita.jsonl"),
      `${JSON.stringify({
        work_id: "bhagavad_gita_arnold_sacred_texts_en",
        page_url: "https://www.sacred-texts.com/hin/gita/bg01.htm",
        title: "The Bhagavad-Gita: Chapter 1",
        html,
      })}\n`,
    );

    const result = await prepareCorpus({ inputDir: input, outputFile: output });
    const first = JSON.parse(
      (await readFile(output, "utf8")).split(/\r?\n/).filter(Boolean)[0] ?? "{}",
    ) as {
      source_path: string;
      source_url: string;
      section: string;
      text_title: string;
      chunk_text: string;
      translation_en: string | null;
    };

    expect(result.chunksCount).toBeGreaterThan(0);
    expect(first.source_path).toContain("gita.jsonl#1");
    expect(first.source_url).toBe("https://www.sacred-texts.com/hin/gita/bg01.htm");
    expect(first.section).toBe("The Bhagavad-Gita: Chapter 1");
    expect(first.text_title).toBe("Bhagavad Gita Arnold Sacred Texts En");
    expect(first.chunk_text).toContain("Dhritarashtra asked");
    expect(first.chunk_text).not.toContain("work_id");
    expect(first.chunk_text).not.toContain("Previous Next Index");
    expect(first.chunk_text).not.toContain("Buy this Book");
    expect(first.translation_en).toContain("Sacred teaching");
  });

  it("disambiguates generated source keys and text slugs for different files with the same work id", async () => {
    const root = join(tmpdir(), `dharma-rag-source-key-test-${Date.now()}`);
    const input = join(root, "english");
    const output = join(root, "prepared", "corpus.jsonl");
    await mkdir(input, { recursive: true });
    const body = "Public domain source text with enough content for chunking. ".repeat(40);
    await writeFile(join(input, "gita_translation_one_en.txt"), body);
    await writeFile(
      join(input, "gita_translation_one_en.metadata.json"),
      JSON.stringify({ work_id: "bhagavad_gita", copyright_status: "public domain" }),
    );
    await writeFile(join(input, "gita_translation_two_en.txt"), body);
    await writeFile(
      join(input, "gita_translation_two_en.metadata.json"),
      JSON.stringify({ work_id: "bhagavad_gita", copyright_status: "public domain" }),
    );

    await prepareCorpus({ inputDir: input, outputFile: output });
    const chunks = (await readFile(output, "utf8"))
      .split(/\r?\n/)
      .filter(Boolean)
      .map(
        (line) => JSON.parse(line) as { source_key: string; text_slug: string; text_title: string },
      );
    const sourceKeys = new Set(chunks.map((chunk) => chunk.source_key));
    const textSlugs = new Set(chunks.map((chunk) => chunk.text_slug));

    expect(sourceKeys.size).toBe(2);
    expect(textSlugs.size).toBe(2);
    expect([...sourceKeys].every((key) => /^bhagavad_gita_en_[a-f0-9]{10}$/.test(key))).toBe(true);
    expect(new Set(chunks.map((chunk) => chunk.text_title))).toEqual(new Set(["Bhagavad Gita"]));
  });

  it("chunks long text into bounded sections", () => {
    const text = Array.from(
      { length: 8 },
      (_, index) => `Paragraph ${index} ${"word ".repeat(120)}`,
    ).join("\n\n");
    const chunks = chunkText(text);

    expect(chunks.length).toBeGreaterThan(1);
    expect(chunks.every((chunk) => chunk.length <= 2200)).toBe(true);
    expect(chunks.every((chunk) => chunk.length >= 200)).toBe(true);
    expect(chunks.every((chunk) => countTokens(chunk) <= 600)).toBe(true);
  });

  it("splits a single oversized paragraph into bounded chunks", () => {
    const text = `Intro. ${"A long sentence with scriptural commentary. ".repeat(140)} Closing.`;
    const chunks = chunkText(text);

    expect(chunks.length).toBeGreaterThan(1);
    expect(chunks.every((chunk) => chunk.length >= 200)).toBe(true);
    expect(chunks.every((chunk) => chunk.length <= 2400)).toBe(true);
    expect(chunks.every((chunk) => countTokens(chunk) <= 600)).toBe(true);
    expect(chunks.join(" ")).toContain("scriptural commentary");
  });

  it("preserves short verse-like paragraphs for explicit audit instead of dropping them", () => {
    const chunks = chunkText(
      [
        "Short verse line",
        "Another short line",
        "A longer explanatory paragraph. ".repeat(12),
      ].join("\n\n"),
    );

    expect(chunks.join(" ")).toContain("Short verse line");
    expect(chunks.join(" ")).toContain("Another short line");
  });

  it("does not embed downloader logs as corpus sources", async () => {
    const root = join(tmpdir(), `dharma-rag-log-test-${Date.now()}`);
    const input = join(root, "raw");
    const output = join(root, "prepared", "corpus.jsonl");
    await mkdir(input, { recursive: true });
    await writeFile(
      join(input, "project_gutenberg_download_log_2026-06-19.txt"),
      "Public domain download log should not be embedded. ".repeat(40),
    );
    await writeFile(
      join(input, "actual_public_domain_source.txt"),
      "Actual corpus text. ".repeat(40),
    );
    await writeFile(
      join(input, "actual_public_domain_source.metadata.json"),
      JSON.stringify({
        copyright_status: "public domain",
        source_url: "https://example.test/actual-source",
      }),
    );

    const result = await prepareCorpus({ inputDir: input, outputFile: output });
    const lines = (await readFile(output, "utf8")).split(/\r?\n/).filter(Boolean);

    expect(result.chunksCount).toBeGreaterThan(0);
    expect(lines.join("\n")).not.toContain("download_log");
    expect(lines.join("\n")).toContain("actual_public_domain_source");
  });

  it("detects language from metadata and path", () => {
    expect(inferLanguage("content/_staging/raw/hindi/source.ocr.txt", {})).toBe("hi");
    expect(inferLanguage("x", { language: "eng" })).toBe("en");
  });

  it("cleans common HTML chrome", () => {
    const documents = extractDocuments(
      "content/_staging/raw/english/sacred_texts/source.jsonl",
      `${JSON.stringify({ html: "<head>SEO</head><body><nav>Index</nav><p>Actual sacred text.</p><script>x()</script></body>" })}\n`,
      {},
    );

    expect(documents).toHaveLength(1);
    expect(cleanText(documents[0]?.rawText ?? "")).toBe("Actual sacred text.");
  });

  it("decodes common HTML entities before chunking", () => {
    expect(cleanText("K&aacute;lind&iacute; said &#257;tman &amp; dharma.")).toBe(
      "Kálindí said ātman & dharma.",
    );
  });
});
