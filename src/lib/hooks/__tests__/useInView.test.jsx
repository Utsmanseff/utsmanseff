import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useInView } from '../useInView';

describe('useInView', () => {
  it('returns ref + initial inView=false', () => {
    const observe = vi.fn();
    const disconnect = vi.fn();
    global.IntersectionObserver = vi.fn(() => ({ observe, disconnect, unobserve: vi.fn() }));

    const { result } = renderHook(() => useInView());
    expect(result.current.ref).toBeDefined();
    expect(result.current.inView).toBe(false);
  });
});
