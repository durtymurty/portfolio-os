import Link from "next/link";
import { getResume } from "../../lib/resume";
import CommandPalette from "./CommandPalette";
import ThemeToggle from "./ThemeToggle";

export const NAV = [
  { href: "/#work", label: "Work", n: "01" },
  { href: "/#experience", label: "Experience", n: "02" },
  { href: "/#skills", label: "Skills", n: "03" },
  { href: "/#contact", label: "Contact", n: "04" },
];

export default function Header() {
  const resume = getResume();

  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-paper/85 backdrop-blur-md">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-ink focus:px-3 focus:py-2 focus:text-paper"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-5 md:px-8">
        <Link href="/" className="flex items-center gap-2.5 font-mono text-sm font-medium tracking-tight">
          <span aria-hidden="true" className="grid size-7 place-items-center border border-ink text-[11px]">MB</span>
          <span className="hidden sm:inline">Murtaza Bootwala</span>
        </Link>

        <nav aria-label="Primary" className="ml-auto hidden md:block">
          <ul className="flex items-center gap-6">
            {NAV.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="group text-sm text-ink-muted transition-colors hover:text-ink">
                  <span aria-hidden="true" className="mr-1 font-mono text-[10px] text-accent">{item.n}</span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2 md:ml-4">
          <a
            href={resume.href}
            {...(resume.isFile ? { target: "_blank", rel: "noopener" } : {})}
            className="inline-flex h-9 items-center gap-2 rounded-sm bg-ink px-3.5 text-sm font-medium text-paper transition-colors hover:bg-accent"
          >
            Resume
            <span aria-hidden="true" className="font-mono text-xs">{resume.isFile ? "↓" : "→"}</span>
            {resume.isFile && <span className="sr-only"> (PDF, opens in a new tab)</span>}
          </a>
          <CommandPalette resumeHref={resume.href} resumeIsFile={resume.isFile} />
          <ThemeToggle />
        </div>
      </div>

      {/* Compact section nav for small screens */}
      <nav aria-label="Sections" className="border-t border-rule md:hidden">
        <ul className="mx-auto flex max-w-6xl justify-between px-5">
          {NAV.map((item) => (
            <li key={item.href}>
              <a href={item.href} className="block py-2 text-[13px] text-ink-muted hover:text-ink">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
