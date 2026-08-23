import Ionicons from "@expo/vector-icons/Ionicons";
import { useQueryClient } from "@tanstack/react-query";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuthState } from "@/lib/authState";
import { paymentsEnabled } from "@/lib/payments";
import {
  getPurchaseOptions,
  planLabel,
  purchasePlan,
  restorePurchases,
  useSubscription,
  type PurchaseOption,
} from "@/lib/subscriptions";
import { colors, layout } from "@/theme/tokens";

const benefits = [
  [
    "book-outline",
    "Deeper guided library",
    "Unlock longer practices and additional festival guides while the free learning library stays open.",
  ],
  [
    "sparkles-outline",
    "More grounded Ask Dharma conversations",
    "Free includes five grounded questions each day; Plus removes the daily cap, subject to fair-use safeguards.",
  ],
  [
    "notifications-outline",
    "Personal daily rhythm",
    "Keep reminders, saved answers, and private journal entries together.",
  ],
] as const;

export default function SubscriptionScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: subscription, isChecking: subscriptionChecking } = useSubscription();
  const authState = useAuthState();
  const [options, setOptions] = useState<PurchaseOption[]>([]);
  const [busy, setBusy] = useState(false);
  const signedIn = authState === "signed_in";

  if (!paymentsEnabled) {
    return (
      <SafeAreaView edges={["bottom"]} className="flex-1 bg-parchment">
        <View className="flex-1 items-center justify-center px-8">
          <Ionicons name="heart-outline" size={40} color={colors.saffron} />
          <Text className="mt-4 text-center text-xl font-semibold text-ink">
            Everything is free right now
          </Text>
          <Text className="mt-3 text-center text-[15px] leading-6 text-muted">
            The full library, daily shloka, practices, and festival guides are all open while
            Sandhya is in its early free period. If a paid tier ever arrives, nothing you rely on
            today will be taken away without clear notice.
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.back()}
            className="mt-6 min-h-11 items-center justify-center rounded-lg bg-saffron px-6 py-3"
          >
            <Text className="text-base font-semibold text-black">Back to the app</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }
  const isPlus = subscription.plan !== "free";
  const storeSetupMessage =
    Platform.OS === "web"
      ? "Purchases are available in the iOS and Android app. Use the mobile app to subscribe or restore access."
      : "The RevenueCat public keys and App Store / Play product IDs must be configured before purchases can be enabled.";
  useEffect(() => {
    if (!signedIn) {
      setOptions([]);
      return;
    }
    void getPurchaseOptions()
      .then(setOptions)
      .catch(() => setOptions([]));
  }, [signedIn]);
  const startPurchase = async (plan: "annual" | "monthly" | "lifetime") => {
    if (!signedIn) {
      Alert.alert(
        "Sign in required",
        "Create an account or sign in so your purchase can be linked securely across devices.",
      );
      return;
    }
    if (!options.length) {
      Alert.alert("Store setup needed", storeSetupMessage);
      return;
    }
    if (!options.some((option) => option.plan === plan)) {
      Alert.alert(
        "Plan unavailable",
        "This plan is not currently configured in the store offering. Please choose another plan or try again later.",
      );
      return;
    }
    setBusy(true);
    try {
      await purchasePlan(plan);
      await queryClient.invalidateQueries({ queryKey: ["subscription-status"] });
      queryClient.removeQueries({ queryKey: ["curated-content"] });
      Alert.alert(
        "Thank you",
        "Your purchase is being verified. Plus access will appear as soon as the store webhook updates your account.",
      );
    } catch (error) {
      Alert.alert(
        "Purchase not completed",
        error instanceof Error ? error.message : "Please try again.",
      );
    } finally {
      setBusy(false);
    }
  };
  const restore = async () => {
    if (!signedIn) {
      Alert.alert("Sign in required", "Sign in before restoring purchases.");
      return;
    }
    setBusy(true);
    try {
      await restorePurchases();
      await queryClient.invalidateQueries({ queryKey: ["subscription-status"] });
      queryClient.removeQueries({ queryKey: ["curated-content"] });
      Alert.alert("Purchases restored", "Your entitlement is being checked.");
    } catch (error) {
      Alert.alert(
        "Could not restore purchases",
        error instanceof Error ? error.message : "Please try again.",
      );
    } finally {
      setBusy(false);
    }
  };
  const manageSubscription = () => {
    if (subscription.plan === "lifetime") return;
    if (Platform.OS === "web") {
      Alert.alert(
        "Manage subscription",
        "Manage billing from the Apple or Google account used for purchase.",
      );
      return;
    }
    const url =
      Platform.OS === "ios"
        ? "https://apps.apple.com/account/subscriptions"
        : "https://play.google.com/store/account/subscriptions";
    void Linking.openURL(url).catch(() =>
      Alert.alert("Manage subscription", "Open your Apple or Google account to manage billing."),
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-parchment">
      <ScrollView contentContainerStyle={{ padding: layout.screenPadding, paddingBottom: 48 }}>
        <Stack.Screen options={{ headerShown: false }} />
        <View className="flex-row items-center justify-between">
          <Pressable
            accessibilityLabel="Close subscription"
            accessibilityRole="button"
            onPress={() => router.back()}
            className="h-10 w-10 items-center justify-center"
          >
            <Ionicons name="close" size={26} color={colors.ink} />
          </Pressable>
          <Text className="text-base font-semibold text-muted">Sandhya Plus</Text>
          <View className="h-10 w-10" />
        </View>
        <View className="mt-8 items-center rounded-[28px] bg-aubergine p-6">
          <Ionicons name="sparkles" size={32} color={colors.saffron} />
          <Text className="mt-4 text-center text-[28px] font-semibold text-white">
            A deeper daily practice.
          </Text>
          <Text className="mt-2 text-center leading-6 text-[#FFF3DE]">
            Support carefully sourced Hindu learning and make more room for your own questions.
          </Text>
          <View className="mt-5 rounded-full bg-warm px-4 py-2">
            <Text className="text-sm font-semibold text-saffronText">
              {subscriptionChecking
                ? "Checking plan…"
                : isPlus
                  ? planLabel(subscription.plan)
                  : "Free plan"}
            </Text>
          </View>
        </View>
        <View className="mt-7 gap-3">
          {benefits.map(([icon, title, body]) => (
            <View
              key={title}
              className="flex-row gap-3 rounded-card border border-line bg-surface p-4"
            >
              <Ionicons name={icon} size={23} color={colors.saffron} />
              <View className="flex-1">
                <Text className="font-semibold text-ink">{title}</Text>
                <Text className="mt-1 text-sm leading-5 text-muted">{body}</Text>
              </View>
            </View>
          ))}
        </View>
        {subscriptionChecking || authState === "loading" ? (
          <View className="mt-8 items-center rounded-card border border-line bg-surface p-5">
            <ActivityIndicator color={colors.saffron} />
            <Text className="mt-3 text-sm text-muted">Checking your current entitlement…</Text>
          </View>
        ) : !isPlus ? (
          signedIn ? (
            <>
              <Text className="mb-3 mt-8 text-sm font-semibold uppercase text-muted">
                Choose your plan
              </Text>
              <Text className="mb-1 text-sm leading-5 text-muted">
                Prices are shown in your local store currency. Annual and monthly plans renew until
                cancelled; lifetime is a one-time purchase.
              </Text>
              {!options.length ? (
                <View className="rounded-card border border-line bg-surface2 p-4">
                  <Text className="text-sm leading-5 text-muted">{storeSetupMessage}</Text>
                </View>
              ) : null}
              <PlanButton
                option={options.find((option) => option.plan === "annual")}
                fallbackTitle="Plus annual"
                fallbackSubtitle="Best value · renews yearly until cancelled"
                onPress={() => void startPurchase("annual")}
                disabled={busy || !options.some((option) => option.plan === "annual")}
              />
              <PlanButton
                option={options.find((option) => option.plan === "monthly")}
                fallbackTitle="Plus monthly"
                fallbackSubtitle="Renews monthly until cancelled"
                onPress={() => void startPurchase("monthly")}
                disabled={busy || !options.some((option) => option.plan === "monthly")}
              />
              <PlanButton
                option={options.find((option) => option.plan === "lifetime")}
                fallbackTitle="Plus lifetime"
                fallbackSubtitle="One-time purchase · no renewal"
                onPress={() => void startPurchase("lifetime")}
                disabled={busy || !options.some((option) => option.plan === "lifetime")}
              />
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ disabled: busy }}
                disabled={busy}
                onPress={() => void restore()}
                className="mt-4 items-center py-2"
              >
                <Text className="font-semibold text-plum">Restore purchases</Text>
              </Pressable>
              <Text className="mt-2 text-center text-xs leading-5 text-muted">
                Subscriptions are handled by Apple and Google. Cancel or manage them from your store
                account.
              </Text>
              <Pressable
                accessibilityRole="link"
                onPress={() => router.push("/legal")}
                className="mt-3 items-center py-2"
              >
                <Text className="text-xs font-semibold text-plum">
                  Privacy, terms, and billing details
                </Text>
              </Pressable>
              {busy ? <ActivityIndicator className="mt-3" color={colors.saffron} /> : null}
            </>
          ) : (
            <View className="mt-8 rounded-card border border-line bg-surface p-5">
              <Text className="text-lg font-semibold text-ink">Sign in to continue</Text>
              <Text className="mt-1 text-sm leading-5 text-muted">
                Your subscription is linked to your Sandhya account so access and purchases can be
                restored safely.
              </Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => router.push("/sign-in")}
                className="mt-4 self-start rounded-full bg-saffron px-5 py-3"
              >
                <Text className="font-semibold text-black">Sign in</Text>
              </Pressable>
            </View>
          )
        ) : (
          <View className="mt-8 rounded-card bg-sageSoft p-4">
            <Text className="font-semibold text-sageText">
              {subscription.status === "billing_issue"
                ? "Your Plus billing needs attention."
                : subscription.status === "cancelled"
                  ? "Your Plus access is active until the end of the current period."
                  : "Your Plus access is active."}
            </Text>
            <Text className="mt-1 text-sm leading-5 text-sageText">
              {subscription.status === "billing_issue"
                ? "Update your store payment method to keep uninterrupted access."
                : "Thank you for supporting a respectful, source-conscious learning space."}
            </Text>
            {subscription.plan !== "lifetime" ? (
              <Pressable
                accessibilityRole="button"
                onPress={manageSubscription}
                className="mt-3 self-start rounded-full border border-sage px-4 py-2"
              >
                <Text className="text-sm font-semibold text-sageText">Manage subscription</Text>
              </Pressable>
            ) : null}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function PlanButton({
  option,
  fallbackTitle,
  fallbackSubtitle,
  onPress,
  disabled,
}: {
  option?: PurchaseOption;
  fallbackTitle: string;
  fallbackSubtitle: string;
  onPress: () => void;
  disabled: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      className="mt-3 rounded-card border border-line bg-surface p-4"
    >
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-lg font-semibold text-ink">{option?.title ?? fallbackTitle}</Text>
          <Text className="mt-1 text-sm text-muted">
            {option?.price ? `${option.price} · ${fallbackSubtitle}` : fallbackSubtitle}
          </Text>
        </View>
        <Text className="font-semibold text-saffronText">Upgrade</Text>
      </View>
    </Pressable>
  );
}
