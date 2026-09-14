"use client";

import { useEffect, useRef } from "react";
import { angleDelta, forwardKinematics, solveIK, toDegrees, type Vec } from "../../lib/ik";

const W = 520;
const H = 440;
const BASE: Vec = { x: 190, y: 350 };
const L1 = 150;
const L2 = 125;
const IDLE_AFTER_MS = 2500;
/** Short blend when the pointer takes over, longer when the arm returns to its idle loop. */
const HANDOFF_TO_POINTER_MS = 120;
const HANDOFF_TO_IDLE_MS = 700;

/** Slow figure-eight the arm traces when nobody is steering it. */
const idleTarget = (t: number): Vec => ({
  x: BASE.x + 150 + 70 * Math.cos(t * 0.45),
  y: BASE.y - 150 + 55 * Math.sin(t * 0.9),
});

interface Pose {
  shoulder: number;
  elbow: number;
  target: Vec;
  reachable: boolean;
  steering: boolean;
}

const INITIAL_SOLUTION = solveIK(BASE, idleTarget(0), L1, L2);
const INITIAL_POSE: Pose = {
  shoulder: INITIAL_SOLUTION.shoulder,
  elbow: INITIAL_SOLUTION.elbow,
  target: idleTarget(0),
  reachable: true,
  steering: false,
};

/**
 * Everything pose-dependent, as ready-to-write attribute values. Used once for the
 * server/initial React render and then every animation frame for direct DOM updates.
 * Values are rounded so Node and browsers produce identical strings (no hydration mismatch).
 */
function geometry({ shoulder, elbow, target, reachable, steering }: Pose) {
  const fk = forwardKinematics(BASE, shoulder, elbow, L1, L2);
  const e = roundVec(fk.elbowPos);
  const w = roundVec(fk.wristPos);
  const t = roundVec(target);
  const heading = shoulder + elbow;

  // L1 dimension line, offset perpendicular to the upper link.
  const nx = -Math.sin(shoulder);
  const ny = Math.cos(shoulder);
  const d1 = roundVec({ x: BASE.x + nx * 34, y: BASE.y + ny * 34 });
  const d2 = roundVec({ x: e.x + nx * 34, y: e.y + ny * 34 });
  const mid = roundVec({ x: (d1.x + d2.x) / 2 + nx * 12, y: (d1.y + d2.y) / 2 + ny * 12 });
  let dimAngle = round(toDegrees(shoulder));
  if (dimAngle > 90 || dimAngle < -90) dimAngle += 180; // keep label upright

  return {
    elbow: e,
    wrist: w,
    target: t,
    arc1: arcPath(BASE, 58, 0, shoulder),
    arc2: arcPath(e, 36, shoulder, heading),
    ext1: roundVec({ x: d1.x + nx * 6, y: d1.y + ny * 6 }),
    ext2: roundVec({ x: d2.x + nx * 6, y: d2.y + ny * 6 }),
    d1,
    d2,
    dimText: { x: mid.x, y: mid.y, transform: `rotate(${dimAngle} ${mid.x} ${mid.y})` },
    gripper: `translate(${w.x} ${w.y}) rotate(${round(toDegrees(heading))})`,
    crosshair: `translate(${t.x} ${t.y})`,
    steering,
    reachable,
    readout: {
      theta1: `${fmt(-toDegrees(shoulder))}°`, // counter-clockwise-positive, like a textbook
      theta2: `${fmt(-toDegrees(elbow))}°`,
      x: String(Math.round(w.x - BASE.x)),
      y: String(Math.round(BASE.y - w.y)),
      status: reachable ? (steering ? "tracking" : "idle") : "out of reach",
    },
  };
}

type Geometry = ReturnType<typeof geometry>;

