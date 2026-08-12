import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, ScrollView, Switch, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { updateProfile } from "@/lib/account";
import { configureDailyReminder } from "@/lib/notifications";
import { track } from "@/lib/telemetry";
import { useAppStore } from "@/store/useAppStore";
import { colors, layout } from "@/theme/tokens";

const traditions = [
  ["All traditions", "general"],
  ["Vaishnava", "vaishnava"],
  ["Shaiva", "shaiva"],
  ["Shakta", "shakta"],
  ["Smarta", "smarta"],
] as const;

// Maps to content tags; drives which verses the daily rotation favours.
const focusOptions = [
  ["Courage", "courage"],
  ["Peace of mind", "peace"],
  ["Steadiness", "discipline"],
  ["Devotion", "devotion"],
  ["Understanding", "wisdom"],
  ["Family & tradition", "family"],
] as const;

export default function OnboardingScreen() {
  const router = useRouter();
  const setDisplayName = useAppStore((state) => state.setDisplayName);
  const setTraditionPreference = useAppStore((state) => state.setTraditionPreference);
  const setReminder = useAppStore((state) => state.setReminder);
  const setOnboardingComplete = useAppStore((state) => state.setOnboardingComplete);
  const setFocusTags = useAppStore((state) => state.setFocusTags);
  const [name, setName] = useState("");
  const [tradition, setTradition] = useState("All traditions");
  const [focus, setFocus] = useState<string[]>([]);
  const [reminders, setReminders] = useState(false);
  const [reminderTime, setReminderTime] = useState("08:00");
  const [finishing, setFinishing] = useState(false);

  const finish = async () => {
    if (finishing) return;
    setFinishing(true);
    try {
      const reminderResult = await configureDailyReminder(reminders, reminderTime).catch(
        (error: unknown) => ({
          enabled: false,
          reason: error instanceof Error ? error.message : "Reminders could not be enabled.",
        }),
      );
      const reminderEnabled = reminders && reminderResult.enabled;
      setDisplayName(name.trim() || "Friend");
      setTraditionPreference(tradition);
      setFocusTags(focus);
      setReminder(reminderEnabled, reminderTime);
      setOnboardingComplete();
      track("onboarding_completed", { focus_count: focus.length });
      try {
        await updateProfile({
          display_name: name.trim() || null,
          tradition_pref: traditions.find(([label]) => label === tradition)?.[1] ?? "general",
          notification_time: reminderEnabled ? `${reminderTime}:00` : null,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        });
      } catch {
        // Guests can complete onboarding locally and sync after signing in.
      }
      if (reminders && !reminderEnabled) {
        Alert.alert(
          "Reminder not enabled",
          reminderResult.reason ?? "You can allow reminders later from Settings.",
        );
      }
      router.replace("/(tabs)");
    } finally {
      setFinishing(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-parchment">
      <ScrollView contentContainerStyle={{ padding: layout.screenPadding, paddingBottom: 40 }}>
        <View className="mt-10">
          <Text className="text-sm font-semibold uppercase tracking-[2px] text-saffron">
            Sandhya
          </Text>
          <Text className="mt-3 text-[32px] font-semibold leading-10 text-ink">
            A small daily space for learning and practice.
          </Text>
          <Text className="mt-3 text-base leading-6 text-muted">
            Choose how you would like the app to meet you. You can change these preferences later.
          </Text>
        </View>

        <Text className="mb-2 mt-10 text-sm font-semibold uppercase text-muted">
          What should we call you?
        </Text>
        <TextInput
          accessibilityLabel="Your name"
          value={name}
          onChangeText={setName}
          maxLength={24}
          placeholder="Your name (optional)"
          placeholderTextColor={colors.muted}
          className="rounded-card border border-[#302C25] bg-surface px-4 py-3.5 text-base text-ink"
        />

        <Text className="mb-2 mt-7 text-sm font-semibold uppercase text-muted">
          Which perspectives would you like to see?
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {traditions.map(([label]) => (
            <Pressable
              key={label}
              accessibilityRole="button"
              accessibilityState={{ selected: tradition === label }}
              onPress={() => setTradition(label)}
              className={`rounded-full border px-3.5 py-2.5 ${tradition === label ? "border-aubergine bg-aubergine" : "border-[#302C25] bg-surface"}`}
            >
              <Text
                className={`text-sm font-semibold ${tradition === label ? "text-white" : "text-ink"}`}
              >
                {label}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text className="mb-2 mt-7 text-sm font-semibold uppercase text-muted">
          What would help most right now? (optional, up to two)
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {focusOptions.map(([label, tag]) => {
            const selected = focus.includes(tag);
            return (
              <Pressable
                key={tag}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() =>
                  setFocus(
                    selected ? focus.filter((item) => item !== tag) : [...focus, tag].slice(-2),
                  )
                }
                className={`rounded-full border px-3.5 py-2.5 ${selected ? "border-aubergine bg-aubergine" : "border-[#302C25] bg-surface"}`}
              >
                <Text className={`text-sm font-semibold ${selected ? "text-white" : "text-ink"}`}>
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View className="mt-7 flex-row items-center justify-between rounded-card border border-[#302C25] bg-surface p-4">
          <View className="flex-1 pr-4">
            <Text className="font-semibold text-ink">A gentle daily reminder</Text>
            <Text className="mt-1 text-sm leading-5 text-muted">
              You can choose the time in Settings.
            </Text>
          </View>
          <Switch
            accessibilityLabel="Enable daily reminders"
            value={reminders}
            onValueChange={setReminders}
            trackColor={{ false: "#6D665C", true: colors.saffron }}
            thumbColor={colors.parchment}
          />
        </View>
        {reminders ? (
          <View className="mt-3 rounded-card border border-[#302C25] bg-surface p-4">
            <Text className="text-sm font-semibold text-ink">Choose a reminder time</Text>
            <View className="mt-3 flex-row flex-wrap gap-2">
              {["07:00", "08:00", "12:00", "20:00"].map((time) => (
                <Pressable
                  key={time}
                  accessibilityRole="button"
                  accessibilityState={{ selected: reminderTime === time }}
                  onPress={() => setReminderTime(time)}
                  className={`rounded-full border px-3.5 py-2.5 ${reminderTime === time ? "border-aubergine bg-aubergine" : "border-[#302C25] bg-surface"}`}
                >
                  <Text
                    className={`text-sm font-semibold ${reminderTime === time ? "text-white" : "text-ink"}`}
                  >
                    {time}
                  </Text>
                </Pressable>
              ))}
            </View>
            <Text className="mt-2 text-xs leading-5 text-muted">
              You can change this later in Settings.
            </Text>
          </View>
        ) : null}

        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: finishing }}
          disabled={finishing}
          onPress={() => void finish()}
          className={`mt-9 items-center rounded-full px-5 py-4 ${finishing ? "bg-[#3C3934]" : "bg-saffron"}`}
        >
          <Text className={`font-semibold ${finishing ? "text-muted" : "text-black"}`}>
            {finishing ? "Setting up your space…" : "Begin my journey"}
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: finishing }}
          disabled={finishing}
          onPress={() => {
            setOnboardingComplete();
            router.replace("/(tabs)");
          }}
          className="mt-3 items-center py-3"
        >
          <Text className="font-semibold text-plum">Skip for now</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
