# Teks Legenda, Catatan Rail, dan Data Sembilan Sistem — Spec

Tanggal: 2026-09-09
Branch: `portfolio-canvas-redesign`
Asal: antrean nomor 1 di `docs/PROGRESS.md` ("Teks legenda dan catatan rail"),
yang selama brainstorm melebar sampai ke data project dan prosa halaman baca.

## Kenapa ini ada

Utsman menyebut `AxisLegend` dan catatan kaki `LogRail` kurang informatif dalam
tiga arti sekaligus: kurang lengkap, kurang bisa dibaca, dan kurang berguna.
Pemeriksaan terhadap kode menemukan bahwa keduanya juga **salah**, bukan sekadar
kurang. Dari situ pemeriksaan diteruskan ke seluruh teks cangkang dan seluruh
data project, dan menemukan tahun yang keliru, nama yang tidak disukai, satu
project yang belum pernah dimasukkan, serta prosa halaman baca yang bergaya
sastra padahal halaman itu dibaca sebagai catatan kerja.

Semua fakta project di dokumen ini berasal dari Utsman dalam sesi brainstorm
2026-09-09. Tidak ada yang disimpulkan dari screenshot atau ditebak.

## Kesalahan yang ditemukan, dan buktinya

1. **`AxisLegend` menyebut `TEPI publik`.** Yang menandai akses publik adalah
   tepi **lapis teratas** (`#C97B3F`, `Plate.jsx`, variabel `flat`), sementara
   sejak `shading.js` ada, keempat sisi setiap lapis diwarnai menurut sudut
   kamera. Kata "tepi" karena itu menunjuk hal lain di layar.
2. **`AxisLegend` tidak menyebut krem terpilih**, padahal `#E8E0D0` dengan border
   2px adalah penanda paling penting di peta.
3. **Catatan `LogRail` menyebut "di peta".** Catatan itu berdiri di rail, dan
   rail hidup di kedua view. Di `DATAR` tidak ada peta, tetapi barisnya tetap
   meredup (`FlatTable.jsx:42`).
4. **Catatan `LogRail` menyebut "didorong ke belakang".** Tidak ada yang
   didorong; plate redup hanya turun ke `opacity: 0.34` tanpa berpindah.
5. **Tajuk `SISTEM YANG TAMPIL` tidak benar.** `Shell.jsx:136` mengoper
   `systems` utuh, bukan hasil filter. Daftar itu selalu berisi semuanya.
6. **`FlatTable.intro` mengaku dipakai tanpa JavaScript.** Tanpa JavaScript yang
   dirender `PaperFallback`; `FlatTable` komponen cangkang dan tidak pernah
   muncul di sana. Bagian "gerak dikurangi" benar (`Shell.jsx:24`).
7. **Kalimat screenshot menyebut "sistem internal".** Ia juga tampil di PSB,
   yang `access: 'none'` dan bukan sistem internal.
8. **Konteks IDRG menyebut SatuSehat tanpa dukungan apa pun** di `tech` maupun
   `built`. Duduk perkaranya diperbaiki di dokumen ini.
9. **`1:1` di pojok peta** adalah istilah kontrak gerak internal, bukan bahasa
   pengunjung.

## Bagian 1 — Teks cangkang

### `AxisLegend`

Dua baris bertajuk. Tajuk kirinya yang memberi tahu pembaca bahwa ia sedang
membaca kunci peta; belahannya jujur karena tiga hal pertama memang geometri dan
tiga terakhir memang warna.

```
id:
BENTUK   KE BELAKANG tahun · TINGGI banyak stack · LUAS punya halaman
WARNA    AMBER publik · KREM terpilih · REDUP tersaring

en:
FORM     DEPTH year · HEIGHT stack size · AREA has a page
COLOUR   AMBER public · CREAM selected · DIM filtered
```

