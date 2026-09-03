import { describe, it, expect } from 'vitest';
import { techNames, techSlug } from '@/lib/data/tech';
import { projects } from '@/lib/data/projects';

describe('techNames', () => {
  it('lists each technology once, alphabetically', () => {
    const names = techNames([
      { tech: ['Laravel', 'MySQL'] },
      { tech: ['MySQL', 'Alpine.js'] },
    ]);
    expect(names).toEqual(['Alpine.js', 'Laravel', 'MySQL']);
  });

  it('survives a project with no tech listed', () => {
    expect(techNames([{ slug: 'x' }])).toEqual([]);
  });

  it('never invents a name the real data does not carry', () => {
    const declared = new Set(projects.flatMap((p) => p.tech));
    for (const name of techNames(projects)) expect(declared.has(name)).toBe(true);
  });

  it('carries no counts — counting is what the design removed', () => {
    for (const name of techNames(projects)) expect(typeof name).toBe('string');
  });
});

describe('techSlug', () => {
  it('flattens a name into a console-safe token', () => {
    expect(techSlug('TensorFlow.js')).toBe('tensorflowjs');
    expect(techSlug('REST API')).toBe('restapi');
    expect(techSlug('SOAP')).toBe('soap');
  });
});
