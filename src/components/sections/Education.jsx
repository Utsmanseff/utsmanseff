"use client";

import { GraduationCap, Award } from 'lucide-react';
import { useLocale } from '@/lib/hooks/useLocale';
import { education, certifications } from '@/lib/data/education';
import SectionTitle from '@/components/ui/SectionTitle';

function Card({ icon: Icon, label, items, render }) {
  return (
    <div className="group relative p-5 md:p-6 border border-rule rounded-md transition-all duration-300 hover:border-amber hover:-translate-y-0.5">
      <div className="flex items-center gap-2 mb-4">
        <Icon
          size={14}
          className="text-amber transition-transform duration-300 group-hover:scale-110"
        />
        <p className="font-mono text-[10px] uppercase tracking-widest text-amber">
          {label}
        </p>
      </div>
      <div className="space-y-4">
        {items.map((it, i) => (
          <div key={i}>{render(it)}</div>
        ))}
      </div>
    </div>
  );
}

export default function Education() {
  const { locale, t } = useLocale();
  const lz = (v) => (typeof v === 'string' ? v : v?.[locale]);

  return (
    <section
      id="education"
      className="py-16 md:py-20 px-6 border-t border-rule"
    >
      <div className="max-w-6xl mx-auto">
        <SectionTitle>{t('education.title')}</SectionTitle>

        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          <Card
            icon={GraduationCap}
            label={t('education.educationLabel')}
            items={education}
            render={(e) => (
              <>
                <h3 className="font-display text-lg md:text-xl text-forest dark:text-cream leading-tight">
                  {lz(e.degree)}
                </h3>
                <p className="text-xs md:text-sm text-mute mt-1">{e.school}</p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-mute mt-1.5">
                  {e.period}
                </p>
              </>
            )}
          />

          <Card
            icon={Award}
            label={t('education.certLabel')}
            items={certifications}
            render={(c) => (
              <>
                <h3 className="font-display text-lg md:text-xl text-forest dark:text-cream leading-tight">
                  {lz(c.name)}
                </h3>
                <p className="text-xs md:text-sm text-mute mt-1">{lz(c.issuer)}</p>
              </>
            )}
          />
        </div>
      </div>
    </section>
  );
}
