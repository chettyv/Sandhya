import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Text, View } from "react-native";

import { PremiumGate } from "@/components/PremiumGate";
import { Card, EmptyState, Page, Pill, PrimaryButton, SecondaryButton } from "@/components/ui";
import { syncSavedItem } from "@/lib/account";
import { useCuratedContent } from "@/lib/content";
import {
  cancelFestivalReminder,
  hasFestivalReminder,
  scheduleFestivalReminder,
} from "@/lib/notifications";
import { paymentsEnabled } from "@/lib/payments";
import { useSubscription } from "@/lib/subscriptions";
import { useAppStore } from "@/store/useAppStore";
import { colors } from "@/theme/tokens";

const RECKONING_LABEL = {
  amanta: "Amānta",
  purnimanta: "Pūrṇimānta",
  solar: "Solar",
  other: "Other calendar",
} as const;

export default function FestivalDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: content } = useCuratedContent();
  const festivals = content.festivals;
  const requestedFestival = festivals.find((item) => item.id === id);
  const festival = requestedFestival ?? festivals[0];
  const { data: subscription, isChecking: subscriptionChecking } = useSubscription();
  const savedIds = useAppStore((state) => state.savedIds);
  const toggleSaved = useAppStore((state) => state.toggleSaved);
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderBusy, setReminderBusy] = useState(false);

  useEffect(() => {
    if (!requestedFestival) {
      setReminderEnabled(false);
      return;
    }
    void hasFestivalReminder(requestedFestival.id)
      .then(setReminderEnabled)
      .catch(() => setReminderEnabled(false));
  }, [requestedFestival]);

  const changeReminder = async () => {
    if (!requestedFestival || !requestedFestival.date || reminderBusy) return;
    setReminderBusy(true);
    try {
      if (reminderEnabled) {
        await cancelFestivalReminder(requestedFestival.id);
        setReminderEnabled(false);
      } else {
        const result = await scheduleFestivalReminder({
          id: requestedFestival.id,
          name: requestedFestival.name,
          date: requestedFestival.date,
        });
        if (!result.enabled) {
          Alert.alert("Festival reminder unavailable", result.reason ?? "Please try again.");
        } else {
          setReminderEnabled(true);
        }
      }
    } catch (error) {
      Alert.alert(
        "Could not update reminder",
        error instanceof Error ? error.message : "Please try again.",
      );
    } finally {
      setReminderBusy(false);
    }
  };

  if (!requestedFestival || !festival)
    return (
      <Page>
        <EmptyState
          icon="calendar-outline"
          title="Festival unavailable"
          body="This festival is not available in the current library or on your current plan."
        />
        <PremiumGate />
      </Page>
    );
  if (festival.isPremium && paymentsEnabled && subscriptionChecking)
    return (
      <Page>
        <View className="items-center py-20">
          <ActivityIndicator color={colors.saffron} />
          <Text className="mt-3 text-sm text-muted">Checking your Plus access…</Text>
        </View>
      </Page>
    );
  if (festival.isPremium && paymentsEnabled && subscription.plan === "free")
    return (
      <Page>
        <Text className="text-2xl font-semibold text-ink">{festival.name}</Text>
        <PremiumGate />
      </Page>
    );
  const saved = savedIds.includes(festival.id);
  // A date is only ever present together with its reckoning (lib/content).
  const reckoning = festival.date ? (festival.dateReckoning ?? null) : null;
  const hasDate = Boolean(festival.date && reckoning);

  return (
    <Page>
      <View
        className="items-center rounded-[30px] px-6 py-9"
        style={{ backgroundColor: `${festival.color}18` }}
      >
        <View className="h-16 w-16 items-center justify-center rounded-card bg-warm">
          <Text className="text-xs font-bold uppercase" style={{ color: colors.saffronText }}>
            {festival.monthLabel}
          </Text>
          <Text className="text-2xl font-bold" style={{ color: colors.saffronText }}>
            {festival.dayLabel}
          </Text>
        </View>
        <Text className="mt-5 text-center text-[28px] font-semibold text-ink">{festival.name}</Text>
        {festival.variant ? (
          <Text className="mt-1 text-sm text-muted">Also known as {festival.variant}</Text>
        ) : null}
        <View className="mt-4">
          <Pill
            label={
              hasDate && reckoning
                ? `${RECKONING_LABEL[reckoning.system]} · ${reckoning.location}`
                : "Local date not calculated"
            }
            icon={reckoning ? "calendar-outline" : "location-outline"}
            tone="warm"
          />
        </View>
      </View>

      {hasDate ? (
        <Card className="mt-4 bg-surface2">
          <View className="flex-row items-start gap-3">
            <Ionicons name="calendar-outline" size={21} color={colors.plum} />
            <View className="flex-1">
              <Text className="font-semibold text-plum">How this date is reckoned</Text>
              {reckoning ? (
                <View className="mt-1.5 gap-1">
                  <Text className="text-sm leading-5 text-muted">
                    Calendar: {RECKONING_LABEL[reckoning.system]}
                  </Text>
                  {reckoning.community ? (
                    <Text className="text-sm leading-5 text-muted">
                      Observed by: {reckoning.community}
                    </Text>
                  ) : null}
                  <Text className="text-sm leading-5 text-muted">
                    Timing computed for: {reckoning.location}
                  </Text>
                  <Text className="text-sm leading-5 text-muted">Source: {reckoning.source}</Text>
                  {reckoning.disagreement ? (
                    <Text className="mt-1 text-sm leading-5 text-roseText">
                      Sources disagree: {reckoning.disagreement}
                    </Text>
                  ) : null}
                </View>
              ) : (
                <Text className="mt-1.5 text-sm leading-5 text-muted">
                  This date does not yet record its calendar system (amānta or pūrṇimānta), the
                  observing community, the location it was computed for, or its source. Confirm with
                  a local panchang or temple before observing.
                </Text>
              )}
            </View>
          </View>
        </Card>
      ) : null}

      <Text className="mb-3 mt-8 text-xl font-semibold text-ink">Meaning</Text>
      <Text className="text-[16px] leading-7 text-ink">{festival.meaning}</Text>

      <Text className="mb-3 mt-8 text-xl font-semibold text-ink">A simple home observance</Text>
      <Card>
        {festival.observance.map((item, index) => (
          <View key={item} className="mb-4 flex-row gap-3 last:mb-0">
            <View className="h-7 w-7 items-center justify-center rounded-full bg-warm">
              <Text className="text-xs font-bold text-saffronText">{index + 1}</Text>
            </View>
            <Text className="flex-1 text-[15px] leading-6 text-ink">{item}</Text>
          </View>
        ))}
      </Card>

      <Card className="mt-5 bg-surface2">
        <View className="flex-row items-start gap-3">
          <Ionicons name="git-branch-outline" size={21} color={colors.plum} />
          <View className="flex-1">
            <Text className="font-semibold text-plum">Tradition and regional variation</Text>
            <Text className="mt-1.5 text-sm leading-5 text-muted">{festival.variationNote}</Text>
          </View>
        </View>
      </Card>

      <View className="mt-6">
        <SecondaryButton
          label={
            !hasDate
              ? "Local date not calculated"
              : reminderBusy
                ? "Updating reminder…"
                : reminderEnabled
                  ? "Remove reminder"
                  : "Remind me on this date"
          }
          icon={reminderEnabled ? "notifications" : "notifications-outline"}
          disabled={!hasDate || reminderBusy}
          onPress={() => void changeReminder()}
        />
      </View>
      <View className="mt-3">
        <PrimaryButton
          label={saved ? "Remove from saved" : "Save festival"}
          icon={saved ? "bookmark" : "bookmark-outline"}
          onPress={() => {
            const next = !saved;
            toggleSaved(festival.id, "festival");
            void syncSavedItem("festival", festival.id, next).catch(() => undefined);
          }}
        />
      </View>
    </Page>
  );
}
