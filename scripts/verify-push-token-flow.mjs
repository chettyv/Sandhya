#!/usr/bin/env node
let handler;
let registerResult = false;
const calls = [];

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

globalThis.fetch = async (url) => {
  const target = String(url);
  calls.push(target);
  if (target.endsWith("/auth/v1/user")) {
    return jsonResponse({ id: "00000000-0000-0000-0000-000000000001" });
  }
  if (target.includes("/rpc/consume_api_request_rate_limit")) {
    return jsonResponse([{ allowed: true, request_count: 1, retry_after_seconds: 0 }]);
  }
  if (target.includes("/rpc/register_device_push_token")) return jsonResponse(registerResult);
  return new Response(null, { status: 204 });
};

await import("../supabase/functions/register-push-token/index.ts");
if (typeof handler !== "function") fail("Push-token function did not register a handler.");

const conflict = await postRegistration();
const conflictBody = await conflict.json();
assert(conflict.status === 409, `Expected token conflict HTTP 409, got ${conflict.status}.`);
assert(
  conflictBody.code === "push_token_conflict",
  "Token conflict did not use the stable error code.",
);

registerResult = true;
const registered = await postRegistration();
const registeredBody = await registered.json();
assert(
  registered.status === 200 && registeredBody.registered === true,
  "Owned token registration failed.",
);
assert(
  calls.every((target) => !target.includes("device_push_tokens?on_conflict")),
  "Direct token upsert bypassed the owner RPC.",
);
assert(
  calls.some((target) => target.includes("consume_api_request_rate_limit")),
  "Push-token rate limit RPC was skipped.",
);

console.log("Push-token ownership runtime check passed.");

async function postRegistration() {
  return handler(
    new Request("https://project.supabase.co/functions/v1/register-push-token", {
      method: "POST",
      headers: {
        authorization: "Bearer user-token",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        expo_push_token: "ExpoPushToken[aaaaaaaa]",
        platform: "ios",
        app_version: "1.0.0",
      }),
    }),
  );
}

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
