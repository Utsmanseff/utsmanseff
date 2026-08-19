"use client";

import { LocaleProvider } from '@/lib/hooks/useLocale';

export default function Providers({ children }) {
  return <LocaleProvider>{children}</LocaleProvider>;
}
