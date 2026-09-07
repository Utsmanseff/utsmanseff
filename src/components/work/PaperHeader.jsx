"use client";

import Link from 'next/link';
import LangSwitcher from '@/components/nav/LangSwitcher';

// The only way back. The foot used to carry a second link to the same place;
// two links with the same accessible name and destination is noise for anyone
// navigating by link list, so the head keeps it and the foot dropped it.
const BACK = { id: '← SEMUA SISTEM', en: '← ALL SYSTEMS' };

export default function PaperHeader({ locale }) {
  return (
    <header className="flex items-center justify-between py-6">
      <Link
        href="/"
        className="font-mono text-[11px] text-muted hover:text-amber transition-colors duration-500"
      >
        {BACK[locale]}
      </Link>
      <LangSwitcher />
    </header>
  );
}
