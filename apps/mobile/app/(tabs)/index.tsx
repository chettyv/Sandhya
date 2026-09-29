import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";

import { ContentSourceNotice } from "@/components/ContentSourceNotice";
import { FestivalRow } from "@/components/FestivalRow";
import { PracticeRow } from "@/components/PracticeRow";
import { StartingPointCard } from "@/components/StartingPointCard";
import { Card, Page, SectionHeader } from "@/components/ui";
import { VerseLines } from "@/components/VerseLines";
import { calculateCurrentStreak, localDateKey, removeSavedItem, saveItem } from "@/lib/account";
import { useFeaturedChallenge } from "@/lib/challenges";
import { useCuratedContent } from "@/lib/content";
import { useCopy } from "@/lib/i18n";
import { paymentsEnabled } from "@/lib/payments";
import {
  dailyPrayer,
  dailyShloka,
  prayerContextForHour,
  readableSource,
  shlokaTranslation,
} from "@/lib/shlokas";
import { pickConcepts, pickStartingPractice } from "@/lib/startingPoint";
import { useSubscription } from "@/lib/subscriptions";
import { track } from "@/lib/telemetry";
import { useAppStore } from "@/store/useAppStore";
import { useStartingProfile } from "@/store/useStartingProfile";
import { colors, fonts, layout } from "@/theme/tokens";

function buildWeek() {
  const today = new Date();
  const mondayOffset = (today.getDay() + 6) % 7;
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - mondayOffset + index);
    return {
      day: date.toLocaleDateString("en-GB", { weekday: "narrow" }),
      date: String(date.getDate()),
      key: localDateKey(date),
      active: date.toDateString() === today.toDateString(),
    };
  });
}

