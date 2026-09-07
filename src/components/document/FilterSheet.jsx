"use client";

import { techNames, techSlug } from '@/lib/data/tech';

const COPY = {
  title: { id: 'FILTER', en: 'FILTER' },
  reset: { id: 'ATUR ULANG', en: 'RESET' },
  client: { id: 'KLIEN', en: 'CLIENT' },
  access: { id: 'AKSES', en: 'ACCESS' },
  stack: { id: 'STACK', en: 'STACK' },
  close: { id: 'KETUK UNTUK MENUTUP', en: 'TAP TO CLOSE' },
  apply: { id: 'TERAPKAN', en: 'APPLY' },
};

const ACCESS = ['public', 'internal', 'none'];

function Chip({ label, active, onClick }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`font-mono text-[11px] px-3.5 py-2.5 border transition-colors duration-200 ${
        active ? 'border-amber text-amber' : 'border-rule text-muted'
      }`}
    >
      {label}
    </button>
  );
}

// The sheet is the phone's console: same filter vocabulary, thumb-sized.
export default function FilterSheet({ systems, filters, locale, onToggle, onReset, onClose }) {
  const clients = [...new Map(systems.map((s) => [s.clientKey, s.client])).entries()];

  return (
    <div className="sticky bottom-0 bg-ground text-ink px-[18px] pt-3.5 pb-[18px] flex flex-col gap-3">
      <div className="w-10 h-[3px] bg-plate-edge-2 mx-auto" />

      <div className="flex items-center justify-between font-mono text-[11px] text-muted">
        <span>{COPY.title[locale]}</span>
        <button type="button" onClick={onReset} className="text-amber">
          {COPY.reset[locale]}
        </button>
      </div>

      {[
        [COPY.client[locale], clients.map(([key, label]) => ({ key: 'client', value: key, label }))],
        [COPY.access[locale], ACCESS.map((a) => ({ key: 'access', value: a, label: a }))],
        [COPY.stack[locale], techNames(systems).map((t) => ({ key: 'stack', value: techSlug(t), label: t }))],
      ].map(([groupLabel, chips]) => (
        <div key={groupLabel}>
          <div className="font-mono text-[10px] tracking-[.12em] text-muted mb-2">{groupLabel}</div>
          <div className="flex flex-wrap gap-2">
            {chips.map((c) => (
              <Chip
                key={`${c.key}:${c.value}`}
                label={c.label}
                active={filters[c.key] === c.value}
                onClick={() => onToggle(c.key, c.value)}
              />
            ))}
          </div>
        </div>
      ))}

      <div className="flex items-center justify-between font-mono text-[11px] text-muted pt-1">
        <button type="button" onClick={onClose}>{COPY.close[locale]}</button>
        <button type="button" onClick={onClose} className="text-amber">{COPY.apply[locale]}</button>
      </div>
    </div>
  );
}
