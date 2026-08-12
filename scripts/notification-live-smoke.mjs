#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const env = loadEnvironment();
const supabaseUrl = requireEnv("SUPABASE_URL").replace(/\/$/, "");
const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
const cronSecret = requireEnv("DAILY_REFLECTIONS_CRON_SECRET");
const userId = requireEnv("NOTIFICATION_SMOKE_USER_ID");
const expoPushToken = requireEnv("NOTIFICATION_SMOKE_EXPO_PUSH_TOKEN");
const confirmation = requireEnv("NOTIFICATION_SMOKE_CONFIRM");
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

if (confirmation !== "NOTIFICATION_LIVE") {
  fail("Set NOTIFICATION_SMOKE_CONFIRM=NOTIFICATION_LIVE for the notification smoke.");
}
if (!UUID_PATTERN.test(userId)) fail("NOTIFICATION_SMOKE_USER_ID must be a UUID.");
if (!/^ExponentPushToken\[.+\]$/.test(expoPushToken)) {
  fail("NOTIFICATION_SMOKE_EXPO_PUSH_TOKEN must be an Expo push token.");
}

const deliveryDate = new Date().toISOString().slice(0, 10);
const profilePath = `/profiles?id=eq.${encodeURIComponent(userId)}&select=id,display_name,language_pref,tradition_pref,location,notification_time,timezone`;
const tokenPath = `/device_push_tokens?expo_push_token=eq.${encodeURIComponent(expoPushToken)}&select=id,user_id,expo_push_token`;
const userTokenPath = `/device_push_tokens?user_id=eq.${encodeURIComponent(userId)}&select=id,expo_push_token`;
const deliveryPath = `/notification_deliveries?user_id=eq.${encodeURIComponent(userId)}&delivery_date=eq.${deliveryDate}&kind=eq.daily_reflection&select=id,status,delivery_date,kind`;
const ticketPath = `/notification_push_tickets?user_id=eq.${encodeURIComponent(userId)}&delivery_date=eq.${deliveryDate}&kind=eq.daily_reflection&select=id,ticket_id,status,expo_push_token`;

let createdDelivery = false;
let insertedToken = false;
let originalProfile;

