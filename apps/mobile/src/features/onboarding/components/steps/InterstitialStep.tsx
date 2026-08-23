import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, FadeInDown, useReducedMotion } from "react-native-reanimated";

import { resolveCopy } from "../../engine";
import type { InterstitialStep as InterstitialConfig, OnboardingAnswers } from "../../types";
import { StepLayout } from "../OnboardingShell";

import { PrimaryButton } from "@/components/ui";
import { colors } from "@/theme/tokens";

// A breather between question blocks that reflects the answers so far and
// states, line by line, what each one changes. Lines arrive one after
// another; nothing here is a loader, a percentage or a claim the app does
// not keep.
export function Interstitial({
  step,
  answers,
  onNext,
}: {
  step: InterstitialConfig;
  answers: OnboardingAnswers;
  onNext: () => void;
}) {
  const reducedMotion = useReducedMotion();
  const lines = step.lines(answers);
  return (
    <StepLayout
      align="center"
      eyebrow={resolveCopy(step.eyebrow, answers)}
      title={resolveCopy(step.title, answers)}
      footer={<PrimaryButton label={step.continueLabel} icon="arrow-forward" onPress={onNext} />}
    >
      <View style={styles.lines}>
        {lines.map((line, index) => (
          <Animated.View
            key={line}
            entering={
              reducedMotion
                ? FadeIn.duration(120)
                : FadeInDown.delay(260 + index * 220).duration(360)
            }
            style={styles.line}
          >
            <View style={styles.rule} />
            <Text className="flex-1 text-[18px] leading-7 text-ink">{line}</Text>
          </Animated.View>
        ))}
      </View>
    </StepLayout>
  );
}

const styles = StyleSheet.create({
  lines: {
    gap: 18,
    paddingTop: 8,
  },
  line: {
    flexDirection: "row",
    gap: 14,
    alignItems: "flex-start",
  },
  rule: {
    width: 3,
    alignSelf: "stretch",
    borderRadius: 2,
    backgroundColor: colors.saffron,
    marginTop: 4,
    marginBottom: 4,
  },
});
