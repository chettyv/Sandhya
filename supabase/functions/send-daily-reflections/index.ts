import { reportBackendError } from "../_shared/observability.ts";
import { fetchWithTimeout } from "../_shared/http.ts";
import {
  groupNotificationRecipients,
  type DueNotificationRecipient,
} from "../_shared/notification-grouping.ts";

export {};

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";
const EXPO_RECEIPTS_URL = "https://exp.host/--/api/v2/push/getReceipts";
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

Deno.serve(async (request) => {
  if (request.method !== "POST")
    return jsonResponse({ error: "Method not allowed", code: "method_not_allowed" }, 405);
  const cronSecret = Deno.env.get("DAILY_REFLECTIONS_CRON_SECRET")?.trim();
  if (!cronSecret || request.headers.get("x-cron-secret") !== cronSecret) {
    return jsonResponse({ error: "Unauthorized", code: "unauthorized" }, 401);
  }
  const expoAccessToken = Deno.env.get("EXPO_ACCESS_TOKEN")?.trim();
  if (!expoAccessToken)
    return jsonResponse({ error: "Push delivery is not configured.", code: "not_configured" }, 503);
  try {
    const env = readEnv();
    await processPendingPushReceipts(env, expoAccessToken).catch(() => {
      // Receipt polling must not prevent a new daily delivery window from
      // being claimed. The ticket remains retryable when polling fails.
      console.warn("Could not process pending Expo push receipts.");
    });
    const due = await rest<DueNotificationRecipient[]>(
      env,
      "/rpc/get_due_daily_reflection_recipients",
      {
        method: "POST",
        body: JSON.stringify({ p_now: new Date().toISOString(), p_limit: 500 }),
      },
    );
    const recipients = groupNotificationRecipients(due);
    const reflections = await loadReflectionsBySlot(env, [
      ...new Set(recipients.map((recipient) => recipient.date_slot)),
    ]);
    let sent = 0;
    let skipped = 0;
    for (const recipient of recipients) {
      let deliveryClaimToken: string | null = null;
      try {
        const content = reflections.get(recipient.date_slot);
        if (!content) {
          skipped += 1;
          continue;
        }
        const claim = await rest<unknown>(env, "/rpc/claim_notification_delivery_fenced", {
          method: "POST",
          body: JSON.stringify({
            p_user_id: recipient.user_id,
            p_delivery_date: recipient.local_date,
            p_kind: "daily_reflection",
          }),
        });
        const parsedClaim = parseDeliveryClaim(claim);
        if (!parsedClaim.claimed || !parsedClaim.claimToken) {
          skipped += 1;
          continue;
        }
        deliveryClaimToken = parsedClaim.claimToken;

        let delivered = false;
        let lastError = "push_request_failed";
        for (const token of recipient.expo_push_tokens) {
          const push = await sendPushNotification(
            expoAccessToken,
            token,
            content,
            recipient.local_date,
          );
          if (push.ok) {
            delivered = true;
            await rest(env, "/rpc/record_notification_push_ticket", {
              method: "POST",
              body: JSON.stringify({
                p_ticket_id: push.ticketId,
                p_user_id: recipient.user_id,
                p_expo_push_token: token,
                p_delivery_date: recipient.local_date,
                p_kind: "daily_reflection",
              }),
            });
            continue;
          }
          lastError = push.error;
          if (push.error === "DeviceNotRegistered") await disablePushToken(env, token);
        }
        if (!delivered) {
          await releaseDelivery(env, recipient, deliveryClaimToken, lastError);
          skipped += 1;
          continue;
        }
        const recorded = await rest<unknown>(env, "/rpc/record_notification_delivery_fenced", {
          method: "POST",
          body: JSON.stringify({
            p_user_id: recipient.user_id,
            p_delivery_date: recipient.local_date,
            p_kind: "daily_reflection",
            p_claim_token: deliveryClaimToken,
          }),
        });
        if (!rpcBoolean(recorded)) {
          throw new Error("Notification delivery could not be recorded.");
        }
        sent += 1;
      } catch (error) {
        await releaseDelivery(
          env,
          recipient,
          deliveryClaimToken,
          error instanceof Error ? error.message : "notification_recipient_failed",
        );
        skipped += 1;
        console.warn("Skipping one failed notification recipient.");
      }
    }
    return jsonResponse({ sent, skipped }, 200);
  } catch (error) {
    await reportBackendError({ functionName: "send-daily-reflections", error });
    console.error("daily reflection delivery failed");
    return jsonResponse(
      { error: "Daily reflection delivery failed.", code: "delivery_failed" },
      500,
    );
  }
});

