"use client";

import AccessBadge from '@/components/work/AccessBadge';

const COPY = {
  log: { id: 'LOG', en: 'LOG' },
  filters: { id: 'FILTER · KLIK ATAU KETIK', en: 'FILTERS · CLICK OR TYPE' },
  inView: { id: 'SISTEM YANG TAMPIL', en: 'SYSTEMS IN VIEW' },
  note: {
    id: 'Sistem yang diredupkan tetap di peta. Tidak ada yang disembunyikan, hanya didorong ke belakang.',
    en: 'Dimmed systems stay on the map. Nothing is ever hidden, only pushed back.',
  },
};

// Chips carry the exact text a visitor would type. That is the whole trick:
// clicking one and typing it produce the same log line.
const CHIPS = [
  { key: 'client', value: 'rsu-nirwana' },
  { key: 'client', value: 'bpn' },
  { key: 'year', value: '2026' },
  { key: 'access', value: 'public' },
  // Bukan `soap`: protokol itu sudah keluar dari IDRG, dan chip yang menyaring
  // sampai kosong bukan chip. `laravel` dan `mysql` tidak bisa dipakai karena
  // ada di kesembilan sistem.
  { key: 'stack', value: 'livewire' },
];

const LINE_COLOUR = {
  history: 'text-muted-deep',
  command: 'text-body-soft',
  result: 'text-amber',
};

export default function LogRail({
  systems, locale, log, filters, selected, dimmed, onChip, onReset, onSelect,
}) {
  return (
    <div className="bg-surface border-r border-rule px-4 py-[18px] flex flex-col gap-3.5 overflow-hidden min-h-0">
      <div className="font-mono text-[10px] tracking-[.12em] text-muted">{COPY.log[locale]}</div>
      <div aria-live="polite" className="font-mono text-[11.5px] leading-[1.95] flex-none">
        {log.map((line, i) => (
          <div key={`${line.text}-${i}`} className={LINE_COLOUR[line.kind]}>{line.text}</div>
        ))}
      </div>

      <div className="font-mono text-[10px] tracking-[.12em] text-muted">{COPY.filters[locale]}</div>
      <div className="flex flex-wrap gap-1.5 flex-none">
        {CHIPS.map((c) => {
          const label = `${c.key}:${c.value}`;
          const on = filters[c.key] === c.value;
          return (
            <button
              key={label}
              type="button"
              aria-pressed={on}
              onClick={() => onChip(c.key, c.value)}
              className={`font-mono text-[11px] px-2 py-1 border transition-colors duration-200 ${
                on ? 'border-amber text-amber' : 'border-rule text-muted'
              }`}
            >
              {on ? `${label} ×` : label}
            </button>
          );
        })}
        <button
          type="button"
          onClick={onReset}
          className="font-mono text-[11px] px-2 py-1 border border-rule text-muted"
        >
          reset
        </button>
      </div>

      <div className="font-mono text-[10px] tracking-[.12em] text-muted">{COPY.inView[locale]}</div>
      <ul className="overflow-y-auto min-h-0 flex-1 m-0 p-0 list-none">
        {systems.map((s) => (
          <li
            key={s.slug}
            className="border-t border-surface-plate transition-opacity duration-700"
            style={{ opacity: dimmed.has(s.slug) ? 0.45 : 1 }}
          >
            <button
              type="button"
              aria-pressed={selected === s.slug}
              onClick={() => onSelect(s.slug)}
              className={`w-full grid grid-cols-[1fr_auto] items-center gap-2 text-left px-1.5 py-[7px] text-[13px] ${
                selected === s.slug ? 'bg-surface-plate' : ''
              }`}
            >
              <span className="truncate">{s.shortName[locale]}</span>
              <AccessBadge access={s.access} locale={locale} short />
            </button>
          </li>
        ))}
      </ul>

      <p className="font-mono text-[10px] text-muted-deep flex-none m-0">{COPY.note[locale]}</p>
    </div>
  );
}
