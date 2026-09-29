import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, Text, View, useWindowDimensions } from "react-native";

import { ContentSourceNotice } from "@/components/ContentSourceNotice";
import { FestivalRow } from "@/components/FestivalRow";
import { Card, IconCircle, Page, Pill, SectionHeader } from "@/components/ui";
import { useCuratedContent } from "@/lib/content";
import { paymentsEnabled } from "@/lib/payments";
import { useSubscription } from "@/lib/subscriptions";
import { useAppStore } from "@/store/useAppStore";
import { colors, layout } from "@/theme/tokens";

const weekDays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

function buildMonth(year: number, month: number) {
  const first = (new Date(year, month, 1).getDay() + 6) % 7;
  const count = new Date(year, month + 1, 0).getDate();
  return [
    ...Array.from({ length: first }, () => null),
    ...Array.from({ length: count }, (_, index) => index + 1),
  ];
}

function getStreaks(dateKeys: string[]) {
  const dates = [...new Set(dateKeys)].sort().map((key) => new Date(`${key}T12:00:00`).getTime());
  if (!dates.length) return { current: 0, longest: 0 };

  let longest = 1;
  let run = 1;
  for (let index = 1; index < dates.length; index += 1) {
    const daysApart = Math.round((dates[index] - dates[index - 1]) / 86_400_000);
    run = daysApart === 1 ? run + 1 : 1;
    longest = Math.max(longest, run);
  }

  const now = new Date();
  const todayKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const todayTime = new Date(`${todayKey}T12:00:00`).getTime();
  let current = dates[dates.length - 1] === todayTime ? 1 : 0;
  for (let index = dates.length - 1; current > 0 && index > 0; index -= 1) {
    const daysApart = Math.round((dates[index] - dates[index - 1]) / 86_400_000);
    if (daysApart !== 1) break;
    current += 1;
  }

  return { current, longest };
}

