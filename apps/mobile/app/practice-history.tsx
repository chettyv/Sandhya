import { useRouter } from "expo-router";

import { PracticeRow } from "@/components/PracticeRow";
import { EmptyState, Page } from "@/components/ui";
import { useCuratedContent } from "@/lib/content";
import { paymentsEnabled } from "@/lib/payments";
import { useSubscription } from "@/lib/subscriptions";
import { useAppStore } from "@/store/useAppStore";

export default function PracticeHistoryScreen() {
  const router = useRouter();
  const completedIds = useAppStore((state) => state.completedPracticeIds);
  const { data: content } = useCuratedContent();
  const { data: subscription } = useSubscription();
  const completed = content.practices.filter(
    (practice) =>
      completedIds.includes(practice.id) &&
      (!paymentsEnabled || subscription.plan !== "free" || !practice.isPremium),
  );

  return (
    <Page>
      {completed.length ? (
        completed.map((practice) => (
          <PracticeRow
            key={practice.id}
            practice={practice}
            completed
            onPress={() => router.push(`/practice/${practice.id}`)}
          />
        ))
      ) : (
        <EmptyState
          icon="time-outline"
          title="No practices completed yet"
          body="Complete a short practice and it will appear here as part of your journey."
          action="Browse practices"
          onAction={() => router.replace("/(tabs)/explore")}
        />
      )}
    </Page>
  );
}
