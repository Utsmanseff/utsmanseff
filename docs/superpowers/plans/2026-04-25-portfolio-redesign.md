# Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace existing single-file Next.js portfolio with an editorial, warm, bilingual (ID/EN) portfolio per spec `docs/superpowers/specs/2026-04-25-portfolio-redesign-design.md`.

**Architecture:** Single-page Next.js 16 (App Router) site, decomposed into focused section components under `src/components/sections/`, content in `src/lib/data/` per locale, i18n via lightweight Context + dictionary, dark mode + locale persisted in `localStorage`. Editorial typography (Fraunces/Inter/JetBrains Mono via `next/font`), cream/forest/amber palette via Tailwind 4 theme tokens.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS 4, `lucide-react`, `next/font` (Fraunces, Inter, JetBrains Mono), Vitest (for hook/i18n logic tests).

---

## Phases

1. **Foundation** — wipe slate, set palette/typography tokens, install testing
2. **i18n + theme infra** — config, dictionaries, hooks (TDD)
3. **Content data** — projects, experience, skills, meta
4. **UI primitives** — SectionTitle, Rule, Tag, FadeIn, ExternalLink, LangSwitcher, ThemeToggle
5. **Nav + Hero**
6. **About**
7. **Selected Work (3 case studies)**
8. **Other Projects**
9. **Skills**
10. **Experience**
11. **Education**
12. **Contact**
13. **Footer**
14. **SEO, OG image, favicon**
15. **Performance + a11y pass**
16. **Final QA + cleanup**

---

## Phase 1 — Foundation

### Task 1: Install dev dependencies (Vitest + Testing Library)

**Files:**
- Modify: `package.json`
- Create: `vitest.config.mjs`
- Create: `vitest.setup.js`

- [ ] **Step 1: Install packages**

Run:
```bash
npm install --save-dev vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

Expected: packages added to `devDependencies`, no errors.

- [ ] **Step 2: Create `vitest.config.mjs`**

```javascript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.js'],
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

- [ ] **Step 3: Create `vitest.setup.js`**

```javascript
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 4: Add test scripts to `package.json`**

In `scripts`:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 5: Update `jsconfig.json` with `@/*` alias**

Read current `jsconfig.json`. Replace contents with:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

- [ ] **Step 6: Verify test runner boots**

Run: `npm test`
Expected: `No test files found` (zero tests, but config loads without error).

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json vitest.config.mjs vitest.setup.js jsconfig.json
git commit -m "chore: add vitest + testing-library, configure @/* alias"
```

---

### Task 2: Set up fonts via `next/font`

**Files:**
- Modify: `src/app/layout.js`

- [ ] **Step 1: Replace `layout.js` with new font config**

Read current `src/app/layout.js`. Replace contents with:

```javascript
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "600", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata = {
  title: "Utsman — Fullstack Web Developer",
  description: "Fullstack engineer turning regulatory headaches into shipped software. Healthtech, BPJS bridging, OCR pipelines.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased font-body`}
      >
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Run dev server, confirm fonts load**

Run: `npm run dev`
Open `http://localhost:3000`. Inspect `<body>` — should have `--font-display`, `--font-body`, `--font-mono` CSS vars set.
Stop server.

- [ ] **Step 3: Commit**

```bash
git add src/app/layout.js
git commit -m "feat(layout): switch to Fraunces + Inter + JetBrains Mono via next/font"
```

---

### Task 3: Set up palette + typography tokens in `globals.css`

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Replace `globals.css` with token system**

```css
@import "tailwindcss";

@theme {
  /* Color tokens — cream/forest/amber palette */
  --color-cream: #F5F1E8;
  --color-cream-deep: #EDE6D3;
  --color-forest: #1F3A2E;
  --color-forest-deep: #0F1F18;
  --color-amber: #C97B3F;
  --color-amber-soft: #E8B888;
  --color-ink: #1A1A1A;
  --color-mute: #6B6B5E;
  --color-rule: #D9D0BC;

  /* Surface tokens — semantic */
  --color-bg: var(--color-cream);
  --color-fg: var(--color-forest);

  /* Typography */
  --font-display: var(--font-display), Georgia, serif;
  --font-body: var(--font-body), -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: var(--font-mono), ui-monospace, monospace;
}

@variant dark (.dark &);

.dark {
  --color-bg: var(--color-forest-deep);
  --color-fg: var(--color-cream);
  --color-rule: #2A4A3A;
  --color-mute: #9A9A8A;
}

