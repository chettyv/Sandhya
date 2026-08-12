import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";

import { ContentSourceNotice } from "@/components/ContentSourceNotice";
import { Card, ListRow, Page, SectionHeader, TopBar } from "@/components/ui";
import { calculateCurrentStreak, loadActivityDates } from "@/lib/account";
import { useCuratedContent } from "@/lib/content";
import { useCopy } from "@/lib/i18n";
import { paymentsEnabled } from "@/lib/payments";
import { useSubscription } from "@/lib/subscriptions";
import { useAppStore } from "@/store/useAppStore";
import { colors } from "@/theme/tokens";

export default function JourneyScreen() {
  const router = useRouter();
  const t = useCopy();
  const savedCount = useAppStore((state) => state.savedIds.length);
  const completedPracticeIds = useAppStore((state) => state.completedPracticeIds);
  const completedDateKeys = useAppStore((state) => state.completedDateKeys);
  const displayName = useAppStore((state) => state.displayName);
  const [activityDates, setActivityDates] = useState<string[]>([]);

  useEffect(() => {
    void loadActivityDates()
      .then(setActivityDates)
      .catch(() => undefined);
  }, []);
  const currentStreak = calculateCurrentStreak(
    activityDates.length ? activityDates : completedDateKeys,
  );
  const activitySet = new Set(activityDates.length ? activityDates : completedDateKeys);
  const today = new Date();
  const monday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - ((today.getDay() + 6) % 7),
  );
  const weekKeys = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + index);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  });
  const { data: content } = useCuratedContent();
  const { data: subscription } = useSubscription();
  const practices = content.practices.filter(
    (item) => !paymentsEnabled || subscription.plan !== "free" || !item.isPremium,
  );
  const completedCount = completedPracticeIds.filter((id) =>
    practices.some((practice) => practice.id === id),
  ).length;
  const nextPractice =
    practices[0] ?? content.practices.find((item) => !item.isPremium) ?? content.practices[0];

  return (
    <Page>
      <TopBar eyebrow="Your space" title={t("journey")} onProfile={() => router.push("/profile")} />
      <ContentSourceNotice source={content.source} />

      <Card>
        <View className="flex-row items-center gap-3">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-aubergine">
            <Text className="text-2xl font-semibold text-white">
              {displayName.slice(0, 1).toUpperCase()}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="text-[17px] font-semibold text-ink">
              A gentle practice, {displayName}
            </Text>
            <Text className="mt-1 text-sm leading-5 text-muted">{t("noPressure")}</Text>
          </View>
        </View>
        <View className="mt-4 flex-row gap-2">
          <View className="flex-1 rounded-card bg-surface2 p-3">
            <Text className="text-2xl font-bold text-plum">{completedCount}</Text>
            <Text className="mt-1 text-xs font-medium text-muted">Practices completed</Text>
          </View>
          <View className="flex-1 rounded-card bg-surface2 p-3">
            <Text className="text-2xl font-bold text-saffron">{currentStreak}</Text>
            <Text className="mt-1 text-xs font-medium text-muted">Day streak</Text>
          </View>
          <View className="flex-1 rounded-card bg-surface2 p-3">
            <Text className="text-2xl font-bold text-sage">{savedCount}</Text>
            <Text className="mt-1 text-xs font-medium text-muted">Items saved</Text>
          </View>
        </View>
      </Card>

      <SectionHeader title="This week" />
      <View className="flex-row justify-between rounded-card border border-[#302C25] bg-surface p-3.5">
        {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => {
          const active = activitySet.has(weekKeys[index]);
          return (
            <View key={`${day}-${index}`} className="items-center gap-2">
              <Text className="text-xs font-medium text-muted">{day}</Text>
              <View
                className={`h-9 w-9 items-center justify-center rounded-full ${active ? "bg-sageSoft" : "bg-surface2"}`}
              >
                {active ? (
                  <Ionicons name="leaf" size={16} color={colors.sage} />
                ) : (
                  <View className="h-1.5 w-1.5 rounded-full bg-[#6B645D]" />
                )}
              </View>
            </View>
          );
        })}
      </View>

      <SectionHeader title="Your journey" />
      <Card>
        <ListRow
          icon="book-outline"
          title="Shloka bank"
          subtitle="Verses with pronunciation, word meanings, and sources"
          onPress={() => router.push("/shlokas")}
        />
        <ListRow
          icon="bookmark-outline"
          title={t("savedItems")}
          subtitle={`${savedCount} saved for later`}
          onPress={() => router.push("/saved")}
        />
        <ListRow
          icon="journal-outline"
          title={t("journal")}
          subtitle="Private reflections and prompts"
          onPress={() => router.push("/journal")}
        />
        <ListRow
          icon="chatbubbles-outline"
          title="Conversation history"
          subtitle="Your private Ask Dharma questions"
          onPress={() => router.push("/conversations")}
        />
        <ListRow
          icon="time-outline"
          title="Practice history"
          subtitle={`${completedCount} of ${practices.length} available practices completed`}
          onPress={() => router.push("/practice-history")}
        />
      </Card>

      <SectionHeader title="Continue gently" />
      {nextPractice ? (
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push(`/practice/${nextPractice.id}`)}
          className="flex-row items-center gap-3 rounded-card bg-aubergine p-4"
        >
          <View className="h-10 w-10 items-center justify-center rounded-lg bg-[#FFFFFF18]">
            <Ionicons name="play" size={20} color={colors.gold} />
          </View>
          <View className="flex-1">
            <Text className="text-base font-semibold text-white">{nextPractice.title}</Text>
            <Text className="mt-1 text-sm text-[#DCCEDF]">{nextPractice.summary}</Text>
          </View>
          <Ionicons name="arrow-forward" size={20} color={colors.white} />
        </Pressable>
      ) : (
        <Card className="bg-surface">
          <Text className="font-semibold text-ink">Your next practice is being prepared</Text>
          <Text className="mt-1 text-sm leading-5 text-muted">
            Check back soon for a new guided practice.
          </Text>
        </Card>
      )}
    </Page>
  );
}
