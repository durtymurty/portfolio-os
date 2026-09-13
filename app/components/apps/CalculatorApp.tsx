"use client";

import { useEffect, useReducer, useRef } from "react";
import { calcReducer, initialCalc, type CalcAction, type Op } from "../../lib/calculator";

type Key = { label: string; aria?: string; action: CalcAction; tone: "fn" | "op" | "num"; wide?: boolean };

const num = (d: string): Key => ({ label: d, action: { type: "digit", digit: d }, tone: "num" });
const op = (o: Op, aria: string): Key => ({ label: o, aria, action: { type: "op", op: o }, tone: "op" });

const KEYS: Key[] = [
  { label: "AC", aria: "All clear", action: { type: "clear" }, tone: "fn" },
  { label: "+/−", aria: "Toggle sign", action: { type: "negate" }, tone: "fn" },
  { label: "%", aria: "Percent", action: { type: "percent" }, tone: "fn" },
  op("÷", "Divide"),
  num("7"), num("8"), num("9"), op("×", "Multiply"),
  num("4"), num("5"), num("6"), op("-", "Minus"),
  num("1"), num("2"), num("3"), op("+", "Plus"),
  { ...num("0"), wide: true },
  { label: ".", aria: "Decimal point", action: { type: "dot" }, tone: "num" },
  { label: "=", aria: "Equals", action: { type: "equals" }, tone: "op" },
];

const KEYBOARD: Record<string, CalcAction> = {
  "+": { type: "op", op: "+" },
  "-": { type: "op", op: "-" },
  "*": { type: "op", op: "×" },
  "x": { type: "op", op: "×" },
  "/": { type: "op", op: "÷" },
  "Enter": { type: "equals" },
  "=": { type: "equals" },
  ".": { type: "dot" },
  ",": { type: "dot" },
  "%": { type: "percent" },
  "Backspace": { type: "backspace" },
  "Delete": { type: "clear" },
  "c": { type: "clear" },
};

const TONES = {
  fn: "bg-[#a5a5a5] text-black",
  op: "bg-[#ff9f0a] text-white",
  num: "bg-[#333] text-white",
};

export default function CalculatorApp() {
  const [state, dispatch] = useReducer(calcReducer, initialCalc);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => rootRef.current?.focus({ preventScroll: true }), []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const action = /^\d$/.test(e.key) ? ({ type: "digit", digit: e.key } as const) : KEYBOARD[e.key];
    if (!action) return;
    // Let Enter/Space activate a focused button normally instead of double-firing.
    if ((e.key === "Enter") && (e.target as HTMLElement).tagName === "BUTTON") return;
    e.preventDefault();
    dispatch(action);
  };

  const fontSize = state.display.length > 9 ? "text-3xl" : "text-5xl";

  return (
    <div
      ref={rootRef}
      tabIndex={-1}
      onKeyDown={onKeyDown}
      aria-label="Calculator. Supports keyboard input."
      role="group"
      className="mx-auto flex max-w-[290px] flex-col items-stretch gap-3 p-2 outline-none"
    >
      <p aria-hidden="true" className="h-5 text-right text-sm text-fg-muted">
        {state.acc !== null && state.op ? `${state.acc} ${state.op}` : ""}
      </p>
      <output aria-live="polite" aria-atomic="true" className={`block px-1 text-right leading-tight font-extralight break-all text-white ${fontSize}`}>
        {state.display}
      </output>
      <div className="grid grid-cols-4 gap-2.5">
        {KEYS.map((key) => {
          const pending = key.action.type === "op" && state.op === key.action.op && state.overwrite;
          return (
            <button
              key={key.label}
              type="button"
              aria-label={key.aria}
              aria-pressed={key.action.type === "op" ? pending : undefined}
              onClick={() => dispatch(key.action)}
              className={`h-15 rounded-full text-xl font-medium transition-[filter] hover:brightness-110 active:brightness-75 ${
                key.wide ? "col-span-2 pl-6 text-left" : ""
              } ${pending ? "bg-white text-[#ff9f0a]" : TONES[key.tone]}`}
            >
              {key.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
