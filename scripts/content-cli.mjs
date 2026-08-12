#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const rawArgs = process.argv.slice(2);
const command = rawArgs.shift() ?? "help";
const input = rawArgs[0]?.startsWith("--") ? "content" : (rawArgs.shift() ?? "content");
const args = rawArgs;

if (command === "validate" || command === "stats") {
  const cli = join(root, "packages", "content-tools", "dist", "cli.js");
  if (!existsSync(cli)) {
    console.error(`Missing ${cli}. Run pnpm --filter @sandhya/content-tools build first.`);
    process.exit(1);
  }
  runNode(cli, [command, resolve(root, input), ...args]);
} else if (command === "ingest" || command === "reembed") {
  if (input !== "content" && input !== "content/_staging/raw") {
    console.error("The ingest worker currently consumes content/_staging/raw after rights review.");
    process.exit(1);
  }
  const dryRun = args.includes("--dry-run");
  const scripts = dryRun
    ? [["rag:prepare"], ["rag:audit"], ["rag:ingest:dry-run"]]
    : command === "reembed"
      ? [["rag:prepare"], ["rag:audit"], ["rag:ingest", "--", "--force-reembed"]]
      : [["content:ingest"]];
  for (const script of scripts) runPnpm(...script);
} else {
  console.info("Usage: pnpm content validate <canonical-content-folder>");
  console.info("       pnpm content stats <canonical-content-folder>");
  console.info("       pnpm content ingest [content/_staging/raw] [--dry-run]");
  console.info("       pnpm content reembed [content/_staging/raw]");
  process.exit(command === "help" ? 0 : 1);
}

function runNode(entry, args) {
  const result = spawnSync(process.execPath, [entry, ...args], { cwd: root, stdio: "inherit" });
  if (result.error) throw result.error;
  process.exit(result.status ?? 1);
}

function runPnpm(script, ...args) {
  const result = spawnSync("pnpm", [script, ...args], {
    cwd: root,
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
