# Seluruh isi tulisan — untuk dibaca dan dikoreksi

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
| Penghitung | 8 SISTEM · 4 TAMPIL | 8 SYSTEMS · 4 SHOWN |
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
`stack:soap` · `--rare` · `reset`

### Keterangan sumbu peta

| id | en |
|---|---|
| KEDALAMAN tahun · TINGGI teknologi | DEPTH year · HEIGHT technologies |
| LUAS punya halaman · TEPI publik | AREA has page · EDGE public |
| REDUP tersaring, tetap ada | DIM filtered out, still present |
| SERET UNTUK MEMUTAR · 1:1 | DRAG TO ORBIT · 1:1 |

### Meta di atas plate

Contoh: `5 TEKNOLOGI · PUBLIK · GOOGLE VISION` — jumlah teknologi, status akses,
lalu teknologi langka kalau ada.

### Panel kanan

Keadaan awal, sebelum ada yang dipilih — blok catatan, bukan kalimat:

```
NAMA     Utsman
PERAN    Fullstack Developer
LOKASI   Banjarbaru, Kalimantan Selatan
SISTEM   8
KLIEN    5
RENTANG  2024–2026
EMAIL    seffutsmannnn@gmail.com
```

Setelah sebuah sistem dipilih:

| Tempat | id | en |
|---|---|---|
| Label | TERPILIH | SELECTED |
| Daftar stack | LAPISAN STACK | STACK LAYERS |
| Penanda langka | langka | rare |
| Penanda dasar | dasar | baseline |
| Tombol buka | ENTER → BUKA HALAMAN | ENTER → OPEN PAGE |
| Tanpa halaman | RINGKASAN SAJA · TANPA HALAMAN | SUMMARY ONLY · NO PAGE |

### Konsol dan baris status

| Tempat | id | en |
|---|---|---|
| Placeholder | coba: filter client:rsu-nirwana · open hris · stack:soap · help | try: filter client:rsu-nirwana · open hris · stack:soap · help |
| Petunjuk | ENTER MENJALANKAN · ESC MENGOSONGKAN FILTER | ENTER RUNS · ESC CLEARS FILTERS |
| Bantuan | ls · open [nama] · filter [k:v] · --rare · reset · view iso/flat · lang id/en | ls · open [name] · filter [k:v] · --rare · reset · view iso/flat · lang id/en |
| Tak dikenal | tidak dikenal · coba help | unknown · try help |
| Di luar filter | di luar filter saat ini | outside the current filter |
| Tanpa halaman | ringkasan saja · tidak ada halaman | summary only · no page |
| Hasil ls | 8 sistem · 2024–2026 | 8 systems · 2024–2026 |
| Hasil filter | 3 sistem menyala · 5 redup | 3 systems lit · 5 dimmed |
| Baris status | UTSMAN · BANJARBARU, KALIMANTAN SELATAN · email · telepon · GITHUB/UTSMANSEFF · CV.PDF | sama |

---

## 3. Tabel datar — [USULAN]

| Tempat | id | en |
|---|---|---|
| Judul | Delapan sistem, seluruhnya | All eight systems |
| Intro | Daftar datar ini data yang sama dengan peta, tanpa geometrinya. Ini juga yang dipakai kalau JavaScript mati atau gerak dikurangi. | The flat list is the same data as the map, without the geometry. It is also what runs with no JavaScript, or under reduced motion. |
| Kolom | SISTEM · KLIEN · TAHUN · AKSES · STACK · TEKNOLOGI | SYSTEM · CLIENT · YEAR · ACCESS · STACK · TECH |
| Catatan kaki | Klik baris untuk memilih. Lima sistem punya halaman baca; tiga ringkasan saja. | Click a row to select it. Five systems have a reading page; three are summary only. |

---

## 4. Dokumen mobile — [USULAN]

Tanpa judul, tanpa baris petunjuk. Nama, peran, lokasi, lalu langsung tahun.

