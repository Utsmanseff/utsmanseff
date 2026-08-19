import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MobileList from '@/components/canvas/MobileList';

const projects = [
  {
    slug: 'a', client: 'RSU Nirwana', year: '2025', tier: 'full', access: 'public',
    site: 'https://x.test', cluster: 'nirwana', image: null, tech: ['Laravel'],
    shortName: { id: 'Satu', en: 'One' },
    title: { id: 'Satu', en: 'One' },
    context: { id: 'Konteks satu.', en: 'Context one.' },
  },
  {
    slug: 'b', client: 'BPN', year: '2024', tier: 'brief', access: 'none',
    site: null, cluster: 'gov', image: null, tech: ['Livewire'],
    shortName: { id: 'Dua', en: 'Two' },
    title: { id: 'Dua', en: 'Two' },
    context: { id: 'Konteks dua.', en: 'Context two.' },
  },
];

describe('MobileList', () => {
  it('groups projects under their cluster heading', () => {
    render(<MobileList projects={projects} locale="id" />);
    expect(screen.getByRole('heading', { name: /RSU Nirwana/ })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Pemerintahan/ })).toBeInTheDocument();
  });

  it('links full-tier projects to their page', () => {
    render(<MobileList projects={projects} locale="id" />);
    expect(screen.getByRole('link', { name: /Satu/ })).toHaveAttribute('href', '/kerja/a');
  });

  it('does not link brief projects to a page that does not exist', () => {
    render(<MobileList projects={projects} locale="id" />);
    expect(screen.queryByRole('link', { name: /Dua/ })).not.toBeInTheDocument();
  });
});
