# Handoff: Porto Utsman — isometric module map + console shell

## Overview

A personal portfolio for Utsman, a fullstack developer in Banjarbaru, South Kalimantan, whose work is
hospital and public-sector systems. Eight systems, four with a reading page of their own, four listed
as summary only.

The design takes two forms with one identity:

- **Desktop (≥1024px)** — an internal-software shell. An isometric map of the eight systems is the
  landing view, driven by a console: a real text input plus clickable chips that run the same commands.
  A flat table view is the escape hatch and the no-JS fallback.
- **Mobile and tablet (<1024px)** — an engineering document. No map. The map's depth axis becomes a
  vertical year spine you scroll; the console becomes a filter sheet pulled up with the thumb.

Bilingual EN/ID throughout — prose, labels, and section names all switch.

## About the design files

The files in this bundle are **design references created in HTML**. They are prototypes showing
intended look and behaviour, not production code to copy. The task is to **recreate these designs in
the target codebase** (Next.js, per the developer's stack) using its established patterns, routing,
and styling approach.

Two files:

- `Porto Utsman Prototype.dc.html` — the working prototype. Click, drag, type commands, switch
  language, resize the window past 1024px to see the document form. **This is the primary reference.**
- `Porto Utsman.dc.html` — the earlier static artboard sheet, three turns of exploration side by side.
  Useful for the token board (turn 1, artboard `1h`) and for seeing rejected directions. Not the target.

Both open directly in a browser. Ignore the `.dc.html` extension and any `support.js` reference — that
is authoring machinery, irrelevant to the implementation.

## Fidelity

**High-fidelity.** Colours, type, spacing, and interaction behaviour are final. Recreate faithfully.

Two things are deliberately unfinished and are NOT defects:

1. **Screenshot slots are empty.** Two of eight modules have no image, and the design shows an explicit
   empty state rather than a staged one. The public module's slot says redaction is required (patient
   names, NIK, medical record numbers must be masked before publishing). Do not fill these with stock
   imagery.
2. **Context and "hard part" prose is placeholder-quality.** It was derived from stack and client facts
   only. Utsman intends to replace it with his own writing. Wire it as content, not as hardcoded strings.

There are **no impact numbers anywhere** (no "reduced wait times by X%"). This is a hard constraint from
the brief, not an omission.

## Design tokens

### Colour

Two layers. The desktop shell and reading pages use the dark layer; the mobile document uses the paper layer.

**Dark layer**

| Token | Hex | Use |
|---|---|---|
| ground | `#161A1D` | page background |
| ground-deep | `#0E1113` | status bar, console bar |
| surface | `#1B2124` | rails, panels, cards |
| surface-raised | `#1F2529` | selected row fill |
| surface-plate | `#252E33` | plate layer 4, selected rail row |
| rule | `#2E3539` | borders, dividers |
| rule-soft | `#1F262A` | table row dividers |
| plate-1..5 | `#1B2124` `#1D2428` `#20272B` `#252E33` `#2C3439` | isometric stack layers, bottom to top |
| plate-edge-1..4 | `#333C41` `#3A4348` `#3F484D` `#4A545A` | plate borders, bottom to top |
| ink | `#E8E0D0` | body text |
| ink-bright | `#F2EDE3` | plate names, headings |
| muted | `#7A8580` | labels, secondary text |
| muted-deep | `#4C555A` | log history, hints, axis legend |
| body-soft | `#B9B2A2` | paragraph text on dark |
| amber | `#C97B3F` | accent — dark layer ONLY |

**Paper layer**

| Token | Hex | Use |
|---|---|---|
| paper | `#F2EDE3` | background |
| paper-deep | `#EDE7DA` | rails, hover fill, note strip |
| paper-deeper | `#E7E0D0` | header fill |
| paper-plate | `#E2DBC9` | table headers, group headers |
| rule | `#D9D0BC` | structural borders |
| rule-soft | `#E2DBC9` | row dividers |
| rule-edge | `#C7BEA8` | outer borders, disabled dashed borders |
| ink | `#1A1A1A` | body text |
| ink-soft | `#3A3A34` | secondary paragraphs |
| muted | `#6B6B5E` | labels |
| amber-ink | `#9C5A28` | accent — paper layer ONLY |

