"use client";

import { useEffect, useState } from "react";

const AUTO_STEP_MS = 900;

/** Проигрывание заранее прописанных шагов: назад, шаг, авто. */
export function useStepPlayer(count: number) {
  const last = count - 1;
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  // Дошли до конца — авто само выключается (без лишнего setState в эффекте).
  const autoPlaying = playing && index < last;

  useEffect(() => {
    if (!autoPlaying) return;
    const id = setInterval(() => setIndex((i) => Math.min(i + 1, last)), AUTO_STEP_MS);
    return () => clearInterval(id);
  }, [autoPlaying, last]);

  return {
    index,
    last,
    playing: autoPlaying,
    next: () => {
      setPlaying(false);
      setIndex((i) => Math.min(i + 1, last));
    },
    prev: () => {
      setPlaying(false);
      setIndex((i) => Math.max(i - 1, 0));
    },
    toggleAuto: () => {
      if (autoPlaying) {
        setPlaying(false);
        return;
      }
      // С последнего шага «Авто» проигрывает заново.
      if (index >= last) setIndex(0);
      setPlaying(true);
    },
  };
}
