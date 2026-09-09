"use client";

import { useState } from 'react';
import { edgeTones } from '@/lib/shell/shading';

const PLATE_BG = ['#1B2124', '#1D2428', '#20272B', '#252E33', '#2C3439'];
const EASE = 'cubic-bezier(.22, 1, .36, 1)';
const STEP_TIGHT = 7;
const STEP_OPEN = 11;
const LIFT_HOVER = 6;
const LIFT_SELECTED = 10;

// Colours are literal here rather than tokens: they are indexed by layer depth,
// and a five-step ramp reads better as an array than as five class names.
export default function Plate({ system, position, locale, rotZ, selected, dimmed, onSelect }) {
  const layers = Array.from({ length: position.layers }, (_, i) => i);
  const isPublic = system.access === 'public';

  // Fokus keyboard dapat perlakuan yang sama dengan tetikus: kalau tumpukan
  // membuka untuk yang satu, ia membuka untuk yang lain.
  const [active, setActive] = useState(false);
  const open = active || selected;

  const step = open ? STEP_OPEN : STEP_TIGHT;
  const lift = selected ? LIFT_SELECTED : (active ? LIFT_HOVER : 0);
  // Bukan position.topZ: itu dihitung dari langkah rapat di layout.js, dan
  // label harus ikut naik waktu tumpukan membuka.
  const topZ = (position.layers - 1) * step;

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => onSelect(system.slug)}
      onPointerEnter={() => setActive(true)}
      onPointerLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      className="absolute appearance-none bg-transparent border-0 p-0 text-left"
      style={{
        left: position.x,
        top: position.y,
        width: position.width,
        height: position.height,
        transformStyle: 'preserve-3d',
        opacity: dimmed ? 0.34 : 1,
        transition: `opacity 700ms ${EASE}, transform 700ms ${EASE}`,
        transform: `translateZ(${lift}px)`,
      }}
    >
      {layers.map((i) => {
        const top = i === position.layers - 1;
        const bg = top && isPublic ? '#27302F' : PLATE_BG[Math.min(i, 4)];
        const tones = edgeTones({ index: i, layers: position.layers, rotZ });
        // Makna menang atas kedalaman: amber menandai akses publik, krem
        // menandai yang terpilih, dan keduanya menutupi seluruh tepi lapis atas.
        const flat = top && selected ? '#E8E0D0' : (top && isPublic ? '#C97B3F' : null);
        return (
          <div
            key={i}
            data-layer={i}
            className="absolute inset-0"
            style={{
              background: bg,
              borderStyle: 'solid',
              borderWidth: top && selected ? 2 : 1,
              borderTopColor: flat ?? tones.top,
              borderRightColor: flat ?? tones.right,
              borderBottomColor: flat ?? tones.bottom,
              borderLeftColor: flat ?? tones.left,
              transform: `translateZ(${i * step}px)`,
              transition: `transform 700ms ${EASE}, border-color 180ms linear`,
            }}
          />
        );
      })}

      <span
        data-plate-label
        className="absolute left-1/2 top-1/2 text-center whitespace-nowrap"
        style={{
          transform: `translateZ(${topZ + lift + 4}px) rotateZ(${-rotZ}deg) rotateX(-56deg) translate(-50%, -50%)`,
          textShadow: '0 1px 3px rgba(14,17,19,.9), 0 0 10px rgba(14,17,19,.75)',
        }}
      >
        <span
          className={`block font-display tracking-[-.02em] ${
            position.width > 120 ? 'text-[16px] font-bold' : 'text-[12.5px] font-semibold'
          } text-ink-bright`}
        >
          {system.shortName[locale]}
        </span>
        <span className={`block font-mono ${position.width > 120 ? 'text-[10px]' : 'text-[9.5px]'} ${
          isPublic ? 'text-amber' : 'text-muted'
        }`}>
          {system.client.toUpperCase()} · {system.access.toUpperCase()}
        </span>
      </span>
    </button>
  );
}