**Amber rule, important:** `#C97B3F` on `#F2EDE3` is 2.82:1 and fails AA. On paper, always use
`#9C5A28` (4.9:1). `#C97B3F` is only ever used on the dark layer. Do not use one hex for both.

### Typography

- **Bricolage Grotesque** (500/700/800) — display. Headings, plate names, module titles.
  Always with negative tracking: `-.02em` at small sizes, `-.03em` to `-.035em` at 26px+.
- **Inter** (400/500/600) — body and UI rows.
- **JetBrains Mono** (400/500/700) — every label, badge, data value, log line, and the console.
  Uppercase labels get `letter-spacing: .12em`–`.14em` at 10px.

Scale as used: display 44 / 34 / 28 / 26 / 22 · body 16 / 15 / 14.5 / 14 / 13.5 · mono data 13 / 12.5 / 12 / 11.5 / 11 · mono label 10 / 9.5.

Line-height: 1.7 for reading prose, 1.65 for panel prose, 1.15–1.22 for display. `text-wrap: pretty` on
display headings.

Do **not** substitute Fraunces (it was rejected — serif display plus warm cream reads as the exact
template the brief rules out) or add a pixel/video-game font. The "game" quality comes from the HUD
chrome: corner ticks, axis labels, live readouts.

### Spacing — 4pt base

4 (inside a chip) · 8 (label to value) · 14 (row padding-x) · 20–22 (mobile gutter) · 40 (desktop gutter) · 52–56 (column gap)

### Borders, radius, shadow

**Radius is 0 everywhere. Shadows are not used** — no floating cards, no lift on hover. Depth comes from
the isometric stack and from 1px rules. The single exception is a text-shadow behind plate labels
(`0 1px 3px rgba(14,17,19,.9), 0 0 10px rgba(14,17,19,.75)`) so they stay legible over a lit plate face.

Borders are 1px solid; selection is a 2px outline with `outline-offset: -2px` so rows stay on the grid.

## Screens / views

### 1. Isometric map — landing view (desktop only)

**Purpose:** show the whole body of work at once, and let a visitor narrow it without losing the shape of it.

**Layout:** full viewport, `grid-template-rows: auto 1fr 44px 34px` — top bar, body, console bar, status bar.
Body is `grid-template-columns: 290px 1fr 270px` — log rail, map pane, selected panel.

**Top bar** (10px 24px, bottom border `rule`, mono 11px `.1em`, `muted`):
left `UTSMAN` in `ink` · `FULLSTACK · BANJARBARU` · a bordered amber chip `SKIP MAP → MODULE LIST`
(needs `white-space: nowrap`). Right: `VIEW ISO / FLAT` with the active word in amber · `8 MODULES · 4 SHOWN`
· `EN / id` with the active language in `ink`.

**Log rail** (`surface`, right border, 18px 16px, flex column, gap 14, `overflow: hidden; min-height: 0`):

- `LOG` label, then the last 10 log lines, mono 11.5px / line-height 1.95. Three line kinds:
  history `muted-deep`, command `body-soft`, result `amber`.
- `FILTERS · CLICK OR TYPE` and a wrapping row of chips, mono 11px, 4px 8px padding, 6px gap.
  Inactive `rule` border + `muted` text; active `amber` border + amber text and an appended `×`.
  Chips: `client:rsu-nirwana`, `client:bpn`, `year:2026`, `access:public`, `stack:soap`, `--rare`, `reset`.
- `MODULES IN VIEW` and the filtered module list. **This list must scroll** — `overflow-y: auto;
  min-height: 0; flex: 1 1 auto`, with the surrounding label and note at `flex: none`. Rows are
  `grid-template-columns: 1fr auto`, 7px 6px padding, top border `surface-plate`, 13px name truncated
  with ellipsis, access badge at the right. Selected row fills `surface-plate`; filtered-out rows drop
  to `opacity: .45`.
