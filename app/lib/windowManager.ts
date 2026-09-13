export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface WindowState {
  id: string;
  minimized: boolean;
  /** Placement when first opened; the Window owns its position after that. */
  initial: Rect;
}

export interface WMState {
  windows: WindowState[];
  /** Window ids from back to front. */
  order: string[];
}

export type WMAction =
  | { type: "open"; id: string; initial: Rect }
  | { type: "dock"; id: string; initial: Rect }
  | { type: "close"; id: string }
  | { type: "focus"; id: string }
  | { type: "minimize"; id: string };

export const initialWMState: WMState = { windows: [], order: [] };

export const Z_BASE = 10;
export const TASKBAR_H = 80;

const toFront = (order: string[], id: string) =>
  order[order.length - 1] === id ? order : [...order.filter((o) => o !== id), id];

/** Topmost window that isn't minimized. */
export function activeWindowId(state: WMState): string | null {
  for (let i = state.order.length - 1; i >= 0; i--) {
    const win = state.windows.find((w) => w.id === state.order[i]);
    if (win && !win.minimized) return win.id;
  }
  return null;
}

export function wmReducer(state: WMState, action: WMAction): WMState {
  const win = state.windows.find((w) => w.id === action.id);

  switch (action.type) {
    case "open": {
      if (!win) {
        return {
          windows: [...state.windows, { id: action.id, minimized: false, initial: action.initial }],
          order: [...state.order, action.id],
        };
      }
      const order = toFront(state.order, action.id);
      if (!win.minimized && order === state.order) return state;
      return {
        windows: win.minimized
          ? state.windows.map((w) => (w.id === action.id ? { ...w, minimized: false } : w))
          : state.windows,
        order,
      };
    }

    // Taskbar click: open → focus → minimize, like a real dock.
    case "dock": {
      if (win && !win.minimized && activeWindowId(state) === action.id) {
        return wmReducer(state, { type: "minimize", id: action.id });
      }
      return wmReducer(state, { ...action, type: "open" });
    }

    case "close":
      if (!win) return state;
      return {
        windows: state.windows.filter((w) => w.id !== action.id),
        order: state.order.filter((o) => o !== action.id),
      };

    case "focus": {
      if (!win) return state;
      const order = toFront(state.order, action.id);
      return order === state.order ? state : { ...state, order };
    }

    case "minimize":
      if (!win || win.minimized) return state;
      return {
        ...state,
        windows: state.windows.map((w) => (w.id === action.id ? { ...w, minimized: true } : w)),
      };
  }
}

/** Cascade new windows and keep them fully inside the usable viewport. */
export function placeWindow(size: { w: number; h: number }, openCount: number): Rect {
  const vw = window.innerWidth;
  const vh = window.innerHeight - TASKBAR_H;
  const w = Math.min(size.w, vw - 32);
  const h = Math.min(size.h, vh - 32);
  const offset = (openCount % 8) * 30;
  return {
    w,
    h,
    x: clamp(80 + offset, 16, vw - w - 16),
    y: clamp(40 + offset, 16, vh - h - 16),
  };
}

export const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(n, Math.max(min, max)));
