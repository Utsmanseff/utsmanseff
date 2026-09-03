# Pass konten — menuju desain baru (shell + dokumen)

Ditulis 2026-09-03, setelah handoff desain masuk dan konsepnya disetujui.
Isi berkas ini **belum final**. Semua yang tertulis di sini diturunkan dari copy
yang sudah ada di `src/lib/data/projects.js` dan dari
`2026-08-19-project-copy.md` — tidak ada fakta baru yang ditambahkan. Bagian
yang menunggu jawaban Utsman ditandai **[PERLU JAWABAN]**.

## Keputusan yang mendasari berkas ini

| Hal | Keputusan |
|---|---|
| Prosa | Dari repo. Prototipe hanya menyumbang bentuk field `blurb` |
| Slug | Slug repo dipertahankan, URL lama tidak mati |
| Stack PSB | `Laravel, JavaScript, MySQL, Fonnte` — plate 4 lapis |
| Tinggi plate | Jumlah teknologi, dilabeli jujur sebagai teknologi/stack |
| Headline | Arah "batasan orang lain", kata-kata masih akan diperbaiki |
| RME | Naik jadi halaman penuh — lima halaman baca, bukan empat |
| Thesis desktop | Panel kanan saat belum ada sistem terpilih |
| Urutan kerja | Dasar dulu, peta isometrik terakhir |

## 1. Kata yang diganti dari prototipe

Prototipe menyebut kedelapannya "modul". Salah: ini delapan sistem milik lima
klien, dan HRIS sendiri berisi sembilan modul. Peta juga tidak mengukur
"bagian", ia mengukur jumlah teknologi.

| Prototipe | Dipakai | Alasan |
|---|---|---|
| `MODULES` / `MODUL` | `SISTEM` | Delapan sistem terpisah, bukan modul satu aplikasi |
| `8 MODULES · 4 SHOWN` | `8 SISTEM · 4 TAMPIL` | sda |
| `SKIP MAP → MODULE LIST` | `LEWATI PETA → DAFTAR SISTEM` | sda |
| `PARTS` / `BAGIAN` | `TEKNOLOGI` | Tingginya menghitung stack, bukan bagian sistem |
| `5 PARTS · PUBLIC · GOOGLE VISION` | `5 TEKNOLOGI · PUBLIK · GOOGLE VISION` | sda |
| `LAYERS` (panel) | `LAPISAN STACK` | Sama, tapi tidak bisa terbaca sebagai lapisan arsitektur |

## 2. Headline — arah "batasan orang lain"

Belum final. Varian di bawah sudah diperbaiki setelah jawaban 2026-09-03: kata
**vendor dibuang** (Khanza open source, bukan produk vendor) dan angkanya jadi
**tiga tahun** (freelance sejak akhir 2023).

**A.** Tiga tahun menulis perangkat lunak di dalam batasan yang sudah berdiri
lebih dulu: SIMRS yang tidak saya tulis, endpoint BPJS, aturan Kemenkes.

**B.** Pekerjaan ini hampir seluruhnya berdampingan dengan sistem yang sudah
jalan dan tidak boleh berhenti — salah satunya berisi 1.168 tabel.

**C.** Perangkat lunak untuk ruang klinis, ditulis di sekitar sistem yang tidak
boleh mati: SIMRS rumah sakit, klaim BPJS, tenggat Kemenkes.

Catatan pemeriksaan fakta:

- "Tiga tahun" — Utsman mulai freelance akhir 2023; project di peta menjangkau
  2024–2026. Dua-duanya cocok dengan angka tiga. Blurb lama yang menyebut empat
  tahun sudah diperbaiki di `canvas.js`.
- "SIMRS yang tidak saya tulis" terbukti: RME (Khanza dibiarkan utuh, lapisan
  web berdiri di atas database yang sama) dan IDRG (bridging bawaan Khanza tidak
  memenuhi komponen penilaian).
- "Endpoint BPJS" terbukti: IDRG.
- "Aturan Kemenkes" terbukti: RME (Permenkes untuk akreditasi) dan IDRG (surat
  edaran IDRG/SatuSehat).
- **Khanza bukan vendor.** SIMRS open source dan gratis, dipakai rumah sakit apa
  adanya. Klaim "sistem vendor" di copy RME dan "ekspektasi vendor SIMRS" di copy
  Pendaftaran OCR sudah dikoreksi di `projects.js`.

## 3. Thesis panel desktop (keadaan awal, sebelum ada yang dipilih)

Menempati panel kanan sampai sebuah plate dipilih.

- **Nama** Utsman · **Peran** Fullstack Developer · **Lokasi** Banjarbaru,
  Kalimantan Selatan
- **id:** Delapan sistem untuk lima klien, sebagian besar rumah sakit. Peta ini
  menaruhnya menurut tahun; klik satu plate untuk melihat isinya, atau ketik di
  konsol di bawah.
- **en:** Eight systems for five clients, most of them a hospital. This map lays
  them out by year; click a plate to see what is inside one, or type in the
  console below.

## 4. Blurb satu kalimat — delapan sistem

Field baru. Dipakai di rail, panel terpilih, dan spine mobile. Semuanya
diturunkan dari `context`/`hard` yang sudah ada.

