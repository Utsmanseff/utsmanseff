# Portfolio Redesign — Kanvas + Halaman Diam

**Tanggal:** 2026-08-19
**Status:** disetujui, siap masuk perencanaan implementasi
**Menggantikan:** `2026-04-25-portfolio-redesign-design.md` (editorial scroll panjang)

---

## 1. Kenapa dibongkar

Porto versi sekarang selesai dan secara visual tidak buruk — palet cream/forest/amber terasa dibuat manusia, bukan hasil generator. Masalahnya ada di tempat lain:

- **Bentuknya porto klasik.** Sembilan section berjajar ke bawah. Tidak ada yang menempel di ingatan.
- **Isinya berlebihan.** Riwayat kerja dan pendidikan mengulang isi CV. Di Indonesia, HRD membaca CV; tim teknis yang membuka porto. Dua data itu melayani pembaca yang tidak pernah datang.
- **Karya tenggelam.** About, Skills, Experience, Education memakan empat section sebelum project pertama muncul.
- **Banyak klaim, sedikit yang bisa dicek.**

## 2. Untuk siapa

**Utama: tim teknis (engineer, tech lead).** Merekalah yang benar-benar membuka porto, dan mereka menilai cara berpikir, bukan daftar stack.

**Sekunder: klien freelance.** Dilayani lewat jalur kontak yang jelas, tanpa mengubah struktur.

**Bukan target: HRD/recruiter.** Sudah ditangani CV. Ini keputusan sadar, bukan kelalaian.

## 3. Konsep: C+A — kanvas untuk menjelajah, halaman untuk membaca

Dua lapis dengan tugas berbeda.

**Lapis jelajah (`/`).** Bidang gelap yang digeser, bukan halaman yang di-scroll. Project jadi simpul yang tersebar dan terhubung. Ukuran simpul menyatakan bobot; garis menyatakan hubungan nyata (klien sama, domain sama). Hierarki muncul dari ruang, bukan urutan scroll.

**Lapis baca (`/kerja/[slug]`).** Halaman kertas krem biasa. Bisa di-scroll, dibaca tenang, dibagikan lewat chat, dan dibaca Google.

Kanvas sendirian akan gagal di tiga hal yang penting: dibaca serius, dibagikan, dan ditemukan mesin pencari. Halaman diam menambal ketiganya. Recruiter yang buru-buru bisa langsung dikirimi `/kerja/rsu-nirwana-web` tanpa menyentuh kanvas sama sekali.

## 4. Rute

| Rute | Isi | Render |
|---|---|---|
| `/` | Kanvas gelap, 9 simpul | Klien |
| `/kerja/[slug]` | Halaman project | Server (SEO) |
| `/kontak` | Email, WhatsApp, GitHub, CV | Server |

## 5. Peta simpul

Satu simpul pusat + delapan project. Tidak ada project berstatus "segera".

**Pusat — Utsman.** Foto kecil, 2-3 kalimat, tombol unduh CV.

**Gugus Nirwana (4).** RSU Nirwana Web + OCR, HRIS Nirwana, IDRG Bridging BPJS, RME. Kerapatan gugus ini menyampaikan hal yang hilang di layout lama: bukan tukang proyek lepas, tapi orang yang membangun sistem satu rumah sakit bertahun-tahun.

**Gugus pemerintahan (3).** SIGAP BPN, Aset KPHL, Sertifikasi Benih.

**Pendidikan (1).** PSB MTs Walisongo (CBT).

**Tingkat simpul:**

- `tier: "full"` — RSU Nirwana Web + OCR, HRIS Nirwana, IDRG Bridging, PSB MTs Walisongo. Simpul besar, punya halaman `/kerja/[slug]`.
- `tier: "brief"` — RME, SIGAP BPN, Aset KPHL, Sertifikasi Benih. Simpul kecil, hanya panel pratinjau di kanvas.

## 6. Bukti dan kejujuran

Keluhan "isinya klaim, bukan bukti" diselesaikan dengan **membuang klaim**, bukan dengan mengarang bukti. Tidak ada angka dampak kecuali ada sumbernya. Yang berbicara: screenshot dan URL live.

Status akses berbeda per project dan ditulis terang di simpul maupun halaman:

| Project | Akses | Label |
|---|---|---|
| RSU Nirwana Web + OCR | Publik, bisa dijelajahi | **Coba langsung ↗** |
| HRIS Nirwana | Internal, perlu login | **Internal — demo atas permintaan** |
| IDRG Bridging | Internal, perlu login | **Internal — demo atas permintaan** |
| RME | Internal, perlu login | **Internal — demo atas permintaan** |
| SIGAP BPN / Aset KPHL / Sertifikasi Benih | Menyusul saat aset dikumpulkan | mengikuti kenyataan |
| PSB MTs Walisongo | Tidak ada URL live | **Screenshot saja** |

