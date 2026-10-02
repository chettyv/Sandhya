import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Text,
  View,
} from "react-native";

import { AudioAvailability } from "@/components/AudioAvailability";
import { Card, EmptyState, Page, PrimaryButton } from "@/components/ui";
import { resolveChallengeAudio } from "@/lib/audio";
import {
  addDays,
  type ShlokaBlock,
  useChallengeOverview,
  useChallengeSession,
  useCompleteChallengeNight,
} from "@/lib/challenges";
import {
  type NightSection,
  nightProgress,
  nightSections,
  readSectionKeys,
} from "@/lib/nightProgress";
import { colors } from "@/theme/tokens";

export default function ChallengeNightScreen() {
  const { slug, night: nightParam } = useLocalSearchParams<{ slug?: string; night?: string }>();
  const night = Number(nightParam);
  const validNight = Number.isInteger(night) && night >= 1;
  const { data, isPending, isError, refetch } = useChallengeSession(slug, night);
  const { data: overview } = useChallengeOverview(slug);
  const completion = useCompleteChallengeNight(slug);

  // Endowed progress: the shloka arrives marked complete (see nightProgress),
  // and sections mark themselves read as they cross the read line on scroll.
  const [readKeys, setReadKeys] = useState<NightSection["key"][]>([]);
  const offsetsRef = useRef<Partial<Record<NightSection["key"], number>>>({});

  const session = data?.status === "ok" ? data.session : null;
  const audioAsset = session
    ? resolveChallengeAudio(session.audioPath, session.audioSlowPath, "clear")
    : null;
  const sections = useMemo(() => (session ? nightSections(session.content) : []), [session]);

  if (!validNight) {
    return (
      <Page>
        <EmptyState
          icon="moon-outline"
          title="Session not found"
          body="This session doesn't exist or isn't available yet."
          action="Back to the challenge"
          onAction={() => router.back()}
        />
      </Page>
    );
  }

  if (isPending) {
    return (
      <Page>
        <View className="items-center py-16">
          <ActivityIndicator color={colors.saffron} />
          <Text className="mt-3 text-sm text-muted">Preparing tonight's session…</Text>
        </View>
      </Page>
    );
  }

  if (isError || !data || data.status === "unavailable") {
    return (
      <Page>
        <EmptyState
          icon="cloud-offline-outline"
          title="Session unavailable"
          body="We couldn't load this session. Check your connection and try again."
          action="Try again"
          onAction={() => void refetch()}
        />
      </Page>
    );
  }

  if (data.status === "locked") {
    return (
      <Page>
        <EmptyState
          icon="lock-closed-outline"
          title={`Opens ${formatLongDate(data.unlockDate)}`}
          body="Each night opens on its own evening, so everyone moves through the challenge together."
          action="Back to the challenge"
          onAction={() => router.back()}
        />
      </Page>
    );
  }

  if (data.status !== "ok" || !session) {
    const copy = {
      auth_required: {
        title: "Sign in to continue",
        body: "Your challenge progress belongs to your account. Sign in to open tonight's session.",
        action: "Sign in",
        onAction: () => router.push("/sign-in" as const),
      },
      not_joined: {
        title: "Join to take part",
        body: "This session is part of the challenge. Join from the challenge page to open it.",
        action: "View the challenge",
        onAction: () => router.back(),
      },
      not_found: {
        title: "Session not found",
        body: "This session doesn't exist or isn't available yet.",
        action: "Back to the challenge",
        onAction: () => router.back(),
      },
    }[data.status === "ok" ? "not_found" : data.status];
    return (
      <Page>
        <EmptyState
          icon="moon-outline"
          title={copy.title}
          body={copy.body}
          action={copy.action}
          onAction={copy.onAction}
        />
      </Page>
    );
  }

  const completed = session.completed || completion.data === true;
  const totalNights = overview?.challenge.nights;
  const progress = nightProgress(sections, readKeys);
  const nextNight = overview?.sessions.find((candidate) => candidate.night === session.night + 1);
  const finalNight = totalNights !== undefined && session.night >= totalNights;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, layoutMeasurement } = event.nativeEvent;
    const read = readSectionKeys(offsetsRef.current, contentOffset.y, layoutMeasurement.height);
    setReadKeys((current) => (read.length > current.length ? read : current));
  };

  const recordOffset =
    (key: NightSection["key"]) => (event: { nativeEvent: { layout: { y: number } } }) => {
      offsetsRef.current[key] = event.nativeEvent.layout.y;
    };

  return (
    <Page onScroll={handleScroll}>
      <Text className="text-[11px] font-semibold uppercase text-saffronText">
        Night {session.night}
        {totalNights ? ` of ${totalNights}` : ""}
        {session.deityFocus ? ` · ${session.deityFocus}` : ""}
      </Text>
      <Text className="mt-1 text-[24px] font-semibold leading-8 text-ink">{session.title}</Text>
      <Text className="mt-1 text-sm text-muted">About {session.estimatedMinutes} minutes</Text>

      {!completed && sections.length > 0 ? (
        <View
          className="mt-4"
          accessible
          accessibilityRole="progressbar"
          accessibilityLabel={`Tonight's progress: ${progress.done} of ${progress.total} parts`}
          accessibilityValue={{ min: 0, max: progress.total, now: progress.done }}
        >
          <View className="h-1.5 overflow-hidden rounded-full bg-sand">
            <View
              className="h-1.5 rounded-full bg-saffron"
              style={{ width: `${Math.round(progress.ratio * 100)}%` }}
            />
          </View>
          <Text className="mt-1.5 text-xs text-muted">
            {progress.done} of {progress.total}
            {readKeys.length === 0 ? " — tonight's shloka is already in hand" : ""}
          </Text>
        </View>
      ) : null}

      <View onLayout={recordOffset("tonight")}>
        <Section title="Tonight" body={session.content.tonight} />
      </View>

      <View onLayout={recordOffset("shloka")}>
        <AudioAvailability asset={audioAsset} label="Tonight's pronunciation audio" />
        {session.content.shloka.map((block, index) => (
          <ShlokaCard key={index} block={block} endowed={index === 0} />
        ))}
      </View>

      <View onLayout={recordOffset("meaning")}>
        <Section title="Meaning" body={session.content.meaning} />
      </View>
      <View onLayout={recordOffset("practice")}>
        <Section title="Practice" body={session.content.practice} />
      </View>

      {session.content.traditionNotes ? (
        <View
          className="mt-6 border-l-2 border-l-plum pl-4"
          onLayout={recordOffset("tradition_notes")}
        >
          <Text className="text-[17px] font-semibold text-ink">Where traditions differ</Text>
          <Text className="mt-2 text-[15px] leading-7 text-ink">
            {session.content.traditionNotes}
          </Text>
        </View>
      ) : null}

      {session.content.reflection ? (
        <View onLayout={recordOffset("reflection")}>
          <Card className="mt-6">
            <Text className="text-[11px] font-semibold uppercase text-saffronText">Reflect</Text>
            <Text className="mt-2 text-[15px] leading-7 text-ink">
              {session.content.reflection}
            </Text>
          </Card>
        </View>
      ) : null}

      <View className="mt-8">
        {completed ? (
          // The night ends, and the screen says so — an explicit end state,
          // not a disabled button (02-plan.md A1/B5 v3).
          <Card className="border-l-2 border-l-sage">
            <View className="flex-row items-center gap-2">
              <Ionicons name="checkmark-circle" size={20} color={colors.sage} />
              <Text className="text-base font-semibold text-ink">
                Night {session.night} is complete.
              </Text>
            </View>
            <Text className="mt-2 text-[15px] leading-6 text-muted">
              {finalNight
                ? `That was the final night${overview ? ` of ${overview.challenge.title}` : ""}. Thank you for keeping all ${totalNights} together.`
                : `Tonight asks nothing more of you. ${
                    nextNight
                      ? `Night ${nextNight.night} opens ${formatLongDate(nextNight.unlockDate)} in the evening.`
                      : `Night ${session.night + 1} opens ${formatLongDate(addDays(session.unlockDate, 1))} in the evening.`
                  }`}
            </Text>
          </Card>
        ) : (
          <PrimaryButton
            label={completion.isPending ? "Saving…" : "Complete tonight"}
            disabled={completion.isPending || !overview}
            onPress={() => {
              if (!overview) return;
              completion.mutate({ challengeId: overview.challenge.id, night: session.night });
            }}
          />
        )}
        {completion.data === false || completion.isError ? (
          <Text className="mt-3 text-center text-sm text-roseText">
            We couldn't save that just now. Check your connection and try again.
          </Text>
        ) : null}
      </View>
    </Page>
  );
}

