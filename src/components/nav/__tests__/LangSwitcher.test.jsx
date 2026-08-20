import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LocaleProvider } from '@/lib/hooks/useLocale';
import LangSwitcher from '@/components/nav/LangSwitcher';

const renderWith = (props) =>
  render(<LangSwitcher {...props} />, { wrapper: LocaleProvider });

describe('LangSwitcher', () => {
  it('colours the active locale for the paper layer by default', () => {
    renderWith();
    expect(screen.getByRole('button', { name: 'id' }).className).toContain('text-ink');
  });

  it('colours the active locale for the canvas when told it stands there', () => {
    // The canvas ground is near-black; paper ink measures 1.01:1 against it,
    // which is how this button was previously invisible on the map.
    renderWith({ tone: 'ground' });
    expect(screen.getByRole('button', { name: 'id' }).className).toContain('text-ground-ink');
  });

  it('never falls back to a token that no longer exists', () => {
    const { container } = renderWith({ tone: 'ground' });
    expect(container.innerHTML).not.toMatch(/forest|cream/);
  });
});
