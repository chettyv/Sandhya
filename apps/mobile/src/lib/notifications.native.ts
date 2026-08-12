import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

import { supabase } from "./supabase";

const PUSH_TOKEN_KEY = "sandhya-expo-push-token";
const NOTIFICATION_REQUEST_TIMEOUT_MS = 15_000;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export type ReminderResult = { enabled: boolean; remoteRegistered: boolean; reason?: string };
export type FestivalReminder = { id: string; name: string; date: string };
export type NotificationRoute = { type?: string; festivalId?: string };

export async function configureDailyReminder(
  enabled: boolean,
  time: string,
): Promise<ReminderResult> {
  if (!enabled) {
    await cancelScheduledNotificationsByType("daily_reflection");
    await unregisterRemoteToken();
    return { enabled: true, remoteRegistered: false };
  }
  if (Platform.OS === "web") {
    return {
      enabled: false,
      remoteRegistered: false,
      reason: "Reminders are not available on web.",
    };
  }

  await cancelScheduledNotificationsByType("daily_reflection");

  if (Platform.OS === "android") {
    // Android 13 may not show the permission prompt until a channel exists.
    await Notifications.setNotificationChannelAsync("daily-reflections", {
      name: "Daily reflections",
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  const permission = await Notifications.getPermissionsAsync();
  const granted = permission.granted ? permission : await Notifications.requestPermissionsAsync();
  if (!granted.granted) {
    return {
      enabled: false,
      remoteRegistered: false,
      reason: "Allow notifications in system settings to receive daily reflections.",
    };
  }
  const { hour, minute } = parseTime(time);
  const remoteRegistered = await registerRemoteToken();
  if (!remoteRegistered) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Your daily reflection",
        body: "A few quiet minutes are waiting for you.",
        data: { type: "daily_reflection" },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
        channelId: "daily-reflections",
      },
    });
  }
  return {
    enabled: true,
    remoteRegistered,
    reason: remoteRegistered
      ? undefined
      : "Using an on-device reminder until remote push delivery is configured.",
  };
}

export async function scheduleFestivalReminder(
  festival: FestivalReminder,
): Promise<ReminderResult> {
  if (Platform.OS === "web") {
    return {
      enabled: false,
      remoteRegistered: false,
      reason: "Festival reminders are not available on web.",
    };
  }

  const reminderDate = new Date(`${festival.date}T09:00:00`);
  if (!Number.isFinite(reminderDate.getTime()) || reminderDate.getTime() <= Date.now()) {
    return {
      enabled: false,
      remoteRegistered: false,
      reason: "This festival date has already passed.",
    };
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("festival-reminders", {
      name: "Festival reminders",
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  const permission = await Notifications.getPermissionsAsync();
  const granted = permission.granted ? permission : await Notifications.requestPermissionsAsync();
  if (!granted.granted) {
    return {
      enabled: false,
      remoteRegistered: false,
      reason: "Allow notifications in system settings to receive festival reminders.",
    };
  }

  await cancelFestivalReminder(festival.id);
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `${festival.name} is today`,
      body: "Open Sandhya to learn about its meaning and observances.",
      data: { type: "festival", festivalId: festival.id },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: reminderDate,
      channelId: "festival-reminders",
    },
  });
  return { enabled: true, remoteRegistered: false };
}

export async function cancelFestivalReminder(festivalId: string): Promise<void> {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(
    scheduled
      .filter((item) => {
        const data = item.content.data as { type?: unknown; festivalId?: unknown };
        return data.type === "festival" && data.festivalId === festivalId;
      })
      .map((item) => Notifications.cancelScheduledNotificationAsync(item.identifier)),
  );
}

export async function hasFestivalReminder(festivalId: string): Promise<boolean> {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  return scheduled.some((item) => {
    const data = item.content.data as { type?: unknown; festivalId?: unknown };
    return data.type === "festival" && data.festivalId === festivalId;
  });
}

async function cancelScheduledNotificationsByType(type: string): Promise<void> {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(
    scheduled
      .filter((item) => {
        const data = item.content.data as { type?: unknown };
        return data.type === type;
      })
      .map((item) => Notifications.cancelScheduledNotificationAsync(item.identifier)),
  );
}

async function registerRemoteToken(): Promise<boolean> {
  if (!supabase) return false;
  const { data } = await supabase.auth.getSession();
  const accessToken = data.session?.access_token;
  const baseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
  const expoConfig = Constants.expoConfig as {
    extra?: { eas?: { projectId?: unknown } };
    version?: unknown;
  } | null;
  const easConfig = Constants.easConfig as { projectId?: unknown } | null;
  const projectIdCandidate = expoConfig?.extra?.eas?.projectId ?? easConfig?.projectId;
  const projectId =
    typeof projectIdCandidate === "string"
      ? projectIdCandidate
      : process.env.EXPO_PUBLIC_EAS_PROJECT_ID;
  if (!accessToken || !baseUrl || !anonKey || !projectId) return false;

  try {
    const token = await Notifications.getExpoPushTokenAsync({ projectId });
    const response = await fetchWithTimeout(`${baseUrl}/functions/v1/register-push-token`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        apikey: anonKey,
        authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        expo_push_token: token.data,
        platform: Platform.OS,
        app_version: typeof expoConfig?.version === "string" ? expoConfig.version : null,
      }),
    });
    if (!response.ok) return false;
    await SecureStore.setItemAsync(PUSH_TOKEN_KEY, token.data);
    return true;
  } catch {
    return false;
  }
}

async function unregisterRemoteToken(): Promise<void> {
  const token = await SecureStore.getItemAsync(PUSH_TOKEN_KEY).catch(() => null);
  await SecureStore.deleteItemAsync(PUSH_TOKEN_KEY).catch(() => undefined);
  if (!token || !supabase) return;
  const { data } = await supabase.auth.getSession();
  const accessToken = data.session?.access_token;
  const baseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
  if (!accessToken || !baseUrl || !anonKey) return;
  await fetchWithTimeout(
    `${baseUrl}/functions/v1/register-push-token?expo_push_token=${encodeURIComponent(token)}`,
    {
      method: "DELETE",
      headers: { apikey: anonKey, authorization: `Bearer ${accessToken}` },
    },
  ).catch(() => undefined);
}

async function fetchWithTimeout(url: string, init: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), NOTIFICATION_REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

function parseTime(value: string): { hour: number; minute: number } {
  const [hourValue, minuteValue] = value.split(":").map(Number);
  return {
    hour: Number.isInteger(hourValue) && hourValue >= 0 && hourValue <= 23 ? hourValue : 8,
    minute:
      Number.isInteger(minuteValue) && minuteValue >= 0 && minuteValue <= 59 ? minuteValue : 0,
  };
}

export function subscribeToNotificationResponses(
  listener: (route: NotificationRoute) => void,
): () => void {
  const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
    const data = response.notification.request.content.data as {
      type?: unknown;
      festivalId?: unknown;
    };
    listener({
      type: typeof data.type === "string" ? data.type : undefined,
      festivalId: typeof data.festivalId === "string" ? data.festivalId : undefined,
    });
  });
  return () => subscription.remove();
}

export async function getInitialNotificationRoute(): Promise<NotificationRoute | null> {
  const response = await Notifications.getLastNotificationResponseAsync();
  if (!response) return null;
  await Notifications.clearLastNotificationResponseAsync().catch(() => undefined);
  const data = response.notification.request.content.data as {
    type?: unknown;
    festivalId?: unknown;
  };
  return {
    type: typeof data.type === "string" ? data.type : undefined,
    festivalId: typeof data.festivalId === "string" ? data.festivalId : undefined,
  };
}
