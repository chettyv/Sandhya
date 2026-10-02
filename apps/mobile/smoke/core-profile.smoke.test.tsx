import { beforeAll, describe, expect, it, jest } from "@jest/globals";
import { router } from "expo-router";
import { act, fireEvent, renderRouter, screen, waitFor } from "expo-router/testing-library";

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
  it("keeps a completed formerly premium practice in the free core history", async () => {
    await renderRouter("./app", {
      initialUrl: "/practice/00000000-0000-0000-0000-000000000502",
    });
    await waitFor(() => expect(screen.getByText("An evening practice of return")).toBeTruthy());
    for (let step = 0; step < 4; step += 1) {
      await fireEvent.press(screen.getByText("Next step"));
    }
    await fireEvent.press(screen.getByText("Complete practice"));
    await act(async () => router.push("/practice-history"));
    await waitFor(() => expect(screen.getByText("An evening practice of return")).toBeTruthy());
    expect(screen.queryByText("No practices completed yet")).toBeNull();
  }, 600_000);

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
