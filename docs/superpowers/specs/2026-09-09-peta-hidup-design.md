# Spec — Peta hidup

**Tanggal:** 2026-09-09
**Branch:** `portfolio-canvas-redesign`
**Asal:** antrean nomor 1 di `docs/PROGRESS.md`, "Peta lebih interaktif"

## Lingkup

Antrean nomor 1 dipecah dua. Spec ini adalah bagian pertama:

1. **Peta hidup** (spec ini) — klik badan plate, roda memutar kamera, lapisan
   lebih bernyawa. Seluruhnya di dalam `MapScene`, `Plate`, dan dua modul baru
   di `src/lib/shell/`. Tidak menyentuh route, tidak menyentuh `layout.js`.
2. **Zoom ke halaman baca** (spec sendiri, nanti) — View Transitions masuk dan
   keluar, menuntut `rotZ`/`scale`/`selected` bertahan waktu kembali. Itu
   menyeberang route; menggabungkannya membuat rencana sulit dibaca dan
   membiarkan keputusan zoom mengubah keputusan klik.

Yang **tidak** termasuk spec ini:

- Dinding vertikal di sisi tumpukan. Ditolak waktu brainstorm.
- Kontrol kamera lewat keyboard. Sudut kamera tidak menyimpan informasi apa pun,
  jadi tidak ada yang hilang. Kalau nanti diminta, itu spec sendiri.
- Teks legenda dan catatan rail (antrean nomor 2).
- Kontras label tahun (antrean nomor 3).

## Keadaan sekarang

`MapScene` (116 baris) memegang `ResizeObserver`, perspektif, `rotZ`, seret,
baris tahun, legenda. `Plate` (73 baris) menggambar lima lapis dari dua array
warna tetap, dan satu-satunya yang klikable adalah `<button data-plate-label>` —
lapisannya mati.

## Bentuk yang dituju

Dua unit baru, masing-masing satu tugas dan batas jelas: `shading` tidak tahu
apa itu pointer, `useMapCamera` tidak tahu apa itu warna. `MapScene` kembali
jadi komponen tata letak dan menyusut.

| Berkas | Status | Isi |
|---|---|---|
| `src/lib/shell/useMapCamera.js` | baru | `rotZ`, seret, roda, debounce, snap |
| `src/lib/shell/shading.js` | baru | warna tepi per sisi, murni |
| `src/components/shell/MapScene.jsx` | diubah | memakai hook, membungkus `onSelect` |
| `src/components/shell/Plate.jsx` | diubah | jadi tombol, tumpukan membuka, stagger |
| `src/app/globals.css` | satu baris | `transition-delay: 0ms !important` |
| `src/lib/shell/layout.js` | **tidak berubah** | |

## 1. `useMapCamera`

```js
const camera = useMapCamera();
// camera.rotZ      → number, derajat
// camera.settling  → boolean, true selama snap berjalan sendiri
// camera.dragged   → () => boolean, gestur terakhir bergeser > 4px
// camera.handlers  → { onPointerDown, onPointerMove, onPointerUp,
//                      onPointerCancel, onWheel }
```

`MapScene` menyebar `{...camera.handlers}` ke pane dan meneruskan `camera.rotZ`
ke `Plate` seperti sekarang.

**Seret.** Persis seperti sekarang: `deltaX * 0.22`, 1:1, tanpa easing.

**Roda.** `rotZ += delta * 0.12`, 1:1 juga. Sumbu dominan yang menang —
`Math.abs(deltaX) > Math.abs(deltaY) ? deltaX : deltaY` — supaya geser dua jari
mendatar di trackpad terasa seperti seret, dan roda tetikus tetap bekerja.
Tanpa `preventDefault`: React memasang `wheel` sebagai passive, dan cangkang
`overflow-hidden` jadi tidak ada gulir yang perlu dicegah.

Handler roda hanya di pane peta. `LogRail` dan `SelectedPanel` `overflow-y-auto`
dan tetap menggulir seperti biasa.

Angka `0.12` disetel dengan mata sesudah dilihat, seperti parallax gerbang.

**Diam.** 180ms sesudah event roda terakhir — atau langsung waktu pointer lepas
— `snapRotation()` menarik ke `-55/-40/-25`.

**Snap teranimasi.** Snap bukan jari; itu mesin yang bergerak sendiri, jadi
kontrak gerak menuntut 700ms `cubic-bezier(.22, 1, .36, 1)`. `camera.settling`
menyalakan `transition: transform 700ms var(--nav-ease)` di grup peta **hanya
selama snap**, lalu dimatikan lagi. Selama jari menempel tetap nol easing.

Ini mengubah perilaku yang sudah ada: lepas-seret yang sekarang melompat keras
jadi ikut mulus. Disengaja, disetujui waktu brainstorm.

**`dragged()`.** Akumulasi `|deltaX|` sejak `pointerdown`. Di atas 4px, klik
plate berikutnya ditelan — seret yang kebetulan berakhir di atas plate tidak
memilih sistem. Direset di `pointerdown` berikutnya.

## 2. `shading`

