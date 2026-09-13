"use client";

import { useSyncExternalStore } from "react";

/** SSR-safe media query. Returns `false` during server render and hydration. */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** Subscribes to minute boundaries so clocks re-render once a minute, not every second. */
function subscribeMinute(onChange: () => void) {
  let interval: ReturnType<typeof setInterval> | undefined;
  const timeout = setTimeout(() => {
    onChange();
    interval = setInterval(onChange, 60_000);
  }, 60_000 - (Date.now() % 60_000));
  return () => {
    clearTimeout(timeout);
    clearInterval(interval);
  };
}

/**
 * Current minute as a ms timestamp, or `null` on the server / during hydration.
 * Rendering `null` on the server avoids baking build-time into static HTML.
 */
export function useCurrentMinute(): number | null {
  return useSyncExternalStore(
    subscribeMinute,
    () => Math.floor(Date.now() / 60_000) * 60_000,
    () => null,
  );
}

export const COMPACT_QUERY = "(max-width: 767px)";
