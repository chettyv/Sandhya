import { useEffect } from "react";
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeInUp,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

import { FlowButton } from "../FlowButton";
import { EASE_OUT } from "../motion";
import { RisingText } from "../RisingText";

import { colors, fonts, layout } from "@/theme/tokens";

// One screen, one idea, one tap. No carousel, no social proof: the first
// question is a better introduction than seven slides about it. The
// wordmark settles, a gold rule draws beneath it, the headline rises a word
// at a time, and the actions follow.
export function WelcomeStep({
  onBegin,
  onSkip,
  onSignIn,
}: {
  onBegin: () => void;
  onSkip: () => void;
  onSignIn: () => void;
}) {
  const reducedMotion = useReducedMotion();
  const { width } = useWindowDimensions();
  const rule = useSharedValue(reducedMotion ? 1 : 0);

  useEffect(() => {
    if (reducedMotion) return;
    rule.value = withDelay(260, withTiming(1, { duration: 620, easing: Easing.out(Easing.cubic) }));
  }, [rule, reducedMotion]);

  const ruleStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: rule.value }],
    opacity: 0.4 + rule.value * 0.6,
  }));

  const enter = (delay: number) =>
    reducedMotion ? FadeIn.duration(120) : FadeInUp.delay(delay).duration(460).easing(EASE_OUT);

  return (
    <View style={[styles.root, width > 760 && styles.wide]}>
      <View style={styles.body}>
        <Animated.View entering={enter(0)}>
          <Text style={styles.wordmark}>SANDHYA</Text>
        </Animated.View>
        <Animated.View style={[styles.rule, ruleStyle]} />
        <RisingText
          accessibilityRole="header"
          text="A small daily space for learning and practice."
          delay={320}
          step={55}
          className="text-[38px] font-semibold leading-[46px] text-ink"
          style={styles.display}
        />
        <Animated.View entering={enter(760)}>
          <Text className="mt-6 text-[17px] leading-7 text-muted">
            A few short questions to set it up. Every answer changes something you will see, and you
            can change them all later.
          </Text>
        </Animated.View>
      </View>
      <Animated.View entering={enter(960)} style={styles.footer}>
        <FlowButton label="Let's begin" icon="arrow-forward" onPress={onBegin} />
        <View style={styles.links}>
          <Pressable accessibilityRole="button" hitSlop={8} onPress={onSignIn}>
            <Text className="text-sm font-semibold text-plum">I already have an account</Text>
          </Pressable>
          <Pressable accessibilityRole="button" hitSlop={8} onPress={onSkip}>
            <Text className="text-sm font-semibold text-muted">Set up later</Text>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: layout.screenPadding,
    paddingTop: 48,
    paddingBottom: 12,
  },
  wide: {
    width: "100%",
    maxWidth: layout.maxWidth,
    alignSelf: "center",
  },
  body: {
    flex: 1,
    justifyContent: "center",
  },
  wordmark: {
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 4,
    color: colors.saffronText,
  },
  rule: {
    height: 2,
    width: 56,
    borderRadius: 1,
    backgroundColor: "#E9B949",
    marginTop: 14,
    marginBottom: 22,
    transformOrigin: "left",
  },
  footer: {
    gap: 16,
  },
  links: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 4,
    minHeight: 32,
  },
  display: {
    fontFamily: fonts.display,
    color: colors.ink,
  },
});