```js
edgeTones({ index, layers, rotZ })
// → { top: '#…', right: '#…', bottom: '#…', left: '#…' }
```

**Kenapa per-sisi.** Tiap lapis adalah satu bidang datar dengan `border`
seragam. Tidak ada elemen per sisi yang bisa diwarnai sendiri, tapi
`border-top-color` / `-right-` / `-bottom-` / `-left-` ada gratis di elemen yang
sama. Empat warna tepi per lapis, dihitung dari `rotZ`. Nol elemen baru, nol
bayangan.

**Matematikanya.** Cahaya ditetapkan di ruang layar, bukan di ruang plate — itu
sebabnya memutar peta mengubah rupa tumpukan dan bukan cuma posisinya. Arah
cahaya `L` menunjuk ke kiri-atas layar. Normal lokal tiap sisi: atas `(0,-1)`,
kanan `(1,0)`, bawah `(0,1)`, kiri `(-1,0)`. Plate diputar `rotZ`, jadi `L`
dibawa ke ruang lokal dengan diputar `-rotZ`. Terang tiap sisi:

```
b = dasar(index) + AMP * max(0, dot(n_sisi, L_lokal))
```

`b` lalu diinterpolasi antara dua ujung ramp. Dasar tetap naik menurut `index`,
jadi kedalaman lapis tidak hilang — sudut kamera cuma memiringkannya.

**Batas warna.** Tetap di keluarga yang sudah ada: paling gelap `#2A3236`,
paling terang `#4C555A` (`--color-muted-deep`). Tidak ada warna baru, tidak ada
bayangan, tidak ada yang lebih terang dari label.

**Yang tidak disentuh shading:**

- Isi lapis (`background`) tetap ramp lima langkah yang sekarang. Yang bereaksi
  hanya tepi.
- Tepi lapis atas waktu `access === 'public'` tetap `#C97B3F`, dan waktu
  terpilih tetap `#E8E0D0`. Itu makna, bukan kedalaman — makna menang.

## 3. `Plate`

**Jadi satu tombol.** Pembungkus `<div className="absolute">` berubah jadi
`<button type="button" aria-pressed={selected}>`, membawa
`transformStyle: 'preserve-3d'` dan seluruh posisi yang sekarang. Gaya bawaan
tombol dimatikan: `appearance-none bg-transparent border-0 p-0 text-left`.
`<button data-plate-label>` di dalamnya turun jadi `<span>`; transform
putar-baliknya tidak berubah.

Satu sistem, satu kontrol — sama seperti keputusan `UTSMAN` berhenti jadi
tautan. Tab mendarat di badan plate.

`onClick` tidak langsung memanggil `onSelect`. `MapScene` membungkusnya:

```js
const select = (slug) => { if (camera.dragged()) return; onSelect(slug); };
```

**Tumpukan membuka.** `Plate` memegang satu boolean `active`, dinyalakan
`onPointerEnter` / `onFocus`, dimatikan `onPointerLeave` / `onBlur` — fokus
keyboard dapat perlakuan yang sama dengan tetikus.

| | rapat | terbuka (`active` atau `selected`) |
|---|---|---|
| jarak antar-lapis | 7px | 11px |
| angkat plate | 0 | 6px hover · 10px terpilih |

`position.topZ` tidak bisa dipakai apa adanya lagi untuk menempatkan label — ia
dihitung dari `LAYER_STEP` tetap di `layout.js`. `Plate` menghitung sendiri
`(layers - 1) * step` dari `step` yang sedang berlaku, supaya label ikut naik
bersama tumpukan. `layout.js` tidak berubah; `topZ` tetap diekspor dan tetap
benar sebagai tinggi rapat.

Lapis dapat `transition: transform 700ms var(--nav-ease), border-color 180ms
linear`.

**Naik bertahap waktu masuk.** `mounted` mulai `false`; lapis dirender di
`translateZ(0)`, semuanya bertumpuk rata. Satu `setTimeout(…, 0)`
menyalakannya, dan `transition-delay: index * 40ms` membuat lapis naik
berurutan dari bawah.

`setTimeout`, bukan `requestAnimationFrame`: rAF menggantung waktu panel browser
tersembunyi, dan satu rAF yang tergantung meracuni sisa sesi halaman itu.

Cakupannya **mount saja**, bukan tiap filter berubah. Delapan plate yang
mengulang animasi tiap chip ditekan itu kebisingan, dan peredupan filter sudah
punya bahasanya sendiri (opacity 700ms).

## 4. `globals.css`

Satu baris ke dalam blok `@media (prefers-reduced-motion: reduce)` yang sudah
ada:

```css
transition-delay: 0ms !important;
```

`!important` di blok itu sudah menjangkau `transition-duration` inline, tapi
`transition-delay` tidak ikut dinolkan. Tanpa baris ini durasi memang jadi
0.01ms sementara lapis kelima tetap menunggu 160ms — gerak yang dikurangi
berubah jadi kedipan bertahap.

## 5. Kontrak gerak