export default function HomeScreen() {
  const router = useRouter();
  const t = useCopy();
  const { width } = useWindowDimensions();
  const displayName = useAppStore((state) => state.displayName);
  const savedIds = useAppStore((state) => state.savedIds);
  const toggleSaved = useAppStore((state) => state.toggleSaved);
  const completedTodayIds = useAppStore((state) => state.completedTodayIds);
  const completedDateKeys = useAppStore((state) => state.completedDateKeys);
  const reminderEnabled = useAppStore((state) => state.reminderEnabled);
  const startingProfile = useStartingProfile();
  const contentQuery = useCuratedContent();
  const { data: content } = contentQuery;
  const { data: subscription, isChecking: subscriptionChecking } = useSubscription();
  const { concepts, dailyReflection, festivals, practices } = content;
  const todayKey = localDateKey();
  const week = useMemo(() => buildWeek(), [todayKey]);
  const dateCircleSize = Math.min(
    48,
    Math.max(32, Math.floor((width - layout.screenPadding * 2) / 7) - 4),
  );
  const gateFree = paymentsEnabled && subscription.plan === "free";
  const availablePractices = gateFree ? practices.filter((item) => !item.isPremium) : practices;
  const availableFestivals = gateFree ? festivals.filter((item) => !item.isPremium) : festivals;
  // Onboarding answers choose today's practice (minutes offered, household
  // practice, time of day) and the two learning tiles; with no answers the
  // catalogue order stands, exactly as before.
  const practice = pickStartingPractice(availablePractices, startingProfile);
  const learningConcepts = pickConcepts(concepts, startingProfile.curiosity);
  const availableUpcomingFestivals = availableFestivals.filter(
    (item) => item.date !== null && item.date >= localDateKey(),
  );
  const festival = availableUpcomingFestivals[0];
  const [showReminder, setShowReminder] = useState(!reminderEnabled);
  const reflectionDone = completedTodayIds.includes("reflection");
  const practiceDone = completedTodayIds.includes("practice");
  const currentStreak = calculateCurrentStreak(completedDateKeys);
  const progress = (reflectionDone ? 0.5 : 0) + (practiceDone ? 0.5 : 0);
  const syncSaved = (id: string) => {
    const wasSaved = savedIds.includes(id);
    toggleSaved(id, "reflection");
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) return;
    void (wasSaved ? removeSavedItem("reflection", id) : saveItem("reflection", id)).catch(
      () => undefined,
    );
  };

  return (
    <Page>
      <View className="mb-6 flex-row items-center justify-between">
        <Pressable
          accessibilityLabel="Open profile"
          accessibilityRole="button"
          onPress={() => router.push("/profile")}
          className="h-16 w-16 items-center justify-center rounded-full bg-saffron"
        >
          <Text className="text-2xl font-semibold text-black">
            {displayName.slice(0, 1).toUpperCase()}
          </Text>
        </Pressable>
        <View className="min-w-0 flex-1 px-4">
          <Text className="text-[30px] leading-9 text-ink" style={styles.display}>
            Today's Journey
          </Text>
          <Text
            numberOfLines={2}
            className="mt-1 text-[17px] leading-[22px] text-muted"
            style={styles.display}
          >
            {dailyReflection.eyebrow}
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${currentStreak} day streak. Open the calendar`}
          onPress={() => router.push("/(tabs)/calendar")}
          className="min-h-11 flex-row items-center gap-2 rounded-full bg-surface2 px-3 py-2"
        >
          <Ionicons name="flame" size={18} color={colors.saffron} />
          <Text className="font-semibold text-ink">{currentStreak}</Text>
          <Text className="text-muted">|</Text>
          <Ionicons name="calendar" size={18} color={colors.muted} />
        </Pressable>
      </View>
      <ContentSourceNotice
        source={content.source}
        retrying={contentQuery.isFetching}
        onRetry={() => void contentQuery.refetch()}
      />

      <View className="mb-7 flex-row">
        {week.map((item) => {
          const active = item.active;
          const done = completedDateKeys.includes(item.key);
          return (
            <View
              key={`${item.day}-${item.date}`}
              className="items-center gap-2"
              style={{ width: `${100 / 7}%` }}
            >
              <Text className="text-xs font-semibold text-muted">{item.day}</Text>
              <View
                accessibilityLabel={`${item.day}, ${item.date}${active ? ", today" : done ? ", complete" : ""}`}
                style={{ width: dateCircleSize, height: dateCircleSize }}
                className={`items-center justify-center rounded-2xl border ${active ? "border-saffron bg-surface2" : done ? "border-saffron bg-warm" : "border-line bg-sand"}`}
              >
                <Text className={`text-base font-semibold ${active ? "text-ink" : "text-muted"}`}>
                  {item.date}
                </Text>
              </View>
            </View>
          );
        })}
      </View>

      <View className="mb-6">
        <View className="mb-3 flex-row items-end justify-between">
          <Text className="text-[24px] font-semibold text-ink">Progress today</Text>
          <Text className="text-[24px] font-semibold text-saffronText">
            {Math.round(progress * 100)}%
          </Text>
        </View>
        <View className="h-2.5 overflow-hidden rounded-full bg-sand">
          <LinearGradient
            colors={["#E9B949", "#D97824"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ height: "100%", width: `${progress * 100}%` }}
          />
        </View>
      </View>

      {showReminder && !reminderEnabled ? (
        <Card>
          <View className="flex-row items-center gap-3">
            <Ionicons name="notifications-outline" size={27} color={colors.saffron} />
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push("/settings")}
              className="min-w-0 flex-1"
            >
              <Text className="text-[18px] font-semibold text-ink">Get daily reminders</Text>
              <Text className="mt-1 text-[15px] text-muted">Keep your daily rhythm going</Text>
            </Pressable>
            <Pressable
              accessibilityLabel="Dismiss reminder prompt"
              accessibilityRole="button"
              onPress={() => setShowReminder(false)}
              hitSlop={10}
            >
              <Ionicons name="close" size={26} color={colors.muted} />
            </Pressable>
          </View>
        </Card>
      ) : null}

      {paymentsEnabled && subscription.plan === "free" && !subscriptionChecking ? (
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push("/subscription")}
          className="mb-2 flex-row items-center gap-3 rounded-card border border-saffron bg-warm p-4"
        >
          <Ionicons name="sparkles-outline" size={23} color={colors.saffron} />
          <View className="min-w-0 flex-1">
            <Text className="font-semibold text-ink">Go deeper with Sandhya Plus</Text>
            <Text className="mt-1 text-sm leading-5 text-muted">
              Unlock more guided practices and keep asking grounded questions.
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.saffron} />
        </Pressable>
      ) : null}

      <FeaturedChallengeCard />

      <StartingPointCard />
      <DailyPrayerCard />
      <DailyShlokaCard />

      <LinearGradient
        colors={["#D97824", "#B7663E", "#7A2F2A"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.reflectionCard}
      >
        <View className="absolute inset-0 bg-black/10" />
        <View className="mb-14 flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <Ionicons name="book-outline" size={28} color={colors.white} />
            <Text className="text-[15px] font-bold uppercase text-white">
              Your reflection • 2 min
            </Text>
          </View>
          <Pressable
            accessibilityLabel={
              savedIds.includes(dailyReflection.id) ? "Remove saved reflection" : "Save reflection"
            }
            accessibilityRole="button"
            hitSlop={10}
            onPress={() => syncSaved(dailyReflection.id)}
          >
            <Ionicons
              name={
                reflectionDone
                  ? "checkmark-circle"
                  : savedIds.includes(dailyReflection.id)
                    ? "star"
                    : "star-outline"
              }
              size={26}
              color={reflectionDone ? colors.saffron : colors.white}
            />
          </Pressable>
        </View>
        <Text className="text-[28px] font-semibold leading-[35px] text-white">
          {dailyReflection.title}
        </Text>
        <Text numberOfLines={3} className="mt-3 text-[16px] leading-6 text-[#FFF3DE]">
          {dailyReflection.body}
        </Text>
        <View className="mt-6 flex-row gap-3">
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push(`/reflection/${dailyReflection.id}`)}
            className="min-h-12 flex-1 flex-row items-center justify-center gap-2 rounded-2xl bg-[#8E442F]"
          >
            <Ionicons name="book-outline" size={21} color={colors.white} />
            <Text className="text-[18px] font-semibold text-white">
              {reflectionDone ? "Completed" : "Reflect"}
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push(`/reflection/${dailyReflection.id}`)}
            className="min-h-12 flex-1 flex-row items-center justify-center gap-2 rounded-2xl bg-[#B7663E]"
          >
            <Ionicons name="document-text-outline" size={21} color={colors.white} />
            <Text className="text-[18px] font-semibold text-white">Read</Text>
          </Pressable>
        </View>
      </LinearGradient>

      <SectionHeader title={t("todaysPractice")} />
      {practice ? (
        <PracticeRow
          practice={practice}
          completed={practiceDone}
          onPress={() => router.push(`/practice/${practice.id}`)}
        />
      ) : (
        <Card className="bg-surface">
          <Text className="font-semibold text-ink">More practices are on the way</Text>
          <Text className="mt-1 text-sm leading-5 text-muted">
            Your free starter practices are available from Journey while the reviewed catalog grows.
          </Text>
        </Card>
      )}

      <LinearGradient
        colors={["#B7663E", "#7A2F2A"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.askStrip}
      >
        <Pressable
          accessibilityRole="button"
          onPress={() =>
            router.push({
              pathname: "/(tabs)/ask",
              params: { prompt: dailyReflection.prompt },
            })
          }
          className="flex-row items-center gap-3"
        >
          <Ionicons name="create-outline" size={28} color={colors.white} />
          <View className="min-w-0 flex-1">
            <Text className="text-[12px] font-bold uppercase text-white">
              Personalized reflection • 3 min
            </Text>
            <Text numberOfLines={1} className="mt-1 text-sm text-[#F7E8D8]">
              {dailyReflection.prompt}
            </Text>
          </View>
          <Ionicons name="chevron-down" size={24} color={colors.white} />
        </Pressable>
      </LinearGradient>

      <SectionHeader
        title={t("upcoming")}
        action={t("seeAll")}
        onAction={() => router.push("/(tabs)/calendar")}
      />
      {festival ? (
        <FestivalRow festival={festival} onPress={() => router.push(`/festival/${festival.id}`)} />
      ) : (
        <Card className="bg-surface">
          <Text className="font-semibold text-ink">No local date is listed yet</Text>
          <Text className="mt-1 text-sm leading-5 text-muted">
            Browse festival explainers now; dates appear when a reviewed local calendar supplies
            them.
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push("/(tabs)/explore")}
            className="mt-3 self-start rounded-full bg-surface2 px-4 py-2.5"
          >
            <Text className="text-sm font-semibold text-plum">Browse festival guides</Text>
          </Pressable>
        </Card>
      )}

      <SectionHeader
        title={t("continueLearning")}
        action={t("seeAll")}
        onAction={() => router.push("/(tabs)/explore")}
      />
      <View className="flex-row gap-3">
        {learningConcepts.map((concept, index) => (
          <Pressable
            key={concept.id}
            accessibilityRole="button"
            onPress={() => router.push(`/concept/${concept.id}`)}
            className={`min-h-32 flex-1 rounded-[22px] border border-line p-3.5 ${index === 0 ? "bg-warm" : "bg-[#F0E6DA]"}`}
          >
            <Text className="text-2xl text-plum">{concept.sanskrit}</Text>
            <Text className="mt-auto text-[16px] font-semibold text-ink">{concept.term}</Text>
            <Text numberOfLines={2} className="mt-1 text-xs leading-4 text-muted">
              {concept.definition}
            </Text>
          </Pressable>
        ))}
      </View>
    </Page>
  );
}

// The sandhya moments the app is named for: a recited prayer for the time of
// day, drawn from morning/evening-tagged units. Renders nothing until
// prayer-tagged content is live in the bank.
function DailyPrayerCard() {
  const router = useRouter();
  const scriptPreference = useAppStore((state) => state.scriptPreference);
  const todayKey = localDateKey();
  const prayerContext = prayerContextForHour(new Date().getHours());
  const prayer = useMemo(() => dailyPrayer(prayerContext, todayKey), [prayerContext, todayKey]);
  if (!prayer) return null;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${prayerContext === "morning" ? "Morning" : "Evening"} prayer: ${prayer.textRef}`}
      onPress={() => {
        track("daily_prayer_opened", { slug: prayer.slug, context: prayerContext });
        router.push({ pathname: "/shloka/[slug]", params: { slug: prayer.slug } });
      }}
      className="mb-2 rounded-card border border-line bg-surface p-4"
    >
      <View className="flex-row items-center justify-between">
        <Text className="text-[11px] font-semibold uppercase text-saffronText">
          {prayerContext === "morning" ? "Morning" : "Evening"} prayer · {prayer.textRef}
        </Text>
        <Ionicons name="chevron-forward" size={16} color={colors.muted} />
      </View>
      <View className="mt-2">
        <VerseLines verse={prayer} preference={scriptPreference} compact numberOfLines={2} />
      </View>
      <Text className="mt-1 text-sm leading-5 text-muted" numberOfLines={2}>
        {scriptPreference === "roman" ? prayer.iast : prayer.sayIt}
      </Text>
      <Text className="mt-2 text-xs leading-4 text-muted" numberOfLines={1}>
        {readableSource(prayer.source)}
      </Text>
    </Pressable>
  );
}

