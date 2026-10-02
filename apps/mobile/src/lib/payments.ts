import { isFeatureAvailable } from "./launchProfile";

// Payments are a full-profile capability, not an independent client toggle.
// The backend/store still enforce entitlement and purchase authorization.
export const paymentsEnabled = isFeatureAvailable("payments");
