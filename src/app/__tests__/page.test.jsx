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

// page.jsx now asks the browser about motion directly. Stubbing matchMedia keeps
// that answer in this file rather than in whatever the environment happens to say.
const calm = { value: false };

beforeEach(() => {
  eligible.value = false;
  calm.value = false;
  window.sessionStorage.clear();
  window.matchMedia = vi.fn((query) => ({
    matches: query.includes('prefers-reduced-motion') ? calm.value : false,
    addEventListener: () => {},
    removeEventListener: () => {},
  }));
});

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

  // useShellEligible is mocked in this file, so whether a calm visitor reaches
  // the shell at all is not something these tests can decide — that lives in
  // useShellEligible's own test. What this one proves is the wiring: `calm`
  // travels from the page into the shell and picks the starting view.
  it('starts a reduced-motion visitor on the flat table', () => {
    eligible.value = true;
    calm.value = true;
    window.sessionStorage.setItem('gate', '1');
    render(<Home />, { wrapper: LocaleProvider });
    expect(screen.getByTestId('flat-table')).toBeInTheDocument();
  });
});
