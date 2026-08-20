"use client";

import { NODE_RADIUS, OTHERS_NODE } from '@/lib/data/canvas';

// The one node that is not a project: a door to the smaller internal builds.
// Its border is dashed so it reads as a container rather than a peer of the
// four project nodes, and it says how many are behind it before you click.
export default function GroupNode({ locale, count, selected, dimmed, onOpen, onFocus }) {
  const radius = NODE_RADIUS.group;
  const label = {
    id: `${count} project`,
    en: `${count} projects`,
  };

  return (
    <button
      type="button"
      onClick={() => onOpen(OTHERS_NODE.slug)}
      onFocus={() => onFocus?.(OTHERS_NODE)}
      aria-pressed={selected}
      className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center gap-1 cursor-pointer rounded-full text-center border border-dashed border-ground-rule bg-ground-soft/50 text-ground-ink transition-[background-color,border-color,opacity] duration-500 ease-out hover:bg-ground-soft hover:border-amber focus-visible:outline-2 focus-visible:outline-amber"
      style={{
        left: OTHERS_NODE.position.x,
        top: OTHERS_NODE.position.y,
        width: radius * 2,
        height: radius * 2,
        borderColor: selected ? 'var(--color-amber)' : undefined,
        opacity: dimmed ? 0.22 : 1,
      }}
    >
      <span className="font-pixel text-[16px] leading-none px-2">
        {OTHERS_NODE.name[locale]}
      </span>
      <span className="font-mono text-[9px] text-ground-mute">{label[locale]}</span>
    </button>
  );
}
