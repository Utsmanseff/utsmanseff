# Portfolio Redesign — Progress Memory

> Cross-session memory. Dibaca di awal tiap sesi baru biar tau status terakhir. Update tiap selesai task.

## Lokasi Kerja

- **Worktree path:** `D:\portfolio-utsman\.claude\worktrees\confident-cohen-17705d\`
- **Branch:** `portfolio-redesign-impl`
- **Base repo:** `D:\portfolio-utsman\` (branch `main` masih versi lama, belum disentuh)
- **Cek di dev:** `cd` ke worktree path → `npm run dev`

## Dokumen Acuan

- **Spec design:** `docs/superpowers/specs/2026-04-25-portfolio-redesign-design.md`
- **Plan implementasi:** `docs/superpowers/plans/2026-04-25-portfolio-redesign.md` (16 phase, 31 task)
- **Memory ini:** `docs/PROGRESS.md`

## Status Phase

| Phase | Nama | Task | Status |
|-------|------|------|--------|
| 1 | Foundation (deps, fonts, tokens, skeleton) | T1-T5 | done |
| 2 | i18n + hooks (config, dict, useLocale, useTheme, useInView) | T6-T8 | done |
| 3 | Content data (projects, skills, experience, education, meta) | T9-T10 | done |
| 4 | UI primitives (Providers, SectionTitle, Rule, Tag, FadeIn, ExternalLink, LangSwitcher, ThemeToggle) | T11-T13 | done |
| 5 | Nav + Hero | T14-T15 | done |
| 6 | About | T16 | done |
| 7 | SelectedWork (3 case studies) | T17 | done |
| 8 | OtherProjects | T18 | done |
| 9 | Skills | T19 | done (icon-grid rewrite) |
| 10 | Experience | T20 | done (expandable rows) |
| 11 | Education | T21 | done |
| 12 | Contact | T22 | pending |
| 13 | Footer | T23 | pending |
| 14 | SEO + OG image + favicon | T24-T26 | pending |
| 15 | Perf + a11y | T27-T29 | pending |
| 16 | README + cleanup | T30-T31 | pending |

## Commit Log (Phase 1-7)

```
810446b feat(work): add Selected Work with 3 healthtech case studies
0d195b7 fix(motion,interactivity): real fade re-trigger + rich hover effects
57ba496 fix(ui,motion): polish interactivity, fix mobile layouts, kill FadeIn dead-state
522ff24 fix(about,hero,motion): rewrite copy, mobile photo, reliable FadeIn
1970647 fix(about,motion): tighter ID copy, drop learning fact, fix FadeIn trigger
efc0c85 docs: update PROGRESS — phase 6 (About) + copy polish
1c4f66f feat(about): add About section with drop-cap prose + facts panel
74dde55 fix(hero): plain photo, no frame
c0c908c fix(copy,hero): natural ID copy (UX-first tagline) + lighter photo frame
540ca61 docs: update PROGRESS — phase 5 (Nav + Hero) done
f561356 feat(hero): add hero section with photo + amber offset, CTAs, locale-aware copy
759c070 feat(nav): add Nav with scroll state and mobile overlay
4576cfe docs: update PROGRESS — phase 4 (UI primitives) done
1340211 feat(nav): add LangSwitcher and ThemeToggle
4f21c8c feat(ui): add SectionTitle, Rule, Tag, FadeIn, ExternalLink primitives
567da2c feat(layout): compose Theme + Locale providers in root layout
e0f5fd3 docs: update PROGRESS — phase 3 (data) done
8baf53f feat(data): add skills, experience, education, meta datasets
8b9f4d2 feat(data): add bilingual project dataset (3 case studies + others + soon)
50029c6 docs: add PROGRESS memory file for cross-session context
439b43c feat(motion): add useInView hook for scroll-triggered animations
1b607f6 feat(theme): add useTheme hook with localStorage + prefers-color-scheme
58ef9ff feat(i18n): add useLocale hook with URL/storage/browser resolution
d123891 feat(i18n): add config + ID/EN dictionaries with shared key contract
db3628e refactor(page): wipe to skeleton, ready for component sections
fd33985 feat(theme): add cream/forest/amber tokens, font vars, focus styles
26c2bf3 feat(layout): switch to Fraunces + Inter + JetBrains Mono via next/font
d776250 chore: add vitest + testing-library, configure @/* alias
a3c4825 docs: add portfolio redesign implementation plan
b544eaf docs: add portfolio redesign spec (editorial warm, bilingual)
```

## File Sudah Dibuat

### Config
- `vitest.config.mjs`, `vitest.setup.js`
- `jsconfig.json` (added `baseUrl`)
- `package.json` (added test scripts + devDeps: vitest, @vitejs/plugin-react, happy-dom, @testing-library/{react,jest-dom,user-event})

### App
- `src/app/layout.js` (Fraunces + Inter + JetBrains Mono via next/font, `lang="id"`)
- `src/app/globals.css` (cream/forest/amber tokens, dark variant, focus, reduced-motion)
- `src/app/page.js` (skeleton: "Utsman" + "Fullstack Web Developer")

### i18n
- `src/lib/i18n/config.js` — `DEFAULT_LOCALE='id'`, `LOCALES=['id','en']`, `STORAGE_KEY='utsman.locale'`
- `src/lib/i18n/id.js`, `src/lib/i18n/en.js` — full dict (nav/hero/about/work/other/skills/experience/education/contact/footer/ui)
- `src/lib/i18n/dictionary.js` — `{ id, en }`
- `src/lib/i18n/__tests__/dictionary.test.js` — 3 test

### Hooks
- `src/lib/hooks/useLocale.jsx` — Provider + hook, `{ locale, setLocale, t, hydrated }`, resolution: URL `?lang` > localStorage > navigator.language > DEFAULT
- `src/lib/hooks/useTheme.jsx` — Provider + hook, `{ theme, toggle }`, `localStorage['utsman.theme']`
- `src/lib/hooks/useInView.js` — IntersectionObserver, `{ ref, inView }`, opts `{ threshold, rootMargin, once }`
- Test: `useLocale.test.jsx` (4), `useTheme.test.jsx` (3), `useInView.test.jsx` (1)

**Total: 11 test pass, 4 file test.**

### Data (Phase 3)
- `src/lib/data/projects.js` — 3 featured case studies (RSU Nirwana web, IDRG bridging, RME) + 3 other (sigap-bpn, aset-kphl, sertifikasi-benih) + 1 soon (ppdb-cbt). Bilingual `{ id, en }` per field.
- `src/lib/data/skills.js` — daily/comfortable/exploring + timeline
- `src/lib/data/experience.js` — 3 entry (RSU Nirwana programmer, freelance, DPMPTSP intern)
- `src/lib/data/education.js` — Uniska MAB + BNSP cert
- `src/lib/data/meta.js` — kontak, sosmed, CV path, foto path

### Components (Phase 4)
- `src/components/Providers.jsx` — `<ThemeProvider><LocaleProvider>{children}</LocaleProvider></ThemeProvider>`, wired ke `src/app/layout.js`
- `src/components/ui/SectionTitle.jsx` — `<header>` + eyebrow (mono) + h2 (Fraunces 4xl-6xl)
- `src/components/ui/Rule.jsx` — `<hr>` border-rule
- `src/components/ui/Tag.jsx` — mono uppercase pill border-rule
- `src/components/ui/FadeIn.jsx` — IntersectionObserver wrap, opacity+translate-y transition (`useInView`)
- `src/components/ui/ExternalLink.jsx` — amber underline `target="_blank" rel="noopener noreferrer"`
- `src/components/nav/LangSwitcher.jsx` — id/en toggle, `aria-pressed`, `role="group"`
- `src/components/nav/ThemeToggle.jsx` — Sun/Moon icon (lucide-react), call `useTheme().toggle`

### Sections (Phase 5)
- `src/components/nav/Nav.jsx` — fixed nav, scroll-state (transparent → cream/95 backdrop), desktop links + LangSwitcher + ThemeToggle, mobile overlay (Menu/X icon)
- `src/components/sections/Hero.jsx` — 12-col grid, eyebrow + name (Fraunces 8vw clamp) + role + tagline (italic) + bioTeaser + CTAs (Lihat case study/Unduh CV/Email), photo `next/image` + amber offset
- `src/app/page.js` — wired `<Nav /> + <main><Hero /></main>`
- Build pass (`npm run build` ✓)

### Sections (Phase 6)
- `src/components/sections/About.jsx` — 12-col grid; 2 paragraf bilingual padat dengan `text-justify hyphens-auto` (kolom 8) + facts panel (kolom 4): mobile grid 2-col compact, desktop dl `border-l`. 6 facts (Lokasi/Pendidikan/Sertifikasi/Pengalaman/Stack/Bahasa)

### Sections (Phase 7)
- `src/components/sections/CaseStudy.jsx` — bilingual case study card. Eyebrow (client·year·status·sector) → judul (Fraunces 3xl-4xl) → summary → image (16/9, hover scale-1.03) → 3-col grid (Problem/Approach/Outcome amber labels) → bullets approach → italic "Yang sulit" (Fraunces) → tech tags (border-rule, hover amber) + visit link (↗ animated)
- `src/components/sections/SelectedWork.jsx` — section wrapper bg cream-deep/40 (forest/30 dark), render `projects.featured` map dengan `<Rule />` separator. Wire ke `page.js`.
- 3 case studies aktif: RSU Nirwana web (OCR), IDRG bridging, RME

### Copy Polish
- ID tagline: "Memecahkan masalah nyata dengan software yang nyaman dipakai sehari-hari." (UX-first, no regulasi)
- EN tagline: "Solving real problems with software that feels effortless to use."
- ID: Selected Work → Project Pilihan, Other Projects → Project Lainnya, COMING SOON → SEGERA
- ID: "(native)/(working)" → "(asli)/(percakapan kerja)"
- Hero foto: polos rounded-lg, no offset/frame

## Keputusan Teknis Penting

- **Test env:** `happy-dom` (bukan jsdom — jsdom 27 ESM error sama `@csstools/css-calc`)
- **Hook file extension:** `.jsx` jika ada JSX (Vite reject `.js` yang berisi JSX)
- **Locale default test:** stub `navigator.language='fr'` di `beforeEach` (happy-dom default 'en' yang ada di LOCALES jadi menang lawan DEFAULT_LOCALE)
- **i18n key contract:** test enforce semua locale share top-level keys dengan default

## Aset User Belum Dikirim (dibutuhkan Phase 3+)

- `Utsman-CV.pdf` → drop di `public/`
- Screenshot internal IDRG case study
- Screenshot internal RME case study
- Outcome numbers asli (kalau ada angka konkret)

## Cara Resume di Sesi Baru

1. `cd D:\portfolio-utsman\.claude\worktrees\confident-cohen-17705d`
2. `git status` + `git log --oneline -15` cek state
3. Baca `docs/PROGRESS.md` (file ini)
4. Baca `docs/superpowers/plans/2026-04-25-portfolio-redesign.md` cari task dengan checkbox `- [ ]` pertama
5. Lanjut task tersebut

## Cara Cek Hasil di Browser

```
cd D:\portfolio-utsman\.claude\worktrees\confident-cohen-17705d
npm run dev
```

Buka `http://localhost:3000`. Saat ini cuma skeleton — section UI belum ada (Phase 5+).

## Cara Run Test

```
npm test          # watch mode
npm run test:run  # single run
```
