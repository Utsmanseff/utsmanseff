"use client";

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { X, ArrowUpRight } from 'lucide-react';
import { useLocale } from '@/lib/hooks/useLocale';

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

export default function CaseStudyModal({ project, open, onClose }) {
  const { locale, t } = useLocale();
  const dialogRef = useRef(null);
  const closeBtnRef = useRef(null);

  // Lock body scroll + close on Esc + autofocus close button
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);

    // Defer focus until after enter animation begins
    const focusTimer = setTimeout(() => closeBtnRef.current?.focus(), 50);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
      clearTimeout(focusTimer);
    };
  }, [open, onClose]);

  if (!project) return null;

  const localized = (field) =>
    typeof field === 'string' ? field : field?.[locale];

  const statusLabel =
    project.status === 'live' ? t('work.eyebrowLive') : t('work.eyebrowInternal');

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={`modal-title-${project.id}`}
      className="fixed inset-0 z-[100]"
      style={{
        pointerEvents: open ? 'auto' : 'none',
      }}
    >
      {/* Backdrop */}
      <button
        type="button"
        tabIndex={-1}
        aria-label={t('work.closeDetail')}
        onClick={onClose}
        className="absolute inset-0 w-full h-full bg-forest-deep/60 backdrop-blur-sm transition-opacity"
        style={{
          opacity: open ? 1 : 0,
          transitionDuration: '300ms',
          transitionTimingFunction: EASE,
        }}
      />

      {/* Panel */}
      <div
        ref={dialogRef}
        className="absolute inset-x-0 bottom-0 md:inset-0 md:flex md:items-center md:justify-center md:p-8"
        style={{
          opacity: open ? 1 : 0,
          transform: open
            ? 'translateY(0) scale(1)'
            : 'translateY(40px) scale(0.97)',
          transition: `opacity 400ms ${EASE}, transform 400ms ${EASE}`,
        }}
      >
        <div className="bg-cream dark:bg-forest-deep rounded-t-2xl md:rounded-2xl md:max-w-5xl w-full max-h-[92vh] md:max-h-[88vh] overflow-y-auto shadow-2xl border border-rule">
          {/* Sticky close header */}
          <div className="sticky top-0 z-10 flex items-center justify-between px-6 md:px-10 py-4 bg-cream/90 dark:bg-forest-deep/90 backdrop-blur border-b border-rule">
            <p className="font-mono text-[10px] uppercase tracking-widest text-mute">
              {project.client} · {project.year} · {statusLabel}
            </p>
            <button
              ref={closeBtnRef}
              type="button"
              onClick={onClose}
              aria-label={t('work.closeDetail')}
              className="group p-2 -mr-2 text-mute hover:text-forest dark:hover:text-cream transition-colors duration-200"
            >
              <span className="inline-block transition-transform duration-300 ease-out group-hover:rotate-90">
                <X size={20} />
              </span>
            </button>
          </div>

          <div className="px-6 md:px-10 py-8 md:py-12">
            {/* Title block */}
            <h3
              id={`modal-title-${project.id}`}
              className="font-display text-3xl md:text-5xl font-semibold text-forest dark:text-cream leading-[1.05] tracking-tight max-w-3xl"
            >
              {localized(project.title)}
            </h3>
            <p className="mt-4 text-lg md:text-xl text-mute max-w-3xl leading-relaxed">
              {localized(project.summary)}
            </p>

            {/* Image */}
            <div className="mt-8 bg-cream-deep dark:bg-forest rounded-md overflow-hidden border border-rule">
              <Image
                src={project.image}
                alt={localized(project.title)}
                width={1600}
                height={900}
                sizes="(min-width: 768px) 80vw, 100vw"
                className="w-full h-auto object-contain"
              />
            </div>

            {/* Detail sections */}
            <div className="mt-12 grid md:grid-cols-2 gap-x-12 gap-y-10">
              <Section label={t('work.problem')}>
                <p className="text-justify hyphens-auto">{localized(project.problem)}</p>
              </Section>
              <Section label={t('work.approach')}>
                <p className="text-justify hyphens-auto">{localized(project.approach)}</p>
                {project.approach?.bullets && (
                  <ul className="mt-4 space-y-2">
                    {(project.approach.bullets[locale] || []).map((b, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-mute">
                        <span className="text-amber mt-1 leading-none">›</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </Section>
              <Section label={t('work.outcome')}>
                <p className="text-justify hyphens-auto">{localized(project.outcome)}</p>
              </Section>
              <Section label={t('work.hard')} accent>
                <p className="font-display italic text-lg md:text-xl leading-snug text-forest dark:text-cream">
                  {localized(project.hard)}
                </p>
              </Section>
            </div>

            {/* Footer: tech + visit */}
            <div className="mt-12 pt-8 border-t border-rule flex flex-wrap items-center gap-3">
              {project.tech.map((tech) => (
                <span
                  key={tech}
                  className="font-mono text-[10px] uppercase tracking-widest text-mute border border-rule px-2.5 py-1 rounded-sm transition-colors duration-200 hover:border-amber hover:text-amber"
                >
                  {tech}
                </span>
              ))}
              {project.site && (
                <a
                  href={project.site}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group ml-auto inline-flex items-center gap-1.5 text-sm font-semibold text-amber transition-colors duration-200 hover:text-forest dark:hover:text-cream"
                >
                  <span>{t('work.visit')}</span>
                  <ArrowUpRight
                    size={16}
                    className="transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ label, accent = false, children }) {
  return (
    <div>
      <h4
        className={`font-mono text-[10px] uppercase tracking-[0.2em] mb-3 ${
          accent ? 'text-amber' : 'text-mute'
        }`}
      >
        {label}
      </h4>
      <div className="text-forest dark:text-cream leading-relaxed">{children}</div>
    </div>
  );
}
