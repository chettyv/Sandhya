import type { StructuredAnswer } from "@dharma-daily/shared-types";

import { isCacheableQuestion } from "./classifier.js";
import { hashQuestion } from "./hash.js";
import { validateStructuredAnswer, type EmbeddingProvider, type LlmProvider } from "./providers.js";
import { runSafetyGate } from "./safety.js";
import type { RetrievedPassage } from "./supabase-rest.js";

export const PIPELINE_VERSION = "0.8.10" as const;
const DEFAULT_MAX_CONTEXT_CHARS = 12_000;
const DEFAULT_MAX_QUESTION_CHARS = 2_000;
const DEFAULT_MATCH_COUNT = 8;
const DEFAULT_KEYWORD_WEIGHT = 0.15;
const MAX_SOURCE_CITATIONS = 6;
const MAX_RETRIEVED_PASSAGE_IDS = 20;
const ALLOWED_LICENCES = ["public_domain", "licensed", "original"] as const;
const DEFAULT_ALLOWED_LICENCES = ["public_domain", "original"] as const;
const ALLOWED_CONTENT_TYPES = ["translation", "commentary", "combined"] as const;
const ALLOWED_TRADITIONS = [
  "general",
  "vaishnava",
  "shaiva",
  "shakta",
  "smarta",
  "advaita",
  "vishishtadvaita",
  "dvaita",
  "prefer_not_to_say",
] as const;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export interface AskOptions {
  question: string;
  traditionPreference?: string;
  matchCount?: number;
  allowedLicences?: Array<"public_domain" | "licensed" | "original">;
  contentTypes?: Array<"translation" | "commentary" | "combined">;
  languages?: string[];
  minSimilarity?: number;
  useCache?: boolean;
  writeCache?: boolean;
  maxContextChars?: number;
  maxQuestionChars?: number;
  keywordWeight?: number;
}

export interface AskResult {
  answer: StructuredAnswer;
  retrievedPassages: RetrievedPassage[];
  retrievedPassageIds: string[];
  cache: "hit" | "miss" | "skipped" | "safety";
  modelUsed: string | null;
  embeddingModel: string | null;
  tokensIn: number;
  tokensOut: number;
}

export interface CachedRagAnswer {
  answer: StructuredAnswer;
  retrievedPassageIds: string[];
}

export interface RagCachePolicy {
  allowedLicences: string[];
  contentTypes: string[];
  traditionFilter: string;
  languages: string[] | null;
  embeddingModel: string;
}

export interface RagPipelineDependencies {
  store: RagStore;
  embeddings: EmbeddingProvider;
  llm: LlmProvider;
}

export interface RagStore {
  getCachedAnswer(questionHash: string, policy: RagCachePolicy): Promise<CachedRagAnswer | null>;
  recordCacheHit(questionHash: string): Promise<void>;
  putCachedAnswer(
    questionHash: string,
    answer: StructuredAnswer,
    retrievedPassageIds: string[],
  ): Promise<void>;
  retrievePassages(options: {
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
  }): Promise<RetrievedPassage[]>;
}

export class RagPipeline {
  private readonly store: RagStore;
  private readonly embeddings: EmbeddingProvider;
  private readonly llm: LlmProvider;

  constructor(dependencies: RagPipelineDependencies) {
    this.store = dependencies.store;
    this.embeddings = dependencies.embeddings;
    this.llm = dependencies.llm;
  }

