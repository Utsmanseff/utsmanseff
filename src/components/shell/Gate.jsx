"use client";

import { useCallback, useEffect, useRef } from 'react';
import { meta } from '@/lib/data/meta';
import { techNames } from '@/lib/data/tech';

const COPY = {
  label: { id: 'Gerbang', en: 'Gate' },
  role: { id: 'FULLSTACK DEVELOPER', en: 'FULLSTACK DEVELOPER' },
  map: { id: 'LIHAT SISTEM · PETA', en: 'SEE SYSTEMS · MAP' },
  list: { id: 'LIHAT SISTEM · DAFTAR', en: 'SEE SYSTEMS · LIST' },
  hint: { id: '↓ ATAU TEKAN APA SAJA', en: '↓ OR PRESS ANY KEY' },
};

// Four empty plates, the same shape as the ones behind the gate. The gate
// promises the contents rather than decorating over them.
// `pull` is the full travel each plate has, in pixels, from one edge of the gate
// to the other. Four different numbers is the whole effect: equal ones read as a
// single sheet sliding.
//
// Tuned by eye, four passes. 34/20/46/12 read as shoving — though the offsets
// were negated then, which is most of why. 15/9/20/5 overcorrected: 8px of drift
// goes unnoticed unless you are told to look. 28/16/36/9 was visible but still
// short. These are the settled numbers.
const PLATES = [
  { width: 168, height: 100, right: 172, top: 44, bg: '#1D2428', edge: '#333C41', pull: 36 },
  { width: 196, height: 116, right: 78, top: 132, bg: '#252E33', edge: '#4A545A', pull: 21 },
  { width: 146, height: 88, right: 200, top: 244, bg: '#27302F', edge: '#C97B3F', pull: 46 },
  { width: 112, height: 68, right: 24, top: 28, bg: '#1D2428', edge: '#333C41', pull: 12 },
];

// The gate is wider than it is tall, so an unscaled vertical pull travels a
// larger share of the axis it moves along. 0.6 damped it so far that the up-down
// drift was the part nobody could see; 0.9 keeps a little of that damping.
const VERTICAL = 0.9;

// Colour moves at 180ms, the rate the rest of the shell uses. The arrow is the
// one thing that travels, and it is decoration — hidden from the accessible
// name, and stopped by the reduced-motion rule in globals.css like everything
// else that moves on its own.
function GateButton({ primary = false, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group font-mono text-[11.5px] tracking-[.08em] border px-4 min-h-[44px] flex items-center gap-2.5 transition-colors duration-[180ms] ${
        primary
          ? 'text-amber border-amber hover:bg-amber hover:text-ground focus-visible:bg-amber focus-visible:text-ground'
          : 'text-muted border-rule hover:text-ink hover:border-ink focus-visible:text-ink focus-visible:border-ink'
      }`}
    >
      <span>{children}</span>
      <span
        aria-hidden="true"
        className="transition-transform duration-[180ms] group-hover:translate-x-1 group-focus-visible:translate-x-1"
      >
        →
      </span>
    </button>
  );
}

export default function Gate({ systems, locale, calm, onEnter }) {
  const gateRef = useRef(null);
  const years = systems.map((s) => Number(s.year));
  const span = `${Math.min(...years)}–${Math.max(...years)}`;

  // Where each door leads. `wantList` null means "no opinion" — the two buttons
  // have one, everything else defers to what the visitor asked the OS for.
  // URLSearchParams does the escaping; a letter like `&` would otherwise cut the
  // query in half.
  // Memoised because the key listener below depends on it, and a fresh function
  // every render would tear that listener down and rebuild it every render too.
  const destination = useCallback((wantList, seed) => {
    const params = new URLSearchParams();
    if (wantList ?? calm) params.set('tampilan', 'datar');
    if (seed) params.set('ketik', seed);
    const query = params.toString();
    return query ? `/sistem?${query}` : '/sistem';
  }, [calm]);

  // The console below takes typing. A visitor who lands and types `filter`
  // straight away must not lose the f, so the key that opens the gate is handed
  // on rather than swallowed. Tab is the exception: it has to keep walking the
  // two buttons.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Tab') return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === 'Enter' || e.key === 'Escape') {
        e.preventDefault();
        onEnter(destination(null, null));
        return;
      }
      if (e.key.length !== 1) return;
      // The console is focused a moment from now, and without this the browser
      // delivers this very keystroke to it as well — the letter arrives twice.
      e.preventDefault();
      onEnter(destination(null, e.key === ' ' ? null : e.key));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onEnter, destination]);

  // Cursor-driven, so it follows 1:1 with no transition — the same side of the
  // motion contract as dragging the map. Transform only: touching left/top here
  // would relayout four elements every frame. A visitor who asked for less
  // motion gets no listener at all, rather than a listener whose work is thrown
  // away.
  useEffect(() => {
    if (calm) return undefined;
    const gate = gateRef.current;
    if (!gate) return undefined;

    let frame = null;
    const onMove = (e) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = null;
        const box = gate.getBoundingClientRect();
        const x = (e.clientX - box.left) / (box.width || 1) - 0.5;
        const y = (e.clientY - box.top) / (box.height || 1) - 0.5;
        gate.querySelectorAll('[data-gate-plate]').forEach((node) => {
          const { pull } = PLATES[Number(node.dataset.gatePlate)];
          // Toward the cursor, not away from it. Away reads as the plates
          // being pushed; toward reads as them leaning to look.
          node.style.transform = `skewY(-16deg) translate(${(x * pull).toFixed(1)}px, ${(y * pull * VERTICAL).toFixed(1)}px)`;
        });
      });
    };

    gate.addEventListener('mousemove', onMove);
    return () => {
      gate.removeEventListener('mousemove', onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [calm]);

  return (
    <div
      ref={gateRef}
      data-testid="gate"
      role="group"
      aria-label={COPY.label[locale]}
      className="absolute inset-0 z-50 bg-ground overflow-hidden"
      onWheel={(e) => { if (e.deltaY > 0) onEnter(destination(null, null)); }}
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
        {/* Not an h1. The name is a doorplate, not the heading of a document —
            the heading belongs to the systems, and they live at /sistem. */}
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
          <GateButton onClick={() => onEnter(destination(false, null))} primary>
            {COPY.map[locale]}
          </GateButton>
          <GateButton onClick={() => onEnter(destination(true, null))}>
            {COPY.list[locale]}
          </GateButton>
        </div>
      </div>

      <span className="absolute right-6 bottom-5 font-mono text-[10px] text-muted-deep">
        {COPY.hint[locale]}
      </span>
    </div>
  );
}
