"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AccessBadge from '@/components/work/AccessBadge';

const COPY = {
  open: { id: 'Buka halaman', en: 'Open page' },
  visit: { id: 'Coba langsung ↗', en: 'Try it live ↗' },
  close: { id: 'Tutup panel', en: 'Close panel' },
};

const FADE_MS = 700;

export default function PreviewPanel({ project, locale, onClose }) {
  // The panel has to stay mounted to fade. `rendered` outlives `project` by one
  // fade so closing eases out too; `shown` drives the opacity either way.
  const [rendered, setRendered] = useState(project);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (project) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRendered(project);
      // One frame at opacity 0 first, or the browser has nothing to animate from.
      const frame = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(frame);
    }
    setShown(false);
    const timer = setTimeout(() => setRendered(null), FADE_MS);
    return () => clearTimeout(timer);
  }, [project]);

  useEffect(() => {
    if (!project) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [project, onClose]);

  if (!rendered) return null;

  return (
    <aside
      data-panel
      className="fixed right-0 top-0 bottom-0 w-full sm:w-[55%] max-w-xl z-40 bg-ground-soft/95 backdrop-blur text-ground-ink border-l border-ground-rule p-6 overflow-y-auto"
      style={{
        opacity: shown ? 1 : 0,
        // Only while fading out — a closing panel must not swallow canvas clicks.
        pointerEvents: project ? 'auto' : 'none',
        transition: `opacity ${FADE_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`,
      }}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label={COPY.close[locale]}
        className="absolute right-4 top-4 text-ground-mute hover:text-ground-ink transition-colors duration-500 text-xl leading-none"
      >
        ×
      </button>

      <div className="font-mono text-[10px] uppercase tracking-wider text-ground-mute">
        {rendered.client} · {rendered.year}
      </div>
      <h2 className="font-display text-2xl mt-2 mb-3">{rendered.title[locale]}</h2>
      <div className="mb-4">
        <AccessBadge access={rendered.access} locale={locale} tone="ground" />
      </div>

      {rendered.image && (
        <Image
          src={rendered.image}
          alt=""
          width={800}
          height={450}
          className="w-full h-auto rounded border border-ground-rule mb-4"
        />
      )}

      <p className="text-sm leading-relaxed text-ground-ink/85">{rendered.context[locale]}</p>

      <div className="flex flex-wrap gap-3 mt-6">
        {rendered.tier === 'full' && (
          <Link
            href={`/kerja/${rendered.slug}`}
            className="font-mono text-xs border border-amber text-amber px-3 py-2 rounded-sm hover:bg-amber hover:text-ground transition-colors duration-500"
          >
            {COPY.open[locale]}
          </Link>
        )}
        {rendered.access === 'public' && rendered.site && (
          <a
            href={rendered.site}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs border border-ground-rule px-3 py-2 rounded-sm hover:border-amber transition-colors duration-500"
          >
            {COPY.visit[locale]}
          </a>
        )}
      </div>
    </aside>
  );
}
