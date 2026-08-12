#!/usr/bin/env node
import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { pathToFileURL } from "node:url";

import { countTokens } from "./token-count.js";

interface PreparedChunk {
  source_path: string;
  source_key: string;
  chunk_hash: string;
  language: string;
  text_slug: string;
  text_title: string;
  category: "shruti" | "smriti" | "itihasa" | "purana" | "agama" | "modern_commentary";
  tradition_primary: string;
  licence: "public_domain" | "licensed" | "original";
  copyright_status: string | null;
  can_store: boolean;
  can_show_excerpts: boolean;
  can_embed: boolean;
  source_metadata: Record<string, unknown>;
  source_url: string | null;
  translator: string | null;
  section: string | null;
  sub_section?: string | null;
  verse_number: string;
  order_index: number;
  original_text: string | null;
  transliteration: string | null;
  translation_en: string | null;
  translation_hi: string | null;
  chunk_text: string;
}

interface SourceDocument {
  rawText: string;
  metadata: Record<string, unknown>;
  sourcePath: string;
  sourceUrl: string | null;
  title: string | null;
  workTitle: string | null;
  section: string | null;
  orderOffset: number;
}

const MIN_CHUNK_CHARS = 200;
const TARGET_CHUNK_CHARS = 1_600;
const MAX_CHUNK_CHARS = 2_400;
const TARGET_CHUNK_TOKENS = 400;
const MAX_CHUNK_TOKENS = 600;

export interface PrepareCorpusOptions {
  inputDir: string;
  outputFile: string;
  allowUncleared?: boolean;
}

export interface PrepareCorpusResult {
  filesCount: number;
  chunksCount: number;
  skipped: Array<{ file: string; reason: string }>;
}

export async function prepareCorpus(options: PrepareCorpusOptions): Promise<PrepareCorpusResult> {
  const files = await listTextLikeFiles(options.inputDir);
  const chunks: PreparedChunk[] = [];
  const skipped: Array<{ file: string; reason: string }> = [];

  for (const file of files) {
    const metadataPath = file.replace(/\.(md|txt|ocr\.txt|html|jsonl|itx|xml)$/i, ".metadata.json");
    const fileMetadata = await readJsonIfExists(metadataPath);
    const raw = await readFile(file, "utf8");
    const documents = extractDocuments(file, raw, fileMetadata);

    for (const document of documents) {
      const metadata = document.metadata;
      const rights = inferRights(metadata, file);
      if (
        !options.allowUncleared &&
        (!rights.can_store || !rights.can_embed || !rights.can_show_excerpts)
      ) {
        skipped.push({
          file: document.sourcePath,
          reason: "missing clear store/embed/excerpt rights",
        });
        continue;
      }

      const cleaned = cleanText(document.rawText);
      if (cleaned.length < 200) {
        skipped.push({
          file: document.sourcePath,
          reason: "less than 200 characters after cleaning",
        });
        continue;
      }

      const paragraphs = chunkText(cleaned);
      const language = inferLanguage(file, metadata);
      const textSlugBase = slugify(
        metadata.slug ?? metadata.id ?? metadata.work_id ?? basenameWithoutKnownExtensions(file),
      );
      const textSlug = metadata.slug
        ? textSlugBase
        : disambiguateSourceSlug(textSlugBase, language, file);
      const title =
        document.workTitle ?? getString(metadata.work_title) ?? titleFromSlug(textSlugBase);
      const sourceUrl =
        document.sourceUrl ??
        getString(metadata.source_url) ??
        getString(metadata.url) ??
        getString(metadata.page_url) ??
        getStringAt(metadata, ["metadata", "identifier-access"]);
      const translator =
        getString(metadata.translator) ??
        getString(metadata.creator) ??
        getStringAt(metadata, ["metadata", "creator"]);
      const sourceKeyBase = slugify(
        metadata.source_key ??
          metadata.work_id ??
          metadata.identifier ??
          getStringAt(metadata, ["metadata", "identifier"]) ??
          textSlugBase,
      );
      const sourceKey = metadata.source_key
        ? sourceKeyBase
        : disambiguateSourceSlug(sourceKeyBase, language, file);

      paragraphs.forEach((paragraph, index) => {
        const orderIndex = document.orderOffset + index + 1;
        const verseNumber = `${basenameWithoutKnownExtensions(file)}#${orderIndex}`;
        const chunkHash = hashString(`${sourceKey}\n${language}\n${verseNumber}\n${paragraph}`);
        chunks.push({
          source_path: document.sourcePath,
          source_key: sourceKey,
          chunk_hash: chunkHash,
          language,
          text_slug: textSlug,
          text_title: title,
          category: inferCategoryFromMetadata(metadata, file, title),
          tradition_primary: inferTraditionFromMetadata(metadata, file, title),
          licence: rights.licence,
          copyright_status: rights.copyright_status,
          can_store: rights.can_store,
          can_show_excerpts: rights.can_show_excerpts,
          can_embed: rights.can_embed,
          source_metadata: pruneLargeMetadata(metadata),
          source_url: sourceUrl,
          translator,
          section: document.section ?? getString(metadata.section),
          sub_section: null,
          verse_number: verseNumber,
          order_index: orderIndex,
          original_text: language !== "en" && language !== "hi" ? paragraph : null,
          transliteration: null,
          translation_en: language === "en" ? paragraph : null,
          translation_hi: language === "hi" ? paragraph : null,
          chunk_text: paragraph,
        });
      });
    }
  }

  await mkdir(dirname(options.outputFile), { recursive: true });
  await writeFile(
    options.outputFile,
    `${chunks.map((chunk) => JSON.stringify(chunk)).join("\n")}\n`,
  );
  await writeFile(
    `${options.outputFile}.skipped.json`,
    `${JSON.stringify({ skipped_count: skipped.length, skipped }, null, 2)}\n`,
  );

  return {
    filesCount: files.length,
    chunksCount: chunks.length,
    skipped,
  };
}

