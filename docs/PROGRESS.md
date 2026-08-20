# Portfolio — Status Kerja

> Dibaca di awal sesi baru. Menggantikan catatan redesign lama (9 section scroll), yang sudah tidak berlaku.

## Bentuk sekarang

Porto berdiri di **dua lapis**.

- `/` — kanvas gelap yang digeser. Hanya project ber-`tier: 'full'` yang jadi simpul; empat project kecil berdiri di balik satu simpul "Project lain" bergaris putus-putus. Garis antar simpul menandai hubungan nyata, bukan hiasan. Di bawah 768px kanvas diganti daftar vertikal yang dikelompokkan per klaster klien.
- `/kerja/[slug]` — halaman kertas krem untuk dibaca dan dibagikan. Dibuat statis dari project ber-`tier: 'full'`, dengan anatomi tujuh blok yang tetap.
- `/kontak` — kontak singkat plus unduh CV.

Stack kembali sebagai **legenda/filter di kanvas** (kiri bawah): tiap baris dihitung dari `project.tech`, klik satu nama meredupkan simpul dan garis yang tidak memakainya. Riwayat kerja, pendidikan, dan grid ikon skill **dibuang**, bukan disembunyikan — sudah ada di CV, dan di Indonesia HRD membaca CV sementara tim teknis yang membuka porto. Porto ini ditulis untuk yang kedua.

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
| Kanvas, simpul, garis, panel, legenda stack, daftar mobile | `src/components/canvas/` |
| Simpul "Project lain" (posisi, nama, catatan) | `OTHERS_NODE` di `src/lib/data/canvas.js` |
| Turunan stack dari `project.tech` | `src/lib/canvas/tech.js` |
| Halaman baca dan bagian-bagiannya | `src/components/work/` |
| Metadata akar, JSON-LD, font | `src/app/layout.js`, `src/components/JsonLd.jsx` |
| Kartu OG 1200x630 | `src/app/opengraph-image.jsx` |

Field project yang berbeda per bahasa selalu berbentuk `{ id: '...', en: '...' }`. Field yang selalu string (`tech`, `client`, `year`, `slug`) tidak dibungkus.

`tier` menentukan bentuk: `full` dapat simpul di kanvas dan halaman `/kerja/[slug]`; `brief` tidak punya simpul sendiri — ia berada di balik simpul "Project lain" dan hanya punya panel pratinjau (di mobile tetap muncul sebagai kartu). `access` (`public` / `internal` / `none`) menentukan badge yang ditulis terang-terangan, bukan disamarkan.

## Yang dihapus

Sembilan komponen section lama, `CaseStudyModal`, `Nav` lama, tombol tema gelap/terang, serta `experience.js`, `education.js`, dan `skills.js`. Kamus `src/lib/i18n/{id,en}.js` dipangkas tinggal grup `nav` dan `ui`. Token `cream`/`forest` diganti `paper`/`ground`.

## Antrean 2026-08-20: selesai

1. **Bug chrome menindih panel — selesai.** Panel naik ke `z-40`; chrome memudar dan jadi `inert` selama panel terbuka. Verifikasi browser menemukan sebab kedua: `.canvas-root` yang `overflow-hidden` tetap bisa digulir oleh browser saat fokus pindah ke simpul (dunia yang ditransform menyumbang ~45px overflow), dan semua yang `absolute` di dalamnya ikut naik — tombol tutup mendarat di y=-28. Chrome dan panel sekarang `fixed` ke viewport, dan kotak kanvas menolak scroll.
2. **Kurasi kanvas — selesai.** Empat simpul project + satu simpul "Project lain" berisi empat build kecil. Panelnya berupa daftar; membuka satu menampilkan pratinjaunya dengan tautan kembali. Daftar mobile tetap menampilkan kedelapan.
3. **Stack — selesai.** Legenda filter di kiri bawah, diturunkan dari `project.tech` lewat `primaryTech()` (teknologi yang cuma dipakai sekali tidak masuk legenda). Klik = simpul & garis yang tidak memakainya turun ke opacity 0.22.
4. **Tipografi — selesai untuk lapis kanvas.** Jersey 15 (OFL) untuk nama simpul, label tengah, dan chrome. Caption tetap mono, halaman baca tetap serif. Perbandingan enam muka piksel: artifact "Pixel Type on the Canvas".

