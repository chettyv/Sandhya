export type LaunchProfile = "core" | "full";
export type LaunchFeature = "ask" | "payments" | "challenge";

/**
 * This is a build-time visibility switch, not an authorization boundary.
 * Provider credentials and quotas remain server-side. A full profile is only
 * visible when the release owner has explicitly recorded backend readiness in
 * the non-secret public build configuration.
 */
export function getLaunchProfile(env: Record<string, string | undefined>): LaunchProfile {
  const requested = env.EXPO_PUBLIC_LAUNCH_PROFILE?.trim().toLowerCase();
  if (requested !== "full") return "core";
  return isTrue(env.EXPO_PUBLIC_AI_READY) ? "full" : "core";
}

export function isFeatureAvailable(
  feature: LaunchFeature,
  env: Record<string, string | undefined> = process.env,
): boolean {
  const profile = getLaunchProfile(env);
  const paymentsEnabled = isTrue(env.EXPO_PUBLIC_PAYMENTS_ENABLED);
  if (profile === "core") return false;
  if (feature === "ask") return true;
  return paymentsEnabled;
}

export const launchProfile = getLaunchProfile(process.env);

function isTrue(value: string | undefined): boolean {
  return value?.trim().toLowerCase() === "true";
}
