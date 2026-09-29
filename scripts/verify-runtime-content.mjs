#!/usr/bin/env node

import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

export const SUPPORTED_LANGUAGE_CODES = ["en", "hi", "bn", "gu", "mr", "ta"];
export const RUNTIME_FIELD_NAMES = [
  "slug",
  "textRef",
  "tradition",
  "tags",
  "dailyPool",
  "devanagari",
  "iast",
  "sayIt",
  "translation",
  "source",
  "reflection",
  "words",
  "meaning",
  "translations",
  "meanings",
];

const REQUIRED_STRING_FIELDS = new Set([
  "slug",
  "textRef",
  "tradition",
  "devanagari",
  "iast",
  "sayIt",
  "translation",
  "source",
  "reflection",
  "meaning",
]);
const KNOWN_MARKERS = [
  "translation pending",
  "meaning pending",
  "pending review",
  "review before ship",
  "placeholder",
  "tbd",
  "todo",
  "draft",
];

export function parseShlokaMarkdown(source, sourcePath = "content.md") {
  const { frontmatter, body } = parseFrontmatter(source);
  const sections = parseSections(body);
  const labels = {};
  const translations = {};
  const malformedLanguageLabels = [];

  for (const match of (sections.Shloka ?? "").matchAll(
    /^\*\*(Devanagari|IAST|Say it|Meaning(?: \(([^)]+)\))?|Source):\*\*\s*(.*)$/gm,
  )) {
    const label = match[1];
    const language = match[2];
    const value = (match[3] ?? "").trim();
    if (label.startsWith("Meaning (") && language) {
      translations[language] = value;
      if (!isSupportedLanguageCode(language)) malformedLanguageLabels.push(language);
    } else if (label === "Meaning") {
      labels.translation = value;
    } else {
      labels[label] = value;
    }
  }

  const meanings = {};
  for (const [title, text] of Object.entries(sections)) {
    const match = title.match(/^Meaning \(([^)]+)\)$/);
    if (!match) continue;
    const language = match[1];
    meanings[language] = text;
    if (!isSupportedLanguageCode(language)) malformedLanguageLabels.push(language);
  }

  const runtime = {
    slug: frontmatter?.shloka_slug,
    textRef: frontmatter?.text_ref,
    tradition: frontmatter?.tradition_primary,
    tags: parseTags(frontmatter?.tags),
    dailyPool: frontmatter?.daily_pool === true,
    devanagari: labels.Devanagari,
    iast: labels.IAST,
    sayIt: labels["Say it"],
    translation: labels.translation,
    source: labels.Source,
    reflection: sections.Reflection ?? "",
    words: [
      ...(sections["Word by word"] ?? "").matchAll(/^[-*]\s+\*\*(.+?)\*\*\s+—\s+(.+)$/gm),
    ].map((match) => ({ word: match[1].trim(), meaning: match[2].trim() })),
    meaning: sections.Meaning ?? "",
    translations,
    meanings,
  };

  return {
    sourcePath,
    frontmatter: frontmatter ?? {},
    runtime,
    malformedLanguageLabels: [...new Set(malformedLanguageLabels)],
  };
}

