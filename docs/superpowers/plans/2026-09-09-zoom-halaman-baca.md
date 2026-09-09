# Zoom ke Halaman Baca — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Plate yang dibuka berubah bentuk jadi halaman bacanya, dan halaman itu berubah balik jadi plate waktu pengunjung kembali.

**Architecture:** Satu nama transisi, `sistem-aktif`, dibawa plate terpilih di satu sisi dan blok kepala `ProjectView` di sisi lain; browser yang memorf. Peta mengingat dirinya lewat URL — `/sistem?pilih=<slug>&sudut=<derajat>` — ditulis sekali di pintu, bukan tiap klik roda. `slideTo` pindah nama jadi `moveTo` dan tumbuh satu arah, `zoom`.

**Tech Stack:** Next.js App Router, React 19 (canary lewat `experimental.viewTransition`), Tailwind v4, Vitest + happy-dom + Testing Library.

**Spec:** `docs/superpowers/specs/2026-09-09-zoom-halaman-baca-design.md`

**Aturan kerja:** TDD — test dulu, jalankan, lihat gagal, baru implementasi. Commit tiap task. Verifikasi di browser sungguhan, bukan cuma test.

**Dev server:** milik Utsman di port 3000. Jangan menjalankan server sendiri. Server perlu berhenti **satu kali**, di Task 10 Step 4, untuk `npm run build` — build menulis ke `.next` yang dipegang dev server dan Windows mengunci berkas di dalamnya. Task 1–9 seluruhnya lewat HMR; Task 3 menyentuh `globals.css` tapi cuma menambah aturan, bukan token `@theme` baru.

**Titik awal:** 197 test hijau, 27 berkas, `npx eslint src --max-warnings=0` bersih.

---

## Struktur berkas

| Berkas | Status | Tanggung jawab |
|---|---|---|
| `src/lib/nav/moveTo.js` | pindah nama dari `slideTo.js` | Satu-satunya tempat yang tahu tentang View Transitions API |
| `src/lib/nav/__tests__/moveTo.test.js` | pindah nama | |
| `src/app/globals.css` | diubah | Dua keyframes pudar, aturan pasangan bernama, tambalan reduced-motion |
| `src/components/work/ProjectView.jsx` | diubah | Blok kepala bernama, `data-nav` saat mount, `slug` ke `PaperHeader` |
| `src/components/work/WorkFooterNav.jsx` | diubah | Membersihkan `data-nav` |
| `src/components/work/PaperHeader.jsx` | diubah | Prop `slug` opsional, tautan membawa `?pilih=` |
| `src/components/shell/MapScene.jsx` | diubah | Menulis `camera.rotZ` ke ref titipan; sudut awal dari prop |
| `src/components/shell/Shell.jsx` | diubah | `angleRef`, `openSystem`, prop `picked` dan `angle` |
| `src/components/shell/SelectedPanel.jsx` | diubah | Membawa `sistem-aktif`; prop `onOpen`, klik kiri dicegat |
| `src/app/sistem/page.jsx` | diubah | Membaca `?pilih=` dan `?sudut=` |
| `src/app/page.jsx`, `src/components/shell/TopBar.jsx` | diubah | Ikut nama baru `moveTo` |

---

## Task 1: Buktikan nama transisi tidak merusak tumpukan 3D

Spec §5. `view-transition-name` menjadikan elemen sebagai elemen tertangkap dan memaksa konteks penumpukan sendiri. Kalau itu meratakan pohon `preserve-3d`, bentuk Task 4 dan seluruh cerita "plate jadi halaman" berubah. Diukur lebih dulu, tanpa mengubah kode aplikasi.

**Files:**
- Modify: `docs/superpowers/specs/2026-09-09-zoom-halaman-baca-design.md` (§5, catatan hasil)

- [ ] **Step 1: Buka `/sistem` di panel browser pada 1280×800**

`resize_window` `{ width: 1280, height: 800 }`, lalu `navigate` ke `http://localhost:3000/sistem`.

- [ ] **Step 2: Ukur tumpukan sebelum dan sesudah nama dipasang**

Lapis plate terpisah di layar karena `translateZ`. Kalau konteks 3D diratakan, jarak antar-lapis jadi nol. Transisi dimatikan lebih dulu — panel ini tersembunyi dan transisi CSS tidak beranjak di sana.

```js
const plate = document.querySelector('[data-plate-label]').closest('button');
const layers = [...plate.querySelectorAll('[data-layer]')];
layers.forEach((l) => { l.style.transition = 'none'; });
void plate.offsetWidth;
const spread = () => {
  const a = layers[0].getBoundingClientRect().top;
  const b = layers[layers.length - 1].getBoundingClientRect().top;
  return +(a - b).toFixed(2);
};
const before = spread();

plate.style.viewTransitionName = 'sistem-aktif';
void plate.offsetWidth;
const after = spread();
const named = getComputedStyle(plate).viewTransitionName;

plate.style.viewTransitionName = '';
({ before, after, named, kept: Math.abs(before - after) < 0.5 });
```

- [ ] **Step 3: Baca hasilnya**

Lulus kalau `named === 'sistem-aktif'` **dan** `kept === true` — jarak antar-lapis bertahan, tumpukan tidak rata.

Gagal kalau `after` mendekati nol. Kalau gagal, **berhenti dan lapor**: jalan mundur pertama dipakai, nama pindah dari `Plate` ke blok judul `SelectedPanel`. Task 4 berganti sasaran, Task 1 sisanya tetap berlaku, dan spec §5 sudah menuliskan urutan jalan mundurnya.

- [ ] **Step 4: Tulis hasilnya ke spec**

Tambahkan di akhir §5, ganti `<hasil>` dengan angka sungguhan:

```markdown
**Terukur 2026-09-09, Chrome di panel, 1280×800, di `/sistem`.** Dengan
`view-transition-name: sistem-aktif` dipasang pada plate, `viewTransitionName`
terbaca `"<hasil>"` dan jarak layar antara lapis terbawah dan teratas berubah
dari `<hasil>px` jadi `<hasil>px`. Tumpukan 3D bertahan; jalan mundur ke
`SelectedPanel` tidak dipakai.
```

- [ ] **Step 5: Commit**

```bash
git add docs/superpowers/specs/2026-09-09-zoom-halaman-baca-design.md
git commit -m "docs: measure whether a transition name flattens the stack"
```

---

## Task 2: `slideTo` jadi `moveTo`, dan tahu arah `zoom`

**Files:**
- Rename: `src/lib/nav/slideTo.js` → `src/lib/nav/moveTo.js`
- Rename: `src/lib/nav/__tests__/slideTo.test.js` → `src/lib/nav/__tests__/moveTo.test.js`
- Modify: `src/app/page.jsx`, `src/components/shell/TopBar.jsx`

