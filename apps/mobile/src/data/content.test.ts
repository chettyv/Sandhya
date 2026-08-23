import { describe, expect, it } from "vitest";

import {
  concepts,
  deities,
  dailyReflections,
  festivals,
  practices,
  sacredTexts,
  suggestedQuestions,
} from "./content";

describe("curated mobile seed content", () => {
  it("uses unique identifiers across routed content", () => {
    const ids = [...concepts, ...deities, ...festivals, ...practices, ...sacredTexts].map(
      (item) => item.id,
    );
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("provides a source catalog without pretending every excerpt is available", () => {
    expect(sacredTexts.length).toBeGreaterThanOrEqual(3);
    for (const text of sacredTexts) {
      expect(text.title.length).toBeGreaterThan(3);
      expect(text.description.length).toBeGreaterThan(30);
    }
  });

  it("provides a month of app-authored learning before the production corpus is connected", () => {
    expect(concepts.length).toBeGreaterThanOrEqual(50);
    expect(practices.length).toBeGreaterThanOrEqual(20);
    expect(dailyReflections.length).toBeGreaterThanOrEqual(30);
    expect(practices.some((item) => item.isPremium)).toBe(true);
    expect(festivals.some((item) => item.isPremium)).toBe(true);
    expect(new Set(dailyReflections.map((item) => item.id)).size).toBe(dailyReflections.length);
    for (const concept of concepts) {
      expect(concept.explanation.length).toBeGreaterThan(50);
      expect(concept.variationNote?.length ?? 0).toBeGreaterThan(20);
    }
    for (const reflection of dailyReflections) {
      expect(reflection.body.length).toBeGreaterThan(80);
      expect(reflection.practicePrompt.length).toBeGreaterThan(20);
      expect(reflection.prompt.length).toBeGreaterThan(20);
    }
  });

  it("publishes no festival date without its reckoning, and keeps variation context", () => {
    for (const festival of festivals) {
      if (festival.date) {
        expect(Number.isNaN(Date.parse(festival.date))).toBe(false);
        expect(festival.dateReckoning).toBeTruthy();
      }
      expect(festival.variationNote.length).toBeGreaterThan(20);
    }
    expect(festivals.length).toBeGreaterThanOrEqual(20);
  });

  it("introduces deities with variation-aware context", () => {
    expect(deities.length).toBeGreaterThanOrEqual(5);
    for (const deity of deities) {
      expect(deity.name.length).toBeGreaterThan(2);
      expect(deity.shortDescription.length).toBeGreaterThan(20);
      expect(deity.fullDescription.length).toBeGreaterThan(80);
      expect(deity.traditions.length).toBeGreaterThan(0);
    }
  });

  it("keeps every guided practice actionable", () => {
    for (const practice of practices) {
      expect(practice.durationMinutes).toBeGreaterThan(0);
      expect(practice.steps.length).toBeGreaterThanOrEqual(4);
    }
    expect(
      practices.find((practice) => practice.id === "00000000-0000-0000-0000-000000000501")
        ?.warnings,
    ).toContain("Never leave a flame unattended");
  });

  it("offers several distinct Ask Dharma entry points", () => {
    expect(suggestedQuestions.length).toBeGreaterThanOrEqual(4);
    expect(new Set(suggestedQuestions).size).toBe(suggestedQuestions.length);
  });
});
