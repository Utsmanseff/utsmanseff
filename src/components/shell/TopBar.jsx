"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { moveTo } from '@/lib/nav/moveTo';
import LangSwitcher from '@/components/nav/LangSwitcher';

const COPY = {
  back: { id: 'KEMBALI', en: 'BACK' },
  skip: { id: 'LEWATI PETA → DAFTAR SISTEM', en: 'SKIP MAP → SYSTEM LIST' },
  view: { id: 'TAMPILAN', en: 'VIEW' },
  iso: { id: 'ISO', en: 'ISO' },
  flat: { id: 'DATAR', en: 'FLAT' },
  filtered: { id: 'TERSARING', en: 'FILTERED' },
};

export default function TopBar({ locale, view, filtering, onView }) {
  const router = useRouter();

  return (
    <div className="border-b border-rule px-6 py-2.5 flex items-center justify-between font-mono text-[11px] tracking-[.1em] text-muted">
      <div className="flex items-center gap-5">
        <span className="text-ink">UTSMAN</span>
        {/* The way back for a visitor who arrived on a shared /sistem link and
            has no history behind them. Quieter than LEWATI PETA beside it on
            purpose: two framed controls would compete. The arrow is decoration,
            hidden from the accessible name the way the gate's arrows are. */}
        <Link
          href="/"
          onClick={(e) => {
            // Let the browser keep the click when a new tab or window was
            // asked for; intercepting those breaks a plain link.
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
            e.preventDefault();
            moveTo(router, '/', 'up');
          }}
          className="flex items-center gap-1.5 text-muted hover:text-ink transition-colors duration-[180ms]"
        >
          <span aria-hidden="true">↑</span>
          <span>{COPY.back[locale]}</span>
        </Link>
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
