#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const seed = readFileSync(join(root, "supabase", "seed.sql"), "utf8");
const allowedPracticeCategories = new Set(["puja", "mantra", "meditation", "fasting", "diya"]);

const conceptSection = sectionBetween(
  seed,
  "insert into public.concepts",
  "-- ---------------------------------------------------------------------------\n-- passages",
);
const conceptIds = [...conceptSection.matchAll(/'([0-9a-f-]{36})',\s*'([^']+)'/g)];
if (conceptIds.length < 4) {
  fail(`Expected at least 4 glossary starters, found ${conceptIds.length}.`);
}

const practiceSection = seed.slice(seed.indexOf("insert into public.practice_guides"));
const practiceRows = [
  ...practiceSection.matchAll(/'([0-9a-f-]{36})',\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',/g),
];
if (practiceRows.length < 4) {
  fail(`Expected at least 4 practice rows, found ${practiceRows.length}.`);
}
for (const row of practiceRows) {
  const [, , slug, , category] = row;
  if (!allowedPracticeCategories.has(category)) {
    fail(`Practice ${slug} uses unsupported category "${category}".`);
  }
}

if (!seed.includes("is_premium\n) values") || !seed.includes("'evening-reflection-practice'")) {
  fail("The seed is missing the premium practice boundary fixture.");
}
if (!seed.includes("'simple-nama-japa'") || !seed.includes("'mantra'")) {
  fail("The seed is missing the free mantra practice starter.");
}

console.log(
  `Seed content invariants passed: ${conceptIds.length} concepts, ${practiceRows.length} practices.`,
);

function sectionBetween(source, startMarker, endMarker) {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start + startMarker.length);
  if (start < 0 || end < 0) fail(`Could not locate seed section ${startMarker}.`);
  return source.slice(start, end);
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