function DailyShlokaCard() {
  const router = useRouter();
  const focusTags = useAppStore((state) => state.focusTags);
  const preferredTextPrefixes = useAppStore((state) => state.preferredTextPrefixes);
  const contentLanguage = useAppStore((state) => state.contentLanguage);
  const scriptPreference = useAppStore((state) => state.scriptPreference);
  const todayKey = localDateKey();
  const shloka = useMemo(
    () => dailyShloka(focusTags, todayKey, preferredTextPrefixes),
    [focusTags, todayKey, preferredTextPrefixes],
  );
  if (!shloka) return null;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Today's shloka: ${shloka.textRef}`}
      onPress={() => {
        track("daily_shloka_opened", { slug: shloka.slug });
        router.push({ pathname: "/shloka/[slug]", params: { slug: shloka.slug } });
      }}
      className="mb-2 rounded-card border border-line bg-surface p-4"
    >
      <View className="flex-row items-center justify-between">
        <Text className="text-[11px] font-semibold uppercase text-saffronText">
          Today's shloka · {shloka.textRef}
        </Text>
        <Ionicons name="chevron-forward" size={16} color={colors.muted} />
      </View>
      <View className="mt-2">
        <VerseLines verse={shloka} preference={scriptPreference} compact numberOfLines={2} />
      </View>
      <Text className="mt-1 text-sm leading-5 text-muted" numberOfLines={2}>
        {shlokaTranslation(shloka, contentLanguage)}
      </Text>
      {shloka.reflection ? (
        <Text className="mt-2 text-sm leading-5 text-plum" numberOfLines={2}>
          Carry it today: {shloka.reflection}
        </Text>
      ) : null}
      <Text className="mt-2 text-xs leading-4 text-muted" numberOfLines={1}>
        {readableSource(shloka.source)}
      </Text>
    </Pressable>
  );
}

