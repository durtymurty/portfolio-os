import { describe, expect, it } from "vitest";
import { filterItems, type PaletteItem } from "./palette";

const items: PaletteItem[] = [
  { id: "work", group: "Go to", label: "Work" },
  { id: "experience", group: "Go to", label: "Experience" },
  { id: "resume", group: "Actions", label: "Download resume", keywords: "cv pdf" },
  { id: "email", group: "Actions", label: "Copy email address" },
  { id: "fsae", group: "Case studies", label: "Formula SAE Carbon Chassis", keywords: "fsae racing" },
  { id: "os", group: "Actions", label: "Launch Portfolio OS", keywords: "desktop" },
];

const ids = (q: string) => filterItems(items, q).map((i) => i.id);

describe("palette filtering", () => {
  it("returns everything in original order for an empty query", () => {
    expect(ids("")).toEqual(items.map((i) => i.id));
  });

  it("ranks prefix matches first", () => {
    expect(ids("ex")[0]).toBe("experience");
  });

  it("matches word starts inside labels", () => {
    expect(ids("resume")[0]).toBe("resume");
    expect(ids("carbon")[0]).toBe("fsae");
  });

  it("matches keywords", () => {
    expect(ids("cv")).toContain("resume");
    expect(ids("fsae")[0]).toBe("fsae");
    expect(ids("desktop")).toEqual(["os"]);
  });

  it("supports loose subsequence matches", () => {
    expect(ids("cpy eml")).toContain("email");
  });

  it("returns nothing for gibberish", () => {
    expect(ids("zzqx")).toEqual([]);
  });
});
