import { reportBackendError } from "../_shared/observability.ts";
import { fetchWithTimeout } from "../_shared/http.ts";

export {};

const CORS_HEADERS = { "content-type": "application/json" };
const ACTIVE_EVENTS = new Set([
  "INITIAL_PURCHASE",
  "RENEWAL",
  "NON_RENEWING_PURCHASE",
  "PRODUCT_CHANGE",
  "UNCANCELLATION",
  "SUBSCRIPTION_EXTENDED",
  "SUBSCRIPTION_PAUSED",
  "REFUND_REVERSED",
]);
// RevenueCat temporary grants intentionally omit the product, environment,
// and lifecycle fields needed to establish durable entitlement state. Accept
// them without changing access; the subsequent purchase/expiration event is
// the authoritative reconciliation point.
const ACKNOWLEDGED_ONLY_EVENTS = new Set(["TEMPORARY_ENTITLEMENT_GRANT"]);
const HANDLED_EVENTS = new Set([
  ...ACTIVE_EVENTS,
  ...ACKNOWLEDGED_ONLY_EVENTS,
  "CANCELLATION",
  "EXPIRATION",
  "REFUND",
  "BILLING_ISSUE",
  "TRANSFER",
]);
const MAX_REQUEST_BODY_CHARS = 256_000;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

class WebhookAuthenticationError extends Error {}

