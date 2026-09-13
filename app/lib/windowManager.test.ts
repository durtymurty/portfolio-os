import { describe, expect, it } from "vitest";
import { activeWindowId, initialWMState, wmReducer, type WMAction, type WMState } from "./windowManager";

const rect = { x: 0, y: 0, w: 100, h: 100 };
const run = (...actions: WMAction[]): WMState => actions.reduce(wmReducer, initialWMState);
const open = (id: string): WMAction => ({ type: "open", id, initial: rect });
const dock = (id: string): WMAction => ({ type: "dock", id, initial: rect });

describe("window manager", () => {
  it("opens windows on top", () => {
    const s = run(open("a"), open("b"));
    expect(s.order).toEqual(["a", "b"]);
    expect(activeWindowId(s)).toBe("b");
  });

  it("focus brings a window to the front without growing z-order", () => {
    const s = run(open("a"), open("b"), { type: "focus", id: "a" }, { type: "focus", id: "b" }, { type: "focus", id: "a" });
    expect(s.order).toEqual(["b", "a"]);
  });

  it("returns the same state when focusing the top window (no re-render)", () => {
    const s = run(open("a"));
    expect(wmReducer(s, { type: "focus", id: "a" })).toBe(s);
  });

  it("dock click cycles open → minimize → restore", () => {
    let s = run(dock("a"));
    expect(activeWindowId(s)).toBe("a");
    s = wmReducer(s, dock("a"));
    expect(s.windows[0].minimized).toBe(true);
    expect(activeWindowId(s)).toBeNull();
    s = wmReducer(s, dock("a"));
    expect(s.windows[0].minimized).toBe(false);
  });

  it("dock click on a background window focuses rather than minimizes", () => {
    const s = run(open("a"), open("b"), dock("a"));
    expect(activeWindowId(s)).toBe("a");
    expect(s.windows.every((w) => !w.minimized)).toBe(true);
  });

  it("closing removes the window from order", () => {
    const s = run(open("a"), open("b"), { type: "close", id: "b" });
    expect(s.order).toEqual(["a"]);
    expect(activeWindowId(s)).toBe("a");
  });
});
