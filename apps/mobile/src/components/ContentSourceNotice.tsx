import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, Text, View } from "react-native";

import type { ContentSource } from "@/lib/content";
import { useCopy } from "@/lib/i18n";
import { colors } from "@/theme/tokens";

export function ContentSourceNotice({
  source,
  onRetry,
  retrying = false,
}: {
  source: ContentSource;
  onRetry?: () => void;
  retrying?: boolean;
}) {
  const t = useCopy();
  if (source === "connected") return null;
  const partial = source === "partial";
  return (
    <View
      accessibilityRole="alert"
      className="mb-3 flex-row items-start gap-2 rounded-card border border-line bg-surface2 px-3 py-2.5"
    >
      <Ionicons
        name={partial ? "cloud-offline-outline" : "phone-portrait-outline"}
        size={17}
        color={colors.saffron}
      />
      <View className="min-w-0 flex-1">
        <Text className="text-xs leading-5 text-muted">
          {t(partial ? "offlinePartial" : "offlineFallback")}
        </Text>
        {onRetry ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Retry loading content"
            accessibilityHint="Checks the connected content library again"
            disabled={retrying}
            onPress={onRetry}
            className="mt-2 self-start rounded-full bg-surface px-3 py-1.5"
          >
            <Text className="text-xs font-semibold text-plum">
              {retrying ? "Retrying…" : "Try again"}
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
