import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { LocaleProvider, useLocale } from '../useLocale';
import { STORAGE_KEY } from '@/lib/i18n/config';

function TestConsumer() {
  const { locale, setLocale, t } = useLocale();
  return (
    <div>
      <span data-testid="locale">{locale}</span>
      <span data-testid="title">{t('about.title')}</span>
      <button onClick={() => setLocale('en')}>EN</button>
      <button onClick={() => setLocale('id')}>ID</button>
    </div>
  );
}

function MissingConsumer() {
  const { t } = useLocale();
  return <span data-testid="missing">{t('does.not.exist')}</span>;
}

describe('useLocale', () => {
  beforeEach(() => {
    localStorage.clear();
    // Force navigator.language to a non-supported locale so DEFAULT_LOCALE wins
    Object.defineProperty(window.navigator, 'language', { value: 'fr', configurable: true });
  });

  it('defaults to DEFAULT_LOCALE (id) when nothing stored and browser locale unsupported', () => {
    render(<LocaleProvider><TestConsumer /></LocaleProvider>);
    expect(screen.getByTestId('locale').textContent).toBe('id');
    expect(screen.getByTestId('title').textContent).toBe('Tentang');
  });

  it('reads stored locale from localStorage', () => {
    localStorage.setItem(STORAGE_KEY, 'en');
    render(<LocaleProvider><TestConsumer /></LocaleProvider>);
    expect(screen.getByTestId('locale').textContent).toBe('en');
    expect(screen.getByTestId('title').textContent).toBe('About');
  });

  it('setLocale updates state and persists', () => {
    render(<LocaleProvider><TestConsumer /></LocaleProvider>);
    act(() => {
      screen.getByText('EN').click();
    });
    expect(screen.getByTestId('locale').textContent).toBe('en');
    expect(localStorage.getItem(STORAGE_KEY)).toBe('en');
  });

  it('t() returns key when path missing', () => {
    render(<LocaleProvider><MissingConsumer /></LocaleProvider>);
    expect(screen.getByTestId('missing').textContent).toBe('does.not.exist');
  });
});
