# Gerbang Hero — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Beri `/` sebuah gerbang identitas di desktop dan pita identitas di HP, dan lewat gerbang itu tutup Tugas 1 — pengunjung `prefers-reduced-motion` dapat cangkang yang diam, bukan dokumen.

**Architecture:** `Gate` menutupi `Shell` (`absolute inset-0 z-50`) selama `passed` masih `false`; cangkang tetap dirender di bawahnya supaya `ResizeObserver` di `MapScene` selesai mengukur sebelum peta terlihat. `useGatePassed` mengingat lewat `sessionStorage`, sekali per tab. Gerbang menutup lewat dua tombol yang menyetel view awal, atau lewat tombol keyboard/roda yang memakai default — dan default itulah yang jadi `calm ? 'list' : 'map'`. Di lebar HP, `PaperHead` menggantikan blok kepala `SystemsDocument` yang sekarang; tidak ada gerbang di sana.

**Tech Stack:** Next.js App Router (JS, bukan TS), React 19, Tailwind v4 (`@theme` di `globals.css`), Vitest + happy-dom + Testing Library, ESLint flat config.

**Spec:** `docs/superpowers/specs/2026-09-08-gerbang-hero-design.md`

**Dasar sebelum mulai:** 92 test hijau, 17 berkas. Jalankan `npx vitest run` sekali untuk memastikan.

---

## Struktur berkas

| Berkas | Tanggung jawab |
|--------|----------------|
| `src/lib/hooks/useGatePassed.js` | **Baru.** Satu keadaan: sudah lewat gerbang atau belum. Tahu soal `sessionStorage`, tidak tahu soal UI |
| `src/components/shell/Gate.jsx` | **Baru.** Gambar gerbang, tangkap cara-cara menutupnya, laporkan lewat satu callback `onEnter` |
| `src/components/document/PaperHead.jsx` | **Baru.** Pita identitas di lapis kertas. Murni tampilan, tanpa state |
| `src/components/shell/Shell.jsx` | Ubah. Pegang `passed`, terjemahkan `onEnter` jadi `view` + benih konsol |
| `src/components/shell/Console.jsx` | Ubah. Terima `focusToken`; fokus saat token naik |
| `src/components/document/SystemsDocument.jsx` | Ubah. Pakai `PaperHead`, pindahkan catatan desktop ke kaki |
| `src/lib/hooks/useShellEligible.js` | Ubah. Lepas syarat `calm` |
| `src/app/page.jsx` | Ubah. Hitung `calm`, teruskan ke `Shell` |

`Gate` tidak memanggil `useMediaQuery` sendiri. `calm` datang sebagai prop dari `page.jsx` lewat `Shell`, jadi satu tempat saja yang bertanya ke browser dan komponennya gampang dites.

---

### Task 1: `useGatePassed`

**Files:**
- Create: `src/lib/hooks/useGatePassed.js`
- Test: `src/lib/hooks/__tests__/useGatePassed.test.jsx`

- [ ] **Step 1: Tulis test yang gagal**

Buat `src/lib/hooks/__tests__/useGatePassed.test.jsx`:

```jsx
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGatePassed } from '@/lib/hooks/useGatePassed';

beforeEach(() => {
  window.sessionStorage.clear();
  vi.restoreAllMocks();
});

describe('useGatePassed', () => {
  it('carries the flag a tab already holds, on the first render', () => {
    window.sessionStorage.setItem('gate', '1');
    const { result } = renderHook(() => useGatePassed());
    expect(result.current.passed).toBe(true);
  });

  it('stays false when nothing is stored', () => {
    const { result } = renderHook(() => useGatePassed());
    expect(result.current.passed).toBe(false);
  });

  it('remembers the gate once it is passed', () => {
    const { result } = renderHook(() => useGatePassed());
    act(() => result.current.pass());
    expect(result.current.passed).toBe(true);
    expect(window.sessionStorage.getItem('gate')).toBe('1');
  });

  it('does not leak between tabs — a cleared store means the gate returns', () => {
    window.sessionStorage.setItem('gate', '1');
    const first = renderHook(() => useGatePassed());
    expect(first.result.current.passed).toBe(true);

    window.sessionStorage.clear();
    const second = renderHook(() => useGatePassed());
    expect(second.result.current.passed).toBe(false);
  });

  it('survives storage that refuses to be read', () => {
    vi.spyOn(window.sessionStorage, 'getItem').mockImplementation(() => {
      throw new Error('denied');
    });
    const { result } = renderHook(() => useGatePassed());
    expect(result.current.passed).toBe(false);
  });

  it('survives storage that refuses to be written', () => {
    vi.spyOn(window.sessionStorage, 'setItem').mockImplementation(() => {
      throw new Error('denied');
    });
    const { result } = renderHook(() => useGatePassed());
    act(() => result.current.pass());
    expect(result.current.passed).toBe(true);
  });
});
```

