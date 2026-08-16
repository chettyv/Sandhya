// Night-session progress model (02-plan.md B5 / A1 v3 mechanics):
// - a stated set of parts with visible progress,
// - ENDOWED progress: the shloka part arrives already complete, so the user
//   starts the night in credit rather than at zero,
// - an explicit end state (rendered by the screen when the night completes).
//
// Pure logic, kept out of the component so the mechanic is testable without
// a live challenge session.

import type { ChallengeSessionDetail } from "./challenges";

export type NightSection = {
  key: "tonight" | "shloka" | "meaning" | "practice" | "tradition_notes" | "reflection";
  label: string;
  endowed?: boolean;
};

// Present sections in the doc type's fixed order. The shloka block is the
// endowment — it arrives marked complete.
export function nightSections(content: ChallengeSessionDetail["content"]): NightSection[] {
  const sections: NightSection[] = [];
  if (content.tonight) sections.push({ key: "tonight", label: "Tonight" });
  if (content.shloka.length > 0) sections.push({ key: "shloka", label: "Shloka", endowed: true });
  if (content.meaning) sections.push({ key: "meaning", label: "Meaning" });
  if (content.practice) sections.push({ key: "practice", label: "Practice" });
  if (content.traditionNotes)
    sections.push({ key: "tradition_notes", label: "Where traditions differ" });
  if (content.reflection) sections.push({ key: "reflection", label: "Reflect" });
  return sections;
}

export type NightProgress = { done: number; total: number; ratio: number };

// Endowed sections count as done from the first render; read sections are
// whatever the screen has marked (scrolled past or completed).
export function nightProgress(sections: NightSection[], readKeys: string[]): NightProgress {
  const read = new Set(readKeys);
  const done = sections.filter((section) => section.endowed || read.has(section.key)).length;
  const total = Math.max(1, sections.length);
  return { done, total, ratio: Math.min(1, done / total) };
}

// Given each section's top offset and how far the reader has scrolled, the
// sections whose start has entered the read line count as read. The read
// line sits at 60% of the viewport so a section counts once it is properly
// on screen, not when its first pixel appears.
export function readSectionKeys(
  offsets: Partial<Record<NightSection["key"], number>>,
  scrollY: number,
  viewportHeight: number,
): NightSection["key"][] {
  const readLine = scrollY + viewportHeight * 0.6;
  return (Object.entries(offsets) as [NightSection["key"], number][])
    .filter(([, offset]) => Number.isFinite(offset) && offset <= readLine)
    .map(([key]) => key);
}
