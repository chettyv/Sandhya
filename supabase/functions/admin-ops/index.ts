import { reportBackendError } from "../_shared/observability.ts";
import { fetchWithTimeout } from "../_shared/http.ts";
import {
  completeAdminAuditEvent,
  completeAdminAuditEventBestEffort,
  startAdminAuditEvent,
} from "../_shared/admin-audit.ts";

export {};

const CORS_HEADERS = {
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "authorization, x-client-info, apikey, content-type",
  "access-control-allow-methods": "GET, DELETE, OPTIONS",
};
const HASH_PATTERN = /^[0-9a-f]{64}$/i;
const MAX_ROWS = 10_000;

type AdminEnv = {
  supabaseUrl: string;
  anonKey: string;
  serviceRoleKey: string;
};

class BadRequestError extends Error {}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return jsonResponse({}, 200);
  if (request.method !== "GET" && request.method !== "DELETE") {
    return jsonResponse({ error: "Method not allowed", code: "method_not_allowed" }, 405);
  }

  try {
    const env = readEnv();
    const authorization = request.headers.get("authorization");
    const admin = await authenticateAdmin(env, authorization);
    if (!admin) return jsonResponse({ error: "Admin access required.", code: "forbidden" }, 403);

    const url = new URL(request.url);
    const resource = url.searchParams.get("resource") ?? "overview";
    if (request.method === "DELETE") {
      if (resource !== "cache" || url.searchParams.get("confirm") !== "INVALIDATE") {
        return jsonResponse(
          {
            error: "Cache deletion requires resource=cache and confirm=INVALIDATE.",
            code: "confirmation_required",
          },
          400,
        );
      }
      const questionHash = url.searchParams.get("question_hash") ?? "";
      if (!HASH_PATTERN.test(questionHash)) {
        return jsonResponse(
          { error: "question_hash must be a SHA-256 hash.", code: "bad_request" },
          400,
        );
      }
      const auditId = await startAdminAuditEvent({
        supabaseUrl: env.supabaseUrl,
        serviceRoleKey: env.serviceRoleKey,
        adminUserId: admin.id,
        action: "cache_invalidate",
        resource: "cached_answers",
        resourceKey: questionHash,
      });
      let auditCompleted = false;
      let mutationSucceeded = false;
      try {
        await rest<unknown>(
          env,
          `/cached_answers?question_hash=eq.${encodeURIComponent(questionHash)}`,
          {
            method: "DELETE",
          },
        );
        mutationSucceeded = true;
        await completeAdminAuditEvent({
          supabaseUrl: env.supabaseUrl,
          serviceRoleKey: env.serviceRoleKey,
          auditId,
          outcome: "succeeded",
        });
        auditCompleted = true;
      } catch (error) {
        if (!auditCompleted) {
          if (mutationSucceeded) {
            await completeAdminAuditEventBestEffort({
              supabaseUrl: env.supabaseUrl,
              serviceRoleKey: env.serviceRoleKey,
              auditId,
              outcome: "succeeded",
            });
          } else {
            await completeAuditAsFailed(env, auditId);
          }
        }
        throw error;
      }
      return jsonResponse(
        { invalidated: true, question_hash: questionHash, admin_user_id: admin.id },
        200,
      );
    }

    if (resource === "overview") return jsonResponse(await loadOverview(env), 200);
    if (resource === "cost")
      return jsonResponse(await loadCost(env, boundedDays(url.searchParams.get("days"))), 200);
    if (resource === "cache")
      return jsonResponse(await loadCache(env, boundedLimit(url.searchParams.get("limit"))), 200);
    if (resource === "users")
      return jsonResponse(await loadUsers(env, boundedLimit(url.searchParams.get("limit"))), 200);
    if (resource === "audit")
      return jsonResponse(await loadAudit(env, boundedLimit(url.searchParams.get("limit"))), 200);
    return jsonResponse({ error: "Unknown admin resource.", code: "bad_resource" }, 400);
  } catch (error) {
    await reportBackendError({ functionName: "admin-ops", error });
    console.error("admin operations request failed");
    if (error instanceof BadRequestError) {
      return jsonResponse({ error: error.message, code: "bad_request" }, 400);
    }
    return jsonResponse(
      { error: "Admin operations request failed.", code: "admin_ops_failed" },
      500,
    );
  }
});

