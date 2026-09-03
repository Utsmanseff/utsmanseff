# Portfolio — Status Kerja

> Dibaca di awal sesi baru. Menggantikan catatan kanvas simpul, yang sudah tidak berlaku sejak 2026-09-03.

**Branch:** `portfolio-canvas-redesign` (bercabang dari `main`, belum di-merge)
**Posisi sekarang:** Task 1 dan 2 dari rencana selesai. **Lanjut di Task 3.**

## Ke mana porto ini menuju

Kanvas simpul dibuang. Penggantinya dua bentuk di atas satu sumber data:

| Lebar | Bentuk | Warna |
|-------|--------|-------|
| ≥1024px | Cangkang perangkat lunak: peta isometrik + konsol perintah | Gelap |
| <1024px | Dokumen teknis: spine tahun + filter sheet | Kertas |
| `/kerja/<slug>` | Halaman baca, semua lebar | **Gelap** (berubah dari krem) |

Desainnya datang dari Claude Design dan ada di `docs/design_handoff_porto_utsman/`
(README + prototipe HTML). Prototipe itu **referensi, bukan kode untuk disalin**.

**Dokumen yang mengikat, urut kepentingan:**

| Apa | Di mana |
|-----|---------|
| Rencana implementasi, 17 task | `docs/superpowers/plans/2026-09-03-shell-dan-dokumen.md` |
| Spec desain | `docs/superpowers/specs/2026-09-03-shell-dan-dokumen-design.md` |
| Seluruh teks yang tampil, dua bahasa, sudah disetujui | `docs/superpowers/notes/2026-09-03-seluruh-isi-tulisan.md` |
| Keputusan isi + jawaban mentah Utsman | `docs/superpowers/notes/2026-09-03-content-pass.md` |
| Teks yang dibuang, diarsipkan | `docs/superpowers/notes/2026-09-03-arsip-bagian-sulit.md` |
| Handoff desain | `docs/design_handoff_porto_utsman/README.md` |

## Sudah dikerjakan

- **Task 1 — token & font.** Palet handoff penuh di `globals.css` (lapis gelap,
  lima lapis plate, lapis `paper-` untuk dokumen HP, dua amber). Fraunces dan
  Jersey 15 dibuang; sekarang Bricolage Grotesque + Inter + JetBrains Mono.
  `--font-pixel` hilang, `.sr-only` masuk, radius dicabut dari focus ring.
- **Task 2 — kosakata stack.** `src/lib/data/tech.js`: `techNames()` (nama unik,
  urut abjad, tanpa hitungan) dan `techSlug()` (token konsol, `TensorFlow.js` →
  `tensorflowjs`). Lima test.

Keadaan: **109 test hijau**, `npx eslint src --max-warnings=0` bersih,
`npm run build` sukses dengan lima halaman `/kerja/*`.

## Lanjut dari sini

Kerjakan rencana **Task 3 dan seterusnya**, satu task sekali jalan, berhenti
setiap selesai satu task dan tunggu aba-aba. Urutannya sengaja menaruh yang
paling berisiko di belakang:

3. Filter murni (`src/lib/shell/filters.js`)
4. `clientKey` di setiap project — celah data yang ditemukan saat menulis rencana
5. Tabel perintah (`src/lib/shell/commands.js`)
6. Geometri plate & skala (`src/lib/shell/layout.js`)
7. Halaman baca pindah ke lapis gelap, tiga bagian bernomor
8–9. Dokumen HP: spine tahun, filter sheet, bar bawah
10. `/` merender dokumen dulu, cangkang menyusul kalau layak
11–12. Chrome cangkang, tabel datar, panel, log rail
13. **Peta isometrik** — paling mungkin gagal, sengaja paling akhir
14. Konsol + papan ketik
15. Hapus `src/components/canvas/`, `src/lib/canvas/`, `src/lib/data/canvas.js`
16. Kontak & kartu OG ikut lapis gelap
17. Dilihat dengan mata sendiri, bukan test

## Larangan yang tidak bisa ditawar

- **Tidak ada angka jumlah di layar.** Tidak ada "8 sistem", "4 dari 8 tampil",
  atau hitungan pemakaian teknologi. Umpan balik filter cuma kata `TERSARING`.
- **Tidak ada penanda `langka` / `dasar`.** Stack tampil sebagai daftar nama.
- **Tidak ada bagian "yang sulit" dan "di luar lingkup"** di halaman baca. Nadanya
  seperti sidang skripsi; teksnya sudah diarsipkan.
