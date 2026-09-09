import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MapScene from '@/components/shell/MapScene';

const systems = [
  {
    slug: 'hris-nirwana', client: 'RSU Nirwana', year: '2026', access: 'internal',
    tier: 'full', tech: ['Laravel', 'Livewire', 'Alpine.js', 'MySQL', 'TensorFlow.js'],
    shortName: { id: 'HRIS', en: 'HRIS' },
  },
];

const renderScene = (props = {}) =>
  render(
    <MapScene
      systems={systems} locale="id" selected={null}
      dimmed={new Set()} onSelect={vi.fn()} {...props}
    />,
  );

describe('MapScene', () => {
  it('selects the system when a plate is pressed without dragging', () => {
    const onSelect = vi.fn();
    renderScene({ onSelect });
    fireEvent.click(screen.getByRole('button', { name: /HRIS/ }));
    expect(onSelect).toHaveBeenCalledWith('hris-nirwana');
  });

  it('swallows the click that ends a drag across the map', () => {
    const onSelect = vi.fn();
    renderScene({ onSelect });
    const pane = screen.getByTestId('map-pane');
    fireEvent.pointerDown(pane, { clientX: 200 });
    fireEvent.pointerMove(pane, { clientX: 260 });
    fireEvent.pointerUp(pane);
    fireEvent.click(screen.getByRole('button', { name: /HRIS/ }));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('lets the next press through once the drag is over', () => {
    const onSelect = vi.fn();
    renderScene({ onSelect });
    const pane = screen.getByTestId('map-pane');
    fireEvent.pointerDown(pane, { clientX: 200 });
    fireEvent.pointerMove(pane, { clientX: 260 });
    fireEvent.pointerUp(pane);
    fireEvent.pointerDown(pane, { clientX: 300 });
    fireEvent.pointerUp(pane);
    fireEvent.click(screen.getByRole('button', { name: /HRIS/ }));
    expect(onSelect).toHaveBeenCalledWith('hris-nirwana');
  });

  it('writes the angle it is holding into the ref it was handed', async () => {
    const angleRef = { current: null };
    renderScene({ angleRef });
    await waitFor(() => expect(angleRef.current).toBe(-40));
  });

  it('keeps that ref current as the camera turns', async () => {
    const angleRef = { current: null };
    renderScene({ angleRef });
    fireEvent.wheel(screen.getByTestId('map-pane'), { deltaY: 100, deltaX: 0 });
    await waitFor(() => expect(angleRef.current).toBeCloseTo(-28, 5));
  });

  it('opens on the angle it is given, not always on the default', () => {
    const angleRef = { current: null };
    renderScene({ angleRef, angle: -55 });
    expect(angleRef.current).toBe(-55);
  });
});
