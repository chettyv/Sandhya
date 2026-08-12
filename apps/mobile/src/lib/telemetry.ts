import Constants from "expo-constants";
import { Platform } from "react-native";

import * as SecureStore from "./secureStorage";

const INSTALL_ID_KEY = "dharma-daily-anonymous-install-id";
const TELEMETRY_CONSENT_KEY = "dharma-daily-anonymous-telemetry-consent";
const MAX_MESSAGE_LENGTH = 320;
const MAX_PROPERTY_LENGTH = 120;

type TelemetryPrimitive = string | number | boolean | null;
type TelemetryProperties = Record<string, TelemetryPrimitive>;

/**
 * Client telemetry is deliberately dependency-free until the native release
 * build is configured. Only explicitly opted-in anonymous lifecycle/error
 * events are sent. Never pass prompts, answers, tokens, email addresses, or
 * user IDs here.
 */
export function track(event: string, properties: TelemetryProperties = {}): void {
  const key = process.env.EXPO_PUBLIC_POSTHOG_KEY;
  if (!key || !isSafeEventName(event)) return;

  void getTelemetryConsent().then((enabled) => {
    if (!enabled) return;
    void getAnonymousInstallId().then((distinctId) => {
      const host = parseHttpsBaseUrl(
        process.env.EXPO_PUBLIC_POSTHOG_HOST ?? "https://app.posthog.com",
      );
      if (!host) return;
      void postJson(`${host}/capture/`, {
        api_key: key,
        event,
        distinct_id: distinctId,
        properties: {
          ...sanitizeProperties(properties),
          app_version: getAppVersion(),
          platform: getPlatform(),
        },
      });
    });
  });
}

export function captureMobileError(error: unknown, tags: Record<string, string> = {}): void {
  const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN;
  if (!dsn) return;

  const parsed = parseSentryDsn(dsn);
  if (!parsed) return;

  void getTelemetryConsent().then((enabled) => {
    if (!enabled) return;
    const normalized = normalizeError(error);
    const safeTags = Object.fromEntries(
      Object.entries(tags)
        .filter(([key, value]) => isSafeKey(key) && typeof value === "string")
        .map(([key, value]) => [key, sanitizeText(value)]),
    );
    const event = {
      event_id: createEventId(),
      platform: "javascript",
      level: "error",
      release: getAppVersion(),
      tags: safeTags,
      exception: {
        values: [
          {
            type: normalized.name,
            value: normalized.message,
          },
        ],
      },
    };

    const envelope = [
      JSON.stringify({ event_id: event.event_id, sent_at: new Date().toISOString() }),
      JSON.stringify({ type: "event", content_type: "application/json" }),
      JSON.stringify(event),
      "",
    ].join("\n");
    void postText(
      `${parsed.origin}${parsed.path}/api/${parsed.projectId}/envelope/?sentry_version=7&sentry_key=${encodeURIComponent(parsed.publicKey)}`,
      envelope,
    );
  });
}

export async function getTelemetryConsent(): Promise<boolean> {
  return (await SecureStore.getItemAsync(TELEMETRY_CONSENT_KEY).catch(() => null)) === "granted";
}

export async function setTelemetryConsent(enabled: boolean): Promise<void> {
  if (enabled) {
    await SecureStore.setItemAsync(TELEMETRY_CONSENT_KEY, "granted");
  } else {
    await SecureStore.deleteItemAsync(TELEMETRY_CONSENT_KEY);
  }
}

async function getAnonymousInstallId(): Promise<string> {
  const existing = await SecureStore.getItemAsync(INSTALL_ID_KEY).catch(() => null);
  if (existing && /^[a-z0-9-]{8,80}$/i.test(existing)) return existing;

  const generated =
    typeof globalThis.crypto?.randomUUID === "function"
      ? globalThis.crypto.randomUUID()
      : `install-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
  await SecureStore.setItemAsync(INSTALL_ID_KEY, generated).catch(() => undefined);
  return generated;
}

function parseSentryDsn(value: string): {
  origin: string;
  path: string;
  publicKey: string;
  projectId: string;
} | null {
  try {
    const url = new URL(value);
    const publicKey = decodeURIComponent(url.username);
    const path = url.pathname.replace(/\/$/, "");
    const projectId = path.split("/").filter(Boolean).at(-1);
    if (!publicKey || !projectId || url.protocol !== "https:") {
      return null;
    }
    return {
      origin: url.origin,
      path: path.slice(0, -(projectId.length + 1)),
      publicKey,
      projectId,
    };
  } catch {
    return null;
  }
}

function parseHttpsBaseUrl(value: string): string | null {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || !url.hostname) return null;
    return `${url.origin}${url.pathname.replace(/\/$/, "")}`;
  } catch {
    return null;
  }
}

function normalizeError(error: unknown): { name: string; message: string } {
  if (error instanceof Error) {
    return {
      name: sanitizeText(error.name || "Error"),
      // Error messages can contain provider responses, URLs, or user-derived
      // text. Keep Sentry useful without exporting that content.
      message: "Client operation failed",
    };
  }
  return { name: "Error", message: "Unknown client error" };
}

function sanitizeProperties(properties: TelemetryProperties): TelemetryProperties {
  return Object.fromEntries(
    Object.entries(properties)
      .filter(([key]) => isSafeKey(key) && !isSensitiveKey(key))
      .map(([key, value]) => [
        key,
        typeof value === "string" ? sanitizeText(value, MAX_PROPERTY_LENGTH) : value,
      ]),
  );
}

function isSafeEventName(value: string): boolean {
  return /^[a-z][a-z0-9_.-]{1,63}$/.test(value);
}

function isSafeKey(value: string): boolean {
  return /^[a-z][a-z0-9_]{0,31}$/.test(value);
}

function isSensitiveKey(value: string): boolean {
  return /(answer|body|content|email|prompt|question|token|user|url)/i.test(value);
}

function sanitizeText(value: string, maxLength = MAX_MESSAGE_LENGTH): string {
  let sanitized = "";
  for (const character of value) {
    const code = character.charCodeAt(0);
    sanitized += code <= 0x1f || code === 0x7f ? " " : character;
  }
  return sanitized.trim().slice(0, maxLength);
}

function createEventId(): string {
  const uuid = globalThis.crypto?.randomUUID?.();
  if (uuid) return uuid.replace(/-/g, "");
  return `${Date.now().toString(16)}${Math.random().toString(16).slice(2, 26)}`.slice(0, 32);
}

function getAppVersion(): string {
  const version = Constants.expoConfig?.version;
  return typeof version === "string" ? version : "unknown";
}

function getPlatform(): string {
  return Platform.OS;
}

async function postJson(url: string, body: unknown): Promise<void> {
  await postText(url, JSON.stringify(body), "application/json");
}

async function postText(
  url: string,
  body: string,
  contentType = "application/x-sentry-envelope",
): Promise<void> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 1500);
  try {
    await fetch(url, {
      method: "POST",
      headers: { "content-type": contentType },
      body,
      signal: controller.signal,
    });
  } catch {
    // Telemetry must never affect sign-in, RAG, or other user flows.
  } finally {
    clearTimeout(timeout);
  }
}
