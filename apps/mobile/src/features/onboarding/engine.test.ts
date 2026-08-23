import { describe, expect, it } from "vitest";

import {
  buildProfile,
  isStepSatisfied,
  progressFor,
  resolveCopy,
  stepIndex,
  summaryRows,
  visibleSteps,
  withAnswer,
} from "./engine";
import { onboardingSteps, reflectionLines } from "./steps";
import type { OnboardingAnswers, OnboardingStep } from "./types";

const ids = (answers: OnboardingAnswers) => visibleSteps(answers).map((step) => step.id);

describe("visibleSteps — branching", () => {
  it("asks the practice-length follow-up only for practice intent", () => {
    expect(ids({ intent: "practice" })).toContain("practice-minutes");
    expect(ids({ intent: "practice" })).not.toContain("starting-text");
    expect(ids({ intent: "practice" })).not.toContain("curiosity");
  });

  it("asks where to begin reading only for read intent", () => {
    expect(ids({ intent: "read" })).toContain("starting-text");
    expect(ids({ intent: "read" })).not.toContain("practice-minutes");
  });

  it("asks what to explain for understand and explore intents", () => {
    expect(ids({ intent: "understand" })).toContain("curiosity");
    expect(ids({ intent: "explore" })).toContain("curiosity");
  });

  it("skips the language question for readers who cannot read Devanagari yet", () => {
    expect(ids({ script: "roman" })).not.toContain("language");
    expect(ids({ script: "both" })).toContain("language");
    expect(ids({ script: "devanagari" })).toContain("language");
    // Until the script question is answered the language step is not visible,
    // so the progress bar never counts a screen that may disappear.
    expect(ids({})).not.toContain("language");
  });

  it("always starts with welcome and ends with the result", () => {
    for (const intent of ["practice", "understand", "read", "explore"] as const) {
      const list = ids({ intent, script: "both" });
      expect(list[0]).toBe("welcome");
      expect(list[list.length - 1]).toBe("result");
    }
  });

  it("keeps every question between five and seven screens long", () => {
    const shortest = ids({ intent: "read", script: "roman" }).filter(
      (id) => !["welcome", "result", "reflect"].includes(id),
    );
    const longest = ids({ intent: "practice", script: "both" }).filter(
      (id) => !["welcome", "result", "reflect"].includes(id),
    );
    expect(shortest).toHaveLength(6);
    expect(longest).toHaveLength(7);
  });
});

describe("progressFor", () => {
  it("reaches exactly 100% on the result screen and counts the interstitial", () => {
    const answers: OnboardingAnswers = { intent: "practice", script: "both" };
    expect(progressFor(answers, "result")).toBe(1);
    expect(progressFor(answers, "intent")).toBeGreaterThan(0);
    expect(progressFor(answers, "reflect")).toBeGreaterThan(progressFor(answers, "practices"));
  });

  it("is monotonic through the visible flow", () => {
    const answers: OnboardingAnswers = { intent: "read", script: "devanagari" };
    const steps = visibleSteps(answers).filter((step) => step.kind !== "welcome");
    let last = 0;
    for (const step of steps) {
      const value = progressFor(answers, step.id);
      expect(value).toBeGreaterThan(last);
      last = value;
    }
  });
});

describe("isStepSatisfied", () => {
  const find = (id: string): OnboardingStep => onboardingSteps.find((step) => step.id === id)!;

  it("requires a selection for single choice", () => {
    expect(isStepSatisfied(find("intent"), {})).toBe(false);
    expect(isStepSatisfied(find("intent"), { intent: "read" })).toBe(true);
  });

  it("requires at least one household practice", () => {
    expect(isStepSatisfied(find("practices"), { practices: [] })).toBe(false);
    expect(isStepSatisfied(find("practices"), { practices: ["scratch"] })).toBe(true);
  });

  it("treats the name as optional", () => {
    expect(isStepSatisfied(find("name"), {})).toBe(true);
  });
});

describe("withAnswer", () => {
  it("coerces practice minutes to a number and clears on undefined", () => {
    const answers = withAnswer({}, "practiceMinutes", "5");
    expect(answers.practiceMinutes).toBe(5);
    expect(withAnswer(answers, "practiceMinutes", undefined).practiceMinutes).toBeUndefined();
  });

  it("stores list answers as given", () => {
    expect(withAnswer({}, "practices", ["lamp", "ekadashi"]).practices).toEqual([
      "lamp",
      "ekadashi",
    ]);
  });
});