Enam encoding, naik dari tiga. Kata `TEPI` hilang. Struktur komponen berubah
dari satu larik menjadi dua baris berlabel.

### Pojok peta (`MapScene`)

```
id:
SERET ATAU GULIR · MEMUTAR
KLIK PLATE · MEMILIH

en:
DRAG OR SCROLL · ORBIT
CLICK A PLATE · SELECT
```

Dua baris, naik dari satu. `1:1` dibuang. Roda memang memutar
(`useMapCamera`), dan badan plate memang tombolnya (`Plate.jsx`), tetapi
keduanya belum pernah dikatakan.

### Tajuk daftar `LogRail`

`SISTEM YANG TAMPIL` / `SYSTEMS IN VIEW` menjadi **`DAFTAR SISTEM`** /
`SYSTEM LIST`.

Selain jujur, ini menepati janji tombol lewati di `TopBar`, yang berbunyi
`LEWATI PETA → DAFTAR SISTEM`.

### Catatan kaki `LogRail`

Berhenti mengulang peredupan, dan menerangkan daftarnya sendiri.

```
id: Cermin peta, dan bisa dicapai dengan Tab. Memilih di sini sama dengan menekan plate-nya.
en: A mirror of the map, reachable by Tab. Selecting here is the same as pressing the plate.
```

**Harga yang diterima sadar:** peredupan di view `DATAR` jadi tanpa keterangan,
karena `AxisLegend` hidup di dalam `MapScene` dan tidak ikut ke sana. Utsman
memilih ini setelah harganya disebutkan. Kalau nanti terasa, jalan keluarnya
menaruh satu kata di dekat chip filter, bukan mengembalikan catatan kaki lama.

### `FlatTable.intro`

```
id: Daftar datar ini data yang sama dengan peta, tanpa geometrinya. Ini juga yang terbuka lebih dulu kalau gerak dikurangi.
en: The flat list is the same data as the map, without the geometry. It is also what opens first under reduced motion.
```

### Kalimat screenshot (`ScreenshotBlock`)

```
id: Screenshot menyusul. Tangkapan layarnya masih disensor.
en: Screenshot to follow. Captures are still being redacted.
```

Dua halaman memakainya: HRIS dan PSB.

## Bagian 2 — Data

### Sembilan sistem

| Slug | shortName id / en | client | clientKey | year | tier | access | tech |
|---|---|---|---|---|---|---|---|
| `sigap-bpn` | SIGAP / SIGAP | BPN | `bpn` | 2024 | full | none | Laravel, Filament, Livewire, MySQL, Tailwind CSS |
| `sibenih` | SIBENIH / SIBENIH | BPSBTPH | `bpsbtph` | 2024 | brief | none | Laravel, Filament, Livewire, MySQL |
| `simaset` | SIMASET / SIMASET | UPT-KPHL | `upt-kphl` | 2025 | full | none | Laravel, JavaScript, MySQL |
| `simbas` | SIMBAS / SIMBAS | Kecamatan Basarang | `kecamatan-basarang` | 2025 | brief | none | Laravel, JavaScript, MySQL |
| `idrg-bridging` | IDRG Bridging | RSU Nirwana | `rsu-nirwana` | 2025 | full | internal | Laravel, JavaScript, MySQL, REST API |
| `rme` | RME / EMR | RSU Nirwana | `rsu-nirwana` | 2025 | full | internal | Laravel, JavaScript, MySQL, Livewire |
| `rsu-nirwana-web` | Web & Pendaftaran / Site & Registration | RSU Nirwana | `rsu-nirwana` | 2026 | full | public | Laravel, Next.js, MySQL, Google Vision, REST API |
| `hris-nirwana` | HRIS / HRIS | RSU Nirwana | `rsu-nirwana` | 2026 | full | internal | Laravel, Livewire, Alpine.js, MySQL, TensorFlow.js |
| `psb-walisongo` | PSB & CBT / Admissions & CBT | MTs WaliSongo Banjarbaru | `mts-walisongo` | 2026 | full | none | Laravel, JavaScript, MySQL, Fonnte |

