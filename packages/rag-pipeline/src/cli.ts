#!/usr/bin/env node
import {
  AnthropicJsonProvider,
  OpenAICompatibleJsonProvider,
  OpenAIEmbeddingProvider,
  RagPipeline,
  SupabaseRagStore,
  type LlmProvider,
} from "./index.js";

const args = process.argv.slice(2);
if (args[0] === "ask") args.shift();
const question = args.join(" ").trim();

if (!question) {
  console.error('Usage: rag ask "What is dharma?"');
  process.exit(1);
}

const supabaseUrl = requireEnv("SUPABASE_URL");
const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
const openAiKey = requireEnv("OPENAI_API_KEY");
const requestTimeoutMs = readPositiveIntegerEnv("RAG_FETCH_TIMEOUT_MS", 30_000);
const embeddingDimensions = readPositiveIntegerEnv("EMBEDDING_DIMENSIONS", 1536);

const pipeline = new RagPipeline({
  store: new SupabaseRagStore({ url: supabaseUrl, serviceRoleKey, requestTimeoutMs }),
  embeddings: new OpenAIEmbeddingProvider({
    apiKey: openAiKey,
    model: process.env.EMBEDDING_MODEL?.trim() || "text-embedding-3-small",
    dimensions: embeddingDimensions,
    requestTimeoutMs,
  }),
  llm: createLlmProvider(),
});

const askOptions = {
  question,
  useCache: process.env.RAG_SKIP_CACHE !== "1",
  writeCache: process.env.RAG_SKIP_CACHE !== "1",
  matchCount: readBoundedIntegerEnv("RAG_MATCH_COUNT", 8, 1, 20),
  minSimilarity: readBoundedNumberEnv("RAG_MIN_SIMILARITY", 0, 0, 1),
  keywordWeight: readNumberEnv("RAG_KEYWORD_WEIGHT", 0.15),
  maxContextChars: readPositiveIntegerEnv("RAG_MAX_CONTEXT_CHARS", 12_000),
  maxQuestionChars: readPositiveIntegerEnv("RAG_MAX_QUESTION_CHARS", 2_000),
  ...(process.env.TRADITION_PREF ? { traditionPreference: process.env.TRADITION_PREF } : {}),
};

const result = await pipeline.ask(askOptions);

console.info(JSON.stringify(result, null, 2));

function createLlmProvider(): LlmProvider {
  const provider = process.env.LLM_PROVIDER?.trim() || "deepseek";
  const maxOutputTokens = readPositiveIntegerEnv("LLM_MAX_OUTPUT_TOKENS", 1200);

  if (provider === "deepseek") {
    return new OpenAICompatibleJsonProvider({
      apiKey: requireEnv("DEEPSEEK_API_KEY"),
      baseUrl: "https://api.deepseek.com",
      model: process.env.LLM_DEFAULT_MODEL?.trim() || "deepseek-v4-flash",
      maxOutputTokens,
      thinking: { type: "disabled" },
      requestTimeoutMs,
    });
  }

  if (provider === "openai-compatible") {
    return new OpenAICompatibleJsonProvider({
      apiKey: requireEnv("OPENAI_COMPATIBLE_API_KEY"),
      baseUrl: process.env.OPENAI_COMPATIBLE_BASE_URL?.trim() || "https://api.openai.com/v1",
      model: process.env.LLM_DEFAULT_MODEL?.trim() || "gpt-4.1-mini",
      maxOutputTokens,
      requestTimeoutMs,
    });
  }

  if (provider !== "anthropic") {
    throw new Error(`Unsupported LLM_PROVIDER: ${provider}`);
  }

  return new AnthropicJsonProvider({
    apiKey: requireEnv("ANTHROPIC_API_KEY"),
    model: process.env.LLM_DEFAULT_MODEL?.trim() || "claude-haiku-4-5",
    maxOutputTokens,
    requestTimeoutMs,
  });
}

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    console.error(`Missing required env var: ${name}`);
    process.exit(1);
  }

  return value;
}

function readNumberEnv(name: string, fallback: number): number {
  const raw = process.env[name];
  if (raw === undefined || raw.trim() === "") {
    return fallback;
  }
  const value = Number(raw);
  if (!Number.isFinite(value)) {
    throw new Error(`Invalid numeric env var: ${name}`);
  }
  return value;
}

function readPositiveIntegerEnv(name: string, fallback: number): number {
  const value = readNumberEnv(name, fallback);
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`Invalid positive integer env var: ${name}`);
  }
  return value;
}

function readBoundedIntegerEnv(name: string, fallback: number, min: number, max: number): number {
  const value = readPositiveIntegerEnv(name, fallback);
  if (value < min || value > max) {
    throw new Error(`Invalid bounded integer env var: ${name}`);
  }
  return value;
}

function readBoundedNumberEnv(name: string, fallback: number, min: number, max: number): number {
  const value = readNumberEnv(name, fallback);
  if (value < min || value > max) {
    throw new Error(`Invalid bounded numeric env var: ${name}`);
  }
  return value;
}
