export const MAX_HEARTS = 5;
export const HEART_REGEN_MS = 30 * 60 * 1000;

export interface HeartsState {
  hearts: number;
  /** Момент, от которого отсчитывается восстановление следующего сердечка. */
  heartsUpdatedAt: number;
}

/** Начисляет сердечки, восстановившиеся к моменту `now`. Остаток времени сохраняется. */
export function regenHearts(state: HeartsState, now: number): HeartsState {
  if (state.hearts >= MAX_HEARTS) {
    return { hearts: MAX_HEARTS, heartsUpdatedAt: state.heartsUpdatedAt };
  }
  const gained = Math.floor((now - state.heartsUpdatedAt) / HEART_REGEN_MS);
  if (gained <= 0) return state;

  const hearts = Math.min(MAX_HEARTS, state.hearts + gained);
  return {
    hearts,
    heartsUpdatedAt:
      hearts === MAX_HEARTS ? now : state.heartsUpdatedAt + gained * HEART_REGEN_MS,
  };
}

export function loseHeart(state: HeartsState, now: number): HeartsState {
  const current = regenHearts(state, now);
  if (current.hearts === 0) return current;
  return {
    hearts: current.hearts - 1,
    // Таймер восстановления стартует, когда теряем первое сердечко из полного запаса.
    heartsUpdatedAt: current.hearts === MAX_HEARTS ? now : current.heartsUpdatedAt,
  };
}

/** Сколько миллисекунд до следующего сердечка; null, если запас полный. */
export function msUntilNextHeart(state: HeartsState, now: number): number | null {
  const current = regenHearts(state, now);
  if (current.hearts >= MAX_HEARTS) return null;
  return current.heartsUpdatedAt + HEART_REGEN_MS - now;
}
