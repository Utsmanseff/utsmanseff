import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Canvas from '@/components/canvas/Canvas';
import { LocaleProvider } from '@/lib/hooks/useLocale';

const projects = [
  {
    slug: 'a', client: 'X', year: '2025', tier: 'full', access: 'none', site: null,
    position: { x: 400, y: 400 }, related: [], tech: ['Laravel'], image: null,
    shortName: { id: 'Satu', en: 'One' },
    title: { id: 'Satu', en: 'One' },
    context: { id: 'Konteks satu.', en: 'Context one.' },
  },
  {
    slug: 'b', client: 'Y', year: '2024', tier: 'brief', access: 'none', site: null,
    position: { x: 900, y: 600 }, related: [], tech: ['Next.js'], image: null,
    shortName: { id: 'Dua', en: 'Two' },
    title: { id: 'Dua', en: 'Two' },
    context: { id: 'Konteks dua.', en: 'Context two.' },
  },
];

function drag(el, from, to) {
  fireEvent.pointerDown(el, { clientX: from.x, clientY: from.y, pointerId: 1 });
  fireEvent.pointerMove(el, { clientX: to.x, clientY: to.y, pointerId: 1 });
  fireEvent.pointerUp(el, { clientX: to.x, clientY: to.y, pointerId: 1 });
}

beforeEach(() => {
  // happy-dom reports zero-size elements; fitToNodes needs real numbers.
  Element.prototype.getBoundingClientRect = vi.fn(() => ({
    width: 1200, height: 800, top: 0, left: 0, right: 1200, bottom: 800, x: 0, y: 0,
  }));
  Element.prototype.setPointerCapture = vi.fn();
  Element.prototype.releasePointerCapture = vi.fn();
});

// CanvasChrome renders LangSwitcher, which reads the locale context.
function renderCanvas() {
  return render(<Canvas projects={projects} locale="id" />, { wrapper: LocaleProvider });
}

describe('Canvas', () => {
  it('gives a node to the projects with a page, and one door to the rest', () => {
    // Eight near-identical circles read as filler. Only full-tier projects earn
    // a node; the smaller work sits behind the "other work" node.
    renderCanvas();
    expect(screen.getByRole('button', { name: /Satu/ })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^Dua/ })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Project lain/ })).toBeInTheDocument();
  });

  it('says how many projects are behind the door before it is opened', () => {
    renderCanvas();
    expect(screen.getByRole('button', { name: /Project lain/ })).toHaveTextContent('1 project');
  });

  it('opens the smaller work through the group node, and offers the way back', () => {
    renderCanvas();
    fireEvent.click(screen.getByRole('button', { name: /Project lain/ }));
    const item = screen.getByRole('button', { name: /Dua/ });
    fireEvent.click(item);
    expect(screen.getByText('Konteks dua.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /← Project lain/ }));
    expect(screen.getByRole('button', { name: /Dua/ })).toBeInTheDocument();
  });

  it('moves the world when the surface is dragged', () => {
    renderCanvas();
    const surface = screen.getByTestId('canvas-surface');
    const world = screen.getByTestId('canvas-world');
    const before = world.style.transform;
    drag(surface, { x: 300, y: 300 }, { x: 420, y: 340 });
    expect(world.style.transform).not.toBe(before);
  });

  it('opens the panel when a node is clicked', () => {
    renderCanvas();
    fireEvent.click(screen.getByRole('button', { name: /Satu/ }));
    expect(screen.getByText('Konteks satu.')).toBeInTheDocument();
  });

  it('does not open the panel when the pointer travelled past the threshold', () => {
    renderCanvas();
    const node = screen.getByRole('button', { name: /Satu/ });
    drag(screen.getByTestId('canvas-surface'), { x: 100, y: 100 }, { x: 260, y: 180 });
    fireEvent.click(node);
    expect(screen.queryByText('Konteks satu.')).not.toBeInTheDocument();
  });

  it('restores the framing when "Tampilkan semua" is pressed', () => {
    renderCanvas();
    const world = screen.getByTestId('canvas-world');
    drag(screen.getByTestId('canvas-surface'), { x: 100, y: 100 }, { x: 500, y: 400 });
    const dragged = world.style.transform;
    fireEvent.click(screen.getByRole('button', { name: /Tampilkan semua/ }));
    expect(world.style.transform).not.toBe(dragged);
  });

  it('exposes the centre node with the owner name', () => {
    renderCanvas();
    expect(screen.getByText('Utsman')).toBeInTheDocument();
  });

  it('still opens a node activated by keyboard after the canvas was panned', () => {
    renderCanvas();
    const surface = screen.getByTestId('canvas-surface');
    drag(surface, { x: 100, y: 100 }, { x: 300, y: 260 });
    // The browser fires a click on the ground where the pan ended.
    fireEvent.click(surface);
    // Enter on a focused node arrives as a click with no pointer gesture at all.
    fireEvent.click(screen.getByRole('button', { name: /Satu/ }));
    expect(screen.getByText('Konteks satu.')).toBeInTheDocument();
  });

  it('does not capture the pointer before the gesture becomes a drag', () => {
    // Capturing on pointerdown retargets the pointerup to the surface, so the
    // browser resolves the click against the surface and the node never gets it.
    // Real clicks did nothing while every synthetic test click passed.
    renderCanvas();
    const surface = screen.getByTestId('canvas-surface');
    Element.prototype.setPointerCapture.mockClear();
    fireEvent.pointerDown(surface, { clientX: 100, clientY: 100, pointerId: 1 });
    expect(Element.prototype.setPointerCapture).not.toHaveBeenCalled();
    fireEvent.pointerMove(surface, { clientX: 102, clientY: 101, pointerId: 1 });
    expect(Element.prototype.setPointerCapture).not.toHaveBeenCalled();
  });

  it('captures the pointer once the gesture is a real drag', () => {
    renderCanvas();
    const surface = screen.getByTestId('canvas-surface');
    Element.prototype.setPointerCapture.mockClear();
    fireEvent.pointerDown(surface, { clientX: 100, clientY: 100, pointerId: 1 });
    fireEvent.pointerMove(surface, { clientX: 260, clientY: 180, pointerId: 1 });
    expect(Element.prototype.setPointerCapture).toHaveBeenCalled();
  });

  it('says who this is on the canvas, not only in the phone list', () => {
    // The blurb existed but rendered nowhere on desktop, and the centre circle
    // looked identical to the clickable ones while doing nothing when clicked.
    renderCanvas();
    expect(screen.getByText(/Membangun sistem rumah sakit/)).toBeInTheDocument();
  });

  it('dims the work that does not use the technology picked in the legend', () => {
    // The legend replaces the old icon grid: it has to change what the map
    // shows, not just list names next to it.
    renderCanvas();
    fireEvent.click(screen.getByRole('button', { name: /^Laravel/ }));
    expect(screen.getByRole('button', { name: /Satu/ })).toHaveStyle({ opacity: '1' });
    expect(screen.getByRole('button', { name: /Project lain/ })).toHaveStyle({ opacity: '0.22' });
  });

  it('lets the filter go, so the map comes back whole', () => {
    renderCanvas();
    const laravel = screen.getByRole('button', { name: /^Laravel/ });
    fireEvent.click(laravel);
    fireEvent.click(laravel);
    expect(screen.getByRole('button', { name: /Project lain/ })).toHaveStyle({ opacity: '1' });
  });

  it('counts the legend from the projects themselves', () => {
    renderCanvas();
    expect(screen.getByRole('button', { name: /^Laravel/ })).toHaveTextContent('1');
  });
});