Label akses yang terang membaca profesional. Yang merusak kepercayaan adalah tombol "Live Demo" yang ternyata mati.

**Batasan isi:** HRIS Nirwana tidak mencakup payroll atau apa pun yang berkaitan dengan keuangan. Bagian itu belum dibangun dan tidak boleh disinggung.

Screenshot dari sistem klinis disensor: data pasien diburamkan atau diganti dummy sebelum dipublikasikan.

## 7. Mekanik kanvas

- **Seret** menggeser bidang, 1:1 tanpa easing. Roda mouse melakukan zoom; dua jari di trackpad menggeser.
- **Zoom mengubah tingkat detail.** Jauh: nama saja. Dekat: nama + stack + tahun. Ini yang mencegah kanvas terasa seperti "sembilan lingkaran kosong".
- **Klik simpul** membuka panel selebar 55% dari kanan: judul, 2-3 kalimat, thumbnail, badge akses, tombol **Buka halaman** (tier `full`) dan tombol akses.
- **Tombol "Tampilkan semua"** selalu terlihat di pojok kiri atas, mengembalikan seluruh peta ke dalam bingkai. Pengaman anti-tersesat, ada sejak detik pertama.
- **Tanpa mekanik penyingkapan.** Semua simpul terlihat sejak awal. Tidak ada kabut, tidak ada simpul tersembunyi.
- **Keyboard:** Tab memutar antar simpul mengikuti urutan baca, Enter membuka panel, Esc menutup. Tanpa ini kanvas tidak terpakai sama sekali oleh pengguna keyboard — dan tim teknis akan mengetesnya.
- **Mobile (< 768px):** kanvas tidak dipaksakan. `/` berubah jadi daftar kartu vertikal yang tenang, dikelompokkan per gugus. Menggeser peta dengan satu jari di layar lima inci itu siksaan; daftar adalah versi wajar, bukan versi cacat.

**Risiko yang diketahui:** dengan sembilan simpul, kanvas bisa terasa sepele. Penawarnya ada tiga — garis hubungan yang bermakna, label informatif, dan detail yang bertambah saat zoom. Kalau ketiganya gagal, kanvas turun jadi gimmick dan sebaiknya mundur ke daftar.

## 8. Anatomi halaman project

Tujuh blok, urutan tetap, tidak ada tambahan.

1. **Kepala** — klien · tahun · peran; judul; badge akses.
2. **Konteks** — 2-3 kalimat: apa yang ada sebelumnya, kenapa dibangun. Tanpa angka karangan.
3. **Screenshot besar** — disensor bila perlu. Blok terpenting di halaman.
4. **Apa yang saya bangun** — daftar fitur konkret dan faktual. "Ekstraksi NIK dan nama dari foto KTP", bukan "meningkatkan efisiensi pendaftaran".
5. **Yang sulit** — satu paragraf jujur tentang bagian tersulit dan cara menyelesaikannya. Blok yang paling dibaca tim teknis, dan satu-satunya tempat suara pribadi muncul. Dipertahankan dari desain lama.
6. **Stack** — tag, apa adanya.
7. **Kaki** — tombol akses, project sebelumnya/berikutnya, kembali ke kanvas.

## 9. Visual

Gelap dan terang tidak dipilih salah satu, dan juga tidak dilebur jadi abu-abu. Keduanya dipakai dan masing-masing punya tugas: **gelap berarti sedang menjelajah, terang berarti sedang membaca.**

| Token | Nilai | Dipakai di |
|---|---|---|
| `--canvas-ground` | `#161A1D` arang hangat | latar kanvas |
| `--canvas-grid` | `rgba(232,224,208,.13)` | titik grid |
| `--paper` | `#F2EDE3` | halaman baca |
| `--ink` | `#1A1A1A` | teks di kertas |
| `--amber` | `#C97B3F` | aksen di dua lapis |

Tipografi tetap: Fraunces (judul), Inter (badan), JetBrains Mono (label). Pembagiannya bergeser — **mono mendominasi kanvas** supaya terasa seperti alat, **serif mendominasi halaman** supaya terasa seperti bacaan.

**Tidak ada toggle tema.** Satu perlakuan yang digarap benar, bukan dua yang setengah jadi.

