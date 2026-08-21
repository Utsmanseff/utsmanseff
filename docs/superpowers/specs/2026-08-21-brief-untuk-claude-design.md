# Brief desain — porto Utsman (dua bentuk: cangkang modul & dokumen teknis)

> Ditulis untuk dilempar ke Claude Design. Isi teks, warna, dan batasan di bawah
> sudah final dan berasal dari kode/data yang berjalan. Yang diminta dari desain
> adalah **bentuk visual**, bukan konten baru. Jangan menambah project, angka,
> fitur, atau klaim yang tidak tertulis di sini.

## 1. Ringkas

Porto seorang fullstack web developer di Banjarbaru, Kalimantan Selatan. Empat
tahun terakhir sebagian besar membangun sistem rumah sakit dan instansi
pemerintah: pendaftaran pasien, rekam medis, klaim BPJS, kepegawaian.

Pembacanya **bukan HRD**. Di Indonesia HRD membaca CV; yang membuka porto adalah
developer lain, lead teknis, atau calon klien teknis. Nada yang dituju: pekerja
sistem internal, bukan agensi kreatif.

Yang sedang diganti: kanvas peta simpul (lingkaran project dengan garis
penghubung). Ditolak pemiliknya karena garisnya tidak pernah punya arti dan
hasilnya terasa "AI-generated". Peta dibuang total.

## 2. Dua bentuk, satu identitas

Dua desain berbeda dengan sengaja. Palet, tipografi, dan nada tulisan sama;
strukturnya berbeda karena cara pakainya berbeda.

### Desktop (≥1024px) — cangkang perangkat lunak internal

Porto berwujud aplikasi internal, karena itulah yang dikerjakan orangnya.
Bahan yang harus ada:

- Daftar modul di kiri (setiap project = satu modul), dikelompokkan per klien.
- Area kerja di kanan: isi modul yang sedang dibuka.
- Status bar bawah: identitas, lokasi, tautan kontak, penunjuk bahasa ID/EN.
- Kepadatan tinggi. Tabel dan baris data, bukan kartu melayang berjarak lebar.
- Modul kecil (empat sistem instansi) boleh dikelompokkan, tapi tidak
  disembunyikan.

Yang **bukan** diminta: dashboard dengan grafik, KPI, atau angka statistik.
Tidak ada metrik yang boleh ditampilkan (lihat §6).

### Mobile (<768px) — dokumen teknis

Bukan versi sempit dari cangkang. Bentuk dokumen rekayasa yang dibaca dari atas
ke bawah:

- Bagian bernomor.
- Tabel integrasi yang bisa digulir sendiri secara horizontal.
- Blok "batasan" dan "yang sulit" yang jelas berbeda dari teks biasa.
- Navigasi bagian yang bisa dipakai satu tangan.

Lebar 768–1023px: pilih salah satu dan konsisten; jangan bentuk ketiga.

## 3. Konten nyata

### Identitas

- Nama: **Utsman**
- Peran: Fullstack Developer
- Lokasi: Banjarbaru, Kalimantan Selatan
- Blurb (ID): "Membangun sistem rumah sakit dan pemerintahan di Kalimantan
  Selatan. Empat tahun terakhir sebagian besar di ruang klinis: pendaftaran,
  klaim, rekam medis."
- Blurb (EN): "I build hospital and public-sector systems in South Kalimantan.
  Most of the last four years has been clinical: registration, claims, medical
  records."
- Kontak: email `seffutsmannnn@gmail.com`, WhatsApp `+62 823 5273 4167`,
  GitHub `Utsmanseff`, Instagram `@utsmnseff`, unduh CV (`/Utsman-CV.pdf`).

### Empat project utama (punya halaman baca sendiri)

| Project | Klien | Tahun | Akses | Stack |
|---|---|---|---|---|
| Pendaftaran Rumah Sakit Berbasis OCR | RSU Nirwana | 2025 | publik (`rsunirwana.id`) | Laravel, Next.js, MySQL, Google Vision, REST API |
| Bridging IDRG / INA-CBG | RSU Nirwana | 2025 | internal, tanpa URL publik | Laravel, MySQL, REST API, SOAP |
| HRIS | RSU Nirwana | 2026 | internal, tanpa URL publik | Laravel, Livewire, Alpine.js, MySQL, MediaPipe |
| Penerimaan Siswa Baru dengan Ujian CBT | MTs WaliSongo Banjarbaru | 2026 | tidak ada URL live | Laravel, JavaScript, MySQL, Fonnte |

### Empat project kecil (hanya ringkasan, tanpa halaman)

| Project | Klien | Tahun | Akses | Stack |
|---|---|---|---|---|
| Rekam Medis Elektronik (RME) | RSU Nirwana | 2025 | internal | Laravel, Livewire, MySQL |
| Kepegawaian & Absensi Geolocation (SIGAP) | BPN | 2024 | tidak ada URL live | Laravel, Livewire, MySQL |
| Manajemen Aset & Inventaris | KPHL | 2024 | tidak ada URL live | Laravel, Livewire, MySQL |
| Aplikasi Sertifikasi Benih | Dinas Pertanian | 2024 | tidak ada URL live | Laravel, Livewire, MySQL |

### Anatomi halaman baca (tujuh blok, urutannya tetap)

