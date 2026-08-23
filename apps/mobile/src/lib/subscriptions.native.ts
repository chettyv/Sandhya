import { useQuery } from "@tanstack/react-query";
import { Platform } from "react-native";
import type { PurchasesPackage } from "react-native-purchases";

import { useAuthState } from "./authState";
import {
  fetchSubscription,
  freeStatus,
  planLabel,
  type Plan,
  type SubscriptionStatus,
} from "./subscriptionState";
import { supabase } from "./supabase";

export type PurchaseOption = {
  plan: "annual" | "monthly" | "lifetime";
  title: string;
  price: string;
};
export { planLabel };
export type { Plan, SubscriptionStatus };

// RevenueCat is the payment rail for the one-off challenge purchase, but it
// is ~900 KB of JS that must not be evaluated on every cold start of a free
// app. Load it the first time a purchase surface actually needs it; until
// then the SDK does not exist as far as startup is concerned.
const loadPurchases = () => import("react-native-purchases").then((module) => module.default);

let configuredUserId: string | undefined;
let packagesByPlan: Partial<Record<"annual" | "monthly" | "lifetime", PurchasesPackage>> = {};

export function useSubscription() {
  const authState = useAuthState();
  const query = useQuery({
    queryKey: ["subscription-status"],
    queryFn: fetchSubscription,
    enabled: authState === "signed_in",
    staleTime: 60_000,
    refetchInterval: 30_000,
  });
  return {
    ...query,
    data: authState === "signed_in" ? (query.data ?? freeStatus) : freeStatus,
    isChecking:
      authState === "loading" || (authState === "signed_in" && query.isPending && query.isFetching),
  };
}

export async function configurePurchases(userId?: string): Promise<void> {
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

export async function getPurchaseOptions(): Promise<PurchaseOption[]> {
  await ensureConfigured();
  if (!configuredUserId) return [];
  const offerings = await (await loadPurchases()).getOfferings();
  const current = offerings.current;
  if (!current) return [];
  packagesByPlan = {
    annual: current.annual ?? undefined,
    monthly: current.monthly ?? undefined,
    lifetime: current.lifetime ?? undefined,
  };
  return [
    ...(current.annual
      ? [
          {
            plan: "annual" as const,
            title: "Plus annual",
            price: current.annual.product.priceString,
          },
        ]
      : []),
    ...(current.monthly
      ? [
          {
            plan: "monthly" as const,
            title: "Plus monthly",
            price: current.monthly.product.priceString,
          },
        ]
      : []),
    ...(current.lifetime
      ? [
          {
            plan: "lifetime" as const,
            title: "Plus lifetime",
            price: current.lifetime.product.priceString,
          },
        ]
      : []),
  ];
}

export async function purchasePlan(plan: "annual" | "monthly" | "lifetime"): Promise<void> {
  await ensureConfigured();
  const packageToPurchase = packagesByPlan[plan];
  if (!packageToPurchase)
    throw new Error("This plan is not available in the configured store offering.");
  await (await loadPurchases()).purchasePackage(packageToPurchase);
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
  packagesByPlan = {};
}

async function ensureConfigured(): Promise<void> {
  if (configuredUserId || !supabase) return;
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  await configurePurchases(data.session?.user.id);
}
