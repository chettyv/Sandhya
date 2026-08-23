import Ionicons from "@expo/vector-icons/Ionicons";
import * as Haptics from "expo-haptics";
import type { ComponentProps } from "react";
import { useEffect } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  FadeInDown,
  interpolateColor,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { EASE_OUT } from "./motion";
import { useStepPhase } from "./StepTransition";

import { colors } from "@/theme/tokens";

type IconName = ComponentProps<typeof Ionicons>["name"];

const IS_WEB = Platform.OS === "web";
const SELECTED_FILL = "#FFF4E4";
const ICON_WELL = "#F4E9DA";
const PRESS_SPRING = { damping: 18, stiffness: 280, mass: 0.6 };
const CHECK_SPRING = { damping: 13, stiffness: 260 };

// One answer. On selection five things happen at once — the border and fill
// warm up, the label goes semibold, the icon well fills saffron, the check
// disc springs in and a ring ripples out from it — and a selection haptic
// lands under the thumb. Shape tells the user the rule: a circle means one
// answer, a rounded square means several. `dimmed` lets a screen fade the
// answers that were not chosen for the beat before it advances.
export function ChoiceCard({
  label,
  detail,
  icon,
  selected,
  dimmed = false,
  nudge = 0,
  kind,
  index,
  onPress,
}: {
  label: string;
  detail?: string;
  icon?: string;
  selected: boolean;
  dimmed?: boolean;
  // Increment to shake the card sideways once (a screen asking for an answer).
  nudge?: number;
  kind: "radio" | "checkbox";
  index: number;
  onPress: () => void;
}) {
  const reducedMotion = useReducedMotion();
  const phase = useStepPhase();
  const scale = useSharedValue(1);
  const selection = useSharedValue(selected ? 1 : 0);
  const ripple = useSharedValue(0);
  const dim = useSharedValue(dimmed ? 1 : 0);
  const shake = useSharedValue(0);

  useEffect(() => {
    if (nudge === 0 || reducedMotion || selected) return;
    shake.value = withSequence(
      withDelay(index * 40, withTiming(1, { duration: 70 })),
      withTiming(-1, { duration: 70 }),
      withTiming(0.5, { duration: 70 }),
      withTiming(0, { duration: 90 }),
    );
  }, [nudge, index, reducedMotion, selected, shake]);

  useEffect(() => {
    if (reducedMotion) {
      selection.value = selected ? 1 : 0;
      return;
    }
    selection.value = withTiming(selected ? 1 : 0, { duration: 180 });
    if (selected) {
      ripple.value = withSequence(
        withTiming(0, { duration: 0 }),
        withTiming(1, { duration: 520, easing: Easing.out(Easing.cubic) }),
      );
    }
  }, [selected, selection, ripple, reducedMotion]);

  useEffect(() => {
    dim.value = reducedMotion ? (dimmed ? 1 : 0) : withTiming(dimmed ? 1 : 0, { duration: 220 });
  }, [dimmed, dim, reducedMotion]);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shake.value * 6 }, { scale: scale.value * (1 - dim.value * 0.015) }],
    opacity: 1 - dim.value * 0.5,
    borderColor: interpolateColor(selection.value, [0, 1], [colors.line, colors.saffron]),
    backgroundColor: interpolateColor(selection.value, [0, 1], [colors.paper, SELECTED_FILL]),
    ...(IS_WEB ? {} : { shadowOpacity: 0.06 + selection.value * 0.1 }),
  }));

  const wellStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(selection.value, [0, 1], [ICON_WELL, colors.saffron]),
    transform: [{ scale: 1 + selection.value * 0.06 }],
  }));

  const checkStyle = useAnimatedStyle(() => ({
    opacity: selection.value,
    transform: [
      { scale: reducedMotion ? selection.value : withSpring(selection.value, CHECK_SPRING) },
    ],
  }));

  const rippleStyle = useAnimatedStyle(() => ({
    opacity: (1 - ripple.value) * 0.45,
    transform: [{ scale: 1 + ripple.value * 1.9 }],
  }));

  const entering =
    reducedMotion || phase !== "active"
      ? undefined
      : FadeInDown.delay(90 + 45 * index)
          .duration(360)
          .easing(EASE_OUT);

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
          {icon ? (
            <Animated.View style={[styles.well, wellStyle]}>
              <Ionicons
                name={icon as IconName}
                size={21}
                color={selected ? colors.black : colors.plum}
              />
            </Animated.View>
          ) : null}
          <View style={styles.text}>
            <Text
              className={`text-[17px] leading-6 ${selected ? "font-semibold text-ink" : "font-medium text-ink"}`}
            >
              {label}
            </Text>
            {detail ? (
              <Text className="mt-0.5 text-[14px] leading-5 text-muted">{detail}</Text>
            ) : null}
          </View>
          <View style={styles.indicatorWrap}>
            <Animated.View
              style={[
                styles.ripple,
                kind === "checkbox" ? styles.indicatorSquare : styles.indicatorRound,
                rippleStyle,
              ]}
            />
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
    minHeight: 68,
    paddingVertical: 14,
    paddingLeft: 14,
    paddingRight: 18,
    borderWidth: 1.5,
    borderRadius: 18,
    ...Platform.select({
      web: { boxShadow: "0 2px 14px rgba(90, 46, 34, 0.08)" },
      default: {
        shadowColor: colors.aubergine,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 10,
        elevation: 2,
      },
    }),
  },
  well: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    flex: 1,
    minWidth: 0,
  },
  indicatorWrap: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  ripple: {
    position: "absolute",
    width: 24,
    height: 24,
    backgroundColor: colors.saffron,
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
