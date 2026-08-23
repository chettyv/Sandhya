import { router } from "expo-router";
import { SectionList, Text, View } from "react-native";

import { EmptyState, ListRow, Page } from "@/components/ui";
import { readerChapters, shlokas } from "@/lib/shlokas";

// 700-verse scale: virtualized section list grouped by chapter. Shares the
// reader's slug-based grouping so whole-text units (Chalisa, Isha, stotras)
// and three-level refs (Katha 1.2.3) fall into one section, not one per verse.
const sections = readerChapters().map(({ key, title, verses }) => ({ key, title, data: verses }));

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
        renderItem={({ item, index, section }) => (
          <View
            className={`bg-surface px-3 ${index === 0 ? "rounded-t-card" : ""} ${
              index === section.data.length - 1 ? "rounded-b-card" : "border-b border-line"
            }`}
          >
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
