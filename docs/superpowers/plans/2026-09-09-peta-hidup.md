# Peta Hidup — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Badan plate jadi kontrolnya, roda memutar kamera, dan tumpukan lapis bereaksi pada hover, fokus, dan sudut kamera.

**Architecture:** Dua unit baru memikul yang selama ini menumpuk di `MapScene`: `src/lib/shell/shading.js` (murni, warna tepi per sisi dari `rotZ`) dan `src/lib/shell/useMapCamera.js` (hook, memegang `rotZ`, seret, roda, debounce, snap). `MapScene` kembali jadi komponen tata letak. `Plate` berubah dari `<div>` berisi tombol label jadi satu `<button>` utuh. `src/lib/shell/layout.js` tidak disentuh.

**Tech Stack:** Next.js App Router, React 19 (canary lewat `experimental.viewTransition`), Tailwind v4, Vitest + happy-dom + Testing Library.

**Spec:** `docs/superpowers/specs/2026-09-09-peta-hidup-design.md`

**Aturan kerja:** TDD — test dulu, jalankan, lihat gagal, baru implementasi. Commit tiap task. Verifikasi di browser sungguhan, bukan cuma test. Berhenti tiap selesai satu task.

**Dev server:** sudah jalan milik Utsman di port 3000. Jangan menjalankan server sendiri. Kalau `globals.css` berubah dan token terlihat basi, minta Utsman `Ctrl+C` lalu `Remove-Item -Recurse -Force .next` di PowerShell.

**Titik awal:** 156 test hijau, 24 berkas. `npx eslint src --max-warnings=0` bersih.

---

## Struktur berkas

| Berkas | Status | Tanggung jawab |
|---|---|---|
| `src/lib/shell/shading.js` | baru | Warna tepi per sisi dari kedalaman lapis dan sudut kamera. Murni, tanpa DOM, tidak tahu apa itu pointer. |
| `src/lib/shell/__tests__/shading.test.js` | baru | Test murni untuk di atas. |
| `src/lib/shell/useMapCamera.js` | baru | `rotZ`, seret, roda, debounce diam, snap. Tidak tahu apa itu warna. |
| `src/lib/shell/__tests__/useMapCamera.test.jsx` | baru | Test hook lewat komponen probe. |
| `src/components/shell/Plate.jsx` | diubah | Satu `<button>`, tumpukan membuka, tepi dari `shading`, stagger masuk. |
| `src/components/shell/__tests__/Plate.test.jsx` | diubah | |
| `src/components/shell/MapScene.jsx` | diubah | Memakai hook, membungkus `onSelect`, menyalakan transisi saat `settling`. |
| `src/components/shell/__tests__/MapScene.test.jsx` | baru | |
| `src/app/globals.css` | satu baris | `transition-delay: 0ms !important` di blok reduced-motion. |
| `src/lib/shell/layout.js` | **tidak berubah** | `snapRotation`, `CAMERA_ANGLES`, `topZ` tetap seperti sekarang. |

---

## Task 1: Buktikan `preserve-3d` bertahan di `<button>`

Spec §8. Sebagian browser meratakan konteks 3D di elemen kontrol. Kalau itu terjadi, seluruh Task 3 sampai 10 salah bentuk. Dibuktikan lebih dulu, di browser sungguhan, tanpa mengubah kode aplikasi.

**Files:**
- Modify: `docs/superpowers/specs/2026-09-09-peta-hidup-design.md` (§8, catatan hasil)

- [ ] **Step 1: Buka `/sistem` di panel browser pada 1280×800**

Panel sesi ini ~559px. Di bawah 1024 cangkang tidak mount, jadi emulasi wajib.

Gunakan `resize_window` `{ width: 1280, height: 800 }`, lalu `navigate` ke `http://localhost:3000/sistem`.

- [ ] **Step 2: Suntik probe lewat `javascript_tool`**

Probe ini membuat tumpukan uji di dalam `<button>` dan di dalam `<div>`, lalu membandingkan tinggi kotak yang terukur. Kalau konteks 3D diratakan, anak ber-`translateZ(60px)` tidak akan naik dan kedua angka jadi sama.

```js
const build = (tag) => {
  const host = document.createElement(tag);
  host.style.cssText =
    'position:fixed;left:-9999px;top:0;width:100px;height:100px;' +
    'transform-style:preserve-3d;transform:perspective(800px) rotateX(56deg);' +
    'appearance:none;background:transparent;border:0;padding:0';
  const deep = document.createElement('div');
  deep.style.cssText = 'position:absolute;inset:0;transform:translateZ(60px)';
  host.appendChild(deep);
  document.body.appendChild(host);
  const box = deep.getBoundingClientRect();
  const flat = getComputedStyle(host).transformStyle;
  host.remove();
  return { height: Math.round(box.height), width: Math.round(box.width), transformStyle: flat };
};
({ button: build('button'), div: build('div') });
```

- [ ] **Step 3: Baca hasilnya**

Lulus kalau `button.transformStyle === 'preserve-3d'` **dan** `button.height` sama dengan `div.height`. Artinya `<button>` memelihara konteks 3D dan Task 3 boleh jalan apa adanya.

Gagal kalau `button.transformStyle === 'flat'` atau tingginya berbeda dari `div`. Kalau gagal, **berhenti dan lapor**: Task 3 berganti ke `<div role="button" tabIndex={0}>` dengan handler `onKeyDown` untuk `Enter` dan `' '` (Space), dan seluruh test yang menyebut `getByRole('button')` tetap berlaku karena `role="button"` juga menjawabnya.

- [ ] **Step 4: Tulis hasilnya ke spec**

Tambahkan di akhir §8 spec, ganti `<hasil>` dengan angka sungguhan:

```markdown
**Terukur 2026-09-09, Chrome di panel, 1280×800.** `<button>` dengan
`transform-style: preserve-3d` melaporkan `transformStyle: "<hasil>"`, dan anak
ber-`translateZ(60px)` di dalamnya terukur setinggi `<hasil>`px — sama dengan
`<div>` pembanding. Konteks 3D bertahan; jalan mundur `role="button"` tidak
dipakai.
```

- [ ] **Step 5: Commit**

```bash
git add docs/superpowers/specs/2026-09-09-peta-hidup-design.md
git commit -m "docs: measure whether a button keeps its 3D context"
```

---

## Task 2: `shading.js` — warna tepi per sisi

**Files:**
- Create: `src/lib/shell/shading.js`
- Test: `src/lib/shell/__tests__/shading.test.js`

- [ ] **Step 1: Tulis test yang gagal**

Buat `src/lib/shell/__tests__/shading.test.js`:

```js
import { describe, it, expect } from 'vitest';
import { edgeTones, EDGE_RAMP } from '@/lib/shell/shading';

// Semua warna hidup di satu ramp lurus, jadi satu kanal sudah cukup untuk
// membandingkan terang. Merah dipilih sembarang; ketiganya bergerak searah.
const lum = (hex) => parseInt(hex.slice(1, 3), 16);

const sides = (over = {}) => edgeTones({ index: 0, layers: 5, rotZ: -40, ...over });

describe('edgeTones', () => {
  it('gives four sides, each a hex colour', () => {
    const t = sides();
    expect(Object.keys(t).sort()).toEqual(['bottom', 'left', 'right', 'top']);
    Object.values(t).forEach((c) => expect(c).toMatch(/^#[0-9a-f]{6}$/i));
  });

  it('lights the side that faces the light and leaves the far side dark', () => {
    const t = sides({ rotZ: -40 });
    expect(lum(t.left)).toBeGreaterThan(lum(t.right));
  });

  it('swaps those two sides when the camera turns halfway round', () => {
    const near = sides({ rotZ: -40 });
    const far = sides({ rotZ: 140 });
    expect(lum(far.right)).toBeGreaterThan(lum(far.left));
    expect(lum(far.right)).toBeCloseTo(lum(near.left), -1);
  });

  it('raises every side as the layer sits higher in the stack', () => {
    const low = sides({ index: 0 });
    const high = sides({ index: 4 });
    ['top', 'right', 'bottom', 'left'].forEach((s) => {
      expect(lum(high[s])).toBeGreaterThan(lum(low[s]));
    });
  });

  it('never leaves the family it was given', () => {
    const floor = lum(EDGE_RAMP.dark);
    const ceiling = lum(EDGE_RAMP.bright);
    for (let rotZ = -180; rotZ <= 180; rotZ += 15) {
      for (let index = 0; index < 5; index += 1) {
        Object.values(edgeTones({ index, layers: 5, rotZ })).forEach((c) => {
          expect(lum(c)).toBeGreaterThanOrEqual(floor);
          expect(lum(c)).toBeLessThanOrEqual(ceiling);
        });
      }
    }
  });

  it('answers the same input with the same colour', () => {
    expect(sides()).toEqual(sides());
  });

  it('treats a single-layer plate as the top of its stack', () => {
    const one = edgeTones({ index: 0, layers: 1, rotZ: -40 });
    const top = edgeTones({ index: 4, layers: 5, rotZ: -40 });
    expect(lum(one.left)).toBe(lum(top.left));
  });
});
```

