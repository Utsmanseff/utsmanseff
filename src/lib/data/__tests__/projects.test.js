import { readFileSync } from 'node:fs';
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

  it('gives SIGAP and SIMASET the reading pages their content earns', () => {
    expect(bySlug('sigap-bpn').tier).toBe('full');
    expect(bySlug('simaset').tier).toBe('full');
    expect(fullProjects).toHaveLength(7);
  });

  it('keeps the summary-only pair summary-only', () => {
    expect(bySlug('sibenih').tier).toBe('brief');
    expect(bySlug('simbas').tier).toBe('brief');
    expect(bySlug('sibenih').built.id).toHaveLength(0);
    expect(bySlug('simbas').built.id).toHaveLength(0);
  });

  it('says plainly that SIGAP does not pay anyone', () => {
    // SIGAP mencatat dan menghitung penggajian bulanan, tetapi tidak
    // menjalankan pembayaran. Batas itu harus ada di kalimatnya sendiri,
    // bukan cuma di kepala penulisnya. Larangan payroll di PROGRESS.md
    // berlaku untuk HRIS RSU Nirwana, bukan untuk sistem ini.
    expect(bySlug('sigap-bpn').context.id).toMatch(/tidak menjalankan pembayaran/);
    expect(bySlug('sigap-bpn').context.en).toMatch(/does not carry out payment/);
  });

  it('never speaks in the first person', () => {
    // Aturan Utsman: prosa halaman baca berbahasa baku dan tanpa kata "saya".
    for (const p of projects) {
      expect(p.context.id, p.slug).not.toMatch(/\bsaya\b/i);
      for (const line of p.built.id) expect(line, p.slug).not.toMatch(/\bsaya\b/i);
    }
  });

  it('never names the SIMRS the hospital happens to run', () => {
    // Boleh disebut open source, tidak boleh disebut namanya.
    for (const p of projects) {
      expect(p.context.id, p.slug).not.toMatch(/khanza/i);
      expect(p.context.en, p.slug).not.toMatch(/khanza/i);
    }
    expect(bySlug('rme').context.id).toMatch(/SIMRS open source/);
  });

  it('tells the whole hospital site, not only the OCR step', () => {
    const web = bySlug('rsu-nirwana-web');
    expect(web.title.id).toBe('Web Rumah Sakit dan Pendaftaran Pasien Baru');
    expect(web.built.id.some((l) => /Dokter Kami/.test(l))).toBe(true);
    expect(web.built.id.some((l) => /tombol sinkronkan/.test(l))).toBe(true);
  });

  it('seats SatuSehat where it actually sits', () => {
    // Pengirimannya bukan dari sistem ini, tetapi datanya berasal dari coding
    // di sini, dan pengirimannya otomatis lewat service tersendiri.
    const idrg = bySlug('idrg-bridging');
    expect(idrg.context.id).toMatch(/dikirim otomatis ke SatuSehat melalui service tersendiri/);
    expect(idrg.built.id.some((l) => /SatuSehat/.test(l))).toBe(true);
    expect(idrg.built.id.some((l) => /grouping IDRG/.test(l))).toBe(true);
  });

  it('keeps SOAP where it means a medical note, not a protocol', () => {
    expect(bySlug('rme').built.id.some((l) => /Pencatatan SOAP/.test(l))).toBe(true);
  });

  it('carries a repo field on every project, null where there is none', () => {
    for (const p of projects) {
      expect(p).toHaveProperty('repo');
      expect(p.repo === null || typeof p.repo === 'string').toBe(true);
    }
  });

  it('links exactly the five repos that are allowed to be public', () => {
    const withRepo = projects.filter((p) => p.repo).map((p) => p.slug).sort();
    expect(withRepo).toEqual(
      ['hris-nirwana', 'sibenih', 'sigap-bpn', 'simaset', 'simbas'].sort(),
    );
  });

  it('points every repo URL at the owner account, so a typo cannot land elsewhere', () => {
    for (const p of projects) {
      if (p.repo) expect(p.repo).toMatch(/^https:\/\/github\.com\/Utsmanseff\/[\w.-]+$/);
    }
  });

  it('gives every reading page a screenshot', () => {
    // Keadaan kosong di ScreenshotBlock tetap ada dan tetap benar, tetapi
    // sejak 2026-09-10 tidak ada lagi halaman baca yang memakainya.
    for (const p of fullProjects) {
      expect(p.image, p.slug).toBeTruthy();
    }
  });

  // Ukuran gambar dibaca dari kepala berkasnya sendiri. Tanpa ini, angka di
  // data bisa melenceng dari berkasnya tanpa satu pun test mengeluh — dan
  // itulah bug yang membuat tujuh halaman baca gepeng sampai 2026-09-10.
  const intrinsic = (publicPath) => {
    const buf = readFileSync(`public${publicPath}`);
    if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
      return [buf.readUInt32BE(16), buf.readUInt32BE(20)];
    }
    for (let i = 2; i < buf.length; ) {
      if (buf[i] !== 0xff) { i += 1; continue; }
      const m = buf[i + 1];
      if (m >= 0xc0 && m <= 0xc3) return [buf.readUInt16BE(i + 7), buf.readUInt16BE(i + 5)];
      if (m === 0xd8 || m === 0x01 || (m >= 0xd0 && m <= 0xd7)) { i += 2; continue; }
      i += 2 + buf.readUInt16BE(i + 2);
    }
    throw new Error(`tidak bisa membaca ukuran ${publicPath}`);
  };

  it('carries the real pixel size of every image it points at', () => {
    for (const p of projects) {
      if (!p.image) { expect(p.imageSize, p.slug).toBeNull(); continue; }
      expect(p.imageSize, p.slug).toHaveLength(2);
      expect(p.imageSize, p.slug).toEqual(intrinsic(p.image));
    }
  });

  it('never claims a 16:9 box for an image that is not 16:9', () => {
    // ScreenshotBlock dulu mengunci 1600x900 untuk semuanya. Tidak satu pun
    // gambar berasio itu: yang lanskap 2.10-2.43, dan HRIS potret 0.49.
    for (const p of projects) {
      if (!p.imageSize) continue;
      const [w, h] = p.imageSize;
      expect(w, p.slug).toBeGreaterThan(0);
      expect(h, p.slug).toBeGreaterThan(0);
    }
  });

});
