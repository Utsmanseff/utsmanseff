# Spec — cangkang isometrik & dokumen teknis

Menggantikan `2026-08-19-portfolio-canvas-redesign-design.md` untuk lapis
penjelajahan. Halaman baca tetap ada, tapi berpindah lapis warna (lihat §9).

Sumber: `docs/design_handoff_porto_utsman/` (prototipe + README handoff) dan
`docs/superpowers/notes/2026-09-03-content-pass.md` (keputusan isi).

## 1. Bentuk

Dua bentuk, satu identitas, satu sumber data.

| Lebar | Bentuk | Warna |
|---|---|---|
| ≥1024px | Cangkang perangkat lunak: peta isometrik + konsol | Gelap |
| <1024px | Dokumen teknis: spine tahun + filter sheet | Kertas |
| `/kerja/<slug>` | Halaman baca, semua lebar | Gelap (diputuskan 2026-09-03) |

Peta bukan satu-satunya jalan ke sebuah sistem. Chip "lewati peta", tabel datar,
konsol, dan spine mobile semuanya mendarat di halaman baca yang sama.

## 2. Rute

| Rute | Isi | Render |
|---|---|---|
| `/` | Dokumen (server) → ditingkatkan jadi cangkang saat JS aktif dan ≥1024px | Statis + hidrasi |
| `/kerja/<slug>` | Halaman baca, lima slug | Statis per slug |
| `/kontak` | Kontak + unduh CV | Statis |

Slug tidak berubah: `rsu-nirwana-web`, `idrg-bridging`, `hris-nirwana`, `rme`,
`psb-walisongo`.

**Tanpa JavaScript `/` tetap utuh.** Yang dirender server adalah dokumen —
daftar sistem yang terbaca dan bisa diklik di semua lebar. Cangkang, peta, dan
konsol menyusul setelah mount, hanya kalau lebar ≥1024px dan pengguna tidak
meminta `prefers-reduced-motion: reduce`. Urutan ini kebalikan dari yang sekarang
(kanvas dulu, daftar sebagai cadangan) dan dipilih supaya keadaan tanpa-JS bukan
keadaan yang dirancang belakangan.

## 3. Data

Satu sumber tetap `src/lib/data/projects.js`. Tidak ada pengambilan data.

Field yang sudah ada dan tetap: `slug`, `client`, `year`, `role`, `access`,
`site`, `image`, `tech`, `shortName`, `title`, `context`, `built`, `blurb`,
`tier`.

Yang dibuang: `position`, `cluster`, `related` — koordinat kanvas dan garis
relasi tidak dipakai lagi. Tata letak plate dihitung, bukan ditulis tangan.

Yang diturunkan, bukan disimpan:

| Turunan | Rumus | Dipakai untuk |
|---|---|---|
| tinggi | `tech.length` | tinggi tumpukan plate (3–5 lapis, jarak 7px) |
| `hasPage` | `tier === 'full'` | luas plate: 165×115 vs 100×74 |
| `isPublic` | `access === 'public'` | tepi lapisan teratas amber |
| daftar stack | himpunan `tech` di seluruh project | chip filter `stack:` |

**Tidak ada `rare`, tidak ada `baseline`, tidak ada hitungan pemakaian.**
Keputusan 2026-09-03: menandai satu teknologi sebagai "langka" dan yang lain
sebagai "dasar" adalah cara memuji diri sendiri lewat data. Stack tampil sebagai
daftar nama; filter `stack:` tetap jalan tanpa satu pun label nilai.

**Tidak ada angka jumlah di mana pun.** Penghitung `8 SISTEM · 4 TAMPIL`, judul
"Delapan sistem", catatan kaki "lima punya halaman", dan baris log "3 menyala ·
5 redup" semuanya dibuang. Umpan balik filter berupa kata `TERSARING` yang muncul
saat filter aktif — bukan hitungan.

## 4. Sumbu peta

Setiap saluran visual membawa data nyata. Tidak ada yang dekoratif.

