#!/usr/bin/env node
let handler;
const auditCalls = [];

const environment = {
  SUPABASE_URL: "https://project.supabase.co",
  SUPABASE_ANON_KEY: "anon-test-key",
  SUPABASE_SERVICE_ROLE_KEY: "service-role-test-key",
};

globalThis.Deno = {
  env: { get: (name) => environment[name] },
  serve: (requestHandler) => {
    handler = requestHandler;
  },
};

globalThis.fetch = async (url, init = {}) => {
  const target = String(url);
  if (target.endsWith("/auth/v1/user")) {
    return jsonResponse({
      id: "00000000-0000-0000-0000-000000000001",
      app_metadata: { role: "admin" },
    });
  }
  if (target.includes("/conversations?updated_at=")) {
    return jsonResponse([{ user_id: "00000000-0000-0000-0000-000000000001" }]);
  }
  if (target.includes("/rpc/start_admin_audit_event")) {
    auditCalls.push({ action: "start", body: JSON.parse(String(init.body)) });
    return jsonResponse([{ audit_id: "00000000-0000-0000-0000-000000000099" }]);
  }
  if (target.includes("/rpc/complete_admin_audit_event")) {
    auditCalls.push({ action: "complete", body: JSON.parse(String(init.body)) });
    return jsonResponse([{ completed: true }]);
  }
  if (target.includes("/admin_audit_log?")) {
    return jsonResponse([
      {
        id: "00000000-0000-0000-0000-000000000099",
        admin_user_id: "00000000-0000-0000-0000-000000000001",
        action: "cache_invalidate",
        resource: "cached_answers",
        resource_id: null,
        resource_key: "a".repeat(64),
        outcome: "succeeded",
        created_at: "2026-08-06T00:00:00.000Z",
        completed_at: "2026-08-06T00:00:01.000Z",
      },
    ]);
  }
  if (target.includes("/cached_answers?") && init.method === "DELETE") {
    return new Response(null, { status: 204 });
  }
  if (target.includes("/cost_log?")) return jsonResponse([]);

  const count = target.includes("/profiles?")
    ? 42
    : target.includes("/messages?role=eq.user")
      ? target.includes("created_at=gte")
        ? 21
        : 7
      : target.includes("/feedback?")
        ? 3
        : target.includes("/billing_events?processed_at=is.null&processing_error")
          ? 1
          : target.includes("/billing_events?processed_at=is.null")
            ? 4
            : target.includes("/notification_deliveries?")
              ? 2
              : target.includes("/notification_push_tickets?status=in")
                ? 5
                : target.includes("/notification_push_tickets?status=eq.error")
                  ? 1
                  : target.includes("/subscription_status?")
                    ? 2
                    : 0;
  return new Response(null, {
    status: 200,
    headers: { "content-range": `0-0/${count}` },
  });
};

await import("../supabase/functions/admin-ops/index.ts");
if (typeof handler !== "function") fail("Admin operations function did not register a handler.");

const forbidden = await handler(
  new Request("https://project.supabase.co/functions/v1/admin-ops?resource=overview", {
    method: "GET",
  }),
);
assert(forbidden.status === 403, "Unauthenticated admin request was not rejected.");

const response = await handler(
  new Request("https://project.supabase.co/functions/v1/admin-ops?resource=overview", {
    method: "GET",
    headers: { authorization: "Bearer admin-token" },
  }),
);
const body = await response.json();
assert(response.status === 200, `Expected HTTP 200, got ${response.status}.`);
assert(body.users.total === 42, "Admin overview did not report user count.");
assert(
  body.activity.dau === 1 && body.activity.mau === 1,
  "Admin overview activity counts are wrong.",
);
assert(body.operational.billing.unprocessed_events === 4, "Unprocessed billing count is wrong.");
assert(body.operational.billing.failed_events === 1, "Failed billing count is wrong.");
assert(
  body.operational.notifications.stale_delivery_claims === 2,
  "Stale delivery count is wrong.",
);
assert(
  body.operational.notifications.pending_push_receipts === 5,
  "Pending receipt count is wrong.",
);
assert(body.operational.notifications.failed_push_receipts === 1, "Failed receipt count is wrong.");
assert(
  body.operational.subscriptions.billing_issue_accounts === 2,
  "Billing-issue count is wrong.",
);
assert(!JSON.stringify(body).includes("raw_question"), "Admin overview exposed raw question data.");
assert(!JSON.stringify(body).includes("user_id"), "Admin overview exposed user identifiers.");

const hash = "b".repeat(64);
const invalidated = await handler(
  new Request(
    `https://project.supabase.co/functions/v1/admin-ops?resource=cache&confirm=INVALIDATE&question_hash=${hash}`,
    { method: "DELETE", headers: { authorization: "Bearer admin-token" } },
  ),
);
assert(invalidated.status === 200, "Admin cache invalidation did not succeed.");
assert(auditCalls.length === 2, "Admin cache invalidation did not create a complete audit event.");
assert(auditCalls[0].body.p_action === "cache_invalidate", "Audit action was not recorded.");
assert(auditCalls[0].body.p_resource_key === hash, "Audit stored the wrong resource key.");
assert(auditCalls[1].body.p_outcome === "succeeded", "Audit success was not recorded.");

const auditResponse = await handler(
  new Request("https://project.supabase.co/functions/v1/admin-ops?resource=audit&limit=10", {
    method: "GET",
    headers: { authorization: "Bearer admin-token" },
  }),
);
const auditBody = await auditResponse.json();
assert(auditResponse.status === 200, "Admin audit resource did not load.");
assert(
  auditBody.raw_payloads_excluded === true,
  "Admin audit endpoint did not declare payload redaction.",
);
assert(!JSON.stringify(auditBody).includes("raw_question"), "Admin audit exposed raw questions.");

console.log("Admin operations runtime check passed.");

function jsonResponse(body) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
