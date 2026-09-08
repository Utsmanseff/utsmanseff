# Gaya Scrollbar — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ganti scrollbar bawaan Windows dengan scrollbar samar 8px yang memakai palet yang sudah ada, di enam tempat menggulir — empat pane cangkang, jendela halaman baca, dan dokumen kertas.

**Architecture:** Dua blok CSS di `src/app/globals.css`. Satu global untuk lapis gelap, satu di bawah `:has(.paper-doc)` untuk lapis kertas. Tidak ada komponen baru, tidak ada JavaScript, tidak ada perubahan markup.

**Tech Stack:** CSS `::-webkit-scrollbar` + properti standar `scrollbar-width` / `scrollbar-color`, Tailwind v4 `@theme` yang sudah ada.

**Dasar sebelum mulai:** 145 test hijau, 22 berkas, `npx eslint src --max-warnings=0` bersih.

**Dari spec:** `docs/superpowers/specs/2026-09-09-gaya-scrollbar-design.md`

> **Selesai 2026-09-09.** Task 1 menjawab cabang kedua: di Chrome 148, keduanya
> berdampingan memberi 10px, bukan 8px — penjaga `@supports` wajib. Task 3
> menemukan bug yang tidak ada di rencana: kombinator keturunan tidak menjangkau
> scrollbar elemen akar, jadi batang jendela di dokumen kertas masih gelap
> (`html` `#2E3539` sementara `body` sudah `#D9D0BC`). Diperbaiki dengan varian
> selektor tanpa spasi. 145 test hijau, 22 berkas — tidak berubah, sesuai rencana.

---

## Catatan penting sebelum Task 1

**Tidak ada test unit di rencana ini, dan itu disengaja.** happy-dom tidak
menggambar scrollbar dan tidak menghitung letak; test apa pun soal
`::-webkit-scrollbar` akan hijau tanpa membuktikan apa-apa. Ini pelajaran yang
sudah dibayar sekali: chip filter 38px lolos semua test sampai diukur di browser
sungguhan.

Yang menggantikan test di sini adalah **pengukuran di browser sungguhan lewat
`javascript_tool`**, dan tiap task punya langkah pengukurannya sendiri dengan
kode yang sudah ditulis lengkap. Aturan yang berlaku sama kerasnya: jalankan
pengukuran, baca angkanya, laporkan apa adanya. Kalau sebuah properti tidak
sampai, itu yang ditulis — bukan "kelihatannya jalan".

**Sebelum tiap pengukuran, cache Turbopack harus dibuang.** `globals.css` persis
berkas yang terkena. Server dev dijalankan Utsman sendiri di port 3000, jadi
jangan menjalankan server baru. Utsman memakai **Windows/PowerShell**, jadi
perintahnya bukan `rm -rf`:

```powershell
Remove-Item -Recurse -Force .next
```

Urutannya mengikat: **hentikan `npm run dev` dulu** (Ctrl+C), baru hapus. Selama
server hidup Windows mengunci berkas di dalam `.next` dan penghapusan gagal
separuh jalan. Setelah itu `npm run dev` lagi. Tunggu konfirmasi Utsman.

**Panel browser sesi ini lebih sempit dari 1024px.** Cangkang tidak akan mount di
ukuran asli panel. Emulasi 1280×800 lebih dulu, dan verifikasi lewat
`javascript_tool`, bukan screenshot — begitu emulasi melebihi panel, klik dan
hover berbasis koordinat mendarat di tempat lain.

---

### Task 1: Buktikan dulu bagaimana Chrome memperlakukan keduanya

Spec menyebut satu risiko yang belum diukur: sejak Chrome 121, `scrollbar-color`
yang bernilai selain `auto` diyakini **mematikan** seluruh gaya
`::-webkit-scrollbar` pada elemen yang sama. Kalau itu benar, menulis keduanya
polos berdampingan menghilangkan 8px dan hover di Chrome — diam, tanpa error.

Bentuk akhir CSS-nya bergantung pada jawaban ini, jadi diukur lebih dulu, bukan
ditebak.

**Files:** tidak ada yang diubah. Ini pengukuran.

- [x] **Step 1: Emulasi viewport dan buka halaman di lapis gelap**

