export function localDateKey(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

// Zero-based day of the year for a local date key ("YYYY-MM-DD"). Computed
// in UTC so the number is the same in every timezone and unaffected by a
// daylight-saving change between January and the date.
export function dayOfYear(dateKey: string): number {
  const [year = 0, month = 1, day = 1] = dateKey.split("-").map(Number);
  return Math.floor((Date.UTC(year, month - 1, day) - Date.UTC(year, 0, 1)) / 86_400_000);
}

export function calculateCurrentStreak(activityDates: string[], today = localDateKey()): number {
  const dates = new Set(activityDates);
  const cursor = new Date(`${today}T12:00:00`);
  let streak = 0;
  while (dates.has(localDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
