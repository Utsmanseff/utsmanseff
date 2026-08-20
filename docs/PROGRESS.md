# Portfolio — Status Kerja

> Dibaca di awal sesi baru. Menggantikan catatan redesign lama (9 section scroll), yang sudah tidak berlaku.

## Bentuk sekarang

Porto berdiri di **dua lapis**.

- `/` — kanvas gelap yang digeser. Setiap project jadi simpul; garis antar simpul menandai hubungan nyata, bukan hiasan. Di bawah 768px kanvas diganti daftar vertikal yang dikelompokkan per klaster klien.
- `/kerja/[slug]` — halaman kertas krem untuk dibaca dan dibagikan. Dibuat statis dari project ber-`tier: 'full'`, dengan anatomi tujuh blok yang tetap.
- `/kontak` — kontak singkat plus unduh CV.

Riwayat kerja, pendidikan, dan grid ikon skill **dibuang**, bukan disembunyikan — sudah ada di CV, dan di Indonesia HRD membaca CV sementara tim teknis yang membuka porto. Porto ini ditulis untuk yang kedua.

**Branch:** `portfolio-canvas-redesign` (bercabang dari `main`, belum di-merge)

**Dokumen acuan:**
- Spec: `docs/superpowers/specs/2026-08-19-portfolio-canvas-redesign-design.md`
- Rencana: `docs/superpowers/plans/2026-08-19-portfolio-canvas-redesign.md` (15 task)
- Copy HRIS & PSB dari sumber: `docs/superpowers/notes/2026-08-19-project-copy.md`

## Di mana isinya

| Apa | Di mana |
|-----|---------|
| Semua project (datar, satu sumber untuk kanvas dan halaman baca) | `src/lib/data/projects.js` |
| Kontak, socials, `siteUrl` kanonik, berkas CV | `src/lib/data/meta.js` |
| Token warna paper + ground + dua amber | `src/app/globals.css` (`@theme`) |
| Kanvas, simpul, garis, panel, daftar mobile | `src/components/canvas/` |
| Halaman baca dan bagian-bagiannya | `src/components/work/` |
| Metadata akar, JSON-LD, font | `src/app/layout.js`, `src/components/JsonLd.jsx` |
| Kartu OG 1200x630 | `src/app/opengraph-image.jsx` |

Field project yang berbeda per bahasa selalu berbentuk `{ id: '...', en: '...' }`. Field yang selalu string (`tech`, `client`, `year`, `slug`) tidak dibungkus.

`tier` menentukan bentuk: `full` dapat simpul besar dan halaman `/kerja/[slug]`; `brief` hanya simpul kecil dan panel pratinjau. `access` (`public` / `internal` / `none`) menentukan badge yang ditulis terang-terangan, bukan disamarkan.

## Yang dihapus

Sembilan komponen section lama, `CaseStudyModal`, `Nav` lama, tombol tema gelap/terang, serta `experience.js`, `education.js`, dan `skills.js`. Kamus `src/lib/i18n/{id,en}.js` dipangkas tinggal grup `nav` dan `ui`. Token `cream`/`forest` diganti `paper`/`ground`.

## Status task

Task 1–14 dari rencana selesai. Yang tersisa hanya **Task 15: lihat dengan mata sendiri** — `npm run dev`, lalu jalankan daftar periksa di akhir rencana: seret 1:1, zoom yang menahan titik di bawah kursor, detail muncul saat zoom masuk, "Tampilkan semua", panel yang memudar bukan menyentak, Tab lewat semua simpul, lebar di bawah 768px, dan membuka `/kerja/rsu-nirwana-web` langsung tanpa tahu-menahu soal kanvas.

## Keadaan sekarang

- **79 test hijau.**
- `npx eslint src --max-warnings=0` bersih. (Pakai perintah ini, bukan `npm run lint`.)
- `npm run build` sukses; empat halaman `/kerja/*` ikut terbentuk statis.

## Keputusan yang mahal kalau dilupakan

