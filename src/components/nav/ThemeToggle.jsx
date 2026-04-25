"use client";

import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/lib/hooks/useTheme';
import { useLocale } from '@/lib/hooks/useLocale';

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const { t } = useLocale();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={t('ui.toggleTheme')}
      className="group p-2 text-mute hover:text-amber transition-colors duration-200"
    >
      <span className="inline-block transition-transform duration-300 ease-out group-hover:rotate-[20deg] group-hover:scale-110">
        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      </span>
    </button>
  );
}
