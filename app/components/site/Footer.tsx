import Link from "next/link";
import { PROFILE, PROJECTS } from "../../data";

export default function Footer() {
  const source = PROJECTS.find((p) => p.slug === "portfolio-os")?.github;

  return (
    <footer className="mx-auto max-w-6xl px-5 pb-10 md:px-8">
      <div className="grid border-t border-l border-rule-strong text-sm sm:grid-cols-4">
        <FooterCell label="Drawn by">{PROFILE.name}</FooterCell>
        <FooterCell label="Built with">Next.js · TypeScript · Tailwind</FooterCell>
        <FooterCell label="Source">
          {source ? (
            <a href={source} target="_blank" rel="noopener noreferrer" className="link-ink">
              github.com/…/portfolio-os<span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : "—"}
        </FooterCell>
        <FooterCell label="Alt. view">
          <Link href="/os" className="link-ink">Launch Portfolio OS →</Link>
        </FooterCell>
      </div>
      <p className="annot mt-4 text-center">© {PROFILE.name} · All dimensions in good faith</p>
    </footer>
  );
}

function FooterCell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-r border-b border-rule-strong px-3 py-2.5">
      <p className="annot text-[10px]">{label}</p>
      <p className="mt-0.5">{children}</p>
    </div>
  );
}
