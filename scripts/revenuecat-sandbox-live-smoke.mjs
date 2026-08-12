#!/usr/bin/env node
import { createHmac, randomUUID } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const env = loadEnvironment();
const smokeConfirm = requireEnv("REVENUECAT_SMOKE_CONFIRM");
if (smokeConfirm !== "REVENUECAT_SANDBOX_LIVE") {
  fail("Set REVENUECAT_SMOKE_CONFIRM=REVENUECAT_SANDBOX_LIVE for the sandbox replay.");
}

const supabaseUrl = requireEnv("SUPABASE_URL").replace(/\/$/, "");
const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
const webhookUrl = requireEnv("REVENUECAT_WEBHOOK_URL").replace(/\/$/, "");
const webhookSecret = requireEnv("REVENUECAT_WEBHOOK_SECRET");
const userId = requireEnv("REVENUECAT_SMOKE_USER_ID");
const transferDestinationUserId = requireEnv("REVENUECAT_SMOKE_TRANSFER_DESTINATION_USER_ID");
const productId = env.REVENUECAT_SMOKE_PRODUCT_ID?.trim() || "plus_monthly";
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
if (!UUID_PATTERN.test(userId)) fail("REVENUECAT_SMOKE_USER_ID must be a UUID.");
if (!UUID_PATTERN.test(transferDestinationUserId))
  fail("REVENUECAT_SMOKE_TRANSFER_DESTINATION_USER_ID must be a UUID.");
if (transferDestinationUserId.toLowerCase() === userId.toLowerCase())
  fail("RevenueCat transfer smoke source and destination users must differ.");

await run().catch((error) => {
  console.error(
    `[FAIL] ${error instanceof Error ? error.message : "RevenueCat sandbox smoke failed."}`,
  );
  process.exitCode = 1;
});

async function run() {
  const eventIds = [];
  try {
    const baseTimestamp = Date.now();
    const initialExpiry = baseTimestamp + 24 * 60 * 60 * 1_000;
    const activeEventId = randomUUID();
    eventIds.push(activeEventId);
    await postWebhook({
      id: activeEventId,
      type: "INITIAL_PURCHASE",
      app_user_id: userId,
      product_id: productId,
      entitlement_ids: ["plus"],
      expiration_at_ms: initialExpiry,
      event_timestamp_ms: baseTimestamp,
      environment: "SANDBOX",
    });
    await assertSubscription({
      plan: inferPlan(productId),
      status: "active",
      expiresAtMs: initialExpiry,
    });

    const renewalExpiry = baseTimestamp + 2 * 24 * 60 * 60 * 1_000;
    await replayLifecycle(eventIds, {
      type: "RENEWAL",
      event_timestamp_ms: baseTimestamp + 1_000,
      expiration_at_ms: renewalExpiry,
    });
    await assertSubscription({
      plan: inferPlan(productId),
      status: "active",
      expiresAtMs: renewalExpiry,
    });

    await replayLifecycle(eventIds, {
      type: "CANCELLATION",
      event_timestamp_ms: baseTimestamp + 2_000,
    });
    await assertSubscription({
      plan: inferPlan(productId),
      status: "cancelled",
      expiresAtMs: renewalExpiry,
    });

    // A late provider delivery must not overwrite a newer cancellation.
    await replayLifecycle(eventIds, {
      type: "RENEWAL",
      event_timestamp_ms: baseTimestamp + 1_500,
      expiration_at_ms: baseTimestamp + 3 * 24 * 60 * 60 * 1_000,
    });
    await assertSubscription({
      plan: inferPlan(productId),
      status: "cancelled",
      expiresAtMs: renewalExpiry,
    });

    await replayLifecycle(eventIds, {
      type: "BILLING_ISSUE",
      event_timestamp_ms: baseTimestamp + 3_000,
    });
    await assertSubscription({
      plan: inferPlan(productId),
      status: "billing_issue",
      expiresAtMs: renewalExpiry,
    });

    const uncancellationExpiry = baseTimestamp + 3 * 24 * 60 * 60 * 1_000;
    await replayLifecycle(eventIds, {
      type: "UNCANCELLATION",
      event_timestamp_ms: baseTimestamp + 4_000,
      expiration_at_ms: uncancellationExpiry,
    });
    await assertSubscription({
      plan: inferPlan(productId),
      status: "active",
      expiresAtMs: uncancellationExpiry,
    });

    await replayLifecycle(eventIds, {
      type: "REFUND",
      event_timestamp_ms: baseTimestamp + 5_000,
      expiration_at_ms: uncancellationExpiry,
    });
    await assertSubscription({ plan: "free", status: "refunded" });

    const expirationEventId = randomUUID();
    eventIds.push(expirationEventId);
    await postWebhook({
      id: expirationEventId,
      type: "EXPIRATION",
      app_user_id: userId,
      product_id: productId,
      entitlement_ids: ["plus"],
      expiration_at_ms: Date.now() - 1_000,
      event_timestamp_ms: baseTimestamp + 6_000,
      environment: "SANDBOX",
    });
    await assertSubscription({ plan: "free", status: "expired" });

    // Re-establish a disposable source entitlement so TRANSFER proves source
    // revocation rather than merely operating on an already-free account.
    const transferPurchaseEventId = randomUUID();
    eventIds.push(transferPurchaseEventId);
    const transferTimestamp = baseTimestamp + 7_000;
    const transferExpiry = baseTimestamp + 4 * 24 * 60 * 60 * 1_000;
    await postWebhook({
      id: transferPurchaseEventId,
      type: "INITIAL_PURCHASE",
      app_user_id: userId,
      product_id: productId,
      entitlement_ids: ["plus"],
      expiration_at_ms: transferExpiry,
      event_timestamp_ms: transferTimestamp,
      environment: "SANDBOX",
    });
    await assertSubscription({
      plan: inferPlan(productId),
      status: "active",
      expiresAtMs: transferExpiry,
    });

    // RevenueCat may omit environment on TRANSFER. Exercising that form keeps
    // the destination free until a known-environment lifecycle event arrives.
    const transferEventId = randomUUID();
    eventIds.push(transferEventId);
    await postWebhook({
      id: transferEventId,
      type: "TRANSFER",
      transferred_from: [userId],
      transferred_to: [transferDestinationUserId],
      event_timestamp_ms: transferTimestamp + 1_000,
    });
    await assertSubscription({ plan: "free", status: "free", environment: "UNKNOWN" });
    await assertSubscription({
      userId: transferDestinationUserId,
      plan: "free",
      status: "free",
      environment: "UNKNOWN",
    });
    console.log("[OK] TRANSFER revoked the source and kept the ambiguous destination free.");

    console.log(
      "RevenueCat sandbox webhook replay passed: purchase, renewal, cancellation, billing issue, uncancellation, refund, stale ordering, expiration, and transfer.",
    );
  } finally {
    await resetSubscriptionState(userId);
    await resetSubscriptionState(transferDestinationUserId);
    for (const eventId of eventIds) {
      await deleteBillingEvent(eventId);
    }
  }
}

