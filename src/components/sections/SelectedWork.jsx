"use client";

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { useLocale } from '@/lib/hooks/useLocale';
import { projects } from '@/lib/data/projects';
import SectionTitle from '@/components/ui/SectionTitle';
import CaseStudyModal from './CaseStudyModal';

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

export default function SelectedWork() {
  const { locale, t } = useLocale();
  const featured = projects.featured;
  const [active, setActive] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const tabsRef = useRef(null);

  const localized = (field) =>
    typeof field === 'string' ? field : field?.[locale];

  const project = featured[active];

  const goto = (i) => {
    const next = ((i % featured.length) + featured.length) % featured.length;
    setActive(next);
  };
  const prev = () => goto(active - 1);
  const next = () => goto(active + 1);

  // Keyboard navigation when tablist is focused (or anywhere when section visible)
  useEffect(() => {
    if (modalOpen) return;
    const onKey = (e) => {
      if (e.target.closest('input, textarea, button, a')) {
        // only allow arrow nav if no other interactive element handling
        // skip if focus is on a button/link other than the section tabs
        const inTabs = tabsRef.current?.contains(e.target);
        if (!inTabs) return;
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        next();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, modalOpen]);

  return (
    <section
      id="work"
      className="relative py-24 md:py-32 px-6 border-t border-rule bg-cream-deep/40 dark:bg-forest/30"
    >
      {/* Decorative number watermark */}
      <div
        aria-hidden
        className="pointer-events-none select-none absolute right-4 md:right-12 top-20 md:top-28 font-display font-black text-[20vw] md:text-[14rem] leading-none text-amber/[0.06] dark:text-amber/[0.08] transition-all duration-700"
        style={{ transitionTimingFunction: EASE }}
      >
        {String(active + 1).padStart(2, '0')}
      </div>

      <div className="relative max-w-6xl mx-auto">
        <SectionTitle eyebrow={t('work.title')} id="work-title">
          {locale === 'id' ? 'Tiga project, satu fokus.' : 'Three projects, one focus.'}
        </SectionTitle>

        {/* Tab strip */}
        <div
          ref={tabsRef}
          role="tablist"
          aria-label={t('work.title')}
          className="grid grid-cols-3 gap-2 md:gap-6 border-b border-rule mb-12"
        >
          {featured.map((p, i) => {
            const isActive = i === active;
            return (
              <button
                key={p.id}
                role="tab"
                aria-selected={isActive}
                aria-controls={`work-panel-${p.id}`}
                onClick={() => setActive(i)}
                className="group relative text-left pb-4 pt-2 transition-colors duration-200"
              >
                <span
                  className={`font-mono text-[10px] md:text-xs uppercase tracking-widest transition-colors duration-200 ${
                    isActive ? 'text-amber' : 'text-mute group-hover:text-forest dark:group-hover:text-cream'
                  }`}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div
                  className={`mt-1.5 font-display text-base md:text-2xl font-semibold leading-tight transition-colors duration-200 ${
                    isActive
                      ? 'text-forest dark:text-cream'
                      : 'text-mute group-hover:text-forest dark:group-hover:text-cream'
                  }`}
                >
                  {localized(p.shortName)}
                </div>
                {/* Active indicator */}
                <span
                  aria-hidden
                  className="absolute left-0 -bottom-px h-0.5 bg-amber transition-all duration-500"
                  style={{
                    width: isActive ? '100%' : '0%',
                    transitionTimingFunction: EASE,
                  }}
                />
              </button>
            );
          })}
        </div>

        {/* Card area — keyed so React remounts (drives entry animation) */}
        <div
          key={project.id}
          id={`work-panel-${project.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${project.id}`}
          className="grid md:grid-cols-12 gap-8 md:gap-12 items-start"
          style={{
            animation: `work-enter 600ms ${EASE} both`,
          }}
        >
          {/* Image */}
          <div className="md:col-span-7 order-1">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              aria-label={`${t('work.detail')}: ${localized(project.title)}`}
              className="group block w-full text-left rounded-md overflow-hidden border border-rule bg-cream-deep dark:bg-forest relative aspect-[16/10]"
            >
              <Image
                src={project.image}
                alt={localized(project.title)}
                fill
                sizes="(min-width: 768px) 60vw, 100vw"
                className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
              />
              {/* Gradient overlay reveal */}
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-forest-deep/70 via-forest-deep/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />
              <div
                aria-hidden
                className="absolute bottom-4 right-4 inline-flex items-center gap-2 text-cream font-mono text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500"
                style={{ transitionTimingFunction: EASE }}
              >
                <span>{t('work.detail')}</span>
                <ArrowUpRight size={14} />
              </div>
            </button>
          </div>

          {/* Info */}
          <div className="md:col-span-5 order-2 md:pt-2">
            <p className="font-mono text-[10px] md:text-xs uppercase tracking-widest text-mute mb-3">
              {project.client} · {project.year} ·{' '}
              <span className="text-amber">
                {project.status === 'live'
                  ? t('work.eyebrowLive')
                  : t('work.eyebrowInternal')}
              </span>
            </p>
            <h3 className="font-display text-2xl md:text-4xl font-semibold text-forest dark:text-cream leading-[1.1] tracking-tight">
              {localized(project.title)}
            </h3>
            <p className="mt-4 text-base md:text-lg text-mute leading-relaxed text-justify hyphens-auto">
              {localized(project.summary)}
            </p>

            <div className="mt-6 flex flex-wrap gap-1.5">
              {project.tech.map((tech) => (
                <span
                  key={tech}
                  className="font-mono text-[10px] uppercase tracking-widest text-mute border border-rule px-2 py-1 rounded-sm transition-colors duration-200 hover:border-amber hover:text-amber"
                >
                  {tech}
                </span>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="group mt-8 relative overflow-hidden inline-flex items-center gap-2 bg-forest text-cream dark:bg-cream dark:text-forest px-5 py-3 text-sm font-semibold tracking-wide rounded-sm transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-xl"
            >
              <span
                aria-hidden
                className="absolute inset-0 bg-amber origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100"
              />
              <span className="relative z-10 group-hover:text-cream transition-colors duration-300">
                {t('work.detail')}
              </span>
              <ArrowUpRight
                size={16}
                className="relative z-10 group-hover:text-cream transition-[transform,color] duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </button>
          </div>
        </div>

        {/* Carousel controls */}
        <div className="mt-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={prev}
              aria-label={t('work.prev')}
              className="group p-3 border border-rule rounded-full text-mute hover:text-forest dark:hover:text-cream hover:border-amber transition-all duration-200"
            >
              <ArrowLeft
                size={16}
                className="transition-transform duration-300 ease-out group-hover:-translate-x-0.5"
              />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label={t('work.next')}
              className="group p-3 border border-rule rounded-full text-mute hover:text-forest dark:hover:text-cream hover:border-amber transition-all duration-200"
            >
              <ArrowRight
                size={16}
                className="transition-transform duration-300 ease-out group-hover:translate-x-0.5"
              />
            </button>
          </div>

          {/* Progress / indicator */}
          <div className="flex items-center gap-1">
            {featured.map((p, i) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Project ${i + 1}: ${localized(p.shortName)}`}
                className="group p-2"
              >
                <span
                  className={`block h-px transition-all duration-500 ease-out ${
                    i === active
                      ? 'w-12 bg-amber'
                      : 'w-6 bg-rule group-hover:bg-mute'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Keyframes for tabpanel entry */}
      <style jsx global>{`
        @keyframes work-enter {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes work-enter {
            from {
              opacity: 1;
              transform: none;
            }
            to {
              opacity: 1;
              transform: none;
            }
          }
        }
      `}</style>

      <CaseStudyModal
        project={project}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </section>
  );
}
