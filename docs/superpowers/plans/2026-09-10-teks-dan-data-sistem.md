# Teks Legenda, Catatan Rail, dan Data Sembilan Sistem — Rencana Implementasi

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membetulkan teks cangkang yang salah dan kurang, memperbaiki data
sembilan sistem (tahun, nama, klien, stack, satu project baru, dua naik tier),
menulis ulang seluruh prosa halaman baca dengan bahasa baku, dan membuat garis
tahun di peta mengikuti panjang barisnya sendiri.

**Architecture:** Data tetap satu sumber di `src/lib/data/projects.js`; seluruh
route, sitemap dan `generateStaticParams` sudah menurunkan dirinya dari sana,
jadi dua halaman baca baru muncul tanpa route baru ditulis. Teks tampil tetap
tinggal di konstanta `COPY` masing-masing komponen. Satu-satunya perubahan
geometri adalah `layout.js` mulai mengekspor ujung tiap baris, dan `MapScene`
berhenti memakai lebar mati.

**Tech Stack:** Next.js App Router, React, Tailwind, Vitest + Testing Library,
ESLint.

**Spec:** `docs/superpowers/specs/2026-09-09-teks-dan-data-sistem-design.md` —
seluruh prosa dua bahasa ada di sana dan diulang di rencana ini.

**Baseline sebelum mulai:** `npx vitest run` memberi **223 test hijau, 29
berkas**. Angka ini yang dibandingkan di tiap task.

**Catatan lingkungan:** dev server milik Utsman sudah jalan di port 3000 dan
memegang `.next`. Jangan menjalankan `npm run build` sendiri — minta Utsman.
Verifikasi browser dilakukan pada emulasi 1280x800 lewat `javascript_tool`
dengan `element.click()`, bukan screenshot dan bukan klik berbasis koordinat.

---

### Task 1: Struktur data — tahun, slug, klien, stack, dan SIMBAS

Yang berubah di task ini hanya **kerangka** sembilan sistem. Tier, judul,
konteks dan butir `built` belum disentuh; itu Task 2 dan Task 3.

SOAP keluar dari IDRG di task ini, dan itu menjatuhkan chip filter yang
bergantung padanya, jadi chip dan contoh konsolnya ikut di sini. Kalau
dipisah, suite berhenti hijau di antara dua task.

**Files:**
- Modify: `src/lib/data/projects.js`
- Modify: `src/components/shell/LogRail.jsx:22`
- Modify: `src/components/shell/Console.jsx:8-9`
- Test: `src/lib/data/__tests__/projects.test.js`
- Test: `src/components/shell/__tests__/Gate.test.jsx:32`

- [ ] **Step 1: Tulis test yang gagal**

Tambahkan di akhir `describe('projects dataset', ...)` pada
`src/lib/data/__tests__/projects.test.js`:

```js
  it('places every system in the year it was actually built', () => {
    const byYear = {};
    for (const p of projects) (byYear[p.year] ??= []).push(p.slug);
    expect(byYear['2024'].sort()).toEqual(['sibenih', 'sigap-bpn']);
    expect(byYear['2025'].sort()).toEqual(['idrg-bridging', 'rme', 'simaset', 'simbas']);
    expect(byYear['2026'].sort()).toEqual(['hris-nirwana', 'psb-walisongo', 'rsu-nirwana-web']);
  });

  it('carries the acronym slugs, not the old descriptive ones', () => {
    const slugs = projects.map((p) => p.slug);
    expect(slugs).toContain('simaset');
    expect(slugs).toContain('sibenih');
    expect(slugs).toContain('simbas');
    expect(slugs).not.toContain('aset-kphl');
    expect(slugs).not.toContain('sertifikasi-benih');
  });

  it('keeps the five reading-page slugs untouched', () => {
    // Larangan yang tertulis di PROGRESS.md: URL ini sudah ada di luar sana.
    const slugs = projects.map((p) => p.slug);
    for (const s of ['rsu-nirwana-web', 'idrg-bridging', 'hris-nirwana', 'rme', 'psb-walisongo']) {
      expect(slugs, s).toContain(s);
    }
  });

  it('no longer claims SOAP anywhere in the stack', () => {
    // Utsman memastikan IDRG tidak memakainya. "Pencatatan SOAP" di built RME
    // adalah singkatan rekam medis dan tidak ada hubungannya — jangan ikut
    // dibuang.
    for (const p of projects) {
      expect(p.tech, p.slug).not.toContain('SOAP');
    }
  });

  it('gives the two agencies their own client keys', () => {
    expect(bySlug('simaset').client).toBe('UPT-KPHL');
    expect(bySlug('simaset').clientKey).toBe('upt-kphl');
    expect(bySlug('sibenih').client).toBe('BPSBTPH');
    expect(bySlug('sibenih').clientKey).toBe('bpsbtph');
    expect(bySlug('simbas').client).toBe('Kecamatan Basarang');
    expect(bySlug('simbas').clientKey).toBe('kecamatan-basarang');
  });

  it('names the systems the way Utsman names them', () => {
    expect(bySlug('simaset').shortName.id).toBe('SIMASET');
    expect(bySlug('sibenih').shortName.id).toBe('SIBENIH');
    expect(bySlug('simbas').shortName.id).toBe('SIMBAS');
    expect(bySlug('rsu-nirwana-web').shortName.id).toBe('Web & Pendaftaran');
    expect(bySlug('psb-walisongo').shortName.id).toBe('PSB & CBT');
  });
```

Dan di `src/components/shell/__tests__/Gate.test.jsx`, ganti baris 32
(`expect(stack).toContain('SOAP');`) menjadi:

```js
    expect(stack).toContain('Livewire');
    expect(stack).toContain('Filament');
```

- [ ] **Step 2: Jalankan test dan pastikan gagal**

Run: `npx vitest run src/lib/data/__tests__/projects.test.js src/components/shell/__tests__/Gate.test.jsx`

Expected: FAIL. `byYear['2024']` masih berisi `aset-kphl`; slug `simaset` tidak
ada; `Filament` tidak ada di daftar stack gerbang.

- [ ] **Step 3: Ubah `src/lib/data/projects.js`**

Ubah entri satu per satu. Hanya field di bawah ini yang disentuh; `title`,
`context`, `built`, `role` dan `tier` dibiarkan apa adanya sampai Task 2 dan 3.

`rsu-nirwana-web`:
```js
    year: '2026',
    tech: ['Laravel', 'Next.js', 'MySQL', 'Google Vision', 'REST API'],
    shortName: { id: 'Web & Pendaftaran', en: 'Site & Registration' },
```

`idrg-bridging`:
```js
    tech: ['Laravel', 'JavaScript', 'MySQL', 'REST API'],
```

`rme`:
```js
    tech: ['Laravel', 'JavaScript', 'MySQL', 'Livewire'],
```

`sigap-bpn`:
```js
    tech: ['Laravel', 'Filament', 'Livewire', 'MySQL', 'Tailwind CSS'],
```

`aset-kphl` menjadi:
```js
    slug: 'simaset',
    client: 'UPT-KPHL',
    clientKey: 'upt-kphl',
    year: '2025',
    tech: ['Laravel', 'JavaScript', 'MySQL'],
    shortName: { id: 'SIMASET', en: 'SIMASET' },
```

`sertifikasi-benih` menjadi:
```js
    slug: 'sibenih',
    client: 'BPSBTPH',
    clientKey: 'bpsbtph',
    tech: ['Laravel', 'Filament', 'Livewire', 'MySQL'],
    shortName: { id: 'SIBENIH', en: 'SIBENIH' },
```

`psb-walisongo`:
```js
    shortName: { id: 'PSB & CBT', en: 'Admissions & CBT' },
```

