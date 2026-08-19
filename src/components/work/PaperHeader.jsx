"use client";

import Link from 'next/link';
import LangSwitcher from '@/components/nav/LangSwitcher';

// Short label on purpose. The foot carries the full "Kembali ke peta" link;
// two links with the same accessible name and destination is noise for anyone
// navigating by link list.
const BACK = { id: 'Peta', en: 'The map' };

export default function PaperHeader({ locale }) {
  return (
    <header className="flex items-center justify-between py-6">
      <Link
        href="/"
        className="font-mono text-[11px] text-mute hover:text-amber-ink transition-colors duration-500"
      >
        ← {BACK[locale]}
      </Link>
      <LangSwitcher />
    </header>
  );
}
