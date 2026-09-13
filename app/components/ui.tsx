import type { CSSProperties, ReactNode } from "react";

type WithChildren = { children: ReactNode; className?: string };

/** Emoji used as decoration — hidden from screen readers. */
export function Icon({ children, className = "" }: WithChildren) {
  return <span aria-hidden="true" className={className}>{children}</span>;
}

export function Card({ children, className = "", style }: WithChildren & { style?: CSSProperties }) {
  return (
    <div className={`rounded-lg border border-line bg-raised p-3.5 ${className}`} style={style}>
      {children}
    </div>
  );
}

export function AppTitle({ children, className = "" }: WithChildren) {
  return <h2 className={`text-xl font-bold text-fg-strong ${className}`}>{children}</h2>;
}

export function SectionHeading({ children, color }: { children: ReactNode; color?: string }) {
  return (
    <h3
      className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent"
      style={color ? { color } : undefined}
    >
      {children}
    </h3>
  );
}

/** Pill tag tinted by a hex color. */
export function Tag({ children, color, round = false }: { children: ReactNode; color: string; round?: boolean }) {
  return (
    <span
      className={`inline-block border px-2 py-0.5 text-[11px] ${round ? "rounded-full px-3.5 py-1.5 text-[13px] font-medium" : "rounded"}`}
      style={{ color, background: `${color}15`, borderColor: `${color}30` }}
    >
      {children}
    </span>
  );
}

/** External link that always opens safely in a new tab and says so to assistive tech. */
export function ExternalLink({
  href,
  children,
  className = "",
  style,
}: WithChildren & { href: string; style?: CSSProperties }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className} style={style}>
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

export const buttonClass =
  "inline-flex items-center gap-1.5 rounded-md border border-accent/20 bg-accent/10 px-3 py-1.5 text-xs text-accent transition-colors hover:bg-accent/20";
