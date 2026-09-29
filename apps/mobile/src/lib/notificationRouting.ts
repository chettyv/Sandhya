import { festivals } from "@/data/content";

export type NotificationRoute =
  | { type: "daily_reflection" }
  | { type: "festival"; festivalId: string };

const KNOWN_FESTIVAL_IDS = new Set(festivals.map((festival) => festival.id.toLowerCase()));

/**
 * Converts notification data into one of the app's known destinations.
 *
 * Notification data is external input. Keep this parser deliberately narrow:
 * callers must never pass a notification-provided path directly to the
 * router, and an outdated/unknown festival notification should simply be
 * ignored rather than opening a guessed screen.
 */
export function parseNotificationRoute(payload: unknown): NotificationRoute | null {
  const data = asRecord(payload);
  const nestedData = data && asRecord(data.data);
  const routeData = nestedData ?? data;
  if (!routeData) return null;

  if (routeData.type === "daily_reflection") return { type: "daily_reflection" };
  if (routeData.type !== "festival") return null;

  const rawFestivalId = routeData.festivalId ?? routeData.festival_id;
  if (typeof rawFestivalId !== "string") return null;
  const festivalId = rawFestivalId.trim().toLowerCase();
  if (!festivalId || !KNOWN_FESTIVAL_IDS.has(festivalId)) return null;
  return { type: "festival", festivalId };
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}
