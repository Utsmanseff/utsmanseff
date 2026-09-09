import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PaperHeader from '@/components/work/PaperHeader';
import { LocaleProvider } from '@/lib/hooks/useLocale';

// LangSwitcher hidup di dalam kepala ini dan menuntut providernya.
const renderHeader = (props) =>
  render(<PaperHeader locale="id" {...props} />, { wrapper: LocaleProvider });

describe('PaperHeader', () => {
  it('carries the system back to the map, so there is something to morph into', () => {
    renderHeader({ slug: 'rme' });
    expect(screen.getByRole('link', { name: /SEMUA SISTEM/ }))
      .toHaveAttribute('href', '/sistem?pilih=rme');
  });

  it('still points at the plain map when it stands on a page with no system', () => {
    // The contact page uses this header too, and has no slug to carry.
    renderHeader();
    expect(screen.getByRole('link', { name: /SEMUA SISTEM/ }))
      .toHaveAttribute('href', '/sistem');
  });

  it('builds the query with URLSearchParams, so an odd slug cannot split it', () => {
    renderHeader({ slug: 'a&b' });
    expect(screen.getByRole('link', { name: /SEMUA SISTEM/ }))
      .toHaveAttribute('href', '/sistem?pilih=a%26b');
  });
});
