import { describe, expect, it } from "vitest";

import { RAG_TOKEN_ENCODING, countTokens } from "./token-count.js";

describe("RAG token counting", () => {
  it("uses the declared OpenAI encoding", () => {
    expect(RAG_TOKEN_ENCODING).toBe("cl100k_base");
    expect(countTokens("What is dharma? ")).toBeGreaterThan(0);
  });

  it("counts Devanagari text without falling back to character heuristics", () => {
    expect(countTokens("धर्म और साधना")).toBeGreaterThan(3);
  });
});
