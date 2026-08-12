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
  loadSavedItems,
  syncLocalSavedItems,
  syncLocalJournalEntries,
  updateProfile,
} from "@/lib/account";
import {
  configureDailyReminder,
  getInitialNotificationRoute,
  subscribeToNotificationResponses,
} from "@/lib/notifications";
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
  const setSavedItems = useAppStore((state) => state.setSavedItems);
  const setCompletedDateKeys = useAppStore((state) => state.setCompletedDateKeys);
  const setCompletedPracticeIds = useAppStore((state) => state.setCompletedPracticeIds);
  const clearAccountScopedState = useAppStore((state) => state.clearAccountScopedState);
  const setReminder = useAppStore((state) => state.setReminder);
  const hydrated = useAppStore((state) => state.hydrated);
  const reminderEnabled = useAppStore((state) => state.reminderEnabled);
  const reminderTime = useAppStore((state) => state.reminderTime);
  const lastNotificationRoute = useRef<{ key: string; at: number } | null>(null);
  const routeNotification = useCallback(
    (route: { type?: string; festivalId?: string }) => {
      if (route.type !== "daily_reflection" && route.type !== "festival") return;
      if (route.type === "festival" && !route.festivalId) return;
      const key = `${route.type}:${route.festivalId ?? ""}`;
      const now = Date.now();
      if (
        lastNotificationRoute.current?.key === key &&
        now - lastNotificationRoute.current.at < 1_000
      )
        return;
      lastNotificationRoute.current = { key, at: now };
      if (route.type === "daily_reflection") router.push("/(tabs)");
      else router.push(`/festival/${route.festivalId}`);
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
    const hydrateSavedItems = async () => {
      await waitForStoreHydration();
      const state = useAppStore.getState();
      await syncLocalSavedItems(
        state.savedIds.flatMap((itemId) => {
          const itemType = state.savedItemTypes[itemId];
          return itemType ? [{ itemId, itemType }] : [];
        }),
      ).catch(() => undefined);
      const items = await loadSavedItems();
      if (mounted) setSavedItems(items);
    };
    void loadProfile()
      .then((profile) => {
        if (!mounted || !profile) return;
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
      })
      .catch(() => undefined);
    void loadActivityDates()
      .then(setCompletedDateKeys)
      .catch(() => undefined);
    void loadPracticeCompletionKeys()
      .then(setCompletedPracticeIds)
      .catch(() => undefined);
    void waitForStoreHydration()
      .then(() => syncLocalJournalEntries())
      .catch(() => undefined);
    void client.auth
      .getSession()
      .then(async ({ data }) => {
        if (!data.session) queryClient.removeQueries({ queryKey: ["curated-content"] });
        if (data.session) void hydrateSavedItems().catch(() => undefined);
        void queryClient.invalidateQueries({ queryKey: ["subscription-status"] });
        if (!data.session) return configurePurchases(undefined);
        await waitForStoreHydration();
        await syncGuestPreferences();
        return configurePurchases(data.session.user.id);
      })
      .catch(() => undefined);
    const { data: listener } = client.auth.onAuthStateChange((event, session) => {
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
      const loadAndApplyProfile = async () => {
        if (event === "SIGNED_IN") await syncGuestPreferences().catch(() => undefined);
        return loadProfile();
      };
      void loadAndApplyProfile()
        .then((profile) => {
          if (!mounted || !profile) return;
          const hadReminderEnabled = useAppStore.getState().reminderEnabled;
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
          if (profile.notification_time && hadReminderEnabled)
            void configureDailyReminder(true, profile.notification_time.slice(0, 5)).catch(
              () => undefined,
            );
        })
        .catch(() => undefined);
      if (event === "SIGNED_IN") void hydrateSavedItems().catch(() => undefined);
      void loadActivityDates()
        .then(setCompletedDateKeys)
        .catch(() => undefined);
      void loadPracticeCompletionKeys()
        .then(setCompletedPracticeIds)
        .catch(() => undefined);
      void waitForStoreHydration()
        .then(() => syncLocalJournalEntries())
        .catch(() => undefined);
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
    setDisplayName,
    setReminder,
    setSavedItems,
    setTraditionPreference,
    syncDailyState,
  ]);

  useEffect(() => {
    if (hydrated && reminderEnabled)
      void configureDailyReminder(true, reminderTime).catch(() => undefined);
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
          <StatusBar style="light" />
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
            <Stack.Screen name="onboarding" options={{ headerShown: false }} />
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
