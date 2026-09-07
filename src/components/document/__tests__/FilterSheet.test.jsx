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
