import { useQuery } from "@tanstack/react-query";

import { useAuthState } from "./authState";
import { supabase } from "./supabase";

export type Plan = "free" | "plus_monthly" | "plus_annual" | "lifetime";
export type SubscriptionStatus = {
  plan: Plan;
  status: "active" | "billing_issue" | "cancelled" | "expired" | "refunded" | "free";
  expiresAt: string | null;
};

export const freeStatus: SubscriptionStatus = { plan: "free", status: "free", expiresAt: null };

export function useSubscription() {
  const authState = useAuthState();
  const query = useQuery({
    queryKey: ["subscription-status"],
    queryFn: fetchSubscription,
    enabled: authState === "signed_in",
    staleTime: 60_000,
  });
  return {
    ...query,
    data: authState === "signed_in" ? (query.data ?? freeStatus) : freeStatus,
    isChecking:
      authState === "loading" || (authState === "signed_in" && query.isPending && query.isFetching),
  };
}

export async function fetchSubscription(): Promise<SubscriptionStatus> {
  if (!supabase) return freeStatus;
  const { data, error } = await supabase
    .from("subscription_status")
    .select("plan,status,expires_at")
    .maybeSingle();
  if (error || !data) return freeStatus;
  const row = data as unknown as { plan?: unknown; status?: unknown; expires_at?: unknown };
  const plan = isPlan(row.plan) ? row.plan : "free";
  const status = isStatus(row.status) ? row.status : "free";
  const expiresAt = typeof row.expires_at === "string" ? row.expires_at : null;
  if (plan !== "free") {
    // Keep the client aligned with the server-side entitlement decision used
    // by premium RLS and AI quota enforcement. A readable subscription row
    // alone is not sufficient proof of current access.
    const accessResult = (await supabase.rpc("has_plus_access")) as unknown as {
      data: unknown;
      error: unknown;
    };
    const access = accessResult.data;
    const accessError = accessResult.error;
    if (accessError || !hasPlusAccessValue(access)) return freeStatus;
  }
  const hasFutureExpiry = Boolean(expiresAt && new Date(expiresAt).getTime() > Date.now());
  const accessRetained =
    plan === "lifetime"
      ? ["active", "billing_issue", "cancelled"].includes(status)
      : ["active", "billing_issue", "cancelled"].includes(status) && hasFutureExpiry;
  return accessRetained ? { plan, status, expiresAt } : freeStatus;
}

function hasPlusAccessValue(value: unknown): boolean {
  if (value === true) return true;
  if (Array.isArray(value)) return value.length > 0 && value[0] === true;
  if (value !== null && typeof value === "object") {
    return (value as Record<string, unknown>).has_plus_access === true;
  }
  return false;
}

function isPlan(value: unknown): value is Plan {
  return (
    value === "free" || value === "plus_monthly" || value === "plus_annual" || value === "lifetime"
  );
}

function isStatus(value: unknown): value is SubscriptionStatus["status"] {
  return (
    value === "active" ||
    value === "billing_issue" ||
    value === "cancelled" ||
    value === "expired" ||
    value === "refunded" ||
    value === "free"
  );
}

export function planLabel(plan: Plan) {
  if (plan === "lifetime") return "Lifetime";
  if (plan === "plus_annual") return "Plus annual";
  if (plan === "plus_monthly") return "Plus monthly";
  return "Free";
}
