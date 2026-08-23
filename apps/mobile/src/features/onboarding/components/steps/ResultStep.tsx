import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useMemo, useState, type ComponentProps } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeInUp,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

import { buildProfile, summaryRows } from "../../engine";
import type { OnboardingAnswers, StepId } from "../../types";
import { FlowButton } from "../FlowButton";
import { EASE_OUT } from "../motion";
import { StepLayout } from "../OnboardingShell";
import { useStepPhase } from "../StepTransition";

import { VerseLines } from "@/components/VerseLines";
import { useCuratedContent } from "@/lib/content";
import { dailyShloka, shlokaTranslation } from "@/lib/shlokas";
import { startingPointFor } from "@/lib/startingPoint";
import { colors } from "@/theme/tokens";

type IconName = ComponentProps<typeof Ionicons>["name"];

// The payoff. Not a loader and not a recap of defaults: the actual verse the
// profile produces for today, rendered the way the reader asked for it with
// its source named; the first thing to do, chosen by intent; and every
// consumed answer with a way to change it. The verse card settles into
// place and a single gold light passes over it. Then the app.
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
  const phase = useStepPhase();
  const animate = !reducedMotion && phase === "active";
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

  const [cardWidth, setCardWidth] = useState(0);
  const settle = useSharedValue(animate ? 0 : 1);
  const shimmer = useSharedValue(0);

  useEffect(() => {
    if (!animate) {
      settle.value = 1;
      return;
    }
    settle.value = withDelay(
      260,
      withTiming(1, { duration: 520, easing: Easing.out(Easing.cubic) }),
    );
    shimmer.value = withDelay(
      900,
      withTiming(1, { duration: 1100, easing: Easing.inOut(Easing.quad) }),
    );
  }, [animate, settle, shimmer]);

  const verseCardStyle = useAnimatedStyle(() => ({
    opacity: settle.value,
    transform: [{ translateY: (1 - settle.value) * 22 }, { scale: 0.965 + settle.value * 0.035 }],
  }));
  const shimmerStyle = useAnimatedStyle(() => ({
    opacity: shimmer.value === 0 || shimmer.value === 1 ? 0 : 0.75,
    transform: [{ translateX: -120 + shimmer.value * (cardWidth + 240) }, { rotate: "12deg" }],
  }));

  const enter = (delay: number) =>
    animate
      ? FadeInUp.delay(delay).duration(420).easing(EASE_OUT)
      : reducedMotion
        ? FadeIn.duration(120)
        : undefined;

  return (
    <StepLayout
      eyebrow="Your starting point"
      title={name ? `${name}, your space is ready.` : "Your space is ready."}
      subtitle="Built from your answers — here is today, as you will see it."
      footer={
        <View style={styles.footer}>
          <FlowButton
            label={finishing ? "Setting up your space…" : "Begin"}
            icon={finishing ? undefined : "arrow-forward"}
            disabled={finishing}
            onPress={onBegin}
          />
          <FlowButton
            label="Save this to an account"
            icon="person-outline"
            variant="ghost"
            disabled={finishing}
            onPress={onSaveToAccount}
          />
        </View>
      }
    >
      {shloka ? (
        <Animated.View
          style={[styles.card, styles.verseCard, verseCardStyle]}
          onLayout={(event) => setCardWidth(event.nativeEvent.layout.width)}
        >
          <LinearGradient
            colors={["#FFFFFF", "#FFF9EF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <Animated.View pointerEvents="none" style={[styles.shimmer, shimmerStyle]}>
            <LinearGradient
              colors={["rgba(233,185,73,0)", "rgba(233,185,73,0.55)", "rgba(233,185,73,0)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
          <View style={styles.cardHeader}>
            <View style={styles.eyebrowDot} />
            <Text className="text-[11px] font-semibold uppercase tracking-[1px] text-saffron">
              Today's verse · {shloka.textRef}
            </Text>
          </View>
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
        <Animated.View entering={enter(520)} style={[styles.card, styles.startCard]}>
          <View style={styles.startIcon}>
            <Ionicons name="flag-outline" size={20} color={colors.black} />
          </View>
          <View style={styles.startText}>
            <Text className="text-[11px] font-semibold uppercase tracking-[1px] text-saffron">
              Start here
            </Text>
            <Text className="mt-1 text-[20px] font-semibold leading-7 text-ink">
              {startingPoint.title}
            </Text>
            <Text className="mt-1 text-[15px] leading-6 text-muted">{startingPoint.detail}</Text>
          </View>
        </Animated.View>
      ) : null}

      {rows.length > 0 ? (
        <Animated.View entering={enter(700)} style={styles.summary}>
          <Text className="mb-1 text-[11px] font-semibold uppercase tracking-[1px] text-saffron">
            What you told us
          </Text>
          {rows.map((row, index) => (
            <Animated.View key={row.stepId} entering={enter(780 + index * 70)}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`${row.label}: ${row.value}. Change`}
                onPress={() => onChange(row.stepId)}
                style={({ pressed }) => [styles.row, pressed && styles.pressed]}
              >
                {row.icon ? (
                  <View style={styles.rowIcon}>
                    <Ionicons name={row.icon as IconName} size={17} color={colors.plum} />
                  </View>
                ) : null}
                <View style={styles.rowText}>
                  <Text className="text-[13px] text-muted">{row.label}</Text>
                  <Text className="mt-0.5 text-[16px] font-semibold text-ink">{row.value}</Text>
                </View>
                <Text className="text-sm font-semibold text-plum">Change</Text>
                <Ionicons name="chevron-forward" size={16} color={colors.plum} />
              </Pressable>
            </Animated.View>
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
    borderRadius: 20,
    backgroundColor: colors.paper,
    padding: 18,
    overflow: "hidden",
    ...Platform.select({
      web: { boxShadow: "0 6px 24px rgba(90, 46, 34, 0.10)" },
      default: {
        shadowColor: colors.aubergine,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
        elevation: 3,
      },
    }),
  },
  verseCard: {
    borderColor: "#F1D9B8",
  },
  shimmer: {
    position: "absolute",
    top: -40,
    bottom: -40,
    width: 120,
    left: 0,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  eyebrowDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.saffron,
  },
  cardBody: {
    marginTop: 12,
  },
  startCard: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: "#FFF4E4",
    borderColor: "#F1D9B8",
  },
  startIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.saffron,
    alignItems: "center",
    justifyContent: "center",
  },
  startText: {
    flex: 1,
    minWidth: 0,
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
  rowIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: colors.sand,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 4,
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
