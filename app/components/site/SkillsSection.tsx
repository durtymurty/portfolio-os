import { CERTIFICATIONS, SKILLS } from "../../data";
import SectionHeader from "./SectionHeader";

export default function SkillsSection() {
  return (
    <section aria-labelledby="skills" className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
      <SectionHeader id="skills" number="03" title="Skills" subtitle="Bill of materials" sheet="4 / 5" />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/*
          No min-width or horizontal scroll: on phones the Item column is hidden and each
          row's cells stack (category above its components) so everything wraps in place.
        */}
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">Skills by category</caption>
          <thead className="max-sm:sr-only">
            <tr className="annot border-y border-rule-strong">
              <th scope="col" className="w-16 py-2 pr-4 font-normal">Item</th>
              <th scope="col" className="w-44 py-2 pr-4 font-normal">Category</th>
              <th scope="col" className="py-2 font-normal">Components</th>
            </tr>
          </thead>
          <tbody className="max-sm:border-t max-sm:border-rule-strong">
            {SKILLS.map((group, i) => (
              <tr key={group.category} className="border-b border-rule align-top max-sm:flex max-sm:flex-col max-sm:py-4">
                <td className="py-4 pr-4 font-mono text-sm text-accent max-sm:hidden">{String(i + 1).padStart(2, "0")}</td>
                <th scope="row" className="py-4 pr-4 font-semibold max-sm:p-0 max-sm:pb-2">{group.category}</th>
                <td className="py-3 max-sm:p-0">
                  <ul className="flex flex-wrap gap-1.5">
                    {group.items.map((item) => (
                      <li key={item} className="max-w-full border border-rule bg-paper-raised px-2 py-0.5 text-sm [overflow-wrap:anywhere]">
                        {item}
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <aside aria-labelledby="certs-title">
          <h3 id="certs-title" className="annot mb-3">Certifications</h3>
          <ul className="border-t border-rule-strong">
            {CERTIFICATIONS.map((cert) => (
              <li key={cert.name} className="border-b border-rule py-3">
                <p className="font-medium">{cert.name}</p>
                <p className="text-sm text-ink-muted">
                  {cert.issuer}
                  {cert.date && <span className="font-mono text-xs"> · {cert.date}</span>}
                </p>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
}