  async ask(options: AskOptions): Promise<AskResult> {
    const question = options.question.trim();
    if (!question) {
      throw new Error("Question is required.");
    }
    const maxQuestionChars = normalizePositiveInteger(
      options.maxQuestionChars ?? DEFAULT_MAX_QUESTION_CHARS,
      DEFAULT_MAX_QUESTION_CHARS,
    );
    if (question.length > maxQuestionChars) {
      throw new Error(`Question must be ${maxQuestionChars} characters or fewer.`);
    }

    const safety = runSafetyGate(question);
    if (safety.blocked && safety.answer) {
      return {
        answer: safety.answer,
        retrievedPassages: [],
        retrievedPassageIds: [],
        cache: "safety",
        modelUsed: null,
        embeddingModel: null,
        tokensIn: 0,
        tokensOut: 0,
      };
    }

    const traditionFilter = normalizeTradition(options.traditionPreference);
    const allowedLicences = normalizeAllowedLicences(options.allowedLicences);
    const contentTypes = normalizeContentTypes(options.contentTypes);
    const languages = normalizeLanguages(options.languages);
    const keywordWeight = normalizeKeywordWeight(options.keywordWeight ?? DEFAULT_KEYWORD_WEIGHT);
    const cacheableQuestion = isCacheableQuestion(question);
    const shouldReadCache = options.useCache !== false && cacheableQuestion;
    const shouldWriteCache = options.writeCache !== false && cacheableQuestion;
    const cacheStatus: "miss" | "skipped" = shouldReadCache ? "miss" : "skipped";
    const matchCount = normalizeMatchCount(options.matchCount ?? DEFAULT_MATCH_COUNT);
    const maxContextChars = normalizePositiveInteger(
      options.maxContextChars ?? DEFAULT_MAX_CONTEXT_CHARS,
      DEFAULT_MAX_CONTEXT_CHARS,
    );
    const questionHash = cacheableQuestion
      ? await hashQuestion(
          buildCacheKey({
            question,
            traditionFilter,
            allowedLicences,
            contentTypes,
            embeddingModel: this.embeddings.model,
            answerModel: this.llm.model,
            keywordWeight,
            matchCount,
            maxContextChars,
            ...(languages ? { languages } : {}),
            ...(options.minSimilarity === undefined
              ? {}
              : { minSimilarity: options.minSimilarity }),
          }),
        )
      : null;
    if (shouldReadCache && questionHash) {
      const cached = await this.store.getCachedAnswer(questionHash, {
        allowedLicences,
        contentTypes,
        traditionFilter,
        languages: languages ?? null,
        embeddingModel: this.embeddings.model,
      });
      if (cached) {
        validateStructuredAnswer(cached.answer);
        if (cachedAnswerMatchesRetrievedIds(cached.answer, cached.retrievedPassageIds)) {
          await this.store.recordCacheHit(questionHash);
          return {
            answer: cached.answer,
            retrievedPassages: [],
            retrievedPassageIds: cached.retrievedPassageIds,
            cache: "hit",
            modelUsed: null,
            embeddingModel: null,
            tokensIn: 0,
            tokensOut: 0,
          };
        }
      }
    }

    const embedding = await this.embeddings.embed(question);
    const retrievedPassages = filterRetrievedPassagesByPolicy(
      dedupeRetrievedPassages(
        await this.store.retrievePassages({
          embedding,
          embeddingModel: this.embeddings.model,
          matchCount,
          allowedLicences,
          contentTypes,
          traditionFilter,
          queryText: question,
          keywordWeight,
          ...(languages ? { languages } : {}),
          ...(options.minSimilarity === undefined ? {} : { minSimilarity: options.minSimilarity }),
        }),
      ),
      {
        allowedLicences,
        contentTypes,
        traditionFilter,
        minSimilarity: options.minSimilarity ?? 0,
        ...(languages ? { languages } : {}),
      },
    ).slice(0, MAX_RETRIEVED_PASSAGE_IDS);

    if (retrievedPassages.length === 0) {
      const answer = noSourceAnswer();
      return {
        answer,
        retrievedPassages,
        retrievedPassageIds: [],
        cache: cacheStatus,
        modelUsed: null,
        embeddingModel: this.embeddings.model,
        tokensIn: 0,
        tokensOut: 0,
      };
    }

    const contextPassages = selectContextPassages(retrievedPassages, maxContextChars);
    if (contextPassages.length === 0) {
      const answer = contextBudgetAnswer();
      const retrievedPassageIds = retrievedPassages.map((passage) => passage.passage_id);
      return {
        answer,
        retrievedPassages,
        retrievedPassageIds,
        cache: cacheStatus,
        modelUsed: null,
        embeddingModel: this.embeddings.model,
        tokensIn: 0,
        tokensOut: 0,
      };
    }

    const generated = await generateWithStructuredRetry(this.llm, {
      question,
      traditionPreference: traditionFilter,
      retrievedContext: formatRetrievedContext(contextPassages),
      sources: contextPassages.map((passage) => ({
        passage_id: passage.passage_id,
        title: passage.title,
        location: formatLocation(passage),
      })),
    });

    const allowedPassages = new Map(
      contextPassages.map((passage) => [passage.passage_id, passage]),
    );
    generated.answer = normalizeGeneratedAnswer(generated.answer, allowedPassages);
    if (generated.answer.sources.length === 0) {
      generated.answer = uncitedGeneratedAnswer();
    }
    const retrievedPassageIds = retrievedPassages.map((passage) => passage.passage_id);
    if (shouldWriteCache && questionHash) {
      if (retrievedPassageIds.length > 0 && generated.answer.sources.length > 0) {
        await this.store.putCachedAnswer(questionHash, generated.answer, retrievedPassageIds);
      }
    }

    return {
      answer: generated.answer,
      retrievedPassages,
      retrievedPassageIds,
      cache: cacheStatus,
      modelUsed: this.llm.model,
      embeddingModel: this.embeddings.model,
      tokensIn: generated.usage.inputTokens,
      tokensOut: generated.usage.outputTokens,
    };
  }
}