html, body {
  background: var(--color-bg);
  color: var(--color-fg);
  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Selection */
::selection {
  background: var(--color-amber);
  color: var(--color-cream);
}

/* Focus ring */
:focus-visible {
  outline: 2px solid var(--color-amber);
  outline-offset: 2px;
  border-radius: 2px;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 2: Verify**

Run: `npm run dev`
Body should be cream background, dark green text. Stop server.

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "feat(theme): add cream/forest/amber tokens, font vars, focus styles"
```

---

### Task 4: Wipe `page.js` to skeleton

**Files:**
- Modify: `src/app/page.js`

- [ ] **Step 1: Replace `page.js` with placeholder**

```javascript
"use client";

export default function Portfolio() {
  return (
    <main className="min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-32">
        <h1 className="font-display text-7xl font-black text-forest dark:text-cream">
          Utsman
        </h1>
        <p className="font-body text-xl text-mute mt-4">
          Fullstack Web Developer
        </p>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run dev`. Confirm: cream background, "Utsman" in large serif (Fraunces), "Fullstack Web Developer" in sans (Inter), muted color. Stop server.

- [ ] **Step 3: Commit**

```bash
git add src/app/page.js
git commit -m "refactor(page): wipe to skeleton, ready for component sections"
```

---

## Phase 2 — i18n + theme infra (TDD)

### Task 5: i18n config + dictionaries (skeleton)

**Files:**
- Create: `src/lib/i18n/config.js`
- Create: `src/lib/i18n/id.js`
- Create: `src/lib/i18n/en.js`
- Create: `src/lib/i18n/dictionary.js`
- Create: `src/lib/i18n/__tests__/dictionary.test.js`

- [ ] **Step 1: Write failing test for dictionary structure**

`src/lib/i18n/__tests__/dictionary.test.js`:

```javascript
import { describe, it, expect } from 'vitest';
import { dict } from '../dictionary';
import { LOCALES, DEFAULT_LOCALE } from '../config';

describe('i18n dictionary', () => {
  it('exports dict for every supported locale', () => {
    LOCALES.forEach(loc => {
      expect(dict[loc]).toBeDefined();
      expect(typeof dict[loc]).toBe('object');
    });
  });

  it('default locale exists in dict', () => {
    expect(dict[DEFAULT_LOCALE]).toBeDefined();
  });

  it('all locales share the same top-level keys', () => {
    const keys = Object.keys(dict[DEFAULT_LOCALE]);
    LOCALES.forEach(loc => {
      keys.forEach(k => {
        expect(dict[loc]).toHaveProperty(k);
      });
    });
  });
});
```

- [ ] **Step 2: Run test, verify fails**

Run: `npm test -- src/lib/i18n`
Expected: FAIL — module not found.

- [ ] **Step 3: Create `config.js`**

```javascript
export const DEFAULT_LOCALE = 'id';
export const LOCALES = ['id', 'en'];
export const STORAGE_KEY = 'utsman.locale';
```

- [ ] **Step 4: Create `id.js` (Indonesian dictionary skeleton)**

```javascript
const id = {
  nav: {
    about: 'Tentang',
    work: 'Project',
    skills: 'Keahlian',
    experience: 'Pengalaman',
    contact: 'Kontak',
  },
  hero: {
    eyebrow: 'Tersedia untuk project · Banjarbaru, ID',
    role: 'Web Developer Fullstack',
    tagline: 'Engineer fullstack yang mengubah pusing regulasi jadi software yang ship.',
    bioTeaser: 'Dua tahun membangun sistem rumah sakit, instansi, dan UMKM. Fokus utama healthtech: RME, bridging BPJS, OCR pendaftaran.',
    ctaWork: 'Lihat case study',
    ctaCV: 'Unduh CV',
    ctaEmail: 'Email saya →',
  },
  about: {
    title: 'Tentang',
    body: [
      'Saya mulai ngoding tahun 2021, berangkat dari satu pengamatan sederhana: kebanyakan pekerjaan yang orang keluhkan bisa dipercepat, dirapikan, atau dua-duanya dengan bantuan software. Tahun 2024 saya full-time di Laravel, dan sekarang sehari-hari membangun sistem untuk rumah sakit, instansi pemerintah, dan UMKM di Kalimantan.',
      'Fokus utama saya teknologi kesehatan. Di RSU Nirwana saya mengelola Rekam Medis Elektronik, alur klaim BPJS, dan website publik rumah sakit yang saya bangun ulang dengan OCR di pendaftaran. Pekerjaannya tidak ramah — audit Kementerian Kesehatan, alur kerja dokter yang tidak boleh putus di tengah shift, deadline klaim yang menyangkut pendapatan rumah sakit — dan tekanan itu yang membentuk cara saya menulis kode: ship yang jalan, dokumentasikan yang dikerjakan, perbaiki sebelum ada yang sadar rusak.',
      'Di luar healthcare, saya ambil project freelance untuk operator café, kantor sertifikasi, dan manajemen aset untuk unit kehutanan. Pendekatan sama: pahami masalah nyata dulu, tawarkan solusi paling kecil yang menyelesaikan, ship dalam hitungan minggu bukan kuartal.',
      'Sekarang lagi mendalami TypeScript, melirik Go dan .NET untuk variasi backend, dan rencana ekspansi ke mobile pakai Flutter.',
    ],
    facts: {
      location: 'Lokasi',
      locationValue: 'Banjarbaru, Kalimantan Selatan',
      education: 'Pendidikan',
      educationValue: 'S1 Teknik Informatika, Uniska MAB',
      certification: 'Sertifikasi',
      certificationValue: 'BNSP Object Programmer',
      yearsCoding: 'Pengalaman',
      yearsCodingValue: '2 tahun (sejak 2021)',
      stack: 'Stack utama',
      stackValue: 'Laravel · MySQL · JavaScript · React/Next',
      learning: 'Sedang belajar',
      learningValue: 'TypeScript, Go, .NET, Flutter',
      languages: 'Bahasa',
      languagesValue: 'Indonesia (native), Inggris (working)',
    },
  },
  work: {
    title: 'Selected Work',
    eyebrowLive: 'live',
    eyebrowInternal: 'internal',
    problem: 'Masalah',
    approach: 'Pendekatan',
    outcome: 'Hasil',
    hard: 'Yang sulit',
    visit: 'Kunjungi situs ↗',
    screenshotsTodo: 'Screenshot internal — tersedia atas permintaan',
  },
  other: {
    title: 'Other Projects',
    intro: 'Cuplikan saja — masih banyak project klien lain yang tidak dicantumkan.',
    soon: 'COMING SOON',
    expand: 'Detail',
  },
  skills: {
    title: 'Skill & Toolbox',
    daily: 'Sehari-hari (2+ tahun)',
    comfortable: 'Nyaman dipakai',
    exploring: 'Sedang dieksplorasi',
    bestAt: 'Yang paling saya kuasai',
    bestAtValue: 'Problem-solving di sistem legacy/vendor, integrasi API teregulasi, ship di bawah tekanan deadline.',
  },
  experience: {
    title: 'Pengalaman',
    present: 'Sekarang',
  },
  education: {
    title: 'Pendidikan & Sertifikasi',
    educationLabel: 'Pendidikan',
    certLabel: 'Sertifikasi',
  },
  contact: {
    title: 'Hubungi saya',
    intro: 'Tertarik kolaborasi atau punya pertanyaan tentang project saya? Saya merespons cepat lewat WhatsApp atau email.',
    email: 'Email',
    whatsapp: 'WhatsApp',
    github: 'GitHub',
    instagram: 'Instagram',
    location: 'Lokasi',
    downloadCV: 'Unduh CV',
  },
  footer: {
    builtWith: 'Dibangun dengan Next.js + Tailwind',
    backToTop: 'kembali ke atas ↑',
  },
  ui: {
    toggleTheme: 'Ganti tema',
    toggleLang: 'Ganti bahasa',
    openMenu: 'Buka menu',
    closeMenu: 'Tutup menu',
  },
};

export default id;
```

- [ ] **Step 5: Create `en.js` (English dictionary, mirror keys)**

```javascript
const en = {
  nav: {
    about: 'About',
    work: 'Work',
    skills: 'Skills',
    experience: 'Experience',
    contact: 'Contact',
  },
  hero: {
    eyebrow: 'Available for projects · Banjarbaru, ID',
    role: 'Fullstack Web Developer',
    tagline: 'Fullstack engineer turning regulatory headaches into shipped software.',
    bioTeaser: 'Two years building systems for hospitals, government offices, and small businesses. Healthtech focus: EMR, BPJS bridging, OCR registration pipelines.',
    ctaWork: 'View case studies',
    ctaCV: 'Download CV',
    ctaEmail: 'Email me →',
  },
  about: {
    title: 'About',
    body: [
      'I started programming in 2021, drawn by a simple observation: most of the work people complain about can be made faster, cleaner, or both with software. By 2024 I was full-time on Laravel, and now spend my days building systems for hospitals, government offices, and small businesses across Kalimantan.',
      "My focus is healthcare technology. At RSU Nirwana I maintain electronic medical records, BPJS claims pipelines, and a public-facing hospital site I rebuilt with OCR-powered registration. The work is unforgiving — Ministry of Health audits, doctor workflows that can't break mid-shift, claim deadlines tied to hospital revenue — and that pressure has shaped how I write software: ship something that runs, document what you did, fix what breaks before anyone notices.",
      'Outside healthcare, I take freelance work for café operators, certification offices, and asset management for forestry units. Same approach: understand the actual problem first, propose the smallest thing that solves it, ship in weeks not quarters.',
      "Right now I'm sharpening TypeScript, eyeing Go and .NET for backend variety, and planning to extend into mobile with Flutter.",
    ],
    facts: {
      location: 'Location',
      locationValue: 'Banjarbaru, South Kalimantan',
      education: 'Education',
      educationValue: 'BSc Informatics, Uniska MAB',
      certification: 'Certification',
      certificationValue: 'BNSP Object Programmer',
      yearsCoding: 'Years coding',
      yearsCodingValue: '2 years (since 2021)',
      stack: 'Primary stack',
      stackValue: 'Laravel · MySQL · JavaScript · React/Next',
      learning: 'Currently learning',
      learningValue: 'TypeScript, Go, .NET, Flutter',
      languages: 'Languages',
      languagesValue: 'Indonesian (native), English (working)',
    },
  },
  work: {
    title: 'Selected Work',
    eyebrowLive: 'live',
    eyebrowInternal: 'internal',
    problem: 'Problem',
    approach: 'Approach',
    outcome: 'Outcome',
    hard: 'What was hard',
    visit: 'Visit site ↗',
    screenshotsTodo: 'Internal screenshots — available on request',
  },
  other: {
    title: 'Other Projects',
    intro: 'A selection — many other client projects not listed.',
    soon: 'COMING SOON',
    expand: 'Details',
  },
  skills: {
    title: 'Skills & Toolbox',
    daily: 'Daily (2+ years)',
    comfortable: 'Comfortable',
    exploring: 'Currently exploring',
    bestAt: "What I'm best at",
    bestAtValue: 'Problem-solving on legacy/vendor systems, integrating regulated APIs, shipping under deadline pressure.',
  },
  experience: {
    title: 'Experience',
    present: 'Present',
  },
  education: {
    title: 'Education & Certification',
    educationLabel: 'Education',
    certLabel: 'Certification',
  },
  contact: {
    title: 'Get in touch',
    intro: 'Interested in collaborating or have questions about my work? I respond quickly via WhatsApp or email.',
    email: 'Email',
    whatsapp: 'WhatsApp',
    github: 'GitHub',
    instagram: 'Instagram',
    location: 'Location',
    downloadCV: 'Download CV',
  },
  footer: {
    builtWith: 'Built with Next.js + Tailwind',
    backToTop: 'back to top ↑',
  },
  ui: {
    toggleTheme: 'Toggle theme',
    toggleLang: 'Toggle language',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
  },
};

export default en;
```

- [ ] **Step 6: Create `dictionary.js`**

```javascript
import id from './id';
import en from './en';

export const dict = { id, en };
```

- [ ] **Step 7: Run tests, verify pass**

Run: `npm test -- src/lib/i18n`
Expected: 3 PASS.

- [ ] **Step 8: Commit**

```bash
git add src/lib/i18n
git commit -m "feat(i18n): add config + ID/EN dictionaries with shared key contract"
```

---

### Task 6: `useLocale` hook + LocaleProvider (TDD)

**Files:**
- Create: `src/lib/hooks/useLocale.js`
- Create: `src/lib/hooks/__tests__/useLocale.test.jsx`

- [ ] **Step 1: Write failing test**

`src/lib/hooks/__tests__/useLocale.test.jsx`:

```javascript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { LocaleProvider, useLocale } from '../useLocale';
import { STORAGE_KEY } from '@/lib/i18n/config';

function TestConsumer() {
  const { locale, setLocale, t } = useLocale();
  return (
    <div>
      <span data-testid="locale">{locale}</span>
      <span data-testid="title">{t('about.title')}</span>
      <button onClick={() => setLocale('en')}>EN</button>
      <button onClick={() => setLocale('id')}>ID</button>
    </div>
  );
}

describe('useLocale', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('defaults to DEFAULT_LOCALE (id) when nothing stored', () => {
    render(<LocaleProvider><TestConsumer /></LocaleProvider>);
    expect(screen.getByTestId('locale').textContent).toBe('id');
    expect(screen.getByTestId('title').textContent).toBe('Tentang');
  });

  it('reads stored locale from localStorage', () => {
    localStorage.setItem(STORAGE_KEY, 'en');
    render(<LocaleProvider><TestConsumer /></LocaleProvider>);
    expect(screen.getByTestId('locale').textContent).toBe('en');
    expect(screen.getByTestId('title').textContent).toBe('About');
  });

  it('setLocale updates state and persists', () => {
    render(<LocaleProvider><TestConsumer /></LocaleProvider>);
    act(() => {
      screen.getByText('EN').click();
    });
    expect(screen.getByTestId('locale').textContent).toBe('en');
    expect(localStorage.getItem(STORAGE_KEY)).toBe('en');
  });

  it('t() returns key when path missing', () => {
    render(<LocaleProvider><TestConsumer /></LocaleProvider>);
    function MissingConsumer() {
      const { t } = useLocale();
      return <span data-testid="missing">{t('does.not.exist')}</span>;
    }
    render(<LocaleProvider><MissingConsumer /></LocaleProvider>);
    expect(screen.getByTestId('missing').textContent).toBe('does.not.exist');
  });
});
```

- [ ] **Step 2: Run, verify fails**

Run: `npm test -- src/lib/hooks`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `useLocale.js`**

```javascript
"use client";

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { dict } from '@/lib/i18n/dictionary';
import { DEFAULT_LOCALE, LOCALES, STORAGE_KEY } from '@/lib/i18n/config';

const LocaleContext = createContext(null);

function resolvePath(obj, path) {
  return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
}

export function LocaleProvider({ children }) {
  const [locale, setLocaleState] = useState(DEFAULT_LOCALE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let initial = DEFAULT_LOCALE;
    try {
      // 1. URL query param
      const url = new URL(window.location.href);
      const qp = url.searchParams.get('lang');
      if (qp && LOCALES.includes(qp)) {
        initial = qp;
      } else {
        // 2. localStorage
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored && LOCALES.includes(stored)) {
          initial = stored;
        } else {
          // 3. browser
          const nav = navigator.language?.slice(0, 2);
          if (LOCALES.includes(nav)) initial = nav;
        }
      }
    } catch (_) {
      // SSR / no window
    }
    setLocaleState(initial);
    setHydrated(true);
  }, []);

  const setLocale = useCallback((next) => {
    if (!LOCALES.includes(next)) return;
    setLocaleState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
      document.documentElement.lang = next;
    } catch (_) {}
  }, []);

  const t = useCallback(
    (path) => {
      const value = resolvePath(dict[locale], path);
      return value === undefined ? path : value;
    },
    [locale]
  );

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t, hydrated }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used inside LocaleProvider');
  return ctx;
}
```

- [ ] **Step 4: Run tests, verify pass**

Run: `npm test -- src/lib/hooks`
Expected: 4 PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/hooks src/lib/i18n
git commit -m "feat(i18n): add useLocale hook with URL/storage/browser resolution"
```

