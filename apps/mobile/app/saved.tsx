import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { FlatList, Pressable, Text } from "react-native";

import { Card, EmptyState, LoadingState, Page } from "@/components/ui";
import { useAuthState } from "@/lib/authState";
import { useCuratedContent } from "@/lib/content";
import { loadSavedMessages } from "@/lib/conversations";
import { ConceptRow } from "@/screens/saved/ConceptRow";
import { useAppStore } from "@/store/useAppStore";

export default function SavedScreen() {
  const router = useRouter();
  const authState = useAuthState();
  const savedIds = useAppStore((state) => state.savedIds);
  const { data: content } = useCuratedContent();
  const savedMessages = useQuery({
    queryKey: ["saved-messages"],
    queryFn: loadSavedMessages,
    enabled: authState === "signed_in",
    staleTime: 30_000,
    initialData: [],
  });
  const { concepts, dailyReflections, deities, festivals, practices, texts } = content;
  const items = [
    ...dailyReflections
      .filter((item) => savedIds.includes(item.id))
      .map((item) => ({
        id: item.id,
        title: item.title,
        subtitle: "Daily reflection",
        icon: "sunny-outline" as const,
        route: `/reflection/${item.id}` as const,
      })),
    ...concepts
      .filter((item) => savedIds.includes(item.id))
      .map((item) => ({
        id: item.id,
        title: item.term,
        subtitle: item.definition,
        icon: "bulb-outline" as const,
        route: `/concept/${item.id}` as const,
      })),
    ...deities
      .filter((item) => savedIds.includes(item.id))
      .map((item) => ({
        id: item.id,
        title: item.name,
        subtitle: item.shortDescription,
        icon: "heart-outline" as const,
        route: `/deity/${item.id}` as const,
      })),
    ...festivals
      .filter((item) => savedIds.includes(item.id))
      .map((item) => ({
        id: item.id,
        title: item.name,
        subtitle: item.summary,
        icon: "calendar-outline" as const,
        route: `/festival/${item.id}` as const,
      })),
    ...practices
      .filter((item) => savedIds.includes(item.id))
      .map((item) => ({
        id: item.id,
        title: item.title,
        subtitle: item.summary,
        icon: "leaf-outline" as const,
        route: `/practice/${item.id}` as const,
      })),
    ...texts
      .filter((item) => savedIds.includes(item.id))
      .map((item) => ({
        id: item.id,
        title: item.title,
        subtitle: item.description,
        icon: "book-outline" as const,
        route: `/text/${item.id}` as const,
      })),
    ...savedMessages.data.map((message) => ({
      id: message.id,
      title: "Saved Ask Dharma answer",
      subtitle: message.summary ?? message.content,
      icon: "sparkles-outline" as const,
      route: `/conversation/${message.conversationId}` as const,
    })),
  ];

  const remoteError = authState === "signed_in" && savedMessages.isError;
  const remoteLoading =
    authState === "signed_in" && savedMessages.isFetching && !savedMessages.data.length;
  return (
    <Page scroll={false}>
      <FlatList
        data={items}
        keyExtractor={(item) => `${item.id}-${item.subtitle}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 8 }}
        ListHeaderComponent={
          remoteError ? (
            <Card className="mb-4 bg-roseSoft">
              <Text className="font-semibold text-ink">
                Saved Ask answers are temporarily unavailable
              </Text>
              <Text className="mt-1 text-sm leading-5 text-muted">
                Your other saved items remain available. Check your connection and try again.
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Retry loading saved answers"
                onPress={() => void savedMessages.refetch()}
                className="mt-3 self-start rounded-full bg-surface2 px-4 py-2.5"
              >
                <Text className="text-sm font-semibold text-plum">Try again</Text>
              </Pressable>
            </Card>
          ) : null
        }
        renderItem={({ item }) => <ConceptRow {...item} onPress={() => router.push(item.route)} />}
        ListEmptyComponent={
          remoteLoading ? (
            <LoadingState label="Loading your saved answers…" />
          ) : remoteError ? (
            <EmptyState
              icon="cloud-offline-outline"
              title="Saved items are unavailable"
              body="We couldn't load your saved items. Check your connection and try again."
              action="Try again"
              onAction={() => void savedMessages.refetch()}
            />
          ) : (
            <EmptyState
              icon="bookmark-outline"
              title="Nothing saved yet"
              body="Save a reflection, concept, deity, sacred text, festival, practice, or Ask Dharma answer and it will wait here for you."
              action="Explore the library"
              onAction={() => router.replace("/(tabs)/explore")}
            />
          )
        }
      />
    </Page>
  );
}