export default function CalendarScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const today = new Date();
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [mode, setMode] = useState<"streak" | "calendar">("calendar");
  const completedDateKeys = useAppStore((state) => state.completedDateKeys);
  const completedTodayIds = useAppStore((state) => state.completedTodayIds);
  const contentQuery = useCuratedContent();
  const { data: content } = contentQuery;
  const { data: subscription } = useSubscription();
  const festivals =
    paymentsEnabled && subscription.plan === "free"
      ? content.festivals.filter((festival) => !festival.isPremium)
      : content.festivals;
  const days = useMemo(() => buildMonth(cursor.getFullYear(), cursor.getMonth()), [cursor]);
  const monthTitle = cursor.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
  const calendarCellSize = Math.min(
    48,
    Math.max(32, Math.floor((width - layout.screenPadding * 2) / 7) - 1),
  );
  const visibleFestivals = festivals.filter((festival) => {
    if (!festival.date) return false;
    const date = new Date(`${festival.date}T12:00:00`);
    return date.getFullYear() === cursor.getFullYear() && date.getMonth() === cursor.getMonth();
  });

  const changeMonth = (delta: number) =>
    setCursor((value) => new Date(value.getFullYear(), value.getMonth() + delta, 1));
  const { current: currentStreak, longest: longestStreak } = useMemo(
    () => getStreaks(completedDateKeys),
    [completedDateKeys],
  );

  return (
    <Page>
      <View className="mb-8 flex-row items-center justify-between">
        <View className="flex-row gap-8">
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: mode === "streak" }}
            onPress={() => setMode("streak")}
          >
            <Text className={`text-[20px] ${mode === "streak" ? "text-ink" : "text-muted"}`}>
              Daily Streak
            </Text>
            {mode === "streak" ? <View className="mt-3 h-1 rounded-full bg-saffron" /> : null}
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: mode === "calendar" }}
            onPress={() => setMode("calendar")}
          >
            <Text className={`text-[20px] ${mode === "calendar" ? "text-ink" : "text-muted"}`}>
              Holy Calendar
            </Text>
            {mode === "calendar" ? <View className="mt-3 h-1 rounded-full bg-saffron" /> : null}
          </Pressable>
        </View>
        <IconCircle
          icon="person-outline"
          label="Open profile"
          onPress={() => router.push("/profile")}
        />
      </View>
      <ContentSourceNotice
        source={content.source}
        retrying={contentQuery.isFetching}
        onRetry={() => void contentQuery.refetch()}
      />

      {mode === "streak" ? (
        <View>
          <Text className="text-[30px] font-bold text-ink">Your rhythm</Text>
          <Text className="mt-2 text-[16px] leading-6 text-muted">
            A gentle record of the days you made space for practice.
          </Text>
          <View className="mt-8 flex-row gap-3">
            <View className="flex-1 rounded-[22px] border border-line bg-surface p-5">
              <Ionicons name="flame" size={25} color={colors.saffron} />
              <Text className="mt-4 text-3xl font-semibold text-ink">{currentStreak}</Text>
              <Text className="mt-1 text-sm text-muted">Current streak</Text>
            </View>
            <View className="flex-1 rounded-[22px] border border-line bg-surface p-5">
              <Ionicons name="trophy-outline" size={25} color={colors.gold} />
              <Text className="mt-4 text-3xl font-semibold text-ink">{longestStreak}</Text>
              <Text className="mt-1 text-sm text-muted">Longest streak</Text>
            </View>
          </View>
          <Card className="mt-5 bg-surface">
            <View className="flex-row items-center gap-3">
              <Ionicons name="sparkles-outline" size={23} color={colors.saffron} />
              <View className="flex-1">
                <Text className="font-semibold text-ink">
                  {completedTodayIds.length ? "Today is complete" : "Make today yours"}
                </Text>
                <Text className="mt-1 text-sm leading-5 text-muted">
                  {completedTodayIds.length
                    ? "Your progress is reflected in the calendar."
                    : "Finish one small practice and it will appear here."}
                </Text>
              </View>
              <Ionicons
                name={completedTodayIds.length ? "checkmark-circle" : "arrow-forward"}
                size={23}
                color={completedTodayIds.length ? colors.sage : colors.muted}
              />
            </View>
          </Card>
        </View>
      ) : (
        <View>
          <View className="mb-7 flex-row items-center justify-between">
            <Pressable
              accessibilityLabel="Previous month"
              accessibilityRole="button"
              onPress={() => changeMonth(-1)}
              className="h-11 w-11 items-center justify-center"
            >
              <Ionicons name="chevron-back" size={34} color={colors.muted} />
            </Pressable>
            <View className="items-center">
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                className="text-[29px] font-bold text-ink"
              >
                {monthTitle}
              </Text>
            </View>
            <Pressable
              accessibilityLabel="Next month"
              accessibilityRole="button"
              onPress={() => changeMonth(1)}
              className="h-11 w-11 items-center justify-center"
            >
              <Ionicons name="chevron-forward" size={34} color={colors.muted} />
            </Pressable>
          </View>

          <View className="mb-3 flex-row">
            {weekDays.map((label, index) => (
              <Text
                key={`${label}-${index}`}
                className="flex-1 text-center text-[15px] font-bold text-muted"
              >
                {label}
              </Text>
            ))}
          </View>
          <View className="flex-row flex-wrap">
            {days.map((day, index) => {
              const dateKey = day
                ? `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
                : "";
              const festival = festivals.find((item) => item.date === dateKey);
              const complete = completedDateKeys.includes(dateKey);
              const isToday =
                day === today.getDate() &&
                cursor.getMonth() === today.getMonth() &&
                cursor.getFullYear() === today.getFullYear();
              return (
                <Pressable
                  key={`${dateKey}-${index}`}
                  accessibilityLabel={
                    day
                      ? `${monthTitle}, ${day}${festival ? `, ${festival.name}` : ""}${isToday ? ", today" : ""}`
                      : undefined
                  }
                  accessibilityHint={festival ? "Opens the festival details" : undefined}
                  accessibilityRole={festival ? "button" : undefined}
                  disabled={!festival}
                  onPress={() => festival && router.push(`/festival/${festival.id}`)}
                  className="aspect-square w-[14.285%] items-center justify-center"
                >
                  {day ? (
                    <View
                      style={{ width: calendarCellSize, height: calendarCellSize }}
                      className={`items-center justify-center rounded-2xl border-2 ${isToday ? "border-saffron bg-parchment" : complete ? "border-sage bg-sageSoft" : festival ? "border-saffron bg-warm" : "border-line bg-sand"}`}
                    >
                      {festival && !isToday ? (
                        <Ionicons name="flame" size={23} color={colors.saffron} />
                      ) : complete ? (
                        <Ionicons name="checkmark" size={22} color={colors.sage} />
                      ) : (
                        <Text
                          className={`text-[16px] font-semibold ${isToday ? "text-ink" : "text-muted"}`}
                        >
                          {day}
                        </Text>
                      )}
                    </View>
                  ) : null}
                </Pressable>
              );
            })}
          </View>
        </View>
      )}

      {mode === "calendar" ? (
        <>
          <Card className="mt-8 bg-surface">
            <View className="flex-row items-start gap-3">
              <Ionicons name="location-outline" size={20} color={colors.plum} />
              <View className="flex-1">
                <Text className="font-semibold text-ink">Dates can vary by location</Text>
                <Text className="mt-1 text-sm leading-5 text-muted">
                  Tithi and observance dates may differ by region, tradition, and local panchang.
                  Sandhya does not calculate local timings yet; check a local panchang or temple for
                  exact observance times.
                </Text>
              </View>
            </View>
          </Card>

          <SectionHeader
            title={visibleFestivals.length ? "This month" : "No listed festivals this month"}
          />
          {visibleFestivals.length ? (
            visibleFestivals.map((festival) => (
              <FestivalRow
                key={festival.id}
                festival={festival}
                onPress={() => router.push(`/festival/${festival.id}`)}
              />
            ))
          ) : (
            <View className="flex-row items-center gap-2 rounded-card bg-surface p-4">
              <Ionicons name="calendar-outline" size={18} color={colors.muted} />
              <Text className="flex-1 text-sm text-muted">
                Move to another month to browse the curated calendar.
              </Text>
            </View>
          )}

          <SectionHeader title="Calendar guide" />
          <View className="flex-row flex-wrap gap-2">
            <Pill label="Festival" icon="flame" tone="warm" />
            <Pill label="Today" icon="ellipse" />
            <Pill label="Location-sensitive" icon="location-outline" tone="sage" />
          </View>
        </>
      ) : null}
    </Page>
  );
}
