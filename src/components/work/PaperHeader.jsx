"use client";

import Link from 'next/link';
import LangSwitcher from '@/components/nav/LangSwitcher';

// The only way back, and the only in-site link on the contact page. The foot
// used to carry a second link to the same place; two links with the same
// accessible name and destination is noise for anyone navigating by link list,
// so the head keeps it and the foot dropped it.
//
// It points at /sistem, not /. Since the gate moved onto `/`, a link that says
// "all systems" and lands on a name with two buttons is a promise it does not
// keep. Below 1024px /sistem renders the same paper document /, so the label
// stays true at every width.
const BACK = { id: '← SEMUA SISTEM', en: '← ALL SYSTEMS' };

export default function PaperHeader({ locale, slug }) {
  // Halaman baca tahu slug-nya sendiri, jadi tautan ini bisa mengembalikan
  // pengunjung ke peta dengan sistem itu terpilih — dan panel terpilih itulah
  // yang membawa nama transisinya, jadi ada yang dimorf balik.
  //
  // Sudut kamera TIDAK ikut: halaman baca tidak tahu sudut yang ditinggalkan,
  // dan menaruhnya di URL /kerja/* akan mengotori halaman yang punya canonical
  // dan metadata sendiri. Tombol kembali browser yang memulihkan keduanya.
  //
  // URLSearchParams, bukan disambung sendiri: slug beraksara `&` akan memotong
  // query jadi dua.
  const href = slug ? `/sistem?${new URLSearchParams({ pilih: slug })}` : '/sistem';

  return (
    <header className="flex items-center justify-between py-6">
      <Link
        href={href}
        className="font-mono text-[11px] text-muted hover:text-amber transition-colors duration-500"
      >
        {BACK[locale]}
      </Link>
      <LangSwitcher />
    </header>
  );
}
