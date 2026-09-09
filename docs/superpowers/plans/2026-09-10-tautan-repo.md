# Tautan Repo per Project — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Memberi lima sistem tautan ke repo GitHub-nya, sesudah kelima repo itu punya README-nya sendiri.

**Architecture:** Satu medan data baru (`repo`) di `src/lib/data/projects.js` yang dibaca tiga tempat tampilan — halaman baca, panel kanan cangkang, dan baris dokumen HP. Tidak ada kunci filter baru, tidak ada komponen baru. Lima berkas README ditulis lebih dulu di `docs/readme-repo/` dan ditempelkan Utsman ke repo tujuan; tanpa itu tautannya mendarat di README bawaan Laravel, yang persis kegagalan yang syarat ketiga di `docs/PROGRESS.md` jaga.

**Tech Stack:** Next.js (App Router), React 19, Tailwind v4, Vitest + Testing Library + happy-dom.

**Spec:** `docs/superpowers/specs/2026-09-10-tautan-repo-design.md`

**Urutan sengaja:** README (Task 1–5) sebelum tautan (Task 6–9). Task 10 verifikasi di browser sungguhan dan pembaruan `docs/PROGRESS.md`.

**Bahasa commit:** Indonesia, Conventional Commits, seperti riwayat yang sudah ada di branch ini.

---

## Task 1: README HRIS-Nirwana

**Files:**
- Create: `docs/readme-repo/HRIS-Nirwana.md`

Teks diangkat utuh dari entri `hris-nirwana` di `src/lib/data/projects.js:119-166`. Tidak ada kalimat baru selain baris catatan kode klien di kaki tiap bahasa.

**Larangan yang berlaku di berkas ini:** HRIS RSU Nirwana **tidak punya payroll atau modul keuangan**; kata gaji, payroll, dan penggajian tidak boleh muncul sama sekali di berkas ini. (SIGAP di Task 2 justru sebaliknya — jangan tertukar.)

- [ ] **Step 1: Buat direktori dan tulis berkasnya**

```markdown
# Sistem Kepegawaian Rumah Sakit

RSU Nirwana · 2026 · Pengembang tunggal

Sebelumnya absensi menggunakan mesin absen, pengajuan cuti dilakukan melalui surat, dan data pegawai disimpan di Excel. Aplikasi ini menyatukan ketiganya. Absensinya menggunakan lokasi dan deteksi wajah, serta terhubung dengan jadwal shift setiap pegawai.

## Yang dibangun

- Absensi dengan deteksi wajah dan lokasi yang terikat pada shift pegawai
- Pengajuan cuti dan izin
- Pengelolaan jadwal dan shift
- Data sumber daya manusia dan struktur organisasi
- Pencatatan inventaris
- Ticketing internal
- Notifikasi dan pengingat masa berlaku SIP/STR
- Pencatatan surat peringatan dan tindakan disiplin
- Berjalan sebagai PWA yang dapat dipasang di ponsel pegawai

## Stack

Laravel, Livewire, Alpine.js, MySQL, TensorFlow.js

> Sistem ini dikerjakan untuk RSU Nirwana. Repositori ini dibuka sebagai contoh kerja, bukan sebagai produk yang didukung atau yang menerima kontribusi.

---

# Hospital HR System

RSU Nirwana · 2026 · Sole developer

Attendance previously ran on a punch clock, leave was requested on paper, and staff data was kept in Excel. This application brings the three together. Its attendance uses location and face detection, and is tied to each employee's shift.

## What was built

- Attendance with face detection and location, tied to the employee's shift
- Leave and permission requests
- Schedule and shift management
- Staff records and organisational structure
- Inventory records
- Internal ticketing
- Notifications and SIP/STR expiry reminders
- Warning letters and disciplinary records
- Runs as a PWA, installable on staff phones

## Stack

Laravel, Livewire, Alpine.js, MySQL, TensorFlow.js

> This system was built for RSU Nirwana. The repository is open as a work sample, not as a supported product or one open to contributions.
```

- [ ] **Step 2: Periksa larangan payroll dan kata "saya"**

Run:
```bash
grep -niE "payroll|penggajian|gaji|\bsaya\b" docs/readme-repo/HRIS-Nirwana.md
```
Expected: tidak ada keluaran (exit 1). Kalau ada satu baris pun, teksnya salah.

- [ ] **Step 3: Commit**

```bash
git add docs/readme-repo/HRIS-Nirwana.md
git commit -m "docs(readme-repo): README HRIS, menggantikan teks bawaan Laravel"
```

---

## Task 2: README Sistem-Informasi-Kepegawaian (SIGAP)

**Files:**
- Create: `docs/readme-repo/Sistem-Informasi-Kepegawaian.md`

Teks dari entri `sigap-bpn` di `src/lib/data/projects.js:217-262`.

**Ini repo yang memang menyebut penggajian.** SIGAP mencatat dan menghitung penggajian bulanan dari absensi, lembur dan cuti, tetapi **tidak menjalankan pembayaran**, dan kalimat konteksnya menyebut batas itu sendiri. Jangan menghapus kata "penggajian" dari berkas ini karena membaca larangan HRIS sekilas — keduanya sistem berbeda milik klien berbeda.

