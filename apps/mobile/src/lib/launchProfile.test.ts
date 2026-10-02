import { describe, expect, it } from "vitest";

import { getLaunchProfile, isFeatureAvailable } from "./launchProfile";

describe("getLaunchProfile", () => {
  it("defaults to the static-content core profile", () => {
    const env = {};
    expect(getLaunchProfile(env)).toBe("core");
    expect(isFeatureAvailable("ask", env)).toBe(false);
    expect(isFeatureAvailable("payments", env)).toBe(false);
    expect(isFeatureAvailable("challenge", env)).toBe(false);
  });

  it("requires an explicit non-secret readiness flag before enabling full", () => {
    expect(getLaunchProfile({ EXPO_PUBLIC_LAUNCH_PROFILE: "full" })).toBe("core");
    expect(
      getLaunchProfile({ EXPO_PUBLIC_LAUNCH_PROFILE: "full", EXPO_PUBLIC_AI_READY: "true" }),
    ).toBe("full");
    expect(
      isFeatureAvailable("ask", {
        EXPO_PUBLIC_LAUNCH_PROFILE: "full",
        EXPO_PUBLIC_AI_READY: "true",
      }),
    ).toBe(true);
  });

  it("rejects invalid values and keeps payments/challenge off when payment is disabled", () => {
    expect(getLaunchProfile({ EXPO_PUBLIC_LAUNCH_PROFILE: "pilot" })).toBe("core");
    const fullWithoutPayments = {
      EXPO_PUBLIC_LAUNCH_PROFILE: "full",
      EXPO_PUBLIC_AI_READY: "true",
      EXPO_PUBLIC_PAYMENTS_ENABLED: "false",
    };
    expect(isFeatureAvailable("payments", fullWithoutPayments)).toBe(false);
    expect(isFeatureAvailable("challenge", fullWithoutPayments)).toBe(false);
  });

  it("enables finite purchase features only when full and payments are explicitly on", () => {
    const env = {
      EXPO_PUBLIC_LAUNCH_PROFILE: "full",
      EXPO_PUBLIC_AI_READY: "true",
      EXPO_PUBLIC_PAYMENTS_ENABLED: "true",
    };
    expect(isFeatureAvailable("payments", env)).toBe(true);
    expect(isFeatureAvailable("challenge", env)).toBe(true);
  });
});
