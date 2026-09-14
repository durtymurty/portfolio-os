import { describe, expect, it } from "vitest";
import { calcReducer, initialCalc, type CalcAction, type CalcState } from "./calculator";

const press = (...keys: string[]): CalcState =>
  keys.reduce((state, k) => {
    const action: CalcAction =
      /^\d$/.test(k) ? { type: "digit", digit: k }
      : k === "." ? { type: "dot" }
      : k === "=" ? { type: "equals" }
      : k === "AC" ? { type: "clear" }
      : k === "±" ? { type: "negate" }
      : k === "%" ? { type: "percent" }
      : k === "⌫" ? { type: "backspace" }
      : { type: "op", op: k as "+" | "-" | "×" | "÷" };
    return calcReducer(state, action);
  }, initialCalc);

describe("calculator", () => {
  it("does basic arithmetic", () => {
    expect(press("1", "2", "+", "3", "=").display).toBe("15");
    expect(press("9", "÷", "4", "=").display).toBe("2.25");
  });

  it("chains operations left to right", () => {
    expect(press("2", "+", "3", "+", "4", "=").display).toBe("9");
    expect(press("2", "+", "3", "×").display).toBe("5");
  });

  it("lets you change the pending operator", () => {
    expect(press("6", "+", "-", "2", "=").display).toBe("4");
  });

  it("ignores equals with no pending operation", () => {
    expect(press("7", "=").display).toBe("7");
    expect(press("=").display).toBe("0");
  });

  it("shows Error for division by zero and recovers on next input", () => {
    const errored = press("5", "÷", "0", "=");
    expect(errored.display).toBe("Error");
    expect(calcReducer(errored, { type: "digit", digit: "3" }).display).toBe("3");
  });

  it("starts a fresh decimal after a result", () => {
    expect(press("1", "+", "1", "=", ".", "5").display).toBe("0.5");
  });

  it("hides floating point noise", () => {
    expect(press("0", ".", "1", "+", "0", ".", "2", "=").display).toBe("0.3");
  });

  it("negates, percents, and backspaces", () => {
    expect(press("5", "±").display).toBe("-5");
    expect(press("5", "0", "%").display).toBe("0.5");
    expect(press("1", "2", "⌫").display).toBe("1");
    expect(press("5", "±", "⌫").display).toBe("0");
  });
});
