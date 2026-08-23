const fs = require("node:fs");
const path = require("node:path");

const baseConfig = require("./app.json");
const plugins = [...(baseConfig.expo.plugins ?? [])];
const projectId = process.env.EXPO_PUBLIC_EAS_PROJECT_ID;
const isProductionBuild = process.env.EAS_BUILD_PROFILE === "production";

// Web preview and config evaluation should remain usable when native-only
// packages are unavailable in a restricted local environment. EAS/native
// builds get the full config after pnpm installs the declared dependency.
const notificationsPackage = path.join(__dirname, "node_modules", "expo-notifications");
const devClientPackage = path.join(__dirname, "node_modules", "expo-dev-client");
const purchasesPackage = path.join(__dirname, "node_modules", "react-native-purchases");
if (fs.existsSync(devClientPackage)) plugins.push("expo-dev-client");
if (fs.existsSync(notificationsPackage)) {
  plugins.push([
    "expo-notifications",
    {
      color: "#D97824",
      defaultChannel: "daily-reflections",
    },
  ]);
}

if (isProductionBuild) {
  const requiredPublicConfig = [
    "EXPO_PUBLIC_SUPABASE_URL",
    "EXPO_PUBLIC_SUPABASE_ANON_KEY",
    "EXPO_PUBLIC_EAS_PROJECT_ID",
    "EXPO_PUBLIC_REVENUECAT_API_KEY_IOS",
    "EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID",
    "EXPO_PUBLIC_SUPPORT_EMAIL",
    "EXPO_PUBLIC_PRIVACY_URL",
    "EXPO_PUBLIC_TERMS_URL",
  ];
  const missingConfig = requiredPublicConfig.filter((name) => !process.env[name]?.trim());
  if (missingConfig.length) {
    throw new Error(
      `Production mobile build is missing required public configuration: ${missingConfig.join(", ")}.`,
    );
  }
  const invalidConfig = [];
  if (!isHttpsUrl(process.env.EXPO_PUBLIC_SUPABASE_URL))
    invalidConfig.push("EXPO_PUBLIC_SUPABASE_URL");
  if (!isUuid(process.env.EXPO_PUBLIC_EAS_PROJECT_ID))
    invalidConfig.push("EXPO_PUBLIC_EAS_PROJECT_ID");
  if (!isEmail(process.env.EXPO_PUBLIC_SUPPORT_EMAIL))
    invalidConfig.push("EXPO_PUBLIC_SUPPORT_EMAIL");
  if (!isHttpsUrl(process.env.EXPO_PUBLIC_PRIVACY_URL))
    invalidConfig.push("EXPO_PUBLIC_PRIVACY_URL");
  if (!isHttpsUrl(process.env.EXPO_PUBLIC_TERMS_URL)) invalidConfig.push("EXPO_PUBLIC_TERMS_URL");
  if (invalidConfig.length) {
    throw new Error(
      `Production mobile build has invalid public configuration: ${invalidConfig.join(", ")}.`,
    );
  }
  const missingNativePackages = [
    !fs.existsSync(notificationsPackage) && "expo-notifications",
    !fs.existsSync(devClientPackage) && "expo-dev-client",
    !fs.existsSync(purchasesPackage) && "react-native-purchases",
  ].filter(Boolean);
  if (missingNativePackages.length) {
    throw new Error(
      `Production mobile build is missing installed native packages: ${missingNativePackages.join(", ")}. Run pnpm install with registry access first.`,
    );
  }
}

function isHttpsUrl(value) {
  try {
    const url = new URL(value ?? "");
    return url.protocol === "https:" && Boolean(url.hostname);
  } catch {
    return false;
  }
}

function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value ?? "",
  );
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value ?? "");
}

module.exports = {
  ...baseConfig.expo,
  plugins,
  ...(projectId
    ? {
        extra: {
          ...(baseConfig.expo.extra ?? {}),
          eas: { ...(baseConfig.expo.extra?.eas ?? {}), projectId },
        },
      }
    : {}),
};
