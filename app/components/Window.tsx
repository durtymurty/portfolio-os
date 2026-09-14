"use client";

import { memo, useEffect, useId, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { clamp, TASKBAR_H, type Rect } from "../lib/windowManager";
import type { AppDef } from "./apps/registry";

interface WindowProps {
  app: AppDef;
  initial: Rect;
  zIndex: number;
  active: boolean;
  minimized: boolean;
  /** Small screens: windows fill the screen and can't be dragged. */
  compact: boolean;
  onClose: (id: string) => void;
  onFocus: (id: string) => void;
  onMinimize: (id: string) => void;
}

const MIN_W = 300;
const MIN_H = 200;
const HEADER_H = 40;

type Gesture =
  | { kind: "drag"; dx: number; dy: number }
  | { kind: "resize"; startX: number; startY: number; startW: number; startH: number };

function Window({ app, initial, zIndex, active, minimized, compact, onClose, onFocus, onMinimize }: WindowProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const gesture = useRef<Gesture | null>(null);
  const [rect, setRect] = useState(initial);
  const [maximized, setMaximized] = useState(false);
  const titleId = useId();
  const fullscreen = maximized || compact;

  // Move focus into the window when it opens or is restored — unless the app
  // already focused one of its own controls (e.g. the terminal input).
  useEffect(() => {
    const root = rootRef.current;
    if (!minimized && root && !root.contains(document.activeElement)) {
      root.focus({ preventScroll: true });
    }
  }, [minimized]);

  // Keep the title bar reachable when the browser window shrinks.
  useEffect(() => {
    const onResize = () =>
      setRect((r) => ({
        ...r,
        x: clamp(r.x, 0, window.innerWidth - 120),
        y: clamp(r.y, 0, window.innerHeight - TASKBAR_H - HEADER_H),
      }));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const startGesture = (e: ReactPointerEvent<HTMLElement>, g: Gesture) => {
    if (e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    gesture.current = g;
  };

  const onHeaderPointerDown = (e: ReactPointerEvent<HTMLElement>) => {
    if (fullscreen || (e.target as HTMLElement).closest("button")) return;
    startGesture(e, { kind: "drag", dx: e.clientX - rect.x, dy: e.clientY - rect.y });
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLElement>) => {
    const g = gesture.current;
    if (!g) return;
    if (g.kind === "drag") {
      setRect((r) => ({
        ...r,
        // At least 120px of the title bar stays on screen, and never under the taskbar.
        x: clamp(e.clientX - g.dx, 120 - r.w, window.innerWidth - 120),
        y: clamp(e.clientY - g.dy, 0, window.innerHeight - TASKBAR_H - HEADER_H),
      }));
    } else {
      setRect((r) => ({
        ...r,
        w: clamp(g.startW + e.clientX - g.startX, MIN_W, window.innerWidth - r.x),
        h: clamp(g.startH + e.clientY - g.startY, MIN_H, window.innerHeight - TASKBAR_H - r.y),
      }));
    }
  };

  const endGesture = () => {
    gesture.current = null;
  };

  const style = fullscreen
    ? { top: 0, left: 0, width: "100%", height: `calc(100dvh - ${TASKBAR_H}px)`, borderRadius: 0, zIndex }
    : { top: rect.y, left: rect.x, width: rect.w, height: rect.h, zIndex };

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-labelledby={titleId}
      tabIndex={-1}
      hidden={minimized}
      data-active={active}
      className="window outline-none"
      style={style}
      onPointerDownCapture={() => onFocus(app.id)}
      onFocusCapture={() => onFocus(app.id)}
      onKeyDown={(e) => {
        if (e.key === "Escape" && !e.defaultPrevented) {
          e.preventDefault();
          onClose(app.id);
        }
      }}
    >
      <div
        className="window-header"
        onPointerDown={onHeaderPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endGesture}
        onPointerCancel={endGesture}
        onDoubleClick={(e) => {
          if (!compact && !(e.target as HTMLElement).closest("button")) setMaximized((m) => !m);
        }}
      >
        <div className="mr-2 flex gap-2">
          <button type="button" className="traffic bg-[#ff5f56]" aria-label={`Close ${app.title}`} onClick={() => onClose(app.id)}>
            ×
          </button>
          <button type="button" className="traffic bg-[#ffbd2e]" aria-label={`Minimize ${app.title}`} onClick={() => onMinimize(app.id)}>
            −
          </button>
          {!compact && (
            <button
              type="button"
              className="traffic bg-[#27c93f]"
              aria-label={maximized ? `Restore ${app.title}` : `Maximize ${app.title}`}
              aria-pressed={maximized}
              onClick={() => setMaximized((m) => !m)}
            >
              +
            </button>
          )}
        </div>
        <span aria-hidden="true" className="text-sm">{app.emoji}</span>
        <span id={titleId} className="text-[13px] font-medium text-fg">{app.title}</span>
      </div>

      <div className="window-content @container">{app.element}</div>

      {!fullscreen && (
        <div
          aria-hidden="true"
          className="resize-handle"
          onPointerDown={(e) => startGesture(e, { kind: "resize", startX: e.clientX, startY: e.clientY, startW: rect.w, startH: rect.h })}
          onPointerMove={onPointerMove}
          onPointerUp={endGesture}
          onPointerCancel={endGesture}
        />
      )}
    </div>
  );
}

export default memo(Window);
