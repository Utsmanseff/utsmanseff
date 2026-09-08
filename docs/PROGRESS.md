# Portfolio — Status Kerja

> Dibaca di awal sesi baru. Menggantikan catatan kanvas simpul, yang sudah tidak berlaku sejak 2026-09-03.

**Branch:** `portfolio-canvas-redesign` (bercabang dari `main`, belum di-merge)
**Posisi sekarang:** Rencana `2026-09-03-shell-dan-dokumen.md` **selesai, Task 1–17.**
Belum di-merge ke `main`, dan belum di-deploy.

## Bentuk sekarang

Kanvas simpul sudah dihapus dari repo. Yang ada sekarang dua bentuk di atas satu
sumber data, plus halaman baca:

| Lebar | Bentuk | Warna |
|-------|--------|-------|
| ≥1024px, JS hidup, gerak tidak dikurangi | Cangkang: peta isometrik + konsol perintah | Gelap |
| Selain itu (termasuk tanpa JS) | Dokumen: spine tahun + filter sheet | Kertas |
| `/kerja/<slug>` | Halaman baca, semua lebar | Gelap |
| `/kontak` | Halaman kontak | Gelap |

Server selalu merender **dokumen**. Cangkang menumpuk di atasnya setelah mount,
dan hanya kalau ketiga syarat `useShellEligible` terpenuhi.

## Di mana isinya

| Apa | Di mana |
|-----|---------|
| Data tunggal, 8 project | `src/lib/data/projects.js` |
| Filter murni (DOM-free) | `src/lib/shell/filters.js` |
| Tabel perintah konsol | `src/lib/shell/commands.js` |
| Geometri plate & skala | `src/lib/shell/layout.js` |
| Kosakata stack | `src/lib/data/tech.js` |
| Cangkang desktop | `src/components/shell/` |
| Dokumen HP | `src/components/document/` |
| Halaman baca | `src/components/work/` |
| Rencana 17 task (selesai) | `docs/superpowers/plans/2026-09-03-shell-dan-dokumen.md` |
| Spec desain | `docs/superpowers/specs/2026-09-03-shell-dan-dokumen-design.md` |
| Seluruh teks tampil, dua bahasa | `docs/superpowers/notes/2026-09-03-seluruh-isi-tulisan.md` |
| Teks yang dibuang, diarsipkan | `docs/superpowers/notes/2026-09-03-arsip-bagian-sulit.md` |

Keadaan: **92 test hijau**, `npx eslint src --max-warnings=0` bersih,
`npm run build` sukses dengan lima halaman `/kerja/*`.

Jumlah test turun dari 165 ke 92 di Task 15 karena 73 test kanvas ikut dihapus
bersama kodenya. Itu bukan regresi.

## Larangan yang tidak bisa ditawar

- **Tidak ada angka jumlah di layar.** Tidak ada "8 sistem", "4 dari 8 tampil",
  atau hitungan pemakaian teknologi. Umpan balik filter cuma kata `TERSARING`.
- **Tidak ada penanda `langka` / `dasar`.** Stack tampil sebagai daftar nama.
  `parseCommand('--rare')` sengaja dijawab `unknown`, dan ada test yang menjaga itu.
- **Tidak ada bagian "yang sulit" dan "di luar lingkup"** di halaman baca.
- **Tidak ada angka dampak.** Tidak ada persen, tidak ada jumlah pengguna.
- **HRIS tidak punya payroll atau modul keuangan.** Jangan pernah disebut.
- **Amber ada dua.** `#C97B3F` hanya di atas gelap; di atas kertas wajib
  `#9C5A28`. Di lapis kertas, `#C97B3F` cuma 2.8:1 — itu sebabnya
  `document/AccessTick.jsx` ada dan terpisah dari `work/AccessBadge.jsx`.
- **SIMRS Khanza bukan vendor.** Open source, dipakai apa adanya.
- **Tidak ada kalimat headline.** Panel kanan desktop berisi blok catatan.
- **Vitest & ESLint mengecualikan `.claude/**`.** Jangan "diperbaiki".
- **`meta.siteUrl` satu-satunya sumber URL kanonik.** Sudah diperiksa: tidak ada
  URL yang ditulis ulang di tempat lain.

## Keputusan yang mahal kalau dilupakan

- **Slug tidak berubah.** `rsu-nirwana-web`, `idrg-bridging`, `hris-nirwana`,
  `rme`, `psb-walisongo`. Lima halaman baca.
- **Prosa berasal dari repo**, bukan dari prototipe.
- **Stack PSB:** `Laravel, JavaScript, MySQL, Fonnte`. Bukan Livewire.
- **HRIS memakai TensorFlow.js**, bukan MediaPipe. Arsip teks lama masih
  menyebut MediaPipe dan tidak boleh dipakai apa adanya.
- **Tiga tahun, bukan empat.** Freelance sejak akhir 2023.
- **Kontrak gerak terbelah.** Yang digerakkan jari 1:1 tanpa easing (grup peta
  sengaja tidak punya `transition`); yang bergerak sendiri memudar 700ms
  `cubic-bezier(.22, 1, .36, 1)`; warna 180ms; `prefers-reduced-motion`
  memangkas ke 1ms **dan** menahan cangkang supaya tidak mount.
