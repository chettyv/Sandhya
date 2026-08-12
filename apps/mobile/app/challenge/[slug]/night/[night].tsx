import { router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Text, View } from "react-native";

import { Card, EmptyState, Page, PrimaryButton } from "@/components/ui";
import {
  type ShlokaBlock,
  useChallengeOverview,
  useChallengeSession,
  useCompleteChallengeNight,
} from "@/lib/challenges";
import { colors } from "@/theme/tokens";

export default function ChallengeNightScreen() {
  const { slug, night: nightParam } = useLocalSearchParams<{ slug?: string; night?: string }>();
  const night = Number(nightParam);
  const validNight = Number.isInteger(night) && night >= 1;
  const { data, isPending, isError, refetch } = useChallengeSession(slug, night);
  const { data: overview } = useChallengeOverview(slug);
  const completion = useCompleteChallengeNight(slug);

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

  if (data.status !== "ok") {
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
    }[data.status];
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

  const session = data.session;
  const completed = session.completed || completion.data === true;
  const totalNights = overview?.challenge.nights;

  return (
    <Page>
      <Text className="text-[11px] font-semibold uppercase text-saffron">
        Night {session.night}
        {totalNights ? ` of ${totalNights}` : ""}
        {session.deityFocus ? ` · ${session.deityFocus}` : ""}
      </Text>
      <Text className="mt-1 text-[24px] font-semibold leading-8 text-ink">{session.title}</Text>
      <Text className="mt-1 text-sm text-muted">About {session.estimatedMinutes} minutes</Text>

      <Section title="Tonight" body={session.content.tonight} />

      {session.content.shloka.map((block, index) => (
        <ShlokaCard key={index} block={block} />
      ))}

      <Section title="Meaning" body={session.content.meaning} />
      <Section title="Practice" body={session.content.practice} />

      {session.content.traditionNotes ? (
        <View className="mt-6 border-l-2 border-l-plum pl-4">
          <Text className="text-[17px] font-semibold text-ink">Where traditions differ</Text>
          <Text className="mt-2 text-[15px] leading-7 text-ink">
            {session.content.traditionNotes}
          </Text>
        </View>
      ) : null}

      {session.content.reflection ? (
        <Card className="mt-6">
          <Text className="text-[11px] font-semibold uppercase text-saffron">Reflect</Text>
          <Text className="mt-2 text-[15px] leading-7 text-ink">{session.content.reflection}</Text>
        </Card>
      ) : null}

      <View className="mt-8">
        {completed ? (
          <View className="flex-row items-center justify-center gap-2 py-3">
            <Text className="text-base font-semibold text-sage">
              Night {session.night} complete
            </Text>
          </View>
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
        {completion.data === false ? (
          <Text className="mt-3 text-center text-sm text-rose">
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

function ShlokaCard({ block }: { block: ShlokaBlock }) {
  return (
    <Card className="mt-6">
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
