import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within, act } from '@testing-library/react';
import { LocaleProvider } from '@/lib/hooks/useLocale';
import Shell from '@/components/shell/Shell';
import { projects } from '@/lib/data/projects';

vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }));

// Most of these tests are about what happens once the gate is behind you, so
// they start from a tab that has already passed it. That is a real state, not
// a back door: it is what a visitor returning from a reading page sees.
beforeEach(() => {
  window.sessionStorage.clear();
  window.sessionStorage.setItem('gate', '1');
});

const renderShell = (props = {}) =>
  render(<Shell systems={projects} locale="id" calm={false} {...props} />, {
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

// The shell renders underneath the gate the whole time, and the top bar's
// "LEWATI PETA → DAFTAR SISTEM" matches the same words as the gate's own two
// buttons. Every gate query is scoped to the gate for that reason.
const gateButton = (name) =>
  within(screen.getByTestId('gate')).getByRole('button', { name });

describe('Shell · the gate', () => {
  it('opens on the gate in a fresh tab', () => {
    window.sessionStorage.clear();
    renderShell();
    expect(screen.getByTestId('gate')).toBeInTheDocument();
  });

  it('is already past the gate when the tab remembers it', () => {
    renderShell();
    expect(screen.queryByTestId('gate')).toBeNull();
  });

  it('lands on the flat table when that is the door taken', () => {
    window.sessionStorage.clear();
    renderShell();
    fireEvent.click(gateButton(/DAFTAR/));
    expect(screen.getByTestId('flat-table')).toBeInTheDocument();
  });

  it('lands on the map when that is the door taken', () => {
    window.sessionStorage.clear();
    renderShell();
    fireEvent.click(gateButton(/PETA/));
    expect(screen.getByTestId('map-pane')).toBeInTheDocument();
  });

  it('fades before it leaves, rather than blinking out', () => {
    vi.useFakeTimers();
    try {
      window.sessionStorage.clear();
      renderShell();
      fireEvent.click(gateButton(/DAFTAR/));

      // Still mounted, on its way out.
      expect(screen.getByTestId('gate')).toHaveStyle({ opacity: '0' });

      act(() => vi.advanceTimersByTime(700));
      expect(screen.queryByTestId('gate')).toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });

  it('defaults a reduced-motion visitor to the flat table', () => {
    window.sessionStorage.clear();
    renderShell({ calm: true });
    fireEvent.keyDown(window, { key: 'Enter' });
    expect(screen.getByTestId('flat-table')).toBeInTheDocument();
  });

  it('defaults everyone else to the map', () => {
    window.sessionStorage.clear();
    renderShell();
    fireEvent.keyDown(window, { key: 'Enter' });
    expect(screen.getByTestId('map-pane')).toBeInTheDocument();
  });

  it('puts the shell out of reach while the gate is up', () => {
    window.sessionStorage.clear();
    renderShell();
    // Without this the gate is a picture of a gate: Tab and a screen reader
    // walk straight into the console and the rail behind it.
    expect(screen.getByTestId('shell').querySelector('.contents'))
      .toHaveAttribute('inert');
  });

  it('gives the shell back the moment the gate starts leaving', () => {
    window.sessionStorage.clear();
    renderShell();
    fireEvent.click(gateButton(/DAFTAR/));
    expect(screen.getByTestId('shell').querySelector('.contents'))
      .not.toHaveAttribute('inert');
  });

  it('gives the console the letter that opened the gate', () => {
    window.sessionStorage.clear();
    renderShell();
    fireEvent.keyDown(window, { key: 'f' });
    const input = screen.getByLabelText('Konsol perintah');
    expect(input).toHaveValue('f');
    expect(input).toHaveFocus();
  });
});
