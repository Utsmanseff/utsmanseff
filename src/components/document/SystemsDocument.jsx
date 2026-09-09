"use client";

import { meta } from '@/lib/data/meta';
import PaperHead from './PaperHead';
import YearGroup from './YearGroup';

const COPY = {
  note: {
    // Tidak menyebut peta isometrik dan konsol. Menamai dua hal yang tidak
    // bisa dibuka dari sini membuat halaman ini terbaca seperti versi yang
    // kurang, padahal isinya memang lengkap.
    id: 'Semua isinya dapat dibaca di sini. Buka di desktop untuk tampilan yang lebih utuh.',
    en: 'Everything is readable here. Open on desktop for the fuller view.',
  },
  cv: { id: 'CV', en: 'CV' },
};

// Deliberately no headline and no reading hint: identity, then the work.
export default function SystemsDocument({ systems, locale, dimmed }) {
  const years = [...new Set(systems.map((s) => s.year))].sort().reverse();

  return (
    <main className="paper-doc min-h-screen flex flex-col px-5 pt-6 pb-24">
      <PaperHead systems={systems} locale={locale} />

      {/* The first YearGroup draws its own rule across the top; a second one in
          PaperHead would sit right against it. This is just the gap. */}
      <div className="mt-7" />

      {years.map((year) => (
        <YearGroup
          key={year}
          year={year}
          systems={systems.filter((s) => s.year === year)}
          locale={locale}
          dimmed={dimmed}
        />
      ))}

      {/* At the foot, not the head: a reader who has already been through the
          work is the one this is useful to. */}
      <p className="font-mono text-[10.5px] text-paper-muted mt-10 mb-0">
        {COPY.note[locale]}
      </p>

      <dl className="grid grid-cols-[64px_1fr] mt-4 font-mono text-[11px]">
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
