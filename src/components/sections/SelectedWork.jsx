"use client";

import { useLocale } from '@/lib/hooks/useLocale';
import { projects } from '@/lib/data/projects';
import SectionTitle from '@/components/ui/SectionTitle';
import Rule from '@/components/ui/Rule';
import CaseStudy from './CaseStudy';

export default function SelectedWork() {
  const { t } = useLocale();
  return (
    <section
      id="work"
      className="py-24 md:py-32 px-6 border-t border-rule bg-cream-deep/40 dark:bg-forest/30"
    >
      <div className="max-w-6xl mx-auto">
        <SectionTitle>{t('work.title')}</SectionTitle>
        {projects.featured.map((p, i) => (
          <div key={p.id}>
            <CaseStudy project={p} />
            {i < projects.featured.length - 1 && <Rule />}
          </div>
        ))}
      </div>
    </section>
  );
}
