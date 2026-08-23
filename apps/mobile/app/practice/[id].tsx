import Ionicons from "@expo/vector-icons/Ionicons";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import { PremiumGate } from "@/components/PremiumGate";
import { Card, EmptyState, Page, Pill, PrimaryButton } from "@/components/ui";
import { recordPracticeCompletion, syncSavedItem } from "@/lib/account";
import { useCuratedContent } from "@/lib/content";
import { paymentsEnabled } from "@/lib/payments";
import { useSubscription } from "@/lib/subscriptions";
import { useAppStore } from "@/store/useAppStore";
import { colors } from "@/theme/tokens";

export default function PracticeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: content } = useCuratedContent();
  const practices = content.practices;
  const requestedPractice = practices.find((item) => item.id === id);
  const practice = requestedPractice ?? practices[0];
  const { data: subscription, isChecking: subscriptionChecking } = useSubscription();
  const [activeStep, setActiveStep] = useState(0);
  const steps = practice
    ? practice.steps.length
      ? practice.steps
      : ["This practice is being prepared."]
    : ["This practice is being prepared."];
  const completedIds = useAppStore((state) => state.completedPracticeIds);
  const completePractice = useAppStore((state) => state.completePractice);
  const completeToday = useAppStore((state) => state.completeToday);
  const savedIds = useAppStore((state) => state.savedIds);
  const toggleSaved = useAppStore((state) => state.toggleSaved);
  const completed = practice ? completedIds.includes(practice.id) : false;
  if (!requestedPractice || !practice)
    return (
      <Page>
        <EmptyState
          icon="leaf-outline"
          title="Practice unavailable"
          body="This practice is not available in the current library or on your current plan."
        />
        <PremiumGate />
      </Page>
    );
  if (practice.isPremium && paymentsEnabled && subscriptionChecking)
    return (
      <Page>
        <View className="items-center py-20">
          <ActivityIndicator color={colors.saffron} />
          <Text className="mt-3 text-sm text-muted">Checking your Plus access…</Text>
        </View>
      </Page>
    );
  if (practice.isPremium && paymentsEnabled && subscription.plan === "free")
    return (
      <Page>
        <Text className="text-2xl font-semibold text-ink">{practice.title}</Text>
        <PremiumGate />
      </Page>
    );
  const atEnd = activeStep === steps.length - 1;

  const next = () => {
    void Haptics.selectionAsync();
    if (atEnd) {
      completePractice(practice.id);
      completeToday("practice");
      void recordPracticeCompletion(practice.id).catch(() => undefined);
    } else setActiveStep((value) => value + 1);
  };

  return (
    <Page>
      <View className="rounded-[30px] bg-aubergine p-7">
        <View className="mb-5 h-12 w-12 items-center justify-center rounded-lg bg-[#FFF3DE40]">
          <Ionicons
            name={
              practice.category === "Puja"
                ? "flame-outline"
                : practice.category === "Reflection"
                  ? "journal-outline"
                  : "leaf-outline"
            }
            size={24}
            color={colors.gold}
          />
        </View>
        <Text className="text-[29px] font-semibold leading-9 text-white">{practice.title}</Text>
        <Text className="mt-3 text-[15px] leading-6 text-[#FFF3DE]">{practice.summary}</Text>
        <View className="mt-5 flex-row gap-2">
          <Pill label={`${practice.durationMinutes} min`} icon="time-outline" tone="warm" />
          <Pill label={practice.level} tone="sage" />
        </View>
      </View>

      {practice.materials?.length ? (
        <Card className="mt-5 bg-surface2">
          <View className="flex-row items-start gap-3">
            <Ionicons name="bag-outline" size={21} color={colors.plum} />
            <View className="flex-1">
              <Text className="font-semibold text-plum">What you may need</Text>
              {practice.materials.map((material) => (
                <Text key={material} className="mt-1 text-sm leading-5 text-muted">
                  • {material}
                </Text>
              ))}
            </View>
          </View>
        </Card>
      ) : null}

      <View className="mt-7 flex-row items-center justify-between">
        <Text className="text-xl font-semibold text-ink">Guided steps</Text>
        <Text className="text-sm font-semibold text-muted">
          {activeStep + 1} of {steps.length}
        </Text>
      </View>
      <View className="my-4 h-1.5 overflow-hidden rounded-full bg-sand">
        <View
          className="h-full rounded-full bg-saffron"
          style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
        />
      </View>

      <Card>
        <View className="mb-5 h-10 w-10 items-center justify-center rounded-full bg-[#FFF1D6]">
          <Text className="font-bold text-saffron">{activeStep + 1}</Text>
        </View>
        <Text className="text-xl font-semibold leading-8 text-ink">{steps[activeStep]}</Text>
        <View className="mt-8 flex-row gap-3">
          {activeStep > 0 ? (
            <Pressable
              accessibilityRole="button"
              onPress={() => setActiveStep((value) => value - 1)}
              className="h-11 w-11 items-center justify-center rounded-lg border border-line"
            >
              <Ionicons name="arrow-back" size={20} color={colors.plum} />
            </Pressable>
          ) : null}
          <View className="flex-1">
            <PrimaryButton
              label={atEnd ? (completed ? "Complete again" : "Complete practice") : "Next step"}
              icon={atEnd && completed ? "refresh" : atEnd ? "checkmark" : "arrow-forward"}
              onPress={next}
            />
          </View>
        </View>
      </Card>

      {completed ? (
        <View className="mt-5 items-center rounded-card bg-sageSoft p-5">
          <Ionicons name="leaf" size={28} color={colors.sage} />
          <Text className="mt-2 text-lg font-semibold text-ink">Practice complete</Text>
          <Text className="mt-1 text-center text-sm text-muted">
            Carry the quality of this pause into what comes next.
          </Text>
        </View>
      ) : null}

      {practice.traditionNote ? (
        <Card className="mt-5 bg-surface2">
          <View className="flex-row items-start gap-3">
            <Ionicons name="information-circle-outline" size={21} color={colors.plum} />
            <View className="flex-1">
              <Text className="font-semibold text-plum">Tradition note</Text>
              <Text className="mt-1 text-sm leading-5 text-muted">{practice.traditionNote}</Text>
            </View>
          </View>
        </Card>
      ) : null}
      {practice.warnings ? (
        <View className="mt-4 flex-row items-start gap-2 rounded-card bg-roseSoft p-4">
          <Ionicons name="warning-outline" size={19} color={colors.rose} />
          <Text className="flex-1 text-sm leading-5 text-rose">{practice.warnings}</Text>
        </View>
      ) : null}
      <View className="mt-5">
        <PrimaryButton
          label={savedIds.includes(practice.id) ? "Remove from saved" : "Save practice"}
          icon={savedIds.includes(practice.id) ? "bookmark" : "bookmark-outline"}
          onPress={() => {
            const next = !savedIds.includes(practice.id);
            toggleSaved(practice.id, "practice");
            void syncSavedItem("practice", practice.id, next).catch(() => undefined);
          }}
        />
      </View>
      {practice.category === "Puja" && !practice.warnings ? (
        <View className="mt-4 flex-row items-start gap-2 rounded-card bg-roseSoft p-4">
          <Ionicons name="warning-outline" size={19} color={colors.rose} />
          <Text className="flex-1 text-sm leading-5 text-rose">
            Never leave a flame unattended. Use a stable, heat-safe surface and keep it away from
            children, pets, fabrics, and draughts.
          </Text>
        </View>
      ) : null}
    </Page>
  );
}