## Status task

Task 1–14 dari rencana selesai, ditambah keempat antrean di atas. Yang tersisa tetap **Task 15: lihat dengan mata sendiri** — `npm run dev`, lalu daftar periksa di akhir rencana: seret 1:1, zoom yang menahan titik di bawah kursor, detail muncul saat zoom masuk, "Tampilkan semua", panel yang memudar bukan menyentak, Tab lewat semua simpul dan legenda stack, lebar di bawah 768px, dan membuka `/kerja/rsu-nirwana-web` langsung tanpa tahu-menahu soal kanvas.

## Keadaan sekarang

- **103 test hijau.**
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

Sembilan simpul bisa terasa sepele, bukan seperti peta. Sejak 2026-08-20 petanya tinggal lima simpul (empat project + satu pintu), dengan legenda stack sebagai alasan kedua untuk memakainya. Penawar lain tetap: garis hubungan yang bermakna, label informatif, detail bertambah saat zoom. Kalau tetap gagal — Task 15 memang menanyakan ini terus terang — kanvas dibuang dan daftar berkelompok dipakai di semua lebar. Halaman bacanya tetap hidup, jadi mundur berarti kehilangan satu komponen, bukan proyeknya.


## Antrean berikutnya (dari sesi 2026-08-20, urut prioritas)

### 1. Lihat dengan mata sendiri (belum bisa dilakukan sesi ini)
Alat browser sesi 2026-08-20 tidak menampilkan panel Browser, jadi tidak ada frame yang dikomposit: screenshot gagal dan `requestAnimationFrame` beku, sehingga semua fade tidak bisa dinilai. Yang sudah terbukti hanya perilaku: klik pointer sungguhan, hit-test, dan geometri. **Yang masih harus dilihat mata:** ukuran Jersey 15 di simpul kecil dan di bar panduan, keterbacaan legenda stack di atas latar titik-titik, dan apakah fade chrome saat panel terbuka terasa halus.

### 2. Tipografi halaman baca
Lapis kanvas sudah punya wajah; halaman kertas masih Fraunces + Inter. Kalau porto masih terasa umum setelah perubahan ini, di situ sisanya.

### 3. Pertanyaan terbuka: apakah ada konsep yang lebih baik?
Belum dijawab. Peta sekarang lima simpul, bukan sembilan, jadi risiko "sembilan lingkaran terasa sepele" berkurang — tapi belum hilang. Jalan mundur yang disepakati tetap berlaku: daftar berkelompok di semua lebar, halaman baca tetap hidup.

## Pelajaran yang mahal (jangan diulang)

- **`overflow-hidden` tidak menghentikan browser.** Kotak yang isinya melebihi batas tetap bisa digulir secara programatik, dan fokus yang pindah ke elemen di luar layar memicunya. Apa pun yang harus tetap di tempat (chrome, panel) dipasang `fixed` ke viewport, bukan `absolute` di dalam kotak itu.
- **Tab yang tidak dikomposit membekukan rAF.** Di panel browser yang tidak ditampilkan, `requestAnimationFrame` tidak jalan, event `scroll` tidak terkirim, dan transisi tidak maju — `getComputedStyle` akan melaporkan nilai awal. Baca `element.style` untuk menilai keadaan yang dituju, dan jangan simpulkan soal animasi dari tab semacam itu.
- **Klik sintetis membohongi.** `fireEvent.click` dan `.click()` melewati urutan pointer. Bug `setPointerCapture` membuat setiap klik simpul mendarat di latar kanvas, dan 86 test tetap hijau. Uji syarat penyebabnya, bukan sekadar "klik berhasil".
- **Verifikasi lewat browser harus dicek kerangka koordinatnya.** Alat klik sempat memakai ukuran jendela lama, jadi klik meleset 1,74× dan menghasilkan "bukti" palsu.
- **Riwayat konsol bukan keadaan sekarang.** Hydration error yang sudah diperbaiki masih terbaca di tab lama; buktikan dengan tab baru.

## Cara lanjut

1. `git checkout portfolio-canvas-redesign`
2. `npm test` — harus 103 hijau
3. Buka rencana, kerjakan Task 15 (dilihat langsung, bukan diuji otomatis)
