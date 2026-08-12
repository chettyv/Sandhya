import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import { Card, EmptyState, Page, Pill, PrimaryButton } from "@/components/ui";
import { localDateKey } from "@/lib/activity";
import { useAuthState } from "@/lib/authState";
import { type ChallengeSessionMeta, useChallengeOverview } from "@/lib/challenges";
import { colors } from "@/theme/tokens";

// Real social proof only: below this the row is omitted entirely — no fake floor.
const MIN_VISIBLE_PARTICIPANTS = 25;

export default function ChallengeOverviewScreen() {
  const { slug } = useLocalSearchParams<{ slug?: string }>();
  const { data, isPending, isError, refetch } = useChallengeOverview(slug);
  const authState = useAuthState();

  if (isPending) {
    return (
      <Page>
        <View className="items-center py-16">
          <ActivityIndicator color={colors.saffron} />
          <Text className="mt-3 text-sm text-muted">Loading the challenge…</Text>
        </View>
      </Page>
    );
  }

  if (isError || !data) {
    return (
      <Page>
        <EmptyState
          icon="cloud-offline-outline"
          title="Challenge unavailable"
          body="We couldn't load this challenge. Check your connection and try again."
          action="Try again"
          onAction={() => void refetch()}
        />
      </Page>
    );
  }

  const { challenge, sessions, joined, completedNights, participantCount } = data;
  const today = localDateKey();
  const dateRange = formatDateRange(challenge.startDate, challenge.nights);
  const tonight = joined
    ? [...sessions]
        .reverse()
        .find((session) => session.unlockDate <= today && !completedNights.includes(session.night))
    : undefined;

  return (
    <Page>
      <Text className="text-[11px] font-semibold uppercase text-saffron">{dateRange}</Text>
      <Text className="mt-1 text-[26px] font-semibold leading-8 text-ink">{challenge.title}</Text>
      {challenge.tagline ? (
        <Text className="mt-2 text-[15px] leading-6 text-muted">{challenge.tagline}</Text>
      ) : null}

      {participantCount >= MIN_VISIBLE_PARTICIPANTS ? (
        <View className="mt-3">
          <Pill
            icon="people-outline"
            label={`${participantCount} people have joined`}
            tone="sage"
          />
        </View>
      ) : null}

      {joined && tonight ? (
        <Card className="mt-5 border-l-2 border-l-saffron" onPress={() => openNight(slug, tonight)}>
          <Text className="text-[11px] font-semibold uppercase text-saffron">
            Tonight · Night {tonight.night} of {challenge.nights}
          </Text>
          <Text className="mt-1 text-lg font-semibold text-ink">{tonight.title}</Text>
          <Text className="mt-1 text-sm text-muted">About {tonight.estimatedMinutes} minutes</Text>
        </Card>
      ) : null}

      <View className="mt-5">
        {sessions.length === 0 ? (
          <EmptyState
            icon="moon-outline"
            title="Sessions coming soon"
            body="The nightly sessions for this challenge are still being prepared."
          />
        ) : (
          <Card>
            {sessions.map((session) => (
              <NightRow
                key={session.night}
                session={session}
                joined={joined}
                today={today}
                completed={completedNights.includes(session.night)}
                isTonight={tonight?.night === session.night}
                onPress={() => openNight(slug, session)}
              />
            ))}
          </Card>
        )}
      </View>

      {!joined ? (
        <View className="mt-6">
          {challenge.priceDisplay ? (
            <Text className="mb-2 text-center text-[15px] text-ink">
              One-off {challenge.priceDisplay} · yours for every year it returns
            </Text>
          ) : null}
          {/* The purchase step lands with the payment-rail decision
              (docs/00-your-actions.md #1). Challenges stay unpublished until
              then, so the signed-in branch is reachable only in development. */}
          {authState === "signed_in" ? (
            <Card>
              <Text className="text-center text-[15px] leading-6 text-muted">
                Joining opens shortly before the challenge begins.
              </Text>
            </Card>
          ) : (
            <PrimaryButton
              label="Sign in to join"
              icon="arrow-forward"
              onPress={() => router.push("/sign-in")}
            />
          )}
          <Text className="mt-3 text-center text-sm leading-5 text-muted">
            You'll need about 10 quiet minutes a night. Refunds are one email — no questions, within
            14 days.
          </Text>
        </View>
      ) : null}
    </Page>
  );
}

function NightRow({
  session,
  joined,
  today,
  completed,
  isTonight,
  onPress,
}: {
  session: ChallengeSessionMeta;
  joined: boolean;
  today: string;
  completed: boolean;
  isTonight: boolean;
  onPress: () => void;
}) {
  const unlocked = session.unlockDate <= today;
  const openable = joined && unlocked;
  return (
    <Pressable
      accessibilityRole={openable ? "button" : undefined}
      accessibilityLabel={`Night ${session.night}: ${session.title}${
        unlocked ? "" : `, opens ${formatShortDate(session.unlockDate)}`
      }`}
      disabled={!openable}
      onPress={onPress}
      className="min-h-14 flex-row items-center gap-3 border-b border-[#302C25] py-3 last:border-b-0"
      style={({ pressed }) => pressed && openable && { opacity: 0.72 }}
    >
      <View
        className={`h-9 w-9 items-center justify-center rounded-full ${
          completed ? "bg-sageSoft" : isTonight ? "bg-[#4A3514]" : "bg-[#24211D]"
        }`}
      >
        {completed ? (
          <Ionicons name="checkmark" size={18} color={colors.sage} />
        ) : unlocked ? (
          <Text className="text-sm font-semibold text-ink">{session.night}</Text>
        ) : (
          <Ionicons name="lock-closed-outline" size={16} color={colors.muted} />
        )}
      </View>
      <View className="min-w-0 flex-1">
        <Text className={`text-[15px] font-semibold ${unlocked ? "text-ink" : "text-muted"}`}>
          {session.title}
        </Text>
        <Text className="mt-0.5 text-sm text-muted">
          {unlocked
            ? `${session.deityFocus || `Night ${session.night}`} · ${session.estimatedMinutes} min`
            : `Opens ${formatShortDate(session.unlockDate)}`}
        </Text>
      </View>
      {openable ? <Ionicons name="chevron-forward" size={18} color={colors.muted} /> : null}
    </Pressable>
  );
}

function openNight(slug: string | undefined, session: ChallengeSessionMeta) {
  if (!slug) return;
  router.push({
    pathname: "/challenge/[slug]/night/[night]",
    params: { slug, night: String(session.night) },
  });
}

function formatShortDate(dateKey: string): string {
  const [year = 0, month = 1, day = 1] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
  });
}

function formatDateRange(startDate: string, nights: number): string {
  const [year = 0, month = 1, day = 1] = startDate.split("-").map(Number);
  const start = new Date(year, month - 1, day);
  const end = new Date(year, month - 1, day + nights - 1);
  const sameMonth = start.getMonth() === end.getMonth();
  const startLabel = start.toLocaleDateString(undefined, {
    day: "numeric",
    month: sameMonth ? undefined : "short",
  });
  const endLabel = end.toLocaleDateString(undefined, { day: "numeric", month: "short" });
  return `${startLabel}–${endLabel} · ${nights} nights`;
}
