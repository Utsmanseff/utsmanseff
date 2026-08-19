"use client";

import Link from 'next/link';
import { useLocale } from '@/lib/hooks/useLocale';
import Tag from '@/components/ui/Tag';
import FadeIn from '@/components/ui/FadeIn';
import AccessBadge from '@/components/work/AccessBadge';
import ScreenshotBlock from '@/components/work/ScreenshotBlock';
import PaperHeader from '@/components/work/PaperHeader';
import WorkFooterNav from '@/components/work/WorkFooterNav';

const COPY = {
  built: { id: 'Apa yang saya bangun', en: 'What I built' },
  hard: { id: 'Yang sulit', en: 'The hard part' },
  stack: { id: 'Stack', en: 'Stack' },
  visit: { id: 'Coba langsung ↗', en: 'Try it live ↗' },
  back: { id: 'Kembali ke peta', en: 'Back to the map' },
};

export default function ProjectView({ project, prev, next }) {
  const { locale } = useLocale();

  return (
    <div className="max-w-3xl mx-auto px-5 pb-20">
      <PaperHeader locale={locale} />

      <FadeIn as="article">
        {/* 1 — head */}
        <div className="font-mono text-[11px] uppercase tracking-wider text-mute">
          {project.client} · {project.year} · {project.role[locale]}
        </div>
        <h1 className="font-display text-4xl sm:text-5xl leading-tight mt-3 mb-4">
          {project.title[locale]}
        </h1>
        <AccessBadge access={project.access} locale={locale} />

        {/* 2 — context */}
        <p className="text-base leading-relaxed text-ink/85 mt-8 mb-10">
          {project.context[locale]}
        </p>

        {/* 3 — screenshot */}
        <ScreenshotBlock src={project.image} alt={project.title[locale]} locale={locale} />

        {/* 4 — what I built */}
        <h2 className="font-mono text-[11px] uppercase tracking-wider text-amber-ink mt-14 mb-4">
          {COPY.built[locale]}
        </h2>
        <ul className="flex flex-col gap-2">
          {project.built[locale].map((item) => (
            <li key={item} className="text-sm leading-relaxed text-ink/85 pl-4 border-l border-rule">
              {item}
            </li>
          ))}
        </ul>

        {/* 5 — the hard part */}
        <h2 className="font-mono text-[11px] uppercase tracking-wider text-amber-ink mt-14 mb-4">
          {COPY.hard[locale]}
        </h2>
        <p className="font-display text-lg leading-relaxed italic">{project.hard[locale]}</p>

        {/* 6 — stack */}
        <h2 className="font-mono text-[11px] uppercase tracking-wider text-amber-ink mt-14 mb-4">
          {COPY.stack[locale]}
        </h2>
        <div className="flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>

        {/* 7 — foot */}
        {project.access === 'public' && project.site && (
          <a
            href={project.site}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block font-mono text-xs border border-amber-ink text-amber-ink px-4 py-2
                       rounded-sm mt-12 hover:bg-amber-ink hover:text-paper transition-colors duration-500"
          >
            {COPY.visit[locale]}
          </a>
        )}

        <WorkFooterNav prev={prev} next={next} locale={locale} />

        <Link
          href="/"
          className="inline-block font-mono text-[11px] text-mute mt-10
                     hover:text-amber-ink transition-colors duration-500"
        >
          ← {COPY.back[locale]}
        </Link>
      </FadeIn>
    </div>
  );
}