Pakai `resize_window` `{ width: 1280, height: 800 }`, lalu `navigate` ke
`http://localhost:3000/sistem`.

- [x] **Step 2: Suntikkan elemen uji dan ukur lebar scrollbar-nya**

Jalankan lewat `javascript_tool`. Elemen dibuat, diukur, lalu dibuang lagi —
tidak ada yang tertinggal di halaman.

```js
const mk = (css) => {
  const id = 'probe' + Math.random().toString(36).slice(2, 8);
  const el = document.createElement('div');
  el.id = id;
  el.style.cssText = 'position:fixed;left:-9999px;top:0;width:100px;height:100px;overflow-y:scroll;';
  el.innerHTML = '<div style="height:400px"></div>';
  const style = document.createElement('style');
  style.textContent = css.split('SEL').join('#' + id);
  document.head.appendChild(style);
  document.body.appendChild(el);
  const width = el.offsetWidth - el.clientWidth;
  el.remove();
  style.remove();
  return width;
};

const bare = mk('');
const webkitOnly = mk('SEL::-webkit-scrollbar { width: 8px }');
const both = mk('SEL { scrollbar-width: thin; scrollbar-color: #2E3539 transparent } SEL::-webkit-scrollbar { width: 8px }');
const standardOnly = mk('SEL { scrollbar-width: thin; scrollbar-color: #2E3539 transparent }');

({ bare, webkitOnly, both, standardOnly, ua: (navigator.userAgent.match(/Chrome\/\d+/) || [])[0] });
```

- [x] **Step 3: Baca hasilnya dan pilih bentuk CSS-nya**

- `both === 8` → keduanya bisa hidup berdampingan. **Tulis polos, tanpa
  `@supports`.** Spec dikoreksi di Task 4.
- `both !== 8` tapi `webkitOnly === 8` → dugaan spec benar. **Properti standar
  dibungkus `@supports not selector(::-webkit-scrollbar)`.**
- `webkitOnly !== 8` juga → `::-webkit-scrollbar` tidak berlaku sama sekali di
  peramban ini. Berhenti, laporkan angkanya, tanya Utsman sebelum lanjut.

Catat keempat angkanya. Angka ini yang dikutip di Task 4 waktu memperbarui spec
dan PROGRESS — jangan mengarang, jangan membulatkan.

- [x] **Step 4: Tidak ada commit**

Task ini tidak mengubah berkas.

---

### Task 2: Blok gelap

**Files:**
- Modify: `src/app/globals.css`

- [x] **Step 1: Tulis bloknya**

Sisipkan tepat **sebelum** komentar `/* Selection */` di `src/app/globals.css`.
Bentuk di bawah ini untuk kasus **`@supports` diperlukan** (Task 1 cabang kedua).
Kalau Task 1 menjawab `both === 8`, buang baris `@supports not selector(...)`
beserta kurung penutupnya dan biarkan isinya di tingkat atas.

```css
/* Scrollbar. Yang bawaan Windows adalah satu-satunya elemen di layar yang tidak
   mengikuti palet dan satu-satunya yang punya sudut membulat.
   Sengaja samar: thumb #2E3539 di atas ground #161A1D berkontras 1.4:1, dan
   memang tidak dimaksudkan terbaca sampai kursor mendekat. Ia indikator posisi,
   bukan kontrol — menggulir tetap lewat roda, keyboard dan sentuh.
   180ms adalah laju warna yang dipakai seluruh cangkang; aturan
   prefers-reduced-motion di bawah memangkasnya tanpa tambahan apa pun. */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

/* Tombol panah di kedua ujung batang. Bagian paling ribut dari scrollbar
   Windows, dan tidak ada padanannya di desain ini. */
::-webkit-scrollbar-button {
  display: none;
}

::-webkit-scrollbar-corner {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: var(--color-rule);
  border-radius: 0;
  transition: background-color 180ms;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-muted-deep);
}

/* Firefox tidak mengenal ::-webkit-scrollbar sama sekali. Ia tidak punya hover
   dan tidak menerima lebar dalam piksel, jadi ia dapat versi yang lebih kasar
   dari hal yang sama. */
@supports not selector(::-webkit-scrollbar) {
  * {
    scrollbar-width: thin;
    scrollbar-color: var(--color-rule) transparent;
  }
}
```

