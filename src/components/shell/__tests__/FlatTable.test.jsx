import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import FlatTable from '@/components/shell/FlatTable';

const systems = [
  {
    slug: 'rme', client: 'RSU Nirwana', year: '2025', access: 'internal',
    tier: 'full', tech: ['Laravel'], shortName: { id: 'RME', en: 'EMR' },
    blurb: { id: 'Ringkas.', en: 'Short.' },
  },
];

describe('FlatTable', () => {
  it('does not claim to be what runs without JavaScript', () => {
    // Tanpa JavaScript yang dirender PaperFallback. FlatTable komponen
    // cangkang dan tidak pernah muncul di sana.
    const { container } = render(
      <FlatTable systems={systems} locale="id" selected={null} dimmed={new Set()} onSelect={vi.fn()} />,
    );
    expect(container.textContent).not.toMatch(/JavaScript mati/);
    expect(container.textContent).toContain('terbuka lebih dulu kalau gerak dikurangi');
  });
});