- [ ] **Step 1: Tulis berkasnya**

```markdown
# Kepegawaian dan Absensi Berbasis Lokasi

BPN · 2024 · Pengembang tunggal

Pengelolaan kepegawaian dengan absensi yang terikat pada lokasi kerja, sehingga kehadiran tercatat sesuai tempat pegawai bertugas. Data absensi, lembur, dan cuti digunakan sebagai dasar perhitungan gaji bulanan. Aplikasi ini mencatat dan menghitung komponennya, tetapi tidak menjalankan pembayaran.

## Yang dibangun

- Absensi yang terikat pada titik lokasi kerja
- Pengelolaan data sumber daya manusia
- Pengajuan lembur
- Pengajuan cuti
- Pencatatan penggajian bulanan yang dihitung dari absensi, lembur, dan cuti

## Stack

Laravel, Filament, Livewire, MySQL, Tailwind CSS

> Sistem ini dikerjakan untuk BPN. Repositori ini dibuka sebagai contoh kerja, bukan sebagai produk yang didukung atau yang menerima kontribusi.

---

# Staffing and Location-Based Attendance

BPN · 2024 · Sole developer

Staff management with attendance tied to the work site, so presence is recorded against where the employee actually works. Attendance, overtime, and leave data are the basis for the monthly pay calculation. The application records and calculates the components, but does not carry out payment.

## What was built

- Attendance tied to the work site location
- Human resource records
- Overtime requests
- Leave requests
- Monthly pay records calculated from attendance, overtime, and leave

## Stack

Laravel, Filament, Livewire, MySQL, Tailwind CSS

> This system was built for BPN. The repository is open as a work sample, not as a supported product or one open to contributions.
```

- [ ] **Step 2: Periksa bahwa batas pembayaran ikut tertulis**

Run:
```bash
grep -c "tidak menjalankan pembayaran" docs/readme-repo/Sistem-Informasi-Kepegawaian.md
grep -c "does not carry out payment" docs/readme-repo/Sistem-Informasi-Kepegawaian.md
```
Expected: `1` dan `1`.

- [ ] **Step 3: Commit**

```bash
git add docs/readme-repo/Sistem-Informasi-Kepegawaian.md
git commit -m "docs(readme-repo): README SIGAP, dengan batas pembayarannya"
```

---

## Task 3: README Sistem-Informasi-Manajemen-Aset (SIMASET)

**Files:**
- Create: `docs/readme-repo/Sistem-Informasi-Manajemen-Aset.md`

Teks dari entri `simaset` di `src/lib/data/projects.js:264-304`.

- [ ] **Step 1: Tulis berkasnya**

```markdown
# Manajemen Aset dan Inventaris

UPT-KPHL · 2025 · Pengembang tunggal

Pengelolaan aset milik UPT-KPHL Kapuas Kahayan, mencakup pencatatan lokasi dan kondisi setiap aset, penjadwalan perawatan, serta pelaporan. Setiap aset memiliki kode QR yang dapat dicetak dan ditempel pada unitnya, dan pemindaian kode tersebut membuka rincian aset yang bersangkutan.

## Yang dibangun

- Pencatatan aset beserta lokasi dan kondisinya
- Kode QR per unit aset, dapat dicetak dan ditempel
- Pemindaian kode QR yang langsung membuka rincian aset
- Penjadwalan perawatan aset
- Perhitungan nilai depresiasi secara otomatis
- Pelaporan aset

## Stack

Laravel, JavaScript, MySQL

> Sistem ini dikerjakan untuk UPT-KPHL Kapuas Kahayan. Repositori ini dibuka sebagai contoh kerja, bukan sebagai produk yang didukung atau yang menerima kontribusi.

---

# Asset and Inventory Management

UPT-KPHL · 2025 · Sole developer

Asset management for UPT-KPHL Kapuas Kahayan, covering location and condition records for each asset, maintenance scheduling, and reporting. Every asset has a QR code that can be printed and attached to the unit, and scanning that code opens the details of the asset concerned.

## What was built

- Asset records with location and condition
- A QR code per asset unit, ready to print and attach
- QR scanning that opens the asset's details directly
- Maintenance scheduling
- Automatic depreciation calculation
- Asset reporting

## Stack

Laravel, JavaScript, MySQL

> This system was built for UPT-KPHL Kapuas Kahayan. The repository is open as a work sample, not as a supported product or one open to contributions.
```

- [ ] **Step 2: Commit**

```bash
git add docs/readme-repo/Sistem-Informasi-Manajemen-Aset.md
git commit -m "docs(readme-repo): README SIMASET"
```

---

## Task 4: README Aplikasi-Monitoring-Sertifikasi-Benih (SIBENIH)

**Files:**
- Create: `docs/readme-repo/Aplikasi-Monitoring-Sertifikasi-Benih.md`

Teks dari entri `sibenih` di `src/lib/data/projects.js:306-329`.

**Beda bentuk dari tiga README sebelumnya, dan ini disengaja:** `sibenih` tier `brief`, jadi `built` di data **kosong** (`{ id: [], en: [] }`). Berkas ini karena itu **tidak punya bagian "Yang dibangun"**. Jangan mengarang butir untuk mengisinya — yang tidak ada di `projects.js` tidak ada. Sebagai gantinya, baris `blurb` berdiri sebagai kalimat pembuka di bawah judul, lalu `context` sebagai paragrafnya.

