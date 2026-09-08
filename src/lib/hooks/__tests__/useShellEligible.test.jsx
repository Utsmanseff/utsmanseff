import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useShellEligible } from '@/lib/hooks/useShellEligible';

const answers = { wide: false, calm: false };

beforeEach(() => {
  answers.wide = false;
  answers.calm = false;
  window.matchMedia = vi.fn((query) => ({
    matches: query.includes('prefers-reduced-motion') ? answers.calm : answers.wide,
    addEventListener: () => {},
    removeEventListener: () => {},
  }));
});

describe('useShellEligible', () => {
  it('needs room', () => {
    expect(renderHook(() => useShellEligible()).result.current).toBe(false);
    answers.wide = true;
    expect(renderHook(() => useShellEligible()).result.current).toBe(true);
  });

  // Reduced motion used to be a third condition here, and it cost that visitor
  // the console, the rail and the panel — an interface reduced, when what they
  // asked for was motion reduced. See Task 1 in docs/PROGRESS.md.
  it('does not care whether the visitor asked for less motion', () => {
    answers.wide = true;
    answers.calm = true;
    expect(renderHook(() => useShellEligible()).result.current).toBe(true);
  });
});
