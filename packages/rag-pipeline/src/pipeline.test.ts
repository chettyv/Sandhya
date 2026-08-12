import type { StructuredAnswer } from "@dharma-daily/shared-types";
import { describe, expect, it, vi } from "vitest";

import type { EmbeddingProvider, LlmProvider } from "./providers.js";
import type { RetrievedPassage } from "./supabase-rest.js";

import { RagPipeline, type RagStore } from "./index.js";

const baseAnswer: StructuredAnswer = {
  answer: "A grounded answer.",
  summary: "A summary.",
  sources: [],
  tradition_notes: [],
  confidence: "medium",
  safety_note: null,
  suggested_practice: null,
};

const passage: RetrievedPassage = {
  passage_id: "00000000-0000-0000-0000-000000000201",
  commentary_id: null,
  text_id: "00000000-0000-0000-0000-000000000101",
  title: "Bhagavad Gita",
  section: "Chapter 2",
  verse_number: "2.47",
  chunk_text: "You have a right to action, not to the fruits alone.",
  content_type: "translation",
  licence: "public_domain",
  tradition: "general",
  language: "en",
  source_url: "https://example.test/gita",
  similarity: 0.91,
};

describe("RagPipeline", () => {
  it("short-circuits safety issues before cache, embedding, retrieval, or LLM calls", async () => {
    const store = fakeStore();
    const embeddings = fakeEmbeddings();
    const llm = fakeLlm();
    const pipeline = new RagPipeline({ store, embeddings, llm });

    const result = await pipeline.ask({ question: "I want to kill myself" });

    expect(result.cache).toBe("safety");
    expect(result.answer.safety_note).toBe("self_harm");
    expect(store.getCachedAnswer).not.toHaveBeenCalled();
    expect(embeddings.embed).not.toHaveBeenCalled();
    expect(llm.generateStructuredAnswer).not.toHaveBeenCalled();
  });

  it("returns cached answers without embedding or generation", async () => {
    const cached: StructuredAnswer = {
      ...baseAnswer,
      answer: "Cached answer.",
      sources: [
        {
          passage_id: passage.passage_id,
          title: "Bhagavad Gita",
          location: "Chapter 2 2.47",
          relevance: "Backed by cached retrieved ids.",
        },
      ],
    };
    const store = fakeStore({
      cached: {
        answer: cached,
        retrievedPassageIds: ["00000000-0000-0000-0000-000000000201"],
      },
    });
    const embeddings = fakeEmbeddings();
    const llm = fakeLlm();
    const pipeline = new RagPipeline({ store, embeddings, llm });

    const result = await pipeline.ask({ question: "What is dharma?" });

    expect(result.cache).toBe("hit");
    expect(result.answer.answer).toBe("Cached answer.");
    expect(result.retrievedPassageIds).toEqual(["00000000-0000-0000-0000-000000000201"]);
    expect(store.getCachedAnswer).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        allowedLicences: ["public_domain", "original"],
        contentTypes: ["translation", "commentary", "combined"],
        traditionFilter: "general",
        languages: null,
        embeddingModel: "test-embedding",
      }),
    );
    expect(store.recordCacheHit).toHaveBeenCalledOnce();
    expect(embeddings.embed).not.toHaveBeenCalled();
    expect(llm.generateStructuredAnswer).not.toHaveBeenCalled();
  });

  it("does not read or write the global cache for personal questions", async () => {
    const generated: StructuredAnswer = {
      ...baseAnswer,
      sources: [
        {
          passage_id: passage.passage_id,
          title: passage.title,
          location: "Chapter 2 2.47",
          relevance: "Backed by retrieval.",
        },
      ],
    };
    const store = fakeStore({ retrieved: [passage] });
    const pipeline = new RagPipeline({
      store,
      embeddings: fakeEmbeddings(),
      llm: fakeLlm(generated),
    });

    const result = await pipeline.ask({ question: "How can I cope with grief?" });

    expect(result.cache).toBe("skipped");
    expect(store.getCachedAnswer).not.toHaveBeenCalled();
    expect(store.putCachedAnswer).not.toHaveBeenCalled();
  });

  it("rejects overlong questions before cache, embedding, retrieval, or LLM calls", async () => {
    const store = fakeStore();
    const embeddings = fakeEmbeddings();
    const llm = fakeLlm();
    const pipeline = new RagPipeline({ store, embeddings, llm });

    await expect(
      pipeline.ask({
        question: "x".repeat(11),
        maxQuestionChars: 10,
      }),
    ).rejects.toThrow("Question must be 10 characters or fewer.");

    expect(store.getCachedAnswer).not.toHaveBeenCalled();
    expect(embeddings.embed).not.toHaveBeenCalled();
    expect(llm.generateStructuredAnswer).not.toHaveBeenCalled();
  });

  it("ignores cached answers when citations are not backed by cached retrieved passage ids", async () => {
    const cached: StructuredAnswer = {
      ...baseAnswer,
      answer: "Stale cached answer.",
      sources: [
        {
          passage_id: "11111111-1111-1111-1111-111111111111",
          title: "Invented",
          location: "9.99",
          relevance: "Not backed by retrieved ids.",
        },
      ],
    };
    const generated: StructuredAnswer = {
      ...baseAnswer,
      answer: "Fresh answer.",
      sources: [
        {
          passage_id: passage.passage_id,
          title: "Bhagavad Gita",
          location: "Chapter 2 2.47",
          relevance: "Backed by retrieval.",
        },
      ],
    };
    const store = fakeStore({
      cached: {
        answer: cached,
        retrievedPassageIds: [passage.passage_id],
      },
      retrieved: [passage],
    });
    const embeddings = fakeEmbeddings();
    const llm = fakeLlm(generated);
    const pipeline = new RagPipeline({ store, embeddings, llm });

    const result = await pipeline.ask({ question: "What is dharma?" });

    expect(result.cache).toBe("miss");
    expect(result.answer.answer).toBe("Fresh answer.");
    expect(store.recordCacheHit).not.toHaveBeenCalled();
    expect(embeddings.embed).toHaveBeenCalledOnce();
    expect(llm.generateStructuredAnswer).toHaveBeenCalledOnce();
  });

  it("ignores cached answers that violate serving citation rules", async () => {
    const cached: StructuredAnswer = {
      ...baseAnswer,
      answer: "Bad cached no-source answer.",
      sources: [],
      confidence: "medium",
    };
    const generated: StructuredAnswer = {
      ...baseAnswer,
      answer: "Fresh answer.",
      sources: [
        {
          passage_id: passage.passage_id,
          title: "Bhagavad Gita",
          location: "Chapter 2 2.47",
          relevance: "Backed by retrieval.",
        },
      ],
    };
    const store = fakeStore({
      cached: {
        answer: cached,
        retrievedPassageIds: [],
      },
      retrieved: [passage],
    });
    const pipeline = new RagPipeline({
      store,
      embeddings: fakeEmbeddings(),
      llm: fakeLlm(generated),
    });

    const result = await pipeline.ask({ question: "What is dharma?" });

    expect(result.cache).toBe("miss");
    expect(result.answer.answer).toBe("Fresh answer.");
    expect(store.recordCacheHit).not.toHaveBeenCalled();
  });

  it("ignores cached answers with invalid retrieved passage metadata", async () => {
    const cached: StructuredAnswer = {
      ...baseAnswer,
      answer: "Cached answer with malformed metadata.",
      sources: [
        {
          passage_id: passage.passage_id,
          title: "Bhagavad Gita",
          location: "Chapter 2 2.47",
          relevance: "Backed by duplicated retrieved ids.",
        },
      ],
    };
    const generated: StructuredAnswer = {
      ...baseAnswer,
      answer: "Fresh answer.",
      sources: [
        {
          passage_id: passage.passage_id,
          title: "Bhagavad Gita",
          location: "Chapter 2 2.47",
          relevance: "Backed by retrieval.",
        },
      ],
    };
    const store = fakeStore({
      cached: {
        answer: cached,
        retrievedPassageIds: [passage.passage_id, passage.passage_id],
      },
      retrieved: [passage],
    });
    const pipeline = new RagPipeline({
      store,
      embeddings: fakeEmbeddings(),
      llm: fakeLlm(generated),
    });

    const result = await pipeline.ask({ question: "What is dharma?" });

    expect(result.cache).toBe("miss");
    expect(result.answer.answer).toBe("Fresh answer.");
    expect(store.recordCacheHit).not.toHaveBeenCalled();
  });

  it("uses retrieval policy in the cache key so tradition-specific answers do not collide", async () => {
    const store = fakeStore({ retrieved: [] });
    const pipeline = new RagPipeline({
      store,
      embeddings: fakeEmbeddings(),
      llm: fakeLlm(),
    });

    await pipeline.ask({ question: "What is bhakti?", traditionPreference: "vaishnava" });
    await pipeline.ask({ question: "What is bhakti?", traditionPreference: "shaiva" });

    const firstHash = vi.mocked(store.getCachedAnswer).mock.calls[0]?.[0];
    const secondHash = vi.mocked(store.getCachedAnswer).mock.calls[1]?.[0];
    expect(firstHash).toBeDefined();
    expect(secondHash).toBeDefined();
    expect(firstHash).not.toBe(secondHash);
  });

  it("uses retrieval count and context budget in the cache key", async () => {
    const store = fakeStore({ retrieved: [] });
    const pipeline = new RagPipeline({
      store,
      embeddings: fakeEmbeddings(),
      llm: fakeLlm(),
    });

    await pipeline.ask({ question: "What is bhakti?", matchCount: 4 });
    await pipeline.ask({ question: "What is bhakti?", matchCount: 8 });
    await pipeline.ask({ question: "What is bhakti?", maxContextChars: 6_000 });

    const hashes = vi.mocked(store.getCachedAnswer).mock.calls.map((call) => call[0]);
    expect(new Set(hashes).size).toBe(3);
  });

  it("uses the embedding model in the cache key", async () => {
    const store = fakeStore({ retrieved: [] });
    const pipelineA = new RagPipeline({
      store,
      embeddings: fakeEmbeddings("embedding-a"),
      llm: fakeLlm(),
    });
    const pipelineB = new RagPipeline({
      store,
      embeddings: fakeEmbeddings("embedding-b"),
      llm: fakeLlm(),
    });

    await pipelineA.ask({ question: "What is bhakti?" });
    await pipelineB.ask({ question: "What is bhakti?" });

    const firstHash = vi.mocked(store.getCachedAnswer).mock.calls[0]?.[0];
    const secondHash = vi.mocked(store.getCachedAnswer).mock.calls[1]?.[0];
    expect(firstHash).toBeDefined();
    expect(secondHash).toBeDefined();
    expect(firstHash).not.toBe(secondHash);
  });

  it("uses the answer model in the cache key", async () => {
    const store = fakeStore({ retrieved: [] });
    const pipelineA = new RagPipeline({
      store,
      embeddings: fakeEmbeddings(),
      llm: fakeLlm(baseAnswer, "answer-model-a"),
    });
    const pipelineB = new RagPipeline({
      store,
      embeddings: fakeEmbeddings(),
      llm: fakeLlm(baseAnswer, "answer-model-b"),
    });

    await pipelineA.ask({ question: "What is bhakti?" });
    await pipelineB.ask({ question: "What is bhakti?" });

    const firstHash = vi.mocked(store.getCachedAnswer).mock.calls[0]?.[0];
    const secondHash = vi.mocked(store.getCachedAnswer).mock.calls[1]?.[0];
    expect(firstHash).toBeDefined();
    expect(secondHash).toBeDefined();
    expect(firstHash).not.toBe(secondHash);
  });

  it("normalizes runtime retrieval policy inputs before cache and retrieval", async () => {
    const store = fakeStore({ retrieved: [] });
    const pipeline = new RagPipeline({
      store,
      embeddings: fakeEmbeddings(),
      llm: fakeLlm(),
    });

    await pipeline.ask({
      question: "What is bhakti?",
      traditionPreference: " Vaishnava ",
      allowedLicences: ["public_domain", "public_domain", "original"],
      contentTypes: ["translation", "translation", "commentary"],
      languages: [" EN ", "en"],
    });

    expect(store.retrievePassages).toHaveBeenCalledWith(
      expect.objectContaining({
        embeddingModel: "test-embedding",
        traditionFilter: "vaishnava",
        allowedLicences: ["public_domain", "original"],
        contentTypes: ["translation", "commentary"],
        languages: ["en"],
      }),
    );
  });

  it("rejects invalid runtime retrieval policy inputs", async () => {
    const pipeline = new RagPipeline({
      store: fakeStore(),
      embeddings: fakeEmbeddings(),
      llm: fakeLlm(),
    });

    await expect(
      pipeline.ask({
        question: "What is bhakti?",
        traditionPreference: "made-up-tradition",
      }),
    ).rejects.toThrow("Invalid tradition preference");

    await expect(
      pipeline.ask({
        question: "What is bhakti?",
        allowedLicences: ["unknown" as "public_domain"],
      }),
    ).rejects.toThrow("Invalid licence filter");

    await expect(
      pipeline.ask({
        question: "What is bhakti?",
        contentTypes: ["unknown" as "translation"],
      }),
    ).rejects.toThrow("Invalid content type filter");

    await expect(
      pipeline.ask({
        question: "What is bhakti?",
        languages: ["english"],
      }),
    ).rejects.toThrow("Invalid language filter");
  });

  it("caps retrieval breadth and persisted retrieved passage ids at the database limit", async () => {
    const retrieved = Array.from({ length: 25 }, (_, index) => ({
      ...passage,
      passage_id: `00000000-0000-0000-0000-${String(index + 1).padStart(12, "0")}`,
      title: `Source ${index + 1}`,
    }));
    const generated: StructuredAnswer = {
      ...baseAnswer,
      sources: [
        {
          passage_id: retrieved[0]?.passage_id ?? passage.passage_id,
          title: "Source 1",
          location: "Chapter 2 2.47",
          relevance: "First capped source.",
        },
      ],
    };
    const store = fakeStore({ retrieved });
    const pipeline = new RagPipeline({
      store,
      embeddings: fakeEmbeddings(),
      llm: fakeLlm(generated),
    });

    const result = await pipeline.ask({
      question: "What does the Gita say about action?",
      matchCount: 25,
    });

    expect(store.retrievePassages).toHaveBeenCalledWith(
      expect.objectContaining({ matchCount: 20 }),
    );
    expect(result.retrievedPassageIds).toHaveLength(20);
    expect(store.putCachedAnswer).toHaveBeenCalledWith(
      expect.any(String),
      result.answer,
      expect.arrayContaining([retrieved[0]?.passage_id]),
    );
    const persistedIds = vi.mocked(store.putCachedAnswer).mock.calls.at(-1)?.[2];
    expect(persistedIds).toHaveLength(20);
  });

  it("filters generated citations to retrieved passage ids only", async () => {
    const generated: StructuredAnswer = {
      ...baseAnswer,
      sources: [
        {
          passage_id: passage.passage_id,
          title: "Bhagavad Gita",
          location: "Chapter 2 2.47",
          relevance: "Grounds karma yoga.",
        },
        {
          passage_id: passage.passage_id,
          title: "Bhagavad Gita",
          location: "Chapter 2 2.47",
          relevance: "Duplicate citation should be removed.",
        },
        {
          passage_id: "11111111-1111-1111-1111-111111111111",
          title: "Invented",
          location: "9.99",
          relevance: "Should be removed.",
        },
      ],
    };
    const store = fakeStore({ retrieved: [passage] });
    const pipeline = new RagPipeline({
      store,
      embeddings: fakeEmbeddings(),
      llm: fakeLlm(generated),
    });

    const result = await pipeline.ask({
      question: "What does the Gita say about action?",
      languages: ["en"],
    });

    expect(result.cache).toBe("miss");
    expect(result.answer.sources).toHaveLength(1);
    expect(result.answer.sources[0]?.passage_id).toBe(passage.passage_id);
    expect(store.putCachedAnswer).toHaveBeenCalledOnce();
    expect(store.retrievePassages).toHaveBeenCalledWith(
      expect.objectContaining({
        languages: ["en"],
        allowedLicences: ["public_domain", "original"],
        queryText: "What does the Gita say about action?",
        keywordWeight: 0.15,
      }),
    );
  });

  it("filters retrieved passages against the application retrieval policy before generation", async () => {
    const licensedPassage: RetrievedPassage = {
      ...passage,
      passage_id: "00000000-0000-0000-0000-000000000202",
      licence: "licensed",
    };
    const wrongTraditionPassage: RetrievedPassage = {
      ...passage,
      passage_id: "00000000-0000-0000-0000-000000000203",
      tradition: "shaiva",
    };
    const wrongLanguagePassage: RetrievedPassage = {
      ...passage,
      passage_id: "00000000-0000-0000-0000-000000000204",
      language: "sa",
    };
    const lowSimilarityPassage: RetrievedPassage = {
      ...passage,
      passage_id: "00000000-0000-0000-0000-000000000205",
      similarity: 0.1,
    };
    const store = fakeStore({
      retrieved: [
        passage,
        licensedPassage,
        wrongTraditionPassage,
        wrongLanguagePassage,
        lowSimilarityPassage,
      ],
    });
    const llm = fakeLlm({
      ...baseAnswer,
      sources: [
        {
          passage_id: passage.passage_id,
          title: passage.title,
          location: "Chapter 2 2.47",
          relevance: "Allowed source.",
        },
      ],
    });
    const pipeline = new RagPipeline({
      store,
      embeddings: fakeEmbeddings(),
      llm,
    });

    const result = await pipeline.ask({
      question: "What does the Gita say about action?",
      traditionPreference: "vaishnava",
      languages: ["en"],
      minSimilarity: 0.2,
    });

    expect(result.retrievedPassages.map((retrieved) => retrieved.passage_id)).toEqual([
      passage.passage_id,
    ]);
    expect(llm.generateStructuredAnswer).toHaveBeenCalledWith(
      expect.objectContaining({
        sources: [
          {
            passage_id: passage.passage_id,
            title: passage.title,
            location: "Chapter 2 2.47",
          },
        ],
      }),
    );
  });

  it("ignores malformed retrieved rows before policy filtering and prompt construction", async () => {
    const malformedPassage = {
      ...passage,
      passage_id: "not-a-uuid",
      chunk_text: null,
      similarity: Number.NaN,
    } as unknown as RetrievedPassage;
    const llm = fakeLlm({
      ...baseAnswer,
      sources: [
        {
          passage_id: passage.passage_id,
          title: passage.title,
          location: "Chapter 2 2.47",
          relevance: "Allowed source.",
        },
      ],
    });
    const pipeline = new RagPipeline({
      store: fakeStore({ retrieved: [malformedPassage, passage] }),
      embeddings: fakeEmbeddings(),
      llm,
    });

    const result = await pipeline.ask({
      question: "What does the Gita say about action?",
    });

    expect(result.retrievedPassageIds).toEqual([passage.passage_id]);
    expect(llm.generateStructuredAnswer).toHaveBeenCalledWith(
      expect.objectContaining({
        sources: [
          {
            passage_id: passage.passage_id,
            title: passage.title,
            location: "Chapter 2 2.47",
          },
        ],
      }),
    );
  });

  it("only allows citations from passages included in the prompt context budget", async () => {
    const laterPassage: RetrievedPassage = {
      ...passage,
      passage_id: "00000000-0000-0000-0000-000000000206",
      title: "Later Source",
      chunk_text: "This passage should not fit into the context budget.",
    };
    const generated: StructuredAnswer = {
      ...baseAnswer,
      sources: [
        {
          passage_id: laterPassage.passage_id,
          title: "Later Source",
          location: "Chapter 3 3.1",
          relevance: "Should be rejected because the passage was not in context.",
        },
      ],
    };
    const llm = fakeLlm(generated);
    const pipeline = new RagPipeline({
      store: fakeStore({ retrieved: [passage, laterPassage] }),
      embeddings: fakeEmbeddings(),
      llm,
    });

    const result = await pipeline.ask({
      question: "What does the Gita say about action?",
      maxContextChars: 500,
    });

    expect(llm.generateStructuredAnswer).toHaveBeenCalledWith(
      expect.objectContaining({
        sources: [
          {
            passage_id: passage.passage_id,
            title: passage.title,
            location: "Chapter 2 2.47",
          },
        ],
      }),
    );
    expect(result.answer.answer).toContain("properly sourced answer");
    expect(result.answer.sources).toEqual([]);
  });

  it("canonicalizes cited titles and locations from retrieved passages", async () => {
    const llm = fakeLlm({
      ...baseAnswer,
      sources: [
        {
          passage_id: passage.passage_id,
          title: "Invented title",
          location: "Invented location",
          relevance: "The model's explanation of relevance.",
        },
      ],
    });
    const store = fakeStore({ retrieved: [passage] });
    const pipeline = new RagPipeline({
      store,
      embeddings: fakeEmbeddings(),
      llm,
    });

    const result = await pipeline.ask({ question: "What does the Gita say about action?" });

    expect(result.answer.sources).toEqual([
      {
        passage_id: passage.passage_id,
        title: passage.title,
        location: "Chapter 2 2.47",
        relevance: "The model's explanation of relevance.",
      },
    ]);
  });

  it("skips oversized retrieved passages and uses the next passage that fits the context budget", async () => {
    const oversizedPassage: RetrievedPassage = {
      ...passage,
      passage_id: "00000000-0000-0000-0000-000000000207",
      title: "Oversized Source",
      chunk_text: "x".repeat(1_000),
    };
    const fittingPassage: RetrievedPassage = {
      ...passage,
      passage_id: "00000000-0000-0000-0000-000000000208",
      title: "Fitting Source",
      chunk_text: "Short source text.",
    };
    const generated: StructuredAnswer = {
      ...baseAnswer,
      sources: [
        {
          passage_id: fittingPassage.passage_id,
          title: "Fitting Source",
          location: "Chapter 2 2.47",
          relevance: "Fits the prompt context.",
        },
      ],
    };
    const llm = fakeLlm(generated);
    const pipeline = new RagPipeline({
      store: fakeStore({ retrieved: [oversizedPassage, fittingPassage] }),
      embeddings: fakeEmbeddings(),
      llm,
    });

    const result = await pipeline.ask({
      question: "What does the Gita say about action?",
      maxContextChars: 250,
    });

    expect(result.answer.sources).toHaveLength(1);
    expect(result.answer.sources[0]?.passage_id).toBe(fittingPassage.passage_id);
    expect(llm.generateStructuredAnswer).toHaveBeenCalledWith(
      expect.objectContaining({
        sources: [
          {
            passage_id: fittingPassage.passage_id,
            title: fittingPassage.title,
            location: "Chapter 2 2.47",
          },
        ],
      }),
    );
  });

  it("does not call the LLM when no retrieved passage fits the context budget", async () => {
    const oversizedPassage: RetrievedPassage = {
      ...passage,
      chunk_text: "x".repeat(1_000),
    };
    const store = fakeStore({ retrieved: [oversizedPassage] });
    const llm = fakeLlm();
    const pipeline = new RagPipeline({
      store,
      embeddings: fakeEmbeddings(),
      llm,
    });

    const result = await pipeline.ask({
      question: "What does the Gita say about action?",
      maxContextChars: 250,
    });

    expect(result.answer.answer).toContain("context budget");
    expect(result.answer.confidence).toBe("low");
    expect(result.answer.sources).toEqual([]);
    expect(result.modelUsed).toBeNull();
    expect(llm.generateStructuredAnswer).not.toHaveBeenCalled();
    expect(store.putCachedAnswer).not.toHaveBeenCalled();
  });

  it("replaces generated answers when all citations are invalid", async () => {
    const generated: StructuredAnswer = {
      ...baseAnswer,
      confidence: "medium",
      sources: [
        {
          passage_id: "11111111-1111-1111-1111-111111111111",
          title: "Invented",
          location: "9.99",
          relevance: "Should be removed.",
        },
      ],
    };
    const store = fakeStore({ retrieved: [passage] });
    const pipeline = new RagPipeline({
      store,
      embeddings: fakeEmbeddings(),
      llm: fakeLlm(generated),
    });

    const result = await pipeline.ask({ question: "What does the Gita say about action?" });

    expect(result.answer.answer).toContain("properly sourced answer");
    expect(result.answer.sources).toEqual([]);
    expect(result.answer.confidence).toBe("low");
    expect(store.putCachedAnswer).not.toHaveBeenCalled();
  });

  it("retries once when the provider returns malformed structured output", async () => {
    const retryAnswer: StructuredAnswer = {
      ...baseAnswer,
      sources: [
        {
          passage_id: passage.passage_id,
          title: passage.title,
          location: "Chapter 2 2.47",
          relevance: "Supports the answer.",
        },
      ],
    };
    const llm = fakeLlmSequence([
      new Error("Structured answer failed field validation."),
      retryAnswer,
    ]);
    const pipeline = new RagPipeline({
      store: fakeStore({ retrieved: [passage] }),
      embeddings: fakeEmbeddings(),
      llm,
    });

    const result = await pipeline.ask({ question: "What does the Gita say about action?" });

    expect(result.answer).toEqual(retryAnswer);
    expect(llm.generateStructuredAnswer).toHaveBeenCalledTimes(2);
  });

  it("does not call the LLM when retrieval returns no approved passages", async () => {
    const store = fakeStore({ retrieved: [] });
    const embeddings = fakeEmbeddings();
    const llm = fakeLlm();
    const pipeline = new RagPipeline({ store, embeddings, llm });

    const result = await pipeline.ask({ question: "A question outside the approved corpus" });

    expect(result.answer.confidence).toBe("low");
    expect(result.answer.sources).toEqual([]);
    expect(result.modelUsed).toBeNull();
    expect(embeddings.embed).toHaveBeenCalledOnce();
    expect(llm.generateStructuredAnswer).not.toHaveBeenCalled();
    expect(store.putCachedAnswer).not.toHaveBeenCalled();
  });

  it("can skip cache writes for uncached generated answers", async () => {
    const generated: StructuredAnswer = {
      ...baseAnswer,
      sources: [
        {
          passage_id: passage.passage_id,
          title: passage.title,
          location: "Chapter 2 2.47",
          relevance: "Backed by retrieval.",
        },
      ],
    };
    const store = fakeStore({ retrieved: [passage] });
    const pipeline = new RagPipeline({
      store,
      embeddings: fakeEmbeddings(),
      llm: fakeLlm(generated),
    });

    const result = await pipeline.ask({
      question: "What does the Gita say about action?",
      useCache: false,
      writeCache: false,
    });

    expect(result.cache).toBe("skipped");
    expect(store.getCachedAnswer).not.toHaveBeenCalled();
    expect(store.putCachedAnswer).not.toHaveBeenCalled();
  });

  it("can skip cache writes for no-source fallback answers", async () => {
    const store = fakeStore({ retrieved: [] });
    const pipeline = new RagPipeline({
      store,
      embeddings: fakeEmbeddings(),
      llm: fakeLlm(),
    });

    const result = await pipeline.ask({
      question: "A question outside the approved corpus",
      writeCache: false,
    });

    expect(result.answer.confidence).toBe("low");
    expect(store.putCachedAnswer).not.toHaveBeenCalled();
  });
});

