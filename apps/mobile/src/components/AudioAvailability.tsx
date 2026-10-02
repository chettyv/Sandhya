import { Text, View } from "react-native";

import type { AudioAsset } from "@/lib/audio";

export function AudioAvailability({
  asset,
  label = "Pronunciation audio",
}: {
  asset: AudioAsset | null;
  label?: string;
}) {
  return (
    <View
      className="mt-4 rounded-xl border border-line bg-sand px-4 py-3"
      accessible
      accessibilityRole="text"
      accessibilityLabel={asset ? `${label} is not enabled in this build` : `${label} unavailable`}
    >
      <Text className="text-sm font-semibold text-ink">
        {asset ? `${label} is not enabled yet` : `${label} unavailable`}
      </Text>
      <Text className="mt-1 text-sm leading-5 text-muted">
        {asset
          ? "This recording is catalogued, but playback is waiting on the approved mobile audio player."
          : "The written Devanagari, IAST, and Say it lines remain available while a reviewed recording is prepared."}
      </Text>
    </View>
  );
}
