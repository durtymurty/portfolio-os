"use client";

import { useState, useCallback } from "react";
import Window from "./components/Window";
import AboutApp from "./components/apps/AboutApp";
import ProjectsApp from "./components/apps/ProjectsApp";
import ResumeApp from "./components/apps/ResumeApp";
import SkillsApp from "./components/apps/SkillsApp";
import ContactApp from "./components/apps/ContactApp";
import TerminalApp from "./components/apps/TerminalApp";
import CalculatorApp from "./components/apps/CalculatorApp";
import WeatherApp from "./components/apps/WeatherApp";
import SnakeApp from "./components/apps/SnakeApp";
import BrowserApp from "./components/apps/BrowserApp";
import GalleryApp from "./components/apps/GalleryApp";
import FileExplorerApp from "./components/apps/FileExplorerApp";

interface AppConfig {
  id: string;
  title: string;
  emoji: string;
  component: React.ReactNode;
  initialSize?: { w: number; h: number };
  initialPosition?: { x: number; y: number };
}

const APPS: AppConfig[] = [
  { id: "about", title: "About Me", emoji: "👨‍💻", component: <AboutApp />, initialSize: { w: 520, h: 600 } },
  { id: "projects", title: "Projects", emoji: "🚀", component: <ProjectsApp />, initialSize: { w: 600, h: 580 } },
  { id: "resume", title: "Resume", emoji: "📄", component: <ResumeApp />, initialSize: { w: 580, h: 600 } },
  { id: "skills", title: "Skills", emoji: "⚡", component: <SkillsApp />, initialSize: { w: 500, h: 500 } },
  { id: "contact", title: "Contact", emoji: "✉️", component: <ContactApp />, initialSize: { w: 460, h: 480 } },
  { id: "terminal", title: "Terminal", emoji: "🖥️", component: <TerminalApp />, initialSize: { w: 580, h: 420 } },
  { id: "calculator", title: "Calculator", emoji: "🔢", component: <CalculatorApp />, initialSize: { w: 320, h: 530 } },
  { id: "weather", title: "Weather", emoji: "🌤️", component: <WeatherApp />, initialSize: { w: 380, h: 520 } },
  { id: "snake", title: "Snake", emoji: "🐍", component: <SnakeApp />, initialSize: { w: 460, h: 600 } },
  { id: "browser", title: "Browser", emoji: "🌐", component: <BrowserApp />, initialSize: { w: 700, h: 560 } },
  { id: "gallery", title: "Gallery", emoji: "🖼️", component: <GalleryApp />, initialSize: { w: 560, h: 520 } },
  { id: "files", title: "File Explorer", emoji: "📁", component: <FileExplorerApp />, initialSize: { w: 680, h: 500 } },
];

interface OpenWindow {
  id: string;
  zIndex: number;
  position: { x: number; y: number };
}

export default function Home() {
  const [openWindows, setOpenWindows] = useState<OpenWindow[]>([]);
  const [topZ, setTopZ] = useState(100);
  const [time, setTime] = useState(new Date());

  useState(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  });

  const openApp = useCallback((id: string) => {
    setOpenWindows(prev => {
      const exists = prev.find(w => w.id === id);
      if (exists) {
        return prev.map(w => w.id === id ? { ...w, zIndex: topZ + 1 } : w);
      }
      const offset = prev.length * 30;
      const appConfig = APPS.find(a => a.id === id);
      const winH = appConfig?.initialSize?.h ?? 500;
      const maxY = window.innerHeight - 70 - winH;
      const safeY = Math.max(20, Math.min(60 + offset, maxY));
      return [...prev, { id, zIndex: topZ + 1, position: { x: 80 + offset, y: safeY } }];
    });
    setTopZ(t => t + 1);
  }, [topZ]);

  const closeApp = useCallback((id: string) => {
    setOpenWindows(prev => prev.filter(w => w.id !== id));
  }, []);

  const focusApp = useCallback((id: string) => {
    setTopZ(t => t + 1);
    setOpenWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: topZ + 1 } : w));
  }, [topZ]);

  const isOpen = (id: string) => openWindows.some(w => w.id === id);

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative", background: "linear-gradient(135deg, #0a0a1a 0%, #0d1b2a 50%, #0a1628 100%)" }}>

      {/* Wallpaper decorations */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "15%", left: "10%", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(88,166,255,0.08) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", bottom: "20%", right: "15%", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(188,140,255,0.06) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle, rgba(63,185,80,0.03) 0%, transparent 70%)" }} />
      </div>

      {/* Desktop label */}
      <div style={{ position: "absolute", top: "40%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center", pointerEvents: "none" }}>
        <p style={{ fontSize: "80px", fontWeight: "200", color: "rgba(255,255,255,0.04)", letterSpacing: "8px", userSelect: "none" }}>PORTFOLIO</p>
      </div>

      {/* Windows */}
      {openWindows.map(win => {
        const app = APPS.find(a => a.id === win.id)!;
        return (
          <Window
            key={win.id}
            id={win.id}
            title={app.title}
            emoji={app.emoji}
            onClose={closeApp}
            onFocus={focusApp}
            zIndex={win.zIndex}
            initialPosition={win.position}
            initialSize={app.initialSize}
          >
            {app.component}
          </Window>
        );
      })}

      {/* Taskbar */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, height: "70px",
        background: "rgba(10,10,20,0.85)", backdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
        padding: "0 20px", zIndex: 9999,
      }}>
        {/* App icons */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 12px", background: "rgba(255,255,255,0.04)", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.08)" }}>
          {APPS.map(app => (
            <div
              key={app.id}
              className="taskbar-icon"
              data-label={app.title}
              onClick={() => openApp(app.id)}
              style={{ background: isOpen(app.id) ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.04)", boxShadow: isOpen(app.id) ? "0 0 12px rgba(88,166,255,0.3)" : "none" }}
            >
              {app.emoji}
              {isOpen(app.id) && (
                <div style={{ position: "absolute", bottom: "2px", left: "50%", transform: "translateX(-50%)", width: "4px", height: "4px", borderRadius: "50%", background: "#58a6ff" }} />
              )}
            </div>
          ))}
        </div>

        {/* Clock */}
        <div style={{ position: "absolute", right: "20px", textAlign: "right" }}>
          <p style={{ fontSize: "14px", fontWeight: "600", color: "#f0f6fc", lineHeight: 1 }}>
            {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </p>
          <p style={{ fontSize: "11px", color: "#8b949e", marginTop: "2px" }}>
            {time.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })}
          </p>
        </div>
      </div>
    </div>
  );
}