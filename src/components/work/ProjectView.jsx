"use client";

import { useEffect } from 'react';

import { useLocale } from '@/lib/hooks/useLocale';
import Tag from '@/components/ui/Tag';
import FadeIn from '@/components/ui/FadeIn';
import AccessBadge from '@/components/work/AccessBadge';
import ScreenshotBlock from '@/components/work/ScreenshotBlock';
import PaperHeader from '@/components/work/PaperHeader';
import WorkFooterNav from '@/components/work/WorkFooterNav';

const COPY = {
  context: { id: '01 KONTEKS', en: '01 CONTEXT' },
  built: { id: '02 YANG DIBANGUN', en: '02 BUILT' },
  stack: { id: '03 STACK', en: '03 STACK' },
  visit: { id: 'Coba langsung ↗', en: 'Try it live ↗' },
  code: { id: 'Lihat kode ↗', en: 'View code ↗' },
};

// Sections are numbered because the page is read as a record, not as an essay.
const SECTION = 'font-mono text-[10px] uppercase tracking-[.12em] text-muted mt-14 mb-4';

export default function ProjectView({ project, prev, next }) {
  const { locale } = useLocale();

  // Tombol kembali browser tidak bisa dicegat handler klik, jadi arah disetel
  // sekali di sini: apa pun yang meninggalkan halaman ini — tautan maupun tombol
  // kembali — mendapat morfnya. Aman disetel saat mount justru karena zoom satu
  // nilai untuk dua arah: ia tidak mengubah apa pun di tengah transisi masuk
  // yang masih berjalan.
  useEffect(() => {
    document.documentElement.dataset.nav = 'zoom';
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-5 pb-20">
      <PaperHeader locale={locale} slug={project.slug} />

      <FadeIn as="article">
        {/* 1 — head. Satu blok, satu nama: ini yang ditumbuhi panel sistem
            waktu dibuka, dan yang menyusut balik jadi panel waktu ditinggalkan. */}
        <div style={{ viewTransitionName: 'sistem-aktif' }}>
          <div className="font-mono text-[11px] uppercase tracking-wider text-muted">
            {project.client} · {project.year} · {project.role[locale]}
          </div>
          <h1 className="font-display text-[28px] sm:text-[44px] leading-[1.15] font-extrabold tracking-[-.035em] mt-3 mb-4">
            {project.title[locale]}
          </h1>
          <AccessBadge access={project.access} locale={locale} />
        </div>

        {/* 2 — context */}
        <h2 className={SECTION}>{COPY.context[locale]}</h2>
        {/* Rata kanan kiri: halaman ini dibaca sebagai catatan kerja, dan
            tepi kanan yang lurus membuatnya terbaca seperti dokumen, bukan
            seperti postingan. */}
        <p className="text-base leading-relaxed text-body-soft text-justify mb-10">
          {project.context[locale]}
        </p>

        {/* 3 — screenshot */}
        <ScreenshotBlock src={project.image} alt={project.title[locale]} locale={locale} />

        {/* 4 — what I built */}
        <h2 className={SECTION}>{COPY.built[locale]}</h2>
        <ul className="flex flex-col gap-2">
          {project.built[locale].map((item) => (
            <li key={item} className="text-sm leading-relaxed text-body-soft text-justify pl-4 border-l border-rule">
              {item}
            </li>
          ))}
        </ul>

        {/* 5 — stack */}
        <h2 className={SECTION}>{COPY.stack[locale]}</h2>
        <div className="flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>

        {/* 6 — foot. Dua tujuan keluar, satu bahasa. Tidak ada sistem yang
            punya keduanya sekarang, tapi bentuknya tidak perlu tahu itu. */}
        <div className="flex flex-wrap gap-3 mt-12">
          {project.access === 'public' && project.site && (
            <a
              href={project.site}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-mono text-xs border border-amber text-amber px-4 py-2 hover:bg-amber hover:text-ground transition-colors duration-500"
            >
              {COPY.visit[locale]}
            </a>
          )}
          {project.repo && (
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-mono text-xs border border-amber text-amber px-4 py-2 hover:bg-amber hover:text-ground transition-colors duration-500"
            >
              {COPY.code[locale]}
            </a>
          )}
        </div>

        <WorkFooterNav prev={prev} next={next} locale={locale} />
      </FadeIn>
    </div>
  );
}
