import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { Text, View } from "react-native";

import { PrimaryButton } from "@/components/ui";
import { useCopy } from "@/lib/i18n";
import { colors } from "@/theme/tokens";

export function PremiumGate() {
  const router = useRouter();
  const t = useCopy();
  return (
    <View className="mt-6 items-center rounded-[24px] border border-saffron bg-warm p-5">
      <Ionicons name="lock-closed-outline" size={27} color={colors.saffron} />
      <Text className="mt-3 text-center text-lg font-semibold text-ink">
        {t("guideUnavailable")}
      </Text>
      <Text className="mb-4 mt-1 text-center text-sm leading-5 text-muted">
        {t("guideUnavailableBody")}
      </Text>
      <PrimaryButton label={t("browseLibrary")} onPress={() => router.replace("/(tabs)/explore")} />
    </View>
  );
}
