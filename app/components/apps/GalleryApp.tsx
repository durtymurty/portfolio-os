import { PROJECTS } from "../../data";
import { AppTitle, ExternalLink, Icon } from "../ui";

const tileClass =
  "flex aspect-[4/3] flex-col justify-between gap-2.5 rounded-xl border p-5 transition-transform hover:-translate-y-0.5";

export default function GalleryApp() {
  return (
    <div className="flex flex-col gap-4">
      <AppTitle>Project Gallery</AppTitle>
      <ul className="grid grid-cols-1 gap-3 @md:grid-cols-2">
        {PROJECTS.map((project) => {
          const style = {
            background: `linear-gradient(135deg, ${project.color}20, ${project.color}05)`,
            borderColor: `${project.color}30`,
          };
          const body = (
            <>
              <Icon className="text-center text-5xl">{project.emoji}</Icon>
              <span className="block">
                <span className="block text-sm font-semibold" style={{ color: project.color }}>{project.name}</span>
                <span className="mt-1 block text-[11px] leading-snug text-fg-muted">{project.tech.join(" · ")}</span>
              </span>
            </>
          );
          return (
            <li key={project.slug}>
              {project.github ? (
                <ExternalLink href={project.github} className={tileClass} style={style}>{body}</ExternalLink>
              ) : (
                <div className={tileClass} style={style}>{body}</div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
