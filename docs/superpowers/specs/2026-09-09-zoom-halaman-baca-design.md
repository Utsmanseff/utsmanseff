# Spec — Zoom ke halaman baca

**Tanggal:** 2026-09-09
**Branch:** `portfolio-canvas-redesign`
**Asal:** antrean nomor 1 di `docs/PROGRESS.md`, sisa terakhir dari "peta lebih
interaktif". Tiga butir lainnya selesai lewat `2026-09-09-peta-hidup.md`.

## Lingkup

Plate yang dibuka berubah bentuk jadi halaman bacanya, dan halaman itu berubah
balik jadi plate waktu pengunjung kembali. Berbeda dari peta hidup, pekerjaan ini
**menyeberang route** dan menuntut peta mengingat dirinya.

Yang **tidak** termasuk:

- Filter dan rail log yang pulih waktu kembali. Kembali memberi peta yang bersih
  kecuali plate terpilih dan sudut kameranya.
- Zoom dari tabel datar. Tidak ada plate di sana untuk dimorf; transisinya turun
  jadi lintas-pudar biasa, dan itu benar.
- Morf antar halaman baca (`WorkFooterNav` prev/next). Dua sistem berbeda yang
  saling memorf menyiratkan hubungan yang tidak ada.
- Teks legenda dan catatan rail (antrean nomor 2), kontras label tahun (nomor 3).

## Keadaan sekarang

Pintu masuk ke halaman baca dari cangkang ada dua: tautan
`ENTER → BUKA HALAMAN` di `SelectedPanel`, dan `open <nama>` di konsol yang
memanggil `router.push` di `Shell.run`. Plate sendiri cuma memilih.

Pintu keluar: `← SEMUA SISTEM` di `PaperHeader` yang menunjuk `/sistem` polos,
tombol kembali browser, dan `WorkFooterNav` yang lompat ke halaman baca lain.

Kembali ke `/sistem` me-mount ulang `Shell`: sudut kamera, plate terpilih, filter
dan seluruh rail log hilang.

`src/lib/nav/slideTo.js` sudah memegang segala yang proyek ini tahu tentang View
Transitions API, dan boundary `<ViewTransition>` di `src/app/layout.js` yang
benar-benar memanggil API-nya.

## Bentuk yang dituju

| Berkas | Status | Isi |
|---|---|---|
| `src/lib/nav/moveTo.js` | pindah nama dari `slideTo.js` | `DIRECTIONS` tumbuh satu: `zoom` |
| `src/lib/nav/__tests__/moveTo.test.js` | pindah nama | |
| `src/app/sistem/page.jsx` | diubah | membaca `?pilih=` dan `?sudut=` |
| `src/components/shell/Shell.jsx` | diubah | `openSystem`, satu pintu dua pemanggil; `angleRef` |
| `src/components/shell/MapScene.jsx` | diubah | menulis `camera.rotZ` ke ref titipan |
| `src/components/shell/Plate.jsx` | diubah | `viewTransitionName` waktu terpilih |
| `src/components/shell/SelectedPanel.jsx` | diubah | prop `onOpen`, klik kiri dicegat |
| `src/components/work/ProjectView.jsx` | diubah | blok kepala bernama; `data-nav` saat mount |
| `src/components/work/PaperHeader.jsx` | diubah | `← SEMUA SISTEM` membawa `?pilih=` |
| `src/components/work/WorkFooterNav.jsx` | diubah | membersihkan `data-nav` |
| `src/app/globals.css` | diubah | dua keyframes pudar, aturan pasangan bernama, tambalan reduced-motion |
| `src/app/page.jsx`, `src/components/shell/TopBar.jsx` | diubah | ikut nama baru `moveTo` |

## 1. URL yang mengingat

`/sistem?pilih=<slug>&sudut=<derajat>`, dibaca `sistem/page.jsx` seperti
`?tampilan=` dan `?ketik=` sekarang, lalu diteruskan ke `Shell` sebagai prop.

