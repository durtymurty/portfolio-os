import Link from "next/link";
import { PROJECTS, type Project } from "../../data";
import { caseStudyHref, partNumber } from "../../lib/projects";
import SectionHeader from "./SectionHeader";
import WorkFilter from "./WorkFilter";

export default function WorkSection() {
  const counts = {
    all: PROJECTS.length,
    hardware: PROJECTS.filter((p) => p.kind === "hardware").length,
    software: PROJECTS.filter((p) => p.kind === "software").length,
  };

  return (
    <section aria-labelledby="work" className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
      <SectionHeader id="work" number="01" title="Selected work" subtitle="Parts list" sheet="2 / 5" />
      <WorkFilter counts={counts}>
        <ol className="grid gap-6 md:grid-cols-2">
          {PROJECTS.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </ol>
      </WorkFilter>
    </section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const titleId = `prj-${project.slug}`;
  return (
    <li data-kind={project.kind}>
      <article aria-labelledby={titleId} className="crop flex h-full flex-col border border-rule bg-paper-raised p-6">
        <header className="annot mb-4 flex items-center justify-between gap-3">
          <span className="text-accent">{partNumber(project.slug)}</span>
          <span>{project.kind}</span>
        </header>

        <h3 id={titleId} className="text-xl font-semibold tracking-tight">{project.name}</h3>
        {(project.org || project.period) && (
          <p className="mt-1 text-sm text-ink-muted">
            {[project.role, project.org, project.period].filter(Boolean).join(" · ")}
          </p>
        )}

        {project.highlight && (
          <p className="mt-3 inline-flex w-fit items-center gap-2 border border-accent/40 bg-accent-soft px-2 py-1 font-mono text-xs text-accent">
            <span aria-hidden="true">★</span> {project.highlight}
          </p>
        )}

        <p className="mt-4 leading-relaxed text-ink-muted">{project.description}</p>

        {project.details && project.details.length > 0 && (
          <ul className="mt-4 space-y-1.5 text-sm">
            {project.details.map((d) => (
              <li key={d} className="flex gap-2.5">
                <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 bg-accent" />
                {d}
              </li>
            ))}
          </ul>
        )}

        {/* Bill of materials */}
        <div className="mt-auto pt-6">
          <p className="annot mb-2 text-[10px]">Built with</p>
          <ul className="flex flex-wrap gap-1.5">
            {project.tech.map((t) => (
              <li key={t} className="border border-rule px-2 py-0.5 font-mono text-xs">{t}</li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium">
            {project.caseStudy && (
              <Link href={caseStudyHref(project.slug)} className="inline-flex items-center gap-2 link-ink">
                Read case study <span aria-hidden="true" className="font-mono">→</span>
                <span className="sr-only">: {project.name}</span>
              </Link>
            )}
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 link-ink">
                Source on GitHub <span aria-hidden="true" className="font-mono">↗</span>
                <span className="sr-only"> for {project.name} (opens in a new tab)</span>
              </a>
            )}
          </div>
        </div>
      </article>
    </li>
  );
}
