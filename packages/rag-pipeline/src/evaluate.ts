#!/usr/bin/env node
import { createReadStream, writeFile } from "node:fs";
import { createInterface } from "node:readline/promises";
import { pathToFileURL } from "node:url";
import { promisify } from "node:util";

import {
  AnthropicJsonProvider,
  OpenAICompatibleJsonProvider,
  OpenAIEmbeddingProvider,
  RagPipeline,
  SupabaseRagStore,
  type AskOptions,
  type AskResult,
  type LlmProvider,
} from "./index.js";

export interface EvalCase {
  id?: string;
  question: string;
  traditionPreference?: string;
  expectedPassageIds?: string[];
  expectedSourceTitles?: string[];
  expectedRetrievedLanguages?: string[];
  expectedRetrievedTraditions?: string[];
  expectedRetrievedContentTypes?: string[];
  mustContain?: string[];
  minConfidence?: "low" | "medium" | "high";
  minRetrieved?: number;
  minCited?: number;
  expectedSafetyNote?: string | null;
  expectNoSources?: boolean;
}

export interface EvalCaseResult {
  id: string;
  passed: boolean;
  failures: string[];
  cache: AskResult["cache"];
  modelUsed: string | null;
  retrievedCount: number;
  citedCount: number;
}

const confidenceRank = {
  low: 1,
  medium: 2,
  high: 3,
} as const;

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const DEFAULT_EVAL_FILE = "content/_staging/evals/rag-eval.example.jsonl";
const DEFAULT_CORPUS_FILE = "content/_staging/prepared/rag-corpus.jsonl";
const writeFileAsync = promisify(writeFile);

if (isCliEntry()) {
  const { validateOnly, evalFile, corpusFile, outputFile } = parseCliArgs(process.argv.slice(2));
  const cases = await readEvalCases(evalFile);
  if (validateOnly) {
    await validateEvalCasesAgainstCorpus(cases, corpusFile);
    console.info(
      `Validated ${cases.length} RAG eval cases from ${evalFile} against ${corpusFile}.`,
    );
    process.exit(0);
  }
  const pipeline = createPipeline();
  const results: EvalCaseResult[] = [];

  for (const testCase of cases) {
    const result = await pipeline.ask(toAskOptions(testCase));
    const evaluation = evaluateCase(testCase, result);
    results.push(evaluation);
    console.info(
      `${evaluation.passed ? "PASS" : "FAIL"} ${evaluation.id} ` +
        `retrieved=${evaluation.retrievedCount} cited=${evaluation.citedCount} cache=${evaluation.cache}`,
    );
    for (const failure of evaluation.failures) {
      console.info(`  - ${failure}`);
    }
  }

  const failed = results.filter((result) => !result.passed);
  console.info(`\nRAG eval: ${results.length - failed.length}/${results.length} passed.`);
  if (outputFile) {
    await writeFileAsync(
      outputFile,
      `${JSON.stringify(
        {
          generatedAt: new Date().toISOString(),
          evalFile,
          corpusFile,
          total: results.length,
          passed: results.length - failed.length,
          failed: failed.length,
          results,
        },
        null,
        2,
      )}\n`,
    );
    console.info(`Wrote RAG eval report to ${outputFile}.`);
  }
  if (failed.length > 0) {
    process.exit(1);
  }
}

export async function readEvalCases(path: string): Promise<EvalCase[]> {
  const lines = createInterface({
    input: createReadStream(path, { encoding: "utf8" }),
    crlfDelay: Number.POSITIVE_INFINITY,
  });
  const cases: EvalCase[] = [];

  for await (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }
    const testCase = JSON.parse(trimmed) as EvalCase;
    validateEvalCase(testCase, path);
    cases.push(testCase);
  }

  if (cases.length === 0) {
    throw new Error(`No eval cases found in ${path}`);
  }

  return cases;
}

