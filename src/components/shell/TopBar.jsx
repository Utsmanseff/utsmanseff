"use client";

import LangSwitcher from '@/components/nav/LangSwitcher';

const COPY = {
  skip: { id: 'LEWATI PETA → DAFTAR SISTEM', en: 'SKIP MAP → SYSTEM LIST' },
  view: { id: 'TAMPILAN', en: 'VIEW' },
  iso: { id: 'ISO', en: 'ISO' },
  flat: { id: 'DATAR', en: 'FLAT' },
  filtered: { id: 'TERSARING', en: 'FILTERED' },
};

export default function TopBar({ locale, view, filtering, onView }) {
  return (
    <div className="border-b border-rule px-6 py-2.5 flex items-center justify-between font-mono text-[11px] tracking-[.1em] text-muted">
      <div className="flex items-center gap-5">
        <span className="text-ink">UTSMAN</span>
        <span>FULLSTACK · BANJARBARU</span>
        <button
          type="button"
          onClick={() => onView('list')}
          className="text-amber border border-rule px-2 py-[3px] whitespace-nowrap"
        >
          {COPY.skip[locale]}
        </button>
      </div>

      <div className="flex items-center gap-5">
        <span>
          {COPY.view[locale]}{' '}
          <button type="button" onClick={() => onView('map')} className={view === 'map' ? 'text-amber' : ''}>
            {COPY.iso[locale]}
          </button>
          {' / '}
          <button type="button" onClick={() => onView('list')} className={view === 'list' ? 'text-amber' : ''}>
            {COPY.flat[locale]}
          </button>
        </span>
        <span className="text-amber">{filtering ? COPY.filtered[locale] : ''}</span>
        <LangSwitcher />
      </div>
    </div>
  );
}
