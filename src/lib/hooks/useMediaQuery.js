"use client";

import { useCallback, useSyncExternalStore } from 'react';

// Read during render, not in an effect. An effect runs *after* paint, so a phone
// visitor was guaranteed one frame of the desktop canvas — mounted, measured and
// framed — before it was thrown away and replaced by the list.
export function useMediaQuery(query) {
  const subscribe = useCallback(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    },
    [query]
  );

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);

  // The server has no viewport. It renders the wide layout; the client corrects
  // it while hydrating, before the browser paints.
  const getServerSnapshot = () => false;

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
