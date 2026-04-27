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
        <div className="md:col-span-7 order-2 md:order-1">
          <FadeIn>
            <p className="font-mono text-xs uppercase tracking-widest text-mute mb-6">
              {t('hero.eyebrow')}
            </p>
          </FadeIn>
          <FadeIn delay={80}>
            <h1 className="font-display font-black text-forest dark:text-cream leading-[0.95] tracking-tight text-[clamp(3.5rem,8vw,7rem)]">
              Utsman
            </h1>
          </FadeIn>
          <FadeIn delay={160}>
            <p className="font-body text-xl md:text-2xl text-mute mt-4">
              {t('hero.role')}
            </p>
          </FadeIn>
          <FadeIn delay={240}>
            <p className="font-display italic text-2xl md:text-3xl text-forest dark:text-cream mt-8 max-w-2xl leading-snug">
              {t('hero.tagline')}
            </p>
          </FadeIn>
          <FadeIn delay={320}>
            <p className="text-base md:text-lg text-mute mt-6 max-w-2xl leading-relaxed">
              {t('hero.bioTeaser')}
            </p>
          </FadeIn>
          <FadeIn delay={420} className="flex flex-wrap items-center gap-4 mt-10">
            {/* Primary CTA: amber base, forest sweep on hover from left */}
            <a
              href="#work"
              className="group relative overflow-hidden inline-flex items-center gap-2 bg-amber text-cream px-6 py-3 text-sm font-semibold tracking-wide rounded-sm shadow-sm transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-xl"
            >
              <span
                aria-hidden
                className="absolute inset-0 bg-forest dark:bg-cream origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100"
              />
              <span className="relative z-10 dark:group-hover:text-forest transition-colors duration-300">
                {t('hero.ctaWork')}
              </span>
              <span className="relative z-10 dark:group-hover:text-forest transition-[transform,color] duration-300 ease-out group-hover:translate-x-1">
                →
              </span>
            </a>

            {/* Secondary CTA: outlined, fills forest on hover */}
            <a
              href={meta.cvFile}
              download
              className="group relative overflow-hidden inline-flex items-center border border-forest dark:border-cream text-forest dark:text-cream px-6 py-3 text-sm font-semibold tracking-wide rounded-sm transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-lg"
            >
              <span
                aria-hidden
                className="absolute inset-0 bg-forest dark:bg-cream origin-bottom scale-y-0 transition-transform duration-400 ease-out group-hover:scale-y-100"
              />
              <span className="relative z-10 group-hover:text-cream dark:group-hover:text-forest transition-colors duration-300">
                {t('hero.ctaCV')}
              </span>
            </a>

            {/* Tertiary: animated underline */}
            <a
              href={`mailto:${meta.email}`}
              className="group relative text-sm text-amber transition-colors duration-200 hover:text-forest dark:hover:text-cream"
            >
              <span>{t('hero.ctaEmail')}</span>
              <span
                aria-hidden
                className="absolute left-0 -bottom-0.5 h-px w-full bg-current origin-left scale-x-100 transition-transform duration-300 ease-out group-hover:scale-x-0"
              />
              <span
                aria-hidden
                className="absolute left-0 -bottom-0.5 h-px w-full bg-current origin-right scale-x-0 transition-transform duration-300 delay-150 ease-out group-hover:scale-x-100 group-hover:delay-0"
              />
            </a>
          </FadeIn>
        </div>

        <FadeIn delay={120} y={24} className="md:col-span-5 order-1 md:order-2 flex justify-center md:justify-end">
          <div className="group overflow-hidden rounded-lg w-56 md:w-full md:max-w-md relative">
            <Image
              src={meta.photo}
              alt="Utsman"
              width={520}
              height={650}
              priority
              sizes="(min-width: 768px) 40vw, 224px"
              className="w-full aspect-[4/5] object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
              style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest-deep/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