Tambahkan entri baru `simbas` setelah `sibenih`, tetap tier ringkasan:
```js
  {
    slug: 'simbas',
    client: 'Kecamatan Basarang',
    clientKey: 'kecamatan-basarang',
    year: '2025',
    role: { id: 'Pengembang tunggal', en: 'Sole developer' },
    tier: 'brief',
    access: 'none',
    site: null,
    image: null,
    tech: ['Laravel', 'JavaScript', 'MySQL'],
    shortName: { id: 'SIMBAS', en: 'SIMBAS' },
    blurb: {
      id: 'Pengelolaan bantuan sosial kecamatan, mulai dari pendataan penerima hingga pelaporan penyaluran.',
      en: 'Social assistance management for a subdistrict, from recipient records through to distribution reporting.',
    },
    title: { id: 'Manajemen Bantuan Sosial', en: 'Social Assistance Management' },
    context: {
      id: 'Pengelolaan bantuan sosial di Kecamatan Basarang, mencakup pendataan penerima, pengajuan, penyaluran, hingga pelaporan.',
      en: 'Social assistance management in Basarang subdistrict, covering recipient records, applications, distribution, and reporting.',
    },
    built: { id: [], en: [] },
  },
```

- [ ] **Step 4: Ganti chip yang jatuh bersama SOAP**

`src/components/shell/LogRail.jsx:22`, ganti baris chip:

```js
  { key: 'stack', value: 'livewire' },
```

`src/components/shell/Console.jsx:8-9`:

```js
    id: 'coba: filter client:rsu-nirwana · open hris · stack:livewire · help',
    en: 'try: filter client:rsu-nirwana · open hris · stack:livewire · help',
```

- [ ] **Step 5: Jalankan seluruh suite**

Run: `npx vitest run`
Expected: PASS, 29 berkas. Jumlah test naik dari 223 ke **229** (enam test baru
di `projects.test.js`; perubahan di `Gate.test.jsx` menambah assertion, bukan
test).

- [ ] **Step 6: Lint**

Run: `npx eslint src --max-warnings=0`
Expected: tanpa keluaran.

- [ ] **Step 7: Verifikasi chip di browser sungguhan**

Buka `http://localhost:3000/sistem` pada emulasi 1280x800, lalu lewat
`javascript_tool`:

```js
const chip = [...document.querySelectorAll('button')].find((b) => b.textContent.trim() === 'stack:livewire');
chip.click();
await new Promise((r) => setTimeout(r, 200));
[...document.querySelectorAll('li')].filter((li) => li.style.opacity === '1').length;
```

Expected: `4` — HRIS, RME, SIGAP, SIBENIH. Bukan `0`.

- [ ] **Step 8: Commit**

```bash
git add src/lib/data/projects.js src/components/shell/LogRail.jsx src/components/shell/Console.jsx src/lib/data/__tests__/projects.test.js src/components/shell/__tests__/Gate.test.jsx
git commit -m "feat(data): letak tahun, nama, dan stack yang sebenarnya

SIMBAS masuk. Aset KPHL jadi SIMASET dan pindah ke 2025, Sertifikasi Benih
jadi SIBENIH, web RSU pindah ke 2026. SOAP keluar dari IDRG karena tidak
dipakai, dan chip filter yang berdiri di atasnya pindah ke Livewire supaya
tidak menyaring sampai kosong.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 2: SIGAP dan SIMASET naik jadi halaman baca

Keduanya naik dari `brief` ke `full`. `generateStaticParams`, sitemap dan
`siblings()` semuanya menurunkan dirinya dari `fullProjects`, jadi tidak ada
route baru yang perlu ditulis — tetapi `built` keduanya masih kosong, dan
`projects.test.js` sudah menuntut tier `full` punya isi. Karena itu kenaikan
tier dan prosanya harus satu commit.

Satu test lama akan patah dan memang harus: `SystemsDocument.test.jsx`
menegaskan SIGAP **bukan** tautan, karena dulu ia ringkasan.

**Files:**
- Modify: `src/lib/data/projects.js`
- Modify: `src/components/document/__tests__/SystemsDocument.test.jsx:30-32`
- Test: `src/lib/data/__tests__/projects.test.js`

- [ ] **Step 1: Tulis test yang gagal**

Tambahkan di `src/lib/data/__tests__/projects.test.js`:

```js
  it('gives SIGAP and SIMASET the reading pages their content earns', () => {
    expect(bySlug('sigap-bpn').tier).toBe('full');
    expect(bySlug('simaset').tier).toBe('full');
    expect(fullProjects).toHaveLength(7);
  });

  it('keeps the summary-only pair summary-only', () => {
    expect(bySlug('sibenih').tier).toBe('brief');
    expect(bySlug('simbas').tier).toBe('brief');
    expect(bySlug('sibenih').built.id).toHaveLength(0);
    expect(bySlug('simbas').built.id).toHaveLength(0);
  });

  it('says plainly that SIGAP does not pay anyone', () => {
    // SIGAP mencatat dan menghitung penggajian bulanan, tetapi tidak
    // menjalankan pembayaran. Batas itu harus ada di kalimatnya sendiri,
    // bukan cuma di kepala penulisnya. Larangan payroll di PROGRESS.md
    // berlaku untuk HRIS RSU Nirwana, bukan untuk sistem ini.
    expect(bySlug('sigap-bpn').context.id).toMatch(/tidak menjalankan pembayaran/);
    expect(bySlug('sigap-bpn').context.en).toMatch(/does not carry out payment/);
  });
```

- [ ] **Step 2: Jalankan test dan pastikan gagal**

Run: `npx vitest run src/lib/data/__tests__/projects.test.js`
Expected: FAIL — `tier` masih `brief`, `fullProjects` masih 5.

- [ ] **Step 3: Naikkan tier dan tulis prosanya**

Pada entri `sigap-bpn` di `src/lib/data/projects.js`:

```js
    tier: 'full',
    blurb: {
      id: 'Kepegawaian dengan absensi berbasis lokasi dan perhitungan gaji bulanan yang bersumber dari absensi, lembur, dan cuti.',
      en: 'Staff management with location-based attendance and a monthly pay calculation drawn from attendance, overtime, and leave.',
    },
    title: {
      id: 'Kepegawaian dan Absensi Berbasis Lokasi',
      en: 'Staffing and Location-Based Attendance',
    },
    context: {
      id: 'Pengelolaan kepegawaian dengan absensi yang terikat pada lokasi kerja, sehingga kehadiran tercatat sesuai tempat pegawai bertugas. Data absensi, lembur, dan cuti digunakan sebagai dasar perhitungan gaji bulanan. Aplikasi ini mencatat dan menghitung komponennya, tetapi tidak menjalankan pembayaran.',
      en: 'Staff management with attendance tied to the work site, so presence is recorded against where the employee actually works. Attendance, overtime, and leave data are the basis for the monthly pay calculation. The application records and calculates the components, but does not carry out payment.',
    },
    built: {
      id: [
        'Absensi yang terikat pada titik lokasi kerja',
        'Pengelolaan data sumber daya manusia',
        'Pengajuan lembur',
        'Pengajuan cuti',
        'Pencatatan penggajian bulanan yang dihitung dari absensi, lembur, dan cuti',
      ],
      en: [
        'Attendance tied to the work site location',
        'Human resource records',
        'Overtime requests',
        'Leave requests',
        'Monthly pay records calculated from attendance, overtime, and leave',
      ],
    },
```

Pada entri `simaset`:

```js
    tier: 'full',
    blurb: {
      id: 'Pengelolaan aset dengan kode QR per unit, pelacakan lokasi dan kondisi, jadwal perawatan, serta perhitungan depresiasi.',
      en: 'Asset management with a QR code per unit, location and condition tracking, maintenance scheduling, and depreciation calculation.',
    },
    title: { id: 'Manajemen Aset dan Inventaris', en: 'Asset and Inventory Management' },
    context: {
      id: 'Pengelolaan aset milik UPT-KPHL Kapuas Kahayan, mencakup pencatatan lokasi dan kondisi setiap aset, penjadwalan perawatan, serta pelaporan. Setiap aset memiliki kode QR yang dapat dicetak dan ditempel pada unitnya, dan pemindaian kode tersebut membuka rincian aset yang bersangkutan.',
      en: "Asset management for UPT-KPHL Kapuas Kahayan, covering location and condition records for each asset, maintenance scheduling, and reporting. Every asset has a QR code that can be printed and attached to the unit, and scanning that code opens the details of the asset concerned.",
    },
    built: {
      id: [
        'Pencatatan aset beserta lokasi dan kondisinya',
        'Kode QR per unit aset, dapat dicetak dan ditempel',
        'Pemindaian kode QR yang langsung membuka rincian aset',
        'Penjadwalan perawatan aset',
        'Perhitungan nilai depresiasi secara otomatis',
        'Pelaporan aset',
      ],
      en: [
        'Asset records with location and condition',
        'A QR code per asset unit, ready to print and attach',
        "QR scanning that opens the asset's details directly",
        'Maintenance scheduling',
        'Automatic depreciation calculation',
        'Asset reporting',
      ],
    },
