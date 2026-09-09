# Portfolio — Status Kerja

> Dibaca di awal sesi baru. Menggantikan catatan kanvas simpul, yang sudah tidak berlaku sejak 2026-09-03.

**Branch:** `portfolio-canvas-redesign` (bercabang dari `main`, belum di-merge)
**Posisi sekarang:** Rencana `2026-09-03-shell-dan-dokumen.md` **selesai, Task 1–17**,
lalu `2026-09-08-gerbang-hero.md` **selesai, Task 1–8**, plus penyetelan gerbang
setelah Utsman melihatnya, lalu `2026-09-08-gerbang-punya-url.md`
**selesai, Task 1–6** (dikerjakan dengan Task 2 lebih dulu — lihat catatan di
bawah), lalu `2026-09-09-peta-hidup.md` **selesai, Task 1–11**, lalu
`2026-09-09-zoom-halaman-baca.md` **selesai, Task 1–10**, lalu
`2026-09-10-teks-dan-data-sistem.md` **selesai, Task 1–10**.
Belum di-merge ke `main`, dan belum di-deploy.

## Bentuk sekarang

Kanvas simpul sudah dihapus dari repo. Yang ada sekarang dua bentuk di atas satu
sumber data, plus halaman baca:

| URL | Lebar | Bentuk | Warna |
|-----|-------|--------|-------|
| `/` | ≥1024px, JS hidup | Gerbang, sendirian di halamannya | Gelap |
| `/sistem` | ≥1024px, JS hidup | Cangkang: peta isometrik + konsol perintah | Gelap |
| `/sistem?tampilan=datar` | sama | Cangkang, mendarat di tabel datar | Gelap |
| `/sistem?pilih=<slug>&sudut=<derajat>` | sama | Cangkang, titik pulang dari halaman baca | Gelap |
| `/` dan `/sistem` | selain itu (termasuk tanpa JS) | Dokumen: pita identitas + spine tahun + filter sheet | Kertas |
| `/kerja/<slug>` | semua lebar | Halaman baca | Gelap |
| `/kontak` | semua lebar | Halaman kontak | Gelap |

Server selalu merender **dokumen** (`PaperFallback`) di kedua URL. Gerbang atau
cangkang menggantikannya setelah mount, dan hanya kalau kedua syarat
`useShellEligible` terpenuhi — lebar dan JS. Gerak yang dikurangi **bukan lagi**
salah satunya.

Perpindahan `/` ⇄ `/sistem` membawa arah: naik untuk mundur, turun untuk masuk,
700ms, jarak `--nav-slide` `22vh`. **Utsman sudah melihatnya berjalan di
browsernya sendiri pada 2026-09-09: gesernya jalan dan `22vh` terasa pas.**

Halaman baca **tidak lagi memotong**. Blok judul di panel kanan dan blok kepala
halaman baca berbagi satu nama transisi, `sistem-aktif`, jadi yang satu tumbuh
jadi yang lain dan menyusut balik waktu pengunjung kembali. `/kontak` tetap
memotong.

Peta sekarang menjawab penunjuk. Badan plate adalah tombolnya, roda memutar
kamera, tumpukan lapis membuka waktu hover dan fokus, tepinya berubah menurut
sudut kamera, dan lapis naik berurutan waktu peta muncul. Kamera berhenti di mana
pun ia dilepas — tidak ada sudut tetap yang menariknya pulang.

Gerbang berdiri di `/` sebagai halaman penuh, bukan lapisan: nama, peran, lokasi,
rentang tahun, daftar stack, dan dua tombol yang menyebut tujuannya
(`PETA` / `DAFTAR`). Menekan tombol, huruf apa pun, atau menggulir ke bawah
memanggil `router.push` ke `/sistem`. Di lebar HP tidak ada gerbang — cuma pita
identitas kecil di atas dokumen, memakai teks yang sama persis.

**`useGatePassed` dan `sessionStorage` sudah tidak ada.** Jangan dicari, jangan
dibangkitkan lagi. Yang mengingat sekarang URL, dan itulah yang membuat tombol
kembali browser bekerja.

## Di mana isinya

| Apa | Di mana |
|-----|---------|
| Data tunggal, 9 project | `src/lib/data/projects.js` |
| Filter murni (DOM-free) | `src/lib/shell/filters.js` |
| Tabel perintah konsol | `src/lib/shell/commands.js` |
| Geometri plate & skala | `src/lib/shell/layout.js` |
| Kamera peta: seret, roda, snap | `src/lib/shell/useMapCamera.js` |
| Warna tepi lapis dari sudut | `src/lib/shell/shading.js` |
| Kosakata stack | `src/lib/data/tech.js` |
| Gerbang, halaman `/` | `src/app/page.jsx` + `src/components/shell/Gate.jsx` |
| Cangkang, halaman `/sistem` | `src/app/sistem/page.jsx` (+ `layout.js` untuk canonical) |
| Lapis kertas, dipakai dua route | `src/components/document/PaperFallback.jsx` |
| Arah perpindahan halaman | `src/lib/nav/moveTo.js` |
| Pita identitas HP | `src/components/document/PaperHead.jsx` |
| Cangkang desktop | `src/components/shell/` |
| Dokumen HP | `src/components/document/` |
| Halaman baca | `src/components/work/` |
| Rencana 17 task (selesai) | `docs/superpowers/plans/2026-09-03-shell-dan-dokumen.md` |
| Spec desain | `docs/superpowers/specs/2026-09-03-shell-dan-dokumen-design.md` |
| Rencana gerbang, 8 task (selesai) | `docs/superpowers/plans/2026-09-08-gerbang-hero.md` |
| Rencana URL gerbang, 6 task (selesai) | `docs/superpowers/plans/2026-09-08-gerbang-punya-url.md` |
| Spec gerbang | `docs/superpowers/specs/2026-09-08-gerbang-hero-design.md` |
| Rencana peta hidup, 11 task (selesai) | `docs/superpowers/plans/2026-09-09-peta-hidup.md` |
| Spec peta hidup | `docs/superpowers/specs/2026-09-09-peta-hidup-design.md` |
| Rencana zoom halaman baca, 10 task (selesai) | `docs/superpowers/plans/2026-09-09-zoom-halaman-baca.md` |
| Spec zoom halaman baca | `docs/superpowers/specs/2026-09-09-zoom-halaman-baca-design.md` |
| Seluruh teks tampil, dua bahasa | `docs/superpowers/notes/2026-09-03-seluruh-isi-tulisan.md` |
| Teks yang dibuang, diarsipkan | `docs/superpowers/notes/2026-09-03-arsip-bagian-sulit.md` |
| Rencana teks & data, 10 task (selesai) | `docs/superpowers/plans/2026-09-10-teks-dan-data-sistem.md` |
| Spec teks & data | `docs/superpowers/specs/2026-09-09-teks-dan-data-sistem-design.md` |

Keadaan: **256 test hijau, 32 berkas**, `npx eslint src --max-warnings=0` bersih.
Build terakhir yang benar-benar dijalankan masih yang sebelum rencana teks &
data; lihat catatan di bagian rencana itu.

