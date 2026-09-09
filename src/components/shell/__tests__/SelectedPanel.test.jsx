import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SelectedPanel from '@/components/shell/SelectedPanel';

const system = {
  slug: 'hris-nirwana', client: 'RSU Nirwana', year: '2026', access: 'internal',
  tier: 'full', tech: ['Laravel'],
  shortName: { id: 'HRIS', en: 'HRIS' },
  blurb: { id: 'Ringkas.', en: 'Short.' },
};

const renderPanel = (props = {}) =>
  render(
    <SelectedPanel system={system} locale="id" span="2024-2026" onOpen={vi.fn()} {...props} />,
  );

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

  it('takes a plain click through the door instead of the link', () => {
    const onOpen = vi.fn();
    renderPanel({ onOpen });
    const link = screen.getByRole('link', { name: /BUKA HALAMAN/ });
    const notPrevented = fireEvent.click(link, { button: 0 });
    expect(onOpen).toHaveBeenCalledWith('hris-nirwana');
    // false berarti preventDefault dipanggil: tautannya tidak menavigasi sendiri.
    expect(notPrevented).toBe(false);
  });

  it('leaves a ctrl-click alone, so a new tab still works', () => {
    const onOpen = vi.fn();
    renderPanel({ onOpen });
    const notPrevented = fireEvent.click(
      screen.getByRole('link', { name: /BUKA HALAMAN/ }),
      { button: 0, ctrlKey: true },
    );
    expect(onOpen).not.toHaveBeenCalled();
    expect(notPrevented).toBe(true);
  });

  it('keeps a real href, so the link can be copied and opened directly', () => {
    renderPanel();
    expect(screen.getByRole('link', { name: /BUKA HALAMAN/ }))
      .toHaveAttribute('href', '/kerja/hris-nirwana');
  });
});