Gambar: `sigap-bpn` ke `sigap.jpg`, `sibenih` ke `sertifikasi.png`, `simaset` ke
`aset.jpg`, `idrg-bridging` ke `eklaim.png`, `rme` ke `rme1.png`,
`rsu-nirwana-web` ke `pendaftaran.png`. `simbas`, `hris-nirwana` dan
`psb-walisongo` bernilai `null`.

`role` seluruhnya tetap `Pengembang tunggal` / `Sole developer`.
`site` hanya terisi pada `rsu-nirwana-web` (`https://rsunirwana.id`).

### Yang berubah dari data lama

- **Tahun:** `simaset` 2024 ke 2025; `rsu-nirwana-web` 2025 ke 2026.
- **Slug:** `aset-kphl` menjadi `simaset`; `sertifikasi-benih` menjadi `sibenih`.
  Keduanya tier ringkasan dan tidak punya URL, jadi tidak ada yang patah. Lima
  slug halaman baca lama tidak disentuh, sesuai larangan yang berlaku.
- **Tier:** `sigap-bpn` dan `simaset` naik dari `brief` ke `full`. Halaman baca
  jadi tujuh.
- **Baru:** `simbas`.
- **Klien:** `KPHL` menjadi `UPT-KPHL`; `Dinas Pertanian` menjadi `BPSBTPH`.
  Nama panjang keduanya hidup di kalimat konteks, bukan di label plate, karena
  label plate `whitespace-nowrap` dan SIMASET plate kecil.
- **Stack:** `SOAP` keluar dari IDRG (tidak dipakai); `JavaScript` masuk ke IDRG
  dan RME; `Filament` masuk ke SIGAP dan SIBENIH; `Tailwind CSS` masuk ke SIGAP;
  `Livewire` keluar dari SIMASET.
- **shortName:** `Pendaftaran OCR` menjadi `Web & Pendaftaran`; `PSB Walisongo`
  menjadi `PSB & CBT`. Keduanya berhenti mengulang klien, yang sudah berdiri
  tepat di bawahnya pada label plate.

### Akibat di kode

- **Chip `stack:soap` mati.** SOAP hanya ada di IDRG. Setelah keluar, chip itu
  menyaring sampai kosong. Penggantinya **`stack:livewire`** (HRIS, RME, SIGAP,
  SIBENIH). `laravel` dan `mysql` tidak bisa dipakai karena ada di kesembilan
  sistem. Berubah di `LogRail.jsx:22` dan contoh perintah `Console.jsx:8-9`.
- **`Gate.test.jsx:32`** menunggu `SOAP` di daftar stack gerbang, diganti
  `Livewire`. Daftar stack gerbang bertambah `Alpine.js`, `Filament`, dan
  `Tailwind CSS`.
- **`tech.test.js:32`** (`techSlug('SOAP')`) menguji fungsi murni dan tetap sah.
- **Ada dua SOAP, dan hanya satu yang dibuang.** Yang keluar adalah protokol
  `SOAP` di `tech` IDRG. Yang **tetap** adalah "Pencatatan SOAP" di `built` RME —
  itu singkatan rekam medis (subjektif, objektif, asesmen, plan) dan tidak ada
  hubungannya. Jangan disapu bersama.
- **Sitemap dan `siblings()`** naik dari lima ke tujuh halaman.
- **Tinggi tumpukan plate berubah sendiri** karena dihitung dari banyaknya
  stack. Tidak ada kode tinggi yang perlu disentuh.

### Baris 2025 melewati garisnya

Dengan data baru, ujung tiap baris (dihitung dengan `GAP = 80`,
`full = 165`, `brief = 100`, kursor mulai di 40):

