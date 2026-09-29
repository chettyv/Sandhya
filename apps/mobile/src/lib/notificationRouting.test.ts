import { describe, expect, it } from "vitest";

import { parseNotificationRoute } from "./notificationRouting";

const KNOWN_FESTIVAL_ID = "00000000-0000-0000-0000-000000000402";

describe("parseNotificationRoute", () => {
  it("allows a known festival and normalizes its identifier", () => {
    expect(
      parseNotificationRoute({
        type: "festival",
        festivalId: `  ${KNOWN_FESTIVAL_ID.toUpperCase()}  `,
      }),
    ).toEqual({ type: "festival", festivalId: KNOWN_FESTIVAL_ID });
  });

  it("rejects missing, malformed, and unknown festival identifiers", () => {
    expect(parseNotificationRoute({ type: "festival" })).toBeNull();
    expect(parseNotificationRoute({ type: "festival", festivalId: "not-an-id" })).toBeNull();
    expect(
      parseNotificationRoute({
        type: "festival",
        festivalId: "00000000-0000-0000-0000-000000009999",
      }),
    ).toBeNull();
  });

  it("allows the daily reflection destination without accepting arbitrary routes", () => {
    expect(parseNotificationRoute({ type: "daily_reflection" })).toEqual({
      type: "daily_reflection",
    });
    expect(parseNotificationRoute({ type: "conversation", path: "/settings" })).toBeNull();
    expect(parseNotificationRoute({ type: "festival", festival_id: KNOWN_FESTIVAL_ID })).toEqual({
      type: "festival",
      festivalId: KNOWN_FESTIVAL_ID,
    });
  });

  it("returns null for malformed payloads and the cold-start empty state", () => {
    expect(parseNotificationRoute(null)).toBeNull();
    expect(parseNotificationRoute(undefined)).toBeNull();
    expect(parseNotificationRoute("festival")).toBeNull();
    expect(parseNotificationRoute({})).toBeNull();
  });
});