- [ ] **Step 1: Tulis berkasnya**

```markdown
# Aplikasi Sertifikasi Benih

BPSBTPH · 2024 · Pengembang tunggal

Sertifikasi benih tanaman, mulai dari pengajuan hingga penerbitan sertifikat digital.

Pendaftaran dan pemantauan sertifikasi benih tanaman pada Balai Pengawasan dan Sertifikasi Benih Tanaman Pangan dan Hortikultura (BPSBTPH) Kalimantan Selatan, mulai dari pengajuan hingga penerbitan sertifikat digital.

## Stack

Laravel, Filament, Livewire, MySQL

> Sistem ini dikerjakan untuk BPSBTPH Kalimantan Selatan. Repositori ini dibuka sebagai contoh kerja, bukan sebagai produk yang didukung atau yang menerima kontribusi.

---

# Seed Certification System

BPSBTPH · 2024 · Sole developer

Plant seed certification, from application through to a digital certificate.

Registration and monitoring for plant seed certification at the South Kalimantan Seed Supervision and Certification Agency for Food Crops and Horticulture (BPSBTPH), from application through to a digital certificate.

## Stack

Laravel, Filament, Livewire, MySQL

> This system was built for BPSBTPH South Kalimantan. The repository is open as a work sample, not as a supported product or one open to contributions.
```

- [ ] **Step 2: Commit**

```bash
git add docs/readme-repo/Aplikasi-Monitoring-Sertifikasi-Benih.md
git commit -m "docs(readme-repo): README SIBENIH"
```

---

## Task 5: README Sistem-Informasi-Manajemen-BanSos (SIMBAS)

**Files:**
- Create: `docs/readme-repo/Sistem-Informasi-Manajemen-BanSos.md`

Teks dari entri `simbas` di `src/lib/data/projects.js:331-352`. Seperti Task 4, `built` kosong, jadi **tidak ada bagian "Yang dibangun"**; `blurb` jadi kalimat pembuka, `context` jadi paragrafnya.

- [ ] **Step 1: Tulis berkasnya**

```markdown
# Manajemen Bantuan Sosial

Kecamatan Basarang · 2025 · Pengembang tunggal

Pengelolaan bantuan sosial kecamatan, mulai dari pendataan penerima hingga pelaporan penyaluran.

Pengelolaan bantuan sosial di Kecamatan Basarang, mencakup pendataan penerima, pengajuan, penyaluran, hingga pelaporan.

## Stack

Laravel, JavaScript, MySQL

> Sistem ini dikerjakan untuk Kecamatan Basarang. Repositori ini dibuka sebagai contoh kerja, bukan sebagai produk yang didukung atau yang menerima kontribusi.

---

# Social Assistance Management

Kecamatan Basarang · 2025 · Sole developer

Social assistance management for a subdistrict, from recipient records through to distribution reporting.

Social assistance management in Basarang subdistrict, covering recipient records, applications, distribution, and reporting.

## Stack

Laravel, JavaScript, MySQL

> This system was built for Kecamatan Basarang. The repository is open as a work sample, not as a supported product or one open to contributions.
```

- [ ] **Step 2: Periksa kelima berkas sekaligus — tidak ada kata "saya", tidak ada angka dampak**

Run:
```bash
grep -rniE "\bsaya\b|[0-9]+\s*%|pengguna aktif" docs/readme-repo/
```
Expected: tidak ada keluaran (exit 1).

- [ ] **Step 3: Commit**

```bash
git add docs/readme-repo/Sistem-Informasi-Manajemen-BanSos.md
git commit -m "docs(readme-repo): README SIMBAS, lima berkas lengkap"
```

---

## Task 6: Medan `repo` di data

**Files:**
- Modify: `src/lib/data/projects.js` (komentar kepala berkas, dan sembilan entri)
- Test: `src/lib/data/__tests__/projects.test.js`

- [ ] **Step 1: Tulis test yang gagal**

Tambahkan di dalam `describe('projects dataset', …)` di `src/lib/data/__tests__/projects.test.js`:

```js
  it('carries a repo field on every project, null where there is none', () => {
    for (const p of projects) {
      expect(p).toHaveProperty('repo');
      expect(p.repo === null || typeof p.repo === 'string').toBe(true);
    }
  });

  it('links exactly the five repos that are allowed to be public', () => {
    const withRepo = projects.filter((p) => p.repo).map((p) => p.slug).sort();
    expect(withRepo).toEqual(
      ['hris-nirwana', 'sibenih', 'sigap-bpn', 'simaset', 'simbas'].sort(),
    );
  });

  it('points every repo URL at the owner account, so a typo cannot land elsewhere', () => {
    for (const p of projects) {
      if (p.repo) expect(p.repo).toMatch(/^https:\/\/github\.com\/Utsmanseff\/[\w.-]+$/);
    }
  });
```

- [ ] **Step 2: Jalankan, pastikan gagal**

Run: `npx vitest run src/lib/data/__tests__/projects.test.js`
Expected: FAIL — tiga test merah, yang pertama `expected object to have property "repo"`.

