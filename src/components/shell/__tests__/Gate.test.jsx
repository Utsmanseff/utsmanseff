import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Gate from '@/components/shell/Gate';
import { projects } from '@/lib/data/projects';

const renderGate = (props = {}) => {
  const onEnter = vi.fn();
  const view = render(
    <Gate systems={projects} locale="id" calm={false} onEnter={onEnter} {...props} />,
  );
  return { onEnter, ...view };
};

describe('Gate', () => {
  it('names who built this, and where', () => {
    renderGate();
    expect(screen.getByText('Utsman')).toBeInTheDocument();
    expect(screen.getByText(/FULLSTACK DEVELOPER/)).toBeInTheDocument();
    expect(screen.getByText(/Banjarbaru, Kalimantan Selatan/)).toBeInTheDocument();
  });

  it('spans the years the work actually covers', () => {
    renderGate();
    expect(screen.getByText(/2024–2026/)).toBeInTheDocument();
  });

  it('lists the stack from the data, not from a hand-written list', () => {
    renderGate();
    const stack = screen.getByTestId('gate-stack').textContent;
    expect(stack).toContain('Laravel');
    expect(stack).toContain('TensorFlow.js');
    expect(stack).toContain('SOAP');
  });

  it('states no counts — every digit on the gate is a year', () => {
    const { container } = renderGate();
    const numbers = container.textContent.match(/\d[\d.]*/g) ?? [];
    expect(numbers.every((n) => n === '2024' || n === '2026')).toBe(true);
  });

  it('offers two doors, and each one names where it goes', () => {
    const { onEnter } = renderGate();
    fireEvent.click(screen.getByRole('button', { name: /PETA/ }));
    expect(onEnter).toHaveBeenCalledWith('map', null);

    fireEvent.click(screen.getByRole('button', { name: /DAFTAR/ }));
    expect(onEnter).toHaveBeenCalledWith('list', null);
  });

  it('speaks English when asked to', () => {
    renderGate({ locale: 'en' });
    expect(screen.getByRole('button', { name: /SEE SYSTEMS · MAP/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /SEE SYSTEMS · LIST/ })).toBeInTheDocument();
  });

  it('fades out when it is told it is leaving', () => {
    const { rerender } = renderGate();
    expect(screen.getByTestId('gate')).toHaveStyle({ opacity: '1' });

    rerender(
      <Gate systems={projects} locale="id" calm={false} leaving onEnter={vi.fn()} />,
    );
    expect(screen.getByTestId('gate')).toHaveStyle({ opacity: '0' });
  });
});

