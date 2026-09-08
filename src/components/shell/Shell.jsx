"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { meta } from '@/lib/data/meta';
import { useLocale } from '@/lib/hooks/useLocale';
import { EMPTY_FILTERS, isShown, toggleFilter, isFiltering } from '@/lib/shell/filters';
import { parseCommand, findSystem } from '@/lib/shell/commands';
import { useGatePassed } from '@/lib/hooks/useGatePassed';
import Gate from './Gate';
import TopBar from './TopBar';
import StatusBar from './StatusBar';
import FlatTable from './FlatTable';
import SelectedPanel from './SelectedPanel';
import LogRail from './LogRail';
import MapScene from './MapScene';
import Console from './Console';

export default function Shell({ systems, locale, calm = false }) {
  const { setLocale } = useLocale();
  const router = useRouter();
  const { passed, pass } = useGatePassed();
  // Reduced motion picks the still view as a starting point, not as a verdict:
  // the gate's other button is right there.
  const [view, setView] = useState(calm ? 'list' : 'map');
  const [selected, setSelected] = useState(null);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [log, setLog] = useState([{ text: '$ ls systems', kind: 'command' }]);
  const [cmd, setCmd] = useState('');
  const [focusToken, setFocusToken] = useState(0);
  const [leaving, setLeaving] = useState(false);

  // Ten lines, oldest dropped. The log is a record of intent, not a report:
  // it echoes what was asked for and never counts what came back.
  const say = (text, kind) => setLog((l) => [...l, { text, kind }].slice(-10));

  const applyFilter = (key, value) => {
    setFilters((f) => toggleFilter(f, key, value));
    say(`$ filter ${key}:${value}`, 'command');
  };

  const resetFilters = () => {
    setFilters(EMPTY_FILTERS);
    say('$ reset', 'command');
  };

  const RESULT = {
    noPage: { id: '  ringkasan saja · tidak ada halaman', en: '  summary only · no page' },
    unknown: { id: '  tidak dikenal · coba help', en: '  unknown · try help' },
    noMatch: { id: '  tidak ada yang cocok', en: '  no match' },
    help: {
      id: '  ls · open [nama] · filter [k:v] · reset · view iso/flat · lang id/en',
      en: '  ls · open [name] · filter [k:v] · reset · view iso/flat · lang id/en',
    },
    contact: `  ${meta.email} · ${meta.whatsapp}`,
  };

  const run = (raw) => {
    const intent = parseCommand(raw);
    setCmd('');
    if (intent.action === 'none') return;

    if (intent.action === 'filter') { applyFilter(intent.key, intent.value); return; }
    if (intent.action === 'reset') { resetFilters(); return; }
    if (intent.action === 'view') { setView(intent.view); say(`$ view ${intent.view === 'map' ? 'iso' : 'flat'}`, 'command'); return; }
    if (intent.action === 'lang') { setLocale(intent.lang); say(`$ lang ${intent.lang}`, 'command'); return; }
    if (intent.action === 'list') { say('$ ls systems', 'command'); return; }
    if (intent.action === 'help') { say('$ help', 'command'); say(RESULT.help[locale], 'result'); return; }
    if (intent.action === 'contact') { say('$ contact', 'command'); say(RESULT.contact, 'result'); return; }

    if (intent.action === 'open') {
      const found = findSystem(systems, intent.query);
      say(`$ open ${intent.query}`, 'command');
      if (!found) { say(RESULT.noMatch[locale], 'result'); return; }
      setSelected(found.slug);
      if (found.tier !== 'full') { say(RESULT.noPage[locale], 'result'); return; }
      router.push(`/kerja/${found.slug}`);
      return;
    }

    say(`$ ${intent.input}`, 'command');
    say(RESULT.unknown[locale], 'result');
  };

  // The gate fades rather than blinks: it stays mounted at opacity 0 for the
  // length of the fade, then unmounts when pass() flips `passed`. The view and
  // the console are set first, behind a still-opaque gate, so nothing is seen
  // changing. Reduced motion collapses the fade in CSS; the 700ms wait stays,
  // and an invisible element waiting is not something anyone can see.
  const enter = (nextView, seed) => {
    if (leaving) return;
    if (nextView) setView(nextView);
    if (seed) {
      setCmd(seed);
      setFocusToken((n) => n + 1);
    }
    setLeaving(true);
    setTimeout(pass, 700);
  };

  const dimmed = new Set(systems.filter((s) => !isShown(s, filters)).map((s) => s.slug));
  const years = systems.map((s) => Number(s.year));
  const span = `${Math.min(...years)}–${Math.max(...years)}`;
  const current = systems.find((s) => s.slug === selected) ?? null;

  return (
    <div data-testid="shell" className="relative h-[100dvh] grid grid-rows-[auto_1fr_44px_34px] overflow-hidden bg-ground">
      {/* display:contents, so the four rows stay grid items. The wrapper exists
          only to carry `inert`: while the gate is up, everything behind it must
          be out of reach of Tab and of a screen reader, or the gate is a picture
          of a gate. It lifts the moment the gate starts leaving, so the letter
          that opened it can land in the console. */}
      <div className="contents" inert={!passed && !leaving}>
        <TopBar
          locale={locale}
          view={view}
          filtering={isFiltering(filters)}
          onView={setView}
        />

        <div className="grid grid-cols-[290px_1fr_270px] min-h-0">
          <LogRail
            systems={systems}
            locale={locale}
            log={log}
            filters={filters}
            selected={selected}
            dimmed={dimmed}
            onChip={applyFilter}
            onReset={resetFilters}
            onSelect={setSelected}
          />
          {view === 'list' ? (
            <FlatTable
              systems={systems}
              locale={locale}
              selected={selected}
              dimmed={dimmed}
              onSelect={setSelected}
            />
          ) : (
            <MapScene
              systems={systems}
              locale={locale}
              selected={selected}
              dimmed={dimmed}
              onSelect={setSelected}
            />
          )}
          <SelectedPanel system={current} locale={locale} span={span} />
        </div>

        <Console
          locale={locale}
          value={cmd}
          onChange={setCmd}
          onRun={run}
          onEscape={resetFilters}
          focusToken={focusToken}
        />

        <StatusBar locale={locale} />
      </div>

      {!passed && (
        <Gate
          systems={systems}
          locale={locale}
          calm={calm}
          leaving={leaving}
          onEnter={enter}
        />
      )}
    </div>
  );
}
