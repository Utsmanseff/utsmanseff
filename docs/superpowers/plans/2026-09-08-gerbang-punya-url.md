# Gerbang Punya URL — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Pindahkan gerbang ke URL-nya sendiri, supaya pengunjung yang sudah masuk ke peta atau daftar bisa kembali ke sana lewat tombol kembali browser, dan supaya cangkang bisa dibagikan sebagai tautan.

**Architecture:** `/` jadi gerbang (di desktop; HP tetap dokumen kertas). `/sistem` jadi cangkang, dengan `?tampilan=datar` untuk mendarat di tabel datar. Karena URL yang mengingat, `useGatePassed`, `sessionStorage`, wrapper `inert`, state `leaving` dan `setTimeout(700)` semuanya **dihapus** — perubahan ini membuang lebih banyak kode daripada yang ditambahkannya.

**Tech Stack:** Next.js App Router, React 19, Tailwind v4, Vitest + happy-dom + Testing Library.

**Dasar sebelum mulai:** 142 test hijau, 21 berkas.

**Lanjutan dari:** `docs/superpowers/specs/2026-09-08-gerbang-hero-design.md`

---

## Keputusan yang sudah diambil

| Pertanyaan | Jawaban |
|------------|---------|
| View di URL? | Ya, sebagai query. `/sistem` peta, `/sistem?tampilan=datar` daftar |
| Kenapa query, bukan `/peta` dan `/daftar`? | Route terpisah membuat tombol `ISO / DATAR` jadi navigasi sungguhan, `Shell` mount ulang, dan filter yang aktif serta seluruh rail log hilang tiap ganti view |
| `/` dan `/sistem` sama isinya di HP | Dibiarkan. `/sistem` memasang `canonical` ke `/` |
| Benih huruf menyeberang bagaimana? | Query `?ketik=f`, dibersihkan `router.replace` begitu mendarat |
| Default pengunjung reduced-motion | Gerbang mengirimnya ke `?tampilan=datar` |

## Yang hilang

```
src/lib/hooks/useGatePassed.js              dihapus
src/lib/hooks/__tests__/useGatePassed.test.jsx  dihapus
Shell: state `passed`, `leaving`, `enter`, setTimeout(700)
Shell: wrapper <div className="contents" inert={...}>
Gate: prop `leaving`, prop `onEnter`
```

Gerbang berhenti jadi lapisan dan jadi halaman. Tidak ada lagi yang bersembunyi di belakangnya, jadi tidak ada yang perlu di-`inert`.

## Yang tidak berubah

- **`/` tanpa JavaScript tetap utuh.** Server tetap merender `SystemsDocument` di
  `/`. Gerbang tetap menumpuk setelah mount, hanya di ≥1024px. `curl` harus tetap
  melihat delapan sistem dan lima tautan `/kerja/*`.
- **Tidak ada gerbang di HP.** `PaperHead` tetap seperti sekarang.
- **Kontrak gerak, larangan angka, dua amber.** Semua tetap.

---

### Task 1: Route `/sistem`

**Files:**
- Create: `src/app/sistem/page.jsx`
- Test: `src/app/sistem/__tests__/page.test.jsx`

- [ ] **Step 1: Tulis test yang gagal**

Buat `src/app/sistem/__tests__/page.test.jsx`:

```jsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Sistem from '@/app/sistem/page';
import { LocaleProvider } from '@/lib/hooks/useLocale';

const replace = vi.fn();
const params = { value: new URLSearchParams() };

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace }),
  useSearchParams: () => params.value,
}));

const eligible = vi.hoisted(() => ({ value: true }));
vi.mock('@/lib/hooks/useShellEligible', () => ({
  useShellEligible: () => eligible.value,
}));

beforeEach(() => {
  replace.mockClear();
  eligible.value = true;
  params.value = new URLSearchParams();
  window.matchMedia = vi.fn(() => ({
    matches: false,
    addEventListener: () => {},
    removeEventListener: () => {},
  }));
});

describe('/sistem', () => {
  it('opens on the map, with no gate in the way', () => {
    render(<Sistem />, { wrapper: LocaleProvider });
    expect(screen.getByTestId('map-pane')).toBeInTheDocument();
    expect(screen.queryByTestId('gate')).toBeNull();
  });

  it('opens on the flat table when the URL asks for it', () => {
    params.value = new URLSearchParams('tampilan=datar');
    render(<Sistem />, { wrapper: LocaleProvider });
    expect(screen.getByTestId('flat-table')).toBeInTheDocument();
  });

  it('seeds the console with the letter that was carried over', () => {
    params.value = new URLSearchParams('ketik=f');
    render(<Sistem />, { wrapper: LocaleProvider });
    expect(screen.getByLabelText('Konsol perintah')).toHaveValue('f');
  });

  it('wipes the carried letter out of the URL, so a reload does not repeat it', () => {
    params.value = new URLSearchParams('tampilan=datar&ketik=f');
    render(<Sistem />, { wrapper: LocaleProvider });
    expect(replace).toHaveBeenCalledWith('/sistem?tampilan=datar', { scroll: false });
  });

  it('gives a narrow visitor the paper document, not an empty shell', () => {
    eligible.value = false;
    render(<Sistem />, { wrapper: LocaleProvider });
    expect(document.querySelector('.paper-doc')).not.toBeNull();
  });
});
```

