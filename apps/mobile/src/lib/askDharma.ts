import { supabase } from "./supabase";
import { captureMobileError, track } from "./telemetry";

import type { StructuredAnswer } from "@/types/content";

export type AskResult = {
  answer: StructuredAnswer;
  conversationId: string;
  messageId: string;
  cache: string;
  retrievedPassageIds: string[];
  quota?: {
    plan: string;
    used: number;
    limit: number;
    remaining: number | null;
  };
};

export type AskStage = "request" | "authenticated" | "retrieving" | "generating" | "persisting";

export class AskRequestError extends Error {
  constructor(
    message: string,
    readonly code?: string,
    readonly retryAfterSeconds?: number,
  ) {
    super(message);
    this.name = "AskRequestError";
  }
}

type AskEnvelope = {
  answer?: StructuredAnswer;
  structured_response?: StructuredAnswer;
  conversation_id?: string;
  message_id?: string;
  cache?: string;
  retrieved_passage_ids?: string[];
  quota?: AskResult["quota"];
};

type AskStreamEvent = {
  type?: unknown;
  stage?: unknown;
  text?: unknown;
  response?: unknown;
  error?: unknown;
  code?: unknown;
  retry_after_seconds?: unknown;
};

type StreamFailure = {
  message: string;
  code?: string;
  retryAfterSeconds?: number;
};

const ASK_REQUEST_TIMEOUT_MS = 45_000;
const MAX_RETRIEVED_PASSAGE_IDS = 20;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function askDharma(
  question: string,
  signal?: AbortSignal,
  options?: {
    conversationId?: string;
    traditionPreference?: string;
    onStatus?: (stage: AskStage) => void;
    onText?: (text: string) => void;
    onReset?: () => void;
  },
): Promise<AskResult> {
  const baseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

  if (!baseUrl || !anonKey || !supabase) {
    throw new Error(
      "Dharma Daily is not connected to its source library yet. Add the public Supabase environment values to enable grounded answers.",
    );
  }

  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw sessionError;
  const accessToken = sessionData.session?.access_token;
  if (!accessToken) {
    throw new AskRequestError(
      "Please sign in to ask grounded questions and keep your conversation history.",
      "auth_required",
    );
  }

  track("ask_submitted");
  const requestController = new AbortController();
  let timedOut = false;
  const timeout = setTimeout(() => {
    timedOut = true;
    requestController.abort();
  }, ASK_REQUEST_TIMEOUT_MS);
  const abortRequest = () => requestController.abort();
  if (signal) {
    if (signal.aborted) requestController.abort();
    else signal.addEventListener("abort", abortRequest, { once: true });
  }

  try {
    const response = await fetch(`${baseUrl}/functions/v1/ask`, {
      method: "POST",
      signal: requestController.signal,
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream, application/json",
        apikey: anonKey,
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        question,
        stream: true,
        ...(options?.conversationId ? { conversation_id: options.conversationId } : {}),
        ...(options?.traditionPreference
          ? { tradition_preference: options.traditionPreference }
          : {}),
      }),
    });

    const contentType = response.headers.get("content-type") ?? "";
    if (contentType.includes("text/event-stream")) {
      try {
        const data = await parseStreamingResponse(
          response,
          options?.onStatus,
          options?.onText,
          options?.onReset,
        );
        return validateAskResult(data);
      } catch (error) {
        if (timedOut) throw error;
        track("ask_failed", {
          code:
            error instanceof AskRequestError ? (error.code ?? "stream_failed") : "stream_failed",
        });
        throw error;
      }
    }

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as {
        error?: string;
        code?: string;
        retry_after_seconds?: number;
      } | null;
      track("ask_failed", { code: body?.code ?? "unknown" });
      throw new AskRequestError(
        body?.error || "The source library could not answer right now. Please try again.",
        body?.code,
        typeof body?.retry_after_seconds === "number" ? body.retry_after_seconds : undefined,
      );
    }

    const data = (await response.json()) as AskEnvelope;
    return validateAskResult(data);
  } catch (error) {
    if (timedOut) {
      track("ask_failed", { code: "request_timeout" });
      throw new AskRequestError(
        "The source library took too long to respond. Please try again.",
        "request_timeout",
      );
    }
    captureMobileError(error, { feature: "ask" });
    throw error;
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener("abort", abortRequest);
  }
}

