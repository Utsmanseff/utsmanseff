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
});