Jumlah test turun dari 165 ke 92 di Task 15 karena 73 test kanvas ikut dihapus
bersama kodenya. Itu bukan regresi. Naik ke 142 lewat rencana gerbang, lalu
sempat turun ke 130 waktu 10 test lapisan gerbang dan 6 test `useGatePassed`
ikut dibuang, lalu naik ke 145 lewat gaya scrollbar, ke 156 lewat perpindahan
naik-turun, dan ke 201 lewat peta hidup (`shading` 7, `useMapCamera` 19,
`MapScene` 3, sisanya `Plate`), lalu turun ke 197 waktu snap kamera dibuang —
tiga test snap dan satu test `settling` hilang bersama fiturnya. Bukan regresi.
Naik ke 223 lewat zoom halaman baca, lalu ke 256 lewat teks & data sistem
(`projects` 14, `AxisLegend` 4, `LogRail` 5, `layout` 4, `MapScene` 4,
`FlatTable` 1, `ProjectView` 1).

## Larangan yang tidak bisa ditawar

- **Tidak ada angka jumlah di layar.** Tidak ada "8 sistem", "4 dari 8 tampil",
  atau hitungan pemakaian teknologi. Umpan balik filter cuma kata `TERSARING`.
- **Tidak ada penanda `langka` / `dasar`.** Stack tampil sebagai daftar nama.
  `parseCommand('--rare')` sengaja dijawab `unknown`, dan ada test yang menjaga itu.
- **Tidak ada bagian "yang sulit" dan "di luar lingkup"** di halaman baca.
- **Tidak ada angka dampak.** Tidak ada persen, tidak ada jumlah pengguna.
- **HRIS RSU Nirwana tidak punya payroll atau modul keuangan.** Jangan pernah
  disebut. **SIGAP (BPN) berbeda, dan itu bukan pengecualian yang lupa
  dihapus:** ia memang mencatat serta menghitung penggajian bulanan dari
  absensi, lembur dan cuti, tetapi tidak menjalankan pembayaran — dan kalimat
  konteksnya menyebut batas itu sendiri. Ada test yang menjaganya. Jangan
  menghapus kata "penggajian" dari SIGAP karena membaca larangan ini sekilas.
- **Amber ada dua.** `#C97B3F` hanya di atas gelap; di atas kertas wajib
  `#9C5A28`. Di lapis kertas, `#C97B3F` cuma 2.8:1 — itu sebabnya
  `document/AccessTick.jsx` ada dan terpisah dari `work/AccessBadge.jsx`.
- **Nama SIMRS rumah sakit tidak ditulis di layar.** Yang tampil "SIMRS open
  source". Ia memang open source dan dipakai apa adanya, bukan produk vendor —
  tapi namanya tetap tidak disebut. Ada test yang menjaganya.
- **Prosa halaman baca berbahasa baku, dan tanpa kata "saya".** Kalimat lurus,
  tanpa tanda pisah yang mendramatisir dan tanpa personifikasi. Alasannya
  disebut Utsman sendiri pada 2026-09-09: prosa bergaya membuat halaman
  terbaca seperti tulisan mesin. Ada test yang menjaga keduanya.
- **Ada dua SOAP.** Protokol `SOAP` sudah keluar dari stack IDRG karena
  memang tidak dipakai. "Pencatatan SOAP" di butir RME adalah singkatan rekam
  medis — subjektif, objektif, asesmen, plan — dan tetap tinggal. Jangan
  disapu bersama.
- **Tidak ada kalimat headline.** Panel kanan desktop berisi blok catatan.
- **Vitest & ESLint mengecualikan `.claude/**`.** Jangan "diperbaiki".
- **`meta.siteUrl` satu-satunya sumber URL kanonik.** Sudah diperiksa: tidak ada
  URL yang ditulis ulang di tempat lain.
- **Pseudo-element view-transition harus dinolkan sendiri di blok
  `prefers-reduced-motion`, dan yang BERNAMA butuh barisnya sendiri lagi.**
  Selektor `*` tidak menjangkau `::view-transition-*` sama sekali, dan aturan
  `(root)` tidak menjangkau `(sistem-aktif)`. Tiga lapis, tiga blok. Menghapus
  salah satunya membuat pengunjung yang meminta gerak dikurangi tetap kena
  animasi 700ms penuh, tanpa error apa pun.

## Keputusan yang mahal kalau dilupakan

- **Slug tidak berubah.** `rsu-nirwana-web`, `idrg-bridging`, `hris-nirwana`,
  `rme`, `psb-walisongo`, dan sejak 2026-09-10 juga `sigap-bpn` dan `simaset`.
  **Tujuh** halaman baca. `aset-kphl` dan `sertifikasi-benih` sempat diganti
  jadi `simaset` dan `sibenih` — itu aman justru karena dikerjakan waktu
  keduanya masih tier ringkasan dan belum punya URL. Sesudah punya halaman,
  tidak boleh lagi.
- **`AxisLegend` tidak ikut ke view `DATAR`.** Ia hidup di dalam `MapScene`,
  jadi peredupan di tabel datar memang tanpa keterangan. Itu pilihan sadar:
  catatan kaki rail dulu memikulnya, dan sejak 2026-09-10 ia pindah tugas
  menerangkan daftarnya sendiri. Harganya disebutkan ke Utsman dan diterima.
  Kalau nanti terasa, jalan keluarnya menaruh satu kata di dekat chip filter,
  bukan mengembalikan catatan kaki lama.
- **Garis tahun di peta tidak punya lebar tetap.** `rowExtents()` di
  `layout.js` yang menentukannya, dari kursor yang sama dengan
  `platePositions`, dan label berdiri 35px sesudah ujung baris. Angka mati
  `700` dan `710` sudah dibuang. Kelegaan 35px itu terukur, bukan selera: 20px
  membuat label 2026 tertimpa label plate, dan itu terlihat di browser
  sungguhan pada 2026-09-10.
- **Prosa berasal dari repo**, bukan dari prototipe.
- **Stack PSB:** `Laravel, JavaScript, MySQL, Fonnte`. Bukan Livewire.
- **HRIS memakai TensorFlow.js**, bukan MediaPipe. Arsip teks lama masih
  menyebut MediaPipe dan tidak boleh dipakai apa adanya.
- **Tiga tahun, bukan empat.** Freelance sejak akhir 2023.
- **Kontrak gerak terbelah.** Yang digerakkan jari 1:1 tanpa easing; yang
  bergerak sendiri memudar 700ms `cubic-bezier(.22, 1, .36, 1)`; warna 180ms;
  `prefers-reduced-motion` memangkas ke 1ms. Sejak 2026-09-08 ia **tidak lagi**
  menahan cangkang.
