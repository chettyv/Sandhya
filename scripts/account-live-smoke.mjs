#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const env = loadEnvironment();
const supabaseUrl = requireEnv("SUPABASE_URL").replace(/\/$/, "");
const anonKey = requireEnv("SUPABASE_ANON_KEY");
const userA = await signIn("RLS_SMOKE_EMAIL_A", "RLS_SMOKE_PASSWORD_A");
const userB = await signIn("RLS_SMOKE_EMAIL_B", "RLS_SMOKE_PASSWORD_B");

const ownProfile = await rest(userA.access_token, `/profiles?id=eq.${userA.user_id}&select=id`);
assert(ownProfile.length === 1, "User A could not read its own profile.");

const crossProfile = await rest(userA.access_token, `/profiles?id=eq.${userB.user_id}&select=id`);
assert(crossProfile.length === 0, "User A could read User B's profile; RLS is not isolated.");

const crossConversations = await rest(
  userA.access_token,
  `/conversations?user_id=eq.${userB.user_id}&select=id`,
);
assert(
  crossConversations.length === 0,
  "User A could read User B's conversations; RLS is not isolated.",
);

const crossMessages = await rest(
  userA.access_token,
  `/messages?select=id,conversation_id,conversations!inner(user_id)&conversations.user_id=eq.${userB.user_id}`,
);
assert(
  crossMessages.length === 0,
  "User A could read messages in User B's conversations; inherited RLS is not isolated.",
);

for (const table of [
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
]) {
  const rows = await rest(userA.access_token, `/${table}?user_id=eq.${userB.user_id}&select=*`);
  assert(rows.length === 0, `User A could read User B's ${table}; RLS is not isolated.`);
}

for (const table of ["cached_answers", "passage_embeddings", "admin_audit_log"]) {
  await assertServerOnlyReadDenied(userA.access_token, table);
}

await assertWriteDenied(userA.access_token, "/conversations", {
  user_id: userB.user_id,
  title: "RLS write probe",
});
await assertWriteDenied(userA.access_token, "/saved_items", {
  user_id: userB.user_id,
  item_type: "concept",
  item_id: "00000000-0000-0000-0000-000000000701",
});
await assertWriteDenied(userA.access_token, "/journal_entries", {
  user_id: userB.user_id,
  entry: "RLS write probe",
});
await assertWriteDenied(userA.access_token, "/practice_completions", {
  user_id: userB.user_id,
  practice_key: "rls-write-probe",
  completed_on: "2099-01-01",
});
await assertWriteDenied(userA.access_token, "/activity_days", {
  user_id: userB.user_id,
  activity_date: "2099-01-01",
});
await assertWriteRejected(userA.access_token, "/practice_completions", {
  user_id: userA.user_id,
  practice_key: "future-date-probe",
  completed_on: "2099-01-01",
});
await assertWriteRejected(userA.access_token, "/activity_days", {
  user_id: userA.user_id,
  activity_date: "2099-01-01",
});
await assertWriteRejected(userA.access_token, "/journal_entries", {
  user_id: userA.user_id,
  date: "2099-01-01",
  entry: "future-date-probe",
});
await assertWriteDenied(userA.access_token, "/device_push_tokens", {
  user_id: userB.user_id,
  expo_push_token: "ExponentPushToken[rls-write-probe-token]",
  platform: "ios",
});

let crossUserConversationId = null;
try {
  const crossUserConversation = await request(userB.access_token, "/conversations", {
    method: "POST",
    headers: { "content-type": "application/json", prefer: "return=representation" },
    body: JSON.stringify({ user_id: userB.user_id, title: "RLS message parent probe" }),
  });
  const crossUserConversationRows = await readJson(crossUserConversation);
  crossUserConversationId = crossUserConversationRows?.[0]?.id ?? null;
  if (!crossUserConversation.ok || typeof crossUserConversationId !== "string") {
    throw new Error(
      `Could not create the disposable User B message probe. HTTP ${crossUserConversation.status}.`,
    );
  }

  const crossUserMessage = await request(userB.access_token, "/messages", {
    method: "POST",
    headers: { "content-type": "application/json", prefer: "return=representation" },
    body: JSON.stringify({
      conversation_id: crossUserConversationId,
      role: "user",
      content: "RLS message parent probe",
    }),
  });
  const crossUserMessageRows = await readJson(crossUserMessage);
  const crossUserMessageId = crossUserMessageRows?.[0]?.id ?? null;
  if (!crossUserMessage.ok || typeof crossUserMessageId !== "string") {
    throw new Error(
      `Could not create the disposable User B message. HTTP ${crossUserMessage.status}.`,
    );
  }

  const crossUserMessageWrite = await request(userA.access_token, "/messages", {
    method: "POST",
    headers: { "content-type": "application/json", prefer: "return=minimal" },
    body: JSON.stringify({
      conversation_id: crossUserConversationId,
      role: "user",
      content: "Cross-user message write probe",
    }),
  });
  await crossUserMessageWrite.text();
  if (crossUserMessageWrite.ok) {
    throw new Error(
      "User A could insert a message into User B's conversation; parent RLS is not isolated.",
    );
  }

  const crossUserFeedbackWrite = await request(userA.access_token, "/feedback", {
    method: "POST",
    headers: { "content-type": "application/json", prefer: "return=minimal" },
    body: JSON.stringify({
      user_id: userA.user_id,
      message_id: crossUserMessageId,
      issue_type: "other",
      notes: "Cross-user feedback write probe",
    }),
  });
  await crossUserFeedbackWrite.text();
  if (crossUserFeedbackWrite.ok) {
    throw new Error(
      "User A could submit feedback on User B's message; feedback RLS is not isolated.",
    );
  }
} finally {
  if (crossUserConversationId) {
    await request(
      userB.access_token,
      `/conversations?id=${encodeURIComponent(crossUserConversationId)}`,
      {
        method: "DELETE",
        headers: { prefer: "return=minimal" },
      },
    );
  }
}

