import { CERTIFICATIONS, displayUrl, EDUCATION, EXPERIENCE, PROFILE, PROJECTS, SKILLS } from "../data";

const pad = (s: string, n: number) => s.padEnd(n);
const longest = (xs: string[]) => Math.max(...xs.map((x) => x.length));

const COMMANDS: Record<string, { help: string; run: () => string }> = {
  help: {
    help: "List available commands",
    run: () => {
      const w = longest(Object.keys(COMMANDS)) + 3;
      return ["Available commands:", ...Object.entries(COMMANDS).map(([k, c]) => `  ${pad(k, w)}${c.help}`)].join("\n");
    },
  },
  whoami: { help: "Quick intro", run: () => "A builder. An engineer. A problem solver." },
  about: {
    help: "Who am I",
    run: () => `${PROFILE.name}\n${PROFILE.title}\nRobotics | Software | AI Enthusiast\n📍 ${PROFILE.location}`,
  },
  skills: {
    help: "My tech stack",
    run: () => {
      const w = longest(SKILLS.map((s) => s.category)) + 2;
      return SKILLS.map((s) => `${pad(`${s.category}:`, w)} ${s.items.join(", ")}`).join("\n");
    },
  },
  projects: {
    help: "What I've built",
    run: () => {
      const w = longest(PROJECTS.map((p) => p.name)) + 2;
      return PROJECTS.map(
        (p, i) => `[${i + 1}] ${pad(p.name, w)}— ${p.tech.slice(0, 3).join(" + ")}${p.highlight ? `\n    🏆 ${p.highlight}` : ""}`,
      ).join("\n");
    },
  },
  experience: {
    help: "Where I've worked",
    run: () => EXPERIENCE.map((e) => `${e.role} @ ${e.company}  (${e.period})`).join("\n"),
  },
  education: {
    help: "My background",
    run: () => EDUCATION.map((e) => `${e.school} — ${e.degree} (${e.period})`).join("\n"),
  },
  certs: {
    help: "Certifications",
    run: () => CERTIFICATIONS.map((c) => `${c.emoji} ${c.name} — ${c.issuer}`).join("\n"),
  },
  contact: {
    help: "Get in touch",
    run: () =>
      [
        `Email:    ${PROFILE.email}`,
        `LinkedIn: ${displayUrl(PROFILE.links.linkedin)}`,
        `GitHub:   ${displayUrl(PROFILE.links.github)}`,
      ].join("\n"),
  },
  date: { help: "Current date & time", run: () => new Date().toLocaleString() },
  echo: { help: "Print text", run: () => "" }, // handled with args below
  clear: { help: "Clear the terminal", run: () => "" },
};

export const COMMAND_NAMES = Object.keys(COMMANDS);

/** Returns output text, or `null` for `clear`. */
export function runCommand(raw: string): string | null {
  const [name = "", ...args] = raw.trim().split(/\s+/);
  const cmd = name.toLowerCase();
  if (cmd === "clear") return null;
  if (cmd === "echo") return args.join(" ");
  if (cmd === "sudo") return "Nice try. 🙂 This incident will be reported.";
  const entry = COMMANDS[cmd];
  return entry ? entry.run() : `command not found: ${name}\nType "help" for available commands.`;
}
