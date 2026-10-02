import { useCallback, useEffect, useRef, useState } from "react";
import type { AppStateStatus } from "react-native";

export const CHALLENGE_POLL_INTERVAL_MS = 3_000;
export const CHALLENGE_POLL_MAX_ATTEMPTS = 20;
export const CHALLENGE_POLL_TIMEOUT_MS = 60_000;

export type ChallengePollingPhase = "idle" | "confirming" | "complete";
export type ChallengePollingReason = "idle" | "polling" | "not-focused" | "background" | "timeout";

export type ChallengePollingState = {
  phase: ChallengePollingPhase;
  attempts: number;
  elapsedMs: number;
  isFocused: boolean;
  appState: AppStateStatus;
};

export type ChallengePollingPlan = {
  enabled: boolean;
  intervalMs: number;
  reason: ChallengePollingReason;
};

export function getChallengePollingPlan(state: ChallengePollingState): ChallengePollingPlan {
  if (state.phase !== "confirming") {
    return { enabled: false, intervalMs: 0, reason: "idle" };
  }
  if (!state.isFocused) {
    return { enabled: false, intervalMs: 0, reason: "not-focused" };
  }
  if (state.appState !== "active") {
    return { enabled: false, intervalMs: 0, reason: "background" };
  }
  if (
    state.attempts >= CHALLENGE_POLL_MAX_ATTEMPTS ||
    state.elapsedMs >= CHALLENGE_POLL_TIMEOUT_MS
  ) {
    return { enabled: false, intervalMs: 0, reason: "timeout" };
  }
  return {
    enabled: true,
    intervalMs: CHALLENGE_POLL_INTERVAL_MS,
    reason: "polling",
  };
}

export function useChallengePolling({
  enabled,
  isFocused,
  appState,
  onPoll,
}: {
  enabled: boolean;
  isFocused: boolean;
  appState: AppStateStatus;
  onPoll: () => void | Promise<unknown>;
}) {
  const [attempts, setAttempts] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [timedOut, setTimedOut] = useState(false);
  const [cycle, setCycle] = useState(0);
  const attemptsRef = useRef(0);
  const startedAtRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) {
      attemptsRef.current = 0;
      startedAtRef.current = null;
      setAttempts(0);
      setElapsedMs(0);
      setTimedOut(false);
      return;
    }
    attemptsRef.current = 0;
    startedAtRef.current = Date.now();
    setAttempts(0);
    setElapsedMs(0);
    setTimedOut(false);
  }, [cycle, enabled]);

  useEffect(() => {
    if (
      !enabled ||
      timedOut ||
      !isFocused ||
      appState !== "active" ||
      startedAtRef.current === null
    )
      return;

    const poll = () => {
      const startedAt = startedAtRef.current;
      if (startedAt === null) return;
      const elapsed = Date.now() - startedAt;
      const nextAttempts = attemptsRef.current + 1;
      const plan = getChallengePollingPlan({
        phase: "confirming",
        attempts: attemptsRef.current,
        elapsedMs: elapsed,
        isFocused,
        appState,
      });
      if (!plan.enabled || nextAttempts > CHALLENGE_POLL_MAX_ATTEMPTS) {
        setElapsedMs(elapsed);
        setTimedOut(true);
        return;
      }
      attemptsRef.current = nextAttempts;
      setAttempts(nextAttempts);
      setElapsedMs(elapsed);
      void onPoll();
      if (nextAttempts >= CHALLENGE_POLL_MAX_ATTEMPTS) setTimedOut(true);
    };

    const timer = setInterval(poll, CHALLENGE_POLL_INTERVAL_MS);
    const remainingMs = Math.max(
      0,
      CHALLENGE_POLL_TIMEOUT_MS - (Date.now() - startedAtRef.current),
    );
    const timeout = setTimeout(() => {
      const startedAt = startedAtRef.current;
      setElapsedMs(startedAt === null ? CHALLENGE_POLL_TIMEOUT_MS : Date.now() - startedAt);
      setTimedOut(true);
    }, remainingMs);
    return () => {
      clearInterval(timer);
      clearTimeout(timeout);
    };
  }, [appState, enabled, isFocused, onPoll, timedOut]);

  const retry = useCallback(() => {
    setCycle((value) => value + 1);
  }, []);
  const plan = getChallengePollingPlan({
    phase: enabled ? "confirming" : "idle",
    attempts,
    elapsedMs,
    isFocused,
    appState,
  });

  return { attempts, elapsedMs, plan, retry, timedOut };
}
