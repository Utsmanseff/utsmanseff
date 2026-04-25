"use client";

import Nav from '@/components/nav/Nav';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import SelectedWork from '@/components/sections/SelectedWork';
import OtherProjects from '@/components/sections/OtherProjects';
import Skills from '@/components/sections/Skills';

export default function Portfolio() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <SelectedWork />
        <OtherProjects />
        <Skills />
      </main>
    </>
  );
}
