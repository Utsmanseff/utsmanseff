# Perpindahan Naik-Turun — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Beri cangkang satu kontrol yang menyebut dirinya (`↑ KEMBALI`), dan buat perpindahan `/` ⇄ `/sistem` membawa arah — naik untuk mundur, turun untuk masuk.

**Architecture:** Satu berkas di `src/lib/nav/` mengurung seluruh sentuhan ke View Transitions API dan mengekspor `slideTo(href, direction)`. `TopBar` memanggilnya dengan `'up'`, `src/app/page.jsx` dengan `'down'`. Arah ditandai `documentElement.dataset.nav`; `globals.css` yang memilih `@keyframes` dari situ.

**Tech Stack:** Next 16.1.3 App Router, React 19 + React Compiler, View Transitions API, Tailwind v4, Vitest + happy-dom.

**Dasar sebelum mulai:** 146 test hijau, 23 berkas, `npx eslint src --max-warnings=0` bersih.

**Dari spec:** `docs/superpowers/specs/2026-09-09-perpindahan-naik-turun-design.md`

---

## Yang perlu diketahui sebelum mulai

**Kelima pemicu gerbang menyalurkan ke satu tempat.** Dua tombol, `Enter`,
`Escape`, huruf apa pun, dan roda ke bawah semuanya memanggil prop `onEnter`
milik `Gate`, dan `onEnter` cuma dipasang sekali — di `src/app/page.jsx:29`.
Jadi `Gate.jsx` **tidak disentuh sama sekali** di rencana ini. Spec menyebut ini
sebagai risiko "tiga pemicu"; itu terlalu besar, dan dikoreksi di Task 6.

**Server dijalankan Utsman di port 3000.** Jangan menjalankan server baru.
Setelah tiap perubahan `next.config.mjs` atau `globals.css`, minta Utsman:
Ctrl+C, lalu `Remove-Item -Recurse -Force .next` (PowerShell — `rm -rf` tidak ada
di sana, dan server harus mati dulu karena Windows mengunci berkasnya), lalu
`npm run dev`. Tunggu konfirmasi.

**Panel browser lebih sempit dari 1024px.** Emulasi 1280×800 sebelum menguji
cangkang, dan verifikasi lewat `javascript_tool` — klik berbasis koordinat tidak
mendarat waktu emulasi melebihi panel. Pakai `element.click()`.

**Baca ulang setelah navigasi.** Pembacaan 1000ms setelah klik pernah melaporkan
URL lama di dev server dan membuat navigasi yang berhasil terlihat seperti bug.
Kalau hasilnya mengejutkan, baca sekali lagi sebelum menyimpulkan.

---

### Task 1: Buktikan mekanismenya sebelum menulis apa pun

Spec sengaja tidak mengunci bentuk API-nya. Tiga hal harus diukur dulu, karena
ketiganya menentukan isi Task 2.

**Files:** tidak ada yang diubah di langkah 1–3. `next.config.mjs` diubah di
langkah 4, dan itu satu-satunya berkas yang tersentuh task ini.

- [ ] **Step 1: Apakah peramban ini punya API-nya**

Emulasi 1280×800, `navigate` ke `http://localhost:3000/`, lalu lewat
`javascript_tool`:

```js
({
  hasApi: typeof document.startViewTransition === 'function',
  ua: (navigator.userAgent.match(/Chrome\/\d+/) || [])[0],
});
```

Kalau `hasApi` `false`, berhenti — seluruh rencana ini tidak bisa diverifikasi
di sini. Laporkan dan tanya Utsman.

- [ ] **Step 2: Apakah `router.push` di dalam `startViewTransition` memotret DOM baru**

Ini pertanyaan intinya. Kalau React merender belakangan, potret "sesudah" diambil
sebelum halaman barunya ada, dan yang teranimasi layar kosong.

Masih di `/`, jalankan:

```js
const link = document.createElement('a');
link.href = '/sistem';
document.body.appendChild(link);

let names = [];
const t = document.startViewTransition(() => {
  link.click();
});
await t.ready.catch(() => {});
names = document.getAnimations().map((a) => ({
  name: a.animationName || (a.effect && a.effect.target && String(a.effect.target)),
  pseudo: a.effect && a.effect.pseudoElement,
  duration: a.effect && a.effect.getTiming().duration,
}));
await t.finished.catch(() => {});
link.remove();
({ url: location.pathname, animations: names });
```

