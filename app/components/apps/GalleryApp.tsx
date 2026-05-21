import { PROJECTS } from "../../data";

export default function GalleryApp() {
  return (
    <div style={{ color: "#c9d1d9", display: "flex", flexDirection: "column", gap: "16px" }}>
      <h1 style={{ fontSize: "20px", fontWeight: "700", color: "#f0f6fc" }}>Project Gallery</h1>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        {PROJECTS.map(project => (
          <div key={project.name} style={{ background: `linear-gradient(135deg, ${project.color}20, ${project.color}05)`, border: `1px solid ${project.color}30`, borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", gap: "10px", aspectRatio: "4/3", justifyContent: "space-between" }}>
            <div style={{ fontSize: "48px", textAlign: "center" }}>{project.emoji}</div>
            <div>
              <p style={{ fontSize: "14px", fontWeight: "600", color: project.color }}>{project.name}</p>
              <p style={{ fontSize: "11px", color: "#8b949e", marginTop: "4px", lineHeight: "1.4" }}>{project.tech.join(" · ")}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}