Deno.serve(async (request) => {
  if (request.method !== "POST")
    return jsonResponse({ error: "Method not allowed", code: "method_not_allowed" }, 405);
  let claimedEventId: string | null = null;
  let claimedProcessingToken: string | null = null;
  let billingEnvironment: { url: string; key: string; allowSandbox: boolean } | null = null;
  try {
    const contentLength = Number(request.headers.get("content-length"));
    if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BODY_CHARS) {
      return jsonResponse({ error: "Request body is too large.", code: "request_too_large" }, 413);
    }
    const rawBody = await request.text();
    if (rawBody.length > MAX_REQUEST_BODY_CHARS) {
      return jsonResponse({ error: "Request body is too large.", code: "request_too_large" }, 413);
    }
    await verifyWebhook(request.headers.get("x-revenuecat-webhook-signature"), rawBody);
    let payload: { event?: Record<string, unknown> };
    try {
      payload = JSON.parse(rawBody) as { event?: Record<string, unknown> };
    } catch {
      return jsonResponse({ error: "Valid JSON is required.", code: "bad_request" }, 400);
    }
    const event = payload.event;
    if (!event || typeof event.id !== "string" || typeof event.type !== "string") {
      return jsonResponse({ error: "Invalid RevenueCat event.", code: "bad_request" }, 400);
    }
    const env = readEnv();
    billingEnvironment = env;
    const eventType = String(event.type).toUpperCase();
    let appUserId = typeof event.app_user_id === "string" ? event.app_user_id.trim() : "";
    let userId = appUserId.startsWith("supabase:")
      ? appUserId.slice("supabase:".length)
      : appUserId;
    if (!HANDLED_EVENTS.has(eventType)) {
      // Paywall, experiment, and future event types do not establish
      // entitlement state. Acknowledge them without changing access.
      return jsonResponse({ received: true, ignored: true }, 200);
    }
    const environment =
      typeof event.environment === "string" && ["PRODUCTION", "SANDBOX"].includes(event.environment)
        ? event.environment
        : "UNKNOWN";
    if (environment === "SANDBOX" && !env.allowSandbox) {
      return jsonResponse({ received: true, ignored: true, reason: "sandbox_disabled" }, 200);
    }
    if (environment === "UNKNOWN" && eventType !== "TRANSFER") {
      // Do not mutate entitlement state when a lifecycle payload does not
      // identify its store environment. A signed but malformed event must not
      // become an implicit production grant or downgrade.
      return jsonResponse({ received: true, ignored: true, reason: "unknown_environment" }, 200);
    }
    if (eventType === "TRANSFER") {
      const transferredFrom = parseTransferUserIds(event.transferred_from);
      const transferredTo = parseTransferUserIds(event.transferred_to);
      if (transferredTo.length !== 1) {
        return jsonResponse(
          {
            error: "RevenueCat transfer must have exactly one Dharma Daily destination.",
            code: "bad_request",
          },
          400,
        );
      }
      userId = transferredTo[0];
      if (
        appUserId &&
        UUID_PATTERN.test(userId) &&
        appUserId.replace(/^supabase:/, "") !== userId
      ) {
        return jsonResponse(
          { error: "Invalid RevenueCat transfer destination.", code: "bad_request" },
          400,
        );
      }
      if (!appUserId) appUserId = `supabase:${userId}`;
      const claim = await claimBillingEvent(env, {
        eventId: event.id,
        eventType,
        appUserId,
        environment,
      });
      if (!claim.claimed) return claimResponse(claim);
      claimedEventId = event.id;
      claimedProcessingToken = claim.processingToken;
      // TRANSFER payloads can omit environment. Reconcile ownership in that
      // case, but keep the destination free until a known-environment
      // lifecycle event proves the entitlement. This prevents an ambiguous
      // transfer from leaving the source entitled or granting the destination.
      const destination =
        environment === "UNKNOWN"
          ? {
              entitlementId: null,
              productId: null,
              plan: "free" as const,
              status: "free" as const,
              expiresAt: null,
            }
          : await loadRevenueCatSubscriberState(env, appUserId);
      await rest(env, "/rpc/apply_subscription_transfer", {
        method: "POST",
        body: JSON.stringify({
          p_destination_user_id: userId,
          p_destination_revenuecat_app_user_id: appUserId,
          p_source_user_ids: transferredFrom.filter((sourceId) => sourceId !== userId),
          p_entitlement_id: destination.entitlementId,
          p_product_id: destination.productId,
          p_plan: destination.plan,
          p_status: destination.status,
          p_environment: environment,
          p_expires_at: destination.expiresAt,
          p_event_id: event.id,
          p_latest_event_at: toIsoDate(event.event_timestamp_ms) ?? new Date().toISOString(),
        }),
      });
      await markBillingEventProcessed(env, event.id, claim.processingToken);
      return jsonResponse(
        {
          received: true,
          transferred_from: transferredFrom.length,
          destination_plan: destination.plan,
          ...(environment === "UNKNOWN" ? { reason: "unknown_environment" } : {}),
        },
        200,
      );
    }
    if (!UUID_PATTERN.test(userId)) {
      return jsonResponse({ error: "Invalid app user id.", code: "bad_request" }, 400);
    }
    if (ACKNOWLEDGED_ONLY_EVENTS.has(eventType)) {
      const claim = await claimBillingEvent(env, {
        eventId: event.id,
        eventType,
        appUserId,
        environment,
      });
      if (!claim.claimed) return claimResponse(claim);
      claimedEventId = event.id;
      claimedProcessingToken = claim.processingToken;
      await markBillingEventProcessed(env, event.id, claim.processingToken);
      return jsonResponse(
        {
          received: true,
          ignored: true,
          reason: "temporary_entitlement_grant_requires_followup_event",
        },
        200,
      );
    }
    const productId = typeof event.product_id === "string" ? event.product_id : null;
    const eventExpiresAt = toIsoDate(event.expiration_at_ms);
    const inferredPlan = inferPlan(productId);
    const needsExistingState =
      !inferredPlan ||
      (!eventExpiresAt && (eventType === "CANCELLATION" || eventType === "BILLING_ISSUE"));
    const existingState = needsExistingState
      ? await loadCurrentBillingState(env, userId)
      : { plan: "free" as const, expiresAt: null };
    if (!inferredPlan && ACTIVE_EVENTS.has(eventType)) {
      return jsonResponse({ received: true, ignored: true, reason: "unknown_product" }, 200);
    }
    const plan = inferredPlan ?? existingState.plan;
    const expiresAt =
      eventExpiresAt ??
      (eventType === "CANCELLATION" || eventType === "BILLING_ISSUE"
        ? existingState.expiresAt
        : null);
    const terminal = new Set(["EXPIRATION", "REFUND"]);
    const active =
      ACTIVE_EVENTS.has(eventType) ||
      (eventType === "CANCELLATION" &&
        Boolean(expiresAt) &&
        new Date(expiresAt!).getTime() > Date.now());
    const status = terminal.has(eventType)
      ? eventType === "REFUND"
        ? "refunded"
        : "expired"
      : eventType === "CANCELLATION"
        ? "cancelled"
        : eventType === "BILLING_ISSUE"
          ? "billing_issue"
          : active
            ? "active"
            : "billing_issue";
    const hasFutureExpiry = Boolean(expiresAt && new Date(expiresAt).getTime() > Date.now());
    const effectivePlan =
      environment === "UNKNOWN"
        ? "free"
        : (plan === "lifetime" && ["active", "billing_issue", "cancelled"].includes(status)) ||
            (plan !== "lifetime" &&
              ["active", "billing_issue", "cancelled"].includes(status) &&
              hasFutureExpiry)
          ? plan
          : "free";

    const claim = await claimBillingEvent(env, {
      eventId: event.id,
      eventType,
      appUserId,
      environment,
    });
    if (!claim.claimed) return claimResponse(claim);
    claimedEventId = event.id;
    claimedProcessingToken = claim.processingToken;
    await rest(env, "/rpc/apply_subscription_event", {
      method: "POST",
      body: JSON.stringify({
        p_user_id: userId,
        p_revenuecat_app_user_id: appUserId,
        p_entitlement_id:
          typeof event.entitlement_id === "string"
            ? event.entitlement_id
            : Array.isArray(event.entitlement_ids) && typeof event.entitlement_ids[0] === "string"
              ? event.entitlement_ids[0]
              : null,
        p_product_id: productId,
        p_plan: effectivePlan,
        p_status: status,
        p_environment: environment,
        p_expires_at: expiresAt,
        p_event_id: event.id,
        p_latest_event_at: toIsoDate(event.event_timestamp_ms) ?? new Date().toISOString(),
      }),
    });
    await markBillingEventProcessed(env, event.id, claim.processingToken);
    return jsonResponse({ received: true }, 200);
  } catch (error) {
    if (error instanceof WebhookAuthenticationError) {
      return jsonResponse({ error: "Unauthorized", code: "unauthorized" }, 401);
    }
    if (claimedEventId && claimedProcessingToken && billingEnvironment) {
      await releaseBillingEvent(
        billingEnvironment,
        claimedEventId,
        claimedProcessingToken,
        error,
      ).catch(() => undefined);
    }
    await reportBackendError({ functionName: "revenuecat-webhook", error });
    console.error("RevenueCat webhook operation failed");
    return jsonResponse({ error: "Webhook processing failed.", code: "webhook_failed" }, 500);
  }
});

