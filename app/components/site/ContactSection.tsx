import { PROFILE, displayUrl } from "../../data";
import { getResume } from "../../lib/resume";
import CopyButton from "./CopyButton";
import SectionHeader from "./SectionHeader";

/** Let long URLs wrap at "/" on narrow screens instead of mid-word. */
const breakAfterSlashes = (url: string) =>
  url.split("/").flatMap((part, i, parts) => (i < parts.length - 1 ? [part, "/", <wbr key={i} />] : [part]));

export default function ContactSection() {
  const resume = getResume();
  const links = [
    { label: "GitHub", href: PROFILE.links.github, value: displayUrl(PROFILE.links.github) },
    { label: "LinkedIn", href: PROFILE.links.linkedin, value: displayUrl(PROFILE.links.linkedin) },
  ];

  return (
    <section aria-labelledby="contact" className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
      <SectionHeader id="contact" number="04" title="Contact" subtitle="Correspondence" sheet="5 / 5" />

      <div className="crop grid grid-cols-1 gap-10 border border-rule bg-paper-raised p-6 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:p-10">
        <div className="min-w-0">
          <p className="max-w-lg text-2xl leading-snug font-medium tracking-tight md:text-3xl">
            Open to opportunities, collaborations, or a good conversation about robots and code.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href={`mailto:${PROFILE.email}`}
              className="font-mono text-lg break-all underline decoration-accent decoration-2 underline-offset-[6px] transition-colors hover:text-accent md:text-xl"
            >
              {PROFILE.email}
            </a>
            <CopyButton value={PROFILE.email} label="Copy email" />
          </div>
        </div>

        <dl className="min-w-0 self-end border-t border-rule-strong">
          {links.map((l) => (
            <div key={l.label} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-rule py-3">
              <dt className="annot">{l.label}</dt>
              <dd className="min-w-0 [overflow-wrap:anywhere]">
                <a href={l.href} target="_blank" rel="noopener noreferrer" className="link-ink">
                  {breakAfterSlashes(l.value)}<span className="sr-only"> (opens in a new tab)</span>
                </a>
              </dd>
            </div>
          ))}
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-rule py-3">
            <dt className="annot">Resume</dt>
            <dd className="min-w-0 [overflow-wrap:anywhere]">
              <a href={resume.href} {...(resume.isFile ? { target: "_blank", rel: "noopener" } : {})} className="link-ink">
                {resume.isFile ? "Download PDF" : "Request by email"}
              </a>
            </dd>
          </div>
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-rule py-3">
            <dt className="annot">Based in</dt>
            <dd className="min-w-0">{PROFILE.location}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