- **Kamera peta tidak pernah bergerak sendiri, dan tidak punya sudut tetap.**
  Roda dan seret sama-sama berhenti persis di tempat jari melepasnya. Grup peta
  karena itu tidak punya `transition` sama sekali — tidak ada yang perlu
  dianimasikan.
  `snapRotation()` dan `CAMERA_ANGLES` **sudah dihapus dari `layout.js`**, bukan
  sekadar tidak dipakai. Dulu kamera menyentak ke `-55/-40/-25` waktu dilepas;
  Utsman melihatnya berjalan pada 2026-09-09 dan menolaknya — kalau gulirannya
  balik lagi, gulirannya tidak ada gunanya. Alasan yang sama berlaku untuk seret,
  jadi keduanya dibebaskan sekaligus; membebaskan roda saja akan membuat seret
  kecil sesudah menggulir jauh menarik kamera balik dengan lompatan besar.
  Jangan dikembalikan tanpa alasan baru.
- **Tanpa JavaScript `/` **dan** `/sistem` harus tetap utuh.** Sudah diverifikasi
  lewat `curl`: HTML server keduanya memuat sembilan sistem dan tujuh tautan
  `/kerja/*`. Server merender `PaperFallback`, bukan gerbang.
- **Satu tautan kembali saja di halaman baca.** Kepala yang memegangnya; kaki
  dulu punya tautan kedua ke tujuan yang sama, dan dua tautan dengan nama
  aksesibel identik itu kebisingan di daftar tautan.
- **`LangSwitcher` tidak punya prop `tone` lagi.** Satu lapis.
- **Cangkang mount untuk semua lebar ≥1024, apa pun setelan geraknya.** `calm`
  cuma memilih view awal (`list` bukan `map`), dan gerbang membiarkan pilihan itu
  ditolak lewat tombol `PETA`. Menahan cangkang berarti mengurangi antarmuka,
  padahal yang diminta pengunjung adalah gerak yang dikurangi.
- **Gerbang tidak lagi butuh `inert`.** Dulu wajib, waktu ia lapisan di atas
  cangkang. Sekarang ia halaman sendiri: tidak ada apa pun di belakangnya yang
  perlu ditutup dari `Tab` atau pembaca layar. Wrapper `display:contents` yang
  membawanya sudah hilang bersama state `leaving` dan `setTimeout(700)`.
- **URL yang mengingat, bukan `sessionStorage`.** `/` gerbang, `/sistem`
  cangkang, `?tampilan=datar` tabel datar, `?ketik=<huruf>` benih konsol yang
  langsung dihapus dari URL begitu terbaca. Ini yang membuat tombol kembali
  browser mengembalikan pengunjung ke gerbang.
- **View adalah state lokal; URL mengikuti, bukan memimpin.** `changeView`
  memanggil `router.replace` (bukan `push`) supaya `ISO / DATAR` tidak menumpuk
  riwayat. Kalau URL yang memimpin, `Shell` mount ulang dan filter serta seluruh
  rail log ikut hilang tiap ganti view.
- **`?ketik=` dibangun `URLSearchParams`, jangan disambung sendiri.** Huruf
  seperti `&` akan memotong query jadi dua. Ada test yang menjaga `%26`.
- **`/sistem` canonical-nya `/`, dan tidak masuk sitemap.** Di lebar HP kedua URL
  merender isi yang sama persis. Mendaftarkan keduanya membatalkan canonical itu.
  Route `"use client"` tidak bisa mengekspor `metadata`; `sistem/layout.js` yang
  memegangnya.
- **`PaperHead` tidak menggambar garis penutup.** `YearGroup` sudah punya
  `border-t border-paper-ink` di atas judul tahunnya.
- **Parallax gerbang: `36 / 21 / 46 / 12`, `VERTICAL = 0.9`, ke arah kursor.**
  Empat kali disetel dengan mata. `34/20/46/12` menjauhi kursor terasa seperti
  plate didorong; `15/9/20/5` tidak kelihatan kecuali diperhatikan. Yang salah
  di percobaan pertama ternyata **tandanya**, bukan besarannya — mendatar angka
  sekarang praktis sama dengan yang pertama.
- **Gerbang di atas, sistem di bawah, dan ruang itu tetap.** `↑ KEMBALI` naik,
  tombol gerbang turun. `--nav-slide` (`22vh`) dan `--nav-ease` di `globals.css`
  adalah satu-satunya tempat menyetelnya. `UTSMAN` **sengaja bukan tautan lagi** —
  satu tujuan, satu kontrol; jangan dikembalikan. Tombolnya sengaja tidak 44px:
  cangkang cuma hidup di ≥1024px dengan penunjuk presisi, dan 44px merusak baris
  setinggi 34px.
- **`slideTo` tidak boleh memanggil `startViewTransition`.** Yang menganimasikan
  adalah boundary `<ViewTransition>` di `src/app/layout.js`. Memanggilnya sendiri
  di sekitar `router.push` memotret DOM lama dua kali — React merender setelah
  potret diambil. Terukur, bukan dugaan.
- **Scrollbar 8px, samar, dan kontrasnya memang rendah.** Thumb
  `--color-rule` (`#2E3539`) yang naik ke `--color-muted-deep` (`#4C555A`) saat
  hover; di kertas `--color-paper-rule` → `--color-paper-rule-edge`. Track
  transparan, radius 0, tombol panah `display: none`. Kontras diam 1.4:1 di atas
  ground **disengaja** — ia indikator posisi, bukan kontrol, dan menggulir tetap
  lewat roda, keyboard dan sentuh. Kalau nanti terasa terlalu hilang, jalan
  mundurnya menaikkan warna diam ke `--color-muted-deep`, bukan menambah lebar
  atau memberi track warna.
- **Panah di tombol gerbang `aria-hidden`.** Nama aksesibelnya
  `LIHAT SISTEM · PETA`, tanpa "panah ke kanan" di belakang tiap label.
- **Plate adalah satu `<button>`, dan lapisannya cuma hiasan.** Dulu hanya
  `<button data-plate-label>` yang klikable. Sekarang pembungkusnya tombolnya dan
  labelnya `<span>` — satu sistem, satu kontrol, sama seperti `UTSMAN` berhenti
  jadi tautan. `<button>` **memelihara** `transform-style: preserve-3d`; sudah
  diukur di Chrome 148, anak ber-`translateZ(60px)` di dalamnya terukur sama
  persis dengan di dalam `<div>`. Jalan mundur `role="button"` tidak dipakai.
- **`Plate` menghitung `topZ`-nya sendiri, bukan memakai `position.topZ`.**
  `layout.js` menghitung `topZ` dari `LAYER_STEP` rapat (7px), padahal tumpukan
  membuka ke 11px waktu hover, fokus, atau terpilih. Label harus naik bersama
  tumpukannya, jadi `Plate` memakai `(layers - 1) * step` dari langkah yang
  sedang berlaku. `layout.js` tetap mengekspor `topZ` dan `layerStep`, dan
  keduanya tetap benar sebagai tinggi rapat — jangan dihapus.
- **Makna menang atas shading di tepi lapis atas.** `shading.js` mewarnai empat
  sisi tiap lapis dari `rotZ`, tapi lapis teratas plate publik tetap `#C97B3F`
  dan yang terpilih tetap `#E8E0D0`, menutupi keempat sisinya. Amber dan krem itu
  informasi, bukan kedalaman.
