import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, Text, View } from "react-native";

import { dailyReflection } from "@/data/content";
import { colors, shadows } from "@/theme/tokens";

export function ReflectionCard({
  onOpen,
  onSave,
  saved,
}: {
  onOpen: () => void;
  onSave: () => void;
  saved: boolean;
}) {
  return (
    <LinearGradient
      colors={["#6E4A1E", "#142E34", "#0B0B0A"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[shadows.card, { borderRadius: 8, overflow: "hidden", padding: 18 }]}
    >
      <View className="mb-4 flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <View className="h-7 w-7 items-center justify-center rounded-md bg-[#FFFFFF16]">
            <Ionicons name="sunny-outline" size={16} color={colors.gold} />
          </View>
          <Text className="text-xs font-semibold uppercase text-gold">Daily reflection</Text>
        </View>
        <Pressable
          accessibilityLabel={saved ? "Remove saved reflection" : "Save reflection"}
          accessibilityRole="button"
          onPress={onSave}
          hitSlop={10}
        >
          <Ionicons name={saved ? "bookmark" : "bookmark-outline"} size={22} color={colors.white} />
        </Pressable>
      </View>
      <Text className="mb-3 text-sm font-medium leading-5 text-[#EACFAE]">
        {dailyReflection.eyebrow}
      </Text>
      <Text className="text-[21px] font-semibold leading-[28px] text-white">
        {dailyReflection.title}
      </Text>
      <Text className="mt-4 text-[15px] leading-6 text-[#E8DDE9]">{dailyReflection.body}</Text>
      <Pressable
        accessibilityRole="button"
        onPress={onOpen}
        className="mt-5 self-start flex-row items-center gap-2 rounded-lg bg-white px-3.5 py-2.5"
      >
        <Text className="text-sm font-semibold text-aubergine">Reflect on this</Text>
        <Ionicons name="arrow-forward" size={16} color={colors.aubergine} />
      </Pressable>
    </LinearGradient>
  );
}
