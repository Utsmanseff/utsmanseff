"use client";

const PLATE_BG = ['#1B2124', '#1D2428', '#20272B', '#252E33', '#2C3439'];
const PLATE_EDGE = ['#333C41', '#3A4348', '#3F484D', '#4A545A', '#4A545A'];
const EASE = 'cubic-bezier(.22, 1, .36, 1)';

// Colours are literal here rather than tokens: they are indexed by layer depth,
// and a five-step ramp reads better as an array than as five class names.
export default function Plate({ system, position, locale, rotZ, selected, dimmed, onSelect }) {
  const layers = Array.from({ length: position.layers }, (_, i) => i);
  const isPublic = system.access === 'public';
  const lift = selected ? 10 : 0;

  return (
    <div
      className="absolute"
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
        const edge = top && selected ? '#E8E0D0' : (top && isPublic ? '#C97B3F' : PLATE_EDGE[Math.min(i, 4)]);
        return (
          <div
            key={i}
            data-layer={i}
            className="absolute inset-0"
            style={{
              background: bg,
              border: `${top && selected ? 2 : 1}px solid ${edge}`,
              transform: `translateZ(${i * position.layerStep}px)`,
              transition: 'border-color 180ms linear',
            }}
          />
        );
      })}

      <button
        type="button"
        aria-pressed={selected}
        onClick={() => onSelect(system.slug)}
        data-plate-label
        className="absolute left-1/2 top-1/2 text-center whitespace-nowrap"
        style={{
          transform: `translateZ(${position.topZ + lift + 4}px) rotateZ(${-rotZ}deg) rotateX(-56deg) translate(-50%, -50%)`,
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
      </button>
    </div>
  );
}
