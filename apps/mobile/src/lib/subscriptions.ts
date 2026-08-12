import { useQuery } from "@tanstack/react-query";

import { useAuthState } from "./authState";
import {
  fetchSubscription,
  freeStatus,
  planLabel,
  type Plan,
  type SubscriptionStatus,
} from "./subscriptionState";

export type PurchaseOption = {
  plan: "annual" | "monthly" | "lifetime";
  title: string;
  price: string;
};

export { planLabel };
export type { Plan, SubscriptionStatus };

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

export async function configurePurchases(_userId?: string): Promise<void> {}

export async function getPurchaseOptions(): Promise<PurchaseOption[]> {
  return [];
}

export async function purchasePlan(_plan: "annual" | "monthly" | "lifetime"): Promise<void> {
  throw new Error(
    "In-app purchases require a native development build with RevenueCat configured.",
  );
}

export async function restorePurchases(): Promise<void> {
  throw new Error(
    "Purchase restoration requires a native development build with RevenueCat configured.",
  );
}

export async function resetPurchases(): Promise<void> {}