- [x] **Step 2: Minta Utsman membuang cache dan menjalankan ulang server**

Ctrl+C di terminal server, lalu `Remove-Item -Recurse -Force .next`, lalu
`npm run dev`. Tunggu sampai Utsman bilang server sudah hidup. Jangan
menjalankan server sendiri.

- [x] **Step 3: Ukur rail log dan panel kanan**

Emulasi 1280×800, `navigate` ke `http://localhost:3000/sistem`, lalu:

```js
await new Promise(r => setTimeout(r, 600));
const probe = (label, el) => el && ({
  label,
  barWidth: el.offsetWidth - el.clientWidth,
  scrollable: el.scrollHeight > el.clientHeight,
});
const rail = document.querySelector('[data-testid="shell"] ul');
const panel = document.querySelector('aside');
[probe('rail', rail), probe('panel', panel)].filter(Boolean);
```

Expected: `barWidth` **8** di tiap pane yang `scrollable: true`. Pane yang
`scrollable: false` melaporkan `barWidth: 0` — itu benar, bukan kegagalan; catat
mana yang mana.

- [x] **Step 4: Ukur pane tabel datar**

```js
const wait = ms => new Promise(r => setTimeout(r, ms));
const byText = t => [...document.querySelectorAll('button')].find(b => b.textContent.trim() === t);
(byText('DATAR') || byText('FLAT')).click();
await wait(600);
const flat = document.querySelector('[data-testid="flat-table"]');
({ barWidth: flat.offsetWidth - flat.clientWidth, scrollable: flat.scrollHeight > flat.clientHeight });
```

Expected: `barWidth` **8** kalau `scrollable: true`.

- [x] **Step 5: Ukur jendela halaman baca**

`navigate` ke `http://localhost:3000/kerja/hris-nirwana`, lalu:

```js
await new Promise(r => setTimeout(r, 600));
({
  barWidth: window.innerWidth - document.documentElement.clientWidth,
  scrollable: document.documentElement.scrollHeight > window.innerHeight,
  rule: getComputedStyle(document.documentElement).getPropertyValue('--color-rule').trim(),
});
```

Expected: `barWidth` **8**, `scrollable: true`, `rule` **#2E3539**.

- [x] **Step 6: Commit**

```bash
git add src/app/globals.css
git commit -m "style(scrollbar): give the dark layer a scrollbar that matches it

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 3: Blok kertas

**Files:**
- Modify: `src/app/globals.css`

- [x] **Step 1: Tulis bloknya**

Sisipkan **tepat di bawah** blok gelap dari Task 2. Selektornya mengikuti pola
yang sudah dipakai berkas ini untuk warna latar: elemen `html` tidak ikut berubah
lewat `body` saja, dan itu sudah pernah menyebabkan ground gelap membayang di
bawah dokumen pendek.

```css
/* Lapis kertas. Warna yang sama perannya, dari palet kertas. */
html:has(.paper-doc) ::-webkit-scrollbar-thumb,
body:has(.paper-doc) ::-webkit-scrollbar-thumb,
.paper-doc ::-webkit-scrollbar-thumb {
  background: var(--color-paper-rule);
}

html:has(.paper-doc) ::-webkit-scrollbar-thumb:hover,
body:has(.paper-doc) ::-webkit-scrollbar-thumb:hover,
.paper-doc ::-webkit-scrollbar-thumb:hover {
  background: var(--color-paper-rule-edge);
}

@supports not selector(::-webkit-scrollbar) {
  html:has(.paper-doc),
  html:has(.paper-doc) * {
    scrollbar-color: var(--color-paper-rule) transparent;
  }
}
```

Kalau Task 1 menjawab `both === 8`, buang `@supports not selector(...)` beserta
kurung penutupnya di sini juga, persis seperti di Task 2.

- [x] **Step 2: Minta Utsman membuang cache dan menjalankan ulang server lagi**

Ctrl+C, `Remove-Item -Recurse -Force .next`, `npm run dev`. Tunggu konfirmasi.

- [x] **Step 3: Ukur dokumen kertas**

`resize_window` `{ width: 375, height: 812 }`, `navigate` ke
`http://localhost:3000/`, lalu:

