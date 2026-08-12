#!/usr/bin/env node
import { createHmac } from "node:crypto";

const destinationUserId = "4BEDB450-8EF2-11E9-B475-0800200C9A66";
const sourceUserId = "00005A1C-6091-4F81-BE77-F0A83A271AB6";
const normalizedDestinationUserId = destinationUserId.toLowerCase();
const normalizedSourceUserId = sourceUserId.toLowerCase();
const eventId = "12345678-1234-1234-1234-123456789012";
const secret = "test-webhook-secret";
const calls = [];
let transferPayload = null;
let claimResult = [{ claimed: true, processing_token: "123e4567-e89b-12d3-a456-426614174000" }];
let handler;
const subscriptionEventPayloads = [];

const environment = {
  SUPABASE_URL: "https://project.supabase.co",
  SUPABASE_SERVICE_ROLE_KEY: "service-role-test-key",
  REVENUECAT_WEBHOOK_SECRET: secret,
  REVENUECAT_API_KEY: "revenuecat-secret-test-key",
  REVENUECAT_ALLOW_SANDBOX: "false",
};

globalThis.Deno = {
  env: { get: (name) => environment[name] },
  serve: (requestHandler) => {
    handler = requestHandler;
  },
};

globalThis.fetch = async (url, init = {}) => {
  const target = String(url);
  calls.push(target);
  if (target.includes("api.revenuecat.com/v1/subscribers/")) {
    return new Response(
      JSON.stringify({
        subscriber: {
          entitlements: {
            plus: {
              product_identifier: "plus_monthly",
              expires_date: new Date(Date.now() + 86_400_000).toISOString(),
            },
          },
        },
      }),
      { status: 200 },
    );
  }
  if (target.includes("claim_billing_event")) {
    return new Response(JSON.stringify(claimResult), { status: 200 });
  }
  if (target.includes("complete_billing_event")) {
    return new Response(JSON.stringify([{ complete_billing_event: true }]), { status: 200 });
  }
  if (target.includes("apply_subscription_transfer")) {
    transferPayload = JSON.parse(String(init.body));
    return new Response(JSON.stringify([{ applied: true }]), { status: 200 });
  }
  if (target.includes("apply_subscription_event")) {
    subscriptionEventPayloads.push(JSON.parse(String(init.body)));
    return new Response(JSON.stringify([{ applied: true }]), { status: 200 });
  }
  return new Response(null, { status: 204 });
};

await import("../supabase/functions/revenuecat-webhook/index.ts");
if (typeof handler !== "function") fail("RevenueCat webhook did not register a handler.");

// RevenueCat's documented TRANSFER sample omits app_user_id and identifies
// the destination through transferred_to.
const body = JSON.stringify({
  event: {
    event_timestamp_ms: Date.now(),
    transferred_from: [sourceUserId],
    transferred_to: [destinationUserId],
    type: "TRANSFER",
    environment: "PRODUCTION",
    id: eventId,
  },
  api_version: "1.0",
});
const timestamp = Math.floor(Date.now() / 1000);
const signature = createHmac("sha256", secret).update(`${timestamp}.${body}`).digest("hex");
const response = await handler(
  new Request("https://project.supabase.co/functions/v1/revenuecat-webhook", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-revenuecat-webhook-signature": `t=${timestamp},v1=${signature}`,
    },
    body,
  }),
);
const responseBody = await response.json();

assert(response.status === 200, `Expected HTTP 200, got ${response.status}.`);
assert(responseBody.received === true, "Transfer was not acknowledged.");
assert(responseBody.destination_plan === "plus_monthly", "Destination plan was not reconciled.");
assert(
  transferPayload?.p_destination_user_id === normalizedDestinationUserId,
  "Wrong transfer destination.",
);
assert(
  transferPayload?.p_destination_revenuecat_app_user_id ===
    `supabase:${normalizedDestinationUserId}`,
  "Missing fallback destination App User ID.",
);
assert(
  transferPayload?.p_source_user_ids?.[0] === normalizedSourceUserId,
  "Source account was not passed to atomic revocation.",
);
assert(
  calls.some((target) => target.includes("api.revenuecat.com/v1/subscribers/")),
  "Subscriber reconciliation was skipped.",
);
assert(
  calls.some((target) => target.includes("apply_subscription_transfer")),
  "Atomic transfer RPC was skipped.",
);

