import Image from "next/image";
import type { Slot } from "../../lib/figures";

const figNo = (i: number) => String(i + 1).padStart(2, "0");

export default function Figures({ slots, slug }: { slots: Slot[]; slug: string }) {
  const isDev = process.env.NODE_ENV === "development";

  return (
    <ol className="grid gap-6 sm:grid-cols-2">
      {slots.map((slot, i) => (
        <li key={i} className={slots.length % 2 === 1 && i === 0 ? "sm:col-span-2" : undefined}>
          {slot.kind === "photo" ? (
            <figure>
              <a
                href={slot.figure.src}
                target="_blank"
                rel="noopener"
                className="crop block border border-rule bg-paper-raised p-2"
              >
                <Image
                  src={slot.figure.src}
                  alt={slot.figure.alt}
                  width={slot.figure.width}
                  height={slot.figure.height}
                  sizes="(min-width: 1152px) 540px, (min-width: 640px) 50vw, 100vw"
                  className="h-auto w-full"
                />
                <span className="sr-only"> (open full size in a new tab)</span>
              </a>
              <figcaption className="mt-2 flex gap-3 text-sm">
                <span className="annot shrink-0 pt-0.5 text-accent">Fig. {figNo(i)}</span>
                {slot.figure.caption && <span className="text-ink-muted">{slot.figure.caption}</span>}
              </figcaption>
            </figure>
          ) : (
            <figure>
              {/* Placeholder slot: a drawing-style "image goes here" frame. */}
              <div
                data-photo-slot={`${slug}/${figNo(i)}`}
                className="relative grid aspect-[4/3] place-items-center border border-dashed border-rule-strong bg-paper-raised"
              >
                <svg aria-hidden="true" className="absolute inset-0 size-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <line x1="0" y1="0" x2="100" y2="100" className="stroke-rule" strokeWidth="0.3" vectorEffect="non-scaling-stroke" />
                  <line x1="100" y1="0" x2="0" y2="100" className="stroke-rule" strokeWidth="0.3" vectorEffect="non-scaling-stroke" />
                </svg>
                <div className="relative bg-paper-raised px-4 py-2 text-center">
                  <p className="annot">Photo pending</p>
                  {isDev && (
                    <p className="mt-1 font-mono text-[11px] text-accent">
                      public/work/{slug}/{figNo(i)}.jpg
                    </p>
                  )}
                </div>
              </div>
              <figcaption className="annot mt-2">Fig. {figNo(i)}</figcaption>
            </figure>
          )}
        </li>
      ))}
    </ol>
  );
}
