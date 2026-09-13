"use client";

import { useEffect, useRef, useState } from "react";
import { angleDelta, forwardKinematics, solveIK, toDegrees, type Vec } from "../../lib/ik";

const W = 520;
const H = 440;
const BASE: Vec = { x: 190, y: 350 };
const L1 = 150;
const L2 = 125;
const IDLE_AFTER_MS = 2500;

/** Slow figure-eight the arm traces when nobody is steering it. */
const idleTarget = (t: number): Vec => ({
  x: BASE.x + 150 + 70 * Math.cos(t * 0.45),
  y: BASE.y - 150 + 55 * Math.sin(t * 0.9),
});

const INITIAL = solveIK(BASE, idleTarget(0), L1, L2);

interface Pose {
  shoulder: number;
  elbow: number;
  target: Vec;
  reachable: boolean;
  steering: boolean;
}

export default function RobotArm() {
  const svgRef = useRef<SVGSVGElement>(null);
  const pointer = useRef<{ p: Vec; at: number } | null>(null);
  const [pose, setPose] = useState<Pose>({
    shoulder: INITIAL.shoulder,
    elbow: INITIAL.elbow,
    target: idleTarget(0),
    reachable: true,
    steering: false,
  });

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const toSvg = (clientX: number, clientY: number): Vec | null => {
      const ctm = svg.getScreenCTM();
      if (!ctm) return null;
      const pt = new DOMPoint(clientX, clientY).matrixTransform(ctm.inverse());
      return { x: pt.x, y: pt.y };
    };

    const current = { shoulder: INITIAL.shoulder, elbow: INITIAL.elbow };
    let raf = 0;
    let last = performance.now();
    let visible = false;

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const p = pointer.current;
      const steering = !!p && now - p.at < IDLE_AFTER_MS;
      const target = steering ? p!.p : idleTarget(now / 1000);
      const goal = solveIK(BASE, target, L1, L2);

      // Critically-damped-ish easing toward the IK solution; snaps under reduced motion.
      const k = reduceMotion ? 1 : 1 - Math.exp(-dt * (steering ? 12 : 4));
      current.shoulder = wrap(current.shoulder + angleDelta(current.shoulder, goal.shoulder) * k);
      current.elbow = wrap(current.elbow + angleDelta(current.elbow, goal.elbow) * k);

      setPose({ ...current, target, reachable: goal.reachable, steering });
      // Under reduced motion only render in response to pointer input.
      if (visible && !reduceMotion) raf = requestAnimationFrame(frame);
    };

    const onPointerMove = (e: PointerEvent) => {
      const p = toSvg(e.clientX, e.clientY);
      if (!p) return;
      pointer.current = { p, at: performance.now() };
      if (reduceMotion) frame(performance.now());
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible && !reduceMotion) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    });
    observer.observe(svg);
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  // Round everything rendered: engines may differ in the last bits of Math.cos etc.,
  // which would otherwise cause hydration mismatches between Node and some browsers.
  const fk = forwardKinematics(BASE, pose.shoulder, pose.elbow, L1, L2);
  const elbowPos = roundVec(fk.elbowPos);
  const wristPos = roundVec(fk.wristPos);
  const target = roundVec(pose.target);
  const heading = pose.shoulder + pose.elbow;
  const deg = (r: number) => round(toDegrees(r));
  const theta1 = -deg(pose.shoulder); // report angles counter-clockwise-positive, like a textbook
  const theta2 = -deg(pose.elbow);

  // L1 dimension line, offset perpendicular to the upper link.
  const nx = -Math.sin(pose.shoulder);
  const ny = Math.cos(pose.shoulder);
  const off = 34;
  const d1 = roundVec({ x: BASE.x + nx * off, y: BASE.y + ny * off });
  const d2 = roundVec({ x: elbowPos.x + nx * off, y: elbowPos.y + ny * off });
  const t1 = roundVec({ x: d1.x + nx * 6, y: d1.y + ny * 6 });
  const t2 = roundVec({ x: d2.x + nx * 6, y: d2.y + ny * 6 });
  const dimMid = roundVec({ x: (d1.x + d2.x) / 2 + nx * 12, y: (d1.y + d2.y) / 2 + ny * 12 });
  let dimAngle = deg(pose.shoulder);
  if (dimAngle > 90 || dimAngle < -90) dimAngle += 180; // keep label upright

  return (
    <figure className="relative">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full touch-pan-y select-none"
        role="img"
        aria-labelledby="arm-title"
      >
        <title id="arm-title">
          Technical line drawing of a two-joint robot arm. It follows your pointer using inverse kinematics.
        </title>
        <defs>
          <marker id="arr" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 1 L10 5 L0 9 z" className="fill-ink-muted" />
          </marker>
          <pattern id="hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="8" className="stroke-rule-strong" strokeWidth="1" />
          </pattern>
        </defs>

        {/* Workspace envelope (max reach) */}
        <circle cx={BASE.x} cy={BASE.y} r={L1 + L2} fill="none" className="stroke-rule" strokeDasharray="2 6" />
        <text x={BASE.x + (L1 + L2) * 0.72} y={BASE.y - (L1 + L2) * 0.72 - 8} className="fill-ink-muted font-mono text-[10px]">
          R{L1 + L2} ENVELOPE
        </text>

        {/* Ground + pedestal */}
        <g className="stroke-ink" fill="none" strokeWidth="1.25">
          <line x1="30" y1="392" x2="490" y2="392" className="draw-in" style={{ ["--len" as string]: 460 }} />
          <rect x="30" y="392" width="460" height="14" fill="url(#hatch)" stroke="none" />
          <path d={`M${BASE.x - 48} 392 L${BASE.x - 30} ${BASE.y + 10} H${BASE.x + 30} L${BASE.x + 48} 392`} className="draw-in fill-paper" style={{ ["--len" as string]: 220 }} />
        </g>

        {/* Reference axis + θ1 arc */}
        <line x1={BASE.x} y1={BASE.y} x2={BASE.x + 90} y2={BASE.y} className="stroke-rule-strong" strokeDasharray="4 4" />
        <path d={arcPath(BASE, 58, 0, pose.shoulder)} fill="none" className="stroke-accent" strokeWidth="1.25" />
        <text x={BASE.x + 64} y={BASE.y - 10} className="fill-accent font-mono text-[11px]">θ₁</text>

        {/* Links drawn as outlined capsules: thick ink stroke under a slightly thinner paper stroke. */}
        <Link from={BASE} to={elbowPos} width={26} />
        <Link from={elbowPos} to={wristPos} width={20} />

        {/* Center lines (chain line) */}
        <g className="stroke-rule-strong" strokeWidth="0.75" strokeDasharray="14 3 2 3">
          <line x1={BASE.x} y1={BASE.y} x2={elbowPos.x} y2={elbowPos.y} />
          <line x1={elbowPos.x} y1={elbowPos.y} x2={wristPos.x} y2={wristPos.y} />
        </g>

        {/* θ2 arc at the elbow */}
        <path d={arcPath(elbowPos, 36, pose.shoulder, heading)} fill="none" className="stroke-accent" strokeWidth="1.25" />

        {/* L1 dimension */}
        <g className="stroke-ink-muted" strokeWidth="0.75">
          <line x1={BASE.x} y1={BASE.y} x2={t1.x} y2={t1.y} />
          <line x1={elbowPos.x} y1={elbowPos.y} x2={t2.x} y2={t2.y} />
          <line x1={d1.x} y1={d1.y} x2={d2.x} y2={d2.y} markerStart="url(#arr)" markerEnd="url(#arr)" />
        </g>
        <text
          x={dimMid.x}
          y={dimMid.y}
          textAnchor="middle"
          dominantBaseline="middle"
          transform={`rotate(${dimAngle} ${dimMid.x} ${dimMid.y})`}
          className="fill-ink-muted font-mono text-[10px]"
        >
          L₁ {L1}
        </text>

        {/* Gripper */}
        <g transform={`translate(${wristPos.x} ${wristPos.y}) rotate(${deg(heading)})`} className="stroke-ink" strokeWidth="1.25" fill="none">
          <path d="M4 -12 H22 L30 -5 M4 12 H22 L30 5" />
          <line x1="4" y1="-12" x2="4" y2="12" />
        </g>

        <Joint at={BASE} r={13} />
        <Joint at={elbowPos} r={11} />
        <Joint at={wristPos} r={7} />

        {/* Target crosshair */}
        <g transform={`translate(${target.x} ${target.y})`} className={pose.steering ? "stroke-accent" : "stroke-rule-strong"} strokeWidth="1">
          <circle r="9" fill="none" />
          <line x1="-15" x2="15" />
          <line y1="-15" y2="15" />
        </g>
        {!pose.reachable && (
          <line x1={wristPos.x} y1={wristPos.y} x2={target.x} y2={target.y} className="stroke-accent" strokeDasharray="3 4" />
        )}
      </svg>

      {/* Live readout — decorative; the drawing's <title> describes it for screen readers. */}
      <figcaption aria-hidden="true" className="annot mt-2 flex flex-wrap gap-x-5 gap-y-1 tabular-nums">
        <span>θ₁ <span className="inline-block w-[6ch] text-right text-ink">{fmt(theta1)}°</span></span>
        <span>θ₂ <span className="inline-block w-[6ch] text-right text-ink">{fmt(theta2)}°</span></span>
        <span>x <span className="inline-block w-[4ch] text-right text-ink">{Math.round(wristPos.x - BASE.x)}</span></span>
        <span>y <span className="inline-block w-[4ch] text-right text-ink">{Math.round(BASE.y - wristPos.y)}</span></span>
        <span className={pose.reachable ? "" : "text-accent"}>{pose.reachable ? (pose.steering ? "tracking" : "idle") : "out of reach"}</span>
      </figcaption>
    </figure>
  );
}

