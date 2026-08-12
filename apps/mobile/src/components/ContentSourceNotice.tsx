import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

import type { ContentSource } from "@/lib/content";
import { useCopy } from "@/lib/i18n";
import { colors } from "@/theme/tokens";

export function ContentSourceNotice({ source }: { source: ContentSource }) {
  const t = useCopy();
  if (source === "connected") return null;
  const partial = source === "partial";
  return (
    <View
      accessibilityRole="alert"
      className="mb-3 flex-row items-start gap-2 rounded-card border border-[#5D5040] bg-surface2 px-3 py-2.5"
    >
      <Ionicons
        name={partial ? "cloud-offline-outline" : "phone-portrait-outline"}
        size={17}
        color={colors.saffron}
      />
      <Text className="flex-1 text-xs leading-5 text-muted">
        {t(partial ? "offlinePartial" : "offlineFallback")}
      </Text>
    </View>
  );
}