- [ ] **Step 1: Pindahkan berkasnya dengan git, supaya riwayatnya ikut**

```bash
git mv src/lib/nav/slideTo.js src/lib/nav/moveTo.js
git mv src/lib/nav/__tests__/slideTo.test.js src/lib/nav/__tests__/moveTo.test.js
```

- [ ] **Step 2: Ganti nama di dalam test, dan tambahkan test arah baru**

Di `src/lib/nav/__tests__/moveTo.test.js`, ganti tiap `slideTo` jadi `moveTo` — import, `describe`, dan tujuh pemanggilan. Lalu tambahkan di dalam `describe`:

```js
  it('knows the way into a reading page', () => {
    canAnimate();
    moveTo(router, '/kerja/rme', 'zoom');
    expect(document.documentElement.dataset.nav).toBe('zoom');
    expect(push).toHaveBeenCalledWith('/kerja/rme');
  });

  it('uses one value for both ways of the zoom', () => {
    // Arahnya sudah ditentukan oleh elemen mana yang membawa nama di tiap sisi,
    // jadi keluar tidak butuh nilai sendiri. 'unzoom' bukan arah yang dikenal.
    canAnimate();
    moveTo(router, '/sistem', 'unzoom');
    expect(document.documentElement.dataset.nav).toBeUndefined();
    expect(push).toHaveBeenCalledWith('/sistem');
  });
```

- [ ] **Step 3: Jalankan, pastikan gagal**

```bash
npx vitest run src/lib/nav/__tests__/moveTo.test.js
```

Diharapkan: FAIL — `Failed to resolve import "@/lib/nav/slideTo"` sampai Step 4 selesai, lalu `dataset.nav` `undefined` untuk `'zoom'`.

- [ ] **Step 4: Implementasi**

Di `src/lib/nav/moveTo.js`, ganti nama fungsi dan tambah arah. Kepala berkas juga diperbarui, karena ia tidak lagi cuma menggeser:

```js
// Everything this project knows about the View Transitions API lives here.
//
// The gate sits above the systems: going up is going back, going down is going
// in. A reading page sits inside a system rather than above or below it, so it
// gets its own direction — the plate and the page share a transition name, and
// the browser morphs one into the other.
//
// One value, not two. Which way the zoom runs is already decided by which
// element carries the name on each side, so coming back needs no direction of
// its own.
//
// This function does NOT call startViewTransition. Measured in Chrome 148:
// wrapping router.push in it by hand captures the OLD DOM twice, because React
// renders after the snapshot is taken. What drives the transition instead is the
// <ViewTransition> boundary in the root layout.

const DIRECTIONS = ['up', 'down', 'zoom'];

export function moveTo(router, href, direction) {
  const known = DIRECTIONS.includes(direction);

  if (known && typeof document.startViewTransition === 'function') {
    document.documentElement.dataset.nav = direction;
  }

  return router.push(href);
}
```

- [ ] **Step 5: Perbarui dua pemakainya**

`src/app/page.jsx`:

```js
import { moveTo } from '@/lib/nav/moveTo';
```

```jsx
        onEnter={(href) => moveTo(router, href, 'down')}
```

`src/components/shell/TopBar.jsx`:

```js
import { moveTo } from '@/lib/nav/moveTo';
```

```js
            moveTo(router, '/', 'up');
```

- [ ] **Step 6: Jalankan seluruh suite**

```bash
npx vitest run
```

Diharapkan: PASS. Kalau ada `Failed to resolve import "@/lib/nav/slideTo"`, satu pemakai belum diganti.

- [ ] **Step 7: Lint**

```bash
npx eslint src --max-warnings=0
```

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "refactor(nav): rename slideTo, since it no longer only slides"
```

---

## Task 3: CSS untuk morf

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Tambahkan dua keyframes pudar**

Setelah empat `@keyframes nav-*` yang sudah ada:

```css
@keyframes nav-fade-out {
  to { opacity: 0; }
}

@keyframes nav-fade-in {
  from { opacity: 0; }
}
```

- [ ] **Step 2: Pasang aturan akar untuk `zoom`**

Setelah pasangan aturan `html[data-nav="down"]` yang sudah ada:

```css
/* Waktu plate memorf jadi halamannya, akar tidak boleh ikut menggeser: 22vh
   yang mendorong seluruh halaman melawan blok yang sedang melebar. Jadi akar
   cuma memudar, dan morfnya yang membawa gerakan. */
html[data-nav="zoom"]::view-transition-old(root) {
  animation-name: nav-fade-out;
}

html[data-nav="zoom"]::view-transition-new(root) {
  animation-name: nav-fade-in;
}

/* Morf posisi dan ukuran itu bawaan browser; yang ditetapkan di sini cuma
   waktunya, memakai angka yang sudah jadi kontrak di proyek ini. */
::view-transition-group(sistem-aktif) {
  animation-duration: 700ms;
  animation-timing-function: var(--nav-ease);
}
```

- [ ] **Step 3: Tambal blok reduced-motion**

Di dalam `@media (prefers-reduced-motion: reduce)`, setelah aturan
`::view-transition-old(root), ::view-transition-new(root)` yang sudah ada:

```css
  /* Sama seperti aturan di atasnya, dan sama seperti transition-delay pada
     lapis plate: pseudo-element view-transition tidak dijangkau selektor `*`,
     dan yang BERNAMA juga tidak dijangkau aturan (root) di atas. Tanpa blok ini
     pengunjung yang meminta gerak dikurangi tetap kena morf 700ms penuh. */
  ::view-transition-group(sistem-aktif),
  ::view-transition-old(sistem-aktif),
  ::view-transition-new(sistem-aktif) {
    animation-duration: 0.01ms !important;
  }
