"use client";

import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

const listeners = new Set<() => void>();

function readTheme(): Theme {
  const explicit = document.documentElement.dataset.theme;
  if (explicit === "light" || explicit === "dark") return explicit;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  const mql = window.matchMedia("(prefers-color-scheme: dark)");
  mql.addEventListener("change", onChange);
  return () => {
    listeners.delete(onChange);
    mql.removeEventListener("change", onChange);
  };
}

export default function ThemeToggle() {
  // null on the server: render a neutral button until we know the real theme.
  const theme = useSyncExternalStore<Theme | null>(subscribe, readTheme, () => null);
  const next: Theme = theme === "dark" ? "light" : "dark";

  const toggle = () => {
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* private mode — theme still applies for this visit */
    }
    listeners.forEach((l) => l());
  };

  return (
    <button
      type="button"
      onClick={toggle}
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
