"use client";

import Image from 'next/image';
import { useLocale } from '@/lib/hooks/useLocale';
import FadeIn from '@/components/ui/FadeIn';

export default function CaseStudy({ project }) {
  const { locale, t } = useLocale();
  const localized = (field) => (typeof field === 'string' ? field : field?.[locale]);

  const statusLabel = project.status === 'live'
    ? t('work.eyebrowLive')
    : t('work.eyebrowInternal');

  return (
    <article className="py-16 md:py-24">
      <FadeIn>
        <p className="font-mono text-xs uppercase tracking-widest text-mute mb-3">
          {project.client} · {project.year} · {statusLabel} · {localized(project.sector)}
        </p>
        <h3 className="font-display text-3xl md:text-4xl font-semibold text-forest dark:text-cream leading-tight max-w-3xl">
          {localized(project.title)}
        </h3>
        <p className="text-lg md:text-xl text-mute mt-4 max-w-3xl leading-relaxed">
          {localized(project.summary)}
        </p>
      </FadeIn>

      <FadeIn delay={100} className="mt-10">
        <div className="relative aspect-[16/9] bg-cream-deep dark:bg-forest rounded-sm overflow-hidden border border-rule group">
          <Image
            src={project.image}
            alt={localized(project.title)}
            fill
            sizes="(min-width: 768px) 80vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        </div>
      </FadeIn>

      <div className="mt-12 grid md:grid-cols-12 gap-8">
        <FadeIn delay={150} className="md:col-span-4">
          <h4 className="font-mono text-xs uppercase tracking-widest text-amber mb-3">
            {t('work.problem')}
          </h4>
          <p className="text-forest dark:text-cream leading-relaxed text-justify hyphens-auto">
            {localized(project.problem)}
          </p>
        </FadeIn>

        <FadeIn delay={200} className="md:col-span-4">
          <h4 className="font-mono text-xs uppercase tracking-widest text-amber mb-3">
            {t('work.approach')}
          </h4>
          <p className="text-forest dark:text-cream leading-relaxed mb-4 text-justify hyphens-auto">
            {localized(project.approach)}
          </p>
          {project.approach?.bullets && (
            <ul className="space-y-2">
              {(project.approach.bullets[locale] || []).map((b, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-mute">
                  <span className="text-amber mt-1">›</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          )}
        </FadeIn>

        <FadeIn delay={250} className="md:col-span-4">
          <h4 className="font-mono text-xs uppercase tracking-widest text-amber mb-3">
            {t('work.outcome')}
          </h4>
          <p className="text-forest dark:text-cream leading-relaxed text-justify hyphens-auto">
            {localized(project.outcome)}
          </p>
        </FadeIn>
      </div>

      <FadeIn delay={300} className="mt-10 md:max-w-3xl">
        <h4 className="font-mono text-xs uppercase tracking-widest text-amber mb-3">
          {t('work.hard')}
        </h4>
        <p className="text-forest dark:text-cream leading-relaxed italic font-display text-lg md:text-xl">
          {localized(project.hard)}
        </p>
      </FadeIn>

      <FadeIn delay={350} className="mt-10 flex flex-wrap items-center gap-3">
        {project.tech.map((tech) => (
          <span
            key={tech}
            className="font-mono text-xs uppercase tracking-wide text-mute border border-rule px-2 py-1 rounded-sm transition-colors duration-200 hover:border-amber hover:text-amber"
          >
            {tech}
          </span>
        ))}
        {project.site && (
          <a
            href={project.site}
            target="_blank"
            rel="noopener noreferrer"
            className="group ml-auto inline-flex items-center gap-1 text-sm text-amber underline decoration-amber/40 underline-offset-4 hover:decoration-amber transition-all duration-200 hover:text-forest dark:hover:text-cream"
          >
            <span>{t('work.visit')}</span>
            <span className="transition-transform duration-200 ease-out group-hover:translate-x-1 group-hover:-translate-y-0.5">↗</span>
          </a>
        )}
      </FadeIn>
    </article>
  );
}
