import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { resolveCopy, resolveOptionalCopy, stringAnswer } from "../../engine";
import type { OnboardingAnswers, TextStep as TextStepConfig } from "../../types";
import { StepLayout } from "../OnboardingShell";

import { PrimaryButton } from "@/components/ui";
import { colors } from "@/theme/tokens";

// A single field with the action directly beneath it, above the keyboard,
// and the keyboard's return key doing the same job. Optional: Skip is a
// real control, not a hidden one.
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
  const value = stringAnswer(answers, step.answerKey) ?? "";
  const ready = step.optional || value.trim().length > 0;

  return (
    <StepLayout
      keyboard
      title={resolveCopy(step.title, answers)}
      subtitle={resolveOptionalCopy(step.subtitle, answers)}
    >
      <View style={styles.field}>
        <Text className="mb-2 text-[11px] font-semibold uppercase tracking-[1.5px] text-saffron">
          Name
        </Text>
        <TextInput
          accessibilityLabel="Your name"
          autoFocus
          autoCapitalize="words"
          autoCorrect={false}
          value={value}
          onChangeText={onAnswer}
          maxLength={step.maxLength}
          placeholder={step.placeholder}
          placeholderTextColor={colors.muted}
          returnKeyType="done"
          onSubmitEditing={() => {
            if (ready) onNext();
          }}
          style={styles.input}
        />
      </View>
      <View style={styles.actions}>
        <PrimaryButton
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
      </View>
    </StepLayout>
  );
}

const styles = StyleSheet.create({
  field: {
    borderWidth: 1.5,
    borderColor: colors.line,
    borderRadius: 16,
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
