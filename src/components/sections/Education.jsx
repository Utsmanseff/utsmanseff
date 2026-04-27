"use client";

import { GraduationCap, Award } from 'lucide-react';
import { useLocale } from '@/lib/hooks/useLocale';
import { education, certifications } from '@/lib/data/education';
import SectionTitle from '@/components/ui/SectionTitle';
import FadeIn from '@/components/ui/FadeIn';

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

function Card({ icon: Icon, label, items, render, delay = 0 }) {
  return (
    <FadeIn delay={delay} y={20} duration={700}
      className="group relative p-5 md:p-6 border border-rule rounded-md overflow-hidden transition-[transform,border-color,box-shadow] duration-500 hover:border-amber hover:-translate-y-1 hover:shadow-[0_18px_40px_-22px_rgba(201,123,63,0.45)]"
      style={{ transitionTimingFunction: EASE }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber/0 via-amber/0 to-amber/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 h-full w-px bg-amber origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-500"
        style={{ transitionTimingFunction: EASE }}
      />
      <div className="relative flex items-center gap-2 mb-4">
        <Icon
          size={14}
          className="text-amber transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[-4deg]"
          style={{ transitionTimingFunction: EASE }}
        />
        <p className="font-mono text-[10px] uppercase tracking-widest text-amber">
          {label}
        </p>
      </div>
      <div className="relative space-y-4">
        {items.map((it, i) => (
          <div key={i}>{render(it)}</div>
        ))}
      </div>
    </FadeIn>
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
            delay={0}
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
            delay={120}
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
