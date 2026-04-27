"use client";

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLocale } from '@/lib/hooks/useLocale';
import { experience } from '@/lib/data/experience';
import SectionTitle from '@/components/ui/SectionTitle';
import FadeIn from '@/components/ui/FadeIn';

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

export default function Experience() {
  const { locale, t } = useLocale();
  const [openIdx, setOpenIdx] = useState(0); // first open by default
  const localize = (val) => (typeof val === 'string' ? val : val?.[locale]);

  return (
    <section
      id="experience"
      className="py-16 md:py-20 px-6 border-t border-rule"
    >
      <FadeIn className="max-w-6xl mx-auto">
        <SectionTitle>{t('experience.title')}</SectionTitle>

        <ol className="divide-y divide-rule border-t border-b border-rule">
          {experience.map((e, i) => {
            const open = openIdx === i;
            return (
              <li key={i} className="group">
                <button
                  type="button"
                  onClick={() => setOpenIdx(open ? -1 : i)}
                  aria-expanded={open}
                  aria-controls={`exp-panel-${i}`}
                  className="relative w-full text-left grid grid-cols-12 gap-3 md:gap-8 items-start py-5 md:py-6 px-3 transition-colors duration-200 hover:bg-cream-deep/50 dark:hover:bg-forest/30"
                >
                  {/* Active accent */}
                  <span
                    aria-hidden
                    className="absolute left-0 top-0 h-full w-px bg-amber transition-transform duration-300 origin-top"
                    style={{
                      transform: open ? 'scaleY(1)' : 'scaleY(0)',
                      transitionTimingFunction: EASE,
                    }}
                  />
                  <span
                    aria-hidden
                    className="absolute left-0 top-0 h-full w-px bg-amber/40 origin-top scale-y-0 transition-transform duration-300 group-hover:scale-y-100"
                    style={{ transitionTimingFunction: EASE }}
                  />

                  <span className="col-span-12 md:col-span-3 font-mono text-[10px] md:text-xs uppercase tracking-widest text-mute tabular-nums pt-1">
                    {localize(e.period)}
                  </span>
                  <span className="col-span-10 md:col-span-8">
                    <span className="block font-display text-base md:text-xl text-forest dark:text-cream leading-tight transition-colors duration-200 group-hover:text-amber">
                      {localize(e.role)}
                    </span>
                    <span className="block text-xs md:text-sm text-mute mt-1">
                      {localize(e.org)}
                    </span>
                  </span>
                  <span className="col-span-2 md:col-span-1 flex justify-end pt-1">
                    <ChevronDown
                      size={18}
                      className="text-mute group-hover:text-amber transition-all duration-300"
                      style={{
                        transform: open ? 'rotate(180deg)' : 'rotate(0)',
                        transitionTimingFunction: EASE,
                      }}
                    />
                  </span>
                </button>

                {/* Smooth expand */}
                <div
                  id={`exp-panel-${i}`}
                  role="region"
                  className="grid transition-all duration-500"
                  style={{
                    gridTemplateRows: open ? '1fr' : '0fr',
                    opacity: open ? 1 : 0,
                    transitionTimingFunction: EASE,
                  }}
                >
                  <div className="overflow-hidden">
                    <div className="px-3 pb-6 pt-1 grid grid-cols-12 gap-3 md:gap-8">
                      <div className="col-span-12 md:col-start-4 md:col-span-9">
                        <ul className="space-y-1.5 text-sm md:text-base text-forest/90 dark:text-cream/90 leading-relaxed">
                          {(e.bullets[locale] || []).map((b, j) => (
                            <li key={j} className="flex items-start gap-2">
                              <span className="text-amber mt-1.5 leading-none select-none">›</span>
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </FadeIn>
    </section>
  );
}
