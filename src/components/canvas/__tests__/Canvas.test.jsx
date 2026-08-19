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
  it('renders a node for every project', () => {
    renderCanvas();
    expect(screen.getByRole('button', { name: /Satu/ })).toBeInTheDocument();
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
});
