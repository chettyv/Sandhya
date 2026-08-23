import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";

import { ContentSourceNotice } from "@/components/ContentSourceNotice";
import { FestivalRow } from "@/components/FestivalRow";
import { PracticeRow } from "@/components/PracticeRow";
import { Page, SectionHeader, TopBar } from "@/components/ui";
import { useCuratedContent } from "@/lib/content";
import { useCopy } from "@/lib/i18n";
import { paymentsEnabled } from "@/lib/payments";
import { useSubscription } from "@/lib/subscriptions";
import { colors } from "@/theme/tokens";

type Filter = "All" | "Texts" | "Concepts" | "Deities" | "Practices" | "Festivals";

export default function ExploreScreen() {
  const router = useRouter();
  const t = useCopy();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const { data: content } = useCuratedContent();
  const { concepts, deities, festivals, practices, texts } = content;
  const { data: subscription, isChecking: subscriptionChecking } = useSubscription();
  const isPlus = !paymentsEnabled || subscription.plan !== "free";
  const availablePractices = isPlus ? practices : practices.filter((item) => !item.isPremium);
  const availableFestivals = isPlus ? festivals : festivals.filter((item) => !item.isPremium);
  const search = query.trim().toLowerCase();
  const shownConcepts = useMemo(
    () =>
      concepts.filter(
        (item) => !search || `${item.term} ${item.definition}`.toLowerCase().includes(search),
      ),
    [concepts, search],
  );
  const shownTexts = useMemo(
    () =>
      texts.filter(
        (item) =>
          !search ||
          `${item.title} ${item.category} ${item.description}`.toLowerCase().includes(search),
      ),
    [search, texts],
  );
  const shownDeities = useMemo(
    () =>
      deities.filter(
        (item) =>
          !search ||
          `${item.name} ${item.otherNames.join(" ")} ${item.shortDescription}`
            .toLowerCase()
            .includes(search),
      ),
    [deities, search],
  );
  const shownPractices = useMemo(
    () =>
      availablePractices.filter(
        (item) =>
          !search ||
          `${item.title} ${item.category} ${item.summary}`.toLowerCase().includes(search),
      ),
    [availablePractices, search],
  );
  const shownFestivals = useMemo(
    () =>
      availableFestivals.filter(
        (item) => !search || `${item.name} ${item.summary}`.toLowerCase().includes(search),
      ),
    [availableFestivals, search],
  );
  const filters: Filter[] = ["All", "Texts", "Concepts", "Deities", "Practices", "Festivals"];

  return (
    <Page>
      <TopBar
        eyebrow="Learn at your pace"
        title={t("explore")}
        onProfile={() => router.push("/profile")}
      />
      <ContentSourceNotice source={content.source} />
      <View className="mb-4 flex-row items-center gap-2 rounded-lg border border-line bg-surface px-3">
        <Ionicons name="search-outline" size={20} color={colors.muted} />
        <TextInput
          accessibilityLabel="Search the library"
          value={query}
          onChangeText={setQuery}
          placeholder="Search texts, concepts, deities…"
          placeholderTextColor={colors.muted}
          className="h-13 flex-1 text-[15px] text-ink"
        />
        {query ? (
          <Pressable
            accessibilityLabel="Clear search"
            accessibilityRole="button"
            onPress={() => setQuery("")}
          >
            <Ionicons name="close-circle" size={19} color={colors.muted} />
          </Pressable>
        ) : null}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8, paddingRight: 12 }}
        className="-mx-5 px-5"
      >
        {filters.map((item) => (
          <Pressable
            key={item}
            accessibilityRole="button"
            accessibilityState={{ selected: filter === item }}
            onPress={() => setFilter(item)}
            className={`rounded-lg px-3.5 py-2 ${filter === item ? "bg-saffron" : "border border-line bg-surface"}`}
          >
            <Text
              className={`text-sm font-semibold ${filter === item ? "text-black" : "text-muted"}`}
            >
              {item}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {!search && filter === "All" ? (
        <>
          <SectionHeader title="Browse by" />
          <View className="flex-row flex-wrap gap-3">
            {[
              { label: "Sacred texts", icon: "book-outline", color: colors.plum },
              { label: "Concepts", icon: "bulb-outline", color: colors.saffron },
              { label: "Deities", icon: "heart-outline", color: colors.rose },
              { label: "Practices", icon: "leaf-outline", color: colors.sage },
              { label: "Festivals", icon: "sparkles-outline", color: colors.saffron },
            ].map((item) => (
              <Pressable
                key={item.label}
                accessibilityRole="button"
                onPress={() =>
                  setFilter(item.label === "Sacred texts" ? "Texts" : (item.label as Filter))
                }
                className="min-h-24 w-[48%] flex-grow rounded-[22px] border border-line bg-surface p-3.5"
              >
                <View
                  className="h-9 w-9 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${item.color}18` }}
                >
                  <Ionicons name={item.icon as never} size={19} color={item.color} />
                </View>
                <Text className="mt-auto text-[15px] font-semibold text-ink">{item.label}</Text>
              </Pressable>
            ))}
          </View>
        </>
      ) : null}

      {(filter === "All" || filter === "Texts") && shownTexts.length ? (
        <>
          <SectionHeader title="Sacred texts" />
          <View className="gap-3">
            {shownTexts.map((text) => (
              <Pressable
                key={text.id}
                accessibilityRole="button"
                onPress={() => router.push({ pathname: "/text/[id]", params: { id: text.id } })}
                className="flex-row items-center gap-3 rounded-[22px] border border-line bg-surface p-3.5"
              >
                <View className="h-12 min-w-12 items-center justify-center rounded-lg bg-[#F1E6F0] px-2">
                  <Text numberOfLines={1} className="text-lg text-plum">
                    {text.sanskrit ?? "ॐ"}
                  </Text>
                </View>
                <View className="min-w-0 flex-1">
                  <Text className="text-[16px] font-semibold text-ink">{text.title}</Text>
                  <Text numberOfLines={2} className="mt-1 text-sm leading-5 text-muted">
                    {text.description}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.muted} />
              </Pressable>
            ))}
          </View>
        </>
      ) : null}

      {(filter === "All" || filter === "Concepts") && shownConcepts.length ? (
        <>
          <SectionHeader title="Featured concepts" />
          <View className="gap-3">
            {shownConcepts.map((concept) => (
              <Pressable
                key={concept.id}
                accessibilityRole="button"
                onPress={() => router.push(`/concept/${concept.id}`)}
                className="flex-row items-center gap-3 rounded-[22px] border border-line bg-surface p-3.5"
              >
                <View className="h-12 min-w-12 items-center justify-center rounded-lg bg-[#F1E6F0] px-2">
                  <Text numberOfLines={1} className="text-lg text-plum">
                    {concept.sanskrit}
                  </Text>
                </View>
                <View className="min-w-0 flex-1">
                  <Text className="text-[16px] font-semibold text-ink">{concept.term}</Text>
                  <Text numberOfLines={2} className="mt-1 text-sm leading-5 text-muted">
                    {concept.definition}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.muted} />
              </Pressable>
            ))}
          </View>
        </>
      ) : null}

      {(filter === "All" || filter === "Deities") && shownDeities.length ? (
        <>
          <SectionHeader title="Deities and forms of the divine" />
          <View className="gap-3">
            {shownDeities.map((deity) => (
              <Pressable
                key={deity.id}
                accessibilityRole="button"
                onPress={() => router.push(`/deity/${deity.id}`)}
                className="flex-row items-center gap-3 rounded-[22px] border border-line bg-surface p-3.5"
              >
                <View className="h-12 w-12 items-center justify-center rounded-lg bg-[#FBE9D5]">
                  <Ionicons name="heart-outline" size={24} color={colors.rose} />
                </View>
                <View className="min-w-0 flex-1">
                  <Text className="text-[16px] font-semibold text-ink">{deity.name}</Text>
                  <Text numberOfLines={2} className="mt-1 text-sm leading-5 text-muted">
                    {deity.shortDescription}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.muted} />
              </Pressable>
            ))}
          </View>
        </>
      ) : null}

      {(filter === "All" || filter === "Practices") && shownPractices.length ? (
        <>
          <SectionHeader title="Practice guides" />
          {shownPractices.map((practice) => (
            <PracticeRow
              key={practice.id}
              practice={practice}
              onPress={() => router.push(`/practice/${practice.id}`)}
            />
          ))}
        </>
      ) : null}
      {(filter === "All" || filter === "Festivals") && shownFestivals.length ? (
        <>
          <SectionHeader title="Festival guides" />
          {shownFestivals.map((festival) => (
            <FestivalRow
              key={festival.id}
              festival={festival}
              onPress={() => router.push(`/festival/${festival.id}`)}
            />
          ))}
        </>
      ) : null}

      {!isPlus && !subscriptionChecking ? (
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push("/subscription")}
          className="mt-6 rounded-card border border-saffron bg-warm p-4"
        >
          <Text className="font-semibold text-ink">Go deeper with Plus</Text>
          <Text className="mt-1 text-sm leading-5 text-muted">
            More practice guides, festival explainers, and grounded questions are available to
            subscribers.
          </Text>
        </Pressable>
      ) : null}

      {search &&
      !shownTexts.length &&
      !shownConcepts.length &&
      !shownDeities.length &&
      !shownPractices.length &&
      !shownFestivals.length ? (
        <View className="items-center py-16">
          <Ionicons name="search-outline" size={32} color={colors.muted} />
          <Text className="mt-4 text-lg font-semibold text-ink">No results yet</Text>
          <Text className="mt-1 text-sm text-muted">Try a broader term or ask Dharma.</Text>
        </View>
      ) : null}
    </Page>
  );
}
