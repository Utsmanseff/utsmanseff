"use client";

import Link from 'next/link';
import LangSwitcher from '@/components/nav/LangSwitcher';

const COPY = {
  fit: { id: 'Tampilkan semua', en: 'Show everything' },
  contact: { id: 'Kontak', en: 'Contact' },
  hint: { id: 'seret untuk menggeser · gulir untuk zoom', en: 'drag to pan · scroll to zoom' },
};

export default function CanvasChrome({ locale, onFit }) {
  return (
    <>
      <div className="absolute left-4 top-4 z-30 flex items-center gap-3">
        <button
          type="button"
          onClick={onFit}
          className="font-mono text-[11px] border border-ground-rule text-ground-ink
                     px-3 py-1.5 rounded-sm bg-ground/70 backdrop-blur
                     hover:border-amber transition-colors duration-500"
        >
          {COPY.fit[locale]}
        </button>
      </div>

      <div className="absolute right-4 top-4 z-30 flex items-center gap-4">
        <LangSwitcher tone="ground" />
        <Link
          href="/kontak"
          className="font-mono text-[11px] text-ground-mute hover:text-amber transition-colors duration-500"
        >
          {COPY.contact[locale]}
        </Link>
      </div>

      <p className="absolute right-4 bottom-4 z-30 font-mono text-[10px] text-ground-mute pointer-events-none">
        {COPY.hint[locale]}
      </p>
    </>
  );
}
