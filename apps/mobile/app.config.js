const fs = require("node:fs");
const path = require("node:path");

const { verifyMobileLaunchConfig } = require("../../scripts/verify-mobile-launch-config.mjs");

const baseConfig = require("./app.json");
const plugins = [...(baseConfig.expo.plugins ?? [])];
const projectId = process.env.EXPO_PUBLIC_EAS_PROJECT_ID?.trim() || undefined;
const buildProfile = process.env.EAS_BUILD_PROFILE ?? "development";
const isProductionBuild = process.env.EAS_BUILD_PROFILE === "production";

// The verifier is the source of truth for these names; keep the public contract
// visible here for the static release checks that inspect app configuration.
// EXPO_PUBLIC_SUPABASE_URL EXPO_PUBLIC_SUPABASE_ANON_KEY EXPO_PUBLIC_EAS_PROJECT_ID
// EXPO_PUBLIC_REVENUECAT_API_KEY_IOS EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID
// EXPO_PUBLIC_SUPPORT_EMAIL EXPO_PUBLIC_PRIVACY_URL EXPO_PUBLIC_TERMS_URL

const launchConfig = verifyMobileLaunchConfig(process.env, buildProfile);
if (!launchConfig.ok) {
  const problems = [
    ...(launchConfig.missing.length ? [`missing: ${launchConfig.missing.join(", ")}`] : []),
    ...(launchConfig.invalid.length ? [`invalid: ${launchConfig.invalid.join(", ")}`] : []),
  ];
  throw new Error(`Mobile launch configuration failed for ${buildProfile}: ${problems.join("; ")}`);
}

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
