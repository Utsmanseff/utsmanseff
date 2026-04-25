"use client";

import Image from 'next/image';
import { useLocale } from '@/lib/hooks/useLocale';
import { meta } from '@/lib/data/meta';

export default function Hero() {
  const { t } = useLocale();
  return (
    <section id="top" className="pt-32 md:pt-40 pb-24 md:pb-32 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-12 gap-12 md:gap-16 items-center">
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
              className="bg-amber text-cream px-5 py-3 text-sm font-semibold tracking-wide hover:bg-forest dark:hover:bg-cream dark:hover:text-forest transition-colors"
            >
              {t('hero.ctaWork')}
            </a>
            <a
              href={meta.cvFile}
              download
              className="border border-forest dark:border-cream text-forest dark:text-cream px-5 py-3 text-sm font-semibold tracking-wide hover:bg-forest hover:text-cream dark:hover:bg-cream dark:hover:text-forest transition-colors"
            >
              {t('hero.ctaCV')}
            </a>
            <a
              href={`mailto:${meta.email}`}
              className="text-sm text-amber underline underline-offset-4 hover:text-forest dark:hover:text-cream transition-colors"
            >
              {t('hero.ctaEmail')}
            </a>
          </div>
        </div>

        <div className="md:col-span-5 order-1 md:order-2">
          <div className="relative inline-block">
            <Image
              src={meta.photo}
              alt="Utsman"
              width={520}
              height={650}
              priority
              sizes="(min-width: 768px) 40vw, 80vw"
              className="rounded-lg w-full max-w-md aspect-[4/5] object-cover relative z-10"
            />
            <div
              aria-hidden
              className="absolute inset-0 translate-x-3 translate-y-3 bg-amber rounded-lg z-0"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
