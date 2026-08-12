#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const isWindows = process.platform === "win32";
const args = new Set(process.argv.slice(2));
const noGates = args.has("--no-gates");
const staticOnly = args.has("--static-only");
const sourceOnly = args.has("--source-only");
const env = loadEnvironment();
const results = [];

await main();

async function main() {
  checkFiles();
  if (!staticOnly && !sourceOnly) {
    checkCommands();
    await checkEnvironment();
  }
  if (!noGates) {
    if (sourceOnly) runSourceOnlyGates();
    else runStaticGates();
  }

  printSummary();

  const hasFailure = results.some((result) => result.level === "fail");
  process.exitCode = hasFailure ? 1 : 0;
}

function checkFiles() {
  section("Required files");
  requireFile("Prepared corpus", "content/_staging/prepared/rag-corpus.jsonl");
  requireFile("Canonical prepared corpus", "content/_staging/prepared/rag-corpus-canonical.jsonl");
  requireFile("RAG eval set", "content/_staging/evals/rag-eval.example.jsonl");
  requireFile("Ask Edge Function", "supabase/functions/ask/index.ts");
  requireFile("RAG SQL migration", "supabase/migrations/20260708120000_rag_rpc.sql");
  requireFile("Environment template", ".env.example");
}

function checkCommands() {
  section("Live backend prerequisites");
  requireCommand("docker", "Docker is required by the Supabase local stack.");
  requireCommand("supabase", "Supabase CLI is required for db reset and function serving.");
  requireCommand("deno", "Deno is required for local Edge Function execution.");
  requireCommand("psql", "psql is required for direct SQL smoke checks.");
}

async function checkEnvironment() {
  section("Backend environment");
  requireEnv("SUPABASE_URL", isPlaceholderSupabaseUrl);
  requireEnv("SUPABASE_SERVICE_ROLE_KEY");
  requireEnv("SUPABASE_ANON_KEY");
  await checkSupabaseReachability();
  requireEnv("OPENAI_API_KEY");
  requireEnv("REVENUECAT_WEBHOOK_SECRET");
  requireEnv("REVENUECAT_API_KEY");
  requireEnv("DAILY_REFLECTIONS_CRON_SECRET");
  requireEnv("EXPO_ACCESS_TOKEN");

  const provider = (env.LLM_PROVIDER || "deepseek").trim().toLowerCase();
  if (provider === "deepseek") {
    requireEnv("DEEPSEEK_API_KEY");
  } else if (provider === "openai-compatible") {
    requireEnv("OPENAI_COMPATIBLE_API_KEY");
    requireEnv("OPENAI_COMPATIBLE_BASE_URL");
  } else if (provider === "anthropic") {
    requireEnv("ANTHROPIC_API_KEY");
  } else {
    add("fail", `Unsupported LLM_PROVIDER "${provider}".`);
  }

  requireNumericEnv("EMBEDDING_DIMENSIONS", 1536);
  requireNumericEnv("RAG_MATCH_COUNT", 8);
  requireNumericEnv("RAG_MAX_QUESTION_CHARS", 2000);
  requireNumericEnv("LLM_MONTHLY_BUDGET_USD", 0, { allowZero: true });
  requireNumericEnv("LLM_INPUT_COST_PER_MILLION", 0, { allowZero: true });
  requireNumericEnv("LLM_OUTPUT_COST_PER_MILLION", 0, { allowZero: true });
  requireNumericEnv("EMBEDDING_INPUT_COST_PER_MILLION", 0, { allowZero: true });
  const monthlyBudget = Number(env.LLM_MONTHLY_BUDGET_USD ?? 0);
  const hasPricing = [
    env.LLM_INPUT_COST_PER_MILLION,
    env.LLM_OUTPUT_COST_PER_MILLION,
    env.EMBEDDING_INPUT_COST_PER_MILLION,
  ].every((value) => Number(value ?? 0) > 0);
  if (monthlyBudget > 0 && !hasPricing) {
    add("fail", "LLM_MONTHLY_BUDGET_USD is enabled but provider pricing is incomplete.");
  } else {
    add("ok", "Monthly budget pricing configuration is coherent.");
  }
}

