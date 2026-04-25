"use client";

import { useLocale } from '@/lib/hooks/useLocale';
import { experience } from '@/lib/data/experience';
import SectionTitle from '@/components/ui/SectionTitle';

export default function Experience() {
  const { locale, t } = useLocale();
  const localize = (val) => (typeof val === 'string' ? val : val?.[locale]);

  return (
    <section
      id="experience"
      className="py-16 md:py-20 px-6 border-t border-rule bg-cream-deep/40 dark:bg-forest/30"
    >
      <div className="max-w-6xl mx-auto">
        <SectionTitle>{t('experience.title')}</SectionTitle>

        <ol className="divide-y divide-rule border-t border-b border-rule">
          {experience.map((e, i) => (
            <li key={i} className="group">
              <div className="grid md:grid-cols-12 gap-4 md:gap-8 py-7 md:py-8 px-3 transition-colors duration-200 hover:bg-cream-deep/40 dark:hover:bg-forest/30">
                <span className="md:col-span-3 font-mono text-[10px] md:text-xs uppercase tracking-widest text-mute pt-1 tabular-nums">
                  {localize(e.period)}
                </span>
                <div className="md:col-span-9">
                  <h3 className="font-display text-xl md:text-2xl text-forest dark:text-cream leading-tight">
                    <span className="transition-colors duration-200 group-hover:text-amber">
                      {localize(e.role)}
                    </span>
                    <span className="text-mute"> · {localize(e.org)}</span>
                  </h3>
                  <ul className="mt-3 space-y-1.5 text-sm md:text-base text-forest/90 dark:text-cream/90 leading-relaxed">
                    {(e.bullets[locale] || []).map((b, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <span className="text-amber mt-1.5 leading-none select-none">›</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
