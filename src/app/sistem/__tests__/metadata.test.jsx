import { describe, it, expect } from 'vitest';
import { metadata } from '@/app/sistem/layout';
import sitemap from '@/app/sitemap';

describe('/sistem metadata', () => {
  it('points its canonical back at /', () => {
    // Below 1024px the two URLs render the same paper document. Without this a
    // crawler sees two pages with one body of text.
    expect(metadata.alternates.canonical).toBe('/');
  });
});

describe('sitemap', () => {
  it('leaves /sistem out, since its canonical is /', () => {
    const paths = sitemap().map((entry) => new URL(entry.url).pathname);
    expect(paths).toContain('/');
    expect(paths).not.toContain('/sistem');
  });
});
