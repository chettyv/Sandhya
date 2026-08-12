#!/usr/bin/env node
import { createReadStream } from "node:fs";
import { createInterface } from "node:readline/promises";
import { pathToFileURL } from "node:url";

import {
  assertProductionRights,
  loadSourceRightsInventory,
  type SourceRightsRecord,
} from "./source-rights.js";
import { countTokens } from "./token-count.js";

export interface PreparedChunk {
  source_path: string;
  source_key: string;
  chunk_hash: string;
  language: string;
  text_slug: string;
  text_title: string;
  category: "shruti" | "smriti" | "itihasa" | "purana" | "agama" | "modern_commentary";
  tradition_primary: string;
  licence: "public_domain" | "licensed" | "original";
  copyright_status: string | null;
  can_store: boolean;
  can_show_excerpts: boolean;
  can_embed: boolean;
  source_metadata: Record<string, unknown>;
  source_url: string | null;
  translator: string | null;
  section: string | null;
  sub_section?: string | null;
  verse_number: string;
  order_index: number;
  original_text: string | null;
  transliteration: string | null;
  translation_en: string | null;
  translation_hi: string | null;
  chunk_text: string;
}

interface TextRow {
  id: string;
}

interface PassageRow {
  id: string;
}

interface SourceRow {
  id: string;
}

let runtime: IngestRuntime | null = null;

interface IngestRuntime {
  supabaseUrl: string;
  serviceRoleKey: string;
  openAiKey: string;
  embeddingModel: string;
  expectedEmbeddingDimensions: number;
  embeddingInputCostPerMillion: number;
  requestTimeoutMs: number;
}

interface PendingEmbedding {
  chunk: PreparedChunk;
  passageId: string;
  sourceId: string;
}

const MAX_EMBEDDING_BATCH_SIZE = 100;

interface IngestOptions {
  inputFile: string;
  limit: number;
  forceReembed: boolean;
  dryRun: boolean;
  allowStaging: boolean;
  startAfterHash: string | undefined;
}

if (isCliEntry()) {
  await main(parseIngestOptions(process.argv));
}

