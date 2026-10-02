import { beforeAll, describe, expect, it, jest } from "@jest/globals";
import { router } from "expo-router";
import { act, renderRouter, screen, waitFor } from "expo-router/testing-library";

import { ONBOARDING_VERSION } from "@/features/onboarding/steps";

beforeAll(() => {
  process.env.EXPO_PUBLIC_LAUNCH_PROFILE = "core";
  process.env.EXPO_PUBLIC_AI_READY = "false";
  process.env.EXPO_PUBLIC_PAYMENTS_ENABLED = "false";
  globalThis.__memorySecureStore.set(
    "sandhya-app-state",
    JSON.stringify({
      state: { hasCompletedOnboarding: true, onboardingVersion: ONBOARDING_VERSION },
      version: 0,
    }),
  );
});

describe("core pilot navigation", () => {
  it("hides the Ask tab without router warnings and handles a stale Ask link", async () => {
    const warnings = jest.spyOn(console, "warn");
    try {
      await renderRouter("./app", { initialUrl: "/" });
      await waitFor(() => expect(screen.getByText(/Today's Journey/)).toBeTruthy(), {
        timeout: 15_000,
      });
      expect(screen.queryByText(/^Chat$/)).toBeNull();
      expect(screen.queryByText(/^ask$/i)).toBeNull();
      expect(warnings.mock.calls.flat().join(" ")).not.toMatch(
        /Layout children must be of type Screen|No route named/,
      );

      await act(async () => router.push("/ask"));
      await waitFor(() => expect(screen.getByText("Ask is not available")).toBeTruthy());
      expect(screen.queryByPlaceholderText(/Ask a question/)).toBeNull();
      expect(screen.queryByText(/Bring a sincere question/)).toBeNull();
    } finally {
      warnings.mockRestore();
    }
  }, 600_000);
});
