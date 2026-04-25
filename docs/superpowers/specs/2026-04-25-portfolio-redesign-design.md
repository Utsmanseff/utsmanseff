# Portfolio Redesign — Design Spec

**Date:** 2026-04-25
**Owner:** Utsman
**Status:** Draft for review

---

## 1. Goal & Positioning

### Goal
Replace existing single-file Next.js portfolio (`src/app/page.js`, ~600 lines) with an editorial, warm, bilingual portfolio that:

- Looks unmistakably hand-crafted (not AI/template generated)
- Speaks to multiple audiences: freelance clients (local + international), agencies, full-time recruiters, startups, café owners
- Showcases healthtech depth (RME, BPJS bridging, OCR pipelines) as primary differentiator
- Supports ID + EN with dynamic default locale (config-driven)

### Tagline
> **Fullstack engineer turning regulatory headaches into shipped software.**

### Positioning summary
2-year fullstack developer based in Banjarbaru, Kalimantan Selatan, with disproportionate experience in mission-critical healthcare systems: built an OCR-powered hospital registration flow live at rsunirwana.id, rescued a hospital's BPJS bridging access under a Ministry of Health deadline by writing a custom IDRG integration, and rebuilt an EMR (Rekam Medis Elektronik) on top of a vendor SIMRS database with 1,168 tables because doctors wouldn't use the original UI.

---

## 2. Visual Direction

**Style:** Editorial Warm (Option 1, approved).

### Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--cream` | `#F5F1E8` | Page background (light mode) |
| `--cream-deep` | `#EDE6D3` | Section background variation, card surfaces |
| `--forest` | `#1F3A2E` | Primary text, headings, foreground |
| `--forest-deep` | `#0F1F18` | Page background (dark mode) |
| `--amber` | `#C97B3F` | Accent — links, underlines, key highlights |
| `--amber-soft` | `#E8B888` | Hover states, subtle accents |
| `--ink` | `#1A1A1A` | Body text emphasis |
| `--mute` | `#6B6B5E` | Muted text, captions, metadata |
| `--rule` | `#D9D0BC` | Horizontal rules, borders |

Dark mode swaps cream ↔ forest-deep, keeps amber.

**Why this palette:** cream + forest is rare in dev portfolios (most use teal/purple/blue), instantly differentiates. Burnt amber accent injects energy without screaming. Reads warm and editorial, not corporate.

### Typography

| Token | Font | Source | Usage |
|-------|------|--------|-------|
| `--font-display` | **Fraunces** (variable, 400/600/900, optical size) | Google Fonts | Hero name, section titles, large pull quotes |
| `--font-body` | **Inter** (variable, 400/500/700) | Google Fonts | Body, UI, navigation |
| `--font-mono` | **JetBrains Mono** | Google Fonts | Code snippets, tech stack tags, year labels |

Sizes:
- Hero name: `clamp(3.5rem, 8vw, 7rem)` Fraunces 900, optical size large, tight tracking
- Section title: `clamp(2.5rem, 5vw, 4rem)` Fraunces 600
- Body: `1.0625rem` (17px) Inter 400, line-height 1.65
- Pull quote: `1.5rem` Fraunces 400 italic
- Caption / mono: `0.875rem` JetBrains Mono 400

### Layout principles
- Max content width: `1200px` (`max-w-6xl`), `1000px` for prose-heavy sections (`max-w-5xl`)
- Generous whitespace: section padding `py-32` (desktop), `py-20` (mobile)
- Asymmetric grids: e.g., 7/5 split for hero (photo:text), 4/8 for case study image:body
- **No `rounded-2xl` everywhere.** Use sharp corners or subtle `rounded-sm` (4px). Photos can be `rounded-lg` (8px) max.
- **No glassmorphism, no `backdrop-blur`.** Solid surfaces.
- **No gradient buttons.** Solid amber on forest, or outlined.
- Horizontal rules (1px `--rule`) separate sections instead of background color shifts where appropriate.

