import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LocaleProvider } from '@/lib/hooks/useLocale';
import CanvasChrome from '@/components/canvas/CanvasChrome';

const renderChrome = (locale = 'id', props = {}) =>
  render(<CanvasChrome locale={locale} onFit={() => {}} {...props} />, { wrapper: LocaleProvider });

describe('CanvasChrome', () => {
  it('tells the visitor to click, not only to drag', () => {
    // The owner could not work out how to use the canvas: nothing on screen
    // named the one action that matters, and the only cue taught dragging.
    renderChrome('id');
    expect(screen.getByText(/Klik simpul/)).toBeInTheDocument();
  });

  it('says the same in English', () => {
    renderChrome('en');
    expect(screen.getByText(/Click a node/)).toBeInTheDocument();
  });

  it('offers a way back to the whole map', () => {
    renderChrome('id');
    expect(screen.getByRole('button', { name: /Tampilkan semua/ })).toBeInTheDocument();
  });

  it('steps out of the way while a preview panel is open', () => {
    // The switcher used to sit on top of the panel's close button. Fading is not
    // enough on its own: invisible chrome must stop taking clicks and focus too.
    const { container } = renderChrome('id', { hidden: true });
    const wrapper = container.firstChild;
    expect(wrapper).toHaveAttribute('inert');
    expect(screen.getByRole('button', { name: /Tampilkan semua/ }).closest('div'))
      .toHaveStyle({ opacity: '0', pointerEvents: 'none' });
  });
});
