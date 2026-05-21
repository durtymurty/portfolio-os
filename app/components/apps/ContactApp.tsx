import { PROFILE } from "../../data";

export default function ContactApp() {
  return (
    <div style={{ color: "#c9d1d9", display: "flex", flexDirection: "column", gap: "20px" }}>
      <h1 style={{ fontSize: "20px", fontWeight: "700", color: "#f0f6fc" }}>Contact Me</h1>
      <p style={{ fontSize: "14px", color: "#8b949e", lineHeight: "1.6" }}>
        I'm always open to new opportunities, collaborations, or just a good conversation about tech. Reach out!
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {[
          { icon: "✉️", label: "Email", value: PROFILE.email, href: `mailto:${PROFILE.email}`, color: "#58a6ff" },
          { icon: "💼", label: "LinkedIn", value: "murtazabootwala25", href: PROFILE.linkedin, color: "#0077b5" },
          { icon: "🐙", label: "GitHub", value: "durtymurty", href: PROFILE.github, color: "#f0f6fc" },
        ].map(item => (
          <a key={item.label} href={item.href} target="_blank" rel="noreferrer"
            style={{ display: "flex", gap: "14px", alignItems: "center", padding: "16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", textDecoration: "none", transition: "all 0.2s" }}
          >
            <span style={{ fontSize: "24px" }}>{item.icon}</span>
            <div>
              <p style={{ fontSize: "11px", color: "#8b949e", textTransform: "uppercase", letterSpacing: "1px" }}>{item.label}</p>
              <p style={{ fontSize: "14px", color: item.color, fontWeight: "500", marginTop: "2px" }}>{item.value}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}