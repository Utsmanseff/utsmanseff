"use client";

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AccessBadge from '@/components/work/AccessBadge';

const COPY = {
  open: { id: 'Buka halaman', en: 'Open page' },
  visit: { id: 'Coba langsung ↗', en: 'Try it live ↗' },
  close: { id: 'Tutup panel', en: 'Close panel' },
};

export default function PreviewPanel({ project, locale, onClose }) {
  useEffect(() => {
    if (!project) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [project, onClose]);

  if (!project) return null;

  return (
    <aside
      data-panel
      className="absolute right-0 top-0 bottom-0 w-full sm:w-[55%] max-w-xl z-20
                 bg-ground-soft/95 backdrop-blur text-ground-ink border-l border-ground-rule
                 p-6 overflow-y-auto"
      style={{ transition: 'opacity 700ms cubic-bezier(0.22, 1, 0.36, 1)' }}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label={COPY.close[locale]}
        className="absolute right-4 top-4 text-ground-mute hover:text-ground-ink
                   transition-colors duration-500 text-xl leading-none"
      >
        ×
      </button>

      <div className="font-mono text-[10px] uppercase tracking-wider text-ground-mute">
        {project.client} · {project.year}
      </div>
      <h2 className="font-display text-2xl mt-2 mb-3">{project.title[locale]}</h2>
      <div className="mb-4">
        <AccessBadge access={project.access} locale={locale} tone="ground" />
      </div>

      {project.image && (
        <Image
          src={project.image}
          alt=""
          width={800}
          height={450}
          className="w-full h-auto rounded border border-ground-rule mb-4"
        />
      )}

      <p className="text-sm leading-relaxed text-ground-ink/85">{project.context[locale]}</p>

      <div className="flex flex-wrap gap-3 mt-6">
        {project.tier === 'full' && (
          <Link
            href={`/kerja/${project.slug}`}
            className="font-mono text-xs border border-amber text-amber px-3 py-2 rounded-sm
                       hover:bg-amber hover:text-ground transition-colors duration-500"
          >
            {COPY.open[locale]}
          </Link>
        )}
        {project.access === 'public' && project.site && (
          <a
            href={project.site}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs border border-ground-rule px-3 py-2 rounded-sm
                       hover:border-amber transition-colors duration-500"
          >
            {COPY.visit[locale]}
          </a>
        )}
      </div>
    </aside>
  );
}
