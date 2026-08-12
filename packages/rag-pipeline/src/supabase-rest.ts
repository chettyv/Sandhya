import type { StructuredAnswer } from "@dharma-daily/shared-types";

import { validateStructuredAnswer } from "./providers.js";

import type { CachedRagAnswer, RagCachePolicy } from "./index.js";

export interface SupabaseRestOptions {
  url: string;
  serviceRoleKey: string;
  requestTimeoutMs?: number;
}

const MAX_SOURCE_CITATIONS = 6;
const MAX_RETRIEVED_PASSAGE_IDS = 20;
const DEFAULT_REQUEST_TIMEOUT_MS = 30_000;
const CACHE_TTL_DAYS = 90;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export interface RetrievedPassage {
  passage_id: string;
  commentary_id: string | null;
  text_id: string;
  title: string;
  section: string | null;
  verse_number: string | null;
  chunk_text: string;
  content_type: "translation" | "commentary" | "combined";
  licence: "public_domain" | "licensed" | "original";
  tradition: string;
  language: string;
  source_url: string | null;
  similarity: number;
}

export class SupabaseRagStore {
  private readonly url: string;
  private readonly serviceRoleKey: string;
  private readonly requestTimeoutMs: number;

  constructor(options: SupabaseRestOptions) {
    this.url = options.url.replace(/\/$/, "");
    this.serviceRoleKey = options.serviceRoleKey;
    this.requestTimeoutMs = normalizeRequestTimeoutMs(options.requestTimeoutMs);
  }

  async getCachedAnswer(
    questionHash: string,
    policy: RagCachePolicy,
  ): Promise<CachedRagAnswer | null> {
    const response = await this.request(
      `/rest/v1/cached_answers?question_hash=eq.${encodeURIComponent(questionHash)}&expires_at=gt.${encodeURIComponent(new Date().toISOString())}&select=structured_response,retrieved_passage_ids`,
      { method: "GET" },
    );
    const rows = (await response.json()) as Array<{
      structured_response: StructuredAnswer;
      retrieved_passage_ids: string[] | null;
    }>;
    const row = rows[0];
    if (!row) {
      return null;
    }
    const retrievedPassageIds = row.retrieved_passage_ids ?? [];
    if (!isValidCachePayload(row.structured_response, retrievedPassageIds)) {
      return null;
    }
    try {
      const rightsResponse = await this.request("/rest/v1/rpc/cached_answer_sources_are_allowed", {
        method: "POST",
        body: JSON.stringify({
          p_retrieved_ids: retrievedPassageIds,
          p_allowed_licences: policy.allowedLicences,
          p_content_types: policy.contentTypes,
          p_tradition_filter: policy.traditionFilter,
          p_languages: policy.languages,
          p_embedding_model: policy.embeddingModel,
        }),
      });
      if (!parseRpcBoolean(await rightsResponse.json())) {
        return null;
      }
    } catch {
      // A cache hit must fail closed if the current source-rights decision
      // cannot be evaluated. Retrieval can still attempt a fresh answer.
      return null;
    }
    return {
      answer: row.structured_response,
      retrievedPassageIds,
    };
  }

  async recordCacheHit(questionHash: string): Promise<void> {
    await this.request("/rest/v1/rpc/record_cached_answer_hit", {
      method: "POST",
      body: JSON.stringify({ p_question_hash: questionHash }),
    });
  }

  async putCachedAnswer(
    questionHash: string,
    answer: StructuredAnswer,
    retrievedPassageIds: string[],
  ): Promise<void> {
    assertValidCachePayload(answer, retrievedPassageIds);
    await this.request("/rest/v1/cached_answers?on_conflict=question_hash", {
      method: "POST",
      headers: { prefer: "resolution=merge-duplicates" },
      body: JSON.stringify({
        question_hash: questionHash,
        structured_response: answer,
        retrieved_passage_ids: retrievedPassageIds,
        expires_at: new Date(Date.now() + CACHE_TTL_DAYS * 24 * 60 * 60 * 1000).toISOString(),
      }),
    });
  }

  async retrievePassages(options: {
    embedding: number[];
    embeddingModel: string;
    matchCount: number;
    allowedLicences: string[];
    contentTypes: string[];
    traditionFilter: string;
    languages?: string[];
    minSimilarity?: number;
    queryText?: string;
    keywordWeight?: number;
  }): Promise<RetrievedPassage[]> {
    assertValidEmbedding(options.embedding);
    const response = await this.request("/rest/v1/rpc/match_passage_embeddings", {
      method: "POST",
      body: JSON.stringify({
        query_embedding: `[${options.embedding.join(",")}]`,
        embedding_model: options.embeddingModel,
        match_count: options.matchCount,
        allowed_licences: options.allowedLicences,
        content_types: options.contentTypes,
        tradition_filter: options.traditionFilter,
        languages: options.languages ?? null,
        min_similarity: options.minSimilarity ?? 0,
        query_text: options.queryText ?? null,
        keyword_weight: options.keywordWeight ?? 0.15,
      }),
    });
    return parseRetrievedPassages(await response.json());
  }