export function extractDocuments(
  file: string,
  raw: string,
  fileMetadata: Record<string, unknown>,
): SourceDocument[] {
  const sourcePath = relative(process.cwd(), file).replace(/\\/g, "/");
  if (file.toLowerCase().endsWith(".md")) {
    const markdown = parseMarkdownFrontmatter(raw);
    return [
      {
        rawText: markdown.body,
        metadata: { ...fileMetadata, ...markdown.metadata },
        sourcePath,
        sourceUrl: getString(markdown.metadata.source_url) ?? extractSourceUrl(markdown.body),
        title: null,
        workTitle:
          getString(markdown.metadata.work_title) ??
          getString(markdown.metadata.text_title) ??
          getString(fileMetadata.work_title) ??
          getString(fileMetadata.title),
        section: getString(markdown.metadata.section),
        orderOffset: 0,
      },
    ];
  }

  if (file.toLowerCase().endsWith(".jsonl")) {
    return raw
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .flatMap((line, index): SourceDocument[] => {
        try {
          const row = JSON.parse(line) as Record<string, unknown>;
          const rowHtml = getString(row.html);
          const rowText = getString(row.text) ?? getString(row.content) ?? rowHtml;
          if (!rowText) {
            return [];
          }
          const metadata = { ...fileMetadata, ...row };
          return [
            {
              rawText: rowText,
              metadata,
              sourcePath: `${sourcePath}#${index + 1}`,
              sourceUrl: getString(row.page_url) ?? getString(row.url),
              title: getString(row.title),
              workTitle:
                getString(fileMetadata.work_title) ??
                getString(fileMetadata.title) ??
                titleFromSlug(
                  slugify(
                    row.work_id ??
                      row.identifier ??
                      fileMetadata.work_id ??
                      fileMetadata.identifier ??
                      basenameWithoutKnownExtensions(file),
                  ),
                ),
              section: getString(row.title),
              orderOffset: index * 10_000,
            },
          ];
        } catch {
          return [
            {
              rawText: line,
              metadata: fileMetadata,
              sourcePath: `${sourcePath}#${index + 1}`,
              sourceUrl: null,
              title: null,
              workTitle: getString(fileMetadata.work_title) ?? getString(fileMetadata.title),
              section: null,
              orderOffset: index * 10_000,
            },
          ];
        }
      });
  }

  return [
    {
      rawText: raw,
      metadata: fileMetadata,
      sourcePath,
      sourceUrl: extractSourceUrl(raw),
      title: null,
      workTitle: getString(fileMetadata.work_title) ?? getString(fileMetadata.title),
      section: null,
      orderOffset: 0,
    },
  ];
}

