import { router } from "expo-router";
import { Text } from "react-native";

import { Card, EmptyState, ListRow, Page } from "@/components/ui";
import { readerChapters } from "@/lib/shlokas";

const chapters = readerChapters();

export default function ReaderIndexScreen() {
  if (chapters.length === 0) {
    return (
      <Page>
        <EmptyState
          icon="library-outline"
          title="The scriptures are being prepared"
          body="Full texts appear here chapter by chapter as each verse passes review — original script, transliteration, and translation together."
        />
      </Page>
    );
  }

  return (
    <Page>
      <Text className="mb-4 text-[15px] leading-6 text-muted">
        Read continuously, verse by verse — the original script with its translation, every source
        named. Tap any verse for pronunciation, word meanings, and reflection.
      </Text>
      <Card>
        {chapters.map((chapter) => (
          <ListRow
            key={chapter.key}
            icon="library-outline"
            title={chapter.title}
            subtitle={`${chapter.verses.length} verses`}
            onPress={() =>
              router.push({ pathname: "/read/[chapter]", params: { chapter: chapter.key } })
            }
          />
        ))}
      </Card>
    </Page>
  );
}
