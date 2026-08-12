export type ReminderResult = { enabled: boolean; remoteRegistered: boolean; reason?: string };
export type FestivalReminder = { id: string; name: string; date: string };
export type NotificationRoute = { type?: string; festivalId?: string };

export async function configureDailyReminder(
  enabled: boolean,
  _time: string,
): Promise<ReminderResult> {
  return enabled
    ? {
        enabled: false,
        remoteRegistered: false,
        reason:
          "Daily reminders require a native development build with expo-notifications configured.",
      }
    : { enabled: true, remoteRegistered: false };
}

export async function scheduleFestivalReminder(
  _festival: FestivalReminder,
): Promise<ReminderResult> {
  return {
    enabled: false,
    remoteRegistered: false,
    reason:
      "Festival reminders require a native development build with expo-notifications configured.",
  };
}

export async function cancelFestivalReminder(_festivalId: string): Promise<void> {}

export async function hasFestivalReminder(_festivalId: string): Promise<boolean> {
  return false;
}

export function subscribeToNotificationResponses(
  _listener: (route: NotificationRoute) => void,
): () => void {
  return () => undefined;
}
export async function getInitialNotificationRoute(): Promise<NotificationRoute | null> {
  return null;
}