| Saluran | Arti |
|---|---|
| Kedalaman (baris) | tahun — 2024 belakang, 2025 tengah, 2026 depan |
| Tinggi tumpukan | jumlah teknologi (tanpa angka tertulis di mana pun) |
| Luas plate | punya halaman baca atau tidak |
| Tepi lapisan atas | amber kalau ada URL publik |
| Opacity .34 | tersaring — tetap di peta, didorong ke belakang |
| Tepi 2px + naik 10px | terpilih |

X di dalam satu baris ditumpuk berurutan: mulai 40, maju sebesar lebar plate itu
sendiri + 80. **Bukan indeks × jarak tetap** — itu bug yang membuat plate kecil
mendarat di dalam plate besar.

Adegan adalah kotak 900×620 yang diukur lalu diskalakan:
`k = min((lebarPane − 170) / 900, (tinggiPane − 30) / 620, 1)`, minimum 0.4.
Cadangan 170px untuk label yang menjorok keluar. Diukur ulang saat resize.

Label plate berjangkar di tengah plate-nya sendiri dan dilawan-rotasi setiap
frame supaya tetap tegak.

## 4b. Halaman baca — empat blok, bukan tujuh

Keputusan 2026-09-03: halaman baca berhenti menjelaskan diri sendiri.

| Ada | Dibuang |
|---|---|
| Kepala: klien · tahun · peran, judul, badge akses | `03 BAGIAN SULIT` |
| `01 KONTEKS` | `DI LUAR LINGKUP SAYA` |
| `02 YANG DIBANGUN` | catatan "Halaman ini statis…" |
| `03 STACK` (nama saja) | hitungan pemakaian teknologi |
| Screenshot + catatan (klien, tahun, peran, akses) | |
| Kaki: sebelumnya / berikutnya | |

Teks `hard` dan `notMine` sudah dihapus dari `projects.js` dan diarsipkan di
`docs/superpowers/notes/2026-09-03-arsip-bagian-sulit.md`.

## 5. Komponen

```
src/components/shell/          (≥1024px, gelap)
  Shell.jsx            cangkang: top bar, rail, pane, panel, konsol, status bar
  LogRail.jsx          log, chip filter, daftar sistem yang tampil
  MapScene.jsx         pengukuran + skala-agar-muat, orbit
  Plate.jsx            satu sistem sebagai tumpukan lapisan
  AxisLegend.jsx       keterangan sumbu, di luar medan plate
  SelectedPanel.jsx    detail sistem; keadaan awal = blok catatan identitas
  Console.jsx          input perintah + petunjuk
  FlatTable.jsx        tabel datar, sekaligus cadangan tanpa-JS
src/components/document/       (<1024px, kertas)
  SystemsDocument.jsx  spine tahun
  YearGroup.jsx        satu tahun dan sistem-sistemnya
  FilterSheet.jsx      lembar filter yang ditarik dari bawah
  BottomBar.jsx        filter · jumlah · kontak
src/components/work/           (halaman baca, gelap)
  ProjectView.jsx      dua kolom: bagian bernomor + kolom catatan
```

Logika murni, tanpa DOM, supaya bisa diuji sendiri:

```
src/lib/shell/commands.js   parse(perintah) -> { action, payload, log[] }
src/lib/shell/filters.js    isShown(system, filters), toggle(filters, key, val)
src/lib/shell/layout.js     platePositions(systems), fitScale(pane)
src/lib/data/tech.js        daftar teknologi unik untuk chip filter
```

`useShell()` menyimpan seluruh state cangkang dalam satu reducer.

## 6. Konsol

Satu-satunya bagian yang menyatukan dua konsep: chip dan ketikan menulis baris
log yang sama, sehingga tidak ada cara untuk membedakan keduanya di log.

```
ls | ls systems            daftar sistem, tanpa hitungan
open <slug|potongan nama>  buka halaman baca; sistem tanpa halaman menolak dan menyebut alasannya
filter <kunci>:<nilai>     kunci ∈ client | year | access | stack; "client:bpn" tanpa kata filter juga jalan
reset                      kosongkan semua filter
view iso | view flat       peta / tabel (juga "iso", "flat", "map")
lang id | lang en          ganti bahasa
contact | cv               cetak email dan telepon
help                       daftar di atas
```

