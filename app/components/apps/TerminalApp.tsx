"use client";

import { useState, useRef, useEffect } from "react";
import { TERMINAL_RESPONSES } from "../../data";

interface Line {
  type: "input" | "output";
  text: string;
}

export default function TerminalApp() {
  const [lines, setLines] = useState<Line[]>([
    { type: "output", text: "Welcome to Murtaza's Terminal v1.0" },
    { type: "output", text: 'Type "help" to see available commands.' },
    { type: "output", text: "" },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    const newLines: Line[] = [...lines, { type: "input", text: `murtaza@portfolio:~$ ${cmd}` }];

    if (trimmed === "clear") {
      setLines([{ type: "output", text: 'Type "help" to see available commands.' }]);
      setInput("");
      return;
    }

    const response = TERMINAL_RESPONSES[trimmed] ?? `Command not found: ${trimmed}. Type "help" for available commands.`;
    response.split("\n").forEach(line => newLines.push({ type: "output", text: line }));
    newLines.push({ type: "output", text: "" });
    setLines(newLines);
    setInput("");
  };

  return (
    <div style={{ background: "#0d1117", borderRadius: "8px", padding: "16px", height: "100%", display: "flex", flexDirection: "column", fontFamily: "JetBrains Mono, Consolas, monospace", fontSize: "13px" }}>
      <div style={{ flex: 1, overflowY: "auto", marginBottom: "12px" }}>
        {lines.map((line, i) => (
          <div key={i} style={{ color: line.type === "input" ? "#58a6ff" : "#c9d1d9", lineHeight: "1.7", whiteSpace: "pre-wrap" }}>
            {line.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "12px" }}>
        <span style={{ color: "#3fb950" }}>murtaza@portfolio:~$</span>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleCommand(input)}
          style={{ flex: 1, background: "none", border: "none", outline: "none", color: "#c9d1d9", fontFamily: "inherit", fontSize: "inherit", caretColor: "#58a6ff" }}
          autoFocus
          spellCheck={false}
          placeholder="type a command..."
        />
      </div>
    </div>
  );
}