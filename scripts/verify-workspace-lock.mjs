#!/usr/bin/env node
import { readFileSync } from "node:fs";

const root = new URL("..", import.meta.url);
const lockfile = readFileSync(new URL("pnpm-lock.yaml", root), "utf8");
const workspacePackages = [
  "apps/admin",
  "apps/mobile",
  "packages/content-tools",
  "packages/rag-pipeline",
  "packages/shared-types",
];
const missingByPackage = [];

for (const packagePath of workspacePackages) {
  const packageJson = JSON.parse(
    readFileSync(new URL(`${packagePath}/package.json`, root), "utf8"),
  );
  const importer = readImporter(lockfile, packagePath);
  const declared = [
    ...Object.keys(packageJson.dependencies ?? {}),
    ...Object.keys(packageJson.devDependencies ?? {}),
  ];
  const missing = declared.filter((name) => !hasImporterDependency(importer, name));
  if (missing.length > 0) missingByPackage.push({ packagePath, missing });
}

if (missingByPackage.length > 0) {
  for (const { packagePath, missing } of missingByPackage) {
    console.error(
      `pnpm-lock.yaml is missing ${packagePath} importer entries for: ${missing.join(", ")}.`,
    );
  }
  console.error(
    "Run pnpm install with registry access to regenerate the lockfile; do not hand-edit it.",
  );
  process.exit(1);
}

console.log("Workspace lockfile covers every declared workspace dependency.");

function readImporter(value, name) {
  const start = value.indexOf(`  ${name}:`);
  if (start < 0) return "";
  const remainder = value.slice(start + 1);
  const nextImporter = remainder.search(/\n {2}\S/);
  return value.slice(start, nextImporter < 0 ? value.length : start + 1 + nextImporter);
}

function hasImporterDependency(importerText, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`^\\s{6}(?:['"]${escaped}['"]|${escaped}):\\s*$`, "m").test(importerText);
}