- [ ] **Step 2: Jalankan, pastikan gagal**

```bash
npx vitest run src/lib/shell/__tests__/shading.test.js
```

Diharapkan: FAIL — `Failed to resolve import "@/lib/shell/shading"`.

- [ ] **Step 3: Implementasi**

Buat `src/lib/shell/shading.js`:

```js
// Kedalaman di peta ini datang dari lapisan, tepi dan sudut — tidak pernah dari
// bayangan. Modul ini memegang bagian sudutnya: cahaya ditetapkan di ruang
// layar, jadi memutar peta mengubah rupa tumpukan, bukan cuma posisinya.
//
// Murni dan tanpa DOM, seperti filters.js dan layout.js. Ia tidak tahu apa itu
// pointer, dan tidak tahu plate mana yang sedang terpilih.

export const EDGE_RAMP = { dark: '#2A3236', bright: '#4C555A' };

// Dasar naik menurut kedalaman lapis; sudut kamera cuma memiringkannya, tidak
// menggantikannya. BASE_LOW + BASE_RANGE + AMP harus tetap <= 1.
const BASE_LOW = 0.18;
const BASE_RANGE = 0.34;
const AMP = 0.42;

// Kiri-atas layar. Derajat, searah dengan rotZ supaya keduanya bisa dijumlahkan.
const LIGHT_DEG = 135;

const NORMALS = {
  top: [0, -1],
  right: [1, 0],
  bottom: [0, 1],
  left: [-1, 0],
};

const channels = (hex) => [
  parseInt(hex.slice(1, 3), 16),
  parseInt(hex.slice(3, 5), 16),
  parseInt(hex.slice(5, 7), 16),
];

const mix = (from, to, t) => {
  const a = channels(from);
  const b = channels(to);
  const hex = a
    .map((v, i) => Math.round(v + (b[i] - v) * t).toString(16).padStart(2, '0'))
    .join('');
  return `#${hex}`;
};

export function edgeTones({ index, layers, rotZ }) {
  // Satu lapis adalah puncak tumpukannya sendiri, bukan dasarnya.
  const depth = layers > 1 ? index / (layers - 1) : 1;
  const base = BASE_LOW + depth * BASE_RANGE;

  // Cahaya dibawa dari ruang layar ke ruang plate dengan diputar -rotZ.
  const angle = ((LIGHT_DEG - rotZ) * Math.PI) / 180;
  const light = [Math.cos(angle), Math.sin(angle)];

  return Object.fromEntries(
    Object.entries(NORMALS).map(([side, n]) => {
      const facing = Math.max(0, n[0] * light[0] + n[1] * light[1]);
      const t = Math.min(1, Math.max(0, base + AMP * facing));
      return [side, mix(EDGE_RAMP.dark, EDGE_RAMP.bright, t)];
    }),
  );
}
```

- [ ] **Step 4: Jalankan, pastikan hijau**

```bash
npx vitest run src/lib/shell/__tests__/shading.test.js
```

Diharapkan: PASS, 7 test.

- [ ] **Step 5: Lint**

```bash
npx eslint src --max-warnings=0
```

Diharapkan: tanpa keluaran.

- [ ] **Step 6: Commit**

```bash
git add src/lib/shell/shading.js src/lib/shell/__tests__/shading.test.js
git commit -m "feat(map): let the camera angle decide which edge catches light"
```

---

## Task 3: `Plate` jadi satu tombol

Belum menyentuh warna maupun tumpukan. Cuma memindahkan kontrolnya dari label ke badan.

**Files:**
- Modify: `src/components/shell/Plate.jsx`
- Test: `src/components/shell/__tests__/Plate.test.jsx`

- [ ] **Step 1: Tulis test yang gagal**

Ganti test pertama di `src/components/shell/__tests__/Plate.test.jsx` dan tambahkan dua test baru. Test lain di berkas itu dibiarkan apa adanya.

```js
  it('is one button covering the whole plate, not just its label', () => {
    const { container } = renderPlate();
    const button = screen.getByRole('button', { name: 'HRIS RSU NIRWANA · INTERNAL' });
    expect(button).toBe(container.firstChild);
    expect(container.querySelectorAll('button')).toHaveLength(1);
    expect(container.querySelectorAll('[data-layer]')[0].closest('button')).toBe(button);
  });

  it('says whether it is the selected system', () => {
    renderPlate({ selected: true });
    expect(screen.getByRole('button', { name: /HRIS/ })).toHaveAttribute('aria-pressed', 'true');
  });

  it('reports the slug it stands for when pressed', async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    renderPlate({ onSelect });
    await user.click(screen.getByRole('button', { name: /HRIS/ }));
    expect(onSelect).toHaveBeenCalledWith('hris-nirwana');
  });
```

Tambahkan import di kepala berkas:

```js
import userEvent from '@testing-library/user-event';
```

`userEvent`, bukan `fireEvent`: klik sintetis melewati urutan pointer, dan plate ini nanti hidup berdampingan dengan penelan klik di Task 7.

- [ ] **Step 2: Jalankan, pastikan gagal**

```bash
npx vitest run src/components/shell/__tests__/Plate.test.jsx
```

Diharapkan: FAIL — nama aksesibel `HRIS RSU NIRWANA · INTERNAL` tidak ditemukan pada `container.firstChild`, karena tombolnya masih label di dalam `<div>`.

- [ ] **Step 3: Implementasi**

Di `src/components/shell/Plate.jsx`, ubah pembungkus dari `<div>` jadi `<button>` dan turunkan label jadi `<span>`. Pembungkus:

```jsx
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => onSelect(system.slug)}
      className="absolute appearance-none bg-transparent border-0 p-0 text-left"
      style={{
        left: position.x,
        top: position.y,
        width: position.width,
        height: position.height,
        transformStyle: 'preserve-3d',
        opacity: dimmed ? 0.34 : 1,
        transition: `opacity 700ms ${EASE}, transform 700ms ${EASE}`,
        transform: `translateZ(${lift}px)`,
      }}
    >
```

Label — `<button …>` jadi `<span>`, `type`, `aria-pressed` dan `onClick` dilepas karena sudah pindah ke pembungkus, `data-plate-label` tetap ada karena satu test membacanya:

```jsx
      <span
        data-plate-label
        className="absolute left-1/2 top-1/2 text-center whitespace-nowrap"
        style={{
          transform: `translateZ(${position.topZ + lift + 4}px) rotateZ(${-rotZ}deg) rotateX(-56deg) translate(-50%, -50%)`,
          textShadow: '0 1px 3px rgba(14,17,19,.9), 0 0 10px rgba(14,17,19,.75)',
        }}
      >
```

Tutup dengan `</span>` dan `</button>`.

- [ ] **Step 4: Jalankan seluruh suite**

```bash
npx vitest run
```

Diharapkan: PASS. `Shell.test.jsx` juga hijau — plate masih `role="button"`, cuma pindah elemen.

- [ ] **Step 5: Lint**

```bash
npx eslint src --max-warnings=0
```

- [ ] **Step 6: Verifikasi di browser**

Panel diemulasi 1280×800, `/sistem`, lalu lewat `javascript_tool`:

```js
const plate = document.querySelector('[data-plate-label]').closest('button');
plate.click();
({
  tag: plate.tagName,
  pressed: plate.getAttribute('aria-pressed'),
  layersInside: plate.querySelectorAll('[data-layer]').length,
  panel: document.querySelector('aside h2')?.textContent ?? null,
});
```

Diharapkan: `tag: "BUTTON"`, `layersInside` sama dengan jumlah stack sistem itu, dan `panel` berisi nama sistem yang diklik. `element.click()`, bukan klik berbasis koordinat — di panel yang diemulasi lebih besar dari dirinya, koordinat mendarat di tempat lain tanpa error.

- [ ] **Step 7: Commit**

```bash
git add src/components/shell/Plate.jsx src/components/shell/__tests__/Plate.test.jsx
git commit -m "feat(map): make the whole plate the control, not just its label"
```

---

## Task 4: `useMapCamera` — pindahkan seret, tanpa mengubah perilakunya

Ekstraksi murni. Sesudah task ini peta harus terasa persis sama.

**Files:**
- Create: `src/lib/shell/useMapCamera.js`
- Test: `src/lib/shell/__tests__/useMapCamera.test.jsx`
- Modify: `src/components/shell/MapScene.jsx`

- [ ] **Step 1: Tulis test yang gagal**

Buat `src/lib/shell/__tests__/useMapCamera.test.jsx`:

```jsx
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useMapCamera } from '@/lib/shell/useMapCamera';
import { CAMERA_ANGLES } from '@/lib/shell/layout';