- [ ] **Step 3: Tambahkan medannya**

Di komentar kepala `src/lib/data/projects.js`, di bawah blok keterangan `access`, tambahkan:

```js
// repo   URL penuh repo GitHub yang boleh dibuka publik, atau null.
//        URL penuh dan bukan nama yang disambung ke meta.github: `site` sudah
//        URL penuh, dan menyambung sendiri patah begitu ada repo di organisasi.
//        Lima repo yang boleh: lihat docs/superpowers/specs/2026-09-10-tautan-repo-design.md
```

Lalu tambahkan satu baris `repo:` tepat di bawah baris `site:` di **kesembilan** entri:

| Slug | Baris yang ditambahkan |
|---|---|
| `rsu-nirwana-web` | `repo: null,` |
| `idrg-bridging` | `repo: null,` |
| `hris-nirwana` | `repo: 'https://github.com/Utsmanseff/HRIS-Nirwana',` |
| `rme` | `repo: null,` |
| `sigap-bpn` | `repo: 'https://github.com/Utsmanseff/Sistem-Informasi-Kepegawaian',` |
| `simaset` | `repo: 'https://github.com/Utsmanseff/Sistem-Informasi-Manajemen-Aset',` |
| `sibenih` | `repo: 'https://github.com/Utsmanseff/Aplikasi-Monitoring-Sertifikasi-Benih',` |
| `simbas` | `repo: 'https://github.com/Utsmanseff/Sistem-Informasi-Manajemen-BanSos',` |
| `psb-walisongo` | `repo: null,` |

- [ ] **Step 4: Jalankan, pastikan hijau — dan hitung entrinya**

Run: `npx vitest run src/lib/data/__tests__/projects.test.js`
Expected: PASS, seluruh berkas hijau.

Run: `grep -c "  repo:" src/lib/data/projects.js`
Expected: `9`. Kalau `8`, ada entri yang terlewat; kalau `10`, ada yang tertulis dua kali.

- [ ] **Step 5: Commit**

```bash
git add src/lib/data/projects.js src/lib/data/__tests__/projects.test.js
git commit -m "feat(data): medan repo, lima yang boleh dibuka"
```

---

## Task 7: Tautan kode di halaman baca

**Files:**
- Modify: `src/components/work/ProjectView.jsx` (blok `COPY` dan blok kaki di sekitar baris 83)
- Test: `src/components/work/__tests__/ProjectView.test.jsx`

- [ ] **Step 1: Tulis test yang gagal**

Tambahkan di `src/components/work/__tests__/ProjectView.test.jsx`, di dalam `describe('ProjectView', …)`:

```js
  it('shows the code button for a project with a repo', () => {
    const withRepo = { ...project, repo: 'https://github.com/Utsmanseff/HRIS-Nirwana' };
    render(<ProjectView project={withRepo} prev={null} next={null} />);
    const link = screen.getByRole('link', { name: /Lihat kode/ });
    expect(link).toHaveAttribute('href', 'https://github.com/Utsmanseff/HRIS-Nirwana');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link.getAttribute('rel')).toContain('noopener');
  });

  it('shows no code button when there is no repo', () => {
    render(<ProjectView project={{ ...project, repo: null }} prev={null} next={null} />);
    expect(screen.queryByRole('link', { name: /Lihat kode/ })).toBeNull();
  });

  it('stands both outward links side by side when a project has each', () => {
    const both = { ...project, repo: 'https://github.com/Utsmanseff/HRIS-Nirwana' };
    render(<ProjectView project={both} prev={null} next={null} />);
    expect(screen.getByRole('link', { name: /Coba langsung/ })).toBeTruthy();
    expect(screen.getByRole('link', { name: /Lihat kode/ })).toBeTruthy();
  });
```

- [ ] **Step 2: Jalankan, pastikan gagal**

Run: `npx vitest run src/components/work/__tests__/ProjectView.test.jsx`
Expected: FAIL — dua test merah dengan `Unable to find an accessible element with the role "link" and name /Lihat kode/`. Test "shows no code button" sudah hijau sebelum implementasi; itu wajar, ia menjaga sisi kosongnya.

- [ ] **Step 3: Implementasi**

Di `src/components/work/ProjectView.jsx`, tambahkan satu baris ke `COPY`:

```js
  code: { id: 'Lihat kode ↗', en: 'View code ↗' },
```

Ganti blok kaki (`{project.access === 'public' && project.site && (…)}`) dengan:

```jsx
        {/* 6 — foot. Dua tujuan keluar, satu bahasa. Tidak ada sistem yang
            punya keduanya sekarang, tapi bentuknya tidak perlu tahu itu. */}
        <div className="flex flex-wrap gap-3 mt-12">
          {project.access === 'public' && project.site && (
            <a
              href={project.site}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-mono text-xs border border-amber text-amber px-4 py-2 hover:bg-amber hover:text-ground transition-colors duration-500"
            >
              {COPY.visit[locale]}
            </a>
          )}
          {project.repo && (
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-mono text-xs border border-amber text-amber px-4 py-2 hover:bg-amber hover:text-ground transition-colors duration-500"
            >
              {COPY.code[locale]}
            </a>
          )}
        </div>
```

