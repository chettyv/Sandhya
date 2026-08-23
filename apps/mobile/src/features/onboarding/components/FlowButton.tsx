import Ionicons from "@expo/vector-icons/Ionicons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, type ComponentProps } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { colors } from "@/theme/tokens";

type IconName = ComponentProps<typeof Ionicons>["name"];
const SPRING = { damping: 16, stiffness: 320, mass: 0.7 };

// The flow's own button: a gold-to-saffron gradient that settles with a
// spring under the thumb, and an arrow that nudges forward on press. The
// ghost variant is for secondary actions. Disabled is a flat sand fill —
// the same shape, only its readiness changes, so it never jumps.
export function FlowButton({
  label,
  icon,
  onPress,
  disabled = false,
  variant = "primary",
}: {
  label: string;
  icon?: IconName;
  onPress: () => void;
  disabled?: boolean;
  variant?: "primary" | "ghost";
}) {
  const reducedMotion = useReducedMotion();
  const press = useSharedValue(0);
  const ready = useSharedValue(disabled ? 0 : 1);

  useEffect(() => {
    ready.value = reducedMotion
      ? disabled
        ? 0
        : 1
      : withTiming(disabled ? 0 : 1, { duration: 220 });
  }, [disabled, ready, reducedMotion]);

  const bodyStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 - press.value * 0.03 }],
    opacity: variant === "ghost" ? 1 : 0.55 + ready.value * 0.45,
  }));
  const arrowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: press.value * 4 }],
  }));

  const textColor = variant === "ghost" ? colors.plum : disabled ? colors.muted : colors.black;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPressIn={() => {
        if (!reducedMotion) press.value = withSpring(1, SPRING);
      }}
      onPressOut={() => {
        press.value = withSpring(0, SPRING);
      }}
      onPress={() => {
        void Haptics.selectionAsync();
        onPress();
      }}
    >
      <Animated.View style={[styles.body, variant === "ghost" && styles.ghost, bodyStyle]}>
        {variant === "primary" && !disabled ? (
          <LinearGradient
            colors={["#E9B949", colors.saffron]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        ) : null}
        {variant === "primary" && disabled ? (
          <View style={[StyleSheet.absoluteFill, styles.disabledFill]} />
        ) : null}
        <Text style={[styles.label, { color: textColor }]}>{label}</Text>
        {icon ? (
          <Animated.View style={arrowStyle}>
            <Ionicons name={icon} size={19} color={textColor} />
          </Animated.View>
        ) : null}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  body: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingHorizontal: 22,
    borderRadius: 18,
    overflow: "hidden",
  },
  ghost: {
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: "rgba(255,255,255,0.6)",
  },
  disabledFill: {
    backgroundColor: colors.sand,
  },
  label: {
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: 0.1,
  },
});
