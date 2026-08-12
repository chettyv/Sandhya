#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const [command = "help", ...args] = process.argv.slice(2);

if (command === "ask") {
  runNode(join(root, "packages", "rag-pipeline", "dist", "cli.js"), args);
} else if (command === "eval") {
  runNode(join(root, "packages", "rag-pipeline", "dist", "evaluate.js"), args);
} else {
  console.info('Usage: pnpm rag ask "What is dharma?"');
  console.info("       pnpm rag eval <eval-file> --out <report.json>");
  process.exit(command === "help" ? 0 : 1);
}

function runNode(entry, args) {
  if (!existsSync(entry)) {
    console.error(`Missing ${entry}. Run pnpm --filter @sandhya/rag-pipeline build first.`);
    process.exit(1);
  }
  const result = spawnSync(process.execPath, [entry, ...args], { cwd: root, stdio: "inherit" });
  if (result.error) throw result.error;
  process.exit(result.status ?? 1);
}