| Tahun | Isi | Ujung |
|---|---|---|
| 2024 | SIGAP (full), SIBENIH (brief) | 385 |
| 2025 | SIMASET (full), SIMBAS (brief), IDRG (full), RME (full) | **875** |
| 2026 | Web & Pendaftaran, HRIS, PSB & CBT | 695 |

`MapScene` sekarang menggambar garis tahun dengan lebar mati `700` dan menaruh
label tahun di `left: 710`. Baris 2025 berujung di 875, jadi plate terakhirnya
menabrak label tahunnya sendiri.

**Keputusan: garis dan label mengikuti panjang barisnya sendiri.**

- `layout.js` mengekspor ujung tiap baris. Nilainya sudah dihitung oleh
  `platePositions` lewat kursornya; ia tinggal dikembalikan.
- `MapScene` menggambar garis dari `x = 20` sampai ujung baris itu, dan menaruh
  label tahun tepat sesudahnya.
- `SCENE.width` naik dari 900 ke 940, cukup untuk ujung terlebar (875) ditambah
  labelnya. Peta menyusut sekitar 4% lewat `fitScale`; `SCENE.height` tidak
  berubah.
- Angka mati `700` dan `710` hilang dari `MapScene`.

Ditolak: memperkecil `GAP` (menyetel seluruh peta demi satu baris, dan patah
lagi pada project kesepuluh) dan membungkus baris jadi dua (satu tahun tidak
boleh punya dua kedalaman — itu membatalkan arti sumbunya).

## Bagian 3 — Prosa

### Gaya: baku

Seluruh prosa yang tampil — `title`, `blurb`, `context`, dan setiap butir
`built`, dalam kedua bahasa — ditulis dengan bahasa baku: kalimat lurus, tanpa
tanda pisah yang mendramatisir, tanpa personifikasi, tanpa titik dua yang
dipakai sebagai efek.

**Tanpa kata "saya".** Sekarang hanya ada satu di seluruh data, di konteks IDRG.

Alasannya disebut Utsman sendiri: prosa bergaya membuat halaman terbaca seperti
tulisan mesin. Dan satu paragraf yang tertinggal bergaya lama justru jadi yang
paling kelihatan, jadi pembakuan berlaku untuk kesembilan entri sekaligus,
bukan hanya yang isinya berubah.

### Judul

| Slug | id | en |
|---|---|---|
| `rsu-nirwana-web` | Web Rumah Sakit dan Pendaftaran Pasien Baru | Hospital Website and New Patient Registration |
| `idrg-bridging` | Bridging IDRG / INA-CBGs untuk Klaim BPJS | IDRG / INA-CBGs Bridging for BPJS Claims |
| `hris-nirwana` | Sistem Kepegawaian Rumah Sakit | Hospital HR System |
| `rme` | Rekam Medis Elektronik | Electronic Medical Records |
| `sigap-bpn` | Kepegawaian dan Absensi Berbasis Lokasi | Staffing and Location-Based Attendance |
| `simaset` | Manajemen Aset dan Inventaris | Asset and Inventory Management |
| `sibenih` | Aplikasi Sertifikasi Benih | Seed Certification System |
| `simbas` | Manajemen Bantuan Sosial | Social Assistance Management |
| `psb-walisongo` | Penerimaan Siswa Baru dengan Ujian CBT | School Admissions with Computer-Based Testing |

### Blurb