1. Kepala: klien · tahun · peran ("Pengembang tunggal"), judul, badge akses
2. Konteks: masalah yang dihadapi, satu paragraf
3. Screenshot (dua project belum punya gambar — lihat §6)
4. "Apa yang saya bangun": daftar butir
5. "Yang sulit": satu paragraf, ditonjolkan
6. "Stack": daftar teknologi project itu
7. Kaki: tautan live kalau ada, lalu project sebelumnya/berikutnya

### Stack sebagai daftar, bukan grid ikon

Diturunkan dari data project, dengan jumlah pemakaian di sebelahnya:

`Laravel 8 · MySQL 8 · Livewire 5 · REST API 2 · Alpine.js 1 · Fonnte 1 ·
Google Vision 1 · JavaScript 1 · MediaPipe 1 · Next.js 1 · SOAP 1`

Laravel dan MySQL adalah dasar yang dimiliki semua developer web di Indonesia;
yang membedakan justru yang dipakai sekali — Google Vision (OCR KTP), MediaPipe
(verifikasi wajah), SOAP (bridging BPJS), Fonnte (notifikasi WhatsApp). Desain
harus membuat yang langka terbaca, bukan tenggelam oleh yang sering.

**Grid ikon logo dilarang.** Itu ciri template yang justru sedang dihindari.

## 4. Token yang sudah dipakai (boleh diusulkan diganti, sertakan alasan)

```
Lapis gelap   ground #161A1D · soft #1F2529 · ink #E8E0D0 · mute #7A8580 · rule #2E3539
Lapis kertas  paper #F2EDE3 · deep #E7E0D0 · ink #1A1A1A · mute #6B6B5E · rule #D9D0BC
Aksen         amber #C97B3F (hanya di atas gelap) · amber-ink #9C5A28 (di atas kertas)
Tipografi     display Fraunces · body Inter · mono JetBrains Mono · pixel Jersey 15
```

Catatan lisensi: font harus tersedia di Google Fonts atau berlisensi bebas
komersial. Jersey 15 dipakai di kanvas lama; kalau konsep barunya tidak
membutuhkan wajah piksel, boleh dibuang.

## 5. Kontrak gerak

- Yang digerakkan jari (seret, zoom, gulir) mengikuti 1:1, tanpa easing.
- Yang bergerak sendiri (panel, pindah halaman, filter) memudar 700ms
  `cubic-bezier(0.22, 1, 0.36, 1)`.
- Hormati `prefers-reduced-motion`.

## 6. Batasan keras (jangan dilanggar)

1. **Tidak ada angka dampak.** Tidak ada "efisiensi 40%", "1000+ pengguna",
   "waktu antre turun". Tidak ada satu pun metrik yang boleh muncul, termasuk
   sebagai isian contoh, karena tidak ada sumber yang membuktikannya.
2. **HRIS tidak punya modul payroll atau keuangan.** Jangan pernah disebut,
   digambar, atau diisikan sebagai menu contoh.
3. **Status akses ditulis terang-terangan**, bukan disamarkan: `publik`,
   `internal — demo bila diminta`, `tidak ada URL live`. Ini bagian dari
   kejujurannya, jadi harus punya tempat yang dirancang, bukan catatan kaki.
4. **Dua screenshot belum ada** (HRIS, PSB Walisongo). Rancang keadaan kosong
   yang disengaja untuk slot gambar — bukan placeholder abu-abu, bukan gambar
   palsu. Screenshot yang ada memuat data rumah sakit dan harus bisa disensor.
5. **Dua bahasa penuh, ID dan EN.** Semua label butuh dua versi; teks Indonesia
   biasanya 15–25% lebih panjang. Jangan merancang tata letak yang pecah kalau
   label memanjang.
6. **Kontras WCAG AA.** Amber #C97B3F hanya 2.82:1 di atas kertas — di lapis
   terang wajib #9C5A28.
7. **Halaman baca harus terbaca tanpa JavaScript** dan bisa dibagikan sebagai
   URL sendiri (`/kerja/<slug>`).
8. Tidak ada foto stok, tidak ada ilustrasi orang, tidak ada emoji sebagai
   penanda bagian.

## 7. Yang harus dihindari (alasan porto ini dibongkar)

Pemiliknya menolak versi sebelumnya karena terasa dihasilkan mesin. Hindari:

- Krem hangat + serif display + aksen terakota.
- Kartu bersudut membulat yang melayang dengan bayangan lembut, berjarak lebar.
- Hero gradien, teks tengah di mana-mana, angka bagian 01/02/03 yang tidak
  menandakan urutan sungguhan.
- Emoji sebagai ikon bagian, grid ikon teknologi.
- Graf lingkaran-dan-garis tanpa sumbu yang berarti (kesalahan versi kemarin).
- Kepadatan rendah. Sistem internal itu padat; porto ini boleh padat.

## 8. Yang diminta sebagai keluaran

Artboard, semuanya dengan konten asli di atas — tanpa lorem:

1. Desktop — keadaan awal (belum ada modul dibuka)
2. Desktop — satu modul terbuka (pakai HRIS: internal, belum ada screenshot)
3. Desktop — kelompok empat project kecil
4. Mobile — kepala dokumen + daftar bagian
5. Mobile — satu bagian project, termasuk tabel yang bisa digulir
6. Halaman baca `/kerja/rsu-nirwana-web` di kedua lebar
7. Halaman kontak
8. Satu papan token: warna, skala tipografi, jarak, keadaan fokus

Sertakan keadaan interaktif: fokus keyboard, item terpilih, tautan yang
disorot, dan keadaan kosong untuk slot screenshot.
