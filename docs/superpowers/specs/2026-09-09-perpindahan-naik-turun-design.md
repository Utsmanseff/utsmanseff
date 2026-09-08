# Perpindahan Naik-Turun — Design

**Tanggal:** 2026-09-09
**Branch:** `portfolio-canvas-redesign`
**Lanjutan dari:** `docs/superpowers/specs/2026-09-08-gerbang-hero-design.md`
dan rencana `2026-09-08-gerbang-punya-url.md` yang memindahkan gerbang ke `/`

## Masalah

Sejak gerbang pindah ke `/`, satu-satunya jalan pulang dari cangkang adalah
wordmark `UTSMAN` di TopBar — tautan yang harus ditebak bisa diklik. Dan
perpindahan `/` ⇄ `/sistem` memotong tanpa peralihan, padahal kedua halaman itu
punya hubungan ruang yang jelas: gerbang adalah tempat masuk, sistem ada di
baliknya.

Dua hal yang diminta: kontrol yang menyebut dirinya, dan perpindahan yang
membawa arah.

## Keputusan yang sudah diambil

| Pertanyaan | Jawaban |
|------------|---------|
| Tambah kontrol atau ganti? | **Ganti.** `UTSMAN` berhenti jadi tautan; satu tujuan, satu kontrol |
| Di mana? | TopBar kiri, tepat setelah `UTSMAN` |
| Bunyinya? | `↑ KEMBALI` / `↑ BACK`. "Gerbang" terlalu kaku |
| Tautan atau tombol? | `<Link>`. Ia berpindah halaman |
| Pintu mana yang beranimasi? | `/` ⇄ `/sistem` saja, dua arah |
| Arah geraknya? | Ruang tetap: gerbang di atas, sistem di bawah |
| Mekanismenya? | Dukungan View Transitions bawaan Next, dikurung di satu berkas |
| Jaraknya? | Satu token yang bisa disetel, mulai dari `22vh` |

## Kontrol

`UTSMAN` kembali jadi `<span className="text-ink">`. Tautan yang dipasang di
`TopBar.jsx` waktu rencana `gerbang-punya-url` Task 4 dicopot, dan test
`offers a way back to the gate` di `Shell.test.jsx` diubah untuk mengikuti —
ia sekarang menjaga tautan yang salah.

Di sebelahnya:

```
<Link href="/">  ↑ KEMBALI  </Link>
```

- Panah `aria-hidden`, jadi nama aksesibelnya `KEMBALI` — mengikuti keputusan
  yang sudah berlaku untuk panah di tombol gerbang.
- Teks `--color-muted`, tanpa bingkai, naik ke `--color-ink` saat hover, 180ms.
  Sengaja lebih tenang dari `LEWATI PETA → DAFTAR SISTEM` yang berdampingan:
  dua tombol bersebelahan dengan bobot sama akan berebut perhatian.
- Ukuran targetnya mengikuti chrome TopBar yang ada (teks 11px, `py-2.5`), bukan
  44px. Cangkang cuma mount di ≥1024px dengan penunjuk presisi; menaikkan satu
  kontrol jadi 44px di baris setinggi 34px akan merusak baris itu. Ini keputusan
  sadar, bukan kelalaian.

**Kenapa "KEMBALI", bukan "GERBANG".** Menyebut tujuan lebih tahan lama, tapi
"gerbang" terasa kaku sebagai kata di layar. Konsekuensinya diterima: `KEMBALI`
tumpang tindih artinya dengan tombol kembali browser, padahal keduanya beda —
yang ini selalu ke `/`, yang itu ke mana pun riwayat membawa.

## Gerak

Ruangnya tetap. Gerbang di atas, sistem di bawah.

| Arah | Pemicu | Yang pergi | Yang datang |
|------|--------|-----------|-------------|
| Naik | `↑ KEMBALI` | turun keluar lewat tepi bawah | masuk dari tepi atas |
| Turun | tombol gerbang, huruf, roda | naik keluar lewat tepi atas | masuk dari tepi bawah |

Arah ditandai pada elemen akar sebelum transisi mulai:

```js
document.documentElement.dataset.nav = 'up' | 'down'
```

CSS memilih `@keyframes` dari atribut itu. Ditulis di elemen akar karena
pseudo-element `::view-transition-*` hidup di sana, bukan di dalam pohon React.

**Angka:**

| Apa | Nilai | Alasan |
|-----|-------|--------|
| Durasi | 700ms | Laju "bergerak sendiri" yang sudah berlaku di seluruh situs |
| Easing | `cubic-bezier(.22, 1, .36, 1)` | Sama dengan gerbang dan `FadeIn` |
| Jarak | `--nav-slide`, mulai `22vh` | Bisa disetel di satu tempat |
| Opasitas yang pergi | `1 → 0` | Tanpa ini, geser sebagian terbaca seperti halaman tersendat |

**Kenapa bukan satu layar penuh.** Gerak terjauh yang pernah ada di situs ini
6px (`FadeIn`). Melompat ke 100vh adalah perubahan besar yang belum pernah
dilihat di layar sungguhan. `22vh` cukup untuk terbaca sebagai arah tanpa
menjadi tontonan; kalau kurang, satu token yang dinaikkan.

## Pengurungan

Seluruh sentuhan ke API View Transitions tinggal di **satu berkas** di
`src/lib/nav/`. Ia mengekspor satu fungsi:

```
slideTo(href, direction)   // direction: 'up' | 'down'
```

