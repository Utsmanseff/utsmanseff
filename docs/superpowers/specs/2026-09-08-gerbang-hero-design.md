# Gerbang hero — spec desain

**Tanggal:** 2026-09-08
**Branch:** `portfolio-canvas-redesign`
**Dasar:** 92 test hijau, 17 berkas. Rencana `2026-09-03-shell-dan-dokumen.md` selesai.
**Menutup:** Tugas 1 di `docs/PROGRESS.md` (nasib pengunjung reduced-motion di desktop).

## Masalah

Dua hal, dan yang kedua diselesaikan oleh yang pertama.

**Porto terasa kosong di atas.** `/` mendarat langsung di peta atau di spine tahun.
Tidak ada tempat yang menyebut siapa yang membuatnya, perannya apa, dan dia
bekerja dengan apa. Pembaca harus menyimpulkannya dari delapan baris tabel.

**Spec lama bertabrakan dengan dirinya sendiri.** §2 bilang cangkang menyusul
hanya kalau lebar ≥1024 **dan** gerak tidak dikurangi. §7 bilang
`prefers-reduced-motion` membuat `/` "mendarat di tabel datar, bukan peta".
Implementasi memilih §2, jadi pengunjung yang mematikan animasi kehilangan
konsol, rail log dan panel — antarmuka dikurangi, padahal yang dia minta cuma
gerak dikurangi.

Gerbang menyelesaikan keduanya: ia memberi tempat untuk identitas, dan ia
mengubah `calm` dari gerbang masuk yang diam-diam jadi default yang bisa ditolak
pengunjung lewat tombol yang menyebut tujuannya.

## Bentuk yang dipilih

| Lebar | Yang berubah |
|-------|--------------|
| ≥1024px, JS hidup | Gerbang menutupi cangkang sampai dilewati. Baru setelah itu peta/daftar |
| Selain itu | Pita hero kecil di atas dokumen kertas. Bukan gerbang — dokumen tetap langsung terbaca |

Alternatif yang ditolak, dengan alasannya:

- **Hero sebagai pita di dalam cangkang desktop.** Perubahan paling kecil, tapi
  memakan ±90px tinggi peta — di 1366×768 itu terasa — dan hero tidak pernah
  terasa seperti hero.
- **Halaman yang menggulir.** Paling familiar dan paling lega, tapi membunuh
  rencana "scroll memutar peta": roda dipakai halaman untuk menggulir. Juga
  mengubah cangkang dari aplikasi jadi bagian halaman, dan konsol yang menangkap
  ketikan di halaman menggulir jadi berisik.
- **Satu komponen hero untuk semua lebar.** Paling konsisten, tapi wajib netral
  warna atau punya dua palet, dan `h-[100dvh]` cangkang harus dihitung ulang.

## Komponen baru

```
src/components/shell/Gate.jsx           gerbang desktop
src/components/document/PaperHead.jsx   pita hero HP
src/lib/hooks/useGatePassed.js          ingatan sessionStorage
```

## 1 · Struktur dan keadaan gerbang

`Shell.jsx` dapat state `passed`. Selama `!passed`, `Gate` menutupi cangkang
(`absolute inset-0 z-50`). Cangkang tetap **dirender di bawahnya**, bukan
digantikan, supaya `ResizeObserver` di `MapScene` sudah selesai mengukur sebelum
peta terlihat. Waktu gerbang memudar, tidak ada lompatan tata letak.

### Apa yang menutup gerbang

| Aksi | Hasil |
|------|-------|
| Klik `LIHAT SISTEM · PETA →` | tutup, `view = 'map'` |
| Klik `LIHAT SISTEM · DAFTAR →` | tutup, `view = 'list'` |
| `Enter`, `Esc`, `Space`, tombol huruf apa pun | tutup, `view` tetap default |
| Roda scroll ke bawah | tutup, `view` tetap default |
| `Tab` | **tidak** menutup |

`Tab` dikecualikan karena harus tetap bisa menjelajah dua tombol di dalam
gerbang. Tombol huruf menutup gerbang karena konsol di bawahnya menerima
ketikan; pengunjung yang langsung mengetik `filter` tidak boleh kehilangan huruf
pertamanya, jadi huruf itu **diteruskan** ke konsol.

### Ingatan

`useGatePassed()` membaca `sessionStorage.getItem('gate')` dan menulis `'1'` saat
gerbang tutup. Sekali per tab: balik dari halaman baca tidak memunculkannya
lagi, tab baru memunculkannya lagi. Tidak ada persetujuan cookie yang perlu
diminta, dan tidak ada yang tertinggal setelah tab ditutup.

