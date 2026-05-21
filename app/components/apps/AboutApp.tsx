import { PROFILE, CERTIFICATIONS } from "../../data";

export default function AboutApp() {
  return (
    <div style={{ color: "#c9d1d9", display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "linear-gradient(135deg, #58a6ff, #bc8cff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "36px", flexShrink: 0 }}>
          {PROFILE.avatar}
        </div>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#f0f6fc" }}>{PROFILE.name}</h1>
          <p style={{ color: "#58a6ff", fontSize: "14px", marginTop: "4px" }}>{PROFILE.title}</p>
          <p style={{ color: "#8b949e", fontSize: "12px", marginTop: "2px" }}>📍 {PROFILE.location}</p>
        </div>
      </div>

      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "16px" }}>
        <p style={{ fontSize: "14px", lineHeight: "1.7", color: "#c9d1d9" }}>{PROFILE.bio}</p>
      </div>

      <div>
        <h2 style={{ fontSize: "14px", fontWeight: "600", color: "#f0f6fc", marginBottom: "12px" }}>📬 Contact</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {[
            { icon: "✉️", label: PROFILE.email, href: `mailto:${PROFILE.email}` },
            { icon: "💼", label: "linkedin.com/in/murtazabootwala25", href: PROFILE.linkedin },
            { icon: "🐙", label: "github.com/durtymurty", href: PROFILE.github },
          ].map(item => (
            <a key={item.label} href={item.href} target="_blank" rel="noreferrer"
              style={{ display: "flex", gap: "10px", alignItems: "center", fontSize: "13px", color: "#8b949e", textDecoration: "none", padding: "8px 12px", background: "rgba(255,255,255,0.03)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <span>{item.icon}</span>
              <span style={{ color: "#58a6ff" }}>{item.label}</span>
            </a>
          ))}
        </div>
      </div>

      <div>
        <h2 style={{ fontSize: "14px", fontWeight: "600", color: "#f0f6fc", marginBottom: "12px" }}>🏆 Certifications</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {CERTIFICATIONS.map(cert => (
            <div key={cert.name} style={{ display: "flex", gap: "10px", alignItems: "center", padding: "10px 12px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px" }}>
              <span style={{ fontSize: "20px" }}>{cert.emoji}</span>
              <div>
                <p style={{ fontSize: "13px", color: "#f0f6fc", fontWeight: "500" }}>{cert.name}</p>
                <p style={{ fontSize: "11px", color: "#8b949e" }}>{cert.issuer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}