// Probe: hook ini tidak menggambar apa pun sendiri, jadi yang diuji adalah
// angka yang dikeluarkannya, bukan rupa apa pun.
function Probe() {
  const camera = useMapCamera();
  return (
    <div data-testid="pane" {...camera.handlers}>
      <output data-testid="rot">{camera.rotZ.toFixed(2)}</output>
    </div>
  );
}

const rot = () => Number(screen.getByTestId('rot').textContent);

describe('useMapCamera', () => {
  it('starts at the angle the map has always opened on', () => {
    render(<Probe />);
    expect(rot()).toBe(-40);
  });

  it('follows the pointer one to one while it is down', () => {
    render(<Probe />);
    const pane = screen.getByTestId('pane');
    fireEvent.pointerDown(pane, { clientX: 200 });
    fireEvent.pointerMove(pane, { clientX: 300 });
    expect(rot()).toBeCloseTo(-40 + 100 * 0.22, 5);
  });

  it('ignores a pointer that never went down', () => {
    render(<Probe />);
    fireEvent.pointerMove(screen.getByTestId('pane'), { clientX: 300 });
    expect(rot()).toBe(-40);
  });

  it('snaps to one of the three camera angles when the pointer lifts', () => {
    render(<Probe />);
    const pane = screen.getByTestId('pane');
    fireEvent.pointerDown(pane, { clientX: 200 });
    fireEvent.pointerMove(pane, { clientX: 260 });
    fireEvent.pointerUp(pane);
    expect(CAMERA_ANGLES).toContain(rot());
  });

  it('snaps the same way when the pointer is cancelled', () => {
    render(<Probe />);
    const pane = screen.getByTestId('pane');
    fireEvent.pointerDown(pane, { clientX: 200 });
    fireEvent.pointerMove(pane, { clientX: 260 });
    fireEvent.pointerCancel(pane);
    expect(CAMERA_ANGLES).toContain(rot());
  });
});
```

- [ ] **Step 2: Jalankan, pastikan gagal**

```bash
npx vitest run src/lib/shell/__tests__/useMapCamera.test.jsx
```

Diharapkan: FAIL — `Failed to resolve import "@/lib/shell/useMapCamera"`.

- [ ] **Step 3: Implementasi hook**

Buat `src/lib/shell/useMapCamera.js`:

```js
"use client";

import { useRef, useState } from 'react';
import { snapRotation } from './layout';

// Kamera peta, dan satu-satunya tempat yang tahu bagaimana ia digerakkan.
// Ia tidak tahu apa itu warna, dan tidak tahu plate mana yang terpilih.
//
// Kontrak geraknya terbelah, seperti sisa proyek ini: selama jari menempel,
// 1:1 tanpa easing.

const DRAG_PER_PX = 0.22;
const START_ANGLE = -40;

export function useMapCamera(initial = START_ANGLE) {
  const [rotZ, setRotZ] = useState(initial);
  const drag = useRef(null);

  const onPointerDown = (e) => {
    drag.current = { x: e.clientX, rot: rotZ };
  };

  const onPointerMove = (e) => {
    if (!drag.current) return;
    setRotZ(drag.current.rot + (e.clientX - drag.current.x) * DRAG_PER_PX);
  };

  const endDrag = () => {
    if (!drag.current) return;
    drag.current = null;
    setRotZ((r) => snapRotation(r));
  };

  return {
    rotZ,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
    },
  };
}
```

- [ ] **Step 4: Pakai di `MapScene`**

Di `src/components/shell/MapScene.jsx`: hapus `useState` untuk `rotZ`, `drag`, `onPointerDown`, `onPointerMove`, `endDrag`. Tambahkan import:

```js
import { useMapCamera } from '@/lib/shell/useMapCamera';
```

Di badan komponen, ganti bagian kamera dengan:

```js
  const camera = useMapCamera();
```

Pane menerima handler sebagai satu sebaran, menggantikan empat prop `onPointer*`:

```jsx
        {...camera.handlers}
```

Ganti tiap `rotZ` yang tersisa di JSX dengan `camera.rotZ` — ada di `transform` grup, di transform label tahun, dan di prop `rotZ` yang diteruskan ke `Plate`.

`useState` masih dipakai untuk `scale`, jadi importnya tetap. `useRef` tidak dipakai lagi untuk drag tapi masih dipakai `paneRef`; `snapRotation` **tidak lagi** diimpor di sini — hapus dari daftar import `@/lib/shell/layout`.

- [ ] **Step 5: Jalankan seluruh suite**

```bash
npx vitest run
```

Diharapkan: PASS, termasuk 5 test baru.

- [ ] **Step 6: Lint**

```bash
npx eslint src --max-warnings=0
```

Diharapkan bersih. Kalau ESLint mengeluh `snapRotation` tidak dipakai di `MapScene.jsx`, importnya belum dihapus.

- [ ] **Step 7: Verifikasi di browser**

`/sistem` pada 1280×800, lewat `javascript_tool`. Seret disintesis lewat `dispatchEvent`, bukan koordinat:

```js
const pane = document.querySelector('[data-testid="map-pane"]');
const group = pane.querySelector('[role="group"]');
const before = group.style.transform;
const fire = (type, x) => pane.dispatchEvent(
  new PointerEvent(type, { clientX: x, bubbles: true, pointerId: 1 }),
);
fire('pointerdown', 400);
fire('pointermove', 500);
const during = group.style.transform;
fire('pointerup', 500);
({ before, during, after: group.style.transform });
```

Diharapkan: `before` berisi `rotateZ(-40deg)`, `during` berisi `rotateZ(-18deg)` (`-40 + 100 × 0.22`), `after` berisi salah satu dari `-55`, `-40`, `-25`. Perilakunya identik dengan sebelum ekstraksi.

- [ ] **Step 8: Commit**

```bash
git add src/lib/shell/useMapCamera.js src/lib/shell/__tests__/useMapCamera.test.jsx src/components/shell/MapScene.jsx
git commit -m "refactor(map): give the camera its own home"
```

---

## Task 5: Roda memutar kamera

**Files:**
- Modify: `src/lib/shell/useMapCamera.js`
- Test: `src/lib/shell/__tests__/useMapCamera.test.jsx`

- [ ] **Step 1: Tulis test yang gagal**

Tambahkan ke `describe('useMapCamera', …)` di `src/lib/shell/__tests__/useMapCamera.test.jsx`:

```jsx
  it('turns the camera with the wheel, one to one', () => {
    render(<Probe />);
    fireEvent.wheel(screen.getByTestId('pane'), { deltaY: 100, deltaX: 0 });
    expect(rot()).toBeCloseTo(-40 + 100 * 0.12, 5);
  });

  it('turns the other way for the other direction', () => {
    render(<Probe />);
    fireEvent.wheel(screen.getByTestId('pane'), { deltaY: -100, deltaX: 0 });
    expect(rot()).toBeCloseTo(-40 - 100 * 0.12, 5);
  });

  it('lets a sideways trackpad swipe win over the smaller vertical drift', () => {
    render(<Probe />);
    fireEvent.wheel(screen.getByTestId('pane'), { deltaX: 100, deltaY: 8 });
    expect(rot()).toBeCloseTo(-40 + 100 * 0.12, 5);
  });

  it('keeps the wheel when the vertical delta is the larger one', () => {
    render(<Probe />);
    fireEvent.wheel(screen.getByTestId('pane'), { deltaX: 8, deltaY: 100 });
    expect(rot()).toBeCloseTo(-40 + 100 * 0.12, 5);
  });

  it('adds up across several notches', () => {
    render(<Probe />);
    const pane = screen.getByTestId('pane');
    fireEvent.wheel(pane, { deltaY: 100, deltaX: 0 });
    fireEvent.wheel(pane, { deltaY: 100, deltaX: 0 });
    expect(rot()).toBeCloseTo(-40 + 24, 5);
  });
