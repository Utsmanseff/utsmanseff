"use client";

import Image from 'next/image';
import { useLocale } from '@/lib/hooks/useLocale';
import { meta } from '@/lib/data/meta';
import FadeIn from '@/components/ui/FadeIn';

export default function Hero() {
  const { t } = useLocale();
  return (
    <section id="top" className="pt-24 md:pt-32 pb-16 md:pb-20 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-12 gap-10 md:gap-16 items-center">
        <FadeIn className="md:col-span-7 order-2 md:order-1">
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
              className="group relative overflow-hidden inline-flex items-center gap-2 bg-amber text-cream px-6 py-3 text-sm font-semibold tracking-wide rounded-sm"
            >
              <span
                aria-hidden
                className="absolute inset-0 bg-forest dark:bg-cream origin-left scale-x-0 transition-transform duration-700 ease-out group-hover:scale-x-100"
              />
              <span className="relative z-10 dark:group-hover:text-forest transition-colors duration-500">
                {t('hero.ctaWork')}
              </span>
              <span className="relative z-10 dark:group-hover:text-forest transition-colors duration-500">
                →
              </span>
            </a>

            <a
              href={meta.cvFile}
              download
              className="group relative overflow-hidden inline-flex items-center border border-forest dark:border-cream text-forest dark:text-cream px-6 py-3 text-sm font-semibold tracking-wide rounded-sm"
            >
              <span
                aria-hidden
                className="absolute inset-0 bg-forest dark:bg-cream origin-bottom scale-y-0 transition-transform duration-700 ease-out group-hover:scale-y-100"
              />
              <span className="relative z-10 group-hover:text-cream dark:group-hover:text-forest transition-colors duration-500">
                {t('hero.ctaCV')}
              </span>
            </a>

            <a
              href={`mailto:${meta.email}`}
              className="text-sm text-amber transition-colors duration-500 hover:text-forest dark:hover:text-cream"
            >
              {t('hero.ctaEmail')}
            </a>
          </div>
        </FadeIn>

        <FadeIn delay={120} className="md:col-span-5 order-1 md:order-2 flex justify-center md:justify-end">
          <div className="overflow-hidden rounded-lg w-56 md:w-full md:max-w-md">
            <Image
              src={meta.photo}
              alt="Utsman"
              width={520}
              height={650}
              priority
              sizes="(min-width: 768px) 40vw, 224px"
              className="w-full aspect-[4/5] object-cover"
            />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