  private async request(path: string, init: RequestInit): Promise<Response> {
    const headers = new Headers(init.headers);
    headers.set("apikey", this.serviceRoleKey);
    headers.set("authorization", `Bearer ${this.serviceRoleKey}`);
    if (!headers.has("content-type") && init.body) {
      headers.set("content-type", "application/json");
    }

    const response = await fetchWithRetry(
      `${this.url}${path}`,
      {
        ...init,
        headers,
      },
      4,
      this.requestTimeoutMs,
    );

    if (!response.ok) {
      throw new Error(`Supabase request failed: ${response.status}`);
    }

    return response;
  }
}

function parseRpcBoolean(value: unknown): boolean {
  if (value === true || value === false) return value;
  if (Array.isArray(value)) return value.length === 1 && parseRpcBoolean(value[0]);
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    if ("allowed" in record) return record.allowed === true;
    if ("cached_answer_sources_are_allowed" in record) {
      return record.cached_answer_sources_are_allowed === true;
    }
    const values = Object.values(record);
    return values.length === 1 && parseRpcBoolean(values[0]);
  }
  return false;
}

function assertValidEmbedding(embedding: number[]): void {
  if (!Array.isArray(embedding) || embedding.length === 0 || !embedding.every(Number.isFinite)) {
    throw new Error("Embedding must be a non-empty numeric vector.");
  }
}

function parseRetrievedPassages(value: unknown): RetrievedPassage[] {
  if (!Array.isArray(value) || !value.every(isRetrievedPassage)) {
    throw new Error("Supabase retrieval response failed validation.");
  }
  return value;
}

function isRetrievedPassage(value: unknown): value is RetrievedPassage {
  if (!value || typeof value !== "object") {
    return false;
  }
  const row = value as Partial<RetrievedPassage>;
  return (
    typeof row.passage_id === "string" &&
    UUID_PATTERN.test(row.passage_id) &&
    (row.commentary_id === null ||
      (typeof row.commentary_id === "string" && UUID_PATTERN.test(row.commentary_id))) &&
    typeof row.text_id === "string" &&
    UUID_PATTERN.test(row.text_id) &&
    typeof row.title === "string" &&
    row.title.trim().length > 0 &&
    (row.section === null || typeof row.section === "string") &&
    (row.verse_number === null || typeof row.verse_number === "string") &&
    typeof row.chunk_text === "string" &&
    row.chunk_text.trim().length > 0 &&
    (row.content_type === "translation" ||
      row.content_type === "commentary" ||
      row.content_type === "combined") &&
    (row.licence === "public_domain" || row.licence === "licensed" || row.licence === "original") &&
    typeof row.tradition === "string" &&
    row.tradition.trim().length > 0 &&
    typeof row.language === "string" &&
    row.language.trim().length > 0 &&
    (row.source_url === null || typeof row.source_url === "string") &&
    typeof row.similarity === "number" &&
    Number.isFinite(row.similarity)
  );
}

function assertValidCachePayload(answer: StructuredAnswer, retrievedPassageIds: string[]): void {
  validateStructuredAnswer(answer);
  if (!cachePayloadMatchesPersistenceConstraints(answer, retrievedPassageIds)) {
    throw new Error("Cached answer failed persistence validation.");
  }
}

function isValidCachePayload(answer: StructuredAnswer, retrievedPassageIds: string[]): boolean {
  try {
    assertValidCachePayload(answer, retrievedPassageIds);
    return true;
  } catch {
    return false;
  }
}

function cachePayloadMatchesPersistenceConstraints(
  answer: StructuredAnswer,
  retrievedPassageIds: string[],
): boolean {
  if (
    retrievedPassageIds.length === 0 ||
    answer.sources.length === 0 ||
    retrievedPassageIds.length > MAX_RETRIEVED_PASSAGE_IDS ||
    !retrievedPassageIds.every((id) => UUID_PATTERN.test(id))
  ) {
    return false;
  }
  if (new Set(retrievedPassageIds).size !== retrievedPassageIds.length) {
    return false;
  }

  if (answer.sources.length > MAX_SOURCE_CITATIONS) {
    return false;
  }

  const retrievedIds = new Set(retrievedPassageIds);
  const citedIds = new Set<string>();
  return answer.sources.every((source) => {
    if (citedIds.has(source.passage_id)) {
      return false;
    }
    citedIds.add(source.passage_id);
    return retrievedIds.has(source.passage_id);
  });
}

async function fetchWithRetry(
  url: string,
  init: RequestInit,
  attempts = 4,
  timeoutMs = DEFAULT_REQUEST_TIMEOUT_MS,
): Promise<Response> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, { ...init, signal: controller.signal });
      if (!isRetryableStatus(response.status) || attempt === attempts) {
        return response;
      }
      await response.body?.cancel();
      await sleep(backoffMs(attempt));
    } catch (error) {
      lastError = error;
      if (attempt === attempts) {
        throw error;
      }
      await sleep(backoffMs(attempt));
    } finally {
      clearTimeout(timeout);
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Request failed after retries.");
}

function normalizeRequestTimeoutMs(value: number | undefined): number {
  if (value === undefined) {
    return DEFAULT_REQUEST_TIMEOUT_MS;
  }
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error("requestTimeoutMs must be a positive integer.");
  }
  return value;
}

function isRetryableStatus(status: number): boolean {
  return status === 408 || status === 409 || status === 425 || status === 429 || status >= 500;
}

function backoffMs(attempt: number): number {
  return Math.min(1_000 * 2 ** (attempt - 1), 8_000);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
