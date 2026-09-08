import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ContactView from '@/components/contact/ContactView';
import { LocaleProvider } from '@/lib/hooks/useLocale';

describe('ContactView', () => {
  it('offers a way back into the site', () => {
    // Every other link on this page leaves for email, WhatsApp, GitHub or a PDF.
    // Without this one, a visitor who landed here from a search has nothing to
    // click that stays.
    render(<ContactView />, { wrapper: LocaleProvider });
    expect(screen.getByRole('link', { name: /SEMUA SISTEM|ALL SYSTEMS/ }))
      .toHaveAttribute('href', '/sistem');
  });
});