export function validateEvalCase(testCase: EvalCase, path = "eval file"): void {
  if (!testCase.question?.trim()) {
    throw new Error(`Invalid eval case without question in ${path}`);
  }

  if (
    testCase.minConfidence !== undefined &&
    !["low", "medium", "high"].includes(testCase.minConfidence)
  ) {
    throw new Error(`Invalid minConfidence in ${path}: ${String(testCase.minConfidence)}`);
  }
  assertOptionalNonNegativeInteger(testCase.minRetrieved, "minRetrieved", path);
  assertOptionalNonNegativeInteger(testCase.minCited, "minCited", path);

  assertOptionalUuidArray(testCase.expectedPassageIds, "expectedPassageIds", path);
  assertOptionalStringArray(testCase.expectedSourceTitles, "expectedSourceTitles", path);
  assertOptionalStringArray(
    testCase.expectedRetrievedLanguages,
    "expectedRetrievedLanguages",
    path,
  );
  assertOptionalStringArray(
    testCase.expectedRetrievedTraditions,
    "expectedRetrievedTraditions",
    path,
  );
  assertOptionalStringArray(
    testCase.expectedRetrievedContentTypes,
    "expectedRetrievedContentTypes",
    path,
  );
  assertOptionalStringArray(testCase.mustContain, "mustContain", path);

  if (testCase.expectedSafetyNote !== undefined && testCase.expectedSafetyNote !== null) {
    if (typeof testCase.expectedSafetyNote !== "string" || !testCase.expectedSafetyNote.trim()) {
      throw new Error(`Invalid expectedSafetyNote in ${path}.`);
    }
  }

  if (testCase.expectNoSources && testCase.minCited !== undefined && testCase.minCited > 0) {
    throw new Error(`Invalid eval case in ${path}; expectNoSources conflicts with minCited.`);
  }

  if (
    testCase.expectNoSources &&
    testCase.expectedPassageIds !== undefined &&
    testCase.expectedPassageIds.length > 0
  ) {
    throw new Error(
      `Invalid eval case in ${path}; expectNoSources conflicts with expectedPassageIds.`,
    );
  }

  if (
    testCase.expectedSafetyNote !== undefined &&
    testCase.expectedSafetyNote !== null &&
    !testCase.expectNoSources
  ) {
    throw new Error(`Invalid expectedSafetyNote in ${path}.`);
  }

  if (testCase.expectNoSources !== undefined && typeof testCase.expectNoSources !== "boolean") {
    throw new Error(`Invalid expectNoSources in ${path}.`);
  }

  if (!testCase.expectNoSources && !hasGroundingAssertion(testCase)) {
    throw new Error(
      `Invalid eval case in ${path}; sourced evals must assert expectedPassageIds, expectedSourceTitles, minRetrieved, or minCited.`,
    );
  }
}

export async function validateEvalCasesAgainstCorpus(
  cases: EvalCase[],
  corpusPath = DEFAULT_CORPUS_FILE,
): Promise<void> {
  const coverage = await readPreparedCorpusCoverage(corpusPath);

  for (const testCase of cases) {
    const label = testCase.id ?? testCase.question;
    for (const expectedTitle of testCase.expectedSourceTitles ?? []) {
      const normalized = expectedTitle.toLowerCase();
      if (![...coverage.titles].some((title) => title.includes(normalized))) {
        throw new Error(
          `Eval case ${label} expects source title "${expectedTitle}", but ${corpusPath} has no matching text_title.`,
        );
      }
    }
    assertCorpusValues(
      coverage.languages,
      testCase.expectedRetrievedLanguages,
      "language",
      label,
      corpusPath,
    );
    assertCorpusValues(
      coverage.traditions,
      testCase.expectedRetrievedTraditions,
      "tradition",
      label,
      corpusPath,
    );
    assertCorpusValues(
      coverage.contentTypes,
      testCase.expectedRetrievedContentTypes,
      "content type",
      label,
      corpusPath,
    );
  }
}

