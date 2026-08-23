import { describe, expect, it } from "vitest";

import {
  dailyPrayer,
  dailyShlokaFrom,
  prayerContextForHour,
  readerChapterTitle,
  rotationSequence,
  type Shloka,
} from "./shlokas";

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

describe("daily prayer segmentation", () => {
  const prayers: Shloka[] = [
    { ...verse("shanti-1", ["peace", "morning", "evening"], false) },
    { ...verse("morning-1", ["gratitude", "morning"], false) },
    { ...verse("verse-1", ["wisdom"]) },
  ];

  it("maps hours to the sandhya contexts", () => {
    expect(prayerContextForHour(6)).toBe("morning");
    expect(prayerContextForHour(14)).toBe("morning");
    expect(prayerContextForHour(15)).toBe("evening");
    expect(prayerContextForHour(20)).toBe("evening");
    expect(prayerContextForHour(2)).toBe("evening");
  });

  it("picks only context-tagged units, deterministically per date", () => {
    const morning = dailyPrayer("morning", "2026-10-11", prayers);
    expect(["shanti-1", "morning-1"]).toContain(morning?.slug);
    expect(dailyPrayer("morning", "2026-10-11", prayers)?.slug).toBe(morning?.slug);
    expect(dailyPrayer("evening", "2026-10-11", prayers)?.slug).toBe("shanti-1");
  });

  it("hides entirely when no prayer-tagged content is live", () => {
    expect(dailyPrayer("morning", "2026-10-11", [verse("v", ["wisdom"])])).toBeUndefined();
  });
});

describe("rotationSequence with a preferred text", () => {
  const mixed: Shloka[] = [
    verse("gita-2-47", ["duty"]),
    verse("gita-2-48", ["peace"]),
    verse("chalisa-1", ["devotion"]),
    verse("chalisa-2", ["courage"]),
    verse("isha-1", ["wisdom"]),
    verse("isha-2", ["peace"]),
  ];

  it("leads with the chosen text and keeps every verse (rank, never narrow)", () => {
    const sequence = rotationSequence(mixed, [], ["chalisa-"]);
    expect(sequence).toHaveLength(mixed.length);
    expect(sequence[0].slug.startsWith("chalisa-")).toBe(true);
    expect(new Set(sequence.map((entry) => entry.slug))).toEqual(
      new Set(mixed.map((entry) => entry.slug)),
    );
  });

  it("applies household tags within the chosen text", () => {
    const sequence = rotationSequence(mixed, ["courage"], ["chalisa-"]);
    expect(sequence[0].slug).toBe("chalisa-2");
  });

  it("falls back to tag ordering when no verse matches the prefix", () => {
    expect(rotationSequence(mixed, ["wisdom"], ["soundarya-"])[0].slug).toBe("isha-1");
  });

  it("threads the prefix through dailyShlokaFrom", () => {
    expect(dailyShlokaFrom(mixed, [], "2026-01-01", ["isha-"])?.slug.startsWith("isha-")).toBe(
      true,
    );
  });
});

describe("readerChapterTitle", () => {
  it("names chaptered texts by chapter, not by the first verse", () => {
    expect(readerChapterTitle("Bhagavad Gita 2.13")).toBe("Bhagavad Gita — Chapter 2");
    expect(readerChapterTitle("Kena Upanishad 3.1")).toBe("Kena Upanishad — Chapter 3");
  });

  it("keeps adhyaya.valli for three-part references and drops the verse", () => {
    expect(readerChapterTitle("Katha Upanishad 1.2.5")).toBe("Katha Upanishad 1.2");
    expect(readerChapterTitle("Mundaka Upanishad 3.2.1")).toBe("Mundaka Upanishad 3.2");
  });

  it("strips the verse number but keeps a trailing source parenthetical", () => {
    expect(readerChapterTitle("Aditya Hridayam 1 (Valmiki Ramayana, Yuddha Kanda)")).toBe(
      "Aditya Hridayam (Valmiki Ramayana, Yuddha Kanda)",
    );
  });

  it("strips unit labels and bare verse numbers", () => {
    expect(readerChapterTitle("Hanuman Chalisa, chaupai 1")).toBe("Hanuman Chalisa");
    expect(readerChapterTitle("Hanuman Chalisa, opening doha 1")).toBe("Hanuman Chalisa");
    expect(readerChapterTitle("Katha Upanishad, shanti mantra")).toBe("Katha Upanishad");
    expect(readerChapterTitle("Isha Upanishad 1")).toBe("Isha Upanishad");
    expect(readerChapterTitle("Soundarya Lahari 25")).toBe("Soundarya Lahari");
  });

  it("leaves single-unit prayers with a parenthetical source untouched", () => {
    expect(readerChapterTitle("Gāyatrī mantra (Rig Veda 3.62.10)")).toBe(
      "Gāyatrī mantra (Rig Veda 3.62.10)",
    );
  });
});
