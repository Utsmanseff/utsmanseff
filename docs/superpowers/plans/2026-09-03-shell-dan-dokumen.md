# Shell & Document Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the node canvas with two forms over one dataset — an internal-software shell (isometric map + console) at ≥1024px, and an engineering document (year spine + filter sheet) below it — with the reading pages moving onto the dark layer.

**Architecture:** The document is what the server renders, so `/` is complete without JavaScript; the shell mounts over it only when JS is running, the viewport is ≥1024px, and reduced motion is not requested. All geometry, filtering and command parsing live in DOM-free modules under `src/lib/shell/`, unit-tested on their own; the React components hold no math. Reading pages stay server components with a client body, unchanged in structure, repainted onto the dark tokens.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind v4 (`@theme` tokens), `next/font/google`, vitest + happy-dom + @testing-library/react. No 3D library — the map is CSS `transform-style: preserve-3d` on divs.

**Spec:** `docs/superpowers/specs/2026-09-03-shell-dan-dokumen-design.md`
**Copy:** `docs/superpowers/notes/2026-09-03-seluruh-isi-tulisan.md` — every user-visible string, both languages, already approved. Lift strings from there; do not invent new ones.
**Design reference:** `docs/design_handoff_porto_utsman/` (README + prototype).

---

## Conventions used throughout

- Run all tests with `npm test`. A single file: `npx vitest run src/lib/shell/__tests__/filters.test.js`.
- Lint with `npx eslint src --max-warnings=0`. **Not** `npm run lint`.
- Locale-aware text is always `{ id: '…', en: '…' }`, read with `useLocale()`'s `locale`.
- UI strings live in a `const COPY = { … }` object at the top of the component that renders them. That is the existing repo idiom; keep it.
- Project identity is `slug`. `id` inside an object always means the Indonesian string.
- Scene coordinates are the 900×620 authoring box. Screen scale is applied once, by `MapScene`.
- Commit after every task. Conventional Commits, imperative subject ≤50 chars.

## Hard constraints (from the spec, non-negotiable)

- **No counts anywhere on screen.** No "8 systems", no "4 of 8 shown", no per-technology usage numbers. Filter feedback is the word `TERSARING` / `FILTERED`.
- **No `rare` or `baseline` markers.** Stack is a plain list of names.
- **No impact numbers.** No percentages, no user counts.
- **HRIS has no payroll module.** Never add one, not even as sample UI text.
- **Amber is two colours.** `#C97B3F` on dark only; `#9C5A28` on paper only.
- **`.claude/**` is excluded from vitest and eslint.** Do not "fix" that.

---

## File Structure

**Created:**

| File | Responsibility |
|---|---|
| `src/lib/shell/filters.js` | Filter state shape, `isShown`, `toggleFilter`. Pure. |
| `src/lib/shell/commands.js` | `parseCommand(raw)` → intent object. Pure, no state. |
| `src/lib/shell/layout.js` | `platePositions(systems)`, `fitScale(pane)`, `snapRotation(deg)`. Pure. |
| `src/lib/shell/__tests__/filters.test.js` | Unit tests for filters. |
| `src/lib/shell/__tests__/commands.test.js` | Unit tests for the command table. |
| `src/lib/shell/__tests__/layout.test.js` | Unit tests for plate layout and scaling. |
| `src/lib/data/tech.js` | `techNames(projects)` — unique stack names for filter chips. |
| `src/lib/data/__tests__/tech.test.js` | Unit tests for the above. |
| `src/components/document/SystemsDocument.jsx` | Paper document: head, spine, contact block. |
| `src/components/document/YearGroup.jsx` | One year header + its system rows. |
| `src/components/document/FilterSheet.jsx` | Bottom sheet with chip groups. |
| `src/components/document/BottomBar.jsx` | Sticky bar: filter toggle, contact. |
| `src/components/document/__tests__/SystemsDocument.test.jsx` | Document tests. |
| `src/components/document/__tests__/FilterSheet.test.jsx` | Sheet tests. |
| `src/components/shell/Shell.jsx` | Shell frame + all shell state (one reducer). |
| `src/components/shell/TopBar.jsx` | Identity, skip-map chip, view switch, language. |
| `src/components/shell/LogRail.jsx` | Log lines, filter chips, systems-in-view list. |
| `src/components/shell/MapScene.jsx` | Pane measurement, scale-to-fit, orbit. |
| `src/components/shell/Plate.jsx` | One system as a stack of layers. |
| `src/components/shell/AxisLegend.jsx` | Axis meanings, outside the plate field. |
| `src/components/shell/SelectedPanel.jsx` | Record block, then selected system detail. |
| `src/components/shell/Console.jsx` | Command input + hint. |
| `src/components/shell/FlatTable.jsx` | Table view; also the reduced-motion target. |
| `src/components/shell/StatusBar.jsx` | Identity and contact strip. |
| `src/components/shell/__tests__/Shell.test.jsx` | Shell behaviour tests. |
| `src/components/shell/__tests__/Plate.test.jsx` | Plate rendering tests. |
| `src/lib/hooks/useShellEligible.js` | `true` when JS + ≥1024px + no reduced-motion. |

**Modified:**

| File | Change |
|---|---|
| `src/app/globals.css` | Token set replaced with the handoff palette; pixel token removed. |
| `src/app/layout.js` | Fonts swapped to Bricolage Grotesque + Inter + JetBrains Mono. |
| `src/app/page.js` | Renders the document; mounts the shell when eligible. |
| `src/app/kerja/[slug]/page.js` | Unchanged logic; verify five slugs generate. |
| `src/app/opengraph-image.jsx` | Type stack updated to the new display face. |
| `src/components/work/*.jsx` | Repainted onto dark tokens; section numbering 01–03. |
| `src/components/contact/ContactView.jsx` | Repainted onto dark tokens. |
| `src/components/ui/Tag.jsx` | Dark tokens, radius 0. |
| `src/components/nav/LangSwitcher.jsx` | Dark tokens only (the paper tone is gone). |
| `src/lib/data/projects.js` | `position`, `cluster`, `related` fields removed. |

**Deleted:**

`src/components/canvas/` (Canvas, Node, GroupNode, Edges, PreviewPanel, CanvasChrome, TechLegend, MobileList) and its `__tests__`; `src/lib/canvas/viewport.js`, `src/lib/canvas/tech.js` and their `__tests__`; `src/lib/data/canvas.js`; `src/lib/data/__tests__/layout.test.js`.

---

## Task 1: Tokens and fonts

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.js`

- [ ] **Step 1: Replace the `@theme` block in `src/app/globals.css`**

Keep everything below the block (skip link, focus ring, reduced motion) as it is.

```css
@theme {
  /* Dark layer — shell, reading pages, contact */
  --color-ground: #161A1D;
  --color-ground-deep: #0E1113;
  --color-surface: #1B2124;
  --color-surface-raised: #1F2529;
  --color-surface-plate: #252E33;
  --color-rule: #2E3539;
  --color-rule-soft: #1F262A;
  --color-ink: #E8E0D0;
  --color-ink-bright: #F2EDE3;
  --color-muted: #7A8580;
  --color-muted-deep: #4C555A;
  --color-body-soft: #B9B2A2;

  /* Plate stack, bottom to top */
  --color-plate-1: #1B2124;
  --color-plate-2: #1D2428;
  --color-plate-3: #20272B;
  --color-plate-4: #252E33;
  --color-plate-5: #2C3439;
  --color-plate-edge-1: #333C41;
  --color-plate-edge-2: #3A4348;
  --color-plate-edge-3: #3F484D;
  --color-plate-edge-4: #4A545A;

  /* Paper layer — the phone document only */
  --color-paper: #F2EDE3;
  --color-paper-deep: #EDE7DA;
  --color-paper-deeper: #E7E0D0;
  --color-paper-plate: #E2DBC9;
  --color-paper-rule: #D9D0BC;
  --color-paper-rule-soft: #E2DBC9;
  --color-paper-rule-edge: #C7BEA8;
  --color-paper-ink: #1A1A1A;
  --color-paper-ink-soft: #3A3A34;
  --color-paper-muted: #6B6B5E;

  /* Amber is two colours and always has been. #C97B3F is 2.82:1 on paper. */
  --color-amber: #C97B3F;
  --color-amber-ink: #9C5A28;

  --font-display: var(--font-display), system-ui, sans-serif;
  --font-body: var(--font-body), system-ui, sans-serif;
  --font-mono: var(--font-mono), ui-monospace, monospace;
}
```

- [ ] **Step 2: Repoint `html, body` in the same file**

```css
html, body {
  background: var(--color-ground);
  color: var(--color-ink);
  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* The phone document is the one paper surface left. */
body:has(.paper-doc) {
  background: var(--color-paper);
  color: var(--color-paper-ink);
}
```

Delete the old `body:has(.canvas-root)` rule and the `--font-pixel` token. Change `::selection` and `.skip-link` to use `--color-amber` and `--color-ground`.

- [ ] **Step 3: Swap the fonts in `src/app/layout.js`**

```js
import { Bricolage_Grotesque, Inter, JetBrains_Mono } from "next/font/google";

const bricolage = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});
```

Update the `<body className>` to `${bricolage.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased font-body`. Remove the `Fraunces` and `Jersey_15` imports and their consts.

- [ ] **Step 4: Verify the build compiles and nothing references the dead tokens**

Run: `npx eslint src --max-warnings=0 && npm run build`
Expected: build succeeds. Then run `grep -rn "font-pixel\|Fraunces\|Jersey" src/` — expected: no matches outside deleted canvas files (those are removed in Task 14; leaving them broken until then is acceptable **only** if `npm run build` still passes; if it does not, do Task 14 first).

- [ ] **Step 5: Commit**

```bash
git add src/app/globals.css src/app/layout.js
git commit -m "feat(tokens): adopt the handoff palette and type stack"
```

---

## Task 2: Unique technology names for filter chips

**Files:**
- Create: `src/lib/data/tech.js`
- Create: `src/lib/data/__tests__/tech.test.js`

- [ ] **Step 1: Write the failing test**

```js
import { describe, it, expect } from 'vitest';
import { techNames } from '@/lib/data/tech';
import { projects } from '@/lib/data/projects';

describe('techNames', () => {
  it('lists each technology once, alphabetically', () => {
    const names = techNames([
      { tech: ['Laravel', 'MySQL'] },
      { tech: ['MySQL', 'Alpine.js'] },
    ]);
    expect(names).toEqual(['Alpine.js', 'Laravel', 'MySQL']);
  });

  it('survives a project with no tech listed', () => {
    expect(techNames([{ slug: 'x' }])).toEqual([]);
  });

  it('never invents a name the real data does not carry', () => {
    const declared = new Set(projects.flatMap((p) => p.tech));
    for (const name of techNames(projects)) expect(declared.has(name)).toBe(true);
  });

  it('carries no counts — counting is what the design removed', () => {
    for (const name of techNames(projects)) expect(typeof name).toBe('string');
  });
});
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npx vitest run src/lib/data/__tests__/tech.test.js`
Expected: FAIL — cannot resolve `@/lib/data/tech`.

- [ ] **Step 3: Write the implementation**

```js
// The stack as a filter vocabulary, nothing more. An earlier version counted
// uses and marked the once-used ones "rare"; that was praising the work with
// its own data, and it is gone. Names only.
export function techNames(projects) {
  const seen = new Set();
  for (const p of projects) {
    for (const name of p.tech ?? []) seen.add(name);
  }
  return [...seen].sort((a, b) => a.localeCompare(b));
}

// Filter values travel through the console as lowercase, punctuation-free
// tokens: "stack:tensorflowjs" matches "TensorFlow.js".
export function techSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}
```

- [ ] **Step 4: Add the `techSlug` test to the same file, then run both**

```js
import { techNames, techSlug } from '@/lib/data/tech';