- **Stagger masuk cuma waktu mount, bukan tiap filter berubah.** Delapan plate
  yang mengulang animasi tiap chip ditekan itu kebisingan; peredupan filter sudah
  punya bahasanya sendiri (opacity 700ms).
- **Blok `prefers-reduced-motion` menolkan `transition-delay`, bukan cuma
  durasi.** Lapis plate masuk dengan delay bertingkat `40ms × index`. Tanpa baris
  itu, durasi jadi 0.01ms sementara lapis kelima tetap menunggu 160ms — gerak
  yang dikurangi berubah jadi kedipan bertahap.
- **`dragged()` menghitung jarak yang ditempuh, bukan jarak dari titik awal.**
  Seret bolak-balik yang berakhir di tempat semula tetap seret, dan kliknya tetap
  harus ditelan. Ambangnya 4px, dan `MapScene` yang memakainya — bukan `Plate`.
- **Nama transisi `sistem-aktif` dibawa blok judul `SelectedPanel`, BUKAN plate.**
  Plate sudah dicoba dan gagal: `view-transition-name` meratakan tumpukan 3D-nya
  dari 9,51px jadi 0, dan itu tidak bisa ditimpa — `getComputedStyle` tetap
  melaporkan `preserve-3d` dan `contain: none` sementara anak-anaknya sudah rata,
  dan menulis ulang `preserve-3d` di atasnya tidak mengubah apa pun. Jangan
  dicoba lagi tanpa alasan baru.
  Efek sampingnya menguntungkan: panel itu berdiri di **kedua** view, jadi morf
  ikut jalan dari tabel datar.
- **Tepat satu elemen boleh membawa satu nama transisi.** Dua pembawa membuat
  browser membatalkan transisinya diam-diam, tanpa error. Keunikannya dijaga oleh
  bentuk kode — panel merender blok itu hanya kalau ada sistem terpilih, dan
  `selected` cuma menyimpan satu slug — bukan oleh kehati-hatian. Ada test untuk
  kasus kosongnya, dan itu bukan formalitas.
- **Titik pulang ditulis `history.replaceState`, BUKAN `router.replace`.**
  Terukur di Chrome 148: `router.replace` menjadwalkan transisi yang belum sempat
  commit sebelum `push` berikutnya jalan, jadi entri riwayat lama tidak pernah
  tertimpa dan tombol kembali mendarat di `/sistem` polos. `replaceState`
  menimpanya saat itu juga, dan ia tidak memicu render — yang justru diinginkan,
  karena kita sedang meninggalkan halaman itu.
- **URL ditulis sekali di pintu, bukan tiap kali peta berubah.** Memanggil
  `replace` tiap klik roda itu berisik dan mahal. Sudut kamera sampai ke pintu
  lewat `angleRef` yang dititipkan `Shell` ke `MapScene`; menaikkannya jadi state
  `Shell` akan merender ulang rail, panel dan konsol tiap klik roda demi angka
  yang cuma dibaca sekali.
- **`zoom` satu nilai untuk dua arah.** Arah morf sudah ditentukan oleh elemen
  mana yang membawa nama di tiap sisi, jadi `unzoom` tidak ada dan sengaja
  ditolak `moveTo`. Itu pula yang membuat halaman baca aman menyetel
  `data-nav="zoom"` saat mount — satu-satunya cara melayani tombol kembali
  browser, yang tidak punya klik untuk dicegat — tanpa mengubah apa pun di tengah
  transisi masuk yang masih berjalan.
- **`← SEMUA SISTEM` memulihkan sistemnya, bukan sudut kameranya.** Halaman baca
  tahu slug-nya sendiri tapi tidak tahu sudut yang ditinggalkan, dan menaruh
  sudut di URL `/kerja/*` akan mengotori halaman yang punya canonical dan
  metadata sendiri. Tombol kembali browser memulihkan keduanya. Perbedaan ini
  diajukan ke Utsman pada 2026-09-09 dan tidak dipersoalkan; kalau nanti terasa
  janggal, jalan keluarnya membuat tautan itu memanggil `history.back()` waktu
  riwayatnya memang datang dari peta — bukan menaruh sudut di URL halaman baca.
- **`SelectedPanel` tidak lagi memegang `router`.** Pintunya satu fungsi di
  `Shell` (`openSystem`), dipanggil tautan panel dan `open` di konsol. Tautannya
  tetap `<Link href>` asli dan hanya klik kiri polos yang dicegat, supaya klik
  tengah, ctrl-klik dan "salin alamat tautan" tetap bekerja.

## Yang belum dikerjakan

Sampai screenshot masuk, `image: null` dan halaman baca menampilkan keadaan
kosong yang memang dirancang untuk itu.

### Antrean berikutnya, urut

**Antrean nomor 1 yang lama — "peta lebih interaktif" — sudah selesai
seluruhnya**, lewat `2026-09-09-peta-hidup.md` dan
`2026-09-09-zoom-halaman-baca.md`.

**Antrean nomor 1 berikutnya — "teks legenda dan catatan rail" — juga sudah
selesai**, lewat `2026-09-10-teks-dan-data-sistem.md`, dan di jalan itu ia
melebar sampai ke data sembilan sistem dan seluruh prosa halaman baca.

**1. Kontras label tahun di peta.** `#4C555A` di atas ground ±2.3:1. Palet
handoff, informasinya juga ada di legenda dan rail, jadi dibiarkan — tapi belum
pernah ditawarkan ke Utsman untuk dinaikkan.

**2. Screenshot** `hris.png` dan `psb.png` → `public/assets/img/`. Sensor dulu
kalau memuat data pegawai atau pasien asli. Ini juga dua halaman yang masih
memakai kalimat "Screenshot menyusul".

**3. Merge ke `main` dan deploy.**

**Kalau nanti terasa perlu, bukan sekarang:**

- `← SEMUA SISTEM` memanggil `history.back()` waktu riwayatnya datang dari peta,
  supaya sudut kamera ikut pulih lewat tautan itu — bukan cuma lewat tombol
  kembali browser. Sudah diajukan ke Utsman dan tidak dipersoalkan, jadi ia
  menunggu keluhan sungguhan lebih dulu.
- **`siblings()` tidak lagi kronologis.** Ia mengambil urutan dari urutan array,
  dan setelah tahun berubah pada 2026-09-10, `Sebelumnya`/`Berikutnya` di kaki
  halaman baca melompat-lompat tahun. Bukan salah, tapi sekarang tidak
  disengaja. Belum pernah dikeluhkan.
- **`open ocr` tidak lagi menemukan apa pun.** `findSystem` hanya melihat slug,
  `shortName` dan `title`, dan kata OCR sudah tidak ada di ketiganya sejak
  halaman itu bercerita tentang situsnya. Kalau nanti terasa hilang, jalan
  keluarnya menambah medan pencarian di `findSystem` — bukan menyelipkan "OCR"
  kembali ke judul yang sudah disetujui.

### Teks dan data sembilan sistem — **selesai 2026-09-10**

