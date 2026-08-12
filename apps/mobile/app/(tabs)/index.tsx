import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { ContentSourceNotice } from "@/components/ContentSourceNotice";
import { FestivalRow } from "@/components/FestivalRow";
import { PracticeRow } from "@/components/PracticeRow";
import { Card, Page, SectionHeader } from "@/components/ui";
import { calculateCurrentStreak, localDateKey, removeSavedItem, saveItem } from "@/lib/account";
import { useFeaturedChallenge } from "@/lib/challenges";
import { useCuratedContent } from "@/lib/content";
import { useCopy } from "@/lib/i18n";
import { paymentsEnabled } from "@/lib/payments";
import { dailyShloka, shlokaTranslation } from "@/lib/shlokas";
import { useSubscription } from "@/lib/subscriptions";
import { useAppStore } from "@/store/useAppStore";
import { colors } from "@/theme/tokens";

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
  const displayName = useAppStore((state) => state.displayName);
  const savedIds = useAppStore((state) => state.savedIds);
  const toggleSaved = useAppStore((state) => state.toggleSaved);
  const completedTodayIds = useAppStore((state) => state.completedTodayIds);
  const completedDateKeys = useAppStore((state) => state.completedDateKeys);
  const reminderEnabled = useAppStore((state) => state.reminderEnabled);
  const { data: content } = useCuratedContent();
  const { data: subscription, isChecking: subscriptionChecking } = useSubscription();
  const { concepts, dailyReflection, festivals, practices } = content;
  const week = buildWeek();
  const gateFree = paymentsEnabled && subscription.plan === "free";
  const availablePractices = gateFree ? practices.filter((item) => !item.isPremium) : practices;
  const availableFestivals = gateFree ? festivals.filter((item) => !item.isPremium) : festivals;
  const practice = availablePractices[0];
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
          <Text numberOfLines={1} className="mt-1 text-[21px] text-muted" style={styles.display}>
            {dailyReflection.eyebrow}
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push("/(tabs)/calendar")}
          className="flex-row items-center gap-2 rounded-full bg-surface2 px-3 py-2"
        >
          <Ionicons name="flame" size={18} color={colors.saffron} />
          <Text className="font-semibold text-ink">{currentStreak}</Text>
          <Text className="text-muted">|</Text>
          <Ionicons name="calendar" size={18} color={colors.muted} />
        </Pressable>
      </View>
      <ContentSourceNotice source={content.source} />

      <View className="mb-7 flex-row justify-between">
        {week.map((item) => {
          const active = item.active;
          const done = completedDateKeys.includes(item.key);
          return (
            <View key={`${item.day}-${item.date}`} className="items-center gap-2">
              <Text className="text-xs font-semibold text-muted">{item.day}</Text>
              <View
                className={`h-12 w-12 items-center justify-center rounded-2xl border ${active ? "border-white" : done ? "border-saffron bg-[#3A2C10]" : "border-[#5A5755] bg-[#242424]"}`}
              >
                <Text className={`text-base font-semibold ${active ? "text-white" : "text-muted"}`}>
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
          <Text className="text-[24px] font-semibold text-saffron">
            {Math.round(progress * 100)}%
          </Text>
        </View>
        <View className="h-2.5 overflow-hidden rounded-full bg-white">
          <LinearGradient
            colors={["#FFE85B", "#FF9B4A"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ height: "100%", width: `${progress * 100}%` }}
          />
        </View>
      </View>

      {showReminder && !reminderEnabled ? (
        <Card>
          <View className="flex-row items-center gap-3">
            <Ionicons name="notifications-outline" size={27} color={colors.white} />
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
              <Ionicons name="close" size={26} color={colors.white} />
            </Pressable>
          </View>
        </Card>
      ) : null}

      {paymentsEnabled && subscription.plan === "free" && !subscriptionChecking ? (
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push("/subscription")}
          className="mb-2 flex-row items-center gap-3 rounded-card border border-saffron bg-[#3E3413] p-4"
        >
          <Ionicons name="sparkles-outline" size={23} color={colors.saffron} />
          <View className="min-w-0 flex-1">
            <Text className="font-semibold text-ink">Go deeper with Dharma Daily Plus</Text>
            <Text className="mt-1 text-sm leading-5 text-muted">
              Unlock more guided practices and keep asking grounded questions.
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.saffron} />
        </Pressable>
      ) : null}

      <FeaturedChallengeCard />

      <DailyShlokaCard />

      <LinearGradient
        colors={["#6E4A1E", "#142E34", "#0B0B0A"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.reflectionCard}
      >
        <View className="absolute inset-0 bg-black/20" />
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
        <Text numberOfLines={3} className="mt-3 text-[16px] leading-6 text-[#E9E2D8]">
          {dailyReflection.body}
        </Text>
        <View className="mt-6 flex-row gap-3">
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push(`/reflection/${dailyReflection.id}`)}
            className="min-h-12 flex-1 flex-row items-center justify-center gap-2 rounded-2xl bg-[#514D46]"
          >
            <Ionicons name="book-outline" size={21} color={colors.white} />
            <Text className="text-[18px] font-semibold text-white">
              {reflectionDone ? "Completed" : "Reflect"}
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push(`/reflection/${dailyReflection.id}`)}
            className="min-h-12 flex-1 flex-row items-center justify-center gap-2 rounded-2xl bg-[#5E8178]"
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
        colors={["#2B0B3B", "#18051E"]}
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
            } as never)
          }
          className="flex-row items-center gap-3"
        >
          <Ionicons name="create-outline" size={28} color={colors.white} />
          <View className="min-w-0 flex-1">
            <Text className="text-[15px] font-bold uppercase text-white">
              Personalized reflection • 3 min
            </Text>
            <Text numberOfLines={1} className="mt-1 text-sm text-[#D7CDD9]">
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
        {concepts.slice(0, 2).map((concept, index) => (
          <Pressable
            key={concept.id}
            accessibilityRole="button"
            onPress={() => router.push(`/concept/${concept.id}`)}
            className={`min-h-32 flex-1 rounded-[22px] border border-[#302C25] p-3.5 ${index === 0 ? "bg-[#2C2230]" : "bg-[#1F332B]"}`}
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

function DailyShlokaCard() {
  const router = useRouter();
  const focusTags = useAppStore((state) => state.focusTags);
  const contentLanguage = useAppStore((state) => state.contentLanguage);
  const shloka = dailyShloka(focusTags);
  if (!shloka) return null;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Today's shloka: ${shloka.textRef}`}
      onPress={() => router.push({ pathname: "/shloka/[slug]", params: { slug: shloka.slug } })}
      className="mb-2 rounded-card border border-[#302C25] bg-surface p-4"
    >
      <View className="flex-row items-center justify-between">
        <Text className="text-[11px] font-semibold uppercase text-saffron">
          Today's shloka · {shloka.textRef}
        </Text>
        <Ionicons name="chevron-forward" size={16} color={colors.muted} />
      </View>
      <Text className="mt-2 text-[17px] leading-8 text-ink" numberOfLines={2}>
        {shloka.devanagari}
      </Text>
      <Text className="mt-1 text-sm leading-5 text-muted" numberOfLines={2}>
        {shlokaTranslation(shloka, contentLanguage)}
      </Text>
      {shloka.reflection ? (
        <Text className="mt-2 text-sm leading-5 text-plum" numberOfLines={2}>
          Carry it today: {shloka.reflection}
        </Text>
      ) : null}
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
      className="mb-2 flex-row items-center gap-3 rounded-card border border-[#302C25] bg-surface p-4"
    >
      <Ionicons name="moon-outline" size={23} color={colors.plum} />
      <View className="min-w-0 flex-1">
        <Text className="text-[11px] font-semibold uppercase text-saffron">{eyebrow}</Text>
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
    fontFamily: "Georgia",
  },
  reflectionCard: {
    marginTop: 28,
    overflow: "hidden",
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "#403C36",
    padding: 20,
  },
  askStrip: {
    marginTop: 8,
    borderRadius: 22,
    padding: 16,
  },
});
