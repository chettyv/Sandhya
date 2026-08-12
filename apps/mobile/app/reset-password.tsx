import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Text, TextInput, View } from "react-native";

import { Page, PrimaryButton } from "@/components/ui";
import { supabase } from "@/lib/supabase";
import { colors } from "@/theme/tokens";

export default function ResetPasswordScreen() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [saving, setSaving] = useState(false);
  const [complete, setComplete] = useState(false);

  const updatePassword = async () => {
    if (!supabase) {
      Alert.alert(
        "Connect Supabase first",
        "The app is not connected to its secure account service yet.",
      );
      return;
    }
    if (password.length < 8) {
      Alert.alert("Choose a stronger password", "Use at least 8 characters.");
      return;
    }
    if (password !== confirmation) {
      Alert.alert("Passwords do not match", "Enter the same password in both fields.");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        Alert.alert("Could not update password", error.message);
        return;
      }
      setComplete(true);
    } catch (error) {
      Alert.alert(
        "Could not update password",
        error instanceof Error && error.message.trim()
          ? error.message
          : "The account service could not be reached. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (complete) {
    return (
      <Page>
        <View className="flex-1 items-center justify-center py-24">
          <Text className="text-center text-2xl font-semibold text-ink">Password updated</Text>
          <Text className="mt-3 text-center text-[15px] leading-6 text-muted">
            Your new password is ready. You can continue your Dharma Daily journey.
          </Text>
          <View className="mt-6 w-full">
            <PrimaryButton
              label="Continue"
              icon="arrow-forward"
              onPress={() => router.replace("/(tabs)")}
            />
          </View>
        </View>
      </Page>
    );
  }

  return (
    <Page>
      <View className="pt-10">
        <Text className="text-[30px] font-semibold text-ink">Choose a new password</Text>
        <Text className="mt-3 text-[15px] leading-6 text-muted">
          Use at least 8 characters. This password will protect your synced journey and private
          journal.
        </Text>
      </View>

      <Text className="mb-2 mt-10 text-sm font-semibold text-ink">New password</Text>
      <TextInput
        accessibilityLabel="New password"
        value={password}
        onChangeText={setPassword}
        maxLength={128}
        secureTextEntry
        autoCapitalize="none"
        autoComplete="new-password"
        placeholder="At least 8 characters"
        placeholderTextColor={colors.muted}
        className="h-14 rounded-lg border border-[#302C25] bg-surface px-4 text-[16px] text-ink"
      />
      <Text className="mb-2 mt-4 text-sm font-semibold text-ink">Confirm new password</Text>
      <TextInput
        accessibilityLabel="Confirm new password"
        value={confirmation}
        onChangeText={setConfirmation}
        maxLength={128}
        secureTextEntry
        autoCapitalize="none"
        autoComplete="new-password"
        placeholder="Enter it again"
        placeholderTextColor={colors.muted}
        className="h-14 rounded-lg border border-[#302C25] bg-surface px-4 text-[16px] text-ink"
      />
      <View className="mt-6">
        <PrimaryButton
          label={saving ? "Updating…" : "Update password"}
          icon="lock-closed-outline"
          disabled={saving || !password || !confirmation}
          onPress={() => void updatePassword()}
        />
      </View>
    </Page>
  );
}
