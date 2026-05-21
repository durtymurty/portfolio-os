import { SKILLS } from "../../data";

const COLORS = ["#58a6ff", "#3fb950", "#d2a8ff", "#f97316", "#ff7b72"];

export default function SkillsApp() {
  return (
    <div style={{ color: "#c9d1d9", display: "flex", flexDirection: "column", gap: "20px" }}>
      <h1 style={{ fontSize: "20px", fontWeight: "700", color: "#f0f6fc" }}>Skills</h1>
      {SKILLS.map((group, gi) => (
        <div key={group.category}>
          <h2 style={{ fontSize: "12px", fontWeight: "600", color: COLORS[gi % COLORS.length], textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px" }}>{group.category}</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {group.items.map(skill => (
              <span key={skill} style={{ background: `${COLORS[gi % COLORS.length]}15`, border: `1px solid ${COLORS[gi % COLORS.length]}30`, color: COLORS[gi % COLORS.length], borderRadius: "20px", padding: "6px 14px", fontSize: "13px", fontWeight: "500" }}>
                {skill}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}