#!/usr/bin/env node
// Builds the app's bundled shloka bank from content/shlokas/*.md. Approved
// entries only (--allow-draft for local development); --check verifies the
// bundled JSON is current. Run via `pnpm content:generate-shloka-bank`.
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = resolve(process.cwd());
const contentDir = join(root, "content", "shlokas");
const outputPath = join(root, "apps", "mobile", "src", "data", "shlokaBank.json");
const allowDraft = process.argv.includes("--allow-draft");
const checkOnly = process.argv.includes("--check");

const tools = await import(
  pathToFileURL(join(root, "packages", "content-tools", "dist", "index.js")).href
);

const entries = [];
const files = existsSync(contentDir)
  ? readdirSync(contentDir)
      .filter((file) => file.endsWith(".md") && !file.startsWith("_"))
      .sort()
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
    ...parseShlokaBody(body, file),
  });
  console.log(`${frontmatter.review_status === "approved" ? "included" : "DRAFT"}: ${frontmatter.shloka_slug}`);
}

const json = `${JSON.stringify(entries, null, 2)}\n`;
if (checkOnly) {
  const current = existsSync(outputPath) ? readFileSync(outputPath, "utf8") : "";
  if (current !== json) fail("shloka bank is stale — run pnpm content:generate-shloka-bank");
  console.log("shloka bank is up to date");
} else {
  writeFileSync(outputPath, json);
  console.log(`wrote ${entries.length} shloka(s) -> ${outputPath}`);
}

function parseShlokaBody(body, displayFile) {
  const sections = {};
  for (const match of body.matchAll(/^##\s+(.+?)\s*$\r?\n([\s\S]*?)(?=^##\s+|$(?![\s\S]))/gm)) {
    sections[match[1]] = match[2].trim();
  }
  const shloka = {};
  const labelKeys = { Devanagari: "devanagari", IAST: "iast", "Say it": "sayIt", Meaning: "translation", Source: "source" };
  for (const match of (sections.Shloka ?? "").matchAll(
    /^\*\*(Devanagari|IAST|Say it|Meaning|Source):\*\*\s+(.+)$/gm,
  )) {
    shloka[labelKeys[match[1]]] = match[2].trim();
  }
  const words = [...(sections["Word by word"] ?? "").matchAll(/^-\s+\*\*(.+?)\*\*\s+—\s+(.+)$/gm)].map(
    (match) => ({ word: match[1].trim(), meaning: match[2].trim() }),
  );
  if (words.length === 0) fail(`${displayFile}: no word-by-word lines parsed`);
  return {
    ...shloka,
    words,
    meaning: sections.Meaning ?? "",
    reflection: sections.Reflection ?? "",
  };
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
