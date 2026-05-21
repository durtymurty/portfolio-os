import { PROJECTS } from "../../data";

export default function ProjectsApp() {
  return (
    <div style={{ color: "#c9d1d9", display: "flex", flexDirection: "column", gap: "16px" }}>
      <h1 style={{ fontSize: "20px", fontWeight: "700", color: "#f0f6fc" }}>Projects</h1>
      {PROJECTS.map(project => (
        <div key={project.name} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${project.color}30`, borderRadius: "12px", padding: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <span style={{ fontSize: "24px" }}>{project.emoji}</span>
            <h2 style={{ fontSize: "16px", fontWeight: "600", color: project.color }}>{project.name}</h2>
          </div>
          <p style={{ fontSize: "13px", color: "#8b949e", lineHeight: "1.6", marginBottom: "12px" }}>{project.description}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "12px" }}>
            {project.tech.map(t => (
              <span key={t} style={{ background: `${project.color}15`, border: `1px solid ${project.color}30`, color: project.color, borderRadius: "4px", padding: "2px 8px", fontSize: "11px" }}>{t}</span>
            ))}
          </div>
          <a href={project.github} target="_blank" rel="noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#58a6ff", textDecoration: "none", padding: "6px 12px", background: "rgba(88,166,255,0.1)", border: "1px solid rgba(88,166,255,0.2)", borderRadius: "6px" }}
          >
            🐙 View on GitHub
          </a>
        </div>
      ))}
    </div>
  );
}