```

- [ ] **Step 4: Jalankan suite dan lint**

```bash
npx vitest run
```

```bash
npx eslint src --max-warnings=0
```

Diharapkan: 197 hijau, lint bersih. Tidak ada test baru — CSS tidak diuji lewat happy-dom, ia diperiksa di browser di Step 5.

- [ ] **Step 5: Verifikasi aturannya benar-benar terkirim**

Menulis CSS tidak berarti ia sampai. Muat ulang `/sistem`, lalu:

```js
const found = [];
for (const sheet of document.styleSheets) {
  let rules; try { rules = sheet.cssRules; } catch { continue; }
  const walk = (list) => {
    for (const r of list) {
      if (r.cssText && r.cssText.includes('sistem-aktif')) found.push(r.cssText.slice(0, 220));
      if (r.cssText && r.cssText.includes('nav-fade')) found.push(r.cssText.slice(0, 220));
      if (r.cssRules) walk(r.cssRules);
    }
  };
  walk(rules);
}
({ count: found.length, found });
```

Diharapkan: `nav-fade-out` dan `nav-fade-in` ada sebagai keyframes; `::view-transition-group(sistem-aktif)` dengan `700ms` ada; dan satu aturan `sistem-aktif` lagi berada **di dalam** blok `prefers-reduced-motion` dengan `0.01ms`.

- [ ] **Step 6: Commit**

```bash
git add src/app/globals.css
git commit -m "feat(nav): give the morph its timing, and its reduced-motion escape"
```

---

## Task 4: Panel kanan membawa nama transisi

**Task 1 gagal**, jadi sasarannya berpindah: bukan `Plate`, melainkan blok judul
`SelectedPanel`. Plate meratakan tumpukan 3D-nya begitu diberi nama, dan itu
tidak bisa ditimpa. `SelectedPanel` datar, di aliran normal, dan di situ pula
tombol `BUKA HALAMAN` berdiri.

**Files:**
- Modify: `src/components/shell/SelectedPanel.jsx`
- Test: `src/components/shell/__tests__/SelectedPanel.test.jsx` (baru)

- [ ] **Step 1: Tulis test yang gagal**

Buat `src/components/shell/__tests__/SelectedPanel.test.jsx`:

```jsx
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import SelectedPanel from '@/components/shell/SelectedPanel';

const system = {
  slug: 'hris-nirwana', client: 'RSU Nirwana', year: '2026', access: 'internal',
  tier: 'full', tech: ['Laravel'],
  shortName: { id: 'HRIS', en: 'HRIS' },
  blurb: { id: 'Ringkas.', en: 'Short.' },
};

const named = (container) => [...container.querySelectorAll('*')]
  .filter((el) => el.style.viewTransitionName === 'sistem-aktif');

describe('SelectedPanel', () => {
  it('names its title block, so the reading page has something to grow from', () => {
    const { container } = render(
      <SelectedPanel system={system} locale="id" span="2024-2026" />,
    );
    expect(named(container)).toHaveLength(1);
    expect(named(container)[0].textContent).toContain('HRIS');
  });

  it('names nothing while it is still the record block', () => {
    // Two elements carrying one name make the browser cancel the transition
    // without an error, so the empty case is a guard, not a formality.
    const { container } = render(
      <SelectedPanel system={null} locale="id" span="2024-2026" />,
    );
    expect(named(container)).toHaveLength(0);
  });
});
```

- [ ] **Step 2: Jalankan, pastikan gagal**

```bash
npx vitest run src/components/shell/__tests__/SelectedPanel.test.jsx
```

Diharapkan: FAIL — `expected [] to have a length of 1`.

- [ ] **Step 3: Implementasi**

Di `src/components/shell/SelectedPanel.jsx`, bungkus tiga elemen judul yang sudah
ada — `TERPILIH`, `<h2>`, dan baris `klien · tahun` — dengan satu `<div>`
bernama. `AccessBadge` dan seterusnya tetap di luarnya. Karena ketiganya kini di
dalam satu `<div>`, jarak antar-barisnya tidak lagi diatur `gap-3` induknya, jadi
blok itu membawa `flex flex-col gap-3` sendiri:

```jsx
        {/* Satu blok, satu nama. Ini yang ditumbuhi jadi kepala halaman baca,
            dan yang menyusut balik waktu pengunjung kembali. Nama ini TIDAK
            boleh pindah ke Plate: view-transition-name meratakan tumpukan 3D
            plate dan itu tidak bisa ditimpa — terukur, lihat spec §5. */}
        <div className="flex flex-col gap-3" style={{ viewTransitionName: 'sistem-aktif' }}>
          <span className="font-mono text-[10px] tracking-[.12em] text-amber">
            {COPY.selected[locale]}
          </span>
          <h2 className="font-display text-[26px] font-extrabold tracking-[-.03em] text-ink-bright m-0">
            {system.shortName[locale]}
          </h2>
          <span className="font-mono text-[10.5px] text-muted">
            {system.client} · {system.year}
          </span>
        </div>
```

- [ ] **Step 4: Jalankan seluruh suite**

```bash
npx vitest run
```

Diharapkan: PASS, 199.

- [ ] **Step 5: Lint**

```bash
npx eslint src --max-warnings=0
```

- [ ] **Step 6: Verifikasi di browser**

Muat ulang `/sistem`, lalu buktikan tepat satu elemen membawanya — dan bahwa
tumpukan plate **tidak** ikut rata:

```js
const carriers = () => [...document.querySelectorAll('*')]
  .filter((el) => getComputedStyle(el).viewTransitionName === 'sistem-aktif');
const plate = document.querySelector('[data-plate-label]').closest('button');
const layers = [...plate.querySelectorAll('[data-layer]')];
const spread = () => +(layers[0].getBoundingClientRect().top
  - layers[layers.length - 1].getBoundingClientRect().top).toFixed(2);

const before = { named: carriers().length, spread: spread() };
plate.click();
await new Promise((r) => setTimeout(r, 600));
const after = carriers();
({ before, namedAfter: after.length, tag: after[0]?.tagName ?? null,
   text: after[0]?.textContent.slice(0, 30) ?? null, spreadAfter: spread() });
```

Diharapkan: `before.named: 0`, `namedAfter: 1`, teksnya memuat nama sistem, dan
`spreadAfter` tetap positif — plate masih bertumpuk.

- [ ] **Step 7: Commit**

```bash
git add src/components/shell/SelectedPanel.jsx src/components/shell/__tests__/SelectedPanel.test.jsx
git commit -m "feat(shell): name the panel that stands for the open system"
```

---

## Task 5: Halaman baca membawa nama yang sama, dan menyetel arah

**Files:**
- Modify: `src/components/work/ProjectView.jsx`
- Modify: `src/components/work/WorkFooterNav.jsx`
- Test: `src/components/work/__tests__/ProjectView.test.jsx`

- [ ] **Step 1: Tulis test yang gagal**

Tambahkan ke `describe('ProjectView', …)`:

```jsx
  it('gives its head block the name the plate is looking for', () => {
    const { container } = render(<ProjectView project={project} prev={null} next={null} />);
    const named = [...container.querySelectorAll('*')]
      .filter((el) => el.style.viewTransitionName === 'sistem-aktif');
    expect(named).toHaveLength(1);
    expect(named[0].textContent).toContain('RSU Nirwana');
    expect(named[0].textContent).toContain('Pendaftaran Berbasis OCR');
  });

  it('marks the way out as a zoom, so the browser back button gets it too', async () => {
    render(<ProjectView project={project} prev={null} next={null} />);
    await waitFor(() => {
      expect(document.documentElement.dataset.nav).toBe('zoom');
    });
  });

  it('lets a jump to the next system cut instead', async () => {
    const next = { slug: 'rme', shortName: { id: 'RME', en: 'RME' } };
    render(<ProjectView project={project} prev={null} next={next} />);
    await waitFor(() => expect(document.documentElement.dataset.nav).toBe('zoom'));
    fireEvent.click(screen.getByRole('link', { name: /RME/ }));
    expect(document.documentElement.dataset.nav).toBeUndefined();
  });
