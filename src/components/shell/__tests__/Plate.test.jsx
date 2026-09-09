import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Plate from '@/components/shell/Plate';

const system = {
  slug: 'hris-nirwana', client: 'RSU Nirwana', year: '2026', access: 'internal',
  tier: 'full', tech: ['Laravel', 'Livewire', 'Alpine.js', 'MySQL', 'TensorFlow.js'],
  shortName: { id: 'HRIS', en: 'HRIS' },
};
const pos = {
  slug: 'hris-nirwana', year: '2026', x: 40, y: 440,
  width: 165, height: 115, layers: 5, topZ: 28, layerStep: 7,
};

const renderPlate = (props = {}) =>
  render(
    <Plate
      system={system} position={pos} locale="id" rotZ={-40}
      selected={false} dimmed={false} onSelect={vi.fn()} {...props}
    />,
  );

describe('Plate', () => {
  it('is one button covering the whole plate, not just its label', () => {
    const { container } = renderPlate();
    const button = screen.getByRole('button', { name: 'HRIS RSU NIRWANA · INTERNAL' });
    expect(button).toBe(container.firstChild);
    expect(container.querySelectorAll('button')).toHaveLength(1);
    expect(container.querySelectorAll('[data-layer]')[0].closest('button')).toBe(button);
  });

  it('says whether it is the selected system', () => {
    renderPlate({ selected: true });
    expect(screen.getByRole('button', { name: /HRIS/ })).toHaveAttribute('aria-pressed', 'true');
  });

  it('reports the slug it stands for when pressed', async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    renderPlate({ onSelect });
    await user.click(screen.getByRole('button', { name: /HRIS/ }));
    expect(onSelect).toHaveBeenCalledWith('hris-nirwana');
  });

  it('draws one layer per technology', () => {
    const { container } = renderPlate();
    expect(container.querySelectorAll('[data-layer]')).toHaveLength(5);
  });

  it('states client and access, and no counts', () => {
    renderPlate();
    expect(screen.getByText(/RSU NIRWANA · INTERNAL/i)).toBeInTheDocument();
    expect(screen.queryByText(/5 (TEKNOLOGI|TECHNOLOGIES)/i)).toBeNull();
  });

  it('counter-rotates its label so text stays upright', () => {
    const { container } = renderPlate({ rotZ: -25 });
    const label = container.querySelector('[data-plate-label]');
    expect(label.getAttribute('style')).toContain('rotateZ(25deg)');
  });

  it('dims without disappearing', () => {
    const { container } = renderPlate({ dimmed: true });
    expect(container.firstChild).toHaveStyle({ opacity: '0.34' });
  });

  // 4 x 7 rapat, 4 x 11 terbuka: lapis teratas dari lima lapis. Menunggu,
  // karena lapis mulai rata di translateZ(0) sampai timer mount menyalakannya.
  const settled = async (container) => {
    await waitFor(() => {
      const l = container.querySelectorAll('[data-layer]');
      expect(l[l.length - 1].getAttribute('style')).not.toContain('translateZ(0px)');
    });
    const l = container.querySelectorAll('[data-layer]');
    return l[l.length - 1].getAttribute('style');
  };

  it('keeps the stack tight until something asks for it', async () => {
    const { container } = renderPlate();
    expect(await settled(container)).toContain('translateZ(28px)');
  });

  it('opens the stack under the pointer', async () => {
    const { container } = renderPlate();
    await settled(container);
    fireEvent.pointerEnter(container.firstChild);
    expect(await settled(container)).toContain('translateZ(44px)');
  });

  it('closes it again when the pointer leaves', async () => {
    const { container } = renderPlate();
    await settled(container);
    fireEvent.pointerEnter(container.firstChild);
    fireEvent.pointerLeave(container.firstChild);
    expect(await settled(container)).toContain('translateZ(28px)');
  });

  it('opens the stack for the keyboard too', async () => {
    const { container } = renderPlate();
    await settled(container);
    fireEvent.focus(container.firstChild);
    expect(await settled(container)).toContain('translateZ(44px)');
  });

  it('keeps the selected plate open with no pointer on it', async () => {
    const { container } = renderPlate({ selected: true });
    expect(await settled(container)).toContain('translateZ(44px)');
  });

  it('carries its label up with the stack', async () => {
    const { container } = renderPlate();
    await settled(container);
    const label = () => container.querySelector('[data-plate-label]').getAttribute('style');
    expect(label()).toContain('translateZ(32px)');
    fireEvent.pointerEnter(container.firstChild);
    expect(label()).toContain('translateZ(54px)');
  });

  it('lifts a selected plate further than a hovered one', () => {
    const { container } = renderPlate({ selected: true });
    expect(container.firstChild.getAttribute('style')).toContain('translateZ(10px)');
  });

  // Lewat CSSOM, bukan substring pada atribut style: happy-dom menggabungkan
  // empat longhand jadi shorthand `border-color`, jadi mencari 'border-top-color'
  // di dalam string gagal walau kodenya benar.
  const edgesOf = (layer) => ({
    top: layer.style.borderTopColor,
    right: layer.style.borderRightColor,
    bottom: layer.style.borderBottomColor,
    left: layer.style.borderLeftColor,
  });

  it('gives each side of a layer its own edge colour', () => {
    const { container } = renderPlate();
    const edges = edgesOf(container.querySelector('[data-layer]'));
    Object.values(edges).forEach((c) => expect(c).toMatch(/^#[0-9a-f]{6}$/i));
    // Pada rotZ -40 cahaya datang dari kiri layar, jadi kiri terang dan kanan
    // gelap. Kalau keempatnya sama, tepinya tidak bereaksi pada sudut apa pun.
    expect(edges.left).not.toBe(edges.right);
  });

  it('redraws those edges when the camera turns', () => {
    const { container, rerender } = renderPlate();
    const edges = () => container.querySelector('[data-layer]').getAttribute('style');
    const before = edges();
    rerender(
      <Plate
        system={system} position={pos} locale="id" rotZ={140}
        selected={false} dimmed={false} onSelect={vi.fn()}
      />,
    );
    expect(edges()).not.toBe(before);
  });

  it('still marks a public system in amber on its top layer', () => {
    const publicSystem = { ...system, access: 'public' };
    const { container } = render(
      <Plate
        system={publicSystem} position={pos} locale="id" rotZ={-40}
        selected={false} dimmed={false} onSelect={vi.fn()}
      />,
    );
    const layers = container.querySelectorAll('[data-layer]');
    const top = layers[layers.length - 1].getAttribute('style');
    expect(top.toLowerCase()).toContain('#c97b3f');
  });

  it('still marks the selected plate in cream on its top layer', () => {
    const { container } = renderPlate({ selected: true });
    const layers = container.querySelectorAll('[data-layer]');
    const top = layers[layers.length - 1].getAttribute('style');
    expect(top.toLowerCase()).toContain('#e8e0d0');
  });

  it('starts every layer flat on the ground', () => {
    const { container } = renderPlate();
    const styles = [...container.querySelectorAll('[data-layer]')]
      .map((l) => l.getAttribute('style'));
    // Sebelum timer mount berjalan, semuanya bertumpuk rata.
    expect(styles.every((s) => s.includes('translateZ(0px)'))).toBe(true);
  });

  it('raises them into place once mounted', async () => {
    const { container } = renderPlate();
    await waitFor(() => {
      const layers = container.querySelectorAll('[data-layer]');
      expect(layers[layers.length - 1].getAttribute('style')).toContain('translateZ(28px)');
    });
  });

  it('lets each layer follow the one below it', async () => {
    const { container } = renderPlate();
    await settled(container);
    const layers = container.querySelectorAll('[data-layer]');
    expect(layers[0].style.transitionDelay).toBe('0ms');
    expect(layers[4].style.transitionDelay).toBe('160ms');
  });
});
