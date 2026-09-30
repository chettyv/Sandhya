#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = new Set(process.argv.slice(2));
const allowToolchainMismatch = args.has("--allow-toolchain-mismatch");
const expectedNodeMajor = 22;
const expectedPnpmVersion = readExpectedPnpmVersion();
const results = [];

export function parseMajorVersion(value) {
  const match = String(value ?? "").match(/(?:^v)?(\d+)(?:\.|$)/);
  return match ? Number(match[1]) : null;
}

export function evaluateRuntimeManifest(manifest) {
  const entries = Array.isArray(manifest?.entries) ? manifest.entries : [];
  const readyEntries = entries.filter((entry) => entry?.recommendation === "ready");
  const unsafeReady = readyEntries
    .filter(
      (entry) =>
        entry.generated !== true ||
        entry.bundled !== true ||
        (entry.pendingMarkers?.length ?? 0) > 0 ||
        entry.audioStatus?.status !== "recorded" ||
        entry.sourceStatus?.status !== "clear",
    )
    .map((entry) => String(entry.slug ?? "<missing-slug>"));

  return {
    ok: unsafeReady.length === 0,
    total: entries.length,
    ready: readyEntries.length,
    unsafeReady,
  };
}

function readExpectedPnpmVersion() {
  const packageJson = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));
  const match = String(packageJson.packageManager ?? "").match(/^pnpm@(.+)$/);
  return match?.[1] ?? "11.0.8";
}

function runCommand(label, command, commandArgs, options = {}) {
  const startedAt = Date.now();
  const result = spawnSync(command, commandArgs, {
    cwd: ROOT,
    env: process.env,
    encoding: "utf8",
    maxBuffer: 12 * 1024 * 1024,
    timeout: options.timeoutMs ?? 15 * 60 * 1000,
    windowsHide: true,
    shell: options.shell ?? isWindowsCommandScript(command),
    stdio: ["ignore", "pipe", "pipe"],
  });
  const durationSeconds = ((Date.now() - startedAt) / 1000).toFixed(1);
  const passed = result.status === 0 && !result.error;
  const detail =
    result.error?.code === "ETIMEDOUT" ? "timed out" : `exit ${result.status ?? "unknown"}`;

  results.push({ label, passed, detail, durationSeconds });
  return passed;
}

function nodeCommand(label, script, scriptArgs = []) {
  return [label, process.execPath, [script, ...scriptArgs]];
}

function pnpmCommand(label, pnpmArgs) {
  const invocation = pnpmInvocation(pnpmArgs);
  return [label, invocation.command, invocation.args, invocation.options];
}

function pnpmInvocation(pnpmArgs) {
  if (process.platform !== "win32") {
    return { command: "pnpm", args: pnpmArgs, options: { shell: false } };
  }

  const pathValue = process.env.Path ?? process.env.PATH ?? "";
  for (const directory of pathValue.split(";")) {
    if (!directory) continue;
    const candidate = join(directory, "pnpm.cmd");
    if (!existsSync(candidate)) continue;
    const pnpmModule = resolve(
      directory,
      "..",
      "..",
      "node",
      "node_modules",
      "pnpm",
      "bin",
      "pnpm.mjs",
    );
    if (existsSync(pnpmModule)) {
      return {
        command: process.execPath,
        args: [pnpmModule, ...pnpmArgs],
        options: { shell: false },
      };
    }
    return { command: candidate, args: pnpmArgs, options: { shell: true } };
  }

  return { command: "pnpm.cmd", args: pnpmArgs, options: { shell: true } };
}

function isWindowsCommandScript(command) {
  return process.platform === "win32" && /\.cmd$/i.test(command);
}

function record(label, passed, detail) {
  results.push({ label, passed, detail, durationSeconds: null });
}

function loadRuntimeManifest() {
  const manifestPath = join(ROOT, "docs", "content", "runtime-content-manifest.json");
  if (!existsSync(manifestPath)) throw new Error("runtime content manifest is missing");
  return JSON.parse(readFileSync(manifestPath, "utf8"));
}

function printReport({ nodeVersion, pnpmVersion, failures }) {
  console.log("Technical launch verifier (source-safe mode)");
  console.log(`Node: ${nodeVersion} (expected major ${expectedNodeMajor})`);
  console.log(`pnpm: ${pnpmVersion} (expected ${expectedPnpmVersion})`);
  console.log("");
  for (const result of results) {
    const status = result.passed ? "PASS" : "FAIL";
    const duration = result.durationSeconds === null ? "" : ` (${result.durationSeconds}s)`;
    console.log(`[${status}] ${result.label}: ${result.detail}${duration}`);
  }
  console.log("");
  console.log("Not executed by this source-safe verifier:");
  for (const gate of EXTERNAL_GATES) console.log(`- PENDING: ${gate}`);
  if (failures.length) {
    console.log("");
    console.log("Launch verifier result: BLOCKED");
    console.log(`Blocking checks: ${failures.join("; ")}`);
  } else {
    console.log("");
    console.log(
      "Launch verifier result: source-safe checks passed; external/device gates remain pending.",
    );
  }
}

