import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { colors } from "@/theme/tokens";

export function PremiumGate({ label = "Continue with Plus" }: { label?: string }) {
  const router = useRouter();
  return (
    <View className="mt-6 items-center rounded-[24px] border border-saffron bg-warm p-5">
      <Ionicons name="sparkles" size={27} color={colors.saffron} />
      <Text className="mt-3 text-center text-lg font-semibold text-ink">
        A deeper library awaits
      </Text>
      <Text className="mt-1 text-center text-sm leading-5 text-muted">
        This guide is part of Sandhya Plus. Free members can keep exploring the daily reflection,
        starter practices, and core concepts.
      </Text>
      <Pressable
        accessibilityRole="button"
        onPress={() => router.push("/subscription")}
        className="mt-4 rounded-full bg-saffron px-5 py-3"
      >
        <Text className="font-semibold text-black">{label}</Text>
      </Pressable>
    </View>
  );
}
