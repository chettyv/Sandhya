import { router } from "expo-router";
import { Text } from "react-native";

import { Card, EmptyState, ListRow, Page } from "@/components/ui";
import { shlokas } from "@/lib/shlokas";

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
    <Page>
      <Text className="mb-4 text-[15px] leading-6 text-muted">
        Every verse carries its pronunciation, a word-by-word breakdown, and the meaning behind it —
        with the translator named.
      </Text>
      <Card>
        {shlokas.map((shloka) => (
          <ListRow
            key={shloka.slug}
            icon="book-outline"
            title={shloka.textRef}
            subtitle={shloka.translation}
            onPress={() =>
              router.push({ pathname: "/shloka/[slug]", params: { slug: shloka.slug } })
            }
          />
        ))}
      </Card>
    </Page>
  );
}
