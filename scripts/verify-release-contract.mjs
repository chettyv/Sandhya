#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const failures = [];

const requiredFunctions = [
  "ask",
  "account",
  "register-push-token",
  "revenuecat-webhook",
  "send-daily-reflections",
  "admin-feedback",
  "admin-content",
  "admin-ops",
];
const publicConfig = [
  "EXPO_PUBLIC_SUPABASE_URL",
  "EXPO_PUBLIC_SUPABASE_ANON_KEY",
  "EXPO_PUBLIC_EAS_PROJECT_ID",
  "EXPO_PUBLIC_REVENUECAT_API_KEY_IOS",
  "EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID",
  "EXPO_PUBLIC_SUPPORT_EMAIL",
  "EXPO_PUBLIC_PRIVACY_URL",
  "EXPO_PUBLIC_TERMS_URL",
];
const serverConfig = [
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "SUPABASE_ANON_KEY",
  "OPENAI_API_KEY",
  "REVENUECAT_WEBHOOK_SECRET",
  "REVENUECAT_API_KEY",
  "DAILY_REFLECTIONS_CRON_SECRET",
  "EXPO_ACCESS_TOKEN",
];

const configToml = read("supabase/config.toml");
const envExample = read(".env.example");
const ci = read(".github/workflows/ci.yml");
const releaseSmoke = read(".github/workflows/release-smoke.yml");
const billingSmoke = read("scripts/revenuecat-sandbox-live-smoke.mjs");
const notificationSmoke = read("scripts/notification-live-smoke.mjs");
const mobilePackage = parseJson("apps/mobile/package.json");
const eas = parseJson("apps/mobile/eas.json");
const appConfig = read("apps/mobile/app.config.js");
const mobileSupabase = read("apps/mobile/src/lib/supabase.ts");

for (const functionName of requiredFunctions) {
  const path = `supabase/functions/${functionName}/index.ts`;
  if (!exists(path)) fail(`Missing deployable Edge Function: ${path}`);
}

const functionSections = [...configToml.matchAll(/^\[functions\.([^\]]+)\]\r?$/gm)];
const jwtDisabled = functionSections
  .map((section, index) => ({
    name: section[1],
    body: configToml.slice(
      (section.index ?? 0) + section[0].length,
      functionSections[index + 1]?.index ?? configToml.length,
    ),
  }))
  .filter(({ body }) => /^\s*verify_jwt\s*=\s*false\s*$/m.test(body))
  .map(({ name }) => name);
const expectedJwtDisabled = new Set(["revenuecat-webhook", "send-daily-reflections"]);
if (
  jwtDisabled.length !== expectedJwtDisabled.size ||
  jwtDisabled.some((name) => !expectedJwtDisabled.has(name))
) {
  fail(
    `Only HMAC/cron functions may disable JWT verification; found: ${jwtDisabled.join(", ") || "none"}`,
  );
}

for (const name of [...publicConfig, ...serverConfig]) {
  if (!new RegExp(`^\\s*#?\\s*${escapeRegExp(name)}=`, "m").test(envExample)) {
    fail(`.env.example is missing configuration name: ${name}`);
  }
}

for (const name of publicConfig) {
  if (!appConfig.includes(name)) fail(`Production mobile config does not require ${name}.`);
}
for (const requiredAuthLifecycleSymbol of [
  'AppState.addEventListener("change"',
  "supabase.auth.startAutoRefresh()",
  "supabase.auth.stopAutoRefresh()",
]) {
  if (!mobileSupabase.includes(requiredAuthLifecycleSymbol)) {
    fail(
      `Mobile Supabase client is missing auth lifecycle handling: ${requiredAuthLifecycleSymbol}`,
    );
  }
}
for (const dependency of ["expo-dev-client", "expo-notifications", "react-native-purchases"]) {
  if (!mobilePackage.dependencies?.[dependency]) {
    fail(`Mobile package does not declare native dependency ${dependency}.`);
  }
}
for (const profile of ["development", "preview", "production"]) {
  if (!eas.build?.[profile]) fail(`EAS config is missing the ${profile} build profile.`);
}