**Membaca.** `Shell` memulai `selected` dari `pilih`; `sudut` diteruskan ke
`MapScene` yang memakainya sebagai `useMapCamera(sudut)`. Kalau salah satunya
tidak ada atau bukan angka, jatuh ke bawaan sekarang — `null` dan `-40`.

**Menulis, sekali, di pintu.** URL tidak diperbarui tiap kali plate dipilih atau
kamera diputar; `router.replace` tiap klik roda itu berisik dan mahal. Ia ditulis
waktu pengunjung membuka halaman baca:

```js
router.replace(`/sistem?${params}`, { scroll: false });  // titik pulang
moveTo(router, `/kerja/${slug}`, 'zoom');                 // pergi
```

`replace` menimpa entri riwayat yang sedang berdiri, `push` menambah yang baru,
jadi tombol kembali browser mendarat tepat di URL berparameter itu. Tidak ada
penyimpanan, tidak ada `sessionStorage`.

`URLSearchParams`, bukan disambung sendiri — pelajaran `%26` pada `?ketik=`
masih berlaku.

**Sudut sampai ke pintu lewat ref, bukan state.** Kamera hidup di `MapScene`;
`Shell` memegang pintu. Menaikkan `rotZ` jadi state `Shell` berarti `LogRail`,
panel kanan dan konsol ikut render tiap klik roda. Jadi `Shell` membuat satu
`useRef`, meneruskannya ke `MapScene`, dan `MapScene` menuliskan `camera.rotZ` ke
dalamnya lewat efek tanpa dependensi. Nol render tambahan; pintu membaca
`angleRef.current` saat ditekan.

Sudut dibulatkan `Math.round` supaya URL terbaca manusia.

## 2. Nama transisi

Satu nama, `sistem-aktif`. **Tepat satu elemen boleh membawanya pada satu
waktu** — kalau dua, browser membatalkan transisinya diam-diam, tanpa error.
Keunikannya dijamin lewat bentuk kode, bukan kehati-hatian.

**Di peta.** `Plate` menulisnya inline, dan hanya kalau terpilih:

```js
viewTransitionName: selected ? 'sistem-aktif' : undefined
```

`selected` datang dari satu `useState` di `Shell` yang menyimpan satu slug, jadi
dua plate tidak bisa terpilih bersamaan.

**Di halaman baca.** Blok kepala `ProjectView` — baris `klien · tahun · peran`,
`<h1>`, dan `AccessBadge` — dibungkus satu `<div>` bernama sama. Blok itu dipilih
karena isinya sepadan dengan isi plate: nama sistem, klien, aksesnya.

**Dari tabel datar** tidak ada plate di pohon, jadi tidak ada yang membawa nama
di sisi lama dan transisinya turun jadi lintas-pudar. Benar, bukan bug.

## 3. Arah dan CSS

**`slideTo` jadi `moveTo`**, berkasnya `src/lib/nav/moveTo.js`. Ia sudah tidak
cuma menggeser. Dua pemakai — `app/page.jsx` dan `shell/TopBar.jsx` — plus
berkasnya sendiri dan satu berkas test. Isinya tidak berubah bentuk: ia tetap
**tidak** memanggil `startViewTransition` sendiri, karena boundary
`<ViewTransition>` di layout yang melakukannya, dan memanggilnya sendiri
memotret DOM lama dua kali.

`DIRECTIONS` jadi `['up', 'down', 'zoom']`. **Satu nilai, bukan dua:** `zoom` dan
`unzoom` akan memakai aturan CSS yang persis sama, karena arahnya sudah
ditentukan oleh elemen mana yang membawa nama di tiap sisi. Arah tak dikenal
tetap navigasi polos tanpa `data-nav`.

**Akar tidak ikut menggeser waktu morf.** `22vh` yang mendorong seluruh halaman
akan melawan plate yang sedang melebar jadi judul:

```css
html[data-nav="zoom"]::view-transition-old(root) { animation-name: nav-fade-out; }
html[data-nav="zoom"]::view-transition-new(root) { animation-name: nav-fade-in; }
```

Dua `@keyframes` baru, opacity saja. `--nav-slide` tidak tersentuh dan tetap
milik naik-turun.

**Pasangan bernama dapat waktunya sendiri.** Morf posisi dan ukuran itu bawaan
browser; yang ditetapkan cuma durasi dan easing:

```css
::view-transition-group(sistem-aktif) {
  animation-duration: 700ms;
  animation-timing-function: var(--nav-ease);
}
```

**Tambalan reduced-motion.** Blok yang ada sekarang menolkan
`::view-transition-old(root)` dan `new(root)` saja — karena aturan `*` tidak
menjangkau pseudo-element view-transition. Pseudo-element **bernama** juga tidak
dijangkau, jadi tanpa baris ini pengunjung yang meminta gerak dikurangi tetap
kena morf 700ms penuh. Bentuk kesalahan yang sama dengan `transition-delay`:

```css
::view-transition-group(sistem-aktif),
::view-transition-old(sistem-aktif),
::view-transition-new(sistem-aktif) { animation-duration: 0.01ms !important; }
```

## 4. Pintu

**Masuk.** Logika pintu tinggal di `Shell`, satu fungsi, dua pemanggil:

```js
const openSystem = (slug) => {
  const params = new URLSearchParams({
    pilih: slug,
    sudut: String(Math.round(angleRef.current)),
  });
  if (view === 'list') params.set('tampilan', 'datar');
  router.replace(`/sistem?${params}`, { scroll: false });
  moveTo(router, `/kerja/${slug}`, 'zoom');
};
```

- `SelectedPanel` kehilangan `router` dan menerima prop `onOpen`. Tautannya tetap
  `<Link href>` — klik tengah, ctrl-klik dan "salin alamat tautan" harus tetap
  bekerja — tapi klik kiri polos dicegat:
  `if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;` lalu
  `e.preventDefault()` dan `onOpen(slug)`.
- Konsol `open <nama>` di `Shell.run` memanggil `openSystem`, menggantikan
  `router.push` yang sekarang.

**Keluar.** Tombol kembali browser tidak bisa dicegat handler klik. Halaman baca
menyetel `data-nav="zoom"` sekali waktu mount, jadi **apa pun** yang
meninggalkannya — tautan maupun tombol kembali — mendapat morfnya. Ini aman
justru karena `zoom` satu nilai: efek mount tidak mengubah apa pun di tengah
transisi masuk yang sedang berjalan.

**`← SEMUA SISTEM` menunjuk `/sistem?pilih=<slug>`**, bukan `/sistem` polos.
Halaman baca tahu slug-nya sendiri, jadi plate itu terpilih lagi begitu peta
kembali dan ada yang dimorf balik.

**Perbedaan yang disengaja:** lewat tautan itu sudut kamera **tidak** pulih —
halaman baca tidak tahu sudut yang ditinggalkan, dan menaruhnya di URL `/kerja/*`
akan mengotori halaman yang punya canonical dan metadata sendiri. Kamera kembali
ke `-40`. Lewat **tombol kembali browser**, keduanya pulih persis, karena URL
berparameter itu ada di riwayat.

**Yang tetap memotong:** `WorkFooterNav` prev/next (membersihkan `data-nav` waktu
diklik), tautan `/kerja/*` di dokumen kertas (`YearGroup`), `/kontak`, dan
gerbang `/` ⇄ `/sistem` yang tetap naik-turun.

## 5. Risiko yang harus dibuktikan lebih dulu

Plate hidup di dalam pohon ber-`preserve-3d` dengan `rotateX(56deg) rotateZ(...)`
di atasnya. `view-transition-name` menjadikan elemen sebagai elemen tertangkap
dan memaksa konteks penumpukan sendiri. Ia bisa (a) meratakan tumpukan lapis yang
baru dibangun, atau (b) menghasilkan potret dengan geometri salah karena
perspektifnya.

