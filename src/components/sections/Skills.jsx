"use client";

import * as Si from 'react-icons/si';
import { useLocale } from '@/lib/hooks/useLocale';
import { skills } from '@/lib/data/skills';
import SectionTitle from '@/components/ui/SectionTitle';
import FadeIn from '@/components/ui/FadeIn';

function TechChip({ item, muted = false }) {
  const Icon = item.icon ? Si[item.icon] : null;
  return (
    <li
      className={`group flex items-center gap-2 px-3 py-2 border border-rule rounded-md transition-[border-color,color] duration-500 ease-out hover:border-amber ${
        muted ? 'opacity-80' : ''
      }`}
    >
      {Icon ? (
        <Icon
          size={16}
          className="text-mute group-hover:text-amber transition-colors duration-500 ease-out"
          aria-hidden
        />
      ) : (
        <span
          aria-hidden
          className="inline-block w-1.5 h-1.5 rounded-full bg-rule group-hover:bg-amber transition-colors duration-500 ease-out"
        />
      )}
      <span className="text-sm text-forest dark:text-cream transition-colors duration-500 ease-out group-hover:text-amber">
        {item.name}
      </span>
    </li>
  );
}

function Group({ label, items, muted = false }) {
  return (
    <div className="grid md:grid-cols-12 gap-3 md:gap-8 py-7 md:py-8">
      <p className="md:col-span-3 font-mono text-[10px] md:text-xs uppercase tracking-widest text-amber pt-2">
        {label}
      </p>
      <ul className="md:col-span-9 flex flex-wrap gap-2">
        {items.map((item) => (
          <TechChip key={item.name} item={item} muted={muted} />
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
      <FadeIn className="max-w-6xl mx-auto">
        <SectionTitle>{t('skills.title')}</SectionTitle>

        <div className="divide-y divide-rule border-t border-b border-rule">
          <Group label={t('skills.stack')} items={skills.stack} />
          <Group label={t('skills.learning')} items={skills.learning} muted />
        </div>
      </FadeIn>
    </section>
  );
}
