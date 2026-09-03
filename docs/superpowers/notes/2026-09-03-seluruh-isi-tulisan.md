# Seluruh isi tulisan — untuk dibaca dan dikoreksi

> Diperbarui 2026-09-03 setelah koreksi Utsman. Yang dibuang: angka jumlah
> sistem di semua tempat, penanda "langka"/"dasar", chip `--rare`, baris hasil
> filter berisi hitungan, bagian "03 Bagian sulit", blok "Di luar lingkup saya",
> dan catatan "Halaman ini statis". Versi terbaca: lihat artifact.

Disusun 2026-09-03. Setiap kalimat yang akan muncul di layar ada di sini, dua
bahasa. Tandai yang mau diubah; tidak ada yang masuk kode sampai Anda setuju.

Penanda:

- **[ADA]** sudah hidup di situs sekarang
- **[USULAN]** baru — terjemahan dari prototipe dengan koreksi istilah
- **[BELUM]** masih kosong, menunggu Anda

---

## 1. Identitas dan kontak — [ADA], fakta

| | |
|---|---|
| Nama | Utsman |
| Peran | Fullstack Developer |
| Lokasi | Banjarbaru, Kalimantan Selatan |
| Email | seffutsmannnn@gmail.com |
| WhatsApp | +62 823 5273 4167 |
| GitHub | Utsmanseff |
| Instagram | @utsmnseff |
| CV | /Utsman-CV.pdf |
| Domain | utsmanseff.vercel.app |

Tidak ada kalimat headline di mana pun. Halaman dibuka oleh identitas, lalu
langsung sistem-sistemnya.

---

## 2. Cangkang desktop — [USULAN]

Istilah yang sudah dikoreksi dari prototipe: **modul → sistem**, **bagian →
teknologi**.

### Baris atas

| Tempat | id | en |
|---|---|---|
| Kiri | UTSMAN · FULLSTACK · BANJARBARU | UTSMAN · FULLSTACK · BANJARBARU |
| Chip lewati peta | LEWATI PETA → DAFTAR SISTEM | SKIP MAP → SYSTEM LIST |
| Pilihan tampilan | TAMPILAN ISO / DATAR | VIEW ISO / FLAT |
| Umpan balik filter | TERSARING | FILTERED |
| Bahasa | ID / en | EN / id |

### Rail kiri

| Tempat | id | en |
|---|---|---|
| Label log | LOG | LOG |
| Label filter | FILTER · KLIK ATAU KETIK | FILTERS · CLICK OR TYPE |
| Label daftar | SISTEM YANG TAMPIL | SYSTEMS IN VIEW |
| Catatan penutup | Sistem yang diredupkan tetap di peta. Tidak ada yang disembunyikan, hanya didorong ke belakang. | Dimmed systems stay on the map. Nothing is ever hidden, only pushed back. |

Chip filter tidak diterjemahkan — ia perintah, bukan kalimat:
`client:rsu-nirwana` · `client:bpn` · `year:2026` · `access:public` ·
`stack:soap` · `reset`

### Keterangan sumbu peta

| id | en |
|---|---|
| KEDALAMAN tahun · TINGGI stack | DEPTH year · HEIGHT stack |
| LUAS punya halaman · TEPI publik | AREA has page · EDGE public |
| REDUP tersaring, tetap ada | DIM filtered out, still present |
| SERET UNTUK MEMUTAR · 1:1 | DRAG TO ORBIT · 1:1 |

### Meta di atas plate

Contoh: `RSU NIRWANA · PUBLIK` — klien lalu status akses. Tanpa angka, tanpa
penanda langka.

### Panel kanan

Keadaan awal, sebelum ada yang dipilih — blok catatan, bukan kalimat:

```
NAMA     Utsman
PERAN    Fullstack Developer
LOKASI   Banjarbaru, Kalimantan Selatan
RENTANG  2024–2026
EMAIL    seffutsmannnn@gmail.com
```

Setelah sebuah sistem dipilih:

| Tempat | id | en |
|---|---|---|
| Label | TERPILIH | SELECTED |
| Daftar stack | LAPISAN STACK | STACK LAYERS |
| Tombol buka | ENTER → BUKA HALAMAN | ENTER → OPEN PAGE |
| Tanpa halaman | RINGKASAN SAJA · TANPA HALAMAN | SUMMARY ONLY · NO PAGE |

