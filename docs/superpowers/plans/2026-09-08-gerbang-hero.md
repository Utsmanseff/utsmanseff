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

const EASE = 'cubic-bezier(.22, 1, .36, 1)';

const COPY = {
  label: { id: 'Gerbang', en: 'Gate' },
  role: { id: 'FULLSTACK DEVELOPER', en: 'FULLSTACK DEVELOPER' },
  map: { id: 'LIHAT SISTEM · PETA →', en: 'SEE SYSTEMS · MAP →' },
  list: { id: 'LIHAT SISTEM · DAFTAR →', en: 'SEE SYSTEMS · LIST →' },
  hint: { id: '↓ ATAU TEKAN APA SAJA', en: '↓ OR PRESS ANY KEY' },
};

// Four empty plates, the same shape as the ones behind the gate. The gate
// promises the contents rather than decorating over them.
const PLATES = [
  { width: 168, height: 100, right: 172, top: 44, bg: '#1D2428', edge: '#333C41' },
  { width: 196, height: 116, right: 78, top: 132, bg: '#252E33', edge: '#4A545A' },
  { width: 146, height: 88, right: 200, top: 244, bg: '#27302F', edge: '#C97B3F' },
  { width: 112, height: 68, right: 24, top: 28, bg: '#1D2428', edge: '#333C41' },
];

export default function Gate({ systems, locale, calm, leaving = false, onEnter }) {
  const years = systems.map((s) => Number(s.year));
  const span = `${Math.min(...years)}–${Math.max(...years)}`;

  return (
    <div
      data-testid="gate"
      role="group"
      aria-label={COPY.label[locale]}
      className="absolute inset-0 z-50 bg-ground overflow-hidden"
      style={{
        transition: `opacity 700ms ${EASE}`,
        opacity: leaving ? 0 : 1,
        pointerEvents: leaving ? 'none' : undefined,
      }}
    >
      <div className="absolute inset-y-0 right-0 w-[56%] pointer-events-none" aria-hidden="true">
        {PLATES.map((p, i) => (
          <div
            key={i}
            data-gate-plate={i}
            className="absolute"
            style={{
              width: p.width,
              height: p.height,
              right: p.right,
              top: p.top,
              background: p.bg,
              border: `1px solid ${p.edge}`,
              transform: 'skewY(-16deg)',
            }}
          />
        ))}
      </div>

      <div className="relative h-full flex flex-col justify-center px-16 max-w-[720px]">
        {/* Not an h1. The flat table underneath already owns the page's heading,
            and the gate is something you pass through, not something you read. */}
        <p className="font-display font-extrabold text-[64px] leading-none tracking-[-.03em] text-ink-bright m-0">
          {meta.name}
        </p>

        <p className="font-mono text-[11.5px] tracking-[.1em] text-muted mt-4 mb-0">
          {COPY.role[locale]} · {meta.location[locale]} · {span}
        </p>

        <p
          data-testid="gate-stack"
          className="font-mono text-[12px] leading-[1.9] text-body-soft mt-4 mb-0 max-w-[560px]"
        >
          {techNames(systems).join(' · ')}
        </p>

        <div className="flex gap-3 mt-8">
          <button
            type="button"
            onClick={() => onEnter('map', null)}
            className="font-mono text-[11.5px] tracking-[.08em] text-amber border border-amber px-4 min-h-[44px]"
          >
            {COPY.map[locale]}
          </button>
          <button
            type="button"
            onClick={() => onEnter('list', null)}
            className="font-mono text-[11.5px] tracking-[.08em] text-muted border border-rule px-4 min-h-[44px]"
          >
            {COPY.list[locale]}
          </button>
        </div>
      </div>

      <span className="absolute right-6 bottom-5 font-mono text-[10px] text-muted-deep">
        {COPY.hint[locale]}
      </span>
    </div>
  );
}
```

Catatan: `calm` sudah ada di daftar prop tapi belum dipakai — Task 6 yang memakainya. ESLint tidak mengeluhkannya.

- [ ] **Step 4: Jalankan, pastikan hijau**

```bash
npx vitest run src/components/shell/__tests__/Gate.test.jsx
```

Expected: PASS, 6 test.

- [ ] **Step 5: Commit**

```bash
git add src/components/shell/Gate.jsx src/components/shell/__tests__/Gate.test.jsx
git commit -m "feat(gate): name the maker, the place, the years and the stack