- Closing note in `muted-deep`: "Dimmed plates stay on the map. Nothing is ever hidden, only pushed back."

**Map pane** (`grid-template-rows: 1fr auto` — scene area, then axis legend band):

The scene is a fixed 900×620 authoring box that is **measured and scaled to fit**, not positioned by
hand. Compute `k = min((paneWidth - 170) / 900, (paneHeight - 30) / 620, 1)`, floor 0.4, and apply
`transform: translate(-50%, -50%) scale(k)` on the box, which also carries `perspective: 2400px`.
The 170px horizontal reserve is for labels that project outside the plate field. Re-measure on resize.
This scale-to-fit is the load-bearing part of the layout — a fixed offset breaks at 1440×800.

Inside, one `preserve-3d` layer with `transform: rotateX(56deg) rotateZ(<rotZ>deg)`.

Encoding — every axis carries real data:

| Channel | Meaning |
|---|---|
| depth (Y in scene) | year — 2024 back, 2025 middle, 2026 front |
| stack height | number of stack entries in that system (3 to 5 layers, 7px apart) |
| plate area | 165×115 if the module has a reading page, 100×74 if summary only |
| top-layer edge | amber `#C97B3F` if the module has a public URL |
| opacity .34 | filtered out — still present, pushed back |
| 2px `ink-bright` edge + 10px lift | selected |

Row Y positions 10 / 225 / 440. X accumulates per row: start at 40, advance by that plate's own width
+ 80 (do **not** multiply an index by a fixed stride — that was a bug; a small plate after two big ones
landed inside them).

Each row has a 700px rule at `left: 20`, `top: rowY + 40`, coloured `rule` for 2026 and `#232B30`
otherwise, with the year label at `left: 730` counter-rotated
(`rotateZ(-rotZ) rotateX(-56deg) translate(0,-7px)`), mono 11px, amber for 2026.

Plate labels are **centre-anchored on their own plate** — `left: 50%; top: 50%; transform:
translateZ(topZ + lift) rotateZ(-rotZ) rotateX(-56deg) translate(-50%, -50%)`, `text-align: center`,
`pointer-events: none`, plus the text-shadow above. Anchoring them to the plate's front edge makes
every label project into the row ahead; centre-anchoring makes that geometrically impossible.
Big plates: Bricolage 16px/700 (18px/800 when selected) plus a mono 10px meta line
(`5 PARTS · PUBLIC · GOOGLE VISION`). Small plates: 12.5px/600 name plus mono 9.5px meta.
Meta colour is amber when public, `ink` when selected, `muted` otherwise.

`DRAG TO ORBIT · 1:1` sits top-right of the scene area in `muted-deep`.

**Axis legend band** (own row, top border `rule-soft`, 10px 20px, flex with 26px gap, mono 10px
`muted-deep`) — three items: `DEPTH year · HEIGHT parts`, `AREA has page · EDGE public`,
`DIM filtered out, still present`. It must live outside the plate field; inside it, plate labels
render on top of it.

**Selected panel** (`surface`, left border, `grid-template-rows: 1fr auto; min-height: 0`):
a scrolling body (`overflow-y: auto; min-height: 0`, 18px 18px 6px, gap 12) and a pinned footer
(12px 18px 16px, top border) holding the primary action. Body: `SELECTED` in amber · module short name
in Bricolage 26px/800 · `CLIENT · YEAR` mono 10.5px · access badge · rule · one-sentence blurb 13.5px
in `body-soft` · `LAYERS` and the stack listed top-down as `5 MediaPipe` … `1 Laravel`, each with a
right-aligned note: `rare` in amber for once-used tech, otherwise the use count (`8×`) in `muted-deep`
· the screenshot note in a dashed box. Footer: `ENTER → OPEN PAGE` amber-bordered, or
`SUMMARY ONLY · NO PAGE` in `rule`/`muted-deep` with `cursor: default` for the four small modules.

