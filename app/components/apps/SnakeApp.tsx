"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { GRID, isReversal, newGame, step, tickMs, type Dir, type SnakeState } from "../../lib/snake";

const BOARD_PX = 400;
const CELL = BOARD_PX / GRID;
const BEST_KEY = "portfolio-os:snake-best";

type Status = "idle" | "running" | "paused" | "over";

const KEY_DIRS: Record<string, Dir> = {
  ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right",
  w: "up", s: "down", a: "left", d: "right",
};

function readBest(): number {
  try {
    return Number(localStorage.getItem(BEST_KEY)) || 0;
  } catch {
    return 0;
  }
}

export default function SnakeApp() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const game = useRef<SnakeState>(newGame());
  const queue = useRef<Dir[]>([]);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(readBest);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const dpr = window.devicePixelRatio || 1;
    if (canvas.width !== BOARD_PX * dpr) {
      canvas.width = canvas.height = BOARD_PX * dpr;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.fillStyle = "#0d1117";
    ctx.fillRect(0, 0, BOARD_PX, BOARD_PX);

    const { food, snake } = game.current;
    ctx.fillStyle = "#f85149";
    ctx.beginPath();
    ctx.arc(food.x * CELL + CELL / 2, food.y * CELL + CELL / 2, CELL / 2 - 2, 0, Math.PI * 2);
    ctx.fill();

    snake.forEach((seg, i) => {
      ctx.fillStyle = i === 0 ? "#3fb950" : "#238636";
      ctx.fillRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2);
    });
  }, []);

  useEffect(draw, [draw]);

  // Game loop — a timeout chain so speed can change as the score climbs.
  useEffect(() => {
    if (status !== "running") return;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const dir = queue.current.shift() ?? game.current.dir;
      const prev = game.current;
      game.current = step(prev, dir);
      draw();
      if (game.current.score !== prev.score) setScore(game.current.score);
      if (game.current.dead) {
        setStatus("over");
        setBest((b) => {
          const next = Math.max(b, game.current.score);
          try { localStorage.setItem(BEST_KEY, String(next)); } catch { /* storage unavailable */ }
          return next;
        });
        return;
      }
      timer = setTimeout(tick, tickMs(game.current.score));
    };
    timer = setTimeout(tick, tickMs(game.current.score));
    return () => clearTimeout(timer);
  }, [status, draw]);

  // Pause when the tab is hidden.
  useEffect(() => {
    const onVisibility = () => document.hidden && setStatus((s) => (s === "running" ? "paused" : s));
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const start = () => {
    game.current = newGame();
    queue.current = [];
    setScore(0);
    setStatus("running");
    draw();
    rootRef.current?.focus({ preventScroll: true });
  };

  const resume = () => {
    setStatus("running");
    rootRef.current?.focus({ preventScroll: true });
  };

  const turn = (dir: Dir) => {
    const last = queue.current.at(-1) ?? game.current.dir;
    // Queue up to two turns so quick "up, left" presses both register without reversing into yourself.
    if (dir !== last && !isReversal(last, dir) && queue.current.length < 2) queue.current.push(dir);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const dir = KEY_DIRS[e.key];
    if (e.key === " ") {
      e.preventDefault();
      if (status === "running") setStatus("paused");
      else if (status === "paused") resume();
      else start();
      return;
    }
    if (!dir) return;
    e.preventDefault();
    if (status === "running") turn(dir);
  };

  const onSwipeEnd = (e: React.PointerEvent) => {
    const s = swipeStart.current;
    swipeStart.current = null;
    if (!s || status !== "running") return;
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 20) return;
    turn(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : dy > 0 ? "down" : "up");
  };

  return (
    <div
      ref={rootRef}
      tabIndex={-1}
      onKeyDown={onKeyDown}
      // Leaving the game (clicking another window, minimizing) pauses it.
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setStatus((s) => (s === "running" ? "paused" : s));
      }}
      className="flex flex-col items-center gap-4 outline-none"
    >
      <div className="flex gap-6" aria-live="polite">
        <div className="text-center">
          <p className="text-[11px] text-fg-muted uppercase">Score</p>
          <p className="text-3xl font-bold text-ok">{score}</p>
        </div>
        <div className="text-center">
          <p className="text-[11px] text-fg-muted uppercase">Best</p>
          <p className="text-3xl font-bold text-os-accent">{best}</p>
        </div>
      </div>

      <div className="relative w-full max-w-[400px]">
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={`Snake board. Score ${score}.`}
          className="block aspect-square w-full touch-none rounded-lg border border-white/10"
          onPointerDown={(e) => (swipeStart.current = { x: e.clientX, y: e.clientY })}
          onPointerUp={onSwipeEnd}
        />
        {status !== "running" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-lg bg-black/70">
            {status === "over" && <p className="text-lg font-bold text-danger">Game Over!</p>}
            {status === "paused" && <p className="text-lg font-bold text-fg-strong">Paused</p>}
            <button
              type="button"
              onClick={status === "paused" ? resume : start}
              className="rounded-lg bg-ok px-6 py-2.5 text-sm font-semibold text-black hover:brightness-110"
            >
              {status === "paused" ? "Resume" : status === "over" ? "Play Again" : "Start Game"}
            </button>
          </div>
        )}
      </div>

      {/* On-screen controls for touch devices. */}
      <div className="hidden grid-cols-3 gap-1.5 [@media(pointer:coarse)]:grid" aria-label="Direction controls">
        {([["up", "↑", "col-start-2"], ["left", "←", "col-start-1"], ["down", "↓", ""], ["right", "→", ""]] as const).map(([dir, label, pos]) => (
          <button
            key={dir}
            type="button"
            aria-label={`Move ${dir}`}
            onPointerDown={(e) => { e.preventDefault(); turn(dir); }}
            className={`size-12 rounded-lg border border-line bg-raised text-xl text-fg-strong ${pos}`}
          >
            {label}
          </button>
        ))}
      </div>

      <p className="text-xs text-fg-muted">Arrow keys / WASD to steer · Space to pause</p>
    </div>
  );
}
