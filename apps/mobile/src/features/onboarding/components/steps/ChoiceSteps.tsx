import { useEffect, useRef, useState } from "react";
import { View } from "react-native";

import { listAnswer, resolveCopy, resolveOptionalCopy, stringAnswer } from "../../engine";
import type { MultiChoiceStep, OnboardingAnswers, SingleChoiceStep } from "../../types";
import { ChoiceCard } from "../ChoiceCard";
import { StepLayout } from "../OnboardingShell";

import { PrimaryButton } from "@/components/ui";

// Tap an answer and the flow moves on by itself after a short beat — long
// enough to see the card change state, short enough to feel like one motion.
const AUTO_ADVANCE_MS = 280;

export function SingleChoice({
  step,
  answers,
  onAnswer,
  onNext,
}: {
  step: SingleChoiceStep;
  answers: OnboardingAnswers;
  onAnswer: (value: string) => void;
  onNext: () => void;
}) {
  const selected = stringAnswer(answers, step.answerKey);
  const [pending, setPending] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const choose = (value: string) => {
    if (pending) return;
    onAnswer(value);
    setPending(value);
    timer.current = setTimeout(() => {
      timer.current = null;
      onNext();
    }, AUTO_ADVANCE_MS);
  };

  return (
    <StepLayout
      title={resolveCopy(step.title, answers)}
      subtitle={resolveOptionalCopy(step.subtitle, answers)}
    >
      <View style={{ gap: 12 }}>
        {step.options.map((option, index) => (
          <ChoiceCard
            key={option.value}
            index={index}
            kind="radio"
            label={resolveCopy(option.label, answers)}
            detail={option.detail ? resolveCopy(option.detail, answers) : undefined}
            selected={(pending ?? selected) === option.value}
            onPress={() => choose(option.value)}
          />
        ))}
      </View>
    </StepLayout>
  );
}

export function MultiChoice({
  step,
  answers,
  onAnswer,
  onNext,
}: {
  step: MultiChoiceStep;
  answers: OnboardingAnswers;
  onAnswer: (value: string[]) => void;
  onNext: () => void;
}) {
  const selected = listAnswer(answers, step.answerKey);
  const exclusiveValues = new Set(
    step.options.filter((option) => option.exclusive).map((option) => option.value),
  );

  const toggle = (value: string) => {
    if (selected.includes(value)) {
      onAnswer(selected.filter((entry) => entry !== value));
      return;
    }
    if (exclusiveValues.has(value)) {
      onAnswer([value]);
      return;
    }
    onAnswer([...selected.filter((entry) => !exclusiveValues.has(entry)), value]);
  };

  const ready = selected.length >= step.minSelected;

  return (
    <StepLayout
      title={resolveCopy(step.title, answers)}
      subtitle={resolveOptionalCopy(step.subtitle, answers)}
      footer={
        <PrimaryButton
          label={step.continueLabel}
          icon="arrow-forward"
          disabled={!ready}
          onPress={onNext}
        />
      }
    >
      <View style={{ gap: 12 }}>
        {step.options.map((option, index) => (
          <ChoiceCard
            key={option.value}
            index={index}
            kind="checkbox"
            label={resolveCopy(option.label, answers)}
            detail={option.detail ? resolveCopy(option.detail, answers) : undefined}
            selected={selected.includes(option.value)}
            onPress={() => toggle(option.value)}
          />
        ))}
      </View>
    </StepLayout>
  );
}
