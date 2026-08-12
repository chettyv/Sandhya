export type DueNotificationRecipient = {
  user_id: string;
  expo_push_token: string;
  display_name: string | null;
  local_date: string;
  date_slot: number;
};

export type GroupedNotificationRecipient = Omit<DueNotificationRecipient, "expo_push_token"> & {
  expo_push_tokens: string[];
};

/** Claiming is per user/day, so all active devices must share one claim. */
export function groupNotificationRecipients(
  due: DueNotificationRecipient[],
): GroupedNotificationRecipient[] {
  const groups = new Map<string, GroupedNotificationRecipient>();
  for (const recipient of due) {
    const key = `${recipient.user_id}:${recipient.local_date}`;
    const existing = groups.get(key);
    if (existing) {
      if (!existing.expo_push_tokens.includes(recipient.expo_push_token)) {
        existing.expo_push_tokens.push(recipient.expo_push_token);
      }
      continue;
    }
    groups.set(key, {
      user_id: recipient.user_id,
      display_name: recipient.display_name,
      local_date: recipient.local_date,
      date_slot: recipient.date_slot,
      expo_push_tokens: [recipient.expo_push_token],
    });
  }
  return [...groups.values()];
}