Two doors instead of three: a separate see-everything button does nothing the
map and list buttons do not already do. Every digit on the gate is a year.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 3: `Gate` — cara-cara lain menutupnya

**Files:**
- Modify: `src/components/shell/Gate.jsx`
- Test: `src/components/shell/__tests__/Gate.test.jsx`

- [ ] **Step 1: Tulis test yang gagal**

Tambahkan `describe` kedua di akhir `src/components/shell/__tests__/Gate.test.jsx` (di luar `describe('Gate')` yang sudah ada):

```jsx
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

Expected: FAIL — sembilan test baru gagal, `onEnter` tidak pernah dipanggil.

- [ ] **Step 3: Tulis implementasinya**

Di `src/components/shell/Gate.jsx`, tambahkan import `useEffect`:

```jsx
import { useEffect } from 'react';
```

Lalu sisipkan efek ini tepat setelah baris `const span = ...`:

```jsx
  // The console below takes typing. A visitor who lands and types `filter`
  // straight away must not lose the f, so the key that opens the gate is
  // handed on rather than swallowed.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Tab') return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === 'Enter' || e.key === 'Escape') { onEnter(null, null); return; }
      if (e.key.length !== 1) return;
      onEnter(null, e.key === ' ' ? null : e.key);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onEnter]);
```

Dan tambahkan handler roda di elemen terluar — sisipkan `onWheel` tepat setelah blok `style`:

```jsx
      style={{
        transition: `opacity 700ms ${EASE}`,
        opacity: leaving ? 0 : 1,
        pointerEvents: leaving ? 'none' : undefined,
      }}
      onWheel={(e) => { if (e.deltaY > 0) onEnter(null, null); }}
    >
```

- [ ] **Step 4: Jalankan, pastikan hijau**

```bash
npx vitest run src/components/shell/__tests__/Gate.test.jsx
```

Expected: PASS, 18 test.

- [ ] **Step 5: Commit**

```bash
git add src/components/shell/Gate.jsx src/components/shell/__tests__/Gate.test.jsx
git commit -m "feat(gate): let any key or a downward scroll open it

Tab is the exception: it has to keep walking the two buttons. A letter is
passed on to the console rather than swallowed, so typing straight into a
fresh page does not lose its first character.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 4: `Shell` memasang gerbang

**Files:**
- Modify: `src/components/shell/Shell.jsx`
- Modify: `src/components/shell/Console.jsx`
- Test: `src/components/shell/__tests__/Shell.test.jsx`

- [ ] **Step 1: Tulis test yang gagal**

Di `src/components/shell/__tests__/Shell.test.jsx`, ganti blok impor dan `renderShell` yang ada dengan:

```jsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within, act } from '@testing-library/react';
import { LocaleProvider } from '@/lib/hooks/useLocale';
import Shell from '@/components/shell/Shell';
import { projects } from '@/lib/data/projects';

vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }));

// Most of these tests are about what happens once the gate is behind you, so
// they start from a tab that has already passed it. That is a real state, not
// a back door: it is what a visitor returning from a reading page sees.
beforeEach(() => {
  window.sessionStorage.clear();
  window.sessionStorage.setItem('gate', '1');
});

const renderShell = (props = {}) =>
  render(<Shell systems={projects} locale="id" calm={false} {...props} />, {
    wrapper: LocaleProvider,
  });
```

Lalu tambahkan `describe` baru di akhir berkas:

```jsx
describe('Shell · the gate', () => {
  it('opens on the gate in a fresh tab', () => {
    window.sessionStorage.clear();
    renderShell();
    expect(screen.getByTestId('gate')).toBeInTheDocument();
  });

  it('is already past the gate when the tab remembers it', () => {
    renderShell();
    expect(screen.queryByTestId('gate')).toBeNull();
  });

  it('lands on the flat table when that is the door taken', () => {
    window.sessionStorage.clear();
    renderShell();
    fireEvent.click(screen.getByRole('button', { name: /DAFTAR/ }));
    expect(screen.getByTestId('flat-table')).toBeInTheDocument();
  });

  it('fades before it leaves, rather than blinking out', () => {
    vi.useFakeTimers();
    try {
      window.sessionStorage.clear();
      renderShell();
      fireEvent.click(screen.getByRole('button', { name: /DAFTAR/ }));

      // Still mounted, on its way out.
      expect(screen.getByTestId('gate')).toHaveStyle({ opacity: '0' });

      act(() => vi.advanceTimersByTime(700));
      expect(screen.queryByTestId('gate')).toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });

  it('lands on the map when that is the door taken', () => {
    window.sessionStorage.clear();
    renderShell();
    fireEvent.click(screen.getByRole('button', { name: /PETA/ }));
    expect(screen.getByTestId('map-pane')).toBeInTheDocument();
  });

  it('defaults a reduced-motion visitor to the flat table', () => {
    window.sessionStorage.clear();
    renderShell({ calm: true });
    fireEvent.keyDown(window, { key: 'Enter' });
    expect(screen.getByTestId('flat-table')).toBeInTheDocument();
  });

  it('defaults everyone else to the map', () => {
    window.sessionStorage.clear();
    renderShell();
    fireEvent.keyDown(window, { key: 'Enter' });
    expect(screen.getByTestId('map-pane')).toBeInTheDocument();
  });

  it('gives the console the letter that opened the gate', () => {
    window.sessionStorage.clear();
    renderShell();
    fireEvent.keyDown(window, { key: 'f' });
    const input = screen.getByLabelText('Konsol perintah');
    expect(input).toHaveValue('f');
    expect(input).toHaveFocus();
  });
});
```

- [ ] **Step 2: Jalankan, pastikan gagal**

```bash
npx vitest run src/components/shell/__tests__/Shell.test.jsx
```

Expected: FAIL — `getByTestId('gate')` tidak ketemu, dan `flat-table` mungkin juga belum ada.

- [ ] **Step 3: Beri `FlatTable` sebuah testid**

`MapScene` sudah punya `data-testid="map-pane"`; `FlatTable` belum punya apa-apa. Di `src/components/shell/FlatTable.jsx` baris 21, ubah:

```jsx
    <div className="overflow-y-auto p-10">
```

jadi:

```jsx
    <div data-testid="flat-table" className="overflow-y-auto p-10">
```

- [ ] **Step 4: Tulis implementasi `Shell`**

Di `src/components/shell/Shell.jsx`:

Tambahkan impor:

```jsx
import { useGatePassed } from '@/lib/hooks/useGatePassed';
import Gate from './Gate';
```

Ubah tanda tangan komponen dan state awal:

```jsx
export default function Shell({ systems, locale, calm = false }) {
  const { setLocale } = useLocale();
  const router = useRouter();
  const { passed, pass } = useGatePassed();
  // Reduced motion picks the still view as a starting point, not as a verdict:
  // the gate's other button is right there.
  const [view, setView] = useState(calm ? 'list' : 'map');
  const [selected, setSelected] = useState(null);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [log, setLog] = useState([{ text: '$ ls systems', kind: 'command' }]);
  const [cmd, setCmd] = useState('');
  const [focusToken, setFocusToken] = useState(0);
  const [leaving, setLeaving] = useState(false);
```

Tambahkan handler tepat sebelum `const dimmed = ...`:

```jsx
  // The gate fades rather than blinks: it stays mounted at opacity 0 for the
  // length of the fade, then unmounts when `pass()` flips `passed`. The view
  // and the console are set first, behind a still-opaque gate, so nothing is
  // seen changing. Reduced motion collapses the fade in CSS; the 700ms wait
  // stays, and an invisible element waiting is not something anyone can see.
  const enter = (nextView, seed) => {
    if (leaving) return;
    if (nextView) setView(nextView);
    if (seed) {
      setCmd(seed);
      setFocusToken((n) => n + 1);
    }
    setLeaving(true);
    setTimeout(pass, 700);
  };
```