async function loadOverview(env: AdminEnv) {
  const now = Date.now();
  const dayStart = new Date(now - 24 * 60 * 60 * 1000).toISOString();
  const monthStart = new Date(
    Date.UTC(new Date(now).getUTCFullYear(), new Date(now).getUTCMonth(), 1),
  ).toISOString();
  const [
    totalUsers,
    dailyMessages,
    monthlyMessages,
    dailyFeedback,
    activeDayRows,
    activeMonthRows,
    cost,
    operational,
  ] = await Promise.all([
    countRows(env, "/profiles?select=id"),
    countRows(
      env,
      `/messages?role=eq.user&created_at=gte.${encodeURIComponent(dayStart)}&select=id`,
    ),
    countRows(
      env,
      `/messages?role=eq.user&created_at=gte.${encodeURIComponent(monthStart)}&select=id`,
    ),
    countRows(env, `/feedback?created_at=gte.${encodeURIComponent(dayStart)}&select=id`),
    rest<Array<{ user_id: string }>>(
      env,
      `/conversations?updated_at=gte.${encodeURIComponent(dayStart)}&select=user_id&limit=${MAX_ROWS}`,
      { method: "GET" },
    ),
    rest<Array<{ user_id: string }>>(
      env,
      `/conversations?updated_at=gte.${encodeURIComponent(monthStart)}&select=user_id&limit=${MAX_ROWS}`,
      { method: "GET" },
    ),
    loadCost(env, 1),
    loadOperationalHealth(env),
  ]);
  return {
    generated_at: new Date().toISOString(),
    users: { total: totalUsers },
    activity: {
      dau: uniqueUserCount(activeDayRows),
      mau: uniqueUserCount(activeMonthRows),
      messages_last_24_hours: dailyMessages,
      messages_this_month: monthlyMessages,
      active_user_query_capped:
        activeDayRows.length >= MAX_ROWS || activeMonthRows.length >= MAX_ROWS,
    },
    feedback_last_24_hours: dailyFeedback,
    cost_last_24_hours: cost,
    operational,
  };
}

async function loadOperationalHealth(env: AdminEnv) {
  const staleClaimCutoff = new Date(Date.now() - 15 * 60 * 1_000).toISOString();
  const [
    unprocessedBillingEvents,
    failedBillingEvents,
    staleDeliveryClaims,
    pendingPushReceipts,
    failedPushReceipts,
    billingIssueSubscriptions,
  ] = await Promise.all([
    countRows(env, "/billing_events?processed_at=is.null&select=event_id"),
    countRows(
      env,
      "/billing_events?processed_at=is.null&processing_error=not.is.null&select=event_id",
    ),
    countRows(
      env,
      `/notification_deliveries?status=eq.claimed&claimed_at=lt.${encodeURIComponent(staleClaimCutoff)}&select=user_id`,
    ),
    countRows(env, "/notification_push_tickets?status=in.(pending,claimed)&select=id"),
    countRows(env, "/notification_push_tickets?status=eq.error&select=id"),
    countRows(env, "/subscription_status?status=eq.billing_issue&select=user_id"),
  ]);

  return {
    billing: {
      unprocessed_events: unprocessedBillingEvents,
      failed_events: failedBillingEvents,
    },
    notifications: {
      stale_delivery_claims: staleDeliveryClaims,
      pending_push_receipts: pendingPushReceipts,
      failed_push_receipts: failedPushReceipts,
    },
    subscriptions: { billing_issue_accounts: billingIssueSubscriptions },
  };
}