---

### Task 7: `useTheme` hook (TDD)

**Files:**
- Create: `src/lib/hooks/useTheme.js`
- Create: `src/lib/hooks/__tests__/useTheme.test.jsx`

- [ ] **Step 1: Write failing test**

```javascript
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../useTheme';

const STORAGE_KEY = 'utsman.theme';

function TestConsumer() {
  const { theme, toggle } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button onClick={toggle}>toggle</button>
    </div>
  );
}

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  it('defaults to light when no preference', () => {
    render(<ThemeProvider><TestConsumer /></ThemeProvider>);
    expect(screen.getByTestId('theme').textContent).toBe('light');
  });

  it('reads stored theme', () => {
    localStorage.setItem(STORAGE_KEY, 'dark');
    render(<ThemeProvider><TestConsumer /></ThemeProvider>);
    expect(screen.getByTestId('theme').textContent).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('toggle flips theme and persists', () => {
    render(<ThemeProvider><TestConsumer /></ThemeProvider>);
    act(() => screen.getByText('toggle').click());
    expect(screen.getByTestId('theme').textContent).toBe('dark');
    expect(localStorage.getItem(STORAGE_KEY)).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });
});
```

- [ ] **Step 2: Run, verify fails**

Run: `npm test -- useTheme`
Expected: FAIL.

- [ ] **Step 3: Implement `useTheme.js`**

```javascript
"use client";

import { createContext, useContext, useEffect, useState, useCallback } from 'react';

const STORAGE_KEY = 'utsman.theme';
const ThemeContext = createContext(null);

function applyTheme(theme) {
  if (typeof document === 'undefined') return;
  if (theme === 'dark') document.documentElement.classList.add('dark');
  else document.documentElement.classList.remove('dark');
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    let initial = 'light';
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'dark' || stored === 'light') {
        initial = stored;
      } else if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
        initial = 'dark';
      }
    } catch (_) {}
    setTheme(initial);
    applyTheme(initial);
  }, []);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch (_) {}
      applyTheme(next);
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
```

- [ ] **Step 4: Run tests, verify pass**

Run: `npm test -- useTheme`
Expected: 3 PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/hooks/useTheme.js src/lib/hooks/__tests__/useTheme.test.jsx
git commit -m "feat(theme): add useTheme hook with localStorage + prefers-color-scheme"
```

---

### Task 8: `useInView` hook (light test)

**Files:**
- Create: `src/lib/hooks/useInView.js`
- Create: `src/lib/hooks/__tests__/useInView.test.jsx`

- [ ] **Step 1: Write failing test**

```javascript
import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useInView } from '../useInView';

describe('useInView', () => {
  it('returns ref + initial inView=false', () => {
    // Mock IntersectionObserver
    const observe = vi.fn();
    const disconnect = vi.fn();
    global.IntersectionObserver = vi.fn(() => ({ observe, disconnect, unobserve: vi.fn() }));

    const { result } = renderHook(() => useInView());
    expect(result.current.ref).toBeDefined();
    expect(result.current.inView).toBe(false);
  });
});
```

- [ ] **Step 2: Run, verify fails**

Run: `npm test -- useInView`
Expected: FAIL.

- [ ] **Step 3: Implement `useInView.js`**

```javascript
"use client";

import { useEffect, useRef, useState } from 'react';

export function useInView({ threshold = 0.15, rootMargin = '0px 0px -10% 0px', once = true } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, inView };
}
```

- [ ] **Step 4: Run, verify pass**

Run: `npm test -- useInView`
Expected: 1 PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/hooks/useInView.js src/lib/hooks/__tests__/useInView.test.jsx
git commit -m "feat(motion): add useInView hook for scroll-triggered animations"
```

---

## Phase 3 — Content data

### Task 9: Project data (locale-keyed)

**Files:**
- Create: `src/lib/data/projects.js`

- [ ] **Step 1: Create projects data**

