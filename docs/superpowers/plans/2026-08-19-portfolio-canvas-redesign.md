# Portfolio Canvas Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the nine-section scrolling portfolio with two layers — a dark pannable canvas at `/` for exploring, and cream static pages at `/kerja/[slug]` for reading and sharing.

**Architecture:** All project data lives in one file, including each node's canvas position, so the canvas and the reading pages are two views over the same source. Pan/zoom is pure math in a DOM-free module (`lib/canvas/viewport.js`) that is unit-tested on its own; the React canvas components hold no geometry logic. Reading pages are server components for metadata and static params, with a client body so locale switching keeps working.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind v4, vitest + happy-dom + @testing-library/react. No graph library — pan, zoom and click do not need one, and bundle size is visible to the audience.

**Spec:** `docs/superpowers/specs/2026-08-19-portfolio-canvas-redesign-design.md`

---

## Conventions used throughout

- Run all tests with `npm test` (vitest, single run). A single file: `npx vitest run src/lib/canvas/__tests__/viewport.test.js`.
- Screen/world transform convention, used everywhere: `screen = world * zoom + offset`. `viewport.x` / `viewport.y` are the screen-space offset of world origin.
- Project identity is `slug`. There is no `id` field on a project — `id` inside an object always means the Indonesian string of a `{ id, en }` pair.
- Locale-aware text is always `{ id: '…', en: '…' }` and read with the existing `useLocale()` hook's `locale` value, e.g. `project.title[locale]`.

---

## File Structure

**Created:**

| File | Responsibility |
|---|---|
| `src/lib/canvas/viewport.js` | Pure pan/zoom/fit math. No DOM, no React. |
| `src/lib/canvas/__tests__/viewport.test.js` | Unit tests for the above. |
| `src/lib/data/canvas.js` | Canvas layout constants + the centre "Utsman" node. |
| `src/lib/data/__tests__/projects.test.js` | Data-integrity tests (slugs unique, `related` resolves, tiers valid). |
| `src/lib/hooks/useMediaQuery.js` | Breakpoint hook for the mobile fallback. |
| `src/components/canvas/Canvas.jsx` | Viewport state, pointer drag, wheel zoom, keyboard. |
| `src/components/canvas/Node.jsx` | One node; detail depends on zoom level. |
| `src/components/canvas/Edges.jsx` | SVG lines: centre spokes + `related` pairs. |
| `src/components/canvas/PreviewPanel.jsx` | Sliding preview panel. |
| `src/components/canvas/MobileList.jsx` | Vertical card list below 768px. |
| `src/components/canvas/CanvasChrome.jsx` | "Tampilkan semua" button, LangSwitcher, contact link. |
| `src/components/work/AccessBadge.jsx` | Public / internal / no-URL label. |
| `src/components/work/ScreenshotBlock.jsx` | Screenshot, or the designed no-screenshot state. |
| `src/components/work/ProjectView.jsx` | The seven blocks, client component (needs locale). |
| `src/components/work/WorkFooterNav.jsx` | Prev / next project, back to canvas. |
| `src/components/work/PaperHeader.jsx` | Slim header for the reading pages. |
| `src/app/kerja/[slug]/page.js` | Server component: static params + metadata. |
| `src/app/kontak/page.js` | Contact page. |

**Rewritten:** `src/lib/data/projects.js`, `src/app/page.js`, `src/app/globals.css`, `src/components/Providers.jsx`, `src/lib/i18n/id.js`, `src/lib/i18n/en.js`.

**Deleted:** `src/components/sections/*` (all nine), `src/components/nav/Nav.jsx`, `src/components/nav/ThemeToggle.jsx`, `src/lib/hooks/useTheme.jsx`, `src/lib/hooks/__tests__/useTheme.test.jsx`, `src/lib/data/experience.js`, `src/lib/data/education.js`, `src/components/ui/SectionTitle.jsx`, `src/components/ui/Rule.jsx`.

**Kept untouched:** `src/components/ui/FadeIn.jsx`, `src/components/ui/Tag.jsx`, `src/components/ui/ExternalLink.jsx`, `src/lib/hooks/useInView.js`, `src/lib/hooks/useLocale.jsx`, `src/components/nav/LangSwitcher.jsx`, `src/lib/data/meta.js`, `src/lib/i18n/config.js`, `src/lib/i18n/dictionary.js`.

---

## Task 1: Collect the two missing project write-ups

Two projects have no entry in `projects.js` yet: HRIS Nirwana and PSB MTs Walisongo. Their copy cannot be invented — it has to come from the user. Do this first, because Task 2 writes the data file.

**Files:** none yet (this task gathers input)

- [ ] **Step 1: Ask the user these exact questions**

Ask in one message and wait for the answer:

> Untuk **HRIS Nirwana**:
> 1. Tahun pengerjaan?
> 2. Cakupan sebenarnya — modul apa saja yang jadi? (payroll/keuangan sudah dipastikan TIDAK termasuk)
> 3. Apa yang ada sebelumnya, dan kenapa dibangun? (2-3 kalimat)
> 4. Bagian paling sulit waktu mengerjakan, dan cara menyelesaikannya? (1 paragraf)
> 5. Stack yang dipakai?
> 6. Ada screenshot yang bisa dipasang? (boleh disensor)
>
> Untuk **PSB MTs Walisongo (CBT)**:
> 1. Tahun pengerjaan?
> 2. Modul apa saja — pendaftaran saja, atau termasuk ujian CBT penuh (bank soal, timer, acak soal, hasil)?
> 3. Apa yang ada sebelumnya, dan kenapa dibangun? (2-3 kalimat)
> 4. Bagian paling sulit? (1 paragraf)
> 5. Stack yang dipakai?
> 6. Ada screenshot yang bisa dipasang?

- [ ] **Step 2: Save the answers verbatim**

Write the user's answers to `docs/superpowers/notes/2026-08-19-project-copy.md` exactly as given, without rewriting or embellishing. Task 2 draws the `{ id, en }` strings from this file. Any English string is translated from the user's Indonesian answer, never invented independently.

- [ ] **Step 3: Commit**

```bash
git add docs/superpowers/notes/2026-08-19-project-copy.md
git commit -m "docs: capture HRIS and PSB project write-ups from source"
```

**If the user cannot supply copy for a project:** give that project `tier: 'brief'` in Task 2 instead of `tier: 'full'`, and note it in the commit message. A brief node needs only `shortName`, `context`, `tech` — no full page is generated. Do not fill a full page with invented text.

---

## Task 2: Rewrite the project dataset

One flat array. Every project carries its own canvas position, tier, access status and relations. This is the single source both layers read.

**Files:**
- Rewrite: `src/lib/data/projects.js`
- Create: `src/lib/data/canvas.js`
- Test: `src/lib/data/__tests__/projects.test.js`

- [ ] **Step 1: Write the failing test**

Create `src/lib/data/__tests__/projects.test.js`:

```js
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
});
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npx vitest run src/lib/data/__tests__/projects.test.js`
Expected: FAIL — `Failed to resolve import "@/lib/data/canvas"`.

- [ ] **Step 3: Write the canvas layout constants**

Create `src/lib/data/canvas.js`:

```js
// Canvas layout. Node positions live on the projects themselves;
// this file holds the shared world and the one node that isn't a project.

export const WORLD = { width: 1600, height: 1000 };

export const NODE_RADIUS = { center: 78, full: 58, brief: 42 };

export const CENTER_NODE = {
  slug: '__me',
  position: { x: 800, y: 500 },
  name: 'Utsman',
  role: { id: 'Fullstack Developer', en: 'Fullstack Developer' },
  blurb: {
    id: 'Membangun sistem rumah sakit dan pemerintahan di Kalimantan Selatan. Empat tahun terakhir sebagian besar di ruang klinis: pendaftaran, klaim, rekam medis.',
    en: 'I build hospital and public-sector systems in South Kalimantan. Most of the last four years has been clinical: registration, claims, medical records.',
  },
};
```

- [ ] **Step 4: Rewrite the dataset**

Replace the whole of `src/lib/data/projects.js`. Prose for the seven existing projects is carried over from the current file with impact claims removed — the spec forbids unsourced numbers, so "antrian loket berkurang signifikan" and every `outcome` field are dropped, not rephrased. HRIS and PSB text comes from `docs/superpowers/notes/2026-08-19-project-copy.md` written in Task 1.

