import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";

import { AudioAvailability } from "@/components/AudioAvailability";
import { Card, EmptyState, Page, SecondaryButton } from "@/components/ui";
import { VerseLines } from "@/components/VerseLines";
import { resolveShlokaAudio } from "@/lib/audio";
import {
  chapterKey,
  getShloka,
  getShlokaDetails,
  readableSource,
  shlokaMeaning,
  shlokaTranslation,
} from "@/lib/shlokas";
import { track } from "@/lib/telemetry";
import { useAppStore } from "@/store/useAppStore";
import { colors } from "@/theme/tokens";

export default function ShlokaDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug?: string }>();
  const contentLanguage = useAppStore((state) => state.contentLanguage);
  const scriptPreference = useAppStore((state) => state.scriptPreference);
  const shloka = getShloka(slug);
  const audioAsset = shloka ? resolveShlokaAudio(shloka.slug, "clear") : null;
  // Word-by-word gloss and prose meanings are bundled separately from the
  // verse itself and fetched the first time any verse page opens.
  const { data: details, isPending: detailsPending } = useQuery({
    queryKey: ["shloka-details", slug],
    queryFn: () => getShlokaDetails(slug ?? "").then((value) => value ?? null),
    enabled: Boolean(slug),
    staleTime: Infinity,
  });

  useEffect(() => {
    if (shloka) track("shloka_viewed", { slug: shloka.slug });
  }, [shloka]);

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
      <Text className="text-[11px] font-semibold uppercase text-saffronText">{shloka.textRef}</Text>

      <Card className="mt-3">
        <VerseLines verse={shloka} preference={scriptPreference} />
        <Text className="mt-3 text-[15px] leading-6 text-ink">
          {shlokaTranslation(shloka, contentLanguage)}
        </Text>
        <Text className="mt-3 text-xs leading-5 text-muted">{readableSource(shloka.source)}</Text>
      </Card>

      <AudioAvailability asset={audioAsset} />

      {detailsPending ? (
        <View className="mt-6 items-center py-6">
          <ActivityIndicator color={colors.saffron} />
        </View>
      ) : null}

      {details && details.words.length ? (
        <View className="mt-6">
          <Text className="text-[17px] font-semibold text-ink">Word by word</Text>
          <Card className="mt-2.5">
            {details.words.map((entry, index) => (
              <View
                key={index}
                className="flex-row gap-3 border-b border-line py-2.5 last:border-b-0"
              >
                <Text className="min-w-[110px] text-[15px] font-semibold text-plum">
                  {entry.word}
                </Text>
                <Text className="flex-1 text-[15px] leading-6 text-ink">{entry.meaning}</Text>
              </View>
            ))}
          </Card>
        </View>
      ) : null}

      {details?.meaning ? (
        <View className="mt-6">
          <Text className="text-[17px] font-semibold text-ink">The meaning behind it</Text>
          <Text className="mt-2 text-[15px] leading-7 text-ink">
            {shlokaMeaning(details, contentLanguage)}
          </Text>
        </View>
      ) : null}

      {shloka.reflection ? (
        <Card className="mt-6">
          <Text className="text-[11px] font-semibold uppercase text-saffronText">
            Carry it today
          </Text>
          <Text className="mt-2 text-[15px] leading-7 text-ink">{shloka.reflection}</Text>
        </Card>
      ) : null}

      <View className="mt-6">
        <SecondaryButton
          label="Read this verse in its chapter"
          icon="library-outline"
          onPress={() =>
            router.push({
              pathname: "/read/[chapter]",
              params: { chapter: chapterKey(shloka.slug) },
            })
          }
        />
      </View>
    </Page>
  );
}

// Source lines cite Wikisource pages whose Devanagari paths arrive
// percent-encoded; show the readable IRI so the citation is legible.