Dibungkus `try/catch` — sebagian browser melempar saat `sessionStorage` diakses
di mode privat. Kalau melempar, hasilnya `false`: gerbang muncul, dan itu
keadaan yang aman.

Dibaca saat inisialisasi state, bukan di `useEffect`. Versi pertama spec ini
menyuruh sebaliknya, dengan alasan hydration mismatch — alasan itu salah:
`Shell` tidak pernah dirender di server, karena `page.jsx` mengembalikan dokumen
kertas sampai `useMediaQuery` bilang viewport lebar, dan `getServerSnapshot`-nya
`false`. Gerbang tidak pernah ikut hidrasi, jadi tidak ada HTML server yang bisa
dibantah. Membacanya di efek juga ditolak ESLint (`react-hooks/set-state-in-effect`),
pelajaran yang sudah tercatat di `PROGRESS.md`.

### Yang tidak berubah

- Server tetap merender `SystemsDocument`. Gerbang bagian dari cangkang, dan
  cangkang masih menumpuk setelah mount.
- `/` tanpa JavaScript tetap utuh. Gerbang tidak pernah ada di sana.
- `h-[100dvh] overflow-hidden` bertahan. Halaman tidak pernah menggulir.

## 2 · Isi dan teks

| Baris | Sumber |
|-------|--------|
| Nama | `meta.name` |
| Peran | konstanta di `Gate`, dua bahasa |
| Lokasi | `meta.location[locale]` |
| Rentang | dihitung dari `systems`, cara yang sama dengan `Shell.jsx` |
| Stack | `techNames(systems)` |

Peran, lokasi dan rentang jadi satu baris mono dipisah `·`, bukan tiga baris.

### Stack

Dari `techNames(systems)`, urut abjad:

```
Alpine.js · Fonnte · Google Vision · JavaScript · Laravel ·
Livewire · MySQL · Next.js · REST API · SOAP · TensorFlow.js
```

Urutan abjad menaruh `Alpine.js` dan `Fonnte` di depan `Laravel` — kurang enak
dibaca, tapi nol perawatan dan tidak pernah bisa jadi basi. Mengurut berdasar
seberapa sering dipakai tidak menampilkan angka, jadi tidak melanggar larangan,
tapi tetap membiarkan data memuji dirinya — alasan yang sama dengan dibuangnya
penanda `langka`. Abjad yang dipakai.

### Tombol

| Tombol | id | en | Aksi |
|--------|----|----|------|
| Utama, tepi amber | `LIHAT SISTEM · PETA →` | `SEE SYSTEMS · MAP →` | tutup, `view = 'map'` |
| Kedua, tepi `rule` | `LIHAT SISTEM · DAFTAR →` | `SEE SYSTEMS · LIST →` | tutup, `view = 'list'` |

Dua, bukan tiga: tombol "lihat semua" yang terpisah tidak melakukan apa pun yang
tidak dilakukan dua ini. Keduanya `<button>` sungguhan, jadi Tab dan Enter jalan
tanpa tambahan.

Petunjuk kecil di kanan bawah: `↓ ATAU TEKAN APA SAJA` / `↓ OR PRESS ANY KEY`.

### Yang sengaja tidak ada

- **Tidak ada kalimat headline.** Semuanya data berlabel, bukan prosa.
- **Tidak ada angka jumlah.** Bukan "8 sistem", bukan "11 teknologi". Kata
  `SISTEM` / `SYSTEMS` menggantikannya, dan itu benar tanpa menghitung.
- **Tidak ada foto.** `meta.photo` ada dan tidak dipakai.
- **Tidak ada tombol Kontak/CV.** Sudah ada di `StatusBar` yang tetap terlihat.

### Pita HP (`PaperHead`)

```
UTSMAN                                    id / en
Utsman                                     ← font-display, 30px
FULLSTACK DEVELOPER
BANJARBARU, KALIMANTAN SELATAN · 2024–2026
Alpine.js · Fonnte · Google Vision · JavaScript ·
Laravel · Livewire · MySQL · Next.js · REST API ·
SOAP · TensorFlow.js
──────────────────────────────────────────  ← lalu spine tahun
```

Teksnya sama persis dengan gerbang; yang beda cuma palet dan ukuran. Amber di
sini `#9C5A28` (`text-amber-ink`), karena ini lapis kertas.