### Konsol dan baris status

| Tempat | id | en |
|---|---|---|
| Placeholder | coba: filter client:rsu-nirwana · open hris · stack:soap · help | try: filter client:rsu-nirwana · open hris · stack:soap · help |
| Petunjuk | ENTER MENJALANKAN · ESC MENGOSONGKAN FILTER | ENTER RUNS · ESC CLEARS FILTERS |
| Bantuan | ls · open [nama] · filter [k:v] · reset · view iso/flat · lang id/en | ls · open [name] · filter [k:v] · reset · view iso/flat · lang id/en |
| Tak dikenal | tidak dikenal · coba help | unknown · try help |
| Di luar filter | di luar filter saat ini | outside the current filter |
| Tanpa halaman | ringkasan saja · tidak ada halaman | summary only · no page |
| Baris status | UTSMAN · BANJARBARU, KALIMANTAN SELATAN · email · telepon · GITHUB/UTSMANSEFF · CV.PDF | sama |

---

## 3. Tabel datar — [USULAN]

| Tempat | id | en |
|---|---|---|
| Judul | Semua project | All projects |
| Intro | Daftar datar ini data yang sama dengan peta, tanpa geometrinya. Ini juga yang dipakai kalau JavaScript mati atau gerak dikurangi. | The flat list is the same data as the map, without the geometry. It is also what runs with no JavaScript, or under reduced motion. |
| Kolom | SISTEM · KLIEN · TAHUN · AKSES · STACK | SYSTEM · CLIENT · YEAR · ACCESS · STACK |
| Catatan kaki | Klik baris untuk memilih. Sebagian punya halaman baca, sebagian ringkasan saja. | Click a row to select it. Some have a reading page, some are summary only. |

---

## 4. Dokumen mobile — [USULAN]

Tanpa judul, tanpa baris petunjuk. Nama, peran, lokasi, lalu langsung tahun.

| Tempat | id | en |
|---|---|---|
| Kepala | UTSMAN · FULLSTACK | UTSMAN · FULLSTACK |
| Catatan yang bisa ditutup | Buka di desktop untuk peta isometrik dan konsolnya. Semuanya juga bisa dibaca di sini. | Open on desktop for the isometric map and console. Everything is readable here too. |
| Meta baris | RSU Nirwana · 2026 | RSU Nirwana · 2026 |
| Bar bawah | ⌃ FILTER · KONTAK | ⌃ FILTER · CONTACT |
| Judul sheet | FILTER | FILTER |
| Kelompok chip | KLIEN · AKSES · STACK | CLIENT · ACCESS · STACK |
| Tutup / terapkan | KETUK UNTUK MENUTUP · TERAPKAN · ATUR ULANG | TAP TO CLOSE · APPLY · RESET |

---

## 5. Halaman baca — [ADA] dengan label baru

| Tempat | id | en |
|---|---|---|
| Tautan kembali | ← SEMUA SISTEM | ← ALL SYSTEMS |
| Bagian 1 | 01 KONTEKS | 01 CONTEXT |
| Bagian 2 | 02 YANG DIBANGUN | 02 BUILT |
| Bagian 3 | 03 STACK | 03 STACK |
| Kolom kanan | TANGKAPAN LAYAR · CATATAN | SCREENSHOT · RECORD |
| Baris catatan | KLIEN · TAHUN · PERAN · AKSES | CLIENT · YEAR · ROLE · ACCESS |
| Sebelumnya / berikutnya | Sebelumnya · Berikutnya | Previous · Next |

### Status akses — [ADA]

| Keadaan | id pendek | en pendek | id panjang | en panjang |
|---|---|---|---|---|
| public | PUBLIK | PUBLIC | Publik — bisa dijelajahi | Public — open to explore |
| internal | INTERNAL | INTERNAL | Internal — demo atas permintaan | Internal — demo on request |
| none | TANPA URL | NO URL | Tidak ada URL publik | No public URL |

### Slot screenshot

| Keadaan | id | en |
|---|---|---|
| Ada, perlu sensor | perlu penyensoran — nama, NIK, dan nomor rekam medis ditutup dulu | redaction required — names, NIK and record numbers masked first |
| Belum ada | kosong dengan sengaja — sistem internal, tidak ada yang dipentaskan sebagai gantinya | empty by choice — internal system, nothing staged in its place |

