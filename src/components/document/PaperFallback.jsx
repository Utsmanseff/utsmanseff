"use client";

import { useState } from 'react';
import { projects } from '@/lib/data/projects';
import { useLocale } from '@/lib/hooks/useLocale';
import { EMPTY_FILTERS, isShown, toggleFilter, isFiltering } from '@/lib/shell/filters';
import SystemsDocument from './SystemsDocument';
import FilterSheet from './FilterSheet';
import BottomBar from './BottomBar';

// The paper layer, whole: the document, the sheet that filters it, and the bar
// that opens the sheet. `/` and `/sistem` both land here below 1024px and
// without JavaScript, so it lives on its own rather than inside either route.
export default function PaperFallback() {
  const { locale } = useLocale();
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [sheetOpen, setSheetOpen] = useState(false);

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
