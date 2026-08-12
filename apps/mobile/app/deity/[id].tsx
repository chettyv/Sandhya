import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Text, View } from "react-native";

import { Card, EmptyState, Page, Pill, PrimaryButton, SecondaryButton } from "@/components/ui";
import { syncSavedItem } from "@/lib/account";
import { useCuratedContent } from "@/lib/content";
import { useAppStore } from "@/store/useAppStore";
import { colors } from "@/theme/tokens";

export default function DeityDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: content } = useCuratedContent();
  const requestedDeity = content.deities.find((item) => item.id === id);
  const savedIds = useAppStore((state) => state.savedIds);
  const toggleSaved = useAppStore((state) => state.toggleSaved);

  if (!requestedDeity)
    return (
      <Page>
        <EmptyState
          icon="heart-outline"
          title="Deity unavailable"
          body="This entry could not be found in the current library."
        />
      </Page>
    );

  const saved = savedIds.includes(requestedDeity.id);
  const traditions = requestedDeity.traditions.filter((item) => item !== "general");

  return (
    <Page>
      <View className="items-center rounded-[30px] bg-[#F3E3D6] px-6 py-9">
        <Ionicons name="heart-outline" size={48} color="#8A5A44" />
        <Text className="mt-4 text-[32px] font-semibold text-ink">{requestedDeity.name}</Text>
        {requestedDeity.otherNames.length ? (
          <Text className="mt-2 text-center text-sm text-muted">
            Also known as {requestedDeity.otherNames.join(" · ")}
          </Text>
        ) : null}
        <Pill label="Learn with context" tone="warm" />
      </View>

      <Text className="mt-7 text-xl font-semibold leading-8 text-ink">
        {requestedDeity.shortDescription}
      </Text>
      <Text className="mt-5 text-[16px] leading-7 text-ink">{requestedDeity.fullDescription}</Text>

      {traditions.length ? (
        <Card className="mt-6 bg-surface2">
          <View className="flex-row items-start gap-3">
            <Ionicons name="git-branch-outline" size={21} color={colors.plum} />
            <View className="flex-1">
              <Text className="font-semibold text-plum">Traditions and lineages</Text>
              <Text className="mt-1.5 text-sm leading-5 text-muted">
                This entry is a general introduction. It appears in content tagged for{" "}
                {traditions
                  .map((item) =>
                    item
                      .replace("vaishnava", "Vaishnava")
                      .replace("shaiva", "Shaiva")
                      .replace("shakta", "Shakta")
                      .replace("smarta", "Smarta"),
                  )
                  .join(", ")}{" "}
                perspectives; individual communities may describe this form differently.
              </Text>
            </View>
          </View>
        </Card>
      ) : null}

      <Text className="mb-3 mt-8 text-xl font-semibold text-ink">Keep exploring</Text>
      <Card>
        <Text className="text-sm leading-6 text-muted">
          Ask for source-grounded stories, practices, or comparisons. Sandhya will identify the
          tradition and cite only passages returned by the source library.
        </Text>
      </Card>
      <View className="mt-5 gap-3">
        <PrimaryButton
          label={`Ask about ${requestedDeity.name}`}
          icon="sparkles"
          onPress={() =>
            router.push({
              pathname: "/(tabs)/ask",
              params: {
                prompt: `How is ${requestedDeity.name} understood across Hindu traditions and communities?`,
              },
            } as never)
          }
        />
        <SecondaryButton
          label={saved ? "Remove from saved" : "Save deity"}
          icon={saved ? "bookmark" : "bookmark-outline"}
          onPress={() => {
            const next = !saved;
            toggleSaved(requestedDeity.id, "deity");
            void syncSavedItem("deity", requestedDeity.id, next).catch(() => undefined);
          }}
        />
      </View>
    </Page>
  );
}