function FeaturedChallengeCard() {
  const router = useRouter();
  const { data: challenge } = useFeaturedChallenge();
  if (!challenge) return null;

  const dayNumber =
    Math.floor(
      (new Date(`${localDateKey()}T12:00:00`).getTime() -
        new Date(`${challenge.startDate}T12:00:00`).getTime()) /
        86_400_000,
    ) + 1;
  const active = dayNumber >= 1 && dayNumber <= challenge.nights;
  const eyebrow = active
    ? `Night ${dayNumber} tonight`
    : `Starts ${new Date(`${challenge.startDate}T12:00:00`).toLocaleDateString(undefined, {
        day: "numeric",
        month: "long",
      })}`;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${challenge.title}: ${eyebrow}`}
      onPress={() =>
        router.push({ pathname: "/challenge/[slug]", params: { slug: challenge.slug } })
      }
      className="mb-2 flex-row items-center gap-3 rounded-card border border-line bg-surface p-4"
    >
      <Ionicons name="moon-outline" size={23} color={colors.plum} />
      <View className="min-w-0 flex-1">
        <Text className="text-[11px] font-semibold uppercase text-saffronText">{eyebrow}</Text>
        <Text className="mt-0.5 font-semibold text-ink">{challenge.title}</Text>
        {challenge.tagline ? (
          <Text numberOfLines={2} className="mt-1 text-sm leading-5 text-muted">
            {challenge.tagline}
          </Text>
        ) : null}
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.muted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  display: {
    fontFamily: fonts.display,
  },
  reflectionCard: {
    marginTop: 28,
    overflow: "hidden",
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "#E1B58E",
    padding: 20,
  },
  askStrip: {
    marginTop: 8,
    borderRadius: 22,
    padding: 16,
  },
});
