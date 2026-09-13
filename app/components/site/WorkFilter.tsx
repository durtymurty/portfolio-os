"use client";

import { useState, type ReactNode } from "react";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "hardware", label: "Hardware" },
  { value: "software", label: "Software" },
] as const;

type Filter = (typeof FILTERS)[number]["value"];

/**
 * Cards are server-rendered children tagged with data-kind; filtering is pure CSS
 * on the wrapper, so it costs no re-render of the cards themselves.
 */
export default function WorkFilter({ counts, children }: { counts: Record<Filter, number>; children: ReactNode }) {
  const [filter, setFilter] = useState<Filter>("all");

  return (
    <div data-filter={filter}>
      <div role="group" aria-label="Filter projects" className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            aria-pressed={filter === f.value}
            onClick={() => setFilter(f.value)}
            className="annot rounded-sm border border-rule px-3 py-1.5 transition-colors hover:border-ink hover:text-ink aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-paper"
          >
            {f.label} <span className="opacity-60">({counts[f.value]})</span>
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        Showing {counts[filter]} {filter === "all" ? "" : filter} projects
      </p>
      {children}
    </div>
  );
}
