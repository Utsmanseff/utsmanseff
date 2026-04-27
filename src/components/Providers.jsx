"use client";

import { LocaleProvider } from '@/lib/hooks/useLocale';
import { ThemeProvider } from '@/lib/hooks/useTheme';

export default function Providers({ children }) {
  return (
    <ThemeProvider>
      <LocaleProvider>{children}</LocaleProvider>
    </ThemeProvider>
  );
}
