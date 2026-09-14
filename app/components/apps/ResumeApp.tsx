import { CERTIFICATIONS, EDUCATION, EXPERIENCE, PROFILE } from "../../data";
import { AppTitle, buttonClass, Card, Icon, SectionHeading } from "../ui";

const resumeRequest = `mailto:${PROFILE.email}?subject=${encodeURIComponent("Resume request")}`;

export default function ResumeApp() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <AppTitle>Resume</AppTitle>
        <a href={resumeRequest} className={buttonClass}>
          <Icon>📧</Icon> Request full resume
        </a>
      </div>

      <section>
        <SectionHeading>Education</SectionHeading>
        <ul className="flex flex-col gap-2.5">
          {EDUCATION.map((edu) => (
            <li key={edu.school}>
              <Card className="flex items-center justify-between gap-3 p-3">
                <div>
                  <h4 className="text-sm font-semibold text-fg-strong">{edu.school}</h4>
                  <p className="text-xs text-fg-muted">{edu.degree}</p>
                </div>
                <span className="shrink-0 text-xs text-fg-muted">{edu.period}</span>
              </Card>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <SectionHeading>Experience</SectionHeading>
        <ul className="flex flex-col gap-3">
          {EXPERIENCE.map((exp) => (
            <li key={`${exp.company}-${exp.role}`}>
              <Card>
                <div className="mb-1.5 flex justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-semibold text-fg-strong">{exp.role}</h4>
                    <p className="text-xs text-os-accent">{exp.company}</p>
                  </div>
                  <span className="shrink-0 text-[11px] text-fg-muted">{exp.period}</span>
                </div>
                <ul className="flex list-disc flex-col gap-1 pl-4">
                  {exp.bullets.map((b) => (
                    <li key={b} className="text-xs leading-normal text-fg-muted">{b}</li>
                  ))}
                </ul>
              </Card>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <SectionHeading>Certifications</SectionHeading>
        <ul className="grid grid-cols-1 gap-2 @sm:grid-cols-2">
          {CERTIFICATIONS.map((cert) => (
            <li key={cert.name}>
              <Card className="flex h-full items-center gap-2 px-3 py-2.5">
                <Icon>{cert.emoji}</Icon>
                <div>
                  <p className="text-xs font-medium text-fg-strong">{cert.name}</p>
                  <p className="text-[11px] text-fg-muted">{cert.issuer}</p>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
