import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Sistem from '@/app/sistem/page';
import { LocaleProvider } from '@/lib/hooks/useLocale';

const replace = vi.fn();
const params = { value: new URLSearchParams() };

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace }),
  useSearchParams: () => params.value,
}));

const eligible = vi.hoisted(() => ({ value: true }));
vi.mock('@/lib/hooks/useShellEligible', () => ({
  useShellEligible: () => eligible.value,
}));

beforeEach(() => {
  replace.mockClear();
  eligible.value = true;
  params.value = new URLSearchParams();
  window.matchMedia = vi.fn(() => ({
    matches: false,
    addEventListener: () => {},
    removeEventListener: () => {},
  }));
});

describe('/sistem', () => {
  it('opens on the map, with no gate in the way', () => {
    render(<Sistem />, { wrapper: LocaleProvider });
    expect(screen.getByTestId('map-pane')).toBeInTheDocument();
    expect(screen.queryByTestId('gate')).toBeNull();
  });

  it('opens on the flat table when the URL asks for it', () => {
    params.value = new URLSearchParams('tampilan=datar');
    render(<Sistem />, { wrapper: LocaleProvider });
    expect(screen.getByTestId('flat-table')).toBeInTheDocument();
  });

  // The label is asked for in both languages: nothing here sets a locale, so it
  // is happy-dom's navigator that decides, and that is not this test's subject.
  it('seeds the console with the letter that was carried over', () => {
    params.value = new URLSearchParams('ketik=f');
    render(<Sistem />, { wrapper: LocaleProvider });
    expect(screen.getByLabelText(/konsol perintah|command console/i)).toHaveValue('f');
  });

  it('wipes the carried letter out of the URL, so a reload does not repeat it', () => {
    params.value = new URLSearchParams('tampilan=datar&ketik=f');
    render(<Sistem />, { wrapper: LocaleProvider });
    expect(replace).toHaveBeenCalledWith('/sistem?tampilan=datar', { scroll: false });
  });

  it('gives a narrow visitor the paper document, not an empty shell', () => {
    eligible.value = false;
    render(<Sistem />, { wrapper: LocaleProvider });
    expect(document.querySelector('.paper-doc')).not.toBeNull();
  });
});
