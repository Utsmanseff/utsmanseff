import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FilterSheet from '@/components/document/FilterSheet';
import { EMPTY_FILTERS } from '@/lib/shell/filters';
import { projects } from '@/lib/data/projects';

const setup = (filters = EMPTY_FILTERS) => {
  const onToggle = vi.fn();
  const onReset = vi.fn();
  const utils = render(
    <FilterSheet
      systems={projects}
      filters={filters}
      locale="id"
      onToggle={onToggle}
      onReset={onReset}
      onClose={() => {}}
    />,
  );
  return { onToggle, onReset, ...utils };
};

describe('FilterSheet · ruang untuk bar yang menimpanya', () => {
  it('reserves the fixed bottom bar height, so its own controls stay tappable', () => {
    // BottomBar `fixed bottom-0 h-14` menempati 56px terbawah viewport, dan
    // sheet ini `sticky bottom-0`. Tanpa cadangan ini, baris TERAPKAN dan
    // KETUK UNTUK MENUTUP berdiri persis di bawah bar itu: `elementFromPoint`
    // di tengahnya mengembalikan BottomBar, dan sheet tidak pernah bisa
    // ditutup. Terukur di browser pada 375x812, 2026-09-10.
    //
    // Tidak ada unit test yang bisa menangkap tumpang tindihnya sendiri —
    // happy-dom tidak menata apa pun — jadi yang dijaga di sini angkanya.
    const { container } = setup();
    expect(container.firstChild.className).toContain('pb-[74px]');
  });

  it('shows no drag handle, because nothing here can be dragged', () => {
    // Garis kecil di kepala sheet berbentuk seperti pegangan tarik, padahal
    // tidak ada kode seret di mana pun. Utsman mencoba menariknya waktu sheet
    // tidak bisa ditutup, dan janji palsu itu ikut menyesatkannya.
    const { container } = setup();
    expect(container.querySelector('.h-\\[3px\\]')).toBeNull();
  });
});

describe('FilterSheet', () => {
  it('offers a chip per client, access state and technology', () => {
    setup();
    expect(screen.getByRole('button', { name: 'RSU Nirwana' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'internal' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'TensorFlow.js' })).toBeInTheDocument();
  });

  it('reports the key and value of the chip that was pressed', () => {
    const { onToggle } = setup();
    fireEvent.click(screen.getByRole('button', { name: 'BPN' }));
    expect(onToggle).toHaveBeenCalledWith('client', 'bpn');
  });

  it('marks the active chip as pressed', () => {
    setup({ ...EMPTY_FILTERS, access: 'public' });
    expect(screen.getByRole('button', { name: 'public' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'internal' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('shows no count of what is filtered', () => {
    const { container } = setup({ ...EMPTY_FILTERS, access: 'public' });
    expect(container.textContent).not.toMatch(/\d+\s*(dari|of)\s*\d+/i);
  });
});