Perhatikan `mt-12` pindah dari tombol ke pembungkusnya, dan tombol situs kehilangan `mt-12`-nya sendiri.

- [ ] **Step 4: Jalankan, pastikan hijau**

Run: `npx vitest run src/components/work/__tests__/ProjectView.test.jsx`
Expected: PASS, seluruh berkas hijau termasuk test lama `shows the live button for a public project`.

- [ ] **Step 5: Commit**

```bash
git add src/components/work/ProjectView.jsx src/components/work/__tests__/ProjectView.test.jsx
git commit -m "feat(work): tautan kode di kaki halaman baca"
```

---

## Task 8: Empat keadaan kaki panel kanan

**Files:**
- Modify: `src/components/shell/SelectedPanel.jsx` (blok `COPY` dan blok kaki di ujung berkas)
- Test: `src/components/shell/__tests__/SelectedPanel.test.jsx`

Tabel keadaannya:

| tier | repo | kaki |
|---|---|---|
| `full` | `null` | `ENTER → BUKA HALAMAN` saja |
| `full` | ada | `ENTER → BUKA HALAMAN`, lalu baris kedua `Lihat kode ↗` yang **redam** (`border-rule text-muted`) |
| `brief` | ada | `Lihat kode ↗` **amber penuh**, menggantikan `RINGKASAN SAJA · TANPA HALAMAN` |
| `brief` | `null` | `RINGKASAN SAJA · TANPA HALAMAN` saja |

- [ ] **Step 1: Tulis test yang gagal**

Tambahkan di `src/components/shell/__tests__/SelectedPanel.test.jsx`, di dalam `describe('SelectedPanel', …)`:

```js
  const brief = { ...system, slug: 'simbas', tier: 'brief', shortName: { id: 'SIMBAS', en: 'SIMBAS' } };
  const REPO = 'https://github.com/Utsmanseff/Sistem-Informasi-Manajemen-BanSos';

  it('keeps a full-tier system without a repo exactly as it was', () => {
    renderPanel({ system: { ...system, repo: null } });
    expect(screen.getByRole('link', { name: /BUKA HALAMAN/ })).toBeTruthy();
    expect(screen.queryByRole('link', { name: /Lihat kode/ })).toBeNull();
  });

  it('gives a full-tier system with a repo a second, quieter row', () => {
    renderPanel({ system: { ...system, repo: 'https://github.com/Utsmanseff/HRIS-Nirwana' } });
    expect(screen.getByRole('link', { name: /BUKA HALAMAN/ })).toBeTruthy();
    const code = screen.getByRole('link', { name: /Lihat kode/ });
    expect(code).toHaveAttribute('href', 'https://github.com/Utsmanseff/HRIS-Nirwana');
    // Dua kotak amber bertumpuk membuat keduanya berhenti berarti apa-apa.
    expect(code.className).toContain('border-rule');
    expect(code.className).not.toContain('border-amber');
  });

  it('lets the repo replace the dead label on a brief-tier system', () => {
    renderPanel({ system: { ...brief, repo: REPO } });
    const code = screen.getByRole('link', { name: /Lihat kode/ });
    expect(code).toHaveAttribute('href', REPO);
    // Label mati di atas tautan hidup itu janji palsu yang kedua.
    expect(screen.queryByText(/RINGKASAN SAJA/)).toBeNull();
    // Ia satu-satunya jalan keluar dari panel ini, jadi ia amber penuh.
    expect(code.className).toContain('border-amber');
  });

  it('still says there is no page when a brief-tier system has no repo', () => {
    renderPanel({ system: { ...brief, repo: null } });
    expect(screen.getByText(/RINGKASAN SAJA/)).toBeTruthy();
    expect(screen.queryByRole('link', { name: /Lihat kode/ })).toBeNull();
  });

  it('sends the code link straight out, never through the door', () => {
    const onOpen = vi.fn();
    renderPanel({ system: { ...brief, repo: REPO }, onOpen });
    const code = screen.getByRole('link', { name: /Lihat kode/ });
    fireEvent.click(code, { button: 0 });
    expect(onOpen).not.toHaveBeenCalled();
    expect(code).toHaveAttribute('target', '_blank');
  });
```

- [ ] **Step 2: Jalankan, pastikan gagal**

Run: `npx vitest run src/components/shell/__tests__/SelectedPanel.test.jsx`
Expected: FAIL — tiga test merah mencari tautan `/Lihat kode/` yang belum ada.

- [ ] **Step 3: Implementasi**

Di `src/components/shell/SelectedPanel.jsx`, tambahkan ke `COPY`:

```js
  code: { id: 'Lihat kode ↗', en: 'View code ↗' },
```

Ganti isi `<div className="border-t border-rule px-[18px] py-3">` dengan:

