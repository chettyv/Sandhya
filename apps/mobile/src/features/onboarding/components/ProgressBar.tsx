import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { colors } from "@/theme/tokens";

// One thin bar, present on every screen after the welcome, animating to the
// new fraction on each step. It counts every screen to the result, so it
// reads 100% on the genuine last screen — never earlier.
export function ProgressBar({ progress, label }: { progress: number; label: string }) {
  const [trackWidth, setTrackWidth] = useState(0);
  const width = useSharedValue(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const target = Math.max(0, Math.min(1, progress)) * trackWidth;
    width.value = reducedMotion
      ? target
      : withTiming(target, { duration: 420, easing: Easing.out(Easing.cubic) });
  }, [progress, trackWidth, reducedMotion, width]);

  const fillStyle = useAnimatedStyle(() => ({ width: width.value }));

  return (
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
      <Animated.View style={[styles.fill, fillStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 4,
    flex: 1,
    borderRadius: 2,
    backgroundColor: colors.sand,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 2,
    backgroundColor: colors.saffron,
  },
});
