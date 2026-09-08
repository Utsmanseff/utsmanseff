# Gaya Scrollbar — Design

**Tanggal:** 2026-09-09
**Branch:** `portfolio-canvas-redesign`
**Antrean:** nomor 1 di `docs/PROGRESS.md`

## Masalah

Scrollbar bawaan Windows di atas lapis gelap. Utsman mengirim screenshot dan
menyebutnya "sangat jelek": batang putih terang dengan panah di kedua ujung, di
atas ground `#161A1D` — satu-satunya elemen di layar yang tidak mengikuti palet
dan satu-satunya yang punya sudut membulat.

## Cakupan

Enam tempat menggulir, bukan dua seperti yang dicatat PROGRESS sebelumnya:

| Tempat | Berkas | Lapis |
|--------|--------|-------|
| Rail log `<ul>` | `src/components/shell/LogRail.jsx:72` | Gelap |
| Pane tabel datar | `src/components/shell/FlatTable.jsx:21` | Gelap |
| Panel kanan `<aside>` | `src/components/shell/SelectedPanel.jsx:46` | Gelap |
| Isi panel kanan | `src/components/shell/SelectedPanel.jsx:54` | Gelap |
| Jendela halaman baca dan kontak | `/kerja/*`, `/kontak` | Gelap |
| Jendela dokumen kertas | `/` dan `/sistem` di bawah 1024px | Kertas |

Semuanya digarap. Lapis kertas dapat aturannya sendiri, bukan dibiarkan bawaan.

## Bentuk

```
lebar               8px (webkit); scrollbar-width: thin (standar)
track               transparan, di kedua lapis
thumb gelap         var(--color-rule)             #2E3539
thumb gelap hover   var(--color-muted-deep)       #4C555A
thumb kertas        var(--color-paper-rule)       #D9D0BC
thumb kertas hover  var(--color-paper-rule-edge)  #C7BEA8
radius              0
sudut               transparan
```

Tidak ada warna baru. Keempatnya sudah ada di `@theme` dan sudah dipakai untuk
garis pemisah — scrollbar meminjam kosakata yang sudah terbaca di layar.

**Samar itu disengaja.** Thumb `#2E3539` di atas ground `#161A1D` berkontras
1.4:1. Ia memang tidak dimaksudkan terbaca sampai kursor mendekat. Kalau di
browser nanti terasa terlalu hilang, jalan keluarnya menaikkan warna diam ke
`--color-muted-deep` (2.3:1) — bukan menambah lebar atau memberi track warna.

Ini bukan kontrol antarmuka: scrollbar di sini adalah indikator posisi, dan
menggulir tetap bisa lewat roda, keyboard dan sentuh. Karena itu 8px tidak
melanggar aturan ukuran target sentuh — di lebar sentuh (HP) yang berlaku cuma
scrollbar jendela, dan itu digambar OS di luar jangkauan CSS pada sebagian besar
peramban seluler.

## Perpindahan warna

Thumb berpindah warna 180ms — laju warna yang dipakai seluruh cangkang. Ia
bergerak sendiri, jadi ia berada di sisi "memudar" dari kontrak gerak, bukan sisi
"1:1". Aturan `prefers-reduced-motion` yang sudah ada di `globals.css` memangkas
seluruh `transition-duration` ke 0.01ms; tidak ada tambahan yang perlu ditulis
untuk itu.

## Cara menulisnya

Dua mesin scrollbar, dua jalan, dipakai berdampingan:

1. **Properti standar** — `scrollbar-width: thin` dan
   `scrollbar-color: <thumb> transparent`. Dibaca Firefox, dan juga Chrome 121+.
   Ia tidak punya konsep `:hover` dan tidak menerima lebar dalam piksel.
2. **`::-webkit-scrollbar`** — untuk yang butuh kendali persis: lebar tepat 8px
   dan keadaan hover pada thumb.

Webkit-saja meninggalkan Firefox dengan scrollbar bawaan — keluhan yang sama,
cuma pindah peramban. Standar-saja kehilangan 8px dan hover. Karena itu keduanya.

Dua blok saja di `src/app/globals.css`:

- Blok gelap ditulis global, mengenai keenam tempat sekaligus.
- Blok kertas ditulis di bawah `html:has(.paper-doc)`, `body:has(.paper-doc)` dan
  `.paper-doc`, mengikuti pola yang sudah dipakai berkas itu untuk warna latar.
  `html:has(...)` diperlukan karena elemen `html` tidak ikut berubah lewat
  `body` saja — pelajaran yang sudah tercatat waktu ground gelap membayang di
  bawah dokumen pendek.

## Yang tidak dilakukan

- Tidak menyentuh markup keempat pane cangkang.
- Tidak ada kelas utilitas baru, tidak ada komponen baru, tidak ada JavaScript.
- Tidak ada aturan terpisah untuk scrollbar horizontal. Tidak ada yang menggulir
  ke samping sekarang, dan aturan yang sama sudah mengenainya kalau nanti ada.
- Tidak menyentuh tombol panah bawaan Windows secara terpisah;
  `::-webkit-scrollbar-button` dibiarkan berukuran nol lewat `display: none`,
  yang merupakan bagian dari blok webkit, bukan aturan tambahan.

## Cara membuktikannya

**Vitest tidak bisa melihat ini.** happy-dom tidak menggambar scrollbar dan tidak
menghitung letak; test unit apa pun di sini akan hijau tanpa membuktikan apa-apa.
Ini pelajaran yang sudah dibayar sekali: chip filter 38px lolos semua test sampai
diukur di browser sungguhan.

Verifikasi di browser sungguhan, dibaca lewat `javascript_tool` — bukan
screenshot, karena panel browser sesi ini lebih sempit dari 1024px dan harus
diemulasi:

1. `getComputedStyle(el).scrollbarColor` dan `.scrollbarWidth` di keempat pane
   cangkang di `/sistem`, pada 1280×800.
2. Sama, di elemen penggulir halaman baca `/kerja/hris-nirwana`.
3. Sama, pada dokumen kertas di 375px — nilainya harus warna kertas, bukan warna
   gelap.
4. Angka dilaporkan apa adanya. Kalau sebuah properti tidak sampai, itu yang
   ditulis, bukan "kelihatannya jalan".

**Sebelum verifikasi: hapus `.next` dan jalankan ulang dev server.** Cache
Turbopack menyajikan token CSS basi — sudah kejadian sekali, dan `globals.css`
persis berkas yang terkena.

## Risiko

- **Kontras 1.4:1 mungkin terlalu samar.** Sudah dibahas dan diterima sebagai
  titik awal; jalan mundurnya satu baris.
- **Chrome menghormati `::-webkit-scrollbar` hanya kalau `scrollbar-color` tidak
  disetel pada elemen yang sama.** Sejak Chrome 121, `scrollbar-color` yang
  bernilai selain `auto` mematikan seluruh gaya `::-webkit-scrollbar` pada elemen
  itu. Karena itu properti standar dan blok webkit **tidak boleh menyasar elemen
  yang sama tanpa penjaga**: properti standar dipasang di dalam
  `@supports not selector(::-webkit-scrollbar)`, sehingga Firefox mendapatnya dan
  Chrome tidak. Ini yang paling mudah salah, dan gejalanya diam — scrollbar
  kembali ke bawaan tanpa error apa pun.
