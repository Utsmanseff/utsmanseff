import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LocaleProvider } from '@/lib/hooks/useLocale';
import SystemsDocument from '@/components/document/SystemsDocument';
import { projects } from '@/lib/data/projects';

const renderDoc = (props = {}) =>
  render(
    <SystemsDocument systems={projects} locale="id" filters={null} {...props} />,
    { wrapper: LocaleProvider },
  );

describe('SystemsDocument', () => {
  it('opens with identity and no headline sentence', () => {
    renderDoc();
    expect(screen.getByText(/UTSMAN/)).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 1, name: /tahun|systems/i })).toBeNull();
  });

  it('descends by year, newest first', () => {
    const { container } = renderDoc();
    const years = [...container.querySelectorAll('[data-year]')].map((n) => n.dataset.year);
    expect(years).toEqual(['2026', '2025', '2024']);
  });

  it('links only the systems that have a reading page', () => {
    renderDoc();
    expect(screen.getByRole('link', { name: /HRIS/ })).toHaveAttribute('href', '/kerja/hris-nirwana');
    expect(screen.getByRole('link', { name: /SIGAP/ })).toHaveAttribute('href', '/kerja/sigap-bpn');
    // SIBENIH tetap ringkasan: namanya ada, tautannya tidak.
    expect(screen.queryByRole('link', { name: /SIBENIH/ })).toBeNull();
    expect(screen.getByText('SIBENIH')).toBeInTheDocument();
  });

  it('opens with the identity band, not the old one-line head', () => {
    renderDoc();
    expect(screen.getByText('Utsman')).toBeInTheDocument();
    expect(screen.getByTestId('paper-stack')).toBeInTheDocument();
  });

  it('keeps the desktop note, at the foot where it belongs', () => {
    const { container } = renderDoc();
    const note = screen.getByText(/Buka di desktop/);
    // Tidak menyebut peta isometrik dan konsol: menamai dua hal yang tidak
    // bisa dibuka dari sini membuat catatan ini terbaca seperti daftar yang
    // hilang, padahal isinya memang lengkap di halaman ini.
    expect(note.textContent).not.toMatch(/peta isometrik|konsol/i);
    const firstYear = container.querySelector('[data-year]');
    // Node.DOCUMENT_POSITION_FOLLOWING === 4: the note comes after the years.
    expect(firstYear.compareDocumentPosition(note) & 4).toBeTruthy();
  });

  it('states no counts anywhere', () => {
    const { container } = renderDoc();
    expect(container.textContent).not.toMatch(/\b8 (sistem|systems)\b/i);
  });
});
