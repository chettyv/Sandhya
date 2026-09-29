import { describe, expect, it } from "vitest";

import { createAccountHydrationGuard } from "./accountHydration";

describe("account hydration guard", () => {
  it("rejects a response from the previous account after an account switch", () => {
    const guard = createAccountHydrationGuard();
    const firstAccount = guard.begin("user-a");
    const secondAccount = guard.begin("user-b");

    expect(guard.isCurrent(firstAccount)).toBe(false);
    expect(guard.isCurrent(secondAccount)).toBe(true);
  });

  it("invalidates account responses after sign-out", () => {
    const guard = createAccountHydrationGuard();
    const signedIn = guard.begin("user-a");
    const signedOut = guard.begin(null);

    expect(guard.isCurrent(signedIn)).toBe(false);
    expect(guard.isCurrent(signedOut)).toBe(true);
  });
});
