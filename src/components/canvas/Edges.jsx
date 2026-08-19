"use client";

import { WORLD } from '@/lib/data/canvas';

// Spokes tie every project to the centre; links join related projects.
// A mutual relation (a→b and b→a) must render once, so pairs are keyed by
// their sorted slugs.
export function buildEdges(projects, centre) {
  const edges = projects.map((p) => ({
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

export default function Edges({ projects, centre }) {
  const edges = buildEdges(projects, centre);
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
          strokeOpacity={e.kind === 'spoke' ? 1 : 0.7}
        />
      ))}
    </svg>
  );
}
