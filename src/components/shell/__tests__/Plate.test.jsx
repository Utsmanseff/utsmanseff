import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
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
  it('is a button, so it can be reached by keyboard', () => {
    renderPlate();
    expect(screen.getByRole('button', { name: /HRIS/ })).toBeInTheDocument();
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
