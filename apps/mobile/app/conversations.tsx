import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import { EmptyState, Page, SectionHeader } from "@/components/ui";
import { useAuthState } from "@/lib/authState";
import { loadConversations } from "@/lib/conversations";
import { colors } from "@/theme/tokens";

export default function ConversationsScreen() {
  const router = useRouter();
  const authState = useAuthState();
  const conversations = useQuery({
    queryKey: ["conversations"],
    queryFn: loadConversations,
    enabled: authState === "signed_in",
    staleTime: 30_000,
    initialData: [],
  });

  if (authState === "loading")
    return (
      <Page>
        <View className="items-center py-20">
          <ActivityIndicator color={colors.saffron} />
          <Text className="mt-3 text-sm text-muted">Checking your account…</Text>
        </View>
      </Page>
    );

  if (authState === "signed_out")
    return (
      <Page>
        <EmptyState
          icon="chatbubbles-outline"
          title="Sign in to view conversations"
          body="Your grounded questions are private and sync to your account after sign-in."
          action="Sign in"
          onAction={() => router.push("/sign-in")}
        />
      </Page>
    );

  if (conversations.isError)
    return (
      <Page>
        <EmptyState
          icon="cloud-offline-outline"
          title="Could not load conversations"
          body="Your account is signed in, but conversation history is temporarily unavailable. Check your connection and try again."
          action="Try again"
          onAction={() => void conversations.refetch()}
        />
      </Page>
    );

  if (conversations.isFetching && !conversations.data.length)
    return (
      <Page>
        <View className="items-center py-20">
          <ActivityIndicator color={colors.saffron} />
          <Text className="mt-3 text-sm text-muted">Loading your questions…</Text>
        </View>
      </Page>
    );

  return (
    <Page>
      <SectionHeader title="Conversation history" />
      {conversations.data.length ? (
        <View className="gap-3">
          {conversations.data.map((conversation) => (
            <Pressable
              key={conversation.id}
              accessibilityRole="button"
              onPress={() => router.push(`/conversation/${conversation.id}`)}
              className="flex-row items-center gap-3 rounded-[22px] border border-[#302C25] bg-surface p-4"
            >
              <View className="h-11 w-11 items-center justify-center rounded-lg bg-[#F1E3E8]">
                <Ionicons name="chatbubble-ellipses-outline" size={21} color={colors.plum} />
              </View>
              <View className="min-w-0 flex-1">
                <Text className="font-semibold text-ink">{conversation.title}</Text>
                <Text numberOfLines={2} className="mt-1 text-sm leading-5 text-muted">
                  {conversation.latestQuestion ?? "Open this conversation"}
                </Text>
                <Text className="mt-1 text-xs text-muted">
                  {new Date(conversation.updatedAt).toLocaleDateString("en-GB")}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.muted} />
            </Pressable>
          ))}
        </View>
      ) : (
        <EmptyState
          icon="chatbubbles-outline"
          title="No conversations yet"
          body="Ask Dharma a grounded question and your private conversation will appear here."
          action="Ask Dharma"
          onAction={() => router.replace("/(tabs)/ask")}
        />
      )}
    </Page>
  );
}
