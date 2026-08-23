import { describe, expect, it } from "vitest";

import { calculateCurrentStreak, dayOfYear } from "./activity";

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

describe("dayOfYear", () => {
  it("counts from zero on 1 January and is not shifted by daylight saving", () => {
    expect(dayOfYear("2026-01-01")).toBe(0);
    expect(dayOfYear("2026-02-01")).toBe(31);
    // 23 August is day 234 (0-based) in a non-leap year, whatever the zone.
    expect(dayOfYear("2026-08-23")).toBe(234);
    expect(dayOfYear("2026-12-31")).toBe(364);
    expect(dayOfYear("2028-12-31")).toBe(365);
  });
});
