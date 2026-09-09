"use client";

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { meta } from '@/lib/data/meta';
import { useLocale } from '@/lib/hooks/useLocale';
import { EMPTY_FILTERS, isShown, toggleFilter, isFiltering } from '@/lib/shell/filters';
import { parseCommand, findSystem } from '@/lib/shell/commands';
import { moveTo } from '@/lib/nav/moveTo';
import TopBar from './TopBar';
import StatusBar from './StatusBar';
import FlatTable from './FlatTable';
import SelectedPanel from './SelectedPanel';
import LogRail from './LogRail';
import MapScene from './MapScene';
import Console from './Console';

export default function Shell({ systems, locale, view: initialView, seed = '', calm = false }) {
  const { setLocale } = useLocale();
  const router = useRouter();
  // The URL decides which view opens; `calm` is only the fallback for a caller
  // that has no opinion. Reduced motion picks the still view as a starting
  // point, not as a verdict — the gate's other door is one back button away.
  const [view, setView] = useState(initialView ?? (calm ? 'list' : 'map'));
  const [selected, setSelected] = useState(null);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [log, setLog] = useState([{ text: '$ ls systems', kind: 'command' }]);
  const [cmd, setCmd] = useState(seed);

  // Dibaca pintu saat ditekan, tidak pernah saat render — jadi ia tidak perlu
  // memicu satu pun.
  const angleRef = useRef(-40);

  // The URL follows the view rather than leading it. replace(), so switching
  // back and forth does not fill the history; and local state, because a URL
  // that led would remount Shell and take the filters and the whole log with it.
  const changeView = (next) => {
    setView(next);
    router.replace(next === 'list' ? '/sistem?tampilan=datar' : '/sistem', { scroll: false });
  };

  // Satu pintu, dua pemanggil: tautan di panel kanan dan `open` di konsol.
  // Entri riwayat yang sedang berdiri ditimpa dengan titik pulang, lalu halaman
  // baca didorong di atasnya — jadi tombol kembali browser mendarat tepat di URL
  // berparameter ini dan peta pulih dengan sistem serta sudut yang ditinggalkan.
  // Tidak ada penyimpanan; URL yang mengingat.
  //
  // history.replaceState, BUKAN router.replace. Terukur di Chrome 148:
  // router.replace menjadwalkan transisi yang belum sempat commit sebelum push
  // berikutnya jalan, jadi entri lama tidak pernah tertimpa dan tombol kembali
  // mendarat di `/sistem` polos. replaceState menimpanya saat itu juga — dan ia
  // tidak memicu render, yang memang tidak diinginkan di sini karena kita sedang
  // meninggalkan halaman ini.
  const openSystem = (slug) => {
    const params = new URLSearchParams({
      pilih: slug,
      sudut: String(Math.round(angleRef.current)),
    });
    if (view === 'list') params.set('tampilan', 'datar');
    window.history.replaceState(null, '', `/sistem?${params}`);
    moveTo(router, `/kerja/${slug}`, 'zoom');
  };

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
    if (intent.action === 'view') { changeView(intent.view); say(`$ view ${intent.view === 'map' ? 'iso' : 'flat'}`, 'command'); return; }
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
      openSystem(found.slug);
      return;
    }

    say(`$ ${intent.input}`, 'command');
    say(RESULT.unknown[locale], 'result');
  };

  const dimmed = new Set(systems.filter((s) => !isShown(s, filters)).map((s) => s.slug));
  const years = systems.map((s) => Number(s.year));
  const span = `${Math.min(...years)}–${Math.max(...years)}`;
  const current = systems.find((s) => s.slug === selected) ?? null;

  return (
    <div data-testid="shell" className="h-[100dvh] grid grid-rows-[auto_1fr_44px_34px] overflow-hidden bg-ground">
      <TopBar
        locale={locale}
        view={view}
        filtering={isFiltering(filters)}
        onView={changeView}
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
            angleRef={angleRef}
          />
        )}
        <SelectedPanel system={current} locale={locale} span={span} onOpen={openSystem} />
      </div>

      <Console
        locale={locale}
        value={cmd}
        onChange={setCmd}
        onRun={run}
        onEscape={resetFilters}
      />

      <StatusBar locale={locale} />
    </div>
  );
}
