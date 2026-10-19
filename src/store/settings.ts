"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { SETTINGS_STORAGE_KEY, type ThemePreference } from "@/lib/theme";

interface SettingsStore {
  theme: ThemePreference;
  setTheme: (theme: ThemePreference) => void;
}

/** Настройки устройства. Отдельно от прогресса: «Сбросить прогресс» их не трогает. */
export const useSettings = create<SettingsStore>()(
  persist(
    (set) => ({
      theme: "system",
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: SETTINGS_STORAGE_KEY,
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: ({ theme }) => ({ theme }),
    },
  ),
);