try {
  const profiles = await adminRest(profilePath);
  originalProfile = profiles[0];
  if (!originalProfile) fail("Notification smoke user profile was not found.");

  const existingDeliveries = await adminRest(deliveryPath);
  if (existingDeliveries.length > 0) {
    fail("Notification smoke user already has a delivery for today; use a disposable account.");
  }

  const tokenOwners = await adminRest(tokenPath);
  if (tokenOwners.length > 0) {
    fail("Notification smoke Expo token is already registered; use a disposable token.");
  }
  const userTokens = await adminRest(userTokenPath);
  if (userTokens.length > 0) {
    fail("Notification smoke user already has push tokens; use a disposable account.");
  }

  const dueTime = new Date(Date.now() - 5 * 60 * 1_000);
  await adminRest(`/profiles?id=eq.${encodeURIComponent(userId)}`, {
    method: "PATCH",
    headers: { "content-type": "application/json", prefer: "return=minimal" },
    body: JSON.stringify({
      notification_time: dueTime.toISOString().slice(11, 19),
      timezone: "UTC",
    }),
  });
  await adminRest("/device_push_tokens", {
    method: "POST",
    headers: { "content-type": "application/json", prefer: "return=representation" },
    body: JSON.stringify({
      user_id: userId,
      expo_push_token: expoPushToken,
      platform: "ios",
      app_version: "notification-live-smoke",
      enabled: true,
    }),
  });
  insertedToken = true;
  // The worker may create a delivery or ticket before a later step fails;
  // cleanup is deliberately scoped to this disposable user, date, and token.
  createdDelivery = true;

  const first = await invokeWorker();
  if (first.sent !== 1 || first.skipped !== 0) {
    fail(
      `Notification worker did not deliver exactly once on the first run: ${JSON.stringify(first)}.`,
    );
  }
  const deliveries = await adminRest(deliveryPath);
  if (deliveries.length !== 1 || deliveries[0].status !== "sent") {
    fail(`Notification delivery was not durably marked sent: ${JSON.stringify(deliveries)}.`);
  }
  const tickets = await adminRest(ticketPath);
  if (
    tickets.length !== 1 ||
    tickets[0].expo_push_token !== expoPushToken ||
    !["pending", "claimed", "ok"].includes(tickets[0].status)
  ) {
    fail(`Expo push ticket was not persisted correctly: ${JSON.stringify(tickets)}.`);
  }

  const second = await invokeWorker();
  if (second.sent !== 0 || second.skipped !== 0) {
    fail(`Notification worker duplicated a sent delivery: ${JSON.stringify(second)}.`);
  }
  console.log(
    "Notification live smoke passed: delivery, ticket persistence, and duplicate suppression.",
  );
} finally {
  if (createdDelivery) {
    await adminRest(deliveryPath, { method: "DELETE" }).catch((error) =>
      console.warn(`[WARN] Could not remove smoke delivery: ${summarizeError(error)}.`),
    );
  }
  await adminRest(
    `/notification_push_tickets?user_id=eq.${encodeURIComponent(userId)}&delivery_date=eq.${deliveryDate}&expo_push_token=eq.${encodeURIComponent(expoPushToken)}`,
    { method: "DELETE" },
  ).catch((error) =>
    console.warn(`[WARN] Could not remove smoke push tickets: ${summarizeError(error)}.`),
  );
  if (insertedToken) {
    await adminRest(`/device_push_tokens?expo_push_token=eq.${encodeURIComponent(expoPushToken)}`, {
      method: "DELETE",
    }).catch((error) =>
      console.warn(`[WARN] Could not remove smoke push token: ${summarizeError(error)}.`),
    );
  }
  if (originalProfile) {
    await adminRest(`/profiles?id=eq.${encodeURIComponent(userId)}`, {
      method: "PATCH",
      headers: { "content-type": "application/json", prefer: "return=minimal" },
      body: JSON.stringify({
        display_name: originalProfile.display_name,
        language_pref: originalProfile.language_pref,
        tradition_pref: originalProfile.tradition_pref,
        location: originalProfile.location,
        notification_time: originalProfile.notification_time,
        timezone: originalProfile.timezone,
      }),
    }).catch((error) =>
      console.warn(`[WARN] Could not restore smoke profile: ${summarizeError(error)}.`),
    );
  }
}

async function invokeWorker() {
  const response = await fetchWithTimeout(`${supabaseUrl}/functions/v1/send-daily-reflections`, {
    method: "POST",
    headers: { "x-cron-secret": cronSecret, "content-type": "application/json" },
    body: "{}",
  });
  const body = await readJson(response);
  if (!response.ok)
    fail(`Notification worker failed with HTTP ${response.status}: ${summarizeError(body)}.`);
  return body;
}

async function adminRest(path, init = {}) {
  const response = await fetchWithTimeout(`${supabaseUrl}/rest/v1${path}`, {
    ...init,
    headers: {
      apikey: serviceRoleKey,
      authorization: `Bearer ${serviceRoleKey}`,
      ...(init.headers ?? {}),
    },
  });
  const body = await readJson(response);
  if (!response.ok)
    fail(
      `Supabase notification smoke query failed with HTTP ${response.status}: ${summarizeError(body)}.`,
    );
  return Array.isArray(body) ? body : [];
}

async function fetchWithTimeout(url, init, timeoutMs = 60_000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
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
  const value = env[name]?.trim();
  if (!value || value.includes("YOUR_PROJECT_REF"))
    fail(`${name} must be set for notification smoke.`);
  return value;
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
  if (value instanceof Error) return value.message;
  return (
    value?.message ||
    value?.error_description ||
    value?.error ||
    JSON.stringify(value).slice(0, 240)
  );
}

function fail(message) {
  throw new Error(message);
}