```

- [ ] **Step 4: Betulkan test dokumen yang memang harus berubah**

`src/components/document/__tests__/SystemsDocument.test.jsx`, ganti isi
`it('links only the systems that have a reading page', ...)` menjadi:

```js
  it('links only the systems that have a reading page', () => {
    renderDoc();
    expect(screen.getByRole('link', { name: /HRIS/ })).toHaveAttribute('href', '/kerja/hris-nirwana');
    expect(screen.getByRole('link', { name: /SIGAP/ })).toHaveAttribute('href', '/kerja/sigap-bpn');
    // SIBENIH tetap ringkasan: namanya ada, tautannya tidak.
    expect(screen.queryByRole('link', { name: /SIBENIH/ })).toBeNull();
    expect(screen.getByText('SIBENIH')).toBeInTheDocument();
  });
```

- [ ] **Step 5: Jalankan seluruh suite**

Run: `npx vitest run`
Expected: PASS. Jumlah test naik dari 229 ke **232**.

- [ ] **Step 6: Verifikasi dua halaman baru di browser sungguhan**

```js
const r = await Promise.all(['/kerja/sigap-bpn', '/kerja/simaset'].map((u) => fetch(u).then((x) => x.status)));
r;
```

Expected: `[200, 200]`.

- [ ] **Step 7: Commit**

```bash
git add src/lib/data/projects.js src/lib/data/__tests__/projects.test.js src/components/document/__tests__/SystemsDocument.test.jsx
git commit -m "feat(data): beri SIGAP dan SIMASET halamannya sendiri

Keduanya punya isi setingkat IDRG dan RME, tetapi tier ringkasan cuma
menyediakan satu baris blurb untuk menampungnya. Naik ke full, dan built
keduanya terisi. Route, sitemap dan siblings mengikuti sendiri dari
fullProjects.

Kalimat SIGAP menyebut batasnya sendiri: mencatat dan menghitung penggajian
bulanan, tidak menjalankan pembayaran.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 3: Prosa baku untuk tujuh entri sisanya

Yang tersisa: `rsu-nirwana-web` ditulis ulang seluruhnya, `idrg-bridging`
dibetulkan isinya, dan `hris-nirwana`, `rme`, `sibenih`, `simbas`,
`psb-walisongo` dibakukan bahasanya.

**Files:**
- Modify: `src/lib/data/projects.js`
- Test: `src/lib/data/__tests__/projects.test.js`

- [ ] **Step 1: Tulis test yang gagal**

```js
  it('never speaks in the first person', () => {
    // Aturan Utsman: prosa halaman baca berbahasa baku dan tanpa kata "saya".
    for (const p of projects) {
      expect(p.context.id, p.slug).not.toMatch(/\bsaya\b/i);
      for (const line of p.built.id) expect(line, p.slug).not.toMatch(/\bsaya\b/i);
    }
  });

  it('never names the SIMRS the hospital happens to run', () => {
    // Boleh disebut open source, tidak boleh disebut namanya.
    for (const p of projects) {
      expect(p.context.id, p.slug).not.toMatch(/khanza/i);
      expect(p.context.en, p.slug).not.toMatch(/khanza/i);
    }
    expect(bySlug('rme').context.id).toMatch(/SIMRS open source/);
  });

  it('tells the whole hospital site, not only the OCR step', () => {
    const web = bySlug('rsu-nirwana-web');
    expect(web.title.id).toBe('Web Rumah Sakit dan Pendaftaran Pasien Baru');
    expect(web.built.id.some((l) => /Dokter Kami/.test(l))).toBe(true);
    expect(web.built.id.some((l) => /tombol sinkronkan/.test(l))).toBe(true);
  });

  it('seats SatuSehat where it actually sits', () => {
    // Pengirimannya bukan dari sistem ini, tetapi datanya berasal dari coding
    // di sini, dan pengirimannya otomatis lewat service tersendiri.
    const idrg = bySlug('idrg-bridging');
    expect(idrg.context.id).toMatch(/dikirim otomatis ke SatuSehat melalui service tersendiri/);
    expect(idrg.built.id.some((l) => /SatuSehat/.test(l))).toBe(true);
    expect(idrg.built.id.some((l) => /grouping IDRG/.test(l))).toBe(true);
  });

  it('keeps SOAP where it means a medical note, not a protocol', () => {
    expect(bySlug('rme').built.id.some((l) => /Pencatatan SOAP/.test(l))).toBe(true);
  });
```

- [ ] **Step 2: Jalankan test dan pastikan gagal**

Run: `npx vitest run src/lib/data/__tests__/projects.test.js`
Expected: FAIL — konteks IDRG masih memakai "saya", konteks RME masih menyebut
Khanza, judul web masih `Pendaftaran Rumah Sakit Berbasis OCR`.

- [ ] **Step 3: Tulis ulang `rsu-nirwana-web`**

```js
    blurb: {
      id: 'Web rumah sakit beserta pendaftaran pasien baru yang datanya diisi dari hasil pembacaan foto KTP.',
      en: "A hospital website together with new patient registration, filled in from a scan of the patient's ID card.",
    },
    title: {
      id: 'Web Rumah Sakit dan Pendaftaran Pasien Baru',
      en: 'Hospital Website and New Patient Registration',
    },
    context: {
      id: 'Web rumah sakit sebelumnya bersifat statis dan modulnya belum lengkap, karena sebagian besar isinya ditulis langsung di dalam kode. Pendaftaran online yang ada juga belum membedakan pasien baru dan pasien lama, sehingga keduanya harus mengisi data diri dari awal pada setiap pendaftaran, dan data tersebut belum terhubung ke SIMRS. Web ini dibangun untuk menggantikannya. Halaman publiknya dapat diperbarui tanpa mengubah kode, pendaftarannya membedakan pasien baru dan pasien lama, data pasien baru diisi dari hasil pembacaan foto KTP, dan data pendaftaran dikirim ke registrasi SIMRS melalui API.',
      en: "The hospital's previous website was static and its modules were incomplete, because most of its content was written directly into the code. The online registration did not distinguish between new and returning patients, so both had to enter their personal details from scratch on every registration, and that data never reached the SIMRS. This site was built to replace it. Its public pages can be updated without changing code, registration separates new patients from returning ones, new patient data is filled in from a scan of the ID card, and registration data is sent to the SIMRS registration records through an API.",
    },
    built: {
      id: [
        'Beranda, Tentang Kami, dan Dokter Kami sebagai halaman perkenalan',
        'Klinik Spesialis, Layanan Unggulan, dan Layanan',
        'Informasi, tempat artikel dan pengumuman rumah sakit',
        'Pendaftaran yang membedakan pasien baru dan pasien lama',
        'Pendaftaran pasien baru dalam tiga langkah: identitas, data pasien, pendaftaran',
        'Pembacaan nama, NIK, dan alamat dari foto KTP melalui Google Cloud Vision',
        'Isian manual sebagai alternatif apabila foto KTP tidak terbaca',
        'Data pendaftaran ditampung di web, kemudian dikirim ke registrasi SIMRS melalui API lewat tombol sinkronkan',
        'Bukti pendaftaran untuk verifikasi di loket',
        'Validasi sisi server pada seluruh formulir',
      ],
      en: [
        'Home, About Us, and Our Doctors as introductory pages',
        'Specialist Clinics, Featured Services, and Services',
        'Information, holding hospital articles and announcements',
        'Registration that distinguishes new patients from returning ones',
        'New patient registration in three steps: identity, patient data, registration',
        'Name, NIK, and address read from a photo of the ID card through Google Cloud Vision',
        'Manual entry as an alternative when the ID card photo cannot be read',
        'Registration data held in the site, then sent to the SIMRS registration records through an API from a sync button',
        'A registration slip for verification at the counter',
        'Server-side validation across the whole form',
      ],
    },
```