export default function RobotArm() {
  const figureRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const figure = figureRef.current;
    const svg = figure?.querySelector("svg");
    if (!figure || !svg) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Collect the pose-dependent nodes once; frames then write attributes directly,
    // skipping React reconciliation entirely.
    const nodes = new Map<string, Element[]>();
    figure.querySelectorAll("[data-k]").forEach((el) => {
      const k = el.getAttribute("data-k")!;
      nodes.set(k, [...(nodes.get(k) ?? []), el]);
    });
    const set = (k: string, attrs: Record<string, string | number>) => {
      for (const el of nodes.get(k) ?? []) {
        for (const [name, value] of Object.entries(attrs)) {
          const v = String(value);
          if (el.getAttribute(name) !== v) el.setAttribute(name, v);
        }
      }
    };
    const text = (k: string, value: string) => {
      for (const el of nodes.get(k) ?? []) if (el.textContent !== value) el.textContent = value;
    };
    const line = (a: Vec, b: Vec) => ({ x1: a.x, y1: a.y, x2: b.x, y2: b.y });

    const apply = (g: Geometry) => {
      set("link1", line(BASE, g.elbow));
      set("link2", line(g.elbow, g.wrist));
      set("arc1", { d: g.arc1 });
      set("arc2", { d: g.arc2 });
      set("ext1", line(BASE, g.ext1));
      set("ext2", line(g.elbow, g.ext2));
      set("dim", line(g.d1, g.d2));
      set("dimText", g.dimText);
      set("gripper", { transform: g.gripper });
      set("elbow", { cx: g.elbow.x, cy: g.elbow.y });
      set("wrist", { cx: g.wrist.x, cy: g.wrist.y });
      set("crosshair", { transform: g.crosshair, class: g.steering ? "stroke-accent" : "stroke-rule-strong" });
      set("leader", { ...line(g.wrist, g.target), visibility: g.reachable ? "hidden" : "visible" });
      text("theta1", g.readout.theta1);
      text("theta2", g.readout.theta2);
      text("x", g.readout.x);
      text("y", g.readout.y);
      text("status", g.readout.status);
      set("status", { class: g.reachable ? "" : "text-accent" });
    };

    // Latest raw pointer position; converted to SVG space once per frame (not per event),
    // with the layout read happening before any DOM writes in that frame.
    let pointer: { clientX: number; clientY: number; at: number } | null = null;
    const displayed = { shoulder: INITIAL_POSE.shoulder, elbow: INITIAL_POSE.elbow };
    const handoff = { steering: false, start: 0, duration: 0, offShoulder: 0, offElbow: 0 };
    let raf = 0;
    let visible = false;

    const frame = (now: number) => {
      raf = 0;
      const steering = !!pointer && now - pointer.at < IDLE_AFTER_MS;
      let target: Vec;
      if (steering) {
        const ctm = svg.getScreenCTM();
        if (!ctm) return;
        const p = new DOMPoint(pointer!.clientX, pointer!.clientY).matrixTransform(ctm.inverse());
        target = { x: p.x, y: p.y };
      } else {
        target = idleTarget(now / 1000);
      }

      // Exact IK for the current target — no easing toward it, so fast input never trails.
      const goal = solveIK(BASE, target, L1, L2);

      // Mode changes (pointer takes over / arm goes idle) blend out the jump with a decaying
      // joint-space offset. The pose still follows the live goal during the blend.
      if (steering !== handoff.steering) {
        handoff.steering = steering;
        handoff.start = now;
        handoff.duration = reduceMotion ? 0 : steering ? HANDOFF_TO_POINTER_MS : HANDOFF_TO_IDLE_MS;
        handoff.offShoulder = angleDelta(goal.shoulder, displayed.shoulder);
        handoff.offElbow = angleDelta(goal.elbow, displayed.elbow);
      }
      const progress = handoff.duration ? Math.min(1, (now - handoff.start) / handoff.duration) : 1;
      const remaining = (1 - progress) ** 3; // ease-out

      displayed.shoulder = wrap(goal.shoulder + handoff.offShoulder * remaining);
      displayed.elbow = wrap(goal.elbow + handoff.offElbow * remaining);

      apply(geometry({ ...displayed, target, reachable: goal.reachable, steering }));

      // Idle animation needs a continuous loop; under reduced motion we only draw on input.
      if (visible && !reduceMotion) raf = requestAnimationFrame(frame);
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const onPointerMove = (e: PointerEvent) => {
      pointer = { clientX: e.clientX, clientY: e.clientY, at: performance.now() };
      if (reduceMotion && visible) schedule();
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !reduceMotion) schedule();
      else if (!visible && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    });
    observer.observe(svg);
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      observer.disconnect();
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  // Initial (server + hydration) render. After mount, the effect above owns every
  // pose-dependent attribute; this component never re-renders on its own.
  const g = geometry(INITIAL_POSE);

  return (
    <figure ref={figureRef} className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full touch-pan-y select-none" role="img" aria-labelledby="arm-title">
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
        <path data-k="arc1" d={g.arc1} fill="none" className="stroke-accent" strokeWidth="1.25" />
        <text x={BASE.x + 64} y={BASE.y - 10} className="fill-accent font-mono text-[11px]">θ₁</text>

        {/* Links drawn as outlined capsules: thick ink stroke under a slightly thinner paper stroke. */}
        <g strokeLinecap="round">
          <line data-k="link1" x1={BASE.x} y1={BASE.y} x2={g.elbow.x} y2={g.elbow.y} className="stroke-ink" strokeWidth={26} />
          <line data-k="link1" x1={BASE.x} y1={BASE.y} x2={g.elbow.x} y2={g.elbow.y} className="stroke-paper" strokeWidth={23.5} />
          <line data-k="link2" x1={g.elbow.x} y1={g.elbow.y} x2={g.wrist.x} y2={g.wrist.y} className="stroke-ink" strokeWidth={20} />
          <line data-k="link2" x1={g.elbow.x} y1={g.elbow.y} x2={g.wrist.x} y2={g.wrist.y} className="stroke-paper" strokeWidth={17.5} />
        </g>

        {/* Center lines (chain line) */}
        <g className="stroke-rule-strong" strokeWidth="0.75" strokeDasharray="14 3 2 3">
          <line data-k="link1" x1={BASE.x} y1={BASE.y} x2={g.elbow.x} y2={g.elbow.y} />
          <line data-k="link2" x1={g.elbow.x} y1={g.elbow.y} x2={g.wrist.x} y2={g.wrist.y} />
        </g>

        {/* θ2 arc at the elbow */}
        <path data-k="arc2" d={g.arc2} fill="none" className="stroke-accent" strokeWidth="1.25" />

        {/* L1 dimension */}
        <g className="stroke-ink-muted" strokeWidth="0.75">
          <line data-k="ext1" x1={BASE.x} y1={BASE.y} x2={g.ext1.x} y2={g.ext1.y} />
          <line data-k="ext2" x1={g.elbow.x} y1={g.elbow.y} x2={g.ext2.x} y2={g.ext2.y} />
          <line data-k="dim" x1={g.d1.x} y1={g.d1.y} x2={g.d2.x} y2={g.d2.y} markerStart="url(#arr)" markerEnd="url(#arr)" />
        </g>
        <text
          data-k="dimText"
          x={g.dimText.x}
          y={g.dimText.y}
          textAnchor="middle"
          dominantBaseline="middle"
          transform={g.dimText.transform}
          className="fill-ink-muted font-mono text-[10px]"
        >
          L₁ {L1}
        </text>

        {/* Gripper */}
        <g data-k="gripper" transform={g.gripper} className="stroke-ink" strokeWidth="1.25" fill="none">
          <path d="M4 -12 H22 L30 -5 M4 12 H22 L30 5" />
          <line x1="4" y1="-12" x2="4" y2="12" />
        </g>

        {/* Joints: base is fixed; elbow and wrist move. */}
        <circle cx={BASE.x} cy={BASE.y} r={13} className="fill-paper stroke-ink" strokeWidth="1.25" />
        <circle cx={BASE.x} cy={BASE.y} r={3.25} className="fill-ink" />
        <circle data-k="elbow" cx={g.elbow.x} cy={g.elbow.y} r={11} className="fill-paper stroke-ink" strokeWidth="1.25" />
        <circle data-k="elbow" cx={g.elbow.x} cy={g.elbow.y} r={2.75} className="fill-ink" />
        <circle data-k="wrist" cx={g.wrist.x} cy={g.wrist.y} r={7} className="fill-paper stroke-ink" strokeWidth="1.25" />
        <circle data-k="wrist" cx={g.wrist.x} cy={g.wrist.y} r={2} className="fill-ink" />

        {/* Target crosshair + out-of-reach leader */}
        <g data-k="crosshair" transform={g.crosshair} className="stroke-rule-strong" strokeWidth="1">
          <circle r="9" fill="none" />
          <line x1="-15" x2="15" />
          <line y1="-15" y2="15" />
        </g>
        <line
          data-k="leader"
          x1={g.wrist.x}
          y1={g.wrist.y}
          x2={g.target.x}
          y2={g.target.y}
          visibility="hidden"
          className="stroke-accent"
          strokeDasharray="3 4"
        />
      </svg>

      {/* Live readout — decorative; the drawing's <title> describes it for screen readers. */}
      <figcaption aria-hidden="true" className="annot mt-2 flex flex-wrap gap-x-5 gap-y-1 tabular-nums">
        <span>θ₁ <span data-k="theta1" className="inline-block w-[6ch] text-right text-ink">{g.readout.theta1}</span></span>
        <span>θ₂ <span data-k="theta2" className="inline-block w-[6ch] text-right text-ink">{g.readout.theta2}</span></span>
        <span>x <span data-k="x" className="inline-block w-[4ch] text-right text-ink">{g.readout.x}</span></span>
        <span>y <span data-k="y" className="inline-block w-[4ch] text-right text-ink">{g.readout.y}</span></span>
        <span data-k="status">{g.readout.status}</span>
      </figcaption>
    </figure>
  );
}

const round = (n: number) => Math.round(n * 100) / 100;
/** Normalize an angle into (-π, π] so readouts never show 400°+. */
const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));
const roundVec = (v: Vec): Vec => ({ x: round(v.x), y: round(v.y) });
const fmt = (n: number) => (n <= -0.05 ? "−" : "") + Math.abs(n).toFixed(1);

/** SVG arc around `c` from angle a0 to a1 (radians, screen space), short way. */
function arcPath(c: Vec, r: number, a0: number, a1: number) {
  const delta = angleDelta(a0, a1);
  const start = { x: c.x + r * Math.cos(a0), y: c.y + r * Math.sin(a0) };
  const end = { x: c.x + r * Math.cos(a0 + delta), y: c.y + r * Math.sin(a0 + delta) };
  return `M${round(start.x)} ${round(start.y)} A${r} ${r} 0 0 ${delta > 0 ? 1 : 0} ${round(end.x)} ${round(end.y)}`;
}
