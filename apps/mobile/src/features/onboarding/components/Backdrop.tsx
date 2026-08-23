import { LinearGradient } from "expo-linear-gradient";
import { useEffect } from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { colors } from "@/theme/tokens";

export type BackdropMood = "quiet" | "warm" | "bright";

const GOLD = "#E9B949";

// The ambient ground behind every step: parchment warming towards the top,
// with a soft lamp-light glow that breathes slowly and drifts as the flow
// moves. Abstract light only — no imagery, devotional or otherwise — and it
// holds still under Reduce Motion. Moods: questions are quiet; the
// interstitial is warmer; the result is lit from below as well.
export function Backdrop({ mood, seed = 0 }: { mood: BackdropMood; seed?: number }) {
  const { width, height } = useWindowDimensions();
  const reducedMotion = useReducedMotion();
  const breath = useSharedValue(0);
  const drift = useSharedValue(seed);
  const warmth = useSharedValue(moodLevel(mood));

  useEffect(() => {
    if (reducedMotion) {
      breath.value = 0.5;
      return;
    }
    breath.value = withRepeat(
      withTiming(1, { duration: 4800, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, [breath, reducedMotion]);

  useEffect(() => {
    drift.value = reducedMotion
      ? seed
      : withTiming(seed, { duration: 900, easing: Easing.out(Easing.cubic) });
  }, [drift, seed, reducedMotion]);

  useEffect(() => {
    warmth.value = reducedMotion
      ? moodLevel(mood)
      : withTiming(moodLevel(mood), { duration: 700, easing: Easing.inOut(Easing.quad) });
  }, [warmth, mood, reducedMotion]);

  const size = Math.max(width, 360) * 1.15;

  const glowStyle = useAnimatedStyle(() => {
    const scale = 0.92 + breath.value * 0.12 + warmth.value * 0.18;
    // Each step nudges the light a little further along its arc.
    const x = width * 0.55 - size / 2 + Math.sin(drift.value * 0.9) * width * 0.18;
    const y = -size * 0.45 + Math.cos(drift.value * 0.7) * 28 - warmth.value * 40;
    return {
      opacity: 0.55 + breath.value * 0.2 + warmth.value * 0.25,
      transform: [{ translateX: x }, { translateY: y }, { scale }],
    };
  });

  const emberStyle = useAnimatedStyle(() => ({
    opacity: warmth.value >= 1 ? 0.35 + breath.value * 0.25 : 0,
    transform: [{ translateY: height * 0.62 + (1 - breath.value) * 16 }, { scale: 1.1 }],
  }));

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <LinearGradient
        colors={[colors.sand, colors.parchment, colors.parchment]}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />
      <Animated.View style={[styles.glow, { width: size, height: size }, glowStyle]}>
        <View style={[styles.ring, styles.ringOuter]} />
        <View style={[styles.ring, styles.ringMid]} />
        <View style={[styles.ring, styles.ringCore]} />
      </Animated.View>
      <Animated.View style={[styles.ember, { width: width * 1.4, left: -width * 0.2 }, emberStyle]}>
        <LinearGradient
          colors={["rgba(233,185,73,0)", "rgba(233,185,73,0.28)", "rgba(217,120,36,0.18)"]}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
}

function moodLevel(mood: BackdropMood): number {
  switch (mood) {
    case "bright":
      return 1;
    case "warm":
      return 0.55;
    default:
      return 0;
  }
}

const styles = StyleSheet.create({
  glow: {
    position: "absolute",
    top: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  ring: {
    position: "absolute",
    borderRadius: 9999,
    backgroundColor: GOLD,
  },
  ringOuter: { width: "100%", height: "100%", opacity: 0.1 },
  ringMid: { width: "68%", height: "68%", opacity: 0.12 },
  ringCore: { width: "38%", height: "38%", opacity: 0.16 },
  ember: {
    position: "absolute",
    top: 0,
    height: 420,
    borderRadius: 9999,
    overflow: "hidden",
  },
});
