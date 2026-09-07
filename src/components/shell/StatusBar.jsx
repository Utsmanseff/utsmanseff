"use client";

import { meta } from '@/lib/data/meta';

export default function StatusBar({ locale }) {
  return (
    <div className="h-[34px] bg-ground-deep border-t border-rule px-6 flex items-center justify-between font-mono text-[11px] tracking-[.06em] text-muted">
      <span>UTSMAN · {meta.location[locale].toUpperCase()}</span>
      <span className="flex items-center gap-5">
        <a href={`mailto:${meta.email}`} className="text-amber">{meta.email}</a>
        <span>{meta.whatsapp}</span>
        <a href={meta.github}>GITHUB/{meta.githubHandle.toUpperCase()}</a>
        <a href={meta.cvFile} download>CV.PDF</a>
      </span>
    </div>
  );
}
