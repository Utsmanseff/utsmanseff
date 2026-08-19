import { describe, it, expect } from 'vitest';
import { projects } from '@/lib/data/projects';
import { CENTER_NODE, NODE_RADIUS } from '@/lib/data/canvas';
import { buildEdges } from '@/components/canvas/Edges';

// Canvas positions are hand-placed numbers. Nothing else in the suite looks at
// how they sit relative to each other, so a node overlapping another — or an
// edge slicing through an unrelated node, which reads as a relation that does
// not exist — stays green until someone notices it with their eyes.

// Clearance demanded between an edge and a node it does not belong to.
const EDGE_MARGIN = 14;

const nodes = [
  { slug: CENTER_NODE.slug, position: CENTER_NODE.position, radius: NODE_RADIUS.center },
  ...projects.map((p) => ({
    slug: p.slug,
    position: p.position,
    radius: NODE_RADIUS[p.tier],
  })),
];

const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

// Shortest distance from a point to a line segment, clamped to the segment.
function distanceToSegment(point, from, to) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const lengthSq = dx * dx + dy * dy;
  if (lengthSq === 0) return distance(point, from);
  const t = Math.max(
    0,
    Math.min(1, ((point.x - from.x) * dx + (point.y - from.y) * dy) / lengthSq)
  );
  return distance(point, { x: from.x + t * dx, y: from.y + t * dy });
}

const samePoint = (a, b) => a.x === b.x && a.y === b.y;

describe('canvas layout', () => {
  it('never overlaps two nodes', () => {
    const collisions = [];
    for (let i = 0; i < nodes.length; i += 1) {
      for (let j = i + 1; j < nodes.length; j += 1) {
        const a = nodes[i];
        const b = nodes[j];
        const gap = distance(a.position, b.position) - (a.radius + b.radius);
        if (gap < 0) {
          collisions.push(`${a.slug} overlaps ${b.slug} by ${Math.abs(gap).toFixed(1)}px`);
        }
      }
    }
    expect(collisions).toEqual([]);
  });

  it('never routes an edge through a node it does not connect', () => {
    const crossings = [];
    for (const edge of buildEdges(projects, CENTER_NODE)) {
      for (const node of nodes) {
        if (samePoint(node.position, edge.from) || samePoint(node.position, edge.to)) continue;
        const clearance = distanceToSegment(node.position, edge.from, edge.to) - node.radius;
        if (clearance < EDGE_MARGIN) {
          crossings.push(
            `${edge.key} passes ${clearance.toFixed(1)}px from the edge of ${node.slug}`
          );
        }
      }
    }
    expect(crossings).toEqual([]);
  });
});