if (isCliEntry()) {
  const inputDir = process.argv[2] ?? "content/_staging/raw";
  const outputFile = process.argv[3] ?? "content/_staging/prepared/rag-corpus.jsonl";
  const result = await prepareCorpus({
    inputDir,
    outputFile,
    allowUncleared: process.argv.includes("--allow-uncleared"),
  });
  console.info(
    `Prepared ${result.chunksCount} chunks from ${result.filesCount} files at ${outputFile}`,
  );
  console.info(
    `Skipped ${result.skipped.length} files; report written to ${outputFile}.skipped.json`,
  );
}

async function listTextLikeFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        return listTextLikeFiles(fullPath);
      }

      if (isCorpusTextFile(entry.name)) {
        return [fullPath];
      }

      return [];
    }),
  );
  // Stable ordering makes chunk order, order_index, and generated JSONL
  // reproducible across filesystems. This is important for resumable,
  // idempotent ingestion and for meaningful corpus diffs.
  return nested.flat().sort((left, right) => left.localeCompare(right));
}

async function readJsonIfExists(path: string): Promise<Record<string, unknown>> {
  try {
    return JSON.parse(await readFile(path, "utf8")) as Record<string, unknown>;
  } catch {
    return {};
  }
}

export function cleanText(raw: string): string {
  const stripped = raw
    .replace(/<head[\s\S]*?<\/head>/gi, " ")
    .replace(/<nav[\s\S]*?<\/nav>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<\/(p|div|h[1-6]|li|br|tr)>/gi, "\n\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&#9;/g, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, code: string) => decodeHtmlCodepoint(code, 10))
    .replace(/&#x([a-f0-9]+);/gi, (_, code: string) => decodeHtmlCodepoint(code, 16))
    .replace(/&([a-z][a-z0-9]+);/gi, (_, entity: string) => decodeNamedHtmlEntity(entity))
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[`*_~]/g, "")
    .replace(/^\s*[-*_]{3,}\s*$/gm, "")
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return removeBoilerplateLines(stripped);
}

export function parseMarkdownFrontmatter(raw: string): {
  metadata: Record<string, unknown>;
  body: string;
} {
  const normalized = raw.replace(/^\uFEFF/, "");
  if (!normalized.startsWith("---\n") && !normalized.startsWith("---\r\n")) {
    return { metadata: {}, body: raw };
  }

  const match = normalized.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    return { metadata: {}, body: raw };
  }

  const metadata: Record<string, unknown> = {};
  const metadataText = match[1] ?? "";
  const body = match[2] ?? "";
  for (const line of metadataText.split(/\r?\n/)) {
    const separator = line.indexOf(":");
    if (separator <= 0) continue;
    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim();
    if (!key) continue;
    metadata[key] = parseFrontmatterValue(value);
  }
  return { metadata, body };
}

function parseFrontmatterValue(value: string): unknown {
  if (!value) return null;
  if (value === "true") return true;
  if (value === "false") return false;
  if (value === "null") return null;
  if (/^-?\d+(?:\.\d+)?$/.test(value)) return Number(value);
  if (
    (value.startsWith("[") && value.endsWith("]")) ||
    (value.startsWith("{") && value.endsWith("}"))
  ) {
    try {
      return JSON.parse(value);
    } catch {
      // Preserve malformed YAML as text so the content audit can reject it.
    }
  }
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1).replace(/''/g, "'");
  }
  return value;
}

export function chunkText(text: string): string[] {
  const paragraphs = text
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    // Keep short paragraphs here. They may be verse lines, headings, or
    // Devanagari text whose useful units are much shorter than English prose;
    // the packing and audit stages decide whether they form a valid chunk.
    .filter(Boolean)
    .flatMap((paragraph) => splitLongParagraph(paragraph));
  const chunks: string[] = [];
  let current = "";

  for (const paragraph of paragraphs) {
    const candidate = current ? `${current}\n\n${paragraph}` : paragraph;
    if (exceedsTarget(candidate) && current.length >= MIN_CHUNK_CHARS) {
      chunks.push(current);
      current = paragraph;
    } else {
      current = candidate;
    }

    while (exceedsMaximum(current)) {
      const [head, tail] = splitAtTokenBudget(current, TARGET_CHUNK_TOKENS);
      chunks.push(head);
      current = tail;
    }
  }

  if (current) {
    chunks.push(current);
  }

  return mergeShortChunks(chunks);
}

function isCorpusTextFile(name: string): boolean {
  if (name.endsWith(".metadata.json")) {
    return false;
  }

  if (/_download_log(?:_|\.|$)/i.test(name) || /download_log_\d{4}/i.test(name)) {
    return false;
  }

  return /\.(md|txt|ocr\.txt|html|jsonl|itx|xml)$/i.test(name);
}

function splitLongParagraph(paragraph: string): string[] {
  if (!exceedsMaximum(paragraph)) {
    return [paragraph];
  }

  const segments = paragraph
    .split(/(?<=[.!?।॥])\s+/u)
    .map((segment) => segment.trim())
    .filter(Boolean);

  if (segments.length <= 1) {
    return splitOversizedSegment(paragraph);
  }

  const chunks: string[] = [];
  let current = "";

  for (const segment of segments) {
    const pieces = exceedsMaximum(segment) ? splitOversizedSegment(segment) : [segment];
    for (const piece of pieces) {
      const candidate = current ? `${current} ${piece}` : piece;
      if (exceedsTarget(candidate) && current.length >= MIN_CHUNK_CHARS) {
        chunks.push(current);
        current = piece;
      } else {
        current = candidate;
      }
    }
  }

  if (current) {
    chunks.push(current);
  }

  return chunks;
}

function splitOversizedSegment(segment: string): string[] {
  const chunks: string[] = [];
  let rest = segment.trim();

  while (exceedsMaximum(rest)) {
    const [head, tail] = splitAtTokenBudget(rest, TARGET_CHUNK_TOKENS);
    chunks.push(head);
    rest = tail;
  }

  if (rest) {
    chunks.push(rest);
  }

  return chunks;
}

function splitAtTokenBudget(value: string, targetTokens: number): [string, string] {
  const maxPrefixLength = largestPrefixWithinBudget(value, targetTokens);
  const leftWindow = value.slice(0, maxPrefixLength);
  const boundary = Math.max(
    leftWindow.lastIndexOf("\n"),
    leftWindow.lastIndexOf(". "),
    leftWindow.lastIndexOf("? "),
    leftWindow.lastIndexOf("! "),
    leftWindow.lastIndexOf(" "),
  );
  const index = boundary >= MIN_CHUNK_CHARS ? boundary + 1 : maxPrefixLength;
  if (index <= 0 || index >= value.length) {
    throw new Error("Could not split an oversized corpus segment within the token budget.");
  }
  return [value.slice(0, index).trim(), value.slice(index).trim()];
}

function exceedsTarget(value: string): boolean {
  return value.length > TARGET_CHUNK_CHARS || countTokens(value) > TARGET_CHUNK_TOKENS;
}

function exceedsMaximum(value: string): boolean {
  return value.length > MAX_CHUNK_CHARS || countTokens(value) > MAX_CHUNK_TOKENS;
}

function largestPrefixWithinBudget(value: string, tokenBudget: number): number {
  let low = 1;
  let high = Math.min(value.length, MAX_CHUNK_CHARS);
  let best = 0;

  while (low <= high) {
    const midpoint = toCodePointBoundary(value, Math.floor((low + high) / 2));
    if (midpoint <= 0) break;
    if (countTokens(value.slice(0, midpoint)) <= tokenBudget) {
      best = midpoint;
      low = midpoint + 1;
    } else {
      high = midpoint - 1;
    }
  }

  if (best > 0) return best;
  return toCodePointBoundary(value, Math.min(value.length, TARGET_CHUNK_CHARS));
}

function toCodePointBoundary(value: string, index: number): number {
  let boundary = Math.max(0, Math.min(index, value.length));
  while (boundary > 0) {
    const code = value.charCodeAt(boundary);
    if (code < 0xdc00 || code > 0xdfff) break;
    boundary -= 1;
  }
  return boundary;
}

function mergeShortChunks(chunks: string[]): string[] {
  const merged: string[] = [];

  for (let index = 0; index < chunks.length; index += 1) {
    const chunk = chunks[index] ?? "";
    const previous = merged.at(-1);

    if (chunk.length < MIN_CHUNK_CHARS && previous && !exceedsMaximum(`${previous}\n\n${chunk}`)) {
      merged[merged.length - 1] = `${previous}\n\n${chunk}`;
      continue;
    }

    // A short first/final fragment may not fit beside the preceding chunk.
    // Try the following chunk as well so every emitted chunk satisfies the
    // same lower bound enforced by audit and ingestion.
    const next = chunks[index + 1];
    if (chunk.length < MIN_CHUNK_CHARS && next && !exceedsMaximum(`${chunk}\n\n${next}`)) {
      chunks[index + 1] = `${chunk}\n\n${next}`;
      continue;
    }

    if (chunk.length < MIN_CHUNK_CHARS) {
      const rebalanced = rebalanceShortChunk(merged, chunk);
      if (rebalanced) {
        merged[merged.length - 1] = rebalanced.previous;
        merged.push(rebalanced.current);
        continue;
      }

      const rebalancedWithNext = rebalanceShortChunkWithNext(chunk, next);
      if (rebalancedWithNext) {
        chunks[index + 1] = rebalancedWithNext.next;
        merged.push(rebalancedWithNext.current);
        continue;
      }
    }

    merged.push(chunk);
  }

  // Never silently discard source text. Fail preparation if a fragment cannot
  // be packed without violating the hard retrieval bounds.
  const unresolved = merged.filter((chunk) => chunk.length < MIN_CHUNK_CHARS);
  if (unresolved.length > 0) {
    throw new Error(
      `Could not pack ${unresolved.length} corpus fragment(s) to the minimum ${MIN_CHUNK_CHARS}-character retrieval size.`,
    );
  }

  return merged;
}

function rebalanceShortChunk(
  merged: string[],
  chunk: string,
): { previous: string; current: string } | null {
  const previous = merged.at(-1);
  if (!previous || previous.length <= MIN_CHUNK_CHARS) return null;

  const minimumTransfer = Math.max(1, MIN_CHUNK_CHARS - chunk.length - 2);
  const maximumTransfer = previous.length - MIN_CHUNK_CHARS;
  for (let transfer = minimumTransfer; transfer <= maximumTransfer; transfer += 1) {
    const split = previous.length - transfer;
    const left = previous.slice(0, split).trimEnd();
    const moved = previous.slice(split).trimStart();
    const current = `${moved}\n\n${chunk}`.trim();
    if (
      left.length >= MIN_CHUNK_CHARS &&
      current.length >= MIN_CHUNK_CHARS &&
      !exceedsMaximum(left) &&
      !exceedsMaximum(current)
    ) {
      return { previous: left, current };
    }
  }

  return null;
}

function rebalanceShortChunkWithNext(
  chunk: string,
  next: string | undefined,
): { current: string; next: string } | null {
  if (!next || next.length <= MIN_CHUNK_CHARS) return null;

  const minimumTransfer = Math.max(1, MIN_CHUNK_CHARS - chunk.length - 2);
  const maximumTransfer = next.length - MIN_CHUNK_CHARS;
  for (let transfer = minimumTransfer; transfer <= maximumTransfer; transfer += 1) {
    const moved = next.slice(0, transfer).trimEnd();
    const rest = next.slice(transfer).trimStart();
    const current = `${chunk}\n\n${moved}`.trim();
    if (
      rest.length >= MIN_CHUNK_CHARS &&
      current.length >= MIN_CHUNK_CHARS &&
      !exceedsMaximum(current) &&
      !exceedsMaximum(rest)
    ) {
      return { current, next: rest };
    }
  }

  return null;
}

function basenameWithoutKnownExtensions(path: string): string {
  const name = path.split(/[\\/]/).at(-1) ?? "source";
  return name
    .replace(/\.ocr\.txt$/i, "")
    .replace(/\.(metadata\.json|md|txt|html|jsonl|itx|xml)$/i, "");
}

function slugify(value: unknown): string {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function titleFromSlug(slug: string): string {
  return slug
    .split("_")
    .filter(Boolean)
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(" ");
}

function disambiguateSourceSlug(base: string, language: string, file: string): string {
  const fileIdentity = relative(process.cwd(), file).replace(/\\/g, "/").toLowerCase();
  return `${base}_${language}_${hashString(fileIdentity).slice(0, 10)}`;
}

function normalizeLicence(value: unknown): "public_domain" | "licensed" | "original" {
  const text = typeof value === "string" ? value.toLowerCase() : "";
  if (text.includes("original")) {
    return "original";
  }
  if (text.includes("licensed")) {
    return "licensed";
  }
  return "public_domain";
}

export function inferRights(
  metadata: Record<string, unknown>,
  file: string,
): {
  licence: "public_domain" | "licensed" | "original";
  copyright_status: string | null;
  can_store: boolean;
  can_show_excerpts: boolean;
  can_embed: boolean;
} {
  const joined = JSON.stringify(metadata).toLowerCase();
  const path = file.toLowerCase();
  const explicitLicence =
    metadata.licence ??
    metadata.license ??
    metadata.copyright_status ??
    getStringAt(metadata, ["metadata", "licenseurl"]);
  const licence = normalizeLicence(explicitLicence);
  const hasPublicDomainSignal =
    joined.includes("publicdomain") ||
    joined.includes("public domain") ||
    path.includes("public_domain") ||
    path.includes("project_gutenberg") ||
    path.includes("sacred_texts");
  const hasBlockedSignal =
    joined.includes("unclear rights") ||
    joined.includes("permission needed") ||
    joined.includes("all rights reserved") ||
    joined.includes("permission required") ||
    joined.includes("cc by-nc") ||
    joined.includes("cc-by-nc");
  const explicitStore = getBoolean(metadata.can_store);
  const explicitExcerpts = getBoolean(metadata.can_show_excerpts ?? metadata.can_show_excerpt);
  const explicitEmbed = getBoolean(metadata.can_embed);
  const publicDomainCleared =
    licence === "public_domain" && hasPublicDomainSignal && !hasBlockedSignal;
  const originalCleared = licence === "original" && !hasBlockedSignal;
  const defaultCleared = licence === "licensed" ? false : publicDomainCleared || originalCleared;
  const rightsCleared = (value: boolean | null): boolean =>
    !hasBlockedSignal && (value ?? defaultCleared);

  return {
    licence,
    copyright_status:
      getString(metadata.copyright_status) ?? (hasPublicDomainSignal ? "public_domain" : null),
    can_store: rightsCleared(explicitStore),
    can_show_excerpts: rightsCleared(explicitExcerpts),
    can_embed: rightsCleared(explicitEmbed),
  };
}

function inferCategory(path: string, title: string): PreparedChunk["category"] {
  const value = `${path} ${title}`.toLowerCase();
  if (value.includes("veda") || value.includes("upanishad")) return "shruti";
  if (value.includes("mahabharata") || value.includes("ramayana")) return "itihasa";
  if (value.includes("purana") || value.includes("bhagavatam")) return "purana";
  if (value.includes("agama") || value.includes("tantra")) return "agama";
  if (
    value.includes("vivekananda") ||
    value.includes("philosophy") ||
    value.includes("commentary")
  ) {
    return "modern_commentary";
  }
  return "smriti";
}

function inferCategoryFromMetadata(
  metadata: Record<string, unknown>,
  path: string,
  title: string,
): PreparedChunk["category"] {
  const value = getString(metadata.category)?.trim().toLowerCase();
  if (
    value === "shruti" ||
    value === "smriti" ||
    value === "itihasa" ||
    value === "purana" ||
    value === "agama" ||
    value === "modern_commentary"
  ) {
    return value;
  }
  return inferCategory(path, title);
}

function inferTradition(path: string, title: string): string {
  const value = `${path} ${title}`.toLowerCase();
  if (value.includes("shaiva") || value.includes("siva") || value.includes("shiva"))
    return "shaiva";
  if (value.includes("shakta") || value.includes("devi") || value.includes("kali")) return "shakta";
  if (value.includes("vaishnava") || value.includes("vishnu") || value.includes("krishna"))
    return "vaishnava";
  if (value.includes("advaita") || value.includes("sankara") || value.includes("shankara"))
    return "advaita";
  if (value.includes("ramanuja") || value.includes("vishishtadvaita")) return "vishishtadvaita";
  return "general";
}

function inferTraditionFromMetadata(
  metadata: Record<string, unknown>,
  path: string,
  title: string,
): string {
  const value = getString(metadata.tradition_primary)?.trim().toLowerCase();
  if (
    value === "general" ||
    value === "vaishnava" ||
    value === "shaiva" ||
    value === "shakta" ||
    value === "smarta" ||
    value === "advaita" ||
    value === "vishishtadvaita" ||
    value === "dvaita"
  ) {
    return value;
  }
  return inferTradition(path, title);
}

export function inferLanguage(path: string, metadata: Record<string, unknown>): string {
  const explicit = metadata.language ?? metadata.lang;
  if (typeof explicit === "string" && explicit.length > 0) {
    return explicit.toLowerCase().slice(0, 2);
  }

  const normalized = path.replace(/\\/g, "/").toLowerCase();
  if (
    normalized.includes("/hindi/") ||
    normalized.endsWith("_hi.txt") ||
    normalized.endsWith("_hi.ocr.txt")
  )
    return "hi";
  if (
    normalized.includes("/sanskrit/") ||
    normalized.endsWith("_sa.xml") ||
    normalized.endsWith("_sa.jsonl")
  )
    return "sa";
  if (normalized.includes("/bengali/") || normalized.endsWith("_bn.ocr.txt")) return "bn";
  if (normalized.includes("/gujarati/") || normalized.endsWith("_gu.ocr.txt")) return "gu";
  if (normalized.includes("/marathi/") || normalized.endsWith("_mr.ocr.txt")) return "mr";
  if (normalized.includes("/tamil/") || normalized.endsWith("_ta.html")) return "ta";
  if (
    normalized.includes("/telugu/") ||
    normalized.endsWith("_te.html") ||
    normalized.endsWith("_te.ocr.txt")
  )
    return "te";
  if (normalized.includes("/urdu/") || normalized.endsWith("_ur.ocr.txt")) return "ur";
  return "en";
}

function hashString(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function getString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function getBoolean(value: unknown): boolean | null {
  return typeof value === "boolean" ? value : null;
}

function getStringAt(metadata: Record<string, unknown>, path: string[]): string | null {
  let value: unknown = metadata;
  for (const key of path) {
    if (typeof value !== "object" || value === null || !(key in value)) {
      return null;
    }
    value = (value as Record<string, unknown>)[key];
  }
  return getString(value);
}

function extractSourceUrl(raw: string): string | null {
  const canonical = /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i.exec(raw);
  if (canonical?.[1]) {
    return canonical[1];
  }

  const ogUrl = /<meta[^>]+property=["']og:url["'][^>]+content=["']([^"']+)["']/i.exec(raw);
  if (ogUrl?.[1]) {
    return ogUrl[1];
  }

  return null;
}

function decodeHtmlCodepoint(code: string, radix: number): string {
  const value = Number.parseInt(code, radix);
  if (!Number.isFinite(value)) {
    return "";
  }

  try {
    return String.fromCodePoint(value);
  } catch {
    return "";
  }
}

function decodeNamedHtmlEntity(entity: string): string {
  const namedEntities: Record<string, string> = {
    aacute: "á",
    Aacute: "Á",
    acirc: "â",
    Acirc: "Â",
    agrave: "à",
    Agrave: "À",
    aring: "å",
    Aring: "Å",
    atilde: "ã",
    Atilde: "Ã",
    auml: "ä",
    Auml: "Ä",
    ccedil: "ç",
    Ccedil: "Ç",
    eacute: "é",
    Eacute: "É",
    ecirc: "ê",
    Ecirc: "Ê",
    egrave: "è",
    Egrave: "È",
    euml: "ë",
    Euml: "Ë",
    iacute: "í",
    Iacute: "Í",
    icirc: "î",
    Icirc: "Î",
    igrave: "ì",
    Igrave: "Ì",
    iuml: "ï",
    Iuml: "Ï",
    ntilde: "ñ",
    Ntilde: "Ñ",
    oacute: "ó",
    Oacute: "Ó",
    ocirc: "ô",
    Ocirc: "Ô",
    ograve: "ò",
    Ograve: "Ò",
    oslash: "ø",
    Oslash: "Ø",
    otilde: "õ",
    Otilde: "Õ",
    ouml: "ö",
    Ouml: "Ö",
    rsquo: "'",
    lsquo: "'",
    rdquo: '"',
    ldquo: '"',
    sacute: "ś",
    Sacute: "Ś",
    uacute: "ú",
    Uacute: "Ú",
    ucirc: "û",
    Ucirc: "Û",
    ugrave: "ù",
    Ugrave: "Ù",
    uuml: "ü",
    Uuml: "Ü",
    yacute: "ý",
    Yacute: "Ý",
  };
  return namedEntities[entity] ?? `&${entity};`;
}

function pruneLargeMetadata(metadata: Record<string, unknown>): Record<string, unknown> {
  const clone = { ...metadata };
  delete clone.files;
  delete clone.html;
  return clone;
}

function removeBoilerplateLines(text: string): string {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .filter((line) => !isBoilerplateLine(line))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function isBoilerplateLine(line: string): boolean {
  return (
    /^sacred texts$/i.test(line) ||
    /^hinduism$/i.test(line) ||
    /^index$/i.test(line) ||
    /^contents$/i.test(line) ||
    /^start reading$/i.test(line) ||
    /^page index$/i.test(line) ||
    /^text \[zipped\]$/i.test(line) ||
    /^home$/i.test(line) ||
    /buy this book/i.test(line) ||
    /^previous:/i.test(line) ||
    /^next:/i.test(line) ||
    /^return to hinduism index$/i.test(line) ||
    /^page navigation$/i.test(line) ||
    /^internet sacred text archive$/i.test(line)
  );
}

function isCliEntry(): boolean {
  const scriptPath = process.argv[1];
  return scriptPath ? import.meta.url === pathToFileURL(scriptPath).href : false;
}
