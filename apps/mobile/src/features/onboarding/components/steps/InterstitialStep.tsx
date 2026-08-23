import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, FadeInUp, useReducedMotion } from "react-native-reanimated";

import { answerChips, resolveCopy } from "../../engine";
import type { InterstitialStep as InterstitialConfig, OnboardingAnswers } from "../../types";
import { AnswerChips } from "../AnswerChips";
import { FlowButton } from "../FlowButton";
import { EASE_OUT } from "../motion";
import { StepLayout } from "../OnboardingShell";
import { useStepPhase } from "../StepTransition";

import { colors } from "@/theme/tokens";

// A breather between question blocks that reflects the answers so far and
// states, line by line, what each one changes. A saffron rule draws down
// beside each line a beat before its text arrives. Nothing here is a
// loader, a percentage or a claim the app does not keep.
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
  const phase = useStepPhase();
  const animate = !reducedMotion && phase === "active";
  const lines = step.lines(answers);
  const chips = answerChips(answers);
  const base = 520 + chips.length * 110;
  const gap = 300;

  return (
    <StepLayout
      align="center"
      eyebrow={resolveCopy(step.eyebrow, answers)}
      title={resolveCopy(step.title, answers)}
      footer={<FlowButton label={step.continueLabel} icon="arrow-forward" onPress={onNext} />}
    >
      <AnswerChips chips={chips} delay={360} />
      <View style={styles.lines}>
        {lines.map((line, index) => (
          <View key={line} style={styles.line}>
            <Animated.View
              entering={
                animate
                  ? FadeIn.delay(base + index * gap).duration(260)
                  : reducedMotion
                    ? FadeIn.duration(120)
                    : undefined
              }
              style={styles.rule}
            />
            <Animated.View
              entering={
                animate
                  ? FadeInUp.delay(base + 90 + index * gap)
                      .duration(420)
                      .easing(EASE_OUT)
                  : reducedMotion
                    ? FadeIn.duration(120)
                    : undefined
              }
              style={styles.lineText}
            >
              <Text className="text-[18px] leading-7 text-ink">{line}</Text>
            </Animated.View>
          </View>
        ))}
      </View>
    </StepLayout>
  );
}

const styles = StyleSheet.create({
  lines: {
    gap: 20,
    paddingTop: 30,
  },
  line: {
    flexDirection: "row",
    gap: 14,
    alignItems: "stretch",
  },
  rule: {
    width: 3,
    borderRadius: 2,
    backgroundColor: colors.saffron,
    marginTop: 4,
    marginBottom: 4,
  },
  lineText: {
    flex: 1,
  },
});
