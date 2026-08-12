#!/usr/bin/env node
let handler;
const auditCalls = [];
const adminId = "00000000-0000-0000-0000-000000000001";
const contentId = "00000000-0000-0000-0000-000000000002";
const feedbackId = "00000000-0000-0000-0000-000000000003";
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
    return jsonResponse({ id: adminId, app_metadata: { role: "admin" } });
  }
  if (target.includes("/rpc/start_admin_audit_event")) {
    auditCalls.push({ type: "start", body: JSON.parse(String(init.body)) });
    return jsonResponse([{ audit_id: "00000000-0000-0000-0000-000000000099" }]);
  }
  if (target.includes("/rpc/complete_admin_audit_event")) {
    auditCalls.push({ type: "complete", body: JSON.parse(String(init.body)) });
    return jsonResponse([{ completed: true }]);
  }
  if (target.includes("/rest/v1/concepts")) {
    return jsonResponse([{ id: contentId, slug: "dharma" }]);
  }
  if (target.includes("/rest/v1/feedback")) {
    return jsonResponse([{ id: feedbackId, status: "reviewed", admin_notes: null }]);
  }
  throw new Error(`Unexpected test request: ${target}`);
};

await import("../supabase/functions/admin-content/index.ts");
assert(typeof handler === "function", "Admin content function did not register a handler.");

const unauthenticated = await handler(
  new Request("https://project.supabase.co/functions/v1/admin-content?resource=concepts", {
    method: "POST",
    body: JSON.stringify({ slug: "dharma" }),
  }),
);
assert(unauthenticated.status === 401, "Unauthenticated content mutation was not rejected.");

const created = await handler(
  new Request("https://project.supabase.co/functions/v1/admin-content?resource=concepts", {
    method: "POST",
    headers: { authorization: "Bearer admin-token", "content-type": "application/json" },
    body: JSON.stringify({ slug: "dharma", full_explanation: "private test content" }),
  }),
);
assert(created.status === 201, "Admin content create did not succeed.");
assert(auditCalls[0]?.body.p_action === "content_create", "Content create audit action is wrong.");
assert(auditCalls[1]?.body.p_outcome === "succeeded", "Content create audit was not completed.");
assert(
  !JSON.stringify(auditCalls).includes("private test content"),
  "Admin audit copied the raw content payload.",
);

const updated = await handler(
  new Request(
    `https://project.supabase.co/functions/v1/admin-content?resource=concepts&id=${contentId}`,
    {
      method: "PATCH",
      headers: { authorization: "Bearer admin-token", "content-type": "application/json" },
      body: JSON.stringify({ short_definition: "updated" }),
    },
  ),
);
assert(updated.status === 200, "Admin content update did not succeed.");
assert(auditCalls[2]?.body.p_action === "content_update", "Content update audit action is wrong.");

const deleted = await handler(
  new Request(
    `https://project.supabase.co/functions/v1/admin-content?resource=concepts&id=${contentId}&confirm=DELETE`,
    { method: "DELETE", headers: { authorization: "Bearer admin-token" } },
  ),
);
assert(deleted.status === 200, "Admin content deletion did not succeed.");
assert(auditCalls[4]?.body.p_action === "content_delete", "Content delete audit action is wrong.");

await import("../supabase/functions/admin-feedback/index.ts");
assert(typeof handler === "function", "Admin feedback function did not register a handler.");
const feedback = await handler(
  new Request("https://project.supabase.co/functions/v1/admin-feedback", {
    method: "PATCH",
    headers: { authorization: "Bearer admin-token", "content-type": "application/json" },
    body: JSON.stringify({
      feedback_id: feedbackId,
      status: "reviewed",
      admin_notes: "kept private",
    }),
  }),
);
assert(feedback.status === 200, "Admin feedback update did not succeed.");
assert(auditCalls[6]?.body.p_action === "feedback_update", "Feedback audit action is wrong.");
assert(
  !JSON.stringify(auditCalls).includes("kept private"),
  "Feedback audit copied moderator notes.",
);

console.log("Admin audit runtime check passed.");

function jsonResponse(body) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}

function assert(condition, message) {
  if (!condition) {
    console.error(message);
    process.exit(1);
  }
}
