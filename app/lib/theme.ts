"use client";

export type Theme = "light" | "dark";

const listeners = new Set<() => void>();

export function readTheme(): Theme {
  const explicit = document.documentElement.dataset.theme;
  if (explicit === "light" || explicit === "dark") return explicit;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function subscribeTheme(onChange: () => void) {
  listeners.add(onChange);
  const mql = window.matchMedia("(prefers-color-scheme: dark)");
  mql.addEventListener("change", onChange);
  return () => {
    listeners.delete(onChange);
    mql.removeEventListener("change", onChange);
  };
}

export function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem("theme", theme);
  } catch {
    /* private mode — theme still applies for this visit */
  }
  listeners.forEach((l) => l());
}

export const toggleTheme = () => setTheme(readTheme() === "dark" ? "light" : "dark");
