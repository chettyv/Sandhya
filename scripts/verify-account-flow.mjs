#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const signIn = readFileSync(join(root, "apps/mobile/app/sign-in.tsx"), "utf8");
const callback = readFileSync(join(root, "apps/mobile/app/auth/callback.tsx"), "utf8");
const reset = readFileSync(join(root, "apps/mobile/app/reset-password.tsx"), "utf8");
const layout = readFileSync(join(root, "apps/mobile/app/_layout.tsx"), "utf8");
const telemetry = readFileSync(join(root, "apps/mobile/src/lib/telemetry.ts"), "utf8");
const client = readFileSync(join(root, "apps/mobile/src/lib/supabase.ts"), "utf8");
const nativeSecureStorage = readFileSync(
  join(root, "apps/mobile/src/lib/secureStorage.native.ts"),
  "utf8",
);
const saved = readFileSync(join(root, "apps/mobile/app/saved.tsx"), "utf8");
const conversations = readFileSync(join(root, "apps/mobile/src/lib/conversations.ts"), "utf8");
const ask = readFileSync(join(root, "apps/mobile/app/(tabs)/ask.tsx"), "utf8");
const askClient = readFileSync(join(root, "apps/mobile/src/lib/askDharma.ts"), "utf8");
const subscription = readFileSync(join(root, "apps/mobile/src/lib/subscriptionState.ts"), "utf8");
const subscriptionScreen = readFileSync(join(root, "apps/mobile/app/subscription.tsx"), "utf8");
const profileScreen = readFileSync(join(root, "apps/mobile/app/profile.tsx"), "utf8");
const settingsScreen = readFileSync(join(root, "apps/mobile/app/settings.tsx"), "utf8");
const authState = readFileSync(join(root, "apps/mobile/src/lib/authState.ts"), "utf8");
const savedScreen = readFileSync(join(root, "apps/mobile/app/saved.tsx"), "utf8");
const conversationsScreen = readFileSync(join(root, "apps/mobile/app/conversations.tsx"), "utf8");
const conversationDetail = readFileSync(
  join(root, "apps/mobile/app/conversation/[id].tsx"),
  "utf8",
);
const reflectionScreen = readFileSync(join(root, "apps/mobile/app/reflection/[id].tsx"), "utf8");
const storage = readFileSync(join(root, "apps/mobile/src/lib/secureStorage.ts"), "utf8");
const journalStorage = readFileSync(
  join(root, "apps/mobile/src/lib/localJournalStorage.ts"),
  "utf8",
);
const persistedStorage = readFileSync(join(root, "apps/mobile/src/lib/chunkedStorage.ts"), "utf8");
const onboarding = readFileSync(join(root, "apps/mobile/app/onboarding.tsx"), "utf8");
const onboardingResultStep = readFileSync(
  join(root, "apps/mobile/src/features/onboarding/components/steps/ResultStep.tsx"),
  "utf8",
);
const onboardingFlowButton = readFileSync(
  join(root, "apps/mobile/src/features/onboarding/components/FlowButton.tsx"),
  "utf8",
);
const legal = readFileSync(join(root, "apps/mobile/app/legal.tsx"), "utf8");
const nativeSubscriptions = readFileSync(
  join(root, "apps/mobile/src/lib/subscriptions.native.ts"),
  "utf8",
);
const webSubscriptions = readFileSync(join(root, "apps/mobile/src/lib/subscriptions.ts"), "utf8");
const appConfig = readFileSync(join(root, "apps/mobile/app.config.js"), "utf8");
const nativeNotifications = readFileSync(
  join(root, "apps/mobile/src/lib/notifications.native.ts"),
  "utf8",
);
const rootLayout = readFileSync(join(root, "apps/mobile/app/_layout.tsx"), "utf8");
const easConfig = readFileSync(join(root, "apps/mobile/eas.json"), "utf8");
const fallbackContent = readFileSync(join(root, "apps/mobile/src/data/content.ts"), "utf8");
const account = readFileSync(join(root, "apps/mobile/src/lib/account.ts"), "utf8");
const accountFunction = readFileSync(join(root, "supabase/functions/account/index.ts"), "utf8");
const accountDeleteSmoke = readFileSync(
  join(root, "scripts/account-delete-live-smoke.mjs"),
  "utf8",
);

