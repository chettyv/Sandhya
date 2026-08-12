import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";

import { useAppStore } from "@/store/useAppStore";

export default function Index() {
  const hydrated = useAppStore((state) => state.hydrated);
  const hasCompletedOnboarding = useAppStore((state) => state.hasCompletedOnboarding);
  if (!hydrated)
    return (
      <View className="flex-1 items-center justify-center bg-parchment">
        <ActivityIndicator />
      </View>
    );
  if (!hasCompletedOnboarding) return <Redirect href={"/onboarding"} />;
  return <Redirect href="/(tabs)" />;
}
