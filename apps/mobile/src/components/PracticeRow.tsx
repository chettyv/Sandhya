import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, Text, View } from "react-native";

import { Pill } from "@/components/ui";
import { colors } from "@/theme/tokens";
import type { Practice } from "@/types/content";

const icons = {
  Meditation: "leaf-outline",
  Puja: "flame-outline",
  Mantra: "musical-notes-outline",
  Reflection: "book-outline",
} as const;

export function PracticeRow({
  practice,
  onPress,
  completed = false,
}: {
  practice: Practice;
  onPress: () => void;
  completed?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className="mb-3 flex-row items-center gap-3 rounded-[22px] border border-line bg-surface p-4"
    >
      <View className="h-11 w-11 items-center justify-center rounded-2xl bg-warm">
        <Ionicons
          name={completed ? "checkmark" : icons[practice.category]}
          size={22}
          color={completed ? colors.sage : colors.saffron}
        />
      </View>
      <View className="min-w-0 flex-1">
        <Text className="text-[15px] font-semibold text-ink">{practice.title}</Text>
        <View className="mt-2 flex-row gap-2">
          <Pill label={`${practice.durationMinutes} min`} icon="time-outline" />
          <Pill label={practice.level} tone="sage" />
        </View>
      </View>
      <Ionicons name="chevron-forward" size={22} color={colors.muted} />
    </Pressable>
  );
}
