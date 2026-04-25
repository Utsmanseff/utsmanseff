"use client";

import Nav from '@/components/nav/Nav';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Skills from '@/components/sections/Skills';
import Experience from '@/components/sections/Experience';
import Education from '@/components/sections/Education';
import SelectedWork from '@/components/sections/SelectedWork';
import OtherProjects from '@/components/sections/OtherProjects';

export default function Portfolio() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Education />
        <SelectedWork />
        <OtherProjects />
      </main>
    </>
  );
}