async function loadCost(env: AdminEnv, days: number) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  const rows = await rest<
    Array<{
      purpose: string;
      model: string;
      tokens_in: number;
      tokens_out: number;
      cost_usd: number;
      created_at: string;
    }>
  >(
    env,
    `/cost_log?created_at=gte.${encodeURIComponent(since)}&select=purpose,model,tokens_in,tokens_out,cost_usd,created_at&order=created_at.desc&limit=${MAX_ROWS}`,
    { method: "GET" },
  );
  const byPurpose = new Map<
    string,
    { calls: number; tokens_in: number; tokens_out: number; cost_usd: number }
  >();
  const byModel = new Map<string, { calls: number; cost_usd: number }>();
  let totalCost = 0;
  let tokensIn = 0;
  let tokensOut = 0;
  for (const row of rows) {
    const input = integerOrZero(row.tokens_in);
    const output = integerOrZero(row.tokens_out);
    const cost = nonNegativeNumber(row.cost_usd);
    totalCost += cost;
    tokensIn += input;
    tokensOut += output;
    const purpose = byPurpose.get(row.purpose) ?? {
      calls: 0,
      tokens_in: 0,
      tokens_out: 0,
      cost_usd: 0,
    };
    purpose.calls += 1;
    purpose.tokens_in += input;
    purpose.tokens_out += output;
    purpose.cost_usd += cost;
    byPurpose.set(row.purpose, purpose);
    const model = byModel.get(row.model) ?? { calls: 0, cost_usd: 0 };
    model.calls += 1;
    model.cost_usd += cost;
    byModel.set(row.model, model);
  }
  return {
    since,
    until: new Date().toISOString(),
    rows: rows.length,
    rows_capped: rows.length >= MAX_ROWS,
    total_cost_usd: roundMoney(totalCost),
    tokens_in: tokensIn,
    tokens_out: tokensOut,
    by_purpose: Object.fromEntries(
      [...byPurpose.entries()].map(([key, value]) => [
        key,
        { ...value, cost_usd: roundMoney(value.cost_usd) },
      ]),
    ),
    by_model: Object.fromEntries(
      [...byModel.entries()].map(([key, value]) => [
        key,
        { ...value, cost_usd: roundMoney(value.cost_usd) },
      ]),
    ),
  };
}

async function loadCache(env: AdminEnv, limit: number) {
  const rows = await rest<
    Array<{
      id: string;
      question_hash: string;
      hit_count: number;
      last_used_at: string;
      created_at: string;
      expires_at: string | null;
    }>
  >(
    env,
    `/cached_answers?select=id,question_hash,hit_count,last_used_at,created_at,expires_at&order=hit_count.desc&limit=${limit}`,
    { method: "GET" },
  );
  return { items: rows, raw_questions_excluded: true };
}

async function loadUsers(env: AdminEnv, limit: number) {
  const profiles = await rest<
    Array<{ id: string; display_name: string | null; timezone: string; created_at: string }>
  >(
    env,
    `/profiles?select=id,display_name,timezone,created_at&order=created_at.desc&limit=${limit}`,
    { method: "GET" },
  );
  if (profiles.length === 0) return { items: [], emails_excluded: true };
  const quotas = await rest<
    Array<{ user_id: string; plan: string; ai_messages_count: number; updated_at: string }>
  >(
    env,
    `/usage_quotas?user_id=in.(${profiles.map((profile) => encodeURIComponent(profile.id)).join(",")})&select=user_id,plan,ai_messages_count,updated_at&limit=${limit}`,
    { method: "GET" },
  );
  const quotaByUser = new Map(quotas.map((quota) => [quota.user_id, quota]));
  return {
    items: profiles.map((profile) => ({
      ...profile,
      quota: quotaByUser.get(profile.id) ?? null,
    })),
    emails_excluded: true,
  };
}