- [ ] **Step 4: Betulkan `idrg-bridging`**

```js
    blurb: {
      id: 'Penghubung data klaim rumah sakit dengan sistem BPJS.',
      en: "A connector between the hospital's claim data and the BPJS system.",
    },
    context: {
      id: 'Klaim BPJS dikirim melalui bridging antara sistem rumah sakit dan sistem BPJS. Aturannya kemudian berubah. Sebelumnya klaim cukup melalui coding dan grouping INA-CBG, sedangkan sekarang klaim harus melalui coding dan grouping IDRG terlebih dahulu. Layanan ini menangani keduanya, kemudian mengirimkan klaimnya. Hasil coding diagnosa dari layanan ini juga dikirim otomatis ke SatuSehat melalui service tersendiri.',
      en: 'BPJS claims are submitted through a bridge between the hospital system and the BPJS system. The rules then changed. Claims previously only went through INA-CBG coding and grouping, whereas now they must go through IDRG coding and grouping first. This service handles both, then submits the claim. The diagnosis coding it produces is also sent automatically to SatuSehat through a separate service.',
    },
    built: {
      id: [
        'Layanan penghubung antara SIMRS dan endpoint BPJS, mengikuti dokumentasi resmi',
        'Coding dan grouping IDRG, kemudian pemetaannya ke grouper INA-CBG',
        'Antrian pengiriman klaim beserta penanganan kegagalan pengiriman',
        'Pencatatan riwayat permintaan untuk menelusuri klaim yang ditolak',
        'Hasil coding diagnosa dikirim otomatis ke SatuSehat melalui service tersendiri',
      ],
      en: [
        'A connecting service between the SIMRS and the BPJS endpoints, following the official documentation',
        'IDRG coding and grouping, then mapping into the INA-CBG grouper',
        'A claim submission queue with failure handling',
        'Request history logging so that rejected claims can be traced',
        'Diagnosis coding results sent automatically to SatuSehat through a separate service',
      ],
    },
```

- [ ] **Step 5: Bakukan `rme`**

```js
    context: {
      id: 'Rekam medis elektronik untuk rawat jalan dan rawat inap, digunakan oleh dokter dan perawat asisten dokter. Rumah sakit sudah menggunakan SIMRS open source, sehingga rekam medis ini dibangun sebagai aplikasi web terpisah yang menulis ke basis data yang sama, agar pencatatan dan pelaporannya tetap menyatu.',
      en: 'Electronic medical records for outpatient and inpatient care, used by doctors and the nurses assisting them. The hospital already runs an open source SIMRS, so these records were built as a separate web application that writes into the same database, so that records and reports stay together.',
    },
    built: {
      id: [
        'Pencatatan SOAP untuk rawat jalan dan rawat inap',
        'Pencatatan tanda-tanda vital',
        'Penegakan diagnosa dengan kode ICD',
        'Permintaan pemeriksaan laboratorium',
        'Permintaan pemeriksaan radiologi',
        'Permintaan resep',
        'Penyusunan resume medis',
      ],
      en: [
        'SOAP notes for outpatient and inpatient care',
        'Vital signs',
        'Diagnosis with ICD coding',
        'Laboratory test requests',
        'Radiology examination requests',
        'Prescription requests',
        'Discharge summaries',
      ],
    },
```

Komentar kode di atas entri `rme` yang menyebut "hard part" dan jumlah tabel
dibiarkan — ia tidak tampil di layar dan mencatat alasan promosinya.

- [ ] **Step 6: Bakukan `hris-nirwana`**

```js
    context: {
      id: 'Sebelumnya absensi menggunakan mesin absen, pengajuan cuti dilakukan melalui surat, dan data pegawai disimpan di Excel. Aplikasi ini menyatukan ketiganya. Absensinya menggunakan lokasi dan deteksi wajah, serta terhubung dengan jadwal shift setiap pegawai.',
      en: "Attendance previously ran on a punch clock, leave was requested on paper, and staff data was kept in Excel. This application brings the three together. Its attendance uses location and face detection, and is tied to each employee's shift.",
    },
    built: {
      id: [
        'Absensi dengan deteksi wajah dan lokasi yang terikat pada shift pegawai',
        'Pengajuan cuti dan izin',
        'Pengelolaan jadwal dan shift',
        'Data sumber daya manusia dan struktur organisasi',
        'Pencatatan inventaris',
        'Ticketing internal',
        'Notifikasi dan pengingat masa berlaku SIP/STR',
        'Pencatatan surat peringatan dan tindakan disiplin',
        'Berjalan sebagai PWA yang dapat dipasang di ponsel pegawai',
      ],
      en: [
        "Attendance with face detection and location, tied to the employee's shift",
        'Leave and permission requests',
        'Schedule and shift management',
        'Staff records and organisational structure',
        'Inventory records',
        'Internal ticketing',
        'Notifications and SIP/STR expiry reminders',
        'Warning letters and disciplinary records',
        'Runs as a PWA, installable on staff phones',
      ],
    },
```

- [ ] **Step 7: Bakukan `psb-walisongo` dan `sibenih`**

`psb-walisongo`:
```js
    context: {
      id: 'Pendaftaran dan ujian masuk sebelumnya dilakukan secara tatap muka dan menggunakan kertas. Seluruh tahapannya kemudian dipindahkan ke satu aplikasi. Calon siswa mendaftar secara online, mengerjakan ujian langsung di browser, dan menerima pemberitahuan melalui WhatsApp pada setiap tahap hingga hasil diumumkan.',
      en: 'Registration and the entrance exam were previously done face to face and on paper. All of the stages were then moved into one application. Prospective students register online, sit the exam directly in the browser, and receive notifications through WhatsApp at every stage until results are announced.',
    },
    built: {
      id: [
        'Pendaftaran calon siswa secara online',
        'Ujian CBT yang dikerjakan langsung di browser',
        'Deteksi perpindahan tab selama ujian berlangsung',
        'Notifikasi WhatsApp otomatis melalui Fonnte pada setiap tahap',
      ],
      en: [
        'Online registration for prospective students',
        'A full computer-based exam, taken in the browser',
        'Tab-switch detection while the exam is running',
        'Automatic WhatsApp notifications through Fonnte at every stage',
      ],
    },
```

`sibenih`:
```js
    blurb: {
      id: 'Sertifikasi benih tanaman, mulai dari pengajuan hingga penerbitan sertifikat digital.',
      en: 'Plant seed certification, from application through to a digital certificate.',
    },
    context: {
      id: 'Pendaftaran dan pemantauan sertifikasi benih tanaman pada Balai Pengawasan dan Sertifikasi Benih Tanaman Pangan dan Hortikultura (BPSBTPH) Kalimantan Selatan, mulai dari pengajuan hingga penerbitan sertifikat digital.',
      en: 'Registration and monitoring for plant seed certification at the South Kalimantan Seed Supervision and Certification Agency for Food Crops and Horticulture (BPSBTPH), from application through to a digital certificate.',
    },
```

- [ ] **Step 8: Jalankan seluruh suite dan lint**

Run: `npx vitest run`
Expected: PASS. Jumlah test naik dari 232 ke **237**.

Run: `npx eslint src --max-warnings=0`
Expected: tanpa keluaran.

- [ ] **Step 9: Verifikasi di browser sungguhan**

Buka `http://localhost:3000/kerja/rsu-nirwana-web` dan baca judulnya:

```js
document.querySelector('h1').textContent;
```
Expected: `Web Rumah Sakit dan Pendaftaran Pasien Baru`

```js
document.body.textContent.includes('Khanza');
```
Expected: `false` (juga di `/kerja/rme`).

- [ ] **Step 10: Commit**

```bash
git add src/lib/data/projects.js src/lib/data/__tests__/projects.test.js
git commit -m "feat(data): prosa baku, tanpa kata saya

Halaman web RSU ditulis ulang: yang dibangun situsnya, dengan pembacaan KTP
sebagai puncaknya, bukan OCR sendirian. IDRG mendudukkan SatuSehat pada
tempatnya — pengirimannya lewat service tersendiri, datanya dari coding di
sini — dan menyebut aturan barunya: IDRG lebih dulu, INA-CBG sesudahnya.
RME berhenti menyebut nama SIMRS-nya.

Sisanya dibakukan bahasanya. Satu paragraf yang tertinggal bergaya lama
justru yang paling kelihatan.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 4: `AxisLegend` — dua baris bertajuk, enam encoding

**Files:**
- Modify: `src/components/shell/AxisLegend.jsx`
- Create: `src/components/shell/__tests__/AxisLegend.test.jsx`

- [ ] **Step 1: Tulis test yang gagal**

```jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AxisLegend from '@/components/shell/AxisLegend';