async function releaseBillingEvent(
  env: { url: string; key: string },
  eventId: string,
  processingToken: string,
  error: unknown,
): Promise<void> {
  await rest(
    env,
    `/billing_events?event_id=eq.${encodeURIComponent(eventId)}&processing_token=eq.${encodeURIComponent(processingToken)}&processed_at=is.null`,
    {
      method: "PATCH",
      body: JSON.stringify({
        processing_started_at: new Date(Date.now() - 11 * 60 * 1000).toISOString(),
        processing_token: null,
        processing_error: error instanceof Error ? error.message.slice(0, 500) : "webhook_failed",
      }),
    },
  );
}

async function claimBillingEvent(
  env: { url: string; key: string },
  input: { eventId: string; eventType: string; appUserId: string; environment: string },
): Promise<{ claimed: boolean; alreadyProcessed: boolean; processingToken: string | null }> {
  const claimed = await rest<
    Array<{ claimed?: unknown; already_processed?: unknown; processing_token?: unknown }>
  >(env, "/rpc/claim_billing_event", {
    method: "POST",
    body: JSON.stringify({
      p_event_id: input.eventId,
      p_event_type: input.eventType,
      p_app_user_id: input.appUserId,
      p_environment: input.environment,
    }),
  });
  const processingToken =
    typeof claimed[0]?.processing_token === "string" &&
    UUID_PATTERN.test(claimed[0].processing_token)
      ? claimed[0].processing_token
      : null;
  return {
    claimed: claimed[0]?.claimed === true && processingToken !== null,
    alreadyProcessed: claimed[0]?.already_processed === true,
    processingToken,
  };
}

