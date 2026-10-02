export { planLabel, useSubscription } from "./subscriptionState";
export type { Plan, SubscriptionStatus } from "./subscriptionState";

export async function configurePurchases(_userId?: string): Promise<void> {}

export async function restorePurchases(): Promise<void> {
  throw new Error("Purchase restoration is available in the iOS and Android app.");
}

export async function purchaseChallenge(
  _slug: string,
): Promise<"purchased" | "cancelled" | "unavailable"> {
  return "unavailable";
}

export async function resetPurchases(): Promise<void> {}