```

Tambahkan ke import Testing Library di berkas itu:

```js
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
```

Dan bersihkan `data-nav` antar test, supaya satu test tidak mewarisi keadaan test sebelumnya:

```js
beforeEach(() => {
  delete document.documentElement.dataset.nav;
});
```

dengan `beforeEach` ditambahkan ke import vitest.

- [ ] **Step 2: Jalankan, pastikan gagal**

```bash
npx vitest run src/components/work/__tests__/ProjectView.test.jsx
```

Diharapkan: FAIL — tidak ada elemen bernama, dan `dataset.nav` tetap `undefined`.

- [ ] **Step 3: Implementasi di `ProjectView`**

Tambahkan import `useEffect`:

```js
import { useEffect } from 'react';
```

Tambahkan efek di badan komponen, sebelum `return`:

```js
  // Tombol kembali browser tidak bisa dicegat handler klik, jadi arah disetel
  // sekali di sini: apa pun yang meninggalkan halaman ini — tautan maupun
  // tombol kembali — mendapat morfnya. Aman disetel saat mount justru karena
  // zoom satu nilai: ia tidak mengubah apa pun di tengah transisi masuk yang
  // masih berjalan.
  useEffect(() => {
    document.documentElement.dataset.nav = 'zoom';
  }, []);
```

Bungkus blok kepala — tiga elemen yang sudah ada, tanpa mengubah isinya:

```jsx
        {/* 1 — head. Satu blok, satu nama: ini yang ditumbuhi plate waktu
            dibuka, dan yang menyusut balik jadi plate waktu ditinggalkan. */}
        <div style={{ viewTransitionName: 'sistem-aktif' }}>
          <div className="font-mono text-[11px] uppercase tracking-wider text-muted">
            {project.client} · {project.year} · {project.role[locale]}
          </div>
          <h1 className="font-display text-[28px] sm:text-[44px] leading-[1.15] font-extrabold tracking-[-.035em] mt-3 mb-4">
            {project.title[locale]}
          </h1>
          <AccessBadge access={project.access} locale={locale} />
        </div>
```

- [ ] **Step 4: Implementasi di `WorkFooterNav`**

Dua sistem berbeda yang saling memorf menyiratkan hubungan yang tidak ada. Tambahkan handler yang sama ke kedua tautan:

```jsx
import Link from 'next/link';

const COPY = {
  prev: { id: 'Sebelumnya', en: 'Previous' },
  next: { id: 'Berikutnya', en: 'Next' },
};

// Halaman baca menyetel data-nav="zoom" waktu mount supaya tombol kembali ikut
// dapat morfnya. Lompat ke sistem lain bukan kembali, jadi arah itu dilepas
// dan navigasinya memotong seperti pintu lain.
const cut = () => { delete document.documentElement.dataset.nav; };

