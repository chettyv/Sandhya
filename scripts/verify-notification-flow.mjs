#!/usr/bin/env node
import { pathToFileURL } from "node:url";

const grouping = await import(
  `${pathToFileURL("supabase/functions/_shared/notification-grouping.ts").href}?test=${Date.now()}`
);
const userA = "00000000-0000-0000-0000-000000000001";
const userB = "00000000-0000-0000-0000-000000000002";
const due = [
  recipient(userA, "ExpoPushToken[aaaaaaaa]", "2026-08-06", 218),
  recipient(userA, "ExpoPushToken[bbbbbbbb]", "2026-08-06", 218),
  recipient(userA, "ExpoPushToken[aaaaaaaa]", "2026-08-06", 218),
  recipient(userB, "ExpoPushToken[cccccccc]", "2026-08-06", 218),
  recipient(userA, "ExpoPushToken[dddddddd]", "2026-08-07", 219),
];
const grouped = grouping.groupNotificationRecipients(due);

assert(grouped.length === 3, "different users/dates must remain separate delivery claims");
assert(
  grouped.find((item) => item.user_id === userA && item.local_date === "2026-08-06")
    ?.expo_push_tokens.length === 2,
  "same user/day must include every distinct active device token",
);
assert(
  grouped.find((item) => item.user_id === userB)?.expo_push_tokens[0] === "ExpoPushToken[cccccccc]",
  "the second user must retain its own device token",
);

console.log("Notification grouping invariants passed.");

function recipient(userId, token, localDate, dateSlot) {
  return {
    user_id: userId,
    expo_push_token: token,
    display_name: null,
    local_date: localDate,
    date_slot: dateSlot,
  };
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
