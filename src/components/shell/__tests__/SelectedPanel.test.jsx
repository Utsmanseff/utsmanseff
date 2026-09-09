import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import SelectedPanel from '@/components/shell/SelectedPanel';

const system = {
  slug: 'hris-nirwana', client: 'RSU Nirwana', year: '2026', access: 'internal',
  tier: 'full', tech: ['Laravel'],
  shortName: { id: 'HRIS', en: 'HRIS' },
  blurb: { id: 'Ringkas.', en: 'Short.' },
};

const named = (container) => [...container.querySelectorAll('*')]
  .filter((el) => el.style.viewTransitionName === 'sistem-aktif');

describe('SelectedPanel', () => {
  it('names its title block, so the reading page has something to grow from', () => {
    const { container } = render(
      <SelectedPanel system={system} locale="id" span="2024-2026" />,
    );
    expect(named(container)).toHaveLength(1);
    expect(named(container)[0].textContent).toContain('HRIS');
  });

  it('names nothing while it is still the record block', () => {
    // Two elements carrying one name make the browser cancel the transition
    // without an error, so the empty case is a guard, not a formality.
    const { container } = render(
      <SelectedPanel system={null} locale="id" span="2024-2026" />,
    );
    expect(named(container)).toHaveLength(0);
  });
});
