import { PROFILE, PROJECTS } from "../../data";
import { ExternalLink, Icon } from "../ui";

const LINKS = [
  { label: "GitHub Profile", url: PROFILE.links.github, emoji: "🐙", desc: "Repositories and contributions" },
  { label: "LinkedIn", url: PROFILE.links.linkedin, emoji: "💼", desc: "Connect with me professionally" },
  ...PROJECTS.flatMap((p) => (p.github ? [{ label: p.name, url: p.github, emoji: p.emoji, desc: p.tech.join(" · ") }] : [])),
  { label: "Cal Poly SLO", url: "https://www.calpoly.edu", emoji: "🎓", desc: "California Polytechnic State University" },
];

export default function BrowserApp() {
  return (
    <div className="flex flex-col gap-5">
      <div className="py-2.5 text-center">
        <Icon className="mb-2 block text-4xl">🌐</Icon>
        <h2 className="text-lg font-bold text-fg-strong">Quick Links</h2>
        <p className="mt-1 text-xs text-fg-muted">Each link opens in a new tab</p>
      </div>

      <ul className="flex flex-col gap-2.5">
        {LINKS.map((link) => (
          <li key={link.url}>
            <ExternalLink
              href={link.url}
              className="flex items-center gap-4 rounded-xl border border-line bg-raised px-4 py-3.5 transition-colors hover:border-white/15 hover:bg-white/[0.07]"
            >
              <Icon className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/[0.06] text-2xl">{link.emoji}</Icon>
              <span className="min-w-0 flex-1">
                <span className="mb-0.5 block text-sm font-semibold text-fg-strong">{link.label}</span>
                <span className="block truncate text-xs text-fg-muted">{link.desc}</span>
              </span>
              <Icon className="shrink-0 text-fg-muted">↗</Icon>
            </ExternalLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