Yang dicari: `animations` memuat entri ber-`pseudo` `::view-transition-old(root)`
dan `::view-transition-new(root)`. Kalau kosong, API-nya tidak menangkap apa-apa
lewat jalur ini.

Baca `url` **sekali lagi** di panggilan terpisah sebelum menyimpulkan navigasinya
gagal.

- [ ] **Step 3: Apakah potret barunya berisi halaman baru, bukan layar kosong**

`navigate` kembali ke `/`, lalu ulangi Step 2 dengan satu tambahan: sebelum
`t.finished`, baca apa yang ada di layar.

```js
const link = document.createElement('a');
link.href = '/sistem';
document.body.appendChild(link);
const t = document.startViewTransition(() => { link.click(); });
await t.ready.catch(() => {});
const midway = {
  shellPresent: !!document.querySelector('[data-testid="shell"]'),
  gatePresent: !!document.querySelector('[data-testid="gate"]'),
  animCount: document.getAnimations().length,
};
await t.finished.catch(() => {});
link.remove();
({ midway, after: location.pathname });
```

- `midway.shellPresent === true` → potretnya benar; **cara manual cukup**, dan
  Task 2 ditulis tanpa flag Next.
- `midway.shellPresent === false` → React belum merender waktu potret diambil;
  **flag Next diperlukan**, lanjut ke Step 4.

- [ ] **Step 4: Kalau flag diperlukan — nyalakan dan ukur lagi**

Lewati langkah ini kalau Step 3 menjawab `true`.

`next.config.mjs` jadi:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  experimental: {
    viewTransition: true,
  },
};

export default nextConfig;
```

Minta Utsman: Ctrl+C, `Remove-Item -Recurse -Force .next`, `npm run dev`.

Lalu periksa dua hal: apakah server hidup tanpa peringatan tentang opsi yang
tidak dikenal (baca keluaran terminal Utsman lewat `read_terminal`), dan apakah
impor komponennya ada:

```js
// dijalankan di halaman, bukan di Node — sekadar memastikan build tidak pecah
({ up: !!document.querySelector('[data-testid="gate"], [data-testid="shell"]') });
```

Kalau `experimental.viewTransition` tidak dikenal Next 16.1.3, terminal akan
mengatakannya. **Laporkan apa adanya dan berhenti** — jangan menebak nama opsi
lain.

- [ ] **Step 5: Catat hasilnya**

Tulis di ringkasan task: `hasApi`, isi `animations` beserta durasi, nilai
`midway.shellPresent`, dan keputusan mana yang diambil — manual atau flag. Angka
ini yang dikutip Task 6.

- [ ] **Step 6: Commit, hanya kalau `next.config.mjs` berubah**

```bash
git add next.config.mjs
git commit -m "chore(next): turn on view transitions

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 2: `slideTo`

**Files:**
- Create: `src/lib/nav/slideTo.js`
- Test: `src/lib/nav/__tests__/slideTo.test.js`

- [ ] **Step 1: Tulis test yang gagal**

happy-dom tidak punya `document.startViewTransition`, jadi jalur cadangan adalah
yang default di sini — dan itu justru jalur yang paling penting dijaga.

