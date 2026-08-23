import { describe, expect, it } from "vitest";

import { verseLead, verseLines } from "./script";

const verse = { devanagari: "d", iast: "i", sayIt: "s" };

describe("verseLines", () => {
  it("leads with Devanagari for confident readers", () => {
    const lines = verseLines(verse, "devanagari");
    expect(lines[0]).toEqual({ kind: "devanagari", text: "d", role: "lead" });
    expect(lines.map((line) => line.kind)).toEqual(["devanagari", "iast", "sayIt"]);
  });

  it("leads with the pronunciation line for readers who cannot read the script yet", () => {
    expect(verseLead(verse, "roman")).toEqual({ kind: "sayIt", text: "s", role: "lead" });
    expect(verseLines(verse, "roman").map((line) => line.kind)).toEqual([
      "sayIt",
      "iast",
      "devanagari",
    ]);
  });

  it("keeps the pronunciation line as the emphasised aid by default", () => {
    const lines = verseLines(verse, "both");
    expect(lines[0].kind).toBe("devanagari");
    expect(lines[2]).toEqual({ kind: "sayIt", text: "s", role: "aid" });
  });

  it("never drops a register", () => {
    for (const preference of ["devanagari", "both", "roman"] as const) {
      expect(new Set(verseLines(verse, preference).map((line) => line.kind)).size).toBe(3);
    }
  });
});
