"use client";

import Link from 'next/link';

const COPY = {
  filter: { id: '⌃ FILTER', en: '⌃ FILTER' },
  filtered: { id: 'TERSARING', en: 'FILTERED' },
  contact: { id: 'KONTAK', en: 'CONTACT' },
};

// No count. The only feedback a filter gives is that it is on.
export default function BottomBar({ locale, filtering, onOpenFilter }) {
  return (
    <div className="fixed inset-x-0 bottom-0 h-14 bg-ground flex items-center justify-between px-3.5 font-mono text-[11.5px] tracking-[.08em] text-muted">
      <button type="button" onClick={onOpenFilter} className="text-ink">
        {COPY.filter[locale]}
      </button>
      <span className="text-amber">{filtering ? COPY.filtered[locale] : ''}</span>
      <Link href="/kontak" className="text-amber">{COPY.contact[locale]}</Link>
    </div>
  );
}