```

- [ ] **Step 2: Jalankan, pastikan gagal**

```bash
npx vitest run src/lib/shell/__tests__/useMapCamera.test.jsx
```

Diharapkan: FAIL — `rot()` tetap `-40`, karena `onWheel` belum ada di `handlers`.

- [ ] **Step 3: Implementasi**

Di `src/lib/shell/useMapCamera.js`, tambahkan konstanta di sebelah `DRAG_PER_PX`:

```js
const WHEEL_PER_UNIT = 0.12;
```

Tambahkan handler sebelum `return`:

```js
  // Sumbu yang dominan menang: geser dua jari mendatar di trackpad mengirim
  // deltaX, roda tetikus mengirim deltaY, dan keduanya berarti hal yang sama di
  // sini. Tanpa preventDefault — React memasang wheel sebagai passive, dan
  // cangkang overflow-hidden jadi tidak ada gulir yang perlu dicegah.
  const onWheel = (e) => {
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    setRotZ((r) => r + delta * WHEEL_PER_UNIT);
  };
```

Tambahkan `onWheel` ke objek `handlers`.

- [ ] **Step 4: Jalankan seluruh suite**

```bash
npx vitest run
```

Diharapkan: PASS.

- [ ] **Step 5: Lint**

```bash
npx eslint src --max-warnings=0
```

- [ ] **Step 6: Verifikasi di browser**

`/sistem` pada 1280×800:

```js
const pane = document.querySelector('[data-testid="map-pane"]');
const group = pane.querySelector('[role="group"]');
const rail = document.querySelector('[data-testid="map-pane"]')
  .parentElement.parentElement.querySelector('aside, [class*="overflow-y-auto"]');
const railTop = rail ? rail.scrollTop : null;
const before = group.style.transform;
pane.dispatchEvent(new WheelEvent('wheel', { deltaY: 100, deltaX: 0, bubbles: true }));
({ before, after: group.style.transform, railScrollUnchanged: rail ? rail.scrollTop === railTop : 'no rail' });
```

Diharapkan: `after` berisi `rotateZ(-28deg)` (`-40 + 12`), dan gulir rail tidak ikut bergerak. Roda di atas rail tetap menggulir rail seperti biasa — handler-nya cuma di pane peta.

- [ ] **Step 7: Commit**

```bash
git add src/lib/shell/useMapCamera.js src/lib/shell/__tests__/useMapCamera.test.jsx
git commit -m "feat(map): let the wheel turn the camera"
```

---

## Task 6: Diam lalu menyentak, dan snap yang teranimasi

**Files:**
- Modify: `src/lib/shell/useMapCamera.js`
- Modify: `src/components/shell/MapScene.jsx`
- Test: `src/lib/shell/__tests__/useMapCamera.test.jsx`

- [ ] **Step 1: Tulis test yang gagal**

Tambahkan `vi` ke import vitest di kepala berkas test:

```js
import { describe, it, expect, vi, afterEach } from 'vitest';
```

Tambahkan `settling` ke probe supaya bisa dibaca. Ganti `Probe`:

```jsx
function Probe() {
  const camera = useMapCamera();
  return (
    <div data-testid="pane" {...camera.handlers}>
      <output data-testid="rot">{camera.rotZ.toFixed(2)}</output>
      <output data-testid="settling">{String(camera.settling)}</output>
    </div>
  );
}

const rot = () => Number(screen.getByTestId('rot').textContent);
const settling = () => screen.getByTestId('settling').textContent === 'true';
```

Tambahkan test baru:

```jsx
  afterEach(() => {
    vi.useRealTimers();
  });

  it('holds the angle the wheel left it on until the wheel goes quiet', () => {
    vi.useFakeTimers();
    render(<Probe />);
    fireEvent.wheel(screen.getByTestId('pane'), { deltaY: 100, deltaX: 0 });
    act(() => { vi.advanceTimersByTime(100); });
    expect(rot()).toBeCloseTo(-28, 5);
  });

  it('snaps once the wheel has been quiet long enough', () => {
    vi.useFakeTimers();
    render(<Probe />);
    fireEvent.wheel(screen.getByTestId('pane'), { deltaY: 100, deltaX: 0 });
    act(() => { vi.advanceTimersByTime(180); });
    expect(CAMERA_ANGLES).toContain(rot());
  });

  it('starts the quiet count again on every notch', () => {
    vi.useFakeTimers();
    render(<Probe />);
    const pane = screen.getByTestId('pane');
    fireEvent.wheel(pane, { deltaY: 100, deltaX: 0 });
    act(() => { vi.advanceTimersByTime(170); });
    fireEvent.wheel(pane, { deltaY: 100, deltaX: 0 });
    act(() => { vi.advanceTimersByTime(170); });
    expect(rot()).toBeCloseTo(-16, 5);
  });

  it('says it is settling only while the snap runs', () => {
    vi.useFakeTimers();
    render(<Probe />);
    const pane = screen.getByTestId('pane');
    expect(settling()).toBe(false);
    fireEvent.wheel(pane, { deltaY: 100, deltaX: 0 });
    expect(settling()).toBe(false);
    act(() => { vi.advanceTimersByTime(180); });
    expect(settling()).toBe(true);
    act(() => { vi.advanceTimersByTime(700); });
    expect(settling()).toBe(false);
  });

  it('settles the moment the pointer lifts, without waiting', () => {
    vi.useFakeTimers();
    render(<Probe />);
    const pane = screen.getByTestId('pane');
    fireEvent.pointerDown(pane, { clientX: 200 });
    fireEvent.pointerMove(pane, { clientX: 260 });
    fireEvent.pointerUp(pane);
    expect(settling()).toBe(true);
    expect(CAMERA_ANGLES).toContain(rot());
  });
```

Tambahkan `act` ke import Testing Library:

```js
import { render, screen, fireEvent, act } from '@testing-library/react';
```

- [ ] **Step 2: Jalankan, pastikan gagal**

```bash
npx vitest run src/lib/shell/__tests__/useMapCamera.test.jsx
```

Diharapkan: FAIL — `settling` selalu `undefined` dan roda tidak pernah menyentak.

- [ ] **Step 3: Implementasi**

Di `src/lib/shell/useMapCamera.js`, tambahkan import `useCallback` dan `useEffect`:

```js
import { useCallback, useEffect, useRef, useState } from 'react';
```

Tambahkan konstanta:

```js
const SETTLE_MS = 180;
const EASE_MS = 700;
```

Tambahkan state dan ref di bawah `drag`:

```js
  const [settling, setSettling] = useState(false);
  const quiet = useRef(null);
  const done = useRef(null);
```

Tambahkan fungsi settle dan pembersihnya:

```js
  // Snap bukan jari; itu mesin yang bergerak sendiri, jadi ia dapat 700ms
  // seperti semua gerak lain yang tidak diseret. `settling` cuma menyala selama
  // itu — MapScene memakainya untuk menyalakan transition, lalu mematikannya
  // lagi supaya seretan berikutnya tetap 1:1.
  const settle = useCallback(() => {
    setSettling(true);
    setRotZ((r) => snapRotation(r));
    clearTimeout(done.current);
    done.current = setTimeout(() => setSettling(false), EASE_MS);
  }, []);

  useEffect(() => () => {
    clearTimeout(quiet.current);
    clearTimeout(done.current);
  }, []);
```

Ganti `endDrag` supaya memakai `settle`:

```js
  const endDrag = () => {
    if (!drag.current) return;
    drag.current = null;
    clearTimeout(quiet.current);
    settle();
  };
```

Ganti `onPointerDown` supaya seretan baru membatalkan snap yang sedang berjalan:

```js
  const onPointerDown = (e) => {
    clearTimeout(quiet.current);
    clearTimeout(done.current);
    setSettling(false);
    drag.current = { x: e.clientX, rot: rotZ };
  };