export function validateRuntimeDocument(document) {
  const issues = [];
  const runtime = document.runtime ?? {};

  for (const field of RUNTIME_FIELD_NAMES) {
    const value = runtime[field];
    if (value === undefined || value === null || (typeof value === "string" && !value.trim())) {
      issues.push(`${document.sourcePath}: missing runtime field: ${field}`);
    }
  }
  for (const field of REQUIRED_STRING_FIELDS) {
    if (typeof runtime[field] !== "string" || !runtime[field].trim()) {
      issues.push(`${document.sourcePath}: ${field} must be a non-empty string`);
    }
  }
  if (!Array.isArray(runtime.tags)) issues.push(`${document.sourcePath}: tags must be an array`);
  if (typeof runtime.dailyPool !== "boolean") {
    issues.push(`${document.sourcePath}: dailyPool must be boolean`);
  }
  if (!Array.isArray(runtime.words)) {
    issues.push(`${document.sourcePath}: words must be an array`);
  } else {
    runtime.words.forEach((word, index) => {
      if (!word || typeof word.word !== "string" || !word.word.trim()) {
        issues.push(`${document.sourcePath}: words[${index}].word must be non-empty`);
      }
      if (!word || typeof word.meaning !== "string" || !word.meaning.trim()) {
        issues.push(`${document.sourcePath}: words[${index}].meaning must be non-empty`);
      }
    });
  }
  for (const field of ["translations", "meanings"]) {
    if (!runtime[field] || typeof runtime[field] !== "object" || Array.isArray(runtime[field])) {
      issues.push(`${document.sourcePath}: ${field} must be an object`);
      continue;
    }
    for (const language of Object.keys(runtime[field])) {
      if (!/^[a-z]{2}$/.test(language)) {
        issues.push(`${document.sourcePath}: malformed language code: ${language}`);
      } else if (!SUPPORTED_LANGUAGE_CODES.includes(language)) {
        issues.push(`${document.sourcePath}: unsupported language code: ${language}`);
      }
      if (typeof runtime[field][language] !== "string" || !runtime[field][language].trim()) {
        issues.push(`${document.sourcePath}: ${field}.${language} must be non-empty`);
      }
    }
  }
  for (const language of document.malformedLanguageLabels ?? []) {
    if (!/^[a-z]{2}$/.test(language)) {
      issues.push(`${document.sourcePath}: malformed language code: ${language}`);
    } else if (!SUPPORTED_LANGUAGE_CODES.includes(language)) {
      issues.push(`${document.sourcePath}: unsupported language code: ${language}`);
    }
  }
  return [...new Set(issues)];
}

export function compareApprovedEntries(documents, generatedEntries) {
  const issues = [];
  const docsBySlug = indexBySlug(documents.map((document) => document.runtime));
  const bankBySlug = indexBySlug(generatedEntries);

  for (const [slug, values] of docsBySlug.duplicates) {
    issues.push(`duplicate slug: ${slug} (${values.join(", ")})`);
  }
  for (const [slug, values] of bankBySlug.duplicates) {
    issues.push(`duplicate generated slug: ${slug} (${values.join(", ")})`);
  }

  const approved = documents.filter(
    (document) => document.frontmatter.review_status === "approved",
  );
  const approvedSlugs = new Set(approved.map((document) => document.runtime.slug));
  for (const document of approved) {
    const slug = document.runtime.slug;
    const generated = bankBySlug.entries.get(slug);
    if (!generated) {
      issues.push(`missing generated entry: ${slug}`);
      continue;
    }
    for (const field of RUNTIME_FIELD_NAMES) {
      if (!deepEqual(document.runtime[field], generated[field])) {
        issues.push(`generated entry drift: ${slug}.${field}`);
      }
    }
  }
  for (const generated of generatedEntries) {
    if (!approvedSlugs.has(generated?.slug)) {
      issues.push(`unexpected generated entry: ${generated?.slug ?? "<missing slug>"}`);
    }
  }
  return [...new Set(issues)];
}

export function buildRuntimeManifest({
  documents,
  generatedEntries,
  audioSlugs = new Set(),
  sourceRightsRows = [],
}) {
  const generatedBySlug = new Map(generatedEntries.map((entry) => [entry.slug, entry]));
  const entries = [...documents]
    .sort((a, b) => String(a.runtime.slug ?? "").localeCompare(String(b.runtime.slug ?? "")))
    .map((document) =>
      buildRuntimeEntry(
        document,
        generatedBySlug.get(document.runtime.slug),
        audioSlugs,
        sourceRightsRows,
      ),
    );
  const recommendations = Object.fromEntries(
    ["ready", "translate", "record-audio", "review-data", "hold"].map((status) => [
      status,
      entries.filter((entry) => entry.recommendation === status).length,
    ]),
  );
  return {
    schemaVersion: 1,
    source: "content/shlokas",
    supportedLanguageCodes: [...SUPPORTED_LANGUAGE_CODES],
    summary: {
      total: entries.length,
      generated: entries.filter((entry) => entry.generated).length,
      bundled: entries.filter((entry) => entry.bundled).length,
      recommendations,
    },
    entries,
  };
}

