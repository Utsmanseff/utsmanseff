import { describe, it, expect } from 'vitest';
import {
  MIN_ZOOM,
  MAX_ZOOM,
  DRAG_THRESHOLD,
  panBy,
  zoomAt,
  fitToNodes,
  worldToScreen,
  screenToWorld,
  detailLevel,
  isClick,
} from '@/lib/canvas/viewport';

const vp = { x: 0, y: 0, zoom: 1 };

describe('panBy', () => {
  it('adds the delta to the offset', () => {
    expect(panBy(vp, 30, -12)).toEqual({ x: 30, y: -12, zoom: 1 });
  });

  it('does not mutate the input', () => {
    const start = { x: 5, y: 5, zoom: 1 };
    panBy(start, 10, 10);
    expect(start).toEqual({ x: 5, y: 5, zoom: 1 });
  });
});

describe('worldToScreen / screenToWorld', () => {
  it('round-trips a point', () => {
    const v = { x: -120, y: 44, zoom: 1.35 };
    const world = { x: 700, y: 480 };
    const back = screenToWorld(v, worldToScreen(v, world));
    expect(back.x).toBeCloseTo(world.x, 6);
    expect(back.y).toBeCloseTo(world.y, 6);
  });

  it('applies zoom then offset', () => {
    expect(worldToScreen({ x: 10, y: 20, zoom: 2 }, { x: 100, y: 50 }))
      .toEqual({ x: 210, y: 120 });
  });
});

describe('zoomAt', () => {
  it('keeps the world point under the cursor fixed', () => {
    const cursor = { x: 400, y: 300 };
    const before = screenToWorld(vp, cursor);
    const after = screenToWorld(zoomAt(vp, 1.4, cursor), cursor);
    expect(after.x).toBeCloseTo(before.x, 6);
    expect(after.y).toBeCloseTo(before.y, 6);
  });

  it('clamps at the maximum', () => {
    expect(zoomAt({ x: 0, y: 0, zoom: MAX_ZOOM }, 3, { x: 0, y: 0 }).zoom).toBe(MAX_ZOOM);
  });

  it('clamps at the minimum', () => {
    expect(zoomAt({ x: 0, y: 0, zoom: MIN_ZOOM }, 0.1, { x: 0, y: 0 }).zoom).toBe(MIN_ZOOM);
  });
});

describe('fitToNodes', () => {
  const nodes = [
    { position: { x: 200, y: 200 }, radius: 40 },
    { position: { x: 800, y: 600 }, radius: 40 },
  ];

  it('brings every node inside the viewport', () => {
    const size = { width: 1000, height: 700 };
    const v = fitToNodes(nodes, size, 60);
    for (const n of nodes) {
      const s = worldToScreen(v, n.position);
      expect(s.x - n.radius * v.zoom).toBeGreaterThanOrEqual(0);
      expect(s.x + n.radius * v.zoom).toBeLessThanOrEqual(size.width);
      expect(s.y - n.radius * v.zoom).toBeGreaterThanOrEqual(0);
      expect(s.y + n.radius * v.zoom).toBeLessThanOrEqual(size.height);
    }
  });

  it('centres the bounding box', () => {
    const size = { width: 1000, height: 700 };
    const v = fitToNodes(nodes, size, 60);
    const mid = worldToScreen(v, { x: 500, y: 400 });
    expect(mid.x).toBeCloseTo(size.width / 2, 6);
    expect(mid.y).toBeCloseTo(size.height / 2, 6);
  });

  it('never zooms past the maximum for a tiny cluster', () => {
    const tight = [
      { position: { x: 500, y: 500 }, radius: 10 },
      { position: { x: 510, y: 505 }, radius: 10 },
    ];
    expect(fitToNodes(tight, { width: 1200, height: 900 }, 60).zoom).toBeLessThanOrEqual(MAX_ZOOM);
  });

  it('falls back to a centred identity view for an empty list', () => {
    expect(fitToNodes([], { width: 800, height: 600 }, 60)).toEqual({ x: 400, y: 300, zoom: 1 });
  });
});

describe('detailLevel', () => {
  it('is far when zoomed out', () => {
    expect(detailLevel(0.5)).toBe('far');
  });

  it('is near when zoomed in', () => {
    expect(detailLevel(1.2)).toBe('near');
  });
});

describe('isClick', () => {
  it('counts a still pointer as a click', () => {
    expect(isClick(0)).toBe(true);
  });

  it('rejects movement past the threshold', () => {
    expect(isClick(DRAG_THRESHOLD + 1)).toBe(false);
  });
});