Yang belum punya screenshot: **HRIS** dan **PSB Walisongo**. **[BELUM]**

---

## 6. Halaman kontak — [ADA]

| Tempat | id | en |
|---|---|---|
| Judul | Kontak | Contact |
| Intro | Terbuka untuk kerja sama. | Open to work. |
| Tombol CV | Unduh CV (PDF) | Download CV (PDF) |

---

## 7. Judul halaman dan teks mesin pencari — [ADA], perlu ditinjau

| Tempat | Isi |
|---|---|
| Judul beranda | Utsman — Fullstack Web Developer |
| Pola judul halaman | `%s — Utsman` |
| Judul kontak | Kontak |
| Deskripsi beranda | Utsman — fullstack web developer di Banjarbaru, Kalimantan Selatan. Portofolio project dan cara menghubungi. |
| Deskripsi kontak | Email, WhatsApp, GitHub dan CV Utsman — fullstack developer di Banjarbaru, Kalimantan Selatan. |
| Deskripsi OG | Portofolio Utsman, fullstack web developer di Banjarbaru, Kalimantan Selatan. |

Sudah digeneralkan 2026-09-03: tidak lagi mendaftar sistem satu per satu, dan
kata "peta project" dibuang karena petanya cuma ada di desktop.

---

## 8. Sistem

### Pendaftaran OCR `rsu-nirwana-web` — halaman baca

| | |
|---|---|
| Klien | RSU Nirwana |
| Tahun | 2025 |
| Akses | public |
| Stack | Laravel, Next.js, MySQL, Google Vision, REST API |
| URL | https://rsunirwana.id |
| Screenshot | /assets/img/pendaftaran.png |

**Nama pendek** — id: Pendaftaran OCR · en: OCR Registration

**Judul**
- id: Pendaftaran Rumah Sakit Berbasis OCR
- en: OCR-Powered Hospital Registration

**Blurb**
- id: KTP difoto dan dibaca OCR, hasilnya masuk ke SIMRS tanpa diketik ulang di loket.
- en: A KTP is photographed and read by OCR, and the result reaches the SIMRS without being retyped at the counter.

**01 Konteks**
- id: Pendaftaran online yang lama hanya mengamankan kuota — pasien tetap antri di loket. Formulirnya panjang dan rawan salah ketik, terutama untuk lansia, dan resepsionis harus mengetik ulang karena data web tidak pernah masuk SIMRS.
- en: The legacy pre-registration only secured a queue slot; patients still queued at the counter. The long form was error-prone for elderly users, and receptionists retyped everything because the web flow never reached the internal SIMRS.

**02 Yang dibangun**

| id | en |
|---|---|
| Ekstraksi nama, NIK dan alamat dari foto KTP lewat Google Cloud Vision | Name, NIK and address extracted from a KTP photo via Google Cloud Vision |
| Sinkronisasi data pendaftaran langsung ke SIMRS internal | Registration data synced straight into the internal SIMRS |
| Bukti pendaftaran untuk verifikasi cepat di loket | A confirmation slip for fast verification at the counter |
| Validasi sisi server di seluruh formulir | Server-side validation across the whole form |

---

### IDRG Bridging `idrg-bridging` — halaman baca

| | |
|---|---|
| Klien | RSU Nirwana |
| Tahun | 2025 |
| Akses | internal |
| Stack | Laravel, MySQL, REST API, SOAP |
| URL | — |
| Screenshot | /assets/img/eklaim.png |

**Nama pendek** — id: IDRG Bridging · en: IDRG Bridging

**Judul**
- id: Bridging IDRG / INA-CBGs untuk Klaim BPJS
- en: IDRG / INA-CBGs Bridging for BPJS Claims

**Blurb**
- id: Menyambungkan data klaim rumah sakit ke sistem BPJS.
- en: Connects the hospital's claim data to the BPJS system.

**01 Konteks**
- id: Klaim BPJS dikirim lewat bridging antara sistem rumah sakit dan BPJS. Ada pembaruan aturan IDRG dan integrasi diagnosa ke SatuSehat yang perlu dipenuhi, jadi saya membuat layanan penghubungnya supaya pengiriman klaim tetap berjalan.
- en: BPJS claims are submitted through a bridge between the hospital system and BPJS. An IDRG update and a SatuSehat diagnosis integration had to be met, so I built the connecting service that keeps claims going out.

