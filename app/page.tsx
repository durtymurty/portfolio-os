import ContactSection from "./components/site/ContactSection";
import ExperienceSection from "./components/site/ExperienceSection";
import Footer from "./components/site/Footer";
import Header from "./components/site/Header";
import Hero from "./components/site/Hero";
import SkillsSection from "./components/site/SkillsSection";
import WorkSection from "./components/site/WorkSection";

export default function Home() {
  return (
    <>
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
