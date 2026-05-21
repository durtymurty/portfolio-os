import { EXPERIENCE, CERTIFICATIONS } from "../../data";

export default function ResumeApp() {
  return (
    <div style={{ color: "#c9d1d9", display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontSize: "20px", fontWeight: "700", color: "#f0f6fc" }}>Resume</h1>
        <a href="mailto:murtazab2007@gmail.com"
          style={{ fontSize: "12px", color: "#58a6ff", textDecoration: "none", padding: "6px 12px", background: "rgba(88,166,255,0.1)", border: "1px solid rgba(88,166,255,0.2)", borderRadius: "6px" }}
        >
          📧 Request Full Resume
        </a>
      </div>

      <div>
        <h2 style={{ fontSize: "13px", fontWeight: "600", color: "#58a6ff", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>Education</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {[
            { school: "Cal Poly SLO", degree: "B.S. Computer Engineering", period: "2025 – 2029" },
            { school: "Bellevue College", degree: "Running Start", period: "2024 – 2025" },
            { school: "Central Washington University", degree: "Running Start", period: "2023 – 2024" },
          ].map(edu => (
            <div key={edu.school} style={{ padding: "12px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontSize: "14px", fontWeight: "600", color: "#f0f6fc" }}>{edu.school}</p>
                <p style={{ fontSize: "12px", color: "#8b949e" }}>{edu.degree}</p>
              </div>
              <span style={{ fontSize: "12px", color: "#8b949e" }}>{edu.period}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 style={{ fontSize: "13px", fontWeight: "600", color: "#58a6ff", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>Experience</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {EXPERIENCE.map(exp => (
            <div key={exp.role} style={{ padding: "14px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <div>
                  <p style={{ fontSize: "14px", fontWeight: "600", color: "#f0f6fc" }}>{exp.role}</p>
                  <p style={{ fontSize: "12px", color: "#58a6ff" }}>{exp.company}</p>
                </div>
                <span style={{ fontSize: "11px", color: "#8b949e" }}>{exp.period}</span>
              </div>
              <ul style={{ paddingLeft: "16px", display: "flex", flexDirection: "column", gap: "4px" }}>
                {exp.bullets.map((b, i) => (
                  <li key={i} style={{ fontSize: "12px", color: "#8b949e", lineHeight: "1.5" }}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 style={{ fontSize: "13px", fontWeight: "600", color: "#58a6ff", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>Certifications</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          {CERTIFICATIONS.map(cert => (
            <div key={cert.name} style={{ padding: "10px 12px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", display: "flex", gap: "8px", alignItems: "center" }}>
              <span>{cert.emoji}</span>
              <div>
                <p style={{ fontSize: "12px", color: "#f0f6fc", fontWeight: "500" }}>{cert.name}</p>
                <p style={{ fontSize: "10px", color: "#8b949e" }}>{cert.issuer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}