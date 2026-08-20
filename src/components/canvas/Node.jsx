"use client";

import { NODE_RADIUS } from '@/lib/data/canvas';

// One node on the canvas. Position is applied by the parent's world transform,
// so this component only knows about its own size and contents.
export default function Node({ project, locale, detail, selected, onOpen, onFocus }) {
  const radius = NODE_RADIUS[project.tier];
  const near = detail === 'near';

  return (
    <button
      type="button"
      onClick={() => onOpen(project.slug)}
      onFocus={() => onFocus?.(project)}
      aria-pressed={selected}
      className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center gap-0.5 rounded-full text-center border border-ground-rule bg-ground-soft/70 text-ground-ink transition-[background-color,border-color,opacity] duration-500 ease-out hover:bg-ground-soft hover:border-amber/60 focus-visible:outline-2 focus-visible:outline-amber"
      style={{
        left: project.position.x,
        top: project.position.y,
        width: radius * 2,
        height: radius * 2,
        borderColor: selected ? 'var(--color-amber)' : undefined,
      }}
    >
      <span className="font-mono text-[11px] leading-tight px-2">
        {project.shortName[locale]}
      </span>
      {near && (
        <>
          <span className="font-mono text-[9px] text-ground-mute">{project.year}</span>
          <span className="font-mono text-[9px] text-ground-mute px-2 leading-tight">
            {project.tech.slice(0, 2).join(' · ')}
          </span>
        </>
      )}
    </button>
  );
}