Sepuluh task. Berangkat dari keluhan bahwa legenda dan catatan rail kurang
informatif, dan menemukan bahwa keduanya juga **salah**: `TEPI publik` menunjuk
bagian plate yang bukan penandanya, catatan rail menyebut peta padahal ia
berdiri di kedua view dan menjanjikan sistem "didorong ke belakang" padahal
tidak ada yang bergeser, dan tajuk `SISTEM YANG TAMPIL` menjanjikan penyaringan
padahal `Shell` mengoper `systems` utuh.

Dari situ melebar ke data. Yang berubah: SIMBAS masuk sebagai project
kesembilan; `aset-kphl` jadi `simaset` dan pindah ke 2025; `sertifikasi-benih`
jadi `sibenih`; web RSU pindah ke 2026 dan berhenti bercerita tentang OCR
sendirian; SIGAP dan SIMASET naik jadi halaman baca; SOAP keluar dari IDRG;
seluruh prosa dibakukan dan kata "saya" hilang; garis tahun berhenti punya
lebar tetap.

**Terukur di browser sungguhan pada 1280×800, lewat `javascript_tool`:** chip
`stack:livewire` menyalakan empat sistem (HRIS, RME, SIGAP, SIBENIH) dan
meredupkan lima — bukan nol seperti kalau `stack:soap` dibiarkan;
`/kerja/sigap-bpn` dan `/kerja/simaset` menjawab `200` sementara
`/kerja/sibenih` tetap `404`; judul `/kerja/rsu-nirwana-web` terbaca
`Web Rumah Sakit dan Pendaftaran Pasien Baru`, dan kata "Khanza" maupun "saya"
tidak ada di halaman mana pun; sembilan plate di peta; tiga garis tahun dengan
lebar `375 / 865 / 685` — persis ujung barisnya masing-masing dikurangi 10;
ketiga label tahun di dalam layar dan tidak tertimpa apa pun.

**Satu hal ditemukan lewat mata, bukan lewat test:** kelegaan label 20px
membuat label `2026` tertimpa label plate. Dikembalikan ke 35px, sama dengan
sebelumnya, lalu diukur lagi.

**Belum dijalankan, dan jangan diklaim sudah:** `npm run build`. Ia bentrok
dengan dev server yang memegang `.next`, jadi ia menunggu Utsman. Yang harus
diperiksa waktu dijalankan: sukses, `/` dan `/sistem` tetap `○ Static`, dan
**tujuh** halaman `/kerja/*` terdaftar.

**Belum dilihat Utsman, dan itu yang tersisa:** apakah `GULIR` terasa wajar
atau lebih baik `SCROLL`; apakah `Web & Pendaftaran` dan `PSB & CBT` enak
dilihat di plate; dan apakah peta yang menyusut ±4% masih terbaca nyaman.

### Zoom halaman baca — **selesai 2026-09-09**

Sepuluh task. Task 1 sekali lagi spike, dan sekali lagi berbayar: ia **gagal**,
dan kegagalannya memindahkan nama transisi dari plate ke panel kanan sebelum
sembilan task menumpuk di atas asumsi yang salah.

Yang berubah: `slideTo` jadi `moveTo` dengan arah ketiga `zoom`; panel kanan dan
kepala halaman baca berbagi nama `sistem-aktif`; `← SEMUA SISTEM` membawa
`?pilih=<slug>`; pintu menulis `/sistem?pilih=&sudut=` ke riwayat sebelum pergi;
`/sistem` membacanya kembali waktu mount.

**Terukur di browser sungguhan pada 1280×800, lewat `javascript_tool`:** nol
pembawa nama sebelum ada yang terpilih, satu sesudahnya, satu di halaman baca,
satu lagi sesudah tombol kembali — tidak pernah dua di sisi mana pun;
`data-nav` terisi `"zoom"`; tombol kembali mendarat di
`/sistem?pilih=rsu-nirwana-web&sudut=-28` dengan kamera benar-benar di `-28deg`;
membuka `/sistem?pilih=rme&sudut=-55` langsung memberi RME terpilih dan kamera
`-55deg`; `?sudut=abc` dan `?sudut=` kosong jatuh ke `-40`; tumpukan plate tetap
bertumpuk (`spread` 9,51 → 15 waktu terpilih) karena namanya tidak ada di sana;
empat aturan CSS baru benar-benar ada di stylesheet, tiga di antaranya di dalam
blok `prefers-reduced-motion`; `curl` masih memberi lima tautan `/kerja/*` dan
`← SEMUA SISTEM` yang sudah membawa `?pilih=` bahkan tanpa JavaScript;
`npm run build` sukses dengan `/sistem` tetap `○ Static`.

**Dilihat Utsman di browsernya sendiri, 2026-09-09:** morfnya benar dan `700ms`
terasa pas. Tidak ada yang perlu disetel.

**Belum terukur, dan jangan diklaim sudah:** sisi `prefers-reduced-motion` untuk
pseudo-element bernama. Aturannya terbukti ada di stylesheet, tapi jalurnya tidak
aktif waktu diperiksa — animasi Windows sedang menyala.

### Peta hidup — **selesai 2026-09-09**

Sebelas task. Task 1 sengaja bukan fitur melainkan pengukuran: `<button>` yang
meratakan konteks 3D akan membatalkan bentuk sembilan task sesudahnya, jadi itu
diukur di browser sungguhan lebih dulu. Ternyata bertahan.

Yang berubah: `Plate` jadi satu `<button>`; `useMapCamera` memegang seret, roda,
debounce diam dan snap; `shading` mewarnai empat sisi tiap lapis dari `rotZ`;
tumpukan membuka waktu hover, fokus dan terpilih; lapis naik berurutan waktu
mount. `layout.js` tidak disentuh sama sekali.

**Terukur di browser sungguhan pada 1280×800, lewat `javascript_tool`:** plate
adalah `BUTTON` tanpa tombol bersarang dan kliknya mengisi panel; seret 100px
memberi `rotZ -18` (`-40 + 100 × 0.22`); roda `deltaY 100`
memberi `+12°` dan `deltaX 100` dengan `deltaY 8` memberi hal yang sama — sumbu
dominan menang; dua elemen bergulir di cangkang tidak ikut bergerak waktu roda
dipakai di peta; tumpukan naik
**5,49px** di layar waktu membuka; sisi terang tepi berpindah kiri → bawah waktu
kamera memutar 84°; sesudah snap dibuang, roda membawa `-40` ke `-28` dan seret
membawanya ke `-12.6` dan keduanya **tinggal di situ** tiga detik kemudian;
seret lalu klik meninggalkan panel kosong sementara tekan
tanpa geser memilih sistem; `transition-delay` lapis terbaca
`0 / 0.04 / 0.08 / 0.12 / 0.16s`.