export default function WorkFooterNav({ prev, next, locale }) {
  return (
    <nav className="flex justify-between gap-6 border-t border-rule pt-8 mt-16">
      <div>
        {prev && (
          <Link href={`/kerja/${prev.slug}`} onClick={cut} className="group block">
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
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
          <Link href={`/kerja/${next.slug}`} onClick={cut} className="group block">
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
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

- [ ] **Step 5: Jalankan seluruh suite**

```bash
npx vitest run
```

Diharapkan: PASS, 202.

- [ ] **Step 6: Lint**

```bash
npx eslint src --max-warnings=0
```

- [ ] **Step 7: Verifikasi di browser**

Buka `http://localhost:3000/kerja/rsu-nirwana-web`, lalu:

```js
const named = [...document.querySelectorAll('*')]
  .filter((el) => getComputedStyle(el).viewTransitionName === 'sistem-aktif');
({
  count: named.length,
  text: named[0]?.textContent.slice(0, 60) ?? null,
  nav: document.documentElement.dataset.nav,
});
```

Diharapkan: `count: 1`, teksnya memuat klien dan judul, `nav: "zoom"`.

- [ ] **Step 8: Commit**

```bash
git add src/components/work/ProjectView.jsx src/components/work/WorkFooterNav.jsx src/components/work/__tests__/ProjectView.test.jsx
git commit -m "feat(work): let the page know it is a system opened up"
```

---

## Task 6: Jalan kembali membawa plate yang mana

**Files:**
- Modify: `src/components/work/PaperHeader.jsx`
- Modify: `src/components/work/ProjectView.jsx`
- Test: `src/components/work/__tests__/PaperHeader.test.jsx` (baru)

- [ ] **Step 1: Tulis test yang gagal**

Buat `src/components/work/__tests__/PaperHeader.test.jsx`:

```jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PaperHeader from '@/components/work/PaperHeader';

describe('PaperHeader', () => {
  it('carries the system back to the map, so there is something to morph into', () => {
    render(<PaperHeader locale="id" slug="rme" />);
    expect(screen.getByRole('link', { name: /SEMUA SISTEM/ }))
      .toHaveAttribute('href', '/sistem?pilih=rme');
  });

  it('still points at the plain map when it stands on a page with no system', () => {
    // The contact page uses this header too, and has no slug to carry.
    render(<PaperHeader locale="id" />);
    expect(screen.getByRole('link', { name: /SEMUA SISTEM/ }))
      .toHaveAttribute('href', '/sistem');
  });

  it('builds the query with URLSearchParams, so an odd slug cannot split it', () => {
    render(<PaperHeader locale="id" slug="a&b" />);
    expect(screen.getByRole('link', { name: /SEMUA SISTEM/ }))
      .toHaveAttribute('href', '/sistem?pilih=a%26b');
  });
});
```

- [ ] **Step 2: Jalankan, pastikan gagal**

```bash
npx vitest run src/components/work/__tests__/PaperHeader.test.jsx
```

Diharapkan: FAIL — `href` masih `/sistem` untuk kasus pertama.

- [ ] **Step 3: Implementasi**

Di `src/components/work/PaperHeader.jsx`, tambahkan prop dan hitung tujuannya:

```jsx
export default function PaperHeader({ locale, slug }) {
  // Halaman baca tahu slug-nya sendiri, jadi tautan ini bisa mengembalikan
  // pengunjung ke peta dengan plate itu terpilih — dan plate terpilih itulah
  // yang membawa nama transisinya. Tanpa slug (halaman kontak) tautannya polos.
  //
  // Sudut kamera TIDAK ikut: halaman baca tidak tahu sudut yang ditinggalkan,
  // dan menaruhnya di URL /kerja/* akan mengotori halaman yang punya canonical
  // dan metadata sendiri. Tombol kembali browser yang memulihkan keduanya.
  const href = slug ? `/sistem?${new URLSearchParams({ pilih: slug })}` : '/sistem';

  return (
    <header className="flex items-center justify-between py-6">
      <Link
        href={href}
        className="font-mono text-[11px] text-muted hover:text-amber transition-colors duration-500"
      >
        {BACK[locale]}
      </Link>
      <LangSwitcher />
    </header>
  );
}
```

- [ ] **Step 4: Berikan slug-nya dari `ProjectView`**

```jsx
      <PaperHeader locale={locale} slug={project.slug} />
```

`ContactView` tidak disentuh — ia memanggil `<PaperHeader locale={locale} />` dan tetap mendapat `/sistem`.

- [ ] **Step 5: Jalankan seluruh suite**

```bash
npx vitest run
```

Diharapkan: PASS, 205.

- [ ] **Step 6: Lint**

```bash
npx eslint src --max-warnings=0
```

- [ ] **Step 7: Verifikasi di browser**

Di `http://localhost:3000/kerja/rme`:

```js
const back = [...document.querySelectorAll('a')]
  .find((a) => a.textContent.includes('SEMUA SISTEM'));
({ href: back?.getAttribute('href') ?? null });
```

Diharapkan: `/sistem?pilih=rme`.

- [ ] **Step 8: Commit**

```bash
git add src/components/work/PaperHeader.jsx src/components/work/ProjectView.jsx src/components/work/__tests__/PaperHeader.test.jsx
git commit -m "feat(work): send the way back to the plate it came from"
```

---

## Task 7: Sudut kamera sampai ke pintu

Kamera hidup di `MapScene`; `Shell` memegang pintu. Ref, bukan state: `rotZ` sebagai state `Shell` akan merender ulang `LogRail`, panel kanan dan konsol tiap klik roda.

**Files:**
- Modify: `src/components/shell/MapScene.jsx`
- Modify: `src/components/shell/Shell.jsx`
- Test: `src/components/shell/__tests__/MapScene.test.jsx`

- [ ] **Step 1: Tulis test yang gagal**

Tambahkan ke `describe('MapScene', …)` di `src/components/shell/__tests__/MapScene.test.jsx`:

```jsx
  it('writes the angle it is holding into the ref it was handed', async () => {
    const angleRef = { current: null };
    renderScene({ angleRef });
    await waitFor(() => expect(angleRef.current).toBe(-40));
  });

  it('keeps that ref current as the camera turns', async () => {
    const angleRef = { current: null };
    renderScene({ angleRef });
    fireEvent.wheel(screen.getByTestId('map-pane'), { deltaY: 100, deltaX: 0 });
    await waitFor(() => expect(angleRef.current).toBeCloseTo(-28, 5));
  });

  it('opens on the angle it is given, not always on the default', () => {
    const angleRef = { current: null };
    renderScene({ angleRef, angle: -55 });
    expect(angleRef.current).toBe(-55);
  });
```

Tambahkan `waitFor` ke import Testing Library di berkas itu:

```js
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
```

- [ ] **Step 2: Jalankan, pastikan gagal**

```bash
npx vitest run src/components/shell/__tests__/MapScene.test.jsx
```

Diharapkan: FAIL — `angleRef.current` tetap `null`.

- [ ] **Step 3: Implementasi di `MapScene`**

Terima dua prop baru dan tuliskan sudutnya:

```jsx
export default function MapScene({ systems, locale, selected, dimmed, onSelect, angleRef, angle }) {
```

```js
  const camera = useMapCamera(angle ?? undefined);

  // Sudut dititipkan lewat ref, bukan dinaikkan jadi state Shell: pintu cuma
  // membacanya sekali saat ditekan, sementara state akan merender ulang rail,
  // panel dan konsol tiap klik roda.
  useEffect(() => {
    if (angleRef) angleRef.current = camera.rotZ;
  });
```

`useMapCamera(angle ?? undefined)`, bukan `useMapCamera(angle)`: nilai `undefined` yang dilewatkan membuat parameter bawaan `-40` berlaku, sementara `null` tidak.

- [ ] **Step 4: Sediakan ref-nya di `Shell`**

Tambahkan `useRef` ke import React di `Shell.jsx`, lalu di badan komponen:

```js
  // Dibaca pintu saat ditekan. Tidak pernah dibaca saat render, jadi ia tidak
  // perlu memicu satu pun.
  const angleRef = useRef(-40);
```

dan teruskan ke `MapScene`:

```jsx
          <MapScene
            systems={systems}
            locale={locale}
            selected={selected}
            dimmed={dimmed}
            onSelect={setSelected}
            angleRef={angleRef}
          />
```

- [ ] **Step 5: Jalankan seluruh suite**

```bash
npx vitest run
```

Diharapkan: PASS, 208.

- [ ] **Step 6: Lint**

```bash
npx eslint src --max-warnings=0
```

Diharapkan bersih. Efek tanpa dependensi yang cuma menulis ref tidak melanggar aturan `setState` di efek — ia tidak menyetel state apa pun.

- [ ] **Step 7: Commit**

```bash
git add src/components/shell/MapScene.jsx src/components/shell/Shell.jsx src/components/shell/__tests__/MapScene.test.jsx
git commit -m "feat(shell): let the door read the angle without watching it"
```

---

## Task 8: Pintu menulis titik pulang

**Files:**
- Modify: `src/components/shell/Shell.jsx`
- Modify: `src/components/shell/SelectedPanel.jsx`
- Test: `src/components/shell/__tests__/Shell.test.jsx`
- Test: `src/components/shell/__tests__/SelectedPanel.test.jsx` (baru)

- [ ] **Step 1: Tulis test `Shell` yang gagal**

Berkas itu sudah mem-mock `next/navigation`, tapi `push`-nya dibuat baru tiap
panggilan (`push: vi.fn()`) jadi tidak bisa diperiksa. Naikkan ia jadi hoisted,
seperti `replace`:

```js
const replace = vi.hoisted(() => vi.fn());
const push = vi.hoisted(() => vi.fn());
vi.mock('next/navigation', () => ({ useRouter: () => ({ push, replace }) }));

beforeEach(() => {
  replace.mockClear();
  push.mockClear();
});
```

Pemilihan di berkas ini dijalankan lewat `railRow`, bukan lewat plate — nama
sistem muncul juga di tabel datar, dan itu sebabnya query-nya dilingkupi ke
daftar rail. Tambahkan ke `describe('Shell', …)`:

```jsx
  it('leaves a way home in the URL before it opens a reading page', () => {
    renderShell();
    fireEvent.click(railRow(/HRIS/));
    fireEvent.click(screen.getByRole('link', { name: /BUKA HALAMAN/ }));

    expect(replace).toHaveBeenCalledWith(
      '/sistem?pilih=hris-nirwana&sudut=-40',
      { scroll: false },
    );
    expect(push).toHaveBeenCalledWith('/kerja/hris-nirwana');
  });

  it('writes that way home before it navigates, not after', () => {
    const order = [];
    replace.mockImplementation(() => order.push('replace'));
    push.mockImplementation(() => order.push('push'));
    renderShell();
    fireEvent.click(railRow(/HRIS/));
    fireEvent.click(screen.getByRole('link', { name: /BUKA HALAMAN/ }));
    replace.mockReset();
    push.mockReset();
    expect(order).toEqual(['replace', 'push']);
  });

  it('remembers the flat table in that way home', () => {
    renderShell({ view: 'list' });
    fireEvent.click(railRow(/HRIS/));
    fireEvent.click(screen.getByRole('link', { name: /BUKA HALAMAN/ }));
    expect(replace).toHaveBeenCalledWith(
      expect.stringContaining('tampilan=datar'),
      { scroll: false },
    );
  });

  it('takes the console through the same door', () => {
    renderShell();
    const input = screen.getByLabelText(/konsol/i);
    fireEvent.change(input, { target: { value: 'open hris' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(replace).toHaveBeenCalledWith(
      expect.stringContaining('pilih=hris-nirwana'),
      { scroll: false },
    );
    expect(push).toHaveBeenCalledWith('/kerja/hris-nirwana');
  });
```

Sudut `-40` di test pertama adalah nilai awal `angleRef`: `MapScene` menuliskan
sudut kameranya lewat efek, dan di view peta yang belum disentuh nilainya masih
bawaan.

- [ ] **Step 2: Tulis test `SelectedPanel` yang gagal**

Berkas `src/components/shell/__tests__/SelectedPanel.test.jsx` sudah dibuat Task 4.
Tambahkan `vi`, `screen` dan `fireEvent` ke importnya, satu pembantu render, lalu
tiga test baru ke dalam `describe` yang sudah ada:

```jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

const renderPanel = (props = {}) =>
  render(
    <SelectedPanel system={system} locale="id" span="2024-2026" onOpen={vi.fn()} {...props} />,
  );
```

```jsx
  it('takes a plain click through the door instead of the link', () => {
    const onOpen = vi.fn();
    renderPanel({ onOpen });
    const link = screen.getByRole('link', { name: /BUKA HALAMAN/ });
    const event = fireEvent.click(link, { button: 0 });
    expect(onOpen).toHaveBeenCalledWith('hris-nirwana');
    // false berarti preventDefault dipanggil: tautannya tidak menavigasi sendiri.
    expect(event).toBe(false);
  });

  it('leaves a ctrl-click alone, so a new tab still works', () => {
    const onOpen = vi.fn();
    renderPanel({ onOpen });
    const event = fireEvent.click(
      screen.getByRole('link', { name: /BUKA HALAMAN/ }),
      { button: 0, ctrlKey: true },
    );
    expect(onOpen).not.toHaveBeenCalled();
    expect(event).toBe(true);
  });

  it('keeps a real href, so the link can be copied and opened directly', () => {
    renderPanel();
    expect(screen.getByRole('link', { name: /BUKA HALAMAN/ }))
      .toHaveAttribute('href', '/kerja/hris-nirwana');
  });
```

- [ ] **Step 3: Jalankan keduanya, pastikan gagal**

```bash
npx vitest run src/components/shell/__tests__/Shell.test.jsx src/components/shell/__tests__/SelectedPanel.test.jsx
```

Diharapkan: FAIL — `replace` tidak pernah terpanggil, dan `onOpen` tidak dikenal `SelectedPanel`.

- [ ] **Step 4: Implementasi pintu di `Shell`**

Tambahkan import:

```js
import { moveTo } from '@/lib/nav/moveTo';
```

Tambahkan fungsi pintu, di bawah `changeView`:

```js
  // Satu pintu, dua pemanggil: tautan di panel kanan dan `open` di konsol.
  // replace() menimpa entri riwayat yang sedang berdiri, push() menambah yang
  // baru — jadi tombol kembali browser mendarat tepat di URL berparameter ini,
  // dan peta pulih dengan plate serta sudut yang ditinggalkan. Tidak ada
  // penyimpanan; URL yang mengingat.
  const openSystem = (slug) => {
    const params = new URLSearchParams({
      pilih: slug,
      sudut: String(Math.round(angleRef.current)),
    });
    if (view === 'list') params.set('tampilan', 'datar');
    router.replace(`/sistem?${params}`, { scroll: false });
    moveTo(router, `/kerja/${slug}`, 'zoom');
  };
```

Ganti `router.push` di cabang `open` pada `run`:

```js
      router.push(`/kerja/${found.slug}`);
```

jadi:

```js
      openSystem(found.slug);
```

Dan teruskan ke panel:

```jsx
        <SelectedPanel system={current} locale={locale} span={span} onOpen={openSystem} />
```

- [ ] **Step 5: Implementasi di `SelectedPanel`**

Terima prop dan cegat klik kiri polos:

```jsx
export default function SelectedPanel({ system, locale, span, onOpen }) {
```

```jsx
          <Link
            href={`/kerja/${system.slug}`}
            onClick={(e) => {
              // Klik tengah, ctrl-klik dan "buka di tab baru" harus tetap
              // bekerja, jadi yang dicegat hanya klik kiri polos.
              if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
              e.preventDefault();
              onOpen(system.slug);
            }}
            className="block text-center font-mono text-[11px] border border-amber text-amber py-2"
          >
            {COPY.open[locale]}
          </Link>
```

- [ ] **Step 6: Jalankan seluruh suite**

```bash
npx vitest run
```

Diharapkan: PASS, 215.

- [ ] **Step 7: Lint**

```bash
npx eslint src --max-warnings=0
```

- [ ] **Step 8: Verifikasi di browser**

Muat ulang `/sistem`. Ini membuktikan titik pulang benar-benar tertulis di riwayat:

```js
const plate = document.querySelector('[data-plate-label]').closest('button');
plate.click();
await new Promise((r) => setTimeout(r, 400));
const pane = document.querySelector('[data-testid="map-pane"]');
pane.dispatchEvent(new WheelEvent('wheel', { deltaY: 100, deltaX: 0, bubbles: true }));
await new Promise((r) => setTimeout(r, 400));

const open = [...document.querySelectorAll('a')]
  .find((a) => a.textContent.includes('BUKA HALAMAN'));
open.click();
await new Promise((r) => setTimeout(r, 1500));
const arrived = location.pathname;
const nav = document.documentElement.dataset.nav;

history.back();
await new Promise((r) => setTimeout(r, 1500));
({ arrived, nav, cameHomeTo: location.pathname + location.search });
```

Diharapkan: `arrived` `/kerja/<slug>`, `nav: "zoom"`, dan `cameHomeTo` berupa `/sistem?pilih=<slug>&sudut=-28`.

- [ ] **Step 9: Commit**

```bash
git add src/components/shell/Shell.jsx src/components/shell/SelectedPanel.jsx src/components/shell/__tests__/Shell.test.jsx src/components/shell/__tests__/SelectedPanel.test.jsx
git commit -m "feat(shell): leave a way home in the URL before opening a page"
```

---

## Task 9: Peta membaca titik pulang itu

**Files:**
- Modify: `src/app/sistem/page.jsx`
- Modify: `src/components/shell/Shell.jsx`
- Modify: `src/components/shell/MapScene.jsx`
- Test: `src/app/sistem/__tests__/page.test.jsx`

- [ ] **Step 1: Tulis test yang gagal**

Tambahkan ke `describe('/sistem', …)` di `src/app/sistem/__tests__/page.test.jsx`:

```jsx
  it('opens with the plate the URL names already selected', () => {
    params.value = new URLSearchParams('pilih=hris-nirwana');
    render(<Sistem />, { wrapper: LocaleProvider });
    expect(screen.getByRole('button', { name: /HRIS/ }))
      .toHaveAttribute('aria-pressed', 'true');
  });

  it('opens the camera on the angle the URL names', () => {
    params.value = new URLSearchParams('sudut=-55');
    const { container } = render(<Sistem />, { wrapper: LocaleProvider });
    expect(container.querySelector('[role="group"]').getAttribute('style'))
      .toContain('rotateZ(-55deg)');
  });

  it('ignores an angle that is not a number', () => {
    params.value = new URLSearchParams('sudut=abc');
    const { container } = render(<Sistem />, { wrapper: LocaleProvider });
    expect(container.querySelector('[role="group"]').getAttribute('style'))
      .toContain('rotateZ(-40deg)');
  });

  it('ignores a slug that names no system', () => {
    params.value = new URLSearchParams('pilih=tidak-ada');
    render(<Sistem />, { wrapper: LocaleProvider });
    const pressed = screen.getAllByRole('button')
      .filter((b) => b.getAttribute('aria-pressed') === 'true');
    expect(pressed).toHaveLength(0);
  });
```

- [ ] **Step 2: Jalankan, pastikan gagal**

```bash
npx vitest run src/app/sistem/__tests__/page.test.jsx
```

Diharapkan: FAIL — tidak ada plate yang `aria-pressed="true"`, dan sudutnya selalu `-40`.

- [ ] **Step 3: Implementasi di `sistem/page.jsx`**

Di `SistemInner`, setelah `view`:

```js
  // Titik pulang yang ditulis pintu waktu halaman baca dibuka. Dibaca sekali
  // saat mount; sesudah itu view dan pilihan adalah state lokal, seperti
  // biasa — URL mengikuti, bukan memimpin.
  const picked = params.get('pilih');
  const rawAngle = Number(params.get('sudut'));
  const angle = Number.isFinite(rawAngle) && params.get('sudut') !== null ? rawAngle : null;
```

`Number('')` bernilai `0`, jadi keberadaan parameternya diperiksa terpisah — tanpa itu `?sudut=` kosong akan membuka peta lurus menghadap depan.

Lalu:

```jsx
  return (
    <Shell
      systems={projects}
      locale={locale}
      view={view}
      calm={calm}
      seed={seed}
      picked={picked}
      angle={angle}
    />
  );
```

- [ ] **Step 4: Implementasi di `Shell`**

Terima keduanya, dan pakai `picked` sebagai pilihan awal:

```js
export default function Shell({ systems, locale, view: initialView, seed = '', calm = false, picked = null, angle = null }) {
```

```js
  // Slug dari URL hanya dipercaya kalau ia benar-benar menamai sebuah sistem;
  // tautan yang dibagikan bisa membawa apa saja.
  const [selected, setSelected] = useState(
    () => (systems.some((s) => s.slug === picked) ? picked : null),
  );
```

```js
  const angleRef = useRef(angle ?? -40);
```

dan teruskan sudutnya:

```jsx
            onSelect={setSelected}
            angleRef={angleRef}
            angle={angle}
```

- [ ] **Step 5: Jalankan seluruh suite**

```bash
npx vitest run
```

Diharapkan: PASS, 219.

- [ ] **Step 6: Lint**

```bash
npx eslint src --max-warnings=0
```

- [ ] **Step 7: Verifikasi di browser**

Buka `http://localhost:3000/sistem?pilih=rme&sudut=-55` langsung:

```js
const pressed = [...document.querySelectorAll('[aria-pressed="true"]')];
({
  url: location.search,
  pressedCount: pressed.length,
  pressedText: pressed[0]?.textContent.slice(0, 40) ?? null,
  angle: document.querySelector('[role="group"]').style.transform,
  named: [...document.querySelectorAll('*')]
    .filter((el) => getComputedStyle(el).viewTransitionName === 'sistem-aktif').length,
});
```

Diharapkan: `pressedCount: 1` dan teksnya RME, `angle` memuat `rotateZ(-55deg)`, `named: 1`.

- [ ] **Step 8: Commit**

```bash
git add src/app/sistem/page.jsx src/components/shell/Shell.jsx src/components/shell/MapScene.jsx src/app/sistem/__tests__/page.test.jsx
git commit -m "feat(shell): let the map find itself again from the URL"
```

---

## Task 10: Verifikasi menyeluruh dan perbarui `docs/PROGRESS.md`

Urutannya penting. `npm run build` menulis ke `.next` yang dipegang dev server, dan Windows mengunci berkas di dalamnya selama server hidup. Jadi semua yang butuh server hidup dikerjakan lebih dulu.

**Files:**
- Modify: `docs/PROGRESS.md`

- [ ] **Step 1: Suite penuh dan lint**

```bash
npx vitest run
```

```bash
npx eslint src --max-warnings=0
```

- [ ] **Step 2: Halaman baca dan peta masih utuh tanpa JavaScript**

```bash
curl -s http://localhost:3000/sistem | grep -o 'kerja/[a-z-]*' | sort -u
```

Diharapkan: lima slug. Zoom tidak boleh mengubah apa pun di jalur ini.

- [ ] **Step 3: Lewat sekali di browser pada 1280×800**

Muat ulang `/sistem`, lalu satu skrip yang membaca semuanya:

```js
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const carriers = () => [...document.querySelectorAll('*')]
  .filter((el) => getComputedStyle(el).viewTransitionName === 'sistem-aktif');

const pane = document.querySelector('[data-testid="map-pane"]');
const plate = document.querySelector('[data-plate-label]').closest('button');
const namedBefore = carriers().length;
plate.click();
await wait(500);
const namedAfterPick = carriers().length;

pane.dispatchEvent(new WheelEvent('wheel', { deltaY: 100, deltaX: 0, bubbles: true }));
await wait(500);

[...document.querySelectorAll('a')].find((a) => a.textContent.includes('BUKA HALAMAN')).click();
await wait(2000);
const onPage = { path: location.pathname, nav: document.documentElement.dataset.nav, named: carriers().length };

history.back();
await wait(2000);
const home = {
  search: location.search,
  pressed: document.querySelectorAll('[aria-pressed="true"]').length,
  angle: document.querySelector('[role="group"]')?.style.transform ?? null,
  named: carriers().length,
};
({ namedBefore, namedAfterPick, onPage, home });
```

Diharapkan: `namedBefore: 0`, `namedAfterPick: 1`, `onPage.path` `/kerja/<slug>` dengan `nav: "zoom"` dan `named: 1`, `home.search` berupa `?pilih=<slug>&sudut=-28`, `home.pressed: 1`, `home.angle` memuat `rotateZ(-28deg)`, `home.named: 1`.

**Tepat satu pembawa nama di tiap sisi, tidak pernah dua** — itu yang paling penting di skrip ini.

- [ ] **Step 4: Hentikan server, build, jalankan lagi**

Minta Utsman:

> Semua yang butuh server hidup sudah selesai. `Ctrl+C` di terminal dev server, lalu:
> ```powershell
> npm run build
> ```
> lalu `npm run dev` lagi.

Kalau gagal dengan `EPERM` atau `EBUSY` di sekitar `.next`, servernya belum benar-benar mati; pastikan prosesnya berhenti, `Remove-Item -Recurse -Force .next`, dan build lagi.

Diharapkan: build sukses, `/sistem` tetap `○ (Static)` walau membaca dua parameter baru. Kalau ia berubah jadi `ƒ (Dynamic)`, berhenti dan lapor sebelum menulis PROGRESS.

- [ ] **Step 5: Serahkan rasanya ke Utsman**

Yang tidak bisa diputuskan dari panel — panel `document.hidden`, dan tiap View Transition di sana berakhir `InvalidStateError`:

- apakah morfnya terlihat benar, atau plate malah melompat sebelum melebar
- `700ms` pada `::view-transition-group(sistem-aktif)` di `globals.css`
- apakah kembali lewat `← SEMUA SISTEM` — yang memulihkan plate tapi bukan sudut — terasa janggal dibanding tombol kembali browser

Sebutkan ketiganya, dan tunggu jawabannya sebelum menulis PROGRESS.

- [ ] **Step 6: Perbarui `docs/PROGRESS.md`**

Yang harus berubah:

- **Posisi sekarang** — tambahkan `2026-09-09-zoom-halaman-baca.md` selesai, Task 1–10.
- **Bentuk sekarang** — tabel URL bertambah: `/sistem?pilih=<slug>&sudut=<derajat>` sebagai titik pulang. Kalimat "Pintu lain — halaman baca, kontak — memotong seperti biasa, menunggu kerja zoom peta" **tidak berlaku lagi**; halaman baca sekarang memorf.
- **Di mana isinya** — `slideTo.js` jadi `moveTo.js`; tambahkan spec dan rencana zoom.
- **Keputusan yang mahal** — tambahkan: satu nama transisi, tepat satu pembawa, dan kenapa dua pembawa membatalkan transisi diam-diam; URL ditulis sekali di pintu, bukan tiap klik roda; sudut lewat ref supaya rail dan panel tidak ikut render; `← SEMUA SISTEM` memulihkan plate tapi tidak sudut, dan alasannya; `zoom` satu nilai untuk dua arah; halaman baca menyetel `data-nav` saat mount supaya tombol kembali ikut terlayani.
- **Larangan** — pseudo-element view-transition **bernama** juga tidak dijangkau aturan `(root)` di blok reduced-motion; keduanya harus ditulis.
- **Pelajaran** — apa pun yang ternyata mahal selama Task 1–9, terutama hasil pengukuran nama transisi di dalam pohon 3D pada Task 1.
- **Antrean berikutnya** — nomor 1 selesai seluruhnya. Nomor berikutnya naik jadi nomor 1: teks legenda dan catatan rail.
- **Jumlah test** — angka sungguhan dari Step 1, bukan perkiraan 219 di rencana ini.

- [ ] **Step 7: Commit**

```bash
git add docs/PROGRESS.md
git commit -m "docs: record the plate that becomes its page"
```

---

## Catatan urutan

- **Task 1 sudah dijalankan dan gagal.** Nama pindah dari `Plate` ke `SelectedPanel`; Task 4 ditulis ulang dengan sasaran itu, dan `Plate.jsx` tidak disentuh sama sekali oleh rencana ini.
- **Task 2 sebelum Task 8**, karena pintu memanggil `moveTo` dengan arah `zoom`.
- **Task 3 sebelum apa pun yang diverifikasi di browser**, supaya aturan CSS-nya sudah ada waktu morf pertama dicoba. Ia tidak menambah test — CSS tidak diuji lewat happy-dom.
- **Task 4 dan 5 boleh ditukar.** Keduanya memasang nama di sisi yang berbeda dan masing-masing hijau sendiri; transisinya baru bermakna setelah keduanya ada.
- **Task 7 sebelum Task 8**, karena pintu membaca `angleRef.current`.
- **Task 8 menulis URL, Task 9 membacanya.** Ditulis lebih dulu dengan sengaja: sesudah Task 8 titik pulang sudah ada di riwayat dan bisa diperiksa lewat `location.search`, walau petanya belum memakainya.
