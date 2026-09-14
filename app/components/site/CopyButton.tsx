"use client";

import { useEffect, useState } from "react";

export default function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  return (
    <>
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
          } catch {
            /* Clipboard blocked — the value is still visible and selectable. */
          }
        }}
        className="annot inline-flex h-9 items-center rounded-sm border border-rule px-3 transition-colors hover:border-accent hover:text-accent"
      >
        {copied ? "Copied ✓" : label}
      </button>
      <span role="status" className="sr-only">{copied ? `${value} copied to clipboard` : ""}</span>
    </>
  );
}
