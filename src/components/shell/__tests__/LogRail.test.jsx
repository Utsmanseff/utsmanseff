import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import LogRail from '@/components/shell/LogRail';
import { EMPTY_FILTERS } from '@/lib/shell/filters';

const systems = [
  { slug: 'hris-nirwana', access: 'internal', shortName: { id: 'HRIS', en: 'HRIS' } },
  { slug: 'sibenih', access: 'none', shortName: { id: 'SIBENIH', en: 'SIBENIH' } },
];

const renderRail = (props = {}) =>
  render(
    <LogRail
      systems={systems} locale="id" log={[]} filters={EMPTY_FILTERS}
      selected={null} dimmed={new Set(['sibenih'])}
      onChip={vi.fn()} onReset={vi.fn()} onSelect={vi.fn()} {...props}
    />,
  );

describe('LogRail', () => {
  it('does not promise a filtered list it never gives', () => {
    // Shell mengoper systems utuh, bukan hasil filter: yang tersaring cuma
    // diredupkan, dan daftar ini selalu berisi semuanya.
    renderRail();
    expect(screen.queryByText('SISTEM YANG TAMPIL')).toBeNull();
    expect(screen.getByText('DAFTAR SISTEM')).toBeInTheDocument();
  });

  it('explains the list instead of repeating the dimming', () => {
    const { container } = renderRail();
    expect(container.textContent).toContain('Cermin peta');
    expect(container.textContent).toContain('Tab');
  });

  it('no longer claims dimmed systems get pushed back', () => {
    // Tidak ada yang didorong: plate redup hanya turun ke opacity .34 tanpa
    // berpindah. Dan catatan ini berdiri di kedua view, jadi ia juga tidak
    // boleh menyebut peta sebagai tempatnya.
    const { container } = renderRail();
    expect(container.textContent).not.toContain('didorong ke belakang');
    expect(container.textContent).not.toContain('tetap di peta');
  });

  it('offers a stack chip that actually matches something', () => {
    renderRail();
    expect(screen.getByRole('button', { name: 'stack:livewire' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'stack:soap' })).toBeNull();
  });

  it('speaks English when asked to', () => {
    const { container } = renderRail({ locale: 'en' });
    expect(screen.getByText('SYSTEM LIST')).toBeInTheDocument();
    expect(container.textContent).toContain('A mirror of the map');
  });
});
