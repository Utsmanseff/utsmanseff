"use client";

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { dict } from '@/lib/i18n/dictionary';
import { DEFAULT_LOCALE, LOCALES, STORAGE_KEY } from '@/lib/i18n/config';

const LocaleContext = createContext(null);

function resolvePath(obj, path) {
  return path.split('.').reduce(
    (acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined),
    obj
  );
}

export function LocaleProvider({ children }) {
  const [locale, setLocaleState] = useState(DEFAULT_LOCALE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let initial = DEFAULT_LOCALE;
    try {
      // 1. URL query param
      const url = new URL(window.location.href);
      const qp = url.searchParams.get('lang');
      if (qp && LOCALES.includes(qp)) {
        initial = qp;
      } else {
        // 2. localStorage
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored && LOCALES.includes(stored)) {
          initial = stored;
        } else {
          // 3. browser
          const nav = navigator.language?.slice(0, 2);
          if (LOCALES.includes(nav)) initial = nav;
        }
      }
    } catch (_) {
      // SSR / no window
    }
    // Hydration: read URL/localStorage/navigator to resolve initial locale.
    // setState in effect is intentional (SSR uses DEFAULT_LOCALE, client may differ).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocaleState(initial);
    setHydrated(true);
  }, []);

  const setLocale = useCallback((next) => {
    if (!LOCALES.includes(next)) return;
    setLocaleState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
      document.documentElement.lang = next;
    } catch (_) {}
  }, []);

  const t = useCallback(
    (path) => {
      const value = resolvePath(dict[locale], path);
      return value === undefined ? path : value;
    },
    [locale]
  );

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t, hydrated }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used inside LocaleProvider');
  return ctx;
}
