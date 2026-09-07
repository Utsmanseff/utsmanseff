import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProjectView from '@/components/work/ProjectView';

vi.mock('@/lib/hooks/useLocale', () => ({
  useLocale: () => ({ locale: 'id', setLocale: () => {}, t: (k) => k, hydrated: true }),
}));

const project = {
  slug: 'rsu-nirwana-web',
  client: 'RSU Nirwana',
  year: '2025',
  tier: 'full',
  access: 'public',
  site: 'https://rsunirwana.id',
  image: '/assets/img/pendaftaran.png',
  tech: ['Laravel', 'Next.js'],
  role: { id: 'Pengembang tunggal', en: 'Sole developer' },
  shortName: { id: 'Pendaftaran OCR', en: 'OCR Registration' },
  title: { id: 'Pendaftaran Berbasis OCR', en: 'OCR Registration' },
  context: { id: 'Konteks singkat.', en: 'Short context.' },
  built: { id: ['Ekstraksi NIK dari foto KTP'], en: ['NIK extraction from a KTP photo'] },
};

const noShot = { ...project, image: null, access: 'none', site: null };

describe('ProjectView', () => {
  it('renders the five blocks in order', () => {
    render(<ProjectView project={project} prev={null} next={null} />);
    const html = document.body.innerHTML;
    const order = ['RSU Nirwana', 'Konteks singkat.', 'Ekstraksi NIK', 'Laravel'];
    const positions = order.map((s) => html.indexOf(s));
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
    expect(positions.every((p) => p > -1)).toBe(true);
  });

  it('shows the live button for a public project', () => {
    render(<ProjectView project={project} prev={null} next={null} />);
    expect(screen.getByRole('link', { name: /Coba langsung/ })).toHaveAttribute(
      'href',
      'https://rsunirwana.id'
    );
  });

  it('shows a stated empty state instead of a broken image', () => {
    render(<ProjectView project={noShot} prev={null} next={null} />);
    expect(screen.getByText(/Screenshot menyusul/)).toBeInTheDocument();
  });

  it('links to the previous and next project', () => {
    const other = { ...project, slug: 'idrg-bridging', shortName: { id: 'IDRG', en: 'IDRG' } };
    render(<ProjectView project={project} prev={other} next={other} />);
    const links = screen.getAllByRole('link', { name: /IDRG/ });
    expect(links[0]).toHaveAttribute('href', '/kerja/idrg-bridging');
  });

  it('always offers a way back to all systems', () => {
    render(<ProjectView project={project} prev={null} next={null} />);
    expect(screen.getByRole('link', { name: /SEMUA SISTEM/ })).toHaveAttribute('href', '/');
  });

  it('numbers its three sections and links back to all systems', () => {
    render(<ProjectView project={project} prev={null} next={null} />);
    expect(screen.getByText('01 KONTEKS')).toBeInTheDocument();
    expect(screen.getByText('02 YANG DIBANGUN')).toBeInTheDocument();
    expect(screen.getByText('03 STACK')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /SEMUA SISTEM/ })).toBeInTheDocument();
  });

  it('paints on the dark layer, not on paper', () => {
    const { container } = render(<ProjectView project={project} prev={null} next={null} />);
    expect(container.querySelector('.paper-doc')).toBeNull();
    expect(container.innerHTML).not.toMatch(/text-amber-ink|bg-paper/);
  });


});
