import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PROJECTS } from "../../data";
import Figures from "../../components/site/Figures";
import Footer from "../../components/site/Footer";
import Header from "../../components/site/Header";
import { fillSlots } from "../../lib/figures";
import { getProjectFigures } from "../../lib/projectImages";
import { partNumber } from "../../lib/projects";

const CASE_STUDIES = PROJECTS.filter((p) => p.caseStudy);

export const dynamicParams = false;

export function generateStaticParams() {
  return CASE_STUDIES.map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = CASE_STUDIES.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: project.name,
    description: project.description,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: { title: project.name, description: project.description, type: "article" },
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const project = CASE_STUDIES.find((p) => p.slug === slug);
  if (!project?.caseStudy) notFound();

  const { caseStudy } = project;
  const slots = fillSlots(getProjectFigures(project), caseStudy.photoSlots);
  const software = project.kind === "software";
  const challenges = caseStudy.challenges ?? [];

  // Section letters are assigned in order so optional sections never leave gaps (A, B, C…).
  const sections = [
    "overview",
    "stack",
    ...(challenges.length ? ["challenges"] : []),
    ...(slots.length ? ["figures"] : []),
  ];
  const letter = (id: string) => String.fromCharCode(65 + sections.indexOf(id));
  const idx = CASE_STUDIES.indexOf(project);
  const next = CASE_STUDIES[(idx + 1) % CASE_STUDIES.length];

  const specs = [
    ["Organization", project.org],
    ["Role", project.role],
    ["Period", project.period],
    ["Location", caseStudy.location],
  ].filter((row): row is [string, string] => Boolean(row[1]));

  return (
    <>
      <Header />
      <main id="main" tabIndex={-1} className="mx-auto max-w-6xl px-5 pt-10 pb-20 outline-none md:px-8 md:pt-14">
        <nav aria-label="Breadcrumb" className="annot mb-8">
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link href="/" className="hover:text-ink">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/#work" className="hover:text-ink">Work</Link></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-accent">{partNumber(project.slug)}</li>
          </ol>
        </nav>

        <header className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-end">
          <div>
            <p className="annot mb-4">{project.kind} · Case study</p>
            <h1 className="text-4xl leading-[1.05] font-semibold tracking-tight text-balance md:text-6xl">{project.name}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">{project.description}</p>
          </div>

          <dl className="border-t border-l border-rule-strong text-sm">
            {specs.map(([label, value]) => (
              <div key={label} className="grid grid-cols-[7.5rem_minmax(0,1fr)] border-r border-b border-rule-strong">
                <dt className="annot border-r border-rule-strong px-3 py-2.5 text-[10px]">{label}</dt>
                <dd className="px-3 py-2 font-medium">{value}</dd>
              </div>
            ))}
            {project.highlight && (
              <div className="grid grid-cols-[7.5rem_minmax(0,1fr)] border-r border-b border-rule-strong">
                <dt className="annot border-r border-rule-strong px-3 py-2.5 text-[10px]">Note</dt>
                <dd className="px-3 py-2 font-medium text-accent">{project.highlight}</dd>
              </div>
            )}
          </dl>
        </header>

        <div aria-hidden="true" className="ruler my-12" />

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_340px]">
          <section aria-labelledby="contributions">
            <h2 id="contributions" className="mb-6 flex items-baseline gap-3 text-2xl font-semibold tracking-tight">
              <span className="font-mono text-sm font-normal text-accent">{letter("overview")}</span>{" "}
              {software ? "How it works" : "What I did"}
            </h2>
            <ol className="space-y-4">
              {caseStudy.contributions.map((c, i) => (
                <li key={c} className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-2 border-b border-rule pb-4 leading-relaxed">
                  <span className="font-mono text-sm text-ink-muted">{String(i + 1).padStart(2, "0")}</span>
                  <span>{c}</span>
                </li>
              ))}
            </ol>
          </section>

          <aside aria-labelledby="process">
            <h2 id="process" className="mb-6 flex items-baseline gap-3 text-2xl font-semibold tracking-tight">
              <span className="font-mono text-sm font-normal text-accent">{letter("stack")}</span>{" "}
              {software ? "Stack" : "Processes"}
            </h2>
            <ul className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <li key={t} className="border border-rule bg-paper-raised px-2.5 py-1 font-mono text-sm">{t}</li>
              ))}
            </ul>
          </aside>
        </div>

        {challenges.length > 0 && (
          <section aria-labelledby="challenges" className="mt-16">
            <h2 id="challenges" className="mb-6 flex items-baseline gap-3 text-2xl font-semibold tracking-tight">
              <span className="font-mono text-sm font-normal text-accent">{letter("challenges")}</span> Engineering challenges
            </h2>
            <ol className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {challenges.map((c, i) => (
                <li key={c.title} className="crop flex flex-col border border-rule bg-paper-raised p-5">
                  <span className="annot text-accent">Issue {String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-2 text-lg leading-snug font-semibold tracking-tight">{c.title}</h3>
                  <p className="mt-3 leading-relaxed text-ink-muted">{c.detail}</p>
                </li>
              ))}
            </ol>
          </section>
        )}

        {slots.length > 0 && (
          <section aria-labelledby="figures" className="mt-16">
            <h2 id="figures" className="mb-6 flex items-baseline gap-3 text-2xl font-semibold tracking-tight">
              <span className="font-mono text-sm font-normal text-accent">{letter("figures")}</span> Figures
            </h2>
            <Figures slots={slots} slug={project.slug} />
          </section>
        )}

        <nav aria-label="More work" className="mt-20 flex flex-wrap items-center justify-between gap-4 border-t border-rule-strong pt-6">
          <Link href="/#work" className="link-ink">← All work</Link>
          {next && next !== project && (
            <Link href={`/work/${next.slug}`} className="group text-right">
              <span className="annot block">Next · {partNumber(next.slug)}</span>
              <span className="text-lg font-semibold tracking-tight group-hover:text-accent">{next.name} →</span>
            </Link>
          )}
        </nav>
      </main>
      <Footer />
    </>
  );
}
