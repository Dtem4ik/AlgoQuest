"use client";

import { useSyncExternalStore } from "react";
import { toDayKey, type DayKey } from "@/lib/progress/dates";

// Раз в минуту перепроверяем дату, чтобы стрик обновился после полуночи.
const subscribe = (onChange: () => void) => {
  const id = setInterval(onChange, 60_000);
  return () => clearInterval(id);
};

/** Текущий день пользователя; null на сервере и во время гидрации. */
export function useToday(): DayKey | null {
  return useSyncExternalStore(
    subscribe,
    () => toDayKey(new Date()),
    () => null,
  );
}
