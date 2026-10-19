"use client";

import { create } from "zustand";

interface LessonVisitsStore {
  /** Номер захода в урок; новый номер — новый прогон с чистым состоянием. */
  visits: Record<string, number>;
  startVisit: (lessonId: string) => void;
}

/**
 * Next не размонтирует ушедший с экрана урок (Activity), а прячет его вместе с состоянием.
 * Сбрасывать прогон при уходе нельзя: пока грузится карта, мелькает урок с начала.
 * Поэтому новый прогон стартует при входе — кнопка «Начать» увеличивает номер захода.
 */
export const useLessonVisits = create<LessonVisitsStore>()((set) => ({
  visits: {},
  startVisit: (lessonId) =>
    set((s) => ({ visits: { ...s.visits, [lessonId]: (s.visits[lessonId] ?? 0) + 1 } })),
}));
