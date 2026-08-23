import { Text, View } from "react-native";

import type { ScriptPreference } from "@/features/onboarding/types";
import { verseLead, verseLines, type VerseLine, type VerseText } from "@/lib/script";

// Renders a verse's Devanagari / IAST / Say-it lines in the order the reader
// asked for in onboarding (scriptPreference). Compact mode prints only the
// lead line, for cards; in full mode the " / " half-verse separator the bank
// uses becomes a line break, so a pāda reads as a pāda. Devanagari is set two
// points larger than Latin at the same role because it reads smaller at equal
// size (docs/design-spec.md).
export function VerseLines({
  verse,
  preference,
  compact = false,
  numberOfLines,
}: {
  verse: VerseText;
  preference: ScriptPreference;
  compact?: boolean;
  numberOfLines?: number;
}) {
  const lines = compact ? [verseLead(verse, preference)] : verseLines(verse, preference);
  return (
    <View>
      {lines.map((line, index) => (
        <Text
          key={line.kind}
          numberOfLines={numberOfLines}
          className={`${index === 0 ? "" : "mt-2"} ${classesFor(line, compact)}`}
        >
          {compact ? line.text : line.text.split(" / ").join("\n")}
        </Text>
      ))}
    </View>
  );
}

function classesFor(line: VerseLine, compact: boolean): string {
  const devanagari = line.kind === "devanagari";
  switch (line.role) {
    case "lead":
      if (devanagari)
        return compact ? "text-[17px] leading-8 text-ink" : "text-[19px] leading-9 text-ink";
      return compact
        ? "text-[16px] font-semibold leading-7 text-ink"
        : "text-[17px] font-semibold leading-7 text-ink";
    case "aid":
      return "text-[16px] font-semibold leading-7 text-ink";
    default:
      return devanagari ? "text-[16px] leading-7 text-muted" : "text-[15px] leading-6 text-muted";
  }
}
