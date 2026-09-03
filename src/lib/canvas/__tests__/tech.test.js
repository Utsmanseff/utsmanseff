import { describe, it, expect } from 'vitest';
import { techIndex, primaryTech, usesTech } from '@/lib/canvas/tech';
import { projects } from '@/lib/data/projects';

const sample = [
  { slug: 'a', tech: ['Laravel', 'MySQL'] },
  { slug: 'b', tech: ['Laravel', 'Next.js'] },
  { slug: 'c', tech: ['Laravel'] },
];

describe('techIndex', () => {
  it('counts each technology across the work it was used on', () => {
    const index = techIndex(sample);
    expect(index[0]).toMatchObject({ name: 'Laravel', count: 3 });
    expect([...index[0].slugs]).toEqual(['a', 'b', 'c']);
  });

  it('breaks ties alphabetically, so the order never shuffles', () => {
    const index = techIndex(sample).slice(1).map((t) => t.name);
    expect(index).toEqual(['MySQL', 'Next.js']);
  });

  it('survives a project with no tech listed', () => {
    expect(techIndex([{ slug: 'x' }])).toEqual([]);
  });
});

describe('primaryTech', () => {
  it('keeps the one-offs, because they are the part that is specific', () => {
    // Laravel is the baseline; the technology used once is the differentiator.
    expect(primaryTech(sample).map((t) => t.name)).toEqual(['Laravel', 'MySQL', 'Next.js']);
  });

  it('lists the rare integrations of the real portfolio', () => {
    const names = primaryTech(projects).map((t) => t.name);
    for (const rare of ['Google Vision', 'TensorFlow.js', 'SOAP', 'Fonnte', 'Next.js']) {
      expect(names).toContain(rare);
    }
  });

  it('reads the real portfolio without inventing anything', () => {
    const names = primaryTech(projects).map((t) => t.name);
    expect(names).toContain('Laravel');
    // Every name has to come from the data — the legend must never claim a
    // skill that no project backs.
    const declared = new Set(projects.flatMap((p) => p.tech));
    for (const name of names) expect(declared.has(name)).toBe(true);
  });
});

describe('usesTech', () => {
  it('matches only what the project lists', () => {
    expect(usesTech(sample[0], 'Laravel')).toBe(true);
    expect(usesTech(sample[0], 'Next.js')).toBe(false);
  });

  it('matches nothing when no technology is picked', () => {
    expect(usesTech(sample[0], null)).toBe(false);
  });
});
