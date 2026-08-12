import { describe, expect, it } from "vitest";

import {
  householdPracticeKeys,
  householdPracticeOptions,
  tagsForPractices,
  togglePractice,
} from "./practices";

describe("householdPracticeOptions", () => {
  it("asks about concrete observances, never sampradāya", () => {
    for (const option of householdPracticeOptions) {
      expect(option.label.toLowerCase()).not.toMatch(
        /vaishnav|shaiv|shakta|smarta|advaita|tradition|sampraday/,
      );
    }
  });

  it("routes every option to at least one content tag", () => {
    for (const option of householdPracticeOptions) {
      expect(option.tags.length).toBeGreaterThan(0);
    }
  });
});

describe("tagsForPractices", () => {
  it("returns ordered, deduped tags with the first practice leading", () => {
    expect(tagsForPractices(["chalisa", "lamp"])).toEqual(["courage", "devotion", "peace"]);
  });

  it("ignores unknown keys and returns empty for no selection", () => {
    expect(tagsForPractices([])).toEqual([]);
    expect(tagsForPractices(["not-a-practice"])).toEqual([]);
  });
});

describe("togglePractice", () => {
  it("selects and deselects regular practices", () => {
    expect(togglePractice([], "lamp")).toEqual(["lamp"]);
    expect(togglePractice(["lamp"], "ekadashi")).toEqual(["lamp", "ekadashi"]);
    expect(togglePractice(["lamp", "ekadashi"], "lamp")).toEqual(["ekadashi"]);
  });

  it("keeps 'starting from scratch' exclusive in both directions", () => {
    expect(togglePractice(["lamp", "ekadashi"], "scratch")).toEqual(["scratch"]);
    expect(togglePractice(["scratch"], "chalisa")).toEqual(["chalisa"]);
  });

  it("covers the plan's five observances", () => {
    expect(householdPracticeKeys).toEqual([
      "lamp",
      "ekadashi",
      "chalisa",
      "mandir-festivals",
      "scratch",
    ]);
  });
});
