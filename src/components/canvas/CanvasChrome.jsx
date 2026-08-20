"use client";

import Link from 'next/link';
import LangSwitcher from '@/components/nav/LangSwitcher';

const COPY = {
  fit: { id: 'Tampilkan semua', en: 'Show everything' },
  contact: { id: 'Kontak', en: 'Contact' },
  // Leads with the action that matters. The old copy named only panning and
  // zooming, so nothing on the canvas ever told a visitor to open anything.
  hint: {
    id: 'Klik simpul untuk membuka project · seret untuk menggeser · gulir untuk zoom',
    en: 'Click a node to open a project · drag to pan · scroll to zoom',
  },
};

export default function CanvasChrome({ locale, onFit }) {
  return (
    <>
      <div className="absolute left-4 top-4 z-30 flex items-center gap-3">
        <button
          type="button"
          onClick={onFit}
          className="font-mono text-[11px] border border-ground-rule text-ground-ink px-3 py-1.5 rounded-sm bg-ground/70 backdrop-blur hover:border-amber transition-colors duration-500"
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

      <p className="absolute inset-x-0 bottom-5 z-30 mx-auto w-max max-w-[92vw] rounded-full border border-ground-rule bg-ground/80 px-4 py-2 text-center font-mono text-xs text-ground-ink/90 backdrop-blur pointer-events-none">
        {COPY.hint[locale]}
      </p>
    </>
  );
}
