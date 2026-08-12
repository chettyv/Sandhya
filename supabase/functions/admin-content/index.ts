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
  "access-control-allow-methods": "GET, POST, PATCH, DELETE, OPTIONS",
};

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_REQUEST_BODY_CHARS = 256_000;
const TABLE_FIELDS: Record<string, Set<string>> = {
  daily_reflections: new Set([
    "date_slot",
    "title",
    "shloka_passage_id",
    "reflection_text",
    "practice_prompt",
    "journal_prompt",
    "tradition",
    "tags",
    "audio_url",
    "is_premium",
  ]),
  festivals: new Set([
    "slug",
    "name",
    "name_variants",
    "short_description",
    "full_story",
    "meaning",
    "home_observance",
    "regional_variations",
    "traditions",
    "tithi_rule",
    "upcoming_dates",
    "duration_days",
    "image_url",
    "is_premium",
  ]),
  practice_guides: new Set([
    "slug",
    "title",
    "category",
    "difficulty",
    "duration_minutes",
    "steps",
    "materials_needed",
    "tradition_notes",
    "warnings",
    "audio_url",
    "is_premium",
  ]),
  concepts: new Set([
    "slug",
    "term",
    "term_sanskrit",
    "short_definition",
    "full_explanation",
    "examples",
    "tradition_variations",
    "related_concepts",
    "related_passages",
  ]),
  deities: new Set([
    "slug",
    "name",
    "other_names",
    "short_description",
    "full_description",
    "associated_concepts",
    "associated_festivals",
    "traditions",
    "image_url",
  ]),
};

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return jsonResponse({}, 200);
  if (!["GET", "POST", "PATCH", "DELETE"].includes(request.method)) {
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
    const env = readEnv();
    const user = await requireAdmin(env, authorization);
    const url = new URL(request.url);
    const table = url.searchParams.get("resource") ?? "";
    if (!TABLE_FIELDS[table]) {
      return jsonResponse({ error: "Unknown content resource.", code: "bad_resource" }, 400);
    }
    const id = url.searchParams.get("id");
    if (id && !UUID_PATTERN.test(id)) {
      return jsonResponse({ error: "id must be a UUID.", code: "bad_request" }, 400);
    }

    if (request.method === "GET") {
      const limit = boundedInteger(url.searchParams.get("limit"), 50, 1, 100);
      const offset = boundedInteger(url.searchParams.get("offset"), 0, 0, 100_000);
      const filter = id ? `&id=eq.${encodeURIComponent(id)}` : "";
      const rows = await rest<unknown[]>(
        env,
        `/${table}?select=*&order=created_at.desc&limit=${limit}&offset=${offset}${filter}`,
        { method: "GET" },
      );
      return jsonResponse({ resource: table, rows, admin_user_id: user.id }, 200);
    }

    if (request.method === "POST") {
      const payload = await readPayload(request);
      const safePayload = allowlistedPayload(table, payload);
      if (!Object.keys(safePayload).length) {
        return jsonResponse(
          { error: "No editable content fields supplied.", code: "bad_request" },
          400,
        );
      }
      const auditId = await startAdminAuditEvent({
        supabaseUrl: env.url,
        serviceRoleKey: env.serviceRoleKey,
        adminUserId: user.id,
        action: "content_create",
        resource: table,
      });
      let auditCompleted = false;
      let mutationSucceeded = false;
      let createdResourceId: string | null = null;
      let rows: unknown[];
      try {
        rows = await rest<unknown[]>(env, `/${table}`, {
          method: "POST",
          headers: { prefer: "return=representation" },
          body: JSON.stringify(safePayload),
        });
        mutationSucceeded = true;
        const resourceId = firstRowUuid(rows);
        createdResourceId = resourceId;
        await completeAdminAuditEvent({
          supabaseUrl: env.url,
          serviceRoleKey: env.serviceRoleKey,
          auditId,
          outcome: "succeeded",
          resourceId,
        });
        auditCompleted = true;
      } catch (error) {
        if (!auditCompleted) {
          if (mutationSucceeded) {
            await completeAdminAuditEventBestEffort({
              supabaseUrl: env.url,
              serviceRoleKey: env.serviceRoleKey,
              auditId,
              outcome: "succeeded",
              resourceId: createdResourceId,
            });
          } else {
            await completeAuditAsFailed(env.url, env.serviceRoleKey, auditId);
          }
        }
        throw error;
      }
      return jsonResponse({ resource: table, rows }, 201);
    }

    if (!id) return jsonResponse({ error: "id is required.", code: "bad_request" }, 400);
    if (request.method === "DELETE") {
      if (url.searchParams.get("confirm") !== "DELETE") {
        return jsonResponse(
          {
            error: "confirm=DELETE is required for content deletion.",
            code: "confirmation_required",
          },
          400,
        );
      }
      const auditId = await startAdminAuditEvent({
        supabaseUrl: env.url,
        serviceRoleKey: env.serviceRoleKey,
        adminUserId: user.id,
        action: "content_delete",
        resource: table,
        resourceId: id,
      });
      let auditCompleted = false;
      let mutationSucceeded = false;
      let deleted: unknown[];
      try {
        deleted = await rest<unknown[]>(env, `/${table}?id=eq.${encodeURIComponent(id)}`, {
          method: "DELETE",
          headers: { prefer: "return=representation" },
        });
        mutationSucceeded = true;
        if (!Array.isArray(deleted) || deleted.length === 0) {
          mutationSucceeded = false;
          throw new NotFoundError("Content row not found.");
        }
        await completeAdminAuditEvent({
          supabaseUrl: env.url,
          serviceRoleKey: env.serviceRoleKey,
          auditId,
          outcome: "succeeded",
          resourceId: id,
        });
        auditCompleted = true;
      } catch (error) {
        if (!auditCompleted) {
          if (mutationSucceeded) {
            await completeAdminAuditEventBestEffort({
              supabaseUrl: env.url,
              serviceRoleKey: env.serviceRoleKey,
              auditId,
              outcome: "succeeded",
              resourceId: id,
            });
          } else {
            await completeAuditAsFailed(env.url, env.serviceRoleKey, auditId);
          }
        }
        throw error;
      }
      return jsonResponse({ deleted: true, resource: table, id }, 200);
    }

    const payload = await readPayload(request);
    const safePayload = allowlistedPayload(table, payload);
    if (!Object.keys(safePayload).length) {
      return jsonResponse(
        { error: "No editable content fields supplied.", code: "bad_request" },
        400,
      );
    }
    const auditId = await startAdminAuditEvent({
      supabaseUrl: env.url,
      serviceRoleKey: env.serviceRoleKey,
      adminUserId: user.id,
      action: "content_update",
      resource: table,
      resourceId: id,
    });
    let auditCompleted = false;
    let mutationSucceeded = false;
    let rows: unknown[];
    try {
      rows = await rest<unknown[]>(env, `/${table}?id=eq.${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { prefer: "return=representation" },
        body: JSON.stringify(safePayload),
      });
      mutationSucceeded = true;
      if (!Array.isArray(rows) || rows.length === 0) {
        mutationSucceeded = false;
        throw new NotFoundError("Content row not found.");
      }
      await completeAdminAuditEvent({
        supabaseUrl: env.url,
        serviceRoleKey: env.serviceRoleKey,
        auditId,
        outcome: "succeeded",
        resourceId: id,
      });
      auditCompleted = true;
    } catch (error) {
      if (!auditCompleted) {
        if (mutationSucceeded) {
          await completeAdminAuditEventBestEffort({
            supabaseUrl: env.url,
            serviceRoleKey: env.serviceRoleKey,
            auditId,
            outcome: "succeeded",
            resourceId: id,
          });
        } else {
          await completeAuditAsFailed(env.url, env.serviceRoleKey, auditId);
        }
      }
      throw error;
    }
    return jsonResponse({ resource: table, rows }, 200);
  } catch (error) {
    await reportBackendError({ functionName: "admin-content", error });
    console.error("admin content operation failed");
    if (error instanceof UnauthorizedError)
      return jsonResponse({ error: error.message, code: "unauthorized" }, 401);
    if (error instanceof ForbiddenError)
      return jsonResponse({ error: error.message, code: "forbidden" }, 403);
    if (error instanceof NotFoundError)
      return jsonResponse({ error: error.message, code: "not_found" }, 404);
    if (error instanceof BadRequestError)
      return jsonResponse({ error: error.message, code: "bad_request" }, 400);
    return jsonResponse(
      { error: "Admin content operation failed.", code: "admin_content_failed" },
      500,
    );
  }
});

class UnauthorizedError extends Error {}
class ForbiddenError extends Error {}
class BadRequestError extends Error {}
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

function firstRowUuid(rows: unknown[]): string | null {
  const first = rows[0];
  const id = first && typeof first === "object" ? (first as { id?: unknown }).id : null;
  return typeof id === "string" && UUID_PATTERN.test(id) ? id : null;
}

async function requireAdmin(
  env: { url: string; anonKey: string; serviceRoleKey: string },
  authorization: string,
): Promise<{ id: string }> {
  const response = await fetchWithTimeout(`${env.url}/auth/v1/user`, {
    headers: { apikey: env.anonKey, authorization },
  });
  if (!response.ok) throw new UnauthorizedError("Invalid admin user token.");
  const user = (await response.json()) as { id?: string; app_metadata?: { role?: unknown } };
  if (!user.id) throw new UnauthorizedError("User identity is missing.");
  if (user.app_metadata?.role !== "admin") throw new ForbiddenError("Admin role required.");
  return { id: user.id };
}

async function readPayload(request: Request): Promise<Record<string, unknown>> {
  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BODY_CHARS) {
    throw new BadRequestError("Content payload is too large.");
  }
  const raw = await request.text();
  if (raw.length > MAX_REQUEST_BODY_CHARS)
    throw new BadRequestError("Content payload is too large.");
  let value: unknown;
  try {
    value = JSON.parse(raw) as unknown;
  } catch {
    throw new BadRequestError("Valid JSON is required.");
  }
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new BadRequestError("JSON object required.");
  return value as Record<string, unknown>;
}

function allowlistedPayload(
  table: string,
  payload: Record<string, unknown>,
): Record<string, unknown> {
  const fields = TABLE_FIELDS[table];
  return Object.fromEntries(Object.entries(payload).filter(([key]) => fields.has(key)));
}

function boundedInteger(
  value: string | null,
  fallback: number,
  minimum: number,
  maximum: number,
): number {
  if (value === null || value === "") return fallback;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < minimum || parsed > maximum)
    throw new BadRequestError("Pagination values are invalid.");
  return parsed;
}

function readEnv() {
  const value = (name: string) => Deno.env.get(name)?.trim() ?? "";
  const url = value("SUPABASE_URL");
  const anonKey = value("SUPABASE_ANON_KEY");
  const serviceRoleKey = value("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !anonKey || !serviceRoleKey) throw new Error("Missing admin content environment.");
  return { url, anonKey, serviceRoleKey };
}

async function rest<T>(
  env: { url: string; serviceRoleKey: string },
  path: string,
  init: RequestInit,
): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("apikey", env.serviceRoleKey);
  headers.set("authorization", `Bearer ${env.serviceRoleKey}`);
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
      ...CORS_HEADERS,
      "cache-control": "no-store, private",
      pragma: "no-cache",
      "content-type": "application/json",
    },
  });
}