| Tempat | id | en |
|---|---|---|
| Kepala | UTSMAN · FULLSTACK | UTSMAN · FULLSTACK |
| Catatan yang bisa ditutup | Buka di desktop untuk peta isometrik dan konsolnya. Semuanya juga bisa dibaca di sini. | Open on desktop for the isometric map and console. Everything is readable here too. |
| Meta baris | RSU Nirwana · 5 teknologi · MediaPipe | RSU Nirwana · 5 technologies · MediaPipe |
| Bar bawah | ⌃ FILTER · 8 SISTEM · KONTAK | ⌃ FILTER · 8 SYSTEMS · CONTACT |
| Judul sheet | FILTER · 4 DARI 8 TAMPIL | FILTER · 4 OF 8 SHOWN |
| Kelompok chip | KLIEN · AKSES · STACK LANGKA | CLIENT · ACCESS · RARE STACK |
| Tutup / terapkan | KETUK UNTUK MENUTUP · TERAPKAN · ATUR ULANG | TAP TO CLOSE · APPLY · RESET |

---

## 5. Halaman baca — [ADA] dengan label baru

| Tempat | id | en |
|---|---|---|
| Tautan kembali | ← SEMUA SISTEM | ← ALL SYSTEMS |
| Bagian 1 | 01 KONTEKS | 01 CONTEXT |
| Bagian 2 | 02 YANG DIBANGUN | 02 BUILT |
| Bagian 2b | DI LUAR LINGKUP SAYA | OUTSIDE MY SCOPE |
| Bagian 3 | 03 BAGIAN SULIT | 03 HARD PART |
| Bagian 4 | 04 STACK | 04 STACK |
| Kolom kanan | TANGKAPAN LAYAR · CATATAN | SCREENSHOT · RECORD |
| Baris catatan | KLIEN · TAHUN · PERAN · AKSES · TEKNOLOGI | CLIENT · YEAR · ROLE · ACCESS · TECH |
| Catatan statis | Halaman ini statis. Tidak ada yang membutuhkan JavaScript, dan bisa dibagikan sebagai URL sendiri. | This page is static. Nothing on it requires JavaScript, and it can be shared as its own URL. |
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
| Intro | Terbuka untuk pekerjaan fullstack dan project sistem internal. Paling cepat dibalas lewat email atau WhatsApp. | Open to fullstack work and internal systems projects. Email or WhatsApp gets the fastest reply. |
| Tombol CV | Unduh CV (PDF) | Download CV (PDF) |

---

## 7. Judul halaman dan teks mesin pencari — [ADA], perlu ditinjau

| Tempat | Isi |
|---|---|
| Judul beranda | Utsman — Fullstack Web Developer |
| Pola judul halaman | `%s — Utsman` |
| Judul kontak | Kontak |
| Deskripsi beranda | Peta project Utsman, fullstack web developer di Banjarbaru: sistem rumah sakit dan instansi publik di Kalimantan Selatan — pendaftaran OCR, bridging IDRG/INA-CBGs untuk klaim BPJS, HRIS, dan penerimaan siswa berbasis CBT. |
| Deskripsi kontak | Email, WhatsApp, GitHub dan CV Utsman — fullstack developer di Banjarbaru, Kalimantan Selatan. |
| Deskripsi OG | Peta project: sistem rumah sakit dan instansi publik di Kalimantan Selatan. Pendaftaran OCR, bridging BPJS, HRIS, penerimaan siswa CBT. |

Catatan: deskripsi ini menyebut "peta project" dan belum menyebut RME. Teks
untuk mesin pencari memang boleh berbeda dari teks di layar — di sana kalimat
lengkap justru berguna — tapi isinya perlu disesuaikan setelah bentuk barunya
berdiri.

---

## 8. Delapan sistem

### Pendaftaran OCR  `rsu-nirwana-web` — halaman baca

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

**Blurb satu baris**
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

**03 Bagian sulit**
- id: Akurasi OCR harus dijaga di foto KTP dengan pencahayaan dan sudut yang sangat beragam, sementara dua skema data milik pihak berbeda harus diselaraskan tanpa merusak apa yang sudah diharapkan SIMRS yang berjalan.
- en: Holding OCR accuracy across wildly inconsistent KTP photos, while aligning two separately-owned data schemas without breaking what the running SIMRS already expects.

---

### IDRG Bridging  `idrg-bridging` — halaman baca

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

**Blurb satu baris**
- id: Mediator klaim antara SIMRS dan endpoint BPJS, ditulis ketika akses bridging terancam diputus.
- en: A claim mediator between the SIMRS and the BPJS endpoints, written while bridging access was about to be cut.

