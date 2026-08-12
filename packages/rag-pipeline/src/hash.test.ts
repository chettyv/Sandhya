import { describe, expect, it } from "vitest";

import { hashQuestion, normalizeQuestionForCache } from "./hash.js";

describe("hashQuestion", () => {
  it("normalizes case and whitespace before hashing", async () => {
    await expect(hashQuestion(" What   Is\nDharma? ")).resolves.toBe(
      await hashQuestion("what is dharma?"),
    );
  });

  it("normalizes punctuation and Unicode compatibility forms", () => {
    expect(normalizeQuestionForCache("  What—IS Dharma?!  ")).toBe("what is dharma");
    expect(normalizeQuestionForCache("WHAT IS DHARMA")).toBe("what is dharma");
  });
});
