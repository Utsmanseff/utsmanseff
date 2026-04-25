"use client";

import { useLocale } from '@/lib/hooks/useLocale';
import { LOCALES } from '@/lib/i18n/config';

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
              locale === loc ? 'text-forest dark:text-cream font-bold' : 'text-mute hover:text-forest dark:hover:text-cream'
            }`}
            aria-pressed={locale === loc}
          >
            {loc}
          </button>
          {i < LOCALES.length - 1 && <span className="text-mute">/</span>}
        </span>
      ))}
    </div>
  );
}
