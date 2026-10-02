import "../global.css";
import "react-native-gesture-handler";
import "react-native-url-polyfill/auto";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useRef } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import {
  loadActivityDates,
  loadPracticeCompletionKeys,
  loadProfile,
  loadSavedItemsAfterSync,
  syncLocalJournalEntries,
  updateProfile,
} from "@/lib/account";
import { createAccountHydrationGuard, type AccountHydrationContext } from "@/lib/accountHydration";
import type { NotificationRoute } from "@/lib/notificationRouting";
import {
  configureDailyReminder,
  getInitialNotificationRoute,
  subscribeToNotificationResponses,
} from "@/lib/notifications";
import { tagsForPractices } from "@/lib/practices";
import { configurePurchases, resetPurchases } from "@/lib/subscriptions";
import { supabase } from "@/lib/supabase";
import { track } from "@/lib/telemetry";
import { useAppStore } from "@/store/useAppStore";
import { colors } from "@/theme/tokens";

void SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 5 * 60 * 1000, retry: 1 },
    mutations: { retry: 0 },
  },
});

export default function RootLayout() {
  const router = useRouter();
  const setDisplayName = useAppStore((state) => state.setDisplayName);
  const setTraditionPreference = useAppStore((state) => state.setTraditionPreference);
  const syncDailyState = useAppStore((state) => state.syncDailyState);
  const replaceSavedItems = useAppStore((state) => state.replaceSavedItems);
  const setCompletedDateKeys = useAppStore((state) => state.setCompletedDateKeys);
  const setCompletedPracticeIds = useAppStore((state) => state.setCompletedPracticeIds);
  const clearAccountScopedState = useAppStore((state) => state.clearAccountScopedState);
  const setReminder = useAppStore((state) => state.setReminder);
  const setHouseholdPractices = useAppStore((state) => state.setHouseholdPractices);
  const setFocusTags = useAppStore((state) => state.setFocusTags);
  const setContentLanguage = useAppStore((state) => state.setContentLanguage);
  const hydrated = useAppStore((state) => state.hydrated);
  const reminderEnabled = useAppStore((state) => state.reminderEnabled);
  const reminderTime = useAppStore((state) => state.reminderTime);
  const lastNotificationRoute = useRef<{ key: string; at: number } | null>(null);
  const routeNotification = useCallback(
    (route: NotificationRoute) => {
      const key = route.type === "festival" ? `${route.type}:${route.festivalId}` : route.type;
      const now = Date.now();
      if (
        lastNotificationRoute.current?.key === key &&
        now - lastNotificationRoute.current.at < 1_000
      )
        return;
      lastNotificationRoute.current = { key, at: now };
      if (route.type === "daily_reflection") router.push("/(tabs)");
      else router.push({ pathname: "/festival/[id]", params: { id: route.festivalId } });
    },
    [router],
  );
  useEffect(() => {
    void SplashScreen.hideAsync();
    track("app_opened");
    syncDailyState();
    const client = supabase;
    if (!client) return;
    let mounted = true;
    const hydrationGuard = createAccountHydrationGuard();
    const isCurrent = (context: AccountHydrationContext) =>
      mounted && hydrationGuard.isCurrent(context);
    // The server profile, applied to the store. Routing answers (household
    // practices, language) are only applied when the server actually has a
    // value, so a guest's local choices survive a sign-in to a blank profile
    // (syncGuestPreferences pushes them first).
    function applyProfile(profile: NonNullable<Awaited<ReturnType<typeof loadProfile>>>) {
      setDisplayName(profile.display_name ?? "Friend");
      setTraditionPreference(
        profile.tradition_pref === "general" || !profile.tradition_pref
          ? "All traditions"
          : profile.tradition_pref,
      );
      setReminder(
        Boolean(profile.notification_time),
        profile.notification_time?.slice(0, 5) ?? "08:00",
      );
      if (profile.household_practices && profile.household_practices.length > 0) {
        setHouseholdPractices(profile.household_practices);
        setFocusTags(tagsForPractices(profile.household_practices));
      }
      if (profile.language_pref) setContentLanguage(profile.language_pref);
    }
    // Everything server-held that the store mirrors. Waits for the persisted
    // store to rehydrate first: zustand's rehydrate replaces state with the
    // on-disk copy, so anything applied before it would be overwritten.
    const loadAccountState = async (
      context: AccountHydrationContext,
      profileLoader: () => Promise<Awaited<ReturnType<typeof loadProfile>>>,
    ) => {
      await waitForStoreHydration();
      if (!isCurrent(context)) return;
      void profileLoader()
        .then((profile) => {
          if (isCurrent(context) && profile) applyProfile(profile);
        })
        .catch(() => undefined);
      void loadActivityDates()
        .then((keys) => {
          if (isCurrent(context)) setCompletedDateKeys(keys);
        })
        .catch(() => undefined);
      void loadPracticeCompletionKeys()
        .then((ids) => {
          if (isCurrent(context)) setCompletedPracticeIds(ids);
        })
        .catch(() => undefined);
      void syncLocalJournalEntries(context.userId ?? undefined).catch(() => undefined);
    };
    const hydrateSavedItems = async (context: AccountHydrationContext) => {
      await waitForStoreHydration();
      if (!isCurrent(context) || !context.userId) return;
      const state = useAppStore.getState();
      const items = await loadSavedItemsAfterSync(
        state.savedIds.flatMap((itemId) => {
          const itemType = state.savedItemTypes[itemId];
          return itemType ? [{ itemId, itemType }] : [];
        }),
        context.userId,
      );
      if (items && isCurrent(context)) replaceSavedItems(items);
    };
    void client.auth
      .getSession()
      .then(async ({ data }) => {
        const context = hydrationGuard.begin(data.session?.user.id ?? null);
        if (!data.session) queryClient.removeQueries({ queryKey: ["curated-content"] });
        void queryClient.invalidateQueries({ queryKey: ["subscription-status"] });
        if (data.session) {
          await waitForStoreHydration();
          if (!isCurrent(context)) return;
          await syncGuestPreferences();
          if (!isCurrent(context)) return;
          void hydrateSavedItems(context).catch(() => undefined);
        }
        void loadAccountState(context, loadProfile);
        return configurePurchases(data.session?.user.id);
      })
      .catch(() => undefined);
    const { data: listener } = client.auth.onAuthStateChange((event, session) => {
      const context = hydrationGuard.begin(session?.user.id ?? null);
      if (event === "SIGNED_OUT") {
        track("auth_signed_out");
        clearAccountScopedState();
        void resetPurchases().catch(() => undefined);
        queryClient.removeQueries({ queryKey: ["curated-content"] });
        queryClient.removeQueries({ queryKey: ["subscription-status"] });
        queryClient.removeQueries({ queryKey: ["conversations"] });
        queryClient.removeQueries({ queryKey: ["conversation-messages"] });
        queryClient.removeQueries({ queryKey: ["saved-messages"] });
      } else if (event === "SIGNED_IN") {
        track("auth_signed_in");
        queryClient.removeQueries({ queryKey: ["curated-content"] });
        queryClient.removeQueries({ queryKey: ["conversations"] });
        queryClient.removeQueries({ queryKey: ["conversation-messages"] });
        queryClient.removeQueries({ queryKey: ["saved-messages"] });
        void queryClient.invalidateQueries({ queryKey: ["subscription-status"] });
      }
      void loadAccountState(context, async () => {
        if (event === "SIGNED_IN") await syncGuestPreferences().catch(() => undefined);
        return loadProfile();
      });
      if (event === "SIGNED_IN") void hydrateSavedItems(context).catch(() => undefined);
      void configurePurchases(session?.user.id).catch(() => undefined);
    });
    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [
    clearAccountScopedState,
    setCompletedDateKeys,
    setCompletedPracticeIds,
    setContentLanguage,
    setDisplayName,
    setFocusTags,
    setHouseholdPractices,
    setReminder,
    replaceSavedItems,
    setTraditionPreference,
    syncDailyState,
  ]);

  // Keeps the OS schedule in step with the store: re-arms on launch and on
  // any change, and cancels when the reminder was switched off here or on
  // another device (the profile sync above flips reminderEnabled).
  useEffect(() => {
    if (!hydrated) return;
    void configureDailyReminder(reminderEnabled, reminderTime).catch(() => undefined);
  }, [hydrated, reminderEnabled, reminderTime]);

  useEffect(() => subscribeToNotificationResponses(routeNotification), [routeNotification]);

  useEffect(() => {
    void getInitialNotificationRoute()
      .then((route) => {
        if (route) routeNotification(route);
      })
      .catch(() => undefined);
  }, [routeNotification]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar style="dark" />
          <Stack
            screenOptions={{
              headerStyle: { backgroundColor: colors.parchment },
              headerTintColor: colors.ink,
              headerTitleStyle: { fontWeight: "600" },
              headerShadowVisible: false,
              contentStyle: { backgroundColor: colors.parchment },
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="onboarding"
              // The flow has its own back control; the edge-swipe would pop
              // the whole route and lose the user's place.
              options={{ headerShown: false, gestureEnabled: false }}
            />
            <Stack.Screen name="profile" options={{ title: "Profile", presentation: "modal" }} />
            <Stack.Screen name="reflection/[id]" options={{ title: "Daily reflection" }} />
            <Stack.Screen name="challenge/[slug]/index" options={{ title: "Challenge" }} />
            <Stack.Screen name="shlokas" options={{ title: "Shloka bank" }} />
            <Stack.Screen name="shloka/[slug]" options={{ title: "Shloka" }} />
            <Stack.Screen name="read/index" options={{ title: "Read the scriptures" }} />
            <Stack.Screen name="read/[chapter]" options={{ title: "Reading" }} />
            <Stack.Screen name="challenge/[slug]/night/[night]" options={{ title: "Session" }} />
            <Stack.Screen name="festival/[id]" options={{ title: "Festival" }} />
            <Stack.Screen name="practice/[id]" options={{ title: "Practice" }} />
            <Stack.Screen name="concept/[id]" options={{ title: "Concept" }} />
            <Stack.Screen name="deity/[id]" options={{ title: "Deity" }} />
            <Stack.Screen name="text/[id]" options={{ title: "Sacred text" }} />
            <Stack.Screen name="saved" options={{ title: "Saved" }} />
            <Stack.Screen name="conversations" options={{ title: "Conversation history" }} />
            <Stack.Screen name="conversation/[id]" options={{ title: "Conversation" }} />
            <Stack.Screen name="journal" options={{ title: "Journal" }} />
            <Stack.Screen name="practice-history" options={{ title: "Practice history" }} />
            <Stack.Screen name="settings" options={{ title: "Settings" }} />
            <Stack.Screen
              name="subscription"
              options={{ title: "Sandhya Plus", presentation: "modal" }}
            />
            <Stack.Screen
              name="legal"
              options={{ title: "Privacy and terms", presentation: "modal" }}
            />
            <Stack.Screen name="sign-in" options={{ title: "Welcome", presentation: "modal" }} />
            <Stack.Screen name="auth/callback" options={{ headerShown: false }} />
            <Stack.Screen name="reset-password" options={{ title: "Reset password" }} />
          </Stack>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

async function syncGuestPreferences(): Promise<void> {
  const profile = await loadProfile();
  if (!profile) return;
  const state = useAppStore.getState();
  const patch: Parameters<typeof updateProfile>[0] = {};
  if (!profile.display_name && state.displayName !== "Friend") {
    patch.display_name = state.displayName;
  }
  if (
    (!profile.tradition_pref || profile.tradition_pref === "general") &&
    state.traditionPreference !== "All traditions"
  ) {
    patch.tradition_pref = state.traditionPreference.toLowerCase();
  }
  if (!profile.notification_time && state.reminderEnabled) {
    patch.notification_time = `${state.reminderTime}:00`;
    patch.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  }
  if (
    (!profile.household_practices || profile.household_practices.length === 0) &&
    state.householdPractices.length > 0
  ) {
    patch.household_practices = state.householdPractices;
  }
  if (profile.language_pref !== "hi" && state.contentLanguage === "hi") {
    patch.language_pref = "hi";
  }
  if (Object.keys(patch).length) await updateProfile(patch);
}

function waitForStoreHydration(): Promise<void> {
  if (useAppStore.getState().hydrated) return Promise.resolve();
  return new Promise((resolve) => {
    const unsubscribe = useAppStore.subscribe((state) => {
      if (!state.hydrated) return;
      unsubscribe();
      resolve();
    });
  });
}
