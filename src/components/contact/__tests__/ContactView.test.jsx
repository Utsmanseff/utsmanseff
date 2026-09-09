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

  it('states availability in a form a skimmer can catch', () => {
    // Recruiter membaca halaman ini beberapa detik. Kalimatnya menyimpan
    // faktanya; lencana mono yang membuatnya tertangkap tanpa dibaca.
    render(<ContactView />, { wrapper: LocaleProvider });
    expect(screen.getByText('OPEN TO WORK')).toBeInTheDocument();
  });

  it('says both kinds of work, and that place is not a limit', () => {
    // "Terbuka untuk kerja sama" tidak menjawab satu pun pertanyaan yang
    // dibawa pembacanya: penuh waktu atau lepas, dan di mana.
    // LocaleProvider membuka di `en`, jadi yang dirender kalimat Inggrisnya.
    const { container } = render(<ContactView />, { wrapper: LocaleProvider });
    const text = container.textContent;
    expect(text).toMatch(/full-time/);
    expect(text).toMatch(/freelance/);
    expect(text).toMatch(/remote/i);
    expect(text).not.toMatch(/^Open to work\.$/m);
  });
});