describe("copy reacts to earlier answers", () => {
  const practicesStep = onboardingSteps.find((step) => step.id === "practices")!;
  const reminderStep = onboardingSteps.find((step) => step.id === "reminder")!;

  it("rewords the household question by intent", () => {
    if (practicesStep.kind !== "multi") throw new Error("unexpected step kind");
    expect(resolveCopy(practicesStep.title, { intent: "understand" })).toMatch(/your home/);
    expect(resolveCopy(practicesStep.title, { intent: "explore" })).toMatch(/around you/);
    expect(resolveCopy(practicesStep.title, { intent: "practice" })).toMatch(/already happens/);
  });

  it("relabels the scratch option for people starting from scratch", () => {
    if (practicesStep.kind !== "multi") throw new Error("unexpected step kind");
    const scratch = practicesStep.options.find((option) => option.value === "scratch")!;
    expect(resolveCopy(scratch.label, { intent: "explore" })).toBe("None of these yet");
    expect(resolveCopy(scratch.label, { intent: "read" })).toMatch(/scratch/);
  });

  it("frames the reminder around a practice when that is the stated goal", () => {
    if (reminderStep.kind !== "single") throw new Error("unexpected step kind");
    expect(resolveCopy(reminderStep.title, { intent: "practice" })).toMatch(/few minutes/);
    expect(resolveCopy(reminderStep.title, { intent: "read" })).toMatch(/verse/);
  });

  it("reflects the actual tags back, never a generic claim", () => {
    const lines = reflectionLines({ intent: "practice", practices: ["lamp", "ekadashi"] });
    expect(lines[0]).toMatch(/devotion and peace/);
    expect(lines.join(" ")).toMatch(/stays open/);
    expect(reflectionLines({ intent: "explore", practices: ["scratch"] })[0]).toMatch(
      /peace and wisdom/,
    );
  });
});

describe("buildProfile", () => {
  it("derives focus tags from household practices and keeps them out of tradition", () => {
    const profile = buildProfile({ intent: "practice", practices: ["chalisa", "lamp"] });
    expect(profile.focusTags).toEqual(["courage", "devotion", "peace"]);
    expect(profile.householdPractices).toEqual(["chalisa", "lamp"]);
  });

  it("only keeps branch answers that belong to the chosen intent", () => {
    const profile = buildProfile({
      intent: "read",
      startingText: "chalisa",
      practiceMinutes: 5,
      curiosity: "lamp",
    });
    expect(profile.startingText).toBe("chalisa");
    expect(profile.preferredTextPrefixes).toEqual(["chalisa-"]);
    expect(profile.practiceMinutes).toBeNull();
    expect(profile.curiosity).toBeNull();
  });

  it("never sets Hindi meanings for someone who cannot read Devanagari", () => {
    expect(buildProfile({ script: "roman", language: "hi" }).contentLanguage).toBe("en");
    expect(buildProfile({ script: "both", language: "hi" }).contentLanguage).toBe("hi");
  });

  it("arms the reminder only when a time was chosen", () => {
    expect(buildProfile({ reminder: "20:00" })).toMatchObject({
      reminderEnabled: true,
      reminderTime: "20:00",
    });
    expect(buildProfile({ reminder: "none" })).toMatchObject({ reminderEnabled: false });
    expect(buildProfile({})).toMatchObject({ reminderEnabled: false });
  });

  it("falls back to Friend for an empty name", () => {
    expect(buildProfile({ name: "  " }).displayName).toBe("Friend");
    expect(buildProfile({ name: " Priya " }).displayName).toBe("Priya");
  });
});

describe("summaryRows", () => {
  it("shows one row per consumed answer, each pointing at its step", () => {
    const rows = summaryRows({
      intent: "practice",
      practices: ["lamp"],
      practiceMinutes: 5,
      script: "both",
      language: "hi",
      reminder: "08:00",
    });
    expect(rows.map((row) => row.stepId)).toEqual([
      "practices",
      "practice-minutes",
      "script",
      "language",
      "reminder",
    ]);
    expect(rows.find((row) => row.stepId === "language")?.value).toBe("हिन्दी");
  });

  it("omits rows for branches that were not shown", () => {
    const rows = summaryRows({ intent: "read", script: "roman", language: "hi", reminder: "none" });
    expect(rows.map((row) => row.stepId)).not.toContain("language");
    expect(rows.map((row) => row.stepId)).not.toContain("practice-minutes");
  });
});

describe("stepIndex", () => {
  it("locates steps within the visible flow", () => {
    expect(stepIndex({}, "welcome")).toBe(0);
    expect(stepIndex({ intent: "read" }, "starting-text")).toBeGreaterThan(
      stepIndex({ intent: "read" }, "reflect"),
    );
    expect(stepIndex({ intent: "read" }, "practice-minutes")).toBe(-1);
  });
});
