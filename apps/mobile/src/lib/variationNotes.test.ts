import { describe, expect, it } from "vitest";

import { describeVariations } from "./variationNotes";

const FALLBACK = "Observances vary by family, region, and tradition.";

describe("describeVariations", () => {
  it("renders the stored note instead of boilerplate", () => {
    expect(
      describeVariations(
        { note: "Buddhist and Jain communities also mark this full moon in distinct ways." },
        FALLBACK,
      ),
    ).toBe("Buddhist and Jain communities also mark this full moon in distinct ways.");
  });

  it("labels keyed regional entries", () => {
    expect(
      describeVariations(
        {
          bengal: "Celebrated as Durga Puja, centred on communal pandals.",
          gujarat: "Marked with garba and dandiya raas through the nine nights.",
        },
        FALLBACK,
      ),
    ).toBe(
      "Bengal: Celebrated as Durga Puja, centred on communal pandals.\n" +
        "Gujarat: Marked with garba and dandiya raas through the nine nights.",
    );
  });

  it("humanizes snake_case keys and mixes note entries in", () => {
    expect(
      describeVariations(
        {
          note: "Observance splits by community.",
          south_india: "Golu displays of arranged figurines are central.",
        },
        FALLBACK,
      ),
    ).toBe(
      "Observance splits by community.\nSouth india: Golu displays of arranged figurines are central.",
    );
  });

  it("accepts plain strings and arrays", () => {
    expect(describeVariations("Varies by region.", FALLBACK)).toBe("Varies by region.");
    expect(describeVariations(["First variation.", "Second variation."], FALLBACK)).toBe(
      "First variation.\nSecond variation.",
    );
  });

  it("falls back when the value is null, empty, or unusable", () => {
    expect(describeVariations(null, FALLBACK)).toBe(FALLBACK);
    expect(describeVariations(undefined, FALLBACK)).toBe(FALLBACK);
    expect(describeVariations({}, FALLBACK)).toBe(FALLBACK);
    expect(describeVariations({ note: "   " }, FALLBACK)).toBe(FALLBACK);
    expect(describeVariations({ count: 4 }, FALLBACK)).toBe(FALLBACK);
    expect(describeVariations(42, FALLBACK)).toBe(FALLBACK);
  });

  it("never renders a stringified object", () => {
    const rendered = describeVariations({ nested: { deep: true } }, FALLBACK);
    expect(rendered).not.toContain("[object Object]");
    expect(rendered).toBe(FALLBACK);
  });
});
