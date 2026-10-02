import assert from "node:assert/strict";
import test from "node:test";

import { evaluateRuntimeManifest, parseMajorVersion } from "./verify-technical-launch.mjs";

test("parseMajorVersion returns the numeric major version", () => {
  assert.equal(parseMajorVersion("v22.20.0"), 22);
  assert.equal(parseMajorVersion("24.19.0"), 24);
  assert.equal(parseMajorVersion("unknown"), null);
});

test("runtime manifest evaluation rejects an unsafe ready entry", () => {
  const result = evaluateRuntimeManifest({
    entries: [
      {
        slug: "unsafe",
        generated: true,
        bundled: true,
        recommendation: "ready",
        pendingMarkers: [],
        audioStatus: { status: "missing" },
        sourceStatus: { status: "clear" },
      },
    ],
  });

  assert.equal(result.ok, false);
  assert.deepEqual(result.unsafeReady, ["unsafe"]);
});

test("runtime manifest evaluation accepts a safe ready entry", () => {
  const result = evaluateRuntimeManifest({
    entries: [
      {
        slug: "safe",
        generated: true,
        bundled: true,
        recommendation: "ready",
        pendingMarkers: [],
        audioStatus: { status: "recorded" },
        sourceStatus: { status: "clear" },
      },
    ],
  });

  assert.equal(result.ok, true);
  assert.deepEqual(result.unsafeReady, []);
});