| Slug | id | en |
|---|---|---|
| `rsu-nirwana-web` | Web rumah sakit beserta pendaftaran pasien baru yang datanya diisi dari hasil pembacaan foto KTP. | A hospital website together with new patient registration, filled in from a scan of the patient's ID card. |
| `idrg-bridging` | Penghubung data klaim rumah sakit dengan sistem BPJS. | A connector between the hospital's claim data and the BPJS system. |
| `hris-nirwana` | Absensi, cuti, jadwal, dan data pegawai dalam satu aplikasi. | Attendance, leave, schedules, and staff records in one application. |
| `rme` | Pencatatan rekam medis elektronik untuk rawat jalan dan rawat inap. | Electronic medical records for outpatient and inpatient care. |
| `sigap-bpn` | Kepegawaian dengan absensi berbasis lokasi dan perhitungan gaji bulanan yang bersumber dari absensi, lembur, dan cuti. | Staff management with location-based attendance and a monthly pay calculation drawn from attendance, overtime, and leave. |
| `simaset` | Pengelolaan aset dengan kode QR per unit, pelacakan lokasi dan kondisi, jadwal perawatan, serta perhitungan depresiasi. | Asset management with a QR code per unit, location and condition tracking, maintenance scheduling, and depreciation calculation. |
| `sibenih` | Sertifikasi benih tanaman, mulai dari pengajuan hingga penerbitan sertifikat digital. | Plant seed certification, from application through to a digital certificate. |
| `simbas` | Pengelolaan bantuan sosial kecamatan, mulai dari pendataan penerima hingga pelaporan penyaluran. | Social assistance management for a subdistrict, from recipient records through to distribution reporting. |
| `psb-walisongo` | Pendaftaran hingga ujian masuk berbasis browser, dengan notifikasi WhatsApp pada setiap tahap. | Registration through a browser-based entrance exam, with WhatsApp notifications at every stage. |

### Konteks

**`rsu-nirwana-web`**

> id: Web rumah sakit sebelumnya bersifat statis dan modulnya belum lengkap, karena sebagian besar isinya ditulis langsung di dalam kode. Pendaftaran online yang ada juga belum membedakan pasien baru dan pasien lama, sehingga keduanya harus mengisi data diri dari awal pada setiap pendaftaran, dan data tersebut belum terhubung ke SIMRS. Web ini dibangun untuk menggantikannya. Halaman publiknya dapat diperbarui tanpa mengubah kode, pendaftarannya membedakan pasien baru dan pasien lama, data pasien baru diisi dari hasil pembacaan foto KTP, dan data pendaftaran dikirim ke registrasi SIMRS melalui API.

> en: The hospital's previous website was static and its modules were incomplete, because most of its content was written directly into the code. The online registration did not distinguish between new and returning patients, so both had to enter their personal details from scratch on every registration, and that data never reached the SIMRS. This site was built to replace it. Its public pages can be updated without changing code, registration separates new patients from returning ones, new patient data is filled in from a scan of the ID card, and registration data is sent to the SIMRS registration records through an API.

**`idrg-bridging`**

> id: Klaim BPJS dikirim melalui bridging antara sistem rumah sakit dan sistem BPJS. Aturannya kemudian berubah. Sebelumnya klaim cukup melalui coding dan grouping INA-CBG, sedangkan sekarang klaim harus melalui coding dan grouping IDRG terlebih dahulu. Layanan ini menangani keduanya, kemudian mengirimkan klaimnya. Hasil coding diagnosa dari layanan ini juga dikirim otomatis ke SatuSehat melalui service tersendiri.

> en: BPJS claims are submitted through a bridge between the hospital system and the BPJS system. The rules then changed. Claims previously only went through INA-CBG coding and grouping, whereas now they must go through IDRG coding and grouping first. This service handles both, then submits the claim. The diagnosis coding it produces is also sent automatically to SatuSehat through a separate service.

**`hris-nirwana`**

> id: Sebelumnya absensi menggunakan mesin absen, pengajuan cuti dilakukan melalui surat, dan data pegawai disimpan di Excel. Aplikasi ini menyatukan ketiganya. Absensinya menggunakan lokasi dan deteksi wajah, serta terhubung dengan jadwal shift setiap pegawai.

> en: Attendance previously ran on a punch clock, leave was requested on paper, and staff data was kept in Excel. This application brings the three together. Its attendance uses location and face detection, and is tied to each employee's shift.

