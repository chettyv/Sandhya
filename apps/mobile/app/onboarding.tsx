import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { AccessibilityInfo, Alert, Platform } from "react-native";

import type { BackdropMood } from "@/features/onboarding/components/Backdrop";
import { OnboardingShell } from "@/features/onboarding/components/OnboardingShell";
import { MultiChoice, SingleChoice } from "@/features/onboarding/components/steps/ChoiceSteps";
import { Interstitial } from "@/features/onboarding/components/steps/InterstitialStep";
import { Result } from "@/features/onboarding/components/steps/ResultStep";
import { TextStep } from "@/features/onboarding/components/steps/TextStep";
import { WelcomeStep } from "@/features/onboarding/components/steps/WelcomeStep";
import { StepTransition } from "@/features/onboarding/components/StepTransition";
import { buildProfile, resolveCopy } from "@/features/onboarding/engine";
import { ONBOARDING_VERSION } from "@/features/onboarding/steps";
import { useOnboardingFlow } from "@/features/onboarding/useOnboardingFlow";
import { updateProfile } from "@/lib/account";
import { configureDailyReminder } from "@/lib/notifications";
import { track } from "@/lib/telemetry";
import { useAppStore } from "@/store/useAppStore";

// One route, one flow controller, one configured list of steps. Each screen
// asks one thing; the answers are consumed by the home tab, the verse
// surfaces, the reminder and the greeting (see features/onboarding/steps.ts
// for what each one routes). A survey answer that changes nothing is worse
// than no survey — do not add a step here without wiring its consumer.
export default function OnboardingScreen() {
  const router = useRouter();
  const flow = useOnboardingFlow();
  const setOnboardingProfile = useAppStore((state) => state.setOnboardingProfile);
  const setOnboardingComplete = useAppStore((state) => state.setOnboardingComplete);
  const [finishing, setFinishing] = useState(false);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    track("onboarding_started");
  }, []);

  // Screen readers hear each new question as it arrives.
  const { step, answers } = flow;
  useEffect(() => {
    const title =
      step.kind === "single" || step.kind === "multi" || step.kind === "text"
        ? resolveCopy(step.title, answers)
        : step.kind === "interstitial"
          ? resolveCopy(step.title, answers)
          : null;
    if (title) AccessibilityInfo.announceForAccessibility(title);
  }, [step, answers]);

  // A light tap as each screen arrives, a firmer one when the space is ready.
  const advance = (move: () => void) => {
    if (Platform.OS !== "web") void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    move();
  };

  const skipSetup = () => {
    track("onboarding_skipped", { step_id: step.id });
    setOnboardingComplete(ONBOARDING_VERSION);
    router.replace("/(tabs)");
  };

  const finish = async (thenSignIn: boolean) => {
    if (finishing) return;
    setFinishing(true);
    try {
      const profile = buildProfile(answers);
      const reminderResult = profile.reminderEnabled
        ? await configureDailyReminder(true, profile.reminderTime).catch((error: unknown) => ({
            enabled: false,
            reason: error instanceof Error ? error.message : "Reminders could not be enabled.",
          }))
        : { enabled: false, reason: undefined };
      const reminderEnabled = profile.reminderEnabled && reminderResult.enabled;
      // Practices route content through tags; they are never mapped to a
      // tradition identity. tradition_pref stays user-set (Settings).
      setOnboardingProfile({ ...profile, reminderEnabled });
      setOnboardingComplete(ONBOARDING_VERSION);
      if (Platform.OS !== "web")
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      track("onboarding_completed", {
        intent: profile.intent,
        practice_count: profile.householdPractices.length,
        reminder_enabled: reminderEnabled,
        script: profile.scriptPreference,
        language: profile.contentLanguage,
        version: ONBOARDING_VERSION,
      });
      try {
        await updateProfile({
          display_name: profile.displayName === "Friend" ? null : profile.displayName,
          household_practices: profile.householdPractices,
          language_pref: profile.contentLanguage,
          notification_time: reminderEnabled ? `${profile.reminderTime}:00` : null,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        });
      } catch {
        // Guests complete onboarding locally; syncGuestPreferences pushes
        // these the moment they sign in.
      }
      if (profile.reminderEnabled && !reminderEnabled) {
        Alert.alert(
          "Reminder not enabled",
          reminderResult.reason ?? "You can allow reminders later from Settings.",
        );
      }
      router.replace("/(tabs)");
      if (thenSignIn) {
        track("onboarding_account_prompt");
        router.push("/sign-in");
      }
    } finally {
      setFinishing(false);
    }
  };

  const content = (() => {
    switch (step.kind) {
      case "welcome":
        return (
          <WelcomeStep
            onBegin={() => advance(flow.next)}
            onSkip={skipSetup}
            onSignIn={() => {
              // Returning users: their profile restores the answers on sign-in.
              setOnboardingComplete(ONBOARDING_VERSION);
              router.replace("/(tabs)");
              router.push("/sign-in");
            }}
          />
        );
      case "single":
        return (
          <SingleChoice
            key={step.id}
            step={step}
            answers={answers}
            onAnswer={(value) => flow.setAnswer(step.answerKey, value)}
            onNext={() => advance(flow.next)}
          />
        );
      case "multi":
        return (
          <MultiChoice
            key={step.id}
            step={step}
            answers={answers}
            onAnswer={(value) => flow.setAnswer(step.answerKey, value)}
            onNext={() => advance(flow.next)}
          />
        );
      case "text":
        return (
          <TextStep
            key={step.id}
            step={step}
            answers={answers}
            onAnswer={(value) => flow.setAnswer(step.answerKey, value)}
            onNext={() => advance(flow.next)}
            onSkip={() => {
              flow.setAnswer(step.answerKey, undefined);
              advance(flow.next);
            }}
          />
        );
      case "interstitial":
        return (
          <Interstitial
            key={step.id}
            step={step}
            answers={answers}
            onNext={() => advance(flow.next)}
          />
        );
      case "result":
        return (
          <Result
            answers={answers}
            finishing={finishing}
            onBegin={() => void finish(false)}
            onSaveToAccount={() => void finish(true)}
            onChange={flow.goTo}
          />
        );
    }
  })();

  const mood: BackdropMood =
    step.kind === "result"
      ? "bright"
      : step.kind === "interstitial" || step.kind === "welcome"
        ? "warm"
        : "quiet";
  const counted = flow.steps.filter((entry) => entry.kind !== "welcome");
  const position = Math.max(1, counted.findIndex((entry) => entry.id === step.id) + 1);

  return (
    <OnboardingShell
      progress={flow.progress}
      position={position}
      total={counted.length}
      showProgress={step.kind !== "welcome"}
      canGoBack={flow.canGoBack && !finishing}
      mood={mood}
      seed={flow.index}
      onBack={() => {
        flow.back();
      }}
    >
      <StepTransition stepKey={step.id} direction={flow.direction}>
        {content}
      </StepTransition>
    </OnboardingShell>
  );
}
