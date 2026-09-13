import { PROJECTS } from "../../data";
import { AppTitle, ExternalLink, Icon } from "../ui";

export default function GalleryApp() {
  return (
    <div className="flex flex-col gap-4">
      <AppTitle>Project Gallery</AppTitle>
      <ul className="grid grid-cols-1 gap-3 @md:grid-cols-2">
        {PROJECTS.map((project) => (
          <li key={project.slug}>
            <ExternalLink
              href={project.github}
              className="flex aspect-[4/3] flex-col justify-between gap-2.5 rounded-xl border p-5 transition-transform hover:-translate-y-0.5"
              style={{
                background: `linear-gradient(135deg, ${project.color}20, ${project.color}05)`,
                borderColor: `${project.color}30`,
              }}
            >
              <Icon className="text-center text-5xl">{project.emoji}</Icon>
              <span className="block">
                <span className="block text-sm font-semibold" style={{ color: project.color }}>{project.name}</span>
                <span className="mt-1 block text-[11px] leading-snug text-fg-muted">{project.tech.join(" · ")}</span>
              </span>
            </ExternalLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
