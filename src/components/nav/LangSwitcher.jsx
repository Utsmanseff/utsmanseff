"use client";

import { useLocale } from '@/lib/hooks/useLocale';
import { LOCALES } from '@/lib/i18n/config';

// The switcher stands on both layers, which have opposite grounds. It used to
// hardcode tokens that no longer exist (`text-forest dark:text-cream`), so it
// silently inherited the body's dark ink — 1.01:1 against the canvas, invisible.
export default function LangSwitcher({ tone = 'paper' }) {
  const { locale, setLocale, t } = useLocale();
  const active = tone === 'ground' ? 'text-ground-ink' : 'text-ink';
  const idle =
    tone === 'ground'
      ? 'text-ground-mute hover:text-ground-ink'
      : 'text-mute hover:text-ink';

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
              locale === loc ? `${active} font-bold` : idle
            }`}
            aria-pressed={locale === loc}
          >
            {loc}
          </button>
          {i < LOCALES.length - 1 && (
            <span className={tone === 'ground' ? 'text-ground-mute' : 'text-mute'}>/</span>
          )}
        </span>
      ))}
    </div>
  );
}