| gerak | siapa yang menggerakkan | aturan |
|---|---|---|
| seret memutar | jari | 1:1, tanpa easing |
| roda memutar | jari | 1:1, tanpa easing |
| snap sesudah diam | mesin | 700ms `--nav-ease` |
| tumpukan membuka | mesin | 700ms `--nav-ease` |
| lapis naik waktu masuk | mesin | 700ms, delay `40ms × index` |
| tepi berubah warna | — | 180ms linear, seperti sekarang |

## 6. Aksesibilitas

Tab mendarat di badan plate, urutan DOM (baris tahun, kiri ke kanan).
Enter/Space memilih, `aria-pressed` seperti sekarang. Fokus membuka tumpukan
sama seperti hover. Nama aksesibel plate tetap berisi nama pendek dan klien,
sama seperti tombol label yang digantikannya.

Kamera tidak dapat kontrol keyboard. Sudut kamera tidak menyimpan informasi
apa pun — tahun ada di baris berlabel, stack ada di panel dan legenda.

## 7. Larangan yang tetap berlaku

- Tidak ada angka jumlah di layar. Tidak ada yang ditambahkan di sini yang
  menghitung apa pun.
- Tidak ada bayangan. Kedalaman dari jarak lapis, tepi, dan sudut.
- Amber `#C97B3F` cuma di atas gelap. Peta selalu gelap; tidak ada warna kertas
  yang tersentuh.
- `snapRotation` tetap tiga sudut `-55/-40/-25`.

## 8. Risiko yang harus dibuktikan lebih dulu

`<button>` dengan `transform-style: preserve-3d` dan anak-anak ber-`translateZ`
— sebagian browser meratakan konteks 3D di elemen kontrol. Kalau ternyata rata,
jalan mundurnya `<div role="button" tabIndex={0}>` dengan handler `Enter` /
`Space` sendiri.

Ini **diverifikasi di browser sungguhan paling awal**, sebelum sisanya
dikerjakan. Bukan diasumsikan.

## 9. Cara mengujinya

TDD: test dulu, lihat gagal, baru implementasi. Commit tiap task.

`src/lib/shell/__tests__/shading.test.js` — murni, tanpa DOM:

- pada `rotZ = -40`, sisi yang menghadap cahaya lebih terang dari seberangnya
- putar 180°, keduanya bertukar
- naikkan `index`, semua sisi ikut naik
- semua keluaran di dalam batas `#2A3236`…`#4C555A`
- keluaran deterministik dan berbentuk hex

`src/lib/shell/__tests__/useMapCamera.test.jsx` — lewat komponen probe:

- `pointerDown` → `pointerMove` 100px → `rotZ` bertambah `100 × 0.22`
- `wheel` `deltaY: 100` → `rotZ` bertambah `12`
- `deltaX` dominan menang atas `deltaY`
- timer palsu: 180ms sesudah roda terakhir, `rotZ` mendarat di `CAMERA_ANGLES`
- `settling` `true` selama snap, `false` sesudahnya
- `dragged()` `false` untuk geser 2px, `true` untuk 40px, direset di
  `pointerDown` berikutnya

`Plate.test.jsx` (diperbarui):

- plate adalah `role="button"` dengan nama aksesibel berisi nama pendek dan
  klien — cocokkan persis, jangan substring
- `aria-pressed` mengikuti `selected`
- fokus dan hover membuka tumpukan: `translateZ` lapis teratas naik dari
  `4 × 7` ke `4 × 11`
- label ikut naik bersamanya

`MapScene.test.jsx`:

- klik plate sesudah seret 40px tidak memanggil `onSelect`
- klik plate tanpa seret memanggilnya

Perkiraan: 156 → sekitar 180.

## 10. Yang test tidak bisa lihat

`happy-dom` tidak menata letak dan tidak menghitung 3D. Ia bisa membaca string
`transform` yang ditulis sendiri — itu menguji kabelnya, bukan rupanya. Empat
hal harus dilihat di browser sungguhan:

1. `preserve-3d` bertahan di `<button>` (bagian 8). Paling awal.
2. Tumpukan benar-benar terlihat membuka waktu hover.
3. Tepi benar-benar berubah waktu peta diputar.
4. Rasa `0.12` untuk roda dan `40ms` untuk stagger.

**Protokol verifikasinya.** Panel browser sesi ini ~559px — di bawah 1024, jadi
cangkang tidak mount di ukuran aslinya dan harus diemulasi 1280×800. Begitu
diemulasi, klik dan hover berbasis koordinat mendarat di tempat lain, nol event,
tanpa error, dan screenshot tidak bisa dipercaya untuk menilai ukuran. Jadi
semua lewat `javascript_tool`: `element.click()` untuk memilih,
`dispatchEvent(new WheelEvent(...))` untuk roda, `dispatchEvent` pointer untuk
seret, lalu baca `getComputedStyle(...).borderTopColor` dan `style.transform`.

Nomor 4 — rasa — tidak bisa diputuskan dari panel. Itu mata Utsman, di
browsernya sendiri, sama seperti parallax gerbang yang perlu empat putaran.
