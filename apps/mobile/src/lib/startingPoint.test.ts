import { describe, expect, it } from "vitest";

import {
  pickConcepts,
  pickStartingPractice,
  startingPointFor,
  startingTextChapter,
  startingTextPrefixes,
  type StartingProfile,
} from "./startingPoint";

import { concepts, practices } from "@/data/content";

const base: StartingProfile = {
  intent: null,
  practiceMinutes: null,
  startingText: null,
  curiosity: null,
  householdPractices: [],
  reminderEnabled: false,
  reminderTime: "08:00",
};

describe("pickStartingPractice", () => {
  it("never exceeds the minutes the user offered", () => {
    const pick = pickStartingPractice(practices, { ...base, practiceMinutes: 2 });
    expect(pick?.durationMinutes).toBeLessThanOrEqual(2);
  });

  it("lands a lamp household with a morning reminder on the diya practice", () => {
    const pick = pickStartingPractice(practices, {
      ...base,
      practiceMinutes: 5,
      householdPractices: ["lamp"],
      reminderEnabled: true,
      reminderTime: "08:00",
    });
    expect(pick?.title).toMatch(/diya/i);
  });

  it("prefers a mantra practice for a Chalisa household", () => {
    const pick = pickStartingPractice(practices, {
      ...base,
      practiceMinutes: 5,
      householdPractices: ["chalisa"],
    });
    expect(pick?.category).toBe("Mantra");
  });

  it("leans to evening practices for an evening reminder", () => {
    const pick = pickStartingPractice(practices, {
      ...base,
      practiceMinutes: 5,
      reminderEnabled: true,
      reminderTime: "20:00",
    });
    expect(pick?.title).toMatch(/evening/i);
  });

  it("returns something for an empty profile and nothing for an empty catalogue", () => {
    expect(pickStartingPractice(practices, base)).toBeDefined();
    expect(pickStartingPractice([], base)).toBeUndefined();
  });
});

describe("pickConcepts", () => {
  it("returns the two concepts the curiosity asked for", () => {
    expect(pickConcepts(concepts, "mantras").map((concept) => concept.term)).toEqual([
      "Mantra",
      "Japa",
    ]);
    expect(pickConcepts(concepts, "ideas").map((concept) => concept.term)).toEqual([
      "Dharma",
      "Karma",
    ]);
  });

  it("falls back to catalogue order and always returns two when available", () => {
    expect(pickConcepts(concepts, null)).toHaveLength(2);
    expect(pickConcepts(concepts, null)[0].term).toBe(concepts[0].term);
  });
});

describe("startingPointFor", () => {
  it("sends readers into the chapter they chose", () => {
    const point = startingPointFor(
      { ...base, intent: "read", startingText: "gita" },
      practices,
      concepts,
    );
    expect(point).toMatchObject({ kind: "chapter", chapter: "gita-2" });
  });

  it("sends practice-seekers to a practice within their budget", () => {
    const point = startingPointFor(
      { ...base, intent: "practice", practiceMinutes: 2 },
      practices,
      concepts,
    );
    expect(point?.kind).toBe("practice");
    if (point?.kind === "practice") expect(point.practice.durationMinutes).toBeLessThanOrEqual(2);
  });

  it("opens the reader for a reader who asked to be surprised", () => {
    expect(
      startingPointFor({ ...base, intent: "read", startingText: "any" }, practices, concepts)?.kind,
    ).toBe("reader");
  });

  it("routes each curiosity somewhere different", () => {
    const kinds = (["lamp", "mantras", "festivals", "ideas"] as const).map(
      (curiosity) =>
        startingPointFor({ ...base, intent: "understand", curiosity }, practices, concepts)?.kind,
    );
    expect(kinds).toEqual(["practice", "shloka", "explore", "concept"]);
  });

  it("returns null with no intent", () => {
    expect(startingPointFor(base, practices, concepts)).toBeNull();
  });
});

describe("starting text tables", () => {
  it("map every text to a reader chapter and a slug prefix", () => {
    for (const key of Object.keys(startingTextPrefixes) as (keyof typeof startingTextPrefixes)[]) {
      if (key === "any") continue;
      expect(startingTextPrefixes[key].length).toBeGreaterThan(0);
      expect(startingTextChapter[key]).toBeTruthy();
    }
  });
});
