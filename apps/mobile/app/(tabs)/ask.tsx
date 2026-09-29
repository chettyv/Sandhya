import Ionicons from "@expo/vector-icons/Ionicons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Card, Pill, TopBar } from "@/components/ui";
import { suggestedQuestions } from "@/data/content";
import { removeSavedItem, saveItem, submitFeedback } from "@/lib/account";
import { AskRequestError, askDharma, type AskStage } from "@/lib/askDharma";
import { useCopy } from "@/lib/i18n";
import { isFeatureAvailable } from "@/lib/launchProfile";
import { useSubscription } from "@/lib/subscriptions";
import { useAppStore } from "@/store/useAppStore";
import { colors, layout } from "@/theme/tokens";

const MAX_ASK_CHARS = 1000;

function normalizePrompt(value: unknown): string {
  return typeof value === "string" ? value.trim().slice(0, MAX_ASK_CHARS) : "";
}

function askErrorTitle(error: unknown): string {
  if (!(error instanceof AskRequestError)) return "Unable to reach the source library";
  switch (error.code) {
    case "quota_exceeded":
      return "You have used today’s free questions";
    case "auth_required":
      return "Sign in to ask Dharma";
    case "rate_limited":
      return "Please slow down for a moment";
    case "monthly_budget_exceeded":
      return "Answers are paused for now";
    case "question_too_long":
      return "Please shorten your question";
    default:
      return "Unable to reach the source library";
  }
}

function askStageLabel(stage: AskStage): string {
  switch (stage) {
    case "authenticated":
      return "Securing your question…";
    case "retrieving":
      return "Checking relevant passages…";
    case "generating":
      return "Composing a grounded response…";
    case "persisting":
      return "Saving this conversation…";
    default:
      return "Looking through the source library…";
  }
}

export default function AskScreen() {
  return isFeatureAvailable("ask") ? <AskEnabledScreen /> : <AskUnavailableScreen />;
}

function AskUnavailableScreen() {
  const router = useRouter();
  return (
    <SafeAreaView
      edges={["top"]}
      className="flex-1 bg-parchment"
      style={{ flex: 1, backgroundColor: colors.parchment }}
    >
      <View className="flex-1 px-5 pt-2">
        <TopBar
          eyebrow="Core pilot"
          title="Ask is not available"
          onProfile={() => router.push("/profile")}
        />
        <Card className="mt-5">
          <Text className="text-[17px] font-semibold text-ink">
            The learning library is ready without live AI.
          </Text>
          <Text className="mt-2 text-[15px] leading-6 text-muted">
            Ask is held back until the source corpus, provider configuration, and review operation
            are ready. Your daily shloka, practices, journal, and saved items remain available.
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.back()}
            className="mt-4 self-start rounded-full bg-saffron px-4 py-2.5"
          >
            <Text className="text-sm font-semibold text-black">Back to the library</Text>
          </Pressable>
        </Card>
      </View>
    </SafeAreaView>
  );
}

function AskEnabledScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { conversationId: initialConversationId, prompt: initialPrompt } = useLocalSearchParams<{
    conversationId?: string;
    prompt?: string;
  }>();
  const t = useCopy();
  const { data: subscription, isChecking: subscriptionChecking } = useSubscription();
  const [question, setQuestion] = useState(() => normalizePrompt(initialPrompt));
  const [answerSaved, setAnswerSaved] = useState(false);
  const [answerReported, setAnswerReported] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>(initialConversationId);
  const [askStage, setAskStage] = useState<AskStage>("request");
  const [streamingText, setStreamingText] = useState("");
  const traditionPreference = useAppStore((state) => state.traditionPreference);
  const savedIds = useAppStore((state) => state.savedIds);
  const toggleSaved = useAppStore((state) => state.toggleSaved);
  const controller = useRef<AbortController | null>(null);
  const mutation = useMutation({
    mutationFn: async (value: string) => {
      controller.current?.abort();
      controller.current = new AbortController();
      return askDharma(value, controller.current.signal, {
        conversationId,
        traditionPreference:
          traditionPreference === "All traditions" ? undefined : traditionPreference.toLowerCase(),
        onStatus: setAskStage,
        onText: (text) => setStreamingText((current) => current + text),
        onReset: () => setStreamingText(""),
      });
    },
  });

  useEffect(() => {
    if (initialConversationId) setConversationId(initialConversationId);
  }, [initialConversationId]);
  useEffect(() => {
    const prompt = normalizePrompt(initialPrompt);
    if (prompt) setQuestion(prompt);
  }, [initialPrompt]);

  useEffect(() => () => controller.current?.abort(), []);
  useEffect(() => {
    if (mutation.data) {
      setConversationId(mutation.data.conversationId);
      void queryClient.invalidateQueries({ queryKey: ["conversations"] });
    }
  }, [mutation.data, queryClient]);

  const submit = () => {
    const value = question.trim();
    if (value && !mutation.isPending) {
      setAskStage("request");
      setStreamingText("");
      mutation.mutate(value);
    }
  };

  const answerIsSaved = Boolean(
    mutation.data && (answerSaved || savedIds.includes(mutation.data.messageId)),
  );

  const reportAnswer = (issueType: "incorrect" | "sectarian" | "insensitive" | "other") => {
    if (!mutation.data || answerReported) return;
    void submitFeedback(mutation.data.messageId, issueType)
      .then(() => setAnswerReported(true))
      .catch((error: unknown) =>
        Alert.alert(
          "Could not report answer",
          error instanceof Error ? error.message : "Please try again.",
        ),
      );
  };

  const openReportChoices = () => {
    if (answerReported) return;
    Alert.alert("Report this answer", "What needs attention?", [
      { text: "Incorrect or unsupported", onPress: () => reportAnswer("incorrect") },
      { text: "Too sectarian or one-sided", onPress: () => reportAnswer("sectarian") },
      { text: "Insensitive or unsafe", onPress: () => reportAnswer("insensitive") },
      { text: "Something else", onPress: () => reportAnswer("other") },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  return (
    <SafeAreaView
      edges={["top"]}
      className="flex-1 bg-parchment"
      style={{ flex: 1, backgroundColor: colors.parchment }}
    >
      <KeyboardAvoidingView
        className="flex-1"
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 0}
      >
        <ScrollView
          className="flex-1"
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: layout.screenPadding,
            paddingTop: 8,
            paddingBottom: 128,
            width: "100%",
            maxWidth: layout.maxWidth,
            alignSelf: "center",
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TopBar
            eyebrow="Grounded guidance"
            title={t("askDharma")}
            onProfile={() => router.push("/profile")}
          />

          {!mutation.data && !mutation.isPending && !mutation.isError ? (
            <>
              <View className="pb-5 pt-1">
                <View className="mb-4 h-11 w-11 items-center justify-center rounded-lg bg-[#F1E6F0]">
                  <Ionicons name="sparkles" size={22} color={colors.plum} />
                </View>
                <Text className="text-[21px] font-semibold leading-7 text-ink">
                  Bring a sincere question.
                </Text>
                <Text className="mt-1.5 text-[15px] leading-6 text-muted">
                  Explore teachings, practices, festivals, and different perspectives across Hindu
                  traditions.
                </Text>
                <Text className="mt-3 text-xs font-medium text-plum">
                  {subscriptionChecking
                    ? "Checking your plan…"
                    : subscription.plan === "free"
                      ? "Free plan · 5 grounded questions per day after sign-in"
                      : "Plus · no daily cap (fair-use safeguards apply)"}
                </Text>
              </View>
              <Text className="mb-2.5 text-sm font-semibold uppercase text-muted">Try asking</Text>
              {suggestedQuestions.map((item) => (
                <Pressable
                  key={item}
                  accessibilityRole="button"
                  onPress={() => setQuestion(item)}
                  className="mb-2 flex-row items-center gap-3 rounded-card border border-line bg-surface px-3.5 py-3"
                >
                  <Ionicons name="chatbubble-ellipses-outline" size={18} color={colors.saffron} />
                  <Text className="flex-1 text-[15px] leading-5 text-ink">{item}</Text>
                  <Ionicons name="arrow-up" size={16} color={colors.muted} />
                </Pressable>
              ))}
              <View className="mt-3 flex-row items-start gap-2 rounded-card bg-sageSoft p-3.5">
                <Ionicons name="shield-checkmark-outline" size={19} color={colors.sage} />
                <Text className="flex-1 text-sm leading-5 text-sageText">
                  {t("groundedNotice")}
                </Text>
              </View>
            </>
          ) : null}

          {mutation.isPending ? (
            <Card>
              <View className="mb-4 flex-row items-center gap-2">
                <ActivityIndicator color={colors.saffron} />
                <Text className="font-semibold text-ink">{askStageLabel(askStage)}</Text>
              </View>
              {streamingText ? (
                <Text className="text-[16px] leading-7 text-ink">{streamingText}</Text>
              ) : (
                <Text className="text-sm leading-5 text-muted">
                  Checking passages and tradition notes
                </Text>
              )}
            </Card>
          ) : null}

          {mutation.isError ? (
            <Card className="bg-roseSoft">
              <View className="flex-row items-start gap-3">
                <Ionicons name="cloud-offline-outline" size={22} color={colors.rose} />
                <View className="flex-1">
                  <Text className="font-semibold text-ink">{askErrorTitle(mutation.error)}</Text>
                  <Text className="mt-1 text-sm leading-5 text-muted">
                    {mutation.error.message}
                  </Text>
                  {mutation.error instanceof AskRequestError &&
                  mutation.error.code === "quota_exceeded" &&
                  isFeatureAvailable("payments") ? (
                    <Pressable
                      accessibilityRole="button"
                      onPress={() => router.push("/subscription")}
                      className="mt-3 self-start rounded-full bg-saffron px-4 py-2"
                    >
                      <Text className="text-sm font-semibold text-black">Explore Plus</Text>
                    </Pressable>
                  ) : null}
                  {mutation.error instanceof AskRequestError &&
                  mutation.error.code === "quota_exceeded" &&
                  !isFeatureAvailable("payments") ? (
                    <Text className="mt-3 text-sm leading-5 text-muted">
                      Additional questions are not available in the core pilot.
                    </Text>
                  ) : null}
                  {mutation.error instanceof AskRequestError &&
                  mutation.error.code === "auth_required" ? (
                    <Pressable
                      accessibilityRole="button"
                      onPress={() => router.push("/sign-in")}
                      className="mt-3 self-start rounded-full bg-saffron px-4 py-2"
                    >
                      <Text className="text-sm font-semibold text-black">Sign in</Text>
                    </Pressable>
                  ) : null}
                  {!(
                    mutation.error instanceof AskRequestError &&
                    (mutation.error.code === "auth_required" ||
                      mutation.error.code === "quota_exceeded")
                  ) ? (
                    <Pressable
                      accessibilityRole="button"
                      onPress={submit}
                      className="mt-3 self-start rounded-full border border-line px-4 py-2"
                    >
                      <Text className="text-sm font-semibold text-plum">Try again</Text>
                    </Pressable>
                  ) : null}
                </View>
              </View>
            </Card>
          ) : null}

          {mutation.data ? (
            <View>
              <View className="mb-3 self-end max-w-[88%] rounded-lg bg-aubergine px-4 py-3">
                <Text className="text-[15px] leading-6 text-white">{question}</Text>
              </View>
              <Card>
                <View className="mb-4 flex-row items-center gap-2">
                  <View className="h-8 w-8 items-center justify-center rounded-full bg-warm">
                    <Ionicons name="sparkles" size={16} color={colors.saffron} />
                  </View>
                  <Text className="font-semibold text-ink">Sandhya</Text>
                  <Pill label={mutation.data.answer.confidence} tone="sage" />
                </View>
                <Text className="text-[16px] leading-7 text-ink">
                  {mutation.data.answer.answer}
                </Text>
                <Text className="mt-3 text-sm leading-5 text-muted">
                  {mutation.data.answer.summary}
                </Text>
                {mutation.data.quota ? (
                  <Text className="mt-3 text-xs font-medium text-plum">
                    {mutation.data.quota.plan === "free"
                      ? `${mutation.data.quota.remaining ?? 0} free questions remaining today`
                      : "Plus · no daily cap (fair-use safeguards apply)"}
                  </Text>
                ) : null}
                {mutation.data.answer.safety_note ? (
                  <View className="mt-4 rounded-card bg-roseSoft p-3.5">
                    <Text className="text-sm leading-5 text-roseText">
                      {mutation.data.answer.safety_note}
                    </Text>
                  </View>
                ) : null}
                {mutation.data.answer.tradition_notes.length ? (
                  <View className="mt-5 rounded-card bg-surface2 p-3.5">
                    <Text className="mb-2 text-sm font-semibold text-plum">
                      {t("traditionNotes")}
                    </Text>
                    {mutation.data.answer.tradition_notes.map((note) => (
                      <Text key={note} className="mb-1 text-sm leading-5 text-muted">
                        • {note}
                      </Text>
                    ))}
                  </View>
                ) : null}
                {mutation.data.answer.suggested_practice ? (
                  <View className="mt-5 rounded-card bg-warm p-3.5">
                    <Text className="mb-1 text-sm font-semibold text-saffronText">
                      {t("suggestedPractice")}
                    </Text>
                    <Text className="text-sm leading-5 text-ink">
                      {mutation.data.answer.suggested_practice}
                    </Text>
                  </View>
                ) : null}
                <Text className="mb-2 mt-6 text-sm font-semibold text-ink">{t("sources")}</Text>
                {mutation.data.answer.sources.length ? (
                  mutation.data.answer.sources.map((source) => (
                    <View
                      key={`${source.title}-${source.location}`}
                      className="mb-2 rounded-card border border-line p-3"
                    >
                      <Text className="font-semibold text-ink">
                        {source.title} · {source.location}
                      </Text>
                      <Text className="mt-1 text-xs leading-4 text-muted">{source.relevance}</Text>
                    </View>
                  ))
                ) : (
                  <Text className="text-sm text-muted">
                    No relevant source was returned. Treat this answer as incomplete.
                  </Text>
                )}
                <View className="mt-4 flex-row justify-between">
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ selected: answerIsSaved }}
                    onPress={async () => {
                      try {
                        if (answerIsSaved) {
                          await removeSavedItem("message", mutation.data.messageId);
                        } else {
                          await saveItem("message", mutation.data.messageId);
                        }
                        setAnswerSaved(!answerIsSaved);
                        toggleSaved(mutation.data.messageId, "message");
                        void queryClient.invalidateQueries({ queryKey: ["saved-messages"] });
                      } catch (error) {
                        Alert.alert(
                          "Sign in required",
                          error instanceof Error
                            ? error.message
                            : "Please sign in to save this answer.",
                        );
                      }
                    }}
                    className="flex-row items-center gap-1.5"
                  >
                    <Ionicons
                      name={answerIsSaved ? "bookmark" : "bookmark-outline"}
                      size={18}
                      color={colors.plum}
                    />
                    <Text className="text-sm font-semibold text-plum">
                      {answerIsSaved ? "Saved" : "Save"}
                    </Text>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ selected: answerReported }}
                    onPress={openReportChoices}
                    className="flex-row items-center gap-1.5"
                  >
                    <Ionicons
                      name={answerReported ? "flag" : "flag-outline"}
                      size={17}
                      color={colors.muted}
                    />
                    <Text className="text-sm text-muted">
                      {answerReported ? "Reported" : t("report")}
                    </Text>
                  </Pressable>
                </View>
              </Card>
              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  mutation.reset();
                  setQuestion("");
                  setConversationId(undefined);
                  router.replace("/(tabs)/ask");
                  setAnswerSaved(false);
                  setAnswerReported(false);
                }}
                className="mt-4 items-center py-3"
              >
                <Text className="font-semibold text-saffronText">{t("newConversation")}</Text>
              </Pressable>
            </View>
          ) : null}
        </ScrollView>

        <View
          className="absolute left-0 right-0 border-t border-line bg-[#FFFDF8] px-3 pb-2.5 pt-2.5"
          style={{ bottom: layout.tabBarHeight }}
        >
          <View className="mx-auto w-full max-w-[430px] flex-row items-end gap-2 rounded-[18px] border border-line bg-surface p-2 pl-3">
            <TextInput
              accessibilityLabel={t("askPlaceholder")}
              value={question}
              onChangeText={setQuestion}
              placeholder={t("askPlaceholder")}
              placeholderTextColor={colors.muted}
              multiline
              maxLength={MAX_ASK_CHARS}
              className="max-h-28 min-h-10 flex-1 py-2 text-[15px] leading-5 text-ink"
            />
            <Pressable
              accessibilityLabel={t("send")}
              accessibilityRole="button"
              disabled={!question.trim() || mutation.isPending}
              onPress={submit}
              className={`h-11 w-11 items-center justify-center rounded-full ${question.trim() && !mutation.isPending ? "bg-saffron" : "bg-sand"}`}
            >
              <Ionicons name="arrow-up" size={20} color={colors.black} />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
