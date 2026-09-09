import Link from 'next/link';

const COPY = {
  prev: { id: 'Sebelumnya', en: 'Previous' },
  next: { id: 'Berikutnya', en: 'Next' },
};

// Halaman baca menyetel data-nav="zoom" waktu mount supaya tombol kembali ikut
// dapat morfnya. Lompat ke sistem lain bukan kembali — dua sistem berbeda yang
// saling memorf menyiratkan hubungan yang tidak ada — jadi arah itu dilepas dan
// navigasinya memotong seperti pintu lain.
const cut = () => { delete document.documentElement.dataset.nav; };

export default function WorkFooterNav({ prev, next, locale }) {
  return (
    <nav className="flex justify-between gap-6 border-t border-rule pt-8 mt-16">
      <div>
        {prev && (
          <Link href={`/kerja/${prev.slug}`} onClick={cut} className="group block">
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
              {COPY.prev[locale]}
            </span>
            <span className="block font-display text-lg group-hover:text-amber transition-colors duration-500">
              {prev.shortName[locale]}
            </span>
          </Link>
        )}
      </div>
      <div className="text-right">
        {next && (
          <Link href={`/kerja/${next.slug}`} onClick={cut} className="group block">
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
              {COPY.next[locale]}
            </span>
            <span className="block font-display text-lg group-hover:text-amber transition-colors duration-500">
              {next.shortName[locale]}
            </span>
          </Link>
        )}
      </div>
    </nav>
  );
}
