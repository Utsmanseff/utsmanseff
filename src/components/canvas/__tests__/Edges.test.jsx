import { describe, it, expect } from 'vitest';
import { buildEdges } from '@/components/canvas/Edges';

const projects = [
  { slug: 'a', position: { x: 0, y: 0 }, related: ['b'] },
  { slug: 'b', position: { x: 10, y: 10 }, related: ['a'] },
  { slug: 'c', position: { x: 20, y: 20 }, related: [] },
];
const centre = { slug: '__me', position: { x: 5, y: 5 } };

describe('buildEdges', () => {
  it('gives every project a spoke to the centre', () => {
    const spokes = buildEdges(projects, centre).filter((e) => e.kind === 'spoke');
    expect(spokes).toHaveLength(3);
  });

  it('collapses a mutual relation into one line', () => {
    const links = buildEdges(projects, centre).filter((e) => e.kind === 'link');
    expect(links).toHaveLength(1);
    expect(links[0].from).toEqual({ x: 0, y: 0 });
    expect(links[0].to).toEqual({ x: 10, y: 10 });
  });

  it('gives every edge a stable key', () => {
    const keys = buildEdges(projects, centre).map((e) => e.key);
    expect(new Set(keys).size).toBe(keys.length);
  });
});
