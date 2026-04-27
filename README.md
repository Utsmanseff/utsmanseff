# Utsman — Portfolio

Personal portfolio site. Editorial Warm direction (cream + forest + amber palette), bilingual ID/EN, healthcare-tech focus.

Live: [utsman.dev](https://utsmanseff-vercel.app) (placeholder until domain wired)

## Stack

- **Next.js 16** (App Router, Turbopack, static prerender)
- **React 19** (concurrent renderer)
- **Tailwind CSS 4** (`@theme` design tokens, dark variant)
- **Vitest + Testing Library + happy-dom** (hooks + i18n contract tests)
- **next/font** (Fraunces · Inter · JetBrains Mono via `next/font/google`)
- **lucide-react + react-icons/si** (UI + brand icons)

## Run

```bash
npm install
npm run dev          # http://localhost:3000
npm test             # run tests
npm run lint         # eslint
npm run build        # production build
npm start            # serve production build
```

## Editing content

| What | Where |
|------|-------|
| Bio paragraphs, facts panel | `src/lib/i18n/{id,en}.js` → `about` |
| Featured case studies (full) | `src/lib/data/projects.js` → `projects.featured` |
| Other projects (compact list) | `src/lib/data/projects.js` → `projects.other` |
| Coming-soon projects | `src/lib/data/projects.js` → `projects.soon` |
| Skill chips + brand icons | `src/lib/data/skills.js` (icon names from `react-icons/si`) |
| Experience timeline | `src/lib/data/experience.js` |
| Education + certs | `src/lib/data/education.js` |
| Contact info, socials | `src/lib/data/meta.js` |
| UI strings (nav, CTAs, labels) | `src/lib/i18n/{id,en}.js` |
| Default locale | `src/lib/i18n/config.js` → `DEFAULT_LOCALE` |
| CV file | drop `Utsman-CV.pdf` in `public/` |
| Photos | `public/assets/img/` |

## Adding a featured case study

Append to `projects.featured` in `src/lib/data/projects.js`:

```js
{
  id: 'unique-slug',
  client: 'Client Name',
  year: '2026',
  status: 'live',           // or 'internal'
  site: 'https://...',      // or null
  sector: { id: 'Healthcare', en: 'Healthcare' },
  image: '/assets/img/foo.png',
  shortName: { id: 'Foo', en: 'Foo' },
  title:    { id: '...', en: '...' },
  summary:  { id: '...', en: '...' },
  tech: ['Laravel', 'MySQL', ...],
  problem:  { id: '...', en: '...' },
  approach: {
    id: '...', en: '...',
    bullets: { id: ['...'], en: ['...'] },
  },
  outcome:  { id: '...', en: '...' },
  hard:     { id: '...', en: '...' },
}
```

The slider auto-renders the new entry; modal pulls all detail fields.

## Architecture

```
src/
├── app/
│   ├── layout.js              # fonts, metadata, JSON-LD, providers
│   ├── page.js                # section composition
│   ├── globals.css            # @theme tokens, skip-link, reduced-motion
│   ├── opengraph-image.jsx    # 1200x630 dynamic OG (next/og)
│   └── icon.jsx               # 64x64 favicon (next/og)
├── components/
│   ├── Providers.jsx          # Theme + Locale composition
│   ├── JsonLd.jsx             # Schema.org Person
│   ├── nav/                   # Nav, LangSwitcher, ThemeToggle
│   ├── sections/              # Hero, About, Skills, Experience,
│   │                          # Education, SelectedWork, CaseStudyModal,
│   │                          # OtherProjects, Contact, Footer
│   └── ui/                    # SectionTitle, Rule, Tag, FadeIn, ExternalLink
└── lib/
    ├── data/                  # Bilingual content datasets
    ├── hooks/                 # useLocale, useTheme, useInView (+ tests)
    └── i18n/                  # Dictionaries + config + dictionary contract test
```

## Design tokens

Defined in `src/app/globals.css` via Tailwind 4 `@theme`:

| Token | Value | Use |
|-------|-------|-----|
| `--color-cream` | `#F5F1E8` | Primary background (light) |
| `--color-cream-deep` | `#EDE6D3` | Section bg variant |
| `--color-forest` | `#1F3A2E` | Primary text + accents |
| `--color-forest-deep` | `#0F1F18` | Background (dark) |
| `--color-amber` | `#C97B3F` | Accent + CTA |
| `--color-mute` | `#6B6B5E` | Secondary text |
| `--color-rule` | `#D9D0BC` | Borders, dividers |
| `--font-display` | Fraunces | Headlines |
| `--font-body` | Inter | Body |
| `--font-mono` | JetBrains Mono | Eyebrows, labels |

Dark mode flips `--color-bg`, `--color-fg`, `--color-rule`, `--color-mute`. Toggle via `<html class="dark">`.

## i18n contract

`src/lib/i18n/__tests__/dictionary.test.js` enforces both locales share the same top-level keys. Adding a key to `id.js` requires adding it to `en.js` (and vice versa) or the test fails.

## Bilingual project copy

Every project field that varies by language uses `{ id: '...', en: '...' }`. Components use `useLocale().locale` to pick the right value.

Always-string fields (e.g. `tech`, `client`, `year`): no language wrapper.

## Cross-machine resume

State persists in `docs/PROGRESS.md` (committed). New session reads PROGRESS to find next pending phase + current commit log.
