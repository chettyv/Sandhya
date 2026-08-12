#!/usr/bin/env node
const calls = [];
let handler;
let dueRecipientLimit;

const environment = {
  SUPABASE_URL: "https://project.supabase.co",
  SUPABASE_SERVICE_ROLE_KEY: "service-role-test-key",
  DAILY_REFLECTIONS_CRON_SECRET: "cron-test-secret",
  EXPO_ACCESS_TOKEN: "expo-test-token",
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
  if (target.includes("get_due_daily_reflection_recipients")) {
    const body = JSON.parse(String(init.body ?? "{}"));
    dueRecipientLimit = body.p_limit;
  }
  if (target.includes("claim_notification_push_tickets_fenced")) {
    return jsonResponse([
      {
        id: "00000000-0000-0000-0000-000000000010",
        ticket_id: "receipt-ticket-1",
        user_id: "00000000-0000-0000-0000-000000000001",
        expo_push_token: "ExpoPushToken[aaaaaaaa]",
        delivery_date: "2026-08-06",
        kind: "daily_reflection",
        claim_token: "123e4567-e89b-12d3-a456-426614174000",
      },
    ]);
  }
  if (target === "https://exp.host/--/api/v2/push/getReceipts") {
    return jsonResponse({ data: { "receipt-ticket-1": { status: "ok" } } });
  }
  if (target.includes("get_due_daily_reflection_recipients")) {
    return jsonResponse([
      {
        user_id: "00000000-0000-0000-0000-000000000001",
        expo_push_token: "ExpoPushToken[aaaaaaaa]",
        display_name: null,
        local_date: "2026-08-06",
        date_slot: 31,
      },
    ]);
  }
  if (target.includes("date_slot=in.(31)")) return jsonResponse([]);
  if (target.includes("daily_reflections?is_premium=eq.false")) {
    return jsonResponse([
      {
        date_slot: 1,
        title: "A reviewed fallback reflection",
        reflection_text: "Approved content remains available while the catalog is sparse.",
        tradition: "general",
      },
    ]);
  }
  if (target.includes("claim_notification_delivery_fenced")) {
    return jsonResponse([{ claimed: true, claim_token: "123e4567-e89b-12d3-a456-426614174000" }]);
  }
  if (target === "https://exp.host/--/api/v2/push/send") {
    return jsonResponse({ data: { status: "ok", id: "ticket-1" } });
  }
  if (target.includes("record_notification_push_ticket"))
    return new Response(null, { status: 204 });
  if (target.includes("record_notification_push_receipt_fenced"))
    return jsonResponse([{ recorded: true }]);
  if (target.includes("record_notification_delivery")) return jsonResponse([{ recorded: true }]);
  return new Response(null, { status: 204 });
};

await import("../supabase/functions/send-daily-reflections/index.ts");
if (typeof handler !== "function") fail("Notification worker did not register a handler.");

const response = await handler(
  new Request("https://project.supabase.co/functions/v1/send-daily-reflections", {
    method: "POST",
    headers: { "x-cron-secret": environment.DAILY_REFLECTIONS_CRON_SECRET },
  }),
);
const body = await response.json();

assert(response.status === 200, `Expected HTTP 200, got ${response.status}.`);
assert(body.sent === 1 && body.skipped === 0, "Sparse-catalog reflection was not delivered.");
assert(
  calls.some((target) => target.includes("daily_reflections?is_premium=eq.false")),
  "Worker did not query approved fallback reflections.",
);
assert(dueRecipientLimit === 500, "Worker did not request a bounded recipient batch.");
assert(
  calls.some((target) => target.includes("api/v2/push/send")),
  "Worker did not send the push notification.",
);
assert(
  calls.some((target) => target.includes("claim_notification_push_tickets_fenced")),
  "Worker did not claim receipt tickets with fencing.",
);
assert(
  calls.some((target) => target.includes("record_notification_push_receipt_fenced")),
  "Worker did not record receipts with fencing.",
);

console.log("Notification worker runtime check passed.");

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
