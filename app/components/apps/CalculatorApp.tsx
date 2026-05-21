"use client";

import { useState } from "react";

export default function CalculatorApp() {
  const [display, setDisplay] = useState("0");
  const [prev, setPrev] = useState("");
  const [op, setOp] = useState("");
  const [reset, setReset] = useState(false);

  const handleNum = (n: string) => {
    if (reset) { setDisplay(n); setReset(false); return; }
    setDisplay(display === "0" ? n : display + n);
  };

  const handleOp = (o: string) => {
    setPrev(display);
    setOp(o);
    setReset(true);
  };

  const handleEqual = () => {
    const a = parseFloat(prev);
    const b = parseFloat(display);
    let result = 0;
    if (op === "+") result = a + b;
    if (op === "-") result = a - b;
    if (op === "×") result = a * b;
    if (op === "÷") result = b !== 0 ? a / b : 0;
    setDisplay(String(parseFloat(result.toFixed(10))));
    setOp("");
    setPrev("");
    setReset(true);
  };

  const handleClear = () => { setDisplay("0"); setPrev(""); setOp(""); setReset(false); };
  const handleDot = () => { if (!display.includes(".")) setDisplay(display + "."); };
  const handleToggle = () => setDisplay(String(parseFloat(display) * -1));
  const handlePercent = () => setDisplay(String(parseFloat(display) / 100));

  const btn = (label: string, onClick: () => void, color = "#333", textColor = "white", wide = false) => (
    <button
      onClick={onClick}
      style={{ background: color, color: textColor, border: "none", borderRadius: "50%", width: wide ? "130px" : "60px", height: "60px", fontSize: "20px", fontWeight: "500", cursor: "pointer", transition: "opacity 0.1s" }}
      onMouseDown={e => (e.currentTarget.style.opacity = "0.7")}
      onMouseUp={e => (e.currentTarget.style.opacity = "1")}
    >
      {label}
    </button>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", padding: "8px" }}>
      <div style={{ width: "100%", textAlign: "right", padding: "8px 4px", fontSize: "48px", fontWeight: "200", color: "white", wordBreak: "break-all", lineHeight: 1.1 }}>
        {display}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 60px)", gap: "10px" }}>
        {btn("AC", handleClear, "#a5a5a5", "#000")}
        {btn("+/-", handleToggle, "#a5a5a5", "#000")}
        {btn("%", handlePercent, "#a5a5a5", "#000")}
        {btn("÷", () => handleOp("÷"), "#ff9f0a")}
        {btn("7", () => handleNum("7"), "#333")}
        {btn("8", () => handleNum("8"), "#333")}
        {btn("9", () => handleNum("9"), "#333")}
        {btn("×", () => handleOp("×"), "#ff9f0a")}
        {btn("4", () => handleNum("4"), "#333")}
        {btn("5", () => handleNum("5"), "#333")}
        {btn("6", () => handleNum("6"), "#333")}
        {btn("-", () => handleOp("-"), "#ff9f0a")}
        {btn("1", () => handleNum("1"), "#333")}
        {btn("2", () => handleNum("2"), "#333")}
        {btn("3", () => handleNum("3"), "#333")}
        {btn("+", () => handleOp("+"), "#ff9f0a")}
        <button
          onClick={() => handleNum("0")}
          style={{ background: "#333", color: "white", border: "none", borderRadius: "30px", width: "130px", height: "60px", fontSize: "20px", fontWeight: "500", cursor: "pointer", gridColumn: "span 2", textAlign: "left", paddingLeft: "22px" }}
        >0</button>
        {btn(".", handleDot, "#333")}
        {btn("=", handleEqual, "#ff9f0a")}
      </div>
    </div>
  );
}