async function main(options: IngestOptions): Promise<void> {
  runtime = {
    supabaseUrl: options.dryRun ? "" : requireEnv("SUPABASE_URL").replace(/\/$/, ""),
    serviceRoleKey: options.dryRun ? "" : requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
    openAiKey: options.dryRun ? "" : requireEnv("OPENAI_API_KEY"),
    embeddingModel: process.env.EMBEDDING_MODEL?.trim() || "text-embedding-3-small",
    expectedEmbeddingDimensions: readPositiveIntegerEnv("EMBEDDING_DIMENSIONS", 1536),
    embeddingInputCostPerMillion: readNonNegativeNumberEnv("EMBEDDING_INPUT_COST_PER_MILLION", 0),
    requestTimeoutMs: readPositiveIntegerEnv("RAG_FETCH_TIMEOUT_MS", 30_000),
  };

  const rightsInventory = options.allowStaging
    ? null
    : await loadSourceRightsInventory("docs/source_inventory_template.csv");
  await preflightPreparedChunks(options, rightsInventory);
  const lines = createInterface({
    input: createReadStream(options.inputFile, { encoding: "utf8" }),
    crlfDelay: Number.POSITIVE_INFINITY,
  });
  let ingested = 0;
  let skippedExisting = 0;
  let skippedBeforeStart = 0;
  let sawStartHash = options.startAfterHash ? false : true;
  let embeddingTokens = 0;
  const pendingEmbeddings: PendingEmbedding[] = [];

  for await (const line of lines) {
    if (ingested >= options.limit) {
      break;
    }

    if (!line.trim()) {
      continue;
    }

    const chunk = JSON.parse(line) as PreparedChunk;
    validatePreparedChunk(chunk);

    if (!sawStartHash) {
      if (chunk.chunk_hash === options.startAfterHash) {
        sawStartHash = true;
      }
      skippedBeforeStart += 1;
      continue;
    }

    if (!chunk.can_store || !chunk.can_embed || !chunk.can_show_excerpts) {
      throw new Error(`Refusing to ingest uncleared source chunk: ${chunk.source_path}`);
    }

    const approvedRights = rightsInventory ? assertProductionRights(chunk, rightsInventory) : null;

    if (options.dryRun) {
      ingested += 1;
      continue;
    }

    const source = await upsertSource(chunk, approvedRights);
    const text = await upsertText(chunk);
    const passage = await upsertPassage(chunk, text.id);

    if (!options.forceReembed && (await embeddingExists(chunk.chunk_hash))) {
      skippedExisting += 1;
    } else {
      pendingEmbeddings.push({ chunk, passageId: passage.id, sourceId: source.id });
      if (pendingEmbeddings.length >= MAX_EMBEDDING_BATCH_SIZE) {
        embeddingTokens += await ingestEmbeddingBatch(pendingEmbeddings.splice(0));
      }
    }

    ingested += 1;

    if (ingested % 25 === 0) {
      console.info(`Processed ${ingested} chunks (${skippedExisting} existing embeddings skipped)`);
    }
  }

  if (options.startAfterHash && !sawStartHash) {
    throw new Error(
      `--start-after-hash value was not found in ${options.inputFile}: ${options.startAfterHash}`,
    );
  }

  if (pendingEmbeddings.length > 0) {
    embeddingTokens += await ingestEmbeddingBatch(pendingEmbeddings.splice(0));
  }

  console.info(
    `${options.dryRun ? "Validated" : "Processed"} ${ingested} chunks ${options.dryRun ? "from" : "into Supabase using"} ${options.dryRun ? options.inputFile : runtime.embeddingModel}.`,
  );
  console.info(`Skipped ${skippedBeforeStart} chunks before resume point.`);
  console.info(`Skipped ${skippedExisting} existing embeddings.`);
  const { embeddingInputCostPerMillion } = getRuntime();
  const estimatedEmbeddingCost = (embeddingTokens / 1_000_000) * embeddingInputCostPerMillion;
  console.info(
    `Embedding usage: ${embeddingTokens} input tokens; estimated cost $${estimatedEmbeddingCost.toFixed(6)}.`,
  );
}

async function preflightPreparedChunks(
  options: IngestOptions,
  rightsInventory: Map<string, SourceRightsRecord[]> | null,
): Promise<void> {
  const lines = createInterface({
    input: createReadStream(options.inputFile, { encoding: "utf8" }),
    crlfDelay: Number.POSITIVE_INFINITY,
  });
  const seenHashes = new Set<string>();
  let selected = 0;
  let sawStartHash = options.startAfterHash ? false : true;

  for await (const line of lines) {
    if (selected >= options.limit) break;
    if (!line.trim()) continue;

    const chunk = JSON.parse(line) as PreparedChunk;
    validatePreparedChunk(chunk);

    if (!sawStartHash) {
      if (chunk.chunk_hash === options.startAfterHash) sawStartHash = true;
      continue;
    }

    if (seenHashes.has(chunk.chunk_hash)) {
      throw new Error(
        `Refusing duplicate prepared chunk hash before ingestion: ${chunk.chunk_hash}`,
      );
    }
    seenHashes.add(chunk.chunk_hash);

    if (!chunk.can_store || !chunk.can_embed || !chunk.can_show_excerpts) {
      throw new Error(`Refusing to ingest uncleared source chunk: ${chunk.source_path}`);
    }
    if (rightsInventory) assertProductionRights(chunk, rightsInventory);
    selected += 1;
  }

  if (options.startAfterHash && !sawStartHash) {
    throw new Error(
      `--start-after-hash value was not found in ${options.inputFile}: ${options.startAfterHash}`,
    );
  }
  console.info(`Preflight validated ${selected} chunks before any ingestion writes.`);
}