**Console bar** (44px, `ground-deep`, top border): amber `$`, then a real borderless input at mono 13px
`ink` with placeholder `try: filter client:rsu-nirwana · open hris · stack:soap · help` in `muted-deep`,
then the hint `ENTER RUNS · ESC CLEARS FILTERS` at mono 10.5px.

**Status bar** (34px, `ground-deep`, mono 11px `.06em`): left `UTSMAN` + `BANJARBARU, KALIMANTAN SELATAN`;
right email in amber, phone, `GITHUB/UTSMANSEFF`, `CV.PDF`.

### 2. Flat module list (desktop)

Same chrome, body replaced by a scrolling table. Title `All eight modules` in Bricolage 32px/800,
intro in `body-soft` at 14.5px max 70ch, then a bordered table with
`grid-template-columns: 2fr 1.1fr 60px 90px 1.4fr 90px` — SYSTEM, CLIENT, YEAR, ACCESS, STACK, PARTS.
Header row `surface`, mono 10px `.12em` `muted`. Rows 11px 14px, bottom border `rule-soft`; selected row
fills `surface` with a 1px amber outline at `-1px` offset; filtered-out rows `opacity: .45`.
Footer note: "Click a row to select it. Four modules have a reading page; four are summary only."

This view is also what the map degrades to with no JS or under reduced motion.

### 3. Reading page (four modules)

Numbered sections in a two-column grid, `1fr 400px`, 44px 40px padding, 52px gap, max-width 1440.
Narrow viewports collapse it to a single flex column at 22px 20px with 26px gap.

Header strip: `← ALL MODULES` in amber, the path `/kerja/<slug>`, the language toggle.

Left column: `CLIENT · YEAR · SOLE DEVELOPER` mono 11px · title in Bricolage 44px/800 `-.035em`
max 20ch (28px when narrow) · access badge and, when public, the URL in amber · a 1px `ink` rule ·
then label/content pairs on `grid-template-columns: 110px 1fr` with 18px gap:

- `01 CONTEXT` — one paragraph, 16px / 1.7, max 60ch
- `02 BUILT` — four lines, each `grid-template-columns: 18px 1fr` with an amber `→`
- `03 HARD PART` — set apart: `surface` fill, 2px amber left border, 18px 20px padding
- `04 STACK` — chips, mono 12.5px, 4px 9px; once-used tech gets an amber border and appends its reason
  (`SOAP · BPJS bridging`, `MediaPipe · face verification`)

Footer: prev/next across the four page-having modules, mono 12px amber.

Right column (left border, 30px padding-left, gap 14): `SCREENSHOT` label with a status flag —
`REDACTION REQUIRED` amber for the public module, `EMPTY BY CHOICE` in `rule` otherwise — then a dashed
`#3A4348` slot at min-height 210px holding two centred lines, then `RECORD` as a mono key/value grid
(CLIENT, YEAR, ROLE, ACCESS, PARTS), then a bordered note: "This page is static. Nothing on it requires
JavaScript, and it can be shared as its own URL."

### 4. Mobile document (<1024px)

Paper layer. `min-height: 100vh`, flex column, 24px 20px 0.

Head: `UTSMAN · FULLSTACK` and the language toggle in mono 10.5px `muted` · 1px `ink` rule ·
title in Bricolage 28px/800 · intro 14px / 1.6 `ink-soft`.

Then a **dismissible one-line note** (border `rule-edge`, `paper-deep` fill, 9px 11px,
`grid-template-columns: 1fr auto` with a `×`): *"Open on desktop for the isometric map and console.
Everything is readable here too."* The second sentence matters — without it the note reads as an apology
for a broken mobile view, and the document is in fact complete on its own.