Masukan tak dikenal menulis `unknown · try help`. Filter yang sedang aktif dan
diterapkan lagi akan mati (toggle). Log menyimpan sepuluh baris terakhir dan
hanya menggemakan perintahnya — tidak ada baris hasil berisi hitungan.

`parse()` tidak menyentuh state — ia mengembalikan niat. Itu yang membuat
seluruh tabel perintah bisa diuji tanpa merender apa pun.

## 7. Perilaku

- **Menyaring tidak pernah menghapus.** Plate tak cocok turun ke .34, baris ke
  .45, selama 700ms. Bentuk keseluruhan pekerjaan tetap terlihat.
- **Memilih dan membuka itu dua hal.** Klik plate atau baris memilih dan mengisi
  panel; membuka butuh tombol yang dipatok, `Enter`, atau perintah `open`.
- **Orbit:** tekan lalu geser mengubah `rotZ` sebesar `dx * 0.22` mengikuti
  kursor 1:1 tanpa easing; dilepas menempel ke `[-55, -40, -25]` terdekat.
  Kamera tidak pernah bergerak sendiri.
- **Kontrak gerak:** yang digerakkan jari 1:1; yang bergerak sendiri memudar
  700ms `cubic-bezier(.22, 1, .36, 1)`; warna chip dan garis 180ms;
  `prefers-reduced-motion: reduce` memangkas semuanya jadi 1ms **dan** membuat
  `/` mendarat di tabel datar, bukan peta.

## 8. Papan ketik dan pembaca layar

Prototipe punya 23 elemen yang bisa diklik, nol `<button>`, nol `aria-`, nol
`tabindex`. Itu tidak diporting.

- Setiap plate, baris tabel, baris rail, dan chip adalah `<button>`.
- Plate memakai `aria-pressed` untuk keadaan terpilih; medan plate dibungkus
  `role="group"` dengan `aria-label` yang menjelaskan sumbunya.
- Log adalah `aria-live="polite"` supaya hasil perintah terdengar.
- Input konsol punya `<label>` tersembunyi, bukan hanya placeholder.
- `/` memfokuskan konsol, `Esc` mengosongkan filter, `Enter` di luar input
  membuka sistem terpilih.
- Fokus terlihat di kedua lapis: 2px amber di gelap, `#9C5A28` di kertas.
- Peta tidak boleh jadi satu-satunya jalan: chip lewati-peta ada di urutan tab
  paling awal.

## 9. Warna — keputusan yang berubah

Handoff membalik lapis halaman baca: **halaman baca ikut lapis gelap**, dan
lapis kertas hanya dipakai dokumen mobile. Sekarang kebalikannya (kanvas gelap,
halaman baca kertas).

Konsekuensi: di HP, mengetuk sistem berarti berpindah dari kertas ke gelap.
Prototipe memang begitu, dan handoff menyebut warnanya final.

**Diputuskan 2026-09-03: ikut handoff — halaman baca gelap.** Lapis kertas
tinggal dipakai dokumen mobile. Konsekuensinya seluruh komponen `work/` berpindah
token: `paper`→`ground`, `ink`→`ground-ink`, `rule`→`ground-rule`, dan
`amber-ink`→`amber` (di atas gelap kontrasnya 5.33:1, aman). Kartu OG dan
halaman kontak ikut lapis gelap supaya tidak ada satu halaman kertas yang
tertinggal sendirian.

Aturan amber tidak berubah dan tidak bisa ditawar: `#C97B3F` hanya di atas
gelap; di atas kertas `#9C5A28`.

## 10. Tipografi

Bricolage Grotesque (display) + Inter (teks) + JetBrains Mono (label, data, log,
konsol), semuanya lewat `next/font/google`.

