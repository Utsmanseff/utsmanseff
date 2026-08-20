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

const FADE_MS = 700;

// The chrome used to sit above the preview panel, so the language switcher
// covered the panel's close button and the bottom hint floated over the panel
// text. Chrome now steps aside while a panel is open: it fades out on the same
// curve the panel fades in, and stops taking pointers so nothing under it is
// clickable while invisible. Both layers are anchored to the viewport rather
// than to the canvas box: the box can be scrolled by the browser when focus
// moves to a node, and anything absolutely placed inside it slid along.
// `inert` does the rest: it takes the switcher, the
// contact link and the fit button out of the tab order too, so keyboard focus
// cannot land on something nobody can see.
export default function CanvasChrome({ locale, onFit, hidden = false }) {
  const veil = {
    opacity: hidden ? 0 : 1,
    pointerEvents: hidden ? 'none' : undefined,
    transition: `opacity ${FADE_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`,
  };

  return (
    <div inert={hidden}>
      <div className="fixed left-4 top-4 z-30 flex items-center gap-3" style={veil}>
        <button
          type="button"
          onClick={onFit}
          className="font-mono text-[11px] border border-ground-rule text-ground-ink px-3 py-1.5 rounded-sm bg-ground/70 backdrop-blur hover:border-amber transition-colors duration-500"
        >
          {COPY.fit[locale]}
        </button>
      </div>

      <div className="fixed right-4 top-4 z-30 flex items-center gap-4" style={veil}>
        <LangSwitcher tone="ground" />
        <Link
          href="/kontak"
          className="font-mono text-[11px] text-ground-mute hover:text-amber transition-colors duration-500"
        >
          {COPY.contact[locale]}
        </Link>
      </div>

      <p
        className="fixed inset-x-0 bottom-5 z-30 mx-auto w-max max-w-[92vw] rounded-full border border-ground-rule bg-ground/80 px-4 py-2 text-center font-mono text-xs text-ground-ink/90 backdrop-blur pointer-events-none"
        style={veil}
      >
        {COPY.hint[locale]}
      </p>
    </div>
  );
}