const round = (n: number) => Math.round(n * 100) / 100;
/** Normalize an angle into (-π, π] so readouts never show 400°+. */
const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));
const roundVec = (v: Vec): Vec => ({ x: round(v.x), y: round(v.y) });
const fmt = (n: number) => (n <= -0.05 ? "−" : "") + Math.abs(n).toFixed(1);

function Link({ from, to, width }: { from: Vec; to: Vec; width: number }) {
  return (
    <g strokeLinecap="round">
      <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} className="stroke-ink" strokeWidth={width} />
      <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} className="stroke-paper" strokeWidth={width - 2.5} />
    </g>
  );
}

function Joint({ at, r }: { at: Vec; r: number }) {
  return (
    <g>
      <circle cx={at.x} cy={at.y} r={r} className="fill-paper stroke-ink" strokeWidth="1.25" />
      <circle cx={at.x} cy={at.y} r={Math.max(2, r * 0.25)} className="fill-ink" />
    </g>
  );
}

/** SVG arc around `c` from angle a0 to a1 (radians, screen space), short way. */
function arcPath(c: Vec, r: number, a0: number, a1: number) {
  const delta = angleDelta(a0, a1);
  const start = { x: c.x + r * Math.cos(a0), y: c.y + r * Math.sin(a0) };
  const end = { x: c.x + r * Math.cos(a0 + delta), y: c.y + r * Math.sin(a0 + delta) };
  return `M${round(start.x)} ${round(start.y)} A${r} ${r} 0 0 ${delta > 0 ? 1 : 0} ${round(end.x)} ${round(end.y)}`;
}
