"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { PROFILE, PROJECTS } from "../../data";
import { filterItems, type PaletteItem } from "../../lib/palette";
import { toggleTheme } from "../../lib/theme";

type Action =
  | { type: "go"; href: string }
  | { type: "external"; href: string }
  | { type: "mailto"; href: string }
  | { type: "copy-email" }
  | { type: "theme" };

type Command = PaletteItem & { action: Action };

function buildCommands(resumeHref: string, resumeIsFile: boolean): Command[] {
  return [
    { id: "nav-work", group: "Go to", label: "Work", keywords: "projects portfolio", action: { type: "go", href: "/#work" } },
    { id: "nav-experience", group: "Go to", label: "Experience", keywords: "jobs history", action: { type: "go", href: "/#experience" } },
    { id: "nav-skills", group: "Go to", label: "Skills", keywords: "certifications bom", action: { type: "go", href: "/#skills" } },
    { id: "nav-contact", group: "Go to", label: "Contact", keywords: "email hire", action: { type: "go", href: "/#contact" } },
    ...PROJECTS.filter((p) => p.caseStudy).map((p): Command => ({
      id: `case-${p.slug}`,
      group: "Case studies",
      label: p.name,
      keywords: `${p.org ?? ""} ${p.tech.join(" ")} ${p.slug.replace(/-/g, " ")}`,
      action: { type: "go", href: `/work/${p.slug}` },
    })),
    {
      id: "resume",
      group: "Actions",
      label: resumeIsFile ? "Download resume" : "Request resume",
      keywords: "cv pdf",
      hint: resumeIsFile ? "PDF" : "Email",
      action: resumeIsFile ? { type: "external", href: resumeHref } : { type: "mailto", href: resumeHref },
    },
    { id: "copy-email", group: "Actions", label: "Copy email address", hint: PROFILE.email, keywords: "contact mail", action: { type: "copy-email" } },
    { id: "github", group: "Actions", label: "Open GitHub", keywords: "code source repos", hint: "↗", action: { type: "external", href: PROFILE.links.github } },
    { id: "linkedin", group: "Actions", label: "Open LinkedIn", keywords: "connect", hint: "↗", action: { type: "external", href: PROFILE.links.linkedin } },
    { id: "theme", group: "Actions", label: "Toggle light / dark theme", keywords: "dark mode blueprint", action: { type: "theme" } },
    { id: "os", group: "Actions", label: "Launch Portfolio OS", keywords: "desktop windows terminal snake", action: { type: "go", href: "/os" } },
  ];
}

/** Consecutive runs of the same group; when searching, everything goes in one unlabelled group ranked by score. */
function groupResults(results: Command[], labelled: boolean) {
  const groups: { name: string; label: string | null; items: { item: Command; index: number }[] }[] = [];
  results.forEach((item, index) => {
    const name = labelled ? item.group.replace(/\s+/g, "-") : "results";
    const last = groups.at(-1);
    if (last?.name === name) last.items.push({ item, index });
    else groups.push({ name, label: labelled ? item.group : null, items: [{ item, index }] });
  });
  return groups;
}

const isMac = () => /Mac|iPhone|iPad/.test(navigator.userAgent);

