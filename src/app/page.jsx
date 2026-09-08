"use client";

import { projects } from '@/lib/data/projects';
import { useLocale } from '@/lib/hooks/useLocale';
import { useShellEligible } from '@/lib/hooks/useShellEligible';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import PaperFallback from '@/components/document/PaperFallback';
import Shell from '@/components/shell/Shell';

export default function Home() {
  const { locale } = useLocale();
  const shell = useShellEligible();
  // Asked once, here, so the shell is handed an answer rather than going to the
  // browser for it.
  const calm = useMediaQuery('(prefers-reduced-motion: reduce)');

  if (shell) return <Shell systems={projects} locale={locale} calm={calm} />;

  return <PaperFallback />;
}