`TopBar` dan `Gate` memanggil fungsi itu. Keduanya tidak pernah menyentuh
`startViewTransition`, `unstable_ViewTransition`, atau `dataset.nav` langsung.

Alasannya bukan kerapian: API-nya masih `unstable_` dan namanya bisa berubah
waktu Next dinaikkan versinya. Satu berkas berarti satu tempat yang perlu
dibetulkan, bukan tiga halaman.

`next.config.mjs` perlu `experimental: { viewTransition: true }`, berdampingan
dengan `reactCompiler` yang sudah menyala.

**Bentuk persis pemakaian API-nya sengaja tidak dikunci di spec ini.** Saya belum
pernah menjalankannya di repo ini, dan menuliskannya sebagai fakta akan mengulang
kesalahan yang baru saja dibayar di spec scrollbar — di mana klaim dari ingatan
ternyata meleset dan baru ketahuan waktu diukur. Task pertama rencana
implementasi adalah membuktikan bentuk mana yang benar-benar bekerja di
Next 16.1.3 + React Compiler, dan sisanya ditulis di atas hasil itu.

Yang perlu dibuktikan di task itu, minimal:

1. Apakah `experimental.viewTransition` benar-benar ada di Next 16.1.3, dan
   apa nama impornya.
2. Apakah potret "sesudah" diambil setelah React selesai merender — gejala
   gagalnya: animasi berjalan di atas layar kosong.
3. Apakah `dataset.nav` yang disetel tepat sebelum navigasi sudah terbaca CSS
   waktu animasi mulai, atau perlu disetel lebih awal.

## Yang tidak dapat animasi

- **Peramban tanpa dukungan.** `slideTo` memeriksa keberadaan API lebih dulu;
  kalau tidak ada, ia langsung `router.push`. Bukan rusak, cuma memotong.
  Ini juga yang terjadi di test, karena happy-dom tidak punya API-nya.
- **`/sistem` → `/kerja/<slug>` dan `/kontak`.** Sengaja dibiarkan memotong.
  PROGRESS sudah mencatat rencana **zoom** dari plate peta ke halaman baca, dan
  itu View Transitions juga. Memasang geser naik-turun di pintu yang sama
  sekarang berarti membongkarnya nanti.
- **`prefers-reduced-motion`.** Dapat aturannya sendiri di `globals.css`,
  menyasar `::view-transition-old(root)` dan `::view-transition-new(root)`.
  Aturan yang ada sekarang memangkas `transition-duration` dan
  `animation-duration` pada elemen biasa, dan **tidak menjangkau pseudo-element
  itu**. Tanpa aturan baru, pengunjung yang meminta gerak dikurangi tetap kena
  geser penuh. Ini wajib, bukan pelengkap.

## Cara membuktikannya

**Yang bisa diuji vitest:**

- `↑ KEMBALI` ada, `href`-nya `/`, nama aksesibelnya `KEMBALI` tanpa panah.
- `UTSMAN` bukan lagi tautan.
- `slideTo` memanggil `router.push` apa adanya waktu `document.startViewTransition`
  tidak ada — yang selalu benar di happy-dom.
- `slideTo` menyetel `dataset.nav` sesuai arah yang diminta, sebelum berpindah.

**Yang tidak bisa diuji vitest, dan diukur di browser sungguhan:**

- Bahwa animasinya benar-benar berjalan. `document.getAnimations()` selama
  transisi memuat animasi `::view-transition-*`; jumlah, `animationName` dan
  durasi efektifnya bisa dibaca. Ini bukti, bukan tebakan.
- Bahwa arahnya benar — dibaca dari `dataset.nav` dan dari nama `@keyframes`
  yang aktif.
- Bahwa `prefers-reduced-motion` memangkasnya. Setelan itu ikut OS, bukan
  peramban: `HKCU:\Control Panel\Desktop\UserPreferencesMask`, bit `0x02` pada
  byte 0. Perlu PowerShell, bukan Bash.

**Catatan alat yang berlaku di sini:** panel browser sesi ini lebih sempit dari
1024px, jadi cangkang harus diemulasi 1280×800 dan diverifikasi lewat
`javascript_tool` — klik berbasis koordinat tidak mendarat waktu emulasi
melebihi panel. Klik dilakukan lewat `element.click()`.

Dan setelah tiap perubahan `globals.css` atau `next.config.mjs`: server
dihentikan, `Remove-Item -Recurse -Force .next`, lalu `npm run dev`. Server
dijalankan Utsman; jangan menjalankan yang baru.

## Risiko

- **Dua fitur eksperimental berdampingan.** `reactCompiler` dan
  `experimental.viewTransition` menyala bersamaan. Belum pernah dicoba di repo
  ini. Kalau bertabrakan, jalan mundurnya mematikan animasi dan menyisakan
  tombolnya — tombol itu berguna sendiri tanpa gerak apa pun.
- **`22vh` mungkin terasa kurang, atau justru terlalu banyak.** Belum pernah
  dilihat di layar. Satu token, satu baris untuk menyetelnya.
- **`KEMBALI` bisa dikira tombol kembali browser.** Diterima sadar; lihat bagian
  Kontrol.
- **Gerbang punya tiga pemicu masuk** — dua tombol, huruf apa pun, dan roda ke
  bawah. Ketiganya harus lewat `slideTo`, bukan cuma tombolnya. Kalau satu
  terlewat, satu jalan masuk memotong sementara dua lainnya beranimasi, dan itu
  terbaca sebagai bug.
