import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Linking, Pressable, Share, Switch, Text, View } from "react-native";

import { Card, ListRow, Page } from "@/components/ui";
import { deleteAccount, exportAccountData, updateProfile } from "@/lib/account";
import { useAuthState } from "@/lib/authState";
import { configureDailyReminder } from "@/lib/notifications";
import { getTelemetryConsent, setTelemetryConsent } from "@/lib/telemetry";
import { useAppStore } from "@/store/useAppStore";
import { colors } from "@/theme/tokens";

export default function SettingsScreen() {
  const router = useRouter();
  const reminder = useAppStore((state) => state.reminderEnabled);
  const reminderTime = useAppStore((state) => state.reminderTime);
  const setReminder = useAppStore((state) => state.setReminder);
  const storedTradition = useAppStore((state) => state.traditionPreference);
  const setTraditionPreference = useAppStore((state) => state.setTraditionPreference);
  const [tradition, setTradition] = useState(
    storedTradition === "general" ? "All traditions" : storedTradition,
  );
  const authState = useAuthState();
  const signedIn = authState === "signed_in";
  const [reminderBusy, setReminderBusy] = useState(false);
  const [exportBusy, setExportBusy] = useState(false);
  const [telemetryEnabled, setTelemetryEnabled] = useState(false);
  const traditions = ["All traditions", "Vaishnava", "Shaiva", "Shakta", "Smarta"];
  const supportEmail = process.env.EXPO_PUBLIC_SUPPORT_EMAIL?.trim() || null;
  useEffect(() => {
    setTradition(storedTradition === "general" ? "All traditions" : storedTradition);
  }, [storedTradition]);
  useEffect(() => {
    void getTelemetryConsent().then(setTelemetryEnabled);
  }, []);
  const savePreference = (patch: Parameters<typeof updateProfile>[0]) => {
    void updateProfile(patch).catch((error: unknown) =>
      Alert.alert(
        "Could not sync preference",
        error instanceof Error ? error.message : "Your preference was saved on this device.",
      ),
    );
  };
  const removeAccount = () => {
    Alert.alert(
      "Delete account?",
      "This permanently removes your synced data and cannot be undone. Deleting your Dharma Daily account does not cancel an Apple or Google subscription; manage billing in the store first if needed.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () =>
            void deleteAccount()
              .then(() => {
                Alert.alert(
                  "Account deleted",
                  "Your Dharma Daily account and synced data have been removed.",
                  [{ text: "Continue", onPress: () => router.replace("/(tabs)") }],
                );
              })
              .catch((error: unknown) =>
                Alert.alert(
                  "Could not delete account",
                  error instanceof Error ? error.message : "Please try again.",
                ),
              ),
        },
      ],
    );
  };
  const shareAccountExport = async () => {
    if (exportBusy) return;
    setExportBusy(true);
    try {
      const json = await exportAccountData();
      await Share.share({
        title: "Dharma Daily account export",
        message: json,
      });
    } catch (error) {
      Alert.alert(
        "Could not export account data",
        error instanceof Error ? error.message : "Please try again.",
      );
    } finally {
      setExportBusy(false);
    }
  };
  const changeTelemetry = async (enabled: boolean) => {
    try {
      await setTelemetryConsent(enabled);
      setTelemetryEnabled(enabled);
    } catch {
      Alert.alert("Could not update diagnostics preference", "Please try again.");
    }
  };
  const changeReminder = async (enabled: boolean, time = reminderTime) => {
    setReminderBusy(true);
    const result = await configureDailyReminder(enabled, time).catch((error: unknown) => ({
      enabled: false,
      remoteRegistered: false,
      reason: error instanceof Error ? error.message : "Could not configure reminders.",
    }));
    setReminderBusy(false);
    if (!result.enabled) {
      Alert.alert("Reminders unavailable", result.reason ?? "Please try again.");
      return;
    }
    setReminder(enabled, time);
    savePreference({
      notification_time: enabled ? `${time}:00` : null,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
  };
  const chooseReminderTime = () => {
    Alert.alert("Reminder time", "Choose when Dharma Daily should invite you back.", [
      ...["08:00", "12:00", "20:00"].map((time) => ({
        text: time,
        onPress: () => {
          if (reminder) void changeReminder(true, time);
          else setReminder(false, time);
        },
      })),
      { text: "Cancel", style: "cancel" },
    ]);
  };
  const openSupport = () => {
    if (!supportEmail) {
      Alert.alert(
        "Support is not configured",
        "The app team must set a monitored support email before this build is distributed.",
      );
      return;
    }
    void Linking.openURL(`mailto:${supportEmail}?subject=Dharma%20Daily%20support`).catch(() =>
      Alert.alert("Support", `Please email ${supportEmail} for help.`),
    );
  };
  return (
    <Page>
      <Text className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted">
        Personalisation
      </Text>
      <Card>
        <ListRow
          icon="notifications-outline"
          title="Daily reflection reminder"
          subtitle={reminder ? `${reminderTime} · every day` : "Off"}
          trailing={
            <Switch
              accessibilityLabel="Daily reflection reminder"
              value={reminder}
              disabled={reminderBusy}
              onValueChange={(value) => void changeReminder(value)}
              trackColor={{ false: "#3D3932", true: "#8C7118" }}
              thumbColor={reminder ? colors.saffron : "#FFFFFF"}
            />
          }
        />
        <ListRow
          icon="time-outline"
          title="Reminder time"
          subtitle={reminderTime}
          onPress={chooseReminderTime}
        />
        <ListRow
          icon="moon-outline"
          title="Appearance"
          subtitle="Dharma Daily dark"
          onPress={() =>
            Alert.alert(
              "Appearance",
              "Dharma Daily uses a calm dark palette designed for reading and reflection.",
            )
          }
        />
        <ListRow
          icon="language-outline"
          title="Language"
          subtitle="English"
          onPress={() => Alert.alert("Language", "Dharma Daily is currently available in English.")}
        />
      </Card>

      <Text className="mb-2 mt-7 text-sm font-semibold uppercase tracking-wider text-muted">
        Tradition preference
      </Text>
      <Text className="mb-3 text-sm leading-5 text-muted">
        This filters and contextualises content; it never hides the existence of other
        interpretations.
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {traditions.map((item) => (
          <Pressable
            key={item}
            accessibilityRole="button"
            accessibilityState={{ selected: tradition === item }}
            onPress={() => {
              setTradition(item);
              setTraditionPreference(item);
              savePreference({
                tradition_pref: item === "All traditions" ? "general" : item.toLowerCase(),
              });
            }}
            className={`rounded-full px-4 py-2.5 ${tradition === item ? "bg-saffron" : "border border-[#302C25] bg-surface"}`}
          >
            <Text
              className={`text-sm font-semibold ${tradition === item ? "text-black" : "text-muted"}`}
            >
              {item}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text className="mb-2 mt-7 text-sm font-semibold uppercase tracking-wider text-muted">
        About and support
      </Text>
      <Card>
        <ListRow
          icon="shield-checkmark-outline"
          title="Privacy and data"
          onPress={() => router.push("/legal")}
        />
        <ListRow icon="help-circle-outline" title="Help and feedback" onPress={openSupport} />
        <ListRow
          icon="document-text-outline"
          title="Sources and licensing"
          onPress={() => router.push("/legal")}
        />
        <ListRow
          icon="analytics-outline"
          title="Anonymous diagnostics"
          subtitle={telemetryEnabled ? "On · you can turn this off anytime" : "Off by default"}
          trailing={
            <Switch
              accessibilityLabel="Anonymous diagnostics"
              value={telemetryEnabled}
              onValueChange={(value) => void changeTelemetry(value)}
              trackColor={{ false: "#3D3932", true: "#8C7118" }}
              thumbColor={telemetryEnabled ? colors.saffron : "#FFFFFF"}
            />
          }
        />
      </Card>

      <Text className="mb-2 mt-7 text-sm font-semibold uppercase tracking-wider text-muted">
        Account
      </Text>
      <Card>
        {authState === "loading" ? (
          <ListRow
            icon="person-outline"
            title="Checking account…"
            subtitle="Loading your secure session"
          />
        ) : signedIn ? (
          <>
            <ListRow
              icon="download-outline"
              title={exportBusy ? "Preparing export…" : "Export my data"}
              subtitle="Share a JSON copy of your synced account data"
              onPress={() => void shareAccountExport()}
            />
            <ListRow
              icon="trash-outline"
              title="Delete account"
              subtitle="Permanently remove your synced data"
              danger
              onPress={removeAccount}
            />
          </>
        ) : (
          <ListRow
            icon="person-add-outline"
            title="Sign in to manage your account"
            subtitle="Guest data stays on this device"
            onPress={() => router.push("/sign-in")}
          />
        )}
      </Card>
      <Text className="mt-6 text-center text-xs leading-5 text-muted">
        Dharma Daily 1.0.0 · Made with care for diverse traditions
      </Text>
    </Page>
  );
}
