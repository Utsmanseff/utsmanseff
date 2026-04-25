"use client";

import Image from 'next/image';
import { useLocale } from '@/lib/hooks/useLocale';
import { meta } from '@/lib/data/meta';

export default function Hero() {
  const { t } = useLocale();
  return (
    <section id="top" className="pt-32 md:pt-40 pb-24 md:pb-32 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-12 gap-10 md:gap-16 items-center">
        <div className="md:col-span-7 order-2 md:order-1">
          <p className="font-mono text-xs uppercase tracking-widest text-mute mb-6">
            {t('hero.eyebrow')}
          </p>
          <h1 className="font-display font-black text-forest dark:text-cream leading-[0.95] tracking-tight text-[clamp(3.5rem,8vw,7rem)]">
            Utsman
          </h1>
          <p className="font-body text-xl md:text-2xl text-mute mt-4">
            {t('hero.role')}
          </p>
          <p className="font-display italic text-2xl md:text-3xl text-forest dark:text-cream mt-8 max-w-2xl leading-snug">
            {t('hero.tagline')}
          </p>
          <p className="text-base md:text-lg text-mute mt-6 max-w-2xl leading-relaxed">
            {t('hero.bioTeaser')}
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-10">
            <a
              href="#work"
              className="group inline-flex items-center gap-2 bg-amber text-cream px-5 py-3 text-sm font-semibold tracking-wide rounded-sm shadow-sm hover:shadow-lg hover:-translate-y-0.5 hover:bg-forest dark:hover:bg-cream dark:hover:text-forest transition-all duration-200 ease-out"
            >
              <span>{t('hero.ctaWork')}</span>
              <span className="transition-transform duration-200 ease-out group-hover:translate-x-1">→</span>
            </a>
            <a
              href={meta.cvFile}
              download
              className="border border-forest dark:border-cream text-forest dark:text-cream px-5 py-3 text-sm font-semibold tracking-wide rounded-sm hover:-translate-y-0.5 hover:shadow-md hover:bg-forest hover:text-cream dark:hover:bg-cream dark:hover:text-forest transition-all duration-200 ease-out"
            >
              {t('hero.ctaCV')}
            </a>
            <a
              href={`mailto:${meta.email}`}
              className="text-sm text-amber underline decoration-amber/40 underline-offset-4 hover:decoration-amber hover:text-forest dark:hover:text-cream transition-all duration-200 ease-out"
            >
              {t('hero.ctaEmail')}
            </a>
          </div>
        </div>

        <div className="md:col-span-5 order-1 md:order-2 flex justify-center md:justify-end">
          <Image
            src={meta.photo}
            alt="Utsman"
            width={520}
            height={650}
            priority
            sizes="(min-width: 768px) 40vw, 224px"
            className="rounded-lg w-56 md:w-full md:max-w-md aspect-[4/5] object-cover"
          />
        </div>
      </div>
    </section>
  );
}
