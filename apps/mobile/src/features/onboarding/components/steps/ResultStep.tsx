import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, FadeInDown, useReducedMotion } from "react-native-reanimated";

import { buildProfile, summaryRows } from "../../engine";
import type { OnboardingAnswers, StepId } from "../../types";
import { StepLayout } from "../OnboardingShell";

import { PrimaryButton, SecondaryButton } from "@/components/ui";
import { VerseLines } from "@/components/VerseLines";
import { useCuratedContent } from "@/lib/content";
import { dailyShloka, shlokaTranslation } from "@/lib/shlokas";
import { startingPointFor } from "@/lib/startingPoint";
import { colors } from "@/theme/tokens";

// The payoff. Not a loader and not a recap of defaults: the actual verse the
// profile produces for today, rendered the way the reader asked for it with
// its source named; the first thing to do, chosen by intent; and every
// consumed answer with a way to change it. Then the app.
export function Result({
  answers,
  finishing,
  onBegin,
  onSaveToAccount,
  onChange,
}: {
  answers: OnboardingAnswers;
  finishing: boolean;
  onBegin: () => void;
  onSaveToAccount: () => void;
  onChange: (stepId: StepId) => void;
}) {
  const reducedMotion = useReducedMotion();
  const { data: content } = useCuratedContent();
  const profile = useMemo(() => buildProfile(answers), [answers]);
  const shloka = useMemo(
    () => dailyShloka(profile.focusTags, undefined, profile.preferredTextPrefixes),
    [profile.focusTags, profile.preferredTextPrefixes],
  );
  const startingPoint = useMemo(
    () =>
      startingPointFor(
        {
          intent: profile.intent,
          practiceMinutes: profile.practiceMinutes,
          startingText: profile.startingText,
          curiosity: profile.curiosity,
          householdPractices: profile.householdPractices,
          reminderEnabled: profile.reminderEnabled,
          reminderTime: profile.reminderTime,
        },
        content.practices,
        content.concepts,
      ),
    [profile, content.practices, content.concepts],
  );
  const rows = summaryRows(answers);
  const name = profile.displayName !== "Friend" ? profile.displayName : null;
  const enter = (delay: number) =>
    reducedMotion ? FadeIn.duration(120) : FadeInDown.delay(delay).duration(340);

  return (
    <StepLayout
      eyebrow="Your starting point"
      title={name ? `${name}, your space is ready.` : "Your space is ready."}
      subtitle="Built from your answers — here is today, as you will see it."
      footer={
        <View style={styles.footer}>
          <PrimaryButton
            label={finishing ? "Setting up your space…" : "Begin"}
            icon={finishing ? undefined : "arrow-forward"}
            disabled={finishing}
            onPress={onBegin}
          />
          <SecondaryButton
            label="Save this to an account"
            icon="person-outline"
            disabled={finishing}
            onPress={onSaveToAccount}
          />
        </View>
      }
    >
      {shloka ? (
        <Animated.View entering={enter(120)} style={styles.card}>
          <Text className="text-[11px] font-semibold uppercase text-saffron">
            Today's verse · {shloka.textRef}
          </Text>
          <View style={styles.cardBody}>
            <VerseLines verse={shloka} preference={profile.scriptPreference} numberOfLines={4} />
          </View>
          <Text className="mt-3 text-[15px] leading-6 text-ink" numberOfLines={4}>
            {shlokaTranslation(shloka, profile.contentLanguage)}
          </Text>
          <Text className="mt-3 text-xs leading-5 text-muted">{shloka.source}</Text>
        </Animated.View>
      ) : null}

      {startingPoint ? (
        <Animated.View entering={enter(300)} style={[styles.card, styles.startCard]}>
          <Text className="text-[11px] font-semibold uppercase text-saffron">Start here</Text>
          <Text className="mt-2 text-[20px] font-semibold leading-7 text-ink">
            {startingPoint.title}
          </Text>
          <Text className="mt-1 text-[15px] leading-6 text-muted">{startingPoint.detail}</Text>
        </Animated.View>
      ) : null}

      {rows.length > 0 ? (
        <Animated.View entering={enter(460)} style={styles.summary}>
          <Text className="mb-1 text-[11px] font-semibold uppercase text-saffron">
            What you told us
          </Text>
          {rows.map((row) => (
            <Pressable
              key={row.stepId}
              accessibilityRole="button"
              accessibilityLabel={`${row.label}: ${row.value}. Change`}
              onPress={() => onChange(row.stepId)}
              style={({ pressed }) => [styles.row, pressed && styles.pressed]}
            >
              <View style={styles.rowText}>
                <Text className="text-[13px] text-muted">{row.label}</Text>
                <Text className="mt-0.5 text-[16px] font-semibold text-ink">{row.value}</Text>
              </View>
              <Text className="text-sm font-semibold text-plum">Change</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.plum} />
            </Pressable>
          ))}
        </Animated.View>
      ) : null}
    </StepLayout>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 16,
    backgroundColor: colors.paper,
    padding: 18,
  },
  cardBody: {
    marginTop: 10,
  },
  startCard: {
    marginTop: 12,
    backgroundColor: "#FFF4E4",
    borderColor: "#F1D9B8",
  },
  summary: {
    marginTop: 24,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    minHeight: 56,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  rowText: {
    flex: 1,
    minWidth: 0,
  },
  pressed: {
    opacity: 0.72,
  },
  footer: {
    gap: 10,
  },
});