function fakeStore(
  options: {
    cached?: Awaited<ReturnType<RagStore["getCachedAnswer"]>>;
    retrieved?: RetrievedPassage[];
  } = {},
): RagStore {
  return {
    getCachedAnswer: vi.fn(async () => options.cached ?? null),
    recordCacheHit: vi.fn(async () => undefined),
    putCachedAnswer: vi.fn(async () => undefined),
    retrievePassages: vi.fn(async () => options.retrieved ?? [passage]),
  };
}

function fakeEmbeddings(model = "test-embedding"): EmbeddingProvider {
  return {
    model,
    embed: vi.fn(async () => [0.1, 0.2, 0.3]),
  };
}

function fakeLlm(answer: StructuredAnswer = baseAnswer, model = "test-llm"): LlmProvider {
  return {
    model,
    generateStructuredAnswer: vi.fn(async () => ({
      answer,
      usage: { inputTokens: 10, outputTokens: 20 },
    })),
  };
}

function fakeLlmSequence(values: Array<StructuredAnswer | Error>, model = "test-llm"): LlmProvider {
  let index = 0;
  return {
    model,
    generateStructuredAnswer: vi.fn(async () => {
      const value = values[Math.min(index++, values.length - 1)];
      if (value instanceof Error) throw value;
      return { answer: value, usage: { inputTokens: 10, outputTokens: 20 } };
    }),
  };
}
