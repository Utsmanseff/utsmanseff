import { describe, it, expect } from 'vitest';
import { edgeTones, EDGE_RAMP } from '@/lib/shell/shading';

// Semua warna hidup di satu ramp lurus, jadi satu kanal sudah cukup untuk
// membandingkan terang. Merah dipilih sembarang; ketiganya bergerak searah.
const lum = (hex) => parseInt(hex.slice(1, 3), 16);

const sides = (over = {}) => edgeTones({ index: 0, layers: 5, rotZ: -40, ...over });

describe('edgeTones', () => {
  it('gives four sides, each a hex colour', () => {
    const t = sides();
    expect(Object.keys(t).sort()).toEqual(['bottom', 'left', 'right', 'top']);
    Object.values(t).forEach((c) => expect(c).toMatch(/^#[0-9a-f]{6}$/i));
  });

  it('lights the side that faces the light and leaves the far side dark', () => {
    const t = sides({ rotZ: -40 });
    expect(lum(t.left)).toBeGreaterThan(lum(t.right));
  });

  it('swaps those two sides when the camera turns halfway round', () => {
    const near = sides({ rotZ: -40 });
    const far = sides({ rotZ: 140 });
    expect(lum(far.right)).toBeGreaterThan(lum(far.left));
    expect(lum(far.right)).toBeCloseTo(lum(near.left), -1);
  });

  it('raises every side as the layer sits higher in the stack', () => {
    const low = sides({ index: 0 });
    const high = sides({ index: 4 });
    ['top', 'right', 'bottom', 'left'].forEach((s) => {
      expect(lum(high[s])).toBeGreaterThan(lum(low[s]));
    });
  });

  it('never leaves the family it was given', () => {
    const floor = lum(EDGE_RAMP.dark);
    const ceiling = lum(EDGE_RAMP.bright);
    for (let rotZ = -180; rotZ <= 180; rotZ += 15) {
      for (let index = 0; index < 5; index += 1) {
        Object.values(edgeTones({ index, layers: 5, rotZ })).forEach((c) => {
          expect(lum(c)).toBeGreaterThanOrEqual(floor);
          expect(lum(c)).toBeLessThanOrEqual(ceiling);
        });
      }
    }
  });

  it('answers the same input with the same colour', () => {
    expect(sides()).toEqual(sides());
  });

  it('treats a single-layer plate as the top of its stack', () => {
    const one = edgeTones({ index: 0, layers: 1, rotZ: -40 });
    const top = edgeTones({ index: 4, layers: 5, rotZ: -40 });
    expect(lum(one.left)).toBe(lum(top.left));
  });
});