```jsx
      <div className="border-t border-rule px-[18px] py-3">
        {system.tier === 'full' ? (
          <Link
            href={`/kerja/${system.slug}`}
            onClick={(e) => {
              // Klik tengah, ctrl-klik dan "buka di tab baru" harus tetap
              // bekerja, jadi yang dicegat hanya klik kiri polos. href-nya
              // sengaja tetap asli supaya tautannya bisa disalin.
              if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
              e.preventDefault();
              onOpen(system.slug);
            }}
            className="block text-center font-mono text-[11px] border border-amber text-amber py-2"
          >
            {COPY.open[locale]}
          </Link>
        ) : null}

        {/* Tier brief yang punya repo: tautan ini MENGGANTIKAN label mati.
            Label yang bilang "tidak ada" sementara ada itu janji palsu,
            sekerabat dengan pegangan tarik FilterSheet yang sudah dibuang. */}
        {system.tier !== 'full' && !system.repo && (
          <span className="block text-center font-mono text-[11px] border border-rule text-muted-deep py-2 cursor-default">
            {COPY.noPage[locale]}
          </span>
        )}

        {system.repo && (
          <a
            href={system.repo}
            target="_blank"
            rel="noopener noreferrer"
            className={`block text-center font-mono text-[11px] py-2 ${
              system.tier === 'full'
                ? 'border border-rule text-muted mt-2'
                : 'border border-amber text-amber'
            }`}
          >
            {COPY.code[locale]}
          </a>
        )}
      </div>
```

Tautannya `<a>` biasa, bukan `Link` dan bukan `onOpen`: ia keluar dari situs, jadi ia tidak menyetel `data-nav` dan tidak ikut morf `sistem-aktif`.

- [ ] **Step 4: Jalankan, pastikan hijau**

Run: `npx vitest run src/components/shell/__tests__/SelectedPanel.test.jsx`
Expected: PASS, seluruh berkas hijau termasuk test lama soal `sistem-aktif` dan ctrl-klik.

- [ ] **Step 5: Commit**

```bash
git add src/components/shell/SelectedPanel.jsx src/components/shell/__tests__/SelectedPanel.test.jsx
git commit -m "feat(shell): repo menggantikan label mati di kaki panel"
```

---

## Task 9: `KODE ↗` di baris dokumen HP

**Files:**
- Modify: `src/components/document/YearGroup.jsx`
- Create: `src/components/document/__tests__/YearGroup.test.jsx`

**Jebakan yang harus diselesaikan task ini:** baris tier `full` sekarang dibungkus seluruhnya oleh `<Link href={/kerja/${s.slug}}>`. Menaruh tautan repo di dalam badan itu menghasilkan `<a>` bersarang — HTML tidak sah, dan hidrasi Next menatanya ulang diam-diam tanpa error. Susunan barisnya karena itu berubah: `<Link>` membungkus **badan saja**, dan tautan repo berdiri **bersaudara** di sebelahnya.

- [ ] **Step 1: Tulis test yang gagal**

Buat `src/components/document/__tests__/YearGroup.test.jsx`:

```jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import YearGroup from '@/components/document/YearGroup';

const base = {
  slug: 'hris-nirwana', client: 'RSU Nirwana', year: '2026',
  tier: 'full', access: 'internal', repo: null,
  shortName: { id: 'HRIS', en: 'HRIS' },
};

const renderGroup = (systems) =>
  render(<YearGroup year="2026" systems={systems} locale="id" dimmed={new Set()} />);

describe('YearGroup', () => {
  it('never nests one link inside another', () => {
    // <a> di dalam <a> itu HTML tidak sah, dan hidrasi Next menatanya ulang
    // diam-diam tanpa error. Yang diperiksa DOM-nya, bukan className-nya.
    const { container } = renderGroup([
      { ...base, repo: 'https://github.com/Utsmanseff/HRIS-Nirwana' },
    ]);
    for (const a of container.querySelectorAll('a')) {
      expect(a.parentElement.closest('a')).toBeNull();
    }
  });

  it('gives a full-tier row with a repo two sibling links', () => {
    const { container } = renderGroup([
      { ...base, repo: 'https://github.com/Utsmanseff/HRIS-Nirwana' },
    ]);
    expect(container.querySelectorAll('a')).toHaveLength(2);
    expect(screen.getByRole('link', { name: /HRIS/ })).toHaveAttribute('href', '/kerja/hris-nirwana');
    expect(screen.getByRole('link', { name: /KODE/ })).toHaveAttribute(
      'href',
      'https://github.com/Utsmanseff/HRIS-Nirwana',
    );
  });

  it('leaves a row without a repo at one link', () => {
    const { container } = renderGroup([base]);
    expect(container.querySelectorAll('a')).toHaveLength(1);
    expect(screen.queryByRole('link', { name: /KODE/ })).toBeNull();
  });

  it('gives a brief-tier row its repo link even though it has no page', () => {
    const brief = {
      ...base, slug: 'simbas', tier: 'brief', access: 'none',
      shortName: { id: 'SIMBAS', en: 'SIMBAS' },
      repo: 'https://github.com/Utsmanseff/Sistem-Informasi-Manajemen-BanSos',
    };
    const { container } = renderGroup([brief]);
    expect(container.querySelectorAll('a')).toHaveLength(1);
    expect(screen.getByRole('link', { name: /KODE/ })).toBeTruthy();
  });

  it('paints the code link in the paper amber, not the dark one', () => {
    // #C97B3F is 2.8:1 on paper. The on-paper amber is #9C5A28 — text-amber-ink.
    renderGroup([{ ...base, repo: 'https://github.com/Utsmanseff/HRIS-Nirwana' }]);
    const code = screen.getByRole('link', { name: /KODE/ });
    expect(code.className).toContain('text-amber-ink');
    expect(code.className).not.toMatch(/(^|\s)text-amber(\s|$)/);
  });
});
```

