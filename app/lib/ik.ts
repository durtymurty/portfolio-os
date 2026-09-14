// Planar two-link inverse kinematics for the hero robot arm.
// Coordinates are SVG-style (y grows downward); angles are radians.

export interface Vec {
  x: number;
  y: number;
}

export interface ArmPose {
  /** Shoulder angle, measured from +x. */
  shoulder: number;
  /** Elbow angle relative to the upper link. */
  elbow: number;
  elbowPos: Vec;
  wristPos: Vec;
  /** False when the target was outside the reachable annulus and got clamped. */
  reachable: boolean;
}

/**
 * Solve for joint angles that place the wrist at `target`.
 * Uses the "elbow up" solution (elbow above the base–wrist line on screen).
 */
export function solveIK(base: Vec, target: Vec, l1: number, l2: number): ArmPose {
  const dx = target.x - base.x;
  const dy = target.y - base.y;
  const dist = Math.hypot(dx, dy);

  const minReach = Math.abs(l1 - l2) + 1e-6;
  const maxReach = l1 + l2 - 1e-6;
  const d = Math.min(Math.max(dist, minReach), maxReach);
  const reachable = dist >= minReach && dist <= maxReach;

  // Law of cosines for the elbow. With y pointing down, a positive elbow angle
  // swings the shoulder counter-clockwise on screen, which lifts the elbow up.
  const cosElbow = (d * d - l1 * l1 - l2 * l2) / (2 * l1 * l2);
  const elbow = Math.acos(Math.min(1, Math.max(-1, cosElbow)));

  const heading = dist === 0 ? 0 : Math.atan2(dy, dx);
  const shoulder = heading - Math.atan2(l2 * Math.sin(elbow), l1 + l2 * Math.cos(elbow));

  return { shoulder, elbow, reachable, ...forwardKinematics(base, shoulder, elbow, l1, l2) };
}

export function forwardKinematics(base: Vec, shoulder: number, elbow: number, l1: number, l2: number) {
  const elbowPos = { x: base.x + l1 * Math.cos(shoulder), y: base.y + l1 * Math.sin(shoulder) };
  const wristPos = {
    x: elbowPos.x + l2 * Math.cos(shoulder + elbow),
    y: elbowPos.y + l2 * Math.sin(shoulder + elbow),
  };
  return { elbowPos, wristPos };
}

/** Shortest signed difference between two angles, in (-π, π]. */
export function angleDelta(from: number, to: number): number {
  const d = (to - from) % (2 * Math.PI);
  return d > Math.PI ? d - 2 * Math.PI : d <= -Math.PI ? d + 2 * Math.PI : d;
}

export const toDegrees = (rad: number) => (rad * 180) / Math.PI;