`if (leaving) return;` mencegah tombol kedua yang diklik selama fade menyetel ulang view.

Bungkus isi `Shell` supaya gerbang punya tempat berdiri. Ubah `<div data-testid="shell" ...>` jadi `relative`, dan sisipkan gerbang sebagai anak terakhir:

```jsx
    <div data-testid="shell" className="relative h-[100dvh] grid grid-rows-[auto_1fr_44px_34px] overflow-hidden bg-ground">
```

Lalu tepat sebelum `</div>` penutup paling luar, setelah `<StatusBar ... />`:

```jsx
      {!passed && (
        <Gate
          systems={systems}
          locale={locale}
          calm={calm}
          leaving={leaving}
          onEnter={enter}
        />
      )}
```

Terakhir, teruskan `focusToken` ke konsol:

```jsx
      <Console
        locale={locale}
        value={cmd}
        onChange={setCmd}
        onRun={run}
        onEscape={resetFilters}
        focusToken={focusToken}
      />
```

- [ ] **Step 4b: Taruh cangkang di luar jangkauan selama gerbang naik**

Tanpa ini gerbang cuma gambar gerbang: `Tab` dan pembaca layar berjalan lurus ke
konsol dan rail di belakangnya. Bungkus keempat baris grid dengan satu wrapper
`display:contents` yang membawa `inert`, dan lepaskan begitu gerbang mulai pergi
supaya huruf yang membukanya bisa mendarat di konsol:

```jsx
      <div className="contents" inert={!passed && !leaving}>
        {/* TopBar, baris tengah, Console, StatusBar */}
      </div>
```

- [ ] **Step 5: Tulis implementasi `Console`**

Di `src/components/shell/Console.jsx`, ubah tanda tangan:

```jsx
export default function Console({ locale, value, onChange, onRun, onEscape, focusToken = 0 }) {
```

Dan tambahkan efek kedua tepat setelah efek `"/"` yang sudah ada:

```jsx
  // Zero is the value it starts at, and starting focused would steal the page
  // from a keyboard visitor who has not asked for the console yet.
  useEffect(() => {
    if (focusToken) ref.current?.focus();
  }, [focusToken]);
```

- [ ] **Step 6: Jalankan, pastikan hijau**

```bash
npx vitest run src/components/shell/__tests__/Shell.test.jsx
```

Expected: PASS — 11 test lama plus 10 test gerbang, 21 seluruhnya.

- [ ] **Step 7: Jalankan seluruh suite**

```bash
npx vitest run
```

Expected: PASS, semua berkas.

- [ ] **Step 8: Commit**

```bash
git add src/components/shell/Shell.jsx src/components/shell/Console.jsx src/components/shell/FlatTable.jsx src/components/shell/__tests__/Shell.test.jsx
git commit -m "feat(shell): stand the gate over the shell, not in place of it

The shell renders underneath the whole time, so MapScene has finished
measuring itself before the gate fades and there is no jump. A reduced-motion
visitor starts on the flat table; the map button is still right there.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 5: Cangkang mount untuk pengunjung reduced-motion — Tugas 1 ditutup

**Files:**
- Modify: `src/lib/hooks/useShellEligible.js`
- Modify: `src/app/page.jsx`
- Test: `src/app/__tests__/page.test.jsx`

- [ ] **Step 1: Tulis test yang gagal**

Ganti seluruh isi `src/app/__tests__/page.test.jsx`:

```jsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from '@/app/page';
import { LocaleProvider } from '@/lib/hooks/useLocale';

// Shell reaches for the app router; this test renders it for real.
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }));

const eligible = vi.hoisted(() => ({ value: false }));
vi.mock('@/lib/hooks/useShellEligible', () => ({
  useShellEligible: () => eligible.value,
}));

// page.jsx now asks the browser about motion directly. happy-dom answers, but
// stubbing it keeps the answer in this file rather than in the environment.
const calm = { value: false };
beforeEach(() => {
  eligible.value = false;
  calm.value = false;
  window.sessionStorage.clear();
  window.matchMedia = vi.fn((query) => ({
    matches: query.includes('prefers-reduced-motion') ? calm.value : false,
    addEventListener: () => {},
    removeEventListener: () => {},
  }));
});

