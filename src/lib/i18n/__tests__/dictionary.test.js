import { describe, it, expect } from 'vitest';
import { dict } from '../dictionary';
import { LOCALES, DEFAULT_LOCALE } from '../config';

describe('i18n dictionary', () => {
  it('exports dict for every supported locale', () => {
    LOCALES.forEach(loc => {
      expect(dict[loc]).toBeDefined();
      expect(typeof dict[loc]).toBe('object');
    });
  });

  it('default locale exists in dict', () => {
    expect(dict[DEFAULT_LOCALE]).toBeDefined();
  });

  it('all locales share the same top-level keys', () => {
    const keys = Object.keys(dict[DEFAULT_LOCALE]);
    LOCALES.forEach(loc => {
      keys.forEach(k => {
        expect(dict[loc]).toHaveProperty(k);
      });
    });
  });
});
