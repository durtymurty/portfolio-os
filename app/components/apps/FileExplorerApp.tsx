"use client";

import { useState } from "react";
import { PROJECTS } from "../../data";

export default function FileExplorerApp() {
  const [selected, setSelected] = useState<string | null>(null);
  const [openFolder, setOpenFolder] = useState<string | null>(null);

  const folders = [
    { name: "Projects", emoji: "📁", items: PROJECTS.map(p => ({ name: p.name, emoji: p.emoji, desc: p.description, tech: p.tech, github: p.github, color: p.color })) },
    { name: "Skills", emoji: "📁", items: [{ name: "View Skills", emoji: "⚡", desc: "JavaScript, TypeScript, Python, React, Next.js, Node.js, Flutter, AWS", tech: [], github: "", color: "#58a6ff" }] },
    { name: "Certifications", emoji: "📁", items: [
      { name: "AWS Cloud Practitioner", emoji: "☁️", desc: "Amazon Web Services — Cloud computing fundamentals", tech: [], github: "", color: "#ff9900" },
      { name: "Harvard AI Bootcamp", emoji: "🎓", desc: "Harvard University — AI and machine learning fundamentals", tech: [], github: "", color: "#a51c30" },
      { name: "Building with Claude API", emoji: "🤖", desc: "Anthropic — Building applications with Claude", tech: [], github: "", color: "#cc785c" },
    ]},
  ];

  const selectedFolder = folders.find(f => f.name === openFolder);
  const selectedItem = selectedFolder?.items.find(i => i.name === selected);

  return (
    <div style={{ display: "flex", height: "100%", gap: "0" }}>
      {/* Sidebar */}
      <div style={{ width: "180px", borderRight: "1px solid rgba(255,255,255,0.08)", paddingRight: "12px", display: "flex", flexDirection: "column", gap: "4px", flexShrink: 0 }}>
        <p style={{ fontSize: "11px", color: "#8b949e", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>Folders</p>
        {folders.map(folder => (
          <button key={folder.name} onClick={() => { setOpenFolder(folder.name); setSelected(null); }}
            style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 10px", borderRadius: "6px", border: "none", background: openFolder === folder.name ? "rgba(88,166,255,0.1)" : "transparent", color: openFolder === folder.name ? "#58a6ff" : "#c9d1d9", fontSize: "13px", cursor: "pointer", width: "100%", textAlign: "left" }}
          >
            {folder.emoji} {folder.name}
          </button>
        ))}
      </div>

      {/* File list */}
      <div style={{ flex: 1, padding: "0 12px", display: "flex", flexDirection: "column", gap: "4px", overflowY: "auto" }}>
        {!openFolder && <p style={{ color: "#8b949e", fontSize: "13px", marginTop: "20px", textAlign: "center" }}>Select a folder</p>}
        {selectedFolder?.items.map(item => (
          <button key={item.name} onClick={() => setSelected(item.name)}
            style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "8px", border: "none", background: selected === item.name ? "rgba(88,166,255,0.1)" : "rgba(255,255,255,0.02)", color: "#c9d1d9", fontSize: "13px", cursor: "pointer", textAlign: "left", borderLeft: selected === item.name ? `3px solid ${item.color}` : "3px solid transparent" }}
          >
            <span style={{ fontSize: "18px" }}>{item.emoji}</span>
            {item.name}
          </button>
        ))}
      </div>

      {/* Preview */}
      {selectedItem && (
        <div style={{ width: "220px", borderLeft: "1px solid rgba(255,255,255,0.08)", paddingLeft: "16px", flexShrink: 0 }}>
          <div style={{ fontSize: "36px", textAlign: "center", marginBottom: "12px" }}>{selectedItem.emoji}</div>
          <p style={{ fontSize: "14px", fontWeight: "600", color: selectedItem.color, marginBottom: "8px" }}>{selectedItem.name}</p>
          <p style={{ fontSize: "12px", color: "#8b949e", lineHeight: "1.5", marginBottom: "12px" }}>{selectedItem.desc}</p>
          {selectedItem.tech.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "12px" }}>
              {selectedItem.tech.map(t => (
                <span key={t} style={{ background: `${selectedItem.color}15`, color: selectedItem.color, borderRadius: "4px", padding: "2px 6px", fontSize: "10px" }}>{t}</span>
              ))}
            </div>
          )}
          {selectedItem.github && (
            <a href={selectedItem.github} target="_blank" rel="noreferrer"
              style={{ fontSize: "11px", color: "#58a6ff", textDecoration: "none" }}
            >View on GitHub →</a>
          )}
        </div>
      )}
    </div>
  );
}