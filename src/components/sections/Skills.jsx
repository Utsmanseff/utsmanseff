"use client";

import { useLocale } from '@/lib/hooks/useLocale';
import { skills } from '@/lib/data/skills';
import SectionTitle from '@/components/ui/SectionTitle';

function Tier({ label, items, muted = false }) {
  return (
    <div className="grid md:grid-cols-12 gap-4 md:gap-8 py-6 md:py-7">
      <p className="md:col-span-3 font-mono text-[10px] md:text-xs uppercase tracking-widest text-amber pt-1">
        {label}
      </p>
      <p
        className={`md:col-span-9 text-base md:text-lg leading-relaxed flex flex-wrap items-baseline gap-x-2 gap-y-1 ${
          muted ? 'text-mute italic' : 'text-forest dark:text-cream'
        }`}
      >
        {items.map((item, i) => (
          <span key={item} className="inline-flex items-baseline">
            <span className="cursor-default transition-colors duration-200 hover:text-amber">
              {item}
            </span>
            {i < items.length - 1 && (
              <span className="text-rule mx-1.5 select-none">·</span>
            )}
          </span>
        ))}
      </p>
    </div>
  );
}

export default function Skills() {
  const { t } = useLocale();
  return (
    <section
      id="skills"
      className="py-16 md:py-20 px-6 border-t border-rule"
    >
      <div className="max-w-6xl mx-auto">
        <SectionTitle>{t('skills.title')}</SectionTitle>

        <div className="divide-y divide-rule border-t border-b border-rule mb-10 md:mb-12">
          <Tier label={t('skills.daily')} items={skills.daily} />
          <Tier label={t('skills.comfortable')} items={skills.comfortable} />
          <Tier label={t('skills.exploring')} items={skills.exploring} muted />
        </div>

        {/* Best-at callout */}
        <div className="grid md:grid-cols-12 gap-4 md:gap-8">
          <p className="md:col-span-3 font-mono text-[10px] md:text-xs uppercase tracking-widest text-amber pt-2">
            {t('skills.bestAt')}
          </p>
          <p className="md:col-span-9 font-display italic text-xl md:text-2xl lg:text-3xl text-forest dark:text-cream leading-snug">
            {t('skills.bestAtValue')}
          </p>
        </div>
      </div>
    </section>
  );
}
