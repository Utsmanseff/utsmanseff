import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import FadeIn from '@/components/ui/FadeIn';

describe('FadeIn', () => {
  it('starts hidden so it has somewhere to fade from', () => {
    const { container } = render(<FadeIn>isi</FadeIn>);
    expect(container.firstChild.style.opacity).toBe('0');
  });

  it('marks itself so the no-JavaScript override can find it', () => {
    // Without this hook the noscript rule in the root layout has no target, and
    // a reader with scripting off sees a blank page that crawlers can still read.
    const { container } = render(<FadeIn>isi</FadeIn>);
    expect(container.firstChild).toHaveAttribute('data-fade');
  });
});
