"use client";

import { useState } from "react";
import { CERTIFICATIONS, EXPERIENCE, PROJECTS, SKILLS } from "../../data";
import { buttonClass, ExternalLink, Icon, Tag } from "../ui";

interface FileItem {
  name: string;
  emoji: string;
  color: string;
  subtitle?: string;
  body: string[];
  tags: string[];
  link?: string;
}

// Every folder is derived from data.ts so this app can never drift out of date.
const FOLDERS: { name: string; items: FileItem[] }[] = [
  {
    name: "Projects",
    items: PROJECTS.map((p) => ({
      name: p.name,
      emoji: p.emoji,
      color: p.color,
      subtitle: p.highlight && `🏆 ${p.highlight}`,
      body: [p.description],
      tags: p.tech,
      link: p.github,
    })),
  },
  {
    name: "Experience",
    items: EXPERIENCE.map((e) => ({
      name: e.company,
      emoji: "🛠️",
      color: "#58a6ff",
      subtitle: `${e.role} · ${e.period}`,
      body: e.bullets,
      tags: [],
    })),
  },
  {
    name: "Skills",
    items: SKILLS.map((s) => ({ name: s.category, emoji: "⚡", color: "#d2a8ff", body: [], tags: s.items })),
  },
  {
    name: "Certifications",
    items: CERTIFICATIONS.map((c) => ({ name: c.name, emoji: c.emoji, color: "#e3b341", subtitle: c.issuer, body: [], tags: [] })),
  },
];

export default function FileExplorerApp() {
  const [folderName, setFolderName] = useState(FOLDERS[0].name);
  const [itemName, setItemName] = useState<string | null>(null);

  const folder = FOLDERS.find((f) => f.name === folderName)!;
  const item = folder.items.find((i) => i.name === itemName);

  return (
    <div className="grid h-full grid-cols-1 gap-3 @lg:grid-cols-[150px_1fr] @3xl:grid-cols-[150px_1fr_240px]">
      <nav aria-label="Folders" className="flex gap-1 overflow-x-auto border-line @lg:flex-col @lg:border-r @lg:pr-3">
        <p className="mb-2 hidden text-[11px] tracking-widest text-fg-muted uppercase @lg:block">Folders</p>
        {FOLDERS.map((f) => (
          <button
            key={f.name}
            type="button"
            aria-current={f.name === folderName}
            onClick={() => { setFolderName(f.name); setItemName(null); }}
            className={`shrink-0 rounded-md px-2.5 py-2 text-left text-[13px] ${
              f.name === folderName ? "bg-os-accent/10 text-os-accent" : "text-fg hover:bg-white/5"
            }`}
          >
            <Icon>📁</Icon> {f.name}
          </button>
        ))}
      </nav>

      <ul aria-label={`${folderName} files`} className="flex min-h-0 flex-col gap-1 overflow-y-auto">
        {folder.items.map((i) => (
          <li key={i.name}>
            <button
              type="button"
              aria-pressed={i.name === itemName}
              onClick={() => setItemName(i.name === itemName ? null : i.name)}
              className="flex w-full items-center gap-2.5 rounded-lg border-l-[3px] px-3 py-2.5 text-left text-[13px] text-fg hover:bg-white/5"
              style={{
                borderColor: i.name === itemName ? i.color : "transparent",
                background: i.name === itemName ? "rgb(88 166 255 / 0.1)" : undefined,
              }}
            >
              <Icon className="text-lg">{i.emoji}</Icon>
              {i.name}
            </button>
            {/* Narrow windows: preview expands inline under the selected file. */}
            {i.name === itemName && <Preview item={i} className="mt-1 mb-2 px-3 @3xl:hidden" />}
          </li>
        ))}
      </ul>

      {item ? (
        <Preview item={item} className="hidden border-l border-line pl-4 @3xl:block" />
      ) : (
        <p className="hidden pt-5 text-center text-[13px] text-fg-muted @3xl:block">Select a file to preview</p>
      )}
    </div>
  );
}

function Preview({ item, className }: { item: FileItem; className: string }) {
  return (
    <section aria-label={`${item.name} details`} className={className}>
      <Icon className="mb-3 block text-center text-4xl">{item.emoji}</Icon>
      <h3 className="text-sm font-semibold" style={{ color: item.color }}>{item.name}</h3>
      {item.subtitle && <p className="mb-2 text-xs text-fg-muted">{item.subtitle}</p>}
      {item.body.map((b) => (
        <p key={b} className="mb-2 text-xs leading-normal text-fg-muted">{b}</p>
      ))}
      {item.tags.length > 0 && (
        <ul className="mb-3 flex flex-wrap gap-1">
          {item.tags.map((t) => <li key={t}><Tag color={item.color}>{t}</Tag></li>)}
        </ul>
      )}
      {item.link && (
        <ExternalLink href={item.link} className={buttonClass}>View on GitHub →</ExternalLink>
      )}
    </section>
  );
}