const EXTERNAL_GATES = [
  "Signed iOS and Android development/preview/production builds from a clean checkout.",
  "Physical iOS and Android matrix: cold/warm launch, offline/retry, auth, account switching, deep links, notifications, keyboard, Dynamic Type, VoiceOver/TalkBack, Reduce Motion, audio, and tablets.",
  "Five cold launches, five warm reopens, cached Today, and first-navigation timing evidence per representative device.",
  "Live account-delete, notification, and other backend smokes; billing/RAG smokes only for an explicitly enabled finite challenge.",
  "Crash/error telemetry, support, rollback, content-correction, rights/legal, and store-review owners with evidence.",
];

function main() {
  const nodeVersion = process.version;
  const nodeMajor = parseMajorVersion(nodeVersion);
  const pnpmProbeInvocation = pnpmInvocation(["--version"]);
  const pnpmProbe = spawnSync(pnpmProbeInvocation.command, pnpmProbeInvocation.args, {
    cwd: ROOT,
    env: process.env,
    encoding: "utf8",
    windowsHide: true,
    shell: pnpmProbeInvocation.options.shell,
    stdio: ["ignore", "pipe", "pipe"],
  });
  const pnpmVersion = (pnpmProbe.stdout ?? "").trim() || "unavailable";
  const toolchainMatches = nodeMajor === expectedNodeMajor && pnpmVersion === expectedPnpmVersion;

  if (!toolchainMatches && !allowToolchainMismatch) {
    record(
      "pinned toolchain",
      false,
      "unsupported runtime; rerun with Node 22.x and the pinned pnpm version",
    );
    printReport({ nodeVersion, pnpmVersion, failures: ["pinned toolchain"] });
    process.exitCode = 1;
    return;
  }

  record(
    "pinned toolchain",
    toolchainMatches,
    toolchainMatches ? "Node and pnpm match the release contract" : "diagnostic override enabled",
  );

  const failures = [];
  if (!toolchainMatches) failures.push("pinned toolchain");

  const commands = [
    pnpmCommand("clean frozen install", ["install", "--frozen-lockfile", "--reporter=append-only"]),
    nodeCommand("workspace lockfile", "scripts/verify-workspace-lock.mjs"),
    pnpmCommand("content tools build", ["--filter", "@sandhya/content-tools", "build"]),
    nodeCommand("generated shloka bank", "scripts/generate-shloka-bank.mjs", ["--check"]),
    pnpmCommand("content validation", ["content:validate"]),
    nodeCommand("runtime content manifest", "scripts/verify-runtime-content.mjs", ["--check"]),
    nodeCommand("translation manifest build", "scripts/build-translation-manifest.mjs", [
      "--check",
    ]),
    nodeCommand("translation manifest verification", "scripts/verify-translation-manifest.mjs", [
      "--check",
    ]),
    nodeCommand("script contract tests", "--test", [
      "scripts/verify-mobile-launch-config.test.mjs",
      "scripts/verify-runtime-content.test.mjs",
      "scripts/translation-manifest.test.mjs",
      "scripts/verify-account-flow.test.mjs",
      "scripts/verify-technical-launch.test.mjs",
    ]),
    pnpmCommand("format check", ["format:check"]),
    pnpmCommand("root typecheck", ["typecheck"]),
    pnpmCommand("mobile lint", ["--filter", "@sandhya/mobile", "lint"]),
    pnpmCommand("mobile tests", ["--filter", "@sandhya/mobile", "test"]),
    pnpmCommand("mobile route smoke", ["--filter", "@sandhya/mobile", "test:smoke"]),
    pnpmCommand("mobile web export", ["--filter", "@sandhya/mobile", "build"]),
    pnpmCommand("workspace tests", ["test"]),
    pnpmCommand("workspace build", ["build"]),
    pnpmCommand("backend source checks", ["backend:source-check"]),
    pnpmCommand("backend checks", ["backend:check"]),
    pnpmCommand("release contract", ["backend:release-contract"]),
    pnpmCommand("secret scan", ["secrets:scan"]),
  ];

  for (const [label, command, commandArgs] of commands) {
    if (!runCommand(label, command, commandArgs)) failures.push(label);
  }

  try {
    const manifestResult = evaluateRuntimeManifest(loadRuntimeManifest());
    const detail = `${manifestResult.total} entries; ${manifestResult.ready} marked ready`;
    record("runtime readiness safety", manifestResult.ok, detail);
    if (!manifestResult.ok) failures.push("runtime readiness safety");
  } catch (error) {
    record("runtime readiness safety", false, "manifest could not be evaluated");
    failures.push(
      `runtime readiness safety: ${error instanceof Error ? error.message : "unknown error"}`,
    );
  }

  printReport({ nodeVersion, pnpmVersion, failures });
  process.exitCode = failures.length ? 1 : 0;
}

const currentFile = fileURLToPath(import.meta.url);
if (process.argv[1] && resolve(process.argv[1]) === resolve(currentFile)) main();
