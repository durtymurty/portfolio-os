export const PROFILE = {
  name: "Murtaza Bootwala",
  title: "Computer Engineering @ Cal Poly '29",
  bio: "Hey, I'm Murtaza — a Computer Engineering student at Cal Poly SLO with a passion for building things, whether that's software, robots, or race car components. I love combining hardware and software to solve real problems, and I'm always working on something new.",
  email: "mbootwal@calpoly.edu",
  phone: "",
  linkedin: "https://linkedin.com/in/murtazabootwala25",
  github: "https://github.com/durtymurty",
  location: "San Luis Obispo, CA",
  avatar: "👨‍💻",
};

export const SKILLS = [
  { category: "Languages", items: ["JavaScript", "TypeScript", "Python", "Java", "HTML/CSS"] },
  { category: "Frontend", items: ["React", "Next.js", "Tailwind CSS", "Flutter"] },
  { category: "Backend", items: ["Node.js", "Express.js", "REST APIs"] },
  { category: "Tools", items: ["Git", "GitHub", "AWS", "VS Code"] },
  { category: "Engineering", items: ["CAD Modeling", "CNC Operation", "Carbon Fiber", "Robotics"] },
];

export const PROJECTS = [
  {
    name: "AI Code Reviewer",
    description: "AI-powered code review tool built with Next.js and Claude Sonnet. Detects bugs, security vulnerabilities, performance issues with severity ratings.",
    tech: ["Next.js", "TypeScript", "Claude API", "Tailwind CSS"],
    github: "https://github.com/durtymurty/ai-code-reviewer",
    emoji: "🔍",
    color: "#58a6ff",
  },
  {
    name: "FoodSpect App",
    description: "Mobile app built with Flutter that helps people with food allergies make safe dietary choices. Features UPC barcode scanner and allergy profile matching. Won 2nd place at WAForge Hackathon.",
    tech: ["Flutter", "Dart", "Open Food Facts API"],
    github: "https://github.com/kridos/WaForgeHackathon",
    emoji: "🍎",
    color: "#3fb950",
  },
  {
    name: "Real-time Collaborative Whiteboard - SOON",
    description: "A real-time collaborative whiteboard where multiple users can draw and write together simultaneously using WebSockets.",
    tech: ["React", "WebSockets", "Node.js", "Canvas API"],
    github: "https://github.com/durtymurty",
    emoji: "🎨",
    color: "#d2a8ff",
  },
  {
    name: "Dev Portfolio OS",
    description: "This portfolio! Built as a fully functional desktop OS experience with draggable windows, a taskbar, and multiple apps.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS"],
    github: "https://github.com/durtymurty/portfolio-os",
    emoji: "🖥️",
    color: "#f97316",
  },
];

export const EXPERIENCE = [
  {
    role: "Aero & Chassis Team",
    company: "Cal Poly Racing",
    period: "Sep 2025 – Present",
    bullets: [
      "Assisted in manufacturing Formula SAE vehicle components, reducing fabrication time by 10–15%",
      "Performed carbon layups, vacuum bagging with <2% rework rate",
      "Assembled carbon chassis tub with focus on quality and structural performance",
    ],
  },
  {
    role: "Fabrication Lead",
    company: "FRC Team 2976, Spartabots",
    period: "Aug 2023 – Jun 2024",
    bullets: [
      "Led a team of 10 members in designing and fabricating custom robot parts",
      "Created CAD models and operated CNC machinery",
      "Managed workflow and quality assurance under competition deadlines",
    ],
  },
  {
    role: "Swim Instructor",
    company: "YMCA of Greater Seattle",
    period: "Jun 2023 – Sep 2025",
    bullets: [
      "Taught water safety and technique to students across all skill levels",
      "Developed structured adaptive lesson plans",
      "Sustained 2+ years of consistent performance",
    ],
  },
];

export const CERTIFICATIONS = [
  { name: "AWS Cloud Practitioner", issuer: "Amazon Web Services", emoji: "☁️" },
  { name: "Harvard AI Bootcamp", issuer: "Harvard University", emoji: "🎓" },
  { name: "Networking Basics", issuer: "Cisco", emoji: "🌐" },
  { name: "Building with the Claude API", issuer: "Anthropic", emoji: "🤖" },
  { name: "AI Fundamentals", issuer: "Various", emoji: "🧠" },
];

export const TERMINAL_RESPONSES: Record<string, string> = {
  help: `Available commands:
  about      — Who am I
  skills     — My tech stack
  projects   — What I've built
  contact    — Get in touch
  education  — My background
  clear      — Clear terminal
  whoami     — Quick intro`,
  about: `Murtaza Bootwala
Computer Engineering @ Cal Poly SLO '29
Robotics | Software | AI Enthusiast
Currently building: AI tools, web apps, race cars`,
  skills: `Languages:   JavaScript, TypeScript, Python, Java
Frontend:    React, Next.js, Flutter, Tailwind
Backend:     Node.js, Express, REST APIs
Tools:       Git, AWS, VS Code
Engineering: CAD, CNC, Carbon Fiber, Robotics`,
  projects: `[1] AI Code Reviewer       — Next.js + Claude API
[2] FoodSpect App          — Flutter + Dart
[3] Collaborative Whiteboard — React + WebSockets
[4] Portfolio OS           — Next.js + TypeScript`,
  contact: `Email:    mbootwal@calpoly.edu
LinkedIn: linkedin.com/in/murtazabootwala25
GitHub:   github.com/durtymurty`,
  education: `Cal Poly SLO — B.S. Computer Engineering (2025–2029)
Skyline High School (2021–2025)`,
  whoami: `murtaza@portfolio:~$ A builder. An engineer. A problem solver.`,
  clear: "__CLEAR__",
};