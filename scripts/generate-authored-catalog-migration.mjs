#!/usr/bin/env node
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = resolve(process.cwd());
const outputPath = join(root, "supabase", "migrations", "20260806200000_app_authored_catalog.sql");
const tempRoot = mkdtempSync(join(tmpdir(), "sandhya-catalog-"));
const checkOnly = process.argv.includes("--check");

try {
  const sourceTypes = readFileSync(join(root, "apps/mobile/src/types/content.ts"), "utf8");
  const sourceCatalog = readFileSync(
    join(root, "apps/mobile/src/data/appAuthoredCatalog.ts"),
    "utf8",
  ).replaceAll("@/types/content", "./types.ts");
  const sourceContent = readFileSync(join(root, "apps/mobile/src/data/content.ts"), "utf8")
    .replaceAll('from "./appAuthoredCatalog"', 'from "./appAuthoredCatalog.ts"')
    .replaceAll("@/types/content", "./types.ts");

  writeFileSync(join(tempRoot, "types.ts"), `${sourceTypes}\n`);
  writeFileSync(join(tempRoot, "appAuthoredCatalog.ts"), sourceCatalog);
  writeFileSync(join(tempRoot, "content.ts"), sourceContent);

  const content = await import(
    `${pathToFileURL(join(tempRoot, "content.ts")).href}?generated=${Date.now()}`
  );
  const concepts = content.concepts;
  const practices = content.practices;
  const reflections = content.dailyReflections;
  const festivals = content.festivals;

  const sql = [
    "-- 20260806200000_app_authored_catalog.sql",
    "-- Generated from the original, app-authored catalog.",
    "--",
    "-- This content contains no scripture quotations or licensed source text.",
    "-- Source-linked material must still pass the source-rights gate and be",
    "-- ingested through packages/content-tools; this migration is only for",
    "-- curated educational/app-authored content served without the LLM.",
    "",
    "-- ---------------------------------------------------------------------------",
    "-- concepts (50)",
    "-- ---------------------------------------------------------------------------",
    `insert into public.concepts (id, slug, term, term_sanskrit, short_definition, full_explanation, examples, related_concepts, tradition_variations) values\n${concepts
      .map(
        (item) =>
          `  (${sqlString(item.id)}, ${sqlString(slugify(item.term))}, ${sqlString(item.term)}, ${sqlString(item.sanskrit)}, ${sqlString(item.definition)}, ${sqlString(item.explanation)}, ${sqlString(item.definition)}, '{}'::text[], ${sqlJson({ note: item.variationNote ?? "Interpretations vary across texts, schools, families, and teachers." })}::jsonb)`,
      )
      .join(
        ",\n",
      )}\non conflict (slug) do update set\n  term = excluded.term,\n  term_sanskrit = excluded.term_sanskrit,\n  short_definition = excluded.short_definition,\n  full_explanation = excluded.full_explanation,\n  examples = excluded.examples,\n  related_concepts = excluded.related_concepts,\n  tradition_variations = excluded.tradition_variations;`,
    "",
    "-- ---------------------------------------------------------------------------",
    "-- practice_guides (20)",
    "-- ---------------------------------------------------------------------------",
    `insert into public.practice_guides (id, slug, title, category, difficulty, duration_minutes, steps, materials_needed, tradition_notes, warnings, is_premium) values\n${practices
      .map((item) => {
        const steps = item.steps.map((body, index) => ({
          order: index + 1,
          title: `Step ${index + 1}`,
          body,
        }));
        const notes = [
          item.summary,
          item.traditionNote ? `Tradition note: ${item.traditionNote}` : null,
        ]
          .filter(Boolean)
          .join("\n\n");
        return `  (${sqlString(item.id)}, ${sqlString(slugify(item.title))}, ${sqlString(item.title)}, ${sqlString(categoryForDatabase(item.category))}, ${sqlString((item.level ?? "Beginner").toLowerCase())}, ${item.durationMinutes}, ${sqlJson(steps)}::jsonb, ${sqlTextArray(item.materials ?? [])}, ${sqlString(notes)}, ${sqlString(item.warnings ?? null)}, ${item.isPremium === true})`;
      })
      .join(
        ",\n",
      )}\non conflict (slug) do update set\n  title = excluded.title,\n  category = excluded.category,\n  difficulty = excluded.difficulty,\n  duration_minutes = excluded.duration_minutes,\n  steps = excluded.steps,\n  materials_needed = excluded.materials_needed,\n  tradition_notes = excluded.tradition_notes,\n  warnings = excluded.warnings,\n  is_premium = excluded.is_premium;`,
    "",
    "-- ---------------------------------------------------------------------------",
    "-- daily_reflections (30)",
    "-- ---------------------------------------------------------------------------",
    `insert into public.daily_reflections (id, date_slot, title, shloka_passage_id, reflection_text, practice_prompt, journal_prompt, tradition, tags, is_premium) values\n${reflections
      .map(
        (item, index) =>
          `  (${sqlString(item.id)}, ${index + 1}, ${sqlString(item.title)}, null, ${sqlString(item.body)}, ${sqlString(item.practicePrompt)}, ${sqlString(item.prompt)}, 'general', ARRAY['app-authored']::text[], ${item.isPremium === true})`,
      )
      .join(
        ",\n",
      )}\non conflict (date_slot, tradition) do update set\n  id = excluded.id,\n  title = excluded.title,\n  shloka_passage_id = excluded.shloka_passage_id,\n  reflection_text = excluded.reflection_text,\n  practice_prompt = excluded.practice_prompt,\n  journal_prompt = excluded.journal_prompt,\n  tags = excluded.tags,\n  is_premium = excluded.is_premium;`,
    "",
    "-- ---------------------------------------------------------------------------",
    "-- festival explainers (21)",
    "-- ---------------------------------------------------------------------------",
    `insert into public.festivals (id, slug, name, name_variants, short_description, full_story, meaning, home_observance, regional_variations, traditions, tithi_rule, upcoming_dates, duration_days, is_premium) values\n${festivals
      .map(
        (item) =>
          `  (${sqlString(item.id)}, ${sqlString(slugify(item.name))}, ${sqlString(item.name)}, ${sqlTextArray(item.variant ? [item.variant] : [])}, ${sqlString(item.summary)}, ${sqlString(item.meaning)}, ${sqlString(item.meaning)}, ${sqlString(item.observance.join("\n"))}, ${sqlJson({ note: item.variationNote })}::jsonb, ARRAY['general']::text[], ${sqlString(item.date ? "Authored date; local observance timing varies by region and tradition." : "Calendar dates require reviewed calendar data; this row is an explainer.")}, ${sqlDateArray(item.date)}, 1, ${item.isPremium === true})`,
      )
      .join(
        ",\n",
      )}\non conflict (slug) do update set\n  name = excluded.name,\n  name_variants = excluded.name_variants,\n  short_description = excluded.short_description,\n  full_story = excluded.full_story,\n  meaning = excluded.meaning,\n  home_observance = excluded.home_observance,\n  regional_variations = excluded.regional_variations,\n  traditions = excluded.traditions,\n  tithi_rule = excluded.tithi_rule,\n  upcoming_dates = excluded.upcoming_dates,\n  duration_days = excluded.duration_days,\n  is_premium = excluded.is_premium;`,
    "",
    "-- Down:",
    "--   This migration upserts app-authored rows that may also exist in local",
    "--   seed data, so an automatic delete would be destructive and could not",
    "--   restore the previous copy. To reverse it, restore a pre-migration",
    "--   database backup or the prior reviewed row versions, then remove only",
    "--   rows whose deterministic IDs were introduced by this migration.",
    "--   The generator must be rerun if the authored catalog changes.",
    "",
  ].join("\n");

  const generated = `${sql}\n`;
  if (checkOnly) {
    const existing = readFileSync(outputPath, "utf8");
    if (existing !== generated) {
      console.error(`${outputPath} is stale. Run the generator without --check.`);
      process.exitCode = 1;
    } else {
      console.log(
        `Authored catalog migration is current: ${concepts.length} concepts, ${practices.length} practices, ${reflections.length} reflections, ${festivals.length} festivals.`,
      );
    }
  } else {
    writeFileSync(outputPath, generated);
    console.log(
      `Generated ${outputPath}: ${concepts.length} concepts, ${practices.length} practices, ${reflections.length} reflections, ${festivals.length} festivals.`,
    );
  }
} finally {
  rmSync(tempRoot, { recursive: true, force: true });
}

function slugify(value) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function categoryForDatabase(category) {
  if (category === "Puja") return "puja";
  if (category === "Mantra") return "mantra";
  if (category === "Meditation") return "meditation";
  return "meditation";
}

function sqlString(value) {
  if (value === null || value === undefined) return "null";
  return `'${String(value).replaceAll("'", "''")}'`;
}

function sqlTextArray(values) {
  if (!values.length) return "'{}'::text[]";
  return `ARRAY[${values.map(sqlString).join(", ")}]::text[]`;
}

function sqlDateArray(value) {
  if (value === null || value === undefined || value === "") return "'{}'::date[]";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error(`Invalid authored festival date: ${String(value)}`);
  }
  return `ARRAY[${sqlString(value)}::date]`;
}

function sqlJson(value) {
  return sqlString(JSON.stringify(value));
}