```js
// Every project, flat. Each entry carries its own canvas position, so the
// canvas and the reading pages are two views over one source.
//
// tier   'full'   -> big node, gets a /kerja/[slug] page
//        'brief'  -> small node, preview panel only
// access 'public'   -> anyone can open `site`
//        'internal' -> `site` exists but needs a login
//        'none'     -> no live URL at all

export const projects = [
  {
    slug: 'rsu-nirwana-web',
    client: 'RSU Nirwana',
    year: '2025',
    role: { id: 'Pengembang tunggal', en: 'Sole developer' },
    cluster: 'nirwana',
    tier: 'full',
    access: 'public',
    site: 'https://rsunirwana.id',
    position: { x: 560, y: 320 },
    related: ['rme', 'idrg-bridging'],
    image: '/assets/img/pendaftaran.png',
    tech: ['Laravel', 'Next.js', 'MySQL', 'Google Vision', 'REST API'],
    shortName: { id: 'Pendaftaran OCR', en: 'OCR Registration' },
    title: {
      id: 'Pendaftaran Rumah Sakit Berbasis OCR',
      en: 'OCR-Powered Hospital Registration',
    },
    context: {
      id: 'Pendaftaran online yang lama hanya mengamankan kuota — pasien tetap antri di loket. Formulirnya panjang dan rawan salah ketik, terutama untuk lansia, dan resepsionis harus mengetik ulang karena data web tidak pernah masuk SIMRS.',
      en: 'The legacy pre-registration only secured a queue slot; patients still queued at the counter. The long form was error-prone for elderly users, and receptionists retyped everything because the web flow never reached the internal SIMRS.',
    },
    built: {
      id: [
        'Ekstraksi nama, NIK dan alamat dari foto KTP lewat Google Cloud Vision',
        'Sinkronisasi data pendaftaran langsung ke SIMRS internal',
        'Bukti pendaftaran untuk verifikasi cepat di loket',
        'Validasi sisi server di seluruh formulir',
      ],
      en: [
        'Name, NIK and address extracted from a KTP photo via Google Cloud Vision',
        'Registration data synced straight into the internal SIMRS',
        'A confirmation slip for fast verification at the counter',
        'Server-side validation across the whole form',
      ],
    },
    hard: {
      id: 'Akurasi OCR harus dijaga di foto KTP dengan pencahayaan dan sudut yang sangat beragam, sementara dua skema data milik pihak berbeda harus diselaraskan tanpa merusak ekspektasi vendor SIMRS.',
      en: 'Holding OCR accuracy across wildly inconsistent KTP photos, while aligning two separately-owned data schemas without breaking the vendor SIMRS contract.',
    },
  },
  {
    slug: 'idrg-bridging',
    client: 'RSU Nirwana',
    year: '2025',
    role: { id: 'Pengembang tunggal', en: 'Sole developer' },
    cluster: 'nirwana',
    tier: 'full',
    access: 'internal',
    site: null,
    position: { x: 760, y: 250 },
    related: ['rme'],
    image: '/assets/img/eklaim.png',
    tech: ['Laravel', 'MySQL', 'REST API', 'SOAP'],
    shortName: { id: 'IDRG Bridging', en: 'IDRG Bridging' },
    title: {
      id: 'Bridging IDRG / INA-CBGs untuk Klaim BPJS',
      en: 'IDRG / INA-CBGs Bridging for BPJS Claims',
    },
    context: {
      id: 'Surat edaran Kemenkes mewajibkan update IDRG dan integrasi diagnosa SIMRS ke SatuSehat. Bridging bawaan SIMRS Khanza saat itu tidak memenuhi komponen penilaian, dan akses bridging terancam diputus — artinya klaim BPJS tidak bisa dikirim sama sekali.',
      en: 'A Ministry of Health circular required an IDRG update and SIMRS-to-SatuSehat diagnosis integration. The bundled SIMRS Khanza bridging did not meet the assessment criteria, and bridging access was about to be cut — meaning no BPJS claims could be submitted at all.',
    },
    built: {
      id: [
        'Web service mediator antara SIMRS dan endpoint BPJS, ditulis dari dokumentasi resmi',
        'Pemetaan diagnosa dan prosedur ke grouper INA-CBG',
        'Antrian pengiriman klaim dengan penanganan gagal-kirim',
        'Pencatatan jejak permintaan untuk penelusuran saat klaim ditolak',
      ],
      en: [
        'A mediator web service between SIMRS and the BPJS endpoints, written from the official docs',
        'Diagnosis and procedure mapping into the INA-CBG grouper',
        'A claim submission queue with failure handling',
        'Request logging so rejected claims can be traced',
      ],
    },
    hard: {
      id: 'Mengoordinasikan banyak endpoint BPJS di bawah tenggat regulasi, dengan taruhan yang tidak bisa ditawar: kalau bridging benar-benar diputus, rumah sakit berhenti bisa mengirim klaim.',
      en: 'Coordinating many BPJS endpoints under a regulatory deadline, with a stake that allowed no slippage: if bridging was actually cut, the hospital could not submit claims at all.',
    },
  },
  {
    slug: 'rme',
    client: 'RSU Nirwana',
    year: '2025',
    role: { id: 'Pengembang tunggal', en: 'Sole developer' },
    cluster: 'nirwana',
    tier: 'brief',
    access: 'internal',
    site: null,
    position: { x: 400, y: 480 },
    related: [],
    image: '/assets/img/rme1.png',
    tech: ['Laravel', 'MySQL', 'Livewire'],
    shortName: { id: 'RME', en: 'EMR' },
    title: { id: 'Rekam Medis Elektronik', en: 'Electronic Medical Records' },
    context: {
      id: 'Permenkes mewajibkan RME untuk akreditasi. Antarmuka sistem vendor tidak bisa dimodifikasi, jadi lapisan web terpisah dibangun di atas database SIMRS yang sama — tetap menulis ke sana supaya laporan yang ada tidak rusak.',
      en: 'Ministry regulation made EMR mandatory for accreditation. The vendor system\'s interface could not be modified, so a separate web layer was built on top of the same SIMRS database, still writing back into it so existing reports kept working.',
    },
    built: { id: [], en: [] },
    hard: {
      id: 'Database SIMRS punya 1.168 tabel tanpa dokumentasi yang memadai, sehingga memetakan data klinis beserta relasi dan constraint-nya lebih mirip rekonstruksi struktur data daripada pekerjaan antarmuka.',
      en: 'The SIMRS database had 1,168 tables with no usable documentation, so mapping the clinical data with its relations and constraints was closer to reconstructing a schema than to interface work.',
    },
  },
  // HRIS Nirwana — fields filled from docs/superpowers/notes/2026-08-19-project-copy.md.
  // Payroll and anything finance-related is out of scope and must not be mentioned.
  {
    slug: 'hris-nirwana',
    client: 'RSU Nirwana',
    role: { id: 'Pengembang tunggal', en: 'Sole developer' },
    cluster: 'nirwana',
    tier: 'full',
    access: 'internal',
    site: null,
    position: { x: 520, y: 640 },
    related: ['rsu-nirwana-web'],
    // year, image, tech, shortName, title, context, built, hard: from Task 1 notes
  },
  {
    slug: 'sigap-bpn',
    client: 'BPN',
    year: '2024',
    role: { id: 'Pengembang tunggal', en: 'Sole developer' },
    cluster: 'gov',
    tier: 'brief',
    access: 'none',
    site: null,
    position: { x: 1140, y: 400 },
    related: ['aset-kphl'],
    image: '/assets/img/sigap.jpg',
    tech: ['Laravel', 'Livewire', 'MySQL'],
    shortName: { id: 'SIGAP', en: 'SIGAP' },
    title: {
      id: 'Kepegawaian & Absensi Geolocation',
      en: 'Staffing & Geolocation Attendance',
    },
    context: {
      id: 'Manajemen kepegawaian dengan absensi berbasis lokasi, supaya kehadiran tercatat sesuai lokasi kerja.',
      en: 'Staff management with location-based attendance, so presence is recorded against the actual work site.',
    },
    built: { id: [], en: [] },
    hard: { id: '', en: '' },
  },
  {
    slug: 'aset-kphl',
    client: 'KPHL',
    year: '2024',
    role: { id: 'Pengembang tunggal', en: 'Sole developer' },
    cluster: 'gov',
    tier: 'brief',
    access: 'none',
    site: null,
    position: { x: 1220, y: 620 },
    related: ['sertifikasi-benih'],
    image: '/assets/img/aset.jpg',
    tech: ['Laravel', 'Livewire', 'MySQL'],
    shortName: { id: 'Aset KPHL', en: 'KPHL Assets' },
    title: { id: 'Manajemen Aset & Inventaris', en: 'Asset & Inventory Management' },
    context: {
      id: 'Pengelolaan aset organisasi dengan pelacakan lokasi dan kondisi, jadwal perawatan, dan pelaporan.',
      en: 'Organisational asset management with location and condition tracking, maintenance scheduling and reporting.',
    },
    built: { id: [], en: [] },
    hard: { id: '', en: '' },
  },
  {
    slug: 'sertifikasi-benih',
    client: 'Dinas Pertanian',
    year: '2024',
    role: { id: 'Pengembang tunggal', en: 'Sole developer' },
    cluster: 'gov',
    tier: 'brief',
    access: 'none',
    site: null,
    position: { x: 1060, y: 700 },
    related: [],
    image: '/assets/img/sertifikasi.png',
    tech: ['Laravel', 'Livewire', 'MySQL'],
    shortName: { id: 'Sertifikasi Benih', en: 'Seed Certification' },
    title: { id: 'Aplikasi Sertifikasi Benih', en: 'Seed Certification System' },
    context: {
      id: 'Pendaftaran dan pemantauan sertifikasi benih tanaman, dari pengajuan sampai sertifikat digital.',
      en: 'Plant seed certification registration and monitoring, from application through to a digital certificate.',
    },
    built: { id: [], en: [] },
    hard: { id: '', en: '' },
  },
  // PSB MTs Walisongo — fields filled from docs/superpowers/notes/2026-08-19-project-copy.md.
  {
    slug: 'psb-walisongo',
    client: 'MTs WaliSongo Banjarbaru',
    role: { id: 'Pengembang tunggal', en: 'Sole developer' },
    cluster: 'edu',
    tier: 'full',
    access: 'none',
    site: null,
    position: { x: 830, y: 810 },
    related: [],
    // year, image, tech, shortName, title, context, built, hard: from Task 1 notes
  },
];

export const fullProjects = projects.filter((p) => p.tier === 'full');

export function bySlug(slug) {
  return projects.find((p) => p.slug === slug);
}

// Prev/next across full-tier projects only, wrapping at both ends.
export function siblings(slug) {
  const i = fullProjects.findIndex((p) => p.slug === slug);
  if (i === -1) return { prev: null, next: null };
  const n = fullProjects.length;
  return {
    prev: fullProjects[(i - 1 + n) % n],
    next: fullProjects[(i + 1) % n],
  };
}
```

- [ ] **Step 5: Run the test and make it pass**

Run: `npx vitest run src/lib/data/__tests__/projects.test.js`
Expected: PASS, 11 tests.

If the HRIS or PSB entry is still incomplete because Task 1 got no answer, drop it to `tier: 'brief'` and give it empty `built` and `hard` — the `fullProjects` assertions then no longer apply to it.

- [ ] **Step 6: Commit**

```bash
git add src/lib/data/projects.js src/lib/data/canvas.js src/lib/data/__tests__/projects.test.js
git commit -m "feat(data): flatten projects, add canvas position, tier and access"
```

---

## Task 3: Viewport math

Pure functions, no DOM. Everything geometric lives here so the React components stay dumb.

**Files:**
- Create: `src/lib/canvas/viewport.js`
- Test: `src/lib/canvas/__tests__/viewport.test.js`

- [ ] **Step 1: Write the failing test**

Create `src/lib/canvas/__tests__/viewport.test.js`:

```js
import { describe, it, expect } from 'vitest';
import {
  MIN_ZOOM,
  MAX_ZOOM,
  DRAG_THRESHOLD,
  panBy,
  zoomAt,
  fitToNodes,
  worldToScreen,
  screenToWorld,
  detailLevel,
  isClick,
} from '@/lib/canvas/viewport';

const vp = { x: 0, y: 0, zoom: 1 };

describe('panBy', () => {
  it('adds the delta to the offset', () => {
    expect(panBy(vp, 30, -12)).toEqual({ x: 30, y: -12, zoom: 1 });
  });

  it('does not mutate the input', () => {
    const start = { x: 5, y: 5, zoom: 1 };
    panBy(start, 10, 10);
    expect(start).toEqual({ x: 5, y: 5, zoom: 1 });
  });
});

describe('worldToScreen / screenToWorld', () => {
  it('round-trips a point', () => {
    const v = { x: -120, y: 44, zoom: 1.35 };
    const world = { x: 700, y: 480 };
    const back = screenToWorld(v, worldToScreen(v, world));
    expect(back.x).toBeCloseTo(world.x, 6);
    expect(back.y).toBeCloseTo(world.y, 6);
  });

  it('applies zoom then offset', () => {
    expect(worldToScreen({ x: 10, y: 20, zoom: 2 }, { x: 100, y: 50 }))
      .toEqual({ x: 210, y: 120 });
  });
});

describe('zoomAt', () => {
  it('keeps the world point under the cursor fixed', () => {
    const cursor = { x: 400, y: 300 };
    const before = screenToWorld(vp, cursor);
    const after = screenToWorld(zoomAt(vp, 1.4, cursor), cursor);
    expect(after.x).toBeCloseTo(before.x, 6);
    expect(after.y).toBeCloseTo(before.y, 6);
  });

  it('clamps at the maximum', () => {
    expect(zoomAt({ x: 0, y: 0, zoom: MAX_ZOOM }, 3, { x: 0, y: 0 }).zoom).toBe(MAX_ZOOM);
  });

  it('clamps at the minimum', () => {
    expect(zoomAt({ x: 0, y: 0, zoom: MIN_ZOOM }, 0.1, { x: 0, y: 0 }).zoom).toBe(MIN_ZOOM);
  });
});

describe('fitToNodes', () => {
  const nodes = [
    { position: { x: 200, y: 200 }, radius: 40 },
    { position: { x: 800, y: 600 }, radius: 40 },
  ];

  it('brings every node inside the viewport', () => {
    const size = { width: 1000, height: 700 };
    const v = fitToNodes(nodes, size, 60);
    for (const n of nodes) {
      const s = worldToScreen(v, n.position);
      expect(s.x - n.radius * v.zoom).toBeGreaterThanOrEqual(0);
      expect(s.x + n.radius * v.zoom).toBeLessThanOrEqual(size.width);
      expect(s.y - n.radius * v.zoom).toBeGreaterThanOrEqual(0);
      expect(s.y + n.radius * v.zoom).toBeLessThanOrEqual(size.height);
    }
  });

  it('centres the bounding box', () => {
    const size = { width: 1000, height: 700 };
    const v = fitToNodes(nodes, size, 60);
    const mid = worldToScreen(v, { x: 500, y: 400 });
    expect(mid.x).toBeCloseTo(size.width / 2, 6);
    expect(mid.y).toBeCloseTo(size.height / 2, 6);
  });

  it('never zooms past the maximum for a tiny cluster', () => {
    const tight = [
      { position: { x: 500, y: 500 }, radius: 10 },
      { position: { x: 510, y: 505 }, radius: 10 },
    ];
    expect(fitToNodes(tight, { width: 1200, height: 900 }, 60).zoom).toBeLessThanOrEqual(MAX_ZOOM);
  });

  it('falls back to a centred identity view for an empty list', () => {
    expect(fitToNodes([], { width: 800, height: 600 }, 60)).toEqual({ x: 400, y: 300, zoom: 1 });
  });
});

describe('detailLevel', () => {
  it('is far when zoomed out', () => {
    expect(detailLevel(0.5)).toBe('far');
  });

  it('is near when zoomed in', () => {
    expect(detailLevel(1.2)).toBe('near');
  });
});

describe('isClick', () => {
  it('counts a still pointer as a click', () => {
    expect(isClick(0)).toBe(true);
  });

  it('rejects movement past the threshold', () => {
    expect(isClick(DRAG_THRESHOLD + 1)).toBe(false);
  });
});
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npx vitest run src/lib/canvas/__tests__/viewport.test.js`
Expected: FAIL — `Failed to resolve import "@/lib/canvas/viewport"`.

- [ ] **Step 3: Write the implementation**

Create `src/lib/canvas/viewport.js`:

```js
// Pure pan/zoom maths. No DOM, no React — everything here is testable alone.
//
// Convention: screen = world * zoom + offset.
// A viewport is { x, y, zoom }, where x/y is the screen position of world origin.

export const MIN_ZOOM = 0.45;
export const MAX_ZOOM = 1.8;

// Zoom below this shows names only; at or above it, nodes add stack and year.
export const DETAIL_THRESHOLD = 0.85;

// Total pointer travel, in px, still treated as a click rather than a drag.
export const DRAG_THRESHOLD = 6;

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

export function panBy(viewport, dx, dy) {
  return { x: viewport.x + dx, y: viewport.y + dy, zoom: viewport.zoom };
}

export function worldToScreen(viewport, point) {
  return {
    x: point.x * viewport.zoom + viewport.x,
    y: point.y * viewport.zoom + viewport.y,
  };
}

export function screenToWorld(viewport, point) {
  return {
    x: (point.x - viewport.x) / viewport.zoom,
    y: (point.y - viewport.y) / viewport.zoom,
  };
}

// Zoom around a screen anchor, keeping the world point beneath it fixed.
export function zoomAt(viewport, factor, anchor) {
  const zoom = clamp(viewport.zoom * factor, MIN_ZOOM, MAX_ZOOM);
  const world = screenToWorld(viewport, anchor);
  return {
    zoom,
    x: anchor.x - world.x * zoom,
    y: anchor.y - world.y * zoom,
  };
}

// Frame every node with `padding` px of breathing room on all sides.
export function fitToNodes(nodes, size, padding = 60) {
  if (nodes.length === 0) {
    return { x: size.width / 2, y: size.height / 2, zoom: 1 };
  }

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const n of nodes) {
    minX = Math.min(minX, n.position.x - n.radius);
    minY = Math.min(minY, n.position.y - n.radius);
    maxX = Math.max(maxX, n.position.x + n.radius);
    maxY = Math.max(maxY, n.position.y + n.radius);
  }

  const boxW = Math.max(maxX - minX, 1);
  const boxH = Math.max(maxY - minY, 1);
  const zoom = clamp(
    Math.min((size.width - padding * 2) / boxW, (size.height - padding * 2) / boxH),
    MIN_ZOOM,
    MAX_ZOOM
  );

  const centreX = (minX + maxX) / 2;
  const centreY = (minY + maxY) / 2;
  return {
    zoom,
    x: size.width / 2 - centreX * zoom,
    y: size.height / 2 - centreY * zoom,
  };
}

export function detailLevel(zoom) {
  return zoom >= DETAIL_THRESHOLD ? 'near' : 'far';
}

export function isClick(travel) {
  return travel <= DRAG_THRESHOLD;
}
```

- [ ] **Step 4: Run the test and watch it pass**

Run: `npx vitest run src/lib/canvas/__tests__/viewport.test.js`
Expected: PASS, 13 tests.

- [ ] **Step 5: Commit**

```bash
git add src/lib/canvas/viewport.js src/lib/canvas/__tests__/viewport.test.js
git commit -m "feat(canvas): add pure pan/zoom/fit viewport maths"
```

---

## Task 4: Palette and canvas tokens

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Replace the theme block**

In `src/app/globals.css`, replace the `@theme { … }` block, the `@variant dark` line and the `.dark { … }` block with:

```css
@theme {
  /* Reading layer — cream paper */
  --color-paper: #F2EDE3;
  --color-paper-deep: #E7E0D0;
  --color-ink: #1A1A1A;
  --color-mute: #6B6B5E;
  --color-rule: #D9D0BC;

  /* Exploring layer — warm charcoal canvas */
  --color-ground: #161A1D;
  --color-ground-soft: #1F2529;
  --color-ground-ink: #E8E0D0;
  --color-ground-mute: #7A8580;
  --color-ground-rule: #2E3539;

  /* Shared accent, the thread between both layers */
  --color-amber: #C97B3F;
  --color-amber-soft: #E8B888;

  --font-display: var(--font-display), Georgia, serif;
  --font-body: var(--font-body), -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: var(--font-mono), ui-monospace, monospace;
}
```

There is no dark variant and no `.dark` class — the toggle is gone, and each layer has one fixed treatment.

- [ ] **Step 2: Point the base styles at paper**

Replace the `html, body` rule with:

```css
html, body {
  background: var(--color-paper);
  color: var(--color-ink);
  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* The canvas route paints its own ground; body must not show through. */
body:has(.canvas-root) {
  background: var(--color-ground);
  overscroll-behavior: none;
}
```

- [ ] **Step 3: Add the reduced-motion rule**

Append to the file:

```css
/* Transitions are decoration; dragging is not. Keep the canvas usable. */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 4: Verify nothing references a dead token**

Run: `grep -rn "cream\|forest\|dark:" src/ --include=*.jsx --include=*.js --include=*.css`
Expected: only hits inside files scheduled for deletion in Task 11. Note them; do not fix them yet.

- [ ] **Step 5: Commit**

```bash
git add src/app/globals.css
git commit -m "feat(theme): split tokens into paper and ground layers, drop dark toggle"
```

---

## Task 5: Node component

**Files:**
- Create: `src/components/canvas/Node.jsx`
- Test: `src/components/canvas/__tests__/Node.test.jsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/canvas/__tests__/Node.test.jsx`:

```jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Node from '@/components/canvas/Node';

const project = {
  slug: 'rsu-nirwana-web',
  year: '2025',
  tier: 'full',
  tech: ['Laravel', 'Next.js', 'MySQL'],
  shortName: { id: 'Pendaftaran OCR', en: 'OCR Registration' },
  position: { x: 100, y: 100 },
};

function setup(props = {}) {
  return render(
    <Node
      project={project}
      locale="id"
      detail="far"
      selected={false}
      onOpen={() => {}}
      {...props}
    />
  );
}