```javascript
// Project data, locale-keyed.
// `featured` projects render as full case studies; `other` as compact list.

export const projects = {
  featured: [
    {
      id: 'rsu-nirwana-web',
      slug: 'rsu-nirwana',
      client: 'RSU Nirwana',
      year: '2025',
      status: 'live',
      site: 'https://rsunirwana.id',
      sector: { id: 'Healthcare', en: 'Healthcare' },
      image: '/assets/img/rme.png',
      screenshots: [
        // TODO: replace with real captures from rsunirwana.id
        '/assets/img/rme.png',
      ],
      title: {
        id: 'Website RSU Nirwana — Pendaftaran OCR',
        en: 'RSU Nirwana — OCR Hospital Registration',
      },
      summary: {
        id: 'Mendisain ulang pendaftaran online RS dengan OCR KTP dan integrasi langsung ke sistem internal.',
        en: 'Redesigned hospital online registration with KTP OCR scanning and direct integration into the internal system.',
      },
      tech: ['Laravel', 'MySQL', 'Google Vision API', 'REST API'],
      problem: {
        id: 'Pendaftaran online hanya mengamankan kuota — pasien tetap antri panjang di loket untuk daftar ulang. Form pendaftaran panjang dan rawan typo, terutama untuk lansia. Data web tidak terintegrasi ke sistem internal, jadi resepsionis input ulang.',
        en: 'Online pre-registration only reserved a queue slot — patients still queued at the counter to re-register. The long form was error-prone, especially for elderly patients. Web data lived in isolation from the internal hospital system, forcing receptionists to duplicate entry.',
      },
      approach: {
        id: 'Bangun ulang alur pendaftaran dengan OCR KTP via Google Cloud Vision API, lalu hubungkan langsung ke sistem internal RS. Pasien yang sudah daftar online cukup tunjukkan bukti di loket.',
        en: 'Rebuilt the registration flow with KTP (Indonesian ID) OCR via Google Cloud Vision API, then bridged directly into the internal hospital system. Pre-registered patients only show a confirmation slip at the counter.',
        bullets: {
          id: [
            'OCR KTP otomatis isi nama, NIK, alamat',
            'Sinkronisasi data pendaftaran ke SIMRS internal',
            'Bukti pendaftaran QR untuk verifikasi loket',
            'Validasi field sisi server untuk konsistensi data',
          ],
          en: [
            'KTP OCR auto-fills name, NIK, address',
            'Registration data syncs into internal SIMRS',
            'QR registration receipt for counter verification',
            'Server-side validation for data consistency',
          ],
        },
      },
      outcome: {
        id: 'Antrian loket berkurang drastis, completion rate pendaftaran lansia naik, double-entry resepsionis hilang. Live di rsunirwana.id.',
        en: 'Counter queues dropped significantly, elderly registration completion rate rose, receptionist double-entry was eliminated. Live at rsunirwana.id.',
      },
      hard: {
        id: 'Tuning akurasi OCR untuk foto KTP dengan pencahayaan dan sudut yang sangat variatif, dan menyelaraskan dua skema data milik pihak berbeda (web app dan SIMRS vendor) tanpa membuat ekspektasi vendor pecah.',
        en: 'Tuning OCR accuracy on KTP photos taken in highly variable lighting and skew, and aligning two separately-owned data schemas (web app and vendor SIMRS) without breaking the vendor\'s expectations.',
      },
    },
    {
      id: 'idrg-bridging',
      slug: 'idrg-bridging',
      client: 'RSU Nirwana',
      year: '2025',
      status: 'internal',
      site: null,
      sector: { id: 'Healthcare', en: 'Healthcare' },
      image: '/assets/img/eklaim.png',
      screenshots: [
        // TODO: internal — Utsman to provide
        '/assets/img/eklaim.png',
      ],
      title: {
        id: 'Bridging IDRG/INA-CBGs untuk Klaim BPJS',
        en: 'IDRG / INA-CBGs Full Bridging for BPJS Claims',
      },
      summary: {
        id: 'Membangun layanan integrasi sendiri untuk menyelamatkan akses bridging BPJS rumah sakit di bawah deadline Kemenkes.',
        en: 'Built a custom integration service to rescue the hospital\'s BPJS bridging access under a Ministry of Health deadline.',
      },
      tech: ['Laravel', 'REST API', 'MySQL', 'BPJS API', 'INA-CBGs'],
      problem: {
        id: 'Surat edaran Kemenkes menuntut update patch IDRG dan integrasi data diagnosa SIMRS ke SatuSehat. Vendor SIMRS punya bridging IDRG, tapi syarat komponennya tidak sesuai. Uji coba ditolak, akses bridging terancam diputus — yang artinya klaim BPJS tidak bisa dikirim sama sekali.',
        en: 'A Ministry of Health (Kemenkes) circular required IDRG patch updates and integration of SIMRS diagnostic data into SatuSehat. The vendor SIMRS had IDRG bridging, but the component layout did not meet the new requirements. The compliance test failed and bridging access — the channel for submitting BPJS claims — was about to be revoked.',
      },
      approach: {
        id: 'Bangun web service kustom dari nol untuk integrasi data klaim sesuai spesifikasi Kemenkes baru, langsung dari dokumentasi API BPJS. Service mediator antara data SIMRS internal dan endpoint BPJS, memaksakan skema yang vendor tidak bisa.',
        en: 'Built a custom web service from scratch to integrate claim data per the new Kemenkes specification, working from BPJS API documentation directly. The service mediates between internal SIMRS data and BPJS endpoints, enforcing the schema the vendor tool didn\'t.',
        bullets: {
          id: [
            'Integrasi endpoint eligibility, klaim, status, IDRG grouping',
            'Mapping kode diagnosa internal ke INA-CBGs',
            'Logging dan retry untuk request gagal',
            'Dashboard monitoring status klaim per batch',
          ],
          en: [
            'Integrated eligibility, claim submission, status, IDRG grouping endpoints',
            'Mapped internal diagnosis codes to INA-CBGs',
            'Logging and retry for failed requests',
            'Per-batch claim status monitoring dashboard',
          ],
        },
      },
      outcome: {
        id: 'Lulus uji kepatuhan Kemenkes, akses bridging dipulihkan, klaim mengalir lancar ke BPJS dan sistem internal.',
        en: 'Passed the Kemenkes compliance test, restored bridging access, claims now flow correctly to both BPJS and the internal system.',
      },
      hard: {
        id: 'Mengoordinasikan banyak endpoint BPJS (eligibility, submit klaim, status, IDRG grouping) di bawah deadline regulator eksternal, tanpa margin untuk retry — kalau bridging tetap diputus, RS tidak bisa kirim klaim sama sekali.',
        en: 'Coordinating multiple BPJS API endpoints (eligibility, claim submission, status, IDRG grouping) under a deadline imposed by an external regulator, with no margin for retries — if bridging access stayed revoked, the hospital couldn\'t submit claims at all.',
      },
    },
    {
      id: 'rme',
      slug: 'rme',
      client: 'RSU Nirwana',
      year: '2025',
      status: 'internal',
      site: null,
      sector: { id: 'Healthcare', en: 'Healthcare' },
      image: '/assets/img/rme.jpg',
      screenshots: [
        // TODO: internal — Utsman to provide
        '/assets/img/rme.jpg',
      ],
      title: {
        id: 'Rekam Medis Elektronik (RME)',
        en: 'Electronic Medical Records (EMR)',
      },
      summary: {
        id: 'RME paralel di atas SIMRS vendor 1.168 tabel — UI yang akhirnya dokter mau pakai.',
        en: 'A parallel EMR on top of a 1,168-table vendor SIMRS — a UI doctors actually use.',
      },
      tech: ['Laravel', 'MySQL', 'Livewire', 'Blade'],
      problem: {
        id: 'Permenkes mewajibkan RME, ancamannya SIP dokter dicabut dan akreditasi RS turun. Modul RME vendor SIMRS sudah ada, tapi UI-nya canggung — dokter diam-diam balik catat manual di kertas: SOAP, permintaan lab, resep, radiologi.',
        en: 'A Permenkes regulation mandated electronic medical records, with non-compliance threatening doctors\' practice licenses (SIP) and the hospital\'s accreditation. The vendor SIMRS EMR module existed but the UI was awkward — doctors quietly went back to paper for SOAP notes, lab requests, prescriptions, and radiology orders.',
      },
      approach: {
        id: 'Bangun lapisan RME paralel dengan UI yang dibentuk dari kemauan dokter, di atas database SIMRS vendor yang sama. SOAP, lab, resep, radiologi semua tetap nulis ke tabel kanonik SIMRS supaya laporan existing tidak rusak.',
        en: 'Built a parallel EMR layer with a UI shaped by what doctors actually wanted, sitting on top of the same vendor SIMRS database. SOAP notes, lab requests, prescriptions, and radiology orders all flow back into the canonical SIMRS tables so existing reports keep working.',
        bullets: {
          id: [
            'Form SOAP cepat dengan template per spesialisasi',
            'Permintaan lab/radiologi sekali klik',
            'Resep dengan autocomplete obat dari master',
            'Tetap menulis ke tabel kanonik SIMRS',
          ],
          en: [
            'Fast SOAP form with per-specialty templates',
            'One-click lab/radiology requests',
            'Prescription autocomplete from drug master',
            'Writes back to canonical SIMRS tables',
          ],
        },
      },
      outcome: {
        id: 'Dokter mulai input RME secara digital, paparan regulasi RS berkurang. Adopsi sebagian tapi nyata.',
        en: 'Doctors started using the EMR digitally instead of paper. Partial but real adoption, hospital regulatory exposure reduced.',
      },
      hard: {
        id: 'Database SIMRS vendor punya 1.168 tabel. Memetakan tabel mana yang punya data klinis mana, relasinya bagaimana, constraint mana yang akan rusak kalau saya tulis — itu reverse-engineering sistem yang tidak ada dokumentasinya. Sebagian besar pekerjaan bukan UI, tapi arkeologi data di database orang lain.',
        en: "The vendor SIMRS database has 1,168 tables. Mapping out which ones owned which clinical data, what their relationships were, and which constraints would break if I wrote into them required reverse-engineering a system I had no documentation for. Most of the work wasn\u2019t UI — it was patient archaeology in a database designed by someone else.",
      },
    },
  ],

  other: [
    {
      id: 'sigap-bpn',
      year: '2025',
      client: 'BPN Banjarbaru',
      title: {
        id: 'Sistem Kepegawaian & Absensi Geolocation',
        en: 'Personnel & Geolocation Attendance System',
      },
      desc: {
        id: 'Manajemen kepegawaian dan absensi berbasis lokasi untuk memastikan kehadiran pegawai sesuai lokasi kerja.',
        en: 'Personnel management and geolocation-based attendance to verify presence at the assigned work location.',
      },
      tech: ['Laravel', 'Livewire', 'MySQL', 'Geolocation API'],
      image: '/assets/img/sigap.jpg',
      features: {
        id: ['Absensi geolocation', 'Manajemen cuti & izin', 'Laporan kehadiran', 'Dashboard pegawai'],
        en: ['Geolocation attendance', 'Leave & permission management', 'Attendance reports', 'Personnel dashboard'],
      },
    },
    {
      id: 'aset-kphl',
      year: '2025',
      client: 'UPT-KPHL Kapuas Kahayan',
      title: {
        id: 'Sistem Manajemen Aset & Inventaris',
        en: 'Asset & Inventory Management System',
      },
      desc: {
        id: 'Pengelolaan aset dan inventaris organisasi dengan tracking, maintenance, dan reporting.',
        en: 'Organization-wide asset and inventory management with tracking, maintenance, and reporting.',
      },
      tech: ['Laravel', 'Blade', 'MySQL'],
      image: '/assets/img/aset.jpg',
      features: {
        id: ['Pencatatan aset', 'Tracking lokasi & kondisi', 'Jadwal maintenance', 'Laporan & dokumentasi'],
        en: ['Asset cataloging', 'Location & condition tracking', 'Maintenance schedule', 'Reports & documentation'],
      },
    },
    {
      id: 'sertifikasi-benih',
      year: '2025',
      client: 'BPSPTPH Banjarbaru',
      title: {
        id: 'Aplikasi Sertifikasi Benih',
        en: 'Seed Certification System',
      },
      desc: {
        id: 'Pendaftaran dan monitoring sertifikasi benih tanaman untuk proses sertifikasi yang efisien dan transparan.',
        en: 'Plant seed certification registration and monitoring for efficient, transparent certification.',
      },
      tech: ['Laravel', 'Livewire', 'MySQL'],
      image: '/assets/img/sertifikasi.png',
      features: {
        id: ['Pendaftaran online', 'Monitoring status', 'Notifikasi progres', 'Sertifikat digital'],
        en: ['Online registration', 'Status monitoring', 'Progress notifications', 'Digital certificates'],
      },
    },
  ],

  soon: [
    {
      id: 'ppdb-cbt',
      title: {
        id: 'PPDB Online dengan Computer-Based Test',
        en: 'Online School Admissions with Computer-Based Test',
      },
      tech: ['Laravel'],
    },
  ],
};
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/data/projects.js
git commit -m "feat(data): add bilingual project dataset (3 case studies + others + soon)"
```

---

### Task 10: Skills, experience, education, meta data

**Files:**
- Create: `src/lib/data/skills.js`
- Create: `src/lib/data/experience.js`
- Create: `src/lib/data/education.js`
- Create: `src/lib/data/meta.js`

- [ ] **Step 1: Create `skills.js`**

```javascript
export const skills = {
  daily: ['Laravel', 'MySQL', 'PHP', 'JavaScript', 'HTML', 'CSS', 'Bootstrap', 'Livewire', 'REST APIs', 'Git'],
  comfortable: ['React', 'Next.js', 'Tailwind CSS', 'Alpine.js', 'Blade', 'Geolocation APIs', 'OCR pipelines', 'BPJS / IDRG / SatuSehat integrations'],
  exploring: ['TypeScript', 'Go', '.NET', 'Flutter'],
  timeline: {
    'HTML / CSS / MySQL / Bootstrap': '2021',
    'PHP / JavaScript': '2022',
    'Laravel (active)': '2024',
    'Livewire / REST API / React / Next / Alpine.js / Git': '2025',
    'TypeScript': '2026',
  },
};
```

- [ ] **Step 2: Create `experience.js`**

```javascript
export const experience = [
  {
    period: { id: '2024 — Sekarang', en: '2024 — Present' },
    role: { id: 'Programmer', en: 'Programmer' },
    org: 'RSU Nirwana',
    bullets: {
      id: [
        'Pengelolaan dan pemeliharaan RME dan e-Klaim BPJS',
        'Implementasi full bridging IDRG/INA-CBGs',
        'Maintenance sistem, jaringan, dan infrastruktur IT',
      ],
      en: [
        'Maintain EMR and BPJS e-claim systems',
        'Implemented full IDRG/INA-CBGs bridging',
        'System, network, and IT infrastructure maintenance',
      ],
    },
  },
  {
    period: { id: '2024 — Sekarang', en: '2024 — Present' },
    role: { id: 'Web Developer Freelance', en: 'Freelance Web Developer' },
    org: { id: 'Project mandiri / klien', en: 'Independent / Client projects' },
    bullets: {
      id: [
        'Mengelola pengembangan website dan sistem informasi berbasis web',
        'Koordinasi dengan klien untuk analisis kebutuhan dan solusi sistem',
        'Maintenance, pengembangan fitur, dan optimasi aplikasi',
      ],
      en: [
        'Manage web development and information system projects',
        'Coordinate with clients on requirements and system design',
        'Maintenance, feature development, and application optimization',
      ],
    },
  },
  {
    period: { id: '2023', en: '2023' },
    role: { id: 'Staff Data & Administrasi (Magang)', en: 'Data & Admin Staff (Intern)' },
    org: 'DPMPTSP Kota Banjarbaru',
    bullets: {
      id: [
        'Pengolahan dan rekapitulasi data perizinan',
        'Pengelolaan dokumen digital dan administrasi',
      ],
      en: [
        'Permit data processing and recapitulation',
        'Digital document and administrative management',
      ],
    },
  },
];
```

- [ ] **Step 3: Create `education.js`**

```javascript
export const education = [
  {
    degree: { id: 'S1 Teknik Informatika', en: 'BSc in Informatics Engineering' },
    school: 'Universitas Islam Kalimantan Muhammad Arsyad Al Banjari (Uniska MAB)',
    period: '2020 — 2024',
  },
];

export const certifications = [
  {
    name: { id: 'Object Programmer', en: 'Object Programmer' },
    issuer: { id: 'Badan Nasional Sertifikasi Profesi (BNSP)', en: 'National Professional Certification Agency (BNSP)' },
  },
];
```

