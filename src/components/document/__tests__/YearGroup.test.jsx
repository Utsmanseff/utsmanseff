import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import YearGroup from '@/components/document/YearGroup';

const base = {
  slug: 'hris-nirwana', client: 'RSU Nirwana', year: '2026',
  tier: 'full', access: 'internal', repo: null,
  shortName: { id: 'HRIS', en: 'HRIS' },
};

const renderGroup = (systems) =>
  render(<YearGroup year="2026" systems={systems} locale="id" dimmed={new Set()} />);

describe('YearGroup', () => {
  it('never nests one link inside another', () => {
    // <a> di dalam <a> itu HTML tidak sah, dan hidrasi Next menatanya ulang
    // diam-diam tanpa error. Yang diperiksa DOM-nya, bukan className-nya.
    const { container } = renderGroup([
      { ...base, repo: 'https://github.com/Utsmanseff/HRIS-Nirwana' },
    ]);
    for (const a of container.querySelectorAll('a')) {
      expect(a.parentElement.closest('a')).toBeNull();
    }
  });

  it('gives a full-tier row with a repo two sibling links', () => {
    const { container } = renderGroup([
      { ...base, repo: 'https://github.com/Utsmanseff/HRIS-Nirwana' },
    ]);
    expect(container.querySelectorAll('a')).toHaveLength(2);
    expect(screen.getByRole('link', { name: /HRIS/ })).toHaveAttribute('href', '/kerja/hris-nirwana');
    expect(screen.getByRole('link', { name: /KODE/ })).toHaveAttribute(
      'href',
      'https://github.com/Utsmanseff/HRIS-Nirwana',
    );
  });

  it('leaves a row without a repo at one link', () => {
    const { container } = renderGroup([base]);
    expect(container.querySelectorAll('a')).toHaveLength(1);
    expect(screen.queryByRole('link', { name: /KODE/ })).toBeNull();
  });

  it('gives a brief-tier row its repo link even though it has no page', () => {
    const brief = {
      ...base, slug: 'simbas', tier: 'brief', access: 'none',
      shortName: { id: 'SIMBAS', en: 'SIMBAS' },
      repo: 'https://github.com/Utsmanseff/Sistem-Informasi-Manajemen-BanSos',
    };
    const { container } = renderGroup([brief]);
    expect(container.querySelectorAll('a')).toHaveLength(1);
    expect(screen.getByRole('link', { name: /KODE/ })).toBeTruthy();
  });

  it('paints the code link in the paper amber, not the dark one', () => {
    // #C97B3F is 2.8:1 on paper. The on-paper amber is #9C5A28 — text-amber-ink.
    renderGroup([{ ...base, repo: 'https://github.com/Utsmanseff/HRIS-Nirwana' }]);
    const code = screen.getByRole('link', { name: /KODE/ });
    expect(code.className).toContain('text-amber-ink');
    expect(code.className).not.toMatch(/(^|\s)text-amber(\s|$)/);
  });
});