### Motion
- Subtle: fade-up on scroll (intersection observer, 600ms ease-out, 30px translate)
- Hover: 200ms ease, color/underline shifts only — no scale/rotate
- Page load: hero fade-in once, no re-trigger
- **No** AOS, Framer Motion needed. Custom small hook `useInView` is enough.

---

## 3. Information Architecture

### Page sections (single-page, scroll narrative)

1. **Nav** — sticky top, transparent over hero, solid on scroll
2. **Hero** — name, tagline, CTAs, photo
3. **About** — story-first bio, side panel facts
4. **Selected Work** — 3 case studies (RSU Nirwana web, IDRG bridging, RME)
5. **Other Projects** — 4 remaining projects, list format
6. **Skills & Toolbox** — narrative tiers, not icon grid
7. **Experience** — editorial timeline
8. **Education & Certification**
9. **Contact** — email, WhatsApp, GitHub, Instagram, location
10. **Footer** — minimal: built-with, year, locale switcher echo

### Routing
- Single page (`/`) — keeps SEO simple, scroll narrative fits editorial style
- No separate case study pages in v1 (deferred to v2 if needed — YAGNI)

---

## 4. Component Architecture

Break monolithic `page.js` into focused components.

```
src/
├── app/
│   ├── layout.js
│   ├── page.js                    # Composes sections only
│   ├── globals.css                # Tailwind + custom tokens
│   └── opengraph-image.jsx        # Dynamic OG image generator
├── components/
│   ├── nav/
│   │   ├── Nav.jsx
│   │   ├── LangSwitcher.jsx
│   │   └── ThemeToggle.jsx
│   ├── sections/
│   │   ├── Hero.jsx
│   │   ├── About.jsx
│   │   ├── SelectedWork.jsx
│   │   ├── CaseStudy.jsx          # Reusable per project
│   │   ├── OtherProjects.jsx
│   │   ├── Skills.jsx
│   │   ├── Experience.jsx
│   │   ├── Education.jsx
│   │   ├── Contact.jsx
│   │   └── Footer.jsx
│   └── ui/
│       ├── SectionTitle.jsx
│       ├── Rule.jsx               # Horizontal divider
│       ├── Tag.jsx                # Tech stack tag
│       ├── ExternalLink.jsx
│       └── FadeIn.jsx             # Scroll fade wrapper
├── lib/
│   ├── i18n/
│   │   ├── config.js              # DEFAULT_LOCALE, supported list
│   │   ├── dictionary.js          # Loads correct dict
│   │   ├── id.js                  # Indonesian content
│   │   └── en.js                  # English content
│   ├── hooks/
│   │   ├── useLocale.js
│   │   ├── useTheme.js
│   │   └── useInView.js
│   └── data/
│       ├── projects.js            # All project data, locale-keyed
│       ├── skills.js
│       ├── experience.js
│       └── meta.js                # Bio, contacts, links
└── ...
```

### Why this split
- Each section <150 lines, easy to edit independently
- Content (`lib/data/`) separated from presentation — copy edits don't risk breaking layout
- `lib/i18n/` isolated so swapping default locale or adding language is trivial
- `ui/` primitives reusable, prevent ad-hoc Tailwind divergence

---

## 5. Internationalization

### Approach
Lightweight dictionary-based i18n. **Not** `next-intl` (overkill for a single-page site). React Context + `localStorage`.

### Files

**`lib/i18n/config.js`**
```js
export const DEFAULT_LOCALE = 'id';     // Change here to swap default
export const LOCALES = ['id', 'en'];
export const STORAGE_KEY = 'utsman.locale';
```

**`lib/i18n/dictionary.js`**
```js
import id from './id';
import en from './en';
export const dict = { id, en };
```

### Resolution order
1. URL query param (`?lang=en`) — for sharing localized links
2. `localStorage[STORAGE_KEY]` — visitor's previous choice
3. Browser `navigator.language` — auto-detect
4. `DEFAULT_LOCALE` from config — fallback

### Switcher
`LangSwitcher` in nav: small `ID / EN` text toggle, current locale bold, other muted. No flag icons (locale ≠ country, also visually noisy).

