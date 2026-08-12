#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const sqlPath = join(root, "supabase", "ops", "daily-reflections-cron.sql");
const readmePath = join(root, "supabase", "ops", "README.md");

if (!existsSync(sqlPath) || !existsSync(readmePath)) {
  throw new Error("Supabase scheduler operations artifacts are missing.");
}

const sql = readFileSync(sqlPath, "utf8");
const readme = readFileSync(readmePath, "utf8");

for (const required of [
  "vault.decrypted_secrets",
  "dharma_daily_project_url",
  "dharma_daily_publishable_key",
  "dharma_daily_reflections_cron_secret",
  "cron.unschedule(jobid)",
  "dharma-daily-send-reflections",
  "cron.schedule(",
  "'* * * * *'",
  "net.http_post(",
  "x-cron-secret",
  "/functions/v1/send-daily-reflections",
  "raise exception",
]) {
  if (!sql.includes(required)) {
    throw new Error(`Scheduler SQL is missing required contract: ${required}`);
  }
}

for (const required of [
  "Supabase Cron",
  "pg_net",
  "Vault",
  "DAILY_REFLECTIONS_CRON_SECRET",
  "cron.job_run_details",
  "protected notification smoke workflow",
]) {
  if (!readme.includes(required)) {
    throw new Error(`Scheduler runbook is missing required contract: ${required}`);
  }
}

if (/["'](?:sk|rk|sbp|eyJ)[A-Za-z0-9_\-.]{12,}/i.test(sql)) {
  throw new Error("Scheduler SQL appears to contain a credential literal.");
}

console.log("Supabase scheduler contract passed.");