describe('/', () => {
  it('renders the document when the shell is not eligible', () => {
    render(<Home />, { wrapper: LocaleProvider });
    expect(document.querySelector('.paper-doc')).not.toBeNull();
  });

  it('renders the shell when it is', () => {
    eligible.value = true;
    render(<Home />, { wrapper: LocaleProvider });
    expect(document.querySelector('.paper-doc')).toBeNull();
    expect(screen.getByTestId('shell')).toBeInTheDocument();
  });

  it('gives a reduced-motion visitor the shell, not the paper document', () => {
    eligible.value = true;
    calm.value = true;
    render(<Home />, { wrapper: LocaleProvider });
    expect(document.querySelector('.paper-doc')).toBeNull();
    expect(screen.getByTestId('gate')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Jalankan, pastikan gagal**

```bash
npx vitest run src/app/__tests__/page.test.jsx
```

Expected: FAIL pada test ketiga — `page.jsx` belum meneruskan `calm`, jadi gerbang belum ada. (Dua test pertama tetap hijau.)

- [ ] **Step 3: Lepas syarat `calm` dari kelayakan**

Ganti seluruh isi `src/lib/hooks/useShellEligible.js`:

```js
"use client";

import { useMediaQuery } from './useMediaQuery';

// Two conditions now, not three. Reduced motion used to be one of them, and it
// cost that visitor the console, the rail and the panel — an interface reduced,
// when what they asked for was motion reduced. The gate asks them instead, and
// starts them on the still view. See docs/PROGRESS.md, Task 1.
export function useShellEligible() {
  return useMediaQuery('(min-width: 1024px)');
}
```

- [ ] **Step 4: Teruskan `calm` dari halaman**

Di `src/app/page.jsx`, tambahkan impor:

```jsx
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
```

Dan di badan komponen:

```jsx
  const shell = useShellEligible();
  const calm = useMediaQuery('(prefers-reduced-motion: reduce)');

  if (shell) return <Shell systems={projects} locale={locale} calm={calm} />;
```

- [ ] **Step 5: Jalankan, pastikan hijau**

```bash
npx vitest run src/app/__tests__/page.test.jsx
```

Expected: PASS, 3 test.

- [ ] **Step 6: Jalankan seluruh suite dan ESLint**

```bash
npx vitest run
npx eslint src --max-warnings=0
```

Expected: keduanya bersih.

- [ ] **Step 7: Commit**

```bash
git add src/lib/hooks/useShellEligible.js src/app/page.jsx src/app/__tests__/page.test.jsx
git commit -m "fix(shell): stop denying the shell to reduced-motion visitors

Spec §2 kept them out of the shell entirely; spec §7 said they should land on
the flat table. Following §2 cost them the console, the rail and the panel.
Now the shell mounts for everyone wide enough, and reduced motion picks the
still view as a default the gate lets them refuse.

Closes Task 1 in docs/PROGRESS.md.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 6: Lapisan yang melayang mengikuti kursor

**Files:**
- Modify: `src/components/shell/Gate.jsx`
- Test: `src/components/shell/__tests__/Gate.test.jsx`

- [ ] **Step 1: Tulis test yang gagal**

Tambahkan `describe` ketiga di akhir `src/components/shell/__tests__/Gate.test.jsx`:

```jsx
describe('Gate · the drifting plates', () => {
  // The component throttles with rAF. Running the callback straight away makes
  // the assertion about the wiring, not about frame timing.
  const flushFrames = () =>
    vi.stubGlobal('requestAnimationFrame', (cb) => { cb(); return 1; });

  it('moves the plates by different amounts as the pointer moves', () => {
    flushFrames();
    renderGate();
    const gate = screen.getByTestId('gate');
    const first = gate.querySelector('[data-gate-plate="0"]');
    const second = gate.querySelector('[data-gate-plate="1"]');

    fireEvent.mouseMove(gate, { clientX: 900, clientY: 300 });

    expect(first.style.transform).toMatch(/translate\(/);
    expect(first.style.transform).not.toBe(second.style.transform);
  });

  it('keeps skewing them, so they stay the same shape as the map plates', () => {
    flushFrames();
    renderGate();
    const gate = screen.getByTestId('gate');
    fireEvent.mouseMove(gate, { clientX: 900, clientY: 300 });
    expect(gate.querySelector('[data-gate-plate="0"]').style.transform)
      .toMatch(/skewY\(-16deg\)/);
  });

  it('does not move them at all for a visitor who asked for less motion', () => {
    flushFrames();
    renderGate({ calm: true });
    const gate = screen.getByTestId('gate');
    const plate = gate.querySelector('[data-gate-plate="0"]');
    const before = plate.style.transform;

    fireEvent.mouseMove(gate, { clientX: 900, clientY: 300 });

    expect(plate.style.transform).toBe(before);
  });
});
```

- [ ] **Step 2: Jalankan, pastikan gagal**

```bash
npx vitest run src/components/shell/__tests__/Gate.test.jsx
```

Expected: FAIL pada dua test pertama — `transform` tetap `skewY(-16deg)` tanpa `translate(`.

- [ ] **Step 3: Tulis implementasinya**

Di `src/components/shell/Gate.jsx`, tambahkan `useRef` ke impor React:

```jsx
import { useEffect, useRef } from 'react';
```

Tambahkan faktor parallax ke tiap entri `PLATES` — ganti konstanta itu jadi:

```jsx
const PLATES = [
  { width: 168, height: 100, right: 172, top: 44, bg: '#1D2428', edge: '#333C41', pull: 34 },
  { width: 196, height: 116, right: 78, top: 132, bg: '#252E33', edge: '#4A545A', pull: 20 },
  { width: 146, height: 88, right: 200, top: 244, bg: '#27302F', edge: '#C97B3F', pull: 46 },
  { width: 112, height: 68, right: 24, top: 28, bg: '#1D2428', edge: '#333C41', pull: 12 },
];
```

Tambahkan ref pada elemen gerbang. Ubah pembuka `<div data-testid="gate" ...>` jadi:

```jsx
    <div
      ref={gateRef}
      data-testid="gate"
      className="absolute inset-0 z-50 bg-ground overflow-hidden"
      style={{ transition: `opacity 700ms ${EASE}` }}
      onWheel={(e) => { if (e.deltaY > 0) onEnter(null, null); }}
    >
```

Dan tambahkan ini di badan komponen, setelah efek keyboard:

```jsx
  const gateRef = useRef(null);

  // Cursor-driven, so it follows 1:1 with no transition — the same side of the
  // motion contract as dragging the map. Transform only: touching left/top here
  // would relayout four elements on every frame.
  useEffect(() => {
    if (calm) return undefined;
    const gate = gateRef.current;
    if (!gate) return undefined;

    let frame = null;
    const onMove = (e) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = null;
        const box = gate.getBoundingClientRect();
        const x = (e.clientX - box.left) / (box.width || 1) - 0.5;
        const y = (e.clientY - box.top) / (box.height || 1) - 0.5;
        gate.querySelectorAll('[data-gate-plate]').forEach((node) => {
          const pull = PLATES[Number(node.dataset.gatePlate)].pull;
          node.style.transform =
            `skewY(-16deg) translate(${(-x * pull).toFixed(1)}px, ${(-y * pull * 0.6).toFixed(1)}px)`;
        });
      });
    };

    gate.addEventListener('mousemove', onMove);
    return () => {
      gate.removeEventListener('mousemove', onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [calm]);
```

`gateRef` harus dideklarasikan sebelum efek yang memakainya — taruh baris `const gateRef = useRef(null);` di atas efek keyboard, bukan di antara keduanya.

- [ ] **Step 4: Jalankan, pastikan hijau**

```bash
npx vitest run src/components/shell/__tests__/Gate.test.jsx
```

Expected: PASS, 21 test.

- [ ] **Step 5: Commit**

```bash
git add src/components/shell/Gate.jsx src/components/shell/__tests__/Gate.test.jsx
git commit -m "feat(gate): drift the plates with the cursor, 1:1 and unthrottled by easing

Four pull factors, transform only, one rAF per frame. A visitor who asked for
less motion gets no listener at all rather than a listener whose work is
thrown away.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 7: `PaperHead` — pita identitas di HP

**Files:**
- Create: `src/components/document/PaperHead.jsx`
- Modify: `src/components/document/SystemsDocument.jsx`
- Test: `src/components/document/__tests__/PaperHead.test.jsx`
- Test: `src/components/document/__tests__/SystemsDocument.test.jsx`

- [ ] **Step 1: Tulis test yang gagal**

Buat `src/components/document/__tests__/PaperHead.test.jsx`:

```jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LocaleProvider } from '@/lib/hooks/useLocale';
import PaperHead from '@/components/document/PaperHead';
import { projects } from '@/lib/data/projects';

const renderHead = (props = {}) =>
  render(<PaperHead systems={projects} locale="id" {...props} />, { wrapper: LocaleProvider });

describe('PaperHead', () => {
  it('says the same things the gate says', () => {
    renderHead();
    expect(screen.getByText('Utsman')).toBeInTheDocument();
    expect(screen.getByText(/FULLSTACK DEVELOPER/)).toBeInTheDocument();
    expect(screen.getByText(/BANJARBARU/i)).toBeInTheDocument();
    expect(screen.getByText(/2024–2026/)).toBeInTheDocument();
  });

  it('lists the stack from the data', () => {
    renderHead();
    const stack = screen.getByTestId('paper-stack').textContent;
    expect(stack).toContain('Laravel');
    expect(stack).toContain('TensorFlow.js');
  });

  it('states no counts', () => {
    const { container } = renderHead();
    const numbers = container.textContent.match(/\d[\d.]*/g) ?? [];
    expect(numbers.every((n) => n === '2024' || n === '2026')).toBe(true);
  });
});
```

Lalu tambahkan dua test ke `src/components/document/__tests__/SystemsDocument.test.jsx`:

```jsx
  it('opens with the identity band, not the old one-line head', () => {
    renderDoc();
    expect(screen.getByText('Utsman')).toBeInTheDocument();
    expect(screen.getByTestId('paper-stack')).toBeInTheDocument();
  });

  it('keeps the desktop note, at the foot where it belongs', () => {
    const { container } = renderDoc();
    const note = screen.getByText(/Buka di desktop/);
    const first = container.querySelector('[data-year]');
    // Node.DOCUMENT_POSITION_FOLLOWING === 4: the note comes after the years.
    expect(first.compareDocumentPosition(note) & 4).toBeTruthy();
  });
```

- [ ] **Step 2: Jalankan, pastikan gagal**

```bash
npx vitest run src/components/document
```

Expected: FAIL — `PaperHead` belum ada, dan `SystemsDocument` belum memakainya.

- [ ] **Step 3: Tulis `PaperHead`**

Buat `src/components/document/PaperHead.jsx`:

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

      <p data-testid="paper-stack" className="font-mono text-[10px] text-paper-ink-soft mt-2.5 mb-0 leading-[1.7]">
        {techNames(systems).join(' · ')}
      </p>

      <div className="border-t border-paper-ink mt-4" />
    </header>
  );
}
```

- [ ] **Step 4: Pasang di `SystemsDocument`**

Di `src/components/document/SystemsDocument.jsx`, tambahkan impor:

```jsx
import PaperHead from './PaperHead';
```

Hapus impor `LangSwitcher` kalau sudah tidak dipakai di berkas ini.

Ganti tiga blok pembuka — kepala, garis, dan paragraf lokasi — dengan satu baris:

```jsx
      <PaperHead systems={systems} locale={locale} />
```

Lalu pindahkan catatan desktop ke kaki: sisipkan tepat sebelum `<dl ...>`:

```jsx
      <p className="font-mono text-[10.5px] text-paper-muted mt-10 mb-0">
        {COPY.note[locale]}
      </p>
```

Dan ubah kelas `<dl>` dari `mt-10` jadi `mt-4`, supaya jarak totalnya tidak berubah.

Kalau `COPY.head` sudah tidak dipakai di mana pun, buang entrinya.

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
