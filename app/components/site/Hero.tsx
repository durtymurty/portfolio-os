import { EDUCATION, PROFILE, displayUrl } from "../../data";
import { getResume } from "../../lib/resume";
import RobotArm from "./RobotArm";

export default function Hero() {
  const resume = getResume();
  const edu = EDUCATION[0];
  const gradYear = edu.period.split(/[–-]/).pop()?.trim();

  const titleBlock = [
    ["Name", PROFILE.name],
    ["Discipline", edu.degree],
    ["Institution", edu.school],
    ["Class of", gradYear],
    ["Location", PROFILE.location],
  ];

  return (
    <section aria-labelledby="hero-title" className="relative mx-auto max-w-6xl px-5 pt-10 pb-16 md:px-8 md:pt-16 md:pb-24">
      {/* Drawing-sheet zone markers */}
      <div aria-hidden="true" className="annot pointer-events-none absolute inset-x-5 top-3 hidden justify-between md:inset-x-8 md:flex">
        {["1", "2", "3", "4", "5", "6"].map((z) => <span key={z}>{z}</span>)}
      </div>

      <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-8">
        <div>
          <p className="annot mb-5 flex items-center gap-3">
            <span className="inline-block h-px w-8 bg-accent" aria-hidden="true" />
            Dwg. MB-{gradYear} · Portfolio
          </p>

          <h1 id="hero-title" className="text-[2.75rem] leading-[1.02] font-semibold tracking-tight text-balance md:text-7xl">
            {PROFILE.name}
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-muted md:text-xl">
            Computer Engineering student at Cal Poly SLO. I build where hardware meets software —{" "}
            <span className="text-ink">carbon-fiber race car parts</span>, <span className="text-ink">competition robots</span>, and{" "}
            <span className="text-ink">AI tools</span>.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#work"
              className="inline-flex h-11 items-center gap-2 rounded-sm bg-ink px-5 font-medium text-paper transition-colors hover:bg-accent"
            >
              See my work <span aria-hidden="true" className="font-mono">↓</span>
            </a>
            <a
              href={resume.href}
              {...(resume.isFile ? { target: "_blank", rel: "noopener" } : {})}
              className="inline-flex h-11 items-center gap-2 rounded-sm border border-ink px-5 font-medium transition-colors hover:border-accent hover:text-accent"
            >
              {resume.isFile ? "Download resume" : "Request resume"}
              {resume.isFile && <span className="sr-only"> (PDF)</span>}
            </a>
            <a
              href={`mailto:${PROFILE.email}`}
              className="inline-flex h-11 items-center font-medium link-ink sm:ml-2"
            >
              {PROFILE.email}
            </a>
          </div>

          {/* Title block */}
          <dl className="mt-10 grid max-w-xl grid-cols-2 border-t border-l border-rule-strong text-sm sm:grid-cols-3">
            {titleBlock.map(([label, value]) => (
              <div key={label} className="border-r border-b border-rule-strong px-3 py-2">
                <dt className="annot text-[10px]">{label}</dt>
                <dd className="mt-0.5 font-medium">{value}</dd>
              </div>
            ))}
            <div className="border-r border-b border-rule-strong px-3 py-2">
              <dt className="annot text-[10px]">Elsewhere</dt>
              <dd className="mt-0.5 flex gap-3 font-medium">
                <a href={PROFILE.links.github} target="_blank" rel="noopener noreferrer" className="link-ink">
                  GitHub<span className="sr-only"> ({displayUrl(PROFILE.links.github)}, opens in a new tab)</span>
                </a>
                <a href={PROFILE.links.linkedin} target="_blank" rel="noopener noreferrer" className="link-ink">
                  LinkedIn<span className="sr-only"> (opens in a new tab)</span>
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <div className="crop border border-rule bg-paper-raised/60 p-4 md:p-6">
          <div className="annot mb-2 flex justify-between">
            <span>Detail A — 2-DOF arm</span>
            <span className="hidden sm:inline">Move your cursor</span>
          </div>
          <RobotArm />
        </div>
      </div>
    </section>
  );
}