**Belum terukur, dan jangan diklaim sudah:** rasa geraknya. Panel browser
`document.hidden`, jadi easing 700ms tidak pernah berjalan di sana. Tiga angka
menunggu mata Utsman: `WHEEL_PER_UNIT = 0.12`, `STAGGER_MS = 40`,
`STEP_OPEN = 11`. **Sudah dilihat Utsman dan disetujui pada 2026-09-09**, kecuali
satu hal: snap kamera, yang dibuang sesudah itu (lihat "Keputusan yang mahal").
Sisi `prefers-reduced-motion` untuk `transition-delay` juga
belum diuji — aturannya terbukti ada di stylesheet, tapi jalurnya tidak aktif
waktu diperiksa.

### Perpindahan naik-turun — **selesai 2026-09-09, dan sudah dilihat berjalan**

`↑ KEMBALI` di TopBar (dan `UTSMAN` berhenti jadi tautan), `slideTo` di
`src/lib/nav/`, boundary `<ViewTransition>` di layout, empat `@keyframes` di
`globals.css`. Halaman baca dan kontak juga diperbaiki di sesi yang sama:
`← SEMUA SISTEM` dulu menunjuk `/`, yang sejak gerbang pindah berarti mendarat di
nama besar dengan dua tombol, bukan di daftar sistem. Sekarang `/sistem`.

**Terukur:** React memanggil `startViewTransition` sekali per navigasi
(`calledByNext: 1`); `dataset.nav` terisi `"down"` lewat tombol `PETA` **dan**
lewat ketikan huruf `f`, `"up"` lewat `↑ KEMBALI`; empat keyframes `nav-*` dan
enam aturan `::view-transition-*` ada di stylesheet dengan durasi `0.7s`;
`--nav-slide` sampai bernilai `22vh`; `npm run build` sukses dengan `/` dan
`/sistem` tetap `○ Static`.

**Dilihat Utsman di browsernya sendiri, 2026-09-09: gesernya jalan dan `22vh`
terasa pas.** Tidak perlu disetel. Yang **masih** belum terukur cuma sisi
`prefers-reduced-motion` untuk pseudo-element view-transition — animasi Windows
sedang menyala (`UserPreferencesMask` byte 0 = `9E`) waktu diperiksa, jadi
jalurnya tidak aktif. Jangan diklaim sudah.

### Gerbang punya URL — **selesai 2026-09-09**

Enam task, dikerjakan dengan **Task 2 lebih dulu**: test Task 1 (`/sistem`)
menuntut `Shell` sudah menerima prop `view` dan `seed`, yang justru baru ada di
Task 2. Rencana yang menaruh route di depan komponennya tidak bisa hijau di
langkahnya sendiri. Urutan yang dipakai: 2 → 1 → 3 → 4 → 5 → 6.

Diverifikasi di browser sungguhan pada 1280×800, dibaca lewat `javascript_tool`:
`/` gerbang → klik `PETA` → `/sistem` peta → **tombol kembali → `/` gerbang lagi**;
tekan `f` di gerbang → `/sistem?ketik=f` yang langsung bersih jadi `/sistem`
dengan konsol berisi `f` dan fokus; pasang filter lalu `DATAR` → `/sistem?tampilan=datar`,
chip tetap `aria-pressed="true"` dan baris `$ filter client:bpn` masih di rail;
`ISO` kembali → `/sistem`, filter dan log tetap; satu kali tombol kembali dari
tabel datar mendarat di `/`, bukan di `/sistem` — `replace` memang tidak menumpuk.
Di 375px `/` dan `/sistem` sama-sama dokumen kertas.

**`useSearchParams` + `Suspense` tidak memaksa render dinamis.** Ini yang belum
terbukti waktu rencana ditulis. `npm run build` mendaftarkan `/sistem` sebagai
`○ (Static)`.

### Nasib reduced-motion — **selesai 2026-09-08**

Dulu spec bertabrakan: §2 menahan cangkang saat `calm`, §7 bilang `/` harus
"mendarat di tabel datar". Implementasi mengikuti §2, jadi pengunjung itu
kehilangan konsol, rail dan panel.

Sekarang §7 yang berlaku, lewat gerbang. Diverifikasi di browser sungguhan
dengan animasi Windows dimatikan (`byte0 = 0x90`, Chromium melaporkan
`reduce`, semua transisi terbaca `1e-05s`): gerbang **muncul** di 1280px —
dulu `/` selalu mendarat di dokumen kertas — plate tidak bergeser sama sekali,
`Enter` mendarat di tabel datar, dan tombol `ISO` tetap ada.

## Pelajaran yang mahal (jangan diulang)

### Tentang kode

- **Cache Turbopack menyajikan token basi.** Setelah mengubah `globals.css`,
  hapus `.next` dan jalankan ulang server. Di Windows perintahnya
  `Remove-Item -Recurse -Force .next` di PowerShell — `rm -rf` tidak ada di sana —
  dan server harus dihentikan lebih dulu, karena Windows mengunci berkas di dalam
  `.next` selama ia hidup.
- **Regex multi-baris menelan data.** Hapus properti per baris, lalu hitung
  ulang jumlah entri. Waktu membuang `position`/`cluster`/`related` di Task 15,
  yang dihitung: tepat 8+8+8 baris hilang, 8 slug tetap.
- **`body:has(...)` tidak cukup.** Elemen `html` tetap memakai warna lamanya,
  jadi ground gelap membayang di bawah dokumen pendek dan di area overscroll.
  Cat `html` juga.
- **`1fr` punya `min-width: auto`.** Alamat email menahan panel jadi menggulir
  ke samping. `min-w-0` di sel yang panjang.
- **ESLint menolak `setState` di badan `useEffect`.** Untuk mengukur elemen,
  pakai `ResizeObserver` — laporan pertamanya datang lewat callback, dan ia
  juga menangkap panel yang berubah ukuran sendiri.
- **Vitest tidak mau mem-parse JSX dari berkas `.js`.** Next tidak peduli;
  begitu sebuah route diuji, namanya harus `.jsx`.
- **`useRouter` butuh mock di setiap berkas test yang merender komponennya**,
  bukan cuma di test komponen itu sendiri. `Shell.test.jsx` hijau sementara
  `page.test.jsx` pecah.
- **ESLint juga menolak `setState` di efek untuk membaca `sessionStorage`.**
  Jalan keluarnya bukan menyiasati lint: `Shell` tidak pernah dirender di server
  (`page.jsx` mengembalikan dokumen sampai `useMediaQuery` bilang lebar), jadi
  gerbang tidak pernah ikut hidrasi dan `useState(read)` aman.
- **Elemen `display:contents` bisa membawa `inert`** tanpa merusak grid — cara
  termurah menutup satu subtree tanpa membungkusnya jadi kotak baru. Tidak lagi
  dipakai di sini, tapi tetap benar.
- **Fungsi yang dipakai di dalam `useEffect` butuh `useCallback`.** `destination`
  di `Gate` dipanggil oleh listener keydown; tanpa `useCallback`, ESLint menuntut
  ia masuk daftar dependensi, dan begitu masuk, listener dibongkar-pasang tiap
  render.
