#!/usr/bin/env node
// Builds the app's bundled shloka bank from content/shlokas/*.md. Approved
// entries only (--allow-draft for local development); --check verifies the
// bundled JSON is current. Run via `pnpm content:generate-shloka-bank`.
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = resolve(process.cwd());
const contentDir = join(root, "content", "shlokas");
const dataDir = join(root, "apps", "mobile", "src", "data");
const outputPath = join(dataDir, "shlokaBank.json");
// The app bundles two derived views of the bank so a cold start only pays for
// what the list and daily-verse surfaces need: `core` (everything except the
// word-by-word gloss and the prose meanings) and `details` (those fields,
// keyed by slug), which the verse page loads on demand. Both are compact.
const corePath = join(dataDir, "shlokaBank.core.json");
const detailsPath = join(dataDir, "shlokaBank.details.json");
const allowDraft = process.argv.includes("--allow-draft");
const checkOnly = process.argv.includes("--check");

const tools = await import(
  pathToFileURL(join(root, "packages", "content-tools", "dist", "index.js")).href
);

const entries = [];
// Natural sort so gita-2-9 precedes gita-2-10 and chapter 2 precedes 12.
const files = existsSync(contentDir)
  ? readdirSync(contentDir)
      .filter((file) => file.endsWith(".md") && !file.startsWith("_"))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
  : [];

for (const file of files) {
  const source = readFileSync(join(contentDir, file), "utf8");
  const issues = tools.validateMarkdownDocument(source, file);
  if (issues.length > 0) fail(issues.join("\n"));
  const { frontmatter, body } = tools.parseFrontmatter(source);
  if (frontmatter.review_status !== "approved" && !allowDraft) {
    console.log(`skipped (draft): ${file}`);
    continue;
  }
  entries.push({
    slug: frontmatter.shloka_slug,
    textRef: frontmatter.text_ref,
    tradition: frontmatter.tradition_primary,
    tags:
      typeof frontmatter.tags === "string"
        ? frontmatter.tags.split(",").map((tag) => tag.trim())
        : [],
    dailyPool: frontmatter.daily_pool === true,
    ...parseShlokaBody(body, file),
  });
  console.log(
    `${frontmatter.review_status === "approved" ? "included" : "DRAFT"}: ${frontmatter.shloka_slug}`,
  );
}

const json = `${JSON.stringify(entries, null, 2)}\n`;
const core = entries.map(
  ({ words: _words, meaning: _meaning, meanings: _meanings, ...rest }) => rest,
);
const details = Object.fromEntries(
  entries.map(({ slug, words, meaning, meanings }) => [slug, { words, meaning, meanings }]),
);
const outputs = [
  [outputPath, json],
  [corePath, `${JSON.stringify(core)}\n`],
  [detailsPath, `${JSON.stringify(details)}\n`],
];
if (checkOnly) {
  for (const [path, content] of outputs) {
    const current = existsSync(path) ? readFileSync(path, "utf8") : "";
    if (current !== content)
      fail(`shloka bank is stale (${path}) — run pnpm content:generate-shloka-bank`);
  }
  console.log("shloka bank is up to date");
} else {
  for (const [path, content] of outputs) writeFileSync(path, content);
  console.log(`wrote ${entries.length} shloka(s) -> ${outputPath} (+ core, details)`);
}

function parseShlokaBody(body, displayFile) {
  const sections = {};
  for (const match of body.matchAll(/^##\s+(.+?)\s*$\r?\n([\s\S]*?)(?=^##\s+|$(?![\s\S]))/gm)) {
    sections[match[1]] = match[2].trim();
  }
  const shloka = {};
  const labelKeys = {
    Devanagari: "devanagari",
    IAST: "iast",
    "Say it": "sayIt",
    Meaning: "translation",
    Source: "source",
  };
  for (const match of (sections.Shloka ?? "").matchAll(
    /^\*\*(Devanagari|IAST|Say it|Meaning|Source):\*\*\s+(.+)$/gm,
  )) {
    shloka[labelKeys[match[1]]] = match[2].trim();
  }
  const words = [
    ...(sections["Word by word"] ?? "").matchAll(/^-\s+\*\*(.+?)\*\*\s+—\s+(.+)$/gm),
  ].map((match) => ({ word: match[1].trim(), meaning: match[2].trim() }));
  if (words.length === 0) fail(`${displayFile}: no word-by-word lines parsed`);
  // Per-language variants: "**Meaning (hi):** ..." labels give translated verse
  // lines; "## Meaning (hi)" sections give translated prose.
  const translations = {};
  for (const match of (sections.Shloka ?? "").matchAll(
    /^\*\*Meaning \(([a-z]{2})\):\*\*\s+(.+)$/gm,
  )) {
    translations[match[1]] = match[2].trim();
  }
  const meanings = {};
  for (const [title, text] of Object.entries(sections)) {
    const match = title.match(/^Meaning \(([a-z]{2})\)$/);
    if (match) meanings[match[1]] = text;
  }
  return {
    ...shloka,
    words,
    meaning: sections.Meaning ?? "",
    reflection: sections.Reflection ?? "",
    translations,
    meanings,
  };
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
