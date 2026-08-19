# Portfolio — Status Kerja

> Dibaca di awal sesi baru. Menggantikan catatan redesign lama (9 section scroll), yang sudah tidak berlaku.

## Yang sedang dikerjakan

Refactor total: porto jadi **dua lapis**.

- `/` — kanvas gelap yang digeser. Project jadi simpul, ukuran = bobot, garis = hubungan nyata.
- `/kerja/[slug]` — halaman kertas krem untuk dibaca, dibagikan, dan dibaca Google.
- `/kontak` — halaman pendek.

Riwayat kerja, pendidikan, dan grid ikon skill **dibuang** — sudah ada di CV, dan di Indonesia HRD membaca CV sementara tim teknis yang membuka porto.

**Branch:** `portfolio-canvas-redesign` (bercabang dari `main`, belum di-merge)

**Dokumen acuan:**
- Spec: `docs/superpowers/specs/2026-08-19-portfolio-canvas-redesign-design.md`
- Rencana: `docs/superpowers/plans/2026-08-19-portfolio-canvas-redesign.md` (15 task)
- Copy HRIS & PSB dari sumber: `docs/superpowers/notes/2026-08-19-project-copy.md`

## Status task

| Task | Isi | Status |
|------|-----|--------|
| 1 | Kumpulkan copy HRIS + PSB dari user | selesai |
| 2 | Dataset project (flat, posisi kanvas, tier, akses) | selesai |
| 3 | Matematika viewport (pan/zoom/fit) | selesai |
| 4 | Token warna paper + ground | selesai |
| 5 | Komponen Node | selesai |
| 6 | Komponen Edges | selesai |
| 7 | PreviewPanel + AccessBadge | selesai |
| 8 | Canvas + CanvasChrome | selesai |
| 9 | MobileList + rute `/` | **berikutnya** |
| 10 | Halaman `/kerja/[slug]` | belum |
| 11 | Halaman `/kontak` | belum |
| 12 | Hapus komponen lama (build hijau lagi di sini) | belum |
| 13 | Simpul terfokus masuk layar (keyboard) | belum |
| 14 | Metadata, OG image, README | belum |
| 15 | Lihat dengan mata sendiri | belum |

## Keadaan sekarang

- **64 test hijau, lint bersih.**
- **`npm run build` sengaja masih patah.** `SelectedWork.jsx` dan `OtherProjects.jsx` membaca bentuk data lama. Task 12 menghapusnya. Jangan diperbaiki sepotong-sepotong.
- **`npm run dev` akan terlihat berantakan.** Token `cream`/`forest` sudah tidak ada tapi komponen lama masih memakainya. Normal sampai Task 12.

## Keputusan yang mahal kalau dilupakan

- **Amber ada dua.** `--color-amber` (#C97B3F) hanya untuk kanvas gelap (5.33:1). Di atas kertas ia cuma 2.82:1 — gagal WCAG AA. Semua amber yang menyentuh lapisan baca pakai `--color-amber-ink` (#9C5A28, 4.61:1).
- **Kontrak gerak terbelah.** Seret dan zoom mengikuti jari 1:1 tanpa easing. Yang bergerak sendiri (panel, pindah halaman) memudar 700ms `cubic-bezier(0.22, 1, 0.36, 1)`.
- **Tidak ada angka dampak.** Klaim dibuang, bukan dikarang. Screenshot dan URL live yang jadi bukti; status akses ditulis terang.
- **HRIS tidak punya payroll/keuangan.** Jangan pernah disebut.
- **Vitest & ESLint mengecualikan `.claude/**`.** Worktree di situ salinan penuh repo — sempat membuat vitest menghitung test basi dan membuat lint seperti menggantung.

## Masih kurang dari user

- Screenshot HRIS → `public/assets/img/hris.png`
- Screenshot PSB → `public/assets/img/psb.png`

Sampai masuk, `image: null` dan halaman menampilkan status kosong yang dirancang, bukan gambar rusak. Sensor dulu kalau memuat data pegawai/pasien asli.

## Risiko yang diakui sejak awal

Sembilan simpul bisa terasa sepele, bukan seperti peta. Penawarnya: garis hubungan yang bermakna, label informatif, detail bertambah saat zoom. Kalau gagal — Task 15 memang menanyakan ini terus terang — kanvas dibuang dan daftar berkelompok dipakai di semua lebar. Halaman bacanya tetap hidup, jadi mundur berarti kehilangan satu komponen, bukan proyeknya.

## Cara lanjut

1. `git checkout portfolio-canvas-redesign`
2. `npm test` — harus 64 hijau
3. Buka rencana, cari Task 9, kerjakan dari sana
