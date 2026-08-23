#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const fallback = readFileSync(join(root, "apps/mobile/src/data/content.ts"), "utf8");
const authored = readFileSync(join(root, "apps/mobile/src/data/appAuthoredCatalog.ts"), "utf8");
const mobileReadme = readFileSync(join(root, "apps/mobile/README.md"), "utf8");
const currentSummary = readFileSync(join(root, "CURRENT_SUMMARY.md"), "utf8");
const remoteContent = readFileSync(join(root, "apps/mobile/src/lib/content.ts"), "utf8");
const authoredMigration = readFileSync(
  join(root, "supabase/migrations/20260806200000_app_authored_catalog.sql"),
  "utf8",
);

const uuidPattern = /00000000-0000-0000-0000-000000000\d{3}/g;
const ids = [...fallback.matchAll(uuidPattern), ...authored.matchAll(uuidPattern)].map(
  ([id]) => id,
);
const uniqueIds = new Set(ids);
if (uniqueIds.size !== ids.length) {
  throw new Error(
    `Fallback catalog contains duplicate deterministic IDs (${ids.length - uniqueIds.size}).`,
  );
}

function section(source, start, end) {
  const startIndex = source.indexOf(start);
  if (startIndex < 0) throw new Error(`Missing catalog section: ${start}`);
  const endIndex = end ? source.indexOf(end, startIndex) : source.length;
  return source.slice(startIndex, endIndex < 0 ? source.length : endIndex);
}

const concepts = section(authored, "export const additionalConcepts", "type PracticeOptions");
const practices = section(
  authored,
  "export const additionalPractices",
  "export type AppAuthoredReflection",
);
const reflections = section(authored, "export const additionalDailyReflections");
const festivals = section(fallback, "const starterFestivals", "const starterPractices");

const counts = {
  concepts: (concepts.match(/00000000-0000-0000-0000-000000000\d{3}/g) ?? []).length + 4,
  practices: (practices.match(/00000000-0000-0000-0000-000000000\d{3}/g) ?? []).length + 5,
  reflections: (reflections.match(/00000000-0000-0000-0000-000000000\d{3}/g) ?? []).length + 1,
  festivals: (festivals.match(/00000000-0000-0000-0000-000000000\d{3}/g) ?? []).length,
};

if (
  counts.concepts < 50 ||
  counts.practices < 20 ||
  counts.reflections < 30 ||
  counts.festivals < 20
) {
  throw new Error(
    `App-authored catalog coverage is incomplete: ${JSON.stringify(counts)} (requires at least 50 concepts, 20 practices, 20 festival guides, and 30 reflections).`,
  );
}
if (!authored.includes("no scripture quotations") || !authored.includes("not medical")) {
  throw new Error("App-authored catalog is missing its rights/safety framing.");
}
if (
  // A date is published only with its reckoning; without one it is demoted
  // to a date-less explainer (CLAUDE.md festival rule).
  !remoteContent.includes("const normalizedDate = date && reckoning ? date : null") ||
  !remoteContent.includes('monthLabel: "GUIDE"') ||
  !remoteContent.includes('.split("\\n")')
) {
  throw new Error(
    "Remote curated-content adapter does not preserve date-less festival explainers.",
  );
}
const authoredDates = [...fallback.matchAll(/date:\s*"(\d{4}-\d{2}-\d{2})"/g)].map(
  ([, date]) => date,
);
for (const date of authoredDates) {
  if (!authoredMigration.includes(`ARRAY['${date}'::date]`)) {
    throw new Error(`Generated authored migration dropped the fallback festival date ${date}.`);
  }
}
if (!authoredMigration.includes("'{}'::date[]")) {
  throw new Error(
    "Generated authored migration no longer preserves date-less festival explainers.",
  );
}
if (
  !mobileReadme.includes(
    "50 concept introductions, 20 practice guides, 21 festival explainers, and 30 rotating reflections",
  ) ||
  !currentSummary.includes("festival library now includes 21 explainers")
) {
  throw new Error("Catalog documentation does not match the verified fallback counts.");
}

console.log(`App-authored catalog coverage passed: ${JSON.stringify(counts)}.`);
