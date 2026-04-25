"use client";

import Nav from '@/components/nav/Nav';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';

export default function Portfolio() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
      </main>
    </>
  );
}