Kalau itu terjadi, dua jalan mundur, urut:

1. **Nama pindah ke blok judul `SelectedPanel`.** Datar, di aliran normal, dan di
   situ pintunya berdiri. Zoomnya terbaca "kartu catatan itu menjadi halamannya"
   — masih morf, masih bermakna, nol risiko 3D.
2. Kalau morf sama sekali tidak bisa diandalkan, turun ke lintas-pudar berskala
   di tingkat akar.

Spike ini **task pertama** di rencana, dan hasilnya boleh membatalkan §2 dan §4.

## 6. Cara mengujinya

TDD: test dulu, lihat gagal, baru implementasi. Commit tiap task.

- `moveTo.test.js` — `'zoom'` diterima dan menulis `data-nav`; arah tak dikenal
  tetap navigasi polos; penjaga lama tetap: `moveTo` tidak pernah memanggil
  `startViewTransition` sendiri.
- `sistem/page.test.jsx` — `?pilih=rme` dan `?sudut=-28` sampai ke `Shell`
  sebagai prop; `?sudut=abc` jatuh ke `-40`; tanpa keduanya jatuh ke `null` dan
  `-40`.
- `Shell.test.jsx` — pintu memanggil `replace` dengan `pilih` dan `sudut`
  **lalu** `push` ke `/kerja/<slug>`, urutannya diperiksa; `tampilan=datar` ikut
  kalau sedang di tabel datar; `open <nama>` lewat pintu yang sama.
- `SelectedPanel.test.jsx` — klik kiri polos memanggil `onOpen` dan mencegah
  bawaan; ctrl-klik tidak memanggilnya dan membiarkan tautan bekerja.
- `Plate.test.jsx` — `viewTransitionName` ada hanya waktu `selected`.
- `MapScene.test.jsx` — sudut kamera terkini tertulis ke ref titipan.
- `ProjectView.test.jsx` — blok kepala membawa `sistem-aktif`; `data-nav` jadi
  `zoom` sesudah mount; `← SEMUA SISTEM` menunjuk `/sistem?pilih=<slug>`;
  prev/next membersihkan `data-nav`.

Perkiraan 197 → sekitar 215.

## 7. Yang bisa dibuktikan dari panel browser

1. Spike: plate dengan `view-transition-name` tetap punya tumpukan 3D — lapisnya
   masih terpisah di layar.
2. Tepat satu elemen membawa `sistem-aktif` pada satu waktu — sapu DOM dengan
   `getComputedStyle(el).viewTransitionName`, di peta dan di halaman baca.
3. Klik pintu → URL jadi `/kerja/<slug>`; `history.back()` → `/sistem?pilih=…&sudut=…`,
   plate itu terpilih lagi dan kamera memakai sudut dari URL.
4. `document.documentElement.dataset.nav` terisi `"zoom"`.
5. Aturan `::view-transition-group(sistem-aktif)` dan tiga aturan
   reduced-motion-nya benar-benar ada di stylesheet — telusuri
   `document.styleSheets`; menulisnya tidak berarti terkirim.
6. `npm run build` tetap mendaftarkan `/sistem` sebagai `○ Static` walau membaca
   dua parameter baru.

## 8. Yang tidak bisa, dan tidak akan diklaim

Bahwa morfnya terlihat. Panel browser sesi ini `document.hidden`; Chrome
membatalkan tiap View Transition dengan `InvalidStateError` dan
`document.getAnimations()` selalu kosong — sudah terbukti dua kali. Transisi CSS
biasa pun tidak beranjak di sana.

Jadi rupa zoomnya, durasinya, dan apakah 700ms terasa benar menunggu mata Utsman
di browsernya sendiri, sama seperti `22vh` dan seperti snap kamera yang ditolak
setelah dilihat.