Menggantikan blok `UTSMAN · FULLSTACK` + lokasi yang sekarang ada di
`SystemsDocument`, bukan menumpuk di atasnya. Catatan "Buka di desktop untuk
peta isometrik…" pindah ke kaki dokumen, di atas daftar kontak.

Stack sebagai paragraf mono bertitik-tengah, bukan chip berbingkai: chip
menambah ±120px dan menagih target sentuh 44px untuk informasi yang sama.
Project pertama harus tetap terlihat di layar 360×640.

## 3 · Gerak

### Lapisan melayang

Empat `<div>` plate kosong di paruh kanan gerbang, palet plate yang sudah ada
(`--color-plate-2`, `--color-plate-4`, tepi `--color-plate-edge-*`, satu bertepi
amber), miring `skewY(-16deg)` supaya sebentuk dengan plate di peta.

Satu `mousemove` di elemen gerbang, di-throttle `requestAnimationFrame`, menulis
`transform: translate(...)` ke keempatnya dengan faktor beda: `34 / 20 / 46 /
12` px. Hanya `transform`; `left`/`top` tidak disentuh, jadi tidak ada relayout.

Bentuknya sengaja sama dengan yang ada di balik gerbang: gerbang menjanjikan
isi, bukan memasang dekorasi.

Ditolak: kisi isometrik menyala (perlu canvas dan penjagaan agar tidak
menggambar saat tab tersembunyi) dan potongan peta yang ikut berputar (harus
berbagi `rotZ` dan geometri dengan `MapScene`, atau menduplikasinya — utang yang
dibayar tiap kali `layout.js` berubah).

### Kontrak gerak

`PROGRESS.md` membelah gerak jadi dua: yang digerakkan jari 1:1 tanpa easing,
yang bergerak sendiri memudar 700ms. Parallax digerakkan kursor, jadi masuk kubu
pertama.

| Yang bergerak | Aturan |
|---------------|--------|
| Plate mengikuti kursor | 1:1, tanpa `transition` |
| Gerbang memudar keluar | `opacity 700ms cubic-bezier(.22, 1, .36, 1)` |
| Warna tepi tombol saat hover/fokus | `180ms` |

Tanpa bayangan. Kedalaman dari lapisan dan warna tepi saja, seperti di
`Plate.jsx`.

### `prefers-reduced-motion`

Listener `mousemove` **tidak dipasang sama sekali** kalau `calm` — bukan dipasang
lalu hasilnya dibuang. Plate diam di posisi netral; gerbang tetap utuh dan
terbaca.

Gerbang keluar tanpa fade tanpa kode tambahan: aturan
`@media (prefers-reduced-motion: reduce)` di `globals.css` sudah memangkas semua
`transition-duration` ke `0.01ms`.

## 4 · Tugas 1 ditutup

```
src/lib/hooks/useShellEligible.js
  return wide && !calm   →   return wide

src/app/page.jsx
  const calm = useMediaQuery('(prefers-reduced-motion: reduce)')
  <Shell systems={projects} locale={locale} calm={calm} />

src/components/shell/Shell.jsx
  useState(calm ? 'list' : 'map')
```

Pengunjung reduced-motion di desktop dapat gerbang yang diam, lalu dua tombol
yang menyebut tujuannya. Kalau dia tidak memilih dan cuma menekan tombol apa
saja, dia mendarat di `DAFTAR` — §7 terpenuhi. Kalau dia mau peta, tombolnya ada,
dan peta itu memang tidak bergerak sendiri; yang menggerakkannya cuma tangannya.

`calm` berhenti jadi gerbang masuk dan jadi default yang bisa ditolak.

## 5 · Rencana test

Dasar: 92 hijau, 17 berkas.

### Yang harus dibereskan lebih dulu

`Shell.test.jsx` merender `Shell` langsung; sembilan test yang ada akan mengklik
tombol yang tertutup gerbang. `renderShell` dapat `beforeEach` yang menulis
`sessionStorage.setItem('gate','1')` — pengunjung yang sudah lewat gerbang. Itu
keadaan nyata, bukan pintu belakang. Gerbang sendiri diuji di berkas baru saat
`sessionStorage` kosong.

### Tugas A — `useGatePassed`

`src/lib/hooks/__tests__/useGatePassed.test.jsx`

- `true` sejak render pertama kalau `sessionStorage.gate === '1'`
- `false` kalau tidak ada apa-apa yang tersimpan
- store yang dikosongkan berarti gerbang kembali
- `pass()` menulis `'1'` dan menyetel `true`
- `sessionStorage` yang melempar menghasilkan `false`, bukan crash