describe('techSlug', () => {
  it('flattens a name into a console-safe token', () => {
    expect(techSlug('TensorFlow.js')).toBe('tensorflowjs');
    expect(techSlug('REST API')).toBe('restapi');
    expect(techSlug('SOAP')).toBe('soap');
  });
});
```

Run: `npx vitest run src/lib/data/__tests__/tech.test.js`
Expected: PASS, 5 tests.

- [ ] **Step 5: Commit**

```bash
git add src/lib/data/tech.js src/lib/data/__tests__/tech.test.js
git commit -m "feat(data): derive the stack vocabulary from the projects"
```

---

## Task 3: Filter state

**Files:**
- Create: `src/lib/shell/filters.js`
- Create: `src/lib/shell/__tests__/filters.test.js`

- [ ] **Step 1: Write the failing test**

```js
import { describe, it, expect } from 'vitest';
import { EMPTY_FILTERS, isShown, toggleFilter, isFiltering } from '@/lib/shell/filters';

const hris = {
  slug: 'hris-nirwana', clientKey: 'rsu-nirwana', year: '2026',
  access: 'internal', tech: ['Laravel', 'TensorFlow.js'],
};
const sigap = {
  slug: 'sigap-bpn', clientKey: 'bpn', year: '2024',
  access: 'none', tech: ['Laravel', 'Livewire'],
};

describe('isShown', () => {
  it('shows everything when no filter is set', () => {
    expect(isShown(hris, EMPTY_FILTERS)).toBe(true);
    expect(isShown(sigap, EMPTY_FILTERS)).toBe(true);
  });

  it('filters by client, year and access', () => {
    expect(isShown(hris, { ...EMPTY_FILTERS, client: 'bpn' })).toBe(false);
    expect(isShown(sigap, { ...EMPTY_FILTERS, year: '2024' })).toBe(true);
    expect(isShown(sigap, { ...EMPTY_FILTERS, access: 'internal' })).toBe(false);
  });

  it('matches a stack value through its console token', () => {
    expect(isShown(hris, { ...EMPTY_FILTERS, stack: 'tensorflowjs' })).toBe(true);
    expect(isShown(sigap, { ...EMPTY_FILTERS, stack: 'tensorflowjs' })).toBe(false);
  });
});

describe('toggleFilter', () => {
  it('sets a value, and clears it when the same value is applied twice', () => {
    const once = toggleFilter(EMPTY_FILTERS, 'client', 'bpn');
    expect(once.client).toBe('bpn');
    expect(toggleFilter(once, 'client', 'bpn').client).toBe(null);
  });

  it('replaces a value of the same key rather than stacking it', () => {
    const a = toggleFilter(EMPTY_FILTERS, 'year', '2024');
    expect(toggleFilter(a, 'year', '2026').year).toBe('2026');
  });

  it('never mutates the filters it was given', () => {
    const before = { ...EMPTY_FILTERS };
    toggleFilter(before, 'client', 'bpn');
    expect(before.client).toBe(null);
  });
});

describe('isFiltering', () => {
  it('is false only when nothing is set', () => {
    expect(isFiltering(EMPTY_FILTERS)).toBe(false);
    expect(isFiltering({ ...EMPTY_FILTERS, access: 'public' })).toBe(true);
  });
});
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npx vitest run src/lib/shell/__tests__/filters.test.js`
Expected: FAIL — cannot resolve `@/lib/shell/filters`.

- [ ] **Step 3: Write the implementation**

```js
import { techSlug } from '@/lib/data/tech';

export const FILTER_KEYS = ['client', 'year', 'access', 'stack'];

export const EMPTY_FILTERS = { client: null, year: null, access: null, stack: null };

export function isShown(system, filters) {
  if (filters.client && system.clientKey !== filters.client) return false;
  if (filters.year && String(system.year) !== String(filters.year)) return false;
  if (filters.access && system.access !== filters.access) return false;
  if (filters.stack && !(system.tech ?? []).some((t) => techSlug(t) === filters.stack)) {
    return false;
  }
  return true;
}

// Applying the active value again clears it. Chips and typed commands share
// this, so a chip is a toggle for the same reason a repeated command is.
export function toggleFilter(filters, key, value) {
  const next = { ...filters };
  next[key] = filters[key] === value ? null : value;
  return next;
}

