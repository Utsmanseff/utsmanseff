import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LocaleProvider } from '@/lib/hooks/useLocale';
import LangSwitcher from '@/components/nav/LangSwitcher';

const renderWith = () => render(<LangSwitcher />, { wrapper: LocaleProvider });

// Which locale starts active is the provider's business, so these read the
// buttons by aria-pressed rather than by name. Asking for "text-ink" by
// substring would also match the idle button's "hover:text-ink".
const active = () => screen.getAllByRole('button').find((b) => b.getAttribute('aria-pressed') === 'true');
const idle = () => screen.getAllByRole('button').find((b) => b.getAttribute('aria-pressed') === 'false');

describe('LangSwitcher', () => {
  it('colours the active locale for the one layer there is', () => {
    renderWith();
    expect(active().className).toContain('text-ink font-bold');
  });

  it('leaves the inactive locale muted rather than invisible', () => {
    renderWith();
    expect(idle().className).toContain('text-muted');
  });

  it('never falls back to a token that no longer exists', () => {
    // Earlier versions reached for tokens that had been deleted, and the button
    // inherited the body's ink: 1.01:1 against the dark ground, invisible.
    const { container } = renderWith();
    expect(container.innerHTML).not.toMatch(/forest|cream|ground-ink|ground-mute|text-mute\b/);
  });
});
