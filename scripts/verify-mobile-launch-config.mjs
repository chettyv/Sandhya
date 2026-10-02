#!/usr/bin/env node

import path from "node:path";
import { fileURLToPath } from "node:url";

export const PUBLIC_MOBILE_CONFIG = [
  "EXPO_PUBLIC_SUPABASE_URL",
  "EXPO_PUBLIC_SUPABASE_ANON_KEY",
  "EXPO_PUBLIC_EAS_PROJECT_ID",
  "EXPO_PUBLIC_REVENUECAT_API_KEY_IOS",
  "EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID",
  "EXPO_PUBLIC_SUPPORT_EMAIL",
  "EXPO_PUBLIC_PRIVACY_URL",
  "EXPO_PUBLIC_TERMS_URL",
];

const SUPABASE_ANON_ROLE = "anon";

const SUPABASE_URL = "EXPO_PUBLIC_SUPABASE_URL";
const SUPABASE_ANON_KEY = "EXPO_PUBLIC_SUPABASE_ANON_KEY";
const EAS_PROJECT_ID = "EXPO_PUBLIC_EAS_PROJECT_ID";
const REVENUECAT_IOS_KEY = "EXPO_PUBLIC_REVENUECAT_API_KEY_IOS";
const REVENUECAT_ANDROID_KEY = "EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID";
const SUPPORT_EMAIL = "EXPO_PUBLIC_SUPPORT_EMAIL";
const PRIVACY_URL = "EXPO_PUBLIC_PRIVACY_URL";
const TERMS_URL = "EXPO_PUBLIC_TERMS_URL";
const VALID_PROFILES = new Set(["development", "preview", "production"]);

/**
 * Validate public mobile configuration without reading or mutating process.env.
 * Development and preview may intentionally use the bundled/offline fallback;
 * production is the strict release-candidate gate.
 *
 * @param {Record<string, string | undefined>} env
 * @param {string} profile
 * @returns {{ ok: boolean, missing: string[], invalid: string[] }}
 */
export function verifyMobileLaunchConfig(env = {}, profile = "development") {
  if (!VALID_PROFILES.has(profile)) {
    return { ok: false, missing: [], invalid: ["profile"] };
  }

  const missing = [];
  const invalid = [];

  for (const name of PUBLIC_MOBILE_CONFIG) {
    const value = env[name];
    if (isMissingOrPlaceholder(value)) {
      missing.push(name);
      continue;
    }

    if (!isValidPublicValue(name, value)) invalid.push(name);
  }

  const ok =
    profile !== "production" ? invalid.length === 0 : missing.length === 0 && invalid.length === 0;
  return { ok, missing, invalid };
}

function isMissingOrPlaceholder(value) {
  const normalized = typeof value === "string" ? value.trim() : "";
  return (
    !normalized ||
    /(?:your[_-]|YOUR[_-]|<[^>]+>|\bTODO\b|\bCHANGEME\b|\bCHANGE_ME\b)/i.test(normalized)
  );
}

function isValidPublicValue(name, value) {
  switch (name) {
    case SUPABASE_URL:
    case PRIVACY_URL:
    case TERMS_URL:
      return isHttpsUrl(value);
    case SUPABASE_ANON_KEY:
      return isSupabaseAnonKey(value);
    case EAS_PROJECT_ID:
      return isUuid(value);
    case REVENUECAT_IOS_KEY:
      return isRevenueCatKey(value, "appl_");
    case REVENUECAT_ANDROID_KEY:
      return isRevenueCatKey(value, "goog_");
    case SUPPORT_EMAIL:
      return isEmail(value);
    default:
      return false;
  }
}

function isHttpsUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && Boolean(url.hostname) && !url.username && !url.password;
  } catch {
    return false;
  }
}

function isSupabaseAnonKey(value) {
  if (/^sb_publishable_[A-Za-z0-9_-]+$/.test(value)) return true;
  if (!/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(value)) return false;

  try {
    const payload = JSON.parse(Buffer.from(value.split(".")[1], "base64url").toString("utf8"));
    return payload && payload.role === SUPABASE_ANON_ROLE;
  } catch {
    return false;
  }
}

function isRevenueCatKey(value, prefix) {
  return value.startsWith(prefix) && value.length > prefix.length;
}

function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

export function resolveEasProjectId(configuredProjectId, environmentProjectId) {
  const configured = normalizeProjectId(configuredProjectId);
  const environment = normalizeProjectId(environmentProjectId);
  if (!environment) return configured;
  if (configured && environment !== configured) {
    throw new Error("EXPO_PUBLIC_EAS_PROJECT_ID does not match the configured EAS project ID.");
  }
  return environment;
}

function normalizeProjectId(value) {
  const normalized = typeof value === "string" ? value.trim() : "";
  return isMissingOrPlaceholder(normalized) ? undefined : normalized;
}

function selectedProfile(args, env) {
  const profileFlag = args.indexOf("--profile");
  if (profileFlag >= 0) return args[profileFlag + 1] ?? "";
  const inlineFlag = args.find((arg) => arg.startsWith("--profile="));
  if (inlineFlag) return inlineFlag.slice("--profile=".length);
  return env.EAS_BUILD_PROFILE ?? "development";
}

function runCli() {
  const profile = selectedProfile(process.argv.slice(2), process.env);
  const result = verifyMobileLaunchConfig(process.env, profile);

  if (!result.ok) {
    const problems = [
      ...(result.missing.length ? [`missing: ${result.missing.join(", ")}`] : []),
      ...(result.invalid.length ? [`invalid: ${result.invalid.join(", ")}`] : []),
    ];
    console.error(`Mobile launch configuration failed for ${profile}: ${problems.join("; ")}`);
    process.exitCode = 1;
    return;
  }

  console.log(`Mobile launch configuration passed for ${profile}.`);
  if (result.missing.length) {
    console.warn(`Optional public values not configured: ${result.missing.join(", ")}`);
  }
}

const currentFile = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(currentFile)) runCli();