**Year spine:** `grid-template-columns: 52px 1fr`. Each year emits a header row — mono 12px/700
`rule-edge`, 12px 0 6px, top border `ink` — then one row per module of that year: left cell is just
`border-right: 1px rule`, right cell is `padding: 11px 0 11px 14px`, bottom border `rule-soft`,
`min-height: 44px`, `grid-template-columns: 1fr auto`. Name 14.5px/600; meta mono 10px showing
`client · N parts` plus the rare tech when present, in `amber-ink` if rare else `muted`; access badge
at the right. Years descend — 2026 first. Filtered-out rows drop to `opacity: .4`.

Contact block: mono key/value rows (EMAIL, WA, GITHUB, CV) on `grid-template-columns: 64px 1fr`,
12px 0, top borders `rule-soft`, email in `amber-ink`.

**Bottom bar** (56px, sticky, `ground`): `⌃ FILTER` in `ink`, the module count, `CONTACT` in amber.
Tapping FILTER raises the **filter sheet** (sticky, `ground`, 14px 18px 18px, gap 12): a 40px×3px
`#3A4348` grab handle, `FILTER · 4 OF 8 SHOWN` with `RESET` in amber, then three labelled chip groups —
CLIENT, ACCESS, RARE STACK. Sheet chips are 11px 14px so every target clears 44px. Footer row:
`TAP TO CLOSE` / `APPLY`.

## Interactions & behaviour

**Motion contract, from the brief:**

- Finger- or pointer-driven motion is 1:1 with no easing — the map follows the cursor exactly while dragging.
- Self-moving transitions are `700ms cubic-bezier(.22, 1, .36, 1)` — plate dimming, plate lift, row opacity.
- Chip and border colour changes are 180ms.
- `prefers-reduced-motion: reduce` collapses every duration to 1ms.

**Orbit:** mousedown on the map pane captures `{startX, startRotZ}`; mousemove sets
`rotZ = startRotZ + dx * 0.22`; mouseup snaps to the nearest of `[-55, -40, -25]`. The camera is never
free and never moves on its own. Plate and year labels counter-rotate by `-rotZ` on every frame so text
stays upright.

**Console — the part that makes the two concepts one.** Every chip runs a command and writes the same
log lines a typed command would; typing and clicking are indistinguishable in the log. Commands:

```
ls | ls modules            8 systems · 2024–2026
open <slug|name fragment>  opens the reading page; summary-only modules refuse and say why
filter <key>:<value>       key ∈ client | year | access | stack — bare "client:bpn" also works
--rare | stack --rare      only modules using a once-used technology
reset                      clears all filters
view iso | view flat       switch map / table (also "iso", "flat", "map")
lang id | lang en          switch language
contact | cv               prints email and phone
help                       lists the above
```

Unknown input logs `unknown · try help`. Re-applying an active filter clears it (toggle).
The log keeps the last 10 lines.

**Keyboard:** `/` focuses the console from anywhere · `Esc` clears filters (and the input when focused)
· `Enter` in the input runs the command · `Enter` outside the input opens the selected module.

**Filtering never removes.** Non-matching plates drop to `opacity: .34` and non-matching rows to `.45`,
both over 700ms. The shape of the whole body of work stays visible while the visitor narrows it.

**Selecting vs opening are separate.** A click on a plate or row selects it and fills the right panel;
opening needs the pinned button, `Enter`, or an `open` command. Selecting a module that the current
filter excludes logs `outside the current filter`.

**Responsive:** a single `<1024px` breakpoint switches shell → document, per the client's call that
768–1023px follows the document. The map is never the only way to reach a module: the skip chip, the
flat list, the console, and the mobile spine all reach the same reading pages.

## State

| State | Shape | Notes |
|---|---|---|
| `lang` | `'en' \| 'id'` | drives every string, including prose |
| `view` | `'map' \| 'list' \| 'read'` | landing is `map` |
| `selected` | module slug | right panel + plate highlight; defaults to `hris` |
| `reading` | module slug or null | which reading page is open |
| `filters` | `{client, year, access, stack, rare}` | all null / false when clear |
| `rotZ` | number | scene rotation, snapped on release |
| `cmd` | string | console input |
| `log` | array of `{text, kind}` | kind ∈ history / command / result; last 10 |
| `narrow` | boolean | `innerWidth < 1024` |
| `paneW`, `paneH` | number | measured map pane, drives scale-to-fit |
| `noteDismissed` | boolean | mobile desktop-hint note |
| `sheetOpen` | boolean | mobile filter sheet |