```js
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { slideTo } from '@/lib/nav/slideTo';

const push = vi.fn();
const router = { push };

beforeEach(() => {
  push.mockClear();
  delete document.startViewTransition;
  delete document.documentElement.dataset.nav;
});

afterEach(() => {
  delete document.startViewTransition;
});

describe('slideTo', () => {
  it('navigates plainly when the browser has no view transitions', () => {
    slideTo(router, '/sistem', 'down');
    expect(push).toHaveBeenCalledWith('/sistem');
  });

  it('marks the direction on the root element, so the CSS can pick a keyframe', () => {
    slideTo(router, '/', 'up');
    expect(document.documentElement.dataset.nav).toBe('up');
  });

  it('marks the other direction too', () => {
    slideTo(router, '/sistem', 'down');
    expect(document.documentElement.dataset.nav).toBe('down');
  });

  it('hands the navigation to the browser when it can animate it', () => {
    const run = vi.fn((cb) => { cb(); return { finished: Promise.resolve() }; });
    document.startViewTransition = run;
    slideTo(router, '/', 'up');
    expect(run).toHaveBeenCalled();
    expect(push).toHaveBeenCalledWith('/');
  });

  it('sets the direction before the transition starts, not after', () => {
    // The pseudo-elements are created the moment startViewTransition runs. A
    // direction written afterwards arrives too late and the wrong keyframe runs.
    const seen = { nav: null };
    document.startViewTransition = (cb) => {
      seen.nav = document.documentElement.dataset.nav;
      cb();
      return { finished: Promise.resolve() };
    };
    slideTo(router, '/', 'up');
    expect(seen.nav).toBe('up');
  });

  it('refuses a direction it does not know, and still navigates', () => {
    slideTo(router, '/sistem', 'sideways');
    expect(push).toHaveBeenCalledWith('/sistem');
    expect(document.documentElement.dataset.nav).toBeUndefined();
  });
});
```

- [ ] **Step 2: Jalankan, pastikan gagal**

```bash
npx vitest run src/lib/nav
```

Expected: FAIL — `Failed to resolve import "@/lib/nav/slideTo"`.

- [ ] **Step 3: Tulis implementasinya**

```js
// Everything this project knows about the View Transitions API lives here.
// The API is still prefixed unstable_ on the framework side and its shape can
// change under a Next upgrade; one file means one place to fix.
//
// The gate sits above the systems. Going up is going back, going down is going
// in, and the direction is written on the root element because the
// ::view-transition-* pseudo-elements live there, not inside the React tree.

const DIRECTIONS = ['up', 'down'];

export function slideTo(router, href, direction) {
  const known = DIRECTIONS.includes(direction);

  const go = () => router.push(href);

  if (!known || typeof document.startViewTransition !== 'function') {
    // No animation to run: a browser without the API, or a caller with a
    // direction we have no keyframes for. Navigating plainly is the right
    // answer to both — the page still changes, it just cuts.
    return go();
  }

  // Written before the transition starts. The pseudo-elements are created the
  // moment startViewTransition runs, and a direction set afterwards arrives
  // after the keyframes have already been chosen.
  document.documentElement.dataset.nav = direction;
  return document.startViewTransition(go);
}
```

- [ ] **Step 4: Jalankan, pastikan hijau**

```bash
npx vitest run src/lib/nav
```

Expected: PASS, 6 test.

- [ ] **Step 5: Commit**

```bash
git add src/lib/nav
git commit -m "feat(nav): put the whole view-transition surface in one function

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 3: `↑ KEMBALI` di TopBar

**Files:**
- Modify: `src/components/shell/TopBar.jsx`
- Modify: `src/components/shell/__tests__/Shell.test.jsx`

- [ ] **Step 1: Ubah test lebih dulu**

Di `Shell.test.jsx`, ganti test `offers a way back to the gate` — ia sekarang
menjaga tautan yang sedang dicopot:

```jsx
  it('offers a way back, and says so', () => {
    renderShell();
    const back = screen.getByRole('link', { name: 'KEMBALI' });
    expect(back).toHaveAttribute('href', '/');
  });

  it('leaves the wordmark as plain text', () => {
    // One destination, one control. The wordmark was the way back before this
    // button existed, and two links to `/` in one bar is one too many.
    renderShell();
    expect(screen.queryByRole('link', { name: 'UTSMAN' })).toBeNull();
    expect(screen.getByText('UTSMAN')).toBeInTheDocument();
  });

  it('keeps the arrow out of the accessible name', () => {
    renderShell();
    expect(screen.getByRole('link', { name: 'KEMBALI' })).toBeInTheDocument();
  });
