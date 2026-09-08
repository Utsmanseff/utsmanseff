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

export default function PaperHeader({ locale }) {
  return (
    <header className="flex items-center justify-between py-6">
      <Link
        href="/sistem"
        className="font-mono text-[11px] text-muted hover:text-amber transition-colors duration-500"
      >
        {BACK[locale]}
      </Link>
      <LangSwitcher />
    </header>
  );
}
