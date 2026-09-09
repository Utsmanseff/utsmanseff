import { describe, it, expect } from 'vitest';
import { projects, fullProjects, bySlug, siblings } from '@/lib/data/projects';

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

  it('gives every system a one-line blurb in both languages', () => {
    // The blurb is what a system says wherever it is listed rather than read.
    // A missing one leaves a blank row, so the contract is checked here.
    for (const p of projects) {
      expect(p.blurb?.id, p.slug).toBeTruthy();
      expect(p.blurb?.en, p.slug).toBeTruthy();
      expect(p.blurb.id.length, p.slug).toBeLessThan(160);
    }
  });

  it('gives every project a filter-safe client key', () => {
    for (const p of projects) {
      expect(p.clientKey, p.slug).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it('uses one key per client, not one per project', () => {
    const nirwana = projects.filter((p) => p.client === 'RSU Nirwana');
    expect(new Set(nirwana.map((p) => p.clientKey)).size).toBe(1);
  });

  it('places every system in the year it was actually built', () => {
    const byYear = {};
    for (const p of projects) (byYear[p.year] ??= []).push(p.slug);
    expect(byYear['2024'].sort()).toEqual(['sibenih', 'sigap-bpn']);
    expect(byYear['2025'].sort()).toEqual(['idrg-bridging', 'rme', 'simaset', 'simbas']);
    expect(byYear['2026'].sort()).toEqual(['hris-nirwana', 'psb-walisongo', 'rsu-nirwana-web']);
  });

  it('carries the acronym slugs, not the old descriptive ones', () => {
    const slugs = projects.map((p) => p.slug);
    expect(slugs).toContain('simaset');
    expect(slugs).toContain('sibenih');
    expect(slugs).toContain('simbas');
    expect(slugs).not.toContain('aset-kphl');
    expect(slugs).not.toContain('sertifikasi-benih');
  });

  it('keeps the five reading-page slugs untouched', () => {
    // Larangan yang tertulis di PROGRESS.md: URL ini sudah ada di luar sana.
    const slugs = projects.map((p) => p.slug);
    for (const s of ['rsu-nirwana-web', 'idrg-bridging', 'hris-nirwana', 'rme', 'psb-walisongo']) {
      expect(slugs, s).toContain(s);
    }
  });

  it('no longer claims SOAP anywhere in the stack', () => {
    // Utsman memastikan IDRG tidak memakainya. "Pencatatan SOAP" di built RME
    // adalah singkatan rekam medis dan tidak ada hubungannya — jangan ikut
    // dibuang.
    for (const p of projects) {
      expect(p.tech, p.slug).not.toContain('SOAP');
    }
  });

  it('gives the two agencies their own client keys', () => {
    expect(bySlug('simaset').client).toBe('UPT-KPHL');
    expect(bySlug('simaset').clientKey).toBe('upt-kphl');
    expect(bySlug('sibenih').client).toBe('BPSBTPH');
    expect(bySlug('sibenih').clientKey).toBe('bpsbtph');
    expect(bySlug('simbas').client).toBe('Kecamatan Basarang');
    expect(bySlug('simbas').clientKey).toBe('kecamatan-basarang');
  });

  it('names the systems the way Utsman names them', () => {
    expect(bySlug('simaset').shortName.id).toBe('SIMASET');
    expect(bySlug('sibenih').shortName.id).toBe('SIBENIH');
    expect(bySlug('simbas').shortName.id).toBe('SIMBAS');
    expect(bySlug('rsu-nirwana-web').shortName.id).toBe('Web & Pendaftaran');
    expect(bySlug('psb-walisongo').shortName.id).toBe('PSB & CBT');
  });

});
