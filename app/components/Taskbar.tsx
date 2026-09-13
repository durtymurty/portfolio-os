"use client";

import { memo } from "react";
import { TASKBAR_H, type WindowState } from "../lib/windowManager";
import { APPS } from "./apps/registry";
import Clock from "./Clock";

interface TaskbarProps {
  windows: WindowState[];
  activeId: string | null;
  onLaunch: (id: string) => void;
}

function Taskbar({ windows, activeId, onLaunch }: TaskbarProps) {
  return (
    <nav
      aria-label="Applications"
      className="fixed inset-x-0 bottom-0 z-[1000] flex items-center justify-center border-t border-white/5 bg-[#080814]/90 px-3 backdrop-blur-xl md:px-5"
      style={{ height: TASKBAR_H }}
    >
      <ul className="flex max-w-full items-end gap-1.5 overflow-x-auto rounded-2xl border border-white/[0.07] bg-white/[0.04] px-3 pt-1.5 pb-1 [scrollbar-width:none]">
        {APPS.map((app) => {
          const win = windows.find((w) => w.id === app.id);
          const status = !win ? "" : win.minimized ? "minimized" : app.id === activeId ? "active" : "open";
          return (
            <li key={app.id} className="shrink-0">
              <button
                id={`dock-${app.id}`}
                type="button"
                data-open={!!win}
                onClick={() => onLaunch(app.id)}
                className="dock-item flex w-14 flex-col items-center gap-0.5 rounded-lg outline-none"
              >
                <span aria-hidden="true" className="dock-icon">{app.emoji}</span>
                <span className={`max-w-full truncate text-[10px] ${win ? "text-accent" : "text-fg-muted"}`}>
                  {app.title}
                  {status && <span className="sr-only">, {status}</span>}
                </span>
                <span
                  aria-hidden="true"
                  className={`size-1 rounded-full ${win ? (win.minimized ? "bg-fg-muted" : "bg-accent shadow-[0_0_6px_#58a6ff]") : "bg-transparent"}`}
                />
              </button>
            </li>
          );
        })}
      </ul>
      <Clock />
    </nav>
  );
}

export default memo(Taskbar);
