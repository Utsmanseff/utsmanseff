"use client";

import { meta } from '@/lib/data/meta';
import LangSwitcher from '@/components/nav/LangSwitcher';
import YearGroup from './YearGroup';

const COPY = {
  head: { id: 'UTSMAN · FULLSTACK', en: 'UTSMAN · FULLSTACK' },
  note: {
    id: 'Buka di desktop untuk peta isometrik dan konsolnya. Semuanya juga bisa dibaca di sini.',
    en: 'Open on desktop for the isometric map and console. Everything is readable here too.',
  },
  cv: { id: 'CV', en: 'CV' },
};

// Deliberately no headline and no reading hint: identity, then the work.
export default function SystemsDocument({ systems, locale, dimmed }) {
  const years = [...new Set(systems.map((s) => s.year))].sort().reverse();

  return (
    <main className="paper-doc min-h-screen flex flex-col px-5 pt-6 pb-24">
      <div className="flex items-center justify-between font-mono text-[10.5px] text-paper-muted">
        <span>{COPY.head[locale]}</span>
        <LangSwitcher />
      </div>
      <div className="border-t border-paper-ink mt-3" />

      <p className="font-mono text-[11px] text-paper-muted mt-4 mb-6">
        {meta.location[locale]}
      </p>

      {years.map((year) => (
        <YearGroup
          key={year}
          year={year}
          systems={systems.filter((s) => s.year === year)}
          locale={locale}
          dimmed={dimmed}
        />
      ))}

      <dl className="grid grid-cols-[64px_1fr] mt-10 font-mono text-[11px]">
        {[
          ['EMAIL', meta.email, `mailto:${meta.email}`],
          ['WA', meta.whatsapp, meta.whatsappLink],
          ['GITHUB', meta.githubHandle, meta.github],
          [COPY.cv[locale], 'PDF', meta.cvFile],
        ].map(([label, value, href]) => (
          <div key={label} className="contents">
            <dt className="border-t border-paper-rule-soft py-3 text-paper-muted">{label}</dt>
            <dd className="border-t border-paper-rule-soft py-3 m-0">
              <a href={href} className="text-amber-ink">{value}</a>
            </dd>
          </div>
        ))}
      </dl>
    </main>
  );
}
