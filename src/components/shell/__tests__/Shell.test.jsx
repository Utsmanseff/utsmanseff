import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { LocaleProvider } from '@/lib/hooks/useLocale';
import Shell from '@/components/shell/Shell';
import { projects } from '@/lib/data/projects';

const renderShell = () =>
  render(<Shell systems={projects} locale="id" />, { wrapper: LocaleProvider });

// The rail lists every system in the default map view, so selection is driven
// there. The flat table repeats the same names, which is why these queries are
// scoped to the rail's list rather than the whole shell.
const railRow = (name) =>
  within(screen.getByRole('list')).getByRole('button', { name });

describe('Shell', () => {
  it('opens on the record block, before anything is selected', () => {
    renderShell();
    expect(screen.getByText('Banjarbaru, Kalimantan Selatan')).toBeInTheDocument();
    expect(screen.queryByText('TERPILIH')).toBeNull();
  });

  it('selects a system without opening it', () => {
    renderShell();
    fireEvent.click(railRow(/HRIS/));
    expect(screen.getByText('TERPILIH')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /BUKA HALAMAN/ }))
      .toHaveAttribute('href', '/kerja/hris-nirwana');
  });

  it('refuses to offer a page for a summary-only system', () => {
    renderShell();
    fireEvent.click(railRow(/SIGAP/));
    expect(screen.getByText(/RINGKASAN SAJA/)).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /BUKA HALAMAN/ })).toBeNull();
  });

  it('switches to the flat table and back', () => {
    renderShell();
    fireEvent.click(screen.getByRole('button', { name: /LEWATI PETA/ }));
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('shows no counts in its chrome', () => {
    const { container } = renderShell();
    expect(container.textContent).not.toMatch(/\b8 (SISTEM|SYSTEMS)\b/);
  });

  it('lists the systems in the rail and dims the ones a filter excludes', () => {
    renderShell();
    fireEvent.click(screen.getByRole('button', { name: 'client:bpn' }));
    const row = railRow(/Pendaftaran OCR/);
    expect(row.closest('li')).toHaveStyle({ opacity: '0.45' });
  });

  it('writes the same log line whether a chip or a command ran', () => {
    renderShell();
    fireEvent.click(screen.getByRole('button', { name: 'client:bpn' }));
    expect(screen.getByText('$ filter client:bpn')).toBeInTheDocument();
  });
});
