import type { StartingProfile } from "@/lib/startingPoint";
import { useAppStore } from "@/store/useAppStore";

// The slice of the store that chooses the home starting point, today's
// practice and the learning tiles (see lib/startingPoint.ts). One selector
// so the home tab and the starting-point card cannot drift apart.
export function useStartingProfile(): StartingProfile {
  const intent = useAppStore((state) => state.onboardingIntent);
  const practiceMinutes = useAppStore((state) => state.practiceMinutes);
  const startingText = useAppStore((state) => state.startingText);
  const curiosity = useAppStore((state) => state.curiosity);
  const householdPractices = useAppStore((state) => state.householdPractices);
  const reminderEnabled = useAppStore((state) => state.reminderEnabled);
  const reminderTime = useAppStore((state) => state.reminderTime);
  return {
    intent,
    practiceMinutes,
    startingText,
    curiosity,
    householdPractices,
    reminderEnabled,
    reminderTime,
  };
}
