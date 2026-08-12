#!/usr/bin/env node
import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";

const inputFile = process.argv[2] ?? "content/_staging/prepared/rag-corpus.jsonl";
const minChunkChars = 200;
const maxChunkChars = 2_400;
const seenHashes = new Map();
const sources = new Set();
const errors = [];
const warnings = [];
let lineNumber = 0;
let chunks = 0;

const lines = createInterface({
  input: createReadStream(inputFile, { encoding: "utf8" }),
  crlfDelay: Infinity,
});

for await (const line of lines) {
  lineNumber += 1;
  const trimmed = line.trim();
  if (!trimmed) continue;
  chunks += 1;

  let chunk;
  try {
    chunk = JSON.parse(trimmed);
  } catch (error) {
    errors.push(
      `line ${lineNumber}: invalid JSON (${error instanceof Error ? error.message : "unknown"})`,
    );
    continue;
  }

  const label = `${chunk?.source_path || "unknown"} ${chunk?.verse_number || ""}`.trim();
  const shapeError = validateShape(chunk);
  if (shapeError) {
    errors.push(`${label}: ${shapeError}`);
    continue;
  }

  sources.add(chunk.source_key);
  const previousPath = seenHashes.get(chunk.chunk_hash);
  if (previousPath && previousPath !== chunk.source_path) {
    errors.push(`${label}: duplicate chunk_hash also used by ${previousPath}`);
  }
  seenHashes.set(chunk.chunk_hash, chunk.source_path);

  const expectedHash = createHash("sha256")
    .update(`${chunk.source_key}\n${chunk.language}\n${chunk.verse_number}\n${chunk.chunk_text}`)
    .digest("hex");
  if (expectedHash !== chunk.chunk_hash) {
    errors.push(`${label}: chunk_hash does not match the prepared chunk contents`);
  }

  if (chunk.chunk_text.length < minChunkChars) {
    errors.push(`${label}: chunk shorter than ${minChunkChars} characters`);
  }
  if (chunk.chunk_text.length > maxChunkChars) {
    errors.push(`${label}: chunk longer than ${maxChunkChars} characters`);
  }
  if (looksLikeBoilerplate(chunk.chunk_text)) {
    warnings.push(`${label}: chunk appears to contain navigation or boilerplate text`);
  }
}

if (chunks === 0) errors.push(`${inputFile}: no chunks found`);

for (const warning of warnings) console.warn(`WARN ${warning}`);
for (const error of errors) console.error(`ERROR ${error}`);
console.info(
  `Source-audited ${chunks} chunks from ${sources.size} sources: ${errors.length} errors, ${warnings.length} warnings.`,
);
if (errors.length > 0) process.exit(1);

function validateShape(chunk) {
  if (!chunk || typeof chunk !== "object" || Array.isArray(chunk)) return "chunk must be an object";
  if (typeof chunk.source_path !== "string" || !chunk.source_path.trim())
    return "missing source_path";
  if (typeof chunk.source_key !== "string" || !chunk.source_key.trim()) return "missing source_key";
  if (typeof chunk.chunk_hash !== "string" || !/^[a-f0-9]{64}$/i.test(chunk.chunk_hash))
    return "invalid chunk_hash";
  if (typeof chunk.language !== "string" || !chunk.language.trim()) return "missing language";
  if (typeof chunk.text_slug !== "string" || !chunk.text_slug.trim()) return "missing text_slug";
  if (typeof chunk.text_title !== "string" || !chunk.text_title.trim()) return "missing text_title";
  if (!["public_domain", "licensed", "original"].includes(chunk.licence)) return "invalid licence";
  if (typeof chunk.copyright_status !== "string" || !chunk.copyright_status.trim())
    return "missing copyright_status";
  if (chunk.can_store !== true || chunk.can_show_excerpts !== true || chunk.can_embed !== true) {
    return "rights flags do not permit store/embed/excerpt";
  }
  if (!isHttpUrl(chunk.source_url)) return "source_url must be a valid http(s) URL";
  if (
    chunk.licence === "licensed" &&
    (typeof chunk.translator !== "string" || !chunk.translator.trim())
  ) {
    return "licensed source is missing translator";
  }
  if (typeof chunk.verse_number !== "string" || !chunk.verse_number.trim())
    return "missing verse_number";
  if (typeof chunk.chunk_text !== "string" || !chunk.chunk_text.trim()) return "missing chunk_text";
  return null;
}

function isHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function looksLikeBoilerplate(value) {
  const normalized = value.toLowerCase();
  return (
    normalized.includes("buy this book") ||
    normalized.includes("return to hinduism index") ||
    normalized.includes("internet sacred text archive") ||
    /^previous:/m.test(normalized) ||
    /^next:/m.test(normalized)
  );
}