- **`router.replace` lalu `router.push` tidak menimpa entri riwayat.** Yang
  pertama menjadwalkan transisi yang belum commit waktu yang kedua jalan, jadi
  entri lama selamat dan tombol kembali mendarat di URL tanpa parameter. Untuk
  menstempel titik pulang sebelum pergi, pakai `window.history.replaceState` —
  ia menimpa saat itu juga dan tidak memicu render.
- **`view-transition-name` meratakan konteks 3D di bawahnya, diam-diam.**
  `getComputedStyle` tetap melaporkan `transform-style: preserve-3d` dan
  `contain: none`, dan menulis ulang `preserve-3d` di atasnya tidak menolong.
  Jangan menaruh nama transisi di dalam pohon ber-`preserve-3d`.
- **Gerbang `absolute inset-0` butuh induk yang seukuran viewport.** Waktu ia
  lapisan, `Shell` yang `relative` menyediakannya. Sebagai halaman sendiri,
  `page.jsx` harus membungkusnya `relative h-[100dvh] overflow-hidden`.

### Tentang menguji

- **Klik sintetis membohongi.** `fireEvent.click` melewati urutan pointer.
- **Assertion substring bisa lolos palsu.** Test `LangSwitcher` memeriksa
  `className` mengandung `text-ink`, padahal tombol yang tidak aktif punya
  `hover:text-ink`. Test itu hijau apa pun locale yang aktif. Baca `aria-pressed`,
  jangan menebak.
- **happy-dom tidak menata letak.** Ukuran target sentuh hanya ada di browser
  sungguhan: chip filter 38px lolos semua test sampai diukur di Task 17.
- **Baca ulang setelah navigasi.** Pembacaan `location.pathname` 900ms setelah
  klik sempat melaporkan URL lama dan membuat navigasi yang berhasil terlihat
  seperti bug.
- **Test di berkas yang mem-mock hook-nya tidak bisa menguji hook itu.**
  `page.test.jsx` mem-mock `useShellEligible`, jadi test "pengunjung
  reduced-motion dapat cangkang" di sana hijau sebelum perubahan apa pun. Guard
  yang sebenarnya ada di `useShellEligible.test.jsx`. Kalau sebuah test hijau
  sebelum implementasinya ditulis, itu bukan kabar baik.
- **`happy-dom` tidak menjalankan perilaku bawaan ketikan.** Gerbang menyerahkan
  huruf `f` ke konsol dan browser mengirim ketikan yang sama sekali lagi —
  konsol berisi `ff`. Tidak ada test yang bisa melihatnya. Yang bisa dites cuma
  `preventDefault`-nya: `fireEvent.keyDown(...)` mengembalikan `false` kalau
  handler memanggilnya.
- **Dua `border-t` bersebelahan itu benar secara DOM.** Garis dobel `PaperHead` +
  `YearGroup` cuma kelihatan di browser.
- **Rencana bisa menaruh route sebelum komponennya.** Test `/sistem` di Task 1
  menuntut prop yang baru dibuat Task 2. Baca test sebuah task sampai habis
  sebelum mulai; kalau ia menyebut sesuatu yang belum ada, urutannya yang salah,
  bukan implementasinya.
- **Test yang tidak menyetel locale mendapat bahasa `navigator`.** happy-dom
  menjawab `en-US`, jadi label konsol jadi `Command console`. Di berkas route
  (yang memakai `useLocale`, bukan prop `locale`) cocokkan dua bahasa sekaligus.
- **Nama aksesibel bisa bertabrakan lintas komponen.** `getByRole('link', { name: /UTSMAN/ })`
  menangkap juga tautan GitHub `Utsmanseff` di `StatusBar`. Cocokkan persis.
- **Chip filter yang aktif membawa `×` di labelnya.** `{ name: 'client:bpn' }`
  gagal setelah chip menyala; pakai `/^client:bpn/`.
- **happy-dom menggabungkan longhand `border-*-color` jadi shorthand.** Mencari
  `'border-top-color'` di dalam atribut `style` gagal walau kodenya benar —
  yang tersimpan `border-color: #30383c #30383c #313a3e #3e474c`. Baca lewat
  CSSOM (`el.style.borderLeftColor`), jangan mencari substring. Kerabat pelajaran
  "assertion substring bisa lolos palsu", cuma arahnya terbalik: di sini ia
  **gagal palsu**.
- **Test yang cuma memeriksa urutan pemanggilan mock bisa hijau di atas bug
  navigasi yang nyata.** `replace` lalu `push` terpanggil dalam urutan benar,
  sementara riwayat sungguhan tidak berubah sama sekali. Yang menangkapnya
  `history.back()` di browser sungguhan, bukan test.
- **`[role="group"]` tidak unik di cangkang.** Query untuk grup peta harus
  dilingkupi `[data-testid="map-pane"]`, kalau tidak ia menangkap elemen lain dan
  `getAttribute('style')` menjawab `null`.
- **Komponen yang memuat `LangSwitcher` butuh `LocaleProvider` di test.**
  `PaperHeader` terlihat seperti komponen sepele sampai `useLocale` melempar.
- **Test yang membaca posisi lapis plate harus menunggu mount.** Lapis mulai rata
  di `translateZ(0)` sampai `setTimeout(…, 0)` menyalakannya. Pembacaan langsung
  sesudah `render` melaporkan keadaan sebelum masuk, bukan keadaan akhir.

### Tentang alat browser (mahal, berulang)

- **Kerangka koordinat.** Kalau viewport diemulasi lebih besar dari panel, klik
  berbasis koordinat **maupun** `ref` mendarat di tempat lain — nol event, tanpa
  error. Samakan ukuran (`preset: desktop`) sebelum menguji interaksi, atau
  pasang penghitung event untuk membuktikan klik benar-benar mendarat.
- **Preset `mobile` menggantungkan klik.** Emulasi sentuh membuat `left_click`
  timeout 30 detik, sementara screenshot, scroll dan JS tetap jalan — persis
  seperti halaman yang rusak. Uji interaksi di lebar non-sentuh.
- **`key: "Return"` tidak dikenal**, diam-diam tidak melakukan apa-apa. Pakai
  `"Enter"`. Nama tombol `/` ditulis `"/"`, bukan `"slash"`.
- **Badge devtools Next menutupi pojok kiri bawah**, tepat di atas tombol
  `⌃ FILTER`. Sembunyikan `nextjs-portal` sebelum menguji di sana.
- **`prefers-reduced-motion` ikut setelan OS, bukan cuma browser.** Sumbernya
  "Animation effects" Windows (`HKCU:\Control Panel\Desktop\UserPreferencesMask`,
  bit `0x02` pada byte 0; `0x9E` menyala, `0x90` mati). Waktu mati, semua
  transisi terbaca `1e-05s`. Periksa setelan itu sebelum menyimpulkan ada yang
  rusak — dan itu perlu **PowerShell**, bukan Bash: `$m = (Get-ItemProperty ...)`
  langsung parse error di Bash.
  Dulu setelan ini menahan cangkang supaya tidak mount; sejak 2026-09-08 tidak
  lagi. Sekarang ia cuma memilih view awal.
- **Buffer console lintas sesi.** Error 404 dan WebSocket dari server yang sudah
  dimatikan tetap muncul di pembacaan berikutnya. Periksa daftar network sebelum
  mempercayainya.