```js
await new Promise(r => setTimeout(r, 600));
const root = document.documentElement;
({
  w: innerWidth,
  paper: !!document.querySelector('.paper-doc'),
  barWidth: window.innerWidth - root.clientWidth,
  scrollable: root.scrollHeight > window.innerHeight,
  paperRule: getComputedStyle(root).getPropertyValue('--color-paper-rule').trim(),
});
```

Expected: `paper: true`, `paperRule` **#D9D0BC**.

**Catatan jujur soal langkah ini:** di lebar 375 sebagian peramban menggambar
scrollbar melayang di luar jangkauan CSS, jadi `barWidth` bisa saja **0** walau
aturannya benar-benar terpasang. Itu bukan kegagalan. Yang membuktikan aturannya
sampai adalah langkah berikutnya.

- [x] **Step 4: Buktikan aturan kertas menang atas aturan gelap**

Masih di halaman yang sama. Ini yang memisahkan "aturannya terpasang" dari
"aturannya kebetulan tidak kelihatan":

```js
const doc = document.querySelector('.paper-doc');
const el = document.createElement('div');
el.style.cssText = 'width:100px;height:100px;overflow-y:scroll;';
el.innerHTML = '<div style="height:400px"></div>';
doc.appendChild(el);
const barWidth = el.offsetWidth - el.clientWidth;
const standard = getComputedStyle(el).scrollbarColor;
el.remove();
({ barWidth, standard });
```

Expected: `barWidth` **8** di Chrome. `standard` akan berbunyi `auto` kalau
properti standar dibungkus `@supports` — itu benar dan diharapkan, karena Chrome
sengaja tidak diberi properti standar.

Kalau `barWidth` bukan 8 di sini, aturan kertas tidak sampai. Laporkan, jangan
ditambal dengan `!important`.

- [x] **Step 5: Kembalikan viewport**

`resize_window` `{ preset: "desktop" }`, supaya sesi berikutnya tidak mewarisi
emulasi.

- [x] **Step 6: Test dan lint tetap harus hijau**

```bash
npx vitest run
```

Expected: 145 hijau, 22 berkas — tidak berubah, karena tidak ada test unit yang
ditambahkan dan tidak ada JavaScript yang disentuh.

```bash
npx eslint src --max-warnings=0
```

Expected: bersih.

- [x] **Step 7: Commit**

```bash
git add src/app/globals.css
git commit -m "style(scrollbar): give the paper layer its own thumb colours

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 4: Catatan

**Files:**
- Modify: `docs/superpowers/specs/2026-09-09-gaya-scrollbar-design.md`
- Modify: `docs/PROGRESS.md`

- [x] **Step 1: Koreksi spec dengan angka Task 1**

Bagian **Risiko** di spec menulis perilaku Chrome sebagai fakta, padahal waktu
ditulis itu belum diukur. Ganti dengan hasil Task 1 yang sebenarnya, sebutkan
versi Chrome dari `navigator.userAgent`, dan sebutkan bentuk CSS mana yang
akhirnya dipakai — dengan atau tanpa `@supports`.

- [x] **Step 2: Perbarui `docs/PROGRESS.md`**

Tiga tempat:

1. **"Antrean berikutnya, urut"** — buang nomor 1 (gaya scrollbar), naikkan nomor
   2–6 jadi 1–5.
2. **"Keputusan yang mahal kalau dilupakan"** — satu butir baru: scrollbar 8px,
   thumb `--color-rule` → `--color-muted-deep` saat hover, kertas
   `--color-paper-rule` → `--color-paper-rule-edge`, kontras diam 1.4:1 memang
   disengaja, dan jalan mundurnya menaikkan warna diam ke `--color-muted-deep`.
3. **"Pelajaran yang mahal"**, bagian *Tentang alat browser* — apa yang
   sebenarnya terjadi antara `scrollbar-color` dan `::-webkit-scrollbar` di
   Chrome, dengan angka dari Task 1.

Jangan menaikkan atau menurunkan jumlah test di PROGRESS: rencana ini tidak
menambah test. Angkanya tetap **145 hijau, 22 berkas** kecuali `npx vitest run`
di Task 3 Step 6 mengatakan lain — kalau begitu, tulis yang dikatakannya.

- [x] **Step 3: Commit**

```bash
git add docs
git commit -m "docs: record what the scrollbar work settled

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```
