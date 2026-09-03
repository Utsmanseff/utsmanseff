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

Belum final. Tiga varian untuk dipilih dan dipotong nanti.

**A.** Empat tahun menulis perangkat lunak di dalam batasan orang lain: SIMRS
vendor, endpoint BPJS, aturan Kemenkes.

**B.** Sebagian besar pekerjaan ini terjadi di dalam sistem milik orang lain —
SIMRS yang tidak bisa diubah, endpoint BPJS, dan tenggat dari Kemenkes.

**C.** Perangkat lunak untuk ruang klinis, ditulis di dalam batasan yang tidak
saya pilih sendiri.

Catatan pemeriksaan fakta:

- "Empat tahun" sudah dipakai di blurb yang ada sekarang dan datang dari Utsman
  sendiri. Project yang ditampilkan menjangkau 2024–2026 (tiga tahun kalender);
  kalau angka empat dipertahankan, ia merujuk lama bekerja, bukan rentang
  project di peta. **[PERLU JAWABAN]** — pertahankan "empat tahun", atau ganti
  ke rentang yang terbukti di peta?
- "SIMRS vendor" terbukti: RME (antarmuka vendor tidak bisa dimodifikasi) dan
  IDRG (bridging bawaan SIMRS Khanza tidak memenuhi penilaian).
- "Endpoint BPJS" terbukti: IDRG.
- "Aturan Kemenkes" terbukti: RME (Permenkes untuk akreditasi) dan IDRG (surat
  edaran IDRG/SatuSehat).

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

## 5. RME naik jadi halaman penuh

Yang sudah ada dan tidak perlu ditulis ulang:

- `context` — Permenkes mewajibkan RME untuk akreditasi; antarmuka vendor tidak
  bisa diubah, jadi lapisan web terpisah di atas database SIMRS yang sama.
- `hard` — 1.168 tabel tanpa dokumentasi yang memadai; memetakan data klinis
  beserta relasi dan constraint-nya lebih mirip rekonstruksi skema.
- `image` — `/assets/img/rme1.png` sudah ada di repo.
- `access` — internal.
- `tech` — Laravel, Livewire, MySQL.

Yang kosong dan menghalangi halamannya berdiri:

**[PERLU JAWABAN] `built` — daftar "apa yang saya bangun" untuk RME.** Empat
sampai enam butir. Pertanyaan pemancingnya ada di bawah.

## 6. Pertanyaan terbuka untuk Utsman

1. **RME dipakai untuk apa saja?** Rawat jalan, rawat inap, IGD, atau
   sebagiannya? Modul apa yang benar-benar Anda tulis — pencatatan SOAP/asesmen,
   resep, diagnosa ICD, riwayat kunjungan, tanda vital, unggah hasil penunjang?
2. **Siapa yang memakainya sehari-hari** — dokter, perawat, petugas rekam medis?
3. **Bagaimana lapisan web ini hidup berdampingan dengan sistem vendor?** Menulis
   ke tabel yang sama, atau ada tabel sendiri yang disinkronkan?
4. **Apa yang tidak Anda kerjakan di RME**, supaya batas klaimnya jelas.
5. **Headline:** pertahankan "empat tahun", atau pakai rentang yang terbukti di
   peta (2024–2026)?
6. **Screenshot HRIS dan PSB** masih belum ada. Sampai masuk, dua halaman itu
   memakai keadaan kosong yang dirancang — bukan gambar palsu.