Fraunces dan Jersey 15 dibuang, beserta token `--font-pixel`. Handoff melarang
keduanya secara eksplisit: serif display + krem hangat adalah template yang
sedang dihindari, dan kesan "game" datang dari chrome HUD, bukan dari font
piksel.

Tracking negatif wajib di display: `-.02em` di ukuran kecil, `-.03em` sampai
`-.035em` di 26px ke atas.

## 11. Yang dihapus

`src/components/canvas/` seluruhnya (Canvas, Node, GroupNode, Edges,
PreviewPanel, CanvasChrome, TechLegend, MobileList) beserta testnya,
`src/lib/canvas/viewport.js`, `src/lib/canvas/tech.js` (pindah ke
`src/lib/data/tech.js`), `OTHERS_NODE`, `CENTER_NODE`, `NODE_RADIUS`, `WORLD`,
serta field `position`, `cluster`, dan `related` di setiap project.

Pelajaran dari komponen itu ikut pindah, bukan ikut terbuang: jangan menangkap
pointer di `pointerdown` (klik plate akan mendarat di latar), dan `overflow:
hidden` tidak menghentikan browser menggulir kotak saat fokus berpindah.

## 12. Pengujian

- **Murni:** tabel perintah (`parse` untuk tiap baris di §6, termasuk masukan
  tak dikenal dan toggle), predikat filter, tata letak plate (tidak ada plate
  yang bertumpuk di baris yang sama), `fitScale` pada 1440×800 dan 1024×640.
- **Data:** `blurb` dua bahasa lengkap untuk kedelapan sistem, setiap nilai chip
  `stack:` benar-benar dipakai project, dan tidak ada field `hard` maupun
  `notMine` yang hidup kembali diam-diam.
- **Komponen:** memilih ≠ membuka; sistem tanpa halaman menolak dibuka dan
  menyebut alasannya; menyaring meredupkan dan tidak menghapus; chip dan
  ketikan menghasilkan baris log yang sama; Tab mencapai setiap plate; tidak ada
  hitungan jumlah sistem yang muncul di layar.
- **Diverifikasi mata, bukan test:** keterbacaan label di lapisan 3D, orbit
  yang tidak menyentak, dokumen di 360px, halaman baca tanpa JavaScript.

Klik sintetis tidak dipercaya untuk apa pun yang menyangkut pointer — itu
pernah membuat 86 test hijau sementara setiap klik nyata mendarat di latar.

## 13. Urutan

Dasar dulu, peta terakhir. Situs tidak boleh berada dalam keadaan rusak di
antara fase.

1. Token warna, font, dan pembuangan token lama
2. Turunan data (`tech.js`), pembuangan field kanvas
3. Tabel datar + halaman baca — jalan tanpa JS, ini fondasinya
4. Dokumen mobile + filter sheet
5. Chrome cangkang: top bar, rail, panel, status bar
6. Peta isometrik: plate, sumbu, orbit, skala-agar-muat
7. Konsol + papan ketik
8. Pembersihan: hapus `canvas/`, verifikasi mata, perbarui PROGRESS

## 14. Risiko

- **Teks di lapisan 3D bisa buram.** `rotateX(56deg)` memaksa rasterisasi;
  label dilawan-rotasi supaya tegak, tapi ketajamannya baru terbukti di layar
  sungguhan. Fase 6 adalah titik di mana ini ketahuan — dan kalau gagal, tabel
  datar sudah berdiri sebagai pengganti yang lengkap.
- **Dua screenshot masih kosong** (HRIS, PSB). Keadaan kosongnya dirancang;
  jangan diisi gambar stok.
- **Peta hanya untuk ≥1024px.** Sebagian besar pengunjung dari HP tidak akan
  pernah melihatnya. Dokumen harus berdiri sendiri sebagai porto yang utuh,
  bukan sebagai permintaan maaf.
- **Konsol bisa jadi mainan yang tak tersentuh.** Chip menjalankan perintah yang
  sama, jadi tidak ada jalan buntu kalau tak seorang pun mengetik.
