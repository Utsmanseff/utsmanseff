"use client";

import { useState } from 'react';
import { EMPTY_FILTERS, isShown, isFiltering } from '@/lib/shell/filters';
import TopBar from './TopBar';
import StatusBar from './StatusBar';
import FlatTable from './FlatTable';
import SelectedPanel from './SelectedPanel';

export default function Shell({ systems, locale }) {
  const [view, setView] = useState('map');
  const [selected, setSelected] = useState(null);
  const [filters] = useState(EMPTY_FILTERS);

  const dimmed = new Set(systems.filter((s) => !isShown(s, filters)).map((s) => s.slug));
  const years = systems.map((s) => Number(s.year));
  const span = `${Math.min(...years)}–${Math.max(...years)}`;
  const current = systems.find((s) => s.slug === selected) ?? null;

  return (
    <div data-testid="shell" className="h-[100dvh] grid grid-rows-[auto_1fr_34px] overflow-hidden bg-ground">
      <TopBar
        locale={locale}
        view={view}
        filtering={isFiltering(filters)}
        onView={setView}
      />

      <div className="grid grid-cols-[290px_1fr_270px] min-h-0">
        <div className="bg-surface border-r border-rule" />
        {view === 'list' ? (
          <FlatTable
            systems={systems}
            locale={locale}
            selected={selected}
            dimmed={dimmed}
            onSelect={setSelected}
          />
        ) : (
          <div className="min-h-0" />
        )}
        <SelectedPanel system={current} locale={locale} span={span} />
      </div>

      <StatusBar locale={locale} />
    </div>
  );
}
