"use client";

import * as Si from 'react-icons/si';
import { useLocale } from '@/lib/hooks/useLocale';
import { skills } from '@/lib/data/skills';
import SectionTitle from '@/components/ui/SectionTitle';
import FadeIn from '@/components/ui/FadeIn';

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

function TechChip({ item, muted = false, delay = 0 }) {
  const Icon = item.icon ? Si[item.icon] : null;
  return (
    <FadeIn as="li" delay={delay} y={10} duration={500}
      className={`group flex items-center gap-2 px-3 py-2 border border-rule rounded-md transition-[transform,border-color,box-shadow,background-color] duration-300 hover:border-amber hover:-translate-y-0.5 hover:shadow-[0_6px_20px_-12px_rgba(201,123,63,0.55)] ${
        muted ? 'opacity-80' : ''
      }`}
      style={{ transitionTimingFunction: EASE }}
    >
      {Icon ? (
        <Icon
          size={16}
          className="text-mute group-hover:text-amber transition-colors duration-300"
          aria-hidden
        />
      ) : (
        <span
          aria-hidden
          className="inline-block w-1.5 h-1.5 rounded-full bg-rule group-hover:bg-amber transition-colors duration-300"
        />
      )}
      <span className="text-sm text-forest dark:text-cream transition-colors duration-300 group-hover:text-amber">{item.name}</span>
    </FadeIn>
  );
}

function Group({ label, items, muted = false }) {
  return (
    <div className="grid md:grid-cols-12 gap-3 md:gap-8 py-7 md:py-8">
      <FadeIn as="p" className="md:col-span-3 font-mono text-[10px] md:text-xs uppercase tracking-widest text-amber pt-2">
        {label}
      </FadeIn>
      <ul className="md:col-span-9 flex flex-wrap gap-2">
        {items.map((item, i) => (
          <TechChip key={item.name} item={item} muted={muted} delay={Math.min(i * 35, 420)} />
        ))}
      </ul>
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

        <div className="divide-y divide-rule border-t border-b border-rule">
          <Group label={t('skills.stack')} items={skills.stack} />
          <Group label={t('skills.learning')} items={skills.learning} muted />
        </div>
      </div>
    </section>
  );
}
