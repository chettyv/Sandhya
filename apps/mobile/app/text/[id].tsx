import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import {
  Card,
  EmptyState,
  LoadingState,
  Page,
  Pill,
  PrimaryButton,
  SecondaryButton,
} from "@/components/ui";
import { syncSavedItem } from "@/lib/account";
import { useCuratedContent } from "@/lib/content";
import { isFeatureAvailable } from "@/lib/launchProfile";
import { supabase } from "@/lib/supabase";
import { useAppStore } from "@/store/useAppStore";
import { colors } from "@/theme/tokens";

type Passage = {
  id: string;
  section: string | null;
  verse_number: string | null;
  original_text: string | null;
  transliteration: string | null;
  translation_en: string | null;
};

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default function SacredTextDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: content, isFetching } = useCuratedContent();
  const askAvailable = isFeatureAvailable("ask");
  const text = content.texts.find((item) => item.id === id);
  const savedIds = useAppStore((state) => state.savedIds);
  const toggleSaved = useAppStore((state) => state.toggleSaved);
  const passages = useQuery({
    queryKey: ["text-passages", text?.id],
    enabled: Boolean(supabase && text && UUID_PATTERN.test(text.id)),
    queryFn: async (): Promise<Passage[]> => {
      if (!supabase || !text || !UUID_PATTERN.test(text.id)) return [];
      const { data, error } = await supabase
        .from("passages")
        .select("id,section,verse_number,original_text,transliteration,translation_en")
        .eq("text_id", text.id)
        .order("order_index")
        .limit(8);
      if (error) throw error;
      return data ?? [];
    },
  });

  if (!text && isFetching)
    return (
      <Page>
        <LoadingState label="Loading source…" />
      </Page>
    );
  if (!text)
    return (
      <Page>
        <EmptyState
          icon="book-outline"
          title="Source unavailable"
          body="This source could not be found in the current library."
        />
      </Page>
    );

  return (
    <Page>
      <View className="rounded-[30px] bg-aubergine p-7">
        <Pill label={text.category} icon="book-outline" tone="warm" />
        <Text className="mt-5 text-[30px] font-semibold leading-9 text-white">{text.title}</Text>
        {text.sanskrit ? <Text className="mt-2 text-2xl text-gold">{text.sanskrit}</Text> : null}
        <Text className="mt-4 text-[15px] leading-6 text-surface2">{text.description}</Text>
      </View>

      <Card className="mt-6 bg-surface2">
        <View className="flex-row items-start gap-3">
          <Ionicons name="git-branch-outline" size={20} color={colors.plum} />
          <View className="flex-1">
            <Text className="font-semibold text-plum">Tradition and context</Text>
            <Text className="mt-1 text-sm leading-5 text-muted">
              This work is approached differently across schools and communities. Sandhya presents
              context and variation rather than one final interpretation.
            </Text>
            {text.estimatedDate ? (
              <Text className="mt-2 text-xs leading-4 text-muted">{text.estimatedDate}</Text>
            ) : null}
          </View>
        </View>
      </Card>

      <Text className="mb-3 mt-8 text-xl font-semibold text-ink">A first passage</Text>
      {passages.isFetching ? (
        <Card className="bg-surface">
          <View className="flex-row items-center gap-3">
            <ActivityIndicator color={colors.saffron} />
            <Text className="text-sm text-muted">Checking passage access…</Text>
          </View>
        </Card>
      ) : passages.isError ? (
        <Card className="bg-roseSoft">
          <Text className="font-semibold text-ink">Passages are unavailable right now</Text>
          <Text className="mt-1 text-sm leading-5 text-muted">
            The source record is visible, but passage access could not be checked. Please try again
            when you are online.
          </Text>
        </Card>
      ) : passages.data?.length ? (
        passages.data.map((passage) => (
          <Card key={passage.id} className="mb-3">
            <Text className="text-xs font-semibold uppercase tracking-wider text-saffronText">
              {[passage.section, passage.verse_number].filter(Boolean).join(" · ") ||
                "Source passage"}
            </Text>
            {passage.original_text ? (
              <Text className="mt-3 text-lg leading-8 text-ink">{passage.original_text}</Text>
            ) : null}
            {passage.transliteration ? (
              <Text className="mt-3 text-sm leading-6 text-muted">{passage.transliteration}</Text>
            ) : null}
            {/* The passages table records no translator, and a translation is
                never shown without one (CLAUDE.md). The original and its
                transliteration stand on their own until that column exists. */}
          </Card>
        ))
      ) : (
        <Card className="bg-surface">
          <Text className="font-semibold text-ink">The source library is being prepared</Text>
          <Text className="mt-1 text-sm leading-5 text-muted">
            This text is part of Sandhya’s reviewed catalog. Passages appear here after the source
            record and usage rights have been verified.
          </Text>
        </Card>
      )}

      {askAvailable ? (
        <Pressable
          accessibilityRole="button"
          onPress={() =>
            router.push({
              pathname: "/(tabs)/ask",
              params: { prompt: `How do different Hindu traditions understand ${text.title}?` },
            })
          }
          className="mt-5 flex-row items-center gap-3 rounded-card border border-line bg-surface p-4"
        >
          <Ionicons name="sparkles-outline" size={22} color={colors.saffron} />
          <View className="flex-1">
            <Text className="font-semibold text-ink">Ask about this text</Text>
            <Text className="mt-1 text-sm leading-5 text-muted">
              Compare interpretations using the grounded source library.
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.muted} />
        </Pressable>
      ) : null}
      <View className="mt-4">
        <SecondaryButton
          label={savedIds.includes(text.id) ? "Remove from saved" : "Save text"}
          icon={savedIds.includes(text.id) ? "bookmark" : "bookmark-outline"}
          onPress={() => {
            const next = !savedIds.includes(text.id);
            toggleSaved(text.id, "text");
            void syncSavedItem("text", text.id, next).catch(() => undefined);
          }}
        />
      </View>
      <View className="mt-5">
        <PrimaryButton
          label="Back to the source library"
          icon="arrow-back"
          onPress={() => router.back()}
        />
      </View>
    </Page>
  );
}
