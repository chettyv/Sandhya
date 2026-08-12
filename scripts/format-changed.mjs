#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const base = process.env.FORMAT_BASE_SHA ?? process.argv[2];
const head = process.env.FORMAT_HEAD_SHA ?? process.argv[3] ?? "HEAD";
const supported = /\.(cjs|js|jsx|mjs|json|md|ts|tsx|yaml|yml)$/i;

if (!base || /^0+$/.test(base)) {
  console.log("No comparable base commit was supplied; skipping changed-file format check.");
  process.exit(0);
}

const diff = spawnSync("git", ["diff", "--name-only", "--diff-filter=ACMRT", base, head], {
  cwd: root,
  encoding: "utf8",
});
if (diff.status !== 0) {
  console.error(diff.stderr || "Unable to determine changed files for format check.");
  process.exit(diff.status ?? 1);
}

const files = diff.stdout
  .split(/\r?\n/)
  .map((file) => file.trim())
  .filter((file) => file && supported.test(file));
if (!files.length) {
  console.log("No changed formatter-supported files.");
  process.exit(0);
}

const prettier = join(
  root,
  "node_modules",
  ".bin",
  process.platform === "win32" ? "prettier.cmd" : "prettier",
);
if (!existsSync(prettier)) {
  console.error("Missing Prettier. Run pnpm install first.");
  process.exit(1);
}
const result = spawnSync(prettier, ["--check", ...files], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
});
process.exit(result.status ?? 1);
