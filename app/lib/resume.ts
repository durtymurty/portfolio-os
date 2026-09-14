import "server-only";
import { existsSync } from "node:fs";
import path from "node:path";
import { PROFILE } from "../data";

const RESUME_FILE = "resume.pdf";

/**
 * Link target for "Resume" buttons. Uses the hosted PDF when public/resume.pdf
 * exists (checked at build time for static pages), otherwise falls back to an
 * email request so the button is never a 404.
 */
export function getResume(): { href: string; isFile: boolean } {
  if (existsSync(path.join(process.cwd(), "public", RESUME_FILE))) {
    return { href: `/${RESUME_FILE}`, isFile: true };
  }
  return { href: `mailto:${PROFILE.email}?subject=${encodeURIComponent("Resume request")}`, isFile: false };
}
