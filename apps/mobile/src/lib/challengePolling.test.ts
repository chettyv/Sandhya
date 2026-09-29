import { describe, expect, it } from "vitest";

import { getChallengePollingPlan } from "./challengePolling";

describe("getChallengePollingPlan", () => {
  it("enables three-second polling while confirmation is focused and active", () => {
    expect(
      getChallengePollingPlan({
        phase: "confirming",
        attempts: 0,
        elapsedMs: 0,
        isFocused: true,
        appState: "active",
      }),
    ).toEqual({ enabled: true, intervalMs: 3_000, reason: "polling" });
  });

  it("pauses when the app is backgrounded or the route is not focused", () => {
    expect(
      getChallengePollingPlan({
        phase: "confirming",
        attempts: 2,
        elapsedMs: 6_000,
        isFocused: false,
        appState: "active",
      }).reason,
    ).toBe("not-focused");
    expect(
      getChallengePollingPlan({
        phase: "confirming",
        attempts: 2,
        elapsedMs: 6_000,
        isFocused: true,
        appState: "background",
      }).reason,
    ).toBe("background");
  });

  it("times out after twenty attempts or sixty seconds", () => {
    expect(
      getChallengePollingPlan({
        phase: "confirming",
        attempts: 20,
        elapsedMs: 59_000,
        isFocused: true,
        appState: "active",
      }),
    ).toEqual({ enabled: false, intervalMs: 0, reason: "timeout" });
    expect(
      getChallengePollingPlan({
        phase: "confirming",
        attempts: 19,
        elapsedMs: 60_000,
        isFocused: true,
        appState: "active",
      }).reason,
    ).toBe("timeout");
  });
});
