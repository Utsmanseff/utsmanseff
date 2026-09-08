import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Gate from '@/components/shell/Gate';
import { projects } from '@/lib/data/projects';

const renderGate = (props = {}) => {
  const onEnter = vi.fn();
  const view = render(
    <Gate systems={projects} locale="id" calm={false} onEnter={onEnter} {...props} />,
  );
  return { onEnter, ...view };
};

describe('Gate', () => {
  it('names who built this, and where', () => {
    renderGate();
    expect(screen.getByText('Utsman')).toBeInTheDocument();
    expect(screen.getByText(/FULLSTACK DEVELOPER/)).toBeInTheDocument();
    expect(screen.getByText(/Banjarbaru, Kalimantan Selatan/)).toBeInTheDocument();
  });

  it('spans the years the work actually covers', () => {
    renderGate();
    expect(screen.getByText(/2024–2026/)).toBeInTheDocument();
  });

  it('lists the stack from the data, not from a hand-written list', () => {
    renderGate();
    const stack = screen.getByTestId('gate-stack').textContent;
    expect(stack).toContain('Laravel');
    expect(stack).toContain('TensorFlow.js');
    expect(stack).toContain('SOAP');
  });

  it('states no counts — every digit on the gate is a year', () => {
    const { container } = renderGate();
    const numbers = container.textContent.match(/\d[\d.]*/g) ?? [];
    expect(numbers.every((n) => n === '2024' || n === '2026')).toBe(true);
  });

  it('offers two doors, and each one names where it goes', () => {
    const { onEnter } = renderGate();
    fireEvent.click(screen.getByRole('button', { name: /PETA/ }));
    expect(onEnter).toHaveBeenCalledWith('map', null);

    fireEvent.click(screen.getByRole('button', { name: /DAFTAR/ }));
    expect(onEnter).toHaveBeenCalledWith('list', null);
  });

  it('speaks English when asked to', () => {
    renderGate({ locale: 'en' });
    expect(screen.getByRole('button', { name: /SEE SYSTEMS · MAP/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /SEE SYSTEMS · LIST/ })).toBeInTheDocument();
  });

  it('fades out when it is told it is leaving', () => {
    const { rerender } = renderGate();
    expect(screen.getByTestId('gate')).toHaveStyle({ opacity: '1' });

    rerender(
      <Gate systems={projects} locale="id" calm={false} leaving onEnter={vi.fn()} />,
    );
    expect(screen.getByTestId('gate')).toHaveStyle({ opacity: '0' });
  });
});