async function loadReflectionsBySlot(
  env: { url: string; key: string },
  dateSlots: number[],
): Promise<Map<number, { title: string; reflection_text: string }>> {
  const result = new Map<number, { title: string; reflection_text: string }>();
  if (dateSlots.length === 0) return result;

  const validSlots = [...new Set(dateSlots)].filter(
    (slot) => Number.isInteger(slot) && slot >= 1 && slot <= 366,
  );
  if (validSlots.length === 0) return result;

  const rows = await rest<
    Array<{ date_slot: number; title: string; reflection_text: string; tradition: string }>
  >(
    env,
    `/daily_reflections?date_slot=in.(${validSlots.join(",")})&is_premium=eq.false&select=date_slot,title,reflection_text,tradition`,
    { method: "GET" },
  );

  // Prefer the general reflection when more than one tradition is available;
  // this keeps the worker's current recipient contract unchanged while still
  // avoiding one database request per device.
  for (const row of rows) {
    setPreferredReflection(result, row);
  }

  const missingSlots = validSlots.filter((slot) => !result.has(slot));
  if (missingSlots.length > 0) {
    // The v1 authored catalog intentionally contains 30 rotating reflections,
    // while the schema allows 366 date slots. Keep daily delivery reliable
    // during that sparse-catalog period without inventing or generating copy:
    // reuse only approved, free, database-backed reflections.
    const fallbackRows = await rest<
      Array<{ date_slot: number; title: string; reflection_text: string; tradition: string }>
    >(
      env,
      "/daily_reflections?is_premium=eq.false&select=date_slot,title,reflection_text,tradition&order=date_slot.asc&limit=1000",
      { method: "GET" },
    );
    const fallbackBySlot = new Map<
      number,
      { title: string; reflection_text: string; tradition: string }
    >();
    for (const row of fallbackRows) {
      if (Number.isInteger(row.date_slot) && row.date_slot >= 1 && row.date_slot <= 366) {
        setPreferredReflection(fallbackBySlot, row);
      }
    }
    const availableSlots = [...fallbackBySlot.keys()].sort((left, right) => left - right);
    if (availableSlots.length === 0) return result;
    for (const slot of missingSlots) {
      const fallbackSlot = availableSlots[(slot - 1) % availableSlots.length];
      const fallback = fallbackBySlot.get(fallbackSlot);
      if (fallback) result.set(slot, fallback);
    }
  }
  return result;
}

function setPreferredReflection(
  result: Map<number, { title: string; reflection_text: string }>,
  row: { date_slot: number; title: string; reflection_text: string; tradition: string },
): void {
  if (!result.has(row.date_slot) || row.tradition === "general") {
    result.set(row.date_slot, {
      title: row.title,
      reflection_text: row.reflection_text,
    });
  }
}

async function sendPushNotification(
  expoAccessToken: string,
  token: string,
  content: { title: string; reflection_text: string },
  localDate: string,
): Promise<{ ok: true; ticketId: string } | { ok: false; error: string }> {
  try {
    const response = await fetchWithTimeout(EXPO_PUSH_URL, {
      method: "POST",
      headers: { authorization: `Bearer ${expoAccessToken}`, "content-type": "application/json" },
      body: JSON.stringify({
        to: token,
        title: content.title,
        body: content.reflection_text.slice(0, 180),
        channelId: "daily-reflections",
        data: { type: "daily_reflection", date: localDate },
      }),
    });
    const result = (await response.json().catch(() => null)) as {
      data?:
        | Array<{ status?: string; id?: string; details?: { error?: string } }>
        | { status?: string; id?: string; details?: { error?: string } };
    } | null;
    const ticket = Array.isArray(result?.data) ? result.data[0] : result?.data;
    if (!response.ok || ticket?.status !== "ok" || typeof ticket?.id !== "string") {
      return { ok: false, error: ticket?.details?.error ?? `expo_http_${response.status}` };
    }
    return { ok: true, ticketId: ticket.id };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.name : "push_request_failed" };
  }
}

type PendingPushTicket = {
  id: string;
  ticket_id: string;
  user_id: string;
  expo_push_token: string;
  delivery_date: string;
  kind: string;
  claim_token: string;
};

type ExpoReceipt = {
  status?: string;
  message?: string;
  details?: { error?: string };
};

