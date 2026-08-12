import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Text, View } from "react-native";

import { Card, EmptyState, Page, Pill, PrimaryButton, SecondaryButton } from "@/components/ui";
import { syncSavedItem } from "@/lib/account";
import { useCuratedContent } from "@/lib/content";
import { useAppStore } from "@/store/useAppStore";
import { colors } from "@/theme/tokens";

export default function ConceptDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: content } = useCuratedContent();
  const concepts = content.concepts;
  const requestedConcept = concepts.find((item) => item.id === id);
  const concept = requestedConcept ?? concepts[0];
  const savedIds = useAppStore((state) => state.savedIds);
  const toggleSaved = useAppStore((state) => state.toggleSaved);
  if (!requestedConcept || !concept)
    return (
      <Page>
        <EmptyState
          icon="bulb-outline"
          title="Concept unavailable"
          body="This concept could not be found in the current library."
        />
      </Page>
    );
  const saved = savedIds.includes(concept.id);

  return (
    <Page>
      <View className="items-center rounded-[30px] bg-[#E8E0EC] px-6 py-9">
        <Text className="text-6xl text-plum">{concept.sanskrit}</Text>
        <Text className="mt-4 text-[32px] font-semibold text-ink">{concept.term}</Text>
        <Pill label="Key concept" tone="warm" />
      </View>
      <Text className="mt-7 text-xl font-semibold leading-8 text-ink">{concept.definition}</Text>
      <Text className="mt-5 text-[16px] leading-7 text-ink">{concept.explanation}</Text>

      {concept.variationNote ? (
        <Card className="mt-6 bg-surface2">
          <View className="flex-row items-start gap-3">
            <Ionicons name="git-branch-outline" size={21} color={colors.plum} />
            <View className="flex-1">
              <Text className="font-semibold text-plum">Across traditions</Text>
              <Text className="mt-1.5 text-sm leading-5 text-muted">{concept.variationNote}</Text>
            </View>
          </View>
        </Card>
      ) : null}

      <Text className="mb-3 mt-8 text-xl font-semibold text-ink">Explore with care</Text>
      <Card>
        <Text className="text-sm leading-6 text-muted">
          Ask for source-grounded examples, or compare how a concept appears in different schools.
          Answers will only cite passages returned by the source library.
        </Text>
      </Card>
      <View className="mt-5 gap-3">
        <PrimaryButton
          label={`Ask about ${concept.term}`}
          icon="sparkles"
          onPress={() =>
            router.push({
              pathname: "/(tabs)/ask",
              params: {
                prompt: `How is ${concept.term} understood in different Hindu traditions?`,
              },
            })
          }
        />
        <SecondaryButton
          label={saved ? "Remove from saved" : "Save concept"}
          icon={saved ? "bookmark" : "bookmark-outline"}
          onPress={() => {
            const next = !saved;
            toggleSaved(concept.id, "concept");
            void syncSavedItem("concept", concept.id, next).catch(() => undefined);
          }}
        />
      </View>
    </Page>
  );
}
