"use client";

import { useEffect, useId, useRef, useState } from "react";
import { COMMAND_NAMES, runCommand } from "../../lib/terminalCommands";

const PROMPT = "murtaza@portfolio:~$";

interface Line {
  id: number;
  kind: "input" | "output";
  text: string;
}

const WELCOME = ["Welcome to Murtaza's Terminal v2.0", 'Type "help" to see available commands.', ""];

let nextId = 0;
const toLines = (kind: Line["kind"], text: string): Line[] =>
  text.split("\n").map((t) => ({ id: nextId++, kind, text: t }));

export default function TerminalApp() {
  const [lines, setLines] = useState<Line[]>(() => toLines("output", WELCOME.join("\n")));
  const [input, setInput] = useState("");
  const history = useRef<string[]>([]);
  const historyIndex = useRef(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  // Scroll only the terminal's own log — scrollIntoView would also scroll ancestors.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  const submit = () => {
    const cmd = input.trim();
    setInput("");
    historyIndex.current = -1;
    if (!cmd) {
      setLines((prev) => [...prev, ...toLines("input", `${PROMPT} `)]);
      return;
    }
    history.current = [cmd, ...history.current.filter((h) => h !== cmd)].slice(0, 50);
    const output = runCommand(cmd);
    if (output === null) {
      setLines([]);
      return;
    }
    setLines((prev) => [...prev, ...toLines("input", `${PROMPT} ${cmd}`), ...toLines("output", `${output}\n`)]);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      submit();
    } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      const h = history.current;
      const next = e.key === "ArrowUp" ? Math.min(historyIndex.current + 1, h.length - 1) : historyIndex.current - 1;
      historyIndex.current = Math.max(next, -1);
      setInput(historyIndex.current >= 0 ? h[historyIndex.current] : "");
    } else if (e.key === "Tab" && input.trim()) {
      const matches = COMMAND_NAMES.filter((c) => c.startsWith(input.trim().toLowerCase()));
      if (matches.length === 1) {
        e.preventDefault();
        setInput(`${matches[0]} `);
      }
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  return (
    <div
      className="flex h-full flex-col rounded-lg bg-[#0d1117] p-4 font-mono text-[13px]"
      onClick={() => {
        // Clicking anywhere focuses the prompt, unless the user is selecting output text.
        if (!window.getSelection()?.toString()) inputRef.current?.focus();
      }}
    >
      <div ref={scrollRef} role="log" aria-live="polite" className="mb-3 min-h-0 flex-1 overflow-y-auto">
        {lines.map((line) => (
          <div key={line.id} className={`leading-relaxed whitespace-pre-wrap ${line.kind === "input" ? "text-accent" : "text-fg"}`}>
            {line.text || " "}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 border-t border-line pt-3">
        <label htmlFor={inputId} className="shrink-0 text-ok">
          {PROMPT}<span className="sr-only"> Terminal command</span>
        </label>
        <input
          id={inputId}
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          className="min-w-0 flex-1 bg-transparent text-fg caret-accent outline-none placeholder:text-fg-muted"
          autoFocus
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          placeholder="type a command…"
        />
      </div>
    </div>
  );
}