### Content translation pattern
For Indonesian regulatory terms, EN version uses english + glossary parenthetical first occurrence:
- "BPJS (Indonesia's national health insurance)"
- "Permenkes (Ministry of Health regulation)"
- "SIMRS (hospital management information system)"
- "IDRG / INA-CBGs (Indonesian diagnosis-related groups, BPJS claims standard)"

After first mention, use abbreviation alone.

---

## 6. Section Specifications

### 6.1 Nav
- Sticky top, `h-16`, `bg-cream/0 backdrop-blur-0` over hero
- On scroll past 80px: `bg-cream` solid, subtle bottom rule
- Left: "Utsman" Fraunces 600
- Right: section anchors (About, Work, Skills, Contact), `LangSwitcher`, `ThemeToggle`
- Mobile: hamburger → full-screen overlay menu (cream bg, large editorial menu items)

### 6.2 Hero
**Layout:** asymmetric 7/5 grid (text:photo on desktop, stacked on mobile, photo first on mobile)

**Text column:**
- Eyebrow: small mono caps "Available for projects · Banjarbaru, ID" (subtle, not pill badge)
- Name: "Utsman" Fraunces 900, massive
- Role: "Fullstack Web Developer" Inter 500 muted
- Tagline (2-line max): *"Fullstack engineer turning regulatory headaches into shipped software."* Fraunces 400 italic
- Bio teaser: 2 sentences plain Inter
- CTAs:
  - Primary: solid amber → "View case studies" (anchor #work)
  - Secondary: outlined forest → "Download CV" (downloads `Utsman-CV.pdf`)
  - Tertiary text link: "Email me →"

**Photo column:**
- Use `public/assets/img/utsman.png` (already in repo)
- Treatment: `aspect-[4/5]`, `rounded-lg` (8px), subtle 1px amber border offset bottom-right (`box-shadow: 8px 8px 0 var(--amber)`) — editorial touch, not generic rounded square
- `next/image` with `priority`, `sizes="(min-width: 768px) 40vw, 100vw"`

### 6.3 About
**Layout:** 8/4 prose:facts split

**Prose (8 cols):**
- Section title: "About" / "Tentang"
- 3-4 paragraphs first-person, drop-cap on first letter (Fraunces 900, 4 lines tall, amber)

**Draft EN:**
> I started programming in 2021, drawn by a simple observation: most of the work people complain about can be made faster, cleaner, or both with software. By 2024 I was full-time on Laravel, and now spend my days building systems for hospitals, government offices, and small businesses across Kalimantan.
>
> My focus is healthcare technology. At RSU Nirwana I maintain electronic medical records, BPJS claims pipelines, and a public-facing hospital site I rebuilt with OCR-powered registration. The work is unforgiving — Ministry of Health audits, doctor workflows that can't break mid-shift, claim deadlines tied to hospital revenue — and that pressure has shaped how I write software: ship something that runs, document what you did, fix what breaks before anyone notices.
>
> Outside healthcare, I take freelance work for café operators, certification offices, and asset management for forestry units. Same approach: understand the actual problem first, propose the smallest thing that solves it, ship in weeks not quarters.
>
> Right now I'm sharpening TypeScript, eyeing Go and .NET for backend variety, and planning to extend into mobile with Flutter.

**Draft ID:**
> Saya mulai ngoding tahun 2021, berangkat dari satu pengamatan sederhana: kebanyakan pekerjaan yang orang keluhkan bisa dipercepat, dirapikan, atau dua-duanya dengan bantuan software. Tahun 2024 saya full-time di Laravel, dan sekarang sehari-hari membangun sistem untuk rumah sakit, instansi pemerintah, dan UMKM di Kalimantan.
>
> Fokus utama saya teknologi kesehatan. Di RSU Nirwana saya mengelola Rekam Medis Elektronik, alur klaim BPJS, dan website publik rumah sakit yang saya bangun ulang dengan OCR di pendaftaran. Pekerjaannya tidak ramah — audit Kementerian Kesehatan, alur kerja dokter yang tidak boleh putus di tengah shift, deadline klaim yang menyangkut pendapatan rumah sakit — dan tekanan itu yang membentuk cara saya menulis kode: ship yang jalan, dokumentasikan yang dikerjakan, perbaiki sebelum ada yang sadar rusak.
>
> Di luar healthcare, saya ambil project freelance untuk operator café, kantor sertifikasi, dan manajemen aset untuk unit kehutanan. Pendekatan sama: pahami masalah nyata dulu, tawarkan solusi paling kecil yang menyelesaikan, ship dalam hitungan minggu bukan kuartal.
>
> Sekarang lagi mendalami TypeScript, melirik Go dan .NET untuk variasi backend, dan rencana ekspansi ke mobile pakai Flutter.

**Facts panel (4 cols):**
- Mono caps labels, body values
- Items: Location, Education, Certification, Years coding, Primary stack, Currently learning, Languages spoken (Indonesian native, English working)

### 6.4 Selected Work — Case Studies

3 case studies, each rendered by `<CaseStudy />` component. Format per case study:

**Anatomy:**
- Eyebrow: client + year + status (live/internal) + sector mono caps
- Title: project name Fraunces 600
- One-line summary: Inter 500 large
- 4-block content:
  1. **Problem** (paragraph)
  2. **Approach** (paragraph + 3-4 bullet teknis)
  3. **Outcome** (paragraph; numbers if available, qualitative if not)
  4. **What was hard** (1 paragraph — the technical war story; this is the anti-AI signature)
- Tech stack: inline mono tags
- Live link button (if applicable) + screenshot gallery (3-5 images, masonry or simple grid)

**Case Study 1: RSU Nirwana Hospital Web (rsunirwana.id)**
- **Problem (EN):** The hospital had online pre-registration, but it only reserved a queue slot. Patients still had to queue at the counter for re-registration, manually re-typing information into the internal system. Elderly patients struggled with the long form and made frequent typos. The web registration data lived in isolation from the internal hospital system, so receptionists ended up duplicating data entry.
- **Approach:** Rebuilt the registration flow with KTP (Indonesian ID card) OCR scanning via Google Cloud Vision API to eliminate manual typing for new patients, and bridged the web registration directly into the internal hospital system so registered patients only need to show a confirmation slip at the counter. Stack: Laravel + MySQL + Google Vision API + REST integration to internal SIMRS.
- **Outcome:** Counter queue throughput improved (need actual numbers from user), elderly patient registration completion rate up, receptionist double-entry eliminated. Site live at rsunirwana.id.
- **What was hard:** Tuning OCR accuracy on KTP photos taken in highly variable lighting and skew, and aligning two separately-owned data schemas (web app + vendor SIMRS) without breaking the vendor's expectations.

**Case Study 2: IDRG / INA-CBGs Full Bridging for BPJS Claims**
- **Problem (EN):** A Ministry of Health (Kemenkes) circular required hospitals to update their IDRG patches and integrate diagnostic data between SIMRS and the national SatuSehat platform. Our SIMRS vendor had IDRG bridging capability, but their component layout did not meet the new Kemenkes requirements. Our compliance test failed, and we were warned that bridging access — the channel through which BPJS claims are submitted — would be revoked.
- **Approach:** Built a custom web service from scratch to integrate claim data per the new Kemenkes specification, working from BPJS API documentation directly. The service mediates between our internal SIMRS data and the BPJS endpoints, enforcing the schema and component layout that the vendor's tool didn't.
- **Outcome:** Passed the Kemenkes compliance test, restored bridging access, claims now flow correctly to both BPJS and the internal system.
- **What was hard:** Coordinating multiple BPJS API endpoints (eligibility, claim submission, status, IDRG grouping) under a deadline imposed by an external regulator, with no margin for retries — if the bridging access stayed revoked, the hospital couldn't submit claims at all.

**Case Study 3: Rekam Medis Elektronik (RME)**
- **Problem (EN):** A Permenkes regulation mandated electronic medical records, with non-compliance threatening doctors' practice licenses (SIP) and the hospital's accreditation. The vendor SIMRS already had an EMR module, but doctors found the UI awkward and quietly went back to paper for SOAP notes, lab requests, prescriptions, and radiology orders.
- **Approach:** Built a parallel EMR layer with a UI shaped by what doctors actually wanted, sitting on top of the same vendor SIMRS database. SOAP notes, lab requests, prescriptions, and radiology orders all flow back into the canonical SIMRS tables so existing reports keep working.
- **Outcome:** Doctors started using the EMR digitally instead of paper, partial but real adoption, hospital regulatory exposure reduced.
- **What was hard:** The vendor SIMRS database has 1,168 tables. Mapping out which ones owned which clinical data, what their relationships were, and which constraints would break if I wrote into them required reverse-engineering a system I had no documentation for. Most of the work wasn't UI — it was patient archaeology in a database designed by someone else.

(Numbers in outcome sections need to be filled in by Utsman with actual figures. Where unavailable, keep qualitative phrasing.)

### 6.5 Other Projects

Compact list, not card grid. Format per row (table-like, not actual table):

```
[Year]   [Title]                                      [Tags]              [→]
2025     Sistem Kepegawaian & Absensi Geolocation     Laravel · Livewire  ↗
         BPN Banjarbaru
2025     Sistem Manajemen Aset & Inventaris           Laravel · Blade     ↗
         UPT-KPHL Kapuas Kahayan
2025     Sertifikasi Benih                            Laravel · Livewire  ↗
         BPSPTPH Banjarbaru
```

Section intro line under title (small italic, mute color):
> *"A selection — many other client projects not listed."* / *"Cuplikan saja — masih banyak project klien lain yang tidak dicantumkan."*

Click row → expand inline (1 paragraph desc + features), don't navigate away.

Add coming-soon row:
```
SOON     PPDB Online with Computer-Based Test         Laravel · ?         ⋯
```

### 6.6 Skills & Toolbox

**No icon grid.** Three tiers, prose-style:

**Daily (2+ years):**
> Laravel · MySQL · PHP · JavaScript · HTML · CSS · Bootstrap · Livewire · REST APIs · Git

**Comfortable (active use):**
> React · Next.js · Tailwind CSS · Alpine.js · Blade · Geolocation APIs · OCR pipelines · BPJS / IDRG / SatuSehat integrations

**Currently exploring:**
> TypeScript · Go · .NET · Flutter

**What I'm best at:**
> Problem-solving on legacy/vendor systems, integrating regulated APIs, shipping under deadline pressure.

Each tier as a paragraph or `<dl>` with timestamp footnote ("started 2021", "active since 2024", etc.) — proves real timeline, not bullshit.

### 6.7 Experience

Editorial timeline, year on left, role+org+highlights on right. 1px rule between entries.

| 2024 — Present | **Programmer** · RSU Nirwana<br>RME, e-Klaim BPJS, IDRG bridging, IT infrastructure |
| 2024 — Present | **Freelance Web Developer**<br>Café operators, government offices, certification authorities |
| 2023           | **Data & Admin Staff** · DPMPTSP Kota Banjarbaru (intern)<br>Permit data processing, digital archiving |

### 6.8 Education & Certification

Two-column, simple:

**Education**
S1 Teknik Informatika — Universitas Islam Kalimantan MAB (Uniska), 2020-2024

**Certification**
Object Programmer — Badan Nasional Sertifikasi Profesi (BNSP)

### 6.9 Contact

NOT full-bleed teal gradient. Section style consistent with rest:

- Section title: "Get in touch" / "Hubungi saya"
- 1 paragraph editorial intro
- 2x2 grid of contact items (no card backgrounds, just labels + values + icons inline):
  - **Email** seffutsmannnn@gmail.com
  - **WhatsApp** +62 823 5273 4167
  - **GitHub** github.com/Utsmanseff
  - **Instagram** @utsmnseff
- Below: **Location** Banjarbaru, Kalimantan Selatan
- Below: small download CV button repeat

### 6.10 Footer
- 1 line: "Built with Next.js + Tailwind, 2026 · ID / EN switcher · top↑"
- Mono small text muted

---

## 7. Assets & Content Checklist

### Assets needed (Utsman to provide / confirm)

- [x] **Hero photo** — `public/assets/img/utsman.png` (already exists, may need re-export for higher res / different crop)
- [ ] **Case study screenshots:**
  - RSU Nirwana web — 3-5 screenshots (live, can grab from rsunirwana.id; use desktop Chrome devtools)
  - IDRG bridging — 3-5 screenshots (internal, Utsman to send)
  - RME — 3-5 screenshots (internal, Utsman to send)
- [ ] **Other project screenshots** — current `public/assets/img/*.jpg` exist, may need re-export at consistent aspect ratio
- [ ] **CV PDF** — Utsman to drop at `public/Utsman-CV.pdf`
- [ ] **OG image** — generated dynamically via `app/opengraph-image.jsx` using Fraunces + amber + cream
- [ ] **Favicon** — custom "U" in Fraunces, amber on cream, multiple sizes

### Content needed
- Actual outcome numbers for case studies (queue throughput, registration completion rate, claims volume) — Utsman fill in where possible; if unavailable, ship qualitative version

---

## 8. Technical Implementation Details

### Stack (no changes)
- Next.js 16 (App Router)
- React 19.2
- Tailwind CSS 4
- `lucide-react` for minimal icons
- `next/font` for Fraunces, Inter, JetBrains Mono

### Dark mode
- Class-based (`<html class="dark">`)
- Persist via `localStorage['utsman.theme']`
- Honor `prefers-color-scheme` first visit only
- `useTheme` hook centralizes

### Performance targets
- Lighthouse Performance ≥ 95 (mobile)
- LCP < 2.0s on 4G
- CLS < 0.05
- All images via `next/image`
- Fonts preloaded with `display: swap`

### SEO
- `<title>` per locale: "Utsman — Fullstack Web Developer" / "Utsman — Web Developer Fullstack"
- `<meta description>` per locale
- `alternate` link tags for ID/EN
- `og:image` dynamic
- `og:locale` set per current language
- JSON-LD `Person` schema
- `sitemap.xml` (single page, but proper)
- `robots.txt`

### Accessibility
- All interactive elements keyboard reachable
- Focus styles visible (2px amber outline, 2px offset)
- `prefers-reduced-motion` disables fade-in animations
- Color contrast AA minimum for body, AAA target for headings (cream/forest passes easily)
- All images have meaningful `alt` (locale-aware)
- Skip-to-content link for screen readers

### Analytics
- None in v1 (defer to user decision, mention as future option: Plausible or Umami)

---

## 9. Out of Scope (v1)

- Separate per-project case study pages (single-page scroll is enough for now)
- Blog / writing section (no content ready)
- Testimonials (user opted out)
- Contact form (mailto + WhatsApp links sufficient)
- CMS integration (content lives in `lib/data/` JS files; refactor to MDX or CMS only if maintenance becomes painful)
- Animations beyond fade-up
- 3D / canvas effects
- Custom cursor
- Music / sound

---

## 10. Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Translation quality in EN copy may sound stiff | Draft included in spec; user reviews EN copy before ship |
| Outcome numbers unavailable for case studies | Fall back to qualitative descriptions; do not invent numbers |
| Internal screenshots delayed | Build with placeholder (gray rectangle + label "Internal screenshots — available on request"); swap in when available without code changes |
| Fraunces + Inter + JetBrains Mono = font weight | All from Google Fonts variable, total ~80KB woff2 with subsetting; acceptable |
| Forest dark mode might feel too dark | Test with user before lock; have `--forest-deep` swap option ready |

---

## 11. Definition of Done

- All sections render correctly in both ID and EN
- Locale switcher persists choice across sessions
- Dark mode toggle works and persists
- All internal links scroll smoothly to sections
- CV downloads when button clicked
- Lighthouse mobile Performance/Accessibility/Best Practices/SEO all ≥ 95
- No console errors
- Renders cleanly on mobile (375px), tablet (768px), desktop (1280px+)
- All `<img>` replaced with `next/image`
- No unused imports
- README updated with run instructions and content-edit guide
