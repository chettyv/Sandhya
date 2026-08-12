#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const env = loadEnvironment();
if (requireEnv("ACCOUNT_DELETE_SMOKE_CONFIRM") !== "DELETE_ACCOUNT_LIVE") {
  fail("Set ACCOUNT_DELETE_SMOKE_CONFIRM=DELETE_ACCOUNT_LIVE to run the destructive smoke test.");
}

const supabaseUrl = requireEnv("SUPABASE_URL").replace(/\/$/, "");
const anonKey = requireEnv("SUPABASE_ANON_KEY");
const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
const accountUrl = (env.ACCOUNT_FUNCTION_URL || `${supabaseUrl}/functions/v1/account`).replace(
  /\/$/,
  "",
);
const email = requireEnv("ACCOUNT_DELETE_SMOKE_EMAIL");
const password = requireEnv("ACCOUNT_DELETE_SMOKE_PASSWORD");

const session = await signIn();
const exported = await requestExport(session.access_token);
assert(exported.schema_version === "1", "Account export did not return schema_version=1.");
assert(exported.account?.id === session.user_id, "Account export returned the wrong user id.");
assert(
  exported.data && typeof exported.data === "object",
  "Account export omitted data collections.",
);

const deletion = await requestDelete(session.access_token);
assert(deletion.deleted === true, "Account deletion did not return deleted=true.");

const afterDeletion = await trySignIn();
assert(afterDeletion === false, "Deleted account could still sign in.");
await assertDeletedData(session.user_id);
console.log("Account export/deletion live smoke passed for the disposable account.");

async function signIn() {
  const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: anonKey, "content-type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const json = await readJson(response);
  if (!response.ok || typeof json.access_token !== "string" || !json.user?.id) {
    fail(
      `Could not sign in the deletion smoke account. HTTP ${response.status}: ${summarizeError(json)}`,
    );
  }
  return { access_token: json.access_token, user_id: json.user.id };
}

async function trySignIn() {
  const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: anonKey, "content-type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return response.ok;
}

async function requestExport(accessToken) {
  const response = await fetch(`${accountUrl}?format=json`, {
    headers: { apikey: anonKey, authorization: `Bearer ${accessToken}` },
  });
  const json = await readJson(response);
  if (!response.ok) fail(`Account export failed. HTTP ${response.status}: ${summarizeError(json)}`);
  return json;
}

async function requestDelete(accessToken) {
  const response = await fetch(accountUrl, {
    method: "POST",
    headers: {
      apikey: anonKey,
      authorization: `Bearer ${accessToken}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ confirmation: "DELETE" }),
  });
  const json = await readJson(response);
  if (!response.ok)
    fail(`Account deletion failed. HTTP ${response.status}: ${summarizeError(json)}`);
  return json;
}

async function assertDeletedData(userId) {
  const userScopedTables = [
    "conversations",
    "saved_items",
    "journal_entries",
    "feedback",
    "usage_quotas",
    "device_push_tokens",
    "notification_deliveries",
    "notification_push_tickets",
    "subscription_status",
    "practice_completions",
    "activity_days",
    "ai_request_windows",
    "api_request_windows",
    "ai_budget_reservations",
    "cost_log",
  ];
  for (const table of userScopedTables) {
    const rows = await adminRest(`/${table}?user_id=eq.${encodeURIComponent(userId)}&select=*`);
    assert(rows.length === 0, `Deleted account still has rows in ${table}.`);
  }

  const profileRows = await adminRest(`/profiles?id=eq.${encodeURIComponent(userId)}&select=id`);
  assert(profileRows.length === 0, "Deleted account still has its profile row.");

  const messageRows = await adminRest(
    `/messages?select=id,conversations!inner(user_id)&conversations.user_id=eq.${encodeURIComponent(userId)}`,
  );
  assert(messageRows.length === 0, "Deleted account still has messages through its conversations.");

  for (const appUserId of [userId, `supabase:${userId}`]) {
    const rows = await adminRest(
      `/billing_events?app_user_id=eq.${encodeURIComponent(appUserId)}&select=event_id`,
    );
    assert(rows.length === 0, `Deleted account still has billing events for ${appUserId}.`);
  }
}

async function adminRest(path) {
  const response = await fetch(`${supabaseUrl}/rest/v1${path}`, {
    headers: { apikey: serviceRoleKey, authorization: `Bearer ${serviceRoleKey}` },
  });
  const json = await readJson(response);
  if (!response.ok) {
    fail(`Post-delete cleanup query failed. HTTP ${response.status}: ${summarizeError(json)}`);
  }
  return Array.isArray(json) ? json : [];
}

async function readJson(response) {
  const text = await response.text();
  if (!text.trim()) return {};
  try {
    return JSON.parse(text);
  } catch {
    fail(`Expected JSON response, got: ${text.slice(0, 240)}`);
  }
}

function requireEnv(name) {
  const value = env[name];
  if (!value || value.trim().length === 0 || value.includes("YOUR_PROJECT_REF")) {
    fail(`${name} must be set for account deletion smoke testing.`);
  }
  return value.trim();
}

function loadEnvironment() {
  return {
    ...readDotEnv(join(root, ".env")),
    ...readDotEnv(join(root, "supabase", ".env")),
    ...process.env,
  };
}

function readDotEnv(path) {
  if (!existsSync(path)) return {};
  const values = {};
  for (const rawLine of readFileSync(path, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const equals = line.indexOf("=");
    if (equals <= 0) continue;
    values[line.slice(0, equals).trim()] = line
      .slice(equals + 1)
      .trim()
      .replace(/^['"]|['"]$/g, "");
  }
  return values;
}

function summarizeError(value) {
  return (
    value?.message ||
    value?.error_description ||
    value?.error ||
    JSON.stringify(value).slice(0, 240)
  );
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function fail(message) {
  console.error(`[FAIL] ${message}`);
  process.exit(1);
}