- [ ] **Step 2: Jalankan, pastikan gagal**

Run: `npx vitest run src/components/document/__tests__/YearGroup.test.jsx`
Expected: FAIL — empat test merah; yang pertama `expected length to be 2, got 1`, sisanya tidak menemukan tautan `/KODE/`.

- [ ] **Step 3: Implementasi**

Ganti isi `systems.map(…)` di `src/components/document/YearGroup.jsx` dengan:

```jsx
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
            <AccessTick access={s.access} locale={locale} />
          </span>
        );

        return (
          <div key={s.slug} className="contents">
            <div className="border-r border-paper-rule" />
            {/* Tautan repo berdiri BERSAUDARA dengan tautan halaman baca, tidak
                di dalamnya: <a> di dalam <a> itu HTML tidak sah. min-w-0 karena
                1fr punya min-width auto, dan nama panjang akan menahan baris
                jadi menggulir ke samping. */}
            <div
              className="border-b border-paper-rule-soft py-[11px] pl-3.5 min-h-11 transition-opacity duration-700 flex items-center gap-3"
              style={{ opacity: dim ? 0.4 : 1 }}
            >
              <div className="flex-1 min-w-0">
                {s.tier === 'full' ? (
                  <Link href={`/kerja/${s.slug}`} className="block" aria-label={s.shortName[locale]}>
                    {body}
                  </Link>
                ) : body}
              </div>
              {s.repo && (
                <a
                  href={s.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 font-mono text-[9px] uppercase tracking-wide text-amber-ink px-2 py-3 -my-1"
                >
                  KODE ↗
                </a>
              )}
            </div>
          </div>
        );
      })}
```

`px-2 py-3 -my-1` adalah tebakan awal untuk target sentuh; angka sesungguhnya ditetapkan di Task 10 sesudah diukur di browser.

- [ ] **Step 4: Jalankan, pastikan hijau**

Run: `npx vitest run src/components/document/`
Expected: PASS, `YearGroup.test.jsx` dan `SystemsDocument.test.jsx` sama-sama hijau.

- [ ] **Step 5: Jalankan seluruh test dan lint**

Run: `npx vitest run`
Expected: PASS, seluruh berkas hijau. Jumlahnya naik dari 262 ke sekitar 279 (data 3, ProjectView 3, SelectedPanel 5, YearGroup 5). Angka pastinya dicatat di Task 10; yang penting tidak ada yang merah.

Run: `npx eslint src --max-warnings=0`
Expected: tidak ada keluaran.

- [ ] **Step 6: Commit**

```bash
git add src/components/document/YearGroup.jsx src/components/document/__tests__/YearGroup.test.jsx
git commit -m "feat(document): tautan kode di baris sistem, bersaudara bukan bersarang"
```

---

## Task 10: Verifikasi di browser sungguhan, lalu catat

**Files:**
- Modify: `src/components/document/YearGroup.jsx` (hanya kalau target sentuh kurang)
- Modify: `docs/PROGRESS.md`

Server dev Utsman sudah jalan di port 3000; pakai itu, jangan menjalankan yang baru. Panel diemulasi 1280×800, dan **klik berbasis koordinat tidak mendarat di ukuran itu** — seluruh interaksi lewat `javascript_tool` dan `element.click()`.

- [ ] **Step 1: Halaman baca, dua sisi**

`resize_window` ke 1280×800, `navigate` ke `http://localhost:3000/kerja/hris-nirwana`, lalu `javascript_tool`:

```js
const links = [...document.querySelectorAll('a')].filter(a => /Lihat kode/.test(a.textContent));
JSON.stringify({
  count: links.length,
  href: links[0]?.href,
  target: links[0]?.target,
  rel: links[0]?.rel,
});
```
Expected: `count: 1`, `href` `https://github.com/Utsmanseff/HRIS-Nirwana`, `target` `_blank`, `rel` memuat `noopener`.

Lalu `navigate` ke `http://localhost:3000/kerja/rme` dan jalankan skrip yang sama.
Expected: `count: 0`.

- [ ] **Step 2: Panel kanan, tier brief**

`navigate` ke `http://localhost:3000/sistem`, lalu `javascript_tool`:

```js
const plate = [...document.querySelectorAll('[data-testid="map-pane"] button')]
  .find(b => /SIMBAS/.test(b.textContent));
plate.click();
await new Promise(r => setTimeout(r, 600));
const panel = document.querySelector('aside');
const code = [...panel.querySelectorAll('a')].find(a => /Lihat kode/.test(a.textContent));
JSON.stringify({
  href: code?.href,
  amber: code ? getComputedStyle(code).borderTopColor : null,
  deadLabel: /RINGKASAN SAJA/.test(panel.textContent),
});
```
Expected: `href` `https://github.com/Utsmanseff/Sistem-Informasi-Manajemen-BanSos`, `amber` `rgb(201, 123, 63)` (`#C97B3F`), `deadLabel` `false`.