for (const [label, source, patterns] of [
  [
    "mobile sign-in",
    signIn,
    [
      "signUp",
      "signInWithPassword",
      "signInWithOtp",
      "signInWithOAuth",
      "error_description",
      "secure sign-in code",
      "errorMessage",
      "finally",
      "resend({",
      'type: "signup"',
    ],
  ],
  ["mobile recovery", signIn, ["resetPasswordForEmail", "redirectTo"]],
  [
    "mobile callback",
    callback,
    [
      "exchangeCodeForSession",
      'normalizedType === "recovery"',
      "handledCode",
      "useRef",
      "error_description",
      "providerError",
      "callbackError",
      "provider rejected the request",
      "could not be reached",
      ".catch(() =>",
      "firstParam",
      "string | string[]",
    ],
  ],
  ["mobile reset screen", reset, ["updateUser({ password })", "secureTextEntry", "finally"]],
  ["mobile reset route", layout, ['name="reset-password"']],
  ["mobile telemetry", telemetry, ['url.protocol !== "https:"', "Client operation failed"]],
  ["secure auth client", client, ["persistSession: true", 'flowType: "pkce"']],
  [
    "native secure storage adapter",
    nativeSecureStorage,
    ["expo-secure-store", "getItemAsync", "setItemAsync"],
  ],
  [
    "saved answers screen",
    saved,
    ["loadSavedMessages", 'queryKey: ["saved-messages"]', "Saved grounded answer"],
  ],
  [
    "saved answers loader",
    conversations,
    ["export async function loadSavedMessages", 'eq("item_type", "message")'],
  ],
  ["saved answers controls", ask, ["removeSavedItem", 'queryKey: ["saved-messages"]']],
  [
    "bounded source-grounded network request",
    askClient,
    [
      "ASK_REQUEST_TIMEOUT_MS",
      "new AbortController()",
      'code: "request_timeout"',
      "removeEventListener",
      "MAX_RETRIEVED_PASSAGE_IDS",
      "isValidRetrievedPassageIds",
      "citationsBacked",
      "isValidUuid(data.conversation_id)",
      "isValidUuid(data.message_id)",
    ],
  ],
  ["client entitlement check", subscription, ['rpc("has_plus_access")', "accessError"]],
  ["retired subscription links", subscriptionScreen, ["subscriptionUnavailable", "backToApp"]],
  ["profile auth refresh", profileScreen, ["useAuthState", "authState"]],
  ["settings auth refresh", settingsScreen, ["useAuthState", "authState"]],
  ["shared auth state", authState, ["useAuthState", "signed_in", "signed_out"]],
  [
    "guest-safe saved answers",
    savedScreen,
    ["useAuthState", 'enabled: askAvailable && authState === "signed_in"'],
  ],
  [
    "conversation auth error states",
    conversationsScreen + conversationDetail,
    ["Could not load conversations", "Could not load this conversation", "cloud-offline-outline"],
  ],
  [
    "reflection route identity",
    reflectionScreen,
    ["requestedReflection", "Reflection unavailable", "if (!requestedReflection)"],
  ],
  [
    "guest preference migration",
    layout,
    ["syncGuestPreferences", "waitForStoreHydration", "updateProfile"],
  ],
  ["cross-platform storage adapter", storage, ["localStorage", "preview-compatible"]],
  [
    "scoped chunked journal storage",
    journalStorage,
    ["CHUNK_SIZE", "readLocalJournal", "writeLocalJournal", "GUEST_JOURNAL_SCOPE", "safeScope"],
  ],
  [
    "journal account isolation",
    account + journalStorage,
    ["readLocalJournal(userId)", "writeLocalJournal", "removeLocalJournalEntry", "signOut"],
  ],
  ["chunked persisted state", persistedStorage, ["chunkedStorage", "CHUNK_SIZE", "removeItem"]],
  [
    // The finish button moved into ResultStep -> FlowButton; the invariant is
    // still that it is disabled while finishing and exposes that to a11y.
    "onboarding reminder failure handling",
    onboarding + onboardingResultStep + onboardingFlowButton,
    [
      "finishing",
      "Reminder not enabled",
      "disabled={finishing}",
      "accessibilityState={{ disabled }}",
    ],
  ],
  [
    "legal release disclosure",
    legal,
    ["Release links are not configured", "EXPO_PUBLIC_PRIVACY_URL", "Terms of Use URLs"],
  ],
  [
    "native purchase initialization",
    nativeSubscriptions,
    [
      "ensureConfigured",
      "restorePurchases",
      "configuredUserId",
    ],
  ],
  [
    "shared subscription auth boundary",
    subscription,
    ['enabled: authState === "signed_in"', "freeStatus", "isChecking"],
  ],
  ["cross-platform entitlement query", webSubscriptions, ["useSubscription", "subscriptionState"]],
  [
    "production mobile build gate",
    appConfig,
    [
      'EAS_BUILD_PROFILE === "production"',
      "EXPO_PUBLIC_PRIVACY_URL",
      "missingNativePackages",
      "react-native-purchases",
    ],
  ],
  [
    "notification deep-link consumption",
    nativeNotifications,
    [
      "getLastNotificationResponseAsync",
      "clearLastNotificationResponseAsync",
      "NOTIFICATION_REQUEST_TIMEOUT_MS",
      "fetchWithTimeout",
    ],
  ],
  [
    "notification route deduplication",
    rootLayout,
    ["lastNotificationRoute", "routeNotification", "subscribeToNotificationResponses"],
  ],
  [
    "explicit EAS environments",
    easConfig,
    ['"environment": "development"', '"environment": "preview"', '"environment": "production"'],
  ],
  [
    "guest save migration",
    account,
    ["export type SavedItem", "loadSavedItems", "syncLocalSavedItems", "UUID_PATTERN"],
  ],
  [
    "UUID-compatible fallback content",
    fallbackContent,
    ["00000000-0000-0000-0000-000000000301", "00000000-0000-0000-0000-000000000701"],
  ],
  [
    "server account deletion",
    accountFunction,
    [
      "auth/v1/user",
      "auth/v1/admin/users",
      "confirmation",
      "A provider retry may have claimed a billing row",
      "await deleteBillingEvents(supabaseUrl, serviceRoleKey, userId);",
    ],
  ],
  [
    "server account export",
    accountFunction,
    [
      "exportAccountData",
      "schema_version",
      "journal_entries",
      "usage_quotas",
      "device_push_tokens",
      "content-disposition",
      "cache-control",
      "no-store, private",
      'pragma: "no-cache"',
      "MAX_EXPORT_BYTES",
      "account_export_failed",
    ],
  ],
  [
    "server account endpoint rate limits",
    accountFunction,
    ["consume_api_request_rate_limit", '"account_export"', '"account_delete"', '"retry-after"'],
  ],
  [
    "guarded account deletion smoke",
    accountDeleteSmoke,
    [
      "ACCOUNT_DELETE_SMOKE_CONFIRM",
      "DELETE_ACCOUNT_LIVE",
      "requestExport",
      "requestDelete",
      "afterDeletion",
      "SUPABASE_SERVICE_ROLE_KEY",
      "assertDeletedData",
      "notification_push_tickets",
      "api_request_windows",
      "ai_budget_reservations",
      "billing_events",
      "profiles?id=eq.",
      "messages?select=id,conversations!inner(user_id)",
    ],
  ],
]) {
  for (const pattern of patterns) {
    if (!source.includes(pattern)) {
      console.error(`${label} is missing required account invariant: ${pattern}`);
      process.exit(1);
    }
  }
}

if (/const\s*\[\s*error\s*,/.test(callback)) {
  console.error("mobile callback redeclares the provider error parameter as React state.");
  process.exit(1);
}

console.log("Account lifecycle invariants passed.");
