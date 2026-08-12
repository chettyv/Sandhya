import { reportBackendError } from "../_shared/observability.ts";
import { fetchWithTimeout } from "../_shared/http.ts";

export {};

const CORS_HEADERS = {
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "authorization, x-client-info, apikey, content-type",
  "access-control-allow-methods": "GET, POST, OPTIONS",
  "access-control-expose-headers": "content-disposition",
};

const DELETE_CONFIRMATION = "DELETE";
const MAX_REQUEST_BODY_CHARS = 1_024;
const EXPORT_PAGE_SIZE = 1_000;
const MAX_EXPORT_ROWS_PER_COLLECTION = 100_000;
const MAX_EXPORT_BYTES = 25 * 1024 * 1024;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return jsonResponse({}, 200);
  }
  if (request.method !== "GET" && request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed", code: "method_not_allowed" }, 405);
  }

  try {
    const authorization = request.headers.get("authorization");
    if (!authorization?.startsWith("Bearer ")) {
      return jsonResponse(
        { error: "Missing Authorization bearer token.", code: "unauthorized" },
        401,
      );
    }

    const supabaseUrl = requiredEnv("SUPABASE_URL");
    const anonKey = requiredEnv("SUPABASE_ANON_KEY");
    const serviceRoleKey = requiredEnv("SUPABASE_SERVICE_ROLE_KEY");
    const userResponse = await fetchWithTimeout(`${supabaseUrl}/auth/v1/user`, {
      headers: { apikey: anonKey, authorization },
    });
    if (!userResponse.ok) {
      return jsonResponse({ error: "Invalid user token.", code: "unauthorized" }, 401);
    }
    const user = (await userResponse.json()) as { id?: string; email?: string };
    const userId = user.id;
    if (!userId || !UUID_PATTERN.test(userId)) {
      return jsonResponse({ error: "User identity is missing.", code: "unauthorized" }, 401);
    }

    if (request.method === "GET") {
      const format = new URL(request.url).searchParams.get("format") ?? "json";
      if (format !== "json") {
        return jsonResponse({ error: "Only JSON export is supported.", code: "bad_request" }, 400);
      }
      const rateLimit = await consumeApiRequestRateLimit(
        supabaseUrl,
        serviceRoleKey,
        userId,
        "account_export",
        3,
        3_600,
      );
      if (!rateLimit.allowed) {
        return jsonResponse(
          {
            error: "Account export rate limit reached. Please try again later.",
            code: "rate_limited",
            retry_after_seconds: rateLimit.retryAfterSeconds,
          },
          429,
          { "retry-after": String(rateLimit.retryAfterSeconds) },
        );
      }
      const exported = await exportAccountData(supabaseUrl, serviceRoleKey, {
        id: userId,
        email: user.email,
      });
      const serialized = JSON.stringify(exported);
      if (new TextEncoder().encode(serialized).byteLength > MAX_EXPORT_BYTES) {
        throw new Error("Account export is too large to return safely.");
      }
      return jsonTextResponse(serialized, 200, {
        "content-disposition": 'attachment; filename="sandhya-account-export.json"',
        "cache-control": "no-store, private",
        pragma: "no-cache",
      });
    }

    const contentLength = Number(request.headers.get("content-length"));
    if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BODY_CHARS) {
      return jsonResponse({ error: "Request body is too large.", code: "request_too_large" }, 413);
    }
    const bodyText = await request.text();
    if (bodyText.length > MAX_REQUEST_BODY_CHARS) {
      return jsonResponse({ error: "Request body is too large.", code: "request_too_large" }, 413);
    }
    let body: Record<string, unknown> | null;
    try {
      body = JSON.parse(bodyText || "null") as Record<string, unknown> | null;
    } catch {
      return jsonResponse({ error: "Valid JSON is required.", code: "bad_request" }, 400);
    }
    if (body?.confirmation !== DELETE_CONFIRMATION) {
      return jsonResponse(
        { error: `confirmation must be ${DELETE_CONFIRMATION}.`, code: "confirmation_required" },
        400,
      );
    }

    const rateLimit = await consumeApiRequestRateLimit(
      supabaseUrl,
      serviceRoleKey,
      userId,
      "account_delete",
      3,
      3_600,
    );
    if (!rateLimit.allowed) {
      return jsonResponse(
        {
          error: "Account deletion rate limit reached. Please try again later.",
          code: "rate_limited",
          retry_after_seconds: rateLimit.retryAfterSeconds,
        },
        429,
        { "retry-after": String(rateLimit.retryAfterSeconds) },
      );
    }

    // billing_events is server-only and has no user FK, so scrub its provider
    // identifiers explicitly before deleting auth.users. Cost records are
    // similarly scrubbed because their optional metadata may contain a
    // message correlation id.
    await deleteBillingEvents(supabaseUrl, serviceRoleKey, userId);
    await deleteCostLog(supabaseUrl, serviceRoleKey, userId);

    const response = await fetchWithTimeout(
      `${supabaseUrl}/auth/v1/admin/users/${encodeURIComponent(userId)}`,
      {
        method: "DELETE",
        headers: { apikey: serviceRoleKey, authorization: `Bearer ${serviceRoleKey}` },
      },
    );
    if (!response.ok) {
      throw new Error(`Supabase account deletion failed: ${response.status}`);
    }

    // A provider retry may have claimed a billing row while the auth deletion
    // was in flight. Scrub again after the auth row is gone; the claim guard
    // prevents future normal lifecycle retries from creating a new row.
    await deleteBillingEvents(supabaseUrl, serviceRoleKey, userId);
    await deleteCostLog(supabaseUrl, serviceRoleKey, userId);

    return jsonResponse({ deleted: true }, 200);
  } catch (error) {
    await reportBackendError({ functionName: "account", error });
    if (request.method === "GET") {
      console.error("account export failed");
      return jsonResponse(
        { error: "Account data export failed.", code: "account_export_failed" },
        500,
      );
    }
    console.error("account deletion failed");
    return jsonResponse(
      { error: "Account deletion failed.", code: "account_deletion_failed" },
      500,
    );
  }
});

