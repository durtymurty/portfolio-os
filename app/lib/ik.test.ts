import { describe, expect, it } from "vitest";
import { angleDelta, solveIK } from "./ik";

const base = { x: 0, y: 0 };

describe("solveIK", () => {
  it.each([
    { x: 150, y: 0 },
    { x: 80, y: -90 },
    { x: -60, y: 120 },
    { x: 20, y: -40 },
  ])("reaches in-range target %o exactly", (target) => {
    const pose = solveIK(base, target, 120, 100);
    expect(pose.reachable).toBe(true);
    expect(pose.wristPos.x).toBeCloseTo(target.x, 6);
    expect(pose.wristPos.y).toBeCloseTo(target.y, 6);
  });

  it("clamps far targets to full extension along the same heading", () => {
    const pose = solveIK(base, { x: 1000, y: 0 }, 120, 100);
    expect(pose.reachable).toBe(false);
    expect(Math.hypot(pose.wristPos.x, pose.wristPos.y)).toBeCloseTo(220, 3);
    expect(pose.wristPos.y).toBeCloseTo(0, 3);
  });

  it("clamps targets inside the dead zone", () => {
    const pose = solveIK(base, { x: 5, y: 0 }, 120, 100);
    expect(pose.reachable).toBe(false);
    expect(Math.hypot(pose.wristPos.x, pose.wristPos.y)).toBeCloseTo(20, 3);
  });

  it("keeps the elbow above the base–wrist line (elbow-up)", () => {
    const pose = solveIK(base, { x: 150, y: 0 }, 120, 100);
    expect(pose.elbowPos.y).toBeLessThan(0);
  });

  it("handles a target at the base without NaN", () => {
    const pose = solveIK(base, base, 120, 100);
    expect(Number.isFinite(pose.shoulder)).toBe(true);
    expect(Number.isFinite(pose.wristPos.x)).toBe(true);
  });
});

describe("angleDelta", () => {
  it("takes the short way around", () => {
    expect(angleDelta(3, -3)).toBeCloseTo(2 * Math.PI - 6, 6);
    expect(angleDelta(0, Math.PI / 2)).toBeCloseTo(Math.PI / 2, 6);
  });
});