export function isFiltering(filters) {
  return FILTER_KEYS.some((k) => filters[k] !== null);
}
```

- [ ] **Step 4: Run the tests**

Run: `npx vitest run src/lib/shell/__tests__/filters.test.js`
Expected: PASS, 7 tests.

- [ ] **Step 5: Commit**

```bash
git add src/lib/shell/filters.js src/lib/shell/__tests__/filters.test.js
git commit -m "feat(shell): filter predicates that dim rather than remove"
```

---

## Task 4: `clientKey` on every project

`isShown` filters on `clientKey`, which the data does not carry yet.

**Files:**
- Modify: `src/lib/data/projects.js`
- Modify: `src/lib/data/__tests__/projects.test.js`

- [ ] **Step 1: Write the failing test**

Add to `src/lib/data/__tests__/projects.test.js`:

```js
  it('gives every project a filter-safe client key', () => {
    for (const p of projects) {
      expect(p.clientKey, p.slug).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it('uses one key per client, not one per project', () => {
    const nirwana = projects.filter((p) => p.client === 'RSU Nirwana');
    expect(new Set(nirwana.map((p) => p.clientKey)).size).toBe(1);
  });
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npx vitest run src/lib/data/__tests__/projects.test.js`
Expected: FAIL — `expected undefined to match /^[a-z0-9-]+$/`.

- [ ] **Step 3: Add the field to all eight projects**

Insert `clientKey` immediately after each `client` line:

| slug | clientKey |
|---|---|
| `rsu-nirwana-web` | `rsu-nirwana` |
| `idrg-bridging` | `rsu-nirwana` |
| `hris-nirwana` | `rsu-nirwana` |
| `rme` | `rsu-nirwana` |
| `sigap-bpn` | `bpn` |
| `aset-kphl` | `kphl` |
| `sertifikasi-benih` | `dinas-pertanian` |
| `psb-walisongo` | `mts-walisongo` |

- [ ] **Step 4: Run the tests**

Run: `npx vitest run src/lib/data/__tests__/projects.test.js`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/data/projects.js src/lib/data/__tests__/projects.test.js
git commit -m "feat(data): add a stable client key for filtering"
```

---

## Task 5: The command table

**Files:**
- Create: `src/lib/shell/commands.js`
- Create: `src/lib/shell/__tests__/commands.test.js`

- [ ] **Step 1: Write the failing test**

```js
import { describe, it, expect } from 'vitest';
import { parseCommand } from '@/lib/shell/commands';

describe('parseCommand', () => {
  it('ignores blank input', () => {
    expect(parseCommand('   ')).toEqual({ action: 'none' });
  });

  it('reads the listing commands', () => {
    expect(parseCommand('ls')).toEqual({ action: 'list' });
    expect(parseCommand('ls systems')).toEqual({ action: 'list' });
  });

  it('reads open with a name fragment', () => {
    expect(parseCommand('open hris')).toEqual({ action: 'open', query: 'hris' });
    expect(parseCommand('OPEN  RME ')).toEqual({ action: 'open', query: 'rme' });
  });

  it('reads a filter with or without the word filter', () => {
    expect(parseCommand('filter client:bpn')).toEqual({
      action: 'filter', key: 'client', value: 'bpn',
    });
    expect(parseCommand('client:bpn')).toEqual({
      action: 'filter', key: 'client', value: 'bpn',
    });
  });

  it('refuses a filter key it does not know', () => {
    expect(parseCommand('colour:amber')).toEqual({ action: 'unknown', input: 'colour:amber' });
  });

  it('reads reset, view, lang, contact and help', () => {
    expect(parseCommand('reset')).toEqual({ action: 'reset' });
    expect(parseCommand('view flat')).toEqual({ action: 'view', view: 'list' });
    expect(parseCommand('flat')).toEqual({ action: 'view', view: 'list' });
    expect(parseCommand('view iso')).toEqual({ action: 'view', view: 'map' });
    expect(parseCommand('map')).toEqual({ action: 'view', view: 'map' });
    expect(parseCommand('lang en')).toEqual({ action: 'lang', lang: 'en' });
    expect(parseCommand('lang id')).toEqual({ action: 'lang', lang: 'id' });
    expect(parseCommand('contact')).toEqual({ action: 'contact' });
    expect(parseCommand('cv')).toEqual({ action: 'contact' });
    expect(parseCommand('help')).toEqual({ action: 'help' });
  });

  it('reports anything else as unknown, keeping what was typed', () => {
    expect(parseCommand('sudo rm -rf')).toEqual({ action: 'unknown', input: 'sudo rm -rf' });
  });

  it('has no rare command — that marker was removed from the design', () => {
    expect(parseCommand('--rare').action).toBe('unknown');
  });
});
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npx vitest run src/lib/shell/__tests__/commands.test.js`
Expected: FAIL — cannot resolve `@/lib/shell/commands`.

- [ ] **Step 3: Write the implementation**

```js
import { FILTER_KEYS } from './filters';

// Parsing returns an intent and touches nothing. The shell decides what an
// intent does; that split is what lets the whole command table be tested
// without rendering anything.
export function parseCommand(raw) {
  const s = String(raw ?? '').trim().toLowerCase().replace(/\s+/g, ' ');
  if (!s) return { action: 'none' };

  if (s === 'help') return { action: 'help' };
  if (s === 'ls' || s === 'ls systems' || s === 'ls modules') return { action: 'list' };
  if (s === 'reset') return { action: 'reset' };
  if (s === 'contact' || s === 'cv') return { action: 'contact' };
  if (s === 'view flat' || s === 'flat' || s === 'list') return { action: 'view', view: 'list' };
  if (s === 'view iso' || s === 'iso' || s === 'map') return { action: 'view', view: 'map' };
  if (s === 'lang id') return { action: 'lang', lang: 'id' };
  if (s === 'lang en') return { action: 'lang', lang: 'en' };

  if (s.startsWith('open')) {
    const query = s.slice(4).trim();
    return query ? { action: 'open', query } : { action: 'unknown', input: s };
  }

  const body = s.startsWith('filter ') ? s.slice(7).trim() : s;
  const colon = body.indexOf(':');
  if (colon > 0) {
    const key = body.slice(0, colon).trim();
    const value = body.slice(colon + 1).trim();
    if (FILTER_KEYS.includes(key) && value) return { action: 'filter', key, value };
  }

  return { action: 'unknown', input: s };
}

// Matching is deliberately loose: a visitor types what they can see on a plate,
// not a slug.
export function findSystem(systems, query) {
  const q = query.toLowerCase();
  return systems.find((s) => (
    s.slug.startsWith(q)
    || s.slug.replace(/-/g, '').startsWith(q.replace(/-/g, ''))
    || s.shortName.id.toLowerCase().includes(q)
    || s.shortName.en.toLowerCase().includes(q)
    || s.title.id.toLowerCase().includes(q)
    || s.title.en.toLowerCase().includes(q)
  )) ?? null;
}
```

- [ ] **Step 4: Add the `findSystem` test, then run the file**

```js
import { parseCommand, findSystem } from '@/lib/shell/commands';
import { projects } from '@/lib/data/projects';

describe('findSystem', () => {
  it('finds a system by slug prefix, short name or title', () => {
    expect(findSystem(projects, 'hris').slug).toBe('hris-nirwana');
    expect(findSystem(projects, 'rme').slug).toBe('rme');
    expect(findSystem(projects, 'ocr').slug).toBe('rsu-nirwana-web');
  });

  it('returns null when nothing matches', () => {
    expect(findSystem(projects, 'kubernetes')).toBe(null);
  });
});
```

Run: `npx vitest run src/lib/shell/__tests__/commands.test.js`
Expected: PASS, 10 tests.

- [ ] **Step 5: Commit**

```bash
git add src/lib/shell/commands.js src/lib/shell/__tests__/commands.test.js
git commit -m "feat(shell): parse console commands into intents"
```

---

## Task 6: Plate layout and scale-to-fit

**Files:**
- Create: `src/lib/shell/layout.js`
- Create: `src/lib/shell/__tests__/layout.test.js`

- [ ] **Step 1: Write the failing test**

```js
import { describe, it, expect } from 'vitest';
import { SCENE, platePositions, fitScale, snapRotation } from '@/lib/shell/layout';

const systems = [
  { slug: 'a', year: '2025', tier: 'full', tech: ['x', 'y', 'z'] },
  { slug: 'b', year: '2025', tier: 'brief', tech: ['x', 'y', 'z'] },
  { slug: 'c', year: '2024', tier: 'brief', tech: ['x', 'y', 'z', 'w'] },
];

describe('platePositions', () => {
  it('puts later years nearer the front', () => {
    const by = Object.fromEntries(platePositions(systems).map((p) => [p.slug, p]));
    expect(by.c.y).toBeLessThan(by.a.y);
  });

  it('sizes a plate by whether it has a reading page', () => {
    const [a, b] = platePositions(systems);
    expect([a.width, a.height]).toEqual([165, 115]);
    expect([b.width, b.height]).toEqual([100, 74]);
  });

  it('advances x by the previous plate width, never by a fixed stride', () => {
    // A fixed stride landed a small plate inside the big one before it.
    const [a, b] = platePositions(systems);
    expect(b.x).toBe(a.x + a.width + 80);
  });

  it('never overlaps two plates in the same row', () => {
    const row = platePositions(systems).filter((p) => p.year === '2025');
    for (let i = 1; i < row.length; i += 1) {
      expect(row[i].x).toBeGreaterThanOrEqual(row[i - 1].x + row[i - 1].width);
    }
  });

  it('raises a plate one layer per technology', () => {
    const [a, , c] = platePositions(systems);
    expect(a.layers).toBe(3);
    expect(c.layers).toBe(4);
    expect(c.topZ).toBe(3 * 7);
  });
});

describe('fitScale', () => {
  it('fits the scene inside the pane, reserving room for labels', () => {
    expect(fitScale({ width: 1070, height: 650 })).toBeCloseTo(1, 5);
    expect(fitScale({ width: 800, height: 650 })).toBeCloseTo((800 - 170) / SCENE.width, 5);
  });

  it('never scales up past 1, and never below 0.4', () => {
    expect(fitScale({ width: 4000, height: 4000 })).toBe(1);
    expect(fitScale({ width: 200, height: 200 })).toBe(0.4);
  });

  it('survives a pane that has not been measured yet', () => {
    expect(fitScale({ width: 0, height: 0 })).toBe(0.4);
  });
});

describe('snapRotation', () => {
  it('snaps to the nearest camera angle on release', () => {
    expect(snapRotation(-38)).toBe(-40);
    expect(snapRotation(-52)).toBe(-55);
    expect(snapRotation(-10)).toBe(-25);
  });
});
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npx vitest run src/lib/shell/__tests__/layout.test.js`
Expected: FAIL — cannot resolve `@/lib/shell/layout`.

- [ ] **Step 3: Write the implementation**

```js
// The authoring box. Everything below is expressed inside it; the single
// scale factor from fitScale() is applied once, by MapScene.
export const SCENE = { width: 900, height: 620 };

export const ROW_Y = { 2024: 10, 2025: 225, 2026: 440 };
export const PLATE = {
  full: { width: 165, height: 115 },
  brief: { width: 100, height: 74 },
};
const GAP = 80;
const LAYER_STEP = 7;
export const CAMERA_ANGLES = [-55, -40, -25];

// Rows are laid out left to right, each plate advancing the cursor by its own
// width. Multiplying an index by a fixed stride put a small plate inside the
// big one before it.
export function platePositions(systems) {
  const cursor = { 2024: 40, 2025: 40, 2026: 40 };
  return systems.map((s) => {
    const size = s.tier === 'full' ? PLATE.full : PLATE.brief;
    const x = cursor[s.year];
    cursor[s.year] = x + size.width + GAP;
    const layers = Math.max(1, (s.tech ?? []).length);
    return {
      slug: s.slug,
      year: s.year,
      x,
      // Small plates sit down the row a little so their labels clear the rule.
      y: ROW_Y[s.year] + (s.tier === 'full' ? 0 : 20),
      width: size.width,
      height: size.height,
      layers,
      topZ: (layers - 1) * LAYER_STEP,
      layerStep: LAYER_STEP,
    };
  });
}

// The 170px horizontal reserve is for labels that project outside the plate
// field. A fixed offset instead of a measurement breaks at 1440x800.
export function fitScale(pane) {
  const k = Math.min(
    (pane.width - 170) / SCENE.width,
    (pane.height - 30) / SCENE.height,
    1,
  );
  return Number.isFinite(k) ? Math.max(0.4, k) : 0.4;
}

export function snapRotation(deg) {
  return CAMERA_ANGLES.reduce(
    (best, a) => (Math.abs(a - deg) < Math.abs(best - deg) ? a : best),
    CAMERA_ANGLES[0],
  );
}
```

- [ ] **Step 4: Run the tests**

Run: `npx vitest run src/lib/shell/__tests__/layout.test.js`
Expected: PASS, 9 tests.

- [ ] **Step 5: Commit**

```bash
git add src/lib/shell/layout.js src/lib/shell/__tests__/layout.test.js
git commit -m "feat(shell): plate layout, fit scaling and camera snapping"
```

---

## Task 7: Reading pages onto the dark layer

**Files:**
- Modify: `src/components/work/ProjectView.jsx`
- Modify: `src/components/work/PaperHeader.jsx`
- Modify: `src/components/work/AccessBadge.jsx`
- Modify: `src/components/work/ScreenshotBlock.jsx`
- Modify: `src/components/work/WorkFooterNav.jsx`
- Modify: `src/components/ui/Tag.jsx`
- Modify: `src/components/work/__tests__/ProjectView.test.jsx`

- [ ] **Step 1: Write the failing test**

Add to `src/components/work/__tests__/ProjectView.test.jsx`:

```js
  it('numbers its three sections and links back to all systems', () => {
    render(<ProjectView project={project} prev={null} next={null} />);
    expect(screen.getByText('01 KONTEKS')).toBeInTheDocument();
    expect(screen.getByText('02 YANG DIBANGUN')).toBeInTheDocument();
    expect(screen.getByText('03 STACK')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /SEMUA SISTEM/ })).toBeInTheDocument();
  });

  it('paints on the dark layer, not on paper', () => {
    const { container } = render(<ProjectView project={project} prev={null} next={null} />);
    expect(container.querySelector('.paper-doc')).toBeNull();
    expect(container.innerHTML).not.toMatch(/text-amber-ink|bg-paper/);
  });
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npx vitest run src/components/work/__tests__/ProjectView.test.jsx`
Expected: FAIL — `01 KONTEKS` not found.

- [ ] **Step 3: Rewrite the section labels and colours in `ProjectView.jsx`**

```js
const COPY = {
  context: { id: '01 KONTEKS', en: '01 CONTEXT' },
  built: { id: '02 YANG DIBANGUN', en: '02 BUILT' },
  stack: { id: '03 STACK', en: '03 STACK' },
  visit: { id: 'Coba langsung ↗', en: 'Try it live ↗' },
  back: { id: '← SEMUA SISTEM', en: '← ALL SYSTEMS' },
};
```

Colour swaps across the whole file, mechanical: `text-ink` → `text-ink` (token now dark-layer ink, no change needed), `text-mute` → `text-muted`, `border-rule` stays (token repointed), `text-amber-ink` → `text-amber`, `hover:text-amber-ink` → `hover:text-amber`, `hover:bg-amber-ink hover:text-paper` → `hover:bg-amber hover:text-ground`, `text-ink/85` → `text-body-soft`. Section headings use `font-mono text-[10px] uppercase tracking-[.12em] text-muted`. The title uses `font-display text-[44px] leading-[1.15] font-extrabold tracking-[-.035em]`, dropping to `text-[28px]` under `sm:`. Radius: delete every `rounded`, `rounded-sm` and `rounded-lg` in these files — the design has none.

Apply the same swaps in `PaperHeader.jsx` (rename the `BACK` copy to `← SEMUA SISTEM` / `← ALL SYSTEMS`), `AccessBadge.jsx` (drop the `tone` prop entirely; there is one layer now — public gets `border-amber text-amber`, internal `border-rule text-muted`, none `border-dashed border-rule text-muted`), `ScreenshotBlock.jsx` (dashed `border-plate-edge-2`, text `text-muted`), `WorkFooterNav.jsx`, and `ui/Tag.jsx`.

- [ ] **Step 4: Run the whole suite**

Run: `npm test`
Expected: PASS. Any test asserting `tone="ground"` on `AccessBadge` must be updated in this step — the prop is gone.

- [ ] **Step 5: Verify in a real browser**

Run the preview (`preview_start` with the `portfolio` config), open `/kerja/rme`, and confirm: dark ground, amber links, the screenshot still legible, and no stray cream panel. Take a screenshot for the record.

- [ ] **Step 6: Commit**

```bash
git add src/components/work src/components/ui/Tag.jsx
git commit -m "feat(work): move the reading pages onto the dark layer"
```

---

## Task 8: The phone document

**Files:**
- Create: `src/components/document/SystemsDocument.jsx`
- Create: `src/components/document/YearGroup.jsx`
- Create: `src/components/document/__tests__/SystemsDocument.test.jsx`

- [ ] **Step 1: Write the failing test**

```jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LocaleProvider } from '@/lib/hooks/useLocale';
import SystemsDocument from '@/components/document/SystemsDocument';
import { projects } from '@/lib/data/projects';

const renderDoc = (props = {}) =>
  render(
    <SystemsDocument systems={projects} locale="id" filters={null} {...props} />,
    { wrapper: LocaleProvider },
  );

describe('SystemsDocument', () => {
  it('opens with identity and no headline sentence', () => {
    renderDoc();
    expect(screen.getByText(/UTSMAN/)).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 1, name: /tahun|systems/i })).toBeNull();
  });

  it('descends by year, newest first', () => {
    const { container } = renderDoc();
    const years = [...container.querySelectorAll('[data-year]')].map((n) => n.dataset.year);
    expect(years).toEqual(['2026', '2025', '2024']);
  });

  it('links only the systems that have a reading page', () => {
    renderDoc();
    expect(screen.getByRole('link', { name: /HRIS/ })).toHaveAttribute('href', '/kerja/hris-nirwana');
    expect(screen.queryByRole('link', { name: /SIGAP/ })).toBeNull();
    expect(screen.getByText('SIGAP')).toBeInTheDocument();
  });

  it('states no counts anywhere', () => {
    const { container } = renderDoc();
    expect(container.textContent).not.toMatch(/\b8 (sistem|systems)\b/i);
  });
});
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npx vitest run src/components/document/__tests__/SystemsDocument.test.jsx`
Expected: FAIL — cannot resolve the component.

- [ ] **Step 3: Write `YearGroup.jsx`**

```jsx
"use client";

import Link from 'next/link';
import AccessBadge from '@/components/work/AccessBadge';

// One year and the systems that shipped in it. The left cell is empty on
// purpose: it is the spine, and the rule down its right edge is the axis.
export default function YearGroup({ year, systems, locale, dimmed }) {
  return (
    <section data-year={year} className="grid grid-cols-[52px_1fr]">
      <h2 className="col-span-2 font-mono text-xs font-bold text-paper-rule-edge border-t border-paper-ink pt-3 pb-1.5">
        {year}
      </h2>

      {systems.map((s) => {
        const dim = dimmed?.has(s.slug);
        const body = (
          <span className="grid grid-cols-[1fr_auto] items-center gap-3 w-full">
            <span>
              <span className="block text-[14.5px] font-semibold text-paper-ink">
                {s.shortName[locale]}
              </span>
              <span className="block font-mono text-[10px] text-paper-muted mt-0.5">
                {s.client} · {s.year}
              </span>
            </span>
            <AccessBadge access={s.access} locale={locale} />
          </span>
        );

        return (
          <div key={s.slug} className="contents">
            <div className="border-r border-paper-rule" />
            <div
              className="border-b border-paper-rule-soft py-[11px] pl-3.5 min-h-11 transition-opacity duration-700"
              style={{ opacity: dim ? 0.4 : 1 }}
            >
              {s.tier === 'full' ? (
                <Link href={`/kerja/${s.slug}`} className="block" aria-label={s.shortName[locale]}>
                  {body}
                </Link>
              ) : body}
            </div>
          </div>
        );
      })}
    </section>
  );
}
```

- [ ] **Step 4: Write `SystemsDocument.jsx`**

```jsx
"use client";

import { meta } from '@/lib/data/meta';
import LangSwitcher from '@/components/nav/LangSwitcher';
import YearGroup from './YearGroup';

const COPY = {
  head: { id: 'UTSMAN · FULLSTACK', en: 'UTSMAN · FULLSTACK' },
  note: {
    id: 'Buka di desktop untuk peta isometrik dan konsolnya. Semuanya juga bisa dibaca di sini.',
    en: 'Open on desktop for the isometric map and console. Everything is readable here too.',
  },
  cv: { id: 'CV', en: 'CV' },
};

// Deliberately no headline and no reading hint: identity, then the work.
export default function SystemsDocument({ systems, locale, dimmed }) {
  const years = [...new Set(systems.map((s) => s.year))].sort().reverse();

  return (
    <main className="paper-doc min-h-screen flex flex-col px-5 pt-6 pb-24">
      <div className="flex items-center justify-between font-mono text-[10.5px] text-paper-muted">
        <span>{COPY.head[locale]}</span>
        <LangSwitcher />
      </div>
      <div className="border-t border-paper-ink mt-3" />

      <p className="font-mono text-[11px] text-paper-muted mt-4 mb-6">
        {meta.location[locale]}
      </p>

      {years.map((year) => (
        <YearGroup
          key={year}
          year={year}
          systems={systems.filter((s) => s.year === year)}
          locale={locale}
          dimmed={dimmed}
        />
      ))}

      <dl className="grid grid-cols-[64px_1fr] mt-10 font-mono text-[11px]">
        {[
          ['EMAIL', meta.email, `mailto:${meta.email}`],
          ['WA', meta.whatsapp, meta.whatsappLink],
          ['GITHUB', meta.githubHandle, meta.github],
          [COPY.cv[locale], 'PDF', meta.cvFile],
        ].map(([label, value, href]) => (
          <div key={label} className="contents">
            <dt className="border-t border-paper-rule-soft py-3 text-paper-muted">{label}</dt>
            <dd className="border-t border-paper-rule-soft py-3 m-0">
              <a href={href} className="text-amber-ink">{value}</a>
            </dd>
          </div>
        ))}
      </dl>
    </main>
  );
}
```

- [ ] **Step 5: Run the tests**

Run: `npx vitest run src/components/document/__tests__/SystemsDocument.test.jsx`
Expected: PASS, 4 tests.

- [ ] **Step 6: Commit**

```bash
git add src/components/document
git commit -m "feat(document): the phone form, a spine of years"
```

---

## Task 9: Filter sheet and bottom bar

**Files:**
- Create: `src/components/document/FilterSheet.jsx`
- Create: `src/components/document/BottomBar.jsx`
- Create: `src/components/document/__tests__/FilterSheet.test.jsx`

- [ ] **Step 1: Write the failing test**

```jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FilterSheet from '@/components/document/FilterSheet';
import { EMPTY_FILTERS } from '@/lib/shell/filters';
import { projects } from '@/lib/data/projects';

const setup = (filters = EMPTY_FILTERS) => {
  const onToggle = vi.fn();
  const onReset = vi.fn();
  render(
    <FilterSheet
      systems={projects}
      filters={filters}
      locale="id"
      onToggle={onToggle}
      onReset={onReset}
      onClose={() => {}}
    />,
  );
  return { onToggle, onReset };
};

describe('FilterSheet', () => {
  it('offers a chip per client, access state and technology', () => {
    setup();
    expect(screen.getByRole('button', { name: 'RSU Nirwana' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'internal' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'TensorFlow.js' })).toBeInTheDocument();
  });

  it('reports the key and value of the chip that was pressed', () => {
    const { onToggle } = setup();
    fireEvent.click(screen.getByRole('button', { name: 'BPN' }));
    expect(onToggle).toHaveBeenCalledWith('client', 'bpn');
  });

  it('marks the active chip as pressed', () => {
    setup({ ...EMPTY_FILTERS, access: 'public' });
    expect(screen.getByRole('button', { name: 'public' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'internal' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('shows no count of what is filtered', () => {
    const { container } = setup({ ...EMPTY_FILTERS, access: 'public' });
    expect(container.textContent).not.toMatch(/\d+\s*(dari|of)\s*\d+/i);
  });
});
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npx vitest run src/components/document/__tests__/FilterSheet.test.jsx`
Expected: FAIL — cannot resolve the component.

- [ ] **Step 3: Write `FilterSheet.jsx`**

```jsx
"use client";

import { techNames, techSlug } from '@/lib/data/tech';

const COPY = {
  title: { id: 'FILTER', en: 'FILTER' },
  reset: { id: 'ATUR ULANG', en: 'RESET' },
  client: { id: 'KLIEN', en: 'CLIENT' },
  access: { id: 'AKSES', en: 'ACCESS' },
  stack: { id: 'STACK', en: 'STACK' },
  close: { id: 'KETUK UNTUK MENUTUP', en: 'TAP TO CLOSE' },
  apply: { id: 'TERAPKAN', en: 'APPLY' },
};

const ACCESS = ['public', 'internal', 'none'];

function Chip({ label, active, onClick }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`font-mono text-[11px] px-3.5 py-2.5 border transition-colors duration-200 ${
        active ? 'border-amber text-amber' : 'border-rule text-muted'
      }`}
    >
      {label}
    </button>
  );
}

// The sheet is the phone's console: same filter vocabulary, thumb-sized.
export default function FilterSheet({ systems, filters, locale, onToggle, onReset, onClose }) {
  const clients = [...new Map(systems.map((s) => [s.clientKey, s.client])).entries()];

  return (
    <div className="sticky bottom-0 bg-ground text-ink px-[18px] pt-3.5 pb-[18px] flex flex-col gap-3">
      <div className="w-10 h-[3px] bg-plate-edge-2 mx-auto" />

      <div className="flex items-center justify-between font-mono text-[11px] text-muted">
        <span>{COPY.title[locale]}</span>
        <button type="button" onClick={onReset} className="text-amber">
          {COPY.reset[locale]}
        </button>
      </div>

      {[
        [COPY.client[locale], clients.map(([key, label]) => ({ key: 'client', value: key, label }))],
        [COPY.access[locale], ACCESS.map((a) => ({ key: 'access', value: a, label: a }))],
        [COPY.stack[locale], techNames(systems).map((t) => ({ key: 'stack', value: techSlug(t), label: t }))],
      ].map(([groupLabel, chips]) => (
        <div key={groupLabel}>
          <div className="font-mono text-[10px] tracking-[.12em] text-muted mb-2">{groupLabel}</div>
          <div className="flex flex-wrap gap-2">
            {chips.map((c) => (
              <Chip
                key={`${c.key}:${c.value}`}
                label={c.label}
                active={filters[c.key] === c.value}
                onClick={() => onToggle(c.key, c.value)}
              />
            ))}
          </div>
        </div>
      ))}

      <div className="flex items-center justify-between font-mono text-[11px] text-muted pt-1">
        <button type="button" onClick={onClose}>{COPY.close[locale]}</button>
        <button type="button" onClick={onClose} className="text-amber">{COPY.apply[locale]}</button>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Write `BottomBar.jsx`**

```jsx
"use client";

import Link from 'next/link';

const COPY = {
  filter: { id: '⌃ FILTER', en: '⌃ FILTER' },
  filtered: { id: 'TERSARING', en: 'FILTERED' },
  contact: { id: 'KONTAK', en: 'CONTACT' },
};

// No count. The only feedback a filter gives is that it is on.
export default function BottomBar({ locale, filtering, onOpenFilter }) {
  return (
    <div className="fixed inset-x-0 bottom-0 h-14 bg-ground flex items-center justify-between px-3.5 font-mono text-[11.5px] tracking-[.08em] text-muted">
      <button type="button" onClick={onOpenFilter} className="text-ink">
        {COPY.filter[locale]}
      </button>
      <span className="text-amber">{filtering ? COPY.filtered[locale] : ''}</span>
      <Link href="/kontak" className="text-amber">{COPY.contact[locale]}</Link>
    </div>
  );
}
```

- [ ] **Step 5: Run the tests**

Run: `npx vitest run src/components/document`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/document
git commit -m "feat(document): filter sheet and bottom bar"
```

---

## Task 10: `/` renders the document, shell upgrades over it

**Files:**
- Create: `src/lib/hooks/useShellEligible.js`
- Modify: `src/app/page.js`
- Create: `src/app/__tests__/page.test.jsx`

- [ ] **Step 1: Write the failing test**

```jsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from '@/app/page';
import { LocaleProvider } from '@/lib/hooks/useLocale';

const eligible = vi.hoisted(() => ({ value: false }));
vi.mock('@/lib/hooks/useShellEligible', () => ({
  useShellEligible: () => eligible.value,
}));

beforeEach(() => { eligible.value = false; });

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
});
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npx vitest run src/app/__tests__/page.test.jsx`
Expected: FAIL — cannot resolve `@/lib/hooks/useShellEligible`.

- [ ] **Step 3: Write `useShellEligible.js`**

```js
"use client";

import { useMediaQuery } from './useMediaQuery';

// Three conditions, all of them honest defaults: the shell needs room, it needs
// JavaScript, and it must not run for someone who asked for less motion. The
// server answers false for all three, so the document is what gets rendered and
// the page is complete before a single script arrives.
export function useShellEligible() {
  const wide = useMediaQuery('(min-width: 1024px)');
  const calm = useMediaQuery('(prefers-reduced-motion: reduce)');
  return wide && !calm;
}
```

- [ ] **Step 4: Rewrite `src/app/page.js`**

```jsx
"use client";

import { useState } from 'react';
import { projects } from '@/lib/data/projects';
import { useLocale } from '@/lib/hooks/useLocale';
import { useShellEligible } from '@/lib/hooks/useShellEligible';
import { EMPTY_FILTERS, isShown, toggleFilter, isFiltering } from '@/lib/shell/filters';
import SystemsDocument from '@/components/document/SystemsDocument';
import FilterSheet from '@/components/document/FilterSheet';
import BottomBar from '@/components/document/BottomBar';
import Shell from '@/components/shell/Shell';

export default function Home() {
  const { locale } = useLocale();
  const shell = useShellEligible();
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [sheetOpen, setSheetOpen] = useState(false);

  if (shell) return <Shell systems={projects} locale={locale} />;

  const dimmed = new Set(projects.filter((p) => !isShown(p, filters)).map((p) => p.slug));

  return (
    <>
      <SystemsDocument systems={projects} locale={locale} dimmed={dimmed} />
      {sheetOpen && (
        <FilterSheet
          systems={projects}
          filters={filters}
          locale={locale}
          onToggle={(key, value) => setFilters((f) => toggleFilter(f, key, value))}
          onReset={() => setFilters(EMPTY_FILTERS)}
          onClose={() => setSheetOpen(false)}
        />
      )}
      <BottomBar
        locale={locale}
        filtering={isFiltering(filters)}
        onOpenFilter={() => setSheetOpen(true)}
      />
    </>
  );
}
```

- [ ] **Step 5: Write a placeholder `Shell.jsx` so the import resolves**

```jsx
"use client";

export default function Shell() {
  return <div data-testid="shell" />;
}
```

- [ ] **Step 6: Run the tests**

Run: `npx vitest run src/app/__tests__/page.test.jsx`
Expected: PASS, 2 tests.

- [ ] **Step 7: Commit**

```bash
git add src/lib/hooks/useShellEligible.js src/app/page.js src/app/__tests__/page.test.jsx src/components/shell/Shell.jsx
git commit -m "feat(home): render the document first, upgrade to the shell"
```

---

## Task 11: Shell chrome — top bar, status bar, flat table, selected panel

**Files:**
- Create: `src/components/shell/TopBar.jsx`
- Create: `src/components/shell/StatusBar.jsx`
- Create: `src/components/shell/FlatTable.jsx`
- Create: `src/components/shell/SelectedPanel.jsx`
- Modify: `src/components/shell/Shell.jsx`
- Create: `src/components/shell/__tests__/Shell.test.jsx`

- [ ] **Step 1: Write the failing test**

```jsx
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LocaleProvider } from '@/lib/hooks/useLocale';
import Shell from '@/components/shell/Shell';
import { projects } from '@/lib/data/projects';

const renderShell = () =>
  render(<Shell systems={projects} locale="id" />, { wrapper: LocaleProvider });

describe('Shell', () => {
  it('opens on the record block, before anything is selected', () => {
    renderShell();
    expect(screen.getByText('Banjarbaru, Kalimantan Selatan')).toBeInTheDocument();
    expect(screen.queryByText('TERPILIH')).toBeNull();
  });

  it('selects a system without opening it', () => {
    renderShell();
    fireEvent.click(screen.getByRole('button', { name: /HRIS/ }));
    expect(screen.getByText('TERPILIH')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /BUKA HALAMAN/ }))
      .toHaveAttribute('href', '/kerja/hris-nirwana');
  });

  it('refuses to offer a page for a summary-only system', () => {
    renderShell();
    fireEvent.click(screen.getByRole('button', { name: /SIGAP/ }));
    expect(screen.getByText(/RINGKASAN SAJA/)).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /BUKA HALAMAN/ })).toBeNull();
  });

  it('switches to the flat table and back', () => {
    renderShell();
    fireEvent.click(screen.getByRole('button', { name: /LEWATI PETA/ }));
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('shows no counts in its chrome', () => {
    const { container } = renderShell();
    expect(container.textContent).not.toMatch(/\b8 (SISTEM|SYSTEMS)\b/);
  });
});
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npx vitest run src/components/shell/__tests__/Shell.test.jsx`
Expected: FAIL — the placeholder Shell renders nothing.

- [ ] **Step 3: Write `TopBar.jsx`**

```jsx
"use client";

import LangSwitcher from '@/components/nav/LangSwitcher';

const COPY = {
  skip: { id: 'LEWATI PETA → DAFTAR SISTEM', en: 'SKIP MAP → SYSTEM LIST' },
  view: { id: 'TAMPILAN', en: 'VIEW' },
  iso: { id: 'ISO', en: 'ISO' },
  flat: { id: 'DATAR', en: 'FLAT' },
  filtered: { id: 'TERSARING', en: 'FILTERED' },
};

export default function TopBar({ locale, view, filtering, onView }) {
  return (
    <div className="border-b border-rule px-6 py-2.5 flex items-center justify-between font-mono text-[11px] tracking-[.1em] text-muted">
      <div className="flex items-center gap-5">
        <span className="text-ink">UTSMAN</span>
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

- [ ] **Step 4: Write `StatusBar.jsx`**

```jsx
"use client";

import { meta } from '@/lib/data/meta';

export default function StatusBar({ locale }) {
  return (
    <div className="h-[34px] bg-ground-deep border-t border-rule px-6 flex items-center justify-between font-mono text-[11px] tracking-[.06em] text-muted">
      <span>UTSMAN · {meta.location[locale].toUpperCase()}</span>
      <span className="flex items-center gap-5">
        <a href={`mailto:${meta.email}`} className="text-amber">{meta.email}</a>
        <span>{meta.whatsapp}</span>
        <a href={meta.github}>GITHUB/{meta.githubHandle.toUpperCase()}</a>
        <a href={meta.cvFile} download>CV.PDF</a>
      </span>
    </div>
  );
}
```

- [ ] **Step 5: Write `SelectedPanel.jsx`**

```jsx
"use client";

import Link from 'next/link';
import { meta } from '@/lib/data/meta';
import AccessBadge from '@/components/work/AccessBadge';

const COPY = {
  selected: { id: 'TERPILIH', en: 'SELECTED' },
  stack: { id: 'LAPISAN STACK', en: 'STACK LAYERS' },
  open: { id: 'ENTER → BUKA HALAMAN', en: 'ENTER → OPEN PAGE' },
  noPage: { id: 'RINGKASAN SAJA · TANPA HALAMAN', en: 'SUMMARY ONLY · NO PAGE' },
  name: { id: 'NAMA', en: 'NAME' },
  role: { id: 'PERAN', en: 'ROLE' },
  place: { id: 'LOKASI', en: 'LOCATION' },
  span: { id: 'RENTANG', en: 'SPAN' },
  email: { id: 'EMAIL', en: 'EMAIL' },
};

// Before anything is selected the panel is a record block, not a sentence.
// The portfolio has no headline, and this panel does not smuggle one in.
function Record({ locale, span }) {
  const rows = [
    [COPY.name[locale], meta.name],
    [COPY.role[locale], 'Fullstack Developer'],
    [COPY.place[locale], meta.location[locale]],
    [COPY.span[locale], span],
    [COPY.email[locale], meta.email],
  ];
  return (
    <dl className="grid grid-cols-[92px_1fr] gap-y-2 font-mono text-[12px]">
      {rows.map(([k, v]) => (
        <div key={k} className="contents">
          <dt className="text-muted text-[10px] tracking-[.12em]">{k}</dt>
          <dd className="m-0 text-ink">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function SelectedPanel({ system, locale, span }) {
  if (!system) {
    return (
      <aside className="bg-surface border-l border-rule p-[18px] overflow-y-auto">
        <Record locale={locale} span={span} />
      </aside>
    );
  }

  return (
    <aside className="bg-surface border-l border-rule grid grid-rows-[1fr_auto] min-h-0">
      <div className="overflow-y-auto min-h-0 p-[18px] flex flex-col gap-3">
        <span className="font-mono text-[10px] tracking-[.12em] text-amber">
          {COPY.selected[locale]}
        </span>
        <h2 className="font-display text-[26px] font-extrabold tracking-[-.03em] text-ink-bright m-0">
          {system.shortName[locale]}
        </h2>
        <span className="font-mono text-[10.5px] text-muted">
          {system.client} · {system.year}
        </span>
        <AccessBadge access={system.access} locale={locale} />
        <div className="border-t border-rule" />
        <p className="text-[13.5px] text-body-soft m-0">{system.blurb[locale]}</p>

        <span className="font-mono text-[10px] tracking-[.12em] text-muted mt-2">
          {COPY.stack[locale]}
        </span>
        <ul className="font-mono text-[12px] text-ink flex flex-col gap-1 m-0 p-0 list-none">
          {system.tech.map((t) => <li key={t}>{t}</li>)}
        </ul>
      </div>

      <div className="border-t border-rule px-[18px] py-3">
        {system.tier === 'full' ? (
          <Link
            href={`/kerja/${system.slug}`}
            className="block text-center font-mono text-[11px] border border-amber text-amber py-2"
          >
            {COPY.open[locale]}
          </Link>
        ) : (
          <span className="block text-center font-mono text-[11px] border border-rule text-muted-deep py-2 cursor-default">
            {COPY.noPage[locale]}
          </span>
        )}
      </div>
    </aside>
  );
}
```

- [ ] **Step 6: Write `FlatTable.jsx`**

```jsx
"use client";

const COPY = {
  title: { id: 'Semua project', en: 'All projects' },
  intro: {
    id: 'Daftar datar ini data yang sama dengan peta, tanpa geometrinya. Ini juga yang dipakai kalau JavaScript mati atau gerak dikurangi.',
    en: 'The flat list is the same data as the map, without the geometry. It is also what runs with no JavaScript, or under reduced motion.',
  },
  foot: {
    id: 'Klik baris untuk memilih. Sebagian punya halaman baca, sebagian ringkasan saja.',
    en: 'Click a row to select it. Some have a reading page, some are summary only.',
  },
  cols: {
    id: ['SISTEM', 'KLIEN', 'TAHUN', 'AKSES', 'STACK'],
    en: ['SYSTEM', 'CLIENT', 'YEAR', 'ACCESS', 'STACK'],
  },
};

export default function FlatTable({ systems, locale, selected, dimmed, onSelect }) {
  return (
    <div className="overflow-y-auto p-10">
      <h1 className="font-display text-[32px] font-extrabold tracking-[-.03em] text-ink-bright m-0">
        {COPY.title[locale]}
      </h1>
      <p className="text-[14.5px] text-body-soft max-w-[70ch] mt-2 mb-6">{COPY.intro[locale]}</p>

      <table className="w-full border border-rule border-collapse">
        <thead>
          <tr className="bg-surface">
            {COPY.cols[locale].map((c) => (
              <th key={c} className="text-left font-mono text-[10px] tracking-[.12em] text-muted font-medium px-3.5 py-2">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {systems.map((s) => (
            <tr
              key={s.slug}
              className="border-b border-rule-soft transition-opacity duration-700"
              style={{ opacity: dimmed.has(s.slug) ? 0.45 : 1 }}
            >
              <td className="px-3.5 py-2.5">
                <button
                  type="button"
                  aria-pressed={selected === s.slug}
                  onClick={() => onSelect(s.slug)}
                  className={selected === s.slug ? 'text-amber' : 'text-ink'}
                >
                  {s.shortName[locale]}
                </button>
              </td>
              <td className="px-3.5 py-2.5 font-mono text-[12px] text-muted">{s.client}</td>
              <td className="px-3.5 py-2.5 font-mono text-[12px] text-muted">{s.year}</td>
              <td className="px-3.5 py-2.5 font-mono text-[12px] text-muted">{s.access}</td>
              <td className="px-3.5 py-2.5 font-mono text-[12px] text-muted">{s.tech.join(' · ')}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="font-mono text-[11px] text-muted-deep mt-4">{COPY.foot[locale]}</p>
    </div>
  );
}
```

- [ ] **Step 7: Write the real `Shell.jsx`**

```jsx
"use client";

import { useState } from 'react';
import { EMPTY_FILTERS, isShown, toggleFilter, isFiltering } from '@/lib/shell/filters';
import TopBar from './TopBar';
import StatusBar from './StatusBar';
import FlatTable from './FlatTable';
import SelectedPanel from './SelectedPanel';

export default function Shell({ systems, locale }) {
  const [view, setView] = useState('map');
  const [selected, setSelected] = useState(null);
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  const dimmed = new Set(systems.filter((s) => !isShown(s, filters)).map((s) => s.slug));
  const years = systems.map((s) => Number(s.year));
  const span = `${Math.min(...years)}–${Math.max(...years)}`;
  const current = systems.find((s) => s.slug === selected) ?? null;

  return (
    <div data-testid="shell" className="h-[100dvh] grid grid-rows-[auto_1fr_34px] overflow-hidden bg-ground">
      <TopBar
        locale={locale}
        view={view}
        filtering={isFiltering(filters)}
        onView={setView}
      />

      <div className="grid grid-cols-[290px_1fr_270px] min-h-0">
        <div className="bg-surface border-r border-rule" />
        {view === 'list' ? (
          <FlatTable
            systems={systems}
            locale={locale}
            selected={selected}
            dimmed={dimmed}
            onSelect={setSelected}
          />
        ) : (
          <div className="min-h-0" />
        )}
        <SelectedPanel system={current} locale={locale} span={span} />
      </div>

      <StatusBar locale={locale} />
    </div>
  );
}
```

The left rail and the map pane are filled in by Tasks 12 and 13. `toggleFilter` is imported now so the rail can use it without another edit.

- [ ] **Step 8: Run the tests**

Run: `npx vitest run src/components/shell/__tests__/Shell.test.jsx`
Expected: PASS, 5 tests. The "selects a system" test drives the table, so it must run after switching to `list`; if it fails because the map pane is empty, change that test to click the skip chip first — the assertion about selection is what matters.

- [ ] **Step 9: Commit**

```bash
git add src/components/shell
git commit -m "feat(shell): chrome, flat table and the selected panel"
```

---

## Task 12: The log rail

**Files:**
- Create: `src/components/shell/LogRail.jsx`
- Modify: `src/components/shell/Shell.jsx`
- Modify: `src/components/shell/__tests__/Shell.test.jsx`

- [ ] **Step 1: Write the failing test**

Add to `Shell.test.jsx`:

```jsx
  it('lists the systems in the rail and dims the ones a filter excludes', () => {
    renderShell();
    fireEvent.click(screen.getByRole('button', { name: 'client:bpn' }));
    const row = screen.getByRole('button', { name: /Pendaftaran OCR/ });
    expect(row.closest('li')).toHaveStyle({ opacity: '0.45' });
  });

  it('writes the same log line whether a chip or a command ran', () => {
    renderShell();
    fireEvent.click(screen.getByRole('button', { name: 'client:bpn' }));
    expect(screen.getByText('$ filter client:bpn')).toBeInTheDocument();
  });
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npx vitest run src/components/shell/__tests__/Shell.test.jsx`
Expected: FAIL — no chip called `client:bpn`.

- [ ] **Step 3: Write `LogRail.jsx`**

```jsx
"use client";

import AccessBadge from '@/components/work/AccessBadge';

const COPY = {
  log: { id: 'LOG', en: 'LOG' },
  filters: { id: 'FILTER · KLIK ATAU KETIK', en: 'FILTERS · CLICK OR TYPE' },
  inView: { id: 'SISTEM YANG TAMPIL', en: 'SYSTEMS IN VIEW' },
  note: {
    id: 'Sistem yang diredupkan tetap di peta. Tidak ada yang disembunyikan, hanya didorong ke belakang.',
    en: 'Dimmed systems stay on the map. Nothing is ever hidden, only pushed back.',
  },
};

// Chips carry the exact text a visitor would type. That is the whole trick:
// clicking one and typing it produce the same log line.
const CHIPS = [
  { key: 'client', value: 'rsu-nirwana' },
  { key: 'client', value: 'bpn' },
  { key: 'year', value: '2026' },
  { key: 'access', value: 'public' },
  { key: 'stack', value: 'soap' },
];

const LINE_COLOUR = {
  history: 'text-muted-deep',
  command: 'text-body-soft',
  result: 'text-amber',
};

export default function LogRail({
  systems, locale, log, filters, selected, dimmed, onChip, onReset, onSelect,
}) {
  return (
    <div className="bg-surface border-r border-rule px-4 py-[18px] flex flex-col gap-3.5 overflow-hidden min-h-0">
      <div className="font-mono text-[10px] tracking-[.12em] text-muted">{COPY.log[locale]}</div>
      <div aria-live="polite" className="font-mono text-[11.5px] leading-[1.95] flex-none">
        {log.map((line, i) => (
          <div key={`${line.text}-${i}`} className={LINE_COLOUR[line.kind]}>{line.text}</div>
        ))}
      </div>

      <div className="font-mono text-[10px] tracking-[.12em] text-muted">{COPY.filters[locale]}</div>
      <div className="flex flex-wrap gap-1.5 flex-none">
        {CHIPS.map((c) => {
          const label = `${c.key}:${c.value}`;
          const on = filters[c.key] === c.value;
          return (
            <button
              key={label}
              type="button"
              aria-pressed={on}
              onClick={() => onChip(c.key, c.value)}
              className={`font-mono text-[11px] px-2 py-1 border transition-colors duration-200 ${
                on ? 'border-amber text-amber' : 'border-rule text-muted'
              }`}
            >
              {on ? `${label} ×` : label}
            </button>
          );
        })}
        <button
          type="button"
          onClick={onReset}
          className="font-mono text-[11px] px-2 py-1 border border-rule text-muted"
        >
          reset
        </button>
      </div>

      <div className="font-mono text-[10px] tracking-[.12em] text-muted">{COPY.inView[locale]}</div>
      <ul className="overflow-y-auto min-h-0 flex-1 m-0 p-0 list-none">
        {systems.map((s) => (
          <li
            key={s.slug}
            className="border-t border-surface-plate transition-opacity duration-700"
            style={{ opacity: dimmed.has(s.slug) ? 0.45 : 1 }}
          >
            <button
              type="button"
              aria-pressed={selected === s.slug}
              onClick={() => onSelect(s.slug)}
              className={`w-full grid grid-cols-[1fr_auto] items-center gap-2 text-left px-1.5 py-[7px] text-[13px] ${
                selected === s.slug ? 'bg-surface-plate' : ''
              }`}
            >
              <span className="truncate">{s.shortName[locale]}</span>
              <AccessBadge access={s.access} locale={locale} short />
            </button>
          </li>
        ))}
      </ul>

      <p className="font-mono text-[10px] text-muted-deep flex-none m-0">{COPY.note[locale]}</p>
    </div>
  );
}
```

`AccessBadge` gains a `short` prop in this step: when set, it renders `PUBLIK` / `INTERNAL` / `TANPA URL` (and `PUBLIC` / `INTERNAL` / `NO URL`) instead of the long form. Add the short strings to the component's `LABEL` map as `LABEL_SHORT`.

- [ ] **Step 4: Wire the rail into `Shell.jsx`**

Replace the empty rail `<div className="bg-surface border-r border-rule" />` with:

```jsx
        <LogRail
          systems={systems}
          locale={locale}
          log={log}
          filters={filters}
          selected={selected}
          dimmed={dimmed}
          onChip={applyFilter}
          onReset={resetFilters}
          onSelect={setSelected}
        />
```

and add the log state plus the two handlers to `Shell`:

```jsx
  const [log, setLog] = useState([{ text: '$ ls systems', kind: 'command' }]);

  // Ten lines, oldest dropped. The log is a record of intent, not a report:
  // it echoes what was asked for and never counts what came back.
  const say = (text, kind) => setLog((l) => [...l, { text, kind }].slice(-10));

  const applyFilter = (key, value) => {
    setFilters((f) => toggleFilter(f, key, value));
    say(`$ filter ${key}:${value}`, 'command');
  };

  const resetFilters = () => {
    setFilters(EMPTY_FILTERS);
    say('$ reset', 'command');
  };
```

- [ ] **Step 5: Run the tests**

Run: `npx vitest run src/components/shell/__tests__/Shell.test.jsx`
Expected: PASS, 7 tests.

- [ ] **Step 6: Commit**

```bash
git add src/components/shell src/components/work/AccessBadge.jsx
git commit -m "feat(shell): the log rail, where chips and typing meet"
```

---

## Task 13: The isometric map

**Files:**
- Create: `src/components/shell/Plate.jsx`
- Create: `src/components/shell/AxisLegend.jsx`
- Create: `src/components/shell/MapScene.jsx`
- Create: `src/components/shell/__tests__/Plate.test.jsx`
- Modify: `src/components/shell/Shell.jsx`

- [ ] **Step 1: Write the failing test**

```jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Plate from '@/components/shell/Plate';

const system = {
  slug: 'hris-nirwana', client: 'RSU Nirwana', year: '2026', access: 'internal',
  tier: 'full', tech: ['Laravel', 'Livewire', 'Alpine.js', 'MySQL', 'TensorFlow.js'],
  shortName: { id: 'HRIS', en: 'HRIS' },
};
const pos = {
  slug: 'hris-nirwana', year: '2026', x: 40, y: 440,
  width: 165, height: 115, layers: 5, topZ: 28, layerStep: 7,
};

const renderPlate = (props = {}) =>
  render(
    <Plate
      system={system} position={pos} locale="id" rotZ={-40}
      selected={false} dimmed={false} onSelect={vi.fn()} {...props}
    />,
  );

describe('Plate', () => {
  it('is a button, so it can be reached by keyboard', () => {
    renderPlate();
    expect(screen.getByRole('button', { name: /HRIS/ })).toBeInTheDocument();
  });

  it('draws one layer per technology', () => {
    const { container } = renderPlate();
    expect(container.querySelectorAll('[data-layer]')).toHaveLength(5);
  });

  it('states client and access, and no counts', () => {
    renderPlate();
    expect(screen.getByText(/RSU NIRWANA · INTERNAL/i)).toBeInTheDocument();
    expect(screen.queryByText(/5 (TEKNOLOGI|TECHNOLOGIES)/i)).toBeNull();
  });

  it('counter-rotates its label so text stays upright', () => {
    const { container } = renderPlate({ rotZ: -25 });
    const label = container.querySelector('[data-plate-label]');
    expect(label.getAttribute('style')).toContain('rotateZ(25deg)');
  });

  it('dims without disappearing', () => {
    const { container } = renderPlate({ dimmed: true });
    expect(container.firstChild).toHaveStyle({ opacity: '0.34' });
  });
});
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npx vitest run src/components/shell/__tests__/Plate.test.jsx`
Expected: FAIL — cannot resolve the component.

- [ ] **Step 3: Write `Plate.jsx`**

```jsx
"use client";

const PLATE_BG = ['#1B2124', '#1D2428', '#20272B', '#252E33', '#2C3439'];
const PLATE_EDGE = ['#333C41', '#3A4348', '#3F484D', '#4A545A', '#4A545A'];
const EASE = 'cubic-bezier(.22, 1, .36, 1)';

// Colours are literal here rather than tokens: they are indexed by layer depth,
// and a five-step ramp reads better as an array than as five class names.
export default function Plate({ system, position, locale, rotZ, selected, dimmed, onSelect }) {
  const layers = Array.from({ length: position.layers }, (_, i) => i);
  const isPublic = system.access === 'public';
  const lift = selected ? 10 : 0;

  return (
    <div
      className="absolute"
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
      {layers.map((i) => {
        const top = i === position.layers - 1;
        const bg = top && isPublic ? '#27302F' : PLATE_BG[Math.min(i, 4)];
        const edge = top && selected ? '#E8E0D0' : (top && isPublic ? '#C97B3F' : PLATE_EDGE[Math.min(i, 4)]);
        return (
          <div
            key={i}
            data-layer={i}
            className="absolute inset-0"
            style={{
              background: bg,
              border: `${top && selected ? 2 : 1}px solid ${edge}`,
              transform: `translateZ(${i * position.layerStep}px)`,
              transition: `border-color 180ms linear`,
            }}
          />
        );
      })}

      <button
        type="button"
        aria-pressed={selected}
        onClick={() => onSelect(system.slug)}
        data-plate-label
        className="absolute left-1/2 top-1/2 text-center whitespace-nowrap"
        style={{
          transform: `translateZ(${position.topZ + lift + 4}px) rotateZ(${-rotZ}deg) rotateX(-56deg) translate(-50%, -50%)`,
          textShadow: '0 1px 3px rgba(14,17,19,.9), 0 0 10px rgba(14,17,19,.75)',
        }}
      >
        <span
          className={`block font-display tracking-[-.02em] ${
            position.width > 120 ? 'text-[16px] font-bold' : 'text-[12.5px] font-semibold'
          } text-ink-bright`}
        >
          {system.shortName[locale]}
        </span>
        <span className={`block font-mono ${position.width > 120 ? 'text-[10px]' : 'text-[9.5px]'} ${
          isPublic ? 'text-amber' : 'text-muted'
        }`}>
          {system.client.toUpperCase()} · {system.access.toUpperCase()}
        </span>
      </button>
    </div>
  );
}
```

- [ ] **Step 4: Run the Plate tests**

Run: `npx vitest run src/components/shell/__tests__/Plate.test.jsx`
Expected: PASS, 5 tests.

- [ ] **Step 5: Write `AxisLegend.jsx`**

```jsx
"use client";

const COPY = {
  id: ['KEDALAMAN tahun · TINGGI stack', 'LUAS punya halaman · TEPI publik', 'REDUP tersaring, tetap ada'],
  en: ['DEPTH year · HEIGHT stack', 'AREA has page · EDGE public', 'DIM filtered out, still present'],
};

// Lives outside the plate field on purpose: inside it, plate labels render
// on top of it.
export default function AxisLegend({ locale }) {
  return (
    <div className="border-t border-rule-soft px-5 py-2.5 flex gap-[26px] font-mono text-[10px] text-muted-deep">
      {COPY[locale].map((line) => <span key={line}>{line}</span>)}
    </div>
  );
}
```

- [ ] **Step 6: Write `MapScene.jsx`**

```jsx
"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import { SCENE, ROW_Y, platePositions, fitScale, snapRotation } from '@/lib/shell/layout';
import Plate from './Plate';
import AxisLegend from './AxisLegend';

const COPY = { drag: { id: 'SERET UNTUK MEMUTAR · 1:1', en: 'DRAG TO ORBIT · 1:1' } };

export default function MapScene({ systems, locale, selected, dimmed, onSelect }) {
  const paneRef = useRef(null);
  const [scale, setScale] = useState(0.4);
  const [rotZ, setRotZ] = useState(-40);
  // Dragging follows the pointer exactly; only the release is eased.
  const drag = useRef(null);

  const measure = useCallback(() => {
    const box = paneRef.current?.getBoundingClientRect();
    if (box) setScale(fitScale({ width: box.width, height: box.height }));
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  const positions = platePositions(systems);

  const onPointerDown = (e) => {
    drag.current = { x: e.clientX, rot: rotZ };
  };
  const onPointerMove = (e) => {
    if (!drag.current) return;
    setRotZ(drag.current.rot + (e.clientX - drag.current.x) * 0.22);
  };
  const endDrag = () => {
    if (!drag.current) return;
    drag.current = null;
    setRotZ((r) => snapRotation(r));
  };

  return (
    <div className="grid grid-rows-[1fr_auto] min-h-0">
      <div
        ref={paneRef}
        data-testid="map-pane"
        className="relative overflow-hidden cursor-grab active:cursor-grabbing touch-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <span className="absolute right-4 top-3 font-mono text-[10px] text-muted-deep pointer-events-none">
          {COPY.drag[locale]}
        </span>

        <div
          className="absolute left-1/2 top-1/2"
          style={{
            width: SCENE.width,
            height: SCENE.height,
            perspective: 2400,
            transform: `translate(-50%, -50%) scale(${scale.toFixed(3)})`,
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              transformStyle: 'preserve-3d',
              transform: `rotateX(56deg) rotateZ(${rotZ}deg)`,
            }}
            role="group"
            aria-label={locale === 'id'
              ? 'Peta sistem: kedalaman menandai tahun, tinggi menandai jumlah teknologi'
              : 'System map: depth is the year, height is the number of technologies'}
          >
            {Object.entries(ROW_Y).map(([year, y]) => (
              <div
                key={year}
                className="absolute h-px"
                style={{ left: 20, top: y + 40, width: 700, background: year === '2026' ? '#2E3539' : '#232B30' }}
              >
                <span
                  className={`absolute font-mono text-[11px] ${year === '2026' ? 'text-amber' : 'text-muted-deep'}`}
                  style={{ left: 710, transform: `rotateZ(${-rotZ}deg) rotateX(-56deg) translate(0,-7px)` }}
                >
                  {year}
                </span>
              </div>
            ))}

            {systems.map((s, i) => (
              <Plate
                key={s.slug}
                system={s}
                position={positions[i]}
                locale={locale}
                rotZ={rotZ}
                selected={selected === s.slug}
                dimmed={dimmed.has(s.slug)}
                onSelect={onSelect}
              />
            ))}
          </div>
        </div>
      </div>

      <AxisLegend locale={locale} />
    </div>
  );
}
```

- [ ] **Step 7: Mount it in `Shell.jsx`**

Replace `<div className="min-h-0" />` with:

```jsx
          <MapScene
            systems={systems}
            locale={locale}
            selected={selected}
            dimmed={dimmed}
            onSelect={setSelected}
          />
```

- [ ] **Step 8: Run the whole suite**

Run: `npm test`
Expected: PASS.

- [ ] **Step 9: Verify in a real browser — this is the risky task**

Open the preview at ≥1024px and check, with your eyes: plate labels are sharp and upright, no plate sits inside another, the year rules read as an axis, dragging follows the cursor with no lag, and releasing snaps. Take a screenshot. If labels are unreadable at this rotation, say so and stop — the flat table is a complete fallback and the map is the part that can be dropped.

- [ ] **Step 10: Commit**

```bash
git add src/components/shell
git commit -m "feat(shell): the isometric map, its axes and its orbit"
```

---

## Task 14: The console and keyboard

**Files:**
- Create: `src/components/shell/Console.jsx`
- Modify: `src/components/shell/Shell.jsx`
- Modify: `src/components/shell/__tests__/Shell.test.jsx`

- [ ] **Step 1: Write the failing test**

```jsx
  it('runs a typed command and logs it exactly like a chip', () => {
    renderShell();
    const input = screen.getByLabelText(/konsol/i);
    fireEvent.change(input, { target: { value: 'filter client:bpn' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(screen.getByText('$ filter client:bpn')).toBeInTheDocument();
  });

  it('says why a summary-only system will not open', () => {
    renderShell();
    const input = screen.getByLabelText(/konsol/i);
    fireEvent.change(input, { target: { value: 'open sigap' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(screen.getByText(/ringkasan saja · tidak ada halaman/i)).toBeInTheDocument();
  });

  it('reports an unknown command without pretending it worked', () => {
    renderShell();
    const input = screen.getByLabelText(/konsol/i);
    fireEvent.change(input, { target: { value: 'deploy' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(screen.getByText(/tidak dikenal · coba help/i)).toBeInTheDocument();
  });

  it('clears the filters on Escape', () => {
    renderShell();
    fireEvent.click(screen.getByRole('button', { name: 'client:bpn' }));
    const input = screen.getByLabelText(/konsol/i);
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(screen.getByRole('button', { name: 'client:bpn' })).toHaveAttribute('aria-pressed', 'false');
  });
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npx vitest run src/components/shell/__tests__/Shell.test.jsx`
Expected: FAIL — no element labelled "konsol".

- [ ] **Step 3: Write `Console.jsx`**

```jsx
"use client";

import { useEffect, useRef } from 'react';

const COPY = {
  label: { id: 'Konsol perintah', en: 'Command console' },
  placeholder: {
    id: 'coba: filter client:rsu-nirwana · open hris · stack:soap · help',
    en: 'try: filter client:rsu-nirwana · open hris · stack:soap · help',
  },
  hint: {
    id: 'ENTER MENJALANKAN · ESC MENGOSONGKAN FILTER',
    en: 'ENTER RUNS · ESC CLEARS FILTERS',
  },
};

export default function Console({ locale, value, onChange, onRun, onEscape }) {
  const ref = useRef(null);

  // "/" focuses the console from anywhere, the way it does in the tools this
  // audience already uses.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === '/' && document.activeElement !== ref.current) {
        e.preventDefault();
        ref.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="h-11 bg-ground-deep border-t border-rule flex items-center gap-3 px-6">
      <span className="text-amber font-mono text-[13px]">$</span>
      <label htmlFor="shell-console" className="sr-only">{COPY.label[locale]}</label>
      <input
        id="shell-console"
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onRun(value);
          if (e.key === 'Escape') onEscape();
        }}
        placeholder={COPY.placeholder[locale]}
        className="flex-1 bg-transparent border-0 outline-none font-mono text-[13px] text-ink placeholder:text-muted-deep"
      />
      <span className="font-mono text-[10.5px] text-muted-deep">{COPY.hint[locale]}</span>
    </div>
  );
}
```

Add `.sr-only` to `globals.css` if it is not already defined:

```css
.sr-only {
  position: absolute;
  width: 1px; height: 1px;
  padding: 0; margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}
```

- [ ] **Step 4: Wire the console into `Shell.jsx`**

Change the grid to `grid-rows-[auto_1fr_44px_34px]`, add `<Console … />` above `<StatusBar />`, and add the runner:

```jsx
  const [cmd, setCmd] = useState('');
  const router = useRouter();

  const RESULT = {
    noPage: { id: '  ringkasan saja · tidak ada halaman', en: '  summary only · no page' },
    unknown: { id: '  tidak dikenal · coba help', en: '  unknown · try help' },
    noMatch: { id: '  tidak ada yang cocok', en: '  no match' },
    help: {
      id: '  ls · open [nama] · filter [k:v] · reset · view iso/flat · lang id/en',
      en: '  ls · open [name] · filter [k:v] · reset · view iso/flat · lang id/en',
    },
    contact: `  ${meta.email} · ${meta.whatsapp}`,
  };

  const run = (raw) => {
    const intent = parseCommand(raw);
    setCmd('');
    if (intent.action === 'none') return;

    if (intent.action === 'filter') { applyFilter(intent.key, intent.value); return; }
    if (intent.action === 'reset') { resetFilters(); return; }
    if (intent.action === 'view') { setView(intent.view); say(`$ view ${intent.view === 'map' ? 'iso' : 'flat'}`, 'command'); return; }
    if (intent.action === 'lang') { setLocale(intent.lang); say(`$ lang ${intent.lang}`, 'command'); return; }
    if (intent.action === 'list') { say('$ ls systems', 'command'); return; }
    if (intent.action === 'help') { say('$ help', 'command'); say(RESULT.help[locale], 'result'); return; }
    if (intent.action === 'contact') { say('$ contact', 'command'); say(RESULT.contact, 'result'); return; }

    if (intent.action === 'open') {
      const found = findSystem(systems, intent.query);
      say(`$ open ${intent.query}`, 'command');
      if (!found) { say(RESULT.noMatch[locale], 'result'); return; }
      setSelected(found.slug);
      if (found.tier !== 'full') { say(RESULT.noPage[locale], 'result'); return; }
      router.push(`/kerja/${found.slug}`);
      return;
    }

    say(`$ ${intent.input}`, 'command');
    say(RESULT.unknown[locale], 'result');
  };
```

Imports to add at the top of `Shell.jsx`: `useRouter` from `next/navigation`, `parseCommand` and `findSystem` from `@/lib/shell/commands`, `meta` from `@/lib/data/meta`, and `useLocale` for `setLocale`.

- [ ] **Step 5: Run the tests**

Run: `npx vitest run src/components/shell/__tests__/Shell.test.jsx`
Expected: PASS, 11 tests. `next/navigation` needs a mock in this test file:

```jsx
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }));
```

- [ ] **Step 6: Commit**

```bash
git add src/components/shell src/app/globals.css
git commit -m "feat(shell): the console, and the keyboard that reaches it"
```

---

## Task 15: Delete the canvas

**Files:**
- Delete: `src/components/canvas/` (whole directory, including `__tests__`)
- Delete: `src/lib/canvas/` (whole directory, including `__tests__`)
- Delete: `src/lib/data/canvas.js`
- Delete: `src/lib/data/__tests__/layout.test.js`
- Modify: `src/lib/data/projects.js`
- Modify: `src/lib/data/__tests__/projects.test.js`

- [ ] **Step 1: Delete the directories and the dead data module**

```bash
git rm -r src/components/canvas src/lib/canvas src/lib/data/canvas.js src/lib/data/__tests__/layout.test.js
```

- [ ] **Step 2: Remove the canvas fields from every project**

Delete the `position`, `cluster` and `related` lines from all eight entries in `src/lib/data/projects.js`, and delete the comment block above the array that explains node sizing.

- [ ] **Step 3: Remove the tests that asserted those fields**

In `src/lib/data/__tests__/projects.test.js`, delete the tests named `resolves every related slug to a real project` and any test referencing `position` or `WORLD`, and remove the now-unused `CENTER_NODE` / `WORLD` import.

- [ ] **Step 4: Run everything**

Run: `npm test && npx eslint src --max-warnings=0 && npm run build`
Expected: all pass; the build lists five `/kerja/*` pages.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "refactor: remove the canvas, its geometry and its data"
```

---

## Task 16: Contact page and OG card onto the dark layer

**Files:**
- Modify: `src/components/contact/ContactView.jsx`
- Modify: `src/components/nav/LangSwitcher.jsx`
- Modify: `src/app/opengraph-image.jsx`
- Modify: `src/components/contact/__tests__/ContactView.test.jsx` (if colour assertions exist)

- [ ] **Step 1: Repaint `ContactView.jsx`**

Swap `text-amber-ink` → `text-amber`, `hover:bg-amber-ink hover:text-paper` → `hover:bg-amber hover:text-ground`, `text-ink/85` → `text-body-soft`, `text-mute` → `text-muted`, `border-rule` unchanged, and delete every `rounded*` class. The heading becomes `font-display text-4xl font-extrabold tracking-[-.035em]`.

- [ ] **Step 2: Drop the `tone` prop from `LangSwitcher.jsx`**

There is one layer now. Keep the dark styling, delete the paper branch and the prop.

- [ ] **Step 3: Update the OG card's font stack**

In `src/app/opengraph-image.jsx`, change `fontFamily: 'serif'` to `fontFamily: 'sans-serif'` — Fraunces is gone, and the card should not fall back to a serif that no longer appears anywhere on the site. The hex constants already match the dark layer; leave them.

- [ ] **Step 4: Run everything**

Run: `npm test && npx eslint src --max-warnings=0 && npm run build`
Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git add src/components src/app/opengraph-image.jsx
git commit -m "feat(contact,og): finish the move onto the dark layer"
```

---

## Task 17: See it with your own eyes

No test in this task. The lesson that earned it: synthetic clicks kept 86 tests green while every real click landed on the background.

- [ ] **Step 1: Start the preview and check the document at 390px**

Identity, then years descending, no headline, no counts. Tap a system with a page — it opens `/kerja/<slug>`. Tap one without — nothing happens and nothing looks broken.

- [ ] **Step 2: Check the filter sheet on the phone width**

Every chip target clears 44px. Picking one dims the rest at 0.4 and the bottom bar reads `TERSARING`. Picking it again clears it.

- [ ] **Step 3: Check the shell at 1440×900**

Plates upright and legible, rail scrolls on its own, panel opens on the record block, selecting fills it, `ENTER → BUKA HALAMAN` navigates.

- [ ] **Step 4: Drive the console by hand**

Type `help`, `ls`, `filter client:bpn`, `client:bpn` again to clear, `open rme`, `open sigap` (must refuse), `deploy` (must say unknown), `view flat`, `view iso`, `lang en`. Press `/` from the map and confirm focus lands in the input. Press `Escape` and confirm filters clear.

- [ ] **Step 5: Check the states nobody remembers to check**

Disable JavaScript and load `/` — the document must still render and its links must work. Turn on reduced motion and reload at desktop width — you should land on the flat table, not the map. Load `/kerja/rme` directly in a fresh tab.

- [ ] **Step 6: Update `docs/PROGRESS.md`**

Rewrite "Bentuk sekarang", "Di mana isinya" and "Keputusan yang mahal" for the new shape: two forms, dark reading pages, no counts, no rare markers, no hard-part section. Record anything the browser pass taught you in "Pelajaran yang mahal".

- [ ] **Step 7: Commit**

```bash
git add docs/PROGRESS.md
git commit -m "docs: record the shape after the shell and document landed"
```

---

## Self-review notes

Checked against the spec:

- §1 two forms → Tasks 8, 11, 13. §2 routes and no-JS → Task 10. §3 data → Tasks 2, 4, 15. §4 map axes → Tasks 6, 13. §4b reading page → Task 7. §5 components → the file table above. §6 console → Tasks 5, 14. §7 behaviour → Tasks 12, 13, 14. §8 keyboard and screen readers → Tasks 12 (`aria-live`), 13 (`role="group"`, buttons), 14 (label, `/`, Escape). §9 colour → Tasks 1, 7, 16. §10 typography → Task 1. §11 deletions → Task 15. §12 testing → every task. §13 order → task order. §14 risks → Task 13 Step 9 and Task 17.
- One gap found and closed while reviewing: `isShown` needs `clientKey`, which the dataset did not have — added as Task 4, before any component consumes it.
- Names checked across tasks: `techNames`/`techSlug` (Task 2) are used unchanged in Tasks 3 and 9; `EMPTY_FILTERS`/`isShown`/`toggleFilter`/`isFiltering` (Task 3) in Tasks 10, 11, 12; `platePositions`/`fitScale`/`snapRotation`/`SCENE`/`ROW_Y` (Task 6) in Task 13; `parseCommand`/`findSystem` (Task 5) in Task 14.
