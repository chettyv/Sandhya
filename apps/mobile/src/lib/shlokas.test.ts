import { describe, expect, it } from "vitest";

import { dailyShlokaFrom, rotationSequence, type Shloka } from "./shlokas";

function verse(slug: string, tags: string[], dailyPool = true): Shloka {
  return {
    slug,
    textRef: `Test ${slug}`,
    tradition: "general",
    tags,
    dailyPool,
    devanagari: "ॐ",
    iast: "om",
    sayIt: "om",
    translation: "Test translation.",
    source: "Test source.",
    words: [],
    meaning: "Test meaning.",
    reflection: "Test reflection.",
    translations: {},
    meanings: {},
  };
}

const bank: Shloka[] = [
  verse("a-1", ["devotion"]),
  verse("a-2", ["wisdom"]),
  verse("a-3", ["devotion", "peace"]),
  verse("a-4", ["courage"]),
  verse("a-5", ["discipline"]),
  verse("a-6", ["wisdom"]),
  verse("fragment", ["wisdom"], false),
];

describe("rotationSequence", () => {
  it("orders by preference without dropping anything (rank, never narrow)", () => {
    const sequence = rotationSequence(bank, ["devotion"]);
    const curated = bank.filter((entry) => entry.dailyPool);
    expect(sequence).toHaveLength(curated.length);
    expect(new Set(sequence.map((entry) => entry.slug))).toEqual(
      new Set(curated.map((entry) => entry.slug)),
    );
    expect(sequence[0].tags).toContain("devotion");
  });

  it("weaves preferred verses through the rotation instead of front-loading a block", () => {
    const sequence = rotationSequence(bank, ["devotion"]);
    const positions = sequence
      .map((entry, index) => (entry.tags.includes("devotion") ? index : -1))
      .filter((index) => index >= 0);
    // 2 preferred among 6: they must not sit adjacent at the front.
    expect(positions).toHaveLength(2);
    expect(positions[1] - positions[0]).toBeGreaterThan(1);
  });

  it("keeps non-curated fragments out of the daily rotation", () => {
    const sequence = rotationSequence(bank, ["wisdom"]);
    expect(sequence.some((entry) => entry.slug === "fragment")).toBe(false);
  });

  it("returns the plain curated pool with no preferences or no matches", () => {
    expect(rotationSequence(bank, []).map((entry) => entry.slug)).toEqual([
      "a-1",
      "a-2",
      "a-3",
      "a-4",
      "a-5",
      "a-6",
    ]);
    expect(rotationSequence(bank, ["unknown-tag"]).map((entry) => entry.slug)).toEqual([
      "a-1",
      "a-2",
      "a-3",
      "a-4",
      "a-5",
      "a-6",
    ]);
  });

  it("falls back to the whole bank when nothing is curated", () => {
    const uncurated = [verse("u-1", ["peace"], false), verse("u-2", ["wisdom"], false)];
    expect(rotationSequence(uncurated, [])).toHaveLength(2);
  });
});

describe("dailyShlokaFrom", () => {
  it("is deterministic for a given date and preferences", () => {
    const first = dailyShlokaFrom(bank, ["devotion"], "2026-10-11");
    const second = dailyShlokaFrom(bank, ["devotion"], "2026-10-11");
    expect(first?.slug).toBe(second?.slug);
  });

  it("changes with the date and covers the whole pool across a cycle", () => {
    const seen = new Set<string>();
    for (let day = 1; day <= 6; day += 1) {
      const picked = dailyShlokaFrom(bank, ["devotion"], `2026-03-${String(day).padStart(2, "0")}`);
      if (picked) seen.add(picked.slug);
    }
    expect(seen.size).toBe(6);
  });

  it("returns undefined on an empty bank", () => {
    expect(dailyShlokaFrom([], ["devotion"], "2026-10-11")).toBeUndefined();
  });
});
