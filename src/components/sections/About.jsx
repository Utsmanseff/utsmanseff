"use client";

import { useLocale } from '@/lib/hooks/useLocale';
import SectionTitle from '@/components/ui/SectionTitle';
import FadeIn from '@/components/ui/FadeIn';

const FACT_KEYS = [
  ['location', 'locationValue'],
  ['education', 'educationValue'],
  ['certification', 'certificationValue'],
  ['yearsCoding', 'yearsCodingValue'],
  ['stack', 'stackValue'],
  ['learning', 'learningValue'],
  ['languages', 'languagesValue'],
];

export default function About() {
  const { t } = useLocale();
  const body = t('about.body');

  return (
    <section id="about" className="py-24 md:py-32 px-6 border-t border-rule">
      <div className="max-w-6xl mx-auto">
        <SectionTitle>{t('about.title')}</SectionTitle>

        <div className="grid md:grid-cols-12 gap-12">
          <FadeIn className="md:col-span-8">
            <div className="prose-spacing text-lg leading-relaxed text-forest dark:text-cream space-y-6">
              {Array.isArray(body) && body.map((p, i) => (
                <p key={i} className={i === 0 ? 'first-letter:font-display first-letter:text-amber first-letter:text-7xl first-letter:font-black first-letter:float-left first-letter:mr-3 first-letter:leading-none' : ''}>
                  {p}
                </p>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={150} className="md:col-span-4">
            <dl className="space-y-5 md:border-l md:border-rule md:pl-8">
              {FACT_KEYS.map(([labelKey, valueKey]) => (
                <div key={labelKey}>
                  <dt className="font-mono text-xs uppercase tracking-widest text-mute mb-1">
                    {t(`about.facts.${labelKey}`)}
                  </dt>
                  <dd className="text-forest dark:text-cream">
                    {t(`about.facts.${valueKey}`)}
                  </dd>
                </div>
              ))}
            </dl>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