function Section({ title, body }: { title: string; body: string }) {
  if (!body) return null;
  return (
    <View className="mt-6">
      <Text className="text-[17px] font-semibold text-ink">{title}</Text>
      <Text className="mt-2 text-[15px] leading-7 text-ink">{body}</Text>
    </View>
  );
}

function ShlokaCard({ block, endowed }: { block: ShlokaBlock; endowed?: boolean }) {
  return (
    <Card className="mt-6">
      {endowed ? (
        <View className="mb-2 flex-row items-center gap-1.5">
          <Ionicons name="checkmark-circle" size={16} color={colors.sage} />
          <Text className="text-xs font-semibold uppercase text-sageText">
            In hand from the start
          </Text>
        </View>
      ) : null}
      <Text className="text-[19px] leading-9 text-ink">{block.devanagari}</Text>
      {block.iast ? (
        <Text className="mt-2 text-[15px] leading-6 text-muted">{block.iast}</Text>
      ) : null}
      {block.sayIt ? (
        <Text className="mt-3 text-[16px] font-semibold leading-7 text-ink">{block.sayIt}</Text>
      ) : null}
      {block.meaning ? (
        <Text className="mt-3 text-[15px] leading-6 text-ink">{block.meaning}</Text>
      ) : null}
      {block.source ? (
        <Text className="mt-3 text-xs leading-5 text-muted">{block.source}</Text>
      ) : null}
    </Card>
  );
}

function formatLongDate(dateKey: string): string {
  const [year = 0, month = 1, day = 1] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
  });
}