**02 Yang dibangun**

| id | en |
|---|---|
| Layanan penghubung antara SIMRS dan endpoint BPJS, mengikuti dokumentasi resmi | A connecting service between the SIMRS and the BPJS endpoints, following the official docs |
| Pemetaan diagnosa dan prosedur ke grouper INA-CBG | Diagnosis and procedure mapping into the INA-CBG grouper |
| Antrian pengiriman klaim dengan penanganan gagal-kirim | A claim submission queue with failure handling |
| Pencatatan riwayat permintaan untuk menelusuri klaim yang ditolak | Request history logging so rejected claims can be traced |

---

### HRIS `hris-nirwana` — halaman baca

| | |
|---|---|
| Klien | RSU Nirwana |
| Tahun | 2026 |
| Akses | internal |
| Stack | Laravel, Livewire, Alpine.js, MySQL, MediaPipe |
| URL | — |
| Screenshot | BELUM ADA |

**Nama pendek** — id: HRIS · en: HRIS

**Judul**
- id: Sistem Kepegawaian Rumah Sakit
- en: Hospital HR System

**Blurb**
- id: Absensi, cuti, jadwal, dan data pegawai dalam satu aplikasi.
- en: Attendance, leave, schedules and staff records in one app.

**01 Konteks**
- id: Sebelumnya absensi memakai mesin absen, pengajuan cuti lewat surat, dan data pegawai tersimpan di Excel. HRIS ini menyatukannya ke satu aplikasi, dengan absensi yang memakai lokasi dan deteksi wajah serta terhubung ke jadwal shift pegawai.
- en: Attendance used to run on a punch clock, leave requests on paper, and staff data in Excel. This HRIS brings them into one app, with attendance that uses location and face detection and is tied to each employee's shift.

**02 Yang dibangun**

| id | en |
|---|---|
| Absensi dengan deteksi wajah dan lokasi, terikat pada shift pegawai | Attendance with face detection and location, tied to the employee's shift |
| Pengajuan cuti dan izin | Leave and permission requests |
| Pengelolaan jadwal dan shift | Schedule and shift management |
| Data SDM dan struktur organisasi | Staff records and org structure |
| Pencatatan inventaris | Inventory records |
| Ticketing internal | Internal ticketing |
| Notifikasi dan pengingat masa berlaku SIP/STR | Notifications and SIP/STR expiry reminders |
| Pencatatan SP dan tindakan disiplin | Disciplinary records and warning letters |
| Berjalan sebagai PWA, bisa dipasang di ponsel pegawai | Runs as a PWA, installable on staff phones |

---

### RME `rme` — halaman baca

| | |
|---|---|
| Klien | RSU Nirwana |
| Tahun | 2025 |
| Akses | internal |
| Stack | Laravel, MySQL, Livewire |
| URL | — |
| Screenshot | /assets/img/rme1.png |

**Nama pendek** — id: RME · en: EMR

**Judul**
- id: Rekam Medis Elektronik
- en: Electronic Medical Records

**Blurb**
- id: Pencatatan rekam medis elektronik untuk rawat jalan dan rawat inap.
- en: Electronic medical records for outpatient and inpatient care.

**01 Konteks**
- id: Rekam medis elektronik untuk rawat jalan dan rawat inap, dipakai dokter dan perawat asisten dokter. Rumah sakit sudah memakai SIMRS Khanza, jadi RME ini dibuat sebagai aplikasi web terpisah yang menulis ke database yang sama supaya pencatatan dan laporannya tetap menyatu.
- en: Electronic medical records for outpatient and inpatient care, used by doctors and the nurses assisting them. The hospital already runs SIMRS Khanza, so this was built as a separate web app that writes into the same database, keeping records and reports in one place.

**02 Yang dibangun**

| id | en |
|---|---|
| Pencatatan SOAP untuk rawat jalan dan rawat inap | SOAP notes for outpatient and inpatient care |
| Tanda-tanda vital | Vital signs |
| Penegakan diagnosa dengan kode ICD | Diagnosis with ICD coding |
| Permintaan pemeriksaan laboratorium | Laboratory test requests |
| Permintaan pemeriksaan radiologi | Radiology examination requests |
| Permintaan resep | Prescription requests |
| Resume medis | Discharge summaries |

