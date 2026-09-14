import { ImageResponse } from "next/og";
import { EDUCATION, PROFILE } from "../data";

export const OG_SIZE = { width: 1200, height: 630 };

const PAPER = "#f3f1ea";
const INK = "#141922";
const MUTED = "#505866";
const RULE = "#8f8a7c";
const ACCENT = "#c2410c";

/** Shared drawing-sheet social card used by the homepage and case studies. */
export function renderOgCard({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  const edu = EDUCATION[0];
  const cells: [string, string][] = [
    ["Drawn by", PROFILE.name],
    ["Institution", edu.school],
    ["Discipline", edu.degree],
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          padding: 28,
          background: PAPER,
          backgroundImage: `linear-gradient(rgba(20,25,34,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(20,25,34,0.06) 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
          color: INK,
        }}
      >
        <div style={{ flex: 1, display: "flex", flexDirection: "column", border: `2px solid ${INK}`, padding: "56px 64px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 24, color: MUTED, letterSpacing: 4, textTransform: "uppercase" }}>
            <div style={{ width: 48, height: 3, background: ACCENT }} />
            {eyebrow}
          </div>
          <div style={{ display: "flex", fontSize: title.length > 26 ? 76 : 92, fontWeight: 700, marginTop: 28, lineHeight: 1.02, letterSpacing: -2 }}>
            {title}
          </div>
          <div style={{ display: "flex", fontSize: 32, color: MUTED, marginTop: 24, maxWidth: 900 }}>{subtitle}</div>

          <div style={{ display: "flex", marginTop: "auto", marginLeft: -64, marginRight: -64, borderTop: `2px solid ${INK}` }}>
            {cells.map(([label, value], i) => (
              <div
                key={label}
                style={{ display: "flex", flexDirection: "column", flex: 1, padding: "14px 24px", borderLeft: i ? `2px solid ${RULE}` : "none" }}
              >
                <div style={{ fontSize: 16, color: MUTED, letterSpacing: 3, textTransform: "uppercase" }}>{label}</div>
                <div style={{ fontSize: 26, marginTop: 4 }}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
