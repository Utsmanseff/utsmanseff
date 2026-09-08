import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Home from '@/app/page';
import { LocaleProvider } from '@/lib/hooks/useLocale';

const push = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ push, replace: vi.fn() }) }));

const eligible = vi.hoisted(() => ({ value: false }));
vi.mock('@/lib/hooks/useShellEligible', () => ({
  useShellEligible: () => eligible.value,
}));

// page.jsx now asks the browser about motion directly. Stubbing matchMedia keeps
// that answer in this file rather than in whatever the environment happens to say.
const calm = { value: false };

beforeEach(() => {
  push.mockClear();
  delete document.startViewTransition;
  delete document.documentElement.dataset.nav;
  eligible.value = false;
  calm.value = false;
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

  it('renders the gate when it is, and not the shell', () => {
    eligible.value = true;
    render(<Home />, { wrapper: LocaleProvider });
    expect(document.querySelector('.paper-doc')).toBeNull();
    expect(screen.getByTestId('gate')).toBeInTheDocument();
    expect(screen.queryByTestId('shell')).toBeNull();
  });

  it('navigates to the door that was taken', () => {
    eligible.value = true;
    render(<Home />, { wrapper: LocaleProvider });
    fireEvent.click(screen.getByRole('button', { name: /DAFTAR|LIST/ }));
    expect(push).toHaveBeenCalledWith('/sistem?tampilan=datar');
  });

  // useShellEligible is mocked in this file, so whether a calm visitor reaches
  // the gate at all is not something these tests can decide — that lives in
  // useShellEligible's own test. What this one proves is the wiring: `calm`
  // travels from the page into the gate and picks the door it defaults to.
  it('marks every way in as going down', () => {
    // All five ways into the shell — both buttons, Enter, Escape, any letter,
    // and the wheel — funnel through this one handler, so this covers them all.
    // The API has to be stood up first: happy-dom has none, and slideTo leaves
    // the direction off when it cannot animate anyway.
    document.startViewTransition = (cb) => { cb(); return { finished: Promise.resolve() }; };
    eligible.value = true;
    render(<Home />, { wrapper: LocaleProvider });
    fireEvent.click(screen.getByRole('button', { name: /PETA|MAP/ }));
    expect(document.documentElement.dataset.nav).toBe('down');
    expect(push).toHaveBeenCalledWith('/sistem');
  });

  it('still goes in when the browser cannot animate it', () => {
    eligible.value = true;
    render(<Home />, { wrapper: LocaleProvider });
    fireEvent.keyDown(window, { key: 'Enter' });
    expect(push).toHaveBeenCalledWith('/sistem');
  });

  it('sends a reduced-motion visitor to the flat table', () => {
    eligible.value = true;
    calm.value = true;
    render(<Home />, { wrapper: LocaleProvider });
    fireEvent.keyDown(window, { key: 'Enter' });
    expect(push).toHaveBeenCalledWith('/sistem?tampilan=datar');
  });
});