async function checkSupabaseReachability() {
  const value = env.SUPABASE_URL?.trim();
  if (isPlaceholderSupabaseUrl(value)) return;

  let url;
  try {
    url = new URL(value);
  } catch {
    add("fail", "SUPABASE_URL: invalid URL");
    return;
  }
  if (url.protocol !== "https:" || !url.hostname) {
    add("fail", "SUPABASE_URL: must be an HTTPS URL with a hostname");
    return;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const response = await fetch(`${url.origin}/rest/v1/`, {
      headers: env.SUPABASE_ANON_KEY ? { apikey: env.SUPABASE_ANON_KEY } : {},
      signal: controller.signal,
    });
    if (response.status >= 500) {
      add("fail", `SUPABASE_URL: endpoint returned HTTP ${response.status}`);
    } else {
      add("ok", `SUPABASE_URL: endpoint reachable (HTTP ${response.status})`);
    }
  } catch (error) {
    add(
      "fail",
      `SUPABASE_URL: endpoint unreachable (${error?.name === "AbortError" ? "timeout" : "network error"})`,
    );
  } finally {
    clearTimeout(timeout);
  }
}

function runStaticGates() {
  section("Local static gates");
  runGate("backend:check", process.execPath, ["scripts/verify-rag-backend.mjs"]);
  runGate("database:contract", process.execPath, ["scripts/verify-database-contract.mjs"]);
  runGate("authored-content:migration", process.execPath, [
    "--experimental-transform-types",
    "scripts/generate-authored-catalog-migration.mjs",
    "--check",
  ]);
  const tsc = join(root, "node_modules", ".bin", isWindows ? "tsc.CMD" : "tsc");
  runGate("content-tools:build", tsc, ["-b", "packages/content-tools/tsconfig.json"]);
  runGate("rag:pipeline:build", tsc, ["-p", "packages/rag-pipeline/tsconfig.json"]);
  runGate("content:validate", process.execPath, [
    "packages/content-tools/dist/cli.js",
    "validate",
    "content",
  ]);
  runGate("rag:evaluate:validate", process.execPath, [
    "packages/rag-pipeline/dist/evaluate.js",
    "--validate-only",
    "content/_staging/evals/rag-eval.example.jsonl",
  ]);
  runGate("rag:audit", process.execPath, [
    "packages/rag-pipeline/dist/audit-prepared.js",
    "content/_staging/prepared/rag-corpus.jsonl",
  ]);
  runGate("rag:ingest:dry-run", process.execPath, [
    "packages/rag-pipeline/dist/ingest-prepared.js",
    "content/_staging/prepared/rag-corpus.jsonl",
    "--dry-run",
    "--allow-staging",
  ]);
  runGate("rag:audit:canonical", process.execPath, [
    "packages/rag-pipeline/dist/audit-prepared.js",
    "content/_staging/prepared/rag-corpus-canonical.jsonl",
  ]);
  runGate("rag:ingest:canonical:dry-run", process.execPath, [
    "packages/rag-pipeline/dist/ingest-prepared.js",
    "content/_staging/prepared/rag-corpus-canonical.jsonl",
    "--dry-run",
  ]);
}

function runSourceOnlyGates() {
  section("Dependency-free source gates");
  runGate("workspace-lock", process.execPath, ["scripts/verify-workspace-lock.mjs"]);
  runGate("release-contract", process.execPath, ["scripts/verify-release-contract.mjs"]);
  runGate("migration-security", process.execPath, ["scripts/verify-migration-security.mjs"]);
  runGate("edge-functions:syntax", process.execPath, ["scripts/verify-edge-functions-syntax.mjs"]);
  runGate("database:contract", process.execPath, ["scripts/verify-database-contract.mjs"]);
  runGate("backend:source-only", process.execPath, [
    "scripts/verify-rag-backend.mjs",
    "--source-only",
  ]);
  runGate("account:source-only", process.execPath, ["scripts/verify-account-flow.mjs"]);
  runGate("revenuecat-transfer:source-only", process.execPath, [
    "--experimental-transform-types",
    "scripts/verify-revenuecat-transfer.mjs",
  ]);
  runGate("notifications:source-only", process.execPath, [
    "--experimental-transform-types",
    "scripts/verify-notification-flow.mjs",
  ]);
  runGate("notification-worker:source-only", process.execPath, [
    "--experimental-transform-types",
    "scripts/verify-notification-worker.mjs",
  ]);
  runGate("push-token:source-only", process.execPath, [
    "--experimental-transform-types",
    "scripts/verify-push-token-flow.mjs",
  ]);
  runGate("admin-ops:source-only", process.execPath, [
    "--experimental-transform-types",
    "scripts/verify-admin-ops.mjs",
  ]);
  runGate("admin-audit:source-only", process.execPath, [
    "--experimental-transform-types",
    "scripts/verify-admin-audit.mjs",
  ]);
  runGate("authored-content:source-only", process.execPath, [
    "--experimental-transform-types",
    "scripts/generate-authored-catalog-migration.mjs",
    "--check",
  ]);
  runGate("seed-content:source-only", process.execPath, ["scripts/verify-seed-content.mjs"]);
  runGate("content-catalog:source-only", process.execPath, ["scripts/verify-content-catalog.mjs"]);
  runGate("source-trackers", process.execPath, ["scripts/verify-source-trackers.mjs"]);
  runGate("prepared-corpus:source-audit", process.execPath, [
    "scripts/audit-prepared-corpus-source.mjs",
    "content/_staging/prepared/rag-corpus.jsonl",
  ]);
}

