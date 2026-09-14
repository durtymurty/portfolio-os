import { PROJECTS } from "../data";

/** Stable drawing-style part number from a project's position in PROJECTS: "PRJ-001". */
export function partNumber(slug: string): string {
  const i = PROJECTS.findIndex((p) => p.slug === slug);
  return `PRJ-${String(i + 1).padStart(3, "0")}`;
}

export const caseStudyHref = (slug: string) => `/work/${slug}`;
