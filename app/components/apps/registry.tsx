import dynamic from "next/dynamic";
import type { ReactElement } from "react";
import AboutApp from "./AboutApp";
import ProjectsApp from "./ProjectsApp";
import ResumeApp from "./ResumeApp";
import SkillsApp from "./SkillsApp";
import ContactApp from "./ContactApp";
import BrowserApp from "./BrowserApp";
import GalleryApp from "./GalleryApp";

// Interactive apps are code-split so their JS only loads when opened.
const loading = () => <p className="p-10 text-center text-sm text-fg-muted">Loading…</p>;
const TerminalApp = dynamic(() => import("./TerminalApp"), { loading });
const CalculatorApp = dynamic(() => import("./CalculatorApp"), { loading });
const WeatherApp = dynamic(() => import("./WeatherApp"), { loading });
const SnakeApp = dynamic(() => import("./SnakeApp"), { loading });
const FileExplorerApp = dynamic(() => import("./FileExplorerApp"), { loading });

export interface AppDef {
  id: string;
  title: string;
  emoji: string;
  size: { w: number; h: number };
  /** Created once at module scope so memoized windows never re-render their content needlessly. */
  element: ReactElement;
}

export const APPS: AppDef[] = [
  { id: "about", title: "About Me", emoji: "👨‍💻", size: { w: 520, h: 600 }, element: <AboutApp /> },
  { id: "projects", title: "Projects", emoji: "🚀", size: { w: 600, h: 580 }, element: <ProjectsApp /> },
  { id: "resume", title: "Resume", emoji: "📄", size: { w: 580, h: 600 }, element: <ResumeApp /> },
  { id: "skills", title: "Skills", emoji: "⚡", size: { w: 500, h: 500 }, element: <SkillsApp /> },
  { id: "contact", title: "Contact", emoji: "✉️", size: { w: 460, h: 480 }, element: <ContactApp /> },
  { id: "terminal", title: "Terminal", emoji: "🖥️", size: { w: 580, h: 420 }, element: <TerminalApp /> },
  { id: "calculator", title: "Calculator", emoji: "🔢", size: { w: 320, h: 580 }, element: <CalculatorApp /> },
  { id: "weather", title: "Weather", emoji: "🌤️", size: { w: 380, h: 540 }, element: <WeatherApp /> },
  { id: "snake", title: "Snake", emoji: "🐍", size: { w: 460, h: 640 }, element: <SnakeApp /> },
  { id: "browser", title: "Browser", emoji: "🌐", size: { w: 500, h: 560 }, element: <BrowserApp /> },
  { id: "gallery", title: "Gallery", emoji: "🖼️", size: { w: 560, h: 520 }, element: <GalleryApp /> },
  { id: "files", title: "Files", emoji: "📁", size: { w: 680, h: 500 }, element: <FileExplorerApp /> },
];

export const APPS_BY_ID = new Map(APPS.map((a) => [a.id, a]));