- [ ] **Step 4: Create `meta.js`**

```javascript
export const meta = {
  name: 'Utsman',
  email: 'seffutsmannnn@gmail.com',
  whatsapp: '+62 823 5273 4167',
  whatsappLink: 'https://wa.me/6282352734167',
  github: 'https://github.com/Utsmanseff',
  githubHandle: 'Utsmanseff',
  instagram: 'https://instagram.com/utsmnseff',
  instagramHandle: '@utsmnseff',
  location: { id: 'Banjarbaru, Kalimantan Selatan', en: 'Banjarbaru, South Kalimantan' },
  cvFile: '/Utsman-CV.pdf',
  photo: '/assets/img/utsman.png',
};
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/data
git commit -m "feat(data): add skills, experience, education, meta datasets"
```

---

## Phase 4 — UI primitives

### Task 11: Provider composition

**Files:**
- Create: `src/components/Providers.jsx`
- Modify: `src/app/layout.js`

- [ ] **Step 1: Create `Providers.jsx`**

```jsx
"use client";

import { LocaleProvider } from '@/lib/hooks/useLocale';
import { ThemeProvider } from '@/lib/hooks/useTheme';

export default function Providers({ children }) {
  return (
    <ThemeProvider>
      <LocaleProvider>{children}</LocaleProvider>
    </ThemeProvider>
  );
}
```

- [ ] **Step 2: Wire into `layout.js`**

In `src/app/layout.js`, import and wrap `children`:

