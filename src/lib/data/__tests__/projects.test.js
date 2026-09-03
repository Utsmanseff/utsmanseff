import { describe, it, expect } from 'vitest';
import { projects, fullProjects, bySlug, siblings } from '@/lib/data/projects';
import { CENTER_NODE, WORLD } from '@/lib/data/canvas';

describe('projects dataset', () => {
  it('has unique slugs', () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('uses only known tiers and access values', () => {
    for (const p of projects) {
      expect(['full', 'brief']).toContain(p.tier);
      expect(['public', 'internal', 'none']).toContain(p.access);
    }
  });

  it('resolves every related slug to a real project', () => {
    const slugs = new Set(projects.map((p) => p.slug));
    for (const p of projects) {
      for (const rel of p.related) expect(slugs.has(rel)).toBe(true);
    }
  });

  it('never relates a project to itself', () => {
    for (const p of projects) expect(p.related).not.toContain(p.slug);
  });

  it('gives every project a position inside the world bounds', () => {
    for (const p of projects) {
      expect(p.position.x).toBeGreaterThan(0);
      expect(p.position.x).toBeLessThan(WORLD.width);
      expect(p.position.y).toBeGreaterThan(0);
      expect(p.position.y).toBeLessThan(WORLD.height);
    }
  });

  it('gives both locales for every localised field', () => {
    for (const p of projects) {
      expect(p.title.id).toBeTruthy();
      expect(p.title.en).toBeTruthy();
      expect(p.context.id).toBeTruthy();
      expect(p.context.en).toBeTruthy();
    }
  });

  it('gives full-tier projects the blocks their page needs', () => {
    for (const p of fullProjects) {
      expect(p.built.id.length).toBeGreaterThan(0);
      expect(p.built.en.length).toBe(p.built.id.length);
      expect(p.hard.id).toBeTruthy();
      expect(p.tech.length).toBeGreaterThan(0);
    }
  });

  it('marks a public project with a site URL', () => {
    for (const p of projects) {
      if (p.access === 'public') expect(p.site).toBeTruthy();
      if (p.access === 'none') expect(p.site).toBeNull();
    }
  });

  it('looks a project up by slug', () => {
    expect(bySlug('rsu-nirwana-web').client).toBe('RSU Nirwana');
    expect(bySlug('nope')).toBeUndefined();
  });

  it('returns previous and next full projects, wrapping around', () => {
    const first = fullProjects[0].slug;
    const last = fullProjects[fullProjects.length - 1].slug;
    expect(siblings(first).prev.slug).toBe(last);
    expect(siblings(last).next.slug).toBe(first);
  });

  it('places the centre node inside the world', () => {
    expect(CENTER_NODE.position.x).toBeLessThan(WORLD.width);
    expect(CENTER_NODE.position.y).toBeLessThan(WORLD.height);
  });

  it('gives every system a one-line blurb in both languages', () => {
    // The blurb is what a system says wherever it is listed rather than read.
    // A missing one leaves a blank row, so the contract is checked here.
    for (const p of projects) {
      expect(p.blurb?.id, p.slug).toBeTruthy();
      expect(p.blurb?.en, p.slug).toBeTruthy();
      expect(p.blurb.id.length, p.slug).toBeLessThan(160);
    }
  });

  it('states a scope boundary only where one was actually given', () => {
    // `notMine` is optional. Where it exists it must carry both languages —
    // a half-translated boundary is worse than none.
    for (const p of projects) {
      if (!p.notMine) continue;
      expect(p.notMine.id, p.slug).toBeTruthy();
      expect(p.notMine.en, p.slug).toBeTruthy();
    }
  });
});