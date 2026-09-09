import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Plate from '@/components/shell/Plate';

const system = {
  slug: 'hris-nirwana', client: 'RSU Nirwana', year: '2026', access: 'internal',
  tier: 'full', tech: ['Laravel', 'Livewire', 'Alpine.js', 'MySQL', 'TensorFlow.js'],
  shortName: { id: 'HRIS', en: 'HRIS' },
};
const pos = {
  slug: 'hris-nirwana', year: '2026', x: 40, y: 440,
  width: 165, height: 115, layers: 5, topZ: 28, layerStep: 7,
};

const renderPlate = (props = {}) =>
  render(
    <Plate
      system={system} position={pos} locale="id" rotZ={-40}
      selected={false} dimmed={false} onSelect={vi.fn()} {...props}
    />,
  );

describe('Plate', () => {
  it('is one button covering the whole plate, not just its label', () => {
    const { container } = renderPlate();
    const button = screen.getByRole('button', { name: 'HRIS RSU NIRWANA · INTERNAL' });
    expect(button).toBe(container.firstChild);
    expect(container.querySelectorAll('button')).toHaveLength(1);
    expect(container.querySelectorAll('[data-layer]')[0].closest('button')).toBe(button);
  });

  it('says whether it is the selected system', () => {
    renderPlate({ selected: true });
    expect(screen.getByRole('button', { name: /HRIS/ })).toHaveAttribute('aria-pressed', 'true');
  });

  it('reports the slug it stands for when pressed', async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    renderPlate({ onSelect });
    await user.click(screen.getByRole('button', { name: /HRIS/ }));
    expect(onSelect).toHaveBeenCalledWith('hris-nirwana');
  });

  it('draws one layer per technology', () => {
    const { container } = renderPlate();
    expect(container.querySelectorAll('[data-layer]')).toHaveLength(5);
  });

  it('states client and access, and no counts', () => {
    renderPlate();
    expect(screen.getByText(/RSU NIRWANA · INTERNAL/i)).toBeInTheDocument();
    expect(screen.queryByText(/5 (TEKNOLOGI|TECHNOLOGIES)/i)).toBeNull();
  });

  it('counter-rotates its label so text stays upright', () => {
    const { container } = renderPlate({ rotZ: -25 });
    const label = container.querySelector('[data-plate-label]');
    expect(label.getAttribute('style')).toContain('rotateZ(25deg)');
  });

  it('dims without disappearing', () => {
    const { container } = renderPlate({ dimmed: true });
    expect(container.firstChild).toHaveStyle({ opacity: '0.34' });
  });
});
