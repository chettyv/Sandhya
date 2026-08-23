import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { colors } from "@/theme/tokens";

// One bar, present on every screen after the welcome. The fill is a
// gold-to-saffron gradient that eases to each new fraction and glints once
// as it lands; beside it a small "3 / 8" count fades between values. It
// counts every screen to the result, so it reads 100% on the genuine last
// screen — never earlier — and recomputes when a branch appears.
export function ProgressBar({
  progress,
  position,
  total,
  label,
}: {
  progress: number;
  position: number;
  total: number;
  label: string;
}) {
  const [trackWidth, setTrackWidth] = useState(0);
  const width = useSharedValue(0);
  const glint = useSharedValue(0);
  const countOpacity = useSharedValue(1);
  const [shownCount, setShownCount] = useState({ position, total });
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const target = Math.max(0, Math.min(1, progress)) * trackWidth;
    if (reducedMotion) {
      width.value = target;
      return;
    }
    width.value = withTiming(target, { duration: 520, easing: Easing.out(Easing.cubic) });
    glint.value = withSequence(
      withTiming(0, { duration: 0 }),
      withDelay(380, withTiming(1, { duration: 260, easing: Easing.out(Easing.quad) })),
      withTiming(0, { duration: 420 }),
    );
  }, [progress, trackWidth, reducedMotion, width, glint]);

  useEffect(() => {
    if (shownCount.position === position && shownCount.total === total) return;
    if (reducedMotion) {
      setShownCount({ position, total });
      return;
    }
    countOpacity.value = withTiming(0, { duration: 120 });
    const timer = setTimeout(() => {
      setShownCount({ position, total });
      countOpacity.value = withTiming(1, { duration: 220 });
    }, 130);
    return () => clearTimeout(timer);
  }, [position, total, shownCount, reducedMotion, countOpacity]);

  const fillStyle = useAnimatedStyle(() => ({ width: width.value }));
  const glintStyle = useAnimatedStyle(() => ({
    opacity: glint.value * 0.9,
    transform: [{ scale: 1 + glint.value * 0.6 }],
  }));
  const countStyle = useAnimatedStyle(() => ({ opacity: countOpacity.value }));

  return (
    <View style={styles.row}>
      <View
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
        accessibilityValue={{ min: 0, max: 100, now: Math.round(progress * 100) }}
        onLayout={(event) => setTrackWidth(event.nativeEvent.layout.width)}
        style={styles.track}
      >
        <Animated.View style={[styles.fill, fillStyle]}>
          <LinearGradient
            colors={["#E9B949", colors.saffron]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
          <Animated.View style={[styles.glint, glintStyle]} />
        </Animated.View>
      </View>
      <Animated.View style={countStyle}>
        <Text style={styles.count}>
          {shownCount.position}
          <Text style={styles.countMuted}> / {shownCount.total}</Text>
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  track: {
    height: 5,
    flex: 1,
    borderRadius: 3,
    backgroundColor: colors.sand,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 3,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "flex-end",
  },
  glint: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FFFFFF",
    marginRight: -2,
  },
  count: {
    fontSize: 12.5,
    fontWeight: "600",
    color: colors.ink,
    fontVariant: ["tabular-nums"],
    minWidth: 34,
    textAlign: "right",
  },
  countMuted: {
    color: colors.muted,
    fontWeight: "500",
  },
});
