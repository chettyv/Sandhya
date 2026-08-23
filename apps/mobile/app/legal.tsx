import { Stack, useRouter } from "expo-router";
import { Alert, Linking, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { layout } from "@/theme/tokens";

export default function LegalScreen() {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-parchment">
      <ScrollView contentContainerStyle={{ padding: layout.screenPadding, paddingBottom: 48 }}>
        <Stack.Screen options={{ headerShown: false }} />
        <View className="flex-row items-center justify-between">
          <Pressable
            accessibilityLabel="Close legal information"
            accessibilityRole="button"
            onPress={() => router.back()}
            className="h-10 w-10 items-center justify-center"
          >
            <Text className="text-3xl text-ink">×</Text>
          </Pressable>
          <Text className="text-base font-semibold text-muted">Privacy and terms</Text>
          <View className="h-10 w-10" />
        </View>
        <Text className="mt-8 text-[30px] font-semibold text-ink">A respectful learning space</Text>
        <Text className="mt-3 text-base leading-6 text-muted">
          Sandhya is educational software for Hindu learning and personal reflection. It is not a
          religious authority, guru, priest, doctor, therapist, lawyer, or financial adviser.
        </Text>
        {!process.env.EXPO_PUBLIC_PRIVACY_URL || !process.env.EXPO_PUBLIC_TERMS_URL ? (
          <View
            accessibilityRole="alert"
            className="mt-5 rounded-card border border-saffron bg-[#FFF1D6] p-4"
          >
            <Text className="font-semibold text-saffron">Release links are not configured</Text>
            <Text className="mt-1 text-sm leading-5 text-muted">
              This preview contains the app&apos;s data summary, but the final build must publish
              its Privacy Policy and Terms of Use URLs before distribution.
            </Text>
          </View>
        ) : null}
        {process.env.EXPO_PUBLIC_PRIVACY_URL || process.env.EXPO_PUBLIC_TERMS_URL ? (
          <View className="mt-5 flex-row flex-wrap gap-3">
            {process.env.EXPO_PUBLIC_PRIVACY_URL ? (
              <ExternalLink label="Privacy policy" url={process.env.EXPO_PUBLIC_PRIVACY_URL} />
            ) : null}
            {process.env.EXPO_PUBLIC_TERMS_URL ? (
              <ExternalLink label="Terms of use" url={process.env.EXPO_PUBLIC_TERMS_URL} />
            ) : null}
          </View>
        ) : null}

        <Section title="What we collect">
          When you create an account, we store the information needed to provide sign-in, profile
          preferences, saved items, private journal entries, conversation history, feedback, and
          subscription access. Push notification tokens are stored only when you enable reminders.
          The app does not require contacts, photos, microphone, camera, or precise location.
        </Section>

        <Section title="Your data">
          Account data, saved items, conversations, feedback, and journal entries are stored only to
          provide the features you choose. Journal entries are private and are not used as public
          content. Native authentication sessions use the device’s secure storage; the web preview
          uses browser storage. You can export a JSON copy of your synced account data or delete
          your account from Settings. Deletion removes synced account data and cannot be undone.
          Deleting an account does not cancel an Apple or Google subscription.
        </Section>
        <Section title="Ask Dharma">
          Ask Dharma uses a source-retrieval and language-model pipeline. Answers can be incomplete
          or wrong, and traditions may differ. The app should show only sources actually retrieved
          for an answer. Do not use it for medical, legal, financial, crisis, or emergency
          decisions.
        </Section>
        <Section title="How answers are handled">
          Questions are sent to our authenticated backend so the app can enforce safety checks,
          usage limits, source permissions, and account history without exposing model credentials
          in the app. We do not use journal entries as a source for Ask Dharma. Optional anonymous
          diagnostics are disabled by default and can be enabled or disabled in Settings; when
          enabled, they are redacted and should not contain your question, answer, journal text,
          email, user ID, or authentication token.
        </Section>
        <Section title="Subscriptions">
          Paid access is handled by the applicable app store and RevenueCat. Cancellation, renewal,
          billing, and refunds follow the store account and its policies. A Plus entitlement is
          granted only after the verified subscription state reaches the backend. The exact price,
          billing period, renewal terms, and available plans are shown by the store before you
          confirm a purchase. Restore purchases from the Plus screen after signing in.
        </Section>
        <Section title="Content and licensing">
          Scripture, commentary, translation, folklore, and app-authored guidance are separate
          categories. Content is included only after source, translator, licence, storage, excerpt,
          and embedding rights have been reviewed.
        </Section>
        <Section title="Contact">
          Use Help and feedback in Settings to contact the app team. The release build must set a
          monitored support email and publish the Privacy policy and Terms of use URLs before
          distribution. For an urgent safety issue, contact local emergency services or a qualified
          professional rather than the app.
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, children }: { title: string; children: string }) {
  return (
    <View className="mt-7 rounded-card border border-line bg-surface p-4">
      <Text className="text-lg font-semibold text-ink">{title}</Text>
      <Text className="mt-2 text-[15px] leading-6 text-muted">{children}</Text>
    </View>
  );
}

function ExternalLink({ label, url }: { label: string; url: string }) {
  return (
    <Pressable
      accessibilityRole="link"
      onPress={() =>
        void Linking.openURL(url).catch(() =>
          Alert.alert("Could not open link", "Please try again or contact support from Settings."),
        )
      }
      className="rounded-full border border-line bg-surface px-4 py-2.5"
    >
      <Text className="font-semibold text-plum">{label}</Text>
    </Pressable>
  );
}