**`rme`**

> id: Rekam medis elektronik untuk rawat jalan dan rawat inap, digunakan oleh dokter dan perawat asisten dokter. Rumah sakit sudah menggunakan SIMRS open source, sehingga rekam medis ini dibangun sebagai aplikasi web terpisah yang menulis ke basis data yang sama, agar pencatatan dan pelaporannya tetap menyatu.

> en: Electronic medical records for outpatient and inpatient care, used by doctors and the nurses assisting them. The hospital already runs an open source SIMRS, so these records were built as a separate web application that writes into the same database, so that records and reports stay together.

**`sigap-bpn`**

> id: Pengelolaan kepegawaian dengan absensi yang terikat pada lokasi kerja, sehingga kehadiran tercatat sesuai tempat pegawai bertugas. Data absensi, lembur, dan cuti digunakan sebagai dasar perhitungan gaji bulanan. Aplikasi ini mencatat dan menghitung komponennya, tetapi tidak menjalankan pembayaran.

> en: Staff management with attendance tied to the work site, so presence is recorded against where the employee actually works. Attendance, overtime, and leave data are the basis for the monthly pay calculation. The application records and calculates the components, but does not carry out payment.

**`simaset`**

> id: Pengelolaan aset milik UPT-KPHL Kapuas Kahayan, mencakup pencatatan lokasi dan kondisi setiap aset, penjadwalan perawatan, serta pelaporan. Setiap aset memiliki kode QR yang dapat dicetak dan ditempel pada unitnya, dan pemindaian kode tersebut membuka rincian aset yang bersangkutan.

> en: Asset management for UPT-KPHL Kapuas Kahayan, covering location and condition records for each asset, maintenance scheduling, and reporting. Every asset has a QR code that can be printed and attached to the unit, and scanning that code opens the details of the asset concerned.

**`sibenih`**

> id: Pendaftaran dan pemantauan sertifikasi benih tanaman pada Balai Pengawasan dan Sertifikasi Benih Tanaman Pangan dan Hortikultura (BPSBTPH) Kalimantan Selatan, mulai dari pengajuan hingga penerbitan sertifikat digital.

> en: Registration and monitoring for plant seed certification at the South Kalimantan Seed Supervision and Certification Agency for Food Crops and Horticulture (BPSBTPH), from application through to a digital certificate.

**`simbas`**

> id: Pengelolaan bantuan sosial di Kecamatan Basarang, mencakup pendataan penerima, pengajuan, penyaluran, hingga pelaporan.

> en: Social assistance management in Basarang subdistrict, covering recipient records, applications, distribution, and reporting.

**`psb-walisongo`**

> id: Pendaftaran dan ujian masuk sebelumnya dilakukan secara tatap muka dan menggunakan kertas. Seluruh tahapannya kemudian dipindahkan ke satu aplikasi. Calon siswa mendaftar secara online, mengerjakan ujian langsung di browser, dan menerima pemberitahuan melalui WhatsApp pada setiap tahap hingga hasil diumumkan.

> en: Registration and the entrance exam were previously done face to face and on paper. All of the stages were then moved into one application. Prospective students register online, sit the exam directly in the browser, and receive notifications through WhatsApp at every stage until results are announced.

### `built`

Hanya tier `full` yang punya `built` terisi. `sibenih` dan `simbas` tetap
`{ id: [], en: [] }`.

**`rsu-nirwana-web`**

id:
1. Beranda, Tentang Kami, dan Dokter Kami sebagai halaman perkenalan
2. Klinik Spesialis, Layanan Unggulan, dan Layanan
3. Informasi, tempat artikel dan pengumuman rumah sakit
4. Pendaftaran yang membedakan pasien baru dan pasien lama
5. Pendaftaran pasien baru dalam tiga langkah: identitas, data pasien, pendaftaran
6. Pembacaan nama, NIK, dan alamat dari foto KTP melalui Google Cloud Vision
7. Isian manual sebagai alternatif apabila foto KTP tidak terbaca
8. Data pendaftaran ditampung di web, kemudian dikirim ke registrasi SIMRS melalui API lewat tombol sinkronkan
9. Bukti pendaftaran untuk verifikasi di loket
10. Validasi sisi server pada seluruh formulir