## 10. Kontrak gerak

Memory lama ("fade panjang ≥900ms, opacity saja, tanpa lift/glow/rotate") tetap berlaku, tapi wilayahnya dipertegas:

- **Manipulasi langsung — tanpa easing.** Seret dan zoom mengikuti jari 1:1. Ini bukan animasi; memberinya easing membuat tangan terasa nyangkut.
- **Perpindahan mandiri — fade panjang.** Panel membuka, halaman berganti, simpul muncul: 700ms `cubic-bezier(.22, 1, .36, 1)`.
- **Hover simpul:** perubahan opacity dan warna garis saja. Tanpa lompat skala, tanpa bayangan berwarna, tanpa rotasi.
- **`prefers-reduced-motion`:** semua transisi jadi instan; kanvas tetap bisa diseret.

## 11. Teknis

**Next.js App Router dipertahankan.** `/` adalah komponen klien; `/kerja/[slug]` dirender di server supaya mesin pencari mendapat isi penuh.

**Kanvas ditulis sendiri** dengan DOM + SVG. Tanpa react-flow atau d3: yang dibutuhkan hanya geser, zoom, dan klik — bukan penyuntingan graf. Library 40kb+ untuk itu adalah pemborosan, dan tim teknis melihat ukuran bundle.

**Satu sumber data.** `src/lib/data/projects.js` diperluas dengan `position {x, y}`, `tier`, `access`, `related[]`, `links`. Kanvas dan halaman baca membaca file yang sama; posisi simpul adalah data, bukan angka yang tersebar di JSX.

**Batas modul:**

- `lib/canvas/viewport.js` — matematika pan/zoom murni, tanpa DOM. Bisa diuji sendiri.
- `components/canvas/Canvas.jsx` — viewport, penanganan pointer, keyboard.
- `components/canvas/Node.jsx` — satu simpul, detail mengikuti tingkat zoom.
- `components/canvas/Edges.jsx` — SVG garis hubungan, diturunkan dari `related[]`.
- `components/canvas/PreviewPanel.jsx` — panel geser.
- `components/canvas/MobileList.jsx` — pengganti kanvas di bawah 768px.
- `components/work/*` — tujuh blok halaman project.

**Dibuang:** `Hero`, `About`, `Skills`, `Experience`, `Education`, `SelectedWork`, `OtherProjects`, `CaseStudyModal`, `Nav` versi lama, `useTheme`, `ThemeToggle`, data `experience.js` dan `education.js`, kunci i18n yang menyertainya.

**Dipertahankan:** `FadeIn`, `Tag`, `ExternalLink`, `useInView`, `useLocale`, `LangSwitcher`, kamus i18n (dipangkas), `meta.js`, `skills.js` (dipakai untuk tag stack, bukan untuk grid ikon).

**Bilingual ID/EN tetap ada.**

## 12. Pengujian

- `viewport.js` — pan menjumlah dengan benar, zoom terkunci di batas min/maks, "tampilkan semua" menghasilkan bingkai yang memuat seluruh simpul.
- Hit-test simpul — klik setelah menyeret tidak boleh terhitung sebagai klik (ambang gerak).
- Keyboard — Tab menjangkau seluruh simpul, Enter membuka, Esc menutup.
- Paritas kunci kamus ID/EN.
- Setiap `tier: "full"` menghasilkan halaman yang bisa dibangun; setiap `related[]` menunjuk slug yang ada.
- Halaman project ter-render di server (isi muncul tanpa JavaScript).

## 13. Yang sengaja tidak dikerjakan

- Tidak ada blog atau tulisan.
- Tidak ada mekanik permainan, penyingkapan, atau easter egg.
- Tidak ada jendela melayang yang bisa ditumpuk (opsi C+B ditolak — ongkosnya tidak sebanding).
- Tidak ada angka dampak sampai ada sumber yang bisa dipertanggungjawabkan.
- Tidak ada testimonial.

## 14. Aset yang dibutuhkan sebelum implementasi selesai

- Screenshot tiap project (disensor bila perlu) — terutama empat project bertingkat `full`.
- `Utsman-CV.pdf` di `public/`.
- URL live dan status akses tiap project, termasuk yang belum tercatat di tabel bagian 6.
- Ringkasan HRIS Nirwana: cakupan sebenarnya, tanpa payroll.
- Ringkasan PSB MTs Walisongo: cakupan dan tantangan CBT.

Implementasi berjalan dengan placeholder sampai aset ini masuk; halaman tidak dianggap selesai sebelum screenshot asli terpasang.
