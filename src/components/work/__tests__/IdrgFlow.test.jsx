import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import IdrgFlow from '@/components/work/IdrgFlow';

// Lebar dibaca lewat matchMedia, sama seperti cangkang. `wide` menentukan
// koordinat simpul, bukan isinya — label dan urutannya identik di dua lebar.
const setWidth = (wide) => {
  window.matchMedia = vi.fn(() => ({
    matches: wide,
    addEventListener: () => {},
    removeEventListener: () => {},
  }));
};

beforeEach(() => setWidth(true));

const labels = (container) =>
  [...container.querySelectorAll('text, tspan')].map((t) => t.textContent);

describe('IdrgFlow', () => {
  it('walks a claim from the hospital system to BPJS, in order', () => {
    const { container } = render(<IdrgFlow locale="id" />);
    const joined = labels(container).join(' | ');
    const order = ['SIMRS', 'IDRG', 'INA-CBG', 'Antrian', 'BPJS'];
    const at = order.map((s) => joined.indexOf(s));
    expect(at.every((i) => i > -1), joined).toBe(true);
    expect(at).toEqual([...at].sort((a, b) => a - b));
  });

  it('seats SatuSehat behind a separate service, never on this one', () => {
    // Datanya menyebut pengirimannya lewat service tersendiri. Panah langsung
    // dari layanan ini ke SatuSehat akan mengaku lebih dari yang dikerjakan.
    const { container } = render(<IdrgFlow locale="id" />);
    const joined = labels(container).join(' | ');
    expect(joined).toMatch(/SatuSehat/);
    expect(joined).toMatch(/Service tersendiri/i);
    const satuSehat = [...container.querySelectorAll('[data-node]')]
      .find((n) => /SatuSehat/.test(n.textContent));
    expect(satuSehat.dataset.node).toBe('external');
  });

  it('marks everything outside the service as external', () => {
    const { container } = render(<IdrgFlow locale="id" />);
    const outside = [...container.querySelectorAll('[data-node="external"]')]
      .map((n) => n.textContent.replace(/\s+/g, ' ').trim());
    expect(outside).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/SIMRS/),
        expect.stringMatching(/BPJS/),
        expect.stringMatching(/SatuSehat/),
        expect.stringMatching(/Service tersendiri/i),
      ]),
    );
  });

  it('says the same thing in English', () => {
    const { container } = render(<IdrgFlow locale="en" />);
    const joined = labels(container).join(' | ');
    expect(joined).toMatch(/SIMRS/);
    expect(joined).toMatch(/BPJS/);
    expect(joined).toMatch(/Queue/i);
    expect(joined).toMatch(/separate service/i);
  });

  it('carries the same labels stacked as it does across', () => {
    const { container: across } = render(<IdrgFlow locale="id" />);
    setWidth(false);
    const { container: stacked } = render(<IdrgFlow locale="id" />);
    expect(labels(stacked).sort()).toEqual(labels(across).sort());
  });

  it('is not a mute image to a screen reader', () => {
    const { container } = render(<IdrgFlow locale="id" />);
    const svg = container.querySelector('svg');
    expect(svg.getAttribute('role')).toBe('img');
    expect(svg.querySelector('title').textContent).toBeTruthy();
  });
  it.each([[true, 'mendatar'], [false, 'menumpuk']])(
    'never runs an arrow from inside the service straight to SatuSehat (%s)',
    (wide) => {
      setWidth(wide);
      const { container } = render(<IdrgFlow locale="id" />);
      const box = (label) => {
        const g = [...container.querySelectorAll('[data-node]')]
          .find((n) => new RegExp(label).test(n.textContent));
        const r = g.querySelector('rect');
        return {
          x: +r.getAttribute('x'), y: +r.getAttribute('y'),
          w: +r.getAttribute('width'), h: +r.getAttribute('height'),
        };
      };
      const target = box('SatuSehat');
      const relay = box('Service tersendiri');
      const hits = (b, x, y) =>
        x >= b.x - 12 && x <= b.x + b.w + 12 && y >= b.y - 12 && y <= b.y + b.h + 12;

      const arrivals = [...container.querySelectorAll('path[marker-end]')]
        .map((p) => p.getAttribute('d').match(/M ([\d.]+) ([\d.]+) L ([\d.]+) ([\d.]+)/).slice(1).map(Number))
        .filter(([, , x2, y2]) => hits(target, x2, y2));

      expect(arrivals).toHaveLength(1);
      const [x1, y1] = arrivals[0];
      expect(hits(relay, x1, y1), 'panah ke SatuSehat harus berangkat dari service tersendiri').toBe(true);
    },
  );

});
