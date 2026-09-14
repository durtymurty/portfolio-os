"use client";

import { useCurrentMinute } from "../lib/hooks";

export default function Clock() {
  const minute = useCurrentMinute();
  const now = minute === null ? null : new Date(minute);

  return (
    // Fixed width so the taskbar doesn't shift when the time appears after hydration.
    <time
      dateTime={now?.toISOString()}
      className="absolute right-6 hidden w-24 text-right lg:block"
    >
      <span className="block text-sm leading-none font-semibold text-fg-strong">
        {now ? now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) : " "}
      </span>
      <span className="mt-1 block text-[11px] text-fg-muted">
        {now ? now.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" }) : " "}
      </span>
    </time>
  );
}
