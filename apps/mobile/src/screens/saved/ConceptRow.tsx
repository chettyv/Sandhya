import Ionicons from "@expo/vector-icons/Ionicons";
import type { ComponentProps } from "react";
import { Pressable, Text, View } from "react-native";

import { colors } from "@/theme/tokens";

export function ConceptRow({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: ComponentProps<typeof Ionicons>["name"];
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className="mb-2 flex-row items-center gap-3 rounded-card border border-line bg-surface p-3.5"
    >
      <View className="h-10 w-10 items-center justify-center rounded-lg bg-[#FFF1D6]">
        <Ionicons name={icon} size={20} color={colors.saffron} />
      </View>
      <View className="min-w-0 flex-1">
        <Text className="text-[15px] font-semibold text-ink">{title}</Text>
        <Text numberOfLines={2} className="mt-1 text-sm leading-5 text-muted">
          {subtitle}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.muted} />
    </Pressable>
  );
}