- **Tidak ada angka dampak.** Tidak ada persen, tidak ada jumlah pengguna.
- **HRIS tidak punya payroll atau modul keuangan.** Jangan pernah disebut.
- **Amber ada dua.** `#C97B3F` hanya di atas gelap (5.33:1); di atas kertas wajib
  `#9C5A28` (4.9:1).
- **SIMRS Khanza bukan vendor.** Ia open source dan gratis, dipakai rumah sakit
  apa adanya. Klaim "sistem vendor" pernah salah tertulis dan sudah dikoreksi.
- **Tidak ada kalimat headline.** Halaman dibuka identitas, lalu langsung
  sistemnya. Panel kanan desktop berisi blok catatan, bukan prosa.
- **Vitest & ESLint mengecualikan `.claude/**`.** Jangan "diperbaiki".
- **`meta.siteUrl` satu-satunya sumber URL kanonik.**

## Keputusan yang mahal kalau dilupakan

- **Slug tidak berubah.** `rsu-nirwana-web`, `idrg-bridging`, `hris-nirwana`,
  `rme`, `psb-walisongo`. Slug prototipe (`pendaftaran-ocr` dsb) sengaja ditolak.
- **RME naik jadi halaman penuh** (2026-09-03). Lima halaman baca, bukan empat.
- **Prosa berasal dari repo**, bukan dari prototipe — prototipe hanya menyumbang
  bentuk field `blurb`.
- **Stack PSB:** `Laravel, JavaScript, MySQL, Fonnte`. Prototipe menulis Livewire;
  itu keliru.
- **HRIS memakai TensorFlow.js**, bukan MediaPipe (diganti 2026-09-03). Arsip
  teks lama masih menyebut MediaPipe dan tidak boleh dipakai apa adanya.
- **Tiga tahun, bukan empat.** Freelance sejak akhir 2023.
- **Kontrak gerak terbelah.** Yang digerakkan jari 1:1 tanpa easing; yang bergerak
  sendiri memudar 700ms `cubic-bezier(.22, 1, .36, 1)`; warna 180ms;
  `prefers-reduced-motion` memangkas ke 1ms **dan** mendaratkan `/` di tabel datar.
- **Tanpa JavaScript `/` harus tetap utuh.** Server merender dokumen; cangkang
  menyusul hanya kalau JS hidup, lebar ≥1024px, dan gerak tidak dikurangi.

## Masih kurang dari user

- Screenshot HRIS → `public/assets/img/hris.png`
- Screenshot PSB → `public/assets/img/psb.png`

Sampai masuk, `image: null` dan halaman menampilkan keadaan kosong yang
dirancang — bukan gambar stok, bukan kotak abu-abu. Sensor dulu kalau memuat
data pegawai atau pasien asli. Screenshot RME (`rme1.png`) sudah tersensor dan
aman.

## Pelajaran yang mahal (jangan diulang)

- **Cache Turbopack menyajikan token basi.** Setelah mengubah `globals.css`, dev
  server sempat terus mengirim `--color-ink: #1a1a1a` yang lama; reload biasa
  tidak menolong. Hapus `.next`, jalankan ulang server. Kalau perubahan token
  "tidak muncul", ini penyebabnya, bukan kodenya.
- **Regex multi-baris menelan data.** Menghapus properti `hard:` dengan
  `/hard: \{.*?\n    \},/s` memakan tiga project sekaligus, karena empat project
  kecil menulisnya dalam satu baris. Hapus properti per baris, dan periksa jumlah
  entri setelahnya.
- **Klik sintetis membohongi.** `fireEvent.click` melewati urutan pointer. Bug
  `setPointerCapture` membuat setiap klik simpul mendarat di latar, dan 86 test
  tetap hijau.
- **Kerangka koordinat alat browser.** Saat viewport diemulasi lebih besar dari
  panel, klik berbasis koordinat meleset. Pakai `ref`, atau samakan ukurannya.
- **Tab yang tidak dikomposit membekukan rAF.** Di panel browser yang tersembunyi,
  animasi tidak maju dan `getComputedStyle` melaporkan nilai awal. Baca
  `element.style` untuk menilai keadaan yang dituju.
- **`overflow-hidden` tidak menghentikan browser.** Fokus yang pindah ke elemen
  di luar layar tetap menggulir kotaknya. Apa pun yang harus diam dipasang
  `fixed`, bukan `absolute` di dalam kotak itu.

## Cara lanjut

1. `git checkout portfolio-canvas-redesign`
2. `npm test` — harus 109 hijau
3. Buka rencana, kerjakan Task 3, berhenti setelah selesai
