import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LocaleProvider } from '@/lib/hooks/useLocale';
import SystemsDocument from '@/components/document/SystemsDocument';
import { projects } from '@/lib/data/projects';

const renderDoc = (props = {}) =>
  render(
    <SystemsDocument systems={projects} locale="id" filters={null} {...props} />,
    { wrapper: LocaleProvider },
  );

describe('SystemsDocument', () => {
  it('opens with identity and no headline sentence', () => {
    renderDoc();
    expect(screen.getByText(/UTSMAN/)).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 1, name: /tahun|systems/i })).toBeNull();
  });

  it('descends by year, newest first', () => {
    const { container } = renderDoc();
    const years = [...container.querySelectorAll('[data-year]')].map((n) => n.dataset.year);
    expect(years).toEqual(['2026', '2025', '2024']);
  });

  it('links only the systems that have a reading page', () => {
    renderDoc();
    expect(screen.getByRole('link', { name: /HRIS/ })).toHaveAttribute('href', '/kerja/hris-nirwana');
    expect(screen.queryByRole('link', { name: /SIGAP/ })).toBeNull();
    expect(screen.getByText('SIGAP')).toBeInTheDocument();
  });

  it('states no counts anywhere', () => {
    const { container } = renderDoc();
    expect(container.textContent).not.toMatch(/\b8 (sistem|systems)\b/i);
  });
});
