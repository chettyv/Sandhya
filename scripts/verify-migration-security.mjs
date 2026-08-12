#!/usr/bin/env node
import { readdirSync, readFileSync } from "node:fs";

const root = new URL("..", import.meta.url);
const migrationsDir = new URL("supabase/migrations/", root);
const files = readdirSync(migrationsDir)
  .filter((file) => file.endsWith(".sql"))
  .sort();

if (files.length === 0) fail("No SQL migrations found.");

const invalidNames = files.filter((file) => !/^\d{14}_[a-z0-9_]+\.sql$/.test(file));
if (invalidNames.length > 0) {
  fail(`Invalid migration filename(s): ${invalidNames.join(", ")}`);
}

const missingDownSections = files.filter(
  (file) => !/--\s*Down:/i.test(readFileSync(new URL(file, migrationsDir), "utf8")),
);
if (missingDownSections.length > 0) {
  fail(`Migration(s) missing a documented Down section: ${missingDownSections.join(", ")}`);
}

const duplicatePrefixes = files
  .map((file) => file.slice(0, 14))
  .filter((prefix, index, values) => values.indexOf(prefix) !== index);
if (duplicatePrefixes.length > 0) {
  fail(`Duplicate migration timestamp(s): ${[...new Set(duplicatePrefixes)].join(", ")}`);
}

const sql = files
  .map((file) => readFileSync(new URL(file, migrationsDir), "utf8"))
  .map(stripComments)
  .join("\n");

if (/disable\s+row\s+level\s+security/i.test(sql)) {
  fail("A migration disables row-level security.");
}

const tables = [...sql.matchAll(/create\s+table\s+if\s+not\s+exists\s+public\.([a-z0-9_]+)/gi)].map(
  (match) => match[1],
);
for (const table of [...new Set(tables)]) {
  assertContains(
    sql,
    new RegExp(
      `alter\\s+table\\s+public\\.${escapeRegExp(table)}\\s+enable\\s+row\\s+level\\s+security`,
      "i",
    ),
    `public.${table} is created without an RLS enable statement`,
  );
}

const policyTables = [
  "profiles",
  "conversations",
  "messages",
  "saved_items",
  "journal_entries",
  "feedback",
  "usage_quotas",
  "device_push_tokens",
  "notification_deliveries",
  "subscription_status",
  "practice_completions",
  "activity_days",
  "texts",
  "passages",
  "commentaries",
  "daily_reflections",
  "festivals",
  "practice_guides",
  "concepts",
  "deities",
];
for (const table of policyTables) {
  assertContains(
    sql,
    new RegExp(
      `create\\s+policy[\\s\\S]*?on\\s+public\\.${escapeRegExp(table)}\\s+(?:for|to|using|with)\\b`,
      "i",
    ),
    `public.${table} has no policy declaration`,
  );
}

for (const table of [
  "cached_answers",
  "passage_embeddings",
  "billing_events",
  "content_sources",
  "cost_log",
  "ai_request_windows",
  "billing_runtime_config",
  "ai_budget_reservations",
  "api_request_windows",
  "notification_push_tickets",
  "admin_audit_log",
]) {
  assertContains(
    sql,
    new RegExp(
      `alter\\s+table\\s+public\\.${escapeRegExp(table)}\\s+enable\\s+row\\s+level\\s+security`,
      "i",
    ),
    `server-only public.${table} is missing RLS`,
  );
  if (
    new RegExp(
      `create\\s+policy[\\s\\S]*?on\\s+public\\.${escapeRegExp(table)}\\s+(?:for|to|using|with)\\b`,
      "i",
    ).test(sql)
  ) {
    fail(`Server-only public.${table} must not gain a client policy.`);
  }
}

assertContains(
  sql,
  /revoke\s+all\s+on\s+table\s+public\.billing_runtime_config\s+from\s+public,\s*anon,\s*authenticated/i,
  "billing runtime config is not closed to client roles",
);
assertContains(
  sql,
  /grant\s+select\s+on\s+table\s+public\.billing_runtime_config\s+to\s+service_role/i,
  "billing runtime config is not available to service_role",
);
assertContains(sql, /processing_started_at/i, "billing events are missing a processing lease");
assertContains(
  sql,
  /processed_at\s+is\s+null/i,
  "billing event claims do not exclude processed events",
);
assertContains(
  sql,
  /interval\s+'10 minutes'/i,
  "billing event claim lease is missing a retry window",
);
assertContains(
  sql,
  /revoke\s+all\s+on\s+function\s+public\.handle_new_user\(\)\s+from\s+public,\s*anon,\s*authenticated/i,
  "handle_new_user trigger function remains publicly executable",
);
assertContains(
  sql,
  /revoke\s+all\s+on\s+function\s+public\.touch_conversation_updated_at\(\)\s+from\s+public,\s*anon,\s*authenticated/i,
  "conversation timestamp trigger remains publicly executable",
);
assertContains(
  sql,
  /revoke\s+all\s+on\s+function\s+public\.touch_updated_at\(\)\s+from\s+public,\s*anon,\s*authenticated/i,
  "updated_at trigger function remains publicly executable",
);
assertContains(
  sql,
  /revoke\s+all\s+on\s+table\s+public\.admin_audit_log\s+from\s+public,\s*anon,\s*authenticated,\s*service_role/i,
  "admin audit log is not closed to direct table writes",
);
assertContains(
  sql,
  /grant\s+select\s+on\s+table\s+public\.admin_audit_log\s+to\s+service_role/i,
  "admin audit log is not readable by service_role",
);

// SECURITY DEFINER functions run with the owner's privileges. Keep the
// execution surface explicit: authenticated users may call only the small
// policy/validation helpers intended for them; all mutation and server-only
// helpers must remain service-role-only. Split function definitions before
// checking so a new privileged helper cannot inherit PostgreSQL's default
// PUBLIC EXECUTE grant without failing this gate. Signature-specific revokes
// remain authoritative in the migrations themselves.
const functionBlocks = sql.split(/(?=create\s+(?:or\s+replace\s+)?function\s+public\.)/i);
const securityDefinerFunctions = functionBlocks
  .filter((block) => /security\s+definer/i.test(block))
  .map((block) => block.match(/function\s+public\.([a-z0-9_]+)\s*\(/i)?.[1])
  .filter(Boolean);
for (const functionName of [...new Set(securityDefinerFunctions)]) {
  assertContains(
    sql,
    new RegExp(
      `revoke\\s+all\\s+on\\s+function\\s+public\\.${escapeRegExp(functionName)}\\s*\\(`,
      "i",
    ),
    `SECURITY DEFINER function public.${functionName} has no explicit EXECUTE revocation`,
  );
}

const securityDefinerPositions = [...sql.matchAll(/security\s+definer/gi)].map(
  (match) => match.index ?? 0,
);
for (const position of securityDefinerPositions) {
  const definition = sql.slice(position, position + 320).toLowerCase();
  if (!definition.includes("set search_path = public")) {
    fail("A SECURITY DEFINER function is missing SET search_path = public.");
  }
}

console.log(
  `Migration security invariants passed for ${files.length} migrations and ${new Set(tables).size} tables.`,
);

function stripComments(value) {
  return value.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/--[^\r\n]*/g, " ");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function assertContains(value, pattern, message) {
  if (!pattern.test(value)) fail(message);
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