async function loadAudit(env: AdminEnv, limit: number) {
  const rows = await rest<
    Array<{
      id: string;
      admin_user_id: string | null;
      action: string;
      resource: string;
      resource_id: string | null;
      resource_key: string | null;
      outcome: string;
      created_at: string;
      completed_at: string | null;
    }>
  >(
    env,
    `/admin_audit_log?select=id,admin_user_id,action,resource,resource_id,resource_key,outcome,created_at,completed_at&order=created_at.desc&limit=${limit}`,
    { method: "GET" },
  );
  return { items: rows, raw_payloads_excluded: true };
}

async function completeAuditAsFailed(env: AdminEnv, auditId: string): Promise<void> {
  await completeAdminAuditEvent({
    supabaseUrl: env.supabaseUrl,
    serviceRoleKey: env.serviceRoleKey,
    auditId,
    outcome: "failed",
  }).catch(() => undefined);
}

async function countRows(env: AdminEnv, path: string): Promise<number> {
  const response = await fetchWithTimeout(`${env.supabaseUrl}/rest/v1${path}&limit=1`, {
    method: "GET",
    headers: {
      apikey: env.serviceRoleKey,
      authorization: `Bearer ${env.serviceRoleKey}`,
      prefer: "count=exact",
    },
  });
  if (!response.ok) throw new Error(`Supabase count request failed: ${response.status}`);
  const range = response.headers.get("content-range") ?? "*/0";
  const total = Number(range.split("/")[1]);
  return Number.isFinite(total) ? total : 0;
}

async function authenticateAdmin(
  env: AdminEnv,
  authorization: string | null,
): Promise<{ id: string } | null> {
  if (!authorization?.startsWith("Bearer ")) return null;
  const response = await fetchWithTimeout(`${env.supabaseUrl}/auth/v1/user`, {
    headers: { apikey: env.anonKey, authorization },
  });
  if (!response.ok) return null;
  const user = (await response.json()) as { id?: string; app_metadata?: { role?: unknown } };
  return user.id && user.app_metadata?.role === "admin" ? { id: user.id } : null;
}

async function rest<T>(env: AdminEnv, path: string, init: RequestInit): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("apikey", env.serviceRoleKey);
  headers.set("authorization", `Bearer ${env.serviceRoleKey}`);
  if (init.body && !headers.has("content-type")) headers.set("content-type", "application/json");
  const response = await fetchWithTimeout(`${env.supabaseUrl}/rest/v1${path}`, {
    ...init,
    headers,
  });
  if (!response.ok) throw new Error(`Supabase REST request failed: ${response.status}`);
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

function readEnv(): AdminEnv {
  const value = (name: string) => Deno.env.get(name)?.trim() ?? "";
  const supabaseUrl = value("SUPABASE_URL");
  const anonKey = value("SUPABASE_ANON_KEY");
  const serviceRoleKey = value("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !anonKey || !serviceRoleKey)
    throw new Error("Missing admin operations environment.");
  return { supabaseUrl, anonKey, serviceRoleKey };
}

function boundedLimit(value: string | null): number {
  if (value === null || value === "") return 100;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 500)
    throw new BadRequestError("Invalid limit.");
  return parsed;
}

function boundedDays(value: string | null): number {
  if (value === null || value === "") return 30;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 90)
    throw new BadRequestError("Invalid days.");
  return parsed;
}

function uniqueUserCount(rows: Array<{ user_id: string }>): number {
  return new Set(rows.map((row) => row.user_id).filter(Boolean)).size;
}

function integerOrZero(value: unknown): number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0 ? value : 0;
}

function nonNegativeNumber(value: unknown): number {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

function roundMoney(value: number): number {
  return Math.round(value * 100_000_000) / 100_000_000;
}

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...CORS_HEADERS,
      "cache-control": "no-store, private",
      pragma: "no-cache",
      "content-type": "application/json",
    },
  });
}
