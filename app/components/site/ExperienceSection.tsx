import { EDUCATION, EXPERIENCE } from "../../data";
import SectionHeader from "./SectionHeader";

/** Revision letters, newest first gets the latest letter: C, B, A. */
const rev = (i: number, total: number) => String.fromCharCode(64 + total - i);

export default function ExperienceSection() {
  return (
    <section aria-labelledby="experience" className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
      <SectionHeader id="experience" number="02" title="Experience" subtitle="Revision history" sheet="3 / 5" />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
        <ol className="border-t border-rule-strong">
          {EXPERIENCE.map((exp, i) => (
            <li key={`${exp.company}-${exp.role}`} className="grid grid-cols-1 gap-x-6 gap-y-2 border-b border-rule py-6 sm:grid-cols-[3rem_11rem_minmax(0,1fr)]">
              <span aria-hidden="true" className="annot hidden pt-1 text-accent sm:block">Rev {rev(i, EXPERIENCE.length)}</span>
              <p className="annot pt-1 normal-case tracking-normal">{exp.period}</p>
              <div>
                <h3 className="text-lg font-semibold tracking-tight">{exp.role}</h3>
                <p className="text-ink-muted">{exp.company}</p>
                <ul className="mt-3 space-y-1.5 text-sm leading-relaxed">
                  {exp.bullets.map((b) => (
                    <li key={b} className="flex gap-2.5">
                      <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 border border-ink-muted" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>

        <aside aria-labelledby="education-title">
          <h3 id="education-title" className="annot mb-3">Education</h3>
          {EDUCATION.map((edu) => (
            <div key={edu.school} className="crop border border-rule bg-paper-raised p-5">
              <p className="text-lg font-semibold tracking-tight">{edu.school}</p>
              <p className="mt-1 text-ink-muted">{edu.degree}</p>
              <p className="annot mt-4 normal-case tracking-normal">{edu.period}</p>
            </div>
          ))}
        </aside>
      </div>
    </section>
  );
}