```

- [ ] **Step 2: Jalankan, pastikan gagal**

```bash
npx vitest run src/components/shell/__tests__/Shell.test.jsx
```

Expected: FAIL pada ketiga test itu.

- [ ] **Step 3: Ubah `TopBar`**

`UTSMAN` kembali jadi `<span>`, dan tautan baru berdiri di sebelahnya. Tautan,
bukan tombol: klik tengah dan "buka di tab baru" ikut gratis, dan pembaca layar
mengumumkannya sebagai tautan.

```jsx
"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { slideTo } from '@/lib/nav/slideTo';
import LangSwitcher from '@/components/nav/LangSwitcher';

const COPY = {
  back: { id: 'KEMBALI', en: 'BACK' },
  skip: { id: 'LEWATI PETA → DAFTAR SISTEM', en: 'SKIP MAP → SYSTEM LIST' },
  view: { id: 'TAMPILAN', en: 'VIEW' },
  iso: { id: 'ISO', en: 'ISO' },
  flat: { id: 'DATAR', en: 'FLAT' },
  filtered: { id: 'TERSARING', en: 'FILTERED' },
};

export default function TopBar({ locale, view, filtering, onView }) {
  const router = useRouter();

  return (
    <div className="border-b border-rule px-6 py-2.5 flex items-center justify-between font-mono text-[11px] tracking-[.1em] text-muted">
      <div className="flex items-center gap-5">
        <span className="text-ink">UTSMAN</span>
        {/* Quieter than LEWATI PETA beside it on purpose: two framed buttons
            side by side would compete. The arrow is decoration, hidden from
            the accessible name the way the gate's arrows are. */}
        <Link
          href="/"
          onClick={(e) => {
            // Let the browser have the click when the visitor asked for a new
            // tab or a new window; intercepting those breaks a plain link.
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
            e.preventDefault();
            slideTo(router, '/', 'up');
          }}
          className="flex items-center gap-1.5 text-muted hover:text-ink transition-colors duration-[180ms]"
        >
          <span aria-hidden="true">↑</span>
          <span>{COPY.back[locale]}</span>
        </Link>
        <span>FULLSTACK · BANJARBARU</span>
        <button
          type="button"
          onClick={() => onView('list')}
          className="text-amber border border-rule px-2 py-[3px] whitespace-nowrap"
        >
          {COPY.skip[locale]}
        </button>
      </div>

      <div className="flex items-center gap-5">
        <span>
          {COPY.view[locale]}{' '}
          <button type="button" onClick={() => onView('map')} className={view === 'map' ? 'text-amber' : ''}>
            {COPY.iso[locale]}
          </button>
          {' / '}
          <button type="button" onClick={() => onView('list')} className={view === 'list' ? 'text-amber' : ''}>
            {COPY.flat[locale]}
          </button>
        </span>
        <span className="text-amber">{filtering ? COPY.filtered[locale] : ''}</span>
        <LangSwitcher />
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Jalankan seluruh test**

```bash
npx vitest run
```

Expected: PASS. Kalau ada test lain yang mencari `link` bernama `UTSMAN`,
perbaiki di sini — bukan dengan melonggarkan assertion, tapi dengan mengejar
maksud aslinya.

- [ ] **Step 5: Lint**

```bash
npx eslint src --max-warnings=0
```

- [ ] **Step 6: Commit**

```bash
git add src/components/shell
git commit -m "feat(shell): give the way back a control that says what it is

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 4: Gerbang turun

**Files:**
- Modify: `src/app/page.jsx`
- Modify: `src/app/__tests__/page.test.jsx`

- [ ] **Step 1: Tulis test yang gagal**

Di `page.test.jsx`, tambahkan di dalam `describe('/')`:

```jsx
  it('marks the way in as going down', () => {
    // All five ways into the shell — both buttons, Enter, Escape, any letter,
    // and the wheel — funnel through this one handler, so this covers them all.
    eligible.value = true;
    render(<Home />, { wrapper: LocaleProvider });
    fireEvent.click(screen.getByRole('button', { name: /PETA|MAP/ }));
    expect(document.documentElement.dataset.nav).toBe('down');
    expect(push).toHaveBeenCalledWith('/sistem');
  });
```

Tambahkan juga pembersihan di `beforeEach` berkas itu:

```jsx
  delete document.documentElement.dataset.nav;
```

- [ ] **Step 2: Jalankan, pastikan gagal**

```bash
npx vitest run src/app/__tests__/page.test.jsx
```

Expected: FAIL — `dataset.nav` masih `undefined`.

- [ ] **Step 3: Ubah `page.jsx`**

Satu baris. `Gate.jsx` tidak disentuh: kelima pemicunya sudah menyalurkan ke
prop `onEnter` ini.

```jsx
        onEnter={(href) => slideTo(router, href, 'down')}
```

Dan impornya:

```jsx
import { slideTo } from '@/lib/nav/slideTo';
```

- [ ] **Step 4: Jalankan, pastikan hijau**

```bash
npx vitest run
```

- [ ] **Step 5: Commit**

```bash
git add src/app
git commit -m "feat(gate): send every way in through the downward move

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 5: Geraknya sendiri

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Tulis CSS-nya**

Sisipkan tepat sebelum blok `@media (prefers-reduced-motion: reduce)` yang sudah
ada di ujung berkas.

```css
/* Perpindahan gerbang ⇄ sistem. Ruangnya tetap: gerbang di atas, sistem di
   bawah. Naik berarti mundur, turun berarti masuk — dan panah di tombol
   KEMBALI karena itu benar secara harfiah, bukan hiasan.
   700ms dan easing ini bukan angka baru: keduanya laju "bergerak sendiri" yang
   sudah dipakai gerbang dan FadeIn. Jaraknya satu token, sengaja jauh di bawah
   satu layar penuh — gerak terjauh yang pernah ada di situs ini 6px. */
:root {
  --nav-slide: 22vh;
  --nav-ease: cubic-bezier(.22, 1, .36, 1);
}

@keyframes nav-leave-down {
  to { transform: translateY(var(--nav-slide)); opacity: 0; }
}

@keyframes nav-enter-from-top {
  from { transform: translateY(calc(var(--nav-slide) * -1)); opacity: 0; }
}

@keyframes nav-leave-up {
  to { transform: translateY(calc(var(--nav-slide) * -1)); opacity: 0; }
}

@keyframes nav-enter-from-bottom {
  from { transform: translateY(var(--nav-slide)); opacity: 0; }
}

/* Keduanya digambar bertumpuk selama transisi; tanpa ini yang lama menutupi
   yang baru sampai animasinya selesai. */
::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 700ms;
  animation-timing-function: var(--nav-ease);
  animation-fill-mode: both;
  mix-blend-mode: normal;
}

html[data-nav="up"]::view-transition-old(root) {
  animation-name: nav-leave-down;
}

html[data-nav="up"]::view-transition-new(root) {
  animation-name: nav-enter-from-top;
}

html[data-nav="down"]::view-transition-old(root) {
  animation-name: nav-leave-up;
}

html[data-nav="down"]::view-transition-new(root) {
  animation-name: nav-enter-from-bottom;
}

/* Wajib, bukan pelengkap. Aturan reduced-motion di bawah memangkas
   animation-duration pada elemen biasa dan TIDAK menjangkau pseudo-element
   ini, jadi tanpa blok ini pengunjung yang meminta gerak dikurangi tetap kena
   geser 22vh. */
@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(root),
  ::view-transition-new(root) {
    animation-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 2: Minta Utsman membuang cache dan menjalankan ulang server**

Ctrl+C, `Remove-Item -Recurse -Force .next`, `npm run dev`. Tunggu konfirmasi.

- [ ] **Step 3: Ukur arah naik**

Emulasi 1280×800, `navigate` ke `http://localhost:3000/sistem`, lalu:

```js
await new Promise(r => setTimeout(r, 800));
const back = [...document.querySelectorAll('a')].find(a => /KEMBALI|BACK/.test(a.textContent));
back.click();
await new Promise(r => setTimeout(r, 120));
const running = document.getAnimations().map(a => ({
  name: a.animationName,
  pseudo: a.effect && a.effect.pseudoElement,
  duration: a.effect && a.effect.getTiming().duration,
}));
({ nav: document.documentElement.dataset.nav, running });
```

Expected: `nav` **"up"**, dan `running` memuat `nav-leave-down` pada
`::view-transition-old(root)` serta `nav-enter-from-top` pada
`::view-transition-new(root)`, durasi **700**.

Kalau `running` kosong, animasinya mungkin sudah selesai sebelum dibaca —
kecilkan jeda 120ms, jangan menyimpulkan gagal dari satu pembacaan.

- [ ] **Step 4: Ukur arah turun**

Baca ulang untuk memastikan sudah di `/`, lalu:

```js
await new Promise(r => setTimeout(r, 800));
[...document.querySelectorAll('button')].find(b => /PETA|MAP/.test(b.textContent)).click();
await new Promise(r => setTimeout(r, 120));
const running = document.getAnimations().map(a => ({
  name: a.animationName,
  pseudo: a.effect && a.effect.pseudoElement,
  duration: a.effect && a.effect.getTiming().duration,
}));
({ nav: document.documentElement.dataset.nav, running });
```

Expected: `nav` **"down"**, `nav-leave-up` dan `nav-enter-from-bottom`.

- [ ] **Step 5: Ukur reduced-motion**

Setelan ini ikut OS, bukan peramban. Periksa dulu keadaannya lewat **PowerShell**
(bukan Bash — `$m = (Get-ItemProperty ...)` langsung parse error di sana):

```powershell
$m = (Get-ItemProperty 'HKCU:\Control Panel\Desktop').UserPreferencesMask
'{0:X2}' -f $m[0]
```

`9E` berarti animasi menyala, `90` berarti mati. Kalau sedang menyala, minta
Utsman mematikan "Animation effects" di Settings, atau lewati langkah ini dan
**tulis bahwa ia belum diukur** — jangan mengaku sudah.

Waktu mati, ulangi Step 3 dan periksa `duration` terbaca sangat kecil, bukan 700.

- [ ] **Step 6: Kembalikan viewport**

`resize_window` `{ preset: "desktop" }`.

- [ ] **Step 7: Test dan lint**

```bash
npx vitest run
```

Expected: hijau, jumlahnya tidak berubah dari Task 4 — CSS tidak menambah test.

```bash
npx eslint src --max-warnings=0
```

- [ ] **Step 8: Commit**

```bash
git add src/app/globals.css
git commit -m "feat(nav): make the move between gate and shell carry a direction

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 6: Catatan

**Files:**
- Modify: `docs/superpowers/specs/2026-09-09-perpindahan-naik-turun-design.md`
- Modify: `docs/PROGRESS.md`

- [ ] **Step 1: Koreksi spec**

Dua hal:

1. Bagian **Risiko** menyebut "gerbang punya tiga pemicu masuk" sebagai risiko
   yang perlu dijaga. Kelimanya ternyata menyalurkan ke satu prop `onEnter` di
   `src/app/page.jsx`, jadi satu titik panggil menutup semuanya dan `Gate.jsx`
   tidak disentuh. Ganti butir itu dengan fakta tersebut.
2. Bagian **Pengurungan** mendaftar tiga hal yang harus dibuktikan. Ganti dengan
   hasil Task 1 yang sebenarnya: apakah cara manual cukup atau flag diperlukan,
   dan angka dari `document.getAnimations()`.

- [ ] **Step 2: Perbarui `docs/PROGRESS.md`**

Empat tempat:

1. **Tabel "Bentuk sekarang"** — sebutkan bahwa `/` ⇄ `/sistem` beranimasi
   naik-turun, dan pintu lain memotong.
2. **"Di mana isinya"** — baris baru untuk `src/lib/nav/slideTo.js`.
3. **"Keputusan yang mahal kalau dilupakan"** — satu butir: gerbang di atas,
   sistem di bawah; `--nav-slide` `22vh` bisa disetel; `UTSMAN` sengaja bukan
   tautan lagi; tombolnya sengaja tidak 44px karena cangkang cuma hidup di
   ≥1024px dengan penunjuk presisi.
4. **"Pelajaran yang mahal"** — apa yang Task 1 temukan tentang potret DOM dan
   `startViewTransition`, dengan angkanya.

Kalau Step 5 di Task 5 dilewati, tulis di PROGRESS bahwa reduced-motion untuk
pseudo-element itu **belum pernah diukur**. Jangan diam-diam.

- [ ] **Step 3: Commit**

```bash
git add docs
git commit -m "docs: record how the gate and the shell move past each other

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```
