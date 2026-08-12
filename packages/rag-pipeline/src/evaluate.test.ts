import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import type { StructuredAnswer } from "@dharma-daily/shared-types";
import { describe, expect, it } from "vitest";

import {
  evaluateCase,
  parseCliArgs,
  readEvalCases,
  validateEvalCase,
  validateEvalCasesAgainstCorpus,
} from "./evaluate.js";

import type { AskResult } from "./index.js";

const answer: StructuredAnswer = {
  answer: "A grounded answer about dharma.",
  summary: "Summary.",
  sources: [
    {
      passage_id: "00000000-0000-0000-0000-000000000201",
      title: "Bhagavad Gita",
      location: "2.47",
      relevance: "Grounds the answer.",
    },
  ],
  tradition_notes: [],
  confidence: "medium",
  safety_note: null,
  suggested_practice: null,
};

const result: AskResult = {
  answer,
  retrievedPassages: [
    {
      passage_id: "00000000-0000-0000-0000-000000000201",
      commentary_id: null,
      text_id: "00000000-0000-0000-0000-000000000101",
      title: "Bhagavad Gita",
      section: "Chapter 2",
      verse_number: "2.47",
      chunk_text: "Act without attachment to fruits.",
      content_type: "translation",
      licence: "public_domain",
      tradition: "general",
      language: "en",
      source_url: null,
      similarity: 0.9,
    },
  ],
  retrievedPassageIds: ["00000000-0000-0000-0000-000000000201"],
  cache: "miss",
  modelUsed: "test",
  embeddingModel: "test-embedding",
  tokensIn: 10,
  tokensOut: 10,
};

const repositoryEvalFile = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../../../content/_staging/evals/rag-eval.example.jsonl",
);

