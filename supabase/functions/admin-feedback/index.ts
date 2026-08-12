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
  "access-control-allow-methods": "GET, PATCH, OPTIONS",
};
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const FEEDBACK_STATUSES = new Set(["pending", "reviewed", "fixed"]);
const MAX_REQUEST_BODY_CHARS = 16_384;

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return jsonResponse({}, 200);
  if (request.method !== "GET" && request.method !== "PATCH") {
    return jsonResponse({ error: "Method not allowed", code: "method_not_allowed" }, 405);
  }

  try {
    const env = readEnv();
    const authorization = request.headers.get("authorization");
    const adminUser = await authenticateAdmin(env, authorization);
    if (!adminUser)
      return jsonResponse({ error: "Admin access required.", code: "forbidden" }, 403);

    if (request.method === "GET") {
      const status = new URL(request.url).searchParams.get("status") ?? "pending";
      if (!FEEDBACK_STATUSES.has(status))
        return jsonResponse({ error: "Invalid feedback status.", code: "bad_request" }, 400);
      const rows = await rest(
        env,
        `/feedback?status=eq.${encodeURIComponent(status)}&select=id,user_id,message_id,issue_type,notes,status,admin_notes,created_at,messages(content,structured_response)&order=created_at.desc&limit=100`,
        { method: "GET" },
      );
      return jsonResponse({ items: rows }, 200);
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
    const feedbackId = typeof body?.feedback_id === "string" ? body.feedback_id : "";
    const status = typeof body?.status === "string" ? body.status : "";
    const adminNotes =
      body?.admin_notes === null || typeof body?.admin_notes === "string"
        ? body.admin_notes
        : undefined;
    if (
      !UUID_PATTERN.test(feedbackId) ||
      !FEEDBACK_STATUSES.has(status) ||
      (typeof adminNotes === "string" && adminNotes.length > 4_000)
    ) {
      return jsonResponse(
        { error: "feedback_id, status, and valid admin_notes are required.", code: "bad_request" },
        400,
      );
    }
    const auditId = await startAdminAuditEvent({
      supabaseUrl: env.supabaseUrl,
      serviceRoleKey: env.serviceRoleKey,
      adminUserId: adminUser.id,
      action: "feedback_update",
      resource: "feedback",
      resourceId: feedbackId,
    });
    let auditCompleted = false;
    let mutationSucceeded = false;
    let updated: Array<{ id: string; status: string; admin_notes: string | null }>;
    try {
      updated = await rest<Array<{ id: string; status: string; admin_notes: string | null }>>(
        env,
        `/feedback?id=eq.${encodeURIComponent(feedbackId)}&select=id,status,admin_notes`,
        {
          method: "PATCH",
          headers: { prefer: "return=representation" },
          body: JSON.stringify({
            status,
            ...(adminNotes === undefined ? {} : { admin_notes: adminNotes }),
          }),
        },
      );
      mutationSucceeded = true;
      if (!Array.isArray(updated) || updated.length === 0) {
        mutationSucceeded = false;
        throw new NotFoundError("Feedback item not found.");
      }
      await completeAdminAuditEvent({
        supabaseUrl: env.supabaseUrl,
        serviceRoleKey: env.serviceRoleKey,
        auditId,
        outcome: "succeeded",
        resourceId: feedbackId,
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
            resourceId: feedbackId,
          });
        } else {
          await completeAuditAsFailed(env.supabaseUrl, env.serviceRoleKey, auditId);
        }
      }
      throw error;
    }
    return jsonResponse({ item: updated[0] }, 200);
  } catch (error) {
    await reportBackendError({ functionName: "admin-feedback", error });
    console.error("admin feedback operation failed");
    if (error instanceof NotFoundError)
      return jsonResponse({ error: error.message, code: "not_found" }, 404);
    return jsonResponse(
      { error: "Admin feedback request failed.", code: "admin_feedback_failed" },
      500,
    );
  }
});

class NotFoundError extends Error {}

async function completeAuditAsFailed(
  supabaseUrl: string,
  serviceRoleKey: string,
  auditId: string,
): Promise<void> {
  await completeAdminAuditEvent({
    supabaseUrl,
    serviceRoleKey,
    auditId,
    outcome: "failed",
  }).catch(() => undefined);
}

function readEnv() {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")?.trim();
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")?.trim();
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")?.trim();
  if (!supabaseUrl || !anonKey || !serviceRoleKey)
    throw new Error("Missing admin feedback environment.");
  return { supabaseUrl, anonKey, serviceRoleKey };
}

async function authenticateAdmin(
  env: ReturnType<typeof readEnv>,
  authorization: string | null,
): Promise<{ id: string } | null> {
  if (!authorization?.startsWith("Bearer ")) return null;
  const response = await fetchWithTimeout(`${env.supabaseUrl}/auth/v1/user`, {
    headers: { apikey: env.anonKey, authorization },
  });
  if (!response.ok) return null;
  const user = (await response.json()) as { id?: string; app_metadata?: { role?: string } };
  return user.id && user.app_metadata?.role === "admin" ? { id: user.id } : null;
}

async function rest<T>(
  env: ReturnType<typeof readEnv>,
  path: string,
  init: RequestInit,
): Promise<T> {
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