function requireFile(label, relativePath) {
  const absolutePath = join(root, relativePath);
  if (existsSync(absolutePath)) {
    add("ok", `${label}: ${relativePath}`);
    return;
  }
  add("fail", `${label} missing: ${relativePath}`);
}

function requireCommand(command, reason) {
  const result = isWindows
    ? spawnSync("where.exe", [command], { encoding: "utf8" })
    : spawnSync("sh", ["-lc", `command -v ${shellQuote(command)}`], { encoding: "utf8" });

  if (result.status === 0 && result.stdout.trim()) {
    add("ok", `${command}: ${result.stdout.trim().split(/\r?\n/)[0]}`);
    return;
  }

  add("fail", `${command} not found. ${reason}`);
}

function requireEnv(name, invalidValue = isBlank) {
  const value = env[name];
  if (!invalidValue(value)) {
    add("ok", `${name}: set`);
    return;
  }
  add("fail", `${name}: missing or placeholder`);
}

function requireNumericEnv(name, defaultValue, options = {}) {
  const value = env[name] ?? String(defaultValue);
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || (!options.allowZero && numeric <= 0) || numeric < 0) {
    add("fail", `${name}: must be ${options.allowZero ? "non-negative" : "positive"} number`);
    return;
  }
  add("ok", `${name}: ${value}`);
}

function runGate(name, command, commandArgs) {
  const result = spawnSync(command, commandArgs, {
    cwd: root,
    encoding: "utf8",
    shell: isWindows && command.toLowerCase().endsWith(".cmd"),
    stdio: "pipe",
  });

  if (result.status === 0) {
    add("ok", `${name}: passed`);
    return;
  }

  const output = `${result.stdout ?? ""}\n${result.stderr ?? ""}`
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(-8)
    .join(" | ");
  add("fail", `${name}: failed${output ? ` (${output})` : ""}`);
}

function loadEnvironment() {
  return {
    ...readDotEnv(join(root, ".env")),
    ...readDotEnv(join(root, "supabase", ".env")),
    ...process.env,
  };
}

function readDotEnv(path) {
  if (!existsSync(path)) {
    return {};
  }

  const values = {};
  for (const rawLine of readFileSync(path, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }
    const equals = line.indexOf("=");
    if (equals <= 0) {
      continue;
    }
    const name = line.slice(0, equals).trim();
    const rawValue = line.slice(equals + 1).trim();
    values[name] = stripQuotes(rawValue);
  }
  return values;
}

function stripQuotes(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }
  return value;
}

function isBlank(value) {
  return value === undefined || value.trim().length === 0;
}

function isPlaceholderSupabaseUrl(value) {
  return isBlank(value) || value.includes("YOUR_PROJECT_REF");
}

function section(title) {
  console.log(`\n${title}`);
}

function add(level, message) {
  results.push({ level, message });
  const prefix = level === "ok" ? "OK" : level === "warn" ? "WARN" : "FAIL";
  console.log(`[${prefix}] ${message}`);
}

function printSummary() {
  const counts = results.reduce(
    (accumulator, result) => {
      accumulator[result.level] += 1;
      return accumulator;
    },
    { ok: 0, warn: 0, fail: 0 },
  );

  console.log(`\nRAG doctor summary: ${counts.ok} ok, ${counts.warn} warn, ${counts.fail} fail.`);
  if (counts.fail > 0) {
    console.log("Live RAG proof is not ready until every FAIL item is fixed.");
  } else if (sourceOnly) {
    console.log(
      "Dependency-free source checks passed. Install dependencies for TypeScript and unit-test proof.",
    );
  } else if (staticOnly) {
    console.log("Static RAG checks passed. Run without --static-only before live Supabase proof.");
  } else {
    console.log("RAG backend is ready for live Supabase smoke testing.");
  }
}

function shellQuote(value) {
  return `'${value.replaceAll("'", "'\\''")}'`;
}
