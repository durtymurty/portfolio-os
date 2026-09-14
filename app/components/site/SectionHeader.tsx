interface SectionHeaderProps {
  id: string;
  number: string;
  title: string;
  /** Drawing-sheet flavour text, e.g. "Bill of materials". */
  subtitle: string;
  sheet: string;
}

export default function SectionHeader({ id, number, title, subtitle, sheet }: SectionHeaderProps) {
  return (
    <div className="mb-10">
      <div className="flex items-end justify-between gap-4">
        <h2 id={id} className="flex items-baseline gap-4 text-3xl font-semibold tracking-tight md:text-4xl">
          <span className="font-mono text-base font-normal text-accent">{number}</span>
          {title}
        </h2>
        <p className="annot hidden pb-1.5 sm:block">
          {subtitle} · Sheet {sheet}
        </p>
      </div>
      <div aria-hidden="true" className="ruler mt-4" />
    </div>
  );
}