async function processPendingPushReceipts(
  env: { url: string; key: string },
  expoAccessToken: string,
): Promise<void> {
  const tickets = await rest<PendingPushTicket[]>(
    env,
    "/rpc/claim_notification_push_tickets_fenced",
    {
      method: "POST",
      body: JSON.stringify({ p_now: new Date().toISOString(), p_limit: 1000 }),
    },
  );
  if (!tickets.length) return;

  if (tickets.some((ticket) => !UUID_PATTERN.test(ticket.claim_token))) {
    throw new Error("Receipt claim response did not include valid fencing tokens.");
  }

  const receiptResponse = await fetchWithTimeout(EXPO_RECEIPTS_URL, {
    method: "POST",
    headers: { authorization: `Bearer ${expoAccessToken}`, "content-type": "application/json" },
    body: JSON.stringify({ ids: tickets.map((ticket) => ticket.ticket_id).slice(0, 1000) }),
  });
  const payload = (await receiptResponse.json().catch(() => null)) as {
    data?: Record<string, ExpoReceipt>;
  } | null;
  if (!receiptResponse.ok || !payload?.data || typeof payload.data !== "object") {
    throw new Error(`Expo receipt request failed: ${receiptResponse.status}`);
  }

  for (const ticket of tickets) {
    const receipt = payload.data[ticket.ticket_id];
    if (!receipt) {
      await rest(env, "/rpc/release_notification_push_ticket_fenced", {
        method: "POST",
        body: JSON.stringify({
          p_ticket_id: ticket.id,
          p_claim_token: ticket.claim_token,
          p_error: "receipt_not_ready",
        }),
      });
      continue;
    }

    const receiptError = receipt.details?.error ?? receipt.message ?? "expo_receipt_error";
    await rest(env, "/rpc/record_notification_push_receipt_fenced", {
      method: "POST",
      body: JSON.stringify({
        p_ticket_id: ticket.id,
        p_claim_token: ticket.claim_token,
        p_status: receipt.status === "ok" ? "ok" : "error",
        p_error: receipt.status === "ok" ? null : receiptError,
      }),
    });
    if (receipt.status !== "ok" && receipt.details?.error === "DeviceNotRegistered") {
      await disablePushToken(env, ticket.expo_push_token);
    }
  }
}

async function disablePushToken(env: { url: string; key: string }, token: string): Promise<void> {
  try {
    await rest(env, `/device_push_tokens?expo_push_token=eq.${encodeURIComponent(token)}`, {
      method: "PATCH",
      body: JSON.stringify({ enabled: false, updated_at: new Date().toISOString() }),
    });
  } catch {
    console.warn("Could not disable an invalid push token.");
  }
}

async function releaseDelivery(
  env: { url: string; key: string },
  recipient: { user_id: string; local_date: string },
  claimToken: string | null,
  error: string,
): Promise<void> {
  if (!claimToken) return;
  try {
    await rest(env, "/rpc/release_notification_delivery_fenced", {
      method: "POST",
      body: JSON.stringify({
        p_user_id: recipient.user_id,
        p_delivery_date: recipient.local_date,
        p_kind: "daily_reflection",
        p_claim_token: claimToken,
        p_error: error,
      }),
    });
  } catch {
    console.warn("Could not release notification delivery claim.");
  }
}

function rpcBoolean(value: unknown): boolean {
  if (value === true) return true;
  if (Array.isArray(value)) return value[0] === true || rpcBoolean(value[0]);
  if (value && typeof value === "object") {
    const row = value as { claimed?: unknown; recorded?: unknown };
    return row.claimed === true || row.recorded === true;
  }
  return false;
}

function parseDeliveryClaim(value: unknown): { claimed: boolean; claimToken: string | null } {
  const row = Array.isArray(value) ? value[0] : value;
  if (!row || typeof row !== "object") return { claimed: false, claimToken: null };
  const record = row as { claimed?: unknown; claim_token?: unknown };
  const claimToken =
    typeof record.claim_token === "string" && UUID_PATTERN.test(record.claim_token)
      ? record.claim_token
      : null;
  return { claimed: record.claimed === true && claimToken !== null, claimToken };
}

function readEnv() {
  const url = Deno.env.get("SUPABASE_URL")?.trim();
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")?.trim();
  if (!url || !key) throw new Error("Missing Supabase notification environment.");
  return { url, key };
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

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "cache-control": "no-store, private",
      pragma: "no-cache",
      "content-type": "application/json",
    },
  });
}