function validateAskResult(data: AskEnvelope): AskResult {
  if (!data || typeof data !== "object") {
    captureMobileError(new Error("Ask response was not an object."), { feature: "ask" });
    throw new AskRequestError(
      "The source library returned an invalid answer. Please try again.",
      "invalid_response",
    );
  }
  const answer = data.answer ?? data.structured_response;
  const retrievedPassageIds = data.retrieved_passage_ids;
  const retrievedSet = new Set(Array.isArray(retrievedPassageIds) ? retrievedPassageIds : []);
  const citationsBacked =
    isStructuredAnswer(answer) &&
    answer.sources.every((source) => retrievedSet.has(source.passage_id));
  if (
    !isStructuredAnswer(answer) ||
    !isValidUuid(data.conversation_id) ||
    !isValidUuid(data.message_id) ||
    !isValidRetrievedPassageIds(retrievedPassageIds) ||
    !citationsBacked
  ) {
    captureMobileError(new Error("Ask response was incomplete."), { feature: "ask" });
    throw new AskRequestError(
      "The source library returned an incomplete or unsupported answer. Please try again.",
      "invalid_response",
    );
  }

  track("ask_succeeded", { cache: data.cache ?? "miss" });

  return {
    answer,
    conversationId: data.conversation_id,
    messageId: data.message_id,
    cache: data.cache ?? "miss",
    retrievedPassageIds,
    quota: data.quota,
  };
}

function isValidRetrievedPassageIds(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.length <= MAX_RETRIEVED_PASSAGE_IDS &&
    value.every((id) => isValidUuid(id)) &&
    new Set(value).size === value.length
  );
}

function isValidUuid(value: unknown): value is string {
  return typeof value === "string" && UUID_PATTERN.test(value);
}

function isStructuredAnswer(value: unknown): value is StructuredAnswer {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  const sources = candidate.sources;
  const traditionNotes = candidate.tradition_notes;

  return (
    isNonEmptyString(candidate.answer) &&
    isNonEmptyString(candidate.summary) &&
    Array.isArray(sources) &&
    sources.every(
      (source) =>
        Boolean(source) &&
        typeof source === "object" &&
        isNonEmptyString((source as Record<string, unknown>).passage_id) &&
        isNonEmptyString((source as Record<string, unknown>).title) &&
        isNonEmptyString((source as Record<string, unknown>).location) &&
        isNonEmptyString((source as Record<string, unknown>).relevance),
    ) &&
    Array.isArray(traditionNotes) &&
    traditionNotes.every((note) => typeof note === "string") &&
    (candidate.confidence === "low" ||
      candidate.confidence === "medium" ||
      candidate.confidence === "high") &&
    (candidate.safety_note === null || typeof candidate.safety_note === "string") &&
    (candidate.suggested_practice === null || typeof candidate.suggested_practice === "string")
  );
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

async function parseStreamingResponse(
  response: Response,
  onStatus?: (stage: AskStage) => void,
  onText?: (text: string) => void,
  onReset?: () => void,
): Promise<AskEnvelope> {
  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let completed: AskEnvelope | null = null;
  let streamError: StreamFailure | null = null;

  const consume = (chunk: string) => {
    buffer += chunk;
    const events = buffer.split(/\r?\n\r?\n/);
    buffer = events.pop() ?? "";
    for (const event of events) processEvent(event);
  };

  const processEvent = (event: string) => {
    const data = event
      .split(/\r?\n/)
      .filter((line) => line.startsWith("data:"))
      .map((line) => line.slice(5).trim())
      .join("\n");
    if (!data) return;

    let parsed: AskStreamEvent;
    try {
      parsed = JSON.parse(data) as AskStreamEvent;
    } catch {
      streamError = new AskRequestError(
        "The source library returned an invalid streaming response. Please try again.",
        "invalid_response",
      );
      return;
    }

    if (parsed.type === "started") onStatus?.("request");
    if (parsed.type === "status" && isAskStage(parsed.stage)) onStatus?.(parsed.stage);
    if (parsed.type === "text" && typeof parsed.text === "string") onText?.(parsed.text);
    if (parsed.type === "reset") onReset?.();
    if (parsed.type === "complete" && isAskEnvelope(parsed.response)) {
      completed = parsed.response;
    }
    if (parsed.type === "error") {
      streamError = new AskRequestError(
        typeof parsed.error === "string" ? parsed.error : "The source library could not answer.",
        typeof parsed.code === "string" ? parsed.code : "request_failed",
        typeof parsed.retry_after_seconds === "number" ? parsed.retry_after_seconds : undefined,
      );
    }
  };

  if (reader) {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) consume(decoder.decode(value, { stream: true }));
    }
    consume(decoder.decode());
  } else {
    consume(await response.text());
  }
  if (buffer.trim()) processEvent(buffer);

  // The parser callback mutates this value, which TypeScript cannot infer
  // across the callback boundary after the final buffered event is handled.
  const failure = streamError as StreamFailure | null;
  if (failure) {
    throw new AskRequestError(failure.message, failure.code, failure.retryAfterSeconds);
  }
  if (!completed)
    throw new AskRequestError(
      "The source library returned an incomplete streaming response. Please try again.",
      "invalid_response",
    );
  return completed;
}

function isAskStage(value: unknown): value is AskStage {
  return (
    value === "request" ||
    value === "authenticated" ||
    value === "retrieving" ||
    value === "generating" ||
    value === "persisting"
  );
}

function isAskEnvelope(value: unknown): value is AskEnvelope {
  return Boolean(value && typeof value === "object");
}