- [ ] **Step 2: Jalankan, pastikan gagal**

```bash
npx vitest run src/app/sistem
```

Expected: FAIL — `Failed to resolve import "@/app/sistem/page"`.

- [ ] **Step 3: Tulis route-nya**

Buat `src/app/sistem/page.jsx`. `useSearchParams` wajib dibungkus `Suspense` di
App Router; tanpa itu seluruh route dipaksa render dinamis.

```jsx
"use client";

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { projects } from '@/lib/data/projects';
import { useLocale } from '@/lib/hooks/useLocale';
import { useShellEligible } from '@/lib/hooks/useShellEligible';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import PaperFallback from '@/components/document/PaperFallback';
import Shell from '@/components/shell/Shell';

function SistemInner() {
  const { locale } = useLocale();
  const shell = useShellEligible();
  const calm = useMediaQuery('(prefers-reduced-motion: reduce)');
  const router = useRouter();
  const params = useSearchParams();

  const view = params.get('tampilan') === 'datar' ? 'list' : 'map';
  const [seed] = useState(() => params.get('ketik') ?? '');

  // The carried letter is spent the moment it is read. Left in the URL it would
  // be typed again on every reload, and it would travel in a shared link.
  useEffect(() => {
    if (!params.get('ketik')) return;
    const next = new URLSearchParams(params);
    next.delete('ketik');
    const query = next.toString();
    router.replace(query ? `/sistem?${query}` : '/sistem', { scroll: false });
  }, [params, router]);

  if (!shell) return <PaperFallback />;

  return <Shell systems={projects} locale={locale} view={view} calm={calm} seed={seed} />;
}

export default function Sistem() {
  return (
    <Suspense fallback={null}>
      <SistemInner />
    </Suspense>
  );
}
```

- [ ] **Step 4: Pisahkan dokumen kertas supaya dua route bisa memakainya**

`/` dan `/sistem` sama-sama merender dokumen di lebar sempit. Pindahkan blok itu
dari `src/app/page.jsx` ke `src/components/document/PaperFallback.jsx` — dokumen,
filter sheet dan bottom bar beserta state filternya — lalu pakai di keduanya.

- [ ] **Step 5: Jalankan, pastikan hijau**

```bash
npx vitest run src/app/sistem
```

Expected: PASS, 5 test.

- [ ] **Step 6: Commit**

```bash
git add src/app/sistem src/components/document/PaperFallback.jsx src/app/page.jsx
git commit -m "feat(sistem): give the shell a URL of its own

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 2: `Shell` menerima view dari luar, dan melepas gerbang

**Files:**
- Modify: `src/components/shell/Shell.jsx`
- Modify: `src/components/shell/__tests__/Shell.test.jsx`

- [ ] **Step 1: Ubah test lebih dulu**

Buang seluruh `describe('Shell · the gate')` dan `beforeEach` yang menulis
`sessionStorage`. Ganti `renderShell` jadi:

```jsx
const renderShell = (props = {}) =>
  render(<Shell systems={projects} locale="id" view="map" seed="" {...props} />, {
    wrapper: LocaleProvider,
  });
