# Dev Portfolio OS

An interactive portfolio built as a fully functional desktop OS experience. Features 12 draggable apps including a live terminal, snake game, real-time weather, calculator, project showcase, and more.

🌐 **Live Demo:** https://portfolio-os-one-chi.vercel.app

![screenshot](./screenshot.png)

## Apps

- 👨‍💻 **About Me** — Bio, contact info, and certifications
- 🚀 **Projects** — Showcase of my work with tech stack and GitHub links
- 📄 **Resume** — Education, experience, and certifications
- ⚡ **Skills** — Full tech stack organized by category
- ✉️ **Contact** — All contact links in one place
- 🖥️ **Terminal** — Functional terminal with custom commands
- 🔢 **Calculator** — Fully working calculator
- 🌤️ **Weather** — Live weather for San Luis Obispo, CA
- 🐍 **Snake** — Playable snake game with score tracking
- 🌐 **Browser** — Quick links to my profiles
- 🖼️ **Gallery** — Visual project gallery
- 📁 **File Explorer** — Browse projects and certifications

## Tech Stack

- **Framework** — Next.js 16 with App Router
- **Language** — TypeScript
- **Styling** — Tailwind CSS v4 (design tokens in `app/globals.css`)
- **Weather API** — Open-Meteo (free, no API key needed), CDN-cached for 10 min
- **Testing** — Vitest unit tests for the window manager, calculator, snake, and weather logic
- **Deployment** — Vercel + Vercel Web Analytics

## Project Structure

```
app/
  data.ts            ← all portfolio content (single source of truth)
  components/
    Desktop.tsx      ← window manager shell
    Window.tsx       ← draggable / resizable / keyboard-accessible window
    Taskbar.tsx, Clock.tsx, ui.tsx
    apps/            ← one file per app + registry.tsx
  lib/               ← pure, unit-tested logic (windowManager, calculator, snake, weather, terminal)
  api/weather/       ← Open-Meteo proxy
```

## Development

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # unit tests
npm run lint       # ESLint (next/core-web-vitals + TypeScript)
npm run typecheck
```

## Live Demo

Visit the live site: **https://portfolio-os-one-chi.vercel.app**

No installation needed — just open the link and explore!