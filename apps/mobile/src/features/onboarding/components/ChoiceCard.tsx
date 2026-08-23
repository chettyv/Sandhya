import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  FadeInDown,
  interpolateColor,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { colors } from "@/theme/tokens";

const SELECTED_FILL = "#FFF4E4";
const PRESS_SPRING = { damping: 18, stiffness: 280, mass: 0.6 };
const CHECK_SPRING = { damping: 14, stiffness: 240 };

// One answer. Four simultaneous cues on selection — border, fill, label
// weight and a filled check — so the chosen card is unmistakable without
// relying on colour alone; a press scale and a selection haptic make the
// tap feel acknowledged. Shape tells the user the rule: a circle means one
// answer, a rounded square means several.
export function ChoiceCard({
  label,
  detail,
  selected,
  kind,
  index,
  onPress,
}: {
  label: string;
  detail?: string;
  selected: boolean;
  kind: "radio" | "checkbox";
  index: number;
  onPress: () => void;
}) {
  const reducedMotion = useReducedMotion();
  const scale = useSharedValue(1);
  const selection = useSharedValue(selected ? 1 : 0);

  useEffect(() => {
    selection.value = reducedMotion
      ? selected
        ? 1
        : 0
      : withTiming(selected ? 1 : 0, { duration: 160 });
  }, [selected, selection, reducedMotion]);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    borderColor: interpolateColor(selection.value, [0, 1], [colors.line, colors.saffron]),
    backgroundColor: interpolateColor(selection.value, [0, 1], [colors.paper, SELECTED_FILL]),
  }));

  const checkStyle = useAnimatedStyle(() => ({
    opacity: selection.value,
    transform: [
      { scale: reducedMotion ? selection.value : withSpring(selection.value, CHECK_SPRING) },
    ],
  }));

  const entering = reducedMotion ? undefined : FadeInDown.delay(40 * index).duration(220);

  return (
    <Animated.View entering={entering}>
      <Pressable
        accessibilityRole={kind}
        accessibilityState={{ checked: selected, selected }}
        aria-checked={selected}
        accessibilityLabel={detail ? `${label}. ${detail}` : label}
        onPressIn={() => {
          if (!reducedMotion) scale.value = withSpring(0.975, PRESS_SPRING);
        }}
        onPressOut={() => {
          scale.value = withSpring(1, PRESS_SPRING);
        }}
        onPress={() => {
          void Haptics.selectionAsync();
          onPress();
        }}
      >
        <Animated.View style={[styles.card, cardStyle]}>
          <View style={styles.text}>
            <Text
              className={`text-[17px] leading-6 ${selected ? "font-semibold text-ink" : "font-medium text-ink"}`}
            >
              {label}
            </Text>
            {detail ? (
              <Text className="mt-1 text-[14px] leading-5 text-muted">{detail}</Text>
            ) : null}
          </View>
          <View
            style={[
              styles.indicator,
              kind === "checkbox" ? styles.indicatorSquare : styles.indicatorRound,
              selected && styles.indicatorSelected,
            ]}
          >
            <Animated.View style={checkStyle}>
              <Ionicons name="checkmark" size={15} color={colors.black} />
            </Animated.View>
          </View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    minHeight: 64,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderWidth: 1.5,
    borderRadius: 16,
  },
  text: {
    flex: 1,
    minWidth: 0,
  },
  indicator: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.paper,
  },
  indicatorRound: { borderRadius: 12 },
  indicatorSquare: { borderRadius: 7 },
  indicatorSelected: {
    borderColor: colors.saffron,
    backgroundColor: colors.saffron,
  },
});
