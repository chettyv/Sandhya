import { useEffect, useRef, useState } from "react";
import { View } from "react-native";

import { choiceAnswer, listAnswer, resolveCopy, resolveOptionalCopy } from "../../engine";
import type { MultiChoiceStep, OnboardingAnswers, SingleChoiceStep } from "../../types";
import { ChoiceCard } from "../ChoiceCard";
import { FlowButton } from "../FlowButton";
import { StepLayout } from "../OnboardingShell";
import { useStepPhase } from "../StepTransition";

// Tap an answer and the flow moves on by itself after a short beat: the
// chosen card warms up and ripples, the others fall back, then the next
// screen arrives — long enough to see the choice land, short enough to
// feel like one motion.
const AUTO_ADVANCE_MS = 420;

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
  const selected = choiceAnswer(answers, step.answerKey);
  const phase = useStepPhase();
  const [pending, setPending] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // The screen stays mounted while it animates out; a pending auto-advance
  // must not fire after the user has already gone Back.
  useEffect(() => {
    if (phase === "active") return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  }, [phase]);
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

  const current = pending ?? selected;

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
            icon={option.icon}
            label={resolveCopy(option.label, answers)}
            detail={option.detail ? resolveCopy(option.detail, answers) : undefined}
            selected={current === option.value}
            dimmed={pending !== null && pending !== option.value}
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
  // Tapping Continue with nothing chosen nudges the cards instead of doing
  // nothing: the answer to "why will it not go" is on screen, not in a toast.
  const [nudge, setNudge] = useState(0);
  const label =
    selected.length > 0 ? `${step.continueLabel} · ${selected.length} chosen` : step.continueLabel;

  return (
    <StepLayout
      title={resolveCopy(step.title, answers)}
      subtitle={resolveOptionalCopy(step.subtitle, answers)}
      footer={
        <FlowButton
          label={label}
          icon="arrow-forward"
          disabled={!ready}
          onPress={onNext}
          onDisabledPress={() => setNudge((count) => count + 1)}
        />
      }
    >
      <View style={{ gap: 12 }}>
        {step.options.map((option, index) => (
          <ChoiceCard
            key={option.value}
            index={index}
            kind="checkbox"
            icon={option.icon}
            label={resolveCopy(option.label, answers)}
            detail={option.detail ? resolveCopy(option.detail, answers) : undefined}
            selected={selected.includes(option.value)}
            nudge={nudge}
            onPress={() => toggle(option.value)}
          />
        ))}
      </View>
    </StepLayout>
  );
}
