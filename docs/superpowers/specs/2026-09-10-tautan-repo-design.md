# Tautan repo per project — spec desain

**Tanggal:** 2026-09-10
**Branch:** `portfolio-canvas-redesign`
**Antrean:** nomor 1 di `docs/PROGRESS.md`, lahir dari penilaian jujur 2026-09-10

## Kenapa

Penilaian 2026-09-10 menaruh potensi recruiter di 6/10, dan alasan nomor satu
adalah "hampir tidak ada yang bisa diperiksa orang lain — delapan dari sembilan
sistem tanpa URL, dan belum ada satu pun tautan repo". Porto ini menyasar
engineer. Engineer memeriksa kode.

Yang dicari bukan jumlah repo. Cukup bukti bahwa ada yang bisa dibuka.

## Keadaan repo, terperiksa 2026-09-10

Lima repo yang diizinkan Utsman, semuanya sudah publik di
`github.com/Utsmanseff`:

| Slug porto | Repo | Commit | README |
|---|---|---|---|
| `hris-nirwana` | `HRIS-Nirwana` | — | Laravel bawaan |
| `sigap-bpn` | `Sistem-Informasi-Kepegawaian` | 1 | Laravel bawaan |
| `simaset` | `Sistem-Informasi-Manajemen-Aset` | 1 | Laravel bawaan |
| `sibenih` | `Aplikasi-Monitoring-Sertifikasi-Benih` | 1 | Laravel bawaan |
| `simbas` | `Sistem-Informasi-Manajemen-BanSos` | 1 | Laravel bawaan |

Pemetaan slug → repo diambil dari deskripsi repo, bukan dari namanya: SIGAP dari
"absensi berbasis Geo-Location, pengajuan cuti, pengajuan lembur serta payroll
otomatis", SIMASET dari "manajemen aset dan inventaris … depresiasi", SIBENIH
dari "sertifikasi benih", SIMBAS dari "bantuan sosial".

Sengaja tidak dipakai: `Sistem-Informasi-Manajemen-Pelatihan` (bukan salah satu
dari sembilan sistem), `rsunirwana-web.-v.2` (publik, tetapi tidak ada di
daftar izin), `utsmanseff`, `Gamat-RHN`, `Vitex-NSA`.

### Tiga syarat, dan hasilnya

Syarat yang ditulis di `PROGRESS.md` sebelum satu pun tautan boleh masuk:

1. **Repo privat.** Lolos — kelimanya publik, tidak ada yang akan mendarat di
   404.
2. **Kode klien.** Diputuskan Utsman: kelimanya boleh dipublikasikan. Riwayat
   satu commit di empat repo berarti tidak ada riwayat lama untuk digali.
   **Isi kode tidak diperiksa dari sini** — hanya halaman depan repo yang
   dibaca. Kalau nanti ditemukan kredensial atau endpoint internal di dalamnya,
   itu temuan baru, bukan sesuatu yang spec ini pernah nyatakan aman.
3. **Repo tanpa README.** **Gagal, kelima-limanya.** Bukan tanpa README —
   README bawaan Laravel, berisi "About Laravel · Laravel Sponsors · Premium
   Partners". Itu persis kegagalan yang syarat ketiga jaga: recruiter membuka,
   melihat folder Laravel standar, lalu menutupnya.

Karena itu spec ini punya dua bagian, dan **README dulu**: tidak satu pun
tautan masuk ke porto sebelum kelima repo punya README-nya sendiri.

## Bagian A — Lima README

### Tempat

`docs/readme-repo/<nama-repo>.md`, ikut ke-commit di porto. Repo tujuan tidak
bisa didorong dari sesi ini; Utsman yang menempelkannya lewat web GitHub atau
push sendiri. Berkasnya tinggal di porto sebagai jejak, supaya kalau nanti
teksnya perlu disetel, yang disetel berkas yang benar.

Lima berkas:

```
docs/readme-repo/HRIS-Nirwana.md
docs/readme-repo/Sistem-Informasi-Kepegawaian.md
docs/readme-repo/Sistem-Informasi-Manajemen-Aset.md
docs/readme-repo/Aplikasi-Monitoring-Sertifikasi-Benih.md
docs/readme-repo/Sistem-Informasi-Manajemen-BanSos.md
```