describe('Node', () => {
  it('shows the short name at every zoom level', () => {
    setup();
    expect(screen.getByText('Pendaftaran OCR')).toBeInTheDocument();
  });

  it('hides stack and year when zoomed out', () => {
    setup({ detail: 'far' });
    expect(screen.queryByText(/Laravel/)).not.toBeInTheDocument();
    expect(screen.queryByText('2025')).not.toBeInTheDocument();
  });

  it('reveals stack and year when zoomed in', () => {
    setup({ detail: 'near' });
    expect(screen.getByText('2025')).toBeInTheDocument();
    expect(screen.getByText(/Laravel/)).toBeInTheDocument();
  });

  it('is a button so keyboard users can reach it', () => {
    setup();
    expect(screen.getByRole('button', { name: /Pendaftaran OCR/ })).toBeInTheDocument();
  });

  it('calls onOpen with the slug when activated by keyboard', async () => {
    const onOpen = vi.fn();
    setup({ onOpen });
    await userEvent.tab();
    await userEvent.keyboard('{Enter}');
    expect(onOpen).toHaveBeenCalledWith('rsu-nirwana-web');
  });

  it('marks itself pressed while its panel is open', () => {
    setup({ selected: true });
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
  });

  it('uses the locale to pick the short name', () => {
    setup({ locale: 'en' });
    expect(screen.getByText('OCR Registration')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npx vitest run src/components/canvas/__tests__/Node.test.jsx`
Expected: FAIL — cannot resolve `@/components/canvas/Node`.

- [ ] **Step 3: Write the component**

Create `src/components/canvas/Node.jsx`:

```jsx
"use client";

import { NODE_RADIUS } from '@/lib/data/canvas';

// One node on the canvas. Position is applied by the parent's world transform,
// so this component only knows about its own size and contents.
export default function Node({ project, locale, detail, selected, onOpen }) {
  const radius = NODE_RADIUS[project.tier];
  const near = detail === 'near';

  return (
    <button
      type="button"
      onClick={() => onOpen(project.slug)}
      aria-pressed={selected}
      className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center
                 justify-center gap-0.5 rounded-full text-center
                 border border-ground-rule bg-ground-soft/70 text-ground-ink
                 transition-[background-color,border-color,opacity] duration-500 ease-out
                 hover:bg-ground-soft hover:border-amber/60
                 focus-visible:outline-2 focus-visible:outline-amber"
      style={{
        left: project.position.x,
        top: project.position.y,
        width: radius * 2,
        height: radius * 2,
        borderColor: selected ? 'var(--color-amber)' : undefined,
      }}
    >
      <span className="font-mono text-[11px] leading-tight px-2">
        {project.shortName[locale]}
      </span>
      {near && (
        <>
          <span className="font-mono text-[9px] text-ground-mute">{project.year}</span>
          <span className="font-mono text-[9px] text-ground-mute px-2 leading-tight">
            {project.tech.slice(0, 2).join(' · ')}
          </span>
        </>
      )}
    </button>
  );
}
```

- [ ] **Step 4: Run the test and watch it pass**

Run: `npx vitest run src/components/canvas/__tests__/Node.test.jsx`
Expected: PASS, 7 tests.

- [ ] **Step 5: Commit**

```bash
git add src/components/canvas/Node.jsx src/components/canvas/__tests__/Node.test.jsx
git commit -m "feat(canvas): add node with zoom-dependent detail"
```

---

## Task 6: Edges

**Files:**
- Create: `src/components/canvas/Edges.jsx`
- Test: `src/components/canvas/__tests__/Edges.test.jsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/canvas/__tests__/Edges.test.jsx`:

```jsx
import { describe, it, expect } from 'vitest';
import { buildEdges } from '@/components/canvas/Edges';

const projects = [
  { slug: 'a', position: { x: 0, y: 0 }, related: ['b'] },
  { slug: 'b', position: { x: 10, y: 10 }, related: ['a'] },
  { slug: 'c', position: { x: 20, y: 20 }, related: [] },
];
const centre = { slug: '__me', position: { x: 5, y: 5 } };

describe('buildEdges', () => {
  it('gives every project a spoke to the centre', () => {
    const spokes = buildEdges(projects, centre).filter((e) => e.kind === 'spoke');
    expect(spokes).toHaveLength(3);
  });

  it('collapses a mutual relation into one line', () => {
    const links = buildEdges(projects, centre).filter((e) => e.kind === 'link');
    expect(links).toHaveLength(1);
    expect(links[0].from).toEqual({ x: 0, y: 0 });
    expect(links[0].to).toEqual({ x: 10, y: 10 });
  });

  it('gives every edge a stable key', () => {
    const keys = buildEdges(projects, centre).map((e) => e.key);
    expect(new Set(keys).size).toBe(keys.length);
  });
});
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npx vitest run src/components/canvas/__tests__/Edges.test.jsx`
Expected: FAIL — cannot resolve `@/components/canvas/Edges`.

- [ ] **Step 3: Write the component**

Create `src/components/canvas/Edges.jsx`:

```jsx
"use client";

import { WORLD } from '@/lib/data/canvas';

// Spokes tie every project to the centre; links join related projects.
// A mutual relation (a→b and b→a) must render once, so pairs are keyed by
// their sorted slugs.
export function buildEdges(projects, centre) {
  const edges = projects.map((p) => ({
    key: `spoke:${p.slug}`,
    kind: 'spoke',
    from: centre.position,
    to: p.position,
  }));

  const seen = new Set();
  for (const p of projects) {
    for (const slug of p.related) {
      const pairKey = [p.slug, slug].sort().join('~');
      if (seen.has(pairKey)) continue;
      const other = projects.find((q) => q.slug === slug);
      if (!other) continue;
      seen.add(pairKey);
      edges.push({ key: `link:${pairKey}`, kind: 'link', from: p.position, to: other.position });
    }
  }

  return edges;
}

export default function Edges({ projects, centre }) {
  const edges = buildEdges(projects, centre);
  return (
    <svg
      width={WORLD.width}
      height={WORLD.height}
      className="absolute inset-0 pointer-events-none"
      aria-hidden="true"
    >
      {edges.map((e) => (
        <line
          key={e.key}
          x1={e.from.x}
          y1={e.from.y}
          x2={e.to.x}
          y2={e.to.y}
          stroke="var(--color-ground-rule)"
          strokeWidth={e.kind === 'spoke' ? 1.5 : 1}
          strokeOpacity={e.kind === 'spoke' ? 1 : 0.7}
        />
      ))}
    </svg>
  );
}
```

- [ ] **Step 4: Run the test and watch it pass**

Run: `npx vitest run src/components/canvas/__tests__/Edges.test.jsx`
Expected: PASS, 3 tests.

- [ ] **Step 5: Commit**

```bash
git add src/components/canvas/Edges.jsx src/components/canvas/__tests__/Edges.test.jsx
git commit -m "feat(canvas): add edges with deduplicated relation lines"
```

---

## Task 7: Preview panel

**Files:**
- Create: `src/components/canvas/PreviewPanel.jsx`
- Create: `src/components/work/AccessBadge.jsx`
- Test: `src/components/canvas/__tests__/PreviewPanel.test.jsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/canvas/__tests__/PreviewPanel.test.jsx`:

```jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PreviewPanel from '@/components/canvas/PreviewPanel';

const full = {
  slug: 'rsu-nirwana-web',
  tier: 'full',
  access: 'public',
  site: 'https://rsunirwana.id',
  image: '/assets/img/pendaftaran.png',
  year: '2025',
  client: 'RSU Nirwana',
  title: { id: 'Pendaftaran OCR', en: 'OCR Registration' },
  context: { id: 'Konteks singkat.', en: 'Short context.' },
};

const brief = { ...full, slug: 'rme', tier: 'brief', access: 'internal', site: null };

describe('PreviewPanel', () => {
  it('renders nothing when no project is selected', () => {
    const { container } = render(<PreviewPanel project={null} locale="id" onClose={() => {}} />);
    expect(container.querySelector('[data-panel]')).toBeNull();
  });

  it('shows title and context for the chosen project', () => {
    render(<PreviewPanel project={full} locale="id" onClose={() => {}} />);
    expect(screen.getByText('Pendaftaran OCR')).toBeInTheDocument();
    expect(screen.getByText('Konteks singkat.')).toBeInTheDocument();
  });

  it('offers the full page only for full-tier projects', () => {
    const { rerender } = render(<PreviewPanel project={full} locale="id" onClose={() => {}} />);
    expect(screen.getByRole('link', { name: /Buka halaman/ })).toHaveAttribute(
      'href',
      '/kerja/rsu-nirwana-web'
    );
    rerender(<PreviewPanel project={brief} locale="id" onClose={() => {}} />);
    expect(screen.queryByRole('link', { name: /Buka halaman/ })).not.toBeInTheDocument();
  });

  it('links out only when the project is public', () => {
    const { rerender } = render(<PreviewPanel project={full} locale="id" onClose={() => {}} />);
    expect(screen.getByRole('link', { name: /Coba langsung/ })).toBeInTheDocument();
    rerender(<PreviewPanel project={brief} locale="id" onClose={() => {}} />);
    expect(screen.queryByRole('link', { name: /Coba langsung/ })).not.toBeInTheDocument();
  });

  it('closes on the close button', async () => {
    const onClose = vi.fn();
    render(<PreviewPanel project={full} locale="id" onClose={onClose} />);
    await userEvent.click(screen.getByRole('button', { name: /tutup/i }));
    expect(onClose).toHaveBeenCalled();
  });

  it('closes on Escape', async () => {
    const onClose = vi.fn();
    render(<PreviewPanel project={full} locale="id" onClose={onClose} />);
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npx vitest run src/components/canvas/__tests__/PreviewPanel.test.jsx`
Expected: FAIL — cannot resolve `@/components/canvas/PreviewPanel`.

- [ ] **Step 3: Write the access badge**

Create `src/components/work/AccessBadge.jsx`:

```jsx
// Access status is stated plainly. A dead "Live Demo" button costs more
// trust than an honest "internal system" label.
const LABEL = {
  public: { id: 'Publik — bisa dijelajahi', en: 'Public — open to explore' },
  internal: { id: 'Internal — demo atas permintaan', en: 'Internal — demo on request' },
  none: { id: 'Tidak ada URL publik', en: 'No public URL' },
};

export default function AccessBadge({ access, locale, tone = 'paper' }) {
  const border = tone === 'ground' ? 'border-ground-rule text-ground-mute' : 'border-rule text-mute';
  return (
    <span className={`font-mono text-[10px] uppercase tracking-wide border px-2 py-1 rounded-sm ${border}`}>
      {LABEL[access][locale]}
    </span>
  );
}
```

- [ ] **Step 4: Write the panel**

Create `src/components/canvas/PreviewPanel.jsx`:

```jsx
"use client";

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AccessBadge from '@/components/work/AccessBadge';

const COPY = {
  open: { id: 'Buka halaman', en: 'Open page' },
  visit: { id: 'Coba langsung ↗', en: 'Try it live ↗' },
  close: { id: 'Tutup panel', en: 'Close panel' },
};

export default function PreviewPanel({ project, locale, onClose }) {
  useEffect(() => {
    if (!project) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [project, onClose]);

  if (!project) return null;

  return (
    <aside
      data-panel
      className="absolute right-0 top-0 bottom-0 w-full sm:w-[55%] max-w-xl z-20
                 bg-ground-soft/95 backdrop-blur text-ground-ink border-l border-ground-rule
                 p-6 overflow-y-auto"
      style={{ transition: 'opacity 700ms cubic-bezier(0.22, 1, 0.36, 1)' }}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label={COPY.close[locale]}
        className="absolute right-4 top-4 text-ground-mute hover:text-ground-ink
                   transition-colors duration-500 text-xl leading-none"
      >
        ×
      </button>

      <div className="font-mono text-[10px] uppercase tracking-wider text-ground-mute">
        {project.client} · {project.year}
      </div>
      <h2 className="font-display text-2xl mt-2 mb-3">{project.title[locale]}</h2>
      <div className="mb-4">
        <AccessBadge access={project.access} locale={locale} tone="ground" />
      </div>

      {project.image && (
        <Image
          src={project.image}
          alt=""
          width={800}
          height={450}
          className="w-full h-auto rounded border border-ground-rule mb-4"
        />
      )}

      <p className="text-sm leading-relaxed text-ground-ink/85">{project.context[locale]}</p>

      <div className="flex flex-wrap gap-3 mt-6">
        {project.tier === 'full' && (
          <Link
            href={`/kerja/${project.slug}`}
            className="font-mono text-xs border border-amber text-amber px-3 py-2 rounded-sm
                       hover:bg-amber hover:text-ground transition-colors duration-500"
          >
            {COPY.open[locale]}
          </Link>
        )}
        {project.access === 'public' && project.site && (
          <a
            href={project.site}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs border border-ground-rule px-3 py-2 rounded-sm
                       hover:border-amber transition-colors duration-500"
          >
            {COPY.visit[locale]}
          </a>
        )}
      </div>
    </aside>
  );
}
```

- [ ] **Step 5: Run the test and watch it pass**

Run: `npx vitest run src/components/canvas/__tests__/PreviewPanel.test.jsx`
Expected: PASS, 6 tests.

- [ ] **Step 6: Commit**

```bash
git add src/components/canvas/PreviewPanel.jsx src/components/work/AccessBadge.jsx src/components/canvas/__tests__/PreviewPanel.test.jsx
git commit -m "feat(canvas): add preview panel with honest access labelling"
```

---

## Task 8: Canvas

The one stateful piece: viewport state, pointer drag, wheel zoom, keyboard.

**Files:**
- Create: `src/components/canvas/Canvas.jsx`
- Create: `src/components/canvas/CanvasChrome.jsx`
- Test: `src/components/canvas/__tests__/Canvas.test.jsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/canvas/__tests__/Canvas.test.jsx`:

```jsx
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Canvas from '@/components/canvas/Canvas';

const projects = [
  {
    slug: 'a', client: 'X', year: '2025', tier: 'full', access: 'none', site: null,
    position: { x: 400, y: 400 }, related: [], tech: ['Laravel'], image: null,
    shortName: { id: 'Satu', en: 'One' },
    title: { id: 'Satu', en: 'One' },
    context: { id: 'Konteks satu.', en: 'Context one.' },
  },
  {
    slug: 'b', client: 'Y', year: '2024', tier: 'brief', access: 'none', site: null,
    position: { x: 900, y: 600 }, related: [], tech: ['Next.js'], image: null,
    shortName: { id: 'Dua', en: 'Two' },
    title: { id: 'Dua', en: 'Two' },
    context: { id: 'Konteks dua.', en: 'Context two.' },
  },
];

function drag(el, from, to) {
  fireEvent.pointerDown(el, { clientX: from.x, clientY: from.y, pointerId: 1 });
  fireEvent.pointerMove(el, { clientX: to.x, clientY: to.y, pointerId: 1 });
  fireEvent.pointerUp(el, { clientX: to.x, clientY: to.y, pointerId: 1 });
}

beforeEach(() => {
  // happy-dom reports zero-size elements; fitToNodes needs real numbers.
  Element.prototype.getBoundingClientRect = vi.fn(() => ({
    width: 1200, height: 800, top: 0, left: 0, right: 1200, bottom: 800, x: 0, y: 0,
  }));
  Element.prototype.setPointerCapture = vi.fn();
  Element.prototype.releasePointerCapture = vi.fn();
});

describe('Canvas', () => {
  it('renders a node for every project', () => {
    render(<Canvas projects={projects} locale="id" />);
    expect(screen.getByRole('button', { name: /Satu/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Dua/ })).toBeInTheDocument();
  });

  it('moves the world when the surface is dragged', () => {
    render(<Canvas projects={projects} locale="id" />);
    const surface = screen.getByTestId('canvas-surface');
    const world = screen.getByTestId('canvas-world');
    const before = world.style.transform;
    drag(surface, { x: 300, y: 300 }, { x: 420, y: 340 });
    expect(world.style.transform).not.toBe(before);
  });

  it('opens the panel when a node is clicked', () => {
    render(<Canvas projects={projects} locale="id" />);
    fireEvent.click(screen.getByRole('button', { name: /Satu/ }));
    expect(screen.getByText('Konteks satu.')).toBeInTheDocument();
  });

  it('does not open the panel when the pointer travelled past the threshold', () => {
    render(<Canvas projects={projects} locale="id" />);
    const node = screen.getByRole('button', { name: /Satu/ });
    drag(screen.getByTestId('canvas-surface'), { x: 100, y: 100 }, { x: 260, y: 180 });
    fireEvent.click(node);
    expect(screen.queryByText('Konteks satu.')).not.toBeInTheDocument();
  });

  it('restores the framing when "Tampilkan semua" is pressed', () => {
    render(<Canvas projects={projects} locale="id" />);
    const world = screen.getByTestId('canvas-world');
    drag(screen.getByTestId('canvas-surface'), { x: 100, y: 100 }, { x: 500, y: 400 });
    const dragged = world.style.transform;
    fireEvent.click(screen.getByRole('button', { name: /Tampilkan semua/ }));
    expect(world.style.transform).not.toBe(dragged);
  });

  it('exposes the centre node with the owner name', () => {
    render(<Canvas projects={projects} locale="id" />);
    expect(screen.getByText('Utsman')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npx vitest run src/components/canvas/__tests__/Canvas.test.jsx`
Expected: FAIL — cannot resolve `@/components/canvas/Canvas`.

- [ ] **Step 3: Write the chrome**

Create `src/components/canvas/CanvasChrome.jsx`:

```jsx
"use client";

import Link from 'next/link';
import LangSwitcher from '@/components/nav/LangSwitcher';

const COPY = {
  fit: { id: 'Tampilkan semua', en: 'Show everything' },
  contact: { id: 'Kontak', en: 'Contact' },
  hint: { id: 'seret untuk menggeser · gulir untuk zoom', en: 'drag to pan · scroll to zoom' },
};

export default function CanvasChrome({ locale, onFit }) {
  return (
    <>
      <div className="absolute left-4 top-4 z-30 flex items-center gap-3">
        <button
          type="button"
          onClick={onFit}
          className="font-mono text-[11px] border border-ground-rule text-ground-ink
                     px-3 py-1.5 rounded-sm bg-ground/70 backdrop-blur
                     hover:border-amber transition-colors duration-500"
        >
          {COPY.fit[locale]}
        </button>
      </div>

      <div className="absolute right-4 top-4 z-30 flex items-center gap-4">
        <LangSwitcher />
        <Link
          href="/kontak"
          className="font-mono text-[11px] text-ground-mute hover:text-amber transition-colors duration-500"
        >
          {COPY.contact[locale]}
        </Link>
      </div>

      <p className="absolute right-4 bottom-4 z-30 font-mono text-[10px] text-ground-mute pointer-events-none">
        {COPY.hint[locale]}
      </p>
    </>
  );
}
```

- [ ] **Step 4: Write the canvas**

Create `src/components/canvas/Canvas.jsx`:

```jsx
"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  panBy, zoomAt, fitToNodes, detailLevel, isClick,
} from '@/lib/canvas/viewport';
import { CENTER_NODE, NODE_RADIUS, WORLD } from '@/lib/data/canvas';
import Node from './Node';
import Edges from './Edges';
import PreviewPanel from './PreviewPanel';
import CanvasChrome from './CanvasChrome';

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

function fitTargets(projects) {
  return [
    { position: CENTER_NODE.position, radius: NODE_RADIUS.center },
    ...projects.map((p) => ({ position: p.position, radius: NODE_RADIUS[p.tier] })),
  ];
}

export default function Canvas({ projects, locale }) {
  const surfaceRef = useRef(null);
  const [viewport, setViewport] = useState({ x: 0, y: 0, zoom: 1 });
  const [openSlug, setOpenSlug] = useState(null);
  // Eased only for programmatic moves; dragging must track the finger exactly.
  const [eased, setEased] = useState(false);

  const drag = useRef({ active: false, travel: 0, lastX: 0, lastY: 0 });

  const fit = useCallback(() => {
    const box = surfaceRef.current?.getBoundingClientRect();
    if (!box) return;
    setEased(true);
    setViewport(fitToNodes(fitTargets(projects), { width: box.width, height: box.height }, 80));
    setTimeout(() => setEased(false), 950);
  }, [projects]);

  useEffect(() => { fit(); }, [fit]);

  const onPointerDown = (e) => {
    drag.current = { active: true, travel: 0, lastX: e.clientX, lastY: e.clientY };
    surfaceRef.current?.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d.active) return;
    const dx = e.clientX - d.lastX;
    const dy = e.clientY - d.lastY;
    d.lastX = e.clientX;
    d.lastY = e.clientY;
    d.travel += Math.abs(dx) + Math.abs(dy);
    setViewport((v) => panBy(v, dx, dy));
  };

  const onPointerUp = (e) => {
    drag.current.active = false;
    surfaceRef.current?.releasePointerCapture?.(e.pointerId);
  };

  const onWheel = (e) => {
    const box = surfaceRef.current?.getBoundingClientRect();
    if (!box) return;
    const anchor = { x: e.clientX - box.left, y: e.clientY - box.top };
    setViewport((v) => zoomAt(v, e.deltaY < 0 ? 1.08 : 1 / 1.08, anchor));
  };

  // A node click that arrives after real dragging is a drag, not a click.
  const open = (slug) => {
    if (!isClick(drag.current.travel)) return;
    setOpenSlug(slug);
  };

  const detail = detailLevel(viewport.zoom);
  const openProject = projects.find((p) => p.slug === openSlug) ?? null;

  return (
    <div className="canvas-root relative w-full h-[100dvh] overflow-hidden bg-ground">
      <div
        ref={surfaceRef}
        data-testid="canvas-surface"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={onWheel}
        className="absolute inset-0 cursor-grab active:cursor-grabbing touch-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, var(--color-ground-rule) 1px, transparent 0)',
          backgroundSize: '26px 26px',
        }}
      >
        <div
          data-testid="canvas-world"
          className="absolute left-0 top-0 origin-top-left"
          style={{
            width: WORLD.width,
            height: WORLD.height,
            transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
            transition: eased ? `transform 900ms ${EASE}` : 'none',
          }}
        >
          <Edges projects={projects} centre={CENTER_NODE} />

          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full
                       border border-amber/60 bg-ground-soft flex flex-col items-center
                       justify-center text-center px-4"
            style={{
              left: CENTER_NODE.position.x,
              top: CENTER_NODE.position.y,
              width: NODE_RADIUS.center * 2,
              height: NODE_RADIUS.center * 2,
            }}
          >
            <span className="font-display text-lg text-ground-ink">{CENTER_NODE.name}</span>
            <span className="font-mono text-[9px] text-ground-mute">
              {CENTER_NODE.role[locale]}
            </span>
          </div>

          {projects.map((p) => (
            <Node
              key={p.slug}
              project={p}
              locale={locale}
              detail={detail}
              selected={p.slug === openSlug}
              onOpen={open}
            />
          ))}
        </div>
      </div>

      <CanvasChrome locale={locale} onFit={fit} />
      <PreviewPanel project={openProject} locale={locale} onClose={() => setOpenSlug(null)} />
    </div>
  );
}
```

- [ ] **Step 5: Run the test and watch it pass**

Run: `npx vitest run src/components/canvas/__tests__/Canvas.test.jsx`
Expected: PASS, 6 tests.

- [ ] **Step 6: Commit**

```bash
git add src/components/canvas/Canvas.jsx src/components/canvas/CanvasChrome.jsx src/components/canvas/__tests__/Canvas.test.jsx
git commit -m "feat(canvas): add pannable canvas with drag, zoom and preview panel"
```

---

## Task 9: Mobile fallback and the `/` route

Below 768px the canvas is replaced by a calm vertical list grouped by cluster. Dragging a map with one thumb on a five-inch screen is punishment, and the list is the reasonable version rather than a crippled one.

**Files:**
- Create: `src/lib/hooks/useMediaQuery.js`
- Create: `src/components/canvas/MobileList.jsx`
- Rewrite: `src/app/page.js`
- Test: `src/components/canvas/__tests__/MobileList.test.jsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/canvas/__tests__/MobileList.test.jsx`:

```jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MobileList from '@/components/canvas/MobileList';

const projects = [
  {
    slug: 'a', client: 'RSU Nirwana', year: '2025', tier: 'full', access: 'public',
    site: 'https://x.test', cluster: 'nirwana', image: null, tech: ['Laravel'],
    shortName: { id: 'Satu', en: 'One' },
    title: { id: 'Satu', en: 'One' },
    context: { id: 'Konteks satu.', en: 'Context one.' },
  },
  {
    slug: 'b', client: 'BPN', year: '2024', tier: 'brief', access: 'none',
    site: null, cluster: 'gov', image: null, tech: ['Livewire'],
    shortName: { id: 'Dua', en: 'Two' },
    title: { id: 'Dua', en: 'Two' },
    context: { id: 'Konteks dua.', en: 'Context two.' },
  },
];

describe('MobileList', () => {
  it('groups projects under their cluster heading', () => {
    render(<MobileList projects={projects} locale="id" />);
    expect(screen.getByRole('heading', { name: /RSU Nirwana/ })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Pemerintahan/ })).toBeInTheDocument();
  });

  it('links full-tier projects to their page', () => {
    render(<MobileList projects={projects} locale="id" />);
    expect(screen.getByRole('link', { name: /Satu/ })).toHaveAttribute('href', '/kerja/a');
  });

  it('does not link brief projects to a page that does not exist', () => {
    render(<MobileList projects={projects} locale="id" />);
    expect(screen.queryByRole('link', { name: /Dua/ })).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npx vitest run src/components/canvas/__tests__/MobileList.test.jsx`
Expected: FAIL — cannot resolve `@/components/canvas/MobileList`.

- [ ] **Step 3: Write the media-query hook**

Create `src/lib/hooks/useMediaQuery.js`:

```js
"use client";

import { useEffect, useState } from 'react';

// Starts false on the server and on first client render, so both agree;
// the real value lands after mount.
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, [query]);

  return matches;
}
```

- [ ] **Step 4: Write the mobile list**

Create `src/components/canvas/MobileList.jsx`:

```jsx
"use client";

import Link from 'next/link';
import AccessBadge from '@/components/work/AccessBadge';
import FadeIn from '@/components/ui/FadeIn';
import { CENTER_NODE } from '@/lib/data/canvas';

const CLUSTERS = [
  { key: 'nirwana', label: { id: 'RSU Nirwana', en: 'RSU Nirwana' } },
  { key: 'gov', label: { id: 'Pemerintahan', en: 'Public sector' } },
  { key: 'edu', label: { id: 'Pendidikan', en: 'Education' } },
];

function Card({ project, locale }) {
  const body = (
    <>
      <div className="font-mono text-[10px] uppercase tracking-wider text-mute">
        {project.client} · {project.year}
      </div>
      <h3 className="font-display text-xl mt-1 mb-2">{project.title[locale]}</h3>
      <p className="text-sm leading-relaxed text-ink/80 mb-3">{project.context[locale]}</p>
      <AccessBadge access={project.access} locale={locale} />
    </>
  );

  return (
    <FadeIn className="border border-rule rounded p-4 bg-paper">
      {project.tier === 'full' ? (
        <Link href={`/kerja/${project.slug}`} className="block">
          {body}
        </Link>
      ) : (
        body
      )}
    </FadeIn>
  );
}

export default function MobileList({ projects, locale }) {
  return (
    <main className="px-5 py-10 max-w-xl mx-auto">
      <h1 className="font-display text-3xl">{CENTER_NODE.name}</h1>
      <p className="text-sm leading-relaxed text-ink/80 mt-3 mb-10">
        {CENTER_NODE.blurb[locale]}
      </p>

      {CLUSTERS.map((c) => {
        const inCluster = projects.filter((p) => p.cluster === c.key);
        if (inCluster.length === 0) return null;
        return (
          <section key={c.key} className="mb-10">
            <h2 className="font-mono text-[11px] uppercase tracking-wider text-mute mb-4">
              {c.label[locale]}
            </h2>
            <div className="flex flex-col gap-4">
              {inCluster.map((p) => (
                <Card key={p.slug} project={p} locale={locale} />
              ))}
            </div>
          </section>
        );
      })}
    </main>
  );
}
```

- [ ] **Step 5: Run the test and watch it pass**

Run: `npx vitest run src/components/canvas/__tests__/MobileList.test.jsx`
Expected: PASS, 3 tests.

- [ ] **Step 6: Rewrite the home route**

Replace `src/app/page.js`:

```jsx
"use client";

import { projects } from '@/lib/data/projects';
import { useLocale } from '@/lib/hooks/useLocale';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import Canvas from '@/components/canvas/Canvas';
import MobileList from '@/components/canvas/MobileList';

export default function Home() {
  const { locale } = useLocale();
  const isNarrow = useMediaQuery('(max-width: 767px)');

  return isNarrow
    ? <MobileList projects={projects} locale={locale} />
    : <Canvas projects={projects} locale={locale} />;
}
```

- [ ] **Step 7: Commit**

```bash
git add src/lib/hooks/useMediaQuery.js src/components/canvas/MobileList.jsx src/components/canvas/__tests__/MobileList.test.jsx src/app/page.js
git commit -m "feat(canvas): add mobile list fallback and wire the home route"
```

---

## Task 10: Project pages

Seven blocks, fixed order. Server component for metadata and static params; client body so locale switching keeps working.

**Files:**
- Create: `src/components/work/ScreenshotBlock.jsx`
- Create: `src/components/work/WorkFooterNav.jsx`
- Create: `src/components/work/PaperHeader.jsx`
- Create: `src/components/work/ProjectView.jsx`
- Create: `src/app/kerja/[slug]/page.js`
- Test: `src/components/work/__tests__/ProjectView.test.jsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/work/__tests__/ProjectView.test.jsx`:

```jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProjectView from '@/components/work/ProjectView';

vi.mock('@/lib/hooks/useLocale', () => ({
  useLocale: () => ({ locale: 'id', setLocale: () => {}, t: (k) => k, hydrated: true }),
}));

const project = {
  slug: 'rsu-nirwana-web',
  client: 'RSU Nirwana',
  year: '2025',
  tier: 'full',
  access: 'public',
  site: 'https://rsunirwana.id',
  image: '/assets/img/pendaftaran.png',
  tech: ['Laravel', 'Next.js'],
  role: { id: 'Pengembang tunggal', en: 'Sole developer' },
  shortName: { id: 'Pendaftaran OCR', en: 'OCR Registration' },
  title: { id: 'Pendaftaran Berbasis OCR', en: 'OCR Registration' },
  context: { id: 'Konteks singkat.', en: 'Short context.' },
  built: { id: ['Ekstraksi NIK dari foto KTP'], en: ['NIK extraction from a KTP photo'] },
  hard: { id: 'Bagian tersulitnya OCR.', en: 'The hard part was OCR.' },
};

const noShot = { ...project, image: null, access: 'none', site: null };

describe('ProjectView', () => {
  it('renders the seven blocks in order', () => {
    render(<ProjectView project={project} prev={null} next={null} />);
    const html = document.body.innerHTML;
    const order = ['RSU Nirwana', 'Konteks singkat.', 'Ekstraksi NIK', 'Bagian tersulitnya', 'Laravel'];
    const positions = order.map((s) => html.indexOf(s));
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
    expect(positions.every((p) => p > -1)).toBe(true);
  });

  it('shows the live button for a public project', () => {
    render(<ProjectView project={project} prev={null} next={null} />);
    expect(screen.getByRole('link', { name: /Coba langsung/ })).toHaveAttribute(
      'href',
      'https://rsunirwana.id'
    );
  });

  it('shows a stated empty state instead of a broken image', () => {
    render(<ProjectView project={noShot} prev={null} next={null} />);
    expect(screen.getByText(/Screenshot menyusul/)).toBeInTheDocument();
  });

  it('links to the previous and next project', () => {
    const other = { ...project, slug: 'idrg-bridging', shortName: { id: 'IDRG', en: 'IDRG' } };
    render(<ProjectView project={project} prev={other} next={other} />);
    const links = screen.getAllByRole('link', { name: /IDRG/ });
    expect(links[0]).toHaveAttribute('href', '/kerja/idrg-bridging');
  });

  it('always offers a way back to the canvas', () => {
    render(<ProjectView project={project} prev={null} next={null} />);
    expect(screen.getByRole('link', { name: /Kembali ke peta/ })).toHaveAttribute('href', '/');
  });
});
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npx vitest run src/components/work/__tests__/ProjectView.test.jsx`
Expected: FAIL — cannot resolve `@/components/work/ProjectView`.

- [ ] **Step 3: Write the small blocks**

Create `src/components/work/ScreenshotBlock.jsx`:

```jsx
import Image from 'next/image';

const MISSING = {
  id: 'Screenshot menyusul — sistem internal, tangkapan layar masih disensor.',
  en: 'Screenshot to follow — internal system, captures still being redacted.',
};

export default function ScreenshotBlock({ src, alt, locale }) {
  if (!src) {
    return (
      <div className="border border-dashed border-rule rounded p-8 text-center">
        <p className="font-mono text-xs text-mute">{MISSING[locale]}</p>
      </div>
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      width={1600}
      height={900}
      className="w-full h-auto rounded border border-rule"
      priority
    />
  );
}
```

Create `src/components/work/PaperHeader.jsx`:

```jsx
"use client";

import Link from 'next/link';
import LangSwitcher from '@/components/nav/LangSwitcher';

const BACK = { id: 'Kembali ke peta', en: 'Back to the map' };

export default function PaperHeader({ locale }) {
  return (
    <header className="flex items-center justify-between py-6">
      <Link
        href="/"
        className="font-mono text-[11px] text-mute hover:text-amber transition-colors duration-500"
      >
        ← {BACK[locale]}
      </Link>
      <LangSwitcher />
    </header>
  );
}
```

Create `src/components/work/WorkFooterNav.jsx`:

```jsx
import Link from 'next/link';

const COPY = {
  prev: { id: 'Sebelumnya', en: 'Previous' },
  next: { id: 'Berikutnya', en: 'Next' },
};

export default function WorkFooterNav({ prev, next, locale }) {
  return (
    <nav className="flex justify-between gap-6 border-t border-rule pt-8 mt-16">
      <div>
        {prev && (
          <Link href={`/kerja/${prev.slug}`} className="group block">
            <span className="font-mono text-[10px] uppercase tracking-wider text-mute">
              {COPY.prev[locale]}
            </span>
            <span className="block font-display text-lg group-hover:text-amber transition-colors duration-500">
              {prev.shortName[locale]}
            </span>
          </Link>
        )}
      </div>
      <div className="text-right">
        {next && (
          <Link href={`/kerja/${next.slug}`} className="group block">
            <span className="font-mono text-[10px] uppercase tracking-wider text-mute">
              {COPY.next[locale]}
            </span>
            <span className="block font-display text-lg group-hover:text-amber transition-colors duration-500">
              {next.shortName[locale]}
            </span>
          </Link>
        )}
      </div>
    </nav>
  );
}
```

- [ ] **Step 4: Write the page body**

Create `src/components/work/ProjectView.jsx`:

```jsx
"use client";

import Link from 'next/link';
import { useLocale } from '@/lib/hooks/useLocale';
import Tag from '@/components/ui/Tag';
import FadeIn from '@/components/ui/FadeIn';
import AccessBadge from '@/components/work/AccessBadge';
import ScreenshotBlock from '@/components/work/ScreenshotBlock';
import PaperHeader from '@/components/work/PaperHeader';
import WorkFooterNav from '@/components/work/WorkFooterNav';

const COPY = {
  built: { id: 'Apa yang saya bangun', en: 'What I built' },
  hard: { id: 'Yang sulit', en: 'The hard part' },
  stack: { id: 'Stack', en: 'Stack' },
  visit: { id: 'Coba langsung ↗', en: 'Try it live ↗' },
  back: { id: 'Kembali ke peta', en: 'Back to the map' },
};

export default function ProjectView({ project, prev, next }) {
  const { locale } = useLocale();

  return (
    <div className="max-w-3xl mx-auto px-5 pb-20">
      <PaperHeader locale={locale} />

      <FadeIn as="article">
        {/* 1 — head */}
        <div className="font-mono text-[11px] uppercase tracking-wider text-mute">
          {project.client} · {project.year} · {project.role[locale]}
        </div>
        <h1 className="font-display text-4xl sm:text-5xl leading-tight mt-3 mb-4">
          {project.title[locale]}
        </h1>
        <AccessBadge access={project.access} locale={locale} />

        {/* 2 — context */}
        <p className="text-base leading-relaxed text-ink/85 mt-8 mb-10">
          {project.context[locale]}
        </p>

        {/* 3 — screenshot */}
        <ScreenshotBlock src={project.image} alt={project.title[locale]} locale={locale} />

        {/* 4 — what I built */}
        <h2 className="font-mono text-[11px] uppercase tracking-wider text-amber mt-14 mb-4">
          {COPY.built[locale]}
        </h2>
        <ul className="flex flex-col gap-2">
          {project.built[locale].map((item) => (
            <li key={item} className="text-sm leading-relaxed text-ink/85 pl-4 border-l border-rule">
              {item}
            </li>
          ))}
        </ul>

        {/* 5 — the hard part */}
        <h2 className="font-mono text-[11px] uppercase tracking-wider text-amber mt-14 mb-4">
          {COPY.hard[locale]}
        </h2>
        <p className="font-display text-lg leading-relaxed italic">{project.hard[locale]}</p>

        {/* 6 — stack */}
        <h2 className="font-mono text-[11px] uppercase tracking-wider text-amber mt-14 mb-4">
          {COPY.stack[locale]}
        </h2>
        <div className="flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>

        {/* 7 — foot */}
        {project.access === 'public' && project.site && (
          <a
            href={project.site}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block font-mono text-xs border border-amber text-amber px-4 py-2
                       rounded-sm mt-12 hover:bg-amber hover:text-paper transition-colors duration-500"
          >
            {COPY.visit[locale]}
          </a>
        )}

        <WorkFooterNav prev={prev} next={next} locale={locale} />

        <Link
          href="/"
          className="inline-block font-mono text-[11px] text-mute mt-10
                     hover:text-amber transition-colors duration-500"
        >
          ← {COPY.back[locale]}
        </Link>
      </FadeIn>
    </div>
  );
}
```

- [ ] **Step 5: Run the test and watch it pass**

Run: `npx vitest run src/components/work/__tests__/ProjectView.test.jsx`
Expected: PASS, 5 tests.

- [ ] **Step 6: Write the route**

Create `src/app/kerja/[slug]/page.js`:

```jsx
import { notFound } from 'next/navigation';
import { fullProjects, bySlug, siblings } from '@/lib/data/projects';
import ProjectView from '@/components/work/ProjectView';

export function generateStaticParams() {
  return fullProjects.map((p) => ({ slug: p.slug }));
}

// Metadata is rendered on the server, so it is always Indonesian —
// the locale only exists in the browser. That matches the audience.
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = bySlug(slug);
  if (!project) return {};
  return {
    title: `${project.title.id} — Utsman`,
    description: project.context.id,
    openGraph: {
      title: project.title.id,
      description: project.context.id,
      images: project.image ? [project.image] : [],
    },
  };
}

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const project = bySlug(slug);
  if (!project || project.tier !== 'full') notFound();
  const { prev, next } = siblings(slug);
  return <ProjectView project={project} prev={prev} next={next} />;
}
```

- [ ] **Step 7: Verify the routes build**

Run: `npm run build`
Expected: build succeeds and the output lists one static route per full-tier project, e.g. `/kerja/rsu-nirwana-web`.

- [ ] **Step 8: Commit**

```bash
git add src/components/work src/app/kerja
git commit -m "feat(work): add project pages with fixed seven-block anatomy"
```

---

## Task 11: Contact page

**Files:**
- Create: `src/app/kontak/page.js`

- [ ] **Step 1: Write the page**

Create `src/app/kontak/page.js`:

```jsx
"use client";

import { meta } from '@/lib/data/meta';
import { useLocale } from '@/lib/hooks/useLocale';
import PaperHeader from '@/components/work/PaperHeader';
import FadeIn from '@/components/ui/FadeIn';

const COPY = {
  heading: { id: 'Kontak', en: 'Contact' },
  intro: {
    id: 'Terbuka untuk pekerjaan fullstack dan project sistem internal. Paling cepat dibalas lewat email atau WhatsApp.',
    en: 'Open to fullstack work and internal systems projects. Email or WhatsApp gets the fastest reply.',
  },
  cv: { id: 'Unduh CV (PDF)', en: 'Download CV (PDF)' },
};

export default function ContactPage() {
  const { locale } = useLocale();
  const rows = [
    { label: 'Email', value: meta.email, href: `mailto:${meta.email}` },
    { label: 'WhatsApp', value: meta.whatsapp, href: meta.whatsappLink },
    { label: 'GitHub', value: meta.githubHandle, href: meta.github },
    { label: 'Instagram', value: meta.instagramHandle, href: meta.instagram },
  ];

  return (
    <div className="max-w-2xl mx-auto px-5 pb-20">
      <PaperHeader locale={locale} />
      <FadeIn as="main">
        <h1 className="font-display text-4xl mb-4">{COPY.heading[locale]}</h1>
        <p className="text-base leading-relaxed text-ink/85 mb-10">{COPY.intro[locale]}</p>

        <dl className="flex flex-col">
          {rows.map((r) => (
            <div key={r.label} className="flex justify-between gap-6 border-t border-rule py-4">
              <dt className="font-mono text-[11px] uppercase tracking-wider text-mute">
                {r.label}
              </dt>
              <dd>
                <a
                  href={r.href}
                  target={r.href.startsWith('http') ? '_blank' : undefined}
                  rel={r.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="text-sm hover:text-amber transition-colors duration-500"
                >
                  {r.value}
                </a>
              </dd>
            </div>
          ))}
        </dl>

        <a
          href={meta.cvFile}
          className="inline-block font-mono text-xs border border-amber text-amber px-4 py-2
                     rounded-sm mt-10 hover:bg-amber hover:text-paper transition-colors duration-500"
        >
          {COPY.cv[locale]}
        </a>
      </FadeIn>
    </div>
  );
}
```

- [ ] **Step 2: Check the CV file is really there**

Run: `ls public/Utsman-CV.pdf`
Expected: the file exists. If it does not, the download link is a dead link — remove the CV button and tell the user the file is missing rather than shipping a 404.

- [ ] **Step 3: Commit**

```bash
git add src/app/kontak/page.js
git commit -m "feat(contact): add contact page with CV download"
```

---

## Task 12: Delete the old portfolio

Everything the new structure replaces goes now, in one commit, so the removal is easy to read in history.

**Files:**
- Delete: the list below
- Modify: `src/components/Providers.jsx`, `src/app/layout.js`

- [ ] **Step 1: Delete dead files**

```bash
git rm -r src/components/sections
git rm src/components/nav/Nav.jsx src/components/nav/ThemeToggle.jsx
git rm src/lib/hooks/useTheme.jsx src/lib/hooks/__tests__/useTheme.test.jsx
git rm src/lib/data/experience.js src/lib/data/education.js
git rm src/components/ui/SectionTitle.jsx src/components/ui/Rule.jsx
```

- [ ] **Step 2: Drop the theme provider**

Replace `src/components/Providers.jsx`:

```jsx
"use client";

import { LocaleProvider } from '@/lib/hooks/useLocale';

export default function Providers({ children }) {
  return <LocaleProvider>{children}</LocaleProvider>;
}
```

- [ ] **Step 3: Remove theme wiring from the layout**

In `src/app/layout.js`, delete any import of `useTheme` or `ThemeToggle`, and remove any inline script or `className` that sets a `dark` class on `<html>`. The document keeps `lang="id"`.

- [ ] **Step 4: Prune the dictionaries**

In `src/lib/i18n/id.js` and `src/lib/i18n/en.js`, delete the `hero`, `about`, `skills`, `experience`, `education`, `work`, `other`, `contact` and `footer` key groups. Keep `nav` and `ui`. Both files must keep exactly the same top-level keys — `dictionary.test.js` enforces this.

- [ ] **Step 5: Confirm nothing still imports a deleted module**

Run: `grep -rn "useTheme\|ThemeToggle\|sections/\|SectionTitle\|data/experience\|data/education" src/`
Expected: no output.

- [ ] **Step 6: Run the whole suite**

Run: `npm test`
Expected: PASS. `useTheme.test.jsx` is gone; the rest pass.

- [ ] **Step 7: Build**

Run: `npm run build`
Expected: success, no unresolved imports.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "refactor: remove scroll-portfolio sections, theme toggle and CV-duplicating data"
```

---

## Task 13: Keyboard reachability on the canvas

The nodes are `<button>` elements, so Tab already reaches them — but tabbing to a node that sits outside the current framing scrolls nothing and looks broken. Focusing a node must bring it into view.

**Files:**
- Modify: `src/components/canvas/Canvas.jsx`
- Modify: `src/components/canvas/Node.jsx`
- Test: `src/components/canvas/__tests__/Canvas.keyboard.test.jsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/canvas/__tests__/Canvas.keyboard.test.jsx`:

```jsx
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Canvas from '@/components/canvas/Canvas';

const projects = [
  {
    slug: 'a', client: 'X', year: '2025', tier: 'full', access: 'none', site: null,
    position: { x: 200, y: 200 }, related: [], tech: ['Laravel'], image: null,
    shortName: { id: 'Satu', en: 'One' },
    title: { id: 'Satu', en: 'One' },
    context: { id: 'Konteks satu.', en: 'Context one.' },
  },
  {
    slug: 'b', client: 'Y', year: '2024', tier: 'brief', access: 'none', site: null,
    position: { x: 1400, y: 900 }, related: [], tech: ['Next.js'], image: null,
    shortName: { id: 'Dua', en: 'Two' },
    title: { id: 'Dua', en: 'Two' },
    context: { id: 'Konteks dua.', en: 'Context two.' },
  },
];

beforeEach(() => {
  Element.prototype.getBoundingClientRect = vi.fn(() => ({
    width: 1200, height: 800, top: 0, left: 0, right: 1200, bottom: 800, x: 0, y: 0,
  }));
  Element.prototype.setPointerCapture = vi.fn();
  Element.prototype.releasePointerCapture = vi.fn();
});

describe('Canvas keyboard access', () => {
  it('recentres the viewport when a node receives focus', () => {
    render(<Canvas projects={projects} locale="id" />);
    const world = screen.getByTestId('canvas-world');
    fireEvent.pointerDown(screen.getByTestId('canvas-surface'), { clientX: 0, clientY: 0, pointerId: 1 });
    fireEvent.pointerMove(screen.getByTestId('canvas-surface'), { clientX: 600, clientY: 500, pointerId: 1 });
    fireEvent.pointerUp(screen.getByTestId('canvas-surface'), { clientX: 600, clientY: 500, pointerId: 1 });
    const dragged = world.style.transform;
    fireEvent.focus(screen.getByRole('button', { name: /Dua/ }));
    expect(world.style.transform).not.toBe(dragged);
  });

  it('opens the panel on Enter and closes it on Escape', () => {
    render(<Canvas projects={projects} locale="id" />);
    fireEvent.click(screen.getByRole('button', { name: /Satu/ }));
    expect(screen.getByText('Konteks satu.')).toBeInTheDocument();
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByText('Konteks satu.')).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npx vitest run src/components/canvas/__tests__/Canvas.keyboard.test.jsx`
Expected: FAIL on the first test — the transform is unchanged, because focus does nothing yet.

- [ ] **Step 3: Add the focus handler to Node**

In `src/components/canvas/Node.jsx`, add `onFocus` to the props and to the button:

```jsx
export default function Node({ project, locale, detail, selected, onOpen, onFocus }) {
```

```jsx
      onClick={() => onOpen(project.slug)}
      onFocus={() => onFocus?.(project)}
```

- [ ] **Step 4: Centre the focused node in Canvas**

In `src/components/canvas/Canvas.jsx`, add this callback next to `fit`:

```jsx
  // Tabbing to a node that sits off-screen would look like nothing happened.
  const centreOn = useCallback((project) => {
    const box = surfaceRef.current?.getBoundingClientRect();
    if (!box) return;
    setEased(true);
    setViewport((v) => ({
      zoom: v.zoom,
      x: box.width / 2 - project.position.x * v.zoom,
      y: box.height / 2 - project.position.y * v.zoom,
    }));
    setTimeout(() => setEased(false), 950);
  }, []);
```

and pass it down:

```jsx
            <Node
              key={p.slug}
              project={p}
              locale={locale}
              detail={detail}
              selected={p.slug === openSlug}
              onOpen={open}
              onFocus={centreOn}
            />
```

- [ ] **Step 5: Run the test and watch it pass**

Run: `npx vitest run src/components/canvas/__tests__/Canvas.keyboard.test.jsx`
Expected: PASS, 2 tests.

- [ ] **Step 6: Commit**

```bash
git add src/components/canvas/Canvas.jsx src/components/canvas/Node.jsx src/components/canvas/__tests__/Canvas.keyboard.test.jsx
git commit -m "feat(canvas): bring focused nodes into view for keyboard users"
```

---

## Task 14: Metadata, OG image and docs

**Files:**
- Modify: `src/app/layout.js`, `src/app/opengraph-image.jsx`
- Rewrite: `docs/PROGRESS.md`
- Modify: `README.md`

- [ ] **Step 1: Update the root metadata**

In `src/app/layout.js`, set the exported `metadata` to match the new concept:

```js
export const metadata = {
  title: 'Utsman — Fullstack Developer',
  description:
    'Peta project: sistem rumah sakit dan pemerintahan di Kalimantan Selatan. Pendaftaran OCR, bridging BPJS, rekam medis elektronik.',
  openGraph: {
    title: 'Utsman — Fullstack Developer',
    description: 'Peta project: sistem rumah sakit dan pemerintahan di Kalimantan Selatan.',
    type: 'website',
  },
};
```

- [ ] **Step 2: Repaint the OG image**

In `src/app/opengraph-image.jsx`, replace the cream background with the canvas ground so the share card matches the landing layer: background `#161A1D`, text `#E8E0D0`, one amber `#C97B3F` rule. Keep the existing size and font setup untouched.

- [ ] **Step 3: Rewrite the progress memory**

Replace `docs/PROGRESS.md` with a short record of the new structure: the two layers, the routes, where project data lives, which files were deleted, and the outstanding assets from spec §14. Delete the phase table from the old redesign — it describes a portfolio that no longer exists.

- [ ] **Step 4: Update the README**

In `README.md`, replace the section list with the two-layer description and note that `/` is the canvas, `/kerja/[slug]` the reading pages.

- [ ] **Step 5: Full verification**

Run: `npm test`
Expected: PASS, all suites.

Run: `npm run build`
Expected: success.

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/app/layout.js src/app/opengraph-image.jsx docs/PROGRESS.md README.md
git commit -m "docs: update metadata, OG image and project memory for the canvas concept"
```

---

## Task 15: Look at it

Automated tests say the code runs. They say nothing about whether the canvas is worth having — and the spec names that risk openly: nine nodes can feel trivial.

**Files:** none

- [ ] **Step 1: Run the dev server**

Run: `npm run dev`
Open `http://localhost:3000`.

- [ ] **Step 2: Walk the checks**

- Drag: does the surface track the pointer exactly, with no lag or rubber-banding?
- Zoom: does the point under the cursor stay put?
- Detail: do year and stack appear as you zoom in, and vanish as you zoom out?
- "Tampilkan semua": does every node land inside the frame?
- Panel: does it fade in over ~700ms, not snap?
- Keyboard: Tab through every node — does each come into view, does Enter open, does Escape close?
- Narrow the window under 768px: does the list appear, and is it calm rather than crippled?
- Open `/kerja/rsu-nirwana-web` directly: is it readable as a plain page with no canvas knowledge?
- Disable JavaScript and reload that page: is the text still there?

- [ ] **Step 3: Ask the user the honest question**

Show them the canvas and ask: does this feel like a map worth exploring, or like nine circles? If it is nine circles, say so plainly and propose the retreat named in spec §7 — keep the reading pages, replace the canvas with the grouped list at every width. The pages carry the portfolio either way, so the retreat costs one component, not the project.

- [ ] **Step 4: Commit any fixes from this pass separately**

```bash
git add -A
git commit -m "fix(canvas): adjust spacing and framing after visual pass"
```

---

## Outstanding assets

These block "done", not progress. Implementation proceeds without them; the portfolio is not finished until they land.

- Screenshots for HRIS Nirwana and PSB MTs Walisongo — until then, `ScreenshotBlock` shows its stated empty state.
- Verified live URLs and access status for SIGAP BPN, Aset KPHL and Sertifikasi Benih (currently `access: 'none'`).
- Redacted screenshots for the internal Nirwana systems, if any can be released.
