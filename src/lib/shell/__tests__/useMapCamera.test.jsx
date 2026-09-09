import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useMapCamera } from '@/lib/shell/useMapCamera';
import { CAMERA_ANGLES } from '@/lib/shell/layout';

// Probe: hook ini tidak menggambar apa pun sendiri, jadi yang diuji adalah
// angka yang dikeluarkannya, bukan rupa apa pun.
function Probe() {
  const camera = useMapCamera();
  return (
    <div data-testid="pane" {...camera.handlers}>
      <output data-testid="rot">{camera.rotZ.toFixed(2)}</output>
    </div>
  );
}

const rot = () => Number(screen.getByTestId('rot').textContent);

describe('useMapCamera', () => {
  it('starts at the angle the map has always opened on', () => {
    render(<Probe />);
    expect(rot()).toBe(-40);
  });

  it('follows the pointer one to one while it is down', () => {
    render(<Probe />);
    const pane = screen.getByTestId('pane');
    fireEvent.pointerDown(pane, { clientX: 200 });
    fireEvent.pointerMove(pane, { clientX: 300 });
    expect(rot()).toBeCloseTo(-40 + 100 * 0.22, 5);
  });

  it('ignores a pointer that never went down', () => {
    render(<Probe />);
    fireEvent.pointerMove(screen.getByTestId('pane'), { clientX: 300 });
    expect(rot()).toBe(-40);
  });

  it('snaps to one of the three camera angles when the pointer lifts', () => {
    render(<Probe />);
    const pane = screen.getByTestId('pane');
    fireEvent.pointerDown(pane, { clientX: 200 });
    fireEvent.pointerMove(pane, { clientX: 260 });
    fireEvent.pointerUp(pane);
    expect(CAMERA_ANGLES).toContain(rot());
  });

  it('snaps the same way when the pointer is cancelled', () => {
    render(<Probe />);
    const pane = screen.getByTestId('pane');
    fireEvent.pointerDown(pane, { clientX: 200 });
    fireEvent.pointerMove(pane, { clientX: 260 });
    fireEvent.pointerCancel(pane);
    expect(CAMERA_ANGLES).toContain(rot());
  });

  it('turns the camera with the wheel, one to one', () => {
    render(<Probe />);
    fireEvent.wheel(screen.getByTestId('pane'), { deltaY: 100, deltaX: 0 });
    expect(rot()).toBeCloseTo(-40 + 100 * 0.12, 5);
  });

  it('turns the other way for the other direction', () => {
    render(<Probe />);
    fireEvent.wheel(screen.getByTestId('pane'), { deltaY: -100, deltaX: 0 });
    expect(rot()).toBeCloseTo(-40 - 100 * 0.12, 5);
  });

  it('lets a sideways trackpad swipe win over the smaller vertical drift', () => {
    render(<Probe />);
    fireEvent.wheel(screen.getByTestId('pane'), { deltaX: 100, deltaY: 8 });
    expect(rot()).toBeCloseTo(-40 + 100 * 0.12, 5);
  });

  it('keeps the wheel when the vertical delta is the larger one', () => {
    render(<Probe />);
    fireEvent.wheel(screen.getByTestId('pane'), { deltaX: 8, deltaY: 100 });
    expect(rot()).toBeCloseTo(-40 + 100 * 0.12, 5);
  });

  it('adds up across several notches', () => {
    render(<Probe />);
    const pane = screen.getByTestId('pane');
    fireEvent.wheel(pane, { deltaY: 100, deltaX: 0 });
    fireEvent.wheel(pane, { deltaY: 100, deltaX: 0 });
    expect(rot()).toBeCloseTo(-40 + 24, 5);
  });
});