```

Tambahkan:

```jsx
describe('Shell · what the URL decides', () => {
  it('opens on the view it was handed', () => {
    renderShell({ view: 'list' });
    expect(screen.getByTestId('flat-table')).toBeInTheDocument();
  });

  it('starts the console with the letter it was handed', () => {
    renderShell({ seed: 'f' });
    expect(screen.getByLabelText('Konsol perintah')).toHaveValue('f');
  });

  it('leaves the console empty when there was no letter', () => {
    renderShell();
    expect(screen.getByLabelText('Konsol perintah')).toHaveValue('');
  });

  it('has no gate to render any more', () => {
    renderShell();
    expect(screen.queryByTestId('gate')).toBeNull();
  });
});
```

- [ ] **Step 2: Jalankan, pastikan gagal**

```bash
npx vitest run src/components/shell/__tests__/Shell.test.jsx
```

Expected: FAIL — `view` dan `seed` belum jadi prop.

- [ ] **Step 3: Sederhanakan `Shell`**

Buang: impor `Gate` dan `useGatePassed`, state `passed` / `leaving` / `focusToken`,
fungsi `enter`, wrapper `<div className="contents" inert={...}>` beserta
penutupnya, dan blok `{!passed && <Gate ... />}`.

Ganti tanda tangannya:

```jsx
export default function Shell({ systems, locale, view: initialView, seed = '', calm = false }) {
```

State awal:

```jsx
  const [view, setView] = useState(initialView ?? (calm ? 'list' : 'map'));
  const [cmd, setCmd] = useState(seed);
```

`Console` kehilangan prop `focusToken`; kembalikan `Console.jsx` ke bentuk
sebelumnya dengan menghapus prop itu dan efek fokusnya.

`className` elemen terluar kehilangan `relative` — tidak ada lagi yang
di-absolute-kan di atasnya.

- [ ] **Step 4: Jalankan, pastikan hijau**

```bash
npx vitest run src/components/shell
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/shell
git commit -m "refactor(shell): let the URL hold what sessionStorage was holding

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 3: `/` jadi gerbang, dan gerbang jadi navigasi

**Files:**
- Modify: `src/app/page.jsx`
- Modify: `src/app/__tests__/page.test.jsx`
- Modify: `src/components/shell/Gate.jsx`
- Modify: `src/components/shell/__tests__/Gate.test.jsx`

- [ ] **Step 1: Ubah test `Gate` lebih dulu**

`onEnter(view, seed)` diganti `onEnter(href)`. Yang berubah di
`Gate.test.jsx` — ganti tiap ekspektasi:

```jsx
  it('offers two doors, and each one names where it goes', () => {
    const { onEnter } = renderGate();
    fireEvent.click(screen.getByRole('button', { name: /PETA/ }));
    expect(onEnter).toHaveBeenCalledWith('/sistem');

    fireEvent.click(screen.getByRole('button', { name: /DAFTAR/ }));
    expect(onEnter).toHaveBeenCalledWith('/sistem?tampilan=datar');
  });
```

Dan di `describe('Gate · dismissal')`:

```jsx
  it('closes on Enter, using the default view', () => {
    const { onEnter } = renderGate();
    fireEvent.keyDown(window, { key: 'Enter' });
    expect(onEnter).toHaveBeenCalledWith('/sistem');
  });

  it('sends a reduced-motion visitor to the flat table by default', () => {
    const { onEnter } = renderGate({ calm: true });
    fireEvent.keyDown(window, { key: 'Enter' });
    expect(onEnter).toHaveBeenCalledWith('/sistem?tampilan=datar');
  });

  it('carries the letter it swallowed in the URL', () => {
    const { onEnter } = renderGate();
    fireEvent.keyDown(window, { key: 'f' });
    expect(onEnter).toHaveBeenCalledWith('/sistem?ketik=f');
  });

  it('escapes a letter that would break the query', () => {
    const { onEnter } = renderGate();
    fireEvent.keyDown(window, { key: '&' });
    expect(onEnter).toHaveBeenCalledWith('/sistem?ketik=%26');
  });
```

Buang test `fades out when it is told it is leaving` — tidak ada lagi `leaving`.

- [ ] **Step 2: Jalankan, pastikan gagal**

```bash
npx vitest run src/components/shell/__tests__/Gate.test.jsx
```

Expected: FAIL pada semua ekspektasi `onEnter`.

- [ ] **Step 3: Ubah `Gate`**

Buang prop `leaving` dan seluruh `style` fade-nya. Tambahkan pembangun tujuan:

```jsx
  const destination = (wantList, seed) => {
    const params = new URLSearchParams();
    if (wantList ?? calm) params.set('tampilan', 'datar');
    if (seed) params.set('ketik', seed);
    const query = params.toString();
    return query ? `/sistem?${query}` : '/sistem';
  };
```

Tombol peta memanggil `onEnter(destination(false, null))`, tombol daftar
`onEnter(destination(true, null))`, dan penutup keyboard/roda
`onEnter(destination(null, seed))` — `null` berarti "pakai default", yang untuk
pengunjung reduced-motion berarti tabel datar.

`URLSearchParams` yang meng-escape huruf; jangan menyambung string sendiri.

- [ ] **Step 4: Ubah `/`**

`src/app/page.jsx` merender `Gate` kalau `useShellEligible()`, `PaperFallback`
kalau tidak. `onEnter` memanggil `router.push(href)`.

Test `page.test.jsx` disesuaikan: `/` di desktop menampilkan gerbang, bukan
`shell`; `/` di lebar sempit tetap `.paper-doc`.

- [ ] **Step 5: Jalankan, pastikan hijau**

```bash
npx vitest run
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(gate): make the gate a page instead of a layer

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 4: Jalan kembali ke gerbang, dan URL yang jujur

**Files:**
- Modify: `src/components/shell/TopBar.jsx`
- Modify: `src/components/shell/__tests__/Shell.test.jsx`

- [ ] **Step 1: Tulis test yang gagal**

```jsx
  it('offers a way back to the gate', () => {
    renderShell();
    expect(screen.getByRole('link', { name: /UTSMAN/ })).toHaveAttribute('href', '/');
  });
```

- [ ] **Step 2: Jalankan, pastikan gagal**

```bash
npx vitest run src/components/shell/__tests__/Shell.test.jsx
```

- [ ] **Step 3: Implementasi**

`UTSMAN` di `TopBar` jadi `<Link href="/">`. Tombol kembali browser sudah
bekerja tanpa ini; tautan ini untuk pengunjung yang mendarat langsung di
`/sistem` lewat tautan yang dibagikan dan tidak punya riwayat untuk dimundurkan.

Tombol `ISO / DATAR` memanggil `router.replace` supaya URL ikut berubah tanpa
menumpuk riwayat dan tanpa me-mount ulang `Shell`. `view` tetap state lokal;
`replace` yang menyusul, bukan yang memimpin — kalau URL yang memimpin, filter
dan log ikut ter-reset.

- [ ] **Step 4: Jalankan, pastikan hijau**

```bash
npx vitest run
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(shell): make the wordmark the way back to the gate

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 5: Metadata

**Files:**
- Modify: `src/app/sitemap.js`
- Create: metadata di `src/app/sistem/page.jsx` atau `layout.js`-nya

- [ ] **Step 1: `canonical`**

`/sistem` memasang `alternates: { canonical: '/' }`. Di lebar HP kedua URL
merender isi yang sama persis, dan tanpa ini mesin pencari melihat halaman ganda.

Route `"use client"` tidak bisa mengekspor `metadata`; buat
`src/app/sistem/layout.js` yang mengekspornya.

- [ ] **Step 2: Sitemap**

`/sistem` **tidak** ditambahkan ke sitemap — canonical-nya menunjuk `/`, dan
mendaftarkan keduanya membatalkan maksud canonical itu. Komentar di
`sitemap.js` yang berbunyi "The homepage is a canvas" sudah basi; perbarui.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "docs(seo): point /sistem back at / as its canonical

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 6: Verifikasi browser dan catatan

- [ ] **Step 1: `npm run build`** — harus sukses, `/sistem` ikut terdaftar.

- [ ] **Step 2: Alur di browser**, viewport diemulasi ≥1024px:

1. `/` → gerbang. Klik `PETA` → URL jadi `/sistem`, peta tampil.
2. Tombol kembali browser → `/`, gerbang lagi. **Ini yang diminta Utsman.**
3. `/` → tekan `f` → URL `/sistem?ketik=f` lalu langsung bersih jadi `/sistem`,
   konsol berisi `f`.
4. Klik `DATAR` di TopBar → URL jadi `/sistem?tampilan=datar` tanpa memuat ulang.
   Pasang filter dulu sebelum menekannya: **filter dan rail log harus selamat.**
5. Muat `/sistem?tampilan=datar` langsung → mendarat di tabel datar.
6. Klik `UTSMAN` → kembali ke `/`.
7. Lebar 375px: `/` dan `/sistem` sama-sama dokumen kertas, tanpa gerbang.

- [ ] **Step 3: Tanpa JavaScript**

```bash
curl -s http://localhost:3000/ | grep -c "kerja/"
```

Harus tetap memuat lima tautan `/kerja/*`.

- [ ] **Step 4: Perbarui `docs/PROGRESS.md`**

Tabel "Bentuk sekarang" dapat baris `/sistem`. Catat bahwa `useGatePassed` dan
`sessionStorage` sudah tidak ada — sesi berikutnya tidak boleh mencarinya. Hitung
ulang jumlah test dari hasil `npx vitest run` yang sungguhan.

- [ ] **Step 5: Commit**