function claimResponse(claim: { alreadyProcessed: boolean }): Response {
  if (claim.alreadyProcessed) return jsonResponse({ received: true, duplicate: true }, 200);
  return jsonResponse({ received: false, retry: true, code: "billing_event_in_progress" }, 409, {
    "retry-after": "10",
  });
}

async function markBillingEventProcessed(
  env: { url: string; key: string },
  eventId: string,
  processingToken: string | null,
): Promise<void> {
  if (!processingToken) throw new Error("Billing event processing lease token is missing.");
  const completed = await rest<Array<{ complete_billing_event?: unknown }>>(
    env,
    "/rpc/complete_billing_event",
    {
      method: "POST",
      body: JSON.stringify({
        p_event_id: eventId,
        p_processing_token: processingToken,
      }),
    },
  );
  if (completed[0]?.complete_billing_event !== true) {
    throw new Error("Billing event processing lease was lost before completion.");
  }
}

function readEnv() {
  const value = (name: string) => Deno.env.get(name)?.trim() ?? "";
  if (!value("SUPABASE_URL") || !value("SUPABASE_SERVICE_ROLE_KEY"))
    throw new Error("Missing Supabase webhook environment.");
  return {
    url: value("SUPABASE_URL"),
    key: value("SUPABASE_SERVICE_ROLE_KEY"),
    allowSandbox: value("REVENUECAT_ALLOW_SANDBOX").toLowerCase() === "true",
    revenueCatApiKey: value("REVENUECAT_API_KEY"),
  };
}

function parseTransferUserIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return [
    ...new Set(
      value.flatMap((entry) => {
        if (typeof entry !== "string") return [];
        const normalized = entry.startsWith("supabase:") ? entry.slice("supabase:".length) : entry;
        return UUID_PATTERN.test(normalized) ? [normalized.toLowerCase()] : [];
      }),
    ),
  ];
}

async function loadRevenueCatSubscriberState(
  env: { revenueCatApiKey: string },
  appUserId: string,
): Promise<{
  entitlementId: string | null;
  productId: string | null;
  plan: "free" | "plus_monthly" | "plus_annual" | "lifetime";
  status: "active" | "free";
  expiresAt: string | null;
}> {
  if (!env.revenueCatApiKey)
    throw new Error("Missing RevenueCat API key for transfer reconciliation.");
  const response = await fetchWithTimeout(
    `https://api.revenuecat.com/v1/subscribers/${encodeURIComponent(appUserId)}`,
    {
      method: "GET",
      headers: { authorization: `Bearer ${env.revenueCatApiKey}`, accept: "application/json" },
    },
  );
  if (!response.ok) throw new Error(`RevenueCat subscriber lookup failed: ${response.status}`);
  const payload = (await response.json()) as {
    subscriber?: {
      entitlements?: Record<string, { expires_date?: unknown; product_identifier?: unknown }>;
    };
  };
  const active = Object.entries(payload.subscriber?.entitlements ?? {})
    .map(([entitlementId, entitlement]) => ({
      entitlementId,
      productId:
        typeof entitlement?.product_identifier === "string" ? entitlement.product_identifier : null,
      expiresAt: typeof entitlement?.expires_date === "string" ? entitlement.expires_date : null,
    }))
    .filter(
      (entitlement) =>
        !entitlement.expiresAt || new Date(entitlement.expiresAt).getTime() > Date.now(),
    )
    .sort((left, right) => {
      if (!left.expiresAt) return -1;
      if (!right.expiresAt) return 1;
      return new Date(right.expiresAt).getTime() - new Date(left.expiresAt).getTime();
    })[0];
  if (!active)
    return { entitlementId: null, productId: null, plan: "free", status: "free", expiresAt: null };
  const plan = inferPlan(active.productId);
  if (!plan)
    throw new Error(`Unknown transferred RevenueCat product: ${active.productId ?? "missing"}`);
  return { ...active, plan, status: "active" };
}

