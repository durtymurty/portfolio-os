"use client";

import { useSyncExternalStore } from "react";
import { readTheme, subscribeTheme, toggleTheme, type Theme } from "../../lib/theme";

export default function ThemeToggle() {
  // null on the server: render a neutral label until we know the real theme.
  const theme = useSyncExternalStore<Theme | null>(subscribeTheme, readTheme, () => null);
  const next = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme ? `Switch to ${next} theme` : "Toggle theme"}
      className="grid size-9 place-items-center rounded-sm border border-rule text-ink-muted transition-colors hover:border-accent hover:text-accent"
    >
      <svg viewBox="0 0 20 20" className="size-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5">
        {/* Half-filled circle: reads as "contrast" in either theme. */}
        <circle cx="10" cy="10" r="7" />
        <path d="M10 3a7 7 0 0 1 0 14z" fill="currentColor" />
      </svg>
    </button>
  );
}