- **Tanpa JavaScript `/` harus tetap utuh.** Sudah diverifikasi lewat `curl`:
  HTML server memuat delapan sistem dan lima tautan `/kerja/*`.
- **Satu tautan kembali saja di halaman baca.** Kepala yang memegangnya; kaki
  dulu punya tautan kedua ke tujuan yang sama, dan dua tautan dengan nama
  aksesibel identik itu kebisingan di daftar tautan.
- **`LangSwitcher` tidak punya prop `tone` lagi.** Satu lapis.

## Yang belum dikerjakan

- **Merge ke `main` dan deploy.** Belum dilakukan sama sekali.
- Screenshot HRIS → `public/assets/img/hris.png`
- Screenshot PSB → `public/assets/img/psb.png`

Sampai masuk, `image: null` dan halaman menampilkan keadaan kosong yang
dirancang. Sensor dulu kalau memuat data pegawai atau pasien asli.

### Tugas 1 — pengunjung reduced-motion di desktop (belum diputuskan)

**Ditemukan 2026-09-08.** Animasi Windows di mesin Utsman sempat mati
(`ClientAreaAnimation = False`), dan Chromium menerjemahkan itu jadi
`prefers-reduced-motion: reduce`. Akibatnya `/` selalu mendarat di dokumen dan
peta seolah tidak pernah ada. Setelah animasi dinyalakan, **peta jalan normal
di browser Utsman** — jadi tidak ada bug di peta.

Yang tersisa keputusan produk: pengunjung lain yang animasinya mati akan dapat
dokumen, bukan cangkang. Mereka kehilangan peta, konsol, dan rail log.

Spec bertabrakan dengan dirinya sendiri di sini:

| Spec | Bunyinya |
|------|----------|
| §2 | cangkang menyusul hanya kalau lebar ≥1024 **dan** gerak tidak dikurangi |
| §7 | `prefers-reduced-motion` membuat `/` "mendarat di tabel datar, bukan peta" |

Implementasi sekarang mengikuti §2 (→ dokumen). **Rekomendasi yang sudah
diajukan ke Utsman dan belum dijawab:** ikuti §7 — cangkang tetap mount,
tapi mendarat di `FlatTable`. Alasannya, yang diminta pengunjung itu gerak
yang dikurangi, bukan antarmuka yang dikurangi; konsol, rail, panel dan tabel
datar sama sekali tidak bergerak, dan tombol `ISO` tetap ada kalau mereka mau
melihat peta atas kemauan sendiri.

Kalau dipilih, perubahannya kecil:

- `src/lib/hooks/useShellEligible.js` → cukup `wide`, syarat `calm` dilepas
- `src/components/shell/Shell.jsx` → terima `calm`, view awal `calm ? 'list' : 'map'`
- test: `page.test.jsx` (mount cangkang saat calm) dan `Shell.test.jsx` (view awal)
- verifikasi browser: matikan animasi Windows sekali lagi untuk mengeceknya

### Tugas 2 — kontras label tahun di peta (belum ditawarkan)

`#4C555A` di atas ground ±2.3:1. Itu palet handoff, dan informasinya juga ada
di legenda dan rail, jadi dibiarkan apa adanya — tapi belum pernah ditawarkan
ke Utsman untuk dinaikkan.

## Pelajaran yang mahal (jangan diulang)

### Tentang kode

- **Cache Turbopack menyajikan token basi.** Setelah mengubah `globals.css`,
  hapus `.next` dan jalankan ulang server.
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
- **`prefers-reduced-motion` ikut setelan OS, bukan cuma browser.** Sepanjang
  sesi 2026-09-08 panel browser melaporkan `reduce` dan cangkang tidak pernah
  mount di `/` — penyebabnya "Animation effects" Windows yang mati
  (`HKCU:\Control Panel\Desktop\UserPreferencesMask`, bit `0x02` pada byte 0).
  Semua transisi juga terbaca `1e-05s`. Sebelum menyimpulkan cangkang rusak,
  periksa setelan itu, dan render `Shell` lewat route probe sementara.
- **Buffer console lintas sesi.** Error 404 dan WebSocket dari server yang sudah
  dimatikan tetap muncul di pembacaan berikutnya. Periksa daftar network sebelum
  mempercayainya.

## Cara lanjut

1. `git checkout portfolio-canvas-redesign`
2. `npm test` — harus 92 hijau, `npx eslint src --max-warnings=0` bersih
3. Rencana 17 task sudah habis. Antrean berikutnya, urut:
   1. **Tugas 1** di atas — putuskan nasib pengunjung reduced-motion.
   2. **Tugas 2** — tawarkan kontras label tahun.
   3. Masukkan `hris.png` dan `psb.png` (sensor dulu).
   4. Baru merge ke `main` dan deploy.

Aturan kerja yang berlaku di sesi ini dan sebaiknya diteruskan: TDD (test dulu,
lihat gagal, baru implementasi), commit tiap task, verifikasi di browser
sungguhan bukan cuma test, jangan mengarang angka dampak.