### Bentuk

Satu berkas, dua bahasa, Indonesia dulu lalu Inggris di bawah satu garis.
Sekitar 40–60 baris seluruhnya. Susunannya:

```markdown
# <title.id>

<satu baris: client · tahun · peran>

<context.id — satu paragraf>

## Yang dibangun
<butir-butir built.id>

## Stack
<tech, dipisah koma>

<catatan kode klien>

---

# <title.en>
… bagian yang sama dalam Inggris
```

### Sumber teks

Seluruhnya diangkat dari `src/lib/data/projects.js`, yang prosanya sudah
dibakukan pada 2026-09-10. **Tidak ada kalimat baru yang dikarang.** Yang
boleh ditulis baru hanya satu baris catatan kode klien, dan bunyinya sama di
kelima berkas kecuali nama pemiliknya.

Larangan yang tetap berlaku di dalam README:

- Tidak ada angka dampak — tidak ada persen, tidak ada jumlah pengguna.
- Tidak ada kata "saya". Prosa baku, kalimat lurus.
- **HRIS RSU Nirwana tidak punya payroll atau modul keuangan.** Jangan
  disebut, walaupun deskripsi repo tetangganya menyebut payroll.
- **SIGAP memang mencatat dan menghitung penggajian bulanan** dari absensi,
  lembur dan cuti, tetapi tidak menjalankan pembayaran, dan kalimatnya harus
  menyebut batas itu sendiri. Ini bukan pengecualian yang lupa dihapus.
- Nama SIMRS rumah sakit tidak ditulis.

### Catatan kode klien

Satu baris di kaki bagian Indonesia dan satu di kaki bagian Inggris. Isinya:
sistem ini dikerjakan untuk <klien>, dan repo ini dibuka sebagai contoh kerja.
Tidak menjanjikan dukungan, tidak mengundang kontribusi.

## Bagian B — Tautan di porto

### B1 — Data

Medan baru `repo` di tiap entri `src/lib/data/projects.js`, sejajar `site`:

```js
repo: 'https://github.com/Utsmanseff/HRIS-Nirwana',
```

**URL penuh, bukan nama repo yang disambung ke `meta.github`.** `site` sudah
URL penuh; menyambung sendiri berarti satu aturan baru demi keuntungan nol, dan
ia patah begitu ada satu repo yang tinggal di organisasi.

Empat sistem sisanya — `rsu-nirwana-web`, `idrg-bridging`, `rme`,
`psb-walisongo` — mendapat `repo: null`, sama seperti `site: null`. Medannya
ada di kesembilan entri supaya bentuk datanya seragam.

Komentar kepala berkas ditambahi satu baris yang menerangkan medan `repo`,
sejajar keterangan `access` yang sudah ada.

### B2 — Yang tidak disentuh

`src/lib/shell/filters.js`, `src/lib/shell/commands.js`,
`src/components/shell/LogRail.jsx` dan `src/components/document/FilterSheet.jsx`
**tidak berubah sama sekali**. Empat kunci filter tetap empat: `client`, `year`,
`access`, `stack`. Repo adalah medan tampilan, bukan sumbu penyaringan.

`AccessBadge` dan `AccessTick` juga tidak berubah. Lencana akses bicara soal
sistem yang berjalan; tautan repo bicara soal kode. Keduanya tidak saling
menerangkan, dan tidak ada kalimat penjelas yang ditambahkan untuk menjembatani
— pembaca yang disasar tidak akan bingung.

### B3 — Halaman baca (`ProjectView`)

Kaki halaman baca sekarang merender satu tombol amber `Coba langsung ↗` waktu
`access === 'public' && site`. Ditambah saudaranya:

```jsx
<div className="flex flex-wrap gap-3 mt-12">
  {project.access === 'public' && project.site && (
    <a href={project.site} …>{COPY.visit[locale]}</a>
  )}
  {project.repo && (
    <a href={project.repo} …>{COPY.code[locale]}</a>
  )}
</div>
```

Kotak amber sebentuk untuk keduanya: `border border-amber text-amber px-4 py-2`,
`hover:bg-amber hover:text-ground transition-colors duration-500`. Satu bahasa
untuk dua tujuan keluar. `mt-12` pindah dari tombol ke pembungkusnya.

