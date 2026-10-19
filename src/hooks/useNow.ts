"use client";

import { useSyncExternalStore } from "react";

// Общие часы на всё приложение: тикают раз в секунду, пока есть подписчики.
let now = 0;
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | undefined;

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  if (!timer) {
    timer = setInterval(() => {
      now = Date.now();
      listeners.forEach((l) => l());
    }, 1000);
  }
  return () => {
    listeners.delete(onChange);
    if (listeners.size === 0) {
      clearInterval(timer);
      timer = undefined;
    }
  };
}

// Снимок должен быть стабильным между тиками, иначе React уйдёт в цикл.
function getSnapshot() {
  if (now === 0) now = Date.now();
  return now;
}

/** Текущее время (мс), обновляется раз в секунду; null на сервере и при гидрации. */
export function useNow(): number | null {
  return useSyncExternalStore(subscribe, getSnapshot, () => null);
}
