"use client";

import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { loseHeart, refillHearts, regenHearts } from "@/lib/progress/hearts";
import {
  applyLessonResult,
  INITIAL_PROGRESS,
  type LessonResult,
  type Progress,
} from "@/lib/progress/progress";

interface ProgressActions {
  /** Подтянуть восстановившиеся сердечки. */
  refreshHearts: (now?: number) => void;
  loseHeart: (now?: number) => void;
  /** Полный запас сердечек (для разработки). */
  refillHearts: (now?: number) => void;
  /** Записывает итог урока и возвращает начисленный XP. */
  completeLesson: (result: LessonResult, now?: Date) => number;
  reset: () => void;
}

export type ProgressStore = Progress & ProgressActions;

const pickHearts = ({ hearts, heartsUpdatedAt }: Progress) => ({ hearts, heartsUpdatedAt });

const pickProgress = ({
  xp,
  hearts,
  heartsUpdatedAt,
  streak,
  activity,
  lessons,
}: Progress): Progress => ({ xp, hearts, heartsUpdatedAt, streak, activity, lessons });

export const useProgressStore = create<ProgressStore>()(
  persist<ProgressStore, [], [], Progress>(
    (set, get) => ({
      ...INITIAL_PROGRESS,

      refreshHearts: (now = Date.now()) => set(regenHearts(pickHearts(get()), now)),

      loseHeart: (now = Date.now()) => set(loseHeart(pickHearts(get()), now)),

      refillHearts: (now = Date.now()) => set(refillHearts(now)),

      completeLesson: (result, now = new Date()) => {
        const { progress, xpEarned } = applyLessonResult(pickProgress(get()), result, now);
        set(progress);
        return xpEarned;
      },

      reset: () => set(INITIAL_PROGRESS),
    }),
    {
      name: "algoquest-progress",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: pickProgress,
    },
  ),
);

const subscribeHydration = (onChange: () => void) =>
  useProgressStore.persist.onFinishHydration(onChange);

/**
 * false на сервере и при гидрации, true после чтения localStorage.
 * Пока false, показываем плейсхолдеры, чтобы не было hydration mismatch.
 */
export function useProgressHydrated(): boolean {
  return useSyncExternalStore(
    subscribeHydration,
    () => useProgressStore.persist.hasHydrated(),
    () => false,
  );
}