```

Ganti `onWheel` supaya menghidupkan hitungan diam:

```js
  const onWheel = (e) => {
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    clearTimeout(quiet.current);
    clearTimeout(done.current);
    setSettling(false);
    setRotZ((r) => r + delta * WHEEL_PER_UNIT);
    quiet.current = setTimeout(settle, SETTLE_MS);
  };
```

Kembalikan `settling` bersama `rotZ`:

```js
  return {
    rotZ,
    settling,
    handlers: { onPointerDown, onPointerMove, onPointerUp: endDrag, onPointerCancel: endDrag, onWheel },
  };
```

- [ ] **Step 4: Nyalakan transisinya di `MapScene`**

Grup peta sengaja tidak punya `transition` — itu benar selama jari yang menggerakkan. Sekarang ia punya satu, dan hanya selama `settling`. Di `src/components/shell/MapScene.jsx`, pada `style` grup ber-`role="group"`:

```jsx
            style={{
              transformStyle: 'preserve-3d',
              transform: `rotateX(56deg) rotateZ(${camera.rotZ}deg)`,
              transition: camera.settling
                ? 'transform 700ms var(--nav-ease)'
                : 'none',
            }}
```

- [ ] **Step 5: Jalankan seluruh suite**

```bash
npx vitest run
```

Diharapkan: PASS.

- [ ] **Step 6: Lint**

```bash
npx eslint src --max-warnings=0
```

- [ ] **Step 7: Verifikasi di browser**

`/sistem` pada 1280×800. Roda sekali, baca transisi sebelum dan sesudah 180ms:

```js
const pane = document.querySelector('[data-testid="map-pane"]');
const group = pane.querySelector('[role="group"]');
pane.dispatchEvent(new WheelEvent('wheel', { deltaY: 100, deltaX: 0, bubbles: true }));
const duringWheel = { t: group.style.transform, tr: group.style.transition };
await new Promise((r) => setTimeout(r, 400));
({ duringWheel, afterQuiet: { t: group.style.transform, tr: group.style.transition } });
```

Diharapkan: `duringWheel.tr` `"none"` dengan `rotateZ(-28deg)`; `afterQuiet.tr` berisi `700ms` dan `afterQuiet.t` mendarat di `-25deg`. `setTimeout`, bukan `requestAnimationFrame` — rAF menggantung waktu panel tersembunyi, dan satu rAF yang tergantung meracuni sisa sesi halaman itu.

- [ ] **Step 8: Commit**

```bash
git add src/lib/shell/useMapCamera.js src/lib/shell/__tests__/useMapCamera.test.jsx src/components/shell/MapScene.jsx
git commit -m "feat(map): ease the camera home instead of jumping it"
```

---

## Task 7: Seret tidak boleh memilih sistem

**Files:**
- Modify: `src/lib/shell/useMapCamera.js`
- Modify: `src/components/shell/MapScene.jsx`
- Test: `src/lib/shell/__tests__/useMapCamera.test.jsx`
- Test: `src/components/shell/__tests__/MapScene.test.jsx` (baru)

- [ ] **Step 1: Tulis test hook yang gagal**

Tambahkan `dragged` ke probe di `src/lib/shell/__tests__/useMapCamera.test.jsx`:

```jsx
      <output data-testid="dragged">{String(camera.dragged())}</output>
```

```js
const dragged = () => screen.getByTestId('dragged').textContent === 'true';
```

Test baru:

```jsx
  it('does not call a small wobble a drag', () => {
    render(<Probe />);
    const pane = screen.getByTestId('pane');
    fireEvent.pointerDown(pane, { clientX: 200 });
    fireEvent.pointerMove(pane, { clientX: 202 });
    fireEvent.pointerUp(pane);
    expect(dragged()).toBe(false);
  });

  it('calls a real sweep a drag', () => {
    render(<Probe />);
    const pane = screen.getByTestId('pane');
    fireEvent.pointerDown(pane, { clientX: 200 });
    fireEvent.pointerMove(pane, { clientX: 240 });
    fireEvent.pointerUp(pane);
    expect(dragged()).toBe(true);
  });

  it('forgets the last drag when a new press begins', () => {
    render(<Probe />);
    const pane = screen.getByTestId('pane');
    fireEvent.pointerDown(pane, { clientX: 200 });
    fireEvent.pointerMove(pane, { clientX: 240 });
    fireEvent.pointerUp(pane);
    fireEvent.pointerDown(pane, { clientX: 200 });
    expect(dragged()).toBe(false);
  });

  it('counts the distance travelled, not the distance from the start', () => {
    render(<Probe />);
    const pane = screen.getByTestId('pane');
    fireEvent.pointerDown(pane, { clientX: 200 });
    fireEvent.pointerMove(pane, { clientX: 230 });
    fireEvent.pointerMove(pane, { clientX: 200 });
    fireEvent.pointerUp(pane);
    expect(dragged()).toBe(true);
  });
```

- [ ] **Step 2: Tulis test `MapScene` yang gagal**

Buat `src/components/shell/__tests__/MapScene.test.jsx`:

```jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MapScene from '@/components/shell/MapScene';

const systems = [
  {
    slug: 'hris-nirwana', client: 'RSU Nirwana', year: '2026', access: 'internal',
    tier: 'full', tech: ['Laravel', 'Livewire', 'Alpine.js', 'MySQL', 'TensorFlow.js'],
    shortName: { id: 'HRIS', en: 'HRIS' },
  },
];

const renderScene = (props = {}) =>
  render(
    <MapScene
      systems={systems} locale="id" selected={null}
      dimmed={new Set()} onSelect={vi.fn()} {...props}
    />,
  );

