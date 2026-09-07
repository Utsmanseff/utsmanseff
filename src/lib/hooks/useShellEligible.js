"use client";

import { useMediaQuery } from './useMediaQuery';

// Three conditions, all of them honest defaults: the shell needs room, it needs
// JavaScript, and it must not run for someone who asked for less motion. The
// server answers false for all three, so the document is what gets rendered and
// the page is complete before a single script arrives.
export function useShellEligible() {
  const wide = useMediaQuery('(min-width: 1024px)');
  const calm = useMediaQuery('(prefers-reduced-motion: reduce)');
  return wide && !calm;
}
