"use client";

import { ArrowUp } from 'lucide-react';
import { useLocale } from '@/lib/hooks/useLocale';
import LangSwitcher from '@/components/nav/LangSwitcher';

export default function Footer() {
  const { t } = useLocale();
  const year = new Date().getFullYear();
  return (
    <footer className="py-10 px-6 border-t border-rule">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono text-[10px] md:text-xs uppercase tracking-widest text-mute">
        <p>
          {t('footer.builtWith')} <span className="text-rule mx-1">·</span> © {year} Utsman
        </p>
        <div className="flex items-center gap-5">
          <LangSwitcher />
          <a
            href="#top"
            className="group inline-flex items-center gap-1.5 hover:text-amber transition-colors duration-200"
          >
            <span>{t('footer.backToTop')}</span>
            <ArrowUp
              size={12}
              className="transition-transform duration-300 ease-out group-hover:-translate-y-0.5"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
