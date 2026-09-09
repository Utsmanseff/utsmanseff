"use client";

import Link from 'next/link';
import { meta } from '@/lib/data/meta';
import AccessBadge from '@/components/work/AccessBadge';

const COPY = {
  selected: { id: 'TERPILIH', en: 'SELECTED' },
  stack: { id: 'LAPISAN STACK', en: 'STACK LAYERS' },
  open: { id: 'ENTER → BUKA HALAMAN', en: 'ENTER → OPEN PAGE' },
  noPage: { id: 'RINGKASAN SAJA · TANPA HALAMAN', en: 'SUMMARY ONLY · NO PAGE' },
  name: { id: 'NAMA', en: 'NAME' },
  role: { id: 'PERAN', en: 'ROLE' },
  place: { id: 'LOKASI', en: 'LOCATION' },
  span: { id: 'RENTANG', en: 'SPAN' },
  email: { id: 'EMAIL', en: 'EMAIL' },
};

// Before anything is selected the panel is a record block, not a sentence.
// The portfolio has no headline, and this panel does not smuggle one in.
function Record({ locale, span }) {
  const rows = [
    [COPY.name[locale], meta.name],
    [COPY.role[locale], 'Fullstack Developer'],
    [COPY.place[locale], meta.location[locale]],
    [COPY.span[locale], span],
    [COPY.email[locale], meta.email],
  ];
  return (
    <dl className="grid grid-cols-[92px_1fr] gap-y-2 font-mono text-[12px]">
      {rows.map(([k, v]) => (
        <div key={k} className="contents">
          <dt className="text-muted text-[10px] tracking-[.12em]">{k}</dt>
          {/* min-w-0: a 1fr track floors at its content width, and the email
              pushed the panel into a sideways scroll. */}
          <dd className="m-0 text-ink min-w-0 break-words">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function SelectedPanel({ system, locale, span }) {
  if (!system) {
    return (
      <aside className="bg-surface border-l border-rule p-[18px] overflow-y-auto">
        <Record locale={locale} span={span} />
      </aside>
    );
  }

  return (
    <aside className="bg-surface border-l border-rule grid grid-rows-[1fr_auto] min-h-0">
      <div className="overflow-y-auto min-h-0 p-[18px] flex flex-col gap-3">
        {/* Satu blok, satu nama. Ini yang tumbuh jadi kepala halaman baca, dan
            yang menyusut balik waktu pengunjung kembali. Nama ini TIDAK boleh
            pindah ke Plate: view-transition-name meratakan tumpukan 3D plate
            seluruhnya, dan menulis ulang preserve-3d di atasnya tidak menolong.
            Terukur di Chrome 148 — lihat spec zoom §5.

            Jaraknya diatur di dalam blok ini, karena gap-3 induknya sekarang
            melihat ketiganya sebagai satu anak. */}
        <div className="flex flex-col gap-3" style={{ viewTransitionName: 'sistem-aktif' }}>
          <span className="font-mono text-[10px] tracking-[.12em] text-amber">
            {COPY.selected[locale]}
          </span>
          <h2 className="font-display text-[26px] font-extrabold tracking-[-.03em] text-ink-bright m-0">
            {system.shortName[locale]}
          </h2>
          <span className="font-mono text-[10.5px] text-muted">
            {system.client} · {system.year}
          </span>
        </div>
        <AccessBadge access={system.access} locale={locale} />
        <div className="border-t border-rule" />
        <p className="text-[13.5px] text-body-soft m-0">{system.blurb[locale]}</p>

        <span className="font-mono text-[10px] tracking-[.12em] text-muted mt-2">
          {COPY.stack[locale]}
        </span>
        <ul className="font-mono text-[12px] text-ink flex flex-col gap-1 m-0 p-0 list-none">
          {system.tech.map((t) => <li key={t}>{t}</li>)}
        </ul>
      </div>

      <div className="border-t border-rule px-[18px] py-3">
        {system.tier === 'full' ? (
          <Link
            href={`/kerja/${system.slug}`}
            className="block text-center font-mono text-[11px] border border-amber text-amber py-2"
          >
            {COPY.open[locale]}
          </Link>
        ) : (
          <span className="block text-center font-mono text-[11px] border border-rule text-muted-deep py-2 cursor-default">
            {COPY.noPage[locale]}
          </span>
        )}
      </div>
    </aside>
  );
}
