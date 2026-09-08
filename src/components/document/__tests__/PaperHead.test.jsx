import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LocaleProvider } from '@/lib/hooks/useLocale';
import PaperHead from '@/components/document/PaperHead';
import { projects } from '@/lib/data/projects';

const renderHead = (props = {}) =>
  render(<PaperHead systems={projects} locale="id" {...props} />, { wrapper: LocaleProvider });

describe('PaperHead', () => {
  it('says the same things the gate says', () => {
    renderHead();
    expect(screen.getByText('Utsman')).toBeInTheDocument();
    expect(screen.getByText(/FULLSTACK DEVELOPER/)).toBeInTheDocument();
    expect(screen.getByText(/BANJARBARU/i)).toBeInTheDocument();
    expect(screen.getByText(/2024–2026/)).toBeInTheDocument();
  });

  it('lists the stack from the data, not from a hand-written list', () => {
    renderHead();
    const stack = screen.getByTestId('paper-stack').textContent;
    expect(stack).toContain('Laravel');
    expect(stack).toContain('TensorFlow.js');
  });

  it('states no counts — every digit here is a year', () => {
    const { container } = renderHead();
    const numbers = container.textContent.match(/\d[\d.]*/g) ?? [];
    expect(numbers.every((n) => n === '2024' || n === '2026')).toBe(true);
  });

  // The paper layer has its own amber. #C97B3F is 2.8:1 here; #9C5A28 carries it.
  it('never reaches for the amber that belongs to the dark layer', () => {
    const { container } = renderHead();
    expect(container.querySelector('.text-amber')).toBeNull();
  });

  it('gives the page its heading — there is no other h1 on the document', () => {
    renderHead();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Utsman');
  });
});
