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
  kind: "hardware" | "software";
  name: string;
  description: string;
  tech: string[];
  github?: string;
  emoji: string;
  color: string;
  highlight?: string;
  org?: string;
  role?: string;
  period?: string;
  /** Short, factual bullets for the project card. */
  details?: string[];
  /**
   * Presence of this block creates a /work/[slug] case study page.
   * Photos are picked up automatically from public/work/[slug]/ — see README.
   */
  caseStudy?: {
    location: string;
    /** Full contribution list (wording from the resume). */
    contributions: string[];
    /** Number of figure slots to show; unfilled slots render as "photo pending". */
    photoSlots: number;
  };
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
  date?: string;
}

export const SITE_URL = "https://portfolio-os-one-chi.vercel.app";

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
  {
    category: "Engineering",
    items: [
      "CAD Modeling & Technical Drawings",
      "CNC Machine Operation",
      "Composite Fabrication",
      "Mechanical Fabrication & Assembly",
      "Design for Manufacturing",
      "Robotics Prototyping",
      "Failure Analysis",
    ],
  },
];

export const PROJECTS: Project[] = [
  {
    slug: "fsae-carbon-chassis",
    kind: "hardware",
    name: "Formula SAE Carbon Chassis",
    description: "Manufacturing Formula SAE vehicle components on Cal Poly Racing's aero and chassis team — carbon layups, vacuum bagging, and assembly of the carbon chassis tub.",
    tech: ["Carbon Fiber", "Composite Layup", "Vacuum Bagging"],
    emoji: "🏎️",
    color: "#f97316",
    org: "Cal Poly Racing",
    role: "Aero & Chassis Team",
    period: "Sep 2025 – Present",
    details: [
      "Contributed to a 10–15% reduction in composite fabrication time through improved material handling",
      "Carbon layups, vacuum bagging, material prep, and post-processing with <2% rework rate",
      "Helped prep and assemble the carbon chassis tub",
    ],
    caseStudy: {
      location: "San Luis Obispo, CA",
      contributions: [
        "Assisted Aero & Chassis subgroups in manufacturing components for the Formula SAE vehicle, contributing to a 10–15% reduction in composite fabrication time through improved material handling",
        "Performed carbon layups, vacuum bagging, material preparation, and post-processing with <2% rework rate, ensuring quality and consistency in composite parts",
        "Assisted in prepping and assembling the carbon chassis tub with a focus on quality, accuracy, and structural performance",
        "Gained experience in composite fabrication workflows, safety procedures, and collaboration in a multidisciplinary engineering environment",
      ],
      photoSlots: 3,
    },
  },
  {
    slug: "frc-robot-fabrication",
    kind: "hardware",
    name: "FRC Robot Fabrication",
    description: "Led the fabrication team for FRC Team 2976 Spartabots, taking custom competition robot parts from CAD models to CNC-machined components.",
    tech: ["CAD Modeling", "CNC Operation", "Robotics"],
    emoji: "🤖",
    color: "#3fb950",
    highlight: "Fabrication Lead — team of 10",
    org: "FRC Team 2976, Spartabots",
    role: "Fabrication Lead",
    period: "Aug 2023 – Jun 2024",
    details: [
      "Guided a team of 10 through fabrication tasks built to strict specifications",
      "Designed CAD models and translated them into machine-operable instructions",
      "Operated CNC machinery to turn raw material into precise components",
    ],
    caseStudy: {
      location: "Sammamish, WA",
      contributions: [
        "Guided a team of 10 members through detailed robotics fabrication tasks, ensuring all parts met strict specifications under competition deadlines",
        "Designed and generated CAD models, translating design concepts into machine-operable instructions",
        "Operated CNC machinery and oversaw the transformation of raw materials into precise components",
        "Managed workflow and quality assurance processes while promoting strong communication throughout the team",
        "Troubleshot fabrication challenges in real time, minimizing delays and maintaining productivity",
      ],
      photoSlots: 3,
    },
  },
  {
    slug: "ai-code-reviewer",
    kind: "software",
    name: "AI Code Reviewer",
    description: "AI-powered code review tool built with Next.js and Claude Sonnet. Detects bugs, security vulnerabilities, and performance issues with severity ratings.",
    tech: ["Next.js", "TypeScript", "Claude API", "Tailwind CSS"],
    github: "https://github.com/durtymurty/ai-code-reviewer",
    emoji: "🔍",
    color: "#58a6ff",
  },
  {
    slug: "foodspect",
    kind: "software",
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
    kind: "software",
    name: "LLM Evaluation Framework",
    description: "Local framework for evaluating and comparing LLMs using semantic similarity scoring, LLM-as-judge, and hallucination detection. Supports multi-model comparison with a live Streamlit dashboard.",
    tech: ["Python", "Ollama", "Sentence Transformers", "Streamlit", "scikit-learn"],
    github: "https://github.com/durtymurty/llm-eval",
    emoji: "🧠",
    color: "#a78bfa",
  },
  {
    slug: "portfolio-os",
    kind: "software",
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
      "Assisted Aero & Chassis subgroups in manufacturing Formula SAE components, contributing to a 10–15% reduction in composite fabrication time through improved material handling",
      "Performed carbon layups, vacuum bagging, material preparation, and post-processing with <2% rework rate",
      "Assisted in prepping and assembling the carbon chassis tub with a focus on quality, accuracy, and structural performance",
    ],
  },
  {
    role: "Fabrication Lead",
    company: "FRC Team 2976, Spartabots",
    period: "Aug 2023 – Jun 2024",
    bullets: [
      "Guided a team of 10 members through detailed robotics fabrication tasks, ensuring all parts met strict specifications under competition deadlines",
      "Designed and generated CAD models, translating design concepts into machine-operable instructions",
      "Operated CNC machinery and oversaw the transformation of raw materials into precise components",
    ],
  },
  {
    role: "Swim Instructor",
    company: "YMCA of Seattle",
    period: "Jun 2023 – Sep 2025",
    bullets: [
      "Deliver tailored swim lessons to students across age groups and skill levels",
      "Monitor class safety and intervene promptly in emergency situations",
      "Assess individual progress and coordinate lesson plans with colleagues",
    ],
  },
];

export const CERTIFICATIONS: Certification[] = [
  { name: "AWS Certified Cloud Practitioner", issuer: "Amazon Web Services", emoji: "☁️", date: "Aug 2025" },
  { name: "Harvard AI Bootcamp", issuer: "Harvard University", emoji: "🎓", date: "Dec 2023" },
  { name: "Networking Basics", issuer: "Cisco", emoji: "🌐", date: "Mar 2025" },
  { name: "Building with the Claude API", issuer: "Anthropic", emoji: "🤖" },
  { name: "AI Fundamentals", issuer: "Various", emoji: "🧠" },
];