// Sandbox lifecycle events must be acknowledged without changing entitlement
// state when the production webhook is not explicitly sandbox-enabled.
const sandboxBody = JSON.stringify({
  event: {
    event_timestamp_ms: Date.now(),
    app_user_id: normalizedDestinationUserId,
    type: "INITIAL_PURCHASE",
    product_id: "plus_monthly",
    expiration_at_ms: Date.now() + 86_400_000,
    environment: "SANDBOX",
    id: "42345678-1234-1234-1234-123456789012",
  },
  api_version: "1.0",
});
const sandboxTimestamp = Math.floor(Date.now() / 1000);
const sandboxSignature = createHmac("sha256", secret)
  .update(`${sandboxTimestamp}.${sandboxBody}`)
  .digest("hex");
const sandboxResponse = await handler(
  new Request("https://project.supabase.co/functions/v1/revenuecat-webhook", {
    method: "POST",
    headers: { "x-revenuecat-webhook-signature": `t=${sandboxTimestamp},v1=${sandboxSignature}` },
    body: sandboxBody,
  }),
);
const sandboxResponseBody = await sandboxResponse.json();
assert(sandboxResponse.status === 200, "Sandbox-disabled event was not acknowledged safely.");
assert(sandboxResponseBody.reason === "sandbox_disabled", "Sandbox event was not ignored.");
assert(subscriptionEventPayloads.length === 0, "Sandbox-disabled event mutated entitlement state.");

// Normal production lifecycle events must map to an active grant and then a
// terminal downgrade using the provider expiry and product identity.
const purchaseBody = JSON.stringify({
  event: {
    event_timestamp_ms: Date.now(),
    app_user_id: normalizedDestinationUserId,
    type: "INITIAL_PURCHASE",
    product_id: "plus_monthly",
    expiration_at_ms: Date.now() + 86_400_000,
    environment: "PRODUCTION",
    id: "52345678-1234-1234-1234-123456789012",
  },
  api_version: "1.0",
});
const purchaseResponse = await signedWebhook(purchaseBody);
assert(purchaseResponse.status === 200, "Production purchase was not accepted.");
assert(
  subscriptionEventPayloads.at(-1)?.p_plan === "plus_monthly",
  "Purchase plan was not applied.",
);
assert(subscriptionEventPayloads.at(-1)?.p_status === "active", "Purchase status was not active.");
assert(
  subscriptionEventPayloads.at(-1)?.p_environment === "PRODUCTION",
  "Purchase environment was not preserved.",
);

const expirationBody = JSON.stringify({
  event: {
    event_timestamp_ms: Date.now() + 1_000,
    app_user_id: normalizedDestinationUserId,
    type: "EXPIRATION",
    product_id: "plus_monthly",
    expiration_at_ms: Date.now() - 1_000,
    environment: "PRODUCTION",
    id: "62345678-1234-1234-1234-123456789012",
  },
  api_version: "1.0",
});
const expirationResponse = await signedWebhook(expirationBody);
assert(expirationResponse.status === 200, "Production expiration was not accepted.");
assert(
  subscriptionEventPayloads.at(-1)?.p_plan === "free",
  "Expiration did not downgrade the plan.",
);
assert(
  subscriptionEventPayloads.at(-1)?.p_status === "expired",
  "Expiration status was not terminal.",
);

// A lifecycle event without an explicit environment must never mutate or grant
// entitlement state.
const applyEventCallsBefore = calls.filter((target) =>
  target.includes("apply_subscription_event"),
).length;
const unknownEnvironmentBody = JSON.stringify({
  event: {
    event_timestamp_ms: Date.now(),
    app_user_id: `supabase:${normalizedDestinationUserId}`,
    type: "INITIAL_PURCHASE",
    product_id: "plus_monthly",
    expiration_at_ms: Date.now() + 86_400_000,
    id: "22345678-1234-1234-1234-123456789012",
  },
  api_version: "1.0",
});
const unknownTimestamp = Math.floor(Date.now() / 1000);
const unknownSignature = createHmac("sha256", secret)
  .update(`${unknownTimestamp}.${unknownEnvironmentBody}`)
  .digest("hex");
