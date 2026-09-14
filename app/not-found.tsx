import Link from "next/link";
import Footer from "./components/site/Footer";
import Header from "./components/site/Header";

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main" tabIndex={-1} className="mx-auto grid min-h-[60vh] max-w-6xl place-items-center px-5 py-20 outline-none md:px-8">
        <div className="crop w-full max-w-xl border border-rule bg-paper-raised p-8 text-center md:p-12">
          <p className="annot text-accent">Err. 404 · Part not found</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">This drawing doesn&apos;t exist.</h1>
          <p className="mt-4 text-ink-muted">The page may have moved, or the link has a typo.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/" className="inline-flex h-11 items-center rounded-sm bg-ink px-5 font-medium text-paper hover:bg-accent">
              Back to home
            </Link>
            <Link href="/#work" className="inline-flex h-11 items-center rounded-sm border border-ink px-5 font-medium hover:border-accent hover:text-accent">
              See my work
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
