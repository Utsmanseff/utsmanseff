"use client";

import Nav from '@/components/nav/Nav';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Skills from '@/components/sections/Skills';
import Experience from '@/components/sections/Experience';
import Education from '@/components/sections/Education';
import SelectedWork from '@/components/sections/SelectedWork';
import OtherProjects from '@/components/sections/OtherProjects';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/sections/Footer';

export default function Portfolio() {
  return (
    <>
      <a href="#about" className="skip-link">Skip to content</a>
      <Nav />
      <main>
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Education />
        <SelectedWork />
        <OtherProjects />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
