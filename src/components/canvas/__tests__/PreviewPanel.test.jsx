import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PreviewPanel from '@/components/canvas/PreviewPanel';

const full = {
  slug: 'rsu-nirwana-web',
  tier: 'full',
  access: 'public',
  site: 'https://rsunirwana.id',
  image: '/assets/img/pendaftaran.png',
  year: '2025',
  client: 'RSU Nirwana',
  title: { id: 'Pendaftaran OCR', en: 'OCR Registration' },
  context: { id: 'Konteks singkat.', en: 'Short context.' },
};

const brief = { ...full, slug: 'rme', tier: 'brief', access: 'internal', site: null };

describe('PreviewPanel', () => {
  it('renders nothing when no project is selected', () => {
    const { container } = render(<PreviewPanel project={null} locale="id" onClose={() => {}} />);
    expect(container.querySelector('[data-panel]')).toBeNull();
  });

  it('shows title and context for the chosen project', () => {
    render(<PreviewPanel project={full} locale="id" onClose={() => {}} />);
    expect(screen.getByText('Pendaftaran OCR')).toBeInTheDocument();
    expect(screen.getByText('Konteks singkat.')).toBeInTheDocument();
  });

  it('offers the full page only for full-tier projects', () => {
    const { rerender } = render(<PreviewPanel project={full} locale="id" onClose={() => {}} />);
    expect(screen.getByRole('link', { name: /Buka halaman/ })).toHaveAttribute(
      'href',
      '/kerja/rsu-nirwana-web'
    );
    rerender(<PreviewPanel project={brief} locale="id" onClose={() => {}} />);
    expect(screen.queryByRole('link', { name: /Buka halaman/ })).not.toBeInTheDocument();
  });

  it('links out only when the project is public', () => {
    const { rerender } = render(<PreviewPanel project={full} locale="id" onClose={() => {}} />);
    expect(screen.getByRole('link', { name: /Coba langsung/ })).toBeInTheDocument();
    rerender(<PreviewPanel project={brief} locale="id" onClose={() => {}} />);
    expect(screen.queryByRole('link', { name: /Coba langsung/ })).not.toBeInTheDocument();
  });

  it('closes on the close button', async () => {
    const onClose = vi.fn();
    render(<PreviewPanel project={full} locale="id" onClose={onClose} />);
    await userEvent.click(screen.getByRole('button', { name: /tutup/i }));
    expect(onClose).toHaveBeenCalled();
  });

  it('closes on Escape', async () => {
    const onClose = vi.fn();
    render(<PreviewPanel project={full} locale="id" onClose={onClose} />);
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalled();
  });
});
