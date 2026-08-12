import { describe, expect, it } from "vitest";

import { runSafetyGate } from "./safety.js";

describe("runSafetyGate", () => {
  it("blocks broader self-harm phrasing", () => {
    const result = runSafetyGate("I cannot go on and want to die");

    expect(result.blocked).toBe(true);
    expect(result.category).toBe("self_harm");
    expect(result.answer?.sources).toEqual([]);
  });

  it("blocks medical treatment and medication questions", () => {
    const result = runSafetyGate(
      "Can this mantra cure my cancer or should I stop taking medication?",
    );

    expect(result.blocked).toBe(true);
    expect(result.category).toBe("medical");
  });

  it("blocks legal and financial advice requests", () => {
    const result = runSafetyGate("Should I sue my landlord or invest in this crypto?");

    expect(result.blocked).toBe(true);
    expect(result.category).toBe("legal_financial");
  });

  it("allows normal scripture questions", () => {
    const result = runSafetyGate("What does the Bhagavad Gita say about action?");

    expect(result.blocked).toBe(false);
    expect(result.category).toBe("none");
  });
});
