"use client";

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { useLocale } from '@/lib/hooks/useLocale';
import { projects } from '@/lib/data/projects';
import SectionTitle from '@/components/ui/SectionTitle';
import FadeIn from '@/components/ui/FadeIn';
import CaseStudyModal from './CaseStudyModal';

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';
const SWIPE_THRESHOLD = 60; // px

export default function SelectedWork() {
  const { locale, t } = useLocale();
  const featured = projects.featured;
  const [active, setActive] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef(null);
  const startXRef = useRef(0);
  const widthRef = useRef(0);

  const localized = (field) =>
    typeof field === 'string' ? field : field?.[locale];

  const total = featured.length;
  const project = featured[active];

  const goto = (i) => {
    const next = ((i % total) + total) % total;
    setActive(next);
  };
  const prev = () => goto(active - 1);
  const next = () => goto(active + 1);

  // Keyboard arrow nav (skip when modal open or focus inside form)
  useEffect(() => {
    if (modalOpen) return;
    const onKey = (e) => {
      const tag = e.target?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;
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

  // Pointer / touch swipe
  const onPointerDown = (e) => {
    // Don't hijack drag from interactive children (buttons/links)
    if (e.target.closest('button, a')) return;
    widthRef.current = trackRef.current?.offsetWidth || 1;
    startXRef.current = e.clientX;
    setIsDragging(true);
    trackRef.current?.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!isDragging) return;
    setDragOffset(e.clientX - startXRef.current);
  };

  const finishDrag = () => {
    if (!isDragging) return;
    const delta = dragOffset;
    setIsDragging(false);
    setDragOffset(0);
    if (Math.abs(delta) > SWIPE_THRESHOLD) {
      delta < 0 ? next() : prev();
    }
  };

  const onPointerUp = (e) => {
    trackRef.current?.releasePointerCapture?.(e.pointerId);
    finishDrag();
  };

  // Compute translate: base position + drag offset (as % of width)
  const dragPercent = isDragging ? (dragOffset / widthRef.current) * 100 : 0;
  const translatePct = -active * 100 + dragPercent;

  return (
    <section
      id="work"
      className="py-16 md:py-20 border-t border-rule bg-cream-deep/40 dark:bg-forest/30"
    >
      <div className="max-w-6xl mx-auto px-6">
        <SectionTitle eyebrow={t('work.title')} id="work-title">
          {t('work.title')}
        </SectionTitle>
      </div>

      {/* Slider — full width container, card constrained inside */}
      <FadeIn delay={120} y={24}>
      <div
        ref={trackRef}
        className="overflow-hidden touch-pan-y select-none"
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <div
          className="flex"
          style={{
            transform: `translateX(${translatePct}%)`,
            transition: isDragging
              ? 'none'
              : `transform 700ms ${EASE}`,
          }}
        >
          {featured.map((p, i) => (
            <div key={p.id} className="w-full shrink-0">
              <Card
                project={p}
                isActive={i === active}
                t={t}
                localized={localized}
                onOpen={() => setModalOpen(true)}
              />
            </div>
          ))}
        </div>
      </div>
      </FadeIn>

      {/* Controls */}
      <FadeIn delay={200} className="max-w-6xl mx-auto px-6 mt-12 flex items-center justify-between gap-6">
        <div className="flex items-center gap-2">
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

        {/* Indicators */}
        <div className="flex items-center gap-1.5" role="tablist">
          {featured.map((p, i) => (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`Project ${i + 1}: ${localized(p.shortName)}`}
              onClick={() => setActive(i)}
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

        {/* Counter */}
        <div className="font-mono text-xs uppercase tracking-widest text-mute tabular-nums">
          <span className="text-forest dark:text-cream">
            {String(active + 1).padStart(2, '0')}
          </span>
          <span className="mx-1.5 text-rule">/</span>
          <span>{String(total).padStart(2, '0')}</span>
        </div>
      </FadeIn>

      <CaseStudyModal
        project={project}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </section>
  );
}

// ----------------- Card subcomponent -----------------
function Card({ project, isActive, t, localized, onOpen }) {
  return (
    <article
      className="max-w-6xl mx-auto px-6 grid md:grid-cols-12 gap-8 md:gap-12 items-center"
      style={{
        opacity: isActive ? 1 : 0.35,
        transition: `opacity 500ms ${EASE}`,
      }}
      aria-hidden={!isActive}
    >
      {/* Image */}
      <div className="md:col-span-7">
        <button
          type="button"
          onClick={onOpen}
          aria-label={`${t('work.detail')}: ${localized(project.title)}`}
          tabIndex={isActive ? 0 : -1}
          className="group block w-full text-left rounded-md overflow-hidden border border-rule bg-cream-deep dark:bg-forest relative aspect-[16/10]"
        >
          <Image
            src={project.image}
            alt={localized(project.title)}
            fill
            sizes="(min-width: 768px) 60vw, 100vw"
            className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
            draggable={false}
          />
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
      <div className="md:col-span-5">
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
              className="font-mono text-[10px] uppercase tracking-widest text-mute border border-rule px-2 py-1 rounded-sm transition-[color,border-color,transform] duration-300 hover:border-amber hover:text-amber hover:-translate-y-0.5"
              style={{ transitionTimingFunction: EASE }}
            >
              {tech}
            </span>
          ))}
        </div>

        <button
          type="button"
          onClick={onOpen}
          tabIndex={isActive ? 0 : -1}
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
    </article>
  );
}
