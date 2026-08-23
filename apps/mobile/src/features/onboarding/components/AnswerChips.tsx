import Ionicons from "@expo/vector-icons/Ionicons";
import type { ComponentProps } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, ZoomIn, useReducedMotion } from "react-native-reanimated";

import type { AnswerChip } from "../types";

import { EASE_OUT } from "./motion";
import { useStepPhase } from "./StepTransition";

import { colors } from "@/theme/tokens";

type IconName = ComponentProps<typeof Ionicons>["name"];

// The user's own choices, shown back as small icon chips that pop into
// place one after another — the visual half of "we heard you", before the
// interstitial says what each one changes.
export function AnswerChips({
  chips,
  delay = 0,
  align = "center",
}: {
  chips: AnswerChip[];
  delay?: number;
  align?: "left" | "center";
}) {
  const reducedMotion = useReducedMotion();
  const phase = useStepPhase();
  const animate = !reducedMotion && phase === "active";
  if (chips.length === 0) return null;
  return (
    <View style={[styles.row, align === "center" && styles.center]}>
      {chips.map((chip, index) => (
        <Animated.View
          key={chip.key}
          entering={
            animate
              ? ZoomIn.delay(delay + index * 110)
                  .duration(360)
                  .easing(EASE_OUT)
              : reducedMotion
                ? FadeIn.duration(120)
                : undefined
          }
          style={styles.chip}
        >
          {chip.icon ? (
            <View style={styles.well}>
              <Ionicons name={chip.icon as IconName} size={14} color={colors.black} />
            </View>
          ) : null}
          <Text style={styles.label}>{chip.label}</Text>
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  center: {
    justifyContent: "center",
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingLeft: 6,
    paddingRight: 13,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#F1D9B8",
    backgroundColor: "rgba(255,255,255,0.85)",
  },
  well: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.saffron,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.ink,
  },
});
