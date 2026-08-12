import { reportBackendError } from "../_shared/observability.ts";
import { fetchWithTimeout } from "../_shared/http.ts";

export {};

const CORS_HEADERS = {
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "authorization, x-client-info, apikey, content-type",
  "access-control-allow-methods": "POST, DELETE, OPTIONS",
};

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const TOKEN_PATTERN = /^(Expo(nent)?PushToken)\[[^\]]{8,256}\]$/;
const MAX_REQUEST_BODY_CHARS = 4_096;

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return jsonResponse({}, 200);
  if (request.method !== "POST" && request.method !== "DELETE") {
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
    if (!userResponse.ok)
      return jsonResponse({ error: "Invalid user token.", code: "unauthorized" }, 401);
    const user = (await userResponse.json()) as { id?: string };
    if (!user.id || !UUID_PATTERN.test(user.id))
      return jsonResponse({ error: "Invalid user identity.", code: "unauthorized" }, 401);

    const baseHeaders = {
      apikey: serviceRoleKey,
      authorization: `Bearer ${serviceRoleKey}`,
      "content-type": "application/json",
    };

    if (request.method === "DELETE") {
      const token = new URL(request.url).searchParams.get("expo_push_token");
      if (!token || !TOKEN_PATTERN.test(token)) {
        return jsonResponse({ error: "expo_push_token is required.", code: "bad_request" }, 400);
      }
      const rateLimit = await consumeApiRequestRateLimit(
        supabaseUrl,
        serviceRoleKey,
        user.id,
        "push_token_mutation",
        60,
        60,
      );
      if (!rateLimit.allowed) {
        return jsonResponse(
          {
            error: "Push-token rate limit reached. Please try again shortly.",
            code: "rate_limited",
            retry_after_seconds: rateLimit.retryAfterSeconds,
          },
          429,
          { "retry-after": String(rateLimit.retryAfterSeconds) },
        );
      }
      const response = await fetchWithTimeout(
        `${supabaseUrl}/rest/v1/device_push_tokens?user_id=eq.${encodeURIComponent(user.id)}&expo_push_token=eq.${encodeURIComponent(token)}`,
        { method: "DELETE", headers: baseHeaders },
      );
      if (!response.ok) throw new Error(`Push token deletion failed: ${response.status}`);
      return jsonResponse({ registered: false }, 200);
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
    const token = typeof body?.expo_push_token === "string" ? body.expo_push_token : "";
    const platform = typeof body?.platform === "string" ? body.platform : "";
    const appVersion = typeof body?.app_version === "string" ? body.app_version.slice(0, 64) : null;
    if (!TOKEN_PATTERN.test(token) || !["ios", "android", "web"].includes(platform)) {
      return jsonResponse(
        { error: "A valid Expo push token and platform are required.", code: "bad_request" },
        400,
      );
    }

    const rateLimit = await consumeApiRequestRateLimit(
      supabaseUrl,
      serviceRoleKey,
      user.id,
      "push_token_mutation",
      60,
      60,
    );
    if (!rateLimit.allowed) {
      return jsonResponse(
        {
          error: "Push-token rate limit reached. Please try again shortly.",
          code: "rate_limited",
          retry_after_seconds: rateLimit.retryAfterSeconds,
        },
        429,
        { "retry-after": String(rateLimit.retryAfterSeconds) },
      );
    }

    const response = await fetchWithTimeout(
      `${supabaseUrl}/rest/v1/rpc/register_device_push_token`,
      {
        method: "POST",
        headers: baseHeaders,
        body: JSON.stringify({
          p_user_id: user.id,
          p_expo_push_token: token,
          p_platform: platform,
          p_app_version: appVersion,
        }),
      },
    );
    if (!response.ok) throw new Error(`Push token registration failed: ${response.status}`);
    const registered = await response.json().catch(() => null);
    if (!rpcBoolean(registered)) {
      return jsonResponse(
        {
          error: "This push token is already registered to another account. Sign out there first.",
          code: "push_token_conflict",
        },
        409,
      );
    }
    return jsonResponse({ registered: true }, 200);
  } catch (error) {
    await reportBackendError({ functionName: "register-push-token", error });
    console.error("push token operation failed");
    return jsonResponse(
      { error: "Push token registration failed.", code: "push_token_failed" },
      500,
    );
  }
});

function requiredEnv(name: string): string {
  const value = Deno.env.get(name)?.trim();
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

function rpcBoolean(value: unknown): boolean {
  if (value === true) return true;
  if (Array.isArray(value)) return value.length === 1 && rpcBoolean(value[0]);
  if (value && typeof value === "object") {
    const values = Object.values(value as Record<string, unknown>);
    return values.length === 1 && values[0] === true;
  }
  return false;
}

async function consumeApiRequestRateLimit(
  supabaseUrl: string,
  serviceRoleKey: string,
  userId: string,
  operation: "push_token_mutation",
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
  if (!response.ok) throw new Error(`Push-token rate-limit request failed: ${response.status}`);
  const payload = (await response.json()) as unknown;
  const row = Array.isArray(payload) ? payload[0] : payload;
  if (!row || typeof row !== "object") {
    throw new Error("Push-token rate-limit response was invalid.");
  }
  const value = row as Record<string, unknown>;
  if (typeof value.allowed !== "boolean") {
    throw new Error("Push-token rate-limit response omitted allowed state.");
  }
  const retryAfterSeconds =
    typeof value.retry_after_seconds === "number" &&
    Number.isInteger(value.retry_after_seconds) &&
    value.retry_after_seconds >= 0
      ? value.retry_after_seconds
      : 0;
  return { allowed: value.allowed, retryAfterSeconds };
}

function jsonResponse(
  body: unknown,
  status: number,
  extraHeaders: Record<string, string> = {},
): Response {
  return new Response(JSON.stringify(body), {
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