async function verifyWebhook(signature: string | null, body: string): Promise<void> {
  const secret = Deno.env.get("REVENUECAT_WEBHOOK_SECRET")?.trim();
  if (!secret) throw new Error("Missing RevenueCat webhook signature configuration.");
  if (!signature) throw new WebhookAuthenticationError("Missing RevenueCat webhook signature.");
  const fields = Object.fromEntries(signature.split(",").map((part) => part.split("=", 2))) as {
    t?: string;
    v1?: string;
  };
  const timestamp = Number(fields.t);
  const toleranceSeconds = Number(Deno.env.get("REVENUECAT_WEBHOOK_TOLERANCE_SECONDS") ?? "300");
  if (!Number.isFinite(toleranceSeconds) || toleranceSeconds <= 0) {
    throw new Error("Invalid RevenueCat webhook tolerance configuration.");
  }
  if (!Number.isFinite(timestamp) || Math.abs(Date.now() / 1000 - timestamp) > toleranceSeconds)
    throw new WebhookAuthenticationError("Stale webhook signature.");
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"],
  );
  let signatureBytes: Uint8Array;
  try {
    signatureBytes = hexToBytes(fields.v1 ?? "");
  } catch {
    throw new WebhookAuthenticationError("Invalid webhook signature encoding.");
  }
  const signatureBuffer = new ArrayBuffer(signatureBytes.byteLength);
  new Uint8Array(signatureBuffer).set(signatureBytes);
  const valid = await crypto.subtle.verify(
    "HMAC",
    key,
    signatureBuffer,
    new TextEncoder().encode(`${timestamp}.${body}`),
  );
  if (!valid) throw new WebhookAuthenticationError("Invalid RevenueCat webhook signature.");
}

function hexToBytes(value: string): Uint8Array {
  if (!/^[0-9a-f]{64}$/i.test(value)) throw new Error("Invalid webhook signature encoding.");
  return new Uint8Array(value.match(/.{2}/g)!.map((byte) => Number.parseInt(byte, 16)));
}

function inferPlan(productId: string | null): "plus_monthly" | "plus_annual" | "lifetime" | null {
  const value = (productId ?? "").toLowerCase();
  if (!value) return null;
  if (value.includes("lifetime")) return "lifetime";
  if (value.includes("annual") || value.includes("year")) return "plus_annual";
  if (value.includes("monthly") || value.includes("month")) return "plus_monthly";
  return null;
}

async function loadCurrentBillingState(
  env: { url: string; key: string },
  userId: string,
): Promise<{
  plan: "free" | "plus_monthly" | "plus_annual" | "lifetime";
  expiresAt: string | null;
}> {
  const rows = await rest<Array<{ plan?: unknown; expires_at?: unknown }>>(
    env,
    `/subscription_status?user_id=eq.${encodeURIComponent(userId)}&select=plan,expires_at`,
    { method: "GET" },
  );
  const plan = rows[0]?.plan;
  return {
    plan: plan === "plus_monthly" || plan === "plus_annual" || plan === "lifetime" ? plan : "free",
    expiresAt: typeof rows[0]?.expires_at === "string" ? rows[0].expires_at : null,
  };
}

function toIsoDate(value: unknown): string | null {
  const milliseconds =
    typeof value === "number"
      ? value
      : typeof value === "string" && value.trim()
        ? Number(value)
        : NaN;
  if (!Number.isFinite(milliseconds) || milliseconds <= 0) return null;
  const date = new Date(milliseconds);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

async function rest<T>(
  env: { url: string; key: string },
  path: string,
  init: RequestInit,
): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("apikey", env.key);
  headers.set("authorization", `Bearer ${env.key}`);
  if (init.body && !headers.has("content-type")) headers.set("content-type", "application/json");
  const response = await fetchWithTimeout(`${env.url}/rest/v1${path}`, { ...init, headers });
  if (!response.ok) throw new Error(`Supabase REST request failed: ${response.status}`);
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

function jsonResponse(
  body: unknown,
  status: number,
  extraHeaders: Record<string, string> = {},
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...CORS_HEADERS,
      "cache-control": "no-store, private",
      pragma: "no-cache",
      ...extraHeaders,
    },
  });
}