en:
1. Home, About Us, and Our Doctors as introductory pages
2. Specialist Clinics, Featured Services, and Services
3. Information, holding hospital articles and announcements
4. Registration that distinguishes new patients from returning ones
5. New patient registration in three steps: identity, patient data, registration
6. Name, NIK, and address read from a photo of the ID card through Google Cloud Vision
7. Manual entry as an alternative when the ID card photo cannot be read
8. Registration data held in the site, then sent to the SIMRS registration records through an API from a sync button
9. A registration slip for verification at the counter
10. Server-side validation across the whole form

**`idrg-bridging`**

id:
1. Layanan penghubung antara SIMRS dan endpoint BPJS, mengikuti dokumentasi resmi
2. Coding dan grouping IDRG, kemudian pemetaannya ke grouper INA-CBG
3. Antrian pengiriman klaim beserta penanganan kegagalan pengiriman
4. Pencatatan riwayat permintaan untuk menelusuri klaim yang ditolak
5. Hasil coding diagnosa dikirim otomatis ke SatuSehat melalui service tersendiri

en:
1. A connecting service between the SIMRS and the BPJS endpoints, following the official documentation
2. IDRG coding and grouping, then mapping into the INA-CBG grouper
3. A claim submission queue with failure handling
4. Request history logging so that rejected claims can be traced
5. Diagnosis coding results sent automatically to SatuSehat through a separate service

**`hris-nirwana`** — cakupan tidak berubah, hanya dibakukan.

id:
1. Absensi dengan deteksi wajah dan lokasi yang terikat pada shift pegawai
2. Pengajuan cuti dan izin
3. Pengelolaan jadwal dan shift
4. Data sumber daya manusia dan struktur organisasi
5. Pencatatan inventaris
6. Ticketing internal
7. Notifikasi dan pengingat masa berlaku SIP/STR
8. Pencatatan surat peringatan dan tindakan disiplin
9. Berjalan sebagai PWA yang dapat dipasang di ponsel pegawai

en:
1. Attendance with face detection and location, tied to the employee's shift
2. Leave and permission requests
3. Schedule and shift management
4. Staff records and organisational structure
5. Inventory records
6. Internal ticketing
7. Notifications and SIP/STR expiry reminders
8. Warning letters and disciplinary records
9. Runs as a PWA, installable on staff phones

**`rme`** — cakupan tidak berubah, hanya dibakukan.

id:
1. Pencatatan SOAP untuk rawat jalan dan rawat inap
2. Pencatatan tanda-tanda vital
3. Penegakan diagnosa dengan kode ICD
4. Permintaan pemeriksaan laboratorium
5. Permintaan pemeriksaan radiologi
6. Permintaan resep
7. Penyusunan resume medis

en:
1. SOAP notes for outpatient and inpatient care
2. Vital signs
3. Diagnosis with ICD coding
4. Laboratory test requests
5. Radiology examination requests
6. Prescription requests
7. Discharge summaries

**`sigap-bpn`** — halaman baru.

id:
1. Absensi yang terikat pada titik lokasi kerja
2. Pengelolaan data sumber daya manusia
3. Pengajuan lembur
4. Pengajuan cuti
5. Pencatatan penggajian bulanan yang dihitung dari absensi, lembur, dan cuti

en:
1. Attendance tied to the work site location
2. Human resource records
3. Overtime requests
4. Leave requests
5. Monthly pay records calculated from attendance, overtime, and leave

**`simaset`** — halaman baru.

