import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, Text, View } from "react-native";

import { colors } from "@/theme/tokens";
import type { Festival } from "@/types/content";

export function FestivalRow({ festival, onPress }: { festival: Festival; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className="mb-3 flex-row items-center gap-3 rounded-[22px] border border-line bg-surface p-4"
    >
      <View className="h-12 w-12 items-center justify-center rounded-2xl bg-warm">
        <Text className="text-[10px] font-bold uppercase" style={{ color: colors.saffron }}>
          {festival.monthLabel}
        </Text>
        <Text
          className={`font-bold ${festival.date ? "text-xl leading-6" : "text-[11px] leading-4"}`}
          style={{ color: colors.saffron }}
        >
          {festival.date ? festival.dayLabel : "READ"}
        </Text>
      </View>
      <View className="min-w-0 flex-1">
        <Text className="text-[15px] font-semibold text-ink">{festival.name}</Text>
        <Text numberOfLines={2} className="mt-1 text-sm leading-5 text-muted">
          {festival.summary}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={22} color={colors.muted} />
    </Pressable>
  );
}
