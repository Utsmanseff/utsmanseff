"use client";

import { useEffect } from 'react';
import { meta } from '@/lib/data/meta';
import { techNames } from '@/lib/data/tech';

const EASE = 'cubic-bezier(.22, 1, .36, 1)';

const COPY = {
  label: { id: 'Gerbang', en: 'Gate' },
  role: { id: 'FULLSTACK DEVELOPER', en: 'FULLSTACK DEVELOPER' },
  map: { id: 'LIHAT SISTEM · PETA →', en: 'SEE SYSTEMS · MAP →' },
  list: { id: 'LIHAT SISTEM · DAFTAR →', en: 'SEE SYSTEMS · LIST →' },
  hint: { id: '↓ ATAU TEKAN APA SAJA', en: '↓ OR PRESS ANY KEY' },
};

// Four empty plates, the same shape as the ones behind the gate. The gate
// promises the contents rather than decorating over them.
const PLATES = [
  { width: 168, height: 100, right: 172, top: 44, bg: '#1D2428', edge: '#333C41' },
  { width: 196, height: 116, right: 78, top: 132, bg: '#252E33', edge: '#4A545A' },
  { width: 146, height: 88, right: 200, top: 244, bg: '#27302F', edge: '#C97B3F' },
  { width: 112, height: 68, right: 24, top: 28, bg: '#1D2428', edge: '#333C41' },
];

export default function Gate({ systems, locale, calm, leaving = false, onEnter }) {
  const years = systems.map((s) => Number(s.year));
  const span = `${Math.min(...years)}–${Math.max(...years)}`;

  // The console below takes typing. A visitor who lands and types `filter`
  // straight away must not lose the f, so the key that opens the gate is handed
  // on rather than swallowed. Tab is the exception: it has to keep walking the
  // two buttons.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Tab') return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === 'Enter' || e.key === 'Escape') { onEnter(null, null); return; }
      if (e.key.length !== 1) return;
      onEnter(null, e.key === ' ' ? null : e.key);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onEnter]);

  return (
    <div
      data-testid="gate"
      role="group"
      aria-label={COPY.label[locale]}
      className="absolute inset-0 z-50 bg-ground overflow-hidden"
      style={{
        transition: `opacity 700ms ${EASE}`,
        opacity: leaving ? 0 : 1,
        pointerEvents: leaving ? 'none' : undefined,
      }}
      onWheel={(e) => { if (e.deltaY > 0) onEnter(null, null); }}
    >
      <div className="absolute inset-y-0 right-0 w-[56%] pointer-events-none" aria-hidden="true">
        {PLATES.map((p, i) => (
          <div
            key={i}
            data-gate-plate={i}
            className="absolute"
            style={{
              width: p.width,
              height: p.height,
              right: p.right,
              top: p.top,
              background: p.bg,
              border: `1px solid ${p.edge}`,
              transform: 'skewY(-16deg)',
            }}
          />
        ))}
      </div>

      <div className="relative h-full flex flex-col justify-center px-16 max-w-[720px]">
        {/* Not an h1. The flat table underneath already owns the page's heading,
            and the gate is something you pass through, not something you read. */}
        <p className="font-display font-extrabold text-[64px] leading-none tracking-[-.03em] text-ink-bright m-0">
          {meta.name}
        </p>

        <p className="font-mono text-[11.5px] tracking-[.1em] text-muted mt-4 mb-0">
          {COPY.role[locale]} · {meta.location[locale]} · {span}
        </p>

        <p
          data-testid="gate-stack"
          className="font-mono text-[12px] leading-[1.9] text-body-soft mt-4 mb-0 max-w-[560px]"
        >
          {techNames(systems).join(' · ')}
        </p>

        <div className="flex gap-3 mt-8">
          <button
            type="button"
            onClick={() => onEnter('map', null)}
            className="font-mono text-[11.5px] tracking-[.08em] text-amber border border-amber px-4 min-h-[44px]"
          >
            {COPY.map[locale]}
          </button>
          <button
            type="button"
            onClick={() => onEnter('list', null)}
            className="font-mono text-[11.5px] tracking-[.08em] text-muted border border-rule px-4 min-h-[44px]"
          >
            {COPY.list[locale]}
          </button>
        </div>
      </div>

      <span className="absolute right-6 bottom-5 font-mono text-[10px] text-muted-deep">
        {COPY.hint[locale]}
      </span>
    </div>
  );
}
