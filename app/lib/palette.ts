export interface PaletteItem {
  id: string;
  group: string;
  label: string;
  /** Extra words that should match, e.g. "cv pdf" for the resume. */
  keywords?: string;
  hint?: string;
}

/**
 * Score how well `query` matches an item. Prefers prefix and word-start matches,
 * then substrings, then in-order subsequences ("fsae" → "Formula SAE…" via keywords).
 * Returns 0 for no match.
 */
export function scoreItem(item: PaletteItem, query: string): number {
  const q = query.trim().toLowerCase();
  if (!q) return 1;
  const label = item.label.toLowerCase();
  const haystack = `${label} ${item.keywords ?? ""} ${item.group}`.toLowerCase();

  if (label.startsWith(q)) return 100;
  if (label.split(/[\s\-/·]+/).some((w) => w.startsWith(q))) return 80;
  if (haystack.includes(q)) return 60;

  // Subsequence match, penalised by spread.
  let pos = -1;
  let first = -1;
  for (const ch of q) {
    pos = haystack.indexOf(ch, pos + 1);
    if (pos === -1) return 0;
    if (first === -1) first = pos;
  }
  return Math.max(1, 40 - (pos - first - q.length));
}

export function filterItems<T extends PaletteItem>(items: T[], query: string): T[] {
  return items
    .map((item, i) => ({ item, i, score: scoreItem(item, query) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || a.i - b.i)
    .map((r) => r.item);
}
