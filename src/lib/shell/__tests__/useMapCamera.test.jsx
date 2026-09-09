import { describe, it, expect, vi, afterEach } from 'vitest';
import { useState } from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { useMapCamera } from '@/lib/shell/useMapCamera';

// Probe: hook ini tidak menggambar apa pun sendiri, jadi yang diuji adalah
// angka yang dikeluarkannya, bukan rupa apa pun.
function Probe() {
  const camera = useMapCamera();
  // dragged() dibaca di dalam onClick, sama seperti MapScene membacanya. Membaca
  // saat render melaporkan angka basi: menekan pointer tidak memicu render, jadi
  // reset-nya belum terlihat di pohon walau ref-nya sudah nol.
  const [lastAsked, setLastAsked] = useState(null);
  return (
    <div data-testid="pane" {...camera.handlers}>
      <output data-testid="rot">{camera.rotZ.toFixed(2)}</output>
      <button type="button" data-testid="ask" onClick={() => setLastAsked(camera.dragged())}>
        ask
      </button>
      <output data-testid="dragged">{String(lastAsked)}</output>
    </div>
  );
}

const rot = () => Number(screen.getByTestId('rot').textContent);
const dragged = () => {
  fireEvent.click(screen.getByTestId('ask'));
  return screen.getByTestId('dragged').textContent === 'true';
};

describe('useMapCamera', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

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

  it('leaves the camera where the pointer left it', () => {
    render(<Probe />);
    const pane = screen.getByTestId('pane');
    fireEvent.pointerDown(pane, { clientX: 200 });
    fireEvent.pointerMove(pane, { clientX: 260 });
    fireEvent.pointerUp(pane);
    expect(rot()).toBeCloseTo(-40 + 60 * 0.22, 5);
  });

  it('leaves it there too when the pointer is cancelled', () => {
    render(<Probe />);
    const pane = screen.getByTestId('pane');
    fireEvent.pointerDown(pane, { clientX: 200 });
    fireEvent.pointerMove(pane, { clientX: 260 });
    fireEvent.pointerCancel(pane);
    expect(rot()).toBeCloseTo(-40 + 60 * 0.22, 5);
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

  it('holds the angle the wheel left it on, however long it goes quiet', () => {
    vi.useFakeTimers();
    render(<Probe />);
    fireEvent.wheel(screen.getByTestId('pane'), { deltaY: 100, deltaX: 0 });
    act(() => { vi.advanceTimersByTime(5000); });
    expect(rot()).toBeCloseTo(-28, 5);
  });

  it('keeps every notch, so scrolling twice goes twice as far', () => {
    vi.useFakeTimers();
    render(<Probe />);
    const pane = screen.getByTestId('pane');
    fireEvent.wheel(pane, { deltaY: 100, deltaX: 0 });
    act(() => { vi.advanceTimersByTime(1000); });
    fireEvent.wheel(pane, { deltaY: 100, deltaX: 0 });
    act(() => { vi.advanceTimersByTime(1000); });
    expect(rot()).toBeCloseTo(-16, 5);
  });

  it('does not call a small wobble a drag', () => {
    render(<Probe />);
    const pane = screen.getByTestId('pane');
    fireEvent.pointerDown(pane, { clientX: 200 });
    fireEvent.pointerMove(pane, { clientX: 202 });
    fireEvent.pointerUp(pane);
    expect(dragged()).toBe(false);
  });

  it('calls a real sweep a drag', () => {
    render(<Probe />);
    const pane = screen.getByTestId('pane');
    fireEvent.pointerDown(pane, { clientX: 200 });
    fireEvent.pointerMove(pane, { clientX: 240 });
    fireEvent.pointerUp(pane);
    expect(dragged()).toBe(true);
  });

  it('forgets the last drag when a new press begins', () => {
    render(<Probe />);
    const pane = screen.getByTestId('pane');
    fireEvent.pointerDown(pane, { clientX: 200 });
    fireEvent.pointerMove(pane, { clientX: 240 });
    fireEvent.pointerUp(pane);
    fireEvent.pointerDown(pane, { clientX: 200 });
    expect(dragged()).toBe(false);
  });

  it('counts the distance travelled, not the distance from the start', () => {
    render(<Probe />);
    const pane = screen.getByTestId('pane');
    fireEvent.pointerDown(pane, { clientX: 200 });
    fireEvent.pointerMove(pane, { clientX: 230 });
    fireEvent.pointerMove(pane, { clientX: 200 });
    fireEvent.pointerUp(pane);
    expect(dragged()).toBe(true);
  });
});
