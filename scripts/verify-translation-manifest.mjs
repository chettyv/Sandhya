#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

import {
  buildTranslationManifest,
  parseCsv,
  serializeTranslationManifest,
  TRANSLATION_MANIFEST_COLUMNS,
  validateTranslationRows,
} from "./build-translation-manifest.mjs";
import { parseShlokaMarkdown } from "./verify-runtime-content.mjs";

export function verifyTranslationManifest({ csv, documents, generatedEntries }) {
  const issues = [];
  const header = csv.split(/\r?\n/, 1)[0] ?? "";
  if (header !== TRANSLATION_MANIFEST_COLUMNS.join(",")) {
    issues.push(`manifest header must be exactly: ${TRANSLATION_MANIFEST_COLUMNS.join(",")}`);
  }
  const rows = parseCsv(csv);
  issues.push(...validateTranslationRows(rows, documents, generatedEntries));
  const expected = serializeTranslationManifest(
    buildTranslationManifest({ documents, generatedEntries }),
  );
  if (csv !== expected) issues.push("translation manifest is not deterministic or is stale");
  return [...new Set(issues)];
}

function listShlokaFiles(contentDir) {
  return readdirSync(contentDir)
    .filter((file) => file.endsWith(".md") && !file.startsWith("_"))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

async function main() {
  if (!process.argv.includes("--check")) throw new Error("use --check");
  const root = resolve(process.cwd());
  const contentDir = join(root, "content", "shlokas");
  const manifestPath = join(root, "docs", "translation", "manifest.csv");
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
  const csv = existsSync(manifestPath) ? readFileSync(manifestPath, "utf8") : "";
  const issues = verifyTranslationManifest({ csv, documents, generatedEntries });
  if (issues.length > 0) throw new Error(issues.join("\n"));
  console.log(`translation manifest verified (${parseCsv(csv).length} rows)`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    await main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
