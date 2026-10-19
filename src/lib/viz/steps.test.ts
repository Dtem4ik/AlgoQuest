import { describe, expect, it } from "vitest";
import type { VizStep } from "@/lib/types";
import { cellLook, cellSize, formatCell, pointersByCell } from "./steps";

const step: VizStep = {
  array: [1, 2, 3, 4],
  pointers: { i: 2, k: 2, j: -1, r: 3 },
  highlight: { write: [2], skip: [2, 3], done: [0, 2] },
  note: "n",
};

describe("viz steps", () => {
  it("groups pointers per cell and hides -1", () => {
    expect([...pointersByCell(step)]).toEqual([
      [2, ["i", "k"]],
      [3, ["r"]],
    ]);
  });

  it("prefers write over skip and keeps done as an outline", () => {
    expect(cellLook(step, 2)).toEqual({ fill: "write", done: true });
    expect(cellLook(step, 3)).toEqual({ fill: "skip", done: false });
    expect(cellLook(step, 0)).toEqual({ fill: null, done: true });
    expect(cellLook(step, 1)).toEqual({ fill: null, done: false });
  });

  it("sizes cells to fit, between 28 and 48px", () => {
    expect(cellSize(5)).toBe(48);
    expect(cellSize(8)).toBe(39);
    expect(cellSize(30)).toBe(28);
  });

  it("shows spaces visibly", () => {
    expect(formatCell(" ")).toBe("␣");
    expect(formatCell(0)).toBe("0");
  });
});
