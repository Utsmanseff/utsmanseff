import { describe, it, expect } from 'vitest';
import { SCENE, platePositions, fitScale, snapRotation } from '@/lib/shell/layout';

const systems = [
  { slug: 'a', year: '2025', tier: 'full', tech: ['x', 'y', 'z'] },
  { slug: 'b', year: '2025', tier: 'brief', tech: ['x', 'y', 'z'] },
  { slug: 'c', year: '2024', tier: 'brief', tech: ['x', 'y', 'z', 'w'] },
];

describe('platePositions', () => {
  it('puts later years nearer the front', () => {
    const by = Object.fromEntries(platePositions(systems).map((p) => [p.slug, p]));
    expect(by.c.y).toBeLessThan(by.a.y);
  });

  it('sizes a plate by whether it has a reading page', () => {
    const [a, b] = platePositions(systems);
    expect([a.width, a.height]).toEqual([165, 115]);
    expect([b.width, b.height]).toEqual([100, 74]);
  });

  it('advances x by the previous plate width, never by a fixed stride', () => {
    // A fixed stride landed a small plate inside the big one before it.
    const [a, b] = platePositions(systems);
    expect(b.x).toBe(a.x + a.width + 80);
  });

  it('never overlaps two plates in the same row', () => {
    const row = platePositions(systems).filter((p) => p.year === '2025');
    for (let i = 1; i < row.length; i += 1) {
      expect(row[i].x).toBeGreaterThanOrEqual(row[i - 1].x + row[i - 1].width);
    }
  });

  it('raises a plate one layer per technology', () => {
    const [a, , c] = platePositions(systems);
    expect(a.layers).toBe(3);
    expect(c.layers).toBe(4);
    expect(c.topZ).toBe(3 * 7);
  });
});

describe('fitScale', () => {
  it('fits the scene inside the pane, reserving room for labels', () => {
    expect(fitScale({ width: 1070, height: 650 })).toBeCloseTo(1, 5);
    expect(fitScale({ width: 800, height: 650 })).toBeCloseTo((800 - 170) / SCENE.width, 5);
  });

  it('never scales up past 1, and never below 0.4', () => {
    expect(fitScale({ width: 4000, height: 4000 })).toBe(1);
    expect(fitScale({ width: 200, height: 200 })).toBe(0.4);
  });

  it('survives a pane that has not been measured yet', () => {
    expect(fitScale({ width: 0, height: 0 })).toBe(0.4);
  });
});

describe('snapRotation', () => {
  it('snaps to the nearest camera angle on release', () => {
    expect(snapRotation(-38)).toBe(-40);
    expect(snapRotation(-52)).toBe(-55);
    expect(snapRotation(-10)).toBe(-25);
  });
});
