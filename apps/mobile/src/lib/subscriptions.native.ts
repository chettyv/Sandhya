import { Platform } from "react-native";

import { paymentsEnabled } from "./payments";
import { supabase } from "./supabase";

export { planLabel, useSubscription } from "./subscriptionState";
export type { Plan, SubscriptionStatus } from "./subscriptionState";

// RevenueCat is the payment rail for the one-off challenge purchase, but it
// is ~900 KB of JS that must not be evaluated on every cold start of a free
// app. Load it the first time a purchase surface actually needs it; until
// then the SDK does not exist as far as startup is concerned.
const loadPurchases = () => import("react-native-purchases").then((module) => module.default);

let configuredUserId: string | undefined;

export async function configurePurchases(userId?: string): Promise<void> {
  if (!paymentsEnabled) return;
  const apiKey =
    Platform.OS === "ios"
      ? process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_IOS
      : process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID;
  if (!apiKey || !userId) return;
  try {
    if (configuredUserId && configuredUserId !== userId) await (await loadPurchases()).logOut();
    if (configuredUserId === userId) return;
    (await loadPurchases()).configure({ apiKey, appUserID: `supabase:${userId}` });
    configuredUserId = userId;
  } catch {
    // Expo Go has no purchases native module; configuration failing must
    // degrade to the unavailable-purchases state, never crash startup.
    configuredUserId = undefined;
  }
}

export async function restorePurchases(): Promise<void> {
  await ensureConfigured();
  if (!configuredUserId)
    throw new Error(
      "Store purchases are not configured for this build. Please try again after store setup is complete.",
    );
  await (await loadPurchases()).restorePurchases();
}

// One-off challenge products are named sandhya_challenge_<slug-with-underscores>;
// the webhook grants challenge participation when the purchase event lands.
export async function purchaseChallenge(
  slug: string,
): Promise<"purchased" | "cancelled" | "unavailable"> {
  await ensureConfigured();
  if (!configuredUserId) return "unavailable";
  const productId = `sandhya_challenge_${slug.replaceAll("-", "_")}`;
  const [product] = await (
    await loadPurchases()
  ).getProducts([productId], (await loadPurchases()).PRODUCT_CATEGORY.NON_SUBSCRIPTION);
  if (!product) return "unavailable";
  try {
    await (await loadPurchases()).purchaseStoreProduct(product);
    return "purchased";
  } catch (error) {
    if ((error as { userCancelled?: boolean }).userCancelled) return "cancelled";
    throw error;
  }
}

export async function resetPurchases(): Promise<void> {
  if (configuredUserId) await (await loadPurchases()).logOut();
  configuredUserId = undefined;
}

async function ensureConfigured(): Promise<void> {
  if (configuredUserId || !supabase) return;
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  await configurePurchases(data.session?.user.id);
}