- [ ] **Step 2: Jalankan, pastikan gagal**

```bash
npx vitest run src/lib/hooks/__tests__/useGatePassed.test.jsx
```

Expected: FAIL — `Failed to resolve import "@/lib/hooks/useGatePassed"`.

- [ ] **Step 3: Tulis implementasinya**

Buat `src/lib/hooks/useGatePassed.js`:

```js
"use client";

import { useCallback, useState } from 'react';

const KEY = 'gate';

// Private browsing throws on the property access itself in some browsers, so
// every touch is wrapped. A refusal reads as "not passed yet", which shows the
// gate — the safe end of the mistake.
function read() {
  try {
    return window.sessionStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
}

export function useGatePassed() {
  // Read while initialising, not in an effect. The shell never renders on the
  // server — page.jsx hands back the paper document until useMediaQuery says the
  // viewport is wide — so the gate never hydrates, and there is no server HTML
  // here for a first render to disagree with.
  const [passed, setPassed] = useState(read);

  const pass = useCallback(() => {
    setPassed(true);
    try {
      window.sessionStorage.setItem(KEY, '1');
    } catch {
      // Nothing to remember it with. The gate simply returns next time.
    }
  }, []);

  return { passed, pass };
}
```

- [ ] **Step 4: Jalankan, pastikan hijau**

```bash
npx vitest run src/lib/hooks/__tests__/useGatePassed.test.jsx
```

Expected: PASS, 7 test (Task 3 dan 6 menambah sisanya).

- [ ] **Step 5: Commit**

```bash
git add src/lib/hooks/useGatePassed.js src/lib/hooks/__tests__/useGatePassed.test.jsx
git commit -m "feat(gate): remember the gate for the length of a tab

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 2: `Gate` — isi dan dua tombol

**Files:**
- Create: `src/components/shell/Gate.jsx`
- Test: `src/components/shell/__tests__/Gate.test.jsx`

- [ ] **Step 1: Tulis test yang gagal**

Buat `src/components/shell/__tests__/Gate.test.jsx`:

```jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Gate from '@/components/shell/Gate';
import { projects } from '@/lib/data/projects';

const renderGate = (props = {}) => {
  const onEnter = vi.fn();
  const view = render(
    <Gate systems={projects} locale="id" calm={false} onEnter={onEnter} {...props} />,
  );
  return { onEnter, ...view };
};

describe('Gate', () => {
  it('names who built this, and where', () => {
    renderGate();
    expect(screen.getByText('Utsman')).toBeInTheDocument();
    expect(screen.getByText(/FULLSTACK DEVELOPER/)).toBeInTheDocument();
    expect(screen.getByText(/Banjarbaru, Kalimantan Selatan/)).toBeInTheDocument();
  });

  it('spans the years the work actually covers', () => {
    renderGate();
    expect(screen.getByText(/2024–2026/)).toBeInTheDocument();
  });

  it('lists the stack from the data, not from a hand-written list', () => {
    renderGate();
    const stack = screen.getByTestId('gate-stack').textContent;
    expect(stack).toContain('Laravel');
    expect(stack).toContain('TensorFlow.js');
    expect(stack).toContain('SOAP');
  });

  it('states no counts — every digit on the gate is a year', () => {
    const { container } = renderGate();
    const numbers = container.textContent.match(/\d[\d.]*/g) ?? [];
    expect(numbers.every((n) => n === '2024' || n === '2026')).toBe(true);
  });

  it('offers two doors, and each one names where it goes', () => {
    const { onEnter } = renderGate();
    fireEvent.click(screen.getByRole('button', { name: /PETA/ }));
    expect(onEnter).toHaveBeenCalledWith('map', null);

    fireEvent.click(screen.getByRole('button', { name: /DAFTAR/ }));
    expect(onEnter).toHaveBeenCalledWith('list', null);
  });

  it('speaks English when asked to', () => {
    renderGate({ locale: 'en' });
    expect(screen.getByRole('button', { name: /SEE SYSTEMS · MAP/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /SEE SYSTEMS · LIST/ })).toBeInTheDocument();
  });

  it('fades out when it is told it is leaving', () => {
    const { rerender } = renderGate();
    expect(screen.getByTestId('gate')).toHaveStyle({ opacity: '1' });

    rerender(
      <Gate systems={projects} locale="id" calm={false} leaving onEnter={vi.fn()} />,
    );
    expect(screen.getByTestId('gate')).toHaveStyle({ opacity: '0' });
  });
});

