import { useCallback, useEffect, useMemo, useState } from "react";
import { BackHandler } from "react-native";

import { isStepSatisfied, progressFor, visibleSteps, withAnswer } from "./engine";
import type { AnswerKey, OnboardingAnswers, OnboardingStep, StepId } from "./types";

import { track } from "@/lib/telemetry";
import { useAppStore } from "@/store/useAppStore";

type FlowState = { answers: OnboardingAnswers; stepId: StepId };

// Flow controller: which step is showing, the answers so far, and how to
// move. Steps are configuration; this hook only walks the visible list.
// Direction and step change in the same render, so the incoming screen
// mounts with the right entering animation (the outgoing one only fades —
// see StepTransition for why).
export function useOnboardingFlow() {
  const draft = useAppStore((state) => state.onboardingDraft);
  const setOnboardingDraft = useAppStore((state) => state.setOnboardingDraft);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [state, setState] = useState<FlowState>(() => restore(draft));

  const move = useCallback((nextDirection: 1 | -1, update: (current: FlowState) => FlowState) => {
    setDirection(nextDirection);
    setState(update);
  }, []);

  const steps = useMemo(() => visibleSteps(state.answers), [state.answers]);
  const index = Math.max(
    0,
    steps.findIndex((step) => step.id === state.stepId),
  );
  const step: OnboardingStep = steps[index] ?? steps[0];
  const progress = progressFor(state.answers, step.id);

  useEffect(() => {
    track("onboarding_step_viewed", { step_id: step.id, position: index });
  }, [step.id, index]);

  // Persist the draft so closing the app mid-flow resumes in place. Cleared by
  // finish() via setOnboardingComplete.
  useEffect(() => {
    if (state.stepId === "welcome") return;
    setOnboardingDraft({ answers: state.answers, stepId: state.stepId });
  }, [state, setOnboardingDraft]);

  const setAnswer = useCallback((key: AnswerKey, value: string | string[] | undefined) => {
    setState((current) => ({ ...current, answers: withAnswer(current.answers, key, value) }));
  }, []);

  const next = useCallback(() => {
    move(1, (current) => {
      const list = visibleSteps(current.answers);
      const position = list.findIndex((entry) => entry.id === current.stepId);
      const target = list[Math.min(position + 1, list.length - 1)];
      return target ? { ...current, stepId: target.id } : current;
    });
  }, [move]);

  const back = useCallback((): boolean => {
    const list = visibleSteps(state.answers);
    const position = list.findIndex((entry) => entry.id === state.stepId);
    if (position <= 0) return false;
    const target = list[position - 1];
    move(-1, (current) => ({ ...current, stepId: target.id }));
    return true;
  }, [move, state.answers, state.stepId]);

  // "Change" from the result screen jumps straight to the step in question.
  const goTo = useCallback(
    (stepId: StepId) => {
      move(-1, (current) => ({ ...current, stepId }));
    },
    [move],
  );

  // Android hardware back walks the flow rather than leaving it.
  useEffect(() => {
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => back());
    return () => subscription.remove();
  }, [back]);

  return {
    answers: state.answers,
    step,
    steps,
    index,
    progress,
    direction,
    canGoBack: index > 0,
    satisfied: isStepSatisfied(step, state.answers),
    setAnswer,
    next,
    back,
    goTo,
  };
}

// Resume a saved draft at its step, provided that step still exists for the
// saved answers; otherwise start from the first unsatisfied step.
function restore(draft: { answers: OnboardingAnswers; stepId: StepId } | null): FlowState {
  if (!draft) return { answers: {}, stepId: "welcome" };
  const list = visibleSteps(draft.answers);
  if (list.some((step) => step.id === draft.stepId)) return draft;
  const firstOpen = list.find((step) => !isStepSatisfied(step, draft.answers)) ?? list[0];
  return { answers: draft.answers, stepId: firstOpen.id };
}
