import { techSlug } from '@/lib/data/tech';

export const FILTER_KEYS = ['client', 'year', 'access', 'stack'];

export const EMPTY_FILTERS = { client: null, year: null, access: null, stack: null };

export function isShown(system, filters) {
  if (filters.client && system.clientKey !== filters.client) return false;
  if (filters.year && String(system.year) !== String(filters.year)) return false;
  if (filters.access && system.access !== filters.access) return false;
  if (filters.stack && !(system.tech ?? []).some((t) => techSlug(t) === filters.stack)) {
    return false;
  }
  return true;
}

// Applying the active value again clears it. Chips and typed commands share
// this, so a chip is a toggle for the same reason a repeated command is.
export function toggleFilter(filters, key, value) {
  const next = { ...filters };
  next[key] = filters[key] === value ? null : value;
  return next;
}

export function isFiltering(filters) {
  return FILTER_KEYS.some((k) => filters[k] !== null);
}
