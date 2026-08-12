export {};

type Scalar = string | number | boolean;

type BackendErrorEvent = {
  functionName: string;
  error: unknown;
  tags?: Record<string, Scalar>;
};

const REPORT_TIMEOUT_MS = 1_500;

/** Best-effort, redacted telemetry. No prompts, answers, request bodies, or user IDs. */
export async function reportBackendError(event: BackendErrorEvent): Promise<void> {
  const message = safeErrorMessage(event.error);
  const tags = { function: event.functionName, ...event.tags };
  await Promise.allSettled([
    sendSentry(event.functionName, message, tags),
    sendPostHog(event.functionName, message, tags),
  ]);
}

function safeErrorMessage(error: unknown): string {
  // Error messages may contain provider payloads, URLs, or user-derived text.
  // Keep telemetry useful without exporting that content from the function.
  return error instanceof Error && error.name.trim() ? error.name : "Unknown backend error";
}

async function sendSentry(
  functionName: string,
  message: string,
  tags: Record<string, Scalar>,
): Promise<void> {
  const dsn = Deno.env.get("SENTRY_DSN_BACKEND");
  if (!dsn) return;
  const parsed = parseSentryDsn(dsn);
  if (!parsed) return;
  const eventId = randomHex(16);
  const payload = {
    event_id: eventId,
    timestamp: Math.floor(Date.now() / 1000),
    platform: "javascript",
    level: "error",
    message: { formatted: message },
    exception: { values: [{ type: "BackendError", value: message }] },
    tags: Object.fromEntries(Object.entries(tags).map(([key, value]) => [key, String(value)])),
    extra: { function_name: functionName },
  };
  const envelope = `${JSON.stringify({ event_id: eventId, sentry_version: "7" })}\n${JSON.stringify(payload)}\n`;
  await fetchWithTimeout(
    `${parsed.origin}/api/${parsed.projectId}/envelope/?sentry_version=7&sentry_key=${encodeURIComponent(parsed.publicKey)}`,
    {
      method: "POST",
      headers: { "content-type": "application/x-sentry-envelope" },
      body: envelope,
    },
  );
}

async function sendPostHog(
  functionName: string,
  message: string,
  tags: Record<string, Scalar>,
): Promise<void> {
  const apiKey = Deno.env.get("POSTHOG_API_KEY");
  if (!apiKey) return;
  const host = parseHttpsBaseUrl(Deno.env.get("POSTHOG_HOST")?.trim() || "https://app.posthog.com");
  if (!host) return;
  await fetchWithTimeout(`${host}/capture/`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      api_key: apiKey,
      event: "backend_error",
      distinct_id: "dharma-daily-backend",
      properties: {
        function_name: functionName,
        error_type: "BackendError",
        error_message: message,
        ...tags,
      },
    }),
  });
}

function parseSentryDsn(
  value: string,
): { origin: string; publicKey: string; projectId: string } | null {
  try {
    const url = new URL(value);
    const publicKey = decodeURIComponent(url.username);
    const projectId = url.pathname.replace(/^\//, "");
    if (!publicKey || !projectId || url.protocol !== "https:") return null;
    return { origin: url.origin, publicKey, projectId };
  } catch {
    return null;
  }
}

function parseHttpsBaseUrl(value: string): string | null {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || !url.hostname) return null;
    return `${url.origin}${url.pathname.replace(/\/$/, "")}`;
  } catch {
    return null;
  }
}

function randomHex(byteLength: number): string {
  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);
  return [...bytes].map((value) => value.toString(16).padStart(2, "0")).join("");
}

async function fetchWithTimeout(url: string, init: RequestInit): Promise<void> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REPORT_TIMEOUT_MS);
  try {
    await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}
