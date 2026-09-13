"use client";

import { useCallback, useReducer } from "react";
import { PROFILE } from "../data";
import { COMPACT_QUERY, useMediaQuery } from "../lib/hooks";
import { activeWindowId, initialWMState, placeWindow, wmReducer, Z_BASE } from "../lib/windowManager";
import { APPS_BY_ID } from "./apps/registry";
import Taskbar from "./Taskbar";
import Window from "./Window";

const focusDockButton = (id: string) =>
  requestAnimationFrame(() => document.getElementById(`dock-${id}`)?.focus({ preventScroll: true }));

export default function Desktop() {
  const [state, dispatch] = useReducer(wmReducer, initialWMState);
  const compact = useMediaQuery(COMPACT_QUERY);
  const activeId = activeWindowId(state);
  const openCount = state.windows.length;

  const launch = useCallback(
    (id: string) => {
      const app = APPS_BY_ID.get(id);
      if (app) dispatch({ type: "dock", id, initial: placeWindow(app.size, openCount) });
    },
    [openCount],
  );

  const close = useCallback((id: string) => {
    dispatch({ type: "close", id });
    focusDockButton(id);
  }, []);

  const minimize = useCallback((id: string) => {
    dispatch({ type: "minimize", id });
    focusDockButton(id);
  }, []);

  const focus = useCallback((id: string) => dispatch({ type: "focus", id }), []);

  return (
    <main className="relative h-dvh w-screen overflow-hidden">
      <h1 className="sr-only">{PROFILE.name} — {PROFILE.title}</h1>
      <Backdrop />

      <div
        inert={activeId !== null}
        className={`pointer-events-none absolute top-[38%] left-1/2 w-full -translate-x-1/2 -translate-y-1/2 px-6 text-center transition-opacity duration-300 ${activeId ? "opacity-0" : "opacity-100"}`}
      >
        <p className="mb-4 text-[13px] tracking-[4px] text-white/60 uppercase">Hi, I&apos;m Murtaza <span aria-hidden="true">👋</span></p>
        <p aria-hidden="true" className="mb-4 text-4xl font-bold tracking-[6px] text-white/15 uppercase md:text-[52px]">Portfolio</p>
        <p className="text-[15px] tracking-wide text-white/70">{PROFILE.title}</p>
        <p className="mt-2.5 text-[13px] text-white/60">Pick any app below to explore <span aria-hidden="true">↓</span></p>
      </div>

      {state.windows.map((win) => {
        const app = APPS_BY_ID.get(win.id)!;
        return (
          <Window
            key={win.id}
            app={app}
            initial={win.initial}
            zIndex={Z_BASE + state.order.indexOf(win.id)}
            active={win.id === activeId}
            minimized={win.minimized}
            compact={compact}
            onClose={close}
            onFocus={focus}
            onMinimize={minimize}
          />
        );
      })}

      <Taskbar windows={state.windows} activeId={activeId} onLaunch={launch} />
    </main>
  );
}

function Backdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden bg-[linear-gradient(135deg,#060612_0%,#0a0f1e_50%,#060e18_100%)]">
      <div className="blob top-[5%] left-[5%] size-[500px] bg-[radial-gradient(circle,rgba(88,166,255,0.12)_0%,transparent_70%)] [animation:blob1_12s_ease-in-out_infinite]" />
      <div className="blob top-[40%] right-[5%] size-[600px] bg-[radial-gradient(circle,rgba(188,140,255,0.10)_0%,transparent_70%)] [animation:blob2_15s_ease-in-out_infinite]" />
      <div className="blob bottom-[10%] left-[30%] size-[400px] bg-[radial-gradient(circle,rgba(63,185,80,0.07)_0%,transparent_70%)] [animation:blob3_10s_ease-in-out_infinite]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[length:32px_32px]" />
    </div>
  );
}