**01 Konteks**
- id: Surat edaran Kemenkes mewajibkan update IDRG dan integrasi diagnosa SIMRS ke SatuSehat. Bridging bawaan SIMRS Khanza saat itu tidak memenuhi komponen penilaian, dan akses bridging terancam diputus — artinya klaim BPJS tidak bisa dikirim sama sekali.
- en: A Ministry of Health circular required an IDRG update and SIMRS-to-SatuSehat diagnosis integration. The bundled SIMRS Khanza bridging did not meet the assessment criteria, and bridging access was about to be cut — meaning no BPJS claims could be submitted at all.

**02 Yang dibangun**

| id | en |
|---|---|
| Web service mediator antara SIMRS dan endpoint BPJS, ditulis dari dokumentasi resmi | A mediator web service between SIMRS and the BPJS endpoints, written from the official docs |
| Pemetaan diagnosa dan prosedur ke grouper INA-CBG | Diagnosis and procedure mapping into the INA-CBG grouper |
| Antrian pengiriman klaim dengan penanganan gagal-kirim | A claim submission queue with failure handling |
| Pencatatan jejak permintaan untuk penelusuran saat klaim ditolak | Request logging so rejected claims can be traced |

**03 Bagian sulit**
- id: Mengoordinasikan banyak endpoint BPJS di bawah tenggat regulasi, dengan taruhan yang tidak bisa ditawar: kalau bridging benar-benar diputus, rumah sakit berhenti bisa mengirim klaim.
- en: Coordinating many BPJS endpoints under a regulatory deadline, with a stake that allowed no slippage: if bridging was actually cut, the hospital could not submit claims at all.

---

### HRIS  `hris-nirwana` — halaman baca

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

**Blurb satu baris**
- id: Rumah sakit tanpa sistem kepegawaian sama sekali — mesin absen, surat cuti, Excel yang tersebar — disatukan ke satu tempat.
- en: A hospital with no HR system at all — a punch clock, paper leave forms, scattered Excel — pulled into one place.

**01 Konteks**
- id: Rumah sakit belum punya sistem kepegawaian sama sekali. Absensi bergantung pada mesin absen, pengajuan cuti berjalan lewat surat, dan sisanya dicatat di Excel yang tersebar. HRIS dibangun untuk menyatukan semuanya ke satu tempat.
- en: The hospital had no HR system at all. Attendance ran through a punch clock, leave requests moved on paper, and everything else lived in scattered Excel files. The HRIS was built to pull all of it into one place.

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

**03 Bagian sulit**
- id: Bagian tersulitnya absensi, karena tiga hal harus benar sekaligus. Lokasi harus cukup akurat untuk memastikan pegawai benar-benar berada di rumah sakit, wajah harus diverifikasi supaya absen tidak bisa dititipkan, dan setiap absen harus dicocokkan dengan shift serta jadwal pegawai yang bersangkutan. Deteksi wajah dijalankan di browser lewat MediaPipe, geolokasi dipaksa ke mode akurasi tinggi, dan absen yang tidak cocok dengan jadwal aktif ditolak. Hasilnya yang tercatat bukan sekadar "hadir", tapi hadir pada shift yang benar, di tempat yang benar, oleh orang yang benar.
- en: Attendance was the hard part, because three things had to be right at once. The location had to be accurate enough to confirm the employee was actually at the hospital, the face had to be verified so a check-in could not be done on someone's behalf, and every check-in had to be matched against that employee's shift and schedule. Face detection runs in the browser through MediaPipe, geolocation is forced into high-accuracy mode, and a check-in that does not match the active schedule is rejected. What gets recorded is not simply "present" — it is present on the right shift, in the right place, by the right person.

---

### RME  `rme` — halaman baca

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

**Blurb satu baris**
- id: Lapisan web di atas database SIMRS 1.168 tabel, tetap menulis balik ke sana supaya laporan lama tidak rusak.
- en: A web layer over a 1,168-table SIMRS database, still writing back into it so the existing reports keep working.