async function generateWithStructuredRetry(
  llm: LlmProvider,
  input: Parameters<LlmProvider["generateStructuredAnswer"]>[0],
): ReturnType<LlmProvider["generateStructuredAnswer"]> {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      return await llm.generateStructuredAnswer(input);
    } catch (error) {
      if (attempt === 1 || !isStructuredOutputError(error)) throw error;
    }
  }

  throw new Error("Structured answer generation failed after retry.");
}

function isStructuredOutputError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /structured answer|structured json|field validation|source failed|shape validation/i.test(
    message,
  );
}

function buildCacheKey(input: {
  question: string;
  traditionFilter: string;
  allowedLicences: string[];
  contentTypes: string[];
  embeddingModel: string;
  answerModel: string;
  languages?: string[];
  minSimilarity?: number;
  keywordWeight: number;
  matchCount: number;
  maxContextChars: number;
}): string {
  return JSON.stringify({
    pipeline: PIPELINE_VERSION,
    question: input.question,
    tradition_filter: input.traditionFilter,
    allowed_licences: [...input.allowedLicences].sort(),
    content_types: [...input.contentTypes].sort(),
    embedding_model: input.embeddingModel,
    answer_model: input.answerModel,
    languages: input.languages ? [...input.languages].sort() : null,
    min_similarity: input.minSimilarity ?? 0,
    keyword_weight: input.keywordWeight,
    match_count: input.matchCount,
    max_context_chars: input.maxContextChars,
  });
}

function normalizeTradition(tradition: string | undefined): string {
  const normalized = tradition?.trim().toLowerCase();
  if (!normalized || normalized === "prefer_not_to_say") {
    return "general";
  }
  if (!isAllowedValue(normalized, ALLOWED_TRADITIONS)) {
    throw new Error(`Invalid tradition preference: ${tradition}`);
  }
  return normalized;
}

function normalizeAllowedLicences(
  values: Array<"public_domain" | "licensed" | "original"> | undefined,
): string[] {
  return normalizeEnumList(values ?? [...DEFAULT_ALLOWED_LICENCES], ALLOWED_LICENCES, "licence");
}

function normalizeContentTypes(
  values: Array<"translation" | "commentary" | "combined"> | undefined,
): string[] {
  return normalizeEnumList(
    values ?? [...ALLOWED_CONTENT_TYPES],
    ALLOWED_CONTENT_TYPES,
    "content type",
  );
}

function normalizeLanguages(values: string[] | undefined): string[] | undefined {
  if (values === undefined) {
    return undefined;
  }
  const normalized = [...new Set(values.map((value) => value.trim().toLowerCase()))];
  if (normalized.length === 0 || normalized.some((value) => !/^[a-z]{2,3}$/.test(value))) {
    throw new Error("Invalid language filter.");
  }
  return normalized;
}

