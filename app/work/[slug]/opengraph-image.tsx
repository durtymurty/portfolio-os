import { PROFILE, PROJECTS } from "../../data";
import { OG_SIZE, renderOgCard } from "../../lib/og";
import { partNumber } from "../../lib/projects";

export const alt = `Case study by ${PROFILE.name}`;
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return PROJECTS.filter((p) => p.caseStudy).map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  return renderOgCard({
    eyebrow: project ? `${partNumber(project.slug)} · Case study` : "Case study",
    title: project?.name ?? "Case study",
    subtitle: project ? [project.role, project.org].filter(Boolean).join(" · ") : "",
  });
}
