import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { AccessibilityInfo, Alert } from "react-native";

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
            onBegin={flow.next}
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
            onNext={flow.next}
          />
        );
      case "multi":
        return (
          <MultiChoice
            key={step.id}
            step={step}
            answers={answers}
            onAnswer={(value) => flow.setAnswer(step.answerKey, value)}
            onNext={flow.next}
          />
        );
      case "text":
        return (
          <TextStep
            key={step.id}
            step={step}
            answers={answers}
            onAnswer={(value) => flow.setAnswer(step.answerKey, value)}
            onNext={flow.next}
            onSkip={() => {
              flow.setAnswer(step.answerKey, undefined);
              flow.next();
            }}
          />
        );
      case "interstitial":
        return <Interstitial key={step.id} step={step} answers={answers} onNext={flow.next} />;
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

  return (
    <OnboardingShell
      progress={flow.progress}
      showProgress={step.kind !== "welcome"}
      canGoBack={flow.canGoBack && !finishing}
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