export function serializeManifest(manifest) {
  return `${JSON.stringify(manifest, null, 2)}\n`;
}

function buildRuntimeEntry(document, generatedEntry, audioSlugs, sourceRightsRows) {
  const runtime = document.runtime ?? {};
  const issues = validateRuntimeDocument(document);
  const placeholderMarkers = collectMarkers(runtime);
  const pendingMarkers = collectMarkers({
    ...runtime,
    source: `${document.frontmatter.copyright_status ?? ""} ${runtime.source ?? ""}`,
  });
  const sourceReference = runtime.source;
  const sourceStatus = evaluateSourceStatus({
    frontmatter: document.frontmatter,
    sourceReference,
    sourceRightsRows,
  });
  const languageCodes = new Set(["en"]);
  for (const field of ["translations", "meanings"]) {
    for (const language of Object.keys(runtime[field] ?? {})) languageCodes.add(language);
  }
  const generated = document.frontmatter.review_status === "approved" && Boolean(generatedEntry);
  const bundled = Boolean(generatedEntry);
  const hasStructuralIssue = issues.some(
    (issue) =>
      !issue.includes("missing runtime field: translation") &&
      !issue.includes("translation must be a non-empty string"),
  );
  let recommendation = "ready";
  if (hasStructuralIssue || (document.malformedLanguageLabels ?? []).length > 0)
    recommendation = "hold";
  else if (placeholderMarkers.some((marker) => /translation|meaning/.test(marker)))
    recommendation = "translate";
  else if (sourceStatus.status !== "clear") recommendation = "review-data";
  else if (!generated || !bundled) recommendation = "hold";
  else if (!audioSlugs.has(runtime.slug)) recommendation = "record-audio";

  return {
    slug: runtime.slug,
    generated,
    bundled,
    generatedStatus: generated
      ? "included"
      : document.frontmatter.review_status === "approved"
        ? "missing"
        : "not-approved",
    bundledStatus: bundled ? "present" : "missing",
    requiredFields: Object.fromEntries(
      RUNTIME_FIELD_NAMES.map((field) => [field, hasRuntimeValue(runtime[field])]),
    ),
    languageCodes: [...languageCodes].sort(),
    placeholderMarkers: [...new Set(placeholderMarkers)].sort(),
    pendingMarkers: [...new Set(pendingMarkers)].sort(),
    audioStatus: {
      status: audioSlugs.has(runtime.slug) ? "recorded" : "missing",
      clear: audioSlugs.has(runtime.slug),
    },
    sourceStatus,
    recommendation,
  };
}

function parseFrontmatter(source) {
  const normalized = source.replace(/^\uFEFF/, "");
  const match = normalized.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return { frontmatter: null, body: normalized };
  const frontmatter = {};
  for (const line of match[1].split(/\r?\n/)) {
    const separator = line.indexOf(":");
    if (separator <= 0) continue;
    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim();
    if (!key || !value) continue;
    frontmatter[key] = value === "true" ? true : value === "false" ? false : stripQuotes(value);
  }
  return { frontmatter, body: normalized.slice(match[0].length) };
}