- **Amber ada dua.** `--color-amber` (#C97B3F) hanya untuk kanvas gelap (5.33:1). Di atas kertas ia cuma 2.82:1 — gagal WCAG AA. Semua amber yang menyentuh lapisan baca pakai `--color-amber-ink` (#9C5A28, 4.61:1).
- **Kontrak gerak terbelah.** Seret dan zoom mengikuti jari 1:1 tanpa easing. Yang bergerak sendiri (panel, pindah halaman) memudar 700ms `cubic-bezier(0.22, 1, 0.36, 1)`.
- **Tidak ada angka dampak.** Klaim tanpa sumber dibuang, bukan dikarang atau diperhalus. Screenshot dan URL live yang jadi bukti; status akses ditulis terang.
- **HRIS tidak punya payroll/keuangan.** Jangan pernah disebut.
- **Vitest & ESLint mengecualikan `.claude/**`.** Worktree di situ salinan penuh repo — sempat membuat vitest menghitung test basi dan membuat lint seperti menggantung.
- **`meta.siteUrl` satu-satunya sumber URL kanonik.** `metadataBase`, JSON-LD, dan kartu OG semuanya membacanya. Jangan menulis domain di tempat lain; `utsman.dev` masih placeholder dan tidak melayani situs ini.
- **Template judul ada di akar.** `layout.js` memasang `title.template` `"%s — Utsman"`. Judul per halaman tidak boleh menambahkan "— Utsman" sendiri.

## Masih kurang dari user

- Screenshot HRIS → `public/assets/img/hris.png`
- Screenshot PSB → `public/assets/img/psb.png`

Sampai masuk, `image: null` dan halaman menampilkan status kosong yang dirancang, bukan gambar rusak. Sensor dulu kalau memuat data pegawai/pasien asli.

## Risiko yang diakui sejak awal

Sembilan simpul bisa terasa sepele, bukan seperti peta. Penawarnya: garis hubungan yang bermakna, label informatif, detail bertambah saat zoom. Kalau gagal — Task 15 memang menanyakan ini terus terang — kanvas dibuang dan daftar berkelompok dipakai di semua lebar. Halaman bacanya tetap hidup, jadi mundur berarti kehilangan satu komponen, bukan proyeknya.


## Antrean berikutnya (dari sesi 2026-08-20, urut prioritas)

### 1. Bug: chrome menindih panel
`PreviewPanel` memakai `z-20`, `CanvasChrome` `z-30`. Akibatnya panduan bawah, LangSwitcher, dan tautan Kontak berdiri di atas panel, dan tombol tutup panel tertimpa switcher bahasa. Perbaikan: naikkan panel di atas chrome, atau sembunyikan/redupkan chrome selama panel terbuka. Sudah diverifikasi di browser oleh pemilik.

### 2. Keputusan: semua project di kanvas, atau hanya unggulan?
Sekarang kedelapan project tampil sebagai simpul; hanya empat ber-`tier: 'full'` yang punya halaman. Pemilik mempertanyakan apakah semuanya perlu tampil. Pilihan: (a) tetap semua, tapi bedakan tier lebih tegas; (b) kanvas hanya untuk unggulan, sisanya jadi daftar kecil di pinggir; (c) simpul kecil digabung jadi satu simpul "project lain".

### 3. Tech stack harus kembali
Grid ikon skill dibuang di Task 12 dengan alasan mengulang CV. Pemilik menilai stack tetap penting. Jangan kembalikan sebagai grid ikon — itu ciri template yang justru mau dihindari. Opsi: legenda/filter di kanvas (klik "Laravel" → simpul lain meredup), atau satu baris padat di `/kontak`. `skills.js` sudah dihapus; datanya bisa diturunkan dari `project.tech`.

### 4. Masih terasa AI-generated, terutama petanya
Keluhan pemilik: peta dan tipografinya terasa umum. Font sekarang Fraunces + Inter + JetBrains Mono — kombinasi yang sangat sering dipakai. Pemilik tertarik font bergaya game klasik (era Mario/NES, bitmap/pixel).
Catatan sebelum eksekusi: font piksel hampir selalu gagal untuk teks panjang. Arah yang masuk akal — pakai muka display bergaya piksel/bitmap **hanya di lapis kanvas** (label simpul, chrome, judul), dan pertahankan serif yang terbaca di halaman baca. Perhatikan lisensi (banyak font NES-alike tidak bebas komersial) dan hinting pada ukuran kecil. Perlu dibandingkan berdampingan sebelum dipilih.

### 5. Pertanyaan terbuka: apakah ada konsep yang lebih baik?
Pemilik menanyakan ini setelah kanvas akhirnya bisa dipakai. Belum dijawab. Jalan mundur yang sudah disepakati sejak awal tetap berlaku: daftar berkelompok di semua lebar, halaman baca tetap hidup.

## Pelajaran yang mahal (jangan diulang)

- **Klik sintetis membohongi.** `fireEvent.click` dan `.click()` melewati urutan pointer. Bug `setPointerCapture` membuat setiap klik simpul mendarat di latar kanvas, dan 86 test tetap hijau. Uji syarat penyebabnya, bukan sekadar "klik berhasil".
- **Verifikasi lewat browser harus dicek kerangka koordinatnya.** Alat klik sempat memakai ukuran jendela lama, jadi klik meleset 1,74× dan menghasilkan "bukti" palsu.
- **Riwayat konsol bukan keadaan sekarang.** Hydration error yang sudah diperbaiki masih terbaca di tab lama; buktikan dengan tab baru.

## Cara lanjut

1. `git checkout portfolio-canvas-redesign`
2. `npm test` — harus 89 hijau
3. Buka rencana, kerjakan Task 15 (dilihat langsung, bukan diuji otomatis)
