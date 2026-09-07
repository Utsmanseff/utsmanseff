import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from '@/app/page';
import { LocaleProvider } from '@/lib/hooks/useLocale';

// Shell reaches for the app router; this test renders it for real.
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }));

const eligible = vi.hoisted(() => ({ value: false }));
vi.mock('@/lib/hooks/useShellEligible', () => ({
  useShellEligible: () => eligible.value,
}));

beforeEach(() => { eligible.value = false; });

describe('/', () => {
  it('renders the document when the shell is not eligible', () => {
    render(<Home />, { wrapper: LocaleProvider });
    expect(document.querySelector('.paper-doc')).not.toBeNull();
  });

  it('renders the shell when it is', () => {
    eligible.value = true;
    render(<Home />, { wrapper: LocaleProvider });
    expect(document.querySelector('.paper-doc')).toBeNull();
    expect(screen.getByTestId('shell')).toBeInTheDocument();
  });
});