describe('AxisLegend', () => {
  it('names itself as a key, split into shape and colour', () => {
    render(<AxisLegend locale="id" />);
    expect(screen.getByText('BENTUK')).toBeInTheDocument();
    expect(screen.getByText('WARNA')).toBeInTheDocument();
  });

  it('explains every mark the map actually makes', () => {
    const { container } = render(<AxisLegend locale="id" />);
    const text = container.textContent;
    for (const word of ['KE BELAKANG', 'TINGGI', 'LUAS', 'AMBER', 'KREM', 'REDUP']) {
      expect(text, word).toContain(word);
    }
  });

  it('stops calling the public mark an edge', () => {
    // Yang menandai publik adalah tepi lapis TERATAS, bukan tepi plate.
    // Sejak shading.js ada, keempat sisi tiap lapis punya warnanya sendiri.
    const { container } = render(<AxisLegend locale="id" />);
    expect(container.textContent).not.toContain('TEPI');
  });

  it('speaks English when asked to', () => {
    const { container } = render(<AxisLegend locale="en" />);
    expect(container.textContent).toContain('FORM');
    expect(container.textContent).toContain('COLOUR');
    expect(container.textContent).toContain('CREAM');
  });
});
```

- [ ] **Step 2: Jalankan test dan pastikan gagal**

Run: `npx vitest run src/components/shell/__tests__/AxisLegend.test.jsx`
Expected: FAIL — `BENTUK` tidak ada, `TEPI` masih ada.

- [ ] **Step 3: Tulis ulang komponennya**

Ganti seluruh isi `src/components/shell/AxisLegend.jsx`:

```jsx
"use client";

// Dua baris, masing-masing bertajuk. Tajuknya yang memberi tahu pembaca bahwa
// ia sedang membaca kunci peta — pekerjaan yang sebelumnya dibebankan
// kepadanya sendiri.
//
// Belahannya jujur: tiga hal pertama memang geometri, tiga terakhir memang
// warna. Kata "TEPI" hilang karena ia menunjuk hal yang salah — yang menandai
// akses publik adalah tepi lapis TERATAS, sementara sejak shading.js ada,
// keempat sisi setiap lapis diwarnai menurut sudut kamera.
const COPY = {
  id: [
    ['BENTUK', 'KE BELAKANG tahun · TINGGI banyak stack · LUAS punya halaman'],
    ['WARNA', 'AMBER publik · KREM terpilih · REDUP tersaring'],
  ],
  en: [
    ['FORM', 'DEPTH year · HEIGHT stack size · AREA has a page'],
    ['COLOUR', 'AMBER public · CREAM selected · DIM filtered'],
  ],
};

