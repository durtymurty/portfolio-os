import { PROFILE } from "./data";
import { OG_SIZE, renderOgCard } from "./lib/og";

export const alt = `${PROFILE.name} — Computer Engineering portfolio`;
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OpengraphImage() {
  return renderOgCard({
    eyebrow: "Portfolio",
    title: PROFILE.name,
    subtitle: "Carbon-fiber race car parts, competition robots, and AI tools.",
  });
}
