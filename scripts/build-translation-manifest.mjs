#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

import {
  compareApprovedEntries,
  parseShlokaMarkdown,
  SUPPORTED_LANGUAGE_CODES,
  validateRuntimeDocument,
} from "./verify-runtime-content.mjs";

export const TRANSLATION_MANIFEST_COLUMNS = [
  "slug",
  "source_language",
  "target_language",
  "verse_status",
  "prose_status",
  "reviewer",
  "last_reviewed",
  "notes",
];
export const TRANSLATION_STATUSES = ["pending", "needs-review", "reviewed"];

export function buildTranslationManifest({ documents, generatedEntries }) {
  const generatedBySlug = new Map(generatedEntries.map((entry) => [entry.slug, entry]));
  const rows = [];
  for (const document of [...documents].sort((a, b) =>
    a.runtime.slug.localeCompare(b.runtime.slug),
  )) {
    for (const targetLanguage of SUPPORTED_LANGUAGE_CODES) {
      const verse = textFor(document, targetLanguage, "verse");
      const prose = textFor(document, targetLanguage, "prose");
      const generated = generatedBySlug.get(document.runtime.slug);
      const generatedVerse =
        targetLanguage === "en"
          ? generated?.translation
          : generated?.translations?.[targetLanguage];
      const generatedProse =
        targetLanguage === "en" ? generated?.meaning : generated?.meanings?.[targetLanguage];
      const notes = [];
      notes.push(verse ? "verse text present" : "verse text missing");
      notes.push(prose ? "prose text present" : "prose text missing");
      if (generatedVerse || generatedProse) notes.push("available in generated bank");
      else if (generated) notes.push("not available in generated bank");
      if (verse && prose) notes.push("no named translation reviewer or review date recorded");
      rows.push({
        slug: document.runtime.slug,
        source_language: "en",
        target_language: targetLanguage,
        verse_status: statusForText(verse),
        prose_status: statusForText(prose),
        reviewer: "",
        last_reviewed: "",
        notes: `${notes.join("; ")}.`,
      });
    }
  }
  return {
    schemaVersion: 1,
    source: "content/shlokas",
    supportedLanguageCodes: [...SUPPORTED_LANGUAGE_CODES],
    coverage: buildCoverage(documents, rows),
    rows,
  };
}

export function validateTranslationRows(rows, documents, generatedEntries) {
  const issues = [];
  const documentsBySlug = new Map(documents.map((document) => [document.runtime.slug, document]));
  const expected = buildTranslationManifest({ documents, generatedEntries }).rows;
  const expectedByKey = new Map(expected.map((row) => [rowKey(row), row]));
  const seen = new Set();

  for (const document of documents) {
    for (const issue of validateRuntimeDocument(document)) {
      if (issue.includes("language code")) issues.push(issue);
    }
  }
  issues.push(...compareApprovedEntries(documents, generatedEntries));

  for (const row of rows) {
    const keys = Object.keys(row);
    if (keys.join(",") !== TRANSLATION_MANIFEST_COLUMNS.join(",")) {
      issues.push(`row has unexpected columns: ${row.slug ?? "<missing slug>"}`);
    }
    const key = rowKey(row);
    if (seen.has(key)) issues.push(`duplicate row: ${row.slug}/${row.target_language}`);
    seen.add(key);
    if (!documentsBySlug.has(row.slug)) issues.push(`unknown slug: ${row.slug}`);
    if (
      !SUPPORTED_LANGUAGE_CODES.includes(row.source_language) ||
      !SUPPORTED_LANGUAGE_CODES.includes(row.target_language)
    ) {
      const unknown = !SUPPORTED_LANGUAGE_CODES.includes(row.source_language)
        ? row.source_language
        : row.target_language;
      issues.push(`unknown language code: ${unknown}`);
    }
    for (const field of ["verse_status", "prose_status"]) {
      if (!TRANSLATION_STATUSES.includes(row[field]))
        issues.push(`invalid ${field}: ${row[field]}`);
      if (row[field] === "reviewed" && documentsBySlug.has(row.slug)) {
        const kind = field === "verse_status" ? "verse" : "prose";
        if (!textFor(documentsBySlug.get(row.slug), row.target_language, kind)) {
          issues.push(`reviewed ${kind} without text: ${row.slug}/${row.target_language}`);
        }
        if (!row.reviewer || !row.last_reviewed) {
          issues.push(`reviewed ${kind} missing reviewer/date: ${row.slug}/${row.target_language}`);
        }
      }
    }
    const expectedRow = expectedByKey.get(key);
    if (!expectedRow) {
      if (documentsBySlug.has(row.slug) && SUPPORTED_LANGUAGE_CODES.includes(row.target_language)) {
        issues.push(`unexpected translation row: ${row.slug}/${row.target_language}`);
      }
    } else if (JSON.stringify(row) !== JSON.stringify(expectedRow)) {
      issues.push(`translation row drift: ${row.slug}/${row.target_language}`);
    }
  }
  for (const expectedRow of expected) {
    if (!seen.has(rowKey(expectedRow)))
      issues.push(`missing translation row: ${expectedRow.slug}/${expectedRow.target_language}`);
  }
  return [...new Set(issues)];
}