async function deleteBillingEvents(
  supabaseUrl: string,
  serviceRoleKey: string,
  userId: string,
): Promise<void> {
  const headers = { apikey: serviceRoleKey, authorization: `Bearer ${serviceRoleKey}` };
  for (const appUserId of [userId, `supabase:${userId}`]) {
    const response = await fetchWithTimeout(
      `${supabaseUrl}/rest/v1/billing_events?app_user_id=eq.${encodeURIComponent(appUserId)}`,
      { method: "DELETE", headers },
    );
    if (!response.ok) throw new Error(`Billing event cleanup failed: ${response.status}`);
  }
}

async function consumeApiRequestRateLimit(
  supabaseUrl: string,
  serviceRoleKey: string,
  userId: string,
  operation: "account_export" | "account_delete",
  maxRequests: number,
  windowSeconds: number,
): Promise<{ allowed: boolean; retryAfterSeconds: number }> {
  const response = await fetchWithTimeout(
    `${supabaseUrl}/rest/v1/rpc/consume_api_request_rate_limit`,
    {
      method: "POST",
      headers: {
        apikey: serviceRoleKey,
        authorization: `Bearer ${serviceRoleKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        p_user_id: userId,
        p_operation: operation,
        p_max_requests: maxRequests,
        p_window_seconds: windowSeconds,
      }),
    },
  );
  if (!response.ok) throw new Error(`Account rate-limit request failed: ${response.status}`);
  const payload = (await response.json()) as unknown;
  const row = Array.isArray(payload) ? payload[0] : payload;
  if (!row || typeof row !== "object") {
    throw new Error("Account rate-limit response was invalid.");
  }
  const value = row as Record<string, unknown>;
  if (typeof value.allowed !== "boolean") {
    throw new Error("Account rate-limit response omitted allowed state.");
  }
  const retryAfterSeconds =
    typeof value.retry_after_seconds === "number" &&
    Number.isInteger(value.retry_after_seconds) &&
    value.retry_after_seconds >= 0
      ? value.retry_after_seconds
      : 0;
  return { allowed: value.allowed, retryAfterSeconds };
}

async function exportAccountData(
  supabaseUrl: string,
  serviceRoleKey: string,
  user: { id: string; email?: string },
): Promise<Record<string, unknown>> {
  const userFilter = encodeURIComponent(user.id);
  const profileRows = await fetchRows<Record<string, unknown>>(
    supabaseUrl,
    serviceRoleKey,
    `/profiles?id=eq.${userFilter}&select=id,display_name,language_pref,tradition_pref,household_practices,location,notification_time,timezone,created_at`,
  );
  const conversations = await fetchRows<Record<string, unknown>>(
    supabaseUrl,
    serviceRoleKey,
    `/conversations?user_id=eq.${userFilter}&select=id,title,created_at,updated_at&order=created_at.asc`,
  );
  const conversationIds = conversations
    .map((conversation) => (typeof conversation.id === "string" ? conversation.id : ""))
    .filter((id) => UUID_PATTERN.test(id));
  const messages = await fetchMessagesForConversations(
    supabaseUrl,
    serviceRoleKey,
    conversationIds,
  );
  const [
    savedItems,
    journalEntries,
    feedback,
    practiceCompletions,
    activityDays,
    deliveries,
    pushTokens,
    subscription,
    quota,
  ] = await Promise.all([
    fetchRows<Record<string, unknown>>(
      supabaseUrl,
      serviceRoleKey,
      `/saved_items?user_id=eq.${userFilter}&select=item_type,item_id,notes,created_at&order=created_at.asc`,
    ),
    fetchRows<Record<string, unknown>>(
      supabaseUrl,
      serviceRoleKey,
      `/journal_entries?user_id=eq.${userFilter}&select=id,date,prompt,entry,mood,created_at&order=created_at.asc`,
    ),
    fetchRows<Record<string, unknown>>(
      supabaseUrl,
      serviceRoleKey,
      `/feedback?user_id=eq.${userFilter}&select=id,message_id,issue_type,notes,status,created_at&order=created_at.asc`,
    ),
    fetchRows<Record<string, unknown>>(
      supabaseUrl,
      serviceRoleKey,
      `/practice_completions?user_id=eq.${userFilter}&select=practice_key,completed_on,created_at&order=completed_on.asc`,
    ),
    fetchRows<Record<string, unknown>>(
      supabaseUrl,
      serviceRoleKey,
      `/activity_days?user_id=eq.${userFilter}&select=activity_date,created_at&order=activity_date.asc`,
    ),
    fetchRows<Record<string, unknown>>(
      supabaseUrl,
      serviceRoleKey,
      `/notification_deliveries?user_id=eq.${userFilter}&select=delivery_date,kind,status,attempt_count,claimed_at,sent_at,last_error,created_at&order=delivery_date.asc`,
    ),
    fetchRows<Record<string, unknown>>(
      supabaseUrl,
      serviceRoleKey,
      `/device_push_tokens?user_id=eq.${userFilter}&select=expo_push_token,platform,app_version,enabled,last_seen_at,created_at,updated_at&order=created_at.asc`,
    ),
    fetchRows<Record<string, unknown>>(
      supabaseUrl,
      serviceRoleKey,
      `/subscription_status?user_id=eq.${userFilter}&select=plan,status,expires_at,product_id,entitlement_id,environment,created_at,updated_at`,
    ),
    fetchRows<Record<string, unknown>>(
      supabaseUrl,
      serviceRoleKey,
      `/usage_quotas?user_id=eq.${userFilter}&select=date,ai_messages_count,plan,updated_at`,
    ),
  ]);

  const collections = {
    conversations,
    messages,
    saved_items: savedItems,
    journal_entries: journalEntries,
    feedback,
    practice_completions: practiceCompletions,
    activity_days: activityDays,
    notification_deliveries: deliveries,
    device_push_tokens: pushTokens,
    subscription_status: subscription,
    usage_quotas: quota,
  };
  const rowCount = Object.values(collections).reduce((total, rows) => total + rows.length, 0);
  if (rowCount > MAX_EXPORT_ROWS_PER_COLLECTION) {
    throw new Error("Account export is too large to generate safely.");
  }

  return {
    schema_version: "1",
    exported_at: new Date().toISOString(),
    account: { id: user.id, email: typeof user.email === "string" ? user.email : null },
    profile: profileRows[0] ?? null,
    data: collections,
  };
}

async function fetchMessagesForConversations(
  supabaseUrl: string,
  serviceRoleKey: string,
  conversationIds: string[],
): Promise<Record<string, unknown>[]> {
  const batches: string[][] = [];
  for (let index = 0; index < conversationIds.length; index += 100) {
    batches.push(conversationIds.slice(index, index + 100));
  }
  const messages: Record<string, unknown>[] = [];
  for (const batch of batches) {
    const ids = batch.map((id) => encodeURIComponent(id)).join(",");
    const rows = await fetchRows<Record<string, unknown>>(
      supabaseUrl,
      serviceRoleKey,
      `/messages?conversation_id=in.(${ids})&select=id,conversation_id,role,content,structured_response,retrieved_passage_ids,model_used,tokens_in,tokens_out,cost_usd,created_at&order=created_at.asc`,
    );
    messages.push(...rows);
    if (messages.length > MAX_EXPORT_ROWS_PER_COLLECTION) {
      throw new Error("Account export is too large to generate safely.");
    }
  }
  return messages;
}

async function fetchRows<T>(
  supabaseUrl: string,
  serviceRoleKey: string,
  path: string,
): Promise<T[]> {
  const rows: T[] = [];
  const headers = {
    apikey: serviceRoleKey,
    authorization: `Bearer ${serviceRoleKey}`,
  };
  for (let offset = 0; ; offset += EXPORT_PAGE_SIZE) {
    const separator = path.includes("?") ? "&" : "?";
    const response = await fetchWithTimeout(
      `${supabaseUrl}/rest/v1${path}${separator}limit=${EXPORT_PAGE_SIZE}&offset=${offset}`,
      { headers },
    );
    if (!response.ok) throw new Error(`Account export request failed: ${response.status}`);
    const page = (await response.json()) as unknown;
    if (!Array.isArray(page)) throw new Error("Account export returned an invalid collection.");
    rows.push(...(page as T[]));
    if (rows.length > MAX_EXPORT_ROWS_PER_COLLECTION || page.length < EXPORT_PAGE_SIZE) break;
  }
  return rows;
}

async function deleteCostLog(
  supabaseUrl: string,
  serviceRoleKey: string,
  userId: string,
): Promise<void> {
  const response = await fetchWithTimeout(
    `${supabaseUrl}/rest/v1/cost_log?user_id=eq.${encodeURIComponent(userId)}`,
    {
      method: "DELETE",
      headers: {
        apikey: serviceRoleKey,
        authorization: `Bearer ${serviceRoleKey}`,
      },
    },
  );
  if (!response.ok) throw new Error(`Cost log cleanup failed: ${response.status}`);
}

function requiredEnv(name: string): string {
  const value = Deno.env.get(name)?.trim();
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

function jsonResponse(
  body: unknown,
  status: number,
  extraHeaders: Record<string, string> = {},
): Response {
  return jsonTextResponse(JSON.stringify(body), status, extraHeaders);
}

function jsonTextResponse(
  body: string,
  status: number,
  extraHeaders: Record<string, string> = {},
): Response {
  return new Response(body, {
    status,
    headers: {
      ...CORS_HEADERS,
      "cache-control": "no-store, private",
      pragma: "no-cache",
      "content-type": "application/json",
      ...extraHeaders,
    },
  });
}