```jsx
import Providers from '@/components/Providers';
// ...
return (
  <html lang="id" suppressHydrationWarning>
    <body className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased font-body`}>
      <Providers>{children}</Providers>
    </body>
  </html>
);
```

- [ ] **Step 3: Verify dev server still renders**

Run: `npm run dev`. Open http://localhost:3000 — should render skeleton page without errors. Stop server.

- [ ] **Step 4: Commit**

```bash
git add src/components/Providers.jsx src/app/layout.js
git commit -m "feat(layout): compose Theme + Locale providers in root layout"
```

---

### Task 12: UI primitives — `SectionTitle`, `Rule`, `Tag`, `FadeIn`, `ExternalLink`

**Files:**
- Create: `src/components/ui/SectionTitle.jsx`
- Create: `src/components/ui/Rule.jsx`
- Create: `src/components/ui/Tag.jsx`
- Create: `src/components/ui/FadeIn.jsx`
- Create: `src/components/ui/ExternalLink.jsx`

- [ ] **Step 1: `SectionTitle.jsx`**

```jsx
export default function SectionTitle({ eyebrow, children, id }) {
  return (
    <header id={id} className="mb-12 md:mb-16">
      {eyebrow && (
        <p className="font-mono text-xs uppercase tracking-widest text-mute mb-3">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-forest dark:text-cream leading-tight">
        {children}
      </h2>
    </header>
  );
}
```

- [ ] **Step 2: `Rule.jsx`**

```jsx
export default function Rule({ className = '' }) {
  return <hr className={`border-0 border-t border-rule ${className}`} />;
}
```

- [ ] **Step 3: `Tag.jsx`**

```jsx
export default function Tag({ children }) {
  return (
    <span className="font-mono text-xs uppercase tracking-wide text-mute border border-rule px-2 py-1 rounded-sm">
      {children}
    </span>
  );
}
```

- [ ] **Step 4: `FadeIn.jsx`**

```jsx
"use client";

import { useInView } from '@/lib/hooks/useInView';

export default function FadeIn({ children, delay = 0, className = '' }) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      } ${className}`}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 5: `ExternalLink.jsx`**

```jsx
export default function ExternalLink({ href, children, className = '' }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`text-amber underline decoration-amber/50 underline-offset-4 hover:decoration-amber transition-colors ${className}`}
    >
      {children}
    </a>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add src/components/ui
git commit -m "feat(ui): add SectionTitle, Rule, Tag, FadeIn, ExternalLink primitives"
```

---

### Task 13: `LangSwitcher` and `ThemeToggle`

**Files:**
- Create: `src/components/nav/LangSwitcher.jsx`
- Create: `src/components/nav/ThemeToggle.jsx`

- [ ] **Step 1: `LangSwitcher.jsx`**

```jsx
"use client";

import { useLocale } from '@/lib/hooks/useLocale';
import { LOCALES } from '@/lib/i18n/config';

export default function LangSwitcher() {
  const { locale, setLocale, t } = useLocale();

  return (
    <div
      role="group"
      aria-label={t('ui.toggleLang')}
      className="flex items-center gap-1 font-mono text-xs uppercase"
    >
      {LOCALES.map((loc, i) => (
        <span key={loc} className="flex items-center">
          <button
            type="button"
            onClick={() => setLocale(loc)}
            className={`px-1 transition-colors ${
              locale === loc ? 'text-forest dark:text-cream font-bold' : 'text-mute hover:text-forest dark:hover:text-cream'
            }`}
            aria-pressed={locale === loc}
          >
            {loc}
          </button>
          {i < LOCALES.length - 1 && <span className="text-mute">/</span>}
        </span>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: `ThemeToggle.jsx`**

```jsx
"use client";

import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/lib/hooks/useTheme';
import { useLocale } from '@/lib/hooks/useLocale';

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const { t } = useLocale();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={t('ui.toggleTheme')}
      className="p-2 text-mute hover:text-forest dark:hover:text-cream transition-colors"
    >
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/nav
git commit -m "feat(nav): add LangSwitcher and ThemeToggle"
```

---

## Phase 5 — Nav + Hero

### Task 14: Nav component

**Files:**
- Create: `src/components/nav/Nav.jsx`

- [ ] **Step 1: Create `Nav.jsx`**

```jsx
"use client";

import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useLocale } from '@/lib/hooks/useLocale';
import LangSwitcher from './LangSwitcher';
import ThemeToggle from './ThemeToggle';

const SECTIONS = ['about', 'work', 'skills', 'contact'];

export default function Nav() {
  const { t } = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-cream/95 dark:bg-forest-deep/95 border-b border-rule backdrop-blur' : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#top" className="font-display text-xl font-semibold text-forest dark:text-cream">
          Utsman
        </a>

        <div className="hidden md:flex items-center gap-8">
          {SECTIONS.map((s) => (
            <a
              key={s}
              href={`#${s}`}
              className="text-sm text-mute hover:text-forest dark:hover:text-cream transition-colors"
            >
              {t(`nav.${s}`)}
            </a>
          ))}
          <div className="h-4 w-px bg-rule" />
          <LangSwitcher />
          <ThemeToggle />
        </div>

        <div className="md:hidden flex items-center gap-2">
          <LangSwitcher />
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? t('ui.closeMenu') : t('ui.openMenu')}
            className="p-2 text-forest dark:text-cream"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      {open && (
        <div className="md:hidden bg-cream dark:bg-forest-deep border-t border-rule">
          <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col gap-4">
            {SECTIONS.map((s) => (
              <a
                key={s}
                href={`#${s}`}
                onClick={() => setOpen(false)}
                className="font-display text-2xl text-forest dark:text-cream"
              >
                {t(`nav.${s}`)}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/nav/Nav.jsx
git commit -m "feat(nav): add Nav with scroll state and mobile overlay"
```

---

### Task 15: Hero section

**Files:**
- Create: `src/components/sections/Hero.jsx`

- [ ] **Step 1: Create `Hero.jsx`**

```jsx
"use client";

import Image from 'next/image';
import { useLocale } from '@/lib/hooks/useLocale';
import { meta } from '@/lib/data/meta';

export default function Hero() {
  const { t } = useLocale();
  return (
    <section id="top" className="pt-32 md:pt-40 pb-24 md:pb-32 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-12 gap-12 md:gap-16 items-center">
        <div className="md:col-span-7 order-2 md:order-1">
          <p className="font-mono text-xs uppercase tracking-widest text-mute mb-6">
            {t('hero.eyebrow')}
          </p>
          <h1 className="font-display font-black text-forest dark:text-cream leading-[0.95] tracking-tight text-[clamp(3.5rem,8vw,7rem)]">
            Utsman
          </h1>
          <p className="font-body text-xl md:text-2xl text-mute mt-4">
            {t('hero.role')}
          </p>
          <p className="font-display italic text-2xl md:text-3xl text-forest dark:text-cream mt-8 max-w-2xl leading-snug">
            {t('hero.tagline')}
          </p>
          <p className="text-base md:text-lg text-mute mt-6 max-w-2xl leading-relaxed">
            {t('hero.bioTeaser')}
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-10">
            <a
              href="#work"
              className="bg-amber text-cream px-5 py-3 text-sm font-semibold tracking-wide hover:bg-forest dark:hover:bg-cream dark:hover:text-forest transition-colors"
            >
              {t('hero.ctaWork')}
            </a>
            <a
              href={meta.cvFile}
              download
              className="border border-forest dark:border-cream text-forest dark:text-cream px-5 py-3 text-sm font-semibold tracking-wide hover:bg-forest hover:text-cream dark:hover:bg-cream dark:hover:text-forest transition-colors"
            >
              {t('hero.ctaCV')}
            </a>
            <a
              href={`mailto:${meta.email}`}
              className="text-sm text-amber underline underline-offset-4 hover:text-forest dark:hover:text-cream transition-colors"
            >
              {t('hero.ctaEmail')}
            </a>
          </div>
        </div>

        <div className="md:col-span-5 order-1 md:order-2">
          <div className="relative inline-block">
            <Image
              src={meta.photo}
              alt="Utsman"
              width={520}
              height={650}
              priority
              sizes="(min-width: 768px) 40vw, 80vw"
              className="rounded-lg w-full max-w-md aspect-[4/5] object-cover relative z-10"
            />
            <div
              aria-hidden
              className="absolute inset-0 translate-x-3 translate-y-3 bg-amber rounded-lg z-0"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Wire Nav + Hero into `page.js`**

Replace `src/app/page.js`:

```jsx
"use client";

import Nav from '@/components/nav/Nav';
import Hero from '@/components/sections/Hero';

export default function Portfolio() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
      </main>
    </>
  );
}
```

- [ ] **Step 3: Verify visually**

Run: `npm run dev`. Open http://localhost:3000.
Verify:
- Hero photo shows with amber offset shadow behind
- Name "Utsman" massive serif
- Tagline italic serif
- 2 buttons (View case studies, Download CV) + email link
- Lang switcher works (toggle ID/EN, copy changes)
- Theme toggle works (cream ↔ forest-deep)
- Nav becomes solid on scroll
Stop server.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/Hero.jsx src/app/page.js
git commit -m "feat(hero): add hero section with photo + amber offset, CTAs, locale-aware copy"
```

---

## Phase 6 — About

### Task 16: About section

**Files:**
- Create: `src/components/sections/About.jsx`

- [ ] **Step 1: Create `About.jsx`**

```jsx
"use client";

import { useLocale } from '@/lib/hooks/useLocale';
import SectionTitle from '@/components/ui/SectionTitle';
import FadeIn from '@/components/ui/FadeIn';

const FACT_KEYS = [
  ['location', 'locationValue'],
  ['education', 'educationValue'],
  ['certification', 'certificationValue'],
  ['yearsCoding', 'yearsCodingValue'],
  ['stack', 'stackValue'],
  ['learning', 'learningValue'],
  ['languages', 'languagesValue'],
];

export default function About() {
  const { t } = useLocale();
  const body = t('about.body');

  return (
    <section id="about" className="py-24 md:py-32 px-6 border-t border-rule">
      <div className="max-w-6xl mx-auto">
        <SectionTitle>{t('about.title')}</SectionTitle>

        <div className="grid md:grid-cols-12 gap-12">
          <FadeIn className="md:col-span-8">
            <div className="prose-spacing text-lg leading-relaxed text-forest dark:text-cream space-y-6">
              {Array.isArray(body) && body.map((p, i) => (
                <p key={i} className={i === 0 ? 'first-letter:font-display first-letter:text-amber first-letter:text-7xl first-letter:font-black first-letter:float-left first-letter:mr-3 first-letter:leading-none' : ''}>
                  {p}
                </p>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={150} className="md:col-span-4">
            <dl className="space-y-5 md:border-l md:border-rule md:pl-8">
              {FACT_KEYS.map(([labelKey, valueKey]) => (
                <div key={labelKey}>
                  <dt className="font-mono text-xs uppercase tracking-widest text-mute mb-1">
                    {t(`about.facts.${labelKey}`)}
                  </dt>
                  <dd className="text-forest dark:text-cream">
                    {t(`about.facts.${valueKey}`)}
                  </dd>
                </div>
              ))}
            </dl>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Wire into `page.js`**

```jsx
import About from '@/components/sections/About';
// ...
<main>
  <Hero />
  <About />
</main>
```

- [ ] **Step 3: Verify visually**

Run: `npm run dev`. Confirm About renders below Hero with drop-cap on first paragraph (amber Fraunces 900), facts panel on right with mono labels. Stop server.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/About.jsx src/app/page.js
git commit -m "feat(about): add About section with drop-cap prose + facts panel"
```

---

## Phase 7 — Selected Work (Case Studies)

### Task 17: `CaseStudy` component + `SelectedWork` section

**Files:**
- Create: `src/components/sections/CaseStudy.jsx`
- Create: `src/components/sections/SelectedWork.jsx`

- [ ] **Step 1: Create `CaseStudy.jsx`**

```jsx
"use client";

import Image from 'next/image';
import { useLocale } from '@/lib/hooks/useLocale';
import FadeIn from '@/components/ui/FadeIn';

export default function CaseStudy({ project }) {
  const { locale, t } = useLocale();
  const localized = (field) => (typeof field === 'string' ? field : field?.[locale]);

  const statusLabel = project.status === 'live'
    ? t('work.eyebrowLive')
    : t('work.eyebrowInternal');

  return (
    <article className="py-16 md:py-24">
      <FadeIn>
        <p className="font-mono text-xs uppercase tracking-widest text-mute mb-3">
          {project.client} · {project.year} · {statusLabel} · {localized(project.sector)}
        </p>
        <h3 className="font-display text-3xl md:text-4xl font-semibold text-forest dark:text-cream leading-tight max-w-3xl">
          {localized(project.title)}
        </h3>
        <p className="text-lg md:text-xl text-mute mt-4 max-w-3xl leading-relaxed">
          {localized(project.summary)}
        </p>
      </FadeIn>

      <FadeIn delay={100} className="mt-10">
        <div className="relative aspect-[16/9] bg-cream-deep dark:bg-forest rounded-sm overflow-hidden border border-rule">
          <Image
            src={project.image}
            alt={localized(project.title)}
            fill
            sizes="(min-width: 768px) 80vw, 100vw"
            className="object-cover"
          />
        </div>
      </FadeIn>

      <div className="mt-12 grid md:grid-cols-12 gap-8">
        <FadeIn delay={150} className="md:col-span-4">
          <h4 className="font-mono text-xs uppercase tracking-widest text-amber mb-3">
            {t('work.problem')}
          </h4>
          <p className="text-forest dark:text-cream leading-relaxed">
            {localized(project.problem)}
          </p>
        </FadeIn>

        <FadeIn delay={200} className="md:col-span-4">
          <h4 className="font-mono text-xs uppercase tracking-widest text-amber mb-3">
            {t('work.approach')}
          </h4>
          <p className="text-forest dark:text-cream leading-relaxed mb-4">
            {localized(project.approach)}
          </p>
          {project.approach?.bullets && (
            <ul className="space-y-2">
              {(project.approach.bullets[locale] || []).map((b, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-mute">
                  <span className="text-amber mt-1">›</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          )}
        </FadeIn>

        <FadeIn delay={250} className="md:col-span-4">
          <h4 className="font-mono text-xs uppercase tracking-widest text-amber mb-3">
            {t('work.outcome')}
          </h4>
          <p className="text-forest dark:text-cream leading-relaxed">
            {localized(project.outcome)}
          </p>
        </FadeIn>
      </div>

      <FadeIn delay={300} className="mt-10 md:max-w-3xl">
        <h4 className="font-mono text-xs uppercase tracking-widest text-amber mb-3">
          {t('work.hard')}
        </h4>
        <p className="text-forest dark:text-cream leading-relaxed italic font-display text-lg md:text-xl">
          {localized(project.hard)}
        </p>
      </FadeIn>

      <FadeIn delay={350} className="mt-10 flex flex-wrap items-center gap-3">
        {project.tech.map((t) => (
          <span key={t} className="font-mono text-xs uppercase tracking-wide text-mute border border-rule px-2 py-1 rounded-sm">
            {t}
          </span>
        ))}
        {project.site && (
          <a
            href={project.site}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto text-sm text-amber underline underline-offset-4 hover:text-forest dark:hover:text-cream"
          >
            {t('work.visit')}
          </a>
        )}
      </FadeIn>
    </article>
  );
}
```

- [ ] **Step 2: Create `SelectedWork.jsx`**

```jsx
"use client";

import { useLocale } from '@/lib/hooks/useLocale';
import { projects } from '@/lib/data/projects';
import SectionTitle from '@/components/ui/SectionTitle';
import Rule from '@/components/ui/Rule';
import CaseStudy from './CaseStudy';

export default function SelectedWork() {
  const { t } = useLocale();
  return (
    <section id="work" className="py-24 md:py-32 px-6 border-t border-rule bg-cream-deep/40 dark:bg-forest/30">
      <div className="max-w-6xl mx-auto">
        <SectionTitle>{t('work.title')}</SectionTitle>
        {projects.featured.map((p, i) => (
          <div key={p.id}>
            <CaseStudy project={p} />
            {i < projects.featured.length - 1 && <Rule />}
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Wire into `page.js`**

```jsx
import SelectedWork from '@/components/sections/SelectedWork';
// ...
<Hero />
<About />
<SelectedWork />
```

- [ ] **Step 4: Verify visually**

Run: `npm run dev`. Open http://localhost:3000. Scroll to Selected Work — 3 case studies should render with eyebrow → title → summary → image → 3-col problem/approach/outcome → italic "what was hard" → tech tags + visit link. Toggle locale, confirm all copy switches. Stop server.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/CaseStudy.jsx src/components/sections/SelectedWork.jsx src/app/page.js
git commit -m "feat(work): add Selected Work with 3 healthtech case studies"
```

---

## Phase 8 — Other Projects

### Task 18: Other Projects section

**Files:**
- Create: `src/components/sections/OtherProjects.jsx`

- [ ] **Step 1: Create `OtherProjects.jsx`**

```jsx
"use client";

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLocale } from '@/lib/hooks/useLocale';
import { projects } from '@/lib/data/projects';
import SectionTitle from '@/components/ui/SectionTitle';

export default function OtherProjects() {
  const { locale, t } = useLocale();
  const [openId, setOpenId] = useState(null);

  return (
    <section id="other" className="py-24 md:py-32 px-6 border-t border-rule">
      <div className="max-w-6xl mx-auto">
        <SectionTitle>{t('other.title')}</SectionTitle>
        <p className="italic text-mute -mt-8 mb-12 max-w-2xl">{t('other.intro')}</p>

        <ul className="divide-y divide-rule border-t border-b border-rule">
          {projects.other.map((p) => {
            const open = openId === p.id;
            return (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : p.id)}
                  className="w-full text-left grid grid-cols-12 gap-4 items-baseline py-5 hover:bg-cream-deep/50 dark:hover:bg-forest/40 transition-colors px-2"
                  aria-expanded={open}
                >
                  <span className="col-span-2 md:col-span-1 font-mono text-sm text-mute">{p.year}</span>
                  <span className="col-span-7 md:col-span-6">
                    <span className="font-display text-lg md:text-xl text-forest dark:text-cream">
                      {p.title[locale]}
                    </span>
                    <span className="block text-sm text-mute mt-1">{p.client}</span>
                  </span>
                  <span className="hidden md:flex md:col-span-4 flex-wrap gap-2">
                    {p.tech.map((t) => (
                      <span key={t} className="font-mono text-xs uppercase tracking-wide text-mute">
                        {t}
                      </span>
                    ))}
                  </span>
                  <span className="col-span-3 md:col-span-1 text-right">
                    <ChevronDown
                      size={18}
                      className={`inline-block text-mute transition-transform ${open ? 'rotate-180' : ''}`}
                    />
                  </span>
                </button>
                {open && (
                  <div className="px-2 pb-6 -mt-2 grid grid-cols-12 gap-4">
                    <div className="col-span-12 md:col-span-10 md:col-start-2">
                      <p className="text-forest dark:text-cream leading-relaxed mb-4">
                        {p.desc[locale]}
                      </p>
                      <ul className="grid sm:grid-cols-2 gap-2 text-sm text-mute">
                        {(p.features?.[locale] || []).map((f, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-amber mt-1">›</span>
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </li>
            );
          })}

          {projects.soon.map((p) => (
            <li key={p.id} className="grid grid-cols-12 gap-4 items-baseline py-5 px-2 opacity-60">
              <span className="col-span-2 md:col-span-1 font-mono text-xs uppercase text-amber">
                {t('other.soon')}
              </span>
              <span className="col-span-7 md:col-span-6 font-display text-lg md:text-xl text-forest dark:text-cream">
                {p.title[locale]}
              </span>
              <span className="hidden md:flex md:col-span-4 flex-wrap gap-2">
                {p.tech.map((tech) => (
                  <span key={tech} className="font-mono text-xs uppercase tracking-wide text-mute">
                    {tech}
                  </span>
                ))}
              </span>
              <span className="col-span-3 md:col-span-1 text-right text-mute">⋯</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Wire into `page.js`**

```jsx
import OtherProjects from '@/components/sections/OtherProjects';
// ...
<SelectedWork />
<OtherProjects />
```

- [ ] **Step 3: Verify visually**

Run: `npm run dev`. Other Projects section: 3 expandable rows + 1 "COMING SOON" row. Click row → expands inline with description + features. Stop server.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/OtherProjects.jsx src/app/page.js
git commit -m "feat(other): add Other Projects expandable list with coming-soon row"
```

---

## Phase 9 — Skills

### Task 19: Skills section

**Files:**
- Create: `src/components/sections/Skills.jsx`

- [ ] **Step 1: Create `Skills.jsx`**

```jsx
"use client";

import { useLocale } from '@/lib/hooks/useLocale';
import { skills } from '@/lib/data/skills';
import SectionTitle from '@/components/ui/SectionTitle';
import FadeIn from '@/components/ui/FadeIn';

function Tier({ label, items }) {
  return (
    <FadeIn className="py-6">
      <p className="font-mono text-xs uppercase tracking-widest text-amber mb-3">
        {label}
      </p>
      <p className="text-lg md:text-xl text-forest dark:text-cream leading-relaxed">
        {items.join(' · ')}
      </p>
    </FadeIn>
  );
}

export default function Skills() {
  const { t } = useLocale();
  return (
    <section id="skills" className="py-24 md:py-32 px-6 border-t border-rule">
      <div className="max-w-6xl mx-auto">
        <SectionTitle>{t('skills.title')}</SectionTitle>

        <div className="divide-y divide-rule border-t border-b border-rule mb-12">
          <Tier label={t('skills.daily')} items={skills.daily} />
          <Tier label={t('skills.comfortable')} items={skills.comfortable} />
          <Tier label={t('skills.exploring')} items={skills.exploring} />
        </div>

        <FadeIn className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-widest text-amber mb-3">
            {t('skills.bestAt')}
          </p>
          <p className="font-display italic text-2xl md:text-3xl text-forest dark:text-cream leading-snug">
            {t('skills.bestAtValue')}
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Wire into `page.js`**

```jsx
import Skills from '@/components/sections/Skills';
// ...
<OtherProjects />
<Skills />
```

- [ ] **Step 3: Verify visually + commit**

Run: `npm run dev`. Skills section shows 3 tiers as text rows + italic "best at" callout. Stop server.

```bash
git add src/components/sections/Skills.jsx src/app/page.js
git commit -m "feat(skills): add Skills section with 3 tiers and best-at callout"
```

---

## Phase 10 — Experience

### Task 20: Experience section

**Files:**
- Create: `src/components/sections/Experience.jsx`

- [ ] **Step 1: Create `Experience.jsx`**

```jsx
"use client";

import { useLocale } from '@/lib/hooks/useLocale';
import { experience } from '@/lib/data/experience';
import SectionTitle from '@/components/ui/SectionTitle';
import FadeIn from '@/components/ui/FadeIn';

export default function Experience() {
  const { locale, t } = useLocale();
  const localize = (val) => (typeof val === 'string' ? val : val?.[locale]);

  return (
    <section id="experience" className="py-24 md:py-32 px-6 border-t border-rule bg-cream-deep/40 dark:bg-forest/30">
      <div className="max-w-6xl mx-auto">
        <SectionTitle>{t('experience.title')}</SectionTitle>

        <ol className="divide-y divide-rule border-t border-b border-rule">
          {experience.map((e, i) => (
            <li key={i}>
              <FadeIn className="grid md:grid-cols-12 gap-4 py-8">
                <span className="md:col-span-3 font-mono text-sm text-mute">
                  {localize(e.period)}
                </span>
                <div className="md:col-span-9">
                  <h3 className="font-display text-xl text-forest dark:text-cream">
                    {localize(e.role)} · <span className="text-mute">{localize(e.org)}</span>
                  </h3>
                  <ul className="mt-3 space-y-2 text-forest/90 dark:text-cream/90">
                    {(e.bullets[locale] || []).map((b, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <span className="text-amber mt-1.5">›</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Wire + verify + commit**

Add to `page.js`:
```jsx
import Experience from '@/components/sections/Experience';
// ...
<Skills />
<Experience />
```

Run: `npm run dev`, confirm timeline renders (year on left, role+bullets on right). Stop server.

```bash
git add src/components/sections/Experience.jsx src/app/page.js
git commit -m "feat(experience): add Experience timeline with editorial period:body grid"
```

---

## Phase 11 — Education

### Task 21: Education section

**Files:**
- Create: `src/components/sections/Education.jsx`

- [ ] **Step 1: Create `Education.jsx`**

```jsx
"use client";

import { useLocale } from '@/lib/hooks/useLocale';
import { education, certifications } from '@/lib/data/education';
import SectionTitle from '@/components/ui/SectionTitle';
import FadeIn from '@/components/ui/FadeIn';

export default function Education() {
  const { locale, t } = useLocale();
  const lz = (v) => (typeof v === 'string' ? v : v?.[locale]);

  return (
    <section id="education" className="py-24 md:py-32 px-6 border-t border-rule">
      <div className="max-w-6xl mx-auto">
        <SectionTitle>{t('education.title')}</SectionTitle>
        <div className="grid md:grid-cols-2 gap-12">
          <FadeIn>
            <p className="font-mono text-xs uppercase tracking-widest text-amber mb-3">
              {t('education.educationLabel')}
            </p>
            {education.map((e, i) => (
              <div key={i} className="mb-6">
                <h3 className="font-display text-xl text-forest dark:text-cream">{lz(e.degree)}</h3>
                <p className="text-mute mt-1">{e.school}</p>
                <p className="font-mono text-sm text-mute mt-1">{e.period}</p>
              </div>
            ))}
          </FadeIn>
          <FadeIn delay={120}>
            <p className="font-mono text-xs uppercase tracking-widest text-amber mb-3">
              {t('education.certLabel')}
            </p>
            {certifications.map((c, i) => (
              <div key={i} className="mb-6">
                <h3 className="font-display text-xl text-forest dark:text-cream">{lz(c.name)}</h3>
                <p className="text-mute mt-1">{lz(c.issuer)}</p>
              </div>
            ))}
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Wire + verify + commit**

```jsx
import Education from '@/components/sections/Education';
// ...
<Experience />
<Education />
```

Verify, then:
```bash
git add src/components/sections/Education.jsx src/app/page.js
git commit -m "feat(education): add Education & Certification two-column section"
```

---

## Phase 12 — Contact

### Task 22: Contact section

**Files:**
- Create: `src/components/sections/Contact.jsx`

- [ ] **Step 1: Create `Contact.jsx`**

```jsx
"use client";

import { Mail, Phone, Github, Instagram, MapPin, Download } from 'lucide-react';
import { useLocale } from '@/lib/hooks/useLocale';
import { meta } from '@/lib/data/meta';
import SectionTitle from '@/components/ui/SectionTitle';
import FadeIn from '@/components/ui/FadeIn';

export default function Contact() {
  const { locale, t } = useLocale();

  const items = [
    { icon: Mail, label: t('contact.email'), value: meta.email, href: `mailto:${meta.email}` },
    { icon: Phone, label: t('contact.whatsapp'), value: meta.whatsapp, href: meta.whatsappLink, ext: true },
    { icon: Github, label: t('contact.github'), value: meta.githubHandle, href: meta.github, ext: true },
    { icon: Instagram, label: t('contact.instagram'), value: meta.instagramHandle, href: meta.instagram, ext: true },
  ];

  return (
    <section id="contact" className="py-24 md:py-32 px-6 border-t border-rule bg-cream-deep/40 dark:bg-forest/30">
      <div className="max-w-6xl mx-auto">
        <SectionTitle>{t('contact.title')}</SectionTitle>
        <p className="text-lg md:text-xl text-mute max-w-3xl mb-12 leading-relaxed">
          {t('contact.intro')}
        </p>

        <FadeIn className="grid sm:grid-cols-2 gap-x-12 gap-y-6 max-w-3xl">
          {items.map(({ icon: Icon, label, value, href, ext }) => (
            <a
              key={label}
              href={href}
              {...(ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="flex items-baseline gap-4 group"
            >
              <Icon size={18} className="shrink-0 text-amber translate-y-[3px]" />
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-mute">{label}</p>
                <p className="text-forest dark:text-cream group-hover:text-amber transition-colors">{value}</p>
              </div>
            </a>
          ))}

          <div className="flex items-baseline gap-4 sm:col-span-2 pt-6 border-t border-rule">
            <MapPin size={18} className="shrink-0 text-amber translate-y-[3px]" />
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-mute">{t('contact.location')}</p>
              <p className="text-forest dark:text-cream">{meta.location[locale]}</p>
            </div>
          </div>
        </FadeIn>

        <div className="mt-12">
          <a
            href={meta.cvFile}
            download
            className="inline-flex items-center gap-2 bg-forest text-cream dark:bg-cream dark:text-forest px-5 py-3 text-sm font-semibold tracking-wide hover:bg-amber hover:text-cream transition-colors"
          >
            <Download size={16} /> {t('contact.downloadCV')}
          </a>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Wire + verify + commit**

```jsx
import Contact from '@/components/sections/Contact';
// ...
<Education />
<Contact />
```

```bash
git add src/components/sections/Contact.jsx src/app/page.js
git commit -m "feat(contact): add Contact section with editorial layout + CV download"
```

---

## Phase 13 — Footer

### Task 23: Footer

**Files:**
- Create: `src/components/sections/Footer.jsx`

- [ ] **Step 1: Create `Footer.jsx`**

```jsx
"use client";

import { useLocale } from '@/lib/hooks/useLocale';
import LangSwitcher from '@/components/nav/LangSwitcher';

export default function Footer() {
  const { t } = useLocale();
  const year = new Date().getFullYear();
  return (
    <footer className="py-10 px-6 border-t border-rule">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono text-xs uppercase tracking-widest text-mute">
        <p>
          {t('footer.builtWith')} · © {year} Utsman
        </p>
        <div className="flex items-center gap-6">
          <LangSwitcher />
          <a href="#top" className="hover:text-forest dark:hover:text-cream transition-colors">
            {t('footer.backToTop')}
          </a>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Wire + verify + commit**

```jsx
import Footer from '@/components/sections/Footer';
// ...
<Contact />
</main>
<Footer />
```

```bash
git add src/components/sections/Footer.jsx src/app/page.js
git commit -m "feat(footer): add minimal editorial footer with lang switcher echo"
```

---

## Phase 14 — SEO, OG image, favicon

### Task 24: Locale-aware metadata + JSON-LD

**Files:**
- Modify: `src/app/layout.js`
- Create: `src/components/JsonLd.jsx`

- [ ] **Step 1: Improve `layout.js` metadata**

Replace metadata block:

```javascript
export const metadata = {
  metadataBase: new URL('https://utsman.dev'), // Update if/when domain known
  title: {
    default: 'Utsman — Fullstack Web Developer',
    template: '%s — Utsman',
  },
  description: 'Fullstack engineer turning regulatory headaches into shipped software. Healthtech, BPJS bridging, OCR pipelines.',
  authors: [{ name: 'Utsman' }],
  creator: 'Utsman',
  openGraph: {
    title: 'Utsman — Fullstack Web Developer',
    description: 'Fullstack engineer turning regulatory headaches into shipped software.',
    url: '/',
    siteName: 'Utsman',
    locale: 'id_ID',
    alternateLocale: ['en_US'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Utsman — Fullstack Web Developer',
    description: 'Fullstack engineer turning regulatory headaches into shipped software.',
  },
  robots: { index: true, follow: true },
};
```

- [ ] **Step 2: Create `JsonLd.jsx`**

```jsx
import { meta } from '@/lib/data/meta';

export default function JsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Utsman',
    jobTitle: 'Fullstack Web Developer',
    email: meta.email,
    url: 'https://utsman.dev',
    sameAs: [meta.github, meta.instagram],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Banjarbaru',
      addressRegion: 'Kalimantan Selatan',
      addressCountry: 'ID',
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
```

- [ ] **Step 3: Inject `<JsonLd />` in layout**

In `src/app/layout.js`, before `<Providers>`:

```jsx
import JsonLd from '@/components/JsonLd';
// ...
<body className="...">
  <JsonLd />
  <Providers>{children}</Providers>
</body>
```

- [ ] **Step 4: Commit**

```bash
git add src/app/layout.js src/components/JsonLd.jsx
git commit -m "feat(seo): add full metadata and JSON-LD Person schema"
```

---

### Task 25: Dynamic OpenGraph image

**Files:**
- Create: `src/app/opengraph-image.jsx`

- [ ] **Step 1: Create `opengraph-image.jsx`**

```jsx
import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Utsman — Fullstack Web Developer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#F5F1E8',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px',
          fontFamily: 'serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 12, height: 12, background: '#C97B3F' }} />
          <span style={{ fontSize: 22, color: '#6B6B5E', letterSpacing: 4, textTransform: 'uppercase' }}>
            utsman.dev
          </span>
        </div>
        <div>
          <div style={{ fontSize: 140, color: '#1F3A2E', fontWeight: 900, lineHeight: 1, letterSpacing: -4 }}>
            Utsman
          </div>
          <div style={{ fontSize: 36, color: '#1F3A2E', fontStyle: 'italic', marginTop: 24, maxWidth: 900 }}>
            Fullstack engineer turning regulatory headaches into shipped software.
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 22, color: '#6B6B5E', letterSpacing: 2, textTransform: 'uppercase' }}>
          <span>Banjarbaru, ID</span>
          <span>Healthtech · BPJS · OCR</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run build`. Should complete without errors. (OG generates at build/request time.)

- [ ] **Step 3: Commit**

```bash
git add src/app/opengraph-image.jsx
git commit -m "feat(seo): add dynamic OG image (cream/forest editorial)"
```

---

### Task 26: Custom favicon

**Files:**
- Create: `src/app/icon.jsx`
- Delete: `src/app/favicon.ico`

- [ ] **Step 1: Create `icon.jsx`**

```jsx
import { ImageResponse } from 'next/og';

export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#1F3A2E',
          color: '#C97B3F',
          fontSize: 44,
          fontWeight: 900,
          fontFamily: 'serif',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          letterSpacing: -2,
        }}
      >
        U
      </div>
    ),
    { ...size }
  );
}
```

- [ ] **Step 2: Delete old favicon**

```bash
rm src/app/favicon.ico
```

- [ ] **Step 3: Commit**

```bash
git add src/app/icon.jsx src/app/favicon.ico
git commit -m "feat(seo): replace default favicon with editorial U icon"
```

---

## Phase 15 — Performance + a11y pass

### Task 27: Skip-to-content link

**Files:**
- Modify: `src/app/page.js`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Add skip link to `page.js`**

In `<Portfolio>` return, before `<Nav />`:

```jsx
<a href="#about" className="skip-link">Skip to content</a>
```

- [ ] **Step 2: Add `.skip-link` styles**

Append to `src/app/globals.css`:

```css
.skip-link {
  position: absolute;
  left: -9999px;
  top: 0;
  background: var(--color-amber);
  color: var(--color-cream);
  padding: 0.75rem 1rem;
  z-index: 100;
  font-weight: 600;
}
.skip-link:focus {
  left: 1rem;
  top: 1rem;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/page.js src/app/globals.css
git commit -m "feat(a11y): add skip-to-content link"
```

---

### Task 28: Replace remaining `<img>` and lint fix

**Files:**
- Audit: `src/components/**/*.jsx`

- [ ] **Step 1: Search for any leftover native `<img>`**

Run: search project for `<img ` — any hits should be replaced with `next/image`. If none, skip.

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: zero errors.

- [ ] **Step 3: Run tests**

Run: `npm test`
Expected: all green.

- [ ] **Step 4: Commit (if any fixes)**

```bash
git add -A
git commit -m "chore: lint fixes after section build-out" || echo "nothing to commit"
```

---

### Task 29: Build + Lighthouse smoke check

- [ ] **Step 1: Production build**

Run: `npm run build`
Expected: build succeeds, no errors. Page reported as static or dynamic — both OK.

- [ ] **Step 2: Production preview**

Run: `npm start` in background.
Open http://localhost:3000.

- [ ] **Step 3: Manual smoke check**

Verify in production build:
- All sections render
- ID/EN switcher persists across reload
- Theme toggle persists across reload
- CV download button works (will 404 until user adds `/Utsman-CV.pdf`)
- All anchors scroll
- Mobile (resize to 375px) renders cleanly
- No console errors

Stop production server.

- [ ] **Step 4: Commit if anything changed**

```bash
git add -A
git commit -m "chore: production build verified" || echo "no changes"
```

---

## Phase 16 — Final QA + cleanup

### Task 30: README update

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Replace README**

```markdown
# Utsman — Portfolio

Personal portfolio site. Editorial Warm direction, cream + forest + amber palette, bilingual (ID/EN).

## Stack
- Next.js 16 (App Router)
- React 19
- Tailwind CSS 4
- Vitest + Testing Library

## Run

```bash
npm install
npm run dev          # http://localhost:3000
npm test             # run tests
npm run build        # production build
npm start            # serve production build
```

## Editing content

- **Bio, projects, skills, experience, meta:** `src/lib/data/*.js`
- **UI strings (nav labels, section titles, CTAs):** `src/lib/i18n/{id,en}.js`
- **Default locale:** `src/lib/i18n/config.js` → `DEFAULT_LOCALE`
- **CV file:** drop `Utsman-CV.pdf` in `public/`
- **Photos:** `public/assets/img/`

## Adding a project

Add an entry to `projects.featured` (full case study) or `projects.other` (compact list) in `src/lib/data/projects.js`. Locale-keyed fields use `{ id: '...', en: '...' }`.

## Architecture

```
src/
├── app/                 # Next.js App Router pages
├── components/
│   ├── nav/             # Nav, LangSwitcher, ThemeToggle
│   ├── sections/        # Hero, About, SelectedWork, ...
│   └── ui/              # Primitives: SectionTitle, Rule, Tag, FadeIn
└── lib/
    ├── data/            # Content datasets
    ├── hooks/           # useLocale, useTheme, useInView
    └── i18n/            # Dictionaries + config
```
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: update README with new architecture and editing guide"
```

---

### Task 31: Final cleanup

- [ ] **Step 1: Remove unused public assets**

Check `public/`. Delete any unused SVGs from default Next template:

```bash
rm -f public/file.svg public/globe.svg public/next.svg public/vercel.svg public/window.svg
```

- [ ] **Step 2: Final lint + test + build**

Run in sequence:
```bash
npm run lint
npm test
npm run build
```
All must pass.

- [ ] **Step 3: Commit cleanup**

```bash
git add -A
git commit -m "chore: remove unused default Next.js public SVGs" || echo "none"
```

- [ ] **Step 4: Summary commit log**

Run: `git log --oneline origin/main..HEAD`
Verify ~30 commits showing the redesign progression.

---

## Definition of Done (verification checklist)

- [ ] All 31 tasks committed
- [ ] `npm test` green
- [ ] `npm run lint` clean
- [ ] `npm run build` succeeds
- [ ] Site renders on desktop (1280px), tablet (768px), mobile (375px)
- [ ] ID + EN switching works, persists across reload
- [ ] Dark mode toggles + persists
- [ ] All section anchors scroll smoothly
- [ ] CV download wired (file to be supplied by Utsman at `public/Utsman-CV.pdf`)
- [ ] No `<img>` tags remain (all `next/image`)
- [ ] No console errors in production build
- [ ] OG image renders (`/opengraph-image`)
- [ ] Favicon updated to editorial U
