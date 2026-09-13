export const GRID = 20;

export type Dir = "up" | "down" | "left" | "right";
export type Point = { x: number; y: number };

export interface SnakeState {
  snake: Point[]; // head first
  food: Point;
  dir: Dir;
  score: number;
  dead: boolean;
}

const VECTORS: Record<Dir, Point> = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } };
const OPPOSITE: Record<Dir, Dir> = { up: "down", down: "up", left: "right", right: "left" };

export const isReversal = (a: Dir, b: Dir) => OPPOSITE[a] === b;

/** Random empty cell, or null when the board is full. */
export function placeFood(snake: Point[], rand = Math.random): Point | null {
  const taken = new Set(snake.map((p) => p.y * GRID + p.x));
  const free: number[] = [];
  for (let i = 0; i < GRID * GRID; i++) if (!taken.has(i)) free.push(i);
  if (free.length === 0) return null;
  const cell = free[Math.floor(rand() * free.length)];
  return { x: cell % GRID, y: Math.floor(cell / GRID) };
}

export function newGame(rand = Math.random): SnakeState {
  const snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
  return { snake, food: placeFood(snake, rand)!, dir: "right", score: 0, dead: false };
}

export function step(state: SnakeState, dir: Dir, rand = Math.random): SnakeState {
  if (state.dead) return state;
  const v = VECTORS[dir];
  const head = state.snake[0];
  const next = { x: (head.x + v.x + GRID) % GRID, y: (head.y + v.y + GRID) % GRID };
  const eats = next.x === state.food.x && next.y === state.food.y;

  // The tail moves out of the way this tick unless we grow, so it's not an obstacle.
  const body = eats ? state.snake : state.snake.slice(0, -1);
  if (body.some((p) => p.x === next.x && p.y === next.y)) {
    return { ...state, dir, dead: true };
  }

  const snake = [next, ...body];
  if (!eats) return { ...state, snake, dir };

  const food = placeFood(snake, rand);
  // Filled the whole board — that's a win; end the round.
  return food
    ? { snake, food, dir, score: state.score + 1, dead: false }
    : { snake, food: state.food, dir, score: state.score + 1, dead: true };
}

/** Tick interval in ms; speeds up gently as the snake grows. */
export const tickMs = (score: number) => Math.max(70, 140 - score * 3);
