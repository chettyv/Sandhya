import { StyleSheet, Text, View, type StyleProp, type TextStyle } from "react-native";
import Animated, { FadeInUp, useReducedMotion } from "react-native-reanimated";

import { EASE_OUT } from "./motion";
import { useStepPhase } from "./StepTransition";

// A heading whose words rise into place one after another. Each word is its
// own view so the stagger works, laid out in a wrapping row so line breaks
// fall exactly where they would in a single Text. Skipped (plain text) under
// Reduce Motion and on a screen that is leaving.
export function RisingText({
  text,
  style,
  className,
  delay = 0,
  step = 38,
  align = "left",
  accessibilityRole,
}: {
  text: string;
  style?: StyleProp<TextStyle>;
  className?: string;
  delay?: number;
  step?: number;
  align?: "left" | "center";
  accessibilityRole?: "header";
}) {
  const reducedMotion = useReducedMotion();
  const phase = useStepPhase();
  const animate = !reducedMotion && phase === "active";
  const words = text.split(" ");

  if (!animate) {
    return (
      <Text accessibilityRole={accessibilityRole} className={className} style={style}>
        {text}
      </Text>
    );
  }

  return (
    <View
      accessibilityRole={accessibilityRole}
      accessibilityLabel={text}
      style={[styles.row, align === "center" && styles.center]}
    >
      {words.map((word, index) => (
        <Animated.View
          key={`${index}-${word}`}
          entering={FadeInUp.delay(delay + index * step)
            .duration(420)
            .easing(EASE_OUT)}
        >
          <Text className={className} style={style}>
            {word}
            {index < words.length - 1 ? " " : ""}
          </Text>
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  center: {
    justifyContent: "center",
  },
});