id:
1. Pencatatan aset beserta lokasi dan kondisinya
2. Kode QR per unit aset, dapat dicetak dan ditempel
3. Pemindaian kode QR yang langsung membuka rincian aset
4. Penjadwalan perawatan aset
5. Perhitungan nilai depresiasi secara otomatis
6. Pelaporan aset

en:
1. Asset records with location and condition
2. A QR code per asset unit, ready to print and attach
3. QR scanning that opens the asset's details directly
4. Maintenance scheduling
5. Automatic depreciation calculation
6. Asset reporting

**`psb-walisongo`** — cakupan tidak berubah, hanya dibakukan.

id:
1. Pendaftaran calon siswa secara online
2. Ujian CBT yang dikerjakan langsung di browser
3. Deteksi perpindahan tab selama ujian berlangsung
4. Notifikasi WhatsApp otomatis melalui Fonnte pada setiap tahap

en:
1. Online registration for prospective students
2. A full computer-based exam, taken in the browser
3. Tab-switch detection while the exam is running
4. Automatic WhatsApp notifications through Fonnte at every stage

## Larangan yang perlu ditulis ulang di `PROGRESS.md`

1. **"HRIS tidak punya payroll atau modul keuangan"** harus tetap berlaku untuk
   HRIS RSU Nirwana, dan harus menyebut HRIS secara eksplisit. SIGAP adalah
   sistem lain milik klien lain, dan SIGAP **memang** mencatat serta menghitung
   penggajian bulanan dari absensi, lembur, dan cuti — tetapi tidak menjalankan
   pembayaran. Tanpa penulisan ulang ini, sesi berikutnya akan melihat kata
   "penggajian" di layar dan menghapusnya sebagai pelanggaran.
2. **"SIMRS Khanza bukan vendor"** berubah menjadi larangan menyebut namanya
   sama sekali. Yang tampil sekarang "SIMRS open source".
3. **Larangan baru: tanpa kata "saya" di prosa halaman baca, dan seluruh prosa
   berbahasa baku.**
4. **Larangan slug** bertambah dua nama baru yang kini punya halaman:
   `sigap-bpn` dan `simaset`.
5. **Catatan baru:** `AxisLegend` tidak ikut ke view `DATAR`, jadi peredupan di
   sana memang tanpa keterangan. Itu pilihan sadar, bukan yang terlewat.

## Di luar lingkup

- Kontras label tahun di peta (`#4C555A`, sekitar 2.3:1) — antrean nomor 2,
  belum ditawarkan ke Utsman.
- Screenshot `hris.png` dan `psb.png` — antrean nomor 3.
- Urutan `siblings()` yang mengikuti urutan array dan bukan kronologi. Setelah
  perubahan tahun ini, `Sebelumnya`/`Berikutnya` tidak lagi kronologis. Dicatat,
  tidak dikerjakan, karena belum pernah dikeluhkan.
- Merge ke `main` dan deploy.

## Verifikasi

Test tidak cukup untuk pekerjaan yang seluruhnya berupa teks dan tata letak.
Yang harus diperiksa di browser sungguhan pada 1280x800:

- Legenda dua baris benar-benar dua baris dan tidak terpotong.
- Baris 2025 berisi empat plate, garisnya berhenti sesudah plate terakhir, dan
  label `2025` berdiri sesudah garis itu tanpa tertimpa plate.
- Peta yang menyusut 4% masih memuat seluruh label plate di dalam panel.
- Chip `stack:livewire` menyaring empat sistem, bukan nol.
- Tujuh halaman baca terbuka, dua di antaranya (`sigap-bpn`, `simaset`) baru.
- `curl` masih memberi seluruh sistem dan tujuh tautan `/kerja/*` tanpa
  JavaScript.

Rasa geraknya tidak berubah dalam pekerjaan ini, jadi yang menunggu mata Utsman
hanya lebar legenda dan panjang nama pendek di plate.
