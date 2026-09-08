import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { LocaleProvider } from '@/lib/hooks/useLocale';
import Shell from '@/components/shell/Shell';
import { projects } from '@/lib/data/projects';


vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn(), replace: vi.fn() }) }));

// The gate is a page of its own now, so nothing here has to get past it. The
// view and the seeded letter arrive as props, the way `/sistem` hands them over.
const renderShell = (props = {}) =>
  render(<Shell systems={projects} locale="id" view="map" seed="" calm={false} {...props} />, {
    wrapper: LocaleProvider,
  });
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

  it('runs a typed command and logs it exactly like a chip', () => {
    renderShell();
    const input = screen.getByLabelText(/konsol/i);
    fireEvent.change(input, { target: { value: 'filter client:bpn' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(screen.getByText('$ filter client:bpn')).toBeInTheDocument();
  });

  it('says why a summary-only system will not open', () => {
    renderShell();
    const input = screen.getByLabelText(/konsol/i);
    fireEvent.change(input, { target: { value: 'open sigap' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(screen.getByText(/ringkasan saja · tidak ada halaman/i)).toBeInTheDocument();
  });

  it('reports an unknown command without pretending it worked', () => {
    renderShell();
    const input = screen.getByLabelText(/konsol/i);
    fireEvent.change(input, { target: { value: 'deploy' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(screen.getByText(/tidak dikenal · coba help/i)).toBeInTheDocument();
  });

  it('clears the filters on Escape', () => {
    renderShell();
    fireEvent.click(screen.getByRole('button', { name: 'client:bpn' }));
    const input = screen.getByLabelText(/konsol/i);
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(screen.getByRole('button', { name: 'client:bpn' })).toHaveAttribute('aria-pressed', 'false');
  });
});

describe('Shell · what the URL decides', () => {
  it('opens on the view it was handed', () => {
    renderShell({ view: 'list' });
    expect(screen.getByTestId('flat-table')).toBeInTheDocument();
  });

  it('starts the console with the letter it was handed', () => {
    renderShell({ seed: 'f' });
    const input = screen.getByLabelText('Konsol perintah');
    expect(input).toHaveValue('f');
    // A letter typed at the gate is the first letter of a command. Landing it in
    // a box nobody is typing into would lose the second one.
    expect(input).toHaveFocus();
  });

  it('leaves the console empty, and unfocused, when there was no letter', () => {
    renderShell();
    const input = screen.getByLabelText('Konsol perintah');
    expect(input).toHaveValue('');
    expect(input).not.toHaveFocus();
  });

  it('has no gate to render any more', () => {
    renderShell();
    expect(screen.queryByTestId('gate')).toBeNull();
  });
});
