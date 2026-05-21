"use client";

export default function BrowserApp() {
  const links = [
    { label: "GitHub Profile", url: "https://github.com/durtymurty", emoji: "🐙", desc: "View my repositories and contributions", color: "#f0f6fc" },
    { label: "AI Code Reviewer", url: "https://github.com/durtymurty/ai-code-reviewer", emoji: "🔍", desc: "AI-powered code review tool built with Next.js and Claude", color: "#58a6ff" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/murtazabootwala25", emoji: "💼", desc: "Connect with me professionally", color: "#0077b5" },
    { label: "Cal Poly SLO", url: "https://www.calpoly.edu", emoji: "🎓", desc: "California Polytechnic State University", color: "#154734" },
  ];

  return (
    <div style={{ color: "#c9d1d9", display: "flex", flexDirection: "column", gap: "20px", height: "100%" }}>

      {/* Header */}
      <div style={{ textAlign: "center", padding: "10px 0" }}>
        <div style={{ fontSize: "40px", marginBottom: "8px" }}>🌐</div>
        <h1 style={{ fontSize: "18px", fontWeight: "700", color: "#f0f6fc" }}>Quick Links</h1>
        <p style={{ fontSize: "12px", color: "#8b949e", marginTop: "4px" }}>Click to open in a new tab</p>
      </div>

      {/* Links */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {links.map(link => (
          <div
            key={link.label}
            onClick={() => window.open(link.url, "_blank")}
            style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px 18px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", cursor: "pointer", transition: "all 0.2s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.07)"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.15)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.03)"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.08)"; }}
          >
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", flexShrink: 0 }}>
              {link.emoji}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: "14px", fontWeight: "600", color: "#f0f6fc", marginBottom: "3px" }}>{link.label}</p>
              <p style={{ fontSize: "12px", color: "#8b949e" }}>{link.desc}</p>
            </div>
            <div style={{ color: "#8b949e", fontSize: "16px", flexShrink: 0 }}>↗</div>
          </div>
        ))}
      </div>
    </div>
  );
}