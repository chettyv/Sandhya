import Ionicons from "@expo/vector-icons/Ionicons";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, TextInput, View } from "react-native";

import { Card, ListRow, Page, PrimaryButton, SecondaryButton } from "@/components/ui";
import { signOut, updateProfile } from "@/lib/account";
import { useAuthState } from "@/lib/authState";
import { contentLanguageNames } from "@/lib/shlokas";
import { planLabel, useSubscription } from "@/lib/subscriptions";
import { useAppStore } from "@/store/useAppStore";
import { colors } from "@/theme/tokens";

export default function ProfileScreen() {
  const router = useRouter();
  const displayName = useAppStore((state) => state.displayName);
  const setDisplayName = useAppStore((state) => state.setDisplayName);
  const reminderEnabled = useAppStore((state) => state.reminderEnabled);
  const contentLanguage = useAppStore((state) => state.contentLanguage);
  const reminderTime = useAppStore((state) => state.reminderTime);
  const traditionPreference = useAppStore((state) => state.traditionPreference);
  const { data: subscription, isChecking: subscriptionChecking } = useSubscription();
  const authState = useAuthState();
  const signedIn = authState === "signed_in";
  const [editing, setEditing] = useState(false);
  const [nameDraft, setNameDraft] = useState(displayName);
  return (
    <Page>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="mb-2 flex-row items-center justify-between">
        <Pressable
          accessibilityLabel="Close profile"
          accessibilityRole="button"
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center"
        >
          <Ionicons name="close" size={28} color={colors.ink} />
        </Pressable>
        <Text className="text-base font-semibold text-muted">Profile</Text>
        <View className="h-10 w-10" />
      </View>
      <View className="items-center pb-7 pt-2">
        <View className="h-24 w-24 items-center justify-center rounded-full bg-aubergine">
          <Text className="text-4xl font-semibold text-white">
            {displayName.slice(0, 1).toUpperCase()}
          </Text>
        </View>
        {editing ? (
          <View className="mt-4 w-full max-w-[260px] flex-row items-center gap-2">
            <TextInput
              accessibilityLabel="Display name"
              value={nameDraft}
              onChangeText={setNameDraft}
              autoFocus
              maxLength={24}
              className="h-11 flex-1 rounded-lg border border-line bg-surface px-3 text-center text-[17px] text-ink"
            />
            <Pressable
              accessibilityLabel="Save display name"
              accessibilityRole="button"
              onPress={() => {
                const nextName = nameDraft.trim();
                if (!nextName) return;
                setDisplayName(nextName);
                setEditing(false);
                void updateProfile({ display_name: nextName }).catch((error: unknown) =>
                  Alert.alert(
                    "Could not sync profile",
                    error instanceof Error ? error.message : "Your name was saved on this device.",
                  ),
                );
              }}
              className="h-11 w-11 items-center justify-center rounded-lg bg-saffron"
            >
              <Ionicons name="checkmark" size={20} color={colors.black} />
            </Pressable>
          </View>
        ) : (
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              setNameDraft(displayName);
              setEditing(true);
            }}
          >
            <Text className="mt-4 text-2xl font-semibold text-ink">
              {displayName} <Text className="text-base text-saffron">Edit</Text>
            </Text>
          </Pressable>
        )}
        {authState === "loading" ? (
          <View className="mt-2 flex-row items-center gap-2">
            <ActivityIndicator size="small" color={colors.saffron} />
            <Text className="text-sm text-muted">Checking account…</Text>
          </View>
        ) : (
          <Text className="mt-1 text-sm text-muted">
            {signedIn ? "Synced journey" : "Guest journey · stored on this device"}
          </Text>
        )}
      </View>

      {authState === "loading" ? null : signedIn ? (
        <View className="flex-row items-center justify-between rounded-card border border-line bg-surface p-4">
          <View>
            <Text className="font-semibold text-ink">Current plan</Text>
            <Text className="mt-1 text-sm text-muted">
              {subscriptionChecking ? "Checking…" : planLabel(subscription.plan)}
            </Text>
          </View>
          <Pressable accessibilityRole="button" onPress={() => router.push("/subscription")}>
            <Text className="font-semibold text-saffron">Manage</Text>
          </Pressable>
        </View>
      ) : (
        <PrimaryButton
          label="Sign in to keep your journey"
          icon="person-outline"
          onPress={() => router.push("/sign-in")}
        />
      )}
      {authState !== "loading" && !signedIn ? (
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push("/subscription")}
          className="mt-3 items-center py-2"
        >
          <Text className="font-semibold text-plum">Explore Sandhya Plus</Text>
        </Pressable>
      ) : null}

      <Text className="mb-2 mt-8 text-sm font-semibold uppercase tracking-wider text-muted">
        Your library
      </Text>
      <Card>
        <ListRow
          icon="bookmark-outline"
          title="Saved items"
          subtitle="Teachings, festivals, and practices"
          onPress={() => router.push("/saved")}
        />
        <ListRow
          icon="journal-outline"
          title="Journal"
          subtitle="Your private reflections"
          onPress={() => router.push("/journal")}
        />
      </Card>

      <Text className="mb-2 mt-7 text-sm font-semibold uppercase tracking-wider text-muted">
        Preferences
      </Text>
      <Card>
        <ListRow
          icon="git-branch-outline"
          title="Tradition preference"
          subtitle={traditionPreference}
          onPress={() => router.push("/settings")}
        />
        <ListRow
          icon="language-outline"
          title="Language"
          subtitle={contentLanguageNames[contentLanguage] ?? contentLanguage}
          onPress={() => router.push("/settings")}
        />
        <ListRow
          icon="notifications-outline"
          title="Daily reminder"
          subtitle={reminderEnabled ? `On · ${reminderTime}` : "Off"}
          onPress={() => router.push("/settings")}
        />
        <ListRow
          icon="settings-outline"
          title="Settings"
          onPress={() => router.push("/settings")}
        />
      </Card>

      <View className="mt-6 rounded-card bg-surface2 p-4">
        <Text className="text-center text-xs leading-5 text-muted">
          Sandhya offers educational information and reflective practices. It does not replace a
          guru, priest, doctor, therapist, lawyer, or financial adviser.
        </Text>
      </View>
      <View className="mt-4">
        <SecondaryButton
          label={
            authState === "loading"
              ? "Checking account…"
              : signedIn
                ? "Sign out of this device"
                : "Close profile"
          }
          icon="log-out-outline"
          disabled={authState === "loading"}
          onPress={() =>
            void (signedIn
              ? signOut()
                  .then(() => router.replace("/(tabs)"))
                  .catch((error: unknown) =>
                    Alert.alert(
                      "Could not sign out",
                      error instanceof Error ? error.message : "Please try again.",
                    ),
                  )
              : router.back())
          }
        />
      </View>
    </Page>
  );
}