function hasGroundingAssertion(testCase: EvalCase): boolean {
  return (
    (testCase.expectedPassageIds !== undefined && testCase.expectedPassageIds.length > 0) ||
    (testCase.expectedSourceTitles !== undefined && testCase.expectedSourceTitles.length > 0) ||
    (testCase.expectedRetrievedLanguages !== undefined &&
      testCase.expectedRetrievedLanguages.length > 0) ||
    (testCase.expectedRetrievedTraditions !== undefined &&
      testCase.expectedRetrievedTraditions.length > 0) ||
    (testCase.expectedRetrievedContentTypes !== undefined &&
      testCase.expectedRetrievedContentTypes.length > 0) ||
    (testCase.minRetrieved !== undefined && testCase.minRetrieved > 0) ||
    (testCase.minCited !== undefined && testCase.minCited > 0)
  );
}

function assertOptionalUuidArray(value: unknown, field: string, path: string): void {
  assertOptionalStringArray(value, field, path);
  if (value === undefined) {
    return;
  }
  const items = value as string[];
  if (!items.every((item) => UUID_PATTERN.test(item))) {
    throw new Error(`Invalid ${field} in ${path}; expected UUID strings.`);
  }
}

function assertOptionalStringArray(value: unknown, field: string, path: string): void {
  if (value === undefined) {
    return;
  }
  if (!Array.isArray(value) || !value.every((item) => typeof item === "string" && item.trim())) {
    throw new Error(`Invalid ${field} in ${path}; expected a non-empty string array.`);
  }
}

function assertOptionalNonNegativeInteger(value: unknown, field: string, path: string): void {
  if (value === undefined) {
    return;
  }
  if (typeof value !== "number" || !Number.isInteger(value) || value < 0) {
    throw new Error(`Invalid ${field} in ${path}; expected a non-negative integer.`);
  }
}

async function readPreparedCorpusCoverage(path: string): Promise<{
  titles: Set<string>;
  languages: Set<string>;
  traditions: Set<string>;
  contentTypes: Set<string>;
}> {
  const lines = createInterface({
    input: createReadStream(path, { encoding: "utf8" }),
    crlfDelay: Number.POSITIVE_INFINITY,
  });
  const coverage = {
    titles: new Set<string>(),
    languages: new Set<string>(),
    traditions: new Set<string>(),
    contentTypes: new Set<string>(),
  };

  for await (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      continue;
    }
    const chunk = JSON.parse(trimmed) as {
      text_title?: unknown;
      language?: unknown;
      tradition_primary?: unknown;
      content_type?: unknown;
    };
    addLowercaseString(coverage.titles, chunk.text_title);
    addLowercaseString(coverage.languages, chunk.language);
    addLowercaseString(coverage.traditions, chunk.tradition_primary);
    addLowercaseString(coverage.contentTypes, chunk.content_type);
    coverage.contentTypes.add("translation");
  }

  if (coverage.titles.size === 0) {
    throw new Error(`No prepared corpus chunks found in ${path}`);
  }

  return coverage;
}

function addLowercaseString(values: Set<string>, value: unknown): void {
  if (typeof value === "string" && value.trim()) {
    values.add(value.toLowerCase());
  }
}

function assertCorpusValues(
  available: Set<string>,
  expectedValues: string[] | undefined,
  label: string,
  evalLabel: string,
  corpusPath: string,
): void {
  for (const expected of expectedValues ?? []) {
    if (!available.has(expected.toLowerCase())) {
      throw new Error(
        `Eval case ${evalLabel} expects retrieved ${label} "${expected}", but ${corpusPath} has no matching prepared chunk.`,
      );
    }
  }
}

