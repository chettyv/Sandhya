import { describe, expect, it } from "vitest";

import { calculateCurrentStreak } from "./activity";

describe("calculateCurrentStreak", () => {
  it("counts consecutive activity days through today", () => {
    expect(calculateCurrentStreak(["2026-08-05", "2026-08-04", "2026-08-03"], "2026-08-05")).toBe(
      3,
    );
  });

  it("stops at the first missing day", () => {
    expect(calculateCurrentStreak(["2026-08-05", "2026-08-03", "2026-08-02"], "2026-08-05")).toBe(
      1,
    );
  });

  it("returns zero when today has no activity", () => {
    expect(calculateCurrentStreak(["2026-08-04"], "2026-08-05")).toBe(0);
  });
});
