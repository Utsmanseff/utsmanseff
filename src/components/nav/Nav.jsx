"use client";

import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useLocale } from '@/lib/hooks/useLocale';
import LangSwitcher from './LangSwitcher';
import ThemeToggle from './ThemeToggle';

const SECTIONS = ['about', 'work', 'skills', 'contact'];

export default function Nav() {
  const { t } = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-cream/95 dark:bg-forest-deep/95 border-b border-rule backdrop-blur' : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#top" className="font-display text-xl font-semibold text-forest dark:text-cream">
          Utsman
        </a>

        <div className="hidden md:flex items-center gap-8">
          {SECTIONS.map((s) => (
            <a
              key={s}
              href={`#${s}`}
              className="text-sm text-mute hover:text-forest dark:hover:text-cream transition-colors"
            >
              {t(`nav.${s}`)}
            </a>
          ))}
          <div className="h-4 w-px bg-rule" />
          <LangSwitcher />
          <ThemeToggle />
        </div>

        <div className="md:hidden flex items-center gap-2">
          <LangSwitcher />
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? t('ui.closeMenu') : t('ui.openMenu')}
            className="p-2 text-forest dark:text-cream"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      {open && (
        <div className="md:hidden bg-cream dark:bg-forest-deep border-t border-rule">
          <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col gap-4">
            {SECTIONS.map((s) => (
              <a
                key={s}
                href={`#${s}`}
                onClick={() => setOpen(false)}
                className="font-display text-2xl text-forest dark:text-cream"
              >
                {t(`nav.${s}`)}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
