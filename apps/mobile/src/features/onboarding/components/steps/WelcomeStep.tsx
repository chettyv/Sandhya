import { Platform, Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import Animated, { FadeIn, FadeInDown, useReducedMotion } from "react-native-reanimated";

import { PrimaryButton } from "@/components/ui";
import { colors, layout } from "@/theme/tokens";

// One screen, one idea, one tap. No carousel, no social proof: the first
// question is a better introduction than seven slides about it.
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
  const enter = (delay: number) =>
    reducedMotion ? FadeIn.duration(120) : FadeInDown.delay(delay).duration(320);

  return (
    <View style={[styles.root, width > 760 && styles.wide]}>
      <View style={styles.body}>
        <Animated.View entering={enter(0)}>
          <Text className="text-[13px] font-semibold uppercase tracking-[3px] text-saffron">
            Sandhya
          </Text>
        </Animated.View>
        <Animated.View entering={enter(90)}>
          <Text
            accessibilityRole="header"
            className="mt-4 text-[36px] font-semibold leading-[44px] text-ink"
            style={styles.display}
          >
            A small daily space for learning and practice.
          </Text>
        </Animated.View>
        <Animated.View entering={enter(180)}>
          <Text className="mt-5 text-[17px] leading-7 text-muted">
            A few short questions to set it up. Every answer changes something you will see, and you
            can change them all later.
          </Text>
        </Animated.View>
      </View>
      <Animated.View entering={enter(280)} style={styles.footer}>
        <PrimaryButton label="Let's begin" icon="arrow-forward" onPress={onBegin} />
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
    fontFamily: Platform.select({ ios: "Georgia", android: "serif", default: "Georgia" }),
    color: colors.ink,
  },
});