describe('Gate · dismissal', () => {
  it('closes on Enter, using the default view', () => {
    const { onEnter } = renderGate();
    fireEvent.keyDown(window, { key: 'Enter' });
    expect(onEnter).toHaveBeenCalledWith(null, null);
  });

  it('closes on Escape', () => {
    const { onEnter } = renderGate();
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onEnter).toHaveBeenCalledWith(null, null);
  });

  it('closes on a letter and hands that letter on to the console', () => {
    const { onEnter } = renderGate();
    fireEvent.keyDown(window, { key: 'f' });
    expect(onEnter).toHaveBeenCalledWith(null, 'f');
  });

  it('does not treat a space as a letter worth keeping', () => {
    const { onEnter } = renderGate();
    fireEvent.keyDown(window, { key: ' ' });
    expect(onEnter).toHaveBeenCalledWith(null, null);
  });

  it('swallows the keystroke it hands on, so the letter arrives once', () => {
    // fireEvent returns false when the handler called preventDefault. Without
    // it a real browser also delivers this keystroke to the console it is about
    // to focus, and `f` lands as `ff` — something happy-dom cannot show, since
    // it never performs the default text insertion.
    const { onEnter } = renderGate();
    expect(fireEvent.keyDown(window, { key: 'f' })).toBe(false);
    expect(onEnter).toHaveBeenCalledWith(null, 'f');
  });

  it('does not swallow Tab — the browser still needs it', () => {
    renderGate();
    expect(fireEvent.keyDown(window, { key: 'Tab' })).toBe(true);
  });

  it('leaves Tab alone, so the two buttons stay reachable', () => {
    const { onEnter } = renderGate();
    fireEvent.keyDown(window, { key: 'Tab' });
    expect(onEnter).not.toHaveBeenCalled();
  });

  it('ignores keys that are not text and not a decision', () => {
    const { onEnter } = renderGate();
    fireEvent.keyDown(window, { key: 'ArrowDown' });
    fireEvent.keyDown(window, { key: 'Shift' });
    expect(onEnter).not.toHaveBeenCalled();
  });

  it('ignores a letter pressed with a modifier — that is a browser shortcut', () => {
    const { onEnter } = renderGate();
    fireEvent.keyDown(window, { key: 'r', ctrlKey: true });
    expect(onEnter).not.toHaveBeenCalled();
  });

  it('closes when the visitor scrolls down', () => {
    const { onEnter } = renderGate();
    fireEvent.wheel(screen.getByTestId('gate'), { deltaY: 40 });
    expect(onEnter).toHaveBeenCalledWith(null, null);
  });

  it('stays put when the visitor scrolls up', () => {
    const { onEnter } = renderGate();
    fireEvent.wheel(screen.getByTestId('gate'), { deltaY: -40 });
    expect(onEnter).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Jalankan, pastikan gagal**

```bash
npx vitest run src/components/shell/__tests__/Gate.test.jsx
```

Expected: FAIL — `Failed to resolve import "@/components/shell/Gate"`.

- [ ] **Step 3: Tulis implementasinya**

Buat `src/components/shell/Gate.jsx`:

```jsx
"use client";

import { meta } from '@/lib/data/meta';
import { techNames } from '@/lib/data/tech';
import LangSwitcher from '@/components/nav/LangSwitcher';

const COPY = {
  role: { id: 'FULLSTACK DEVELOPER', en: 'FULLSTACK DEVELOPER' },
};

// The gate's words on the paper layer. Stack is a middot paragraph rather than
// framed chips: chips cost about 120px and a 44px touch target each, for the
// same names, and they push the first system under the fold on a 360x640 screen.
export default function PaperHead({ systems, locale }) {
  const years = systems.map((s) => Number(s.year));
  const span = `${Math.min(...years)}–${Math.max(...years)}`;

  return (
    <header>
      <div className="flex items-center justify-between font-mono text-[10.5px] text-paper-muted">
        <span>UTSMAN</span>
        <LangSwitcher />
      </div>

      <h1 className="font-display font-extrabold text-[30px] leading-none tracking-[-.03em] text-paper-ink mt-3.5 mb-0">
        {meta.name}
      </h1>

      <p className="font-mono text-[10px] tracking-[.09em] text-paper-muted mt-2 mb-0 leading-[1.6]">
        {COPY.role[locale]}
        <br />
        {meta.location[locale].toUpperCase()} · {span}
      </p>

      <p
        data-testid="paper-stack"
        className="font-mono text-[10px] text-paper-ink-soft mt-2.5 mb-0 leading-[1.7]"
      >
        {techNames(systems).join(' · ')}
      </p>
    </header>
  );
}
```

Tanpa garis penutup: `YearGroup` pertama sudah menggambar `border-t border-paper-ink`
sendiri di atas judul tahunnya, dan garis kedua di sini akan menempel persis di
sebelahnya. Dulu tidak kelihatan karena ada baris lokasi di antara keduanya.

- [ ] **Step 4: Pasang di `SystemsDocument`**

Di `src/components/document/SystemsDocument.jsx`, tambahkan impor:

```jsx
import PaperHead from './PaperHead';
```

Hapus impor `LangSwitcher` kalau sudah tidak dipakai di berkas ini.

Ganti tiga blok pembuka — kepala, garis, dan paragraf lokasi — dengan pita plus
satu jarak:

```jsx
      <PaperHead systems={systems} locale={locale} />

      {/* The first YearGroup draws its own rule across the top; a second one in
          PaperHead would sit right against it. This is just the gap. */}
      <div className="mt-7" />
```

Lalu pindahkan catatan desktop ke kaki: sisipkan tepat sebelum `<dl ...>`:

```jsx
      <p className="font-mono text-[10.5px] text-paper-muted mt-10 mb-0">
        {COPY.note[locale]}
      </p>
```

Dan ubah kelas `<dl>` dari `mt-10` jadi `mt-4`, supaya jarak totalnya tidak berubah. `COPY.head` dan impor `LangSwitcher` sudah tidak dipakai di berkas ini — buang keduanya.

- [ ] **Step 5: Jalankan, pastikan hijau**

```bash
npx vitest run src/components/document
```

Expected: PASS.

- [ ] **Step 6: Jalankan seluruh suite dan ESLint**

```bash
npx vitest run
npx eslint src --max-warnings=0
```

Expected: keduanya bersih.

- [ ] **Step 7: Commit**

```bash
git add src/components/document/PaperHead.jsx src/components/document/SystemsDocument.jsx src/components/document/__tests__/PaperHead.test.jsx src/components/document/__tests__/SystemsDocument.test.jsx
git commit -m "feat(document): give the paper layer the same identity band

Not a gate — a phone visitor reaches the work by scrolling, and a full-screen
door would cost them a screen. The desktop note moves to the foot, where a
reader who has already seen everything can find it.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 8: Verifikasi di browser sungguhan, lalu catat

**Files:**
- Modify: `docs/PROGRESS.md`

Tidak ada test di sini. Ini yang membuktikan hal-hal yang `happy-dom` tidak bisa buktikan.

- [ ] **Step 1: Bangun untuk produksi sekali**

```bash
npm run build
```

Expected: sukses, dengan lima halaman `/kerja/*`.

- [ ] **Step 2: Buka aplikasinya**

Server dev Utsman sudah jalan di port 3000. Buka `http://localhost:3000` di panel browser dengan `preset: desktop` (ukuran viewport harus sama dengan panel, kalau tidak klik mendarat di tempat lain — pelajaran alat browser di `PROGRESS.md`).

Kalau `globals.css` tersentuh selama pengerjaan, hapus `.next` dan jalankan ulang server dulu; cache Turbopack menyajikan token basi.

- [ ] **Step 3: Gerbang di keadaan normal**

Muat `/` di ≥1024px. Yang harus terlihat: nama, satu baris peran/lokasi/rentang, daftar stack, dua tombol, petunjuk di kanan bawah, empat plate di kanan.

Gerakkan kursor: keempat plate bergeser dengan jarak berbeda. Klik `LIHAT SISTEM · PETA →`: gerbang memudar, peta muncul tanpa lompatan tata letak.

- [ ] **Step 4: Ukur target sentuh kedua tombol**

Sembunyikan badge devtools dulu — ia menutupi pojok kiri bawah:

```js
document.querySelector('nextjs-portal')?.remove()
```

Lalu ukur:

```js
[...document.querySelectorAll('[data-testid="gate"] button')].map((b) => {
  const r = b.getBoundingClientRect();
  return [b.textContent.trim(), Math.round(r.width), Math.round(r.height)];
})
```

Expected: tinggi ≥44 untuk keduanya. Kalau kurang, naikkan padding di `Gate.jsx` dan ulangi.

- [ ] **Step 5: Ingatan gerbang**

Klik satu sistem yang punya halaman baca, masuk `/kerja/<slug>`, lalu tekan tautan kembali. Baca `location.pathname` **setelah** navigasi selesai, bukan 900ms setelah klik — pembacaan yang terlalu cepat melaporkan URL lama dan membuat navigasi yang berhasil terlihat seperti bug.

Expected: `/` tampil langsung di peta, gerbang tidak muncul.

Buka tab baru ke `/`. Expected: gerbang muncul lagi.

- [ ] **Step 6: Pengunjung reduced-motion**

Matikan "Animation effects" Windows (Settings → Accessibility → Visual effects). Periksa di konsol browser:

```js
matchMedia('(prefers-reduced-motion: reduce)').matches
```

Expected: `true`.

Muat `/` di ≥1024px di tab baru. Expected, dan ini inti Tugas 1:

- gerbang **muncul** — sebelum perubahan ini, `/` selalu mendarat di dokumen kertas
- plate tidak bergeser saat kursor digerakkan
- tekan `Enter` → mendarat di **tabel datar**, bukan peta
- tombol `LIHAT SISTEM · PETA →` tetap ada dan tetap bekerja

Nyalakan lagi animasi Windows setelah selesai.

- [ ] **Step 7: Lebar HP**

Ubah ke lebar 375px dan muat ulang. Expected: dokumen kertas dengan pita identitas di atas, project pertama masih terlihat tanpa menggulir, catatan "Buka di desktop…" ada di kaki. Tidak ada gerbang.

Jangan uji klik di preset `mobile` — emulasi sentuh menggantung `left_click` selama 30 detik dan terlihat persis seperti halaman rusak.

- [ ] **Step 8: Tanpa JavaScript**

```bash
curl -s http://localhost:3000/ | grep -c "kerja/"
```

Expected: tetap memuat lima tautan `/kerja/*`, dan nama serta stack ikut di HTML server.

- [ ] **Step 9: Perbarui `docs/PROGRESS.md`**

Yang harus berubah:

- Tabel "Bentuk sekarang": baris ≥1024px sekarang berbunyi "JS hidup" saja, tanpa syarat gerak; tambahkan bahwa gerbang mendahului cangkang.
- Bagian "Yang belum dikerjakan": hapus seluruh blok "Tugas 1", ganti dengan satu kalimat di "Keputusan yang mahal kalau dilupakan" — cangkang mount untuk semua lebar ≥1024; `calm` cuma memilih view awal, dan gerbang membiarkannya ditolak.
- "Di mana isinya": tambahkan `Gate.jsx`, `PaperHead.jsx`, `useGatePassed.js`, dan spec `2026-09-08-gerbang-hero-design.md` plus rencana ini.
- Jumlah test: hitung dari hasil `npx vitest run` yang sungguhan, jangan dikira-kira.
- "Yang belum dikerjakan" tetap memuat tiga antrean berikutnya: gaya scrollbar, peta interaktif, teks legenda.
- Kalau ada yang gagal di Step 3–8 dan cara memperbaikinya tidak kentara, tulis di "Pelajaran yang mahal".

- [ ] **Step 10: Commit**

```bash
git add docs/PROGRESS.md
git commit -m "docs: record the gate, and close Task 1

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Di luar lingkup rencana ini

Ketiganya dibicarakan bersamaan dengan gerbang dan sengaja ditinggalkan, masing-masing dapat spec sendiri:

- Gaya scrollbar untuk rail dan pane tabel datar.
- Peta yang lebih interaktif: klik badan plate (bukan cuma labelnya), roda memutar kamera, lapisan yang lebih bernyawa, zoom masuk ke halaman baca lewat View Transitions.
- Teks legenda sumbu dan catatan rail yang kurang informatif.