describe("evaluateCase", () => {
  it("passes when expected citations, source titles, and confidence are present", () => {
    const evaluation = evaluateCase(
      {
        id: "gita-action",
        question: "What does the Gita teach about action?",
        expectedPassageIds: ["00000000-0000-0000-0000-000000000201"],
        expectedSourceTitles: ["Gita"],
        expectedRetrievedLanguages: ["en"],
        expectedRetrievedTraditions: ["general"],
        expectedRetrievedContentTypes: ["translation"],
        mustContain: ["dharma"],
        minConfidence: "medium",
        minRetrieved: 1,
        minCited: 1,
      },
      result,
    );

    expect(evaluation.passed).toBe(true);
    expect(evaluation.failures).toEqual([]);
  });

  it("fails when the answer cites a passage that was not retrieved", () => {
    const evaluation = evaluateCase(
      {
        question: "What does the Gita teach about action?",
      },
      {
        ...result,
        answer: {
          ...answer,
          sources: [
            {
              passage_id: "11111111-1111-1111-1111-111111111111",
              title: "Invented",
              location: "9.99",
              relevance: "Bad citation.",
            },
          ],
        },
      },
    );

    expect(evaluation.passed).toBe(false);
    expect(evaluation.failures[0]).toContain("cited non-retrieved");
  });

  it("uses cached retrieved passage ids as citation evidence on cache hits", () => {
    const evaluation = evaluateCase(
      {
        question: "What does the Gita teach about action?",
        expectedSourceTitles: ["Gita"],
      },
      {
        ...result,
        retrievedPassages: [],
        cache: "hit",
      },
    );

    expect(evaluation.passed).toBe(true);
    expect(evaluation.failures).toEqual([]);
  });

  it("fails when eval retrieval and citation minimums are not met", () => {
    const evaluation = evaluateCase(
      {
        question: "What does the Gita teach about action?",
        minRetrieved: 2,
        minCited: 2,
      },
      result,
    );

    expect(evaluation.passed).toBe(false);
    expect(evaluation.failures).toEqual(
      expect.arrayContaining([
        "retrieved 1 passages, below required 2",
        "cited 1 passages, below required 2",
      ]),
    );
  });

  it("fails when expected retrieval metadata is missing", () => {
    const evaluation = evaluateCase(
      {
        question: "What does the Gita teach about action?",
        expectedRetrievedLanguages: ["hi"],
        expectedRetrievedTraditions: ["shaiva"],
        expectedRetrievedContentTypes: ["commentary"],
      },
      result,
    );

    expect(evaluation.passed).toBe(false);
    expect(evaluation.failures).toEqual(
      expect.arrayContaining([
        'missing expected retrieved language "hi"',
        'missing expected retrieved tradition "shaiva"',
        'missing expected retrieved content type "commentary"',
      ]),
    );
  });

  it("requires low confidence for ordinary no-source eval cases", () => {
    const evaluation = evaluateCase(
      {
        question: "What did my local priest say yesterday?",
        expectNoSources: true,
      },
      {
        ...result,
        answer: {
          ...answer,
          sources: [],
          confidence: "medium",
        },
        retrievedPassages: [],
        retrievedPassageIds: [],
      },
    );

    expect(evaluation.passed).toBe(false);
    expect(evaluation.failures).toContain("expected no-source answer confidence low, got medium");
  });

  it("rejects malformed eval cases before model calls", () => {
    expect(() =>
      validateEvalCase({
        question: "What is dharma?",
        minConfidence: "certain" as "low",
      }),
    ).toThrow("Invalid minConfidence");

    expect(() =>
      validateEvalCase({
        question: "What is dharma?",
        mustContain: [""] as string[],
      }),
    ).toThrow("Invalid mustContain");

    expect(() =>
      validateEvalCase({
        question: "What is dharma?",
        expectedRetrievedLanguages: [""],
      }),
    ).toThrow("Invalid expectedRetrievedLanguages");

    expect(() =>
      validateEvalCase({
        question: "What is dharma?",
        expectNoSources: "yes" as unknown as boolean,
      }),
    ).toThrow("Invalid expectNoSources");

    expect(() =>
      validateEvalCase({
        question: "What is dharma?",
        minRetrieved: -1,
      }),
    ).toThrow("Invalid minRetrieved");

    expect(() =>
      validateEvalCase({
        question: "What is dharma?",
        expectedPassageIds: ["not-a-uuid"],
      }),
    ).toThrow("Invalid expectedPassageIds");

    expect(() =>
      validateEvalCase({
        question: "What is dharma?",
        expectNoSources: true,
        minCited: 1,
      }),
    ).toThrow("expectNoSources conflicts with minCited");

    expect(() =>
      validateEvalCase({
        question: "What is dharma?",
        expectedSafetyNote: "medical",
      }),
    ).toThrow("expectedSafetyNote");

    expect(() =>
      validateEvalCase({
        question: "What is dharma?",
        mustContain: ["dharma"],
        minConfidence: "medium",
      }),
    ).toThrow("sourced evals must assert");
  });

  it("rejects an empty eval file", async () => {
    const dir = await mkdtemp(join(tmpdir(), "rag-eval-"));
    const file = join(dir, "empty.jsonl");
    await writeFile(file, "\n# no cases\n", "utf8");

    await expect(readEvalCases(file)).rejects.toThrow("No eval cases found");

    await rm(dir, { recursive: true, force: true });
  });

  it("validates eval expectations against a prepared corpus file", async () => {
    const dir = await mkdtemp(join(tmpdir(), "rag-eval-"));
    const corpusFile = join(dir, "rag-corpus.jsonl");
    await writeFile(
      corpusFile,
      `${JSON.stringify({
        text_title: "Bhagavad Gita",
        language: "en",
        tradition_primary: "general",
      })}\n`,
      "utf8",
    );

    await expect(
      validateEvalCasesAgainstCorpus(
        [
          {
            question: "What does the Gita teach?",
            expectedSourceTitles: ["Gita"],
            expectedRetrievedLanguages: ["en"],
            expectedRetrievedTraditions: ["general"],
            expectedRetrievedContentTypes: ["translation"],
          },
        ],
        corpusFile,
      ),
    ).resolves.toBeUndefined();

    await rm(dir, { recursive: true, force: true });
  });

  it("rejects eval expectations that are absent from the prepared corpus", async () => {
    const dir = await mkdtemp(join(tmpdir(), "rag-eval-"));
    const corpusFile = join(dir, "rag-corpus.jsonl");
    await writeFile(
      corpusFile,
      `${JSON.stringify({
        text_title: "Bhagavad Gita",
        language: "en",
        tradition_primary: "general",
      })}\n`,
      "utf8",
    );

    await expect(
      validateEvalCasesAgainstCorpus(
        [
          {
            id: "missing-title",
            question: "What does the Ramayana teach?",
            expectedSourceTitles: ["Ramayana"],
          },
        ],
        corpusFile,
      ),
    ).rejects.toThrow('expects source title "Ramayana"');

    await expect(
      validateEvalCasesAgainstCorpus(
        [
          {
            id: "missing-language",
            question: "Hindi Gita",
            expectedRetrievedLanguages: ["hi"],
          },
        ],
        corpusFile,
      ),
    ).rejects.toThrow('expects retrieved language "hi"');

    await rm(dir, { recursive: true, force: true });
  });

  it("loads the repository starter eval file", async () => {
    const cases = await readEvalCases(repositoryEvalFile);

    expect(cases.length).toBeGreaterThan(0);
    expect(cases.some((testCase) => testCase.expectNoSources !== true)).toBe(true);
  });
});

describe("parseCliArgs", () => {
  it("accepts the output option before the eval file", () => {
    expect(parseCliArgs(["--validate-only", "--out", "report.json", "cases.jsonl"])).toEqual({
      validateOnly: true,
      evalFile: "cases.jsonl",
      corpusFile: "content/_staging/prepared/rag-corpus.jsonl",
      outputFile: "report.json",
    });
  });

  it("does not treat the output path as the eval file", () => {
    expect(parseCliArgs(["cases.jsonl", "--out=report.json"])).toEqual({
      validateOnly: false,
      evalFile: "cases.jsonl",
      corpusFile: "content/_staging/prepared/rag-corpus.jsonl",
      outputFile: "report.json",
    });
  });
});
