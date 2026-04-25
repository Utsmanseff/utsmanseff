"use client";

import { useEffect, useRef, useState } from 'react';

export function useInView({ threshold = 0, rootMargin = '0px', once = true } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Reduced motion -> show immediately, skip transition
    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      setInView(true);
      return;
    }

    // No IntersectionObserver -> show after a frame
    if (typeof IntersectionObserver === 'undefined') {
      const id = requestAnimationFrame(() => setInView(true));
      return () => cancelAnimationFrame(id);
    }

    let raf = 0;
    let fired = false;
    const trigger = () => {
      if (fired) return;
      fired = true;
      raf = requestAnimationFrame(() => setInView(true));
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          trigger();
          if (once) observer.disconnect();
        } else if (!once) {
          fired = false;
          setInView(false);
        }
      },
      { threshold, rootMargin }
    );
    observer.observe(node);

    // Safety net: if observer never fires (rare edge cases), force show after 1.5s
    const fallback = setTimeout(trigger, 1500);

    return () => {
      observer.disconnect();
      clearTimeout(fallback);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [threshold, rootMargin, once]);

  return { ref, inView };
}
