import { fetchWithTimeout } from "./http.ts";

export type AdminAuditAction =
  | "content_create"
  | "content_update"
  | "content_delete"
  | "feedback_update"
  | "cache_invalidate";

export type AdminAuditOutcome = "succeeded" | "failed";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function startAdminAuditEvent(options: {
  supabaseUrl: string;
  serviceRoleKey: string;
  adminUserId: string;
  action: AdminAuditAction;
  resource: string;
  resourceId?: string | null;
  resourceKey?: string | null;
}): Promise<string> {
  const response = await fetchWithTimeout(
    `${options.supabaseUrl}/rest/v1/rpc/start_admin_audit_event`,
    {
      method: "POST",
      headers: serviceRoleHeaders(options.serviceRoleKey),
      body: JSON.stringify({
        p_admin_user_id: options.adminUserId,
        p_action: options.action,
        p_resource: options.resource,
        p_resource_id: options.resourceId ?? null,
        p_resource_key: options.resourceKey ?? null,
      }),
    },
  );
  if (!response.ok) throw new Error(`Admin audit start failed: ${response.status}`);
  const responseBody = (await response.json()) as unknown;
  const row = Array.isArray(responseBody) ? responseBody[0] : responseBody;
  const auditId =
    row && typeof row === "object" && typeof (row as { audit_id?: unknown }).audit_id === "string"
      ? (row as { audit_id: string }).audit_id
      : "";
  if (!UUID_PATTERN.test(auditId)) throw new Error("Admin audit start returned an invalid id.");
  return auditId;
}

export async function completeAdminAuditEvent(options: {
  supabaseUrl: string;
  serviceRoleKey: string;
  auditId: string;
  outcome: AdminAuditOutcome;
  resourceId?: string | null;
}): Promise<void> {
  const response = await fetchWithTimeout(
    `${options.supabaseUrl}/rest/v1/rpc/complete_admin_audit_event`,
    {
      method: "POST",
      headers: serviceRoleHeaders(options.serviceRoleKey),
      body: JSON.stringify({
        p_audit_id: options.auditId,
        p_outcome: options.outcome,
        p_resource_id: options.resourceId ?? null,
      }),
    },
  );
  if (!response.ok) throw new Error(`Admin audit completion failed: ${response.status}`);
  const responseBody = (await response.json()) as unknown;
  const row = Array.isArray(responseBody) ? responseBody[0] : responseBody;
  if (!row || typeof row !== "object" || (row as { completed?: unknown }).completed !== true) {
    throw new Error("Admin audit event was not pending or could not be completed.");
  }
}

export async function completeAdminAuditEventBestEffort(options: {
  supabaseUrl: string;
  serviceRoleKey: string;
  auditId: string;
  outcome: AdminAuditOutcome;
  resourceId?: string | null;
}): Promise<void> {
  await completeAdminAuditEvent(options).catch(() => undefined);
}

function serviceRoleHeaders(serviceRoleKey: string): Headers {
  return new Headers({
    apikey: serviceRoleKey,
    authorization: `Bearer ${serviceRoleKey}`,
    "content-type": "application/json",
  });
}
