import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BackHandler, Platform } from "react-native";

import { progressFor, restoreDraft, stepIndex, visibleSteps, withAnswer } from "./engine";
import type { AnswerKey, FlowEnv, OnboardingAnswers, OnboardingStep, StepId } from "./types";

import { track } from "@/lib/telemetry";
import { useAppStore } from "@/store/useAppStore";

type FlowState = { answers: OnboardingAnswers; stepId: StepId };

// Reminders are scheduled natively; on web the step is not asked.
const FLOW_ENV: FlowEnv = { remindersAvailable: Platform.OS !== "web" };
const DRAFT_PERSIST_MS = 400;

// Flow controller: which step is showing, the answers so far, and how to
// move. Steps are configuration; this hook only walks the visible list.
// Direction and step change in the same render, so the incoming screen
// mounts with the right entering animation (the outgoing one only fades —
// see StepTransition for why).
export function useOnboardingFlow() {
  const draft = useAppStore((state) => state.onboardingDraft);
  const setOnboardingDraft = useAppStore((state) => state.setOnboardingDraft);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [state, setState] = useState<FlowState>(() => {
    const { displayName } = useAppStore.getState();
    return restoreDraft(
      draft,
      { name: displayName === "Friend" ? undefined : displayName },
      FLOW_ENV,
    );
  });

  const move = useCallback((nextDirection: 1 | -1, update: (current: FlowState) => FlowState) => {
    setDirection(nextDirection);
    setState(update);
  }, []);

  const steps = useMemo(() => visibleSteps(state.answers, undefined, FLOW_ENV), [state.answers]);
  const index = Math.max(0, stepIndex(state.answers, state.stepId, undefined, FLOW_ENV));
  const step: OnboardingStep = steps[index] ?? steps[0];
  const progress = progressFor(state.answers, step.id, undefined, FLOW_ENV);

  useEffect(() => {
    track("onboarding_step_viewed", { step_id: step.id, position: index });
  }, [step.id, index]);

  // Persist the draft so closing the app mid-flow resumes in place. Debounced:
  // every write goes through the persisted store and SecureStore, and the
  // name field would otherwise write on every keystroke. Flushed on unmount.
  // Cleared by finish() via setOnboardingComplete.
  const pendingDraft = useRef<FlowState | null>(null);
  useEffect(() => {
    if (state.stepId === "welcome") return;
    pendingDraft.current = state;
    const timer = setTimeout(() => {
      pendingDraft.current = null;
      setOnboardingDraft({ answers: state.answers, stepId: state.stepId });
    }, DRAFT_PERSIST_MS);
    return () => clearTimeout(timer);
  }, [state, setOnboardingDraft]);
  useEffect(
    () => () => {
      const pending = pendingDraft.current;
      if (pending && useAppStore.getState().onboardingDraft !== null) {
        setOnboardingDraft({ answers: pending.answers, stepId: pending.stepId });
      }
    },
    [setOnboardingDraft],
  );

  const setAnswer = useCallback((key: AnswerKey, value: string | string[] | undefined) => {
    setState((current) => ({ ...current, answers: withAnswer(current.answers, key, value) }));
  }, []);

  const next = useCallback(() => {
    move(1, (current) => {
      const list = visibleSteps(current.answers, undefined, FLOW_ENV);
      const position = stepIndex(current.answers, current.stepId, undefined, FLOW_ENV);
      const target = list[Math.min(position + 1, list.length - 1)];
      return target ? { ...current, stepId: target.id } : current;
    });
  }, [move]);

  const back = useCallback((): boolean => {
    const list = visibleSteps(state.answers, undefined, FLOW_ENV);
    const position = stepIndex(state.answers, state.stepId, undefined, FLOW_ENV);
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
    setAnswer,
    next,
    back,
    goTo,
  };
}
