"use client";

import { useState, useCallback, useEffect } from "react";
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
  { id: "calculator", title: "Calculator", emoji: "🔢", component: <CalculatorApp />, initialSize: { w: 320, h: 560 } },
  { id: "weather", title: "Weather", emoji: "🌤️", component: <WeatherApp />, initialSize: { w: 380, h: 520 } },
  { id: "snake", title: "Snake", emoji: "🐍", component: <SnakeApp />, initialSize: { w: 460, h: 600 } },
  { id: "browser", title: "Browser", emoji: "🌐", component: <BrowserApp />, initialSize: { w: 500, h: 500 } },
  { id: "gallery", title: "Gallery", emoji: "🖼️", component: <GalleryApp />, initialSize: { w: 560, h: 520 } },
  { id: "files", title: "Files", emoji: "📁", component: <FileExplorerApp />, initialSize: { w: 680, h: 500 } },
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

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const openApp = useCallback((id: string) => {
    setOpenWindows(prev => {
      const exists = prev.find(w => w.id === id);
      if (exists) {
        setTopZ(t => t + 1);
        return prev.map(w => w.id === id ? { ...w, zIndex: topZ + 1 } : w);
      }
      const offset = (prev.length % 8) * 30;
      const appConfig = APPS.find(a => a.id === id);
      const winH = appConfig?.initialSize?.h ?? 500;
      const maxY = window.innerHeight - 70 - winH;
      const safeY = Math.max(20, Math.min(60 + offset, maxY));
      setTopZ(t => t + 1);
      return [...prev, { id, zIndex: topZ + 1, position: { x: 80 + offset, y: safeY } }];
    });
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
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative" }}>

      {/* Animated background */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #060612 0%, #0a0f1e 50%, #060e18 100%)" }} />

      {/* Animated blobs */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div style={{
          position: "absolute", top: "5%", left: "5%",
          width: "500px", height: "500px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(88,166,255,0.12) 0%, transparent 70%)",
          animation: "blob1 12s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", top: "40%", right: "5%",
          width: "600px", height: "600px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(188,140,255,0.10) 0%, transparent 70%)",
          animation: "blob2 15s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", bottom: "10%", left: "30%",
          width: "400px", height: "400px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(63,185,80,0.07) 0%, transparent 70%)",
          animation: "blob3 10s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", top: "20%", left: "45%",
          width: "350px", height: "350px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 70%)",
          animation: "blob1 18s ease-in-out infinite reverse",
        }} />
      </div>

      {/* Subtle dot grid */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }} />

      {/* Welcome message */}
      <div style={{
        position: "absolute", top: "38%", left: "50%",
        transform: "translate(-50%, -50%)",
        textAlign: "center", pointerEvents: "none",
        display: openWindows.length > 0 ? "none" : "block",
      }}>
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.25)", letterSpacing: "4px", textTransform: "uppercase", marginBottom: "16px" }}>Hi, I'm Murtaza 👋</p>
        <h1 style={{ fontSize: "52px", fontWeight: "700", color: "rgba(255,255,255,0.06)", letterSpacing: "6px", textTransform: "uppercase", marginBottom: "16px" }}>PORTFOLIO</h1>
        <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.3)", letterSpacing: "1px" }}>
          Computer Engineering @ Cal Poly '29
        </p>
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.18)", marginTop: "10px" }}>
          Click any app below to explore ↓
        </p>
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
        position: "fixed", bottom: 0, left: 0, right: 0, height: "80px",
        background: "rgba(8,8,20,0.85)", backdropFilter: "blur(24px)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "0 20px", zIndex: 9999,
      }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "6px", padding: "6px 16px 4px", background: "rgba(255,255,255,0.04)", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.07)" }}>
          {APPS.map(app => (
            <div
              key={app.id}
              onClick={() => openApp(app.id)}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px", cursor: "pointer", position: "relative" }}
            >
              <div
                className="taskbar-icon"
                data-label={app.title}
                style={{
                  background: isOpen(app.id) ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)",
                  boxShadow: isOpen(app.id) ? "0 0 14px rgba(88,166,255,0.25)" : "none",
                  border: isOpen(app.id) ? "1px solid rgba(88,166,255,0.2)" : "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {app.emoji}
              </div>
              {/* App label */}
              <span style={{ fontSize: "9px", color: isOpen(app.id) ? "#58a6ff" : "rgba(255,255,255,0.3)", letterSpacing: "0.3px", maxWidth: "48px", textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {app.title}
              </span>
              {/* Active dot */}
              {isOpen(app.id) && (
                <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#58a6ff", boxShadow: "0 0 6px #58a6ff" }} />
              )}
            </div>
          ))}
        </div>

        {/* Clock */}
        <div style={{ position: "absolute", right: "24px", textAlign: "right" }}>
          <p style={{ fontSize: "14px", fontWeight: "600", color: "#f0f6fc", lineHeight: 1 }}>
            {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </p>
          <p style={{ fontSize: "11px", color: "#8b949e", marginTop: "2px" }}>
            {time.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })}
          </p>
        </div>
      </div>

      {/* Blob animations */}
      <style>{`
        @keyframes blob1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(60px, -40px) scale(1.1); }
          66% { transform: translate(-30px, 30px) scale(0.95); }
        }
        @keyframes blob2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-50px, 30px) scale(1.05); }
          66% { transform: translate(40px, -50px) scale(0.9); }
        }
        @keyframes blob3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -40px) scale(1.1); }
        }
      `}</style>
    </div>
  );
}