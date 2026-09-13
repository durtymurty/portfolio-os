// Single source of truth for all portfolio content.
// Every app (and the terminal) renders from these exports — never hardcode
// contact details or project facts elsewhere.

export interface Profile {
  name: string;
  title: string;
  bio: string;
  email: string;
  location: string;
  links: { linkedin: string; github: string };
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface Project {
  slug: string;
  name: string;
  description: string;
  tech: string[];
  github: string;
  emoji: string;
  color: string;
  highlight?: string;
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  bullets: string[];
}

export interface Education {
  school: string;
  degree: string;
  period: string;
}

export interface Certification {
  name: string;
  issuer: string;
  emoji: string;
}

export const PROFILE: Profile = {
  name: "Murtaza Bootwala",
  title: "Computer Engineering @ Cal Poly '29",
  bio: "Hey, I'm Murtaza — a Computer Engineering student at Cal Poly SLO with a passion for building things, whether that's software, robots, or race car components. I love combining hardware and software to solve real problems, and I'm always working on something new.",
  email: "mbootwal@calpoly.edu",
  location: "San Luis Obispo, CA",
  links: {
    linkedin: "https://www.linkedin.com/in/murtazabootwala25",
    github: "https://github.com/durtymurty",
  },
};

/** "https://github.com/durtymurty" → "github.com/durtymurty" */
export const displayUrl = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "");

export const CONTACT_LINKS = [
  { icon: "✉️", label: "Email", value: PROFILE.email, href: `mailto:${PROFILE.email}`, external: false },
  { icon: "💼", label: "LinkedIn", value: displayUrl(PROFILE.links.linkedin), href: PROFILE.links.linkedin, external: true },
  { icon: "🐙", label: "GitHub", value: displayUrl(PROFILE.links.github), href: PROFILE.links.github, external: true },
];

export const SKILLS: SkillGroup[] = [
  { category: "Languages", items: ["JavaScript", "TypeScript", "Python", "Java", "HTML/CSS"] },
  { category: "Frontend", items: ["React", "Next.js", "Tailwind CSS", "Flutter"] },
  { category: "Backend", items: ["Node.js", "Express.js", "REST APIs"] },
  { category: "Tools", items: ["Git", "GitHub", "AWS", "VS Code"] },
  { category: "AI/ML", items: ["Python", "Ollama", "Sentence Transformers", "LLM Evaluation", "Streamlit", "scikit-learn"] },
  { category: "Engineering", items: ["CAD Modeling", "CNC Operation", "Carbon Fiber", "Robotics"] },
];

export const PROJECTS: Project[] = [
  {
    slug: "ai-code-reviewer",
    name: "AI Code Reviewer",
    description: "AI-powered code review tool built with Next.js and Claude Sonnet. Detects bugs, security vulnerabilities, and performance issues with severity ratings.",
    tech: ["Next.js", "TypeScript", "Claude API", "Tailwind CSS"],
    github: "https://github.com/durtymurty/ai-code-reviewer",
    emoji: "🔍",
    color: "#58a6ff",
  },
  {
    slug: "foodspect",
    name: "FoodSpect App",
    description: "Mobile app built with Flutter that helps people with food allergies make safe dietary choices. Features a UPC barcode scanner and allergy profile matching.",
    tech: ["Flutter", "Dart", "Open Food Facts API"],
    github: "https://github.com/kridos/WaForgeHackathon",
    emoji: "🍎",
    color: "#3fb950",
    highlight: "2nd place — WAForge Hackathon",
  },
  {
    slug: "llm-eval",
    name: "LLM Evaluation Framework",
    description: "Local framework for evaluating and comparing LLMs using semantic similarity scoring, LLM-as-judge, and hallucination detection. Supports multi-model comparison with a live Streamlit dashboard.",
    tech: ["Python", "Ollama", "Sentence Transformers", "Streamlit", "scikit-learn"],
    github: "https://github.com/durtymurty/llm-eval",
    emoji: "🧠",
    color: "#a78bfa",
  },
  {
    slug: "portfolio-os",
    name: "Dev Portfolio OS",
    description: "This portfolio! A desktop-OS experience with a custom window manager, taskbar, and a dozen apps.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS"],
    github: "https://github.com/durtymurty/portfolio-os",
    emoji: "🖥️",
    color: "#f97316",
  },
];

export const EDUCATION: Education[] = [
  { school: "Cal Poly SLO", degree: "B.S. Computer Engineering", period: "2025 – 2029" },
];

export const EXPERIENCE: Experience[] = [
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

export const CERTIFICATIONS: Certification[] = [
  { name: "AWS Cloud Practitioner", issuer: "Amazon Web Services", emoji: "☁️" },
  { name: "Harvard AI Bootcamp", issuer: "Harvard University", emoji: "🎓" },
  { name: "Networking Basics", issuer: "Cisco", emoji: "🌐" },
  { name: "Building with the Claude API", issuer: "Anthropic", emoji: "🤖" },
  { name: "AI Fundamentals", issuer: "Various", emoji: "🧠" },
];