---

### SIGAP `sigap-bpn` — ringkasan saja

| | |
|---|---|
| Klien | BPN |
| Tahun | 2024 |
| Akses | none |
| Stack | Laravel, Livewire, MySQL |
| URL | — |
| Screenshot | /assets/img/sigap.jpg |

**Nama pendek** — id: SIGAP · en: SIGAP

**Judul**
- id: Kepegawaian & Absensi Geolocation
- en: Staffing & Geolocation Attendance

**Blurb**
- id: Kepegawaian dengan absensi yang terikat pada lokasi kerja.
- en: Staff management with attendance tied to the actual work site.

**Konteks** (panel saja)
- id: Manajemen kepegawaian dengan absensi berbasis lokasi, supaya kehadiran tercatat sesuai lokasi kerja.
- en: Staff management with location-based attendance, so presence is recorded against the actual work site.

---

### Aset KPHL `aset-kphl` — ringkasan saja

| | |
|---|---|
| Klien | KPHL |
| Tahun | 2024 |
| Akses | none |
| Stack | Laravel, Livewire, MySQL |
| URL | — |
| Screenshot | /assets/img/aset.jpg |

**Nama pendek** — id: Aset KPHL · en: KPHL Assets

**Judul**
- id: Manajemen Aset & Inventaris
- en: Asset & Inventory Management

**Blurb**
- id: Aset organisasi dengan pelacakan lokasi, kondisi, jadwal perawatan, dan pelaporan.
- en: Organisational assets with location and condition tracking, maintenance scheduling and reporting.

**Konteks** (panel saja)
- id: Pengelolaan aset organisasi dengan pelacakan lokasi dan kondisi, jadwal perawatan, dan pelaporan.
- en: Organisational asset management with location and condition tracking, maintenance scheduling and reporting.

---

### Sertifikasi Benih `sertifikasi-benih` — ringkasan saja

| | |
|---|---|
| Klien | Dinas Pertanian |
| Tahun | 2024 |
| Akses | none |
| Stack | Laravel, Livewire, MySQL |
| URL | — |
| Screenshot | /assets/img/sertifikasi.png |

**Nama pendek** — id: Sertifikasi Benih · en: Seed Certification

**Judul**
- id: Aplikasi Sertifikasi Benih
- en: Seed Certification System

**Blurb**
- id: Pengajuan sampai sertifikat digital untuk sertifikasi benih tanaman.
- en: Plant seed certification, from application through to a digital certificate.

**Konteks** (panel saja)
- id: Pendaftaran dan pemantauan sertifikasi benih tanaman, dari pengajuan sampai sertifikat digital.
- en: Plant seed certification registration and monitoring, from application through to a digital certificate.

---

### PSB Walisongo `psb-walisongo` — halaman baca

| | |
|---|---|
| Klien | MTs WaliSongo Banjarbaru |
| Tahun | 2026 |
| Akses | none |
| Stack | Laravel, JavaScript, MySQL, Fonnte |
| URL | — |
| Screenshot | BELUM ADA |

**Nama pendek** — id: PSB Walisongo · en: Walisongo Admissions

**Judul**
- id: Penerimaan Siswa Baru dengan Ujian CBT
- en: School Admissions with Computer-Based Testing

**Blurb**
- id: Pendaftaran sampai ujian masuk berbasis browser, dengan notifikasi WhatsApp di tiap tahap.
- en: Registration through a browser-based entrance exam, with WhatsApp notifications at every stage.

**01 Konteks**
- id: Pendaftaran dan ujian masuk sebelumnya berjalan manual dan tatap muka. Sekolah ingin seluruh alurnya pindah ke digital, dari calon siswa mendaftar sampai hasil ujian keluar.
- en: Registration and the entrance exam both ran manually and face to face. The school wanted the whole flow moved online, from a prospective student registering through to results.

**02 Yang dibangun**

| id | en |
|---|---|
| Pendaftaran calon siswa secara online | Online registration for prospective students |
| Ujian CBT penuh, dikerjakan langsung di browser | A full computer-based exam, taken in the browser |
| Deteksi perpindahan tab selama ujian berlangsung | Tab-switch detection while the exam is running |
| Notifikasi WhatsApp otomatis lewat Fonnte di setiap tahapan | Automatic WhatsApp notifications through Fonnte at every stage |

---

