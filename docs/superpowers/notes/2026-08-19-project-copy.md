# Sumber copy — HRIS Nirwana & PSB MTs Walisongo

Dikumpulkan 2026-08-20 langsung dari Utsman. Bagian **Jawaban mentah** adalah kata-kata beliau apa adanya. Bagian **Copy jadi** adalah penyusunan ulang dari jawaban itu, tanpa fakta tambahan. Kalau keduanya berbeda, jawaban mentah yang benar.

---

## HRIS Nirwana

### Jawaban mentah

> HRIS 2026. modul absensi, pengajuan cuti, pengelolaan jadwal, pengelolaan data sdm dan organisasi, pencatatan inventaris, ticketing, PWA, notifikasi, pengingat SIP/STR, pemberian SP/disiplin. sebelumnya manual, absen pakai mesin absen, pengajuan manual pakai surat, semua dicatat via excel dsb, dibangun karna memang tidak punya sistem. membangun sistem absensi dengan akurasi lokasi tinggi, deteksi wajah, dan logika keterkaitan absen dengan shift/jadwal dia. cara menyelsaikannya, pakai mediapipe untuk deteksi wajah, enable high acuracy. stack laravel+livewire+alpine.js, MySql. Ada screenshoot

### Fakta terkunci

- Tahun: 2026
- Klien: RSU Nirwana
- Akses: internal, perlu login
- Stack: Laravel, Livewire, Alpine.js, MySQL, MediaPipe
- **Tidak ada payroll dan tidak ada modul keuangan apa pun.** Jangan disinggung.
- Screenshot: ada, belum masuk repo

### Copy jadi

**shortName** — id: `HRIS` · en: `HRIS`

**title** — id: `Sistem Kepegawaian Rumah Sakit` · en: `Hospital HR System`

**context**
- id: Rumah sakit belum punya sistem kepegawaian sama sekali. Absensi bergantung pada mesin absen, pengajuan cuti berjalan lewat surat, dan sisanya dicatat di Excel yang tersebar. HRIS dibangun untuk menyatukan semuanya ke satu tempat.
- en: The hospital had no HR system at all. Attendance ran through a punch clock, leave requests moved on paper, and everything else lived in scattered Excel files. The HRIS was built to pull all of it into one place.

**built**
- id:
  - Absensi dengan deteksi wajah dan lokasi, terikat pada shift pegawai
  - Pengajuan cuti dan izin
  - Pengelolaan jadwal dan shift
  - Data SDM dan struktur organisasi
  - Pencatatan inventaris
  - Ticketing internal
  - Notifikasi dan pengingat masa berlaku SIP/STR
  - Pencatatan SP dan tindakan disiplin
  - Berjalan sebagai PWA, bisa dipasang di ponsel pegawai
- en:
  - Attendance with face detection and location, tied to the employee's shift
  - Leave and permission requests
  - Schedule and shift management
  - Staff records and org structure
  - Inventory records
  - Internal ticketing
  - Notifications and SIP/STR expiry reminders
  - Disciplinary records and warning letters
  - Runs as a PWA, installable on staff phones

**hard**
- id: Bagian tersulitnya absensi, karena tiga hal harus benar sekaligus. Lokasi harus cukup akurat untuk memastikan pegawai benar-benar berada di rumah sakit, wajah harus diverifikasi supaya absen tidak bisa dititipkan, dan setiap absen harus dicocokkan dengan shift serta jadwal pegawai yang bersangkutan. Deteksi wajah dijalankan di browser lewat MediaPipe, geolokasi dipaksa ke mode akurasi tinggi, dan absen yang tidak cocok dengan jadwal aktif ditolak. Hasilnya yang tercatat bukan sekadar "hadir", tapi hadir pada shift yang benar, di tempat yang benar, oleh orang yang benar.
- en: Attendance was the hard part, because three things had to be right at once. The location had to be accurate enough to confirm the employee was actually at the hospital, the face had to be verified so a check-in could not be done on someone's behalf, and every check-in had to be matched against that employee's shift and schedule. Face detection runs in the browser through MediaPipe, geolocation is forced into high-accuracy mode, and a check-in that does not match the active schedule is rejected. What gets recorded is not simply "present" — it is present on the right shift, in the right place, by the right person.

---

## PSB MTs Walisongo

### Jawaban mentah

> PSB MTs Walisongo 2026. pendaftaram, ujian cbt penuh sampai deteksi kecurangan pindah tab, real time notification di setiap tahapan ke wa pendaftar. sbelumnya pendaftaran dan ujian manual langsung, dibangun karna ingin digitalisasi. bagian paling sulit menyusun skema ujian, deteksi kecurangan sampai integrasi notifikasi. stack laravel, javascript, mysql, fonnte. ada screenshot

### Fakta terkunci

- Tahun: 2026
- Klien: MTs WaliSongo Banjarbaru
- Akses: tidak ada URL publik
- Stack: Laravel, JavaScript, MySQL, Fonnte
- Screenshot: ada, belum masuk repo

### Copy jadi

**shortName** — id: `PSB Walisongo` · en: `Walisongo Admissions`

**title** — id: `Penerimaan Siswa Baru dengan Ujian CBT` · en: `School Admissions with Computer-Based Testing`

**context**
- id: Pendaftaran dan ujian masuk sebelumnya berjalan manual dan tatap muka. Sekolah ingin seluruh alurnya pindah ke digital, dari calon siswa mendaftar sampai hasil ujian keluar.
- en: Registration and the entrance exam both ran manually and face to face. The school wanted the whole flow moved online, from a prospective student registering through to results.

**built**
- id:
  - Pendaftaran calon siswa secara online
  - Ujian CBT penuh, dikerjakan langsung di browser
  - Deteksi perpindahan tab selama ujian berlangsung
  - Notifikasi WhatsApp otomatis lewat Fonnte di setiap tahapan
- en:
  - Online registration for prospective students
  - A full computer-based exam, taken in the browser
  - Tab-switch detection while the exam is running
  - Automatic WhatsApp notifications through Fonnte at every stage

**hard**
- id: Tiga bagian yang sulitnya berbeda-beda. Skema ujian harus menampung bank soal, sesi, jawaban tiap peserta dan waktu pengerjaan dalam satu struktur yang tetap masuk akal saat ratusan peserta mengerjakan bersamaan. Pengawasan tidak mungkin dilakukan manusia satu per satu, jadi perpindahan tab dipakai sebagai sinyal — begitu peserta meninggalkan halaman ujian, kejadian itu tercatat dan bisa ditinjau. Terakhir, notifikasi WhatsApp disambungkan lewat Fonnte di setiap tahapan supaya orang tua dan pendaftar tidak perlu menelepon sekolah hanya untuk bertanya sudah sampai mana.
- en: Three parts, each hard in a different way. The exam schema had to hold the question bank, sessions, each participant's answers and their timing in one structure that still made sense with hundreds of people sitting the exam at once. Invigilating each screen by hand was impossible, so a tab switch became the signal — the moment a participant leaves the exam page, it is recorded and can be reviewed. Finally, WhatsApp notifications were wired through Fonnte at every stage, so parents and applicants did not have to phone the school just to ask where things stood.

---

## Masih kurang

Screenshot untuk kedua project. Sampai filenya masuk, `image` bernilai `null` dan halaman menampilkan status kosong yang dirancang, bukan gambar rusak.

- HRIS → `public/assets/img/hris.png`
- PSB → `public/assets/img/psb.png`
