import { CERTIFICATIONS, SKILLS } from "../../data";
import SectionHeader from "./SectionHeader";

export default function SkillsSection() {
  return (
    <section aria-labelledby="skills" className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
      <SectionHeader id="skills" number="03" title="Skills" subtitle="Bill of materials" sheet="4 / 5" />

      <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-left">
            <caption className="sr-only">Skills by category</caption>
            <thead>
              <tr className="annot border-y border-rule-strong">
                <th scope="col" className="w-16 py-2 pr-4 font-normal">Item</th>
                <th scope="col" className="w-40 py-2 pr-4 font-normal">Category</th>
                <th scope="col" className="py-2 font-normal">Components</th>
              </tr>
            </thead>
            <tbody>
              {SKILLS.map((group, i) => (
                <tr key={group.category} className="border-b border-rule align-top">
                  <td className="py-4 pr-4 font-mono text-sm text-accent">{String(i + 1).padStart(2, "0")}</td>
                  <th scope="row" className="py-4 pr-4 font-semibold">{group.category}</th>
                  <td className="py-3">
                    <ul className="flex flex-wrap gap-1.5">
                      {group.items.map((item) => (
                        <li key={item} className="border border-rule bg-paper-raised px-2 py-0.5 text-sm">{item}</li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <aside aria-labelledby="certs-title">
          <h3 id="certs-title" className="annot mb-3">Certifications</h3>
          <ul className="border-t border-rule-strong">
            {CERTIFICATIONS.map((cert) => (
              <li key={cert.name} className="border-b border-rule py-3">
                <p className="font-medium">{cert.name}</p>
                <p className="text-sm text-ink-muted">{cert.issuer}</p>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
}