describe('Gate · dismissal', () => {
  it('closes on Enter, using the default view', () => {
    const { onEnter } = renderGate();
    fireEvent.keyDown(window, { key: 'Enter' });
    expect(onEnter).toHaveBeenCalledWith(null, null);
  });

  it('closes on Escape', () => {
    const { onEnter } = renderGate();
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onEnter).toHaveBeenCalledWith(null, null);
  });

  it('closes on a letter and hands that letter on to the console', () => {
    const { onEnter } = renderGate();
    fireEvent.keyDown(window, { key: 'f' });
    expect(onEnter).toHaveBeenCalledWith(null, 'f');
  });

  it('does not treat a space as a letter worth keeping', () => {
    const { onEnter } = renderGate();
    fireEvent.keyDown(window, { key: ' ' });
    expect(onEnter).toHaveBeenCalledWith(null, null);
  });

  it('swallows the keystroke it hands on, so the letter arrives once', () => {
    // fireEvent returns false when the handler called preventDefault. Without
    // it a real browser also delivers this keystroke to the console it is about
    // to focus, and `f` lands as `ff` — something happy-dom cannot show, since
    // it never performs the default text insertion.
    const { onEnter } = renderGate();
    expect(fireEvent.keyDown(window, { key: 'f' })).toBe(false);
    expect(onEnter).toHaveBeenCalledWith(null, 'f');
  });

  it('does not swallow Tab — the browser still needs it', () => {
    renderGate();
    expect(fireEvent.keyDown(window, { key: 'Tab' })).toBe(true);
  });

  it('leaves Tab alone, so the two buttons stay reachable', () => {
    const { onEnter } = renderGate();
    fireEvent.keyDown(window, { key: 'Tab' });
    expect(onEnter).not.toHaveBeenCalled();
  });

  it('ignores keys that are not text and not a decision', () => {
    const { onEnter } = renderGate();
    fireEvent.keyDown(window, { key: 'ArrowDown' });
    fireEvent.keyDown(window, { key: 'Shift' });
    expect(onEnter).not.toHaveBeenCalled();
  });

  it('ignores a letter pressed with a modifier — that is a browser shortcut', () => {
    const { onEnter } = renderGate();
    fireEvent.keyDown(window, { key: 'r', ctrlKey: true });
    expect(onEnter).not.toHaveBeenCalled();
  });

  it('closes when the visitor scrolls down', () => {
    const { onEnter } = renderGate();
    fireEvent.wheel(screen.getByTestId('gate'), { deltaY: 40 });
    expect(onEnter).toHaveBeenCalledWith(null, null);
  });

  it('stays put when the visitor scrolls up', () => {
    const { onEnter } = renderGate();
    fireEvent.wheel(screen.getByTestId('gate'), { deltaY: -40 });
    expect(onEnter).not.toHaveBeenCalled();
  });
});

describe('Gate · the drifting plates', () => {
  // The component throttles with rAF. Running the callback straight away makes
  // the assertion about the wiring, not about frame timing.
  const flushFrames = () =>
    vi.stubGlobal('requestAnimationFrame', (cb) => { cb(); return 1; });

  afterEach(() => vi.unstubAllGlobals());

  const plate = (i) =>
    screen.getByTestId('gate').querySelector(`[data-gate-plate="${i}"]`);

  it('moves the plates by different amounts as the pointer moves', () => {
    flushFrames();
    renderGate();
    fireEvent.mouseMove(screen.getByTestId('gate'), { clientX: 900, clientY: 300 });

    expect(plate(0).style.transform).toMatch(/translate\(/);
    expect(plate(0).style.transform).not.toBe(plate(1).style.transform);
  });

  it('keeps skewing them, so they stay the same shape as the map plates', () => {
    flushFrames();
    renderGate();
    fireEvent.mouseMove(screen.getByTestId('gate'), { clientX: 900, clientY: 300 });
    expect(plate(0).style.transform).toMatch(/skewY\(-16deg\)/);
  });

  // The direction had no guard, and it was backwards: the plates fled the
  // cursor instead of leaning toward it.
  it('leans them toward the cursor, not away from it', () => {
    flushFrames();
    renderGate();
    const gate = screen.getByTestId('gate');
    // happy-dom lays nothing out: the gate's box is 0x0, so the offsets come
    // out absurdly large. Only the sign means anything here — how far the
    // plates travel is a browser question, and this file cannot answer it.
    fireEvent.mouseMove(gate, { clientX: 400, clientY: 300 });

    const [x, y] = plate(0).style.transform
      .match(/translate\(([-\d.]+)px, ([-\d.]+)px\)/)
      .slice(1)
      .map(Number);
    expect(x).toBeGreaterThan(0);
    expect(y).toBeGreaterThan(0);
  });

  it('gives them no transition — a cursor is dragged, and dragging is 1:1', () => {
    flushFrames();
    renderGate();
    expect(plate(0).style.transition).toBe('');
  });

  it('does not move them at all for a visitor who asked for less motion', () => {
    flushFrames();
    renderGate({ calm: true });
    const before = plate(0).style.transform;
    fireEvent.mouseMove(screen.getByTestId('gate'), { clientX: 900, clientY: 300 });
    expect(plate(0).style.transform).toBe(before);
  });
});
