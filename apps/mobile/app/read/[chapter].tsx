import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { FlatList, Pressable, Text, View } from "react-native";

import { EmptyState, Page } from "@/components/ui";
import { VerseLines } from "@/components/VerseLines";
import type { ScriptPreference } from "@/features/onboarding/types";
import { type Shloka, chapterSource, readerChapters, shlokaTranslation } from "@/lib/shlokas";
import { track } from "@/lib/telemetry";
import { useAppStore } from "@/store/useAppStore";

export default function ReaderChapterScreen() {
  const { chapter: chapterParam } = useLocalSearchParams<{ chapter?: string }>();
  const contentLanguage = useAppStore((state) => state.contentLanguage);
  const scriptPreference = useAppStore((state) => state.scriptPreference);
  const chapter = readerChapters().find((entry) => entry.key === chapterParam);

  const chapterKey = chapter?.key ?? null;
  useEffect(() => {
    if (chapterKey) track("reader_chapter_opened", { chapter: chapterKey });
  }, [chapterKey]);

  if (!chapter) {
    return (
      <Page>
        <EmptyState
          icon="library-outline"
          title="Chapter unavailable"
          body="This chapter isn't in the current library."
          action="Back to the reader"
          onAction={() => router.replace("/read")}
        />
      </Page>
    );
  }

  return (
    <Page scroll={false}>
      <FlatList
        data={chapter.verses}
        keyExtractor={(item) => item.slug}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View className="mb-3">
            <Text className="text-[22px] font-semibold leading-7 text-ink">{chapter.title}</Text>
            <Text className="mt-1 text-xs leading-4 text-muted">
              {chapterSource(chapter.verses)}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <VerseRow shloka={item} language={contentLanguage} script={scriptPreference} />
        )}
        contentContainerStyle={{ paddingBottom: 96 }}
      />
    </Page>
  );
}

// Unit label within a chapter, across every textRef shape in the bank:
// "Hanuman Chalisa, chaupai 3" -> "chaupai 3"; "Katha Upanishad 1.2.5" ->
// "1.2.5"; "Isha Upanishad 5" -> "5"; "Aditya Hridayam 4 (Valmiki
// Ramayana, …)" -> "4"; single-unit prayers carry no label.
function verseLabel(textRef: string): string {
  const unit = textRef.match(/,\s*([^,()]+)$/)?.[1];
  if (unit) return unit.trim();
  const numeric = textRef.match(/\s(\d+(?:\.\d+)*)$/)?.[1];
  if (numeric) return numeric;
  return textRef.match(/\s(\d+)\s*\(/)?.[1] ?? "";
}

function VerseRow({
  shloka,
  language,
  script,
}: {
  shloka: Shloka;
  language: string;
  script: ScriptPreference;
}) {
  const verseNumber = verseLabel(shloka.textRef);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${verseNumber ? `Verse ${verseNumber}` : shloka.textRef}: open pronunciation and word meanings`}
      onPress={() => router.push({ pathname: "/shloka/[slug]", params: { slug: shloka.slug } })}
      className="border-b border-line py-4"
      style={({ pressed }) => pressed && { opacity: 0.72 }}
    >
      {verseNumber ? (
        <View className="flex-row items-baseline gap-2">
          <Text className="text-xs font-semibold text-saffronText">{verseNumber}</Text>
        </View>
      ) : null}
      <View className="mt-1">
        <VerseLines verse={shloka} preference={script} compact />
      </View>
      <Text className="mt-1.5 text-[15px] leading-6 text-muted">
        {shlokaTranslation(shloka, language)}
      </Text>
    </Pressable>
  );
}