export function serializeTranslationManifest(manifest) {
  return `${TRANSLATION_MANIFEST_COLUMNS.join(",")}\n${manifest.rows.map((row) => TRANSLATION_MANIFEST_COLUMNS.map((column) => csvCell(row[column])).join(",")).join("\n")}\n`;
}

export function parseCsv(source) {
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

function textFor(document, language, kind) {
  if (language === "en")
    return kind === "verse" ? document.runtime.translation : document.runtime.meaning;
  return kind === "verse"
    ? document.runtime.translations?.[language]
    : document.runtime.meanings?.[language];
}

function statusForText(text) {
  if (!text || !String(text).trim()) return "pending";
  if (/pending|placeholder|tbd|todo|draft/i.test(text)) return "pending";
  return "needs-review";
}

function buildCoverage(documents, rows) {
  return Object.fromEntries(
    SUPPORTED_LANGUAGE_CODES.map((language) => {
      const languageRows = rows.filter((row) => row.target_language === language);
      return [
        language,
        {
          entries: documents.length,
          verseText: languageRows.filter((row) => row.verse_status !== "pending").length,
          proseText: languageRows.filter((row) => row.prose_status !== "pending").length,
          reviewedVerse: languageRows.filter((row) => row.verse_status === "reviewed").length,
          reviewedProse: languageRows.filter((row) => row.prose_status === "reviewed").length,
        },
      ];
    }),
  );
}

function rowKey(row) {
  return `${row.slug}/${row.target_language}`;
}

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function listShlokaFiles(contentDir) {
  return readdirSync(contentDir)
    .filter((file) => file.endsWith(".md") && !file.startsWith("_"))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

async function loadRepository(root) {
  const contentDir = join(root, "content", "shlokas");
  const tools = await import(
    pathToFileURL(join(root, "packages", "content-tools", "dist", "index.js")).href
  );
  const documents = listShlokaFiles(contentDir).map((file) => {
    const source = readFileSync(join(contentDir, file), "utf8");
    const issues = tools.validateMarkdownDocument(source, file);
    if (issues.length > 0) throw new Error(issues.join("\n"));
    return parseShlokaMarkdown(source, file);
  });
  const generatedEntries = JSON.parse(
    readFileSync(join(root, "apps", "mobile", "src", "data", "shlokaBank.json"), "utf8"),
  );
  return { documents, generatedEntries };
}

async function main() {
  const checkOnly = process.argv.includes("--check");
  const write = process.argv.includes("--write");
  if (checkOnly === write) throw new Error("use exactly one of --check or --write");
  const root = resolve(process.cwd());
  const manifestPath = join(root, "docs", "translation", "manifest.csv");
  const { documents, generatedEntries } = await loadRepository(root);
  const manifest = buildTranslationManifest({ documents, generatedEntries });
  const issues = validateTranslationRows(manifest.rows, documents, generatedEntries);
  if (issues.length > 0) throw new Error(issues.join("\n"));
  const serialized = serializeTranslationManifest(manifest);
  if (checkOnly) {
    const current = existsSync(manifestPath) ? readFileSync(manifestPath, "utf8") : "";
    const currentRows = parseCsv(current);
    const currentIssues = validateTranslationRows(currentRows, documents, generatedEntries);
    if (currentIssues.length > 0) throw new Error(currentIssues.join("\n"));
    if (current !== serialized)
      throw new Error(
        `translation manifest is stale (${manifestPath}) — run node scripts/build-translation-manifest.mjs --write`,
      );
    console.log(`translation manifest is up to date (${manifest.rows.length} rows)`);
  } else {
    mkdirSync(dirname(manifestPath), { recursive: true });
    writeFileSync(manifestPath, serialized);
    console.log(`wrote translation manifest (${manifest.rows.length} rows) -> ${manifestPath}`);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    await main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
