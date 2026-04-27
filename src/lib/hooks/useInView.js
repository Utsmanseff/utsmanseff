"use client";

import { useEffect, useRef, useState } from 'react';

export function useInView({ threshold = 0.1, rootMargin = '0px', once = false } = {}) {
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
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInView(true);
      return;
    }

    // No IntersectionObserver -> show after a frame
    if (typeof IntersectionObserver === 'undefined') {
      const id = requestAnimationFrame(() => setInView(true));
      return () => cancelAnimationFrame(id);
    }

    let raf1 = 0;
    let raf2 = 0;

    const trigger = (visible) => {
      if (raf1) cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);
      // Double rAF: ensures browser paints prior state before flipping,
      // so CSS transitions reliably fire instead of getting batched away
      // by React's concurrent commit phase.
      raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => setInView(visible));
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          trigger(true);
          if (once) observer.disconnect();
        } else if (!once) {
          trigger(false);
        }
      },
      { threshold, rootMargin }
    );
    observer.observe(node);

    // Safety net: if observer never fires (rare edge cases), force show after 1.5s
    const fallback = setTimeout(() => trigger(true), 1500);

    return () => {
      observer.disconnect();
      clearTimeout(fallback);
      if (raf1) cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);
    };
  }, [threshold, rootMargin, once]);

  return { ref, inView };
}