describe('MapScene', () => {
  it('selects the system when a plate is pressed without dragging', () => {
    const onSelect = vi.fn();
    renderScene({ onSelect });
    fireEvent.click(screen.getByRole('button', { name: /HRIS/ }));
    expect(onSelect).toHaveBeenCalledWith('hris-nirwana');
  });

  it('swallows the click that ends a drag across the map', () => {
    const onSelect = vi.fn();
    renderScene({ onSelect });
    const pane = screen.getByTestId('map-pane');
    fireEvent.pointerDown(pane, { clientX: 200 });
    fireEvent.pointerMove(pane, { clientX: 260 });
    fireEvent.pointerUp(pane);
    fireEvent.click(screen.getByRole('button', { name: /HRIS/ }));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('lets the next press through once the drag is over', () => {
    const onSelect = vi.fn();
    renderScene({ onSelect });
    const pane = screen.getByTestId('map-pane');
    fireEvent.pointerDown(pane, { clientX: 200 });
    fireEvent.pointerMove(pane, { clientX: 260 });
    fireEvent.pointerUp(pane);
    fireEvent.pointerDown(pane, { clientX: 300 });
    fireEvent.pointerUp(pane);
    fireEvent.click(screen.getByRole('button', { name: /HRIS/ }));
    expect(onSelect).toHaveBeenCalledWith('hris-nirwana');
  });
});
```

- [ ] **Step 3: Jalankan keduanya, pastikan gagal**

```bash
npx vitest run src/lib/shell/__tests__/useMapCamera.test.jsx src/components/shell/__tests__/MapScene.test.jsx
```

Diharapkan: FAIL — `camera.dragged is not a function`, dan test penelan klik gagal karena `onSelect` tetap terpanggil.

- [ ] **Step 4: Implementasi di hook**

Di `src/lib/shell/useMapCamera.js`, tambahkan konstanta:

```js
const CLICK_SLOP = 4;
```

Tambahkan ref di bawah `drag`:

```js
  const travelled = useRef(0);
```

Di `onPointerDown`, nolkan sebelum menyimpan titik awal:

```js
    travelled.current = 0;
```

Di `onPointerMove`, akumulasi jarak yang ditempuh — bukan jarak dari titik awal, karena seret bolak-balik yang berakhir di tempat semula tetap seret:

```js
  const onPointerMove = (e) => {
    if (!drag.current) return;
    travelled.current += Math.abs(e.clientX - drag.current.last);
    drag.current.last = e.clientX;
    setRotZ(drag.current.rot + (e.clientX - drag.current.x) * DRAG_PER_PX);
  };
```

`drag.current` sekarang menyimpan `last`, jadi `onPointerDown` jadi:

```js
    drag.current = { x: e.clientX, last: e.clientX, rot: rotZ };
```

Tambahkan pembacanya dan kembalikan bersama yang lain:

```js
  // Dibaca oleh MapScene di onClick, yang menyala sesudah pointerup. Ref, bukan
  // state: kalau ia memicu render, angkanya sudah berubah sebelum klik sampai.
  const dragged = () => travelled.current > CLICK_SLOP;
```

```js
  return { rotZ, settling, dragged, handlers: { … } };
```

- [ ] **Step 5: Implementasi di `MapScene`**

Di `src/components/shell/MapScene.jsx`, tambahkan pembungkus di atas `return`:

```js
  // Seret yang kebetulan berakhir di atas plate tidak memilih sistem.
  const select = (slug) => {
    if (camera.dragged()) return;
    onSelect(slug);
  };
```

Teruskan `select`, bukan `onSelect`, ke `Plate`:

```jsx
                onSelect={select}
```

- [ ] **Step 6: Jalankan seluruh suite**

```bash
npx vitest run
```

Diharapkan: PASS.

- [ ] **Step 7: Lint**

```bash
npx eslint src --max-warnings=0
```

- [ ] **Step 8: Verifikasi di browser**

`/sistem` pada 1280×800. Muat ulang halaman lebih dulu supaya tidak ada state sisa dari pengukuran sebelumnya:

```js
const pane = document.querySelector('[data-testid="map-pane"]');
const plate = document.querySelector('[data-plate-label]').closest('button');
const name = () => document.querySelector('aside h2')?.textContent ?? null;
const fire = (type, x) => pane.dispatchEvent(
  new PointerEvent(type, { clientX: x, bubbles: true, pointerId: 1 }),
);
fire('pointerdown', 400); fire('pointermove', 460); fire('pointerup', 460);
plate.click();
const afterDrag = name();
fire('pointerdown', 400); fire('pointerup', 400);
plate.click();
({ afterDrag, afterTap: name() });
```

Diharapkan: `afterDrag` `null` — panel masih blok catatan, tidak ada yang terpilih. `afterTap` berisi nama sistem.

- [ ] **Step 9: Commit**

```bash
git add src/lib/shell/useMapCamera.js src/lib/shell/__tests__/useMapCamera.test.jsx src/components/shell/MapScene.jsx src/components/shell/__tests__/MapScene.test.jsx
git commit -m "feat(map): stop a sweep of the camera from picking a system"
```

---

## Task 8: Tumpukan membuka waktu hover, fokus, dan terpilih

**Files:**
- Modify: `src/components/shell/Plate.jsx`
- Test: `src/components/shell/__tests__/Plate.test.jsx`

- [ ] **Step 1: Tulis test yang gagal**

Tambahkan ke `describe('Plate', …)`:

```jsx
  // 4 x 7 rapat, 4 x 11 terbuka: lapis teratas dari lima lapis.
  const topLayerZ = (container) => {
    const layers = container.querySelectorAll('[data-layer]');
    return layers[layers.length - 1].getAttribute('style');
  };

  it('keeps the stack tight until something asks for it', () => {
    const { container } = renderPlate();
    expect(topLayerZ(container)).toContain('translateZ(28px)');
  });

  it('opens the stack under the pointer', () => {
    const { container } = renderPlate();
    fireEvent.pointerEnter(container.firstChild);
    expect(topLayerZ(container)).toContain('translateZ(44px)');
  });

  it('closes it again when the pointer leaves', () => {
    const { container } = renderPlate();
    fireEvent.pointerEnter(container.firstChild);
    fireEvent.pointerLeave(container.firstChild);
    expect(topLayerZ(container)).toContain('translateZ(28px)');
  });

  it('opens the stack for the keyboard too', () => {
    const { container } = renderPlate();
    fireEvent.focus(container.firstChild);
    expect(topLayerZ(container)).toContain('translateZ(44px)');
  });

  it('keeps the selected plate open with no pointer on it', () => {
    const { container } = renderPlate({ selected: true });
    expect(topLayerZ(container)).toContain('translateZ(44px)');
  });

  it('carries its label up with the stack', () => {
    const { container } = renderPlate();
    const label = () => container.querySelector('[data-plate-label]').getAttribute('style');
    expect(label()).toContain('translateZ(32px)');
    fireEvent.pointerEnter(container.firstChild);
    expect(label()).toContain('translateZ(54px)');
  });

  it('lifts a selected plate further than a hovered one', () => {
    const { container } = renderPlate({ selected: true });
    expect(container.firstChild.getAttribute('style')).toContain('translateZ(10px)');
  });
```

Tambahkan `fireEvent` ke import Testing Library di berkas itu:

```js
import { render, screen, fireEvent } from '@testing-library/react';
```

Angka-angkanya: rapat `4 × 7 = 28`, label `28 + 0 + 4 = 32`. Terbuka lewat hover `4 × 11 = 44`, label `44 + 6 + 4 = 54`. Terpilih mengangkat plate 10px.

- [ ] **Step 2: Jalankan, pastikan gagal**

```bash
npx vitest run src/components/shell/__tests__/Plate.test.jsx
```

Diharapkan: FAIL — `translateZ` lapis teratas tetap `28px` sesudah `pointerEnter`.

- [ ] **Step 3: Implementasi**

Di `src/components/shell/Plate.jsx`, tambahkan import dan konstanta:

```js
import { useState } from 'react';
```

```js
const STEP_TIGHT = 7;
const STEP_OPEN = 11;
const LIFT_HOVER = 6;
const LIFT_SELECTED = 10;
```

Ganti perhitungan `lift` di badan komponen:

```js
  // Fokus keyboard dapat perlakuan yang sama dengan tetikus: kalau tumpukan
  // membuka untuk yang satu, ia membuka untuk yang lain.
  const [active, setActive] = useState(false);
  const open = active || selected;

  const step = open ? STEP_OPEN : STEP_TIGHT;
  const lift = selected ? LIFT_SELECTED : (active ? LIFT_HOVER : 0);
  // Bukan position.topZ: itu dihitung dari langkah rapat di layout.js, dan
  // label harus ikut naik waktu tumpukan membuka.
  const topZ = (position.layers - 1) * step;
```

Tambahkan empat handler ke `<button>`:

```jsx
      onPointerEnter={() => setActive(true)}
      onPointerLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
```

Ganti `transform` lapis dan tambahkan transisinya:

```jsx
              transform: `translateZ(${i * step}px)`,
              transition: `transform 700ms ${EASE}, border-color 180ms linear`,
```

Ganti `position.topZ` di transform label dengan `topZ`:

```jsx
          transform: `translateZ(${topZ + lift + 4}px) rotateZ(${-rotZ}deg) rotateX(-56deg) translate(-50%, -50%)`,
```

`position.layerStep` tidak dipakai lagi oleh `Plate`. Biarkan `layout.js` tetap mengekspornya — `topZ` dan `layerStep` masih benar sebagai tinggi rapat, dan `layout.test.js` masih menguji keduanya.

- [ ] **Step 4: Jalankan seluruh suite**

```bash
npx vitest run
```

Diharapkan: PASS.

- [ ] **Step 5: Lint**

```bash
npx eslint src --max-warnings=0
```

- [ ] **Step 6: Verifikasi di browser**

`happy-dom` tidak menata letak, jadi test di atas cuma membaca string yang ditulis sendiri. Yang membuktikan tumpukan benar-benar membuka ada di sini:

```js
const plate = document.querySelector('[data-plate-label]').closest('button');
const layers = plate.querySelectorAll('[data-layer]');
const top = layers[layers.length - 1];
const box = () => Math.round(top.getBoundingClientRect().top);
const tight = box();
plate.dispatchEvent(new PointerEvent('pointerenter', { bubbles: false }));
await new Promise((r) => setTimeout(r, 800));
const open = box();
({ tight, open, rose: tight - open, transition: getComputedStyle(top).transitionDuration });
```

Diharapkan: `rose` sebuah angka positif — lapis teratas benar-benar naik di layar, bukan cuma di string transform. `transition` berisi `0.7s`. Kalau `rose` nol, konteks 3D-nya rata dan hasil Task 1 perlu ditinjau ulang.

- [ ] **Step 7: Commit**

```bash
git add src/components/shell/Plate.jsx src/components/shell/__tests__/Plate.test.jsx
git commit -m "feat(map): open the stack under the pointer and under focus"
```

---

## Task 9: Tepi lapis mengikuti sudut kamera

**Files:**
- Modify: `src/components/shell/Plate.jsx`
- Test: `src/components/shell/__tests__/Plate.test.jsx`

- [ ] **Step 1: Tulis test yang gagal**

Tambahkan ke `describe('Plate', …)`:

```jsx
  it('gives each side of a layer its own edge colour', () => {
    const { container } = renderPlate();
    const style = container.querySelector('[data-layer]').getAttribute('style');
    ['border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color']
      .forEach((prop) => expect(style).toContain(prop));
  });

  it('redraws those edges when the camera turns', () => {
    const { container, rerender } = renderPlate();
    const edges = () => container.querySelector('[data-layer]').getAttribute('style');
    const before = edges();
    rerender(
      <Plate
        system={system} position={pos} locale="id" rotZ={140}
        selected={false} dimmed={false} onSelect={vi.fn()}
      />,
    );
    expect(edges()).not.toBe(before);
  });

  it('still marks a public system in amber on its top layer', () => {
    const publicSystem = { ...system, access: 'public' };
    const { container } = render(
      <Plate
        system={publicSystem} position={pos} locale="id" rotZ={-40}
        selected={false} dimmed={false} onSelect={vi.fn()}
      />,
    );
    const layers = container.querySelectorAll('[data-layer]');
    const top = layers[layers.length - 1].getAttribute('style');
    expect(top.toLowerCase()).toContain('#c97b3f');
  });

  it('still marks the selected plate in cream on its top layer', () => {
    const { container } = renderPlate({ selected: true });
    const layers = container.querySelectorAll('[data-layer]');
    const top = layers[layers.length - 1].getAttribute('style');
    expect(top.toLowerCase()).toContain('#e8e0d0');
  });
```

- [ ] **Step 2: Jalankan, pastikan gagal**

```bash
npx vitest run src/components/shell/__tests__/Plate.test.jsx
```

Diharapkan: FAIL — `border-top-color` tidak ada; lapis masih memakai `border` seragam.

- [ ] **Step 3: Implementasi**

Di `src/components/shell/Plate.jsx`, tambahkan import:

```js
import { edgeTones } from '@/lib/shell/shading';
```

Hapus konstanta `PLATE_EDGE` — array warna tepi tetap itu digantikan `edgeTones`. `PLATE_BG` **tetap**: isi lapis tidak bereaksi, hanya tepinya.

Ganti badan `layers.map`:

```jsx
      {layers.map((i) => {
        const top = i === position.layers - 1;
        const bg = top && isPublic ? '#27302F' : PLATE_BG[Math.min(i, 4)];
        const tones = edgeTones({ index: i, layers: position.layers, rotZ });
        // Makna menang atas kedalaman: amber menandai akses publik, krem
        // menandai yang terpilih, dan keduanya menutupi seluruh tepi lapis atas.
        const flat = top && selected ? '#E8E0D0' : (top && isPublic ? '#C97B3F' : null);
        return (
          <div
            key={i}
            data-layer={i}
            className="absolute inset-0"
            style={{
              background: bg,
              borderStyle: 'solid',
              borderWidth: top && selected ? 2 : 1,
              borderTopColor: flat ?? tones.top,
              borderRightColor: flat ?? tones.right,
              borderBottomColor: flat ?? tones.bottom,
              borderLeftColor: flat ?? tones.left,
              transform: `translateZ(${i * step}px)`,
              transition: `transform 700ms ${EASE}, border-color 180ms linear`,
            }}
          />
        );
      })}
```

- [ ] **Step 4: Jalankan seluruh suite**

```bash
npx vitest run
```

Diharapkan: PASS.

- [ ] **Step 5: Lint**

```bash
npx eslint src --max-warnings=0
```

Diharapkan bersih. Kalau ESLint mengeluh `PLATE_EDGE` tidak dipakai, konstantanya belum dihapus.

- [ ] **Step 6: Verifikasi di browser**

Muat ulang `/sistem` lebih dulu. Ini yang membuktikan tepi benar-benar berubah waktu peta diputar, bukan cuma stringnya:

```js
const pane = document.querySelector('[data-testid="map-pane"]');
const layer = document.querySelector('[data-plate-label]')
  .closest('button').querySelector('[data-layer]');
const read = () => {
  const s = getComputedStyle(layer);
  return { left: s.borderLeftColor, right: s.borderRightColor };
};
const before = read();
pane.dispatchEvent(new WheelEvent('wheel', { deltaY: 700, deltaX: 0, bubbles: true }));
await new Promise((r) => setTimeout(r, 900));
({ before, after: read(), rotated: pane.querySelector('[role="group"]').style.transform });
```

Diharapkan: `before.left` berbeda dari `before.right`, dan `after` berbeda dari `before`. Semua nilai `rgb(...)` di dalam keluarga `#2A3236`–`#4C555A`, tidak ada yang lebih terang dari itu.

- [ ] **Step 7: Commit**

```bash
git add src/components/shell/Plate.jsx src/components/shell/__tests__/Plate.test.jsx
git commit -m "feat(map): turn the stack, not just its position"
```

---

## Task 10: Lapis naik bertahap waktu masuk

**Files:**
- Modify: `src/components/shell/Plate.jsx`
- Modify: `src/app/globals.css`
- Test: `src/components/shell/__tests__/Plate.test.jsx`

- [ ] **Step 1: Tulis test yang gagal**

Tambahkan ke `describe('Plate', …)`:

```jsx
  it('starts every layer flat on the ground', () => {
    const { container } = renderPlate();
    const styles = [...container.querySelectorAll('[data-layer]')]
      .map((l) => l.getAttribute('style'));
    // Sebelum timer mount berjalan, semuanya bertumpuk rata.
    expect(styles.every((s) => s.includes('translateZ(0px)'))).toBe(true);
  });

  it('raises them into place once mounted', async () => {
    const { container } = renderPlate();
    await waitFor(() => {
      const layers = container.querySelectorAll('[data-layer]');
      expect(layers[layers.length - 1].getAttribute('style')).toContain('translateZ(28px)');
    });
  });

  it('lets each layer follow the one below it', async () => {
    const { container } = renderPlate();
    await waitFor(() => {
      expect(container.querySelector('[data-layer]').getAttribute('style'))
        .toContain('transition-delay: 0ms');
    });
    const layers = container.querySelectorAll('[data-layer]');
    expect(layers[4].getAttribute('style')).toContain('transition-delay: 160ms');
  });
```

Tambahkan `waitFor` ke import Testing Library:

```js
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
```

Test lain di berkas ini yang membaca `translateZ` lapis — dari Task 8 dan 9 — sekarang membaca keadaan sebelum mount. Bungkus pembacaannya dalam `waitFor` yang sama, atau tambahkan `await waitFor(() => expect(container.querySelector('[data-layer]').getAttribute('style')).toContain('translateZ(0px)') === false)` sebelum assertion. Cara termurah: ubah `topLayerZ` jadi menunggu.

```jsx
  const settled = async (container) => {
    await waitFor(() => {
      const layers = container.querySelectorAll('[data-layer]');
      expect(layers[layers.length - 1].getAttribute('style')).not.toContain('translateZ(0px)');
    });
    const layers = container.querySelectorAll('[data-layer]');
    return layers[layers.length - 1].getAttribute('style');
  };
```

Ganti tiap pemakaian `topLayerZ(container)` di Task 8 dengan `await settled(container)`, dan jadikan test-test itu `async`.

- [ ] **Step 2: Jalankan, pastikan gagal**

```bash
npx vitest run src/components/shell/__tests__/Plate.test.jsx
```

Diharapkan: FAIL — lapis langsung berada di tempatnya, tidak pernah `translateZ(0px)`, dan tidak ada `transition-delay`.

- [ ] **Step 3: Implementasi**

Di `src/components/shell/Plate.jsx`, tambahkan `useEffect` ke import React dan konstanta:

```js
import { useEffect, useState } from 'react';
```

```js
const STAGGER_MS = 40;
```

Tambahkan state dan efeknya di badan komponen:

```js
  // Lapis naik ke tempatnya berurutan waktu peta pertama muncul. setTimeout,
  // bukan requestAnimationFrame: rAF menggantung waktu panel browser
  // tersembunyi, dan satu rAF yang tergantung meracuni sisa sesi halaman itu.
  //
  // Mount saja. Delapan plate yang mengulang ini tiap chip filter ditekan itu
  // kebisingan, dan peredupan filter sudah punya bahasanya sendiri.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);
```

Ubah `transform` dan tambahkan `transitionDelay` di lapis:

```jsx
              transform: `translateZ(${mounted ? i * step : 0}px)`,
              transition: `transform 700ms ${EASE}, border-color 180ms linear`,
              transitionDelay: `${i * STAGGER_MS}ms`,
```

- [ ] **Step 4: Nolkan delay untuk gerak yang dikurangi**

Di `src/app/globals.css`, di dalam blok `@media (prefers-reduced-motion: reduce)`, tambahkan satu baris ke aturan `*, *::before, *::after`:

```css
    transition-delay: 0ms !important;
```

Tanpa baris ini durasi memang jadi 0.01ms sementara lapis kelima tetap menunggu 160ms — gerak yang dikurangi berubah jadi kedipan bertahap.

- [ ] **Step 5: Jalankan seluruh suite**

```bash
npx vitest run
```

Diharapkan: PASS. Perkiraan totalnya sekitar 180 test.

- [ ] **Step 6: Lint**

```bash
npx eslint src --max-warnings=0
```

- [ ] **Step 7: Verifikasi di browser**

`globals.css` berubah. Kalau tokennya terlihat basi, minta Utsman:

> Hentikan server dengan `Ctrl+C`, lalu di PowerShell:
> ```powershell
> Remove-Item -Recurse -Force .next
> ```
> lalu jalankan lagi.

Muat ulang `/sistem`, lalu:

```js
const layer = document.querySelector('[data-plate-label]')
  .closest('button').querySelectorAll('[data-layer]');
({
  delays: [...layer].map((l) => getComputedStyle(l).transitionDelay),
  reduced: matchMedia('(prefers-reduced-motion: reduce)').matches,
});
```

Diharapkan waktu animasi Windows menyala: `["0s", "0.04s", "0.08s", "0.12s", "0.16s"]`, `reduced: false`.

Untuk sisi reduced-motion, `prefers-reduced-motion` ikut setelan OS. Periksa lewat **PowerShell**, bukan Bash:

```powershell
$m = (Get-ItemProperty 'HKCU:\Control Panel\Desktop').UserPreferencesMask; $m[0]
```

`0x9E` berarti animasi menyala, `0x90` berarti mati. Kalau Utsman mau membuktikan sisi ini, minta ia mematikan "Animation effects" di Windows, muat ulang, lalu `delays` harus jadi lima `"0s"`.

- [ ] **Step 8: Commit**

```bash
git add src/components/shell/Plate.jsx src/components/shell/__tests__/Plate.test.jsx src/app/globals.css
git commit -m "feat(map): raise the stack layer by layer on arrival"
```

---

## Task 11: Verifikasi menyeluruh dan perbarui `docs/PROGRESS.md`

**Files:**
- Modify: `docs/PROGRESS.md`

- [ ] **Step 1: Suite penuh, lint, build**

```bash
npx vitest run
```

```bash
npx eslint src --max-warnings=0
```

```bash
npm run build
```

Diharapkan: semua hijau, dan `/` serta `/sistem` tetap terdaftar `○ (Static)`.

- [ ] **Step 2: Peta masih utuh tanpa JavaScript**

```bash
curl -s http://localhost:3000/sistem | grep -c "kerja/"
```

Diharapkan: angka lebih besar dari nol — server tetap merender `PaperFallback` dengan lima tautan `/kerja/*`. Peta hidup tidak boleh mengubah apa pun di jalur ini.

- [ ] **Step 3: Lewat sekali di browser pada 1280×800**

Muat ulang `/sistem`, lalu satu skrip yang membaca kelima hal sekaligus:

```js
const pane = document.querySelector('[data-testid="map-pane"]');
const plate = document.querySelector('[data-plate-label]').closest('button');
const layers = plate.querySelectorAll('[data-layer]');
const top = layers[layers.length - 1];
const fire = (t, x) => pane.dispatchEvent(new PointerEvent(t, { clientX: x, bubbles: true, pointerId: 1 }));

const tight = Math.round(top.getBoundingClientRect().top);
plate.dispatchEvent(new PointerEvent('pointerenter', { bubbles: false }));
await new Promise((r) => setTimeout(r, 800));
const opened = Math.round(top.getBoundingClientRect().top);
plate.dispatchEvent(new PointerEvent('pointerleave', { bubbles: false }));

const edgeBefore = getComputedStyle(layers[0]).borderLeftColor;
pane.dispatchEvent(new WheelEvent('wheel', { deltaY: 700, deltaX: 0, bubbles: true }));
await new Promise((r) => setTimeout(r, 900));
const edgeAfter = getComputedStyle(layers[0]).borderLeftColor;
const angle = pane.querySelector('[role="group"]').style.transform;

fire('pointerdown', 400); fire('pointermove', 460); fire('pointerup', 460);
plate.click();
const afterDrag = document.querySelector('aside h2')?.textContent ?? null;
fire('pointerdown', 400); fire('pointerup', 400);
plate.click();
const afterTap = document.querySelector('aside h2')?.textContent ?? null;

({ stackRose: tight - opened, edgeBefore, edgeAfter, angle, afterDrag, afterTap });
```

Diharapkan: `stackRose` positif, `edgeAfter` berbeda dari `edgeBefore`, `angle` mendarat di salah satu dari `-55/-40/-25`, `afterDrag` `null`, `afterTap` berisi nama sistem.

- [ ] **Step 4: Serahkan rasanya ke Utsman**

Tiga angka tidak bisa diputuskan dari panel dan harus dilihat di browsernya sendiri:

- `WHEEL_PER_UNIT = 0.12` di `useMapCamera.js` — kecepatan roda
- `STAGGER_MS = 40` di `Plate.jsx` — jeda antar-lapis waktu masuk
- `STEP_OPEN = 11` di `Plate.jsx` — seberapa lebar tumpukan membuka

Sebutkan ketiganya beserta nama berkasnya, dan tunggu jawabannya sebelum menulis PROGRESS.

- [ ] **Step 5: Perbarui `docs/PROGRESS.md`**

Yang harus berubah:

- **Posisi sekarang** — tambahkan `2026-09-09-peta-hidup.md` selesai, Task 1–11.
- **Perpindahan naik-turun** — hapus "belum pernah dilihat berjalan". Utsman sudah melihatnya di browsernya sendiri pada 2026-09-09: gesernya jalan dan `22vh` terasa pas. Coret bagian "Belum terukur, dan jangan diklaim sudah" untuk sisi geser; catatan `prefers-reduced-motion` untuk pseudo-element view-transition tetap belum terukur.
- **Antrean berikutnya** — nomor 1 sekarang tinggal butir zoom saja. Tulis ulang jadi "Zoom masuk ke halaman baca, zoom keluar waktu kembali", dan catat bahwa tiga butir lain sudah selesai lewat rencana peta hidup.
- **Di mana isinya** — tambahkan `src/lib/shell/shading.js`, `src/lib/shell/useMapCamera.js`, spec dan rencana peta hidup.
- **Keputusan yang mahal** — tambahkan: grup peta sekarang punya `transition` **hanya selama `settling`**, jadi snap teranimasi sementara seret tetap 1:1; `Plate` menghitung `topZ` sendiri dari langkah yang sedang berlaku, bukan dari `position.topZ`; makna (amber publik, krem terpilih) menutupi shading di tepi lapis atas.
- **Pelajaran** — tambahkan apa pun yang ternyata mahal selama Task 1–10, terutama hasil pengukuran `preserve-3d` di Task 1.
- **Jumlah test** — angka sungguhan dari Step 1, bukan perkiraan 180 di rencana ini.

- [ ] **Step 6: Commit**

```bash
git add docs/PROGRESS.md
git commit -m "docs: record the map that answers the pointer"
```

---

## Catatan urutan

Setiap task hijau di langkahnya sendiri, dan tidak ada task yang menuntut sesuatu dari task sesudahnya:

- Task 2 membuat `shading.js` tapi baru dipakai Task 9. Modul murni yang belum dipanggil tetap hijau dan tetap lolos lint.
- Task 3 memindahkan tombol tanpa menyentuh warna atau tumpukan, jadi Task 8 dan 9 punya `<button>` untuk digantungi handler hover dan fokus.
- Task 4 ekstraksi netral. Task 5, 6, 7 masing-masing menambah satu perilaku ke hook yang sudah ada.
- Task 8 memperkenalkan `step`, yang dipakai Task 9 dan 10 di transform lapis. Jangan menukar 8 dengan 9 atau 10.
- Task 1 mendahului semuanya karena hasilnya bisa membatalkan bentuk Task 3.
