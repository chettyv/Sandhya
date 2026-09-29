import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

import { Card, EmptyState, LoadingState, Page, PrimaryButton } from "@/components/ui";
import { deleteJournalEntry, saveJournalEntry, syncLocalJournalEntries } from "@/lib/account";
import { readLocalJournal, GUEST_JOURNAL_SCOPE } from "@/lib/localJournalStorage";
import { supabase } from "@/lib/supabase";
import { colors } from "@/theme/tokens";

type Entry = { id: string; text: string; mood: string; date: string };
type JournalRow = { id: string; entry: string; mood: string | null; date: string };
const moods = ["Peaceful", "Grateful", "Thoughtful", "Heavy"];

export default function JournalScreen() {
  const [draft, setDraft] = useState("");
  const [mood, setMood] = useState("Thoughtful");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [composing, setComposing] = useState(false);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "stale" | "error">("loading");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const session = supabase ? (await supabase.auth.getSession()).data.session : null;
        const localEntries = session
          ? [
              ...(await readLocalJournal(GUEST_JOURNAL_SCOPE)),
              ...(await readLocalJournal(session.user.id)),
            ]
          : await readLocalJournal(GUEST_JOURNAL_SCOPE);
        if (active) setEntries(localEntries);
        if (!supabase || !session) {
          if (active) setLoadState("ready");
          return;
        }
        await syncLocalJournalEntries().catch(() => undefined);
        const remainingLocalEntries = [
          ...(await readLocalJournal(GUEST_JOURNAL_SCOPE)),
          ...(await readLocalJournal(session.user.id)),
        ];
        const { data, error } = await supabase
          .from("journal_entries")
          .select("id, entry, mood, date")
          .order("date", { ascending: false })
          .order("created_at", { ascending: false });
        if (error) {
          if (active) setLoadState(localEntries.length ? "stale" : "error");
          return;
        }
        const rows = (data ?? []) as unknown as JournalRow[];
        const remoteEntries = rows.map((item) => ({
          id: item.id,
          text: item.entry,
          mood: item.mood ?? "Thoughtful",
          date: item.date,
        }));
        const remoteKeys = new Set(remoteEntries.map((item) => `${item.date}:${item.text}`));
        if (active) {
          setEntries([
            ...remoteEntries,
            ...remainingLocalEntries.filter((item) => !remoteKeys.has(`${item.date}:${item.text}`)),
          ]);
          setLoadState("ready");
        }
      } catch {
        if (active) setLoadState("error");
      }
    })();
    return () => {
      active = false;
    };
  }, [reloadKey]);

  const retryLoad = () => {
    setLoadState("loading");
    setReloadKey((value) => value + 1);
  };

  const addEntry = () => {
    if (!draft.trim()) return;
    const entry = draft.trim();
    void saveJournalEntry(entry, mood)
      .then((result) => {
        setEntries((items) => [{ id: result.id, text: entry, mood, date: result.date }, ...items]);
        if (!result.synced)
          Alert.alert("Saved on this device", "Sign in to sync this journal entry across devices.");
      })
      .catch(() => Alert.alert("Could not save journal entry", "Please try again."));
    setDraft("");
    setComposing(false);
  };

  const removeEntry = (entry: Entry) => {
    Alert.alert("Delete this entry?", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () =>
          void deleteJournalEntry(entry.id)
            .then(() => setEntries((items) => items.filter((item) => item.id !== entry.id)))
            .catch(() => Alert.alert("Could not delete entry", "Please try again.")),
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Page scroll={false}>
        {composing ? (
          <>
            <Text className="mb-2 text-xl font-semibold text-ink">How is your inner weather?</Text>
            <Text className="mb-4 text-sm leading-5 text-muted">
              This space is private. Write a little or a lot.
            </Text>
            <View className="mb-4 flex-row flex-wrap gap-2">
              {moods.map((item) => (
                <Pressable
                  key={item}
                  accessibilityRole="button"
                  accessibilityState={{ selected: mood === item }}
                  onPress={() => setMood(item)}
                  className={`rounded-full px-4 py-2 ${mood === item ? "bg-saffron" : "border border-line bg-surface"}`}
                >
                  <Text
                    className={`text-sm font-semibold ${mood === item ? "text-black" : "text-muted"}`}
                  >
                    {item}
                  </Text>
                </Pressable>
              ))}
            </View>
            <TextInput
              accessibilityLabel="Journal entry"
              value={draft}
              onChangeText={setDraft}
              placeholder="Begin where you are…"
              placeholderTextColor={colors.muted}
              multiline
              autoFocus
              maxLength={4000}
              textAlignVertical="top"
              className="min-h-52 rounded-lg border border-line bg-surface p-4 text-[16px] leading-7 text-ink"
            />
            <View className="mt-4 gap-3">
              <PrimaryButton
                label="Save privately"
                icon="lock-closed-outline"
                disabled={!draft.trim()}
                onPress={addEntry}
              />
              <Pressable
                accessibilityRole="button"
                onPress={() => setComposing(false)}
                className="items-center p-3"
              >
                <Text className="font-semibold text-muted">Cancel</Text>
              </Pressable>
            </View>
          </>
        ) : (
          <>
            <FlatList
              data={entries}
              keyExtractor={(entry) => entry.id}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: 8 }}
              ListHeaderComponent={
                <>
                  <Card className="mb-5 bg-surface2">
                    <View className="flex-row items-start gap-3">
                      <Ionicons name="lock-closed-outline" size={20} color={colors.plum} />
                      <View className="flex-1">
                        <Text className="font-semibold text-ink">Your private space</Text>
                        <Text className="mt-1 text-sm leading-5 text-muted">
                          Guest entries remain on this device. Sign in to enable secure syncing
                          across devices.
                        </Text>
                      </View>
                    </View>
                  </Card>
                  {loadState === "stale" ? (
                    <Card className="mb-4 bg-surface2">
                      <Text className="font-semibold text-ink">Showing the latest saved copy</Text>
                      <Text className="mt-1 text-sm leading-5 text-muted">
                        Your journal is available offline. We couldn't refresh the account copy.
                      </Text>
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Retry loading journal"
                        onPress={retryLoad}
                        className="mt-3 self-start rounded-full bg-surface px-4 py-2.5"
                      >
                        <Text className="text-sm font-semibold text-plum">Try again</Text>
                      </Pressable>
                    </Card>
                  ) : null}
                </>
              }
              renderItem={({ item: entry }) => (
                <Card className="mb-3">
                  <View className="mb-3 flex-row items-center justify-between">
                    <Text className="text-xs font-semibold uppercase tracking-wider text-saffronText">
                      {entry.mood}
                    </Text>
                    <View className="flex-row items-center gap-3">
                      <Text className="text-xs text-muted">{entry.date}</Text>
                      <Pressable
                        accessibilityLabel="Delete journal entry"
                        accessibilityRole="button"
                        onPress={() => removeEntry(entry)}
                        hitSlop={10}
                      >
                        <Ionicons name="trash-outline" size={17} color={colors.rose} />
                      </Pressable>
                    </View>
                  </View>
                  <Text className="text-[15px] leading-6 text-ink">{entry.text}</Text>
                </Card>
              )}
              ListEmptyComponent={
                loadState === "loading" ? (
                  <LoadingState label="Loading your journal…" />
                ) : loadState === "error" ? (
                  <EmptyState
                    icon="cloud-offline-outline"
                    title="Your journal is unavailable"
                    body="We couldn't load your private entries. Check your connection and try again."
                    action="Try again"
                    onAction={retryLoad}
                  />
                ) : (
                  <EmptyState
                    icon="journal-outline"
                    title="A quiet page is waiting"
                    body="Capture a reflection, question, gratitude, or intention. There is no streak to maintain."
                  />
                )
              }
              ListFooterComponent={
                <View className="mt-5">
                  <PrimaryButton
                    label="Write a new entry"
                    icon="create-outline"
                    onPress={() => setComposing(true)}
                  />
                </View>
              }
            />
          </>
        )}
      </Page>
    </KeyboardAvoidingView>
  );
}
