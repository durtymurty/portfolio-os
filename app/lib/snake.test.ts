import { describe, expect, it } from "vitest";
import { GRID, isReversal, placeFood, step, type SnakeState } from "./snake";

const state = (snake: [number, number][], food: [number, number] = [0, 0]): SnakeState => ({
  snake: snake.map(([x, y]) => ({ x, y })),
  food: { x: food[0], y: food[1] },
  dir: "right",
  score: 0,
  dead: false,
});

describe("snake", () => {
  it("moves forward and keeps its length", () => {
    const next = step(state([[5, 5], [4, 5], [3, 5]]), "right");
    expect(next.snake).toEqual([{ x: 6, y: 5 }, { x: 5, y: 5 }, { x: 4, y: 5 }]);
    expect(next.dead).toBe(false);
  });

  it("grows and scores when eating", () => {
    const next = step(state([[5, 5], [4, 5]], [6, 5]), "right", () => 0);
    expect(next.snake).toHaveLength(3);
    expect(next.score).toBe(1);
  });

  it("can move into the cell its tail is leaving", () => {
    // A 2x2 loop: head at (5,5) moving down into (5,6), which the tail vacates this tick.
    const loop = state([[5, 5], [4, 5], [4, 6], [5, 6]]);
    expect(step(loop, "down").dead).toBe(false);
  });

  it("dies when hitting its body", () => {
    const s = state([[5, 5], [4, 5], [4, 6], [5, 6], [6, 6]]);
    expect(step(s, "down").dead).toBe(true);
  });

  it("wraps around the edges", () => {
    expect(step(state([[GRID - 1, 0]]), "right").snake[0]).toEqual({ x: 0, y: 0 });
  });

  it("never places food on the snake", () => {
    const body = Array.from({ length: GRID * GRID - 1 }, (_, i) => ({ x: i % GRID, y: Math.floor(i / GRID) }));
    expect(placeFood(body)).toEqual({ x: GRID - 1, y: GRID - 1 });
    expect(placeFood([...body, { x: GRID - 1, y: GRID - 1 }])).toBeNull();
  });

  it("detects reversals", () => {
    expect(isReversal("up", "down")).toBe(true);
    expect(isReversal("up", "left")).toBe(false);
  });
});