// Lives outside the plate field on purpose: inside it, plate labels render
// on top of it.
export default function AxisLegend({ locale }) {
  return (
    <div className="border-t border-rule-soft px-5 py-2 font-mono text-[10px] text-muted-deep">
      {COPY[locale].map(([head, body]) => (
        <div key={head} className="flex gap-4 leading-[1.7]">
          <span className="w-[52px] shrink-0 tracking-[.12em] text-muted">{head}</span>
          <span>{body}</span>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Jalankan test dan pastikan lulus**

Run: `npx vitest run src/components/shell/__tests__/AxisLegend.test.jsx`
Expected: PASS, 4 test.

- [ ] **Step 5: Verifikasi di browser sungguhan**

Legenda dua baris tidak boleh terpotong oleh kaki peta:

```js
const el = document.querySelector('[class*="border-rule-soft"]');
const r = el.getBoundingClientRect();
({ tinggi: r.height, terpotong: el.scrollHeight > el.clientHeight + 1 });
```
Expected: `tinggi` sekitar 44–52px (dua baris), `terpotong: false`.

- [ ] **Step 6: Commit**

```bash
git add src/components/shell/AxisLegend.jsx src/components/shell/__tests__/AxisLegend.test.jsx
git commit -m "fix(shell): legenda yang menyebut namanya sendiri

Enam encoding, naik dari tiga: krem terpilih belum pernah disebut sama
sekali. Dan TEPI dibuang karena menunjuk hal yang salah — yang menandai
publik adalah tepi lapis teratas, sementara keempat sisi tiap lapis sudah
punya warnanya sendiri dari sudut kamera.

Tajuk BENTUK dan WARNA mengerjakan hal yang selama ini dibebankan ke
pembaca: memberi tahu bahwa ini kunci peta.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 5: Pojok peta menyebut roda dan klik

**Files:**
- Modify: `src/components/shell/MapScene.jsx:9` dan elemen `<span>` pojoknya
- Test: `src/components/shell/__tests__/MapScene.test.jsx`

- [ ] **Step 1: Tulis test yang gagal**

Tambahkan di `describe('MapScene', ...)`:

```js
  it('says everything the map answers to, not only the drag', () => {
    // Roda memutar (useMapCamera) dan badan plate adalah tombolnya (Plate),
    // tetapi pojoknya selama ini hanya menyebut seret.
    const { container } = renderScene();
    const text = container.textContent;
    expect(text).toContain('SERET ATAU GULIR');
    expect(text).toContain('KLIK PLATE');
  });

  it('drops the motion-contract jargon a visitor cannot use', () => {
    const { container } = renderScene();
    expect(container.textContent).not.toContain('1:1');
  });
```

- [ ] **Step 2: Jalankan test dan pastikan gagal**

Run: `npx vitest run src/components/shell/__tests__/MapScene.test.jsx`
Expected: FAIL — teks masih `SERET UNTUK MEMUTAR · 1:1`.

- [ ] **Step 3: Ubah `COPY` di `src/components/shell/MapScene.jsx`**

Ganti baris 9:

```js
// `1:1` dibuang: itu istilah kontrak gerak internal, dan tidak berarti apa-apa
// bagi pengunjung. Yang berarti adalah bahwa roda juga memutar dan badan plate
// bisa ditekan — dua hal yang selama ini benar tetapi tidak pernah dikatakan.
const COPY = {
  hints: {
    id: ['SERET ATAU GULIR · MEMUTAR', 'KLIK PLATE · MEMILIH'],
    en: ['DRAG OR SCROLL · ORBIT', 'CLICK A PLATE · SELECT'],
  },
};
```

- [ ] **Step 4: Ubah elemen pojoknya**

Ganti `<span className="absolute right-4 top-3 ...">{COPY.drag[locale]}</span>`
menjadi:

```jsx
        <div className="absolute right-4 top-3 font-mono text-[10px] leading-[1.7] text-right text-muted-deep pointer-events-none">
          {COPY.hints[locale].map((line) => <div key={line}>{line}</div>)}
        </div>
```

- [ ] **Step 5: Jalankan test dan pastikan lulus**

Run: `npx vitest run src/components/shell/__tests__/MapScene.test.jsx`
Expected: PASS, 8 test (6 lama + 2 baru).

- [ ] **Step 6: Commit**

```bash
git add src/components/shell/MapScene.jsx src/components/shell/__tests__/MapScene.test.jsx
git commit -m "fix(shell): sebutkan roda dan klik, bukan cuma seret

Roda memutar dan badan plate adalah tombolnya sejak peta hidup, tetapi
pojoknya masih menyebut seret sendirian. 1:1 dibuang: itu istilah kontrak
gerak, bukan bahasa pengunjung.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 6: Tajuk dan catatan `LogRail`

**Files:**
- Modify: `src/components/shell/LogRail.jsx:6-14`
- Create: `src/components/shell/__tests__/LogRail.test.jsx`

- [ ] **Step 1: Tulis test yang gagal**

```jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import LogRail from '@/components/shell/LogRail';
import { EMPTY_FILTERS } from '@/lib/shell/filters';

const systems = [
  { slug: 'hris-nirwana', access: 'internal', shortName: { id: 'HRIS', en: 'HRIS' } },
  { slug: 'sibenih', access: 'none', shortName: { id: 'SIBENIH', en: 'SIBENIH' } },
];

const renderRail = (props = {}) =>
  render(
    <LogRail
      systems={systems} locale="id" log={[]} filters={EMPTY_FILTERS}
      selected={null} dimmed={new Set(['sibenih'])}
      onChip={vi.fn()} onReset={vi.fn()} onSelect={vi.fn()} {...props}
    />,
  );

describe('LogRail', () => {
  it('does not promise a filtered list it never gives', () => {
    // Shell mengoper systems utuh, bukan hasil filter: yang tersaring cuma
    // diredupkan, dan daftar ini selalu berisi semuanya.
    renderRail();
    expect(screen.queryByText('SISTEM YANG TAMPIL')).toBeNull();
    expect(screen.getByText('DAFTAR SISTEM')).toBeInTheDocument();
  });

  it('keeps the promise the skip link already makes', () => {
    // TopBar berbunyi "LEWATI PETA → DAFTAR SISTEM". Tujuannya sekarang
    // benar-benar berjudul itu.
    renderRail();
    expect(screen.getByText('DAFTAR SISTEM')).toBeInTheDocument();
  });

  it('explains the list instead of repeating the dimming', () => {
    const { container } = renderRail();
    expect(container.textContent).toContain('Cermin peta');
    expect(container.textContent).toContain('Tab');
  });

  it('no longer claims dimmed systems get pushed back', () => {
    // Tidak ada yang didorong: plate redup hanya turun ke opacity .34 tanpa
    // berpindah. Dan catatan ini berdiri di kedua view, jadi ia juga tidak
    // boleh menyebut peta sebagai tempatnya.
    const { container } = renderRail();
    expect(container.textContent).not.toContain('didorong ke belakang');
    expect(container.textContent).not.toContain('tetap di peta');
  });

  it('offers a stack chip that actually matches something', () => {
    renderRail();
    expect(screen.getByRole('button', { name: 'stack:livewire' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'stack:soap' })).toBeNull();
  });

  it('speaks English when asked to', () => {
    const { container } = renderRail({ locale: 'en' });
    expect(screen.getByText('SYSTEM LIST')).toBeInTheDocument();
    expect(container.textContent).toContain('A mirror of the map');
  });
});
```

- [ ] **Step 2: Jalankan test dan pastikan gagal**

Run: `npx vitest run src/components/shell/__tests__/LogRail.test.jsx`
Expected: FAIL — `SISTEM YANG TAMPIL` masih ada, catatan lama masih berbunyi
"didorong ke belakang".

- [ ] **Step 3: Ubah `COPY` di `src/components/shell/LogRail.jsx`**

```js
const COPY = {
  log: { id: 'LOG', en: 'LOG' },
  filters: { id: 'FILTER · KLIK ATAU KETIK', en: 'FILTERS · CLICK OR TYPE' },
  // Bukan "SISTEM YANG TAMPIL": Shell mengoper systems utuh, jadi daftar ini
  // selalu berisi semuanya dan tidak pernah menyaring apa pun. Nama ini juga
  // menepati janji tombol lewati di TopBar.
  list: { id: 'DAFTAR SISTEM', en: 'SYSTEM LIST' },
  // Catatan ini berdiri di kedua view, jadi ia tidak boleh menyebut peta
  // sebagai tempat tinggalnya. Peredupan sudah punya barisnya sendiri di
  // legenda; yang belum pernah dikatakan adalah bahwa daftar ini bisa dipakai
  // memilih, dan bisa dicapai tanpa tetikus.
  note: {
    id: 'Cermin peta, dan bisa dicapai dengan Tab. Memilih di sini sama dengan menekan plate-nya.',
    en: 'A mirror of the map, reachable by Tab. Selecting here is the same as pressing the plate.',
  },
};
```

Lalu ganti pemakaiannya: `{COPY.inView[locale]}` menjadi `{COPY.list[locale]}`.

- [ ] **Step 4: Jalankan test dan pastikan lulus**

Run: `npx vitest run src/components/shell/__tests__/LogRail.test.jsx`
Expected: PASS, 6 test.

- [ ] **Step 5: Jalankan seluruh suite**

Run: `npx vitest run`
Expected: PASS. Jumlah test naik ke **249** (237 + 4 AxisLegend + 2 MapScene +
6 LogRail). Berkas naik dari 29 ke 31.

- [ ] **Step 6: Commit**

```bash
git add src/components/shell/LogRail.jsx src/components/shell/__tests__/LogRail.test.jsx
git commit -m "fix(shell): daftar yang menyebut dirinya apa adanya

Tajuknya berbunyi SISTEM YANG TAMPIL padahal Shell mengoper systems utuh —
daftar itu selalu berisi semuanya. Sekarang DAFTAR SISTEM, yang kebetulan
juga menepati janji tombol lewati di TopBar.

Catatan kakinya berhenti mengulang peredupan dan menerangkan daftarnya
sendiri. Yang lama menyebut peta padahal ia berdiri di kedua view, dan
menjanjikan sistem yang didorong ke belakang padahal tidak ada yang bergeser.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 7: `FlatTable` dan kalimat screenshot berhenti mengaku

**Files:**
- Modify: `src/components/shell/FlatTable.jsx` (`COPY.intro`)
- Modify: `src/components/work/ScreenshotBlock.jsx` (`MISSING`)
- Test: `src/components/work/__tests__/ProjectView.test.jsx`
- Create: `src/components/shell/__tests__/FlatTable.test.jsx`

- [ ] **Step 1: Tulis test yang gagal**

`src/components/shell/__tests__/FlatTable.test.jsx`:

```jsx
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import FlatTable from '@/components/shell/FlatTable';

const systems = [
  {
    slug: 'rme', client: 'RSU Nirwana', year: '2025', access: 'internal',
    tier: 'full', tech: ['Laravel'], shortName: { id: 'RME', en: 'EMR' },
    blurb: { id: 'Ringkas.', en: 'Short.' },
  },
];

describe('FlatTable', () => {
  it('does not claim to be what runs without JavaScript', () => {
    // Tanpa JavaScript yang dirender PaperFallback. FlatTable komponen
    // cangkang dan tidak pernah muncul di sana.
    const { container } = render(
      <FlatTable systems={systems} locale="id" selected={null} dimmed={new Set()} onSelect={vi.fn()} />,
    );
    expect(container.textContent).not.toMatch(/JavaScript mati/);
    expect(container.textContent).toContain('terbuka lebih dulu kalau gerak dikurangi');
  });
});
```

Dan di `src/components/work/__tests__/ProjectView.test.jsx`, tambahkan:

```jsx
  it('does not call every screenshot-less system internal', () => {
    // Kalimat ini juga tampil di PSB, yang access-nya 'none' dan bukan sistem
    // internal.
    render(<ProjectView project={{ ...project, image: null }} prev={null} next={null} />, { wrapper: LocaleProvider });
    expect(screen.getByText(/Screenshot menyusul/)).toBeInTheDocument();
    expect(screen.queryByText(/sistem internal/)).toBeNull();
  });
```

Kalau `ProjectView.test.jsx` belum mengimpor `LocaleProvider`, pakai wrapper
yang sudah dipakai berkas itu untuk test lainnya.

- [ ] **Step 2: Jalankan test dan pastikan gagal**

Run: `npx vitest run src/components/shell/__tests__/FlatTable.test.jsx src/components/work/__tests__/ProjectView.test.jsx`
Expected: FAIL — intro masih menyebut JavaScript mati, kalimat screenshot masih
menyebut sistem internal.

- [ ] **Step 3: Ubah `COPY.intro` di `src/components/shell/FlatTable.jsx`**

```js
  // Tanpa JavaScript yang dirender PaperFallback, bukan tabel ini: FlatTable
  // komponen cangkang. Yang benar tinggal separuhnya — gerak yang dikurangi
  // memang mendarat di sini lebih dulu (Shell.jsx, `calm ? 'list' : 'map'`).
  intro: {
    id: 'Daftar datar ini data yang sama dengan peta, tanpa geometrinya. Ini juga yang terbuka lebih dulu kalau gerak dikurangi.',
    en: 'The flat list is the same data as the map, without the geometry. It is also what opens first under reduced motion.',
  },
```

- [ ] **Step 4: Ubah `MISSING` di `src/components/work/ScreenshotBlock.jsx`**

```js
// Two projects have no screenshot yet. A stated absence reads as honesty;
// a grey placeholder box reads as a broken page.
//
// Tidak menyebut "sistem internal": kalimat ini juga tampil di PSB, yang
// access-nya 'none' dan bukan sistem internal.
const MISSING = {
  id: 'Screenshot menyusul. Tangkapan layarnya masih disensor.',
  en: 'Screenshot to follow. Captures are still being redacted.',
};
```

- [ ] **Step 5: Jalankan seluruh suite dan lint**

Run: `npx vitest run`
Expected: PASS. Jumlah test naik ke **251**. Berkas naik ke 32.

Run: `npx eslint src --max-warnings=0`
Expected: tanpa keluaran.

- [ ] **Step 6: Commit**

```bash
git add src/components/shell/FlatTable.jsx src/components/work/ScreenshotBlock.jsx src/components/shell/__tests__/FlatTable.test.jsx src/components/work/__tests__/ProjectView.test.jsx
git commit -m "fix: dua kalimat yang mengaku jadi sesuatu yang bukan dirinya

Tabel datar mengaku dipakai kalau JavaScript mati, padahal tanpa JavaScript
yang dirender PaperFallback dan tabel ini komponen cangkang. Kalimat
screenshot menyebut sistem internal, padahal ia juga tampil di PSB, yang
sekolah dan tanpa URL.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 8: Garis tahun mengikuti panjang barisnya sendiri

Baris 2025 sekarang berisi empat sistem dan berujung di 875, sementara
`MapScene` menggambar garis selebar mati 700 dan menaruh label tahun di
`left: 710`. Plate terakhir menabrak label tahunnya sendiri.

**Files:**
- Modify: `src/lib/shell/layout.js`
- Modify: `src/components/shell/MapScene.jsx`
- Create: `src/lib/shell/__tests__/layout.test.js` (kalau belum ada; kalau
  sudah, tambahkan ke berkas itu)

- [ ] **Step 1: Tulis test yang gagal**

```js
import { describe, it, expect } from 'vitest';
import { SCENE, rowExtents, platePositions } from '@/lib/shell/layout';

const systems = [
  { slug: 'a', year: '2025', tier: 'full', tech: ['x'] },
  { slug: 'b', year: '2025', tier: 'brief', tech: ['x'] },
  { slug: 'c', year: '2025', tier: 'full', tech: ['x'] },
  { slug: 'd', year: '2025', tier: 'full', tech: ['x'] },
  { slug: 'e', year: '2024', tier: 'brief', tech: ['x'] },
];

describe('rowExtents', () => {
  it('ends each row where its last plate ends', () => {
    const ends = rowExtents(systems);
    // 40 + 165 + 80 + 100 + 80 + 165 + 80 + 165
    expect(ends['2025']).toBe(875);
    // 40 + 100
    expect(ends['2024']).toBe(140);
  });

  it('agrees with the positions the same data produces', () => {
    const pos = platePositions(systems);
    const last = pos.filter((p) => p.year === '2025').at(-1);
    expect(rowExtents(systems)['2025']).toBe(last.x + last.width);
  });

  it('leaves a year with no systems out entirely', () => {
    expect(rowExtents(systems)['2026']).toBeUndefined();
  });

  it('gives the scene room for the widest row and its label', () => {
    expect(SCENE.width).toBeGreaterThanOrEqual(940);
  });
});
```

- [ ] **Step 2: Jalankan test dan pastikan gagal**

Run: `npx vitest run src/lib/shell/__tests__/layout.test.js`
Expected: FAIL dengan `rowExtents is not a function`.

- [ ] **Step 3: Tambahkan `rowExtents` dan naikkan `SCENE.width`**

Di `src/lib/shell/layout.js`, ubah `SCENE` dan tambahkan fungsi baru di bawah
`platePositions`:

```js
// 940, bukan 900: baris terpanjang berujung di 875, dan label tahunnya berdiri
// sesudah itu. Angka ini satu-satunya yang perlu naik kalau nanti ada baris
// yang lebih panjang lagi.
export const SCENE = { width: 940, height: 620 };
```

```js
// Ujung tiap baris, dihitung dengan kursor yang sama persis dengan
// platePositions. Garis tahun dan labelnya berdiri di atas nilai ini, jadi
// keduanya berhenti bergantung pada lebar mati yang kebetulan cukup.
//
// Tahun tanpa sistem tidak muncul di hasilnya sama sekali — tidak ada garis
// yang perlu digambar untuk baris kosong.
export function rowExtents(systems) {
  const ends = {};
  for (const p of platePositions(systems)) {
    ends[p.year] = Math.max(ends[p.year] ?? 0, p.x + p.width);
  }
  return ends;
}
```

- [ ] **Step 4: Jalankan test dan pastikan lulus**

Run: `npx vitest run src/lib/shell/__tests__/layout.test.js`
Expected: PASS, 4 test.

- [ ] **Step 5: Pakai di `MapScene`**

Ubah impor di `src/components/shell/MapScene.jsx`:

```js
import { SCENE, ROW_Y, platePositions, fitScale, rowExtents } from '@/lib/shell/layout';
```

Di badan komponen, di sebelah `const positions = platePositions(systems);`:

```js
  const extents = rowExtents(systems);
```

Lalu ganti blok `Object.entries(ROW_Y).map(...)` menjadi:

```jsx
            {Object.entries(ROW_Y).map(([year, y]) => {
              const end = extents[year];
              if (!end) return null;
              return (
                <div
                  key={year}
                  data-year-rule={year}
                  className="absolute h-px"
                  style={{ left: 20, top: y + 40, width: end - 20 + 10, background: year === '2026' ? '#2E3539' : '#232B30' }}
                >
                  <span
                    className={`absolute font-mono text-[11px] ${year === '2026' ? 'text-amber' : 'text-muted-deep'}`}
                    style={{ left: end - 20 + 20, transform: `rotateZ(${-camera.rotZ}deg) rotateX(-56deg) translate(0,-7px)` }}
                  >
                    {year}
                  </span>
                </div>
              );
            })}
```

Garis mulai di `x = 20`, jadi lebarnya `end - 20` ditambah 10px kelegaan, dan
labelnya berdiri 10px lagi sesudah ujung garis.

- [ ] **Step 6: Tambahkan test `MapScene` untuk garisnya**

Di `src/components/shell/__tests__/MapScene.test.jsx`:

```js
  it('draws each year rule as long as its own row, not a fixed width', () => {
    const { container } = renderScene();
    const rule = container.querySelector('[data-year-rule="2026"]');
    // Fixture berisi satu plate full: 40 + 165 = 205, dikurangi awal garis di
    // 20, ditambah 10px kelegaan.
    expect(rule.style.width).toBe('195px');
  });

  it('draws no rule for a year with no systems', () => {
    const { container } = renderScene();
    expect(container.querySelector('[data-year-rule="2024"]')).toBeNull();
  });
```

- [ ] **Step 7: Jalankan seluruh suite dan lint**

Run: `npx vitest run`
Expected: PASS. Jumlah test naik ke **257**. Berkas naik ke 33 (kalau
`layout.test.js` memang baru).

Run: `npx eslint src --max-warnings=0`
Expected: tanpa keluaran.

- [ ] **Step 8: Verifikasi di browser sungguhan**

Emulasi 1280x800, buka `/sistem`, lalu:

```js
const rules = [...document.querySelectorAll('[data-year-rule]')]
  .map((n) => [n.dataset.yearRule, n.style.width]);
const plates = [...document.querySelectorAll('button[aria-pressed]')].length;
({ rules, plates });
```

Expected: tiga garis dengan lebar berbeda-beda (2025 yang terpanjang, sekitar
`865px`), dan `plates: 9`.

Lalu pastikan label 2025 tidak tertimpa plate:

```js
const label = [...document.querySelectorAll('[data-year-rule="2025"] span')][0];
const r = label.getBoundingClientRect();
({ kiri: r.left, kanan: r.right, terlihat: r.width > 0 && r.right < window.innerWidth });
```
Expected: `terlihat: true`.

- [ ] **Step 9: Commit**

```bash
git add src/lib/shell/layout.js src/components/shell/MapScene.jsx src/lib/shell/__tests__/layout.test.js src/components/shell/__tests__/MapScene.test.jsx
git commit -m "fix(map): garis tahun berhenti di ujung barisnya sendiri

Lebar 700 dan label di 710 itu peninggalan dari waktu data kebetulan muat.
Dengan empat sistem di 2025 barisnya berujung di 875, dan plate terakhirnya
menabrak label tahunnya sendiri.

layout.js sudah menghitung ujung tiap baris waktu menata plate; ia tinggal
mengekspornya. Menambal dengan angka baru cuma menunda patah berikutnya.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 9: `PROGRESS.md` — larangan yang ditulis ulang

Tanpa task ini, sesi berikutnya akan membaca "HRIS tidak punya payroll",
melihat kata "penggajian" di layar SIGAP, dan menghapusnya sebagai pelanggaran.

**Files:**
- Modify: `docs/PROGRESS.md`

- [ ] **Step 1: Ubah bagian "Larangan yang tidak bisa ditawar"**

Ganti butir payroll menjadi:

```markdown
- **HRIS RSU Nirwana tidak punya payroll atau modul keuangan.** Jangan pernah
  disebut. **SIGAP (BPN) berbeda dan bukan pengecualian yang lupa dihapus:**
  ia memang mencatat serta menghitung penggajian bulanan dari absensi, lembur
  dan cuti, tetapi tidak menjalankan pembayaran — dan kalimat konteksnya
  menyebut batas itu sendiri. Ada test yang menjaganya.
```

Ganti butir SIMRS menjadi:

```markdown
- **Nama SIMRS rumah sakit tidak disebut di layar.** Yang tampil "SIMRS open
  source". Ia memang open source dan dipakai apa adanya, bukan produk vendor —
  tapi namanya tetap tidak ditulis. Ada test yang menjaganya.
```

Tambahkan butir baru:

```markdown
- **Prosa halaman baca berbahasa baku, dan tanpa kata "saya".** Kalimat lurus,
  tanpa tanda pisah yang mendramatisir dan tanpa personifikasi. Alasannya
  disebut Utsman sendiri pada 2026-09-09: prosa bergaya membuat halaman
  terbaca seperti tulisan mesin. Ada test yang menjaga keduanya.
- **Ada dua SOAP.** Protokol `SOAP` sudah keluar dari stack IDRG karena tidak
  dipakai. "Pencatatan SOAP" di butir RME adalah singkatan rekam medis dan
  tetap tinggal. Jangan disapu bersama.
```

- [ ] **Step 2: Tambahkan slug baru ke butir slug**

Ganti butir slug di "Keputusan yang mahal kalau dilupakan":

```markdown
- **Slug tidak berubah.** `rsu-nirwana-web`, `idrg-bridging`, `hris-nirwana`,
  `rme`, `psb-walisongo`, dan sejak 2026-09-10 juga `sigap-bpn` dan `simaset`.
  **Tujuh** halaman baca. `aset-kphl` dan `sertifikasi-benih` sudah diganti
  jadi `simaset` dan `sibenih` waktu keduanya masih tier ringkasan dan belum
  punya URL; sesudah punya halaman, tidak boleh lagi.
```

- [ ] **Step 3: Tambahkan catatan baru di "Keputusan yang mahal"**

```markdown
- **`AxisLegend` tidak ikut ke view `DATAR`.** Ia hidup di dalam `MapScene`,
  jadi peredupan di tabel datar memang tanpa keterangan. Itu pilihan sadar:
  catatan kaki rail dulu memikulnya, dan sejak 2026-09-10 ia pindah tugas
  menerangkan daftarnya sendiri. Harganya disebutkan ke Utsman dan diterima.
  Kalau nanti terasa, jalan keluarnya menaruh satu kata di dekat chip filter,
  bukan mengembalikan catatan kaki lama.
- **Garis tahun di peta tidak punya lebar tetap.** `rowExtents()` di
  `layout.js` yang menentukannya, dari kursor yang sama dengan
  `platePositions`. Angka mati `700` dan `710` sudah dibuang; mengembalikannya
  akan patah lagi pada project berikutnya.
```

- [ ] **Step 4: Perbarui bagian "Posisi sekarang", "Keadaan", dan antrean**

- Tambahkan rencana ini ke daftar rencana selesai dan ke tabel "Di mana isinya".
- Ganti "223 test hijau, 29 berkas" dengan angka akhir yang benar-benar keluar
  dari `npx vitest run` pada langkah verifikasi terakhir. **Jangan menyalin
  angka dari rencana ini** — jalankan dan salin keluarannya.
- Hapus antrean nomor 1 ("Teks legenda dan catatan rail") dan naikkan nomor
  sisanya. Antrean nomor 2 (kontras label tahun), 3 (screenshot) dan 4 (merge)
  tetap.
- Catat di antrean bahwa `siblings()` sekarang tidak kronologis setelah tahun
  berubah, di bawah "Kalau nanti terasa perlu, bukan sekarang".

- [ ] **Step 5: Commit**

```bash
git add docs/PROGRESS.md
git commit -m "docs: larangan yang tahu bedanya HRIS dan SIGAP

Larangan payroll ditulis untuk HRIS RSU Nirwana. SIGAP sistem lain milik
klien lain dan memang menghitung penggajian bulanan tanpa menjalankan
pembayaran, jadi larangan itu harus menyebut HRIS supaya sesi berikutnya
tidak menghapus kata yang sah.

Nama SIMRS berhenti ditulis, prosa halaman baca jadi baku tanpa kata saya,
dan dua SOAP yang berbeda dicatat supaya tidak disapu bersama.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 10: Verifikasi akhir di browser sungguhan

Tidak ada kode baru di sini. Ini yang memisahkan "test hijau" dari "benar-benar
jalan", dan spec menyebut daftarnya.

- [ ] **Step 1: Suite dan lint sekali lagi**

Run: `npx vitest run`
Run: `npx eslint src --max-warnings=0`
Catat jumlah test dan berkas yang sebenarnya keluar.

- [ ] **Step 2: `npm run build` — minta Utsman**

Build bentrok dengan dev server yang memegang `.next`. Minta Utsman
menjalankannya dan menyalin keluarannya. Yang diperiksa: sukses, `/` dan
`/sistem` tetap `○ Static`, dan **tujuh** halaman `/kerja/*` terdaftar.

- [ ] **Step 3: Tanpa JavaScript masih utuh**

```bash
curl -s http://localhost:3000/sistem | grep -o '/kerja/[a-z-]*' | sort -u
```
Expected: tujuh slug — `hris-nirwana`, `idrg-bridging`, `psb-walisongo`, `rme`,
`rsu-nirwana-web`, `sigap-bpn`, `simaset`.

- [ ] **Step 4: Peta pada emulasi 1280x800**

Lewat `javascript_tool`:

```js
({
  plate: document.querySelectorAll('button[aria-pressed]').length,
  garis: [...document.querySelectorAll('[data-year-rule]')].map((n) => n.style.width),
  legenda: document.querySelector('[class*="border-rule-soft"]').textContent,
  pojok: [...document.querySelectorAll('.pointer-events-none div')].map((n) => n.textContent),
});
```

Expected: `plate: 9`; tiga garis dengan lebar berbeda; legenda memuat `BENTUK`
dan `WARNA` dan tidak memuat `TEPI`; pojok dua baris tanpa `1:1`.

- [ ] **Step 5: Serahkan ke mata Utsman**

Yang tidak bisa dijawab `javascript_tool`, dan harus dilihat Utsman sendiri:

- Legenda dua baris — apakah `GULIR` terasa wajar, atau lebih baik `SCROLL`.
- `Web & Pendaftaran` dan `PSB & CBT` di plate — apakah panjangnya masih enak
  dilihat, atau nama pendeknya perlu dipangkas lagi.
- Peta yang menyusut 4% — apakah masih terbaca nyaman.

**Jangan mengklaim ketiganya sudah beres sebelum Utsman mengatakannya.**