- **Panel browser di sesi 2026-09-08 cuma 559px.** Di bawah 1024, jadi cangkang
  tidak pernah mount di ukuran asli panel. Supaya muncul harus diemulasi
  1280×800 — dan begitu emulasi melebihi panel, `hover` dan `click` berbasis
  koordinat mendarat di tempat lain (nol event, tanpa error) **dan** screenshot
  tidak bisa dipercaya untuk menilai ukuran. Verifikasi cangkang di sini lewat
  `javascript_tool`: `dispatchEvent` + baca `style.transform` / `getBoundingClientRect`.
  Penilaian rasa gerakan tetap harus di browser Utsman sendiri.
- **`hover` butuh screenshot lebih dulu.** Tanpa satu `computer{action:"screenshot"}`
  di batch yang sama, `hover` berbasis koordinat langsung error.
- **`requestAnimationFrame` tidak jalan waktu panel browser tersembunyi.** Skrip
  yang menunggu rAF menggantung sampai timeout 45 detik. Untuk menguji kode
  ber-rAF, ganti dulu: `window.requestAnimationFrame = cb => setTimeout(cb, 0)`.
  Jangan pakai override **sinkron** (`cb => { cb(); return 1 }`) — callback jalan
  sebelum `frame = requestAnimationFrame(...)` selesai di-assign, jadi `frame`
  tinggal terisi dan `if (frame) return` memblokir semua event berikutnya. Dua
  pembacaan pertama saya salah gara-gara ini.
- **View Transitions dibatalkan diam-diam waktu panel browser tersembunyi.**
  `document.hidden` tetap `true` di panel sesi ini walau sudah ditampilkan, dan
  tiap transisi berakhir `InvalidStateError: Transition was aborted because of
  invalid state`. `document.getAnimations()` selalu kosong — yang terbaca seperti
  CSS yang tidak berlaku, padahal kabelnya benar. Kerabat pelajaran rAF di bawah.
  Yang masih bisa dibuktikan tanpa panel terlihat: React memanggil API-nya
  (tempel penghitung di `document.startViewTransition`), `dataset.nav` terisi, dan
  aturan CSS-nya benar-benar ada — telusuri `document.styleSheets` dan cari
  `KEYFRAMES_RULE` bernama `nav-*` beserta selektor `::view-transition-*`.
- **Flag `experimental.viewTransition` saja tidak menganimasikan apa pun.** Next
  tidak membungkus navigasi sendiri (`calledByNext: 0`); yang memicu React adalah
  `<ViewTransition>` di layout. Dan dengan flag itu menyala, React aplikasi
  ditukar jadi **19.3.0-canary** — ekspornya bernama `ViewTransition`, tanpa
  awalan `unstable_`, berbeda dari 19.2.3 yang ada di `node_modules/react`.
- **`scrollbar-color` mematikan seluruh blok `::-webkit-scrollbar` di elemen yang
  sama.** Diukur di Chrome 148: elemen uji yang sama memberi 15px tanpa aturan,
  8px dengan webkit saja, tapi **10px** kalau keduanya ditulis berdampingan —
  persis angka standar-saja. Gejalanya diam, tanpa error. Karena itu properti
  standar di `globals.css` dibungkus `@supports not selector(::-webkit-scrollbar)`:
  Chrome menjawab `CSS.supports('selector(::-webkit-scrollbar)')` dengan `true`
  dan melewatinya, Firefox menjawab `false` dan mendapatkannya. Sisi Firefox
  belum pernah diukur — tidak ada Firefox di mesin ini.
- **Scrollbar jendela digambar dari elemen akar.** `html:has(x) ::-webkit-scrollbar-thumb`
  dengan spasi cuma mengenai scrollbar milik anak-anak `html`, jadi batang yang
  benar-benar dilihat pengunjung tidak ikut berubah. Terukur di `/` lebar 900:
  `html` masih `#2E3539` sementara `body` dan isi dokumen sudah `#D9D0BC`.
  Butuh varian tanpa spasi juga. Bentuk lain dari pelajaran `body:has(...)` di
  atas.
- **Hover pada scrollbar tidak bisa diukur dari alat ini.**
  `::-webkit-scrollbar-thumb:hover` bukan elemen DOM — tidak ada yang bisa
  disasar `dispatchEvent`, dan `getComputedStyle` tidak menerima `:hover`. Yang
  bisa dibuktikan cuma aturannya ada di berkas.
- **Pane cangkang tidak menggulir di layar tinggi normal.** Di 1280×800 rail log
  dan panel kanan muat seluruhnya, jadi `scrollable: false` dan `barWidth: 0` —
  itu benar, bukan aturan yang gagal. Untuk mengukurnya, kecilkan tinggi viewport
  (1280×420 cukup). Dan `offsetWidth - clientWidth` pada `<aside>` panel kanan
  melaporkan **1**, itu `border-l`-nya, bukan scrollbar.
- **Satu rAF yang tergantung meracuni sisa sesi halaman itu.** Setelah skrip
  ber-rAF timeout, muat ulang halaman sebelum mengukur lagi.
- **Transisi CSS biasa juga tidak beranjak di panel tersembunyi.** Bukan cuma
  View Transitions dan rAF. Gejalanya menipu: atribut `style` sudah berisi nilai
  baru sementara `getComputedStyle` tetap melaporkan nilai lama selamanya, jadi
  perubahan yang benar terbaca seperti kode yang tidak jalan. Untuk mengukur
  posisi akhir, matikan dulu transisinya (`el.style.transition = 'none'`,
  paksa reflow dengan `void el.offsetWidth`), ukur, lalu kembalikan.
- **`setTimeout` di-throttle di panel tersembunyi.** Terukur: tidur yang diminta
  520ms memakan 1206ms. Jeda tunggu dalam skrip pengukuran harus dilebihkan dua
  sampai tiga kali, dan pembacaan yang "gagal" sekali sering cuma mendahului
  timernya — baca ulang sebelum menyimpulkan ada yang rusak.
- **`pointerenter` mentah tidak sampai ke React.** React menurunkan
  `onPointerEnter`/`onPointerLeave` dari `pointerover`/`pointerout` yang
  menggelembung. `dispatchEvent(new PointerEvent('pointerenter'))` tidak
  melakukan apa-apa, tanpa error. Pakai `pointerover` dan `pointerout`.

## Cara lanjut

1. `git checkout portfolio-canvas-redesign`
2. `npx vitest run` — harus 223 hijau, `npx eslint src --max-warnings=0` bersih
3. Antrean ada di bagian **"Antrean berikutnya, urut"** di atas. Nomor 1 sekarang
   teks legenda dan catatan rail — Utsman menyebut keduanya kurang informatif.
   Belum dispec.

Aturan kerja yang berlaku di sesi ini dan sebaiknya diteruskan: TDD (test dulu,
lihat gagal, baru implementasi), commit tiap task, verifikasi di browser
sungguhan bukan cuma test, jangan mengarang angka dampak.