async function replayLifecycle(eventIds, event) {
  const eventId = randomUUID();
  eventIds.push(eventId);
  await postWebhook({
    id: eventId,
    app_user_id: userId,
    product_id: productId,
    entitlement_ids: ["plus"],
    environment: "SANDBOX",
    ...event,
  });
}

async function postWebhook(event) {
  const body = JSON.stringify({ event, api_version: "1.0" });
  const timestamp = Math.floor(Date.now() / 1_000);
  const signature = createHmac("sha256", webhookSecret)
    .update(`${timestamp}.${body}`)
    .digest("hex");
  const response = await fetchWithTimeout(webhookUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-revenuecat-webhook-signature": `t=${timestamp},v1=${signature}`,
    },
    body,
  });
  const json = await readJson(response);
  if (!response.ok || json.received !== true || json.ignored === true) {
    fail(
      `RevenueCat sandbox event ${event.type} failed. HTTP ${response.status}: ${summarizeError(json)}`,
    );
  }
}

async function assertSubscription(expected) {
  const targetUserId = expected.userId ?? userId;
  const rows = await adminRest(
    `/subscription_status?user_id=eq.${encodeURIComponent(targetUserId)}&select=plan,status,environment,expires_at`,
  );
  const row = rows[0];
  if (
    row?.plan !== expected.plan ||
    row?.status !== expected.status ||
    row?.environment !== (expected.environment ?? "SANDBOX")
  ) {
    fail(`Unexpected subscription state: ${JSON.stringify(row)}.`);
  }
  if (expected.expiresAtMs !== undefined) {
    const actualExpiresAtMs = Date.parse(row.expires_at ?? "");
    if (
      !Number.isFinite(actualExpiresAtMs) ||
      Math.abs(actualExpiresAtMs - expected.expiresAtMs) > 2_000
    ) {
      fail(`Unexpected subscription expiry: ${JSON.stringify(row)}.`);
    }
  }
}

async function deleteBillingEvent(eventId) {
  try {
    await adminRest(`/billing_events?event_id=eq.${encodeURIComponent(eventId)}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.warn(
      `[WARN] Could not remove sandbox billing event ${eventId}: ${error instanceof Error ? error.message : "cleanup failed"}`,
    );
  }
}

async function resetSubscriptionState(targetUserId) {
  try {
    await adminRest(`/subscription_status?user_id=eq.${encodeURIComponent(targetUserId)}`, {
      method: "PATCH",
      headers: { "content-type": "application/json", prefer: "return=minimal" },
      body: JSON.stringify({
        plan: "free",
        status: "expired",
        environment: "SANDBOX",
        expires_at: null,
      }),
    });
  } catch (error) {
    console.warn(
      `[WARN] Could not reset sandbox subscription state: ${error instanceof Error ? error.message : "cleanup failed"}`,
    );
  }
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
  const json = await readJson(response);
  if (!response.ok)
    fail(`Supabase sandbox smoke query failed. HTTP ${response.status}: ${summarizeError(json)}`);
  return Array.isArray(json) ? json : [];
}

function inferPlan(value) {
  const normalized = value.toLowerCase();
  if (normalized.includes("lifetime")) return "lifetime";
  if (normalized.includes("annual") || normalized.includes("year")) return "plus_annual";
  if (normalized.includes("monthly") || normalized.includes("month")) return "plus_monthly";
  fail(`REVENUECAT_SMOKE_PRODUCT_ID is not mapped to a supported plan: ${value}`);
}

async function fetchWithTimeout(url, init, timeoutMs = 30_000) {
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
    fail(`${name} must be set for sandbox webhook replay.`);
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
