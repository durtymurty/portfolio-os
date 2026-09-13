import { describe, expect, it } from "vitest";
import { fillSlots, isImageFile, parseCaptions, sortFiles, type Figure } from "./figures";

const fig = (n: number): Figure => ({ src: `/work/x/${n}.jpg`, width: 800, height: 600, alt: `f${n}` });

describe("figures", () => {
  it("recognises image files and ignores the rest", () => {
    expect(["01.JPG", "a.webp", "captions.json", ".DS_Store", "notes.txt", "b.avif"].filter(isImageFile)).toEqual([
      "01.JPG",
      "a.webp",
      "b.avif",
    ]);
  });

  it("sorts naturally", () => {
    expect(sortFiles(["10-tub.jpg", "2-layup.jpg", "1-mold.jpg"])).toEqual(["1-mold.jpg", "2-layup.jpg", "10-tub.jpg"]);
  });

  it("fills slots in order and marks the rest pending", () => {
    const slots = fillSlots([fig(1)], 3);
    expect(slots.map((s) => s.kind)).toEqual(["photo", "pending", "pending"]);
  });

  it("grows past the slot count when more photos are added", () => {
    expect(fillSlots([fig(1), fig(2), fig(3), fig(4)], 3)).toHaveLength(4);
  });

  it("parses captions as strings or objects and survives bad JSON", () => {
    expect(parseCaptions('{"1.jpg": "Layup", "2.jpg": {"alt": "Tub", "caption": "Chassis tub"}}')).toEqual({
      "1.jpg": { caption: "Layup" },
      "2.jpg": { alt: "Tub", caption: "Chassis tub" },
    });
    expect(parseCaptions("{ not json")).toEqual({});
    expect(parseCaptions("[1,2]")).toEqual({});
    expect(parseCaptions(null)).toEqual({});
  });
});