export function evaluateCase(testCase: EvalCase, result: AskResult): EvalCaseResult {
  const failures: string[] = [];
  const answerText = result.answer.answer.toLowerCase();
  const citedPassageIds = new Set(result.answer.sources.map((source) => source.passage_id));
  const retrievedPassageIds = new Set(
    result.retrievedPassages
      .map((passage) => passage.passage_id)
      .concat(result.retrievedPassageIds),
  );
  const retrievedTitles = new Set(
    result.retrievedPassages
      .map((passage) => passage.title.toLowerCase())
      .concat(result.answer.sources.map((source) => source.title.toLowerCase())),
  );
  const retrievedLanguages = new Set(
    result.retrievedPassages.map((passage) => passage.language.toLowerCase()),
  );
  const retrievedTraditions = new Set(
    result.retrievedPassages.map((passage) => passage.tradition.toLowerCase()),
  );
  const retrievedContentTypes = new Set(
    result.retrievedPassages.map((passage) => passage.content_type.toLowerCase()),
  );

  for (const citedId of citedPassageIds) {
    if (!retrievedPassageIds.has(citedId)) {
      failures.push(`cited non-retrieved passage_id ${citedId}`);
    }
  }

  for (const expectedId of testCase.expectedPassageIds ?? []) {
    if (!citedPassageIds.has(expectedId)) {
      failures.push(`missing expected cited passage_id ${expectedId}`);
    }
  }

  for (const expectedTitle of testCase.expectedSourceTitles ?? []) {
    if (![...retrievedTitles].some((title) => title.includes(expectedTitle.toLowerCase()))) {
      failures.push(`missing expected retrieved source title containing "${expectedTitle}"`);
    }
  }

  for (const expectedLanguage of testCase.expectedRetrievedLanguages ?? []) {
    if (!retrievedLanguages.has(expectedLanguage.toLowerCase())) {
      failures.push(`missing expected retrieved language "${expectedLanguage}"`);
    }
  }

  for (const expectedTradition of testCase.expectedRetrievedTraditions ?? []) {
    if (!retrievedTraditions.has(expectedTradition.toLowerCase())) {
      failures.push(`missing expected retrieved tradition "${expectedTradition}"`);
    }
  }

  for (const expectedContentType of testCase.expectedRetrievedContentTypes ?? []) {
    if (!retrievedContentTypes.has(expectedContentType.toLowerCase())) {
      failures.push(`missing expected retrieved content type "${expectedContentType}"`);
    }
  }

  for (const requiredText of testCase.mustContain ?? []) {
    if (!answerText.includes(requiredText.toLowerCase())) {
      failures.push(`answer missing required text "${requiredText}"`);
    }
  }

  if (
    testCase.minConfidence &&
    confidenceRank[result.answer.confidence] < confidenceRank[testCase.minConfidence]
  ) {
    failures.push(
      `confidence ${result.answer.confidence} is below required ${testCase.minConfidence}`,
    );
  }

  if (testCase.expectedSafetyNote !== undefined) {
    const actual = result.answer.safety_note;
    if (actual !== testCase.expectedSafetyNote) {
      failures.push(
        `safety_note ${actual ?? "null"} did not match expected ${testCase.expectedSafetyNote}`,
      );
    }
  }

  if (testCase.expectNoSources && result.answer.sources.length > 0) {
    failures.push("expected no sources, but answer included citations");
  }

  if (
    testCase.expectNoSources &&
    testCase.expectedSafetyNote === undefined &&
    result.answer.confidence !== "low"
  ) {
    failures.push(`expected no-source answer confidence low, got ${result.answer.confidence}`);
  }

  if (testCase.minRetrieved !== undefined && retrievedPassageIds.size < testCase.minRetrieved) {
    failures.push(
      `retrieved ${retrievedPassageIds.size} passages, below required ${testCase.minRetrieved}`,
    );
  }

  if (testCase.minCited !== undefined && citedPassageIds.size < testCase.minCited) {
    failures.push(`cited ${citedPassageIds.size} passages, below required ${testCase.minCited}`);
  }

  return {
    id: testCase.id ?? testCase.question,
    passed: failures.length === 0,
    failures,
    cache: result.cache,
    modelUsed: result.modelUsed,
    retrievedCount: result.retrievedPassages.length,
    citedCount: result.answer.sources.length,
  };
}

