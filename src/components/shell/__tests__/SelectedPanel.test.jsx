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
  const brief = { ...system, slug: 'simbas', tier: 'brief', shortName: { id: 'SIMBAS', en: 'SIMBAS' } };
  const REPO = 'https://github.com/Utsmanseff/Sistem-Informasi-Manajemen-BanSos';

  it('keeps a full-tier system without a repo exactly as it was', () => {
    renderPanel({ system: { ...system, repo: null } });
    expect(screen.getByRole('link', { name: /BUKA HALAMAN/ })).toBeTruthy();
    expect(screen.queryByRole('link', { name: /Lihat kode/ })).toBeNull();
  });

  it('gives a full-tier system with a repo a second, quieter row', () => {
    renderPanel({ system: { ...system, repo: 'https://github.com/Utsmanseff/HRIS-Nirwana' } });
    expect(screen.getByRole('link', { name: /BUKA HALAMAN/ })).toBeTruthy();
    const code = screen.getByRole('link', { name: /Lihat kode/ });
    expect(code).toHaveAttribute('href', 'https://github.com/Utsmanseff/HRIS-Nirwana');
    // Dua kotak amber bertumpuk membuat keduanya berhenti berarti apa-apa.
    expect(code.className).toContain('border-rule');
    expect(code.className).not.toContain('border-amber');
  });

  it('lets the repo replace the dead label on a brief-tier system', () => {
    renderPanel({ system: { ...brief, repo: REPO } });
    const code = screen.getByRole('link', { name: /Lihat kode/ });
    expect(code).toHaveAttribute('href', REPO);
    // Label mati di atas tautan hidup itu janji palsu yang kedua.
    expect(screen.queryByText(/RINGKASAN SAJA/)).toBeNull();
    // Ia satu-satunya jalan keluar dari panel ini, jadi ia amber penuh.
    expect(code.className).toContain('border-amber');
  });

  it('still says there is no page when a brief-tier system has no repo', () => {
    renderPanel({ system: { ...brief, repo: null } });
    expect(screen.getByText(/RINGKASAN SAJA/)).toBeTruthy();
    expect(screen.queryByRole('link', { name: /Lihat kode/ })).toBeNull();
  });

  it('sends the code link straight out, never through the door', () => {
    const onOpen = vi.fn();
    renderPanel({ system: { ...brief, repo: REPO }, onOpen });
    const code = screen.getByRole('link', { name: /Lihat kode/ });
    fireEvent.click(code, { button: 0 });
    expect(onOpen).not.toHaveBeenCalled();
    expect(code).toHaveAttribute('target', '_blank');
  });

});