const unknownResponse = await handler(
  new Request("https://project.supabase.co/functions/v1/revenuecat-webhook", {
    method: "POST",
    headers: { "x-revenuecat-webhook-signature": `t=${unknownTimestamp},v1=${unknownSignature}` },
    body: unknownEnvironmentBody,
  }),
);
const unknownResponseBody = await unknownResponse.json();
assert(
  unknownResponse.status === 200,
  `Unknown environment event returned HTTP ${unknownResponse.status}.`,
);
assert(
  unknownResponseBody.reason === "unknown_environment",
  "Unknown environment was not rejected safely.",
);
assert(
  calls.filter((target) => target.includes("apply_subscription_event")).length ===
    applyEventCallsBefore,
  "Unknown environment event reached the entitlement RPC.",
);

// A second delivery while the first worker still owns the processing lease
// must remain retryable; only a processed duplicate should be acknowledged.
const inFlightBody = JSON.stringify({
  event: {
    event_timestamp_ms: Date.now(),
    transferred_from: [sourceUserId],
    transferred_to: [destinationUserId],
    type: "TRANSFER",
    environment: "PRODUCTION",
    id: "32345678-1234-1234-1234-123456789012",
  },
  api_version: "1.0",
});
const inFlightTimestamp = Math.floor(Date.now() / 1000);
const inFlightSignature = createHmac("sha256", secret)
  .update(`${inFlightTimestamp}.${inFlightBody}`)
  .digest("hex");
claimResult = [{ claimed: false, already_processed: false, processing_token: null }];
const inFlightResponse = await handler(
  new Request("https://project.supabase.co/functions/v1/revenuecat-webhook", {
    method: "POST",
    headers: { "x-revenuecat-webhook-signature": `t=${inFlightTimestamp},v1=${inFlightSignature}` },
    body: inFlightBody,
  }),
);
assert(inFlightResponse.status === 409, "In-flight billing event was not made retryable.");
assert(inFlightResponse.headers.get("retry-after") === "10", "Retry window was not advertised.");

claimResult = [{ claimed: false, already_processed: true, processing_token: null }];
const processedDuplicateResponse = await handler(
  new Request("https://project.supabase.co/functions/v1/revenuecat-webhook", {
    method: "POST",
    headers: { "x-revenuecat-webhook-signature": `t=${inFlightTimestamp},v1=${inFlightSignature}` },
    body: inFlightBody,
  }),
);
assert(
  processedDuplicateResponse.status === 200,
  "Processed billing duplicate was not acknowledged.",
);

// Authentication failures should not be returned as generic 500 errors or
// released to RevenueCat as retryable processing failures.
const invalidSignatureResponse = await handler(
  new Request("https://project.supabase.co/functions/v1/revenuecat-webhook", {
    method: "POST",
    headers: { "x-revenuecat-webhook-signature": "t=now,v1=invalid" },
    body: inFlightBody,
  }),
);
assert(
  invalidSignatureResponse.status === 401,
  "Invalid webhook signature was not rejected with 401.",
);

const staleTimestamp = Math.floor(Date.now() / 1000) - 10_000;
const staleSignature = createHmac("sha256", secret)
  .update(`${staleTimestamp}.${inFlightBody}`)
  .digest("hex");
const staleResponse = await handler(
  new Request("https://project.supabase.co/functions/v1/revenuecat-webhook", {
    method: "POST",
    headers: { "x-revenuecat-webhook-signature": `t=${staleTimestamp},v1=${staleSignature}` },
    body: inFlightBody,
  }),
);
assert(staleResponse.status === 401, "Stale webhook signature was not rejected with 401.");

console.log("RevenueCat transfer runtime check passed.");

function assert(condition, message) {
  if (!condition) fail(message);
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

async function signedWebhook(body) {
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = createHmac("sha256", secret).update(`${timestamp}.${body}`).digest("hex");
  return handler(
    new Request("https://project.supabase.co/functions/v1/revenuecat-webhook", {
      method: "POST",
      headers: { "x-revenuecat-webhook-signature": `t=${timestamp},v1=${signature}` },
      body,
    }),
  );
}
