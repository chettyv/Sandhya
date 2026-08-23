import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeInDown, useReducedMotion } from "react-native-reanimated";

import { useCuratedContent } from "@/lib/content";
import { startingPointFor, type StartingPoint } from "@/lib/startingPoint";
import { track } from "@/lib/telemetry";
import { useAppStore } from "@/store/useAppStore";
import { useStartingProfile } from "@/store/useStartingProfile";
import { colors } from "@/theme/tokens";

// The onboarding payoff, carried onto the home tab: the one first action the
// user's intent chose, until they open it or dismiss it. Renders nothing for
// installs that skipped the setup, so it never shows a default dressed up as
// a recommendation.
export function StartingPointCard() {
  const router = useRouter();
  const profile = useStartingProfile();
  const dismissed = useAppStore((state) => state.startingPointDismissed);
  const dismiss = useAppStore((state) => state.dismissStartingPoint);
  const { data: content } = useCuratedContent();
  const reducedMotion = useReducedMotion();

  if (!profile.intent || dismissed) return null;
  const point = startingPointFor(profile, content.practices, content.concepts);
  if (!point) return null;

  const open = () => {
    track("starting_point_opened", { kind: point.kind, intent: profile.intent });
    dismiss();
    navigate(point);
  };

  const navigate = (target: StartingPoint) => {
    switch (target.kind) {
      case "practice":
        router.push({ pathname: "/practice/[id]", params: { id: target.practice.id } });
        return;
      case "chapter":
        router.push({ pathname: "/read/[chapter]", params: { chapter: target.chapter } });
        return;
      case "concept":
        router.push({ pathname: "/concept/[id]", params: { id: target.concept.id } });
        return;
      case "shloka":
        router.push({ pathname: "/shloka/[slug]", params: { slug: target.slug } });
        return;
      case "reader":
        router.push("/read");
        return;
      default:
        router.push("/(tabs)/explore");
    }
  };

  return (
    <Animated.View
      entering={reducedMotion ? undefined : FadeInDown.delay(120).duration(420)}
      className="mb-2 flex-row items-center gap-3 rounded-card border border-saffron bg-[#FFF4E4] p-4"
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Your starting point: ${point.title}`}
        onPress={open}
        className="min-w-0 flex-1 flex-row items-center gap-3"
      >
        <Ionicons name="flag-outline" size={23} color={colors.saffron} />
        <View className="min-w-0 flex-1">
          <Text className="text-[11px] font-semibold uppercase text-saffron">
            Your starting point
          </Text>
          <Text className="mt-0.5 font-semibold text-ink">{point.title}</Text>
          <Text numberOfLines={2} className="mt-1 text-sm leading-5 text-muted">
            {point.detail}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.saffron} />
      </Pressable>
      <Pressable
        accessibilityLabel="Dismiss starting point"
        accessibilityRole="button"
        onPress={dismiss}
        hitSlop={10}
      >
        <Ionicons name="close" size={22} color={colors.muted} />
      </Pressable>
    </Animated.View>
  );
}
