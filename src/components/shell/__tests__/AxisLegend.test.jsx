import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AxisLegend from '@/components/shell/AxisLegend';

describe('AxisLegend', () => {
  it('names itself as a key, split into shape and colour', () => {
    render(<AxisLegend locale="id" />);
    expect(screen.getByText('BENTUK')).toBeInTheDocument();
    expect(screen.getByText('WARNA')).toBeInTheDocument();
  });

  it('explains every mark the map actually makes', () => {
    const { container } = render(<AxisLegend locale="id" />);
    const text = container.textContent;
    for (const word of ['KE BELAKANG', 'TINGGI', 'LUAS', 'AMBER', 'KREM', 'REDUP']) {
      expect(text, word).toContain(word);
    }
  });

  it('stops calling the public mark an edge', () => {
    // Yang menandai publik adalah tepi lapis TERATAS, bukan tepi plate.
    // Sejak shading.js ada, keempat sisi tiap lapis punya warnanya sendiri.
    const { container } = render(<AxisLegend locale="id" />);
    expect(container.textContent).not.toContain('TEPI');
  });

  it('speaks English when asked to', () => {
    const { container } = render(<AxisLegend locale="en" />);
    expect(container.textContent).toContain('FORM');
    expect(container.textContent).toContain('COLOUR');
    expect(container.textContent).toContain('CREAM');
  });
});
