import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";

import { Card, EmptyState, LoadingState, Page, Pill, PrimaryButton } from "@/components/ui";
import { removeSavedItem, saveItem } from "@/lib/account";
import { useAuthState } from "@/lib/authState";
import { loadConversationMessages } from "@/lib/conversations";
import { useAppStore } from "@/store/useAppStore";
import { colors } from "@/theme/tokens";

export default function ConversationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const authState = useAuthState();
  const savedIds = useAppStore((state) => state.savedIds);
  const toggleSaved = useAppStore((state) => state.toggleSaved);
  const messages = useQuery({
    queryKey: ["conversation-messages", id],
    queryFn: () => loadConversationMessages(id ?? ""),
    enabled: Boolean(id) && authState === "signed_in",
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
          icon="lock-closed-outline"
          title="Sign in to view this conversation"
          body="Your grounded questions are private and sync to your account after sign-in."
          action="Sign in"
          onAction={() => router.push("/sign-in")}
        />
      </Page>
    );

  if (messages.isFetching && !messages.data.length)
    return (
      <Page>
        <LoadingState label="Loading conversation…" />
      </Page>
    );

  if (messages.isError)
    return (
      <Page>
        <EmptyState
          icon="cloud-offline-outline"
          title="Could not load this conversation"
          body="Your account is signed in, but this conversation is temporarily unavailable. Check your connection and try again."
          action="Try again"
          onAction={() => void messages.refetch()}
        />
      </Page>
    );

  if (!messages.data.length)
    return (
      <Page>
        <EmptyState
          icon="chatbubble-ellipses-outline"
          title="Conversation unavailable"
          body="This conversation could not be loaded from your account."
        />
      </Page>
    );

  return (
    <Page scroll={false}>
      <FlatList
        data={messages.data}
        keyExtractor={(message) => message.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 8 }}
        ListHeaderComponent={
          <View className="mb-5 flex-row items-center gap-3">
            <Ionicons name="shield-checkmark-outline" size={22} color={colors.sage} />
            <Text className="flex-1 text-sm leading-5 text-muted">
              This is your private conversation history. Answers may be incomplete and should be
              read with their source and tradition notes.
            </Text>
          </View>
        }
        renderItem={({ item: message }) =>
          message.role === "user" ? (
            <View className="mb-4 self-end max-w-[90%] rounded-lg bg-aubergine px-4 py-3">
              <Text className="text-[15px] leading-6 text-white">{message.content}</Text>
            </View>
          ) : (
            <Card className="mb-4">
              <View className="mb-3 flex-row items-center gap-2">
                <Ionicons name="sparkles" size={17} color={colors.saffron} />
                <Text className="font-semibold text-ink">Sandhya</Text>
                {message.confidence ? <Pill label={message.confidence} tone="sage" /> : null}
              </View>
              <Text className="text-[16px] leading-7 text-ink">{message.content}</Text>
              {message.summary ? (
                <Text className="mt-3 text-sm leading-5 text-muted">{message.summary}</Text>
              ) : null}
              {message.safetyNote ? (
                <View className="mt-4 rounded-card bg-roseSoft p-3.5">
                  <Text className="text-sm leading-5 text-roseText">{message.safetyNote}</Text>
                </View>
              ) : null}
              {message.traditionNotes.length ? (
                <View className="mt-4 rounded-card bg-surface2 p-3">
                  <Text className="mb-1 text-xs font-semibold uppercase tracking-wider text-plum">
                    Tradition notes
                  </Text>
                  {message.traditionNotes.map((note, index) => (
                    <Text
                      key={`${message.id}-note-${index}`}
                      className="mt-1 text-sm leading-5 text-muted"
                    >
                      • {note}
                    </Text>
                  ))}
                </View>
              ) : null}
              {message.sourceCount ? (
                <View className="mt-3 rounded-card bg-surface2 p-3">
                  <Text className="text-xs font-semibold text-plum">
                    {message.sourceCount} source{message.sourceCount === 1 ? "" : "s"} retrieved
                  </Text>
                  {message.sourceTitles.map((title, index) => (
                    <Text key={`${title}-${index}`} className="mt-1 text-xs leading-4 text-muted">
                      {title}
                    </Text>
                  ))}
                </View>
              ) : null}
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected: savedIds.includes(message.id) }}
                onPress={() => {
                  const saved = savedIds.includes(message.id);
                  toggleSaved(message.id, "message");
                  void (
                    saved ? removeSavedItem("message", message.id) : saveItem("message", message.id)
                  )
                    .then(() => {
                      void queryClient.invalidateQueries({ queryKey: ["saved-messages"] });
                    })
                    .catch(() => {
                      toggleSaved(message.id, "message");
                    });
                }}
                className="mt-4 flex-row items-center gap-2 self-start"
              >
                <Ionicons
                  name={savedIds.includes(message.id) ? "bookmark" : "bookmark-outline"}
                  size={18}
                  color={colors.plum}
                />
                <Text className="text-sm font-semibold text-plum">
                  {savedIds.includes(message.id) ? "Remove from saved" : "Save answer"}
                </Text>
              </Pressable>
            </Card>
          )
        }
        ListFooterComponent={
          <PrimaryButton
            label="Ask a follow-up"
            icon="sparkles"
            onPress={() => router.push({ pathname: "/(tabs)/ask", params: { conversationId: id } })}
          />
        }
      />
    </Page>
  );
}
