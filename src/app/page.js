"use client";

import { projects } from '@/lib/data/projects';
import { useLocale } from '@/lib/hooks/useLocale';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import Canvas from '@/components/canvas/Canvas';
import MobileList from '@/components/canvas/MobileList';

export default function Home() {
  const { locale } = useLocale();
  const isNarrow = useMediaQuery('(max-width: 767px)');

  return isNarrow
    ? <MobileList projects={projects} locale={locale} />
    : <Canvas projects={projects} locale={locale} />;
}
