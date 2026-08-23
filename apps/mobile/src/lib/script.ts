import type { ScriptPreference } from "@/features/onboarding/types";

// How a verse's three registers are ordered for this reader. The onboarding
// question "Can you read Devanagari?" sets scriptPreference; every surface
// that prints a verse (home card, shloka page, reader) orders its lines with
// these helpers, so the answer is visibly honoured everywhere.
//
// Roles: "lead" is the line the reader is expected to use (largest, ink);
// "support" sits under it (muted); "aid" is the pronunciation helper
// (semibold ink) — "Say it" is the one the user actually uses.

export type VerseRegister = "devanagari" | "iast" | "sayIt";
export type VerseLine = { kind: VerseRegister; text: string; role: "lead" | "support" | "aid" };

export type VerseText = { devanagari: string; iast: string; sayIt: string };

export function verseLines(verse: VerseText, preference: ScriptPreference): VerseLine[] {
  switch (preference) {
    case "devanagari":
      return [
        { kind: "devanagari", text: verse.devanagari, role: "lead" },
        { kind: "iast", text: verse.iast, role: "support" },
        { kind: "sayIt", text: verse.sayIt, role: "support" },
      ];
    case "roman":
      return [
        { kind: "sayIt", text: verse.sayIt, role: "lead" },
        { kind: "iast", text: verse.iast, role: "support" },
        { kind: "devanagari", text: verse.devanagari, role: "support" },
      ];
    default:
      return [
        { kind: "devanagari", text: verse.devanagari, role: "lead" },
        { kind: "iast", text: verse.iast, role: "support" },
        { kind: "sayIt", text: verse.sayIt, role: "aid" },
      ];
  }
}

// The single line a compact card shows (home tab, reader rows).
export function verseLead(verse: VerseText, preference: ScriptPreference): VerseLine {
  return verseLines(verse, preference)[0];
}
