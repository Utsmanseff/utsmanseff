"use client";

import { useState } from 'react';
import { projects } from '@/lib/data/projects';
import { useLocale } from '@/lib/hooks/useLocale';
import { useShellEligible } from '@/lib/hooks/useShellEligible';
import { EMPTY_FILTERS, isShown, toggleFilter, isFiltering } from '@/lib/shell/filters';
import SystemsDocument from '@/components/document/SystemsDocument';
import FilterSheet from '@/components/document/FilterSheet';
import BottomBar from '@/components/document/BottomBar';
import Shell from '@/components/shell/Shell';

export default function Home() {
  const { locale } = useLocale();
  const shell = useShellEligible();
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [sheetOpen, setSheetOpen] = useState(false);

  if (shell) return <Shell systems={projects} locale={locale} />;

  const dimmed = new Set(projects.filter((p) => !isShown(p, filters)).map((p) => p.slug));

  return (
    <>
      <SystemsDocument systems={projects} locale={locale} dimmed={dimmed} />
      {sheetOpen && (
        <FilterSheet
          systems={projects}
          filters={filters}
          locale={locale}
          onToggle={(key, value) => setFilters((f) => toggleFilter(f, key, value))}
          onReset={() => setFilters(EMPTY_FILTERS)}
          onClose={() => setSheetOpen(false)}
        />
      )}
      <BottomBar
        locale={locale}
        filtering={isFiltering(filters)}
        onOpenFilter={() => setSheetOpen(true)}
      />
    </>
  );
}