Copy baru: `code: { id: 'Lihat kode ↗', en: 'View code ↗' }`.

Keduanya `target="_blank" rel="noopener noreferrer"`.

Tidak ada satu pun sistem yang punya `site` **dan** `repo` sekarang — yang punya
situs adalah `rsu-nirwana-web`, dan reponya tidak ada di daftar izin. Bentuk ini
tetap dipakai supaya kalau nanti ada, keduanya berdiri berdampingan tanpa
aturan baru.

Panah `↗` ikut ke dalam label, sama seperti `Coba langsung ↗` yang sudah ada —
bukan `aria-hidden` seperti panah tombol gerbang, karena di sini ia bagian dari
kalimatnya dan menandai bahwa tautannya keluar dari situs.

### B4 — Panel kanan cangkang (`SelectedPanel`)

Kaki panel sekarang punya dua keadaan. Jadi empat:

| tier | repo | kaki |
|---|---|---|
| `full` | `null` | `ENTER → BUKA HALAMAN` — tidak berubah |
| `full` | ada | `ENTER → BUKA HALAMAN`, lalu baris kedua `Lihat kode ↗` |
| `brief` | ada | `Lihat kode ↗` **menggantikan** `RINGKASAN SAJA · TANPA HALAMAN` |
| `brief` | `null` | `RINGKASAN SAJA · TANPA HALAMAN` — tidak berubah |

Baris ketiga adalah inti perubahan ini. SIBENIH dan SIMBAS tepat dua sistem
tier `brief`, dan keduanya punya repo. Menyisakan label mati di atas tautan
hidup itu janji palsu yang kedua — sekerabat dengan pegangan tarik `FilterSheet`
yang dibuang pada 2026-09-10 justru karena ia menjanjikan sesuatu yang tidak
ada. Di sini kebalikannya: label yang bilang "tidak ada" sementara ada.

Bentuk tautannya `<a>` biasa, **bukan** `Link` dan bukan `onOpen`:

```jsx
<a
  href={system.repo}
  target="_blank"
  rel="noopener noreferrer"
  className="block text-center font-mono text-[11px] border border-amber text-amber py-2"
>
  {COPY.code[locale]}
</a>
```

Ia keluar dari situs, jadi ia tidak lewat `openSystem`, tidak menyetel
`data-nav`, dan tidak ikut morf `sistem-aktif`. Kalau ia berdiri sebagai baris
kedua di bawah `ENTER → BUKA HALAMAN`, jaraknya `mt-2` dan warnanya turun ke
`border-rule text-muted` — di panel yang tombol utamanya amber, dua kotak amber
bertumpuk membuat keduanya berhenti berarti apa-apa. Waktu ia berdiri sendiri
(tier `brief`), ia amber penuh, karena ia satu-satunya jalan keluar dari panel
itu.

Copy `noPage` tetap ada dan tetap dipakai — hanya jalurnya yang menyempit.

### B5 — Dokumen HP (`YearGroup`)

Tautan `KODE ↗` mono kecil di baris sistem, di sebelah `AccessTick`,
`text-amber-ink` (`#9C5A28`) — **bukan** `text-amber` (`#C97B3F`), yang cuma
2.8:1 di atas kertas.

**Jebakan struktural, dan ini bagian yang paling mudah salah:** baris tier
`full` sekarang dibungkus seluruhnya oleh `<Link href={/kerja/${s.slug}}>`.
Menaruh `<a>` repo di dalam badan itu menghasilkan `<a>` bersarang — HTML tidak
sah, dan hidrasi Next akan menatanya ulang diam-diam.

Jadi susunan barisnya berubah: `<Link>` membungkus **badan** (nama, klien,
tahun, `AccessTick`), dan tautan repo berdiri **bersaudara** di sebelahnya di
dalam sel grid yang sama. Baris tier `brief` tidak punya masalah itu karena ia
memang bukan tautan; supaya kodenya satu bentuk, keduanya memakai susunan yang
sama.

Sel barisnya jadi `flex items-center gap-3`, dengan `<Link>` (atau badan
telanjang) mengambil `flex-1 min-w-0` — `min-w-0` karena `1fr` punya
`min-width: auto` dan nama sistem yang panjang akan menahan baris jadi
menggulir ke samping.