**01 Konteks**
- id: Permenkes mewajibkan rekam medis elektronik untuk akreditasi. Rumah sakit memakai SIMRS Khanza — SIMRS open source yang dipakai apa adanya — dan antarmukanya dibiarkan utuh. RME ini berdiri sebagai lapisan web terpisah di atas database yang sama dan menulis ke tabel yang sama, supaya alur kerja dan laporan yang sudah berjalan tidak rusak. Pemakainya dokter dan perawat asisten dokter. Cakupannya rawat jalan, rawat inap, dan IGD; yang berjalan sampai sekarang rawat jalan dan rawat inap.
- en: Ministry regulation made electronic medical records mandatory for accreditation. The hospital runs SIMRS Khanza — an open-source SIMRS used as it comes — and its interface was left untouched. This EMR stands as a separate web layer over the same database, writing into the same tables so the existing workflows and reports keep working. Its users are doctors and the nurses assisting them. It covers outpatient, inpatient and emergency; outpatient and inpatient are what run today.

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

**Di luar lingkup**
- id: Hasil laboratorium, hasil radiologi, dan pemberian obat tetap diinput di SIMRS Khanza.
- en: Laboratory results, radiology results and drug administration are still entered in SIMRS Khanza.

**03 Bagian sulit**
- id: Database SIMRS punya 1.168 tabel tanpa dokumentasi yang memadai, sehingga memetakan data klinis beserta relasi dan constraint-nya lebih mirip rekonstruksi struktur data daripada pekerjaan antarmuka.
- en: The SIMRS database had 1,168 tables with no usable documentation, so mapping the clinical data with its relations and constraints was closer to reconstructing a schema than to interface work.

---

### SIGAP  `sigap-bpn` — ringkasan saja

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

**Blurb satu baris**
- id: Kepegawaian dengan absensi yang terikat pada lokasi kerja.
- en: Staff management with attendance tied to the actual work site.

**Konteks** (dipakai di panel, tidak ada halaman baca)
- id: Manajemen kepegawaian dengan absensi berbasis lokasi, supaya kehadiran tercatat sesuai lokasi kerja.
- en: Staff management with location-based attendance, so presence is recorded against the actual work site.

---

### Aset KPHL  `aset-kphl` — ringkasan saja

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

**Blurb satu baris**
- id: Aset organisasi dengan pelacakan lokasi, kondisi, jadwal perawatan, dan pelaporan.
- en: Organisational assets with location and condition tracking, maintenance scheduling and reporting.

**Konteks** (dipakai di panel, tidak ada halaman baca)
- id: Pengelolaan aset organisasi dengan pelacakan lokasi dan kondisi, jadwal perawatan, dan pelaporan.
- en: Organisational asset management with location and condition tracking, maintenance scheduling and reporting.

---

### Sertifikasi Benih  `sertifikasi-benih` — ringkasan saja

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

**Blurb satu baris**
- id: Pengajuan sampai sertifikat digital untuk sertifikasi benih tanaman.
- en: Plant seed certification, from application through to a digital certificate.

**Konteks** (dipakai di panel, tidak ada halaman baca)
- id: Pendaftaran dan pemantauan sertifikasi benih tanaman, dari pengajuan sampai sertifikat digital.
- en: Plant seed certification registration and monitoring, from application through to a digital certificate.

---

### PSB Walisongo  `psb-walisongo` — halaman baca

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

**Blurb satu baris**
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

**03 Bagian sulit**
- id: Tiga bagian yang sulitnya berbeda-beda. Skema ujian harus menampung bank soal, sesi, jawaban tiap peserta dan waktu pengerjaan dalam satu struktur yang tetap masuk akal saat banyak peserta mengerjakan bersamaan. Pengawasan tidak mungkin dilakukan manusia satu per satu, jadi perpindahan tab dipakai sebagai sinyal — begitu peserta meninggalkan halaman ujian, kejadian itu tercatat dan bisa ditinjau. Terakhir, notifikasi WhatsApp disambungkan lewat Fonnte di setiap tahapan supaya pendaftar tidak perlu menelepon sekolah hanya untuk bertanya sudah sampai mana.
- en: Three parts, each hard in a different way. The exam schema had to hold the question bank, sessions, each participant's answers and their timing in one structure that still made sense with many people sitting the exam at once. Invigilating each screen by hand was impossible, so a tab switch became the signal — the moment a participant leaves the exam page, it is recorded and can be reviewed. Finally, WhatsApp notifications were wired through Fonnte at every stage, so applicants did not have to phone the school just to ask where things stood.

---

(node:23692) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///D:/portfolio-utsman/src/lib/data/projects.js is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to D:\portfolio-utsman\package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