function parseSections(body) {
  const sections = {};
  for (const match of body.matchAll(/^##\s+(.+?)\s*\r?\n([\s\S]*?)(?=^##\s+|$(?![\s\S]))/gm)) {
    sections[match[1]] = match[2].trim();
  }
  return sections;
}

function parseTags(value) {
  return typeof value === "string" && value.trim()
    ? value
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    : [];
}

function stripQuotes(value) {
  return value.length >= 2 &&
    ((value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'")))
    ? value.slice(1, -1).trim()
    : value;
}

function isSupportedLanguageCode(language) {
  return /^[a-z]{2}$/.test(language) && SUPPORTED_LANGUAGE_CODES.includes(language);
}

export function evaluateSourceStatus({ frontmatter = {}, sourceReference, sourceRightsRows = [] }) {
  const sourceUrl = frontmatter.source_url;
  const sourceUrlValid = isHttpUrl(sourceUrl);
  const referenceValid = typeof sourceReference === "string" && Boolean(sourceReference.trim());
  const trackerRow = sourceRightsRows.find(
    (row) =>
      isHttpUrl(row?.source_url) &&
      normalizeSourceUrl(row.source_url) === normalizeSourceUrl(sourceUrl),
  );
  const approval = {
    trackerRow: Boolean(trackerRow),
    status: /^(approved|production_ready)$/i.test(String(trackerRow?.status ?? "").trim()),
    canStore: /^yes$/i.test(String(trackerRow?.can_store ?? "").trim()),
    canShowExcerpts: /^yes$/i.test(String(trackerRow?.can_show_excerpts ?? "").trim()),
    canEmbedFullText: /^yes$/i.test(String(trackerRow?.can_embed_full_text ?? "").trim()),
    canUseForRag: /^yes,?\s*can ingest$/i.test(String(trackerRow?.can_use_for_rag ?? "").trim()),
    permissionNotNeeded: /^no\b/i.test(String(trackerRow?.permission_needed ?? "").trim()),
    reviewRecorded: Boolean(String(trackerRow?.review_needed ?? "").trim()),
  };
  const rightsClear = Object.values(approval).every(Boolean);
  return {
    sourceUrl: sourceUrlValid,
    reference: referenceValid,
    trackerRow: trackerRow?.work_id ?? null,
    approval,
    status:
      sourceUrlValid && referenceValid && rightsClear
        ? "clear"
        : trackerRow
          ? "pending-review"
          : "missing",
  };
}

function isHttpUrl(value) {
  try {
    const url = new URL(value);
    return (url.protocol === "http:" || url.protocol === "https:") && Boolean(url.hostname);
  } catch {
    return false;
  }
}

function normalizeSourceUrl(value) {
  try {
    const url = new URL(value);
    return `${url.protocol}//${url.hostname.toLowerCase()}${url.pathname.replace(/\/+$/, "")}${url.search}`;
  } catch {
    return String(value ?? "")
      .trim()
      .toLowerCase();
  }
}

function collectMarkers(value) {
  const strings = [];
  const visit = (item) => {
    if (typeof item === "string") strings.push(item);
    else if (Array.isArray(item)) item.forEach(visit);
    else if (item && typeof item === "object") Object.values(item).forEach(visit);
  };
  visit(value);
  const text = strings.join(" ").toLowerCase();
  return KNOWN_MARKERS.filter((marker) => text.includes(marker));
}

function hasRuntimeValue(value) {
  if (Array.isArray(value)) return value.length > 0;
  if (value && typeof value === "object") return Object.keys(value).length > 0;
  return (
    value !== undefined && value !== null && (typeof value !== "string" || value.trim().length > 0)
  );
}

function indexBySlug(entries) {
  const map = new Map();
  const duplicates = new Map();
  for (const entry of entries) {
    const slug = entry?.slug;
    if (map.has(slug)) {
      if (!duplicates.has(slug)) duplicates.set(slug, [map.get(slug)?.sourcePath ?? "first"]);
      duplicates.get(slug).push(entry?.sourcePath ?? "duplicate");
    } else {
      map.set(slug, entry);
    }
  }
  return { entries: map, duplicates };
}

function deepEqual(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function listShlokaFiles(contentDir) {
  return readdirSync(contentDir)
    .filter((file) => file.endsWith(".md") && !file.startsWith("_"))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

function collectAudioSlugs(root) {
  const directories = [join(root, "content", "audio"), join(root, "content", "shlokas", "audio")];
  const slugs = new Set();
  for (const directory of directories) {
    if (!existsSync(directory)) continue;
    for (const file of readdirSync(directory)) {
      const match = file.match(/^(.+?)(?:\.slow)?\.(?:mp3|m4a|wav|aac)$/i);
      if (match) slugs.add(match[1]);
    }
  }
  return slugs;
}

export function parseCsvRecords(source) {
  const records = [];
  let row = [];
  let cell = "";
  let quoted = false;
  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];
    if (quoted) {
      if (character === '"' && source[index + 1] === '"') {
        cell += '"';
        index += 1;
      } else if (character === '"') quoted = false;
      else cell += character;
    } else if (character === '"') quoted = true;
    else if (character === ",") {
      row.push(cell);
      cell = "";
    } else if (character === "\n") {
      row.push(cell.replace(/\r$/, ""));
      records.push(row);
      row = [];
      cell = "";
    } else cell += character;
  }
  if (quoted) throw new Error("source-rights CSV contains an unclosed quoted field");
  if (cell || row.length > 0) {
    row.push(cell.replace(/\r$/, ""));
    records.push(row);
  }
  if (records.length === 0) return [];
  const [header, ...data] = records;
  return data
    .filter((values) => values.some(Boolean))
    .map((values) =>
      Object.fromEntries(header.map((column, index) => [column, values[index] ?? ""])),
    );
}

export function writeRuntimeManifest({ manifestPath, serialized, issues = [] }) {
  if (issues.length > 0) throw new Error(issues.join("\n"));
  writeFileSync(manifestPath, serialized);
}

async function main() {
  const checkOnly = process.argv.includes("--check");
  const write = process.argv.includes("--write");
  if (checkOnly === write) fail("use exactly one of --check or --write");

  const root = resolve(process.cwd());
  const contentDir = join(root, "content", "shlokas");
  const bankPath = join(root, "apps", "mobile", "src", "data", "shlokaBank.json");
  const manifestPath = join(root, "docs", "content", "runtime-content-manifest.json");
  const sourceRightsPath = join(root, "docs", "source_inventory_template.csv");
  const tools = await import(
    pathToFileURL(join(root, "packages", "content-tools", "dist", "index.js")).href
  );
  const documentIssues = [];
  const documents = listShlokaFiles(contentDir).map((file) => {
    const source = readFileSync(join(contentDir, file), "utf8");
    const validationIssues = tools.validateMarkdownDocument(source, file);
    documentIssues.push(...validationIssues);
    return parseShlokaMarkdown(source, file);
  });
  const generatedEntries = JSON.parse(readFileSync(bankPath, "utf8"));
  const comparisonIssues = compareApprovedEntries(documents, generatedEntries);
  const validationIssues = [...documentIssues, ...comparisonIssues];
  if (validationIssues.length > 0) fail(validationIssues.join("\n"));
  const sourceRightsRows = parseCsvRecords(readFileSync(sourceRightsPath, "utf8"));

  const manifest = buildRuntimeManifest({
    documents,
    generatedEntries,
    audioSlugs: collectAudioSlugs(root),
    sourceRightsRows,
  });
  const serialized = serializeManifest(manifest);
  if (checkOnly) {
    const current = existsSync(manifestPath) ? readFileSync(manifestPath, "utf8") : "";
    if (current !== serialized)
      fail(
        `runtime manifest is stale (${manifestPath}) — run node scripts/verify-runtime-content.mjs --write`,
      );
    console.log(`runtime content manifest is up to date (${manifest.entries.length} entries)`);
  } else {
    writeRuntimeManifest({ manifestPath, serialized });
    console.log(
      `wrote runtime content manifest (${manifest.entries.length} entries) -> ${manifestPath}`,
    );
  }
}

function fail(message) {
  throw new Error(message);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    await main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
