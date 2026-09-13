export type Op = "+" | "-" | "×" | "÷";

export interface CalcState {
  display: string;
  /** Left operand waiting for the next number. */
  acc: number | null;
  op: Op | null;
  /** Next digit replaces the display instead of appending. */
  overwrite: boolean;
}

export type CalcAction =
  | { type: "digit"; digit: string }
  | { type: "dot" }
  | { type: "op"; op: Op }
  | { type: "equals" }
  | { type: "clear" }
  | { type: "backspace" }
  | { type: "negate" }
  | { type: "percent" };

export const initialCalc: CalcState = { display: "0", acc: null, op: null, overwrite: false };

const MAX_DIGITS = 15;
export const ERROR = "Error";

export function format(n: number): string {
  if (!Number.isFinite(n)) return ERROR;
  const rounded = parseFloat(n.toPrecision(12));
  return Object.is(rounded, -0) ? "0" : String(rounded);
}

function apply(a: number, op: Op, b: number): number {
  switch (op) {
    case "+": return a + b;
    case "-": return a - b;
    case "×": return a * b;
    case "÷": return a / b; // ÷0 → Infinity → "Error"
  }
}

export function calcReducer(state: CalcState, action: CalcAction): CalcState {
  // Any input after an error starts fresh.
  if (state.display === ERROR && action.type !== "clear") {
    state = initialCalc;
    if (action.type !== "digit" && action.type !== "dot") return state;
  }
  const value = parseFloat(state.display);

  switch (action.type) {
    case "digit":
      if (state.overwrite || state.display === "0") return { ...state, display: action.digit, overwrite: false };
      if (state.display.replace(/[-.]/g, "").length >= MAX_DIGITS) return state;
      return { ...state, display: state.display + action.digit };

    case "dot":
      if (state.overwrite) return { ...state, display: "0.", overwrite: false };
      return state.display.includes(".") ? state : { ...state, display: state.display + "." };

    case "op":
      // Chain: 2 + 3 + → shows 5, then waits for the next operand.
      if (state.acc !== null && state.op && !state.overwrite) {
        const result = format(apply(state.acc, state.op, value));
        if (result === ERROR) return { ...initialCalc, display: ERROR };
        return { display: result, acc: parseFloat(result), op: action.op, overwrite: true };
      }
      return { ...state, acc: value, op: action.op, overwrite: true };

    case "equals": {
      if (state.acc === null || !state.op) return { ...state, overwrite: true };
      return { display: format(apply(state.acc, state.op, value)), acc: null, op: null, overwrite: true };
    }

    case "clear":
      return initialCalc;

    case "backspace":
      if (state.overwrite) return state;
      return { ...state, display: state.display.length > 1 && state.display !== "-0" ? state.display.slice(0, -1).replace(/^-$/, "0") : "0" };

    case "negate":
      if (state.display === "0") return state;
      return {
        ...state,
        display: state.display.startsWith("-") ? state.display.slice(1) : `-${state.display}`,
      };

    case "percent":
      return { ...state, display: format(value / 100), overwrite: true };
  }
}