const conversationProbe = await request(userA.access_token, "/conversations", {
  method: "POST",
  headers: { "content-type": "application/json", prefer: "return=representation" },
  body: JSON.stringify({ user_id: userA.user_id, title: "RLS update probe" }),
});
const conversationProbeRows = await readJson(conversationProbe);
if (
  !conversationProbe.ok ||
  !Array.isArray(conversationProbeRows) ||
  !conversationProbeRows[0]?.id
) {
  fail(`Could not create the disposable RLS update probe. HTTP ${conversationProbe.status}.`);
}
const probeId = conversationProbeRows[0].id;
const updateProbe = await request(
  userA.access_token,
  `/conversations?id=eq.${encodeURIComponent(probeId)}`,
  {
    method: "PATCH",
    headers: { "content-type": "application/json", prefer: "return=minimal" },
    body: JSON.stringify({ user_id: userB.user_id }),
  },
);
if (updateProbe.ok) {
  await request(userB.access_token, `/conversations?id=eq.${encodeURIComponent(probeId)}`, {
    method: "DELETE",
    headers: { prefer: "return=minimal" },
  });
  fail("User A could move an owned conversation to User B during UPDATE; WITH CHECK is missing.");
}
await request(userA.access_token, `/conversations?id=eq.${encodeURIComponent(probeId)}`, {
  method: "DELETE",
  headers: { prefer: "return=minimal" },
});

console.log("Account/RLS live smoke passed for two authenticated users.");

async function signIn(emailKey, passwordKey) {
  const email = requireEnv(emailKey);
  const password = requireEnv(passwordKey);
  const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: anonKey, "content-type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const json = await readJson(response);
  if (!response.ok || typeof json.access_token !== "string" || !json.user?.id) {
    fail(`Could not sign in ${emailKey}. HTTP ${response.status}: ${summarizeError(json)}`);
  }
  return { access_token: json.access_token, user_id: json.user.id };
}

async function rest(accessToken, path) {
  const response = await request(accessToken, path, { method: "GET" });
  const json = await readJson(response);
  if (!response.ok) fail(`RLS query failed. HTTP ${response.status}: ${summarizeError(json)}`);
  return Array.isArray(json) ? json : [];
}

async function assertWriteDenied(accessToken, path, body) {
  const response = await request(accessToken, path, {
    method: "POST",
    headers: { "content-type": "application/json", prefer: "return=minimal" },
    body: JSON.stringify(body),
  });
  if (response.ok) {
    fail(`User A could write User B-scoped data at ${path}; RLS write isolation is not enforced.`);
  }
}

async function assertWriteRejected(accessToken, path, body) {
  const response = await request(accessToken, path, {
    method: "POST",
    headers: { "content-type": "application/json", prefer: "return=minimal" },
    body: JSON.stringify(body),
  });
  if (response.ok) {
    fail(
      `A user could write invalid future activity data at ${path}; date integrity is not enforced.`,
    );
  }
}

async function assertServerOnlyReadDenied(accessToken, table) {
  const response = await request(accessToken, `/${table}?select=id`, { method: "GET" });
  if (response.ok) {
    const rows = await readJson(response);
    assert(
      Array.isArray(rows) && rows.length === 0,
      `Authenticated users could read server-only ${table}.`,
    );
    return;
  }
  await response.text();
  assert(
    response.status === 401 || response.status === 403,
    `Server-only ${table} returned unexpected HTTP ${response.status}.`,
  );
}

async function request(accessToken, path, init) {
  return fetch(`${supabaseUrl}/rest/v1${path}`, {
    ...init,
    headers: {
      apikey: anonKey,
      authorization: `Bearer ${accessToken}`,
      ...(init.headers ?? {}),
    },
  });
}

async function readJson(response) {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    fail(`Expected JSON response, got: ${text.slice(0, 240)}`);
  }
}

function requireEnv(name) {
  const value = env[name];
  if (!value || value.trim().length === 0 || value.includes("YOUR_PROJECT_REF")) {
    fail(`${name} must be set for account/RLS smoke testing.`);
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

function assert(condition, message) {
  if (!condition) fail(message);
}

function summarizeError(value) {
  return (
    value?.message ||
    value?.error_description ||
    value?.error ||
    JSON.stringify(value).slice(0, 240)
  );
}

function fail(message) {
  console.error(`[FAIL] ${message}`);
  process.exit(1);
}
