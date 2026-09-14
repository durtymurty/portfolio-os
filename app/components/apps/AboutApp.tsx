import { CERTIFICATIONS, CONTACT_LINKS, PROFILE } from "../../data";
import { Card, ExternalLink, Icon, SectionHeading } from "../ui";

const linkRow =
  "flex items-center gap-2.5 rounded-lg border border-white/5 bg-raised px-3 py-2 text-[13px] text-os-accent transition-colors hover:border-os-accent/30";

export default function AboutApp() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-5">
        <div aria-hidden="true" className="grid size-20 shrink-0 place-items-center rounded-full bg-linear-135 from-os-accent to-[#bc8cff] text-4xl">
          👨‍💻
        </div>
        <div>
          <h2 className="text-2xl font-bold text-fg-strong">{PROFILE.name}</h2>
          <p className="mt-1 text-sm text-os-accent">{PROFILE.title}</p>
          <p className="mt-0.5 text-xs text-fg-muted"><Icon>📍</Icon> {PROFILE.location}</p>
        </div>
      </div>

      <Card className="p-4">
        <p className="text-sm leading-relaxed">{PROFILE.bio}</p>
      </Card>

      <section>
        <SectionHeading>Contact</SectionHeading>
        <ul className="flex flex-col gap-2">
          {CONTACT_LINKS.map((item) => (
            <li key={item.label}>
              {item.external ? (
                <ExternalLink href={item.href} className={linkRow}>
                  <Icon>{item.icon}</Icon> {item.value}
                </ExternalLink>
              ) : (
                <a href={item.href} className={linkRow}>
                  <Icon>{item.icon}</Icon> {item.value}
                </a>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <SectionHeading>Certifications</SectionHeading>
        <ul className="flex flex-col gap-2">
          {CERTIFICATIONS.map((cert) => (
            <li key={cert.name}>
              <Card className="flex items-center gap-2.5 px-3 py-2.5">
                <Icon className="text-xl">{cert.emoji}</Icon>
                <div>
                  <p className="text-[13px] font-medium text-fg-strong">{cert.name}</p>
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
