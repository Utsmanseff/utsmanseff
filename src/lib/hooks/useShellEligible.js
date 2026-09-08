"use client";

import { useMediaQuery } from './useMediaQuery';

// Two conditions, not three: the shell needs room, and it needs JavaScript. The
// server answers false, so the document is what gets rendered and the page is
// complete before a single script arrives.
//
// Reduced motion used to be the third, and it cost that visitor the console, the
// rail and the panel — an interface reduced, when what they asked for was motion
// reduced. The gate asks them instead and starts them on the still view. See
// Task 1 in docs/PROGRESS.md.
export function useShellEligible() {
  return useMediaQuery('(min-width: 1024px)');
}
