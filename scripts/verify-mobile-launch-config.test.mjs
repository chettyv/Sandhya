import { strict as assert } from "node:assert";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

import { verifyMobileLaunchConfig } from "./verify-mobile-launch-config.mjs";

const scriptPath = fileURLToPath(new URL("./verify-mobile-launch-config.mjs", import.meta.url));
const publicConfigNames = [
  "EXPO_PUBLIC_SUPABASE_URL",
  "EXPO_PUBLIC_SUPABASE_ANON_KEY",
  "EXPO_PUBLIC_EAS_PROJECT_ID",
  "EXPO_PUBLIC_REVENUECAT_API_KEY_IOS",
  "EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID",
  "EXPO_PUBLIC_SUPPORT_EMAIL",
  "EXPO_PUBLIC_PRIVACY_URL",
  "EXPO_PUBLIC_TERMS_URL",
];

const validProductionEnv = {
  EXPO_PUBLIC_SUPABASE_URL: "https://sandhya-prod.supabase.co",
  EXPO_PUBLIC_SUPABASE_ANON_KEY:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSJ9.signature",
  EXPO_PUBLIC_EAS_PROJECT_ID: "123e4567-e89b-42d3-a456-426614174000",
  EXPO_PUBLIC_REVENUECAT_API_KEY_IOS: "appl_sandhya_public_ios",
  EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID: "goog_sandhya_public_android",
  EXPO_PUBLIC_SUPPORT_EMAIL: "support@sandhya.app",
  EXPO_PUBLIC_PRIVACY_URL: "https://sandhya.app/privacy",
  EXPO_PUBLIC_TERMS_URL: "https://sandhya.app/terms",
};

test("development accepts documented placeholders for offline work", () => {
  const result = verifyMobileLaunchConfig(
    {
      EXPO_PUBLIC_SUPABASE_URL: "https://YOUR_PROJECT_REF.supabase.co",
      EXPO_PUBLIC_SUPABASE_ANON_KEY: "your-anon-key",
      EXPO_PUBLIC_EAS_PROJECT_ID: "your-eas-project-id",
      EXPO_PUBLIC_REVENUECAT_API_KEY_IOS: "your-public-ios-sdk-key",
      EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID: "your-public-android-sdk-key",
    },
    "development",
  );

  assert.deepEqual(result, {
    ok: true,
    missing: publicConfigNames,
    invalid: [],
  });
});

test("preview reports omitted public values without blocking the offline core", () => {
  const result = verifyMobileLaunchConfig({}, "preview");

  assert.equal(result.ok, true);
  assert.deepEqual(result.missing, publicConfigNames);
  assert.deepEqual(result.invalid, []);
});

test("production rejects missing public launch configuration", () => {
  const result = verifyMobileLaunchConfig({}, "production");

  assert.equal(result.ok, false);
  assert.deepEqual(result.missing, publicConfigNames);
  assert.deepEqual(result.invalid, []);
});

test("production rejects malformed Supabase, EAS, RevenueCat, contact, and legal values", () => {
  const result = verifyMobileLaunchConfig(
    {
      EXPO_PUBLIC_SUPABASE_URL: "http://supabase.invalid",
      EXPO_PUBLIC_SUPABASE_ANON_KEY: "not-a-jwt",
      EXPO_PUBLIC_EAS_PROJECT_ID: "not-a-uuid",
      EXPO_PUBLIC_REVENUECAT_API_KEY_IOS: "ios-key",
      EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID: "android-key",
      EXPO_PUBLIC_SUPPORT_EMAIL: "support-at-sandhya",
      EXPO_PUBLIC_PRIVACY_URL: "http://sandhya.app/privacy",
      EXPO_PUBLIC_TERMS_URL: "not-a-url",
    },
    "production",
  );

  assert.equal(result.ok, false);
  assert.deepEqual(result.missing, []);
  assert.deepEqual(result.invalid, publicConfigNames);
});

test("production accepts complete public configuration", () => {
  assert.deepEqual(verifyMobileLaunchConfig(validProductionEnv, "production"), {
    ok: true,
    missing: [],
    invalid: [],
  });
});

test("CLI exits nonzero for an invalid selected production profile without printing values", () => {
  const secretMarker = "never-print-this-support-value";
  const result = spawnSync(process.execPath, [scriptPath, "--profile", "production"], {
    encoding: "utf8",
    env: {
      EAS_BUILD_PROFILE: "production",
      EXPO_PUBLIC_SUPPORT_EMAIL: secretMarker,
    },
  });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /EXPO_PUBLIC_SUPABASE_URL/);
  assert.match(result.stderr, /EXPO_PUBLIC_SUPPORT_EMAIL/);
  assert.doesNotMatch(result.stderr, new RegExp(secretMarker));
  assert.doesNotMatch(result.stdout, new RegExp(secretMarker));
});

test("CLI accepts development placeholders", () => {
  const result = spawnSync(process.execPath, [scriptPath, "--profile=development"], {
    encoding: "utf8",
    env: {
      EAS_BUILD_PROFILE: "development",
      EXPO_PUBLIC_SUPABASE_URL: "https://YOUR_PROJECT_REF.supabase.co",
      EXPO_PUBLIC_SUPABASE_ANON_KEY: "your-anon-key",
    },
  });

  assert.equal(result.status, 0, result.stderr);
});
