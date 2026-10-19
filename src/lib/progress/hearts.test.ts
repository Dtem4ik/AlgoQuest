import { describe, expect, it } from "vitest";
import {
  HEART_REGEN_MS,
  loseHeart,
  MAX_HEARTS,
  msUntilNextHeart,
  regenHearts,
} from "./hearts";

const T0 = 1_000_000_000_000;

describe("regenHearts", () => {
  it("keeps a full stock untouched", () => {
    expect(regenHearts({ hearts: 5, heartsUpdatedAt: T0 }, T0 + 10 * HEART_REGEN_MS)).toEqual({
      hearts: 5,
      heartsUpdatedAt: T0,
    });
  });

  it("does nothing before the interval passes", () => {
    const state = { hearts: 2, heartsUpdatedAt: T0 };
    expect(regenHearts(state, T0 + HEART_REGEN_MS - 1)).toBe(state);
  });

  it("adds one heart per interval and keeps the remainder", () => {
    expect(regenHearts({ hearts: 1, heartsUpdatedAt: T0 }, T0 + 2 * HEART_REGEN_MS + 500)).toEqual({
      hearts: 3,
      heartsUpdatedAt: T0 + 2 * HEART_REGEN_MS,
    });
  });

  it("caps at MAX_HEARTS", () => {
    const now = T0 + 100 * HEART_REGEN_MS;
    expect(regenHearts({ hearts: 0, heartsUpdatedAt: T0 }, now)).toEqual({
      hearts: MAX_HEARTS,
      heartsUpdatedAt: now,
    });
  });
});

describe("loseHeart", () => {
  it("starts the regen timer when losing from a full stock", () => {
    expect(loseHeart({ hearts: 5, heartsUpdatedAt: 0 }, T0)).toEqual({
      hearts: 4,
      heartsUpdatedAt: T0,
    });
  });

  it("keeps the running timer when already below max", () => {
    expect(loseHeart({ hearts: 3, heartsUpdatedAt: T0 }, T0 + 1000)).toEqual({
      hearts: 2,
      heartsUpdatedAt: T0,
    });
  });

  it("applies regen before subtracting", () => {
    expect(loseHeart({ hearts: 3, heartsUpdatedAt: T0 }, T0 + HEART_REGEN_MS)).toEqual({
      hearts: 3,
      heartsUpdatedAt: T0 + HEART_REGEN_MS,
    });
  });

  it("never goes below zero", () => {
    expect(loseHeart({ hearts: 0, heartsUpdatedAt: T0 }, T0 + 1).hearts).toBe(0);
  });
});

describe("msUntilNextHeart", () => {
  it("returns null when full", () => {
    expect(msUntilNextHeart({ hearts: 5, heartsUpdatedAt: T0 }, T0)).toBeNull();
  });

  it("counts down to the next heart", () => {
    expect(msUntilNextHeart({ hearts: 4, heartsUpdatedAt: T0 }, T0 + 1000)).toBe(HEART_REGEN_MS - 1000);
  });
});
