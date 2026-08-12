#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { readdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const functionsRoot = join(root, "supabase", "functions");
const files = collectTypeScriptFiles(functionsRoot).filter((file) => !file.endsWith(".d.ts"));
const failures = [];

for (const file of files) {
  const result = spawnSync(process.execPath, ["--experimental-transform-types", "--check", file], {
    cwd: root,
    encoding: "utf8",
    windowsHide: true,
  });
  if (result.status !== 0) {
    failures.push({ file, output: `${result.stdout ?? ""}\n${result.stderr ?? ""}`.trim() });
  }
}

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`Edge Function syntax failed: ${failure.file}`);
    if (failure.output) console.error(failure.output);
  }
  process.exit(1);
}

console.log(`Edge Function syntax passed for ${files.length} runtime TypeScript files.`);

function collectTypeScriptFiles(directory) {
  const result = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      result.push(...collectTypeScriptFiles(path));
    } else if (entry.isFile() && path.endsWith(".ts")) {
      result.push(path);
    }
  }
  return result.sort();
}