### Tugas B — `Gate`

`src/components/shell/__tests__/Gate.test.jsx`

- menampilkan nama, peran, lokasi, rentang `2024–2026`
- daftar stack berisi `Laravel` dan `TensorFlow.js`, dan tidak mengandung digit
  selain tahun
- dua tombol; namanya menyebut `PETA` dan `DAFTAR`
- klik `DAFTAR` memanggil `onEnter('list')`, `PETA` → `onEnter('map')`
- `keydown` huruf `f` menutup gerbang dan meneruskan `f`
- `Tab` tidak menutup
- `wheel` ke bawah menutup
- versi `en` memakai `SEE SYSTEMS`

### Tugas C — `Shell` menerima gerbang

`Shell.test.jsx`, ditambah:

- `sessionStorage` kosong → gerbang terlihat, konsol tidak bisa dijangkau
- `onEnter('list')` → gerbang hilang, tabel datar tampil
- `calm` → view awal `list`; tanpa `calm` → `map`
- sembilan test lama tetap hijau lewat `beforeEach` di atas

### Tugas D — kelayakan cangkang

`useShellEligible.js` → `return wide`. `page.test.jsx` ditambah: saat `calm`, `/`
merender `shell`, bukan `.paper-doc`. Ini yang menutup Tugas 1.

### Tugas E — parallax

`Gate.test.jsx`, ditambah:

- `calm` → tidak ada `mousemove` listener terpasang (`addEventListener` di-spy)
- tanpa `calm` → `mousemove` mengubah `style.transform` plate

`happy-dom` tidak menata letak, jadi ini membuktikan kabelnya tersambung, bukan
bahwa gerakannya enak.

### Tugas F — `PaperHead`

`src/components/document/__tests__/PaperHead.test.jsx`

- nama, peran, lokasi, rentang, stack ada
- `SystemsDocument.test.jsx` diperbarui: blok `UTSMAN · FULLSTACK` lama sudah
  tidak ada, catatan "Buka di desktop…" sekarang di kaki
- amber di sini `text-amber-ink`, bukan `text-amber`

### Tugas G — verifikasi browser dan catatan

Bukan test. Lima langkah di bawah dijalankan sungguhan, plus
`npx eslint src --max-warnings=0` dan `npm run build`. Lalu `docs/PROGRESS.md`
diperbarui: Tugas 1 ditutup, bentuk baru dicatat, pelajaran baru ditambah.

## 6 · Verifikasi browser

Test tidak bisa membuktikan ini.

1. Matikan "Animation effects" Windows → muat `/` di ≥1024px → gerbang harus
   **muncul** (dulu tidak pernah), plate diam, tombol `DAFTAR` mendarat di tabel
   datar.
2. Nyalakan lagi → plate ikut kursor, gerbang memudar 700ms.
3. Klik satu project → masuk `/kerja/<slug>` → tekan kembali → gerbang tidak
   muncul lagi.
4. Tab baru → gerbang muncul lagi.
5. Ukur target sentuh tombol gerbang ≥44px.

Poin 1 dan 5 yang paling mungkin gagal.

Pelajaran alat browser dari `PROGRESS.md` yang berlaku di sini: samakan ukuran
viewport (`preset: desktop`) sebelum menguji klik, jangan pakai preset `mobile`
untuk interaksi, `key: "Enter"` bukan `"Return"`, dan sembunyikan
`nextjs-portal` sebelum menguji pojok kiri bawah.

## 7 · Yang tidak dites

Ukuran target sentuh dan rasa gerakan. Keduanya cuma ada di browser sungguhan.
Menuliskan test yang seolah mengukurnya akan berbohong — pelajaran chip filter
38px di Task 17.

## 8 · Di luar lingkup spec ini

Tiga hal lain yang diajukan bersamaan dan **tidak** dikerjakan di sini:

- **Gaya scrollbar** (rail `<ul>` dan pane tabel datar) — pekerjaan CSS kecil,
  berdiri sendiri.
- **Peta lebih interaktif** — klik objek plate (bukan cuma labelnya), roda
  memutar kamera, lapisan yang lebih bernyawa, zoom masuk ke halaman baca lewat
  View Transitions. Roda-memutar bergantung pada gerbang yang baru diputuskan di
  sini, jadi brainstorm-nya menyusul.
- **Teks legenda dan catatan rail** yang kurang informatif.

Masing-masing dapat spec sendiri.
