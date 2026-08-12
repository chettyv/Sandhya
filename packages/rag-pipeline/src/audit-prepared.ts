#!/usr/bin/env node
import { createReadStream } from "node:fs";
import { createInterface } from "node:readline/promises";
import { pathToFileURL } from "node:url";

import { countTokens } from "./token-count.js";

interface PreparedChunk {
  source_path: string;
  source_key: string;
  chunk_hash: string;
  language: string;
  text_slug: string;
  text_title: string;
  licence: "public_domain" | "licensed" | "original";
  copyright_status: string | null;
  can_store: boolean;
  can_show_excerpts: boolean;
  can_embed: boolean;
  source_url: string | null;
  translator: string | null;
  verse_number: string;
  chunk_text: string;
}

export interface AuditOptions {
  inputFile: string;
  maxChunkChars?: number;
  minChunkChars?: number;
  maxChunkTokens?: number;
  requireSourceUrl?: boolean;
}

export interface AuditResult {
  chunks: number;
  sources: number;
  errors: string[];
  warnings: string[];
}

const DEFAULT_MIN_CHUNK_CHARS = 200;
const DEFAULT_MAX_CHUNK_CHARS = 2_400;
const DEFAULT_MAX_CHUNK_TOKENS = 600;

if (isCliEntry()) {
  const inputFile = process.argv[2] ?? "content/_staging/prepared/rag-corpus.jsonl";
  const result = await auditPreparedCorpus({
    inputFile,
    requireSourceUrl: !process.argv.includes("--allow-missing-source-url"),
  });

  for (const warning of result.warnings) {
    console.warn(`WARN ${warning}`);
  }
  for (const error of result.errors) {
    console.error(`ERROR ${error}`);
  }

  console.info(
    `Audited ${result.chunks} chunks from ${result.sources} sources: ` +
      `${result.errors.length} errors, ${result.warnings.length} warnings.`,
  );

  if (result.errors.length > 0) {
    process.exit(1);
  }
}

export async function auditPreparedCorpus(options: AuditOptions): Promise<AuditResult> {
  const minChunkChars = options.minChunkChars ?? DEFAULT_MIN_CHUNK_CHARS;
  const maxChunkChars = options.maxChunkChars ?? DEFAULT_MAX_CHUNK_CHARS;
  const maxChunkTokens = options.maxChunkTokens ?? DEFAULT_MAX_CHUNK_TOKENS;
  const requireSourceUrl = options.requireSourceUrl ?? true;
  const seenHashes = new Map<string, string>();
  const sourceKeys = new Set<string>();
  const warnings: string[] = [];
  const errors: string[] = [];
  let chunks = 0;

  const lines = createInterface({
    input: createReadStream(options.inputFile, { encoding: "utf8" }),
    crlfDelay: Number.POSITIVE_INFINITY,
  });

  for await (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      continue;
    }
    chunks += 1;

    let chunk: PreparedChunk;
    try {
      chunk = JSON.parse(trimmed) as PreparedChunk;
    } catch (error) {
      errors.push(
        `line ${chunks}: invalid JSON (${error instanceof Error ? error.message : "unknown"})`,
      );
      continue;
    }

    const label = `${chunk.source_path || "unknown"} ${chunk.verse_number || ""}`.trim();
    const shapeError = validateChunkShape(chunk);
    if (shapeError) {
      errors.push(`${label}: ${shapeError}`);
      continue;
    }

    sourceKeys.add(chunk.source_key);

    const previousHashPath = seenHashes.get(chunk.chunk_hash);
    if (previousHashPath && previousHashPath !== chunk.source_path) {
      errors.push(`${label}: duplicate chunk_hash also used by ${previousHashPath}`);
    }
    seenHashes.set(chunk.chunk_hash, chunk.source_path);

    if (!chunk.can_store || !chunk.can_embed || !chunk.can_show_excerpts) {
      errors.push(`${label}: rights flags do not permit store/embed/excerpt`);
    }

    if (!chunk.copyright_status?.trim()) {
      errors.push(`${label}: missing copyright_status in the source rights record`);
    }

    if (chunk.licence === "licensed" && !chunk.translator?.trim()) {
      errors.push(`${label}: licensed source is missing translator in the source rights record`);
    }

    if (!chunk.source_url) {
      const message = `${label}: missing source_url in the source rights record`;
      if (requireSourceUrl) errors.push(message);
      else warnings.push(message);
    } else if (!isHttpUrl(chunk.source_url)) {
      errors.push(`${label}: source_url must be a valid http(s) URL`);
    }

    const chunkTokens = countTokens(chunk.chunk_text);
    if (chunk.chunk_text.length < minChunkChars) {
      errors.push(`${label}: chunk shorter than ${minChunkChars} characters`);
    }

    if (chunk.chunk_text.length > maxChunkChars) {
      errors.push(`${label}: chunk longer than ${maxChunkChars} characters`);
    }

    if (chunkTokens > maxChunkTokens) {
      errors.push(`${label}: chunk exceeds ${maxChunkTokens} tokens`);
    }

    if (looksLikeBoilerplate(chunk.chunk_text)) {
      warnings.push(`${label}: chunk appears to contain navigation or boilerplate text`);
    }
  }

  if (chunks === 0) {
    errors.push(`${options.inputFile}: no chunks found`);
  }

  return {
    chunks,
    sources: sourceKeys.size,
    errors,
    warnings,
  };
}

function validateChunkShape(chunk: PreparedChunk): string | null {
  if (typeof chunk.source_path !== "string" || !chunk.source_path) return "missing source_path";
  if (typeof chunk.source_key !== "string" || !chunk.source_key) return "missing source_key";
  if (typeof chunk.chunk_hash !== "string" || !/^[a-f0-9]{64}$/i.test(chunk.chunk_hash)) {
    return "invalid chunk_hash";
  }
  if (typeof chunk.language !== "string" || !chunk.language) return "missing language";
  if (typeof chunk.text_slug !== "string" || !chunk.text_slug) return "missing text_slug";
  if (typeof chunk.text_title !== "string" || !chunk.text_title) return "missing text_title";
  if (!["public_domain", "licensed", "original"].includes(chunk.licence)) return "invalid licence";
  if (typeof chunk.can_store !== "boolean") return "missing can_store";
  if (typeof chunk.can_show_excerpts !== "boolean") return "missing can_show_excerpts";
  if (typeof chunk.can_embed !== "boolean") return "missing can_embed";
  if (typeof chunk.verse_number !== "string" || !chunk.verse_number) return "missing verse_number";
  if (typeof chunk.chunk_text !== "string" || !chunk.chunk_text.trim()) return "missing chunk_text";
  if (chunk.source_url !== null && typeof chunk.source_url !== "string") {
    return "invalid source_url";
  }
  return null;
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function looksLikeBoilerplate(value: string): boolean {
  const normalized = value.toLowerCase();
  return (
    normalized.includes("buy this book") ||
    normalized.includes("return to hinduism index") ||
    normalized.includes("internet sacred text archive") ||
    /^previous:/m.test(normalized) ||
    /^next:/m.test(normalized)
  );
}

function isCliEntry(): boolean {
  const scriptPath = process.argv[1];
  return scriptPath ? import.meta.url === pathToFileURL(scriptPath).href : false;
}
