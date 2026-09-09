"use client";

import Link from 'next/link';
import AccessTick from '@/components/document/AccessTick';

// One year and the systems that shipped in it. The left cell is empty on
// purpose: it is the spine, and the rule down its right edge is the axis.
export default function YearGroup({ year, systems, locale, dimmed }) {
  return (
    <section data-year={year} className="grid grid-cols-[52px_1fr]">
      <h2 className="col-span-2 font-mono text-xs font-bold text-paper-rule-edge border-t border-paper-ink pt-3 pb-1.5">
        {year}
      </h2>

      {systems.map((s) => {
        const dim = dimmed?.has(s.slug);
        const body = (
          <span className="grid grid-cols-[1fr_auto] items-center gap-3 w-full">
            <span>
              <span className="block text-[14.5px] font-semibold text-paper-ink">
                {s.shortName[locale]}
              </span>
              <span className="block font-mono text-[10px] text-paper-muted mt-0.5">
                {s.client} · {s.year}
              </span>
            </span>
            <AccessTick access={s.access} locale={locale} />
          </span>
        );

        return (
          <div key={s.slug} className="contents">
            <div className="border-r border-paper-rule" />
            {/* Tautan repo berdiri BERSAUDARA dengan tautan halaman baca, tidak
                di dalamnya: <a> di dalam <a> itu HTML tidak sah. min-w-0 karena
                1fr punya min-width auto, dan nama panjang akan menahan baris
                jadi menggulir ke samping. */}
            <div
              className="border-b border-paper-rule-soft py-[11px] pl-3.5 min-h-11 transition-opacity duration-700 flex items-center gap-3"
              style={{ opacity: dim ? 0.4 : 1 }}
            >
              <div className="flex-1 min-w-0">
                {s.tier === 'full' ? (
                  <Link href={`/kerja/${s.slug}`} className="block" aria-label={s.shortName[locale]}>
                    {body}
                  </Link>
                ) : body}
              </div>
              {s.repo && (
                <a
                  href={s.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 font-mono text-[9px] uppercase tracking-wide text-amber-ink px-2 py-3 -my-1"
                >
                  KODE ↗
                </a>
              )}
            </div>
          </div>
        );
      })}
    </section>
  );
}
