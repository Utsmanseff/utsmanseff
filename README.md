# 💫 About Me:
Fullstack Web Developer based in Banjarbaru, South Kalimantan. I mostly work at RSU Nirwana Banjarbaru, where I build and maintain web-based systems that support daily hospital operations — from clinical workflows to government compliance integrations. I enjoy solving problems that actually matter to the people using the software, especially when the constraints are tight and the stakes are real. Currently expanding into TypeScript, Go, and Flutter. Open to collaborating on meaningful web projects.


## 🌐 Socials:
[![Instagram](https://img.shields.io/badge/Instagram-%23E4405F.svg?logo=Instagram&logoColor=white)](https://instagram.com/utsmnseff) [![Mastodon](https://img.shields.io/badge/-MASTODON-%232B90D9?logo=mastodon&logoColor=white)](https://mastodon.social/@Utsman) [![email](https://img.shields.io/badge/Email-D14836?logo=gmail&logoColor=white)](mailto:seffutsmannnn@gmail.com) 

# 💻 Tech Stack:
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white) ![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white) ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) ![PHP](https://img.shields.io/badge/php-%23777BB4.svg?style=for-the-badge&logo=php&logoColor=white) ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![Cloudflare](https://img.shields.io/badge/Cloudflare-F38020?style=for-the-badge&logo=Cloudflare&logoColor=white) ![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white) ![Alpine.js](https://img.shields.io/badge/alpinejs-white.svg?style=for-the-badge&logo=alpinedotjs&logoColor=%238BC0D0) ![Bootstrap](https://img.shields.io/badge/bootstrap-%238511FA.svg?style=for-the-badge&logo=bootstrap&logoColor=white) ![Chart.js](https://img.shields.io/badge/chart.js-F5788D.svg?style=for-the-badge&logo=chart.js&logoColor=white) ![Filament](https://img.shields.io/badge/Filament-FFAA00?style=for-the-badge&logoColor=%23000000) ![jQuery](https://img.shields.io/badge/jquery-%230769AD.svg?style=for-the-badge&logo=jquery&logoColor=white) ![Laravel](https://img.shields.io/badge/laravel-%23FF2D20.svg?style=for-the-badge&logo=laravel&logoColor=white) ![Livewire](https://img.shields.io/badge/livewire-%234e56a6.svg?style=for-the-badge&logo=livewire&logoColor=white) ![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white) ![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white) ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white) ![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white) ![Apache](https://img.shields.io/badge/apache-%23D42029.svg?style=for-the-badge&logo=apache&logoColor=white) ![Nginx](https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white) ![MariaDB](https://img.shields.io/badge/MariaDB-003545?style=for-the-badge&logo=mariadb&logoColor=white) ![MySQL](https://img.shields.io/badge/mysql-4479A1.svg?style=for-the-badge&logo=mysql&logoColor=white) ![SQLite](https://img.shields.io/badge/sqlite-%2307405e.svg?style=for-the-badge&logo=sqlite&logoColor=white) ![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white) ![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)
# 📊 GitHub Stats:
![](https://github-readme-stats.shion.dev/api?username=utsmanseff&theme=nightowl&hide_border=false&include_all_commits=true&count_private=true)<br/>
![](https://streak-stats.demolab.com/?user=utsmanseff&theme=nightowl&hide_border=false)<br/>
![](https://github-readme-stats.shion.dev/api/top-langs/?username=utsmanseff&theme=nightowl&hide_border=false&include_all_commits=true&count_private=true&layout=compact)

---
[![](https://komarev.com/ghpvc/?username=utsmanseff&icon=0&color=0)](https://visitcount.itsvg.in)

<!-- Proudly created with GPRM ( https://gprm.itsvg.in ) -->

---

# 🗂️ This repository — the portfolio itself

This repo is not only the profile card above. It is also the source of
**<https://utsmanseff.vercel.app>** — a portfolio written for engineers rather
than for HR, about hospital and public-sector systems in South Kalimantan.

**Next.js 16** (App Router, Turbopack, static prerender) · **React 19** ·
**Tailwind CSS 4** (`@theme` tokens) · **Vitest + Testing Library + happy-dom**
— **284 tests across 33 files**, written test-first.

```bash
npm install
npm run dev                       # http://localhost:3000
npx vitest run                    # 284 tests
npx eslint src --max-warnings=0   # lint (src only; .claude/** is excluded)
npm run build
```

## Two shapes over one dataset

The same nine systems are served in two different shapes, chosen at runtime —
never two sets of content.

| Route | Width | Shape |
|-------|-------|-------|
| `/` | ≥1024px, JS alive | **Gate** — name, role, stack, two buttons naming their destination |
| `/sistem` | ≥1024px, JS alive | **Shell** — isometric map of plates + a command console |
| `/sistem?tampilan=datar` | same | Shell, landing on the flat table |
| `/` and `/sistem` | anything else, JS included | **Paper document** — identity band, year spine, filter sheet |
| `/kerja/[slug]` | every width | Reading page, statically generated for each `tier: 'full'` project |
| `/kontak` | every width | Contact details, availability, CV |

The server always renders the paper document. The gate or the shell replaces it
after mount, and only when both conditions hold — width and JavaScript. Without
JavaScript both URLs stay whole: all nine systems and every reading-page link
are in the server HTML.

The URL is what remembers: `/` is the gate, `/sistem` the shell,
`?tampilan=datar` the flat table, `?pilih=<slug>&sudut=<deg>` the way home from
a reading page. That is what makes the browser back button work.

## Where the content lives

| What | Where |
|------|-------|
| Every project — copy, stack, access, repo, screenshot size | `src/lib/data/projects.js` |
| Contact, socials, canonical `siteUrl`, CV path | `src/lib/data/meta.js` |
| Pure filters (DOM-free) | `src/lib/shell/filters.js` |
| Console command table | `src/lib/shell/commands.js` |
| Plate geometry and scale | `src/lib/shell/layout.js` |
| Map camera — drag, wheel | `src/lib/shell/useMapCamera.js` |
| UI strings, both locales | `src/lib/i18n/{id,en}.js` |
| Colour tokens | `src/app/globals.css` → `@theme` |
| READMEs ready to paste into the client repos | `docs/readme-repo/` |
| Specs, plans, and the running state | `docs/superpowers/`, `docs/PROGRESS.md` |

`meta.siteUrl` is the single source of truth for the canonical URL —
`metadataBase`, the JSON-LD and the OG card all read it. Do not hardcode a
domain anywhere else.

## Colour

Two grounds, one accent that exists twice.

| Token | Value | Use |
|-------|-------|-----|
| `--color-ground` | `#161A1D` | Dark ground: gate, shell, reading page |
| `--color-ink` | `#E8E0D0` | Text on dark |
| `--color-muted` | `#7A8580` | Secondary text on dark (4.58:1) |
| `--color-rule` | `#2E3539` | Borders on dark |
| `--color-paper` | `#F2EDE3` | Paper ground: the phone document |
| `--color-paper-ink` | `#1A1A1A` | Text on paper |
| `--color-amber` | `#C97B3F` | Accent **on dark only** — 5.33:1 there |
| `--color-amber-ink` | `#9C5A28` | Accent **on paper** — plain amber is 2.8:1 there and fails AA |

There is no light/dark toggle. Both grounds are deliberate, and they mean
different things.

## Motion contract

Split deliberately. Anything the finger drags tracks the pointer 1:1 with no
easing — the map camera stops exactly where it is released, and never returns
on its own. Anything that moves by itself fades over 700ms
`cubic-bezier(.22, 1, .36, 1)`; colour is 180ms. `prefers-reduced-motion` cuts
those to 1ms, and it does **not** withhold the shell: a visitor asking for less
motion should not be handed less interface.

## No unsourced claims

Impact numbers were dropped rather than invented — no percentages, no user
counts. Evidence is the screenshot, the live URL and the repository link;
access status is stated plainly instead of implied. HRIS RSU Nirwana has no
payroll or finance module, and nothing in this repo may describe one.

## Contracts the tests enforce

`src/lib/i18n/__tests__/dictionary.test.js` requires both locales to share the
same top-level keys. `src/lib/data/__tests__/projects.test.js` reads the header
of every screenshot file and refuses image dimensions that drift from the file
on disk. Several tests exist only to keep decisions from being quietly undone —
they are documented where they sit.

## Resuming across machines

State lives in `docs/PROGRESS.md`, committed. A new session reads it to find
what is finished, what is outstanding, and the decisions that are expensive to
forget.