**Pendaftaran OCR** (`rsu-nirwana-web`)
- id: KTP difoto dan dibaca OCR, hasilnya masuk ke SIMRS tanpa diketik ulang di loket.
- en: A KTP is photographed and read by OCR, and the result reaches the SIMRS without being retyped at the counter.

**Bridging IDRG** (`idrg-bridging`)
- id: Mediator klaim antara SIMRS dan endpoint BPJS, ditulis ketika akses bridging terancam diputus.
- en: A claim mediator between the SIMRS and the BPJS endpoints, written while bridging access was about to be cut.

**HRIS** (`hris-nirwana`)
- id: Rumah sakit tanpa sistem kepegawaian sama sekali — mesin absen, surat cuti, Excel yang tersebar — disatukan ke satu tempat.
- en: A hospital with no HR system at all — a punch clock, paper leave forms, scattered Excel — pulled into one place.

**RME** (`rme`)
- id: Lapisan web di atas database SIMRS 1.168 tabel, tetap menulis balik ke sana supaya laporan lama tidak rusak.
- en: A web layer over a 1,168-table SIMRS database, still writing back into it so the existing reports keep working.

**PSB · Ujian CBT** (`psb-walisongo`)
- id: Pendaftaran sampai ujian masuk berbasis browser, dengan notifikasi WhatsApp di tiap tahap.
- en: Registration through a browser-based entrance exam, with WhatsApp notifications at every stage.

**SIGAP** (`sigap-bpn`)
- id: Kepegawaian dengan absensi yang terikat pada lokasi kerja.
- en: Staff management with attendance tied to the actual work site.

**Manajemen Aset** (`aset-kphl`)
- id: Aset organisasi dengan pelacakan lokasi, kondisi, jadwal perawatan, dan pelaporan.
- en: Organisational assets with location and condition tracking, maintenance scheduling and reporting.

**Sertifikasi Benih** (`sertifikasi-benih`)
- id: Pengajuan sampai sertifikat digital untuk sertifikasi benih tanaman.
- en: Plant seed certification, from application through to a digital certificate.

## 5. RME naik jadi halaman penuh — SUDAH DIKERJAKAN

Yang sudah ada dan tidak perlu ditulis ulang:

- `context` — Permenkes mewajibkan RME untuk akreditasi; antarmuka vendor tidak
  bisa diubah, jadi lapisan web terpisah di atas database SIMRS yang sama.
- `hard` — 1.168 tabel tanpa dokumentasi yang memadai; memetakan data klinis
  beserta relasi dan constraint-nya lebih mirip rekonstruksi skema.
- `image` — `/assets/img/rme1.png` sudah ada di repo.
- `access` — internal.
- `tech` — Laravel, Livewire, MySQL.

Sudah diisi dari jawaban 2026-09-03 dan halamannya hidup di `/kerja/rme`:

- `tier` naik ke `full`; lima halaman baca sekarang, bukan empat.
- `built` — SOAP, tanda-tanda vital, diagnosa ICD, permintaan lab, permintaan
  radiologi, permintaan resep, resume medis.
- `context` ditulis ulang: Khanza open source dan dibiarkan utuh, lapisan web
  menulis ke tabel yang sama, pemakainya dokter dan perawat asisten dokter,
  cakupan rawat jalan/rawat inap/IGD dengan rawat jalan dan rawat inap yang
  berjalan sekarang.
- **Field baru `notMine`** — batas lingkup yang ditulis terang: hasil lab, hasil
  radiologi, dan pemberian obat tetap diinput di Khanza. Halaman baca
  menampilkannya sebagai blok "Di luar lingkup saya", di bawah daftar yang
  dibangun. Field ini opsional; hanya RME yang memakainya sekarang.
- Screenshot `/assets/img/rme1.png` sudah tersensor (nama, no. RM, no. rawat
  tertutup). Aman dipublikasikan.

## 6. Jawaban Utsman, 2026-09-03

1. RME mencakup rawat jalan, rawat inap, dan IGD; yang berjalan sampai sekarang
   rawat jalan dan rawat inap. Modulnya: SOAP, TTV, diagnosa ICD, permintaan
   lab, permintaan radiologi, permintaan resep, resume medis.
2. Pemakainya dokter dan perawat asisten dokter.
3. Menulis ke tabel yang sama. **Khanza bukan vendor** — SIMRS open source dan
   gratis, jadi rumah sakit memakainya.
4. Di luar lingkupnya: input hasil lab, hasil radiologi, dan pemberian obat —
   semuanya tetap di Khanza.
5. Tiga tahun. Freelance sejak akhir 2023 sampai sekarang.

## 7. Yang masih terbuka

- **Kata-kata headline belum dipotong.** Tiga varian di §2 menunggu pilihan.
- **Screenshot HRIS dan PSB belum ada.** Sampai masuk, dua halaman itu memakai
  keadaan kosong yang dirancang — bukan gambar palsu, bukan stok.
- **Blurb delapan sistem di §4 belum masuk `projects.js`.** Menunggu desain baru
  yang memakainya, atau persetujuan Utsman kalau mau dimasukkan lebih dulu.
