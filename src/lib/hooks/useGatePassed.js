"use client";

import { useCallback, useState } from 'react';

const KEY = 'gate';

// Private browsing throws on the property access itself in some browsers, so
// every touch is wrapped. A refusal reads as "not passed yet", which shows the
// gate — the safe end of the mistake.
function read() {
  try {
    return window.sessionStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
}

export function useGatePassed() {
  // Read while initialising, not in an effect. The shell never renders on the
  // server — page.jsx hands back the paper document until useMediaQuery says the
  // viewport is wide — so the gate never hydrates, and there is no server HTML
  // here for a first render to disagree with.
  const [passed, setPassed] = useState(read);

  const pass = useCallback(() => {
    setPassed(true);
    try {
      window.sessionStorage.setItem(KEY, '1');
    } catch {
      // Nothing to remember it with. The gate simply returns next time.
    }
  }, []);

  return { passed, pass };
}