Kalau `plate` `undefined`, badge devtools Next mungkin menutupi — sembunyikan `nextjs-portal` lebih dulu, dan ingat `setTimeout` di-throttle di panel tersembunyi: lebihkan jedanya kalau pembacaan pertama kosong.

- [ ] **Step 3: Panel kanan, tier full**

Di halaman yang sama:

```js
const plate = [...document.querySelectorAll('[data-testid="map-pane"] button')]
  .find(b => /SIGAP/.test(b.textContent));
plate.click();
await new Promise(r => setTimeout(r, 600));
const panel = document.querySelector('aside');
const code = [...panel.querySelectorAll('a')].find(a => /Lihat kode/.test(a.textContent));
JSON.stringify({
  open: /BUKA HALAMAN/.test(panel.textContent),
  href: code?.href,
  border: code ? getComputedStyle(code).borderTopColor : null,
});
```
Expected: `open` `true`, `href` `https://github.com/Utsmanseff/Sistem-Informasi-Kepegawaian`, `border` `rgb(46, 53, 57)` (`--color-rule` `#2E3539`) — **bukan** amber.

- [ ] **Step 4: Dokumen HP — bersaudara, bukan bersarang, dan target sentuhnya**

`resize_window` ke lebar 375 (preset `mobile` menggantungkan klik, tetapi langkah ini tidak mengklik apa pun — kalau preset bermasalah, pakai lebar kustom 375×812 tanpa emulasi sentuh). `navigate` ke `http://localhost:3000/`, lalu:

```js
const code = [...document.querySelectorAll('a')].find(a => /KODE/.test(a.textContent));
const r = code.getBoundingClientRect();
JSON.stringify({
  nested: code.parentElement.closest('a') !== null,
  color: getComputedStyle(code).color,
  w: Math.round(r.width),
  h: Math.round(r.height),
  href: code.href,
});
```
Expected: `nested` `false`, `color` `rgb(156, 90, 40)` (`#9C5A28`), `href` benar.

**Kalau `h` kurang dari 44:** naikkan `py-3` di tautan itu sampai `h` mencapai 44, ukur ulang, lalu commit penyetelannya sendiri:

```bash
git add src/components/document/YearGroup.jsx
git commit -m "fix(document): target sentuh tautan kode yang benar-benar 44px"
```

happy-dom tidak menata letak apa pun, jadi angka ini hanya ada di sini — chip filter 38px pernah lolos seluruh test lalu gagal di tangan.

- [ ] **Step 5: Tanpa JavaScript**

Run:
```bash
curl -s http://localhost:3000/ | grep -c "github.com/Utsmanseff/HRIS-Nirwana"
curl -s http://localhost:3000/kerja/hris-nirwana | grep -c "github.com/Utsmanseff/HRIS-Nirwana"
```
Expected: keduanya `1` atau lebih. Server merender `PaperFallback`, jadi tautan repo harus sudah ada di HTML pertama.

- [ ] **Step 6: Bangun**

`npm run build` dijalankan **Utsman**, bukan agen — begitu pula `Remove-Item -Recurse -Force .next` kalau cache Turbopack menyajikan token basi. Minta, lalu tunggu hasilnya.
Expected: sukses, `/` dan `/sistem` tetap `○ Static`.

- [ ] **Step 7: Catat di PROGRESS.md**

Perbarui `docs/PROGRESS.md`:
- Baris **Posisi sekarang**: tambahkan `2026-09-10-tautan-repo.md` **selesai, Task 1–10**.
- Tabel **Di mana isinya**: tambahkan baris rencana, spec, dan `docs/readme-repo/`.
- Jumlah test: ganti dari 262 ke angka sungguhan dari `npx vitest run`, dengan rinciannya.
- **Antrean berikutnya:** tandai nomor 1 selesai; nomor 2 (screenshot) naik jadi nomor 1.
- Tambah satu butir ke **Keputusan yang mahal kalau dilupakan**: tautan repo `<a>` bersaudara di `YearGroup`, bukan di dalam `<Link>`, karena `<a>` bersarang tidak sah dan gagal diam-diam.
- Tambah satu butir: kaki `SelectedPanel` punya empat keadaan, dan tier `brief` ber-repo **menggantikan** `noPage` — bukan menumpuk di atasnya.
- Catat bahwa **kelima README masih harus ditempel Utsman ke repo tujuan**, dan sampai itu terjadi tautannya mendarat di README bawaan Laravel. Ini penghalang deploy, bukan penghalang merge.

- [ ] **Step 8: Commit**

```bash
git add docs/PROGRESS.md
git commit -m "docs: tautan repo selesai, dan apa yang masih menunggu tangan Utsman"
```

---

## Sesudah rencana ini

Tautan sudah ada di kode, tetapi **belum berguna sampai Utsman menempelkan lima README** dari `docs/readme-repo/` ke repo tujuannya masing-masing. Sampai itu terjadi, tiap tautan mendarat di "About Laravel · Laravel Sponsors · Premium Partners".

Antrean berikutnya sesudah ini: screenshot `hris.png` dan `psb.png`, lalu merge ke `main` dan deploy.