async function upsertSource(
  chunk: PreparedChunk,
  approvedRights: SourceRightsRecord | null,
): Promise<SourceRow> {
  const rows = await rest<SourceRow[]>("/content_sources?on_conflict=source_key&select=id", {
    method: "POST",
    headers: { prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify({
      source_key: chunk.source_key,
      title: chunk.text_title,
      language: chunk.language,
      translator: chunk.translator,
      source_url: chunk.source_url,
      licence: chunk.licence,
      copyright_status: chunk.copyright_status,
      can_store: chunk.can_store,
      can_show_excerpts: chunk.can_show_excerpts,
      can_embed: chunk.can_embed,
      metadata: {
        ...chunk.source_metadata,
        source_path: chunk.source_path,
        ...(approvedRights
          ? {
              rights_tracker: {
                work_id: approvedRights.work_id,
                source_url: approvedRights.source_url,
                status: approvedRights.status,
                permission_needed: approvedRights.permission_needed,
                review_needed: approvedRights.review_needed,
                can_store: approvedRights.can_store,
                can_show_excerpts: approvedRights.can_show_excerpts,
                can_embed_full_text: approvedRights.can_embed_full_text,
                can_use_for_rag: approvedRights.can_use_for_rag,
              },
            }
          : {}),
      },
      updated_at: new Date().toISOString(),
    }),
  });
  const row = rows[0];
  if (!row) throw new Error(`Could not upsert source ${chunk.source_key}`);
  return row;
}

async function upsertText(chunk: PreparedChunk): Promise<TextRow> {
  const rows = await rest<TextRow[]>("/texts?on_conflict=slug&select=id", {
    method: "POST",
    headers: { prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify({
      slug: chunk.text_slug,
      title: chunk.text_title,
      category: chunk.category,
      tradition_primary: chunk.tradition_primary,
      description: `Imported from ${chunk.source_path}`,
    }),
  });
  const row = rows[0];
  if (!row) throw new Error(`Could not upsert text ${chunk.text_slug}`);
  return row;
}

async function upsertPassage(chunk: PreparedChunk, textId: string): Promise<PassageRow> {
  const rows = await rest<PassageRow[]>("/passages?on_conflict=text_id,verse_number&select=id", {
    method: "POST",
    headers: { prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify({
      text_id: textId,
      section: chunk.section,
      sub_section: chunk.sub_section ?? null,
      verse_number: chunk.verse_number,
      order_index: chunk.order_index,
      original_text: chunk.original_text,
      transliteration: chunk.transliteration,
      translation_en: chunk.translation_en,
      translation_hi: chunk.translation_hi,
      word_meanings: {
        import: {
          source_path: chunk.source_path,
          source_key: chunk.source_key,
          chunk_hash: chunk.chunk_hash,
          language: chunk.language,
          licence: chunk.licence,
          source_url: chunk.source_url,
        },
      },
    }),
  });
  const row = rows[0];
  if (!row) throw new Error(`Could not upsert passage ${chunk.text_slug} ${chunk.verse_number}`);
  return row;
}

async function upsertEmbedding(
  chunk: PreparedChunk,
  passageId: string,
  sourceDocumentId: string,
  embedding: number[],
): Promise<void> {
  const { embeddingModel } = getRuntime();
  await rest("/passage_embeddings?on_conflict=embedding_model,chunk_hash", {
    method: "POST",
    headers: { prefer: "resolution=merge-duplicates" },
    body: JSON.stringify({
      passage_id: passageId,
      commentary_id: null,
      content_type: "translation",
      source_document_id: sourceDocumentId,
      chunk_hash: chunk.chunk_hash,
      embedding: `[${embedding.join(",")}]`,
      embedding_model: embeddingModel,
      chunk_text: chunk.chunk_text,
      tokens: countTokens(chunk.chunk_text),
      metadata: {
        source_path: chunk.source_path,
        source_key: chunk.source_key,
        source_url: chunk.source_url,
        language: chunk.language,
        verse_number: chunk.verse_number,
      },
    }),
  });
}

async function embeddingExists(chunkHash: string): Promise<boolean> {
  const { embeddingModel } = getRuntime();
  const rows = await rest<Array<{ id: string }>>(
    `/passage_embeddings?embedding_model=eq.${encodeURIComponent(embeddingModel)}&chunk_hash=eq.${encodeURIComponent(chunkHash)}&select=id&limit=1`,
    { method: "GET" },
  );
  return rows.length > 0;
}

async function ingestEmbeddingBatch(batch: PendingEmbedding[]): Promise<number> {
  const result = await embedBatch(batch.map((item) => item.chunk.chunk_text));
  const { embeddingModel, embeddingInputCostPerMillion } = getRuntime();
  await rest("/rpc/record_ai_cost", {
    method: "POST",
    body: JSON.stringify({
      p_user_id: null,
      p_purpose: "embedding",
      p_model: embeddingModel,
      p_tokens_in: result.tokensIn,
      p_tokens_out: 0,
      p_cost_usd: (result.tokensIn / 1_000_000) * embeddingInputCostPerMillion,
      p_metadata: { operation: "ingest", batch_size: batch.length },
    }),
  });
  const embeddings = result.embeddings;
  for (let index = 0; index < batch.length; index += 1) {
    const item = batch[index];
    const embedding = embeddings[index];
    if (!item || !embedding) {
      throw new Error(`Embedding response omitted batch item ${index}.`);
    }
    await upsertEmbedding(item.chunk, item.passageId, item.sourceId, embedding);
  }
  return result.tokensIn;
}

async function embedBatch(inputs: string[]): Promise<{ embeddings: number[][]; tokensIn: number }> {
  if (inputs.length === 0 || inputs.length > MAX_EMBEDDING_BATCH_SIZE) {
    throw new Error(
      `Embedding batches must contain between 1 and ${MAX_EMBEDDING_BATCH_SIZE} inputs.`,
    );
  }
  const { embeddingModel, expectedEmbeddingDimensions, openAiKey, requestTimeoutMs } = getRuntime();
  const response = await fetchWithRetry(
    "https://api.openai.com/v1/embeddings",
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${openAiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: embeddingModel,
        input: inputs,
        dimensions: expectedEmbeddingDimensions,
      }),
    },
    4,
    requestTimeoutMs,
  );
  if (!response.ok) {
    throw new Error(`OpenAI embedding request failed: ${response.status}`);
  }
  const json = (await response.json()) as {
    data?: Array<{ index?: unknown; embedding?: unknown }>;
    usage?: { prompt_tokens?: unknown; total_tokens?: unknown };
  };
  const rows = json.data;
  if (!Array.isArray(rows) || rows.length !== inputs.length) {
    throw new Error("Embedding response did not include every batch item.");
  }
  const embeddings = new Array<number[]>(inputs.length);
  for (const row of rows) {
    const index = typeof row.index === "number" ? row.index : -1;
    if (!Number.isInteger(index) || index < 0 || index >= inputs.length) {
      throw new Error("Embedding response included an invalid batch index.");
    }
    if (
      !Array.isArray(row.embedding) ||
      !row.embedding.every((value) => typeof value === "number")
    ) {
      throw new Error("Embedding response did not include a numeric embedding.");
    }
    const embedding = row.embedding;
    assertEmbeddingDimensions(embedding, expectedEmbeddingDimensions, embeddingModel);
    if (embeddings[index]) {
      throw new Error("Embedding response included a duplicate batch index.");
    }
    embeddings[index] = embedding;
  }
  if (embeddings.some((embedding) => !embedding)) {
    throw new Error("Embedding response omitted a batch index.");
  }
  const tokensIn = json.usage?.prompt_tokens;
  if (typeof tokensIn !== "number" || !Number.isInteger(tokensIn) || tokensIn < 0) {
    throw new Error("Embedding response did not include valid token usage.");
  }
  return { embeddings, tokensIn };
}

async function rest<T = unknown>(path: string, init: RequestInit): Promise<T> {
  const { serviceRoleKey, supabaseUrl, requestTimeoutMs } = getRuntime();
  const headers = new Headers(init.headers);
  headers.set("apikey", serviceRoleKey);
  headers.set("authorization", `Bearer ${serviceRoleKey}`);
  if (init.body && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }
  const response = await fetchWithRetry(
    `${supabaseUrl}/rest/v1${path}`,
    { ...init, headers },
    4,
    requestTimeoutMs,
  );
  if (!response.ok) {
    throw new Error(`Supabase REST request failed: ${response.status}`);
  }
  if (response.status === 204) {
    return undefined as T;
  }
  return (await response.json()) as T;
}

async function fetchWithRetry(
  url: string,
  init: RequestInit,
  attempts = 4,
  timeoutMs = 30_000,
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

function isRetryableStatus(status: number): boolean {
  return status === 408 || status === 409 || status === 425 || status === 429 || status >= 500;
}

function backoffMs(attempt: number): number {
  return Math.min(1_000 * 2 ** (attempt - 1), 8_000);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function validatePreparedChunk(chunk: PreparedChunk): void {
  if (
    typeof chunk.source_path !== "string" ||
    !chunk.source_path.trim() ||
    typeof chunk.source_key !== "string" ||
    !chunk.source_key.trim() ||
    typeof chunk.chunk_hash !== "string" ||
    !/^[a-f0-9]{64}$/i.test(chunk.chunk_hash) ||
    typeof chunk.language !== "string" ||
    !chunk.language.trim() ||
    typeof chunk.text_slug !== "string" ||
    !chunk.text_slug.trim() ||
    typeof chunk.text_title !== "string" ||
    !chunk.text_title.trim() ||
    !["shruti", "smriti", "itihasa", "purana", "agama", "modern_commentary"].includes(
      chunk.category,
    ) ||
    typeof chunk.tradition_primary !== "string" ||
    !chunk.tradition_primary.trim() ||
    typeof chunk.copyright_status !== "string" ||
    !chunk.copyright_status.trim() ||
    typeof chunk.can_store !== "boolean" ||
    typeof chunk.can_show_excerpts !== "boolean" ||
    typeof chunk.can_embed !== "boolean" ||
    !chunk.source_metadata ||
    typeof chunk.source_metadata !== "object" ||
    Array.isArray(chunk.source_metadata) ||
    (chunk.source_url !== null && typeof chunk.source_url !== "string") ||
    (chunk.translator !== null && typeof chunk.translator !== "string") ||
    (chunk.section !== null && typeof chunk.section !== "string") ||
    (chunk.sub_section !== undefined &&
      chunk.sub_section !== null &&
      typeof chunk.sub_section !== "string") ||
    (chunk.original_text !== null && typeof chunk.original_text !== "string") ||
    (chunk.transliteration !== null && typeof chunk.transliteration !== "string") ||
    (chunk.translation_en !== null && typeof chunk.translation_en !== "string") ||
    (chunk.translation_hi !== null && typeof chunk.translation_hi !== "string") ||
    typeof chunk.verse_number !== "string" ||
    !chunk.verse_number.trim() ||
    typeof chunk.order_index !== "number" ||
    !Number.isInteger(chunk.order_index) ||
    chunk.order_index < 0 ||
    typeof chunk.chunk_text !== "string" ||
    !chunk.chunk_text.trim()
  ) {
    throw new Error(`Invalid prepared chunk shape near source ${chunk.source_path ?? "unknown"}`);
  }
  if (!["public_domain", "licensed", "original"].includes(chunk.licence)) {
    throw new Error(`Invalid licence for prepared chunk: ${chunk.source_path}`);
  }
  if (chunk.licence === "licensed" && !chunk.translator?.trim()) {
    throw new Error(`Licensed prepared chunk is missing translator: ${chunk.source_path}`);
  }
  if (chunk.chunk_text.length < 200) {
    throw new Error(`Prepared chunk is too short for retrieval quality: ${chunk.source_path}`);
  }
  if (chunk.chunk_text.length > 2_400) {
    throw new Error(`Prepared chunk is too long for retrieval quality: ${chunk.source_path}`);
  }
  if (countTokens(chunk.chunk_text) > 600) {
    throw new Error(`Prepared chunk exceeds the 600-token retrieval budget: ${chunk.source_path}`);
  }
  if (!chunk.source_url) {
    throw new Error(`Prepared chunk is missing source_url: ${chunk.source_path}`);
  }
  try {
    const sourceUrl = new URL(chunk.source_url);
    if (sourceUrl.protocol !== "http:" && sourceUrl.protocol !== "https:") {
      throw new Error("invalid protocol");
    }
  } catch {
    throw new Error(`Prepared chunk has an invalid source_url: ${chunk.source_path}`);
  }
}

export function assertEmbeddingDimensions(
  embedding: number[],
  expectedDimensions: number,
  embeddingModel: string,
): void {
  if (embedding.length !== expectedDimensions) {
    throw new Error(
      `Embedding dimension mismatch for ${embeddingModel}: got ${embedding.length}, expected ${expectedDimensions}. ` +
        "Do not ingest vectors until the database vector column and corpus embedding model agree.",
    );
  }
}

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    console.error(`Missing required env var: ${name}`);
    process.exit(1);
  }
  return value;
}

function parseIngestOptions(argv: string[]): IngestOptions {
  const limitArg = argv.find((arg) => arg.startsWith("--limit="));
  const limit = limitArg ? Number(limitArg.slice("--limit=".length)) : Number.POSITIVE_INFINITY;
  if (!Number.isFinite(limit) && limit !== Number.POSITIVE_INFINITY) {
    throw new Error("Invalid --limit value.");
  }
  if (limit <= 0) {
    throw new Error("--limit must be greater than zero.");
  }

  const dryRun = argv.includes("--dry-run");
  const allowStaging = argv.includes("--allow-staging");
  if (allowStaging && !dryRun) {
    throw new Error(
      "--allow-staging is only permitted with --dry-run; production ingestion is always rights-gated.",
    );
  }

  return {
    inputFile: argv[2] ?? "content/_staging/prepared/rag-corpus.jsonl",
    limit,
    forceReembed: argv.includes("--force-reembed"),
    dryRun,
    allowStaging,
    startAfterHash: getArgValueFrom(argv, "--start-after-hash"),
  };
}

function getArgValueFrom(argv: string[], name: string): string | undefined {
  const prefix = `${name}=`;
  return argv.find((arg) => arg.startsWith(prefix))?.slice(prefix.length);
}

function readPositiveIntegerEnv(name: string, fallback: number): number {
  const raw = process.env[name];
  if (raw === undefined || raw.trim() === "") {
    return fallback;
  }
  const value = Number(raw);
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`Invalid positive integer env var: ${name}`);
  }
  return value;
}

function readNonNegativeNumberEnv(name: string, fallback: number): number {
  const raw = process.env[name];
  if (raw === undefined || raw.trim() === "") return fallback;
  const value = Number(raw);
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`Invalid non-negative numeric env var: ${name}`);
  }
  return value;
}

function getRuntime(): IngestRuntime {
  if (!runtime) {
    throw new Error("Ingest runtime has not been initialized.");
  }
  return runtime;
}

function isCliEntry(): boolean {
  const scriptPath = process.argv[1];
  return scriptPath ? import.meta.url === pathToFileURL(scriptPath).href : false;
}
