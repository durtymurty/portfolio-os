"use client";

import { useState } from "react";
import { CONTACT_LINKS, PROFILE } from "../../data";
import { AppTitle, ExternalLink, Icon } from "../ui";

const cardClass =
  "flex items-center gap-3.5 rounded-xl border border-line bg-raised p-4 transition-colors hover:border-os-accent/30 hover:bg-white/[0.06]";

export default function ContactApp() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked (permissions / insecure context); the email is still selectable text.
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <AppTitle>Contact Me</AppTitle>
      <p className="text-sm leading-relaxed text-fg-muted">
        I&apos;m always open to new opportunities, collaborations, or just a good conversation about tech. Reach out!
      </p>
      <ul className="flex flex-col gap-2.5">
        {CONTACT_LINKS.map((item) => {
          const body = (
            <>
              <Icon className="text-2xl">{item.icon}</Icon>
              <span>
                <span className="block text-[11px] tracking-widest text-fg-muted uppercase">{item.label}</span>
                <span className="mt-0.5 block text-sm font-medium text-fg-strong">{item.value}</span>
              </span>
            </>
          );
          return (
            <li key={item.label}>
              {item.external ? (
                <ExternalLink href={item.href} className={cardClass}>{body}</ExternalLink>
              ) : (
                <div className="flex gap-2">
                  <a href={item.href} className={`${cardClass} flex-1`}>{body}</a>
                  <button type="button" onClick={copyEmail} className={`${cardClass} shrink-0 text-xs text-os-accent`}>
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <p role="status" className="sr-only">{copied ? "Email address copied to clipboard" : ""}</p>
    </div>
  );
}
