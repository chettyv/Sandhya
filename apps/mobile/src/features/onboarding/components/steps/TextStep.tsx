import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput } from "react-native";
import Animated, {
  FadeInUp,
  interpolateColor,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { resolveCopy, resolveOptionalCopy, stringAnswer } from "../../engine";
import type { OnboardingAnswers, TextStep as TextStepConfig } from "../../types";
import { FlowButton } from "../FlowButton";
import { EASE_OUT } from "../motion";
import { StepLayout } from "../OnboardingShell";
import { useStepPhase } from "../StepTransition";

import { colors } from "@/theme/tokens";

// A single field with the action directly beneath it, above the keyboard,
// and the keyboard's return key doing the same job. The field's border
// warms to saffron while it has focus. Optional: Skip is a real control,
// not a hidden one.
export function TextStep({
  step,
  answers,
  onAnswer,
  onNext,
  onSkip,
}: {
  step: TextStepConfig;
  answers: OnboardingAnswers;
  onAnswer: (value: string) => void;
  onNext: () => void;
  onSkip: () => void;
}) {
  const reducedMotion = useReducedMotion();
  const phase = useStepPhase();
  const value = stringAnswer(answers, step.answerKey) ?? "";
  const ready = step.optional || value.trim().length > 0;
  const [focused, setFocused] = useState(false);
  const focus = useSharedValue(0);
  useEffect(() => {
    focus.value = reducedMotion
      ? focused
        ? 1
        : 0
      : withTiming(focused ? 1 : 0, { duration: 200 });
  }, [focused, focus, reducedMotion]);

  const fieldStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(focus.value, [0, 1], [colors.line, colors.saffron]),
    transform: [{ scale: 1 + focus.value * 0.01 }],
  }));

  const animate = !reducedMotion && phase === "active";

  return (
    <StepLayout
      keyboard
      title={resolveCopy(step.title, answers)}
      subtitle={resolveOptionalCopy(step.subtitle, answers)}
    >
      <Animated.View
        entering={animate ? FadeInUp.delay(220).duration(360).easing(EASE_OUT) : undefined}
      >
        <Animated.View style={[styles.field, fieldStyle]}>
          <Text className="mb-2 text-[11px] font-semibold uppercase tracking-[1.5px] text-saffron">
            Name
          </Text>
          <TextInput
            accessibilityLabel="Your name"
            autoFocus={phase === "active"}
            autoCapitalize="words"
            autoCorrect={false}
            value={value}
            onChangeText={onAnswer}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            maxLength={step.maxLength}
            placeholder={step.placeholder}
            placeholderTextColor={colors.muted}
            returnKeyType="done"
            onSubmitEditing={() => {
              if (ready) onNext();
            }}
            style={styles.input}
          />
        </Animated.View>
      </Animated.View>
      <Animated.View
        entering={animate ? FadeInUp.delay(340).duration(360).easing(EASE_OUT) : undefined}
        style={styles.actions}
      >
        <FlowButton
          label={step.continueLabel}
          icon="arrow-forward"
          disabled={!ready}
          onPress={onNext}
        />
        {step.optional ? (
          <Pressable accessibilityRole="button" hitSlop={8} onPress={onSkip} style={styles.skip}>
            <Text className="text-sm font-semibold text-plum">Skip</Text>
          </Pressable>
        ) : null}
      </Animated.View>
    </StepLayout>
  );
}

const styles = StyleSheet.create({
  field: {
    borderWidth: 1.5,
    borderRadius: 18,
    backgroundColor: colors.paper,
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 12,
  },
  input: {
    fontSize: 22,
    lineHeight: 28,
    color: colors.ink,
    paddingVertical: 4,
  },
  actions: {
    marginTop: 20,
    gap: 8,
  },
  skip: {
    alignSelf: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
});
