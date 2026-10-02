import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  View,
} from "react-native";

import { PremiumGate } from "@/components/PremiumGate";
import { Card, EmptyState, LoadingState, Page, Pill, PrimaryButton } from "@/components/ui";
import { saveJournalEntry, syncSavedItem } from "@/lib/account";
import { useCuratedContent } from "@/lib/content";
import { paymentsEnabled } from "@/lib/payments";
import { useSubscription } from "@/lib/subscriptions";
import { useAppStore } from "@/store/useAppStore";
import { colors } from "@/theme/tokens";

export default function ReflectionDetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [entry, setEntry] = useState("");
  const [recorded, setRecorded] = useState(false);
  const [savedSynced, setSavedSynced] = useState(false);
  const savedIds = useAppStore((state) => state.savedIds);
  const toggleSaved = useAppStore((state) => state.toggleSaved);
  const completeToday = useAppStore((state) => state.completeToday);
  const { data: content, isFetching } = useCuratedContent();
  const requestedReflection = content.dailyReflections.find((item) => item.id === id);
  const { data: subscription, isChecking: subscriptionChecking } = useSubscription();
  if (!requestedReflection && isFetching)
    return (
      <Page>
        <LoadingState label="Loading reflection…" />
      </Page>
    );
  if (!requestedReflection)
    return (
      <Page>
        <EmptyState
          icon="book-outline"
          title="Reflection unavailable"
          body="This reflection is no longer available in the current library. Return to Today to continue with the current reflection."
        />
      </Page>
    );
  const dailyReflection = requestedReflection;
  if (dailyReflection.isPremium && paymentsEnabled && subscriptionChecking)
    return (
      <Page>
        <View className="items-center py-20">
          <ActivityIndicator color={colors.saffron} />
          <Text className="mt-3 text-sm text-muted">Checking your Plus access…</Text>
        </View>
      </Page>
    );
  if (dailyReflection.isPremium && paymentsEnabled && subscription.plan === "free")
    return (
      <Page>
        <Text className="text-2xl font-semibold text-ink">{dailyReflection.title}</Text>
        <PremiumGate />
      </Page>
    );
  const saved = savedIds.includes(dailyReflection.id);

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Page>
        <Pill label={dailyReflection.eyebrow} icon="book-outline" tone="warm" />
        <Text className="mt-5 text-[30px] font-semibold leading-[40px] text-ink">
          {dailyReflection.title}
        </Text>
        <View className="my-6 h-px bg-line" />
        <Text className="text-[17px] leading-8 text-ink">{dailyReflection.body}</Text>

        <Card className="mt-7 bg-surface2">
          <View className="mb-3 flex-row items-center gap-2">
            <Ionicons name="sparkles-outline" size={18} color={colors.saffron} />
            <Text className="font-semibold text-saffronText">Carry this into the day</Text>
          </View>
          <Text className="text-[16px] leading-6 text-ink">{dailyReflection.practicePrompt}</Text>
        </Card>

        <Text className="mb-3 mt-8 text-xl font-semibold text-ink">A private reflection</Text>
        <Text className="mb-3 text-sm leading-5 text-muted">{dailyReflection.prompt}</Text>
        <TextInput
          accessibilityLabel="Journal response"
          value={entry}
          onChangeText={setEntry}
          placeholder="Write without judging what comes up…"
          placeholderTextColor={colors.muted}
          multiline
          textAlignVertical="top"
          className="min-h-36 rounded-lg border border-line bg-surface p-4 text-[15px] leading-6 text-ink"
        />
        {recorded ? (
          <Text className="mt-2 text-sm font-medium text-sageText">
            {savedSynced
              ? "Saved to your private journal and synced to your account."
              : "Saved privately on this device."}
          </Text>
        ) : null}

        <View className="mt-5 gap-3">
          <PrimaryButton
            label={recorded ? "Reflection saved" : "Save to journal"}
            icon={recorded ? "checkmark" : "journal-outline"}
            disabled={!entry.trim() || recorded}
            onPress={() => {
              void saveJournalEntry(entry, "Thoughtful")
                .then((result) => {
                  setRecorded(true);
                  setSavedSynced(result.synced);
                  completeToday("reflection");
                  if (!result.synced)
                    Alert.alert(
                      "Saved on this device",
                      "Sign in to sync this reflection across devices.",
                    );
                })
                .catch((error: unknown) =>
                  Alert.alert(
                    "Could not save reflection",
                    error instanceof Error ? error.message : "Please try again.",
                  ),
                );
            }}
          />
          <PrimaryButton
            label={saved ? "Remove from saved" : "Save reflection"}
            icon={saved ? "bookmark" : "bookmark-outline"}
            onPress={() => {
              const next = !saved;
              toggleSaved(dailyReflection.id, "reflection");
              void syncSavedItem("reflection", dailyReflection.id, next).catch(() => undefined);
            }}
          />
        </View>

        <View className="mt-7 flex-row items-start gap-2 rounded-card bg-surface2 p-4">
          <Ionicons name="information-circle-outline" size={19} color={colors.plum} />
          <Text className="flex-1 text-sm leading-5 text-muted">
            This reflection is curated content inspired by a teaching theme; it is not a replacement
            for reading the source in context.
          </Text>
        </View>
      </Page>
    </KeyboardAvoidingView>
  );
}