for (const requiredGate of [
  "node scripts/verify-workspace-lock.mjs",
  "node scripts/verify-migration-security.mjs",
  "node scripts/verify-edge-functions-syntax.mjs",
  "node scripts/verify-database-contract.mjs",
  "pnpm install --frozen-lockfile",
  "pnpm content:validate",
  "node scripts/verify-scheduler-contract.mjs",
  "pnpm typecheck",
  "pnpm test",
]) {
  if (!ci.includes(requiredGate)) fail(`CI is missing required release gate: ${requiredGate}`);
}
const dependencyInstallIndex = ci.indexOf("- name: Install dependencies");
const contentValidationIndex = ci.indexOf("- name: Validate canonical content");
if (
  dependencyInstallIndex < 0 ||
  contentValidationIndex < 0 ||
  contentValidationIndex < dependencyInstallIndex
) {
  fail("CI must validate canonical content after dependency installation.");
}

for (const requiredSmokeContract of [
  "pnpm backend:smoke:live",
  "pnpm rag:smoke:live",
  "pnpm backend:billing-smoke:live",
  "pnpm backend:notifications-smoke:live",
  "ACCOUNT_DELETE_SMOKE_CONFIRM: DELETE_ACCOUNT_LIVE",
  "environment: production-account-delete",
  "REVENUECAT_SMOKE_CONFIRM: REVENUECAT_SANDBOX_LIVE",
  "environment: provider-sandbox-smoke",
  "run_notification_smoke",
  "environment: notification-provider-smoke",
  "NOTIFICATION_SMOKE_CONFIRM: NOTIFICATION_LIVE",
]) {
  if (!releaseSmoke.includes(requiredSmokeContract)) {
    fail(`Release smoke workflow is missing required contract: ${requiredSmokeContract}`);
  }
}

for (const requiredNotificationSmokeContract of [
  "NOTIFICATION_SMOKE_USER_ID",
  "NOTIFICATION_SMOKE_EXPO_PUSH_TOKEN",
  "notification_deliveries",
  "notification_push_tickets",
  "duplicate suppression",
  "send-daily-reflections",
]) {
  if (!notificationSmoke.includes(requiredNotificationSmokeContract)) {
    fail(
      `Notification live smoke is missing required contract: ${requiredNotificationSmokeContract}`,
    );
  }
}

for (const requiredBillingSmokeContract of [
  'environment: "SANDBOX"',
  "REVENUECAT_SMOKE_USER_ID",
  "REVENUECAT_SMOKE_TRANSFER_DESTINATION_USER_ID",
  "purchase, renewal, cancellation, billing issue, uncancellation, refund, stale ordering, expiration, and transfer",
  'type: "RENEWAL"',
  'type: "CANCELLATION"',
  'type: "BILLING_ISSUE"',
  'type: "UNCANCELLATION"',
  'type: "REFUND"',
  'type: "TRANSFER"',
  "transferred_from",
  "transferred_to",
  "TRANSFER revoked the source",
  'environment: "UNKNOWN"',
  "late provider delivery",
  "deleteBillingEvent",
]) {
  if (!billingSmoke.includes(requiredBillingSmokeContract)) {
    fail(`Billing sandbox smoke is missing required contract: ${requiredBillingSmokeContract}`);
  }
}

for (const browserOrMobileRoot of ["apps/mobile", "apps/admin"]) {
  const source = readTreeText(browserOrMobileRoot);
  if (source.includes("SUPABASE_SERVICE_ROLE_KEY")) {
    fail(`${browserOrMobileRoot} contains a service-role key reference.`);
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(
  `Release contract passed: ${requiredFunctions.length} Edge Functions, ${publicConfig.length} public vars, ${serverConfig.length} server vars.`,
);

function rootPath(relativePath) {
  return join(root, relativePath);
}

function exists(relativePath) {
  return existsSync(rootPath(relativePath));
}

function read(relativePath) {
  if (!exists(relativePath)) {
    fail(`Missing release contract file: ${relativePath}`);
    return "";
  }
  return readFileSync(rootPath(relativePath), "utf8");
}

function parseJson(relativePath) {
  try {
    return JSON.parse(read(relativePath));
  } catch {
    fail(`Invalid JSON in ${relativePath}.`);
    return {};
  }
}

function readTreeText(relativePath) {
  const result = [];
  const stack = [rootPath(relativePath)];
  while (stack.length) {
    const current = stack.pop();
    if (!current) continue;
    let entry;
    try {
      entry = statSync(current);
    } catch {
      continue;
    }
    if (entry.isDirectory()) {
      for (const child of readdirSync(current, { withFileTypes: true })) {
        stack.push(join(current, child.name));
      }
      continue;
    }
    if (/\.(ts|tsx|js|jsx|html|json|css)$/.test(current))
      result.push(readFileSync(current, "utf8"));
  }
  return result.join("\n");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function fail(message) {
  failures.push(`Release contract failed: ${message}`);
}
