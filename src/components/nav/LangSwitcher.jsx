"use client";

import { useLocale } from '@/lib/hooks/useLocale';
import { LOCALES } from '@/lib/i18n/config';

// One layer now, so the switcher no longer takes a tone. It used to hardcode
// tokens that no longer exist (`text-forest dark:text-cream`), and silently
// inherited the body's ink — 1.01:1 against the dark ground, invisible.
export default function LangSwitcher() {
  const { locale, setLocale, t } = useLocale();

  return (
    <div
      role="group"
      aria-label={t('ui.toggleLang')}
      className="flex items-center gap-1 font-mono text-xs uppercase"
    >
      {LOCALES.map((loc, i) => (
        <span key={loc} className="flex items-center">
          <button
            type="button"
            onClick={() => setLocale(loc)}
            className={`px-1 transition-colors ${
              locale === loc ? 'text-ink font-bold' : 'text-muted hover:text-ink'
            }`}
            aria-pressed={locale === loc}
          >
            {loc}
          </button>
          {i < LOCALES.length - 1 && <span className="text-muted">/</span>}
        </span>
      ))}
    </div>
  );
}
