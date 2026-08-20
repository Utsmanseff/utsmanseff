"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AccessBadge from '@/components/work/AccessBadge';
import { OTHERS_NODE } from '@/lib/data/canvas';

const COPY = {
  open: { id: 'Buka halaman', en: 'Open page' },
  visit: { id: 'Coba langsung ↗', en: 'Try it live ↗' },
  close: { id: 'Tutup panel', en: 'Close panel' },
  others: { id: 'Project lain', en: 'Other work' },
  back: { id: '← Project lain', en: '← Other work' },
};

const FADE_MS = 700;

export default function PreviewPanel({
  project, group, locale, onClose, onOpenOther, onBack,
}) {
  // Either a project preview or the list behind the "other work" node. One
  // panel for both: it is the same surface in the same place, and giving the
  // list its own component would duplicate the fade contract.
  const content = project ?? (group ? { list: group } : null);

  // The panel has to stay mounted to fade. `rendered` outlives `content` by one
  // fade so closing eases out too; `shown` drives the opacity either way.
  const [rendered, setRendered] = useState(content);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (content) {
      setRendered(content);
      // One frame at opacity 0 first, or the browser has nothing to animate from.
      const frame = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(frame);
    }
    setShown(false);
    const timer = setTimeout(() => setRendered(null), FADE_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project, group]);

  const isOpen = Boolean(content);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!rendered) return null;

  return (
    <aside
      data-panel
      className="fixed right-0 top-0 bottom-0 w-full sm:w-[55%] max-w-xl z-40 bg-ground-soft/95 backdrop-blur text-ground-ink border-l border-ground-rule p-6 overflow-y-auto"
      style={{
        opacity: shown ? 1 : 0,
        // Only while fading out — a closing panel must not swallow canvas clicks.
        pointerEvents: content ? 'auto' : 'none',
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

      {rendered.list ? (
        <>
          <h2 className="font-pixel text-3xl leading-none">{COPY.others[locale]}</h2>
          <p className="text-sm leading-relaxed text-ground-ink/85 mt-3">
            {OTHERS_NODE.note[locale]}
          </p>
          <ul className="mt-6 flex flex-col gap-2">
            {rendered.list.map((p) => (
              <li key={p.slug}>
                <button
                  type="button"
                  onClick={() => onOpenOther?.(p.slug)}
                  className="w-full text-left border border-ground-rule rounded-sm px-4 py-3 hover:border-amber transition-colors duration-500"
                >
                  <span className="block font-mono text-[10px] uppercase tracking-wider text-ground-mute">
                    {p.client} · {p.year}
                  </span>
                  <span className="block text-sm mt-1">{p.title[locale]}</span>
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : (
      <>
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="font-mono text-[11px] text-ground-mute hover:text-amber transition-colors duration-500 mb-4"
        >
          {COPY.back[locale]}
        </button>
      )}
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
      </>
      )}
    </aside>
  );
}
