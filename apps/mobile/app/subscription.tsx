import { useRouter } from "expo-router";
import { Text } from "react-native";

import { Page, PrimaryButton, TopBar } from "@/components/ui";
import { useCopy } from "@/lib/i18n";

// Keep stale links useful without retaining the retired subscription storefront.
export default function SubscriptionScreen() {
  const router = useRouter();
  const t = useCopy();
  return (
    <Page>
      <TopBar title={t("subscriptionUnavailable")} />
      <Text className="mb-6 text-base leading-7 text-muted">{t("freeLibraryNotice")}</Text>
      <PrimaryButton label={t("backToApp")} onPress={() => router.replace("/(tabs)")} />
    </Page>
  );
}