export default function CommandPalette({ resumeHref, resumeIsFile }: { resumeHref: string; resumeIsFile: boolean }) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [status, setStatus] = useState("");
  const listId = useId();
  const mac = useSyncExternalStore(() => () => {}, isMac, () => true);

  const close = () => dialogRef.current?.close();

  const commands = useMemo(() => buildCommands(resumeHref, resumeIsFile), [resumeHref, resumeIsFile]);

  const run = async ({ action }: Command) => {
    switch (action.type) {
      case "go":
        close();
        router.push(action.href);
        break;
      case "external":
        close();
        window.open(action.href, "_blank", "noopener");
        break;
      case "mailto":
        close();
        window.location.href = action.href;
        break;
      case "theme":
        toggleTheme();
        close();
        break;
      case "copy-email":
        try {
          await navigator.clipboard.writeText(PROFILE.email);
          setStatus("Email copied");
          setTimeout(close, 600);
        } catch {
          setStatus(`Couldn't copy — email is ${PROFILE.email}`);
        }
        break;
    }
  };

  const results = useMemo(() => filterItems(commands, query), [commands, query]);
  const activeIndex = Math.min(active, Math.max(results.length - 1, 0));

  const open = () => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    setQuery("");
    setActive(0);
    setStatus("");
    dialog.showModal();
    inputRef.current?.focus();
  };

  // Global shortcut: ⌘K / Ctrl+K, or "/" when not typing in a field.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = e.target instanceof HTMLElement && (e.target.isContentEditable || /INPUT|TEXTAREA|SELECT/.test(e.target.tagName));
      if ((e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        if (dialogRef.current?.open) close();
        else open();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!results.length) return;
      const delta = e.key === "ArrowDown" ? 1 : -1;
      setActive((activeIndex + delta + results.length) % results.length);
    } else if (e.key === "Home" || e.key === "End") {
      e.preventDefault();
      setActive(e.key === "Home" ? 0 : results.length - 1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results[activeIndex]) run(results[activeIndex]);
    }
  };

  // Keep the active option scrolled into view.
  useEffect(() => {
    document.getElementById(`${listId}-${activeIndex}`)?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, listId]);

  return (
    <>
      <button
        type="button"
        onClick={open}
        aria-haspopup="dialog"
        aria-keyshortcuts={mac ? "Meta+K" : "Control+K"}
        className="inline-flex h-9 items-center gap-2 rounded-sm border border-rule px-2.5 text-sm text-ink-muted transition-colors hover:border-ink hover:text-ink"
      >
        <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="8.5" cy="8.5" r="5.5" />
          <path d="m13 13 4 4" strokeLinecap="round" />
        </svg>
        <span className="sr-only">Open command menu</span>
        <kbd aria-hidden="true" className="hidden font-mono text-[11px] lg:inline">{mac ? "⌘K" : "Ctrl K"}</kbd>
      </button>

      <dialog
        ref={dialogRef}
        aria-label="Command menu"
        onClick={(e) => e.target === dialogRef.current && close()}
        className="m-auto mt-[12vh] w-[min(36rem,calc(100vw-2rem))] border border-rule-strong bg-paper p-0 text-ink shadow-2xl backdrop:bg-ink/40 backdrop:backdrop-blur-[2px]"
      >
        <div className="flex items-center gap-3 border-b border-rule px-4">
          <span aria-hidden="true" className="font-mono text-accent">&gt;</span>
          <input
            ref={inputRef}
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-activedescendant={results.length ? `${listId}-${activeIndex}` : undefined}
            aria-autocomplete="list"
            aria-label="Search commands"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActive(0); }}
            onKeyDown={onInputKey}
            placeholder="Jump to a section, case study, or action…"
            className="h-13 flex-1 bg-transparent text-base outline-none placeholder:text-ink-muted"
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className="annot hidden sm:inline">Esc</kbd>
        </div>

        {/* Options grouped with role="group" so headings are announced; indexes stay global for arrow keys. */}
        <div id={listId} role="listbox" aria-label="Commands" className="max-h-[min(24rem,60vh)] overflow-y-auto py-2">
          {groupResults(results, !query).map((group) => (
            <div key={group.name} role="group" aria-labelledby={group.label ? `${listId}-g-${group.name}` : undefined}>
              {group.label && (
                <p id={`${listId}-g-${group.name}`} className="annot px-4 pt-3 pb-1 text-[10px]">{group.label}</p>
              )}
              {group.items.map(({ item, index }) => (
                <div
                  key={item.id}
                  id={`${listId}-${index}`}
                  role="option"
                  aria-selected={index === activeIndex}
                  onPointerMove={() => index !== activeIndex && setActive(index)}
                  onClick={() => run(item)}
                  className="mx-2 flex cursor-pointer items-center justify-between gap-4 px-3 py-2.5 aria-selected:bg-ink aria-selected:text-paper"
                >
                  <span>{item.label}</span>
                  {item.hint && <span className="truncate font-mono text-xs opacity-70">{item.hint}</span>}
                </div>
              ))}
            </div>
          ))}
        </div>
        {results.length === 0 && <p className="px-4 pb-6 text-center text-ink-muted">No matches for “{query}”</p>}

        <p role="status" className="annot border-t border-rule px-4 py-2 text-[10px]">
          {status || "↑↓ navigate · ↵ select · esc close"}
        </p>
      </dialog>
    </>
  );
}
