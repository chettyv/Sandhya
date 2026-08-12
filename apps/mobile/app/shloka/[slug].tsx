import { router, useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

import { Card, EmptyState, Page } from "@/components/ui";
import { getShloka, shlokaMeaning, shlokaTranslation } from "@/lib/shlokas";
import { useAppStore } from "@/store/useAppStore";

export default function ShlokaDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug?: string }>();
  const contentLanguage = useAppStore((state) => state.contentLanguage);
  const shloka = getShloka(slug);

  if (!shloka) {
    return (
      <Page>
        <EmptyState
          icon="book-outline"
          title="Shloka unavailable"
          body="This verse isn't in the current library. Browse the shloka bank for what's available."
          action="Open the shloka bank"
          onAction={() => router.replace("/shlokas")}
        />
      </Page>
    );
  }

  return (
    <Page>
      <Text className="text-[11px] font-semibold uppercase text-saffron">{shloka.textRef}</Text>

      <Card className="mt-3">
        <Text className="text-[19px] leading-9 text-ink">{shloka.devanagari}</Text>
        <Text className="mt-2 text-[15px] leading-6 text-muted">{shloka.iast}</Text>
        <Text className="mt-3 text-[16px] font-semibold leading-7 text-ink">{shloka.sayIt}</Text>
        <Text className="mt-3 text-[15px] leading-6 text-ink">
          {shlokaTranslation(shloka, contentLanguage)}
        </Text>
        <Text className="mt-3 text-xs leading-5 text-muted">{shloka.source}</Text>
      </Card>

      <View className="mt-6">
        <Text className="text-[17px] font-semibold text-ink">Word by word</Text>
        <Card className="mt-2.5">
          {shloka.words.map((entry, index) => (
            <View
              key={index}
              className="flex-row gap-3 border-b border-[#302C25] py-2.5 last:border-b-0"
            >
              <Text className="min-w-[110px] text-[15px] font-semibold text-plum">
                {entry.word}
              </Text>
              <Text className="flex-1 text-[15px] leading-6 text-ink">{entry.meaning}</Text>
            </View>
          ))}
        </Card>
      </View>

      {shloka.meaning ? (
        <View className="mt-6">
          <Text className="text-[17px] font-semibold text-ink">The meaning behind it</Text>
          <Text className="mt-2 text-[15px] leading-7 text-ink">
            {shlokaMeaning(shloka, contentLanguage)}
          </Text>
        </View>
      ) : null}

      {shloka.reflection ? (
        <Card className="mt-6">
          <Text className="text-[11px] font-semibold uppercase text-saffron">Carry it today</Text>
          <Text className="mt-2 text-[15px] leading-7 text-ink">{shloka.reflection}</Text>
        </Card>
      ) : null}
    </Page>
  );
}
