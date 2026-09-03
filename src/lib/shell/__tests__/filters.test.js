import { describe, it, expect } from 'vitest';
import { EMPTY_FILTERS, isShown, toggleFilter, isFiltering } from '@/lib/shell/filters';

const hris = {
  slug: 'hris-nirwana', clientKey: 'rsu-nirwana', year: '2026',
  access: 'internal', tech: ['Laravel', 'TensorFlow.js'],
};
const sigap = {
  slug: 'sigap-bpn', clientKey: 'bpn', year: '2024',
  access: 'none', tech: ['Laravel', 'Livewire'],
};

describe('isShown', () => {
  it('shows everything when no filter is set', () => {
    expect(isShown(hris, EMPTY_FILTERS)).toBe(true);
    expect(isShown(sigap, EMPTY_FILTERS)).toBe(true);
  });

  it('filters by client, year and access', () => {
    expect(isShown(hris, { ...EMPTY_FILTERS, client: 'bpn' })).toBe(false);
    expect(isShown(sigap, { ...EMPTY_FILTERS, year: '2024' })).toBe(true);
    expect(isShown(sigap, { ...EMPTY_FILTERS, access: 'internal' })).toBe(false);
  });

  it('matches a stack value through its console token', () => {
    expect(isShown(hris, { ...EMPTY_FILTERS, stack: 'tensorflowjs' })).toBe(true);
    expect(isShown(sigap, { ...EMPTY_FILTERS, stack: 'tensorflowjs' })).toBe(false);
  });
});

describe('toggleFilter', () => {
  it('sets a value, and clears it when the same value is applied twice', () => {
    const once = toggleFilter(EMPTY_FILTERS, 'client', 'bpn');
    expect(once.client).toBe('bpn');
    expect(toggleFilter(once, 'client', 'bpn').client).toBe(null);
  });

  it('replaces a value of the same key rather than stacking it', () => {
    const a = toggleFilter(EMPTY_FILTERS, 'year', '2024');
    expect(toggleFilter(a, 'year', '2026').year).toBe('2026');
  });

  it('never mutates the filters it was given', () => {
    const before = { ...EMPTY_FILTERS };
    toggleFilter(before, 'client', 'bpn');
    expect(before.client).toBe(null);
  });
});

describe('isFiltering', () => {
  it('is false only when nothing is set', () => {
    expect(isFiltering(EMPTY_FILTERS)).toBe(false);
    expect(isFiltering({ ...EMPTY_FILTERS, access: 'public' })).toBe(true);
  });
});
