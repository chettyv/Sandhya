/**
 * Render-level smoke test: mounts the real `app/` directory through Expo
 * Router with the iOS preset and walks every user-facing route. A route that
 * throws, lands on the router's "Something went wrong" boundary, resolves to
 * "Unmatched Route", or never shows its anchor text fails here instead of on
 * a phone. Unit logic lives in vitest; this file only checks that screens draw.
 */
import { beforeAll, describe, expect, it } from "@jest/globals";
import { router } from "expo-router";
import { act, renderRouter, screen, waitFor } from "expo-router/testing-library";

import { ONBOARDING_VERSION } from "@/features/onboarding/steps";

declare global {
  // Provided by jest.setup.js — the in-memory SecureStore.

  var __memorySecureStore: Map<string, string>;
}

const ROUTES: { path: string; anchor: RegExp }[] = [
  { path: "/calendar", anchor: /Holy Calendar/ },
  { path: "/ask", anchor: /Bring a sincere question/ },
  { path: "/explore", anchor: /Browse by/ },
  { path: "/journey", anchor: /Your journey/ },
  { path: "/settings", anchor: /Verses shown|Redo the setup questions|Appearance/ },
  { path: "/profile", anchor: /Profile/ },
  { path: "/saved", anchor: /Saved/ },
  { path: "/journal", anchor: /Journal/ },
  { path: "/practice-history", anchor: /practice/i },
  { path: "/shlokas", anchor: /Every verse carries its pronunciation/ },
  { path: "/read", anchor: /Read continuously, verse by verse/ },
  { path: "/read/gita-2", anchor: /Bhagavad Gita — Chapter 2/ },
  { path: "/shloka/gita-2-13", anchor: /2\.13/ },
  { path: "/reflection/00000000-0000-0000-0000-000000000301", anchor: /Carry this into the day/ },
  { path: "/festival/00000000-0000-0000-0000-000000000402", anchor: /A simple home observance/ },
  { path: "/practice/00000000-0000-0000-0000-000000000501", anchor: /Morning Diya Lighting/ },
  { path: "/concept/00000000-0000-0000-0000-000000000701", anchor: /Dharma/ },
  {
    path: "/deity/00000000-0000-0000-0000-000000000601",
    anchor: /Also known as|Learn with context/,
  },
  { path: "/text/00000000-0000-0000-0000-000000000101", anchor: /Bhagavad Gita/ },
  { path: "/legal", anchor: /Privacy/ },
  { path: "/sign-in", anchor: /Sign in|Welcome/i },
];

const TIMEOUT = 15_000;

beforeAll(() => {
  // Skip onboarding: the index route only redirects into the tabs once the
  // persisted state says onboarding is complete for the current version.
  globalThis.__memorySecureStore.set(
    "sandhya-app-state",
    JSON.stringify({
      state: {
        hasCompletedOnboarding: true,
        onboardingVersion: ONBOARDING_VERSION,
        displayName: "Smoke",
      },
      version: 0,
    }),
  );
});

function visibleText(): string {
  const json = screen.toJSON();
  const out: string[] = [];
  const walk = (node: unknown) => {
    if (node == null) return;
    if (typeof node === "string") out.push(node);
    else if (Array.isArray(node)) node.forEach(walk);
    else if (typeof node === "object" && "children" in node) walk(node.children);
  };
  walk(json);
  return out.join(" ");
}

function healthProblems(): string[] {
  const problems: string[] = [];
  if (screen.queryByText(/Something went wrong/i)) problems.push("router error boundary");
  if (screen.queryByText(/Unmatched Route/i)) problems.push("unmatched route");
  return problems;
}

describe("every route renders on iOS", () => {
  it("boots into the Today tab, then every route draws its content", async () => {
    renderRouter("./app", { initialUrl: "/" });
    await waitFor(() => expect(screen.getByText(/Today's Journey/)).toBeTruthy(), {
      timeout: TIMEOUT,
    });
    for (const label of ["Today", "Calendar", "Chat", "Explore", "Journey"]) {
      expect(screen.getAllByText(label).length).toBeGreaterThan(0);
    }
    expect(healthProblems()).toEqual([]);

    const failures: string[] = [];
    for (const { path, anchor } of ROUTES) {
      await act(async () => {
        // Double assertion: with Expo's generated typed routes (local dev) a plain
        // string is not assignable to Href, but CI never generates .expo/types, so
        // there `path as never` trips no-unnecessary-type-assertion. Going through
        // `unknown` type-checks and lints identically in both environments.
        router.push(path as unknown as never);
      });
      try {
        await waitFor(() => expect(screen.getAllByText(anchor).length).toBeGreaterThan(0), {
          timeout: TIMEOUT,
        });
      } catch {
        failures.push(
          `${path}: anchor ${anchor} not found. Visible text: ${visibleText().slice(0, 300)}`,
        );
        continue;
      }
      const problems = healthProblems();
      if (problems.length) failures.push(`${path}: ${problems.join(", ")}`);
    }
    expect(failures).toEqual([]);
  }, 600_000);
});
