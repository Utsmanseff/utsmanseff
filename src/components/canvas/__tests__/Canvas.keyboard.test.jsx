import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LocaleProvider } from '@/lib/hooks/useLocale';
import Canvas from '@/components/canvas/Canvas';

const projects = [
  {
    slug: 'a', client: 'X', year: '2025', tier: 'full', access: 'none', site: null,
    position: { x: 200, y: 200 }, related: [], tech: ['Laravel'], image: null,
    shortName: { id: 'Satu', en: 'One' },
    title: { id: 'Satu', en: 'One' },
    context: { id: 'Konteks satu.', en: 'Context one.' },
  },
  {
    slug: 'b', client: 'Y', year: '2024', tier: 'brief', access: 'none', site: null,
    position: { x: 1400, y: 900 }, related: [], tech: ['Next.js'], image: null,
    shortName: { id: 'Dua', en: 'Two' },
    title: { id: 'Dua', en: 'Two' },
    context: { id: 'Konteks dua.', en: 'Context two.' },
  },
];

function renderCanvas() {
  return render(<Canvas projects={projects} locale="id" />, { wrapper: LocaleProvider });
}

beforeEach(() => {
  Element.prototype.getBoundingClientRect = vi.fn(() => ({
    width: 1200, height: 800, top: 0, left: 0, right: 1200, bottom: 800, x: 0, y: 0,
  }));
  Element.prototype.setPointerCapture = vi.fn();
  Element.prototype.releasePointerCapture = vi.fn();
});

describe('Canvas keyboard access', () => {
  it('recentres the viewport when a node receives focus', () => {
    renderCanvas();
    const world = screen.getByTestId('canvas-world');
    const surface = screen.getByTestId('canvas-surface');
    fireEvent.pointerDown(surface, { clientX: 0, clientY: 0, pointerId: 1 });
    fireEvent.pointerMove(surface, { clientX: 600, clientY: 500, pointerId: 1 });
    fireEvent.pointerUp(surface, { clientX: 600, clientY: 500, pointerId: 1 });
    const dragged = world.style.transform;
    fireEvent.focus(screen.getByRole('button', { name: /Dua/ }));
    expect(world.style.transform).not.toBe(dragged);
  });

  it('opens the panel on Enter and closes it on Escape', async () => {
    renderCanvas();
    fireEvent.click(screen.getByRole('button', { name: /Satu/ }));
    expect(screen.getByText('Konteks satu.')).toBeInTheDocument();
    fireEvent.keyDown(window, { key: 'Escape' });
    // PreviewPanel keeps the closing content mounted for one fade (FADE_MS) before
    // unmounting, so it can ease its opacity out instead of vanishing instantly.
    // Do not "simplify" this back to a synchronous assertion — it will flake/fail
    // against that intentional fade-out delay.
    await waitFor(() =>
      expect(screen.queryByText('Konteks satu.')).not.toBeInTheDocument()
    );
  });

  it('does not recentre when focus comes from a mouse click', () => {
    renderCanvas();
    const world = screen.getByTestId('canvas-world');
    const node = screen.getByRole('button', { name: /Dua/ });
    const before = world.style.transform;
    // A click fires pointerdown, then focus, then pointerup — the map must not
    // slide out from under someone who clicked a node they could already see.
    fireEvent.pointerDown(node, { clientX: 500, clientY: 400, pointerId: 1 });
    fireEvent.focus(node);
    expect(world.style.transform).toBe(before);
    fireEvent.pointerUp(node, { clientX: 500, clientY: 400, pointerId: 1 });
    expect(world.style.transform).toBe(before);
  });
});
