import { router, useLocalSearchParams } from "expo-router";
import { FlatList, Pressable, Text, View } from "react-native";

import { EmptyState, Page } from "@/components/ui";
import { type Shloka, readerChapters, shlokaTranslation } from "@/lib/shlokas";
import { useAppStore } from "@/store/useAppStore";

export default function ReaderChapterScreen() {
  const { chapter: chapterParam } = useLocalSearchParams<{ chapter?: string }>();
  const contentLanguage = useAppStore((state) => state.contentLanguage);
  const chapter = readerChapters().find((entry) => entry.key === chapterParam);

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
          <Text className="mb-3 text-[22px] font-semibold leading-7 text-ink">{chapter.title}</Text>
        }
        renderItem={({ item }) => <VerseRow shloka={item} language={contentLanguage} />}
        contentContainerStyle={{ paddingBottom: 96 }}
      />
    </Page>
  );
}

function VerseRow({ shloka, language }: { shloka: Shloka; language: string }) {
  const verseNumber = shloka.textRef.match(/(\d+\.\d+)$/)?.[1] ?? "";
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Verse ${verseNumber}: open pronunciation and word meanings`}
      onPress={() => router.push({ pathname: "/shloka/[slug]", params: { slug: shloka.slug } })}
      className="border-b border-[#302C25] py-4"
      style={({ pressed }) => pressed && { opacity: 0.72 }}
    >
      <View className="flex-row items-baseline gap-2">
        <Text className="text-xs font-semibold text-saffron">{verseNumber}</Text>
      </View>
      <Text className="mt-1 text-[17px] leading-8 text-ink">{shloka.devanagari}</Text>
      <Text className="mt-1.5 text-[15px] leading-6 text-muted">
        {shlokaTranslation(shloka, language)}
      </Text>
    </Pressable>
  );
}
