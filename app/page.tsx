import { PROFILE, SITE_URL, SKILLS } from "./data";
import ContactSection from "./components/site/ContactSection";
import ExperienceSection from "./components/site/ExperienceSection";
import Footer from "./components/site/Footer";
import Header from "./components/site/Header";
import Hero from "./components/site/Hero";
import SkillsSection from "./components/site/SkillsSection";
import WorkSection from "./components/site/WorkSection";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: PROFILE.name,
  url: SITE_URL,
  email: `mailto:${PROFILE.email}`,
  description: "Computer Engineering student building race car parts, competition robots, and AI tools.",
  sameAs: [PROFILE.links.github, PROFILE.links.linkedin],
  alumniOf: { "@type": "CollegeOrUniversity", name: "California Polytechnic State University, San Luis Obispo" },
  knowsAbout: SKILLS.flatMap((s) => s.items),
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        // Escape "<" so content can never close the script tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }}
      />
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <WorkSection />
        <ExperienceSection />
        <SkillsSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
