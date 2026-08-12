import { router } from "expo-router";
import { SectionList, Text, View } from "react-native";

import { EmptyState, ListRow, Page } from "@/components/ui";
import { type Shloka, shlokas } from "@/lib/shlokas";

// 700-verse scale: virtualized section list grouped by chapter.
const sections = buildSections(shlokas);

export default function ShlokaBankScreen() {
  if (shlokas.length === 0) {
    return (
      <Page>
        <EmptyState
          icon="book-outline"
          title="The shloka bank is growing"
          body="Verses are added after review, each with pronunciation, a word-by-word breakdown, and the meaning behind it. Check back soon."
        />
      </Page>
    );
  }

  return (
    <Page scroll={false}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.slug}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        ListHeaderComponent={
          <Text className="mb-2 text-[15px] leading-6 text-muted">
            Every verse carries its pronunciation, a word-by-word breakdown, and the meaning behind
            it — with the source named.
          </Text>
        }
        renderSectionHeader={({ section }) => (
          <Text className="mb-1 mt-5 text-[17px] font-semibold text-ink">{section.title}</Text>
        )}
        renderItem={({ item }) => (
          <View className="rounded-card bg-surface px-3">
            <ListRow
              icon="book-outline"
              title={item.textRef}
              subtitle={item.translation}
              onPress={() =>
                router.push({ pathname: "/shloka/[slug]", params: { slug: item.slug } })
              }
            />
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 96 }}
      />
    </Page>
  );
}

function buildSections(entries: Shloka[]): { title: string; data: Shloka[] }[] {
  const groups = new Map<string, Shloka[]>();
  for (const entry of entries) {
    // "Bhagavad Gita 12.4" -> "Bhagavad Gita — Chapter 12"
    const match = entry.textRef.match(/^(.*?)\s+(\d+)\.\d+$/);
    const title = match ? `${match[1]} — Chapter ${match[2]}` : entry.textRef;
    const group = groups.get(title);
    if (group) group.push(entry);
    else groups.set(title, [entry]);
  }
  return [...groups.entries()].map(([title, data]) => ({ title, data }));
}
