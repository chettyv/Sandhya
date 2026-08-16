import { describe, expect, it } from "vitest";

import type { ChallengeSessionDetail } from "./challenges";
import { nightProgress, nightSections, readSectionKeys } from "./nightProgress";

const content: ChallengeSessionDetail["content"] = {
  tonight: "Welcome to the night.",
  shloka: [
    {
      devanagari: "ॐ",
      iast: "om",
      sayIt: "om",
      meaning: "The syllable om.",
      source: "Test source",
    },
  ],
  meaning: "What tonight's verse carries.",
  practice: "A small practice.",
  traditionNotes: "Communities keep this night differently.",
  reflection: "What did tonight ask of you?",
};

describe("nightSections", () => {
  it("keeps the doc type's fixed order and marks the shloka as endowed", () => {
    const sections = nightSections(content);
    expect(sections.map((section) => section.key)).toEqual([
      "tonight",
      "shloka",
      "meaning",
      "practice",
      "tradition_notes",
      "reflection",
    ]);
    expect(sections.find((section) => section.key === "shloka")?.endowed).toBe(true);
  });

  it("omits absent sections without breaking order", () => {
    const sections = nightSections({ ...content, traditionNotes: "", reflection: "" });
    expect(sections.map((section) => section.key)).toEqual([
      "tonight",
      "shloka",
      "meaning",
      "practice",
    ]);
  });
});

describe("nightProgress", () => {
  it("starts in credit: the endowed shloka counts before anything is read", () => {
    const sections = nightSections(content);
    const progress = nightProgress(sections, []);
    expect(progress.done).toBe(1);
    expect(progress.total).toBe(6);
    expect(progress.ratio).toBeGreaterThan(0);
  });

  it("counts read sections once and never exceeds the total", () => {
    const sections = nightSections(content);
    const progress = nightProgress(sections, [
      "tonight",
      "shloka",
      "meaning",
      "practice",
      "tradition_notes",
      "reflection",
    ]);
    expect(progress.done).toBe(6);
    expect(progress.ratio).toBe(1);
  });

  it("never divides by zero on empty content", () => {
    const progress = nightProgress([], []);
    expect(progress.total).toBe(1);
    expect(progress.ratio).toBe(0);
  });
});

describe("readSectionKeys", () => {
  it("marks sections whose top has crossed the read line", () => {
    const keys = readSectionKeys(
      { tonight: 0, shloka: 400, meaning: 900, practice: 1400 },
      300,
      800,
    );
    // read line = 300 + 480 = 780: tonight and shloka are read, meaning is not.
    expect(keys).toContain("tonight");
    expect(keys).toContain("shloka");
    expect(keys).not.toContain("meaning");
    expect(keys).not.toContain("practice");
  });

  it("reads nothing before layout has reported offsets", () => {
    expect(readSectionKeys({}, 0, 800)).toEqual([]);
  });
});
