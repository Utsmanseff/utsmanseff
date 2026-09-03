# Arsip — teks "bagian sulit" dan batas lingkup

Dibuang dari situs 2026-09-03 atas keputusan Utsman: nadanya terlalu seperti
mempertahankan skripsi. Disimpan di sini apa adanya. Kalau suatu saat dipakai
lagi, bentuknya harus jauh lebih pendek dan tidak menjelaskan diri.

## Pendaftaran OCR (`rsu-nirwana-web`)

**Bagian sulit**
- id: Akurasi OCR harus dijaga di foto KTP dengan pencahayaan dan sudut yang sangat beragam, sementara dua skema data milik pihak berbeda harus diselaraskan tanpa merusak apa yang sudah diharapkan SIMRS yang berjalan.
- en: Holding OCR accuracy across wildly inconsistent KTP photos, while aligning two separately-owned data schemas without breaking what the running SIMRS already expects.

## IDRG Bridging (`idrg-bridging`)

**Bagian sulit**
- id: Mengoordinasikan banyak endpoint BPJS di bawah tenggat regulasi, dengan taruhan yang tidak bisa ditawar: kalau bridging benar-benar diputus, rumah sakit berhenti bisa mengirim klaim.
- en: Coordinating many BPJS endpoints under a regulatory deadline, with a stake that allowed no slippage: if bridging was actually cut, the hospital could not submit claims at all.

## HRIS (`hris-nirwana`)

**Bagian sulit**
- id: Bagian tersulitnya absensi, karena tiga hal harus benar sekaligus. Lokasi harus cukup akurat untuk memastikan pegawai benar-benar berada di rumah sakit, wajah harus diverifikasi supaya absen tidak bisa dititipkan, dan setiap absen harus dicocokkan dengan shift serta jadwal pegawai yang bersangkutan. Deteksi wajah dijalankan di browser lewat MediaPipe, geolokasi dipaksa ke mode akurasi tinggi, dan absen yang tidak cocok dengan jadwal aktif ditolak. Hasilnya yang tercatat bukan sekadar "hadir", tapi hadir pada shift yang benar, di tempat yang benar, oleh orang yang benar.
- en: Attendance was the hard part, because three things had to be right at once. The location had to be accurate enough to confirm the employee was actually at the hospital, the face had to be verified so a check-in could not be done on someone's behalf, and every check-in had to be matched against that employee's shift and schedule. Face detection runs in the browser through MediaPipe, geolocation is forced into high-accuracy mode, and a check-in that does not match the active schedule is rejected. What gets recorded is not simply "present" — it is present on the right shift, in the right place, by the right person.

## RME (`rme`)

**Bagian sulit**
- id: Database SIMRS punya 1.168 tabel tanpa dokumentasi yang memadai, sehingga memetakan data klinis beserta relasi dan constraint-nya lebih mirip rekonstruksi struktur data daripada pekerjaan antarmuka.
- en: The SIMRS database had 1,168 tables with no usable documentation, so mapping the clinical data with its relations and constraints was closer to reconstructing a schema than to interface work.

**Di luar lingkup saya**
- id: Hasil laboratorium, hasil radiologi, dan pemberian obat tetap diinput di SIMRS Khanza.
- en: Laboratory results, radiology results and drug administration are still entered in SIMRS Khanza.

## PSB Walisongo (`psb-walisongo`)

**Bagian sulit**
- id: Tiga bagian yang sulitnya berbeda-beda. Skema ujian harus menampung bank soal, sesi, jawaban tiap peserta dan waktu pengerjaan dalam satu struktur yang tetap masuk akal saat banyak peserta mengerjakan bersamaan. Pengawasan tidak mungkin dilakukan manusia satu per satu, jadi perpindahan tab dipakai sebagai sinyal — begitu peserta meninggalkan halaman ujian, kejadian itu tercatat dan bisa ditinjau. Terakhir, notifikasi WhatsApp disambungkan lewat Fonnte di setiap tahapan supaya pendaftar tidak perlu menelepon sekolah hanya untuk bertanya sudah sampai mana.
- en: Three parts, each hard in a different way. The exam schema had to hold the question bank, sessions, each participant's answers and their timing in one structure that still made sense with many people sitting the exam at once. Invigilating each screen by hand was impossible, so a tab switch became the signal — the moment a participant leaves the exam page, it is recorded and can be reviewed. Finally, WhatsApp notifications were wired through Fonnte at every stage, so applicants did not have to phone the school just to ask where things stood.

