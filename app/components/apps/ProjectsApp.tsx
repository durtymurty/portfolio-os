import { PROJECTS } from "../../data";
import { AppTitle, buttonClass, ExternalLink, Icon, Tag } from "../ui";

export default function ProjectsApp() {
  return (
    <div className="flex flex-col gap-4">
      <AppTitle>Projects</AppTitle>
      <ul className="flex flex-col gap-4">
        {PROJECTS.map((project) => (
          <li
            key={project.slug}
            className="rounded-xl border bg-raised p-4"
            style={{ borderColor: `${project.color}30` }}
          >
            <div className="mb-2 flex flex-wrap items-center gap-2.5">
              <Icon className="text-2xl">{project.emoji}</Icon>
              <h3 className="text-base font-semibold" style={{ color: project.color }}>{project.name}</h3>
              {project.highlight && (
                <span className="rounded-full border border-[#e3b341]/30 bg-[#e3b341]/10 px-2 py-0.5 text-[11px] text-[#e3b341]">
                  <Icon>🏆</Icon> {project.highlight}
                </span>
              )}
            </div>
            <p className="mb-3 text-[13px] leading-relaxed text-fg-muted">{project.description}</p>
            <ul aria-label="Tech stack" className="mb-3 flex flex-wrap gap-1.5">
              {project.tech.map((t) => (
                <li key={t}><Tag color={project.color}>{t}</Tag></li>
              ))}
            </ul>
            {project.github && (
              <ExternalLink href={project.github} className={buttonClass}>
                <Icon>🐙</Icon> View {project.name} on GitHub
              </ExternalLink>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
