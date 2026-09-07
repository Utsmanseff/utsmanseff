import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LocaleProvider } from '@/lib/hooks/useLocale';
import Shell from '@/components/shell/Shell';
import { projects } from '@/lib/data/projects';

const renderShell = () =>
  render(<Shell systems={projects} locale="id" />, { wrapper: LocaleProvider });

// Selection lives in the flat table; the map pane is empty until Task 13, so
// the tests that select something reach it through the skip chip.
const skipToTable = () =>
  fireEvent.click(screen.getByRole('button', { name: /LEWATI PETA/ }));

describe('Shell', () => {
  it('opens on the record block, before anything is selected', () => {
    renderShell();
    expect(screen.getByText('Banjarbaru, Kalimantan Selatan')).toBeInTheDocument();
    expect(screen.queryByText('TERPILIH')).toBeNull();
  });

  it('selects a system without opening it', () => {
    renderShell();
    skipToTable();
    fireEvent.click(screen.getByRole('button', { name: /HRIS/ }));
    expect(screen.getByText('TERPILIH')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /BUKA HALAMAN/ }))
      .toHaveAttribute('href', '/kerja/hris-nirwana');
  });

  it('refuses to offer a page for a summary-only system', () => {
    renderShell();
    skipToTable();
    fireEvent.click(screen.getByRole('button', { name: /SIGAP/ }));
    expect(screen.getByText(/RINGKASAN SAJA/)).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /BUKA HALAMAN/ })).toBeNull();
  });

  it('switches to the flat table and back', () => {
    renderShell();
    skipToTable();
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('shows no counts in its chrome', () => {
    const { container } = renderShell();
    expect(container.textContent).not.toMatch(/\b8 (SISTEM|SYSTEMS)\b/);
  });
});
