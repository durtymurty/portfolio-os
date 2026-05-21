"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const GRID = 20;
const CELL = 20;
const SPEED = 150;

type Dir = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Point = { x: number; y: number };

export default function SnakeApp() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [running, setRunning] = useState(false);
  const [dead, setDead] = useState(false);
  const snake = useRef<Point[]>([{ x: 10, y: 10 }]);
  const food = useRef<Point>({ x: 5, y: 5 });
  const dir = useRef<Dir>("RIGHT");
  const nextDir = useRef<Dir>("RIGHT");
  const interval = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  const randomFood = (): Point => ({
    x: Math.floor(Math.random() * GRID),
    y: Math.floor(Math.random() * GRID),
  });

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#0d1117";
    ctx.fillRect(0, 0, GRID * CELL, GRID * CELL);

    // Food
    ctx.fillStyle = "#f85149";
    ctx.beginPath();
    ctx.arc(food.current.x * CELL + CELL / 2, food.current.y * CELL + CELL / 2, CELL / 2 - 2, 0, Math.PI * 2);
    ctx.fill();

    // Snake
    snake.current.forEach((seg, i) => {
      ctx.fillStyle = i === 0 ? "#3fb950" : "#238636";
      ctx.fillRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2);
    });
  }, []);

  const tick = useCallback(() => {
    dir.current = nextDir.current;
    const head = snake.current[0];
    const newHead = {
      x: (head.x + (dir.current === "RIGHT" ? 1 : dir.current === "LEFT" ? -1 : 0) + GRID) % GRID,
      y: (head.y + (dir.current === "DOWN" ? 1 : dir.current === "UP" ? -1 : 0) + GRID) % GRID,
    };

    if (snake.current.some(s => s.x === newHead.x && s.y === newHead.y)) {
      clearInterval(interval.current);
      setRunning(false);
      setDead(true);
      setScore(s => { setBest(b => Math.max(b, s)); return s; });
      return;
    }

    snake.current = [newHead, ...snake.current];
    if (newHead.x === food.current.x && newHead.y === food.current.y) {
      food.current = randomFood();
      setScore(s => s + 1);
    } else {
      snake.current.pop();
    }
    draw();
  }, [draw]);

  const start = () => {
    snake.current = [{ x: 10, y: 10 }];
    food.current = randomFood();
    dir.current = "RIGHT";
    nextDir.current = "RIGHT";
    setScore(0);
    setDead(false);
    setRunning(true);
    clearInterval(interval.current);
    interval.current = setInterval(tick, SPEED);
    draw();
  };

  useEffect(() => {
    draw();
    return () => clearInterval(interval.current);
  }, [draw]);

  useEffect(() => {
    if (running) {
      clearInterval(interval.current);
      interval.current = setInterval(tick, SPEED);
    }
  }, [tick, running]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!running) return;
      if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) {
        e.preventDefault();
      }
      if (e.key === "ArrowUp" && dir.current !== "DOWN") nextDir.current = "UP";
      if (e.key === "ArrowDown" && dir.current !== "UP") nextDir.current = "DOWN";
      if (e.key === "ArrowLeft" && dir.current !== "RIGHT") nextDir.current = "LEFT";
      if (e.key === "ArrowRight" && dir.current !== "LEFT") nextDir.current = "RIGHT";
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [running]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
      <div style={{ display: "flex", gap: "24px" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "11px", color: "#8b949e", textTransform: "uppercase" }}>Score</p>
          <p style={{ fontSize: "28px", fontWeight: "700", color: "#3fb950" }}>{score}</p>
        </div>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "11px", color: "#8b949e", textTransform: "uppercase" }}>Best</p>
          <p style={{ fontSize: "28px", fontWeight: "700", color: "#58a6ff" }}>{best}</p>
        </div>
      </div>

      <div style={{ position: "relative" }}>
        <canvas ref={canvasRef} width={GRID * CELL} height={GRID * CELL} style={{ border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", display: "block" }} />
        {!running && (
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.7)", borderRadius: "8px", gap: "12px" }}>
            {dead && <p style={{ color: "#f85149", fontSize: "18px", fontWeight: "700" }}>Game Over!</p>}
            <button onClick={start} style={{ background: "#3fb950", color: "#000", border: "none", borderRadius: "8px", padding: "10px 24px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
              {dead ? "Play Again" : "Start Game"}
            </button>
          </div>
        )}
      </div>
      <p style={{ fontSize: "12px", color: "#8b949e" }}>Use arrow keys to control the snake</p>
    </div>
  );
}