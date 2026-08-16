import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { SavedItem, SavedItemType } from "@/lib/account";
import { chunkedStorage } from "@/lib/chunkedStorage";

type AppState = {
  savedIds: string[];
  savedItemTypes: Record<string, SavedItemType>;
  completedPracticeIds: string[];
  completedTodayIds: string[];
  completedDateKeys: string[];
  displayName: string;
  reminderEnabled: boolean;
  reminderTime: string;
  traditionPreference: string;
  focusTags: string[];
  householdPractices: string[];
  contentLanguage: string;
  hasCompletedOnboarding: boolean;
  hydrated: boolean;
  lastActiveDate: string;
  toggleSaved: (id: string, itemType?: SavedItemType) => void;
  completePractice: (id: string) => void;
  completeToday: (id: string) => void;
  setReminder: (enabled: boolean, time?: string) => void;
  setTraditionPreference: (tradition: string) => void;
  setFocusTags: (tags: string[]) => void;
  setHouseholdPractices: (practices: string[]) => void;
  setContentLanguage: (language: string) => void;
  setDisplayName: (name: string) => void;
  setSavedIds: (ids: string[]) => void;
  setSavedItems: (items: SavedItem[]) => void;
  setCompletedPracticeIds: (ids: string[]) => void;
  setCompletedDateKeys: (keys: string[]) => void;
  clearAccountScopedState: () => void;
  setOnboardingComplete: () => void;
  syncDailyState: () => void;
  setHydrated: (hydrated: boolean) => void;
};

const todayKey = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
};

const storage = createJSONStorage<AppState>(() => chunkedStorage);

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      savedIds: [],
      savedItemTypes: {},
      completedPracticeIds: [],
      completedTodayIds: [],
      completedDateKeys: [],
      displayName: "Friend",
      reminderEnabled: false,
      reminderTime: "08:00",
      traditionPreference: "All traditions",
      focusTags: [],
      householdPractices: [],
      contentLanguage: "en",
      hasCompletedOnboarding: false,
      hydrated: false,
      lastActiveDate: todayKey(),
      toggleSaved: (id, itemType) =>
        set((state) => {
          const isSaved = state.savedIds.includes(id);
          const nextTypes = { ...state.savedItemTypes };
          if (isSaved) delete nextTypes[id];
          else if (itemType) nextTypes[id] = itemType;
          return {
            savedIds: isSaved
              ? state.savedIds.filter((savedId) => savedId !== id)
              : [...state.savedIds, id],
            savedItemTypes: nextTypes,
          };
        }),
      completePractice: (id) =>
        set((state) => ({
          completedPracticeIds: state.completedPracticeIds.includes(id)
            ? state.completedPracticeIds
            : [...state.completedPracticeIds, id],
        })),
      completeToday: (id) =>
        set((state) => ({
          completedTodayIds: state.completedTodayIds.includes(id)
            ? state.completedTodayIds
            : [...state.completedTodayIds, id],
          completedDateKeys: state.completedDateKeys.includes(todayKey())
            ? state.completedDateKeys
            : [...state.completedDateKeys, todayKey()],
          lastActiveDate: todayKey(),
        })),
      setReminder: (enabled, time) =>
        set((state) => ({ reminderEnabled: enabled, reminderTime: time ?? state.reminderTime })),
      setTraditionPreference: (traditionPreference) => set({ traditionPreference }),
      setFocusTags: (focusTags) => set({ focusTags }),
      setHouseholdPractices: (householdPractices) => set({ householdPractices }),
      setContentLanguage: (contentLanguage) => set({ contentLanguage }),
      setDisplayName: (displayName) => set({ displayName }),
      setSavedIds: (savedIds) =>
        set((state) => ({ savedIds: [...new Set([...state.savedIds, ...savedIds])] })),
      setSavedItems: (items) =>
        set((state) => ({
          savedIds: [...new Set([...state.savedIds, ...items.map((item) => item.itemId)])],
          savedItemTypes: {
            ...state.savedItemTypes,
            ...Object.fromEntries(items.map((item) => [item.itemId, item.itemType])),
          },
        })),
      setCompletedPracticeIds: (ids) =>
        set((state) => ({
          completedPracticeIds: [...new Set([...state.completedPracticeIds, ...ids])],
        })),
      setCompletedDateKeys: (keys) =>
        set((state) => ({
          completedDateKeys: [...new Set([...state.completedDateKeys, ...keys])],
        })),
      clearAccountScopedState: () =>
        set({
          savedIds: [],
          savedItemTypes: {},
          completedPracticeIds: [],
          completedTodayIds: [],
          completedDateKeys: [],
          displayName: "Friend",
          traditionPreference: "All traditions",
          focusTags: [],
          householdPractices: [],
          reminderEnabled: false,
          reminderTime: "08:00",
        }),
      setOnboardingComplete: () => set({ hasCompletedOnboarding: true }),
      syncDailyState: () =>
        set((state) =>
          state.lastActiveDate === todayKey()
            ? state
            : { completedTodayIds: [], lastActiveDate: todayKey() },
        ),
      setHydrated: (hydrated) => set({ hydrated }),
    }),
    {
      name: "sandhya-app-state",
      storage,
      partialize: (state) => ({ ...state, hydrated: false }),
      onRehydrateStorage: () => (state) => state?.setHydrated(true),
    },
  ),
);
