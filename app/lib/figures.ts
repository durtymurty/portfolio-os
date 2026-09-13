// Pure helpers for case-study figures (no fs access — see projectImages.ts).

export const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".avif"];

export interface CaptionEntry {
  alt?: string;
  caption?: string;
}

export interface Figure {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption?: string;
}

export type Slot = { kind: "photo"; figure: Figure } | { kind: "pending"; index: number };

export const isImageFile = (name: string) =>
  !name.startsWith(".") && IMAGE_EXTENSIONS.some((ext) => name.toLowerCase().endsWith(ext));

/** Natural sort so "2.jpg" comes before "10.jpg". */
export const sortFiles = (names: string[]) =>
  [...names].sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));

/** Parse captions.json defensively — a typo in the file should never break the build. */
export function parseCaptions(raw: string | null): Record<string, CaptionEntry> {
  if (!raw) return {};
  try {
    const data: unknown = JSON.parse(raw);
    if (!data || typeof data !== "object" || Array.isArray(data)) return {};
    const out: Record<string, CaptionEntry> = {};
    for (const [file, value] of Object.entries(data)) {
      if (typeof value === "string") out[file] = { caption: value };
      else if (value && typeof value === "object") {
        const v = value as Record<string, unknown>;
        out[file] = {
          alt: typeof v.alt === "string" ? v.alt : undefined,
          caption: typeof v.caption === "string" ? v.caption : undefined,
        };
      }
    }
    return out;
  } catch {
    return {};
  }
}

/**
 * Fill `slotCount` figure slots in order. Extra photos beyond the slot count are
 * still shown (slots grow); missing photos become "pending" placeholders.
 */
export function fillSlots(figures: Figure[], slotCount: number): Slot[] {
  const total = Math.max(slotCount, figures.length);
  return Array.from({ length: total }, (_, i) =>
    figures[i] ? { kind: "photo", figure: figures[i] } : { kind: "pending", index: i },
  );
}
