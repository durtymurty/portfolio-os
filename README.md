# Murtaza Bootwala — Portfolio

Personal portfolio of a Computer Engineering student at Cal Poly SLO, styled as an engineering drawing: title blocks, part numbers, a revision history, and a bill of materials.

🌐 **Live:** https://portfolio-os-one-chi.vercel.app

![screenshot](./screenshot.png)

## Highlights

- **Interactive hero** — a line-drawn two-joint robot arm that tracks your cursor using inverse kinematics (`app/lib/ik.ts`, unit-tested), idles on a figure-eight, pauses off-screen, and respects `prefers-reduced-motion`.
- **Case studies** at `/work/[slug]` with figure slots that fill automatically from `public/work/[slug]/`.
- **⌘K / Ctrl+K command palette** — jump to sections and case studies, download the resume, copy email, toggle theme.
- **Two themes** — drafting vellum (light) and blueprint (dark), following the system setting with a no-flash toggle.
- **Portfolio OS** at `/os` — the original desktop-OS version with a window manager, terminal, calculator, weather, and snake.
- **Accessible and fast** — static pages, semantic HTML, keyboard support throughout, axe-core clean in both themes.

## Tech stack

- Next.js 16 (App Router, static generation) · React 19 · TypeScript
- Tailwind CSS v4 with CSS-variable design tokens (`app/globals.css`)
- IBM Plex Sans / Mono via `next/font`
- Vitest unit tests · ESLint (next/core-web-vitals + TypeScript)
- Open-Meteo weather API (for `/os`) · Vercel + Web Analytics

## Updating content

All content lives in **`app/data.ts`** — profile, projects, experience, skills, and certifications. Every page, the command palette, the OS apps, and the terminal read from it.

### Resume

Put the PDF at `public/resume.pdf`. At build time every "Resume" button switches from an email request to a direct download. If the file isn't there, the buttons fall back to emailing a request, so they never 404.

### Case study photos

Any project with a `caseStudy` block in `data.ts` gets a page at `/work/[slug]`, with `photoSlots` figure slots. Empty slots show a "Photo pending" frame; in `npm run dev` they also show the exact path to drop a file at.

1. Drop images into `public/work/<slug>/`, e.g. `public/work/fsae-carbon-chassis/01-layup.jpg`
   (`.jpg`, `.jpeg`, `.png`, `.webp`, `.avif`). Files fill slots in natural filename order (`01-…`, `02-…`), and extra photos add more slots.
2. Optionally add `public/work/<slug>/captions.json`:

   ```json
   {
     "01-layup.jpg": { "alt": "Carbon fiber plies laid into a mold", "caption": "Laying up a composite part" },
     "02-tub.jpg": "Chassis tub during assembly"
   }
   ```

   A plain string is used as both caption and alt text. Without an entry, alt text falls back to "<project> — figure N", so real alt text is strongly recommended.

No code changes are needed: `npm run dev` picks up new files on refresh, and on Vercel the next deploy (a push) includes them. Images are optimized automatically by `next/image`.

## Project structure

```
app/
  data.ts                 ← all portfolio content
  page.tsx                ← homepage (hero, work, experience, skills, contact)
  work/[slug]/            ← case study pages + per-project social cards
  os/                     ← Portfolio OS (desktop version)
  components/site/        ← homepage + case study components, command palette
  components/             ← OS window manager, taskbar, and apps/
  lib/                    ← pure, unit-tested logic (ik, palette, figures, windowManager, calculator, snake, weather)
  api/weather/            ← Open-Meteo proxy used by /os
```

## Development

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # unit tests
npm run lint
npm run typecheck
npm run build
```