No data fetching. All eight modules are static content — in Next.js they belong in MDX or a typed data
module, with the reading pages statically generated per slug so each has a real shareable URL
(`/kerja/<slug>`) and works without client JS.

## Content

Eight modules. `parts` is the stack length and drives plate height; `page: true` means it has a reading page.

| Slug | Name | Client | Year | Access | Stack | Page |
|---|---|---|---|---|---|---|
| `pendaftaran-ocr` | Pendaftaran Rumah Sakit Berbasis OCR | RSU Nirwana | 2025 | public (`rsunirwana.id`) | Laravel, Next.js, MySQL, REST API, **Google Vision** | yes |
| `bridging-idrg` | Bridging IDRG / INA-CBG | RSU Nirwana | 2025 | internal | Laravel, **SOAP**, MySQL, REST API | yes |
| `hris` | HRIS | RSU Nirwana | 2026 | internal | Laravel, Livewire, Alpine.js, MySQL, **MediaPipe** | yes |
| `psb-cbt` | Penerimaan Siswa Baru dengan Ujian CBT | MTs WaliSongo Banjarbaru | 2026 | no URL | Laravel, Livewire, MySQL, **Fonnte** | yes |
| `rme` | Rekam Medis Elektronik (RME) | RSU Nirwana | 2025 | internal | Laravel, Livewire, MySQL | no |
| `sigap` | Kepegawaian & Absensi Geolocation (SIGAP) | BPN | 2024 | no URL | Laravel, Livewire, MySQL | no |
| `aset` | Manajemen Aset & Inventaris | KPHL | 2024 | no URL | Laravel, Livewire, MySQL | no |
| `benih` | Aplikasi Sertifikasi Benih | Dinas Pertanian | 2024 | no URL | Laravel, Livewire, MySQL | no |

Bold entries are used once across all eight systems and are marked amber wherever the stack appears,
with the reason attached: Google Vision → OCR KTP · MediaPipe → face verification · SOAP → BPJS
bridging · Fonnte → WhatsApp notification. Use counts for the rest: Laravel 8, MySQL 8, Livewire 5,
REST API 2, Next.js 1, Alpine.js 1. Laravel and MySQL are labelled `baseline`, not celebrated.

**Access status is a designed element, not a footnote.** Three states, each with its own badge treatment:
`PUBLIC` (amber border + amber text) · `INTERNAL` (solid `rule` border, `muted`) · `NO URL` (dashed
border, `muted`). Long forms, used in panels and reading pages: `PUBLIC — LIVE URL`,
`INTERNAL — DEMO ON REQUEST`, `NO LIVE DEPLOYMENT`.

HRIS covers employees, attendance, and leave. **It has no payroll** — do not add one.

All strings exist in both EN and ID, including the four context paragraphs and four hard-part
paragraphs. Indonesian runs 15–25% longer than English: chips wrap rather than truncate, rail rows
truncate with an ellipsis but always keep their badge. The prototype's `T` object and the `MODULES`
array are the copy source of truth — lift the strings from there rather than retyping them.

## Assets

None bundled. Fonts are Google Fonts — Bricolage Grotesque, Inter, JetBrains Mono. No icons, no
illustrations, no emoji: every graphic element is a rule, a border, or an isometric plate built from
divs. The two screenshot slots are intentional placeholders awaiting redacted captures from Utsman.

## Files

- `Porto Utsman Prototype.dc.html` — the interactive prototype. Primary reference.
- `Porto Utsman.dc.html` — earlier artboard sheet; turn 1 artboard `1h` is the token board, turn 2 holds
  the rejected alternatives, turn 3 the concept that became the prototype.
