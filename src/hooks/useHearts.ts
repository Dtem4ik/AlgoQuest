"use client";

import { msUntilNextHeart, regenHearts } from "@/lib/progress/hearts";
import { useProgressHydrated, useProgressStore } from "@/store/progress";
import { useNow } from "./useNow";

/**
 * Сердечки с учётом восстановления на текущий момент.
 * null — store ещё не прочитан из localStorage.
 */
export function useHearts(): { hearts: number; msToNext: number | null } | null {
  const hydrated = useProgressHydrated();
  const now = useNow();
  const hearts = useProgressStore((s) => s.hearts);
  const heartsUpdatedAt = useProgressStore((s) => s.heartsUpdatedAt);

  if (!hydrated || now === null) return null;
  const state = { hearts, heartsUpdatedAt };
  return { hearts: regenHearts(state, now).hearts, msToNext: msUntilNextHeart(state, now) };
}
