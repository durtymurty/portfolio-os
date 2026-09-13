import "server-only";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { imageSize } from "image-size";
import type { Project } from "../data";
import { isImageFile, parseCaptions, sortFiles, type Figure } from "./figures";

export const workDir = (slug: string) => path.join(process.cwd(), "public", "work", slug);

/**
 * Photos for a case study, read from public/work/[slug]/ at build time (and on
 * every request in `next dev`). Dropping files into the folder is all it takes —
 * no code changes.
 */
export function getProjectFigures(project: Project): Figure[] {
  const dir = workDir(project.slug);
  if (!existsSync(dir)) return [];

  const captionsPath = path.join(dir, "captions.json");
  const captions = parseCaptions(existsSync(captionsPath) ? readFileSync(captionsPath, "utf8") : null);

  return sortFiles(readdirSync(dir).filter(isImageFile)).flatMap((file, i) => {
    try {
      const { width, height } = imageSize(readFileSync(path.join(dir, file)));
      if (!width || !height) return [];
      const meta = captions[file] ?? {};
      return [
        {
          src: `/work/${project.slug}/${encodeURIComponent(file)}`,
          width,
          height,
          alt: meta.alt ?? meta.caption ?? `${project.name} — figure ${i + 1}`,
          caption: meta.caption,
        },
      ];
    } catch {
      console.warn(`[figures] Skipping unreadable image: public/work/${project.slug}/${file}`);
      return [];
    }
  });
}