function normalizeEnumList<T extends string>(
  values: readonly string[],
  allowedValues: readonly T[],
  label: string,
): string[] {
  const normalized = [...new Set(values.map((value) => value.trim().toLowerCase()))];
  if (
    normalized.length === 0 ||
    normalized.some((value) => !isAllowedValue(value, allowedValues))
  ) {
    throw new Error(`Invalid ${label} filter.`);
  }
  return normalized;
}

function isAllowedValue<T extends string>(value: string, allowedValues: readonly T[]): value is T {
  return (allowedValues as readonly string[]).includes(value);
}

function dedupeRetrievedPassages(passages: RetrievedPassage[]): RetrievedPassage[] {
  const seen = new Set<string>();
  const deduped: RetrievedPassage[] = [];

  for (const passage of passages) {
    if (seen.has(passage.passage_id)) {
      continue;
    }
    seen.add(passage.passage_id);
    deduped.push(passage);
  }

  return deduped;
}

function cachedAnswerMatchesRetrievedIds(
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

function filterRetrievedPassagesByPolicy(
  passages: RetrievedPassage[],
  policy: {
    allowedLicences: string[];
    contentTypes: string[];
    traditionFilter: string;
    languages?: string[];
    minSimilarity: number;
  },
): RetrievedPassage[] {
  const allowedLicences = new Set(policy.allowedLicences);
  const contentTypes = new Set(policy.contentTypes);
  const languages = policy.languages ? new Set(policy.languages) : null;
  const allowedTraditions = new Set(["general", policy.traditionFilter]);

  return passages.filter((passage) => {
    if (!isWellFormedRetrievedPassage(passage)) {
      return false;
    }
    if (!allowedLicences.has(passage.licence) || !contentTypes.has(passage.content_type)) {
      return false;
    }
    if (!allowedTraditions.has(passage.tradition)) {
      return false;
    }
    if (languages && !languages.has(passage.language)) {
      return false;
    }
    return Number.isFinite(passage.similarity) && passage.similarity >= policy.minSimilarity;
  });
}

function isWellFormedRetrievedPassage(passage: RetrievedPassage): boolean {
  return (
    typeof passage.passage_id === "string" &&
    UUID_PATTERN.test(passage.passage_id) &&
    typeof passage.text_id === "string" &&
    UUID_PATTERN.test(passage.text_id) &&
    (passage.commentary_id === null ||
      (typeof passage.commentary_id === "string" && UUID_PATTERN.test(passage.commentary_id))) &&
    typeof passage.title === "string" &&
    passage.title.trim().length > 0 &&
    (passage.section === null || typeof passage.section === "string") &&
    (passage.verse_number === null || typeof passage.verse_number === "string") &&
    typeof passage.chunk_text === "string" &&
    passage.chunk_text.trim().length > 0 &&
    (passage.content_type === "translation" ||
      passage.content_type === "commentary" ||
      passage.content_type === "combined") &&
    (passage.licence === "public_domain" ||
      passage.licence === "licensed" ||
      passage.licence === "original") &&
    typeof passage.tradition === "string" &&
    passage.tradition.trim().length > 0 &&
    typeof passage.language === "string" &&
    passage.language.trim().length > 0 &&
    (passage.source_url === null || typeof passage.source_url === "string") &&
    typeof passage.similarity === "number" &&
    Number.isFinite(passage.similarity)
  );
}

function normalizeKeywordWeight(value: number): number {
  if (!Number.isFinite(value)) {
    return DEFAULT_KEYWORD_WEIGHT;
  }
  return Math.max(0, Math.min(value, 0.5));
}

function normalizeMatchCount(value: number): number {
  return Math.min(normalizePositiveInteger(value, DEFAULT_MATCH_COUNT), MAX_RETRIEVED_PASSAGE_IDS);
}

function normalizePositiveInteger(value: number, fallback: number): number {
  if (!Number.isFinite(value) || !Number.isInteger(value) || value <= 0) {
    return fallback;
  }
  return value;
}

function selectContextPassages(passages: RetrievedPassage[], maxChars: number): RetrievedPassage[] {
  if (passages.length === 0) {
    return [];
  }

  const budget = Math.max(1, maxChars);
  const selected: RetrievedPassage[] = [];
  let usedChars = 0;

  for (const passage of passages) {
    const formatted = formatRetrievedPassage(passage, selected.length + 1);
    const separatorChars = selected.length === 0 ? 0 : 2;
    if (usedChars + separatorChars + formatted.length > budget) {
      if (selected.length === 0) {
        continue;
      }
      break;
    }
    selected.push(passage);
    usedChars += separatorChars + formatted.length;
    if (usedChars >= budget) {
      break;
    }
  }

  return selected;
}

function formatRetrievedContext(passages: RetrievedPassage[]): string {
  if (passages.length === 0) {
    return "No relevant retrieved passages were found.";
  }

  return passages.map((passage, index) => formatRetrievedPassage(passage, index + 1)).join("\n\n");
}

function formatRetrievedPassage(passage: RetrievedPassage, index: number): string {
  return `[${index}] passage_id=${passage.passage_id}
title=${passage.title}
location=${formatLocation(passage)}
type=${passage.content_type}
tradition=${passage.tradition}
licence=${passage.licence}
language=${passage.language}
source_url=${passage.source_url ?? ""}
similarity=${passage.similarity.toFixed(4)}
text=${passage.chunk_text}`;
}

function formatLocation(passage: RetrievedPassage): string {
  return [passage.section, passage.verse_number].filter(Boolean).join(" ") || "source passage";
}

function noSourceAnswer(): StructuredAnswer {
  return {
    answer:
      "I could not find a sufficiently relevant source passage in the approved Dharma Daily corpus for this question, so I should not give a scripture-grounded answer yet.",
    summary: "No approved source passage was retrieved for this question.",
    sources: [],
    tradition_notes: [
      "This may improve after more licensed and reviewed corpus material is ingested.",
    ],
    confidence: "low",
    safety_note: null,
    suggested_practice: null,
  };
}

function contextBudgetAnswer(): StructuredAnswer {
  return {
    answer:
      "I found candidate approved source passages, but none fit within the current retrieval context budget, so I should not give a scripture-grounded answer yet.",
    summary: "Retrieved source passages did not fit the configured context budget.",
    sources: [],
    tradition_notes: [
      "This should be retried after increasing the context budget or improving chunk sizes.",
    ],
    confidence: "low",
    safety_note: null,
    suggested_practice: null,
  };
}

function uncitedGeneratedAnswer(): StructuredAnswer {
  return {
    answer:
      "I could not produce a properly sourced answer from the retrieved passages, so I should not give a scripture-grounded answer yet.",
    summary: "The generated answer did not include any valid retrieved source citations.",
    sources: [],
    tradition_notes: [
      "This should be retried after improving retrieval, prompts, or source coverage.",
    ],
    confidence: "low",
    safety_note: null,
    suggested_practice: null,
  };
}

function normalizeGeneratedAnswer(
  answer: StructuredAnswer,
  allowedPassages: Map<string, RetrievedPassage>,
): StructuredAnswer {
  validateStructuredAnswer(answer);

  const seen = new Set<string>();
  const sources = answer.sources
    .map((source) => {
      const passage = allowedPassages.get(source.passage_id);
      if (!passage) return null;
      return {
        ...source,
        // The model may explain relevance, but source identity and location
        // must come from the retrieved row rather than model-authored text.
        title: passage.title,
        location: formatLocation(passage),
      };
    })
    .filter((source): source is StructuredAnswer["sources"][number] => source !== null)
    .filter((source) => {
      if (seen.has(source.passage_id)) {
        return false;
      }
      seen.add(source.passage_id);
      return true;
    })
    .slice(0, MAX_SOURCE_CITATIONS);

  return {
    ...answer,
    sources,
    confidence: sources.length === 0 ? "low" : answer.confidence,
  };
}

export * from "./hash.js";
export * from "./providers.js";
export * from "./safety.js";
export * from "./supabase-rest.js";
