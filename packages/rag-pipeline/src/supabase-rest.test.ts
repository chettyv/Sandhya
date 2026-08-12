import { describe, expect, it, vi } from "vitest";

import { SupabaseRagStore } from "./supabase-rest.js";

const CACHE_POLICY = {
  allowedLicences: ["public_domain", "original"],
  contentTypes: ["translation", "commentary", "combined"],
  traditionFilter: "general",
  languages: null,
  embeddingModel: "text-embedding-3-small",
};

describe("SupabaseRagStore", () => {
  it("upserts cached answers on question_hash", async () => {
    const fetchMock = vi.fn(async () => new Response("[]", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const store = new SupabaseRagStore({
      url: "https://project.supabase.co",
      serviceRoleKey: "service-role",
    });

    await store.putCachedAnswer(
      "abc123",
      {
        answer: "Answer",
        summary: "Summary",
        sources: [
          {
            passage_id: "00000000-0000-0000-0000-000000000201",
            title: "Test Source",
            location: "1.1",
            relevance: "Backs the cached answer.",
          },
        ],
        tradition_notes: [],
        confidence: "medium",
        safety_note: null,
        suggested_practice: null,
      },
      ["00000000-0000-0000-0000-000000000201"],
    );

    expect(fetchMock).toHaveBeenCalledWith(
      "https://project.supabase.co/rest/v1/cached_answers?on_conflict=question_hash",
      expect.objectContaining({ method: "POST" }),
    );
    const requestBody = JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body));
    expect(requestBody).toEqual(
      expect.objectContaining({
        question_hash: "abc123",
        structured_response: expect.objectContaining({ answer: "Answer" }),
        retrieved_passage_ids: ["00000000-0000-0000-0000-000000000201"],
        expires_at: expect.any(String),
      }),
    );
    expect(requestBody).not.toHaveProperty("question_text");
    vi.unstubAllGlobals();
  });

  it("returns cached answers with retrieved passage ids", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        Response.json([
          {
            structured_response: {
              answer: "Cached",
              summary: "Summary",
              sources: [
                {
                  passage_id: "00000000-0000-0000-0000-000000000201",
                  title: "Test Source",
                  location: "1.1",
                  relevance: "Backs the cached answer.",
                },
              ],
              tradition_notes: [],
              confidence: "medium",
              safety_note: null,
              suggested_practice: null,
            },
            retrieved_passage_ids: ["00000000-0000-0000-0000-000000000201"],
          },
        ]),
      )
      .mockResolvedValueOnce(Response.json(true));
    vi.stubGlobal("fetch", fetchMock);
    const store = new SupabaseRagStore({
      url: "https://project.supabase.co",
      serviceRoleKey: "service-role",
    });

    const cached = await store.getCachedAnswer("abc123", CACHE_POLICY);

    expect(cached?.answer.answer).toBe("Cached");
    expect(cached?.retrievedPassageIds).toEqual(["00000000-0000-0000-0000-000000000201"]);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining(
        "https://project.supabase.co/rest/v1/cached_answers?question_hash=eq.abc123&expires_at=gt.",
      ),
      expect.objectContaining({ method: "GET" }),
    );
    expect(fetchMock).toHaveBeenCalledWith(
      "https://project.supabase.co/rest/v1/rpc/cached_answer_sources_are_allowed",
      expect.objectContaining({ method: "POST" }),
    );
    const rightsRequest = fetchMock.mock.calls[1]?.[1];
    expect(JSON.parse(String(rightsRequest?.body))).toEqual({
      p_retrieved_ids: ["00000000-0000-0000-0000-000000000201"],
      p_allowed_licences: ["public_domain", "original"],
      p_content_types: ["translation", "commentary", "combined"],
      p_tradition_filter: "general",
      p_languages: null,
      p_embedding_model: "text-embedding-3-small",
    });
    vi.unstubAllGlobals();
  });

  it("fails closed when cached answer rights cannot be evaluated", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        Response.json([
          {
            structured_response: {
              answer: "Cached",
              summary: "Summary",
              sources: [
                {
                  passage_id: "00000000-0000-0000-0000-000000000201",
                  title: "Test Source",
                  location: "1.1",
                  relevance: "Backs the cached answer.",
                },
              ],
              tradition_notes: [],
              confidence: "medium",
              safety_note: null,
              suggested_practice: null,
            },
            retrieved_passage_ids: ["00000000-0000-0000-0000-000000000201"],
          },
        ]),
      )
      .mockResolvedValueOnce(new Response("{}", { status: 400 }));
    vi.stubGlobal("fetch", fetchMock);
    const store = new SupabaseRagStore({
      url: "https://project.supabase.co",
      serviceRoleKey: "service-role",
    });

    await expect(store.getCachedAnswer("abc123", CACHE_POLICY)).resolves.toBeNull();
    vi.unstubAllGlobals();
  });

  it("fails closed for malformed cached-answer rights responses", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        Response.json([
          {
            structured_response: {
              answer: "Cached",
              summary: "Summary",
              sources: [
                {
                  passage_id: "00000000-0000-0000-0000-000000000201",
                  title: "Test Source",
                  location: "1.1",
                  relevance: "Backs the cached answer.",
                },
              ],
              tradition_notes: [],
              confidence: "medium",
              safety_note: null,
              suggested_practice: null,
            },
            retrieved_passage_ids: ["00000000-0000-0000-0000-000000000201"],
          },
        ]),
      )
      .mockResolvedValueOnce(Response.json({ unexpected: true, allowed: false }));
    vi.stubGlobal("fetch", fetchMock);
    const store = new SupabaseRagStore({
      url: "https://project.supabase.co",
      serviceRoleKey: "service-role",
    });

    await expect(store.getCachedAnswer("abc123", CACHE_POLICY)).resolves.toBeNull();
    vi.unstubAllGlobals();
  });

  it("ignores cached rows that fail cache persistence validation", async () => {
    const fetchMock = vi.fn(async () =>
      Response.json([
        {
          structured_response: {
            answer: "Cached",
            summary: "Summary",
            sources: [],
            tradition_notes: [],
            confidence: "medium",
            safety_note: null,
            suggested_practice: null,
          },
          retrieved_passage_ids: [],
        },
      ]),
    );
    vi.stubGlobal("fetch", fetchMock);
    const store = new SupabaseRagStore({
      url: "https://project.supabase.co",
      serviceRoleKey: "service-role",
    });

    await expect(store.getCachedAnswer("abc123", CACHE_POLICY)).resolves.toBeNull();

    vi.unstubAllGlobals();
  });

  it("ignores cached rows with duplicate or excessive retrieved passage ids", async () => {
    const cachedResponse = {
      structured_response: {
        answer: "Cached",
        summary: "Summary",
        sources: [
          {
            passage_id: "00000000-0000-0000-0000-000000000201",
            title: "Test Source",
            location: "1.1",
            relevance: "Backs the cached answer.",
          },
        ],
        tradition_notes: [],
        confidence: "medium",
        safety_note: null,
        suggested_practice: null,
      },
    };
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        Response.json([
          {
            ...cachedResponse,
            retrieved_passage_ids: [
              "00000000-0000-0000-0000-000000000201",
              "00000000-0000-0000-0000-000000000201",
            ],
          },
        ]),
      )
      .mockResolvedValueOnce(
        Response.json([
          {
            ...cachedResponse,
            retrieved_passage_ids: Array.from(
              { length: 21 },
              (_, index) => `00000000-0000-0000-0000-${String(index + 1).padStart(12, "0")}`,
            ),
          },
        ]),
      );
    vi.stubGlobal("fetch", fetchMock);
    const store = new SupabaseRagStore({
      url: "https://project.supabase.co",
      serviceRoleKey: "service-role",
    });

    await expect(store.getCachedAnswer("abc123", CACHE_POLICY)).resolves.toBeNull();
    await expect(store.getCachedAnswer("def456", CACHE_POLICY)).resolves.toBeNull();

    vi.unstubAllGlobals();
  });

  it("rejects invalid cached answer writes before calling Supabase", async () => {
    const fetchMock = vi.fn(async () => new Response("[]", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const store = new SupabaseRagStore({
      url: "https://project.supabase.co",
      serviceRoleKey: "service-role",
    });

    await expect(
      store.putCachedAnswer(
        "abc123",
        {
          answer: "Answer",
          summary: "Summary",
          sources: [
            {
              passage_id: "11111111-1111-1111-1111-111111111111",
              title: "Invented",
              location: "9.99",
              relevance: "Not backed by retrieved passage IDs.",
            },
          ],
          tradition_notes: [],
          confidence: "medium",
          safety_note: null,
          suggested_practice: null,
        },
        ["00000000-0000-0000-0000-000000000201"],
      ),
    ).rejects.toThrow("Cached answer failed persistence validation");
    expect(fetchMock).not.toHaveBeenCalled();

    vi.unstubAllGlobals();
  });

  it("rejects duplicate retrieved passage ids on cached answer writes", async () => {
    const fetchMock = vi.fn(async () => new Response("[]", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const store = new SupabaseRagStore({
      url: "https://project.supabase.co",
      serviceRoleKey: "service-role",
    });

    await expect(
      store.putCachedAnswer(
        "abc123",
        {
          answer: "Answer",
          summary: "Summary",
          sources: [
            {
              passage_id: "00000000-0000-0000-0000-000000000201",
              title: "Test Source",
              location: "1.1",
              relevance: "Backs the cached answer.",
            },
          ],
          tradition_notes: [],
          confidence: "medium",
          safety_note: null,
          suggested_practice: null,
        },
        ["00000000-0000-0000-0000-000000000201", "00000000-0000-0000-0000-000000000201"],
      ),
    ).rejects.toThrow("Cached answer failed persistence validation");
    expect(fetchMock).not.toHaveBeenCalled();

    vi.unstubAllGlobals();
  });

  it("rejects uncited cached answer writes", async () => {
    const fetchMock = vi.fn(async () => new Response("[]", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const store = new SupabaseRagStore({
      url: "https://project.supabase.co",
      serviceRoleKey: "service-role",
    });

    await expect(
      store.putCachedAnswer(
        "abc123",
        {
          answer: "There is not enough reviewed material to answer this safely.",
          summary: "No grounded answer available.",
          sources: [],
          tradition_notes: [],
          confidence: "low",
          safety_note: null,
          suggested_practice: null,
        },
        ["00000000-0000-0000-0000-000000000201"],
      ),
    ).rejects.toThrow("Cached answer failed persistence validation");
    expect(fetchMock).not.toHaveBeenCalled();

    vi.unstubAllGlobals();
  });

  it("passes hybrid retrieval inputs to the match RPC", async () => {
    const fetchMock = vi.fn(async () =>
      Response.json([
        {
          passage_id: "00000000-0000-0000-0000-000000000201",
          commentary_id: null,
          text_id: "00000000-0000-0000-0000-000000000101",
          title: "Bhagavad Gita",
          section: "Chapter 2",
          verse_number: "2.47",
          chunk_text: "Act with care.",
          content_type: "translation",
          licence: "public_domain",
          tradition: "general",
          language: "en",
          source_url: null,
          similarity: 0.91,
        },
      ]),
    );
    vi.stubGlobal("fetch", fetchMock);
    const store = new SupabaseRagStore({
      url: "https://project.supabase.co",
      serviceRoleKey: "service-role",
    });

    const retrieved = await store.retrievePassages({
      embedding: [0.1, 0.2, 0.3],
      embeddingModel: "text-embedding-3-small",
      matchCount: 8,
      allowedLicences: ["public_domain", "original"],
      contentTypes: ["translation", "commentary"],
      traditionFilter: "general",
      queryText: "What is dharma?",
      keywordWeight: 0.2,
      minSimilarity: 0.1,
    });

    expect(retrieved).toHaveLength(1);
    expect(retrieved[0]?.passage_id).toBe("00000000-0000-0000-0000-000000000201");
    expect(fetchMock).toHaveBeenCalledWith(
      "https://project.supabase.co/rest/v1/rpc/match_passage_embeddings",
      expect.objectContaining({ method: "POST" }),
    );
    const request = fetchMock.mock.calls[0]?.[1] as RequestInit | undefined;
    if (typeof request?.body !== "string") {
      throw new Error("Expected string request body.");
    }
    const requestBody = JSON.parse(request.body) as Record<string, unknown>;
    expect(requestBody).toEqual(
      expect.objectContaining({
        query_embedding: "[0.1,0.2,0.3]",
        embedding_model: "text-embedding-3-small",
        query_text: "What is dharma?",
        keyword_weight: 0.2,
        min_similarity: 0.1,
      }),
    );
    vi.unstubAllGlobals();
  });

  it("rejects malformed retrieval rows from Supabase", async () => {
    const fetchMock = vi.fn(async () =>
      Response.json([
        {
          passage_id: "not-a-uuid",
          chunk_text: "",
          content_type: "translation",
          licence: "public_domain",
          similarity: 0.9,
        },
      ]),
    );
    vi.stubGlobal("fetch", fetchMock);
    const store = new SupabaseRagStore({
      url: "https://project.supabase.co",
      serviceRoleKey: "service-role",
    });

    await expect(
      store.retrievePassages({
        embedding: [0.1, 0.2, 0.3],
        embeddingModel: "text-embedding-3-small",
        matchCount: 8,
        allowedLicences: ["public_domain", "original"],
        contentTypes: ["translation", "commentary"],
        traditionFilter: "general",
      }),
    ).rejects.toThrow("Supabase retrieval response failed validation");

    vi.unstubAllGlobals();
  });

  it("rejects invalid embedding vectors before calling Supabase", async () => {
    const fetchMock = vi.fn(async () => new Response("[]", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const store = new SupabaseRagStore({
      url: "https://project.supabase.co",
      serviceRoleKey: "service-role",
    });

    await expect(
      store.retrievePassages({
        embedding: [0.1, Number.NaN],
        embeddingModel: "text-embedding-3-small",
        matchCount: 8,
        allowedLicences: ["public_domain", "original"],
        contentTypes: ["translation", "commentary"],
        traditionFilter: "general",
      }),
    ).rejects.toThrow("Embedding must be a non-empty numeric vector");
    expect(fetchMock).not.toHaveBeenCalled();

    vi.unstubAllGlobals();
  });
});
