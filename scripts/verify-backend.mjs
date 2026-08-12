#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const sourceOnly = process.argv.includes("--source-only");

if (!sourceOnly) {
  run("scripts/verify-rag-backend.mjs");
} else {
  run("scripts/verify-rag-backend.mjs", ["--source-only"]);
}

run("scripts/verify-workspace-lock.mjs");
run("scripts/verify-release-contract.mjs");
run("scripts/verify-migration-security.mjs");
run("scripts/verify-database-contract.mjs");
run("scripts/verify-edge-functions-syntax.mjs");
run("scripts/verify-account-flow.mjs");
run("scripts/verify-tradition-retrieval.mjs", [], { nodeArgs: ["--experimental-transform-types"] });
run("scripts/verify-revenuecat-transfer.mjs", [], { nodeArgs: ["--experimental-transform-types"] });
run("scripts/verify-notification-flow.mjs", [], { nodeArgs: ["--experimental-transform-types"] });
run("scripts/verify-notification-worker.mjs", [], { nodeArgs: ["--experimental-transform-types"] });
run("scripts/verify-push-token-flow.mjs", [], { nodeArgs: ["--experimental-transform-types"] });
run("scripts/verify-admin-ops.mjs", [], { nodeArgs: ["--experimental-transform-types"] });
run("scripts/verify-admin-audit.mjs", [], { nodeArgs: ["--experimental-transform-types"] });
run("scripts/generate-authored-catalog-migration.mjs", ["--check"], {
  nodeArgs: ["--experimental-transform-types"],
});
run("scripts/verify-content-catalog.mjs");
run("scripts/verify-seed-content.mjs");
run("scripts/verify-source-trackers.mjs");

console.log(sourceOnly ? "Backend source verification passed." : "Backend verification passed.");

function run(script, scriptArgs = [], options = {}) {
  const result = spawnSync(process.execPath, [...(options.nodeArgs ?? []), script, ...scriptArgs], {
    cwd: root,
    stdio: "inherit",
    windowsHide: true,
  });
  if (result.error) {
    console.error(result.error.message);
    process.exit(1);
  }
  if (result.status !== 0) process.exit(result.status ?? 1);
}
