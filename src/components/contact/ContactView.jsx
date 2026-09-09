"use client";

import { meta } from '@/lib/data/meta';
import { useLocale } from '@/lib/hooks/useLocale';
import PaperHeader from '@/components/work/PaperHeader';
import FadeIn from '@/components/ui/FadeIn';

const COPY = {
  heading: { id: 'Kontak', en: 'Contact' },
  // Tidak diterjemahkan, dengan sengaja: ini istilah yang dicari pembacanya
  // apa adanya, sama seperti GITHUB dan CV.PDF di StatusBar.
  status: 'OPEN TO WORK',
  // Menggantikan "Terbuka untuk kerja sama", yang tidak menjawab satu pun
  // pertanyaan yang dibawa pembacanya: penuh waktu atau lepas, dan di mana.
  intro: {
    id: 'Terbuka untuk kerja penuh waktu maupun project lepas, remote atau di lokasi mana pun.',
    en: 'Open to full-time roles and freelance projects, remote or on site anywhere.',
  },
  cv: { id: 'Unduh CV (PDF)', en: 'Download CV (PDF)' },
};

export default function ContactView() {
  const { locale } = useLocale();
  const rows = [
    { label: 'Email', value: meta.email, href: `mailto:${meta.email}` },
    { label: 'WhatsApp', value: meta.whatsapp, href: meta.whatsappLink },
    { label: 'GitHub', value: meta.githubHandle, href: meta.github },
    { label: 'Instagram', value: meta.instagramHandle, href: meta.instagram },
  ];

  return (
    <div className="max-w-2xl mx-auto px-5 pb-20">
      <PaperHeader locale={locale} />
      <FadeIn as="main">
        <h1 className="font-display text-4xl font-extrabold tracking-[-.035em] mb-4">{COPY.heading[locale]}</h1>
        {/* Lencana dulu, kalimat sesudahnya: yang satu tertangkap tanpa
            dibaca, yang lain menyimpan faktanya. Amber di atas ground 5.33:1,
            sama seperti lencana akses publik. */}
        <span className="inline-block font-mono text-[10px] uppercase tracking-wider border border-amber text-amber px-2 py-1 mb-4">
          {COPY.status}
        </span>
        <p className="text-base leading-relaxed text-body-soft mb-10">{COPY.intro[locale]}</p>

        <dl className="flex flex-col">
          {rows.map((r) => (
            <div key={r.label} className="flex justify-between gap-6 border-t border-rule py-4">
              <dt className="font-mono text-[11px] uppercase tracking-wider text-muted">
                {r.label}
              </dt>
              <dd>
                <a
                  href={r.href}
                  target={r.href.startsWith('http') ? '_blank' : undefined}
                  rel={r.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="text-sm hover:text-amber transition-colors duration-500"
                >
                  {r.value}
                </a>
              </dd>
            </div>
          ))}
        </dl>

        <a
          href={meta.cvFile}
          download
          className="inline-block font-mono text-xs border border-amber text-amber px-4 py-2 mt-10 hover:bg-amber hover:text-ground transition-colors duration-500"
        >
          {COPY.cv[locale]}
        </a>
      </FadeIn>
    </div>
  );
}