Target sentuh `KODE ↗` diukur di browser sungguhan, bukan di test: happy-dom
tidak menata letak apa pun, dan chip filter 38px pernah lolos seluruh test lalu
gagal di tangan. Angka yang dikejar 44px pada sisi yang bisa disentuh; kalau
tulisannya sendiri lebih pendek dari itu, padding yang menutupinya.

## Uji

TDD: test dulu, lihat gagal, baru implementasi.

**Data (`projects.test.js`)**
- Kelima slug — `hris-nirwana`, `sigap-bpn`, `simaset`, `sibenih`, `simbas` —
  punya `repo` bertipe string.
- Empat sisanya punya `repo === null`.
- Kesembilan entri punya medan `repo` (tidak ada yang `undefined`).
- Setiap `repo` yang tidak null berawalan `https://github.com/Utsmanseff/`.

**`ProjectView`**
- Project ber-`repo` merender tautan bernama `/Lihat kode|View code/` dengan
  `href` yang benar, `target="_blank"` dan `rel` memuat `noopener`.
- Project tanpa `repo` tidak merender tautan itu sama sekali.

**`SelectedPanel`** — empat keadaan tabel B4, satu test masing-masing. Yang
paling penting: tier `brief` + repo **tidak** merender teks `noPage`.

**`YearGroup`**
- Baris tier `full` ber-repo memberi dua tautan bersaudara, dan tidak ada
  `<a>` yang berada di dalam `<a>` lain (ditelusuri dari DOM, bukan dari
  className).
- Baris tanpa repo tetap satu tautan.
- Tautan repo memakai kelas `text-amber-ink`, bukan `text-amber`.

**Yang tidak akan ditest di unit:** ukuran target sentuh, kontras warna
sungguhan, dan apakah tautan benar-benar mendarat. Ketiganya cuma ada di
browser.

## Verifikasi browser

Panel diemulasi 1280×800; klik berbasis koordinat tidak mendarat di ukuran itu,
jadi seluruh interaksi lewat `javascript_tool` dan `element.click()`.

1. `/kerja/hris-nirwana` — tautan `Lihat kode ↗` ada, `href` tepat
   `https://github.com/Utsmanseff/HRIS-Nirwana`, `target` `_blank`.
2. `/kerja/rme` — tidak ada tautan kode sama sekali.
3. `/sistem`, klik plate SIMBAS — kaki panel berisi tautan GitHub dan **tidak**
   berisi teks `RINGKASAN SAJA`.
4. `/sistem`, klik plate SIGAP — kaki panel berisi `ENTER → BUKA HALAMAN`
   **dan** baris kode di bawahnya, dan warna baris kedua bukan amber.
5. Lebar 375, `/` — baris HRIS punya tepat dua elemen `<a>` yang **bersaudara**;
   `closest('a')` dari tautan repo mengembalikan dirinya sendiri, bukan tautan
   halaman baca. Kotak sentuhnya diukur `getBoundingClientRect`.
6. Lebar 375 — warna terhitung tautan repo dibaca `getComputedStyle`, harus
   `rgb(156, 90, 40)`.
7. `curl` `/` dan `/kerja/hris-nirwana` — tautan repo ada di HTML server, jadi
   pengunjung tanpa JavaScript ikut mendapatkannya.

Rasa gerak tidak dinilai di sini: panel `document.hidden`, dan tidak ada gerak
baru yang ditambahkan spec ini selain `transition-colors` yang sudah ada.

## Yang sengaja tidak dikerjakan

- **Kunci filter `repo`.** Ditolak Utsman. Ia menyeret `filters.js`,
  `commands.js`, `LogRail` dan `FilterSheet` beserta seluruh testnya ke dalam
  spec yang seharusnya soal satu medan data.
- **Tautan repo di `FlatTable` dan `Plate`.** Tabel datar adalah ringkasan
  sembilan baris dan plate adalah bentuk, bukan tempat menaruh tujuan keluar.
  Panel kanan sudah melayani keduanya.
- **Menyentuh `rsunirwana-web.-v.2`.** Publik, tetapi tidak ada di daftar izin.
- **Memeriksa isi kode kelima repo.** Di luar jangkauan sesi ini, dan
  dinyatakan begitu di atas.
