import { describe, expect, it } from "vitest";

import {
  resolveChallengeAudio,
  resolveShlokaAudio,
  unavailableAudioState,
  type AudioAsset,
} from "./audio";

const manifest: AudioAsset[] = [
  {
    key: "shloka/gayatri/clear",
    uri: "https://cdn.example.test/gayatri-clear.m4a",
    durationMs: 12_000,
    language: "sa",
    speed: "clear",
  },
  {
    key: "shloka/gayatri/slow",
    uri: "https://cdn.example.test/gayatri-slow.m4a",
    durationMs: 24_000,
    language: "sa",
    speed: "slow",
  },
  {
    key: "shloka/hanuman-chalisa-1/clear",
    uri: "https://cdn.example.test/hanuman-clear.m4a",
    durationMs: 9_000,
    language: "sa",
    speed: "clear",
  },
  {
    key: "challenge/navratri-2026/night-1-clear",
    uri: "https://cdn.example.test/night-1-clear.m4a",
    durationMs: 15_000,
    language: "sa",
    speed: "clear",
  },
  {
    key: "challenge/navratri-2026/night-1-slow",
    uri: "https://cdn.example.test/night-1-slow.m4a",
    durationMs: 30_000,
    language: "sa",
    speed: "slow",
  },
  { key: "bad", uri: "", durationMs: 0, language: "", speed: "clear" },
];

describe("resolveShlokaAudio", () => {
  it("returns the requested clear and slow entries", () => {
    expect(resolveShlokaAudio("GAYATRI", "clear", manifest)?.speed).toBe("clear");
    expect(resolveShlokaAudio("gayatri", "slow", manifest)?.speed).toBe("slow");
  });

  it("falls back from slow to a clear-only entry without relabelling it", () => {
    expect(resolveShlokaAudio("hanuman-chalisa-1", "slow", manifest)).toMatchObject({
      key: "shloka/hanuman-chalisa-1/clear",
      speed: "clear",
    });
  });

  it("rejects missing, unknown, and malformed rows", () => {
    expect(resolveShlokaAudio("missing", "clear", manifest)).toBeNull();
    expect(resolveShlokaAudio("", "clear", manifest)).toBeNull();
    expect(resolveShlokaAudio("bad", "clear", manifest)).toBeNull();
  });
});

describe("resolveChallengeAudio", () => {
  it("resolves challenge clear and slow keys through the same manifest contract", () => {
    expect(
      resolveChallengeAudio(
        "challenge/navratri-2026/night-1-clear",
        "challenge/navratri-2026/night-1-slow",
        "slow",
        manifest,
      )?.speed,
    ).toBe("slow");
  });

  it("reports an unavailable playback state when no approved asset exists", () => {
    expect(unavailableAudioState()).toEqual({ state: "unavailable", asset: null });
    expect(resolveChallengeAudio(null, null, "clear", manifest)).toBeNull();
  });
});
