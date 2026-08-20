"use client";

import { WORLD } from '@/lib/data/canvas';

// Spokes tie every node on the map to the centre; links join related projects.
// A mutual relation (a→b and b→a) must render once, so pairs are keyed by
// their sorted slugs. A relation pointing at a project that is not on the map —
// the small work now lives behind the "other work" node — draws nothing, rather
// than a line reaching across the map to a node that does not mean it.
export function buildEdges(projects, centre, extras = []) {
  const edges = [...projects, ...extras].map((p) => ({
    key: `spoke:${p.slug}`,
    kind: 'spoke',
    from: centre.position,
    to: p.position,
  }));

  const seen = new Set();
  for (const p of projects) {
    for (const slug of p.related) {
      const pairKey = [p.slug, slug].sort().join('~');
      if (seen.has(pairKey)) continue;
      const other = projects.find((q) => q.slug === slug);
      if (!other) continue;
      seen.add(pairKey);
      edges.push({ key: `link:${pairKey}`, kind: 'link', from: p.position, to: other.position });
    }
  }

  return edges;
}

export default function Edges({ projects, centre, extras, dimmed }) {
  const edges = buildEdges(projects, centre, extras);
  // A spoke to a filtered-out node has to fade with it, or the map keeps
  // pointing at work the filter just said is irrelevant.
  const isDim = (e) => Boolean(dimmed?.size) && (
    e.kind === 'spoke' ? dimmed.has(e.key.slice('spoke:'.length)) : true
  );
  return (
    <svg
      width={WORLD.width}
      height={WORLD.height}
      className="absolute inset-0 pointer-events-none"
      aria-hidden="true"
    >
      {edges.map((e) => (
        <line
          key={e.key}
          x1={e.from.x}
          y1={e.from.y}
          x2={e.to.x}
          y2={e.to.y}
          stroke="var(--color-ground-rule)"
          strokeWidth={e.kind === 'spoke' ? 1.5 : 1}
          strokeOpacity={isDim(e) ? 0.15 : (e.kind === 'spoke' ? 1 : 0.7)}
          style={{ transition: 'stroke-opacity 500ms ease-out' }}
        />
      ))}
    </svg>
  );
}
