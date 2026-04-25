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
      className="p-2 text-mute hover:text-forest dark:hover:text-cream transition-colors"
    >
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
