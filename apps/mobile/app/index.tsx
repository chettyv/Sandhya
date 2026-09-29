import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";

import { ONBOARDING_VERSION } from "@/features/onboarding/steps";
import { useAppStore } from "@/store/useAppStore";

export default function Index() {
  const hydrated = useAppStore((state) => state.hydrated);
  const hasCompletedOnboarding = useAppStore((state) => state.hasCompletedOnboarding);
  const onboardingVersion = useAppStore((state) => state.onboardingVersion);
  if (!hydrated)
    return (
      <View
        accessibilityRole="progressbar"
        accessibilityLabel="Loading Sandhya"
        accessibilityLiveRegion="polite"
        className="flex-1 items-center justify-center bg-parchment"
      >
        <ActivityIndicator />
      </View>
    );
  // Installs that finished an older flow come back through the new one: its
  // answers route content the old three questions never collected.
  if (!hasCompletedOnboarding || onboardingVersion < ONBOARDING_VERSION)
    return <Redirect href={"/onboarding"} />;
  return <Redirect href="/(tabs)" />;
}
