// Free-launch mode (founder decision, 12 Aug 2026): the app runs free while
// source permissions are obtained. Premium gating and every upsell surface
// switch off unless this flag is explicitly enabled — and before it is ever
// re-enabled, all shipped sources must be re-audited for commercial rights
// (see docs/SOURCES-AND-ATTRIBUTION.md).
export const paymentsEnabled = process.env.EXPO_PUBLIC_PAYMENTS_ENABLED === "true";