function toAskOptions(testCase: EvalCase): AskOptions {
  return {
    question: testCase.question,
    useCache: process.env.RAG_EVAL_USE_CACHE === "1",
    writeCache: process.env.RAG_EVAL_WRITE_CACHE === "1",
    matchCount: readBoundedIntegerEnv("RAG_MATCH_COUNT", 8, 1, 20),
    minSimilarity: readBoundedNumberEnv("RAG_MIN_SIMILARITY", 0, 0, 1),
    keywordWeight: readNumberEnv("RAG_KEYWORD_WEIGHT", 0.15),
    maxContextChars: readPositiveIntegerEnv("RAG_MAX_CONTEXT_CHARS", 12_000),
    maxQuestionChars: readPositiveIntegerEnv("RAG_MAX_QUESTION_CHARS", 2_000),
    ...(testCase.traditionPreference ? { traditionPreference: testCase.traditionPreference } : {}),
  };
}

function createPipeline(): RagPipeline {
  const requestTimeoutMs = readPositiveIntegerEnv("RAG_FETCH_TIMEOUT_MS", 30_000);
  return new RagPipeline({
    store: new SupabaseRagStore({
      url: requireEnv("SUPABASE_URL"),
      serviceRoleKey: requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
      requestTimeoutMs,
    }),
    embeddings: new OpenAIEmbeddingProvider({
      apiKey: requireEnv("OPENAI_API_KEY"),
      model: process.env.EMBEDDING_MODEL?.trim() || "text-embedding-3-small",
      dimensions: readPositiveIntegerEnv("EMBEDDING_DIMENSIONS", 1536),
      requestTimeoutMs,
    }),
    llm: createLlmProvider(),
  });
}

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
      requestTimeoutMs: readPositiveIntegerEnv("RAG_FETCH_TIMEOUT_MS", 30_000),
    });
  }

  if (provider === "openai-compatible") {
    return new OpenAICompatibleJsonProvider({
      apiKey: requireEnv("OPENAI_COMPATIBLE_API_KEY"),
      baseUrl: process.env.OPENAI_COMPATIBLE_BASE_URL?.trim() || "https://api.openai.com/v1",
      model: process.env.LLM_DEFAULT_MODEL?.trim() || "gpt-4.1-mini",
      maxOutputTokens,
      requestTimeoutMs: readPositiveIntegerEnv("RAG_FETCH_TIMEOUT_MS", 30_000),
    });
  }

  if (provider !== "anthropic") {
    throw new Error(`Unsupported LLM_PROVIDER: ${provider}`);
  }

  return new AnthropicJsonProvider({
    apiKey: requireEnv("ANTHROPIC_API_KEY"),
    model: process.env.LLM_DEFAULT_MODEL?.trim() || "claude-haiku-4-5",
    maxOutputTokens,
    requestTimeoutMs: readPositiveIntegerEnv("RAG_FETCH_TIMEOUT_MS", 30_000),
  });
}

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
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

function isCliEntry(): boolean {
  const scriptPath = process.argv[1];
  return scriptPath ? import.meta.url === pathToFileURL(scriptPath).href : false;
}

export function parseCliArgs(args: string[]): {
  validateOnly: boolean;
  evalFile: string;
  corpusFile: string;
  outputFile?: string;
} {
  const validateOnly = args.includes("--validate-only");
  const corpusArg = args.find((arg) => arg.startsWith("--corpus="));
  const outputEqualsArg = args.find((arg) => arg.startsWith("--out="));
  const outputIndex = args.indexOf("--out");
  const outputFile =
    outputEqualsArg?.slice("--out=".length) ??
    (outputIndex >= 0 ? args[outputIndex + 1] : undefined);
  const evalFile =
    args.find((arg, index) => {
      if (arg === "--validate-only" || arg === "--out" || arg.startsWith("--out=")) {
        return false;
      }
      if (outputIndex >= 0 && index === outputIndex + 1) {
        return false;
      }
      return !arg.startsWith("--corpus=");
    }) ?? DEFAULT_EVAL_FILE;

  return {
    validateOnly,
    evalFile,
    corpusFile: corpusArg?.slice("--corpus=".length) || DEFAULT_CORPUS_FILE,
    ...(outputFile ? { outputFile } : {}),
  };
}
