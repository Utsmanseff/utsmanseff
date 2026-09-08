import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGatePassed } from '@/lib/hooks/useGatePassed';

beforeEach(() => {
  window.sessionStorage.clear();
  vi.restoreAllMocks();
});

describe('useGatePassed', () => {
  it('carries the flag a tab already holds, on the first render', () => {
    window.sessionStorage.setItem('gate', '1');
    const { result } = renderHook(() => useGatePassed());
    expect(result.current.passed).toBe(true);
  });

  it('stays false when nothing is stored', () => {
    const { result } = renderHook(() => useGatePassed());
    expect(result.current.passed).toBe(false);
  });

  it('remembers the gate once it is passed', () => {
    const { result } = renderHook(() => useGatePassed());
    act(() => result.current.pass());
    expect(result.current.passed).toBe(true);
    expect(window.sessionStorage.getItem('gate')).toBe('1');
  });

  it('does not leak between tabs — a cleared store means the gate returns', () => {
    window.sessionStorage.setItem('gate', '1');
    const first = renderHook(() => useGatePassed());
    expect(first.result.current.passed).toBe(true);

    window.sessionStorage.clear();
    const second = renderHook(() => useGatePassed());
    expect(second.result.current.passed).toBe(false);
  });

  it('survives storage that refuses to be read', () => {
    vi.spyOn(window.sessionStorage, 'getItem').mockImplementation(() => {
      throw new Error('denied');
    });
    const { result } = renderHook(() => useGatePassed());
    expect(result.current.passed).toBe(false);
  });

  it('survives storage that refuses to be written', () => {
    vi.spyOn(window.sessionStorage, 'setItem').mockImplementation(() => {
      throw new Error('denied');
    });
    const { result } = renderHook(() => useGatePassed());
    act(() => result.current.pass());
    expect(result.current.passed).toBe(true);
  });
});
