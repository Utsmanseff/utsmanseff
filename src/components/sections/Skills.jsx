"use client";

import * as Si from 'react-icons/si';
import { useLocale } from '@/lib/hooks/useLocale';
import { skills } from '@/lib/data/skills';
import SectionTitle from '@/components/ui/SectionTitle';

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

function TechChip({ item, muted = false }) {
  const Icon = item.icon ? Si[item.icon] : null;
  return (
    <li
      className={`group flex items-center gap-2 px-3 py-2 border border-rule rounded-md transition-all duration-200 hover:border-amber hover:-translate-y-0.5 ${
        muted ? 'opacity-80' : ''
      }`}
      style={{ transitionTimingFunction: EASE }}
    >
      {Icon ? (
        <Icon
          size={16}
          className="text-mute group-hover:text-amber transition-colors duration-200"
          aria-hidden
        />
      ) : (
        <span
          aria-hidden
          className="inline-block w-1.5 h-1.5 rounded-full bg-rule group-hover:bg-amber transition-colors duration-200"
        />
      )}
      <span className="text-sm text-forest dark:text-cream">{item.name}</span>
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
