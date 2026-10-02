import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("./verify-account-flow.mjs", import.meta.url), "utf8");

test("account-flow invariant uses neutral saved-answer copy", () => {
  assert.match(source, /Saved grounded answer/);
  assert.doesNotMatch(source, /Saved Ask Dharma answer/);
});

test("account-flow invariant allows saved-message queries only when Ask is available", () => {
  assert.match(source, /enabled: askAvailable && authState === "signed_in"/);
});
