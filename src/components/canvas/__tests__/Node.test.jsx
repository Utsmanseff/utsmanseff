import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Node from '@/components/canvas/Node';

const project = {
  slug: 'rsu-nirwana-web',
  year: '2025',
  tier: 'full',
  tech: ['Laravel', 'Next.js', 'MySQL'],
  shortName: { id: 'Pendaftaran OCR', en: 'OCR Registration' },
  position: { x: 100, y: 100 },
};

function setup(props = {}) {
  return render(
    <Node
      project={project}
      locale="id"
      detail="far"
      selected={false}
      onOpen={() => {}}
      {...props}
    />
  );
}

describe('Node', () => {
  it('shows the short name at every zoom level', () => {
    setup();
    expect(screen.getByText('Pendaftaran OCR')).toBeInTheDocument();
  });

  it('hides stack and year when zoomed out', () => {
    setup({ detail: 'far' });
    expect(screen.queryByText(/Laravel/)).not.toBeInTheDocument();
    expect(screen.queryByText('2025')).not.toBeInTheDocument();
  });

  it('reveals stack and year when zoomed in', () => {
    setup({ detail: 'near' });
    expect(screen.getByText('2025')).toBeInTheDocument();
    expect(screen.getByText(/Laravel/)).toBeInTheDocument();
  });

  it('is a button so keyboard users can reach it', () => {
    setup();
    expect(screen.getByRole('button', { name: /Pendaftaran OCR/ })).toBeInTheDocument();
  });

  it('calls onOpen with the slug when activated by keyboard', async () => {
    const onOpen = vi.fn();
    setup({ onOpen });
    await userEvent.tab();
    await userEvent.keyboard('{Enter}');
    expect(onOpen).toHaveBeenCalledWith('rsu-nirwana-web');
  });

  it('marks itself pressed while its panel is open', () => {
    setup({ selected: true });
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
  });

  it('uses the locale to pick the short name', () => {
    setup({ locale: 'en' });
    expect(screen.getByText('OCR Registration')).toBeInTheDocument();
  });
});
