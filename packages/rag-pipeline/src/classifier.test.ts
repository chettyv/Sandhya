import { describe, expect, it } from "vitest";

import { classifyQuestion, isCacheableQuestion } from "./classifier.js";

describe("classifyQuestion", () => {
  it("classifies scripture questions and tradition signals", () => {
    expect(classifyQuestion("What does the Gita say in a Vaishnava reading?")).toEqual({
      intent: "scripture",
      safetyCategory: "none",
      traditionSignals: ["vaishnava"],
    });
  });

  it("prefers an explicit scripture reference over a broad philosophy term", () => {
    expect(classifyQuestion("What does the Gita say about dharma?").intent).toBe("scripture");
  });

  it("classifies safety-sensitive questions before model work", () => {
    expect(classifyQuestion("Should I stop taking my medicine during a fast?").safetyCategory).toBe(
      "medical",
    );
    expect(
      classifyQuestion("I do not want to live anymore; what prayer should I say?").safetyCategory,
    ).toBe("self_harm");
    expect(classifyQuestion("Can this supplement interact with my medicine?").safetyCategory).toBe(
      "medical",
    );
  });

  it("does not infer a topic from an unrelated question", () => {
    expect(classifyQuestion("What should I read today?")).toEqual({
      intent: "unknown",
      safetyCategory: "none",
      traditionSignals: [],
    });
  });

  it("keeps general questions cacheable but excludes personal context", () => {
    expect(isCacheableQuestion("What is dharma?")).toBe(true);
    expect(isCacheableQuestion("What does the Gita teach about action?")).toBe(true);
    expect(isCacheableQuestion("How can I cope with grief?")).toBe(false);
    expect(isCacheableQuestion("What should I do in my practice?")).toBe(false);
  